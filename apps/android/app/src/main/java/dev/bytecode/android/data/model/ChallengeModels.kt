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
    val shareOnSubmit: Boolean = false,
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

// ── Phase 3: ranked leaderboard models ───────────────────────────────────────

@Serializable
data class RankedEntryDto(
    val rank: Int,
    val userId: String,
    val displayName: String,
    val score: Long,
)

@Serializable
data class RankedBoardResponse(
    val board: String,
    val entries: List<RankedEntryDto> = emptyList(),
    val aroundMe: List<RankedEntryDto>? = null,
    val myRank: Int? = null,
    val myScore: Long? = null,
)

@Serializable
data class MyRanksResponse(
    val globalRank: Int? = null,
    val globalScore: Long? = null,
    val weeklyRank: Int? = null,
    val weeklyScore: Long? = null,
    val isoWeek: String = "",
)

@Serializable
data class FriendsBoardEntry(
    val rank: Int = 0,
    val userId: String,
    val displayName: String,
    val score: Long,
    val isMe: Boolean,
)

@Serializable
data class FriendsBoardResponse(
    val isoWeek: String = "",
    val entries: List<FriendsBoardEntry> = emptyList(),
    val myRank: Int? = null,
    val myScore: Long = 0,
)

@Serializable
data class FriendDto(
    val userId: String,
    val displayName: String,
    val email: String? = null,
    val avatarUrl: String? = null,
    val since: String,
)

@Serializable
data class PendingRequestDto(
    val edgeId: String,
    val userId: String,
    val displayName: String,
    val email: String? = null,
    val avatarUrl: String? = null,
    val requestedAt: String,
)

@Serializable
data class PendingResponse(
    val incoming: List<PendingRequestDto> = emptyList(),
    val outgoing: List<PendingRequestDto> = emptyList(),
)

@Serializable
data class FriendActionResponse(
    val status: String,
    val message: String,
)

@Serializable
data class FriendRequestBody(val handle: String)

// ── Phase 4: discussion, solutions, duels ────────────────────────────────────

@Serializable
data class DiscussionPostDto(
    val id: String,
    val challengeId: String,
    val authorName: String,
    val body: String,
    val upvotes: Int,
    val isOwn: Boolean,
    val createdAt: String,
)

@Serializable
data class SharedSolutionDto(
    val submissionId: String,
    val authorName: String,
    val sourceCode: String,
    val language: String,
    val runtimeMs: Int? = null,
    val upvotes: Int,
    val hasUpvoted: Boolean,
    val submittedAt: String,
)

@Serializable
data class DuelDto(
    val id: String,
    val challengeId: String,
    val challengerName: String,
    val opponentName: String,
    val status: String,
    val isChallenger: Boolean,
    val winnerId: String? = null,
    val createdAt: String,
    val completedAt: String? = null,
)

@Serializable
data class DuelActionResponse(val status: String, val message: String, val duelId: String? = null)

@Serializable
data class ChallengeFriendBody(val opponentId: String, val challengeId: String)

@Serializable
data class PostBody(val body: String)
