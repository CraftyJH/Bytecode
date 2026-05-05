package dev.bytecode.api.curriculum

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/curriculum")
class CurriculumController(
    private val curriculumService: CurriculumService,
    private val userService: UserService,
) {

    /** List all tracks with module counts. */
    @GetMapping
    fun listTracks(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<List<TrackSummary>> =
        ResponseEntity.ok(curriculumService.listTracks())

    /** Track detail — title, description, ordered module list. */
    @GetMapping("/tracks/{trackSlug}")
    fun getTrack(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable trackSlug: String,
    ): ResponseEntity<TrackDetail> =
        ResponseEntity.ok(curriculumService.getTrack(trackSlug))

    /** Module detail — ordered lesson list (no body content). */
    @GetMapping("/tracks/{trackSlug}/modules/{moduleSlug}")
    fun getModule(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable trackSlug: String,
        @PathVariable moduleSlug: String,
    ): ResponseEntity<ModuleDetail> =
        ResponseEntity.ok(curriculumService.getModule(trackSlug, moduleSlug))

    /**
     * Full lesson — body MDX, exercises, quizzes.
     * Returns bodyMdx/exercises/quizItems as null/empty for premium lessons
     * when the authenticated user does not have premium access.
     */
    @GetMapping("/lessons/{lessonSlug}")
    fun getLesson(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable lessonSlug: String,
    ): ResponseEntity<LessonDetail> {
        val user = userService.findOrCreate(jwt)
        return ResponseEntity.ok(curriculumService.getLesson(lessonSlug, user))
    }
}
