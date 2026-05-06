package dev.bytecode.api.submission

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface SubmissionJpaRepository : JpaRepository<SubmissionEntity, UUID> {
    fun existsByUserIdAndChallengeIdAndIsCorrectTrue(userId: UUID, challengeId: String): Boolean

    @Query("""
        SELECT s FROM SubmissionEntity s
        WHERE s.challengeId = :challengeId AND s.shared = true AND s.isCorrect = true
        ORDER BY s.createdAt ASC
    """)
    fun findSharedCorrect(challengeId: String): List<SubmissionEntity>
}
