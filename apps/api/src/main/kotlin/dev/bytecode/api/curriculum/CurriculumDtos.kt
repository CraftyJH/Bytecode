package dev.bytecode.api.curriculum

import java.util.UUID

data class TrackSummary(
    val slug: String,
    val title: String,
    val order: Int,
    val description: String?,
    val moduleCount: Int,
)

data class TrackDetail(
    val slug: String,
    val title: String,
    val order: Int,
    val description: String?,
    val modules: List<ModuleSummary>,
)

data class ModuleSummary(
    val slug: String,
    val title: String,
    val order: Int,
    val isPremium: Boolean,
    val lessonCount: Int,
)

data class ModuleDetail(
    val slug: String,
    val title: String,
    val order: Int,
    val isPremium: Boolean,
    val lessons: List<LessonSummary>,
)

data class LessonSummary(
    val slug: String,
    val title: String,
    val order: Int,
    val isPremium: Boolean,
    val estimatedMinutes: Int?,
)

data class LessonDetail(
    val slug: String,
    val title: String,
    val order: Int,
    val isPremium: Boolean,
    val estimatedMinutes: Int?,
    val bodyMdx: String?,
    val exercises: List<ExerciseDto>,
    val quizItems: List<QuizItemDto>,
)

data class ExerciseDto(
    val id: UUID,
    val prompt: String,
    val starterCode: String?,
    val testCasesJson: String?,
    val runnerType: String,
)

data class QuizItemDto(
    val id: UUID,
    val position: String,
    val type: String,
    val payloadJson: String,
    val explanation: String?,
    val difficulty: String,
)

// ── Mappers ──────────────────────────────────────────────────────────────────

fun TrackEntity.toSummary() = TrackSummary(
    slug = slug,
    title = title,
    order = order,
    description = description,
    moduleCount = modules.size,
)

fun TrackEntity.toDetail() = TrackDetail(
    slug = slug,
    title = title,
    order = order,
    description = description,
    modules = modules.map { it.toSummary() },
)

fun ModuleEntity.toSummary() = ModuleSummary(
    slug = slug,
    title = title,
    order = order,
    isPremium = isPremium,
    lessonCount = lessons.size,
)

fun ModuleEntity.toDetail() = ModuleDetail(
    slug = slug,
    title = title,
    order = order,
    isPremium = isPremium,
    lessons = lessons.map { it.toSummary() },
)

fun LessonEntity.toSummary() = LessonSummary(
    slug = slug,
    title = title,
    order = order,
    isPremium = isPremium,
    estimatedMinutes = estimatedMinutes,
)

fun LessonEntity.toDetail(hasAccess: Boolean) = LessonDetail(
    slug = slug,
    title = title,
    order = order,
    isPremium = isPremium,
    estimatedMinutes = estimatedMinutes,
    bodyMdx = if (hasAccess) bodyMdx else null,
    exercises = if (hasAccess) exercises.map { it.toDto() } else emptyList(),
    quizItems = if (hasAccess) quizItems.map { it.toDto() } else emptyList(),
)

fun ExerciseEntity.toDto() = ExerciseDto(
    id = id,
    prompt = prompt,
    starterCode = starterCode,
    testCasesJson = testCasesJson,
    runnerType = runnerType,
)

fun QuizItemEntity.toDto() = QuizItemDto(
    id = id,
    position = position,
    type = type,
    payloadJson = payloadJson,
    explanation = explanation,
    difficulty = difficulty,
)
