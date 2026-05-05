package dev.bytecode.api.curriculum

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "quiz_items")
class QuizItemEntity(

    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    val lesson: LessonEntity,

    // 'mid_lesson' | 'end_of_lesson' | 'end_of_module' | 'daily_challenge'
    val position: String,

    // 'multiple_choice' | 'fill_in_blank' | 'predict_output' | 'find_the_bug' | 'order_the_steps'
    val type: String,

    // Raw JSON; Android client parses it based on type
    @Column(name = "payload_json", columnDefinition = "jsonb", nullable = false)
    val payloadJson: String,

    val explanation: String? = null,

    val difficulty: String,
)
