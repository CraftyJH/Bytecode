package dev.bytecode.api.curriculum

import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRole
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.Instant

@Service
class CurriculumService(
    private val tracks: TrackRepository,
    private val modules: ModuleRepository,
    private val lessons: LessonRepository,
) {

    @Transactional(readOnly = true)
    fun listTracks(): List<TrackSummary> =
        tracks.findAllOrdered().map { it.toSummary() }

    @Transactional(readOnly = true)
    fun getTrack(slug: String): TrackDetail =
        tracks.findBySlug(slug)?.toDetail()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found: $slug")

    @Transactional(readOnly = true)
    fun getModule(trackSlug: String, moduleSlug: String): ModuleDetail =
        modules.findByTrackSlugAndModuleSlug(trackSlug, moduleSlug)?.toDetail()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found: $trackSlug/$moduleSlug")

    @Transactional(readOnly = true)
    fun getLesson(slug: String, user: UserEntity): LessonDetail {
        val lesson = lessons.findBySlug(slug)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found: $slug")
        val hasAccess = !lesson.isPremium || user.hasPremiumAccess()
        return lesson.toDetail(hasAccess)
    }
}

private fun UserEntity.hasPremiumAccess(): Boolean {
    val until = premiumUntil
    return role == UserRole.PREMIUM || role == UserRole.AUTHOR || role == UserRole.STAFF
        || (until != null && until.isAfter(Instant.now()))
}
