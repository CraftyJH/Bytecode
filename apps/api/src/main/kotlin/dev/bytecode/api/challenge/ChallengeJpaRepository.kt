package dev.bytecode.api.challenge

import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

interface ChallengeJpaRepository : JpaRepository<ChallengeEntity, String> {
    fun findByReleaseDate(date: LocalDate): ChallengeEntity?
}
