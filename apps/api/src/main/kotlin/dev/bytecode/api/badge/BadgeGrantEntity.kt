package dev.bytecode.api.badge

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "badge_grants")
class BadgeGrantEntity(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(name = "user_id") val userId: UUID,
    @Column(name = "badge_id") val badgeId: String,
    @Column(name = "awarded_at") val awardedAt: Instant = Instant.now(),
)
