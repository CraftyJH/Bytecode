package dev.bytecode.api.user

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users")
class UserEntity(

    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(unique = true, nullable = false)
    val email: String,

    var name: String? = null,

    @Column(name = "avatar_url")
    var avatarUrl: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "premium_until")
    var premiumUntil: Instant? = null,

    @Column(name = "streak_count")
    var streakCount: Int = 0,

    @Column(name = "last_active_at")
    var lastActiveAt: Instant? = null,

    @Column(name = "is_founding_member")
    var isFoundingMember: Boolean = false,

    @Column(name = "founding_locked_until")
    var foundingLockedUntil: Instant? = null,

    @Column(name = "xp_total")
    var xpTotal: Int = 0,

    @Enumerated(EnumType.STRING)
    var role: UserRole = UserRole.USER,
)

enum class UserRole { USER, PREMIUM, AUTHOR, STAFF }
