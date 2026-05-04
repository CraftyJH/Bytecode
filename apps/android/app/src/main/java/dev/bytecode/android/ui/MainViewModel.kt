package dev.bytecode.android.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.UserRepository
import dev.bytecode.android.ui.state.AppUiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val authRepository = AuthRepository(application)
    private val userRepository = UserRepository()

    private val _uiState = MutableStateFlow<AppUiState>(AppUiState.Loading)
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

    init {
        bootstrap()
    }

    private fun bootstrap() {
        viewModelScope.launch {
            val token = authRepository.validAccessToken()
            if (token.isNullOrBlank()) {
                _uiState.value = AppUiState.LoggedOut
                return@launch
            }
            refresh()
        }
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = AppUiState.Loading
            val result = authRepository.signIn(email, password)
            result.onSuccess {
                refresh()
            }.onFailure { error ->
                _uiState.value = AppUiState.Error(error.message ?: "Unable to sign in")
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
            _uiState.value = AppUiState.LoggedOut
        }
    }

    fun refresh() {
        viewModelScope.launch {
            val token = authRepository.validAccessToken()
            if (token.isNullOrBlank()) {
                _uiState.value = AppUiState.LoggedOut
                return@launch
            }

            _uiState.value = AppUiState.Loading
            val profileResult = userRepository.fetchProfile(token)
            val billingResult = userRepository.fetchBilling(token)

            val profile = profileResult.getOrNull()
            if (profile == null) {
                _uiState.value = AppUiState.Error(
                    profileResult.exceptionOrNull()?.message ?: "Unable to load profile",
                )
                return@launch
            }

            _uiState.value = AppUiState.LoggedIn(
                user = profile,
                billing = billingResult.getOrNull(),
            )
        }
    }
}
