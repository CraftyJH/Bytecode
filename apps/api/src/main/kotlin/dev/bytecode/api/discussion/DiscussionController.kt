package dev.bytecode.api.discussion

import dev.bytecode.api.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/challenges/{challengeId}/discuss")
class DiscussionController(
    private val userService: UserService,
    private val discussionService: DiscussionService,
) {

    @GetMapping
    fun list(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
    ): ResponseEntity<List<DiscussionPostDto>> {
        val user = userService.findOrCreate(jwt)
        return when (val result = discussionService.listPosts(challengeId, user)) {
            is DiscussionResult.Ok -> ResponseEntity.ok(result.value)
            DiscussionResult.Locked -> ResponseEntity.status(403).build()
            else -> ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun post(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
        @RequestBody body: PostBody,
    ): ResponseEntity<DiscussionPostDto> {
        val user = userService.findOrCreate(jwt)
        return when (val result = discussionService.addPost(challengeId, user, body.body)) {
            is DiscussionResult.Ok -> ResponseEntity.status(201).body(result.value)
            DiscussionResult.Locked -> ResponseEntity.status(403).build()
            DiscussionResult.Invalid -> ResponseEntity.badRequest().build()
            else -> ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/{postId}")
    fun delete(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
        @PathVariable postId: UUID,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        return when (discussionService.deletePost(postId, user)) {
            is DiscussionResult.Ok -> ResponseEntity.noContent().build()
            DiscussionResult.Forbidden -> ResponseEntity.status(403).build()
            else -> ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{postId}/upvote")
    fun upvote(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable challengeId: String,
        @PathVariable postId: UUID,
    ): ResponseEntity<Void> {
        val user = userService.findOrCreate(jwt)
        return when (discussionService.upvotePost(postId, user)) {
            is DiscussionResult.Ok -> ResponseEntity.noContent().build()
            DiscussionResult.Forbidden -> ResponseEntity.status(403).build()
            else -> ResponseEntity.notFound().build()
        }
    }
}

data class PostBody(val body: String)
