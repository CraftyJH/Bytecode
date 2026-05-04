package dev.bytecode.api.billing

import dev.bytecode.api.user.UserEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "subscriptions")
class SubscriptionEntity(
    @Id
    @Column(name = "user_id")
    var userId: UUID? = null,

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column(name = "stripe_customer_id", unique = true)
    var stripeCustomerId: String? = null,

    @Column(name = "stripe_subscription_id", unique = true)
    var stripeSubscriptionId: String? = null,

    @Column(name = "stripe_price_id")
    var stripePriceId: String? = null,

    @Column(name = "status")
    var status: String? = null,

    @Column(name = "current_period_end")
    var currentPeriodEnd: Instant? = null,

    @Column(name = "plan")
    var plan: String? = null,

    @Column(name = "grace_expires_at")
    var graceExpiresAt: Instant? = null,

    @Column(name = "last_payment_failed_at")
    var lastPaymentFailedAt: Instant? = null,

    @Column(name = "canceled_at")
    var canceledAt: Instant? = null,

    @Column(name = "last_event_at")
    var lastEventAt: Instant? = null,
)
