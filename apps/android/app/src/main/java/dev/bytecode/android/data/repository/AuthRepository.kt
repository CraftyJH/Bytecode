package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.AuthSession
import dev.bytecode.android.data.model.PersistedSession
import dev.bytecode.android.data.model.RefreshRequest
import dev.bytecode.android.data.model.SignInRequest
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ResponseException
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.HttpStatusCode
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

    sealed interface AccessTokenResult {
        data class Success(val accessToken: String) : AccessTokenResult
        data object MissingSession : AccessTokenResult
        data object SessionExpired : AccessTokenResult
        data class NetworkError(val message: String) : AccessTokenResult
        data class UnknownError(val message: String) : AccessTokenResult
    }

    suspend fun signIn(email: String, password: String): Result<AuthSession> =
        runCatching {
            val session = client.post("${AppConfig.SUPABASE_URL}/auth/v1/token?grant_type=password") {
                contentType(ContentType.Application.Json)
                header("apikey", AppConfig.SUPABASE_PUBLISHABLE_KEY)
                setBody(SignInRequest(email = email, password = password))
            }.body<AuthSession>()
            sessionStore.saveSession(session)
            session
        }.recoverCatching { throwable ->
            throw mapAuthError(throwable)
        }

    suspend fun currentSession(): AuthSession? = sessionStore.readSession()
        ?.let { sessionStore.toAuthSession(it) }

    suspend fun validAccessTokenResult(): AccessTokenResult {
        val persisted: PersistedSession = sessionStore.readSession() ?: return AccessTokenResult.MissingSession
        if (sessionStore.nowEpochMs() < persisted.expiresAtEpochMs - 30_000) {
            return AccessTokenResult.Success(persisted.accessToken)
        }

        val current = sessionStore.toAuthSession(persisted)
        if (current.expiresInSeconds > 30) {
            return AccessTokenResult.Success(current.accessToken)
        }

        return try {
            val refreshed = client.post("${AppConfig.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token") {
                contentType(ContentType.Application.Json)
                header("apikey", AppConfig.SUPABASE_PUBLISHABLE_KEY)
                setBody(RefreshRequest(current.refreshToken))
            }.body<AuthSession>()
            sessionStore.saveSession(refreshed)
            AccessTokenResult.Success(refreshed.accessToken)
        } catch (exception: ClientRequestException) {
            sessionStore.clear()
            if (exception.response.status == HttpStatusCode.Unauthorized ||
                exception.response.status == HttpStatusCode.BadRequest
            ) {
                AccessTokenResult.SessionExpired
            } else {
                AccessTokenResult.NetworkError(
                    "Could not refresh session (${exception.response.status.value}).",
                )
            }
        } catch (exception: ResponseException) {
            AccessTokenResult.NetworkError(
                "Session refresh failed (${exception.response.status.value}).",
            )
        } catch (exception: Exception) {
            AccessTokenResult.UnknownError(
                exception.message ?: "Session refresh failed due to an unknown error.",
            )
        }
    }

    suspend fun validAccessToken(): String? =
        when (val result = validAccessTokenResult()) {
            is AccessTokenResult.Success -> result.accessToken
            else -> null
        }

    suspend fun signOut() {
        sessionStore.clear()
    }

    private fun mapAuthError(throwable: Throwable): Throwable {
        if (throwable is ClientRequestException) {
            return when (throwable.response.status) {
                HttpStatusCode.BadRequest,
                HttpStatusCode.Unauthorized,
                HttpStatusCode.Forbidden,
                -> IllegalStateException("Invalid email or password.")
                else -> IllegalStateException(
                    "Sign-in failed (${throwable.response.status.value}). Please try again.",
                )
            }
        }
        if (throwable is ResponseException) {
            return IllegalStateException(
                "Authentication request failed (${throwable.response.status.value}).",
            )
        }
        return IllegalStateException(
            throwable.message ?: "Authentication failed due to an unknown error.",
        )
    }
}
