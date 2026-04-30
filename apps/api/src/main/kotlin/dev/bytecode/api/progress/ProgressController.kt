package dev.bytecode.api.progress

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/progress")
class ProgressController(
    private val userService: UserService,
    private val jdbc: JdbcTemplate,
) {

    /** Returns all completed lesson slugs for the authenticated user. */
    @GetMapping
    fun getProgress(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<ProgressResponse> {
        val user = userService.findOrCreate(jwt)
        val slugs = jdbc.queryForList(
            """
            SELECT l.slug FROM user_progress up
            JOIN lessons l ON l.id = up.lesson_id
            WHERE up.user_id = ?
            ORDER BY l."order"
            """.trimIndent(),
            String::class.java,
            user.id,
        )
        return ResponseEntity.ok(ProgressResponse(slugs))
    }

    /** Mark a lesson complete. Idempotent. */
    @PostMapping("/{lessonSlug}")
    fun markComplete(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable lessonSlug: String,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        val lessonId = resolveLessonId(lessonSlug) ?: return ResponseEntity.notFound().build()
        jdbc.update(
            """
            INSERT INTO user_progress (user_id, lesson_id)
            VALUES (?, ?)
            ON CONFLICT (user_id, lesson_id) DO NOTHING
            """.trimIndent(),
            user.id,
            lessonId,
        )
        return ResponseEntity.noContent().build()
    }

    /** Unmark a lesson complete. */
    @DeleteMapping("/{lessonSlug}")
    fun unmarkComplete(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable lessonSlug: String,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        val lessonId = resolveLessonId(lessonSlug) ?: return ResponseEntity.notFound().build()
        jdbc.update(
            "DELETE FROM user_progress WHERE user_id = ? AND lesson_id = ?",
            user.id,
            lessonId,
        )
        return ResponseEntity.noContent().build()
    }

    private fun resolveLessonId(slug: String): UUID? =
        runCatching {
            jdbc.queryForObject(
                "SELECT id FROM lessons WHERE slug = ?",
                UUID::class.java,
                slug,
            )
        }.getOrNull()
}

data class ProgressResponse(val completedLessonSlugs: List<String>)
