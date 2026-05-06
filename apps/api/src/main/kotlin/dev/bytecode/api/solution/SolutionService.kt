package dev.bytecode.api.solution

import dev.bytecode.api.submission.SubmissionJpaRepository
import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class SolutionService(
    private val submissionRepo: SubmissionJpaRepository,
    private val voteRepo: SolutionVoteRepository,
    private val userRepo: UserRepository,
) {

    fun listShared(challengeId: String, viewer: UserEntity): SolutionResult<List<SharedSolutionDto>> {
        if (!hasSolved(viewer.id, challengeId)) return SolutionResult.Locked
        val submissions = submissionRepo.findSharedCorrect(challengeId)
        val authorIds = submissions.map { it.userId }.distinct()
        val names = userRepo.findAllById(authorIds).associate { it.id to (it.name ?: "Anonymous") }
        val myVotes = voteRepo.findAll()
            .filter { it.voterId == viewer.id }
            .map { it.submissionId }
            .toSet()
        return SolutionResult.Ok(
            submissions.map { sub ->
                val voteCount = voteRepo.countBySubmissionId(sub.id)
                SharedSolutionDto(
                    submissionId = sub.id.toString(),
                    authorName = names[sub.userId] ?: "Anonymous",
                    sourceCode = sub.sourceCode,
                    language = sub.language,
                    runtimeMs = sub.runtimeMs,
                    upvotes = voteCount.toInt(),
                    hasUpvoted = sub.id in myVotes,
                    submittedAt = sub.createdAt.toString(),
                )
            }.sortedByDescending { it.upvotes }
        )
    }

    @Transactional
    fun upvote(submissionId: UUID, voter: UserEntity): SolutionResult<Unit> {
        val submission = submissionRepo.findById(submissionId).orElse(null) ?: return SolutionResult.NotFound
        if (!submission.shared || !submission.isCorrect) return SolutionResult.NotFound
        if (submission.userId == voter.id) return SolutionResult.Forbidden
        if (!hasSolved(voter.id, submission.challengeId)) return SolutionResult.Locked
        if (voteRepo.existsBySubmissionIdAndVoterId(submissionId, voter.id)) return SolutionResult.Ok(Unit)
        voteRepo.save(SolutionVoteEntity(submissionId = submissionId, voterId = voter.id))
        return SolutionResult.Ok(Unit)
    }

    @Transactional
    fun removeUpvote(submissionId: UUID, voter: UserEntity): SolutionResult<Unit> {
        voteRepo.deleteBySubmissionIdAndVoterId(submissionId, voter.id)
        return SolutionResult.Ok(Unit)
    }

    private fun hasSolved(userId: UUID, challengeId: String) =
        submissionRepo.existsByUserIdAndChallengeIdAndIsCorrectTrue(userId, challengeId)
}

sealed class SolutionResult<out T> {
    data class Ok<T>(val value: T) : SolutionResult<T>()
    data object Locked : SolutionResult<Nothing>()
    data object NotFound : SolutionResult<Nothing>()
    data object Forbidden : SolutionResult<Nothing>()
}

data class SharedSolutionDto(
    val submissionId: String,
    val authorName: String,
    val sourceCode: String,
    val language: String,
    val runtimeMs: Int?,
    val upvotes: Int,
    val hasUpvoted: Boolean,
    val submittedAt: String,
)
