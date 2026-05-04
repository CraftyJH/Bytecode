package dev.bytecode.api.billing

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface SubscriptionRepository : JpaRepository<SubscriptionEntity, UUID> {
    fun findByStripeSubscriptionId(stripeSubscriptionId: String): SubscriptionEntity?
    fun findByStripeCustomerId(stripeCustomerId: String): SubscriptionEntity?

    @Query(
        """
        SELECT s
        FROM SubscriptionEntity s
        WHERE s.status = 'past_due'
          AND s.graceExpiresAt IS NOT NULL
          AND s.graceExpiresAt <= :now
          AND s.canceledAt IS NULL
        ORDER BY s.graceExpiresAt ASC
        """
    )
    fun findExpiredGraceSubscriptions(
        @Param("now") now: Instant,
    ): List<SubscriptionEntity>
}
