package dev.bytecode.android.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.MobileLessonContent
import dev.bytecode.android.data.model.MobileCurriculumState
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.RepositoryFailure
import dev.bytecode.android.data.repository.UserRepository
import dev.bytecode.android.ui.state.AppUiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val authRepository = AuthRepository(application)
    private val userRepository = UserRepository(application)

    private val _uiState = MutableStateFlow<AppUiState>(AppUiState.Loading)
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

    private val sessionExpiredMessage = "Session expired. Please sign in again."

    init {
        bootstrap()
    }

    private fun bootstrap() {
        viewModelScope.launch {
            when (val tokenResult = authRepository.validAccessTokenResult()) {
                is AuthRepository.AccessTokenResult.Success -> {
                    refreshWithToken(tokenResult.accessToken)
                }
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
                _uiState.value = latestState.copy(
                    selectedLesson = lesson,
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
                    curriculumError = error.message ?: "Unable to load lesson.",
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
}
