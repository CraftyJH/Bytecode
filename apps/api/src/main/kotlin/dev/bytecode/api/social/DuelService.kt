package dev.bytecode.api.social

import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class DuelService(
    private val duelRepo: DuelRepository,
    private val friendRepo: FriendRepository,
    private val userRepo: UserRepository,
) {

    @Transactional
    fun challenge(challenger: UserEntity, opponentId: UUID, challengeId: String): DuelResult {
        if (!friendRepo.areFriends(challenger.id, opponentId)) return DuelResult.NotFriends

        val existing = duelRepo.findByChallengeIdAndChallengerIdAndOpponentId(challengeId, challenger.id, opponentId)
            ?: duelRepo.findByChallengeIdAndChallengerIdAndOpponentId(challengeId, opponentId, challenger.id)
        if (existing != null && existing.status in listOf("pending", "active")) return DuelResult.AlreadyExists

        val duel = duelRepo.save(
            DuelEntity(
                challengeId = challengeId,
                challengerId = challenger.id,
                opponentId = opponentId,
                status = "pending",
            )
        )
        return DuelResult.Created(duel.id)
    }

    @Transactional
    fun accept(user: UserEntity, duelId: UUID): DuelResult {
        val duel = duelRepo.findById(duelId).orElse(null) ?: return DuelResult.NotFound
        if (duel.opponentId != user.id) return DuelResult.NotFound
        if (duel.status != "pending") return DuelResult.AlreadyExists
        duel.status = "active"
        duelRepo.save(duel)
        return DuelResult.Accepted
    }

    @Transactional
    fun decline(user: UserEntity, duelId: UUID): DuelResult {
        val duel = duelRepo.findById(duelId).orElse(null) ?: return DuelResult.NotFound
        if (duel.opponentId != user.id && duel.challengerId != user.id) return DuelResult.NotFound
        duel.status = "declined"
        duelRepo.save(duel)
        return DuelResult.Declined
    }

    /** Called from ChallengeService after a submission is saved. */
    @Transactional
    fun onSubmit(userId: UUID, challengeId: String, submissionId: UUID, isCorrect: Boolean) {
        val duel = duelRepo.findActiveDuelForUserAndChallenge(userId, challengeId) ?: return
        when (userId) {
            duel.challengerId -> duel.challengerSubmissionId = submissionId
            duel.opponentId -> duel.opponentSubmissionId = submissionId
        }
        if (isCorrect) {
            val bothSolved = duel.challengerSubmissionId != null && duel.opponentSubmissionId != null
            // First correct solver wins; if already have a winner, leave as-is
            if (duel.winnerId == null) duel.winnerId = userId
            if (bothSolved || duel.winnerId != null) {
                duel.status = "completed"
                duel.completedAt = Instant.now()
            }
        }
        duelRepo.save(duel)
    }

    fun listForUser(user: UserEntity): List<DuelDto> {
        val duels = duelRepo.findActiveForUser(user.id)
        val userIds = duels.flatMap { listOf(it.challengerId, it.opponentId) }.distinct()
        val names = userRepo.findAllById(userIds).associate { it.id to (it.name ?: "Anonymous") }
        return duels.map { it.toDto(names, user.id) }
    }

    fun getById(user: UserEntity, duelId: UUID): DuelDto? {
        val duel = duelRepo.findById(duelId).orElse(null) ?: return null
        if (duel.challengerId != user.id && duel.opponentId != user.id) return null
        val names = userRepo.findAllById(listOf(duel.challengerId, duel.opponentId))
            .associate { it.id to (it.name ?: "Anonymous") }
        return duel.toDto(names, user.id)
    }

    private fun DuelEntity.toDto(names: Map<UUID, String>, viewerUserId: UUID) = DuelDto(
        id = id.toString(),
        challengeId = challengeId,
        challengerName = names[challengerId] ?: "Anonymous",
        opponentName = names[opponentId] ?: "Anonymous",
        status = status,
        isChallenger = challengerId == viewerUserId,
        winnerId = winnerId?.toString(),
        createdAt = createdAt.toString(),
        completedAt = completedAt?.toString(),
    )
}

sealed class DuelResult {
    data class Created(val duelId: UUID) : DuelResult()
    data object Accepted : DuelResult()
    data object Declined : DuelResult()
    data object NotFound : DuelResult()
    data object NotFriends : DuelResult()
    data object AlreadyExists : DuelResult()
}

data class DuelDto(
    val id: String,
    val challengeId: String,
    val challengerName: String,
    val opponentName: String,
    val status: String,
    val isChallenger: Boolean,
    val winnerId: String?,
    val createdAt: String,
    val completedAt: String?,
)
