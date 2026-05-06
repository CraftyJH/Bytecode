package dev.bytecode.api.execution

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

@Component
class Judge0Client(
    @Value("\${judge0.api-url}") private val apiUrl: String,
    @Value("\${judge0.api-host}") private val apiHost: String,
    @Value("\${judge0.api-key}") private val apiKey: String,
) {
    private val http: RestClient by lazy {
        RestClient.builder()
            .baseUrl(apiUrl)
            .defaultHeader("X-RapidAPI-Key", apiKey)
            .defaultHeader("X-RapidAPI-Host", apiHost)
            .build()
    }

    fun submit(sourceCode: String, languageId: Int): String {
        val body = mapOf(
            "source_code" to sourceCode,
            "language_id" to languageId,
        )
        val response = http.post()
            .uri("/submissions?base64_encoded=false&wait=false")
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(TokenResponse::class.java)!!
        return response.token
    }

    fun poll(token: String): Judge0Result {
        repeat(15) {
            val r = http.get()
                .uri("/submissions/$token?base64_encoded=false")
                .retrieve()
                .body(SubmissionResponse::class.java)!!
            val statusId = r.status?.id ?: 0
            if (statusId >= 3) {
                return Judge0Result(
                    statusId = statusId,
                    statusDescription = r.status?.description ?: "Unknown",
                    stdout = r.stdout,
                    stderr = r.stderr,
                    compileOutput = r.compileOutput,
                    timeMs = r.time?.toDoubleOrNull()?.let { (it * 1000).toInt() },
                    memoryKb = r.memory,
                )
            }
            Thread.sleep(800)
        }
        error("Judge0 timed out for token $token")
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class TokenResponse(val token: String = "")

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class SubmissionResponse(
        val status: StatusResponse? = null,
        val stdout: String? = null,
        val stderr: String? = null,
        @JsonProperty("compile_output") val compileOutput: String? = null,
        val time: String? = null,
        val memory: Int? = null,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class StatusResponse(val id: Int = 0, val description: String = "")
}

data class Judge0Result(
    val statusId: Int,
    val statusDescription: String,
    val stdout: String?,
    val stderr: String?,
    val compileOutput: String?,
    val timeMs: Int?,
    val memoryKb: Int?,
) {
    val accepted: Boolean get() = statusId == 3
    val compileError: Boolean get() = statusId == 6
}
