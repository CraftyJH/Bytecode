package dev.bytecode.api.submission

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SubmissionJpaRepository : JpaRepository<SubmissionEntity, UUID> {
    fun existsByUserIdAndChallengeIdAndIsCorrectTrue(userId: UUID, challengeId: String): Boolean
}
