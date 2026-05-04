package dev.bytecode.api.billing

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/users/me/billing")
class BillingController(
    private val billingService: BillingService,
) {
    @GetMapping
    fun getBillingStatus(
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<BillingStatusResponse> {
        val userId = UUID.fromString(jwt.subject)
        val status = billingService.getBillingStatus(userId) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(status)
    }
}
