package dev.bytecode.android.ui.discussion

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.DiscussionPostDto
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.SocialRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class DiscussionUiState(
    val posts: List<DiscussionPostDto> = emptyList(),
    val isLoading: Boolean = false,
    val body: String = "",
    val isSending: Boolean = false,
    val error: String? = null,
)

class DiscussionViewModel(
    application: Application,
    private val socialRepository: SocialRepository,
    private val authRepository: AuthRepository,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(DiscussionUiState())
    val uiState: StateFlow<DiscussionUiState> = _uiState.asStateFlow()

    fun loadPosts(challengeId: String) {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch
            socialRepository.fetchDiscussion(challengeId, token).fold(
                onSuccess = { posts -> _uiState.update { it.copy(posts = posts) } },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun updateBody(text: String) {
        _uiState.update { it.copy(body = text) }
    }

    fun postMessage(challengeId: String) {
        val body = _uiState.value.body.trim()
        if (body.isBlank() || _uiState.value.isSending) return
        viewModelScope.launch {
            _uiState.update { it.copy(isSending = true, error = null) }
            val token = resolveToken() ?: return@launch
            socialRepository.postDiscussion(challengeId, body, token).fold(
                onSuccess = { post ->
                    _uiState.update { it.copy(posts = it.posts + post, body = "") }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isSending = false) }
        }
    }

    fun deletePost(challengeId: String, postId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            socialRepository.deletePost(challengeId, postId, token).fold(
                onSuccess = { _uiState.update { it.copy(posts = it.posts.filter { p -> p.id != postId }) } },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
        }
    }

    fun upvotePost(challengeId: String, postId: String) {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            socialRepository.upvotePost(challengeId, postId, token).fold(
                onSuccess = {
                    _uiState.update { s ->
                        s.copy(posts = s.posts.map { p -> if (p.id == postId) p.copy(upvotes = p.upvotes + 1) else p })
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
                _uiState.update { it.copy(isLoading = false, isSending = false, error = "Session expired. Please sign in again.") }
                null
            }
        }
    }
}
