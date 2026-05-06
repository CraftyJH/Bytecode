package dev.bytecode.android.ui.state

import dev.bytecode.android.data.model.BackendUserState
import dev.bytecode.android.data.model.BillingState
import dev.bytecode.android.data.model.OnboardingProfile

sealed interface AppUiState {
    data object Loading : AppUiState
    data object Welcome : AppUiState
    data class Onboarding(
        val step: Int = 0,
        val profile: OnboardingProfile = OnboardingProfile(),
    ) : AppUiState
    data class LoggedOut(
        val loading: Boolean = false,
        val error: String? = null,
    ) : AppUiState
    data class LoggedIn(
        val user: BackendUserState,
        val billing: BillingState?,
    ) : AppUiState
    data class Error(val message: String) : AppUiState
}
