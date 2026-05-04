package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.AuthSession
import dev.bytecode.android.data.model.PersistedSession
import dev.bytecode.android.data.model.RefreshRequest
import dev.bytecode.android.data.model.SignInRequest
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class AuthRepository(context: android.content.Context) {
    private val sessionStore = SessionStore(context)
    private val json = Json {
        ignoreUnknownKeys = true
    }

    private val client = HttpClient {
        install(ContentNegotiation) {
            json(json)
        }
    }

    suspend fun signIn(email: String, password: String): Result<AuthSession> = runCatching {
        val session = client.post("${AppConfig.SUPABASE_URL}/auth/v1/token?grant_type=password") {
            contentType(ContentType.Application.Json)
            header("apikey", AppConfig.SUPABASE_PUBLISHABLE_KEY)
            setBody(SignInRequest(email = email, password = password))
        }.body<AuthSession>()
        sessionStore.saveSession(session)
        session
    }

    suspend fun currentSession(): AuthSession? = sessionStore.readSession()
        ?.let { sessionStore.toAuthSession(it) }

    suspend fun validAccessToken(): String? {
        val persisted: PersistedSession = sessionStore.readSession() ?: return null
        if (sessionStore.nowEpochSeconds() * 1000 < persisted.expiresAtEpochMs - 30_000) {
            return persisted.accessToken
        }

        val current = sessionStore.toAuthSession(persisted)
        if (current.expiresInSeconds > 30) {
            return current.accessToken
        }

        return try {
            val refreshed = client.post("${AppConfig.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token") {
                contentType(ContentType.Application.Json)
                header("apikey", AppConfig.SUPABASE_PUBLISHABLE_KEY)
                setBody(RefreshRequest(current.refreshToken))
            }.body<AuthSession>()
            sessionStore.saveSession(refreshed)
            refreshed.accessToken
        } catch (_: ClientRequestException) {
            sessionStore.clear()
            null
        }
    }

    suspend fun signOut() {
        sessionStore.clear()
    }
}
