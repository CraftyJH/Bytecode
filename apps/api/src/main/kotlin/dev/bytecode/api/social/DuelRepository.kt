package dev.bytecode.api.social

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface DuelRepository : JpaRepository<DuelEntity, UUID> {

    fun findByChallengeIdAndChallengerIdAndOpponentId(
        challengeId: String,
        challengerId: UUID,
        opponentId: UUID,
    ): DuelEntity?

    @Query("""
        SELECT d FROM DuelEntity d
        WHERE d.status IN ('pending', 'active')
          AND (d.challengerId = :userId OR d.opponentId = :userId)
        ORDER BY d.createdAt DESC
    """)
    fun findActiveForUser(userId: UUID): List<DuelEntity>

    @Query("""
        SELECT d FROM DuelEntity d
        WHERE d.status = 'active'
          AND d.challengeId = :challengeId
          AND (d.challengerId = :userId OR d.opponentId = :userId)
    """)
    fun findActiveDuelForUserAndChallenge(userId: UUID, challengeId: String): DuelEntity?
}
