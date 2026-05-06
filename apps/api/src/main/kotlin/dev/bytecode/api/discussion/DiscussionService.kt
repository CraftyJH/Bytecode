package dev.bytecode.api.discussion

import dev.bytecode.api.submission.SubmissionJpaRepository
import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class DiscussionService(
    private val discussionRepo: DiscussionRepository,
    private val submissionRepo: SubmissionJpaRepository,
    private val userRepo: UserRepository,
) {

    fun listPosts(challengeId: String, viewer: UserEntity): DiscussionResult<List<DiscussionPostDto>> {
        if (!hasSolved(viewer.id, challengeId)) return DiscussionResult.Locked
        val posts = discussionRepo.findVisible(challengeId)
        val authorIds = posts.map { it.userId }.distinct()
        val names = userRepo.findAllById(authorIds).associate { it.id to (it.name ?: "Anonymous") }
        return DiscussionResult.Ok(posts.map { it.toDto(names, viewer.id) })
    }

    @Transactional
    fun addPost(challengeId: String, author: UserEntity, body: String): DiscussionResult<DiscussionPostDto> {
        if (!hasSolved(author.id, challengeId)) return DiscussionResult.Locked
        val trimmed = body.trim().take(4000)
        if (trimmed.isBlank()) return DiscussionResult.Invalid
        val post = discussionRepo.save(
            DiscussionPostEntity(challengeId = challengeId, userId = author.id, body = trimmed)
        )
        return DiscussionResult.Ok(post.toDto(mapOf(author.id to (author.name ?: "Anonymous")), author.id))
    }

    @Transactional
    fun deletePost(postId: UUID, user: UserEntity): DiscussionResult<Unit> {
        val post = discussionRepo.findById(postId).orElse(null) ?: return DiscussionResult.NotFound
        if (post.userId != user.id) return DiscussionResult.Forbidden
        post.deletedAt = Instant.now()
        discussionRepo.save(post)
        return DiscussionResult.Ok(Unit)
    }

    @Transactional
    fun upvotePost(postId: UUID, user: UserEntity): DiscussionResult<Unit> {
        val post = discussionRepo.findById(postId).orElse(null) ?: return DiscussionResult.NotFound
        if (post.userId == user.id) return DiscussionResult.Forbidden
        post.upvotes += 1
        discussionRepo.save(post)
        return DiscussionResult.Ok(Unit)
    }

    private fun hasSolved(userId: UUID, challengeId: String) =
        submissionRepo.existsByUserIdAndChallengeIdAndIsCorrectTrue(userId, challengeId)

    private fun DiscussionPostEntity.toDto(names: Map<UUID, String>, viewerUserId: UUID) =
        DiscussionPostDto(
            id = id.toString(),
            challengeId = challengeId,
            authorName = names[userId] ?: "Anonymous",
            body = body,
            upvotes = upvotes,
            isOwn = userId == viewerUserId,
            createdAt = createdAt.toString(),
        )
}

sealed class DiscussionResult<out T> {
    data class Ok<T>(val value: T) : DiscussionResult<T>()
    data object Locked : DiscussionResult<Nothing>()
    data object NotFound : DiscussionResult<Nothing>()
    data object Forbidden : DiscussionResult<Nothing>()
    data object Invalid : DiscussionResult<Nothing>()
}

data class DiscussionPostDto(
    val id: String,
    val challengeId: String,
    val authorName: String,
    val body: String,
    val upvotes: Int,
    val isOwn: Boolean,
    val createdAt: String,
)
