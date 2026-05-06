package dev.bytecode.android.ui.challenge

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.ChallengeDto
import dev.bytecode.android.data.model.ChallengeSubmitResponse
import dev.bytecode.android.data.model.DailyLeaderboardResponse
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.ChallengeRepository
import dev.bytecode.android.data.repository.SessionStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ChallengeUiState(
    val challenge: ChallengeDto? = null,
    val code: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val submitResult: ChallengeSubmitResponse? = null,
    val isSubmitting: Boolean = false,
    val leaderboard: DailyLeaderboardResponse? = null,
    val leaderboardLoading: Boolean = false,
    val hasSolvedToday: Boolean = false,
    val shareOnSubmit: Boolean = false,
)

class ChallengeViewModel(
    application: Application,
    private val challengeRepository: ChallengeRepository,
    private val authRepository: AuthRepository,
    @Suppress("UNUSED_PARAMETER") sessionStore: SessionStore,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(ChallengeUiState())
    val uiState: StateFlow<ChallengeUiState> = _uiState.asStateFlow()

    fun loadToday() {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch
            challengeRepository.fetchToday(token).fold(
                onSuccess = { dto ->
                    _uiState.update { s ->
                        s.copy(
                            challenge = dto,
                            code = if (s.code.isBlank()) dto.starterCode else s.code,
                        )
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun loadLeaderboard() {
        if (_uiState.value.leaderboardLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(leaderboardLoading = true) }
            val token = resolveToken() ?: return@launch
            challengeRepository.fetchLeaderboard(token).fold(
                onSuccess = { lb -> _uiState.update { it.copy(leaderboard = lb) } },
                onFailure = { /* leaderboard failures are non-critical, ignore silently */ },
            )
            _uiState.update { it.copy(leaderboardLoading = false) }
        }
    }

    fun updateCode(code: String) {
        _uiState.update { it.copy(code = code) }
    }

    fun resetCode() {
        _uiState.update { it.copy(code = it.challenge?.starterCode ?: "", submitResult = null) }
    }

    fun toggleShareOnSubmit() {
        _uiState.update { it.copy(shareOnSubmit = !it.shareOnSubmit) }
    }

    fun submit() {
        if (_uiState.value.isSubmitting) return
        val challenge = _uiState.value.challenge ?: return
        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true, submitResult = null, error = null) }
            val token = resolveToken() ?: return@launch
            challengeRepository.submit(
                challengeId = challenge.id,
                sourceCode = _uiState.value.code,
                language = challenge.language,
                accessToken = token,
                shareOnSubmit = _uiState.value.shareOnSubmit,
            ).fold(
                onSuccess = { response ->
                    _uiState.update { it.copy(submitResult = response) }
                    if (response.isCorrect) {
                        _uiState.update { it.copy(hasSolvedToday = true) }
                        loadLeaderboard()
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isSubmitting = false) }
        }
    }

    fun clearSubmitResult() {
        _uiState.update { it.copy(submitResult = null) }
    }

    private suspend fun resolveToken(): String? {
        return when (val r = authRepository.validAccessTokenResult()) {
            is AuthRepository.AccessTokenResult.Success -> r.accessToken
            else -> {
                _uiState.update { it.copy(isLoading = false, isSubmitting = false, error = "Session expired. Please sign in again.") }
                null
            }
        }
    }
}
