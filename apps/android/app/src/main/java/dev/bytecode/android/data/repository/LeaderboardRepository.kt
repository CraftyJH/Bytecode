package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.FriendActionResponse
import dev.bytecode.android.data.model.FriendDto
import dev.bytecode.android.data.model.FriendRequestBody
import dev.bytecode.android.data.model.FriendsBoardResponse
import dev.bytecode.android.data.model.MyRanksResponse
import dev.bytecode.android.data.model.PendingResponse
import dev.bytecode.android.data.model.RankedBoardResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ResponseException
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class LeaderboardRepository(context: android.content.Context) {
    private val sessionStore = SessionStore(context)

    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchGlobal(accessToken: String): Result<RankedBoardResponse> =
        get("${resolveBaseUrl()}/api/leaderboard/global", accessToken, "global leaderboard")

    suspend fun fetchWeekly(accessToken: String): Result<RankedBoardResponse> =
        get("${resolveBaseUrl()}/api/leaderboard/week", accessToken, "weekly leaderboard")

    suspend fun fetchByLanguage(language: String, accessToken: String): Result<RankedBoardResponse> =
        get("${resolveBaseUrl()}/api/leaderboard/lang/$language", accessToken, "$language leaderboard")

    suspend fun fetchByDifficulty(difficulty: String, accessToken: String): Result<RankedBoardResponse> =
        get("${resolveBaseUrl()}/api/leaderboard/diff/$difficulty", accessToken, "$difficulty leaderboard")

    suspend fun fetchFriends(accessToken: String): Result<FriendsBoardResponse> =
        get("${resolveBaseUrl()}/api/leaderboard/friends", accessToken, "friends leaderboard")

    suspend fun fetchMyRanks(accessToken: String): Result<MyRanksResponse> =
        get("${resolveBaseUrl()}/api/leaderboard/me/ranks", accessToken, "my ranks")

    suspend fun fetchFriendsList(accessToken: String): Result<List<FriendDto>> =
        get("${resolveBaseUrl()}/api/friends", accessToken, "friends list")

    suspend fun fetchPending(accessToken: String): Result<PendingResponse> =
        get("${resolveBaseUrl()}/api/friends/pending", accessToken, "pending requests")

    suspend fun sendFriendRequest(handle: String, accessToken: String): Result<FriendActionResponse> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/friends/request") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
                setBody(FriendRequestBody(handle = handle))
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("friend request", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("friend request", t))
        }

    suspend fun acceptFriendRequest(requesterId: String, accessToken: String): Result<FriendActionResponse> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/friends/accept/$requesterId") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("accept friend", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("accept friend", t))
        }

    suspend fun removeFriend(userId: String, accessToken: String): Result<Unit> =
        try {
            val response = client.delete("${resolveBaseUrl()}/api/friends/$userId") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("remove friend", response.status, response.bodyAsText())
            }
            Result.success(Unit)
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("remove friend", t))
        }

    private suspend inline fun <reified T> get(url: String, accessToken: String, scope: String): Result<T> =
        try {
            val response = client.get(url) {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure(scope, response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError(scope, t))
        }

    private fun mapRepositoryError(scope: String, t: Throwable): Throwable {
        if (t is RepositoryFailure) return t
        if (t is ClientRequestException) return mapHttpFailure(scope, t.response.status, null)
        if (t is ResponseException) return mapHttpFailure(scope, t.response.status, null)
        return RepositoryFailure.Network("Unable to load $scope. Check your connection and try again.")
    }

    private fun mapHttpFailure(scope: String, status: io.ktor.http.HttpStatusCode, body: String?): RepositoryFailure {
        if (status == HttpStatusCode.Unauthorized || status == HttpStatusCode.Forbidden) return RepositoryFailure.AuthExpired
        val detail = body?.take(120)?.trim()
        return RepositoryFailure.Http(
            statusCode = status.value,
            detail = if (detail.isNullOrBlank()) "Unable to load $scope (${status.value})." else "Unable to load $scope (${status.value}): $detail",
        )
    }

    private fun resolveBaseUrl(): String {
        val cached = sessionStore.readMobileRuntimeConfig()?.webBaseUrl?.trim().orEmpty()
        if (cached.isNotBlank()) return cached.removeSuffix("/")
        return AppConfig.WEB_BASE_URL.trim().removeSuffix("/")
    }
}
