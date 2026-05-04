package dev.bytecode.android.ui.state

import dev.bytecode.android.data.model.BackendUserState
import dev.bytecode.android.data.model.BillingState

sealed interface AppUiState {
    data object Loading : AppUiState
    data object LoggedOut : AppUiState
    data class LoggedIn(
        val user: BackendUserState,
        val billing: BillingState?,
    ) : AppUiState
    data class Error(val message: String) : AppUiState
}
