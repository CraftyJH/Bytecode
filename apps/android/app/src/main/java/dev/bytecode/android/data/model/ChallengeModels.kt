package dev.bytecode.android.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ChallengeDto(
    val id: String,
    val title: String,
    val difficulty: String,
    val language: String,
    val description: String,
    val starterCode: String,
    val visibleExamples: List<ExampleDto> = emptyList(),
    val baseXp: Int = 10,
    val releaseDate: String,
)

@Serializable
data class ExampleDto(
    val input: String,
    val output: String,
    val explanation: String? = null,
)

@Serializable
data class ChallengeSubmitRequest(
    val sourceCode: String,
    val language: String,
)

@Serializable
data class ChallengeSubmitResponse(
    val isCorrect: Boolean,
    val visibleResults: List<TestCaseResultDto> = emptyList(),
    val hiddenPass: Int = 0,
    val hiddenTotal: Int = 0,
    val runtimeMs: Int? = null,
    val memoryKb: Int? = null,
    val compileError: String? = null,
    val xpAwarded: Int? = null,
)

@Serializable
data class LeaderboardEntryDto(
    val userId: String,
    val displayName: String,
    val avatarUrl: String? = null,
    val solvedAt: String,
)

@Serializable
data class DailyLeaderboardResponse(
    val challengeId: String,
    val challengeTitle: String,
    val entries: List<LeaderboardEntryDto> = emptyList(),
)

@Serializable
data class TestCaseResultDto(
    val id: String,
    val passed: Boolean,
    val expected: String,
    val actual: String? = null,
    val error: String? = null,
)
