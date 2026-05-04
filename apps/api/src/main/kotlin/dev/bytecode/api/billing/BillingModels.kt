package dev.bytecode.api.billing

import java.time.Instant
import java.util.UUID

data class BillingStatusResponse(
    val userId: UUID,
    val plan: String,
    val role: String,
    val premiumUntil: Instant?,
    val subscription: SubscriptionSnapshot?,
)

data class SubscriptionSnapshot(
    val stripeCustomerId: String?,
    val stripeSubscriptionId: String?,
    val stripePriceId: String?,
    val status: String?,
    val currentPeriodEnd: Instant?,
    val graceExpiresAt: Instant?,
    val lastPaymentFailedAt: Instant?,
    val canceledAt: Instant?,
    val plan: String?,
)

data class InternalSubscriptionSyncRequest(
    val userId: UUID?,
    val stripeCustomerId: String?,
    val stripeSubscriptionId: String?,
    val stripePriceId: String?,
    val status: String?,
    val plan: String?,
    val currentPeriodEnd: Instant?,
    val graceExpiresAt: Instant?,
    val lastPaymentFailedAt: Instant?,
    val canceledAt: Instant?,
    val premiumUntil: Instant?,
    val role: String?,
    val eventCreatedAt: Instant?,
)

data class InternalSyncResponse(
    val ok: Boolean,
    val userId: UUID,
    val appliedAt: Instant,
)

data class InternalResolveResponse(
    val ok: Boolean,
    val userId: UUID?,
)

data class ExpiredGraceRecord(
    val userId: UUID,
    val stripeCustomerId: String?,
    val stripeSubscriptionId: String?,
    val graceExpiresAt: Instant?,
)
