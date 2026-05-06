package dev.bytecode.api.challenge

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/challenges")
class ChallengeController(
    private val challengeService: ChallengeService,
    private val userService: UserService,
) {
    @GetMapping("/today")
    fun getToday(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<ChallengeDto> {
        val challenge = challengeService.getToday()
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(challengeService.toDto(challenge))
    }

    @PostMapping("/{id}/submit")
    fun submit(
        @PathVariable id: String,
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody body: SubmitRequest,
    ): ResponseEntity<SubmitResponse> {
        val challenge = challengeService.repo.findById(id).orElse(null)
            ?: return ResponseEntity.notFound().build()
        val user = userService.findOrCreate(jwt)
        return ResponseEntity.ok(challengeService.submit(challenge, user, body.sourceCode, body.language, body.shareOnSubmit))
    }
}
