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

class UserRepository(context: android.content.Context) {
    private val sessionStore = SessionStore(context)

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
        try {
            val response = client.get("${resolveWebApiBaseUrl()}/api/mobile/profile") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("profile", response.status, response.bodyAsText())
            }
            val payload: BackendUserState = response.body()
            Result.success(payload)
        } catch (throwable: Throwable) {
            Result.failure(mapRepositoryError("profile", throwable))
        }

    suspend fun fetchBilling(accessToken: String): Result<BillingState> =
        try {
            val response = client.get("${resolveWebApiBaseUrl()}/api/mobile/billing") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("billing", response.status, response.bodyAsText())
            }
            val payload: BillingState = response.body()
            Result.success(payload)
        } catch (throwable: Throwable) {
            Result.failure(mapRepositoryError("billing", throwable))
        }

    suspend fun fetchCurriculum(accessToken: String): Result<MobileCurriculumState> =
        try {
            val response = client.get("${resolveWebApiBaseUrl()}/api/mobile/curriculum") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("curriculum", response.status, response.bodyAsText())
            }
            val payload: MobileCurriculumState = response.body()
            Result.success(payload)
        } catch (throwable: Throwable) {
            Result.failure(mapRepositoryError("curriculum", throwable))
        }

    suspend fun fetchLesson(
        accessToken: String,
        trackSlug: String,
        moduleSlug: String,
        lessonSlug: String,
    ): Result<MobileLessonContent> =
        try {
            val response = client.get("${resolveWebApiBaseUrl()}/api/mobile/lesson/$trackSlug/$moduleSlug/$lessonSlug") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status == HttpStatusCode.Forbidden) {
                throw RepositoryFailure.PremiumRequired
            }
            if (response.status.value !in 200..299) {
                throw mapHttpFailure("lesson", response.status, response.bodyAsText())
            }
            val payload: MobileLessonContent = response.body()
            Result.success(payload)
        } catch (throwable: Throwable) {
            Result.failure(mapRepositoryError("lesson", throwable))
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
            detail = if (detail.isNullOrBlank()) {
                "Unable to load $scope (${status.value})."
            } else {
                "Unable to load $scope (${status.value}): $detail"
            },
        )
    }

    private fun resolveWebApiBaseUrl(): String {
        val cached = sessionStore.readMobileRuntimeConfig()?.webBaseUrl?.trim().orEmpty()
        if (cached.isNotBlank()) {
            return cached.removeSuffix("/")
        }
        return AppConfig.WEB_BASE_URL.trim().removeSuffix("/")
    }
}
