package dev.bytecode.api.execution

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component

@Component
class Grader(
    private val judge0Client: Judge0Client,
    private val objectMapper: ObjectMapper,
) {
    fun grade(challengeId: String, userCode: String): GradeResult {
        val spec = loadSpec(challengeId)
        val source = buildMain(spec, userCode)

        val token = judge0Client.submit(source, spec.languageId)
        val result = judge0Client.poll(token)

        if (result.compileError) {
            return GradeResult(
                isCorrect = false,
                visibleResults = spec.testCases.filter { it.visible }.map { tc ->
                    TestCaseResult(id = tc.id, passed = false, expected = tc.expected, actual = null, error = "Compile error")
                },
                hiddenPass = 0,
                hiddenTotal = spec.testCases.count { !it.visible },
                runtimeMs = null,
                memoryKb = null,
                compileError = result.compileOutput,
            )
        }

        val outputs = parseOutputs(result.stdout.orEmpty())

        val visibleResults = spec.testCases.filter { it.visible }.map { tc ->
            val raw = outputs[tc.id]
            val isErr = raw?.startsWith("ERR:") == true
            val passed = !isErr && raw?.trim() == tc.expected.trim()
            TestCaseResult(
                id = tc.id,
                passed = passed,
                expected = tc.expected,
                actual = if (isErr) null else raw,
                error = if (isErr) raw?.removePrefix("ERR:") else null,
            )
        }

        val hiddenPassed = spec.testCases.filter { !it.visible }.count { tc ->
            val raw = outputs[tc.id]
            raw?.startsWith("ERR:") == false && raw.trim() == tc.expected.trim()
        }

        return GradeResult(
            isCorrect = visibleResults.all { it.passed } && hiddenPassed == spec.testCases.count { !it.visible },
            visibleResults = visibleResults,
            hiddenPass = hiddenPassed,
            hiddenTotal = spec.testCases.count { !it.visible },
            runtimeMs = result.timeMs,
            memoryKb = result.memoryKb,
            compileError = null,
        )
    }

    private fun buildMain(spec: ChallengeSpec, userCode: String): String = buildString {
        appendLine(spec.preamble)
        appendLine()
        appendLine(userCode)
        appendLine()
        appendLine("public class Main {")
        appendLine("    public static void main(String[] args) {")
        for (tc in spec.testCases) {
            appendLine("""        try { System.out.println("${tc.id}:" + (${tc.call})); } catch(Exception e) { System.out.println("${tc.id}:ERR:"+e.getMessage()); }""")
        }
        appendLine("    }")
        appendLine("}")
    }

    private fun parseOutputs(stdout: String): Map<String, String> = buildMap {
        for (line in stdout.lines()) {
            val idx = line.indexOf(':')
            if (idx > 0) put(line.substring(0, idx), line.substring(idx + 1))
        }
    }

    private fun loadSpec(challengeId: String): ChallengeSpec {
        val resource = ClassPathResource("tests/$challengeId.json")
        return objectMapper.readValue(resource.inputStream)
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class ChallengeSpec(
    val challengeId: String,
    val languageId: Int,
    val preamble: String,
    val testCases: List<TestCaseSpec>,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class TestCaseSpec(
    val id: String,
    val visible: Boolean,
    val call: String,
    val expected: String,
)

data class GradeResult(
    val isCorrect: Boolean,
    val visibleResults: List<TestCaseResult>,
    val hiddenPass: Int,
    val hiddenTotal: Int,
    val runtimeMs: Int?,
    val memoryKb: Int?,
    val compileError: String?,
)

data class TestCaseResult(
    val id: String,
    val passed: Boolean,
    val expected: String,
    val actual: String?,
    val error: String?,
)
