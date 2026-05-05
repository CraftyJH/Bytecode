package dev.bytecode.android.data.repository

import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.AuthSession
import dev.bytecode.android.data.model.MobileRuntimeConfig
import dev.bytecode.android.data.model.PersistedSession
import dev.bytecode.android.data.model.RefreshRequest
import dev.bytecode.android.data.model.SignInRequest
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ResponseException
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.HttpHeaders
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

    private data class RuntimeAuthConfig(
        val supabaseUrl: String,
        val supabasePublishableKey: String,
    )

    suspend fun signIn(email: String, password: String): Result<AuthSession> =
        runCatching {
            val config = resolveAuthConfig()
            val session = client.post("${config.supabaseUrl}/auth/v1/token?grant_type=password") {
                contentType(ContentType.Application.Json)
                header("apikey", config.supabasePublishableKey)
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
            val config = resolveAuthConfig()
            val refreshed = client.post("${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token") {
                contentType(ContentType.Application.Json)
                header("apikey", config.supabasePublishableKey)
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

    private suspend fun resolveAuthConfig(): RuntimeAuthConfig {
        val bundledUrl = AppConfig.SUPABASE_URL.trim()
        val bundledKey = AppConfig.SUPABASE_PUBLISHABLE_KEY.trim()
        if (isLikelyRealSupabaseConfig(bundledUrl, bundledKey)) {
            return RuntimeAuthConfig(
                supabaseUrl = bundledUrl.removeSuffix("/"),
                supabasePublishableKey = bundledKey,
            )
        }

        val cached = sessionStore.readMobileRuntimeConfig()
        if (cached != null && isLikelyRealSupabaseConfig(cached.supabaseUrl, cached.supabasePublishableKey)) {
            return RuntimeAuthConfig(
                supabaseUrl = cached.supabaseUrl.removeSuffix("/"),
                supabasePublishableKey = cached.supabasePublishableKey,
            )
        }

        val fetched = fetchMobileClientConfig()
        if (fetched != null && isLikelyRealSupabaseConfig(fetched.supabaseUrl, fetched.supabasePublishableKey)) {
            sessionStore.saveMobileRuntimeConfig(fetched)
            return RuntimeAuthConfig(
                supabaseUrl = fetched.supabaseUrl.removeSuffix("/"),
                supabasePublishableKey = fetched.supabasePublishableKey,
            )
        }

        throw IllegalStateException(
            "Mobile auth config is not initialized yet. Please try again in a moment.",
        )
    }

    private suspend fun fetchMobileClientConfig(): MobileRuntimeConfig? =
        runCatching {
            client.get("${AppConfig.WEB_BASE_URL}/api/mobile/config") {
                header(HttpHeaders.Accept, ContentType.Application.Json.toString())
            }.body<MobileRuntimeConfig>()
        }.getOrNull()

    private fun isLikelyRealSupabaseConfig(url: String, key: String): Boolean {
        if (url.isBlank() || key.isBlank()) return false
        if (url.contains("example.supabase.co", ignoreCase = true)) return false
        if (!url.contains(".supabase.co", ignoreCase = true)) return false
        if (key.equals("placeholder", ignoreCase = true)) return false
        return true
    }
}
