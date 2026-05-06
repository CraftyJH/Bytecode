package dev.bytecode.api.leaderboard

import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.IsoFields
import java.time.temporal.TemporalAdjusters
import java.util.UUID
import java.util.concurrent.TimeUnit

@Service
class RedisLeaderboardService(private val redis: StringRedisTemplate) {

    private val log = LoggerFactory.getLogger(RedisLeaderboardService::class.java)

    companion object {
        private const val WEEKLY_TTL_DAYS = 70L
        private const val TOP_N = 50
        private const val AROUND_ME_WINDOW = 5

        fun globalAllTimeKey() = "lb:global:alltime"
        fun globalWeekKey(isoWeek: String = currentIsoWeek()) = "lb:global:week:$isoWeek"
        fun langWeekKey(lang: String, isoWeek: String = currentIsoWeek()) = "lb:lang:${lang.lowercase()}:week:$isoWeek"
        fun diffWeekKey(diff: String, isoWeek: String = currentIsoWeek()) = "lb:diff:${diff.lowercase()}:week:$isoWeek"
        fun friendsWeekKey(userId: UUID, isoWeek: String = currentIsoWeek()) = "lb:friends:$userId:week:$isoWeek"

        fun currentIsoWeek(): String {
            val now = LocalDate.now()
            val year = now.get(IsoFields.WEEK_BASED_YEAR)
            val week = now.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR)
            return "$year-W${week.toString().padStart(2, '0')}"
        }
    }

    fun onSolve(userId: UUID, xpAwarded: Int, language: String, difficulty: String) {
        if (xpAwarded <= 0) return
        val score = xpAwarded.toDouble()
        val member = userId.toString()
        val week = currentIsoWeek()
        try {
            redis.opsForZSet().incrementScore(globalAllTimeKey(), member, score)
            incrWithTtl(globalWeekKey(week), member, score)
            incrWithTtl(langWeekKey(language, week), member, score)
            incrWithTtl(diffWeekKey(difficulty, week), member, score)
        } catch (e: Exception) {
            log.warn("Redis leaderboard update failed for user={}: {}", userId, e.message)
        }
    }

    fun seedAllTime(userId: UUID, xpTotal: Int) {
        if (xpTotal <= 0) return
        try {
            redis.opsForZSet().add(globalAllTimeKey(), userId.toString(), xpTotal.toDouble())
        } catch (e: Exception) {
            log.warn("Redis seed failed for user={}: {}", userId, e.message)
        }
    }

    fun getTop(key: String, limit: Int = TOP_N): List<RankedEntry> {
        return try {
            val entries = redis.opsForZSet().reverseRangeWithScores(key, 0, (limit - 1).toLong())
                ?: return emptyList()
            entries.mapIndexedNotNull { idx, typed ->
                val value = typed.value ?: return@mapIndexedNotNull null
                RankedEntry(rank = idx + 1, userId = value, score = typed.score?.toLong() ?: 0L)
            }
        } catch (e: Exception) {
            log.warn("Redis getTop failed for key={}: {}", key, e.message)
            emptyList()
        }
    }

    fun getAroundMe(key: String, userId: UUID): AroundMeResult {
        val member = userId.toString()
        return try {
            val size = redis.opsForZSet().zCard(key) ?: 0L
            val rank0 = redis.opsForZSet().reverseRank(key, member) ?: return AroundMeResult.notFound()
            val score = redis.opsForZSet().score(key, member) ?: 0.0

            val fromIdx = maxOf(0L, rank0 - AROUND_ME_WINDOW)
            val toIdx = minOf(size - 1, rank0 + AROUND_ME_WINDOW)
            val slice = redis.opsForZSet().reverseRangeWithScores(key, fromIdx, toIdx)
                ?: return AroundMeResult.notFound()

            val entries = slice.mapIndexedNotNull { sliceIdx, typed ->
                val v = typed.value ?: return@mapIndexedNotNull null
                RankedEntry(
                    rank = (fromIdx + sliceIdx + 1).toInt(),
                    userId = v,
                    score = typed.score?.toLong() ?: 0L,
                )
            }

            AroundMeResult(
                myRank = (rank0 + 1).toInt(),
                myScore = score.toLong(),
                entries = entries,
                found = true,
            )
        } catch (e: Exception) {
            log.warn("Redis aroundMe failed for key={}: {}", key, e.message)
            AroundMeResult.notFound()
        }
    }

    fun getUserWeeklyScore(key: String, userId: UUID): Long {
        return try {
            redis.opsForZSet().score(key, userId.toString())?.toLong() ?: 0L
        } catch (e: Exception) {
            0L
        }
    }

    private fun incrWithTtl(key: String, member: String, score: Double) {
        redis.opsForZSet().incrementScore(key, member, score)
        if ((redis.getExpire(key, TimeUnit.DAYS) ?: -1L) < 0L) {
            redis.expire(key, WEEKLY_TTL_DAYS, TimeUnit.DAYS)
        }
    }
}

data class RankedEntry(val rank: Int, val userId: String, val score: Long)

data class AroundMeResult(
    val myRank: Int,
    val myScore: Long,
    val entries: List<RankedEntry>,
    val found: Boolean,
) {
    companion object {
        fun notFound() = AroundMeResult(myRank = -1, myScore = 0L, entries = emptyList(), found = false)
    }
}
