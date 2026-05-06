package dev.bytecode.api.submission

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface SubmissionJpaRepository : JpaRepository<SubmissionEntity, UUID> {
    fun existsByUserIdAndChallengeIdAndIsCorrectTrue(userId: UUID, challengeId: String): Boolean

    @Query("""
        SELECT s FROM SubmissionEntity s
        WHERE s.challengeId = :challengeId AND s.shared = true AND s.isCorrect = true
        ORDER BY s.createdAt ASC
    """)
    fun findSharedCorrect(challengeId: String): List<SubmissionEntity>

    @Query("SELECT COUNT(s) FROM SubmissionEntity s WHERE s.userId = :userId AND s.isCorrect = true")
    fun countCorrectByUserId(@Param("userId") userId: UUID): Long

    @Query(value = """
        SELECT COUNT(s.id) FROM challenge_submissions s
        JOIN challenges c ON s.challenge_id = c.id
        WHERE s.user_id = :userId AND s.is_correct = true AND c.difficulty = :difficulty
    """, nativeQuery = true)
    fun countCorrectByUserIdAndDifficulty(
        @Param("userId") userId: UUID,
        @Param("difficulty") difficulty: String,
    ): Long

    @Query(value = """
        SELECT COUNT(s.id) FROM challenge_submissions s
        WHERE s.user_id = :userId AND s.is_correct = true AND s.language = :language
    """, nativeQuery = true)
    fun countCorrectByUserIdAndLanguage(
        @Param("userId") userId: UUID,
        @Param("language") language: String,
    ): Long

    @Query(value = """
        SELECT COUNT(DISTINCT s.id) FROM challenge_submissions s
        JOIN challenges c ON s.challenge_id = c.id
        WHERE s.user_id = :userId AND s.is_correct = true AND :tag = ANY(c.tags)
    """, nativeQuery = true)
    fun countCorrectByUserIdAndTag(
        @Param("userId") userId: UUID,
        @Param("tag") tag: String,
    ): Long

    @Query(value = """
        SELECT COUNT(s.id) FROM challenge_submissions s
        JOIN challenges c ON s.challenge_id = c.id
        WHERE s.user_id = :userId AND s.is_correct = true AND c.type = :type
    """, nativeQuery = true)
    fun countCorrectByUserIdAndChallengeType(
        @Param("userId") userId: UUID,
        @Param("type") type: String,
    ): Long

    @Query(value = """
        SELECT COALESCE(SUM(sv_count.cnt), 0) FROM (
            SELECT COUNT(sv.id) AS cnt
            FROM challenge_submissions cs
            JOIN solution_votes sv ON sv.submission_id = cs.id
            WHERE cs.user_id = :userId
        ) sv_count
    """, nativeQuery = true)
    fun countSolutionUpvotesReceivedByUser(@Param("userId") userId: UUID): Long
}
