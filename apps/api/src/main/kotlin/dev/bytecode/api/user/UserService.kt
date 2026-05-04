package dev.bytecode.api.user

import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.UUID

@Service
class UserService(private val repo: UserRepository) {

    @Transactional
    fun findOrCreate(jwt: Jwt): UserEntity {
        val supabaseId = UUID.fromString(jwt.subject)
        val email = jwt.getClaimAsString("email") ?: error("JWT missing email claim")

        val user = repo.findById(supabaseId).orElseGet {
            repo.save(
                UserEntity(
                    id = supabaseId,
                    email = email,
                    name = jwt.getClaimAsString("user_metadata.name"),
                )
            )
        }

        val streakDisabled = (jwt.getClaimAsMap("app_metadata")?.get("streak_disabled") as? Boolean) == true
        updateDailyStreak(user, streakDisabled)
        return repo.save(user)
    }

    @Transactional
    fun updateProfile(user: UserEntity, name: String?): UserEntity {
        user.name = name
        return repo.save(user)
    }

    private fun updateDailyStreak(user: UserEntity, streakDisabled: Boolean) {
        if (streakDisabled) return

        val now = ZonedDateTime.now(ZoneOffset.UTC)
        val today = now.toLocalDate()
        val lastActive = user.lastActiveAt?.atZone(ZoneOffset.UTC)?.toLocalDate()

        when {
            lastActive == null -> user.streakCount = 1
            lastActive == today -> {
                // already counted for today
            }
            lastActive.plusDays(1) == today -> user.streakCount += 1
            else -> user.streakCount = 1
        }

        user.lastActiveAt = now.toInstant()
    }
}
