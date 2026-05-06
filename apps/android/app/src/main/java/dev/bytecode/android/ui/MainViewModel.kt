package dev.bytecode.android.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.OnboardingProfile
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.RepositoryFailure
import dev.bytecode.android.data.repository.SessionStore
import dev.bytecode.android.data.repository.UserRepository
import dev.bytecode.android.ui.state.AppUiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel(
    application: Application,
    private val authRepository: AuthRepository,
    private val userRepository: UserRepository,
    private val sessionStore: SessionStore,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow<AppUiState>(AppUiState.Loading)
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

    private val sessionExpiredMessage = "Session expired. Please sign in again."

    init {
        bootstrap()
    }

    private fun bootstrap() {
        viewModelScope.launch {
            if (!sessionStore.hasSeenWelcome()) {
                _uiState.value = AppUiState.Welcome
                return@launch
            }
            when (val r = authRepository.validAccessTokenResult()) {
                is AuthRepository.AccessTokenResult.Success -> refreshWithToken(r.accessToken)
                is AuthRepository.AccessTokenResult.MissingSession ->
                    if (sessionStore.isOnboardingComplete()) _uiState.value = AppUiState.LoggedOut()
                    else _uiState.value = AppUiState.Onboarding(profile = sessionStore.readOnboardingProfile())
                is AuthRepository.AccessTokenResult.SessionExpired ->
                    if (sessionStore.isOnboardingComplete()) _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                    else _uiState.value = AppUiState.Onboarding(profile = sessionStore.readOnboardingProfile())
                is AuthRepository.AccessTokenResult.NetworkError ->
                    if (sessionStore.isOnboardingComplete()) _uiState.value = AppUiState.LoggedOut(error = r.message)
                    else _uiState.value = AppUiState.Onboarding(profile = sessionStore.readOnboardingProfile())
                is AuthRepository.AccessTokenResult.UnknownError ->
                    if (sessionStore.isOnboardingComplete()) _uiState.value = AppUiState.LoggedOut(error = r.message)
                    else _uiState.value = AppUiState.Onboarding(profile = sessionStore.readOnboardingProfile())
            }
        }
    }

    fun completeWelcome() {
        sessionStore.markWelcomeSeen()
        if (sessionStore.isOnboardingComplete()) refresh()
        else _uiState.value = AppUiState.Onboarding(profile = sessionStore.readOnboardingProfile())
    }

    fun onboardingNext(profile: OnboardingProfile, step: Int) {
        _uiState.value = AppUiState.Onboarding(step = (step + 1).coerceAtMost(3), profile = profile)
    }

    fun onboardingBack(profile: OnboardingProfile, step: Int) {
        _uiState.value = AppUiState.Onboarding(step = (step - 1).coerceAtLeast(0), profile = profile)
    }

    fun completeOnboarding(profile: OnboardingProfile) {
        sessionStore.saveOnboardingProfile(profile)
        refresh()
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = AppUiState.LoggedOut(loading = true)
            authRepository.signIn(email, password)
                .onSuccess { refresh() }
                .onFailure { _uiState.value = AppUiState.LoggedOut(error = it.message ?: "Unable to sign in.") }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
            _uiState.value = AppUiState.LoggedOut()
        }
    }

    fun refresh() {
        viewModelScope.launch {
            when (val r = authRepository.validAccessTokenResult()) {
                is AuthRepository.AccessTokenResult.Success -> refreshWithToken(r.accessToken)
                is AuthRepository.AccessTokenResult.MissingSession -> _uiState.value = AppUiState.LoggedOut()
                is AuthRepository.AccessTokenResult.SessionExpired -> _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                is AuthRepository.AccessTokenResult.NetworkError -> _uiState.value = AppUiState.LoggedOut(error = r.message)
                is AuthRepository.AccessTokenResult.UnknownError -> _uiState.value = AppUiState.LoggedOut(error = r.message)
            }
        }
    }

    private suspend fun refreshWithToken(token: String) {
        _uiState.value = AppUiState.Loading
        val profileResult = userRepository.fetchProfile(token)
        val billingResult = userRepository.fetchBilling(token)

        val profile = profileResult.getOrNull()
        if (profile == null) {
            val err = profileResult.exceptionOrNull()
            if (err is RepositoryFailure.AuthExpired) {
                authRepository.signOut()
                _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                return
            }
            _uiState.value = AppUiState.Error(err?.message ?: "Unable to load profile")
            return
        }
        if (billingResult.exceptionOrNull() is RepositoryFailure.AuthExpired) {
            authRepository.signOut()
            _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
            return
        }
        _uiState.value = AppUiState.LoggedIn(user = profile, billing = billingResult.getOrNull())
    }
}
