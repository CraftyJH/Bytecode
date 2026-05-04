package dev.bytecode.android.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import dev.bytecode.android.data.model.MobileLessonContent
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
            val curriculumResult = userRepository.fetchCurriculum(token)

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
                curriculum = curriculumResult.getOrElse {
                    dev.bytecode.android.data.model.MobileCurriculumState()
                },
                curriculumError = curriculumResult.exceptionOrNull()?.message,
            )
        }
    }

    fun openLesson(trackSlug: String, moduleSlug: String, lessonSlug: String) {
        viewModelScope.launch {
            val currentState = _uiState.value as? AppUiState.LoggedIn ?: return@launch
            _uiState.value = currentState.copy(
                selectedTrackSlug = trackSlug,
                selectedModuleSlug = moduleSlug,
                selectedLessonSlug = lessonSlug,
                selectedLesson = null,
                curriculumError = null,
            )

            val token = authRepository.validAccessToken()
            if (token.isNullOrBlank()) {
                _uiState.value = AppUiState.LoggedOut
                return@launch
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
                _uiState.value = latestState.copy(
                    selectedLesson = lessonPlaceholderFromSelection(trackSlug, moduleSlug, lessonSlug),
                    curriculumError = error.message ?: "Unable to load lesson.",
                )
            }
        }
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
}
