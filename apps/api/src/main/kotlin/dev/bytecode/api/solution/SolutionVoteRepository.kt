package dev.bytecode.api.solution

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SolutionVoteRepository : JpaRepository<SolutionVoteEntity, UUID> {
    fun findBySubmissionIdAndVoterId(submissionId: UUID, voterId: UUID): SolutionVoteEntity?
    fun countBySubmissionId(submissionId: UUID): Long
    fun existsBySubmissionIdAndVoterId(submissionId: UUID, voterId: UUID): Boolean
    fun deleteBySubmissionIdAndVoterId(submissionId: UUID, voterId: UUID)
}
