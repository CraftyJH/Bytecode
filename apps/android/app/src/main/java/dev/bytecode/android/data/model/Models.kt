package dev.bytecode.android.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class SignInRequest(
    val email: String,
    val password: String,
)

@Serializable
data class RefreshRequest(
    @SerialName("refresh_token")
    val refreshToken: String,
)

@Serializable
data class UserSummary(
    val id: String,
    val email: String? = null,
)

@Serializable
data class AuthSession(
    @SerialName("access_token")
    val accessToken: String,
    @SerialName("refresh_token")
    val refreshToken: String,
    @SerialName("expires_in")
    val expiresInSeconds: Long,
    @SerialName("token_type")
    val tokenType: String,
    val user: UserSummary,
)

@Serializable
data class PersistedSession(
    val accessToken: String,
    val refreshToken: String,
    val expiresAtEpochMs: Long,
    val userId: String,
    val userEmail: String?,
)

@Serializable
data class BackendUserState(
    val email: String? = null,
    val role: String = "user",
    @SerialName("premiumUntil")
    val premiumUntil: String? = null,
    @SerialName("streakCount")
    val streakCount: Int = 0,
)

@Serializable
data class BillingSubscriptionState(
    @SerialName("stripeCustomerId")
    val stripeCustomerId: String? = null,
    @SerialName("stripeSubscriptionId")
    val stripeSubscriptionId: String? = null,
    @SerialName("stripePriceId")
    val stripePriceId: String? = null,
    val status: String? = null,
    @SerialName("currentPeriodEnd")
    val currentPeriodEnd: String? = null,
    @SerialName("graceExpiresAt")
    val graceExpiresAt: String? = null,
    @SerialName("lastPaymentFailedAt")
    val lastPaymentFailedAt: String? = null,
    @SerialName("canceledAt")
    val canceledAt: String? = null,
    val plan: String? = null,
)

@Serializable
data class BillingState(
    @SerialName("userId")
    val userId: String,
    val plan: String,
    val role: String,
    @SerialName("premiumUntil")
    val premiumUntil: String? = null,
    val subscription: BillingSubscriptionState? = null,
)

@Serializable
data class MobileLessonSummary(
    val slug: String,
    val title: String,
    val order: Int,
    val duration: Int,
    val isPremium: Boolean,
    val isLocked: Boolean,
)

@Serializable
data class MobileModuleSummary(
    val slug: String,
    val title: String,
    val order: Int,
    val isPremium: Boolean,
    val isLocked: Boolean,
    val lessons: List<MobileLessonSummary> = emptyList(),
)

@Serializable
data class MobileTrackSummary(
    val slug: String,
    val title: String,
    val order: Int,
    val tagline: String,
    val isPremium: Boolean,
    val isLocked: Boolean,
    val modules: List<MobileModuleSummary> = emptyList(),
)

@Serializable
data class MobileCurriculumState(
    val isPremiumUser: Boolean = false,
    val tracks: List<MobileTrackSummary> = emptyList(),
)

@Serializable
data class MobileLessonTrackRef(
    val slug: String,
    val title: String,
)

@Serializable
data class MobileLessonModuleRef(
    val slug: String,
    val title: String,
)

@Serializable
data class MobileLessonMeta(
    val slug: String,
    val title: String,
    val duration: Int,
    val isPremium: Boolean,
)

@Serializable
data class MobileLessonContent(
    val track: MobileLessonTrackRef,
    val module: MobileLessonModuleRef,
    val lesson: MobileLessonMeta,
    val content: String,
)
