package dev.bytecode.api.social

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "league_assignments")
class LeagueAssignmentEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "league_id", nullable = false)
    val leagueId: UUID,

    @Column(nullable = false)
    var tier: String = "bronze",

    @Column(name = "iso_week", nullable = false)
    val isoWeek: String,

    @Column(name = "week_xp", nullable = false)
    var weekXp: Int = 0,

    @Column(name = "rank_in_league")
    var rankInLeague: Int? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),
)
