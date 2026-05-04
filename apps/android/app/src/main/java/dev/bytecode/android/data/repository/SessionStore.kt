package dev.bytecode.android.data.repository

import android.content.Context
import androidx.core.content.edit
import dev.bytecode.android.data.model.AuthSession
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
        prefs.edit { clear() }
    }

    fun nowEpochMs(): Long = System.currentTimeMillis()

    companion object {
        private const val PREF_NAME = "bytecode_session"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_EXPIRES_AT_MS = "expires_at_ms"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_EMAIL = "user_email"
    }
}
