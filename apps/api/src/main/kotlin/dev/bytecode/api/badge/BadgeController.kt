package dev.bytecode.api.badge

import dev.bytecode.api.user.UserService
import org.springframework.http.CacheControl
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("/api/badges")
class BadgeController(
    private val badgeGrantRepo: BadgeGrantRepository,
    private val shareCardRenderer: ShareCardRenderer,
    private val userService: UserService,
) {

    @GetMapping
    fun listBadges(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<List<BadgeResponse>> {
        val user = userService.findOrCreate(jwt)
        val grants = badgeGrantRepo.findByUserId(user.id).associateBy { it.badgeId }

        val response = BadgeCatalog.all.map { badge ->
            val grant = grants[badge.id]
            BadgeResponse(
                id = badge.id,
                name = badge.name,
                description = badge.description,
                category = badge.category,
                dotTier = badge.dotTier,
                earned = grant != null,
                earnedAt = grant?.awardedAt?.toString(),
            )
        }

        return ResponseEntity.ok(response)
    }

    @GetMapping("/{badgeId}/share-card.png", produces = [MediaType.IMAGE_PNG_VALUE])
    fun shareCard(
        @PathVariable badgeId: String,
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<ByteArray> {
        val badge = BadgeCatalog.byId[badgeId]
            ?: return ResponseEntity.notFound().build()

        val user = userService.findOrCreate(jwt)
        if (!badgeGrantRepo.existsByUserIdAndBadgeId(user.id, badgeId)) {
            return ResponseEntity.status(403).build()
        }

        val png = shareCardRenderer.render(badge)
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
            .body(png)
    }
}

data class BadgeResponse(
    val id: String,
    val name: String,
    val description: String,
    val category: String,
    val dotTier: Int,
    val earned: Boolean,
    val earnedAt: String?,
)
