package dev.bytecode.api.curriculum

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "lessons")
class LessonEntity(

    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    val module: ModuleEntity,

    @Column(unique = true, nullable = false)
    val slug: String,

    val title: String,

    @Column(name = "body_mdx", columnDefinition = "TEXT")
    val bodyMdx: String? = null,

    @Column(name = "`order`")
    val order: Int,

    @Column(name = "is_premium")
    val isPremium: Boolean = false,

    @Column(name = "estimated_minutes")
    val estimatedMinutes: Int? = null,

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
    val exercises: List<ExerciseEntity> = emptyList(),

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    val quizItems: List<QuizItemEntity> = emptyList(),
)
