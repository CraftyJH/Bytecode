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
import io.ktor.client.statement.bodyAsText
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
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
        }

    suspend fun fetchBilling(accessToken: String): Result<BillingState> =
        runCatching {
            client.get("${AppConfig.BYTECODE_API_URL}/api/users/me/billing") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }.body()
        }

    suspend fun fetchCurriculum(accessToken: String): Result<MobileCurriculumState> =
        runCatching {
            val response = client.get("${AppConfig.BYTECODE_API_URL}/api/mobile/curriculum") {
                header(HttpHeaders.Authorization, "Bearer $accessToken")
                contentType(ContentType.Application.Json)
            }
            if (response.status.value !in 200..299) {
                throw IllegalStateException("Unable to load curriculum (${response.status.value}).")
            }
            response.body()
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
                throw IllegalStateException("Premium required for this lesson.")
            }
            if (response.status.value !in 200..299) {
                val responseText = response.bodyAsText()
                throw IllegalStateException(
                    "Unable to load lesson (${response.status.value}): ${responseText.take(120)}",
                )
            }
            response.body()
        }
}
