package dev.bytecode.api.challenge

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.sql.ResultSet
import java.time.Instant

@RestController
@RequestMapping("/api/leaderboard")
class LeaderboardController(
    private val challengeService: ChallengeService,
    private val jdbc: JdbcTemplate,
) {
    @GetMapping("/daily")
    fun daily(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<DailyLeaderboardResponse> {
        val challenge = challengeService.getToday()
            ?: return ResponseEntity.notFound().build()

        val entries = jdbc.query(
            """
            SELECT inner_q.user_id, inner_q.display_name, inner_q.avatar_url, inner_q.solved_at
            FROM (
                SELECT DISTINCT ON (cs.user_id)
                    cs.user_id::text,
                    COALESCE(u.name, 'Anonymous') AS display_name,
                    u.avatar_url,
                    cs.created_at AS solved_at
                FROM challenge_submissions cs
                JOIN users u ON cs.user_id = u.id
                WHERE cs.challenge_id = ? AND cs.is_correct = true
                ORDER BY cs.user_id, cs.created_at ASC
            ) inner_q
            ORDER BY inner_q.solved_at ASC
            LIMIT 20
            """.trimIndent(),
            { rs: ResultSet, _ ->
                LeaderboardEntryDto(
                    userId = rs.getString("user_id"),
                    displayName = rs.getString("display_name"),
                    avatarUrl = rs.getString("avatar_url"),
                    solvedAt = rs.getTimestamp("solved_at").toInstant().toString(),
                )
            },
            challenge.id,
        )

        return ResponseEntity.ok(
            DailyLeaderboardResponse(
                challengeId = challenge.id,
                challengeTitle = challenge.title,
                entries = entries,
            )
        )
    }
}

data class LeaderboardEntryDto(
    val userId: String,
    val displayName: String,
    val avatarUrl: String?,
    val solvedAt: String,
)

data class DailyLeaderboardResponse(
    val challengeId: String,
    val challengeTitle: String,
    val entries: List<LeaderboardEntryDto>,
)
