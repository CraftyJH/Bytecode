package dev.bytecode.api.user

import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class UserService(private val repo: UserRepository) {

    @Transactional
    fun findOrCreate(jwt: Jwt): UserEntity {
        val supabaseId = UUID.fromString(jwt.subject)
        val email = jwt.getClaimAsString("email") ?: error("JWT missing email claim")

        return repo.findById(supabaseId).orElseGet {
            repo.save(
                UserEntity(
                    id = supabaseId,
                    email = email,
                    name = jwt.getClaimAsString("user_metadata.name"),
                )
            )
        }
    }

    @Transactional
    fun updateProfile(user: UserEntity, name: String?): UserEntity {
        user.name = name
        return repo.save(user)
    }
}
