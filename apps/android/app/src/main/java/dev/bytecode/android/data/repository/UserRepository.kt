package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.BackendUserState
import dev.bytecode.android.data.model.BillingState
import dev.bytecode.android.data.model.MobileCurriculumState
import dev.bytecode.android.data.model.MobileLessonContent
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ResponseException
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.statement.bodyAsText
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class UserRepository {
    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            json(
                Json {
                    ignoreUnknownKeys = true
                },
            )
        }
    }

    suspend fun fetchProfile(accessToken: String): Result<BackendUserState> =
        runCatching {
            client.get("${AppConfig.BYTECODE_API_URL}/api/users/me") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }.body()
        }.recoverCatching { throwable ->
            throw mapRepositoryError("profile", throwable)
        }

    suspend fun fetchBilling(accessToken: String): Result<BillingState> =
        runCatching {
            client.get("${AppConfig.BYTECODE_API_URL}/api/users/me/billing") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }.body()
        }.recoverCatching { throwable ->
            throw mapRepositoryError("billing", throwable)
        }

    suspend fun fetchCurriculum(accessToken: String): Result<MobileCurriculumState> =
        runCatching {
            val response = client.get("${AppConfig.BYTECODE_API_URL}/api/mobile/curriculum") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("curriculum", response.status, response.bodyAsText())
            }
            response.body()
        }.recoverCatching { throwable ->
            throw mapRepositoryError("curriculum", throwable)
        }

    suspend fun fetchLesson(
        accessToken: String,
        trackSlug: String,
        moduleSlug: String,
        lessonSlug: String,
    ): Result<MobileLessonContent> =
        runCatching {
            val response = client.get("${AppConfig.BYTECODE_API_URL}/api/mobile/lesson/$trackSlug/$moduleSlug/$lessonSlug") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status == HttpStatusCode.Forbidden) {
                throw RepositoryFailure.PremiumRequired
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("lesson", response.status, response.bodyAsText())
            }
            response.body()
        }.recoverCatching { throwable ->
            throw mapRepositoryError("lesson", throwable)
        }

    private fun mapRepositoryError(scope: String, throwable: Throwable): Throwable {
        if (throwable is RepositoryFailure) {
            return throwable
        }
        if (throwable is ClientRequestException) {
            return mapHttpFailure(scope, throwable.response.status, null)
        }
        if (throwable is ResponseException) {
            return mapHttpFailure(scope, throwable.response.status, null)
        }
        return RepositoryFailure.Network(
            "Unable to load $scope. Check your connection and try again.",
        )
    }

    private fun mapHttpFailure(scope: String, status: HttpStatusCode, body: String?): RepositoryFailure {
        if (status == HttpStatusCode.Unauthorized || status == HttpStatusCode.Forbidden) {
            return RepositoryFailure.AuthExpired
        }
        val detail = body?.take(120)?.trim()
        return RepositoryFailure.Http(
            statusCode = status.value,
            message = if (detail.isNullOrBlank()) {
                "Unable to load $scope (${status.value})."
            } else {
                "Unable to load $scope (${status.value}): $detail"
            },
        )
    }
}
