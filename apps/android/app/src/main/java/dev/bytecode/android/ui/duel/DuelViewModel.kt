package dev.bytecode.android.ui.duel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.DuelDto
import dev.bytecode.android.data.model.FriendDto
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.LeaderboardRepository
import dev.bytecode.android.data.repository.SocialRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class DuelUiState(
    val pendingDuels: List<DuelDto> = emptyList(),
    val activeDuels: List<DuelDto> = emptyList(),
    val completedDuels: List<DuelDto> = emptyList(),
    val friends: List<FriendDto> = emptyList(),
    val isLoading: Boolean = false,
    val isChallenging: Boolean = false,
    val error: String? = null,
    val actionMessage: String? = null,
)

class DuelViewModel(
    application: Application,
    private val socialRepository: SocialRepository,
    private val leaderboardRepository: LeaderboardRepository,
    private val authRepository: AuthRepository,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(DuelUiState())
    val uiState: StateFlow<DuelUiState> = _uiState.asStateFlow()

    fun load() {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch
            socialRepository.fetchDuels(token).fold(
                onSuccess = { duels ->
                    _uiState.update { s ->
                        s.copy(
                            pendingDuels = duels.filter { it.status == "pending" },
                            activeDuels = duels.filter { it.status == "active" },
                            completedDuels = duels.filter { it.status == "completed" },
                        )
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            leaderboardRepository.fetchFriendsList(token).fold(
                onSuccess = { resp -> _uiState.update { it.copy(friends = resp) } },
                onFailure = { /* non-critical */ },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun challengeFriend(opponentId: String, challengeId: String) {
        if (_uiState.value.isChallenging) return
        viewModelScope.launch {
            _uiState.update { it.copy(isChallenging = true, error = null, actionMessage = null) }
            val token = resolveToken() ?: return@launch
            socialRepository.challengeFriend(opponentId, challengeId, token).fold(
                onSuccess = { resp ->
                    _uiState.update { it.copy(actionMessage = resp.message) }
                    load()
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isChallenging = false) }
        }
    }

    fun acceptDuel(duelId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            socialRepository.acceptDuel(duelId, token).fold(
                onSuccess = { resp ->
                    _uiState.update { s ->
                        val duel = s.pendingDuels.find { it.id == duelId } ?: return@update s
                        s.copy(
                            pendingDuels = s.pendingDuels.filter { it.id != duelId },
                            activeDuels = s.activeDuels + duel.copy(status = "active"),
                            actionMessage = resp.message,
                        )
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    fun declineDuel(duelId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            socialRepository.declineDuel(duelId, token).fold(
                onSuccess = { resp ->
                    _uiState.update { s ->
                        s.copy(
                            pendingDuels = s.pendingDuels.filter { it.id != duelId },
                            actionMessage = resp.message,
                        )
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    fun clearActionMessage() {
        _uiState.update { it.copy(actionMessage = null) }
    }

    private suspend fun resolveToken(): String? {
        return when (val r = authRepository.validAccessTokenResult()) {
            is AuthRepository.AccessTokenResult.Success -> r.accessToken
            else -> {
                _uiState.update { it.copy(isLoading = false, isChallenging = false, error = "Session expired. Please sign in again.") }
                null
            }
        }
    }
}
