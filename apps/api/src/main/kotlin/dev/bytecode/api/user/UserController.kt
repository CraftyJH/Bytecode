package dev.bytecode.api.user

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<UserResponse> {
        val user = userService.findOrCreate(jwt)
        return ResponseEntity.ok(user.toResponse())
    }

    @PatchMapping("/me")
    fun updateMe(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestBody body: UpdateProfileRequest,
    ): ResponseEntity<UserResponse> {
        val user = userService.findOrCreate(jwt)
        val updated = userService.updateProfile(user, body.name)
        return ResponseEntity.ok(updated.toResponse())
    }
}

data class UpdateProfileRequest(val name: String?)

data class UserResponse(
    val id: String,
    val email: String,
    val name: String?,
    val avatarUrl: String?,
    val createdAt: Instant,
    val premiumUntil: Instant?,
    val streakCount: Int,
    val isFoundingMember: Boolean,
    val role: String,
)

fun UserEntity.toResponse() = UserResponse(
    id = id.toString(),
    email = email,
    name = name,
    avatarUrl = avatarUrl,
    createdAt = createdAt,
    premiumUntil = premiumUntil,
    streakCount = streakCount,
    isFoundingMember = isFoundingMember,
    role = role.name.lowercase(),
)
