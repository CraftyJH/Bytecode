package dev.bytecode.api.curriculum

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "exercises")
class ExerciseEntity(

    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    val lesson: LessonEntity,

    @Column(columnDefinition = "TEXT", nullable = false)
    val prompt: String,

    @Column(name = "starter_code", columnDefinition = "TEXT")
    val starterCode: String? = null,

    // Stored as raw JSON text; Android client parses it
    @Column(name = "test_cases_json", columnDefinition = "jsonb")
    val testCasesJson: String? = null,

    @Column(columnDefinition = "TEXT")
    val solution: String? = null,

    @Column(name = "runner_type")
    val runnerType: String = "stdin_stdout",
)
