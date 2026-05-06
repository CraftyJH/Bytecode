package dev.bytecode.api.social

import dev.bytecode.api.leaderboard.RedisLeaderboardService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.IsoFields
import java.time.temporal.TemporalAdjusters
import java.util.UUID

@Component
class LeagueCyclerJob(
    private val assignmentRepo: LeagueAssignmentRepository,
    private val redis: RedisLeaderboardService,
) {
    private val log = LoggerFactory.getLogger(LeagueCyclerJob::class.java)

    // Runs every Sunday at 23:50 UTC
    @Scheduled(cron = "0 50 23 * * SUN", zone = "UTC")
    fun cycle() {
        val closingWeek = currentIsoWeek()
        log.info("LeagueCycler: cycling week {}", closingWeek)

        val assignments = assignmentRepo.findByIsoWeek(closingWeek)
        if (assignments.isEmpty()) {
            log.info("LeagueCycler: no assignments for week {}, skipping", closingWeek)
            return
        }

        val weekKey = RedisLeaderboardService.globalWeekKey(closingWeek)
        val nextWeek = nextIsoWeek()

        // Group by league
        val byLeague = assignments.groupBy { it.leagueId }

        byLeague.forEach { (leagueId, members) ->
            val sorted = members.sortedByDescending { redis.getUserWeeklyScore(weekKey, it.userId) }

            // Update final ranks and scores
            sorted.forEachIndexed { idx, assignment ->
                assignment.weekXp = redis.getUserWeeklyScore(weekKey, assignment.userId).toInt()
                assignment.rankInLeague = idx + 1
                assignmentRepo.save(assignment)
            }

            val leagueSize = sorted.size
            // Promote: top 7 (unless Bronze demotion guard applies to next tier only)
            // Demote: bottom 5 but never demote from Bronze
            sorted.forEachIndexed { idx, assignment ->
                val rank = idx + 1
                val nextTier = when {
                    rank <= 7 && assignment.tier != "diamond" -> promote(assignment.tier)
                    rank > leagueSize - 5 && assignment.tier != "bronze" -> demote(assignment.tier)
                    else -> assignment.tier
                }
                // Create next-week assignment; stays in same league unless promoted/demoted
                val newLeagueId = if (nextTier != assignment.tier) UUID.randomUUID() else leagueId
                if (!assignmentRepo.findByUserIdAndIsoWeek(assignment.userId, nextWeek).let { it != null }) {
                    assignmentRepo.save(
                        LeagueAssignmentEntity(
                            userId = assignment.userId,
                            leagueId = newLeagueId,
                            tier = nextTier,
                            isoWeek = nextWeek,
                        )
                    )
                }
            }
        }

        log.info("LeagueCycler: done — cycled {} leagues for week {}", byLeague.size, closingWeek)
    }

    private fun promote(tier: String) = when (tier) {
        "bronze" -> "silver"
        "silver" -> "gold"
        "gold" -> "diamond"
        else -> tier
    }

    private fun demote(tier: String) = when (tier) {
        "diamond" -> "gold"
        "gold" -> "silver"
        "silver" -> "bronze"
        else -> tier
    }

    private fun currentIsoWeek(): String {
        val now = LocalDate.now()
        val year = now.get(IsoFields.WEEK_BASED_YEAR)
        val week = now.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR)
        return "$year-W${week.toString().padStart(2, '0')}"
    }

    private fun nextIsoWeek(): String {
        val next = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY))
        val year = next.get(IsoFields.WEEK_BASED_YEAR)
        val week = next.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR)
        return "$year-W${week.toString().padStart(2, '0')}"
    }
}

@RestController
@RequestMapping("/api/admin")
class AdminLeagueController(private val cyclerJob: LeagueCyclerJob) {

    @PostMapping("/cycle-leagues")
    @PreAuthorize("hasRole('staff')")
    fun triggerCycle(): ResponseEntity<Map<String, String>> {
        cyclerJob.cycle()
        return ResponseEntity.ok(mapOf("status" to "cycled"))
    }
}
