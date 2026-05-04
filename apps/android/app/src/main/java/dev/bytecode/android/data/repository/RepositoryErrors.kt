package dev.bytecode.android.data.repository

sealed class RepositoryFailure(message: String) : IllegalStateException(message) {
    data object AuthExpired : RepositoryFailure("Session expired. Please sign in again.")
    data object PremiumRequired : RepositoryFailure("Premium required for this lesson.")
    data class Http(
        val statusCode: Int,
        private val detail: String,
    ) : RepositoryFailure(detail)
    data class Network(
        private val detail: String,
    ) : RepositoryFailure(detail)
}
