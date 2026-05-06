package dev.bytecode.api.solution

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "solution_votes")
class SolutionVoteEntity(
    @Id val id: UUID = UUID.randomUUID(),

    @Column(name = "submission_id", nullable = false)
    val submissionId: UUID,

    @Column(name = "voter_id", nullable = false)
    val voterId: UUID,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),
)
