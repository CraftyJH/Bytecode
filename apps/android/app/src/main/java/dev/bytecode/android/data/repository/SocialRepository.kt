package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.ChallengeFriendBody
import dev.bytecode.android.data.model.DiscussionPostDto
import dev.bytecode.android.data.model.DuelActionResponse
import dev.bytecode.android.data.model.DuelDto
import dev.bytecode.android.data.model.PostBody
import dev.bytecode.android.data.model.SharedSolutionDto
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

class SocialRepository(context: android.content.Context) {
    private val sessionStore = SessionStore(context)

    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    // ── Discussion ────────────────────────────────────────────────────────────

    suspend fun fetchDiscussion(challengeId: String, accessToken: String): Result<List<DiscussionPostDto>> =
        get("${resolveBaseUrl()}/api/challenges/$challengeId/discuss", accessToken, "discussion")

    suspend fun postDiscussion(challengeId: String, body: String, accessToken: String): Result<DiscussionPostDto> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/challenges/$challengeId/discuss") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
                setBody(PostBody(body = body))
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("post discussion", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapError("post discussion", t))
        }

    suspend fun deletePost(challengeId: String, postId: String, accessToken: String): Result<Unit> =
        try {
            val response = client.delete("${resolveBaseUrl()}/api/challenges/$challengeId/discuss/$postId") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("delete post", response.status, response.bodyAsText())
            }
            Result.success(Unit)
        } catch (t: Throwable) {
            Result.failure(mapError("delete post", t))
        }

    suspend fun upvotePost(challengeId: String, postId: String, accessToken: String): Result<Unit> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/challenges/$challengeId/discuss/$postId/upvote") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("upvote post", response.status, response.bodyAsText())
            }
            Result.success(Unit)
        } catch (t: Throwable) {
            Result.failure(mapError("upvote post", t))
        }

    // ── Solutions ─────────────────────────────────────────────────────────────

    suspend fun fetchSolutions(challengeId: String, accessToken: String): Result<List<SharedSolutionDto>> =
        get("${resolveBaseUrl()}/api/challenges/$challengeId/solutions", accessToken, "solutions")

    suspend fun upvoteSolution(challengeId: String, submissionId: String, accessToken: String): Result<Unit> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/challenges/$challengeId/solutions/$submissionId/upvote") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("upvote solution", response.status, response.bodyAsText())
            }
            Result.success(Unit)
        } catch (t: Throwable) {
            Result.failure(mapError("upvote solution", t))
        }

    suspend fun removeUpvote(challengeId: String, submissionId: String, accessToken: String): Result<Unit> =
        try {
            val response = client.delete("${resolveBaseUrl()}/api/challenges/$challengeId/solutions/$submissionId/upvote") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("remove upvote", response.status, response.bodyAsText())
            }
            Result.success(Unit)
        } catch (t: Throwable) {
            Result.failure(mapError("remove upvote", t))
        }

    // ── Duels ─────────────────────────────────────────────────────────────────

    suspend fun fetchDuels(accessToken: String): Result<List<DuelDto>> =
        get("${resolveBaseUrl()}/api/duels", accessToken, "duels")

    suspend fun challengeFriend(opponentId: String, challengeId: String, accessToken: String): Result<DuelActionResponse> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/duels/challenge") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
                setBody(ChallengeFriendBody(opponentId = opponentId, challengeId = challengeId))
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("challenge friend", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapError("challenge friend", t))
        }

    suspend fun acceptDuel(duelId: String, accessToken: String): Result<DuelActionResponse> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/duels/$duelId/accept") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("accept duel", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapError("accept duel", t))
        }

    suspend fun declineDuel(duelId: String, accessToken: String): Result<DuelActionResponse> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/duels/$duelId/decline") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("decline duel", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapError("decline duel", t))
        }

    // ── Helpers ───────────────────────────────────────────────────────────────

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
            Result.failure(mapError(scope, t))
        }

    private fun mapError(scope: String, t: Throwable): Throwable {
        if (t is RepositoryFailure) return t
        if (t is ClientRequestException) return mapHttpFailure(scope, t.response.status, null)
        if (t is ResponseException) return mapHttpFailure(scope, t.response.status, null)
        return RepositoryFailure.Network("Unable to load $scope. Check your connection and try again.")
    }

    private fun mapHttpFailure(scope: String, status: HttpStatusCode, body: String?): RepositoryFailure {
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
