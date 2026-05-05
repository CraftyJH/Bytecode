package dev.bytecode.api.curriculum

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface TrackRepository : JpaRepository<TrackEntity, UUID> {
    fun findBySlug(slug: String): TrackEntity?

    @Query("SELECT t FROM TrackEntity t ORDER BY t.order ASC")
    fun findAllOrdered(): List<TrackEntity>
}

interface ModuleRepository : JpaRepository<ModuleEntity, UUID> {
    @Query("""
        SELECT m FROM ModuleEntity m
        JOIN m.track t
        WHERE t.slug = :trackSlug AND m.slug = :moduleSlug
    """)
    fun findByTrackSlugAndModuleSlug(
        @Param("trackSlug") trackSlug: String,
        @Param("moduleSlug") moduleSlug: String,
    ): ModuleEntity?
}

interface LessonRepository : JpaRepository<LessonEntity, UUID> {
    fun findBySlug(slug: String): LessonEntity?
}
