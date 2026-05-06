package dev.bytecode.api.social

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "duels")
class DuelEntity(
    @Id val id: UUID = UUID.randomUUID(),

    @Column(name = "challenge_id", nullable = false)
    val challengeId: String,

    @Column(name = "challenger_id", nullable = false)
    val challengerId: UUID,

    @Column(name = "opponent_id", nullable = false)
    val opponentId: UUID,

    @Column(name = "challenger_submission_id")
    var challengerSubmissionId: UUID? = null,

    @Column(name = "opponent_submission_id")
    var opponentSubmissionId: UUID? = null,

    /** pending | active | completed | declined */
    @Column(nullable = false)
    var status: String = "pending",

    @Column(name = "winner_id")
    var winnerId: UUID? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "completed_at")
    var completedAt: Instant? = null,
)
