package dev.bytecode.android.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.MobileLessonContent
import dev.bytecode.android.data.model.MobileCurriculumState
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

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val authRepository = AuthRepository(application)
    private val userRepository = UserRepository(application)
    private val sessionStore = SessionStore(application)

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
            when (val tokenResult = authRepository.validAccessTokenResult()) {
                is AuthRepository.AccessTokenResult.Success -> {
                    refreshWithToken(tokenResult.accessToken)
                }
                is AuthRepository.AccessTokenResult.MissingSession -> {
                    if (sessionStore.isOnboardingComplete()) {
                        _uiState.value = AppUiState.LoggedOut()
                    } else {
                        _uiState.value = AppUiState.Onboarding(
                            step = 0,
                            profile = sessionStore.readOnboardingProfile(),
                        )
                    }
                }
                is AuthRepository.AccessTokenResult.SessionExpired -> {
                    if (sessionStore.isOnboardingComplete()) {
                        _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                    } else {
                        _uiState.value = AppUiState.Onboarding(
                            step = 0,
                            profile = sessionStore.readOnboardingProfile(),
                        )
                    }
                }
                is AuthRepository.AccessTokenResult.NetworkError -> {
                    if (sessionStore.isOnboardingComplete()) {
                        _uiState.value = AppUiState.LoggedOut(error = tokenResult.message)
                    } else {
                        _uiState.value = AppUiState.Onboarding(
                            step = 0,
                            profile = sessionStore.readOnboardingProfile(),
                        )
                    }
                }
                is AuthRepository.AccessTokenResult.UnknownError -> {
                    if (sessionStore.isOnboardingComplete()) {
                        _uiState.value = AppUiState.LoggedOut(error = tokenResult.message)
                    } else {
                        _uiState.value = AppUiState.Onboarding(
                            step = 0,
                            profile = sessionStore.readOnboardingProfile(),
                        )
                    }
                }
            }
        }
    }

    fun completeWelcome() {
        sessionStore.markWelcomeSeen()
        if (sessionStore.isOnboardingComplete()) {
            refresh()
        } else {
            _uiState.value = AppUiState.Onboarding(
                step = 0,
                profile = sessionStore.readOnboardingProfile(),
            )
        }
    }

    fun onboardingNext(updatedProfile: OnboardingProfile, currentStep: Int) {
        val nextStep = (currentStep + 1).coerceAtMost(3)
        _uiState.value = AppUiState.Onboarding(step = nextStep, profile = updatedProfile)
    }

    fun onboardingBack(updatedProfile: OnboardingProfile, currentStep: Int) {
        val previous = (currentStep - 1).coerceAtLeast(0)
        _uiState.value = AppUiState.Onboarding(step = previous, profile = updatedProfile)
    }

    fun completeOnboarding(profile: OnboardingProfile) {
        sessionStore.saveOnboardingProfile(profile)
        refresh()
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = AppUiState.LoggedOut(loading = true)
            val result = authRepository.signIn(email, password)
            result.onSuccess {
                refresh()
            }.onFailure { error ->
                _uiState.value = AppUiState.LoggedOut(
                    loading = false,
                    error = error.message ?: "Unable to sign in.",
                )
            }
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
            when (val tokenResult = authRepository.validAccessTokenResult()) {
                is AuthRepository.AccessTokenResult.Success -> refreshWithToken(tokenResult.accessToken)
                is AuthRepository.AccessTokenResult.MissingSession -> {
                    _uiState.value = AppUiState.LoggedOut()
                }
                is AuthRepository.AccessTokenResult.SessionExpired -> {
                    _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                }
                is AuthRepository.AccessTokenResult.NetworkError -> {
                    _uiState.value = AppUiState.LoggedOut(error = tokenResult.message)
                }
                is AuthRepository.AccessTokenResult.UnknownError -> {
                    _uiState.value = AppUiState.LoggedOut(error = tokenResult.message)
                }
            }
        }
    }

    private suspend fun refreshWithToken(token: String) {
        val previousLoggedIn = _uiState.value as? AppUiState.LoggedIn
        if (previousLoggedIn != null) {
            _uiState.value = previousLoggedIn.copy(curriculumError = null)
        } else {
            _uiState.value = AppUiState.Loading
        }
        val profileResult = userRepository.fetchProfile(token)
        val billingResult = userRepository.fetchBilling(token)
        val curriculumResult = userRepository.fetchCurriculum(token)

        val profile = profileResult.getOrNull()
        if (profile == null) {
            val profileError = profileResult.exceptionOrNull()
            if (profileError is RepositoryFailure.AuthExpired) {
                authRepository.signOut()
                _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                return
            }
            _uiState.value = AppUiState.Error(
                profileError?.message ?: "Unable to load profile",
            )
            return
        }

        val billingError = billingResult.exceptionOrNull()
        if (billingError is RepositoryFailure.AuthExpired) {
            authRepository.signOut()
            _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
            return
        }
        val curriculumError = curriculumResult.exceptionOrNull()
        if (curriculumError is RepositoryFailure.AuthExpired) {
            authRepository.signOut()
            _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
            return
        }

        val preservedSelection = previousLoggedIn?.let {
            SelectionSnapshot(
                trackSlug = it.selectedTrackSlug,
                moduleSlug = it.selectedModuleSlug,
                lessonSlug = it.selectedLessonSlug,
            )
        }
        _uiState.value = AppUiState.LoggedIn(
            user = profile,
            billing = billingResult.getOrNull(),
            curriculum = curriculumResult.getOrElse { MobileCurriculumState() },
            selectedTrackSlug = preservedSelection?.trackSlug,
            selectedModuleSlug = preservedSelection?.moduleSlug,
            selectedLessonSlug = preservedSelection?.lessonSlug,
            editorCode = previousLoggedIn?.editorCode,
            editorRunning = false,
            editorResult = previousLoggedIn?.editorResult,
            editorError = previousLoggedIn?.editorError,
            curriculumError = curriculumError?.message,
        )
        if (preservedSelection?.isComplete() == true) {
            openLesson(
                trackSlug = preservedSelection.trackSlug!!,
                moduleSlug = preservedSelection.moduleSlug!!,
                lessonSlug = preservedSelection.lessonSlug!!,
            )
        }
    }

    fun openLesson(trackSlug: String, moduleSlug: String, lessonSlug: String) {
        viewModelScope.launch {
            val currentState = _uiState.value as? AppUiState.LoggedIn ?: return@launch
            if (
                currentState.selectedTrackSlug == trackSlug &&
                currentState.selectedModuleSlug == moduleSlug &&
                currentState.selectedLessonSlug == lessonSlug &&
                currentState.selectedLesson != null
            ) {
                return@launch
            }
            val selectedState = currentState.copy(
                selectedTrackSlug = trackSlug,
                selectedModuleSlug = moduleSlug,
                selectedLessonSlug = lessonSlug,
                selectedLesson = null,
                editorCode = null,
                editorRunning = false,
                editorResult = null,
                editorError = null,
                curriculumError = null,
            )
            _uiState.value = selectedState

            val tokenResult = authRepository.validAccessTokenResult()
            val token = when (tokenResult) {
                is AuthRepository.AccessTokenResult.Success -> tokenResult.accessToken
                is AuthRepository.AccessTokenResult.MissingSession,
                is AuthRepository.AccessTokenResult.SessionExpired,
                -> {
                    authRepository.signOut()
                    _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                    return@launch
                }
                is AuthRepository.AccessTokenResult.NetworkError -> {
                    _uiState.value = selectedState.copy(curriculumError = tokenResult.message)
                    return@launch
                }
                is AuthRepository.AccessTokenResult.UnknownError -> {
                    _uiState.value = selectedState.copy(curriculumError = tokenResult.message)
                    return@launch
                }
            }

            val lessonResult = userRepository.fetchLesson(
                accessToken = token,
                trackSlug = trackSlug,
                moduleSlug = moduleSlug,
                lessonSlug = lessonSlug,
            )
            val latestState = _uiState.value as? AppUiState.LoggedIn ?: return@launch
            lessonResult.onSuccess { lesson ->
                val starterCode = lesson.lesson.starterCode
                    ?: if (lesson.lesson.language.equals("kotlin", ignoreCase = true)) {
                        "fun main() {\n    // write your code here\n}\n"
                    } else {
                        "public class Main {\n    public static void main(String[] args) {\n        // write your code here\n    }\n}"
                    }
                _uiState.value = latestState.copy(
                    selectedLesson = lesson,
                    editorCode = starterCode,
                    editorRunning = false,
                    editorResult = null,
                    editorError = null,
                    curriculumError = null,
                )
            }.onFailure { error ->
                if (error is RepositoryFailure.AuthExpired) {
                    authRepository.signOut()
                    _uiState.value = AppUiState.LoggedOut(error = sessionExpiredMessage)
                    return@onFailure
                }
                _uiState.value = latestState.copy(
                    selectedLesson = lessonPlaceholderFromSelection(trackSlug, moduleSlug, lessonSlug),
                    editorCode = null,
                    editorRunning = false,
                    editorResult = null,
                    editorError = null,
                    curriculumError = error.message ?: "Unable to load lesson.",
                )
            }
        }
    }

    fun updateEditorCode(code: String) {
        val currentState = _uiState.value as? AppUiState.LoggedIn ?: return
        _uiState.value = currentState.copy(
            editorCode = code,
            editorResult = null,
            editorError = null,
        )
    }

    fun resetEditorCode() {
        val currentState = _uiState.value as? AppUiState.LoggedIn ?: return
        val lesson = currentState.selectedLesson ?: return
        val starterCode = lesson.lesson.starterCode
            ?: if (lesson.lesson.language.equals("kotlin", ignoreCase = true)) {
                "fun main() {\n    // write your code here\n}\n"
            } else {
                "public class Main {\n    public static void main(String[] args) {\n        // write your code here\n    }\n}"
            }
        _uiState.value = currentState.copy(
            editorCode = starterCode,
            editorResult = null,
            editorError = null,
        )
    }

    fun runEditorCode() {
        viewModelScope.launch {
            val currentState = _uiState.value as? AppUiState.LoggedIn ?: return@launch
            val lesson = currentState.selectedLesson ?: return@launch
            val code = currentState.editorCode?.trim().orEmpty()
            if (code.isBlank()) {
                _uiState.value = currentState.copy(editorError = "Add some code before running.")
                return@launch
            }

            _uiState.value = currentState.copy(
                editorRunning = true,
                editorResult = null,
                editorError = null,
            )

            val runResult = userRepository.runCode(
                code = currentState.editorCode ?: "",
                language = lesson.lesson.language,
            )
            val latestState = _uiState.value as? AppUiState.LoggedIn ?: return@launch
            runResult.onSuccess { payload ->
                val expected = lesson.lesson.expectedOutput
                val passMessage = if (!expected.isNullOrBlank()) {
                    if (outputsMatch(payload.stdout, expected)) {
                        "Output matches expected result."
                    } else {
                        "Output does not match expected result yet."
                    }
                } else {
                    null
                }
                _uiState.value = latestState.copy(
                    editorRunning = false,
                    editorResult = payload,
                    editorError = passMessage,
                )
            }.onFailure { error ->
                _uiState.value = latestState.copy(
                    editorRunning = false,
                    editorResult = null,
                    editorError = error.message ?: "Run failed.",
                )
            }
        }
    }

    fun selectedLessonRouteOrNull(): String? {
        val state = _uiState.value as? AppUiState.LoggedIn ?: return null
        val track = state.selectedTrackSlug ?: return null
        val module = state.selectedModuleSlug ?: return null
        val lesson = state.selectedLessonSlug ?: return null
        return "$track::$module::$lesson"
    }

    fun clearLessonSelection() {
        val currentState = _uiState.value as? AppUiState.LoggedIn ?: return
        _uiState.value = currentState.copy(
            selectedTrackSlug = null,
            selectedModuleSlug = null,
            selectedLessonSlug = null,
            selectedLesson = null,
            editorCode = null,
            editorRunning = false,
            editorResult = null,
            editorError = null,
            curriculumError = null,
        )
    }

    private fun lessonPlaceholderFromSelection(
        trackSlug: String,
        moduleSlug: String,
        lessonSlug: String,
    ): MobileLessonContent? {
        val currentState = _uiState.value as? AppUiState.LoggedIn ?: return null
        val track = currentState.curriculum.tracks.firstOrNull { it.slug == trackSlug } ?: return null
        val module = track.modules.firstOrNull { it.slug == moduleSlug } ?: return null
        val lesson = module.lessons.firstOrNull { it.slug == lessonSlug } ?: return null
        return MobileLessonContent(
            track = dev.bytecode.android.data.model.MobileLessonTrackRef(
                slug = track.slug,
                title = track.title,
            ),
            module = dev.bytecode.android.data.model.MobileLessonModuleRef(
                slug = module.slug,
                title = module.title,
            ),
            lesson = dev.bytecode.android.data.model.MobileLessonMeta(
                slug = lesson.slug,
                title = lesson.title,
                duration = lesson.duration,
                isPremium = lesson.isPremium,
            ),
            content = "",
        )
    }

    private data class SelectionSnapshot(
        val trackSlug: String?,
        val moduleSlug: String?,
        val lessonSlug: String?,
    ) {
        fun isComplete(): Boolean = trackSlug != null && moduleSlug != null && lessonSlug != null
    }

    private fun outputsMatch(stdout: String, expectedOutput: String): Boolean {
        val got = stdout.trim()
        val expected = expectedOutput.trim()
        if (expected.contains("__any__")) {
            val lines = got.split("\n")
            val expectedLines = expected.split("\n")
            if (lines.size < 2 || expectedLines.isEmpty()) return false
            return lines[0].trim() == expectedLines[0].trim() && lines[1].trim().isNotEmpty()
        }
        return got == expected
    }
}
