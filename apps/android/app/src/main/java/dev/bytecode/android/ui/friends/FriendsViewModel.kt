package dev.bytecode.android.ui.friends

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.FriendDto
import dev.bytecode.android.data.model.PendingRequestDto
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.LeaderboardRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class FriendsUiState(
    val friends: List<FriendDto> = emptyList(),
    val incomingRequests: List<PendingRequestDto> = emptyList(),
    val outgoingRequests: List<PendingRequestDto> = emptyList(),
    val isLoading: Boolean = false,
    val isSending: Boolean = false,
    val error: String? = null,
    val actionMessage: String? = null,
    val handleInput: String = "",
)

class FriendsViewModel(
    application: Application,
    private val leaderboardRepository: LeaderboardRepository,
    private val authRepository: AuthRepository,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(FriendsUiState())
    val uiState: StateFlow<FriendsUiState> = _uiState.asStateFlow()

    fun load() {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch

            val friendsResult = leaderboardRepository.fetchFriendsList(token)
            val pendingResult = leaderboardRepository.fetchPending(token)

            friendsResult.fold(
                onSuccess = { friends -> _uiState.update { it.copy(friends = friends) } },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            pendingResult.fold(
                onSuccess = { pending ->
                    _uiState.update {
                        it.copy(
                            incomingRequests = pending.incoming,
                            outgoingRequests = pending.outgoing,
                        )
                    }
                },
                onFailure = { /* non-critical */ },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun updateHandleInput(value: String) {
        _uiState.update { it.copy(handleInput = value, actionMessage = null, error = null) }
    }

    fun sendRequest() {
        val handle = _uiState.value.handleInput.trim()
        if (handle.isBlank() || _uiState.value.isSending) return
        viewModelScope.launch {
            _uiState.update { it.copy(isSending = true, error = null, actionMessage = null) }
            val token = resolveToken() ?: return@launch
            leaderboardRepository.sendFriendRequest(handle, token).fold(
                onSuccess = { resp ->
                    _uiState.update { it.copy(handleInput = "", actionMessage = resp.message) }
                    load()
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isSending = false) }
        }
    }

    fun acceptRequest(requesterId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            leaderboardRepository.acceptFriendRequest(requesterId, token).fold(
                onSuccess = { load() },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    fun removeFriend(userId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            leaderboardRepository.removeFriend(userId, token).fold(
                onSuccess = { load() },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    fun clearMessage() {
        _uiState.update { it.copy(actionMessage = null, error = null) }
    }

    private suspend fun resolveToken(): String? {
        return when (val r = authRepository.validAccessTokenResult()) {
            is AuthRepository.AccessTokenResult.Success -> r.accessToken
            else -> {
                _uiState.update { it.copy(isLoading = false, isSending = false, error = "Session expired.") }
                null
            }
        }
    }
}
