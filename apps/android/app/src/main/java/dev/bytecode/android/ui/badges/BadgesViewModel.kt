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
    // ── Completion ──────────────────────────────────────────────────────────────
    BadgeResponse("solve-1",    "First Solve",      "Solve your very first challenge",      "Completion",          1, false),
    BadgeResponse("solve-10",   "Ten Down",         "Solve 10 challenges",                  "Completion",          2, false),
    BadgeResponse("solve-50",   "Half Century",     "Solve 50 challenges",                  "Completion",          3, false),
    BadgeResponse("solve-100",  "Centurion",        "Solve 100 challenges",                 "Completion",          4, false),
    BadgeResponse("solve-500",  "Elite Coder",      "Solve 500 challenges",                 "Completion",          5, false),
    // ── Difficulty Mastery ──────────────────────────────────────────────────────
    BadgeResponse("diff-easy",  "Easy Rider",       "Solve 50 Easy challenges",             "Difficulty Mastery",  2, false),
    BadgeResponse("diff-med",   "Intermediate Reader", "Solve 50 Intermediate challenges",  "Difficulty Mastery",  3, false),
    BadgeResponse("diff-hard",  "Hard Mode",        "Solve 50 Hard challenges",             "Difficulty Mastery",  4, false),
    // ── Category Mastery ────────────────────────────────────────────────────────
    BadgeResponse("cat-concurrency", "Concurrent Mind",   "Solve 25 Concurrency challenges", "Category Mastery",   3, false),
    BadgeResponse("cat-streams",     "Stream Surgeon",    "Solve 25 Streams challenges",     "Category Mastery",   3, false),
    BadgeResponse("cat-coroutines",  "Coroutine Captain", "Solve 25 Coroutine challenges",   "Category Mastery",   3, false),
    BadgeResponse("cat-compose",     "Compose Composer",  "Solve 25 Compose challenges",     "Category Mastery",   3, false),
    BadgeResponse("cat-spring",      "Spring in Step",    "Solve 25 Spring Boot challenges", "Category Mastery",   3, false),
    // ── Language ────────────────────────────────────────────────────────────────
    BadgeResponse("lang-bilingual",  "Bilingual",    "Solve 25 Java + 25 Kotlin challenges", "Language",           3, false),
    BadgeResponse("lang-idiom-diff", "Idiom Differ", "Complete 10 Java↔Kotlin paired solves","Language",           4, false),
    // ── Discovery ───────────────────────────────────────────────────────────────
    BadgeResponse("disc-oneliner",   "One-Liner",    "Submit a correct solution in ≤ 1 executable line", "Discovery", 3, false),
    BadgeResponse("disc-bughunter", "Bug Hunter",    "Correctly solve a Find-the-Bug challenge", "Discovery",        2, false),
    BadgeResponse("disc-speedread", "Speed Reader",  "Correctly solve a Hard challenge in < 30 seconds", "Discovery", 4, false),
    // ── Social ──────────────────────────────────────────────────────────────────
    BadgeResponse("soc-helpful",     "Helpful",      "Receive 10 upvotes on your shared solutions", "Social",        2, false),
    BadgeResponse("soc-mentor",      "Mentor",       "Have 5 of your solutions become top-voted", "Social",          4, false),
    BadgeResponse("soc-connected",   "Connected",    "Add 5 friends",                        "Social",              2, false),
    BadgeResponse("soc-league-climb","League Climber","Be promoted in 3 consecutive league weeks", "Social",         3, false),
    // ── Seasonal / Event ────────────────────────────────────────────────────────
    BadgeResponse("event-advent-2026","Advent 2026", "Participate in Advent of Bytecode 2026","Seasonal",           3, false),
    // ── Founding Member ─────────────────────────────────────────────────────────
    BadgeResponse("founding-day1",   "Day 1",        "Joined Bytecode on launch day",        "Founding Member",    5, false),
    BadgeResponse("founding-beta",   "Beta Hunter",  "Joined the closed beta and gave feedback", "Founding Member", 4, false),
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
                    val catalogIds = BADGE_CATALOG.map { it.id }.toSet()
                    val extras = earned.filter { it.id !in catalogIds }
                    _uiState.update { it.copy(isLoading = false, badges = merged + extras) }
                }
                .onFailure { err ->
                    // Keep catalog visible — silently note the error
                    _uiState.update { it.copy(isLoading = false, error = err.message) }
                }
        }
    }

    fun selectBadge(id: String?) {
        _uiState.update { it.copy(selectedBadgeId = id) }
    }
}
