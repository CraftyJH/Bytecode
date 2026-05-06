package dev.bytecode.api.submission

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "challenge_submissions")
class SubmissionEntity(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(name = "user_id") val userId: UUID,
    @Column(name = "challenge_id") val challengeId: String,
    val language: String,
    @Column(name = "source_code") val sourceCode: String,
    @Column(name = "is_correct") val isCorrect: Boolean,
    @Column(name = "visible_pass") val visiblePass: Int = 0,
    @Column(name = "hidden_pass") val hiddenPass: Int = 0,
    @Column(name = "hidden_total") val hiddenTotal: Int = 0,
    @Column(name = "runtime_ms") val runtimeMs: Int? = null,
    @Column(name = "memory_kb") val memoryKb: Int? = null,
    @Column(name = "byte_length") val byteLength: Int? = null,
    val shared: Boolean = false,
    @Column(name = "created_at") val createdAt: Instant = Instant.now(),
)
