package dev.bytecode.api.social

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "friend_edges")
class FriendEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "requester_id", nullable = false)
    val requesterId: UUID,

    @Column(name = "addressee_id", nullable = false)
    val addresseeId: UUID,

    @Column(nullable = false)
    var status: String = "pending",

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),
)
