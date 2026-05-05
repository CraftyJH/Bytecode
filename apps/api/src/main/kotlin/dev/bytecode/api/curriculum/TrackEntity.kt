package dev.bytecode.api.curriculum

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "tracks")
class TrackEntity(

    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(unique = true, nullable = false)
    val slug: String,

    val title: String,

    @Column(name = "`order`")
    val order: Int,

    val description: String? = null,

    @OneToMany(mappedBy = "track", fetch = FetchType.LAZY)
    @OrderBy("\"order\" ASC")
    val modules: List<ModuleEntity> = emptyList(),
)
