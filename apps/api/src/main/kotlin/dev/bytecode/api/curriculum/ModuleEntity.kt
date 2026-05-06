package dev.bytecode.api.curriculum

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "modules")
class ModuleEntity(

    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "track_id", nullable = false)
    val track: TrackEntity,

    val slug: String,

    val title: String,

    @Column(name = "`order`")
    val order: Int,

    val description: String? = null,

    @Column(name = "is_premium")
    val isPremium: Boolean = false,

    @OneToMany(mappedBy = "module", fetch = FetchType.LAZY)
    @OrderBy("`order` ASC")
    val lessons: List<LessonEntity> = emptyList(),
)
