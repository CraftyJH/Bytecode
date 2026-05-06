package dev.bytecode.api.social

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface LeagueAssignmentRepository : JpaRepository<LeagueAssignmentEntity, UUID> {

    fun findByUserIdAndIsoWeek(userId: UUID, isoWeek: String): LeagueAssignmentEntity?

    fun findByLeagueIdAndIsoWeek(leagueId: UUID, isoWeek: String): List<LeagueAssignmentEntity>

    fun findByIsoWeek(isoWeek: String): List<LeagueAssignmentEntity>
}
