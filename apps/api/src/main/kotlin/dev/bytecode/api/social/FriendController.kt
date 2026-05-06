package dev.bytecode.api.social

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/friends")
class FriendController(
    private val userService: UserService,
    private val friendService: FriendService,
) {

    @GetMapping
    fun list(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<List<FriendDto>> {
        val user = userService.findOrCreate(jwt)
        return ResponseEntity.ok(friendService.listFriends(user))
    }

    @GetMapping("/pending")
    fun pending(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<PendingResponse> {
        val user = userService.findOrCreate(jwt)
        return ResponseEntity.ok(
            PendingResponse(
                incoming = friendService.listPendingIncoming(user),
                outgoing = friendService.listPendingOutgoing(user),
            )
        )
    }

    @PostMapping("/request")
    fun sendRequest(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody body: FriendRequestBody,
    ): ResponseEntity<FriendActionResponse> {
        val user = userService.findOrCreate(jwt)
        return when (val result = friendService.sendRequest(user, body.handle.trim())) {
            FriendRequestResult.Sent -> ResponseEntity.ok(FriendActionResponse("sent", "Friend request sent."))
            FriendRequestResult.Accepted -> ResponseEntity.ok(FriendActionResponse("accepted", "Now friends."))
            FriendRequestResult.AlreadyFriends -> ResponseEntity.ok(FriendActionResponse("already_friends", "You are already friends."))
            FriendRequestResult.RequestAlreadySent -> ResponseEntity.ok(FriendActionResponse("pending", "Request already pending."))
            FriendRequestResult.UserNotFound -> ResponseEntity.status(404).body(FriendActionResponse("not_found", "User not found."))
            FriendRequestResult.CannotAddSelf -> ResponseEntity.badRequest().body(FriendActionResponse("self", "You cannot add yourself."))
        }
    }

    @PostMapping("/accept/{requesterId}")
    fun accept(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable requesterId: UUID,
    ): ResponseEntity<FriendActionResponse> {
        val user = userService.findOrCreate(jwt)
        return when (friendService.acceptRequest(user, requesterId)) {
            FriendRequestResult.Accepted -> ResponseEntity.ok(FriendActionResponse("accepted", "Friend request accepted."))
            else -> ResponseEntity.status(404).body(FriendActionResponse("not_found", "Pending request not found."))
        }
    }

    @DeleteMapping("/{userId}")
    fun remove(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable userId: UUID,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        return if (friendService.removeFriend(user, userId)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

data class FriendRequestBody(val handle: String)

data class FriendActionResponse(val status: String, val message: String)

data class PendingResponse(
    val incoming: List<PendingRequestDto>,
    val outgoing: List<PendingRequestDto>,
)
