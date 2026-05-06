package dev.bytecode.api.discussion

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface DiscussionRepository : JpaRepository<DiscussionPostEntity, UUID> {

    @Query("""
        SELECT p FROM DiscussionPostEntity p
        WHERE p.challengeId = :challengeId AND p.deletedAt IS NULL
        ORDER BY p.upvotes DESC, p.createdAt ASC
    """)
    fun findVisible(challengeId: String): List<DiscussionPostEntity>
}
