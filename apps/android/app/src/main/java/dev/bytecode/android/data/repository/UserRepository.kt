package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.BackendUserState
import dev.bytecode.android.data.model.BillingState
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
            json(Json { ignoreUnknownKeys = true })
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
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapError("profile", t))
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
            Result.success(response.body())
        } catch (t: Throwable) {
            Result.failure(mapError("billing", t))
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
            detail = if (detail.isNullOrBlank()) "Unable to load $scope (${status.value})."
                     else "Unable to load $scope (${status.value}): $detail",
        )
    }

    private fun resolveWebApiBaseUrl(): String {
        val cached = sessionStore.readMobileRuntimeConfig()?.webBaseUrl?.trim().orEmpty()
        if (cached.isNotBlank()) return cached.removeSuffix("/")
        return AppConfig.WEB_BASE_URL.trim().removeSuffix("/")
    }
}
