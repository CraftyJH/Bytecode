package dev.bytecode.android.ui.solution

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.SharedSolutionDto
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.SocialRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class SolutionUiState(
    val solutions: List<SharedSolutionDto> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
)

class SolutionViewModel(
    application: Application,
    private val socialRepository: SocialRepository,
    private val authRepository: AuthRepository,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(SolutionUiState())
    val uiState: StateFlow<SolutionUiState> = _uiState.asStateFlow()

    fun loadSolutions(challengeId: String) {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch
            socialRepository.fetchSolutions(challengeId, token).fold(
                onSuccess = { list -> _uiState.update { it.copy(solutions = list) } },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun upvote(challengeId: String, submissionId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            socialRepository.upvoteSolution(challengeId, submissionId, token).fold(
                onSuccess = {
                    _uiState.update { s ->
                        s.copy(solutions = s.solutions.map { sol ->
                            if (sol.submissionId == submissionId) sol.copy(upvotes = sol.upvotes + 1, hasUpvoted = true) else sol
                        })
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    fun removeUpvote(challengeId: String, submissionId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            socialRepository.removeUpvote(challengeId, submissionId, token).fold(
                onSuccess = {
                    _uiState.update { s ->
                        s.copy(solutions = s.solutions.map { sol ->
                            if (sol.submissionId == submissionId) sol.copy(upvotes = (sol.upvotes - 1).coerceAtLeast(0), hasUpvoted = false) else sol
                        })
                    }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    private suspend fun resolveToken(): String? {
        return when (val r = authRepository.validAccessTokenResult()) {
            is AuthRepository.AccessTokenResult.Success -> r.accessToken
            else -> {
                _uiState.update { it.copy(isLoading = false, error = "Session expired. Please sign in again.") }
                null
            }
        }
    }
}
