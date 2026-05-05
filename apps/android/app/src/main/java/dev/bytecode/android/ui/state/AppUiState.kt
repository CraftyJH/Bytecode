package dev.bytecode.android.ui.state

import dev.bytecode.android.data.model.BackendUserState
import dev.bytecode.android.data.model.BillingState
import dev.bytecode.android.data.model.MobileCurriculumState
import dev.bytecode.android.data.model.MobileLessonContent
import dev.bytecode.android.data.model.MobileLessonSummary
import dev.bytecode.android.data.model.MobileModuleSummary
import dev.bytecode.android.data.model.MobileTrackSummary
import dev.bytecode.android.data.model.RunCodeResult

sealed interface AppUiState {
    data object Loading : AppUiState
    data object Welcome : AppUiState
    data class LoggedOut(
        val loading: Boolean = false,
        val error: String? = null,
    ) : AppUiState
    data class LoggedIn(
        val user: BackendUserState,
        val billing: BillingState?,
        val curriculum: MobileCurriculumState,
        val selectedTrackSlug: String? = null,
        val selectedModuleSlug: String? = null,
        val selectedLessonSlug: String? = null,
        val selectedLesson: MobileLessonContent? = null,
        val editorCode: String? = null,
        val editorRunning: Boolean = false,
        val editorResult: RunCodeResult? = null,
        val editorError: String? = null,
        val curriculumError: String? = null,
    ) : AppUiState
    data class Error(val message: String) : AppUiState
}

fun AppUiState.LoggedIn.selectedTrack(): MobileTrackSummary? =
    selectedTrackSlug?.let { slug -> curriculum.tracks.firstOrNull { it.slug == slug } }

fun AppUiState.LoggedIn.selectedModule(): MobileModuleSummary? =
    selectedTrack()
        ?.modules
        ?.firstOrNull { it.slug == selectedModuleSlug }

fun AppUiState.LoggedIn.selectedLessonSummary(): MobileLessonSummary? =
    selectedModule()
        ?.lessons
        ?.firstOrNull { it.slug == selectedLessonSlug }
