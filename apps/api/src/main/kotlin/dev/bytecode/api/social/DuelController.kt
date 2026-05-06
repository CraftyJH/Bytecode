package dev.bytecode.api.social

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/duels")
class DuelController(
    private val userService: UserService,
    private val duelService: DuelService,
) {

    @GetMapping
    fun list(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<List<DuelDto>> {
        val user = userService.findOrCreate(jwt)
        return ResponseEntity.ok(duelService.listForUser(user))
    }

    @GetMapping("/{duelId}")
    fun get(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable duelId: UUID,
    ): ResponseEntity<DuelDto> {
        val user = userService.findOrCreate(jwt)
        return duelService.getById(user, duelId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @PostMapping("/challenge")
    fun challenge(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody body: ChallengeBody,
    ): ResponseEntity<DuelActionResponse> {
        val user = userService.findOrCreate(jwt)
        return when (val result = duelService.challenge(user, body.opponentId, body.challengeId)) {
            is DuelResult.Created -> ResponseEntity.ok(DuelActionResponse("created", "Duel challenge sent!", result.duelId.toString()))
            DuelResult.AlreadyExists -> ResponseEntity.ok(DuelActionResponse("exists", "A duel already exists for this challenge."))
            DuelResult.NotFriends -> ResponseEntity.status(403).body(DuelActionResponse("not_friends", "You can only duel friends."))
            else -> ResponseEntity.badRequest().body(DuelActionResponse("error", "Could not create duel."))
        }
    }

    @PostMapping("/{duelId}/accept")
    fun accept(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable duelId: UUID,
    ): ResponseEntity<DuelActionResponse> {
        val user = userService.findOrCreate(jwt)
        return when (duelService.accept(user, duelId)) {
            DuelResult.Accepted -> ResponseEntity.ok(DuelActionResponse("accepted", "Duel accepted! May the best coder win."))
            else -> ResponseEntity.status(404).body(DuelActionResponse("not_found", "Duel not found or already resolved."))
        }
    }

    @PostMapping("/{duelId}/decline")
    fun decline(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable duelId: UUID,
    ): ResponseEntity<DuelActionResponse> {
        val user = userService.findOrCreate(jwt)
        return when (duelService.decline(user, duelId)) {
            DuelResult.Declined -> ResponseEntity.ok(DuelActionResponse("declined", "Duel declined."))
            else -> ResponseEntity.status(404).body(DuelActionResponse("not_found", "Duel not found."))
        }
    }
}

data class ChallengeBody(val opponentId: UUID, val challengeId: String)
data class DuelActionResponse(val status: String, val message: String, val duelId: String? = null)
