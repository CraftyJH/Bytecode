package dev.bytecode.api.badge

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface BadgeGrantRepository : JpaRepository<BadgeGrantEntity, UUID> {
    fun findByUserId(userId: UUID): List<BadgeGrantEntity>

    @Query("SELECT b.badgeId FROM BadgeGrantEntity b WHERE b.userId = :userId")
    fun findBadgeIdsByUserId(userId: UUID): List<String>

    fun existsByUserIdAndBadgeId(userId: UUID, badgeId: String): Boolean
}
