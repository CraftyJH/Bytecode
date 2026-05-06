package dev.bytecode.api.challenge

import dev.bytecode.api.leaderboard.AroundMeResult
import dev.bytecode.api.leaderboard.RankedEntry
import dev.bytecode.api.leaderboard.RedisLeaderboardService
import dev.bytecode.api.leaderboard.RedisLeaderboardService.Companion.currentIsoWeek
import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.sql.ResultSet
import java.util.UUID

@RestController
@RequestMapping("/api/leaderboard")
class LeaderboardController(
    private val challengeService: ChallengeService,
    private val userService: UserService,
    private val jdbc: JdbcTemplate,
    private val redis: RedisLeaderboardService,
) {

    // ── Daily (first-to-solve) ─────────────────────────────────────────────────

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

    // ── Global all-time ────────────────────────────────────────────────────────

    @GetMapping("/global")
    fun globalAllTime(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<RankedBoardResponse> {
        val user = userService.findOrCreate(jwt)
        val key = RedisLeaderboardService.globalAllTimeKey()
        return ResponseEntity.ok(buildBoardResponse("global:alltime", key, user.id))
    }

    // ── Weekly (current ISO week) ──────────────────────────────────────────────

    @GetMapping("/week")
    fun weeklyBoard(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<RankedBoardResponse> {
        val user = userService.findOrCreate(jwt)
        val week = currentIsoWeek()
        val key = RedisLeaderboardService.globalWeekKey(week)
        return ResponseEntity.ok(buildBoardResponse("global:week:$week", key, user.id))
    }

    // ── By language ────────────────────────────────────────────────────────────

    @GetMapping("/lang/{language}")
    fun byLanguage(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable language: String,
    ): ResponseEntity<RankedBoardResponse> {
        val lang = language.lowercase().takeIf { it in setOf("java", "kotlin") }
            ?: return ResponseEntity.badRequest().build()
        val user = userService.findOrCreate(jwt)
        val week = currentIsoWeek()
        val key = RedisLeaderboardService.langWeekKey(lang, week)
        return ResponseEntity.ok(buildBoardResponse("lang:$lang:week:$week", key, user.id))
    }

    // ── By difficulty ──────────────────────────────────────────────────────────

    @GetMapping("/diff/{difficulty}")
    fun byDifficulty(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable difficulty: String,
    ): ResponseEntity<RankedBoardResponse> {
        val diff = difficulty.lowercase().takeIf { it in setOf("easy", "intermediate", "hard") }
            ?: return ResponseEntity.badRequest().build()
        val user = userService.findOrCreate(jwt)
        val week = currentIsoWeek()
        val key = RedisLeaderboardService.diffWeekKey(diff, week)
        return ResponseEntity.ok(buildBoardResponse("diff:$diff:week:$week", key, user.id))
    }

    // ── My ranks summary ───────────────────────────────────────────────────────

    @GetMapping("/me/ranks")
    fun myRanks(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<MyRanksResponse> {
        val user = userService.findOrCreate(jwt)
        val week = currentIsoWeek()
        val globalResult = redis.getAroundMe(RedisLeaderboardService.globalAllTimeKey(), user.id)
        val weeklyResult = redis.getAroundMe(RedisLeaderboardService.globalWeekKey(week), user.id)
        return ResponseEntity.ok(
            MyRanksResponse(
                globalRank = if (globalResult.found) globalResult.myRank else null,
                globalScore = if (globalResult.found) globalResult.myScore else null,
                weeklyRank = if (weeklyResult.found) weeklyResult.myRank else null,
                weeklyScore = if (weeklyResult.found) weeklyResult.myScore else null,
                isoWeek = week,
            )
        )
    }

    // ── Friends weekly ─────────────────────────────────────────────────────────

    @GetMapping("/friends")
    fun friendsBoard(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<FriendsBoardResponse> {
        val user = userService.findOrCreate(jwt)
        val week = currentIsoWeek()
        val key = RedisLeaderboardService.globalWeekKey(week)

        val friendIds = jdbc.query(
            """
            SELECT CASE
              WHEN requester_id = ?::uuid THEN addressee_id
              ELSE requester_id
            END AS friend_id
            FROM friend_edges
            WHERE status = 'accepted'
              AND (requester_id = ?::uuid OR addressee_id = ?::uuid)
            """.trimIndent(),
            { rs: ResultSet, _ -> rs.getString("friend_id") },
            user.id.toString(), user.id.toString(), user.id.toString(),
        )

        val myEntry = redis.getAroundMe(key, user.id)
        val allMembers = (friendIds + user.id.toString()).toSet()

        val displayNames = resolveDisplayNames(allMembers.mapNotNull { runCatching { UUID.fromString(it) }.getOrNull() })

        val entries = allMembers.mapNotNull { uid ->
            val score = redis.getUserWeeklyScore(key, runCatching { UUID.fromString(uid) }.getOrElse { return@mapNotNull null })
            FriendsBoardEntry(
                userId = uid,
                displayName = displayNames[uid] ?: "Anonymous",
                score = score,
                isMe = uid == user.id.toString(),
            )
        }.sortedByDescending { it.score }.mapIndexed { idx, e -> e.copy(rank = idx + 1) }

        return ResponseEntity.ok(
            FriendsBoardResponse(
                isoWeek = week,
                entries = entries,
                myRank = entries.firstOrNull { it.isMe }?.rank,
                myScore = myEntry.myScore,
            )
        )
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private fun buildBoardResponse(boardName: String, key: String, userId: UUID): RankedBoardResponse {
        val top = redis.getTop(key)
        val aroundMe = if (top.any { it.userId == userId.toString() }) {
            null
        } else {
            redis.getAroundMe(key, userId).takeIf { it.found }
        }

        val allUserIds = (top.map { UUID.fromString(it.userId) } +
            (aroundMe?.entries?.mapNotNull { runCatching { UUID.fromString(it.userId) }.getOrNull() } ?: emptyList()))
            .distinct()
        val names = resolveDisplayNames(allUserIds)

        return RankedBoardResponse(
            board = boardName,
            entries = top.map { it.toDto(names) },
            aroundMe = aroundMe?.entries?.map { it.toDto(names) },
            myRank = aroundMe?.myRank ?: top.firstOrNull { it.userId == userId.toString() }?.rank,
            myScore = aroundMe?.myScore ?: top.firstOrNull { it.userId == userId.toString() }?.score,
        )
    }

    private fun resolveDisplayNames(userIds: List<UUID>): Map<String, String> {
        if (userIds.isEmpty()) return emptyMap()
        val placeholders = userIds.joinToString(",") { "?::uuid" }
        return jdbc.query(
            "SELECT id::text, COALESCE(name, 'Anonymous') AS display_name FROM users WHERE id IN ($placeholders)",
            { rs: ResultSet, _ -> rs.getString("id") to rs.getString("display_name") },
            *userIds.map { it.toString() }.toTypedArray(),
        ).toMap()
    }

    private fun RankedEntry.toDto(names: Map<String, String>) = RankedEntryDto(
        rank = rank,
        userId = userId,
        displayName = names[userId] ?: "Anonymous",
        score = score,
    )
}

// ── DTOs ───────────────────────────────────────────────────────────────────────

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

data class RankedEntryDto(
    val rank: Int,
    val userId: String,
    val displayName: String,
    val score: Long,
)

data class RankedBoardResponse(
    val board: String,
    val entries: List<RankedEntryDto>,
    val aroundMe: List<RankedEntryDto>?,
    val myRank: Int?,
    val myScore: Long?,
)

data class MyRanksResponse(
    val globalRank: Int?,
    val globalScore: Long?,
    val weeklyRank: Int?,
    val weeklyScore: Long?,
    val isoWeek: String,
)

data class FriendsBoardEntry(
    val rank: Int = 0,
    val userId: String,
    val displayName: String,
    val score: Long,
    val isMe: Boolean,
)

data class FriendsBoardResponse(
    val isoWeek: String,
    val entries: List<FriendsBoardEntry>,
    val myRank: Int?,
    val myScore: Long,
)
