package dev.bytecode.api.solution

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/challenges/{challengeId}/solutions")
class SolutionController(
    private val userService: UserService,
    private val solutionService: SolutionService,
) {

    @GetMapping
    fun list(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
    ): ResponseEntity<List<SharedSolutionDto>> {
        val user = userService.findOrCreate(jwt)
        return when (val result = solutionService.listShared(challengeId, user)) {
            is SolutionResult.Ok -> ResponseEntity.ok(result.value)
            SolutionResult.Locked -> ResponseEntity.status(403).build()
            else -> ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{submissionId}/upvote")
    fun upvote(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
        @PathVariable submissionId: UUID,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        return when (solutionService.upvote(submissionId, user)) {
            is SolutionResult.Ok -> ResponseEntity.noContent().build()
            SolutionResult.Locked -> ResponseEntity.status(403).build()
            SolutionResult.Forbidden -> ResponseEntity.status(403).build()
            else -> ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{submissionId}/upvote")
    fun removeUpvote(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
        @PathVariable submissionId: UUID,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        solutionService.removeUpvote(submissionId, user)
        return ResponseEntity.noContent().build()
    }
}
