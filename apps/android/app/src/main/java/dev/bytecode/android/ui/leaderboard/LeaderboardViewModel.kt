package dev.bytecode.android.ui.leaderboard

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.FriendsBoardResponse
import dev.bytecode.android.data.model.MyRanksResponse
import dev.bytecode.android.data.model.RankedBoardResponse
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.LeaderboardRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class LeaderboardTab { PersonalBest, Friends, Weekly, Global, Java, Kotlin, Easy, Intermediate, Hard }

data class LeaderboardUiState(
    val activeTab: LeaderboardTab = LeaderboardTab.Weekly,
    val boards: Map<LeaderboardTab, RankedBoardResponse> = emptyMap(),
    val friendsBoard: FriendsBoardResponse? = null,
    val myRanks: MyRanksResponse? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
)

class LeaderboardViewModel(
    application: Application,
    private val leaderboardRepository: LeaderboardRepository,
    private val authRepository: AuthRepository,
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(LeaderboardUiState())
    val uiState: StateFlow<LeaderboardUiState> = _uiState.asStateFlow()

    fun selectTab(tab: LeaderboardTab) {
        _uiState.update { it.copy(activeTab = tab) }
        when {
            tab == LeaderboardTab.PersonalBest -> { /* data comes from myRanks, no separate fetch */ }
            tab == LeaderboardTab.Friends && _uiState.value.friendsBoard == null -> loadFriends()
            tab != LeaderboardTab.Friends && tab != LeaderboardTab.PersonalBest
                    && _uiState.value.boards[tab] == null -> loadBoard(tab)
        }
    }

    fun loadBoard(tab: LeaderboardTab = _uiState.value.activeTab) {
        if (tab == LeaderboardTab.PersonalBest || tab == LeaderboardTab.Friends) return
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch
            val result = when (tab) {
                LeaderboardTab.Global -> leaderboardRepository.fetchGlobal(token)
                LeaderboardTab.Weekly -> leaderboardRepository.fetchWeekly(token)
                LeaderboardTab.Java -> leaderboardRepository.fetchByLanguage("java", token)
                LeaderboardTab.Kotlin -> leaderboardRepository.fetchByLanguage("kotlin", token)
                LeaderboardTab.Easy -> leaderboardRepository.fetchByDifficulty("easy", token)
                LeaderboardTab.Intermediate -> leaderboardRepository.fetchByDifficulty("intermediate", token)
                LeaderboardTab.Hard -> leaderboardRepository.fetchByDifficulty("hard", token)
                else -> return@launch
            }
            result.fold(
                onSuccess = { board ->
                    _uiState.update { s -> s.copy(boards = s.boards + (tab to board)) }
                },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun loadMyRanks() {
        viewModelScope.launch {
            val token = resolveToken() ?: return@launch
            leaderboardRepository.fetchMyRanks(token).fold(
                onSuccess = { ranks -> _uiState.update { it.copy(myRanks = ranks) } },
                onFailure = { /* non-critical */ },
            )
        }
    }

    fun selectInitialTab(hasFriends: Boolean) {
        val preferred = if (hasFriends) LeaderboardTab.Friends else LeaderboardTab.Weekly
        selectTab(preferred)
    }

    private fun loadFriends() {
        if (_uiState.value.isLoading) return
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = resolveToken() ?: return@launch
            leaderboardRepository.fetchFriends(token).fold(
                onSuccess = { board -> _uiState.update { it.copy(friendsBoard = board) } },
                onFailure = { t -> _uiState.update { it.copy(error = t.message) } },
            )
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun refresh() {
        val tab = _uiState.value.activeTab
        _uiState.update { s ->
            val newBoards = s.boards.toMutableMap().apply { remove(tab) }
            s.copy(boards = newBoards, friendsBoard = if (tab == LeaderboardTab.Friends) null else s.friendsBoard)
        }
        loadBoard(tab)
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
