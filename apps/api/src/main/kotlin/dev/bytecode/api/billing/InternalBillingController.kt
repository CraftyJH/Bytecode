package dev.bytecode.api.billing

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
@RequestMapping("/api/internal/billing")
class InternalBillingController(
    private val billingService: BillingService,
    @Value("\${internal.billing.sync-token:}")
    private val syncToken: String,
) {
    @PostMapping("/status")
    fun getStatus(
        @RequestHeader(name = "X-Bytecode-Internal-Token", required = false) providedToken: String?,
        @RequestParam(name = "userId", required = true) userId: UUID,
    ): ResponseEntity<BillingStatusResponse> {
        if (syncToken.isBlank() || providedToken != syncToken) {
            return ResponseEntity.status(403).build()
        }
        val status = billingService.getBillingStatus(userId) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(status)
    }

    @PostMapping("/expired-grace")
    fun getExpiredGrace(
        @RequestHeader(name = "X-Bytecode-Internal-Token", required = false) providedToken: String?,
        @RequestParam(name = "at", required = false) at: Instant?,
    ): ResponseEntity<List<ExpiredGraceRecord>> {
        if (syncToken.isBlank() || providedToken != syncToken) {
            return ResponseEntity.status(403).build()
        }
        val records = billingService.getExpiredGraceSubscriptions(at ?: Instant.now())
        return ResponseEntity.ok(records)
    }

    @PostMapping("/resolve")
    fun resolveUser(
        @RequestHeader(name = "X-Bytecode-Internal-Token", required = false) providedToken: String?,
        @RequestParam(name = "stripeCustomerId", required = false) stripeCustomerId: String?,
        @RequestParam(name = "stripeSubscriptionId", required = false) stripeSubscriptionId: String?,
    ): ResponseEntity<InternalResolveResponse> {
        if (syncToken.isBlank() || providedToken != syncToken) {
            return ResponseEntity.status(403).build()
        }
        val userId = billingService.resolveUserIdByStripe(
            stripeCustomerId = stripeCustomerId,
            stripeSubscriptionId = stripeSubscriptionId,
        )
        return ResponseEntity.ok(
            InternalResolveResponse(
                ok = true,
                userId = userId,
            )
        )
    }

    @PostMapping("/sync")
    fun syncSubscription(
        @RequestHeader(name = "X-Bytecode-Internal-Token", required = false) providedToken: String?,
        @RequestBody request: InternalSubscriptionSyncRequest,
    ): ResponseEntity<InternalSyncResponse> {
        if (syncToken.isBlank() || providedToken != syncToken) {
            return ResponseEntity.status(403).build()
        }
        val response = billingService.applyInternalSync(request)
        return ResponseEntity.ok(response)
    }
}
