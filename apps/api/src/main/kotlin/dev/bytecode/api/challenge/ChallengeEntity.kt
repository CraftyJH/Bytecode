package dev.bytecode.api.challenge

import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate

@Entity
@Table(name = "challenges")
class ChallengeEntity(
    @Id val id: String,
    @Column(name = "release_date") val releaseDate: LocalDate,
    val difficulty: String,
    val language: String,
    val type: String,
    val title: String,
    @Column(name = "base_xp") val baseXp: Int = 10,
    @Column(columnDefinition = "jsonb") val metadata: String = "{}",
    @Column(name = "created_at") val createdAt: Instant = Instant.now(),
)
