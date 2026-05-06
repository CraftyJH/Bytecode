package dev.bytecode.api.discussion

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "discussion_posts")
class DiscussionPostEntity(
    @Id val id: UUID = UUID.randomUUID(),

    @Column(name = "challenge_id", nullable = false)
    val challengeId: String,

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(nullable = false, columnDefinition = "text")
    var body: String,

    @Column(nullable = false)
    var upvotes: Int = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),

    @Column(name = "deleted_at")
    var deletedAt: Instant? = null,
)
