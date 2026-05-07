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

private val BADGE_CATALOG: List<BadgeResponse> = listOf(
    // Streaks
    BadgeResponse("streak-3",   "3-Day Streak",    "Solve a challenge 3 days in a row",    "Streaks",    1, false),
    BadgeResponse("streak-7",   "Week Warrior",    "Solve a challenge 7 days in a row",    "Streaks",    2, false),
    BadgeResponse("streak-30",  "Monthly Grind",   "Solve a challenge 30 days in a row",   "Streaks",    3, false),
    BadgeResponse("streak-100", "Centurion",       "Solve a challenge 100 days in a row",  "Streaks",    5, false),
    // Challenges
    BadgeResponse("solve-1",    "First Blood",     "Solve your very first challenge",       "Challenges", 1, false),
    BadgeResponse("solve-10",   "Ten Down",        "Solve 10 challenges",                  "Challenges", 2, false),
    BadgeResponse("solve-50",   "Half Century",    "Solve 50 challenges",                  "Challenges", 3, false),
    BadgeResponse("solve-100",  "Centurion Coder", "Solve 100 challenges",                 "Challenges", 4, false),
    BadgeResponse("solve-500",  "Elite Coder",     "Solve 500 challenges",                 "Challenges", 5, false),
    // Difficulty
    BadgeResponse("diff-easy",   "Getting Started", "Solve your first Easy challenge",     "Difficulty", 1, false),
    BadgeResponse("diff-med",    "Stepping Up",     "Solve your first Intermediate challenge", "Difficulty", 2, false),
    BadgeResponse("diff-hard",   "Hard Mode",       "Solve your first Hard challenge",     "Difficulty", 3, false),
    // Speed
    BadgeResponse("speed-5",    "Quick Draw",      "Solve a challenge in under 5 minutes", "Speed",      2, false),
    BadgeResponse("speed-1",    "One Minute Hero", "Solve a challenge in under 1 minute",  "Speed",      4, false),
    // Social
    BadgeResponse("duel-1",     "First Duel",      "Complete your first duel",             "Social",     1, false),
    BadgeResponse("duel-win",   "Duel Champion",   "Win a duel",                           "Social",     2, false),
    BadgeResponse("friend-1",   "Team Player",     "Add your first friend",                "Social",     1, false),
    // XP
    BadgeResponse("xp-1000",    "Thousand Points", "Earn 1,000 total XP",                 "XP",         2, false),
    BadgeResponse("xp-10000",   "XP Legend",       "Earn 10,000 total XP",                "XP",         4, false),
)

data class BadgesUiState(
    val badges: List<BadgeResponse> = BADGE_CATALOG,
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
            val token = when (val r = authRepo.validAccessTokenResult()) {
                is AuthRepository.AccessTokenResult.Success -> r.accessToken
                else -> {
                    _uiState.update { it.copy(isLoading = false, error = "Session expired. Please sign in again.") }
                    return@launch
                }
            }
            badgeRepo.fetchBadges(token)
                .onSuccess { earned ->
                    val earnedById = earned.associateBy { it.id }
                    val merged = BADGE_CATALOG.map { catalogBadge ->
                        earnedById[catalogBadge.id] ?: catalogBadge
                    }
                    // Append any server-side badges not in the local catalog
                    val catalogIds = BADGE_CATALOG.map { it.id }.toSet()
                    val extras = earned.filter { it.id !in catalogIds }
                    _uiState.update { it.copy(isLoading = false, badges = merged + extras) }
                }
                .onFailure { err ->
                    // Silently keep catalog — don't wipe what we have with an error
                    _uiState.update { it.copy(isLoading = false, error = err.message) }
                }
        }
    }

    fun selectBadge(id: String?) {
        _uiState.update { it.copy(selectedBadgeId = id) }
    }
}
