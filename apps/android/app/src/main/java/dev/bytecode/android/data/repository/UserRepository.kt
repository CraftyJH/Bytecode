package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.BackendUserState
import dev.bytecode.android.data.model.BillingState
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
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
}
