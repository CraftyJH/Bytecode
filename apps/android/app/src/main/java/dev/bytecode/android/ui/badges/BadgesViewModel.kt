package dev.bytecode.android.ui.badges

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.BadgeResponse
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.BadgeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class BadgesUiState(
    val badges: List<BadgeResponse> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val selectedBadgeId: String? = null,
)

class BadgesViewModel(
    app: Application,
    private val badgeRepo: BadgeRepository,
    private val authRepo: AuthRepository,
) : AndroidViewModel(app) {

    private val _uiState = MutableStateFlow(BadgesUiState())
    val uiState: StateFlow<BadgesUiState> = _uiState.asStateFlow()

    fun load() {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = authRepo.validAccessTokenResult().getOrNull()
            if (token == null) {
                _uiState.update { it.copy(isLoading = false, error = "Session expired. Please sign in again.") }
                return@launch
            }
            badgeRepo.fetchBadges(token)
                .onSuccess { badges ->
                    _uiState.update { it.copy(isLoading = false, badges = badges) }
                }
                .onFailure { err ->
                    _uiState.update { it.copy(isLoading = false, error = err.message ?: "Unknown error") }
                }
        }
    }

    fun selectBadge(id: String?) {
        _uiState.update { it.copy(selectedBadgeId = id) }
    }
}
