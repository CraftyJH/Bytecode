package dev.bytecode.api.billing

import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRepository
import dev.bytecode.api.user.UserRole
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class BillingService(
    private val userRepository: UserRepository,
    private val subscriptionRepository: SubscriptionRepository,
) {

    @Transactional(readOnly = true)
    fun getBillingStatus(userId: UUID): BillingStatusResponse? {
        val user = userRepository.findById(userId).orElse(null) ?: return null
        val subscription = subscriptionRepository.findById(userId).orElse(null)
        return BillingStatusResponse(
            userId = user.id,
            plan = if (isPremiumUser(user, subscription)) "premium" else "free",
            role = user.role.name.lowercase(),
            premiumUntil = user.premiumUntil,
            subscription = subscription?.toSnapshot(),
        )
    }

    @Transactional(readOnly = true)
    fun resolveUserIdByStripe(
        stripeCustomerId: String?,
        stripeSubscriptionId: String?,
    ): UUID? {
        if (!stripeSubscriptionId.isNullOrBlank()) {
            val bySubscription = subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId)
            if (bySubscription != null) return bySubscription.user.id
        }

        if (!stripeCustomerId.isNullOrBlank()) {
            val byCustomer = subscriptionRepository.findByStripeCustomerId(stripeCustomerId)
            if (byCustomer != null) return byCustomer.user.id
        }

        return null
    }

    @Transactional(readOnly = true)
    fun getExpiredGraceSubscriptions(now: Instant): List<ExpiredGraceRecord> {
        return subscriptionRepository.findExpiredGraceSubscriptions(now).map { subscription ->
            ExpiredGraceRecord(
                userId = subscription.user.id,
                stripeCustomerId = subscription.stripeCustomerId,
                stripeSubscriptionId = subscription.stripeSubscriptionId,
                graceExpiresAt = subscription.graceExpiresAt,
            )
        }
    }

    @Transactional
    fun applyInternalSync(request: InternalSubscriptionSyncRequest): InternalSyncResponse {
        val user = resolveUser(request)
        val subscription = resolveSubscription(request, user)

        val incomingEventAt = request.eventCreatedAt ?: Instant.now()
        val existingEventAt = subscription.lastEventAt
        if (existingEventAt != null && incomingEventAt.isBefore(existingEventAt)) {
            return InternalSyncResponse(
                ok = true,
                userId = user.id,
                appliedAt = existingEventAt,
            )
        }

        subscription.stripeCustomerId = request.stripeCustomerId ?: subscription.stripeCustomerId
        subscription.stripeSubscriptionId = request.stripeSubscriptionId ?: subscription.stripeSubscriptionId
        subscription.stripePriceId = request.stripePriceId ?: subscription.stripePriceId
        subscription.status = request.status ?: subscription.status
        subscription.plan = request.plan ?: subscription.plan
        subscription.currentPeriodEnd = request.currentPeriodEnd ?: subscription.currentPeriodEnd
        subscription.graceExpiresAt = request.graceExpiresAt
        subscription.lastPaymentFailedAt = request.lastPaymentFailedAt
        subscription.canceledAt = request.canceledAt
        subscription.lastEventAt = incomingEventAt

        subscriptionRepository.save(subscription)

        val resolvedPremiumUntil = resolvePremiumUntil(request, subscription)
        user.premiumUntil = resolvedPremiumUntil
        user.role = resolveUserRole(user.role, request.role, resolvedPremiumUntil)
        userRepository.save(user)

        return InternalSyncResponse(
            ok = true,
            userId = user.id,
            appliedAt = incomingEventAt,
        )
    }

    private fun resolveUser(request: InternalSubscriptionSyncRequest): UserEntity {
        request.userId?.let { userId ->
            return userRepository.findById(userId).orElseThrow {
                IllegalArgumentException("Unknown userId: $userId")
            }
        }

        request.stripeSubscriptionId
            ?.let { subscriptionRepository.findByStripeSubscriptionId(it) }
            ?.let { return it.user }

        request.stripeCustomerId
            ?.let { subscriptionRepository.findByStripeCustomerId(it) }
            ?.let { return it.user }

        error("userId is required when no existing subscription can be resolved")
    }

    private fun resolveSubscription(
        request: InternalSubscriptionSyncRequest,
        user: UserEntity,
    ): SubscriptionEntity {
        val byUser = subscriptionRepository.findById(user.id).orElse(null)
        if (byUser != null) return byUser

        request.stripeSubscriptionId
            ?.let { subscriptionRepository.findByStripeSubscriptionId(it) }
            ?.let { return it }

        request.stripeCustomerId
            ?.let { subscriptionRepository.findByStripeCustomerId(it) }
            ?.let { return it }

        return SubscriptionEntity(user = user)
    }

    private fun resolvePremiumUntil(
        request: InternalSubscriptionSyncRequest,
        subscription: SubscriptionEntity,
    ): Instant? {
        if (request.premiumUntil != null) return request.premiumUntil
        val status = (request.status ?: subscription.status).orEmpty()
        val periodEnd = request.currentPeriodEnd ?: subscription.currentPeriodEnd
        return if (status in ACTIVE_STATUSES) periodEnd else null
    }

    private fun resolveUserRole(
        currentRole: UserRole,
        requestedRole: String?,
        premiumUntil: Instant?,
    ): UserRole {
        requestedRole
            ?.uppercase()
            ?.let { safe ->
                return runCatching { UserRole.valueOf(safe) }.getOrDefault(currentRole)
            }

        if (currentRole == UserRole.AUTHOR || currentRole == UserRole.STAFF) {
            return currentRole
        }

        return if (premiumUntil != null && premiumUntil.isAfter(Instant.now())) {
            UserRole.PREMIUM
        } else {
            UserRole.USER
        }
    }

    private fun isPremiumUser(user: UserEntity, subscription: SubscriptionEntity?): Boolean {
        if (user.role == UserRole.AUTHOR || user.role == UserRole.STAFF) return true
        val premiumUntil = user.premiumUntil
        if (premiumUntil != null && premiumUntil.isAfter(Instant.now())) return true
        return subscription?.status in ACTIVE_STATUSES
    }

    private fun SubscriptionEntity.toSnapshot() = SubscriptionSnapshot(
        stripeCustomerId = stripeCustomerId,
        stripeSubscriptionId = stripeSubscriptionId,
        stripePriceId = stripePriceId,
        status = status,
        currentPeriodEnd = currentPeriodEnd,
        graceExpiresAt = graceExpiresAt,
        lastPaymentFailedAt = lastPaymentFailedAt,
        canceledAt = canceledAt,
        plan = plan,
    )

    companion object {
        private val ACTIVE_STATUSES = setOf("active", "trialing", "past_due")
    }
}
