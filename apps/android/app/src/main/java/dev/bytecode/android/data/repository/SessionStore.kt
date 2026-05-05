package dev.bytecode.android.data.repository

import android.content.Context
import androidx.core.content.edit
import dev.bytecode.android.data.model.AuthSession
import dev.bytecode.android.data.model.MobileRuntimeConfig
import dev.bytecode.android.data.model.PersistedSession
import dev.bytecode.android.data.model.UserSummary

class SessionStore(context: Context) {
    private val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    fun saveSession(session: AuthSession) {
        prefs.edit {
            putString(KEY_ACCESS_TOKEN, session.accessToken)
            putString(KEY_REFRESH_TOKEN, session.refreshToken)
            putLong(KEY_EXPIRES_AT_MS, System.currentTimeMillis() + (session.expiresInSeconds * 1000))
            putString(KEY_USER_ID, session.user.id)
            putString(KEY_USER_EMAIL, session.user.email.orEmpty())
        }
    }

    fun readSession(): PersistedSession? {
        val access = prefs.getString(KEY_ACCESS_TOKEN, null) ?: return null
        val refresh = prefs.getString(KEY_REFRESH_TOKEN, null) ?: return null
        val expiresAtMs = prefs.getLong(KEY_EXPIRES_AT_MS, 0L)
        val userId = prefs.getString(KEY_USER_ID, null) ?: return null
        val userEmail = prefs.getString(KEY_USER_EMAIL, "").orEmpty().ifBlank { null }

        return PersistedSession(
            accessToken = access,
            refreshToken = refresh,
            expiresAtEpochMs = expiresAtMs,
            userId = userId,
            userEmail = userEmail,
        )
    }

    fun toAuthSession(session: PersistedSession): AuthSession {
        val remainingSeconds = ((session.expiresAtEpochMs - nowEpochMs()) / 1000).coerceAtLeast(0L)
        return AuthSession(
            accessToken = session.accessToken,
            refreshToken = session.refreshToken,
            expiresInSeconds = remainingSeconds,
            tokenType = "bearer",
            user = UserSummary(
                id = session.userId,
                email = session.userEmail,
            ),
        )
    }

    fun clear() {
        prefs.edit {
            remove(KEY_ACCESS_TOKEN)
            remove(KEY_REFRESH_TOKEN)
            remove(KEY_EXPIRES_AT_MS)
            remove(KEY_USER_ID)
            remove(KEY_USER_EMAIL)
        }
    }

    fun saveMobileRuntimeConfig(config: MobileRuntimeConfig) {
        prefs.edit {
            putString(KEY_MOBILE_SUPABASE_URL, config.supabaseUrl)
            putString(KEY_MOBILE_SUPABASE_PUBLISHABLE_KEY, config.supabasePublishableKey)
            putString(KEY_MOBILE_BYTECODE_API_URL, config.bytecodeApiUrl)
            putString(KEY_MOBILE_WEB_BASE_URL, config.webBaseUrl)
        }
    }

    fun hasSeenWelcome(): Boolean = prefs.getBoolean(KEY_HAS_SEEN_WELCOME, false)

    fun markWelcomeSeen() {
        prefs.edit { putBoolean(KEY_HAS_SEEN_WELCOME, true) }
    }

    fun readMobileRuntimeConfig(): MobileRuntimeConfig? {
        val supabaseUrl = prefs.getString(KEY_MOBILE_SUPABASE_URL, null) ?: return null
        val supabasePublishableKey = prefs.getString(KEY_MOBILE_SUPABASE_PUBLISHABLE_KEY, null) ?: return null
        val bytecodeApiUrl = prefs.getString(KEY_MOBILE_BYTECODE_API_URL, null) ?: return null
        val webBaseUrl = prefs.getString(KEY_MOBILE_WEB_BASE_URL, null) ?: return null
        return MobileRuntimeConfig(
            supabaseUrl = supabaseUrl,
            supabasePublishableKey = supabasePublishableKey,
            bytecodeApiUrl = bytecodeApiUrl,
            webBaseUrl = webBaseUrl,
        )
    }

    fun nowEpochMs(): Long = System.currentTimeMillis()

    companion object {
        private const val PREF_NAME = "bytecode_session"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_EXPIRES_AT_MS = "expires_at_ms"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_MOBILE_SUPABASE_URL = "mobile_supabase_url"
        private const val KEY_MOBILE_SUPABASE_PUBLISHABLE_KEY = "mobile_supabase_publishable_key"
        private const val KEY_MOBILE_BYTECODE_API_URL = "mobile_bytecode_api_url"
        private const val KEY_MOBILE_WEB_BASE_URL = "mobile_web_base_url"
        private const val KEY_HAS_SEEN_WELCOME = "has_seen_welcome"
    }
}
