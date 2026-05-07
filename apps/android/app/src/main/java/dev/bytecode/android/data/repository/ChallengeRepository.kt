package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.ChallengeDto
import dev.bytecode.android.data.model.ChallengeSubmitRequest
import dev.bytecode.android.data.model.ChallengeSubmitResponse
import dev.bytecode.android.data.model.DailyChallengesResponse
import dev.bytecode.android.data.model.DailyLeaderboardResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ResponseException
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
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

class ChallengeRepository(context: android.content.Context) {
    private val sessionStore = SessionStore(context)

    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchToday(accessToken: String): Result<ChallengeDto> =
        try {
            val response = client.get("${resolveBaseUrl()}/api/challenges/today") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("today's challenge", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("today's challenge", t))
        }

    suspend fun fetchDaily(accessToken: String): Result<DailyChallengesResponse> =
        try {
            val response = client.get("${resolveBaseUrl()}/api/challenges/daily") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("daily challenges", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("daily challenges", t))
        }

    suspend fun submit(
        challengeId: String,
        sourceCode: String,
        language: String,
        accessToken: String,
        shareOnSubmit: Boolean = false,
    ): Result<ChallengeSubmitResponse> =
        try {
            val response = client.post("${resolveBaseUrl()}/api/challenges/$challengeId/submit") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
                setBody(ChallengeSubmitRequest(sourceCode = sourceCode, language = language, shareOnSubmit = shareOnSubmit))
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("submission", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("submission", t))
        }

    suspend fun fetchLeaderboard(accessToken: String): Result<DailyLeaderboardResponse> =
        try {
            val response = client.get("${resolveBaseUrl()}/api/leaderboard/daily") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("leaderboard", response.status, response.bodyAsText())
            }
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapRepositoryError("leaderboard", t))
        }

    private fun mapRepositoryError(scope: String, t: Throwable): Throwable {
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
