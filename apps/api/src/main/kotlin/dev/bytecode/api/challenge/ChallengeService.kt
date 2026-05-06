package dev.bytecode.api.challenge

import com.fasterxml.jackson.databind.ObjectMapper
import dev.bytecode.api.badge.BadgeDefinition
import dev.bytecode.api.badge.BadgeEvaluator
import dev.bytecode.api.execution.Grader
import dev.bytecode.api.leaderboard.RedisLeaderboardService
import dev.bytecode.api.social.DuelService
import dev.bytecode.api.submission.SubmissionEntity
import dev.bytecode.api.submission.SubmissionJpaRepository
import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class ChallengeService(
    val repo: ChallengeJpaRepository,
    private val submissionRepo: SubmissionJpaRepository,
    private val userRepo: UserRepository,
    private val grader: Grader,
    private val objectMapper: ObjectMapper,
    private val leaderboard: RedisLeaderboardService,
    private val duelService: DuelService,
    private val badgeEvaluator: BadgeEvaluator,
) {
    fun getToday(): ChallengeEntity? = repo.findByReleaseDate(LocalDate.now())

    @Transactional
    fun submit(
        challenge: ChallengeEntity,
        user: UserEntity,
        sourceCode: String,
        language: String,
        shareOnSubmit: Boolean = false,
    ): SubmitResponse {
        val alreadySolved = submissionRepo.existsByUserIdAndChallengeIdAndIsCorrectTrue(user.id, challenge.id)
        val result = grader.grade(challenge.id, sourceCode)

        val submission = submissionRepo.save(
            SubmissionEntity(
                userId = user.id,
                challengeId = challenge.id,
                language = language,
                sourceCode = sourceCode,
                isCorrect = result.isCorrect,
                visiblePass = result.visibleResults.count { it.passed },
                hiddenPass = result.hiddenPass,
                hiddenTotal = result.hiddenTotal,
                runtimeMs = result.runtimeMs,
                memoryKb = result.memoryKb,
                byteLength = sourceCode.toByteArray().size,
                shared = shareOnSubmit && result.isCorrect,
            )
        )

        duelService.onSubmit(user.id, challenge.id, submission.id, result.isCorrect)

        var xpAwarded: Int? = null
        var newBadges: List<BadgeDefinition> = emptyList()

        if (result.isCorrect && !alreadySolved) {
            user.xpTotal += challenge.baseXp
            userRepo.save(user)
            xpAwarded = challenge.baseXp
            leaderboard.onSolve(user.id, challenge.baseXp, challenge.language, challenge.difficulty)
            newBadges = badgeEvaluator.evaluate(user, submission)
        }

        return SubmitResponse(
            isCorrect = result.isCorrect,
            visibleResults = result.visibleResults.map {
                TestCaseResultDto(id = it.id, passed = it.passed, expected = it.expected, actual = it.actual, error = it.error)
            },
            hiddenPass = result.hiddenPass,
            hiddenTotal = result.hiddenTotal,
            runtimeMs = result.runtimeMs,
            memoryKb = result.memoryKb,
            compileError = result.compileError,
            xpAwarded = xpAwarded,
            badgesEarned = newBadges.map { BadgeEarnedDto(it.id, it.name, it.description) },
        )
    }

    fun toDto(c: ChallengeEntity): ChallengeDto {
        val meta = objectMapper.readTree(c.metadata)
        return ChallengeDto(
            id = c.id,
            title = c.title,
            difficulty = c.difficulty,
            language = c.language,
            description = meta.get("description")?.asText() ?: "",
            starterCode = meta.get("starterCode")?.asText() ?: "",
            visibleExamples = meta.get("visibleExamples")?.map { node ->
                ExampleDto(
                    input = node.get("input")?.asText() ?: "",
                    output = node.get("output")?.asText() ?: "",
                    explanation = node.get("explanation")?.asText(),
                )
            } ?: emptyList(),
            baseXp = c.baseXp,
            releaseDate = c.releaseDate.toString(),
        )
    }
}

data class ChallengeDto(
    val id: String,
    val title: String,
    val difficulty: String,
    val language: String,
    val description: String,
    val starterCode: String,
    val visibleExamples: List<ExampleDto>,
    val baseXp: Int,
    val releaseDate: String,
)

data class ExampleDto(
    val input: String,
    val output: String,
    val explanation: String?,
)

data class SubmitRequest(val sourceCode: String, val language: String, val shareOnSubmit: Boolean = false)

data class BadgeEarnedDto(val id: String, val name: String, val description: String)

data class SubmitResponse(
    val isCorrect: Boolean,
    val visibleResults: List<TestCaseResultDto>,
    val hiddenPass: Int,
    val hiddenTotal: Int,
    val runtimeMs: Int?,
    val memoryKb: Int?,
    val compileError: String?,
    val xpAwarded: Int?,
    val badgesEarned: List<BadgeEarnedDto> = emptyList(),
)

data class TestCaseResultDto(
    val id: String,
    val passed: Boolean,
    val expected: String,
    val actual: String?,
    val error: String?,
)
