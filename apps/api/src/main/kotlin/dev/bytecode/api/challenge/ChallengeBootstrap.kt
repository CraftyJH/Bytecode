package dev.bytecode.api.challenge

import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class ChallengeBootstrap(
    private val challengeRepo: ChallengeJpaRepository,
    private val jdbc: JdbcTemplate,
) : ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        val today = LocalDate.now()
        upsert(
            id = "sample-easy-java",
            date = today,
            difficulty = "easy",
            language = "java",
            title = "Reverse a String",
            baseXp = 10,
            metadata = """
                {
                  "description": "Given a string, return it reversed. For example, \"hello\" becomes \"olleh\".",
                  "starterCode": "class Solution {\n    public String reverse(String s) {\n        // Your code here\n        return \"\";\n    }\n}",
                  "visibleExamples": [
                    {"input": "\"hello\"", "output": "\"olleh\""},
                    {"input": "\"world\"", "output": "\"dlrow\""},
                    {"input": "\"a\"", "output": "\"a\""}
                  ]
                }
            """.trimIndent(),
        )
        upsert(
            id = "sample-intermediate-java",
            date = today,
            difficulty = "intermediate",
            language = "java",
            title = "Fibonacci Number",
            baseXp = 15,
            metadata = """
                {
                  "description": "Return the nth Fibonacci number (0-indexed). fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, etc.",
                  "starterCode": "class Solution {\n    public int fib(int n) {\n        // Your code here\n        return 0;\n    }\n}",
                  "visibleExamples": [
                    {"input": "0", "output": "0"},
                    {"input": "1", "output": "1"},
                    {"input": "5", "output": "5", "explanation": "0,1,1,2,3,5"}
                  ]
                }
            """.trimIndent(),
        )
        upsert(
            id = "sample-hard-java",
            date = today,
            difficulty = "hard",
            language = "java",
            title = "Valid Parentheses",
            baseXp = 25,
            metadata = """
                {
                  "description": "Given a string of '(', ')', '{', '}', '[', ']', return true if every opener is closed in the correct order.",
                  "starterCode": "import java.util.Stack;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}",
                  "visibleExamples": [
                    {"input": "\"()\"", "output": "true"},
                    {"input": "\"()[{}]\"", "output": "true"},
                    {"input": "\"(]\"", "output": "false"},
                    {"input": "\"([)]\"", "output": "false"}
                  ]
                }
            """.trimIndent(),
        )
    }

    private fun upsert(
        id: String,
        date: LocalDate,
        difficulty: String,
        language: String,
        title: String,
        baseXp: Int,
        metadata: String,
    ) {
        jdbc.update(
            """
            INSERT INTO challenges (id, release_date, difficulty, language, type, title, tags, tracks, base_xp, metadata)
            VALUES (?, ?, ?, ?, 'function', ?, '{}'::text[], '{}'::text[], ?, ?::jsonb)
            ON CONFLICT (id) DO UPDATE SET release_date = EXCLUDED.release_date
            """.trimIndent(),
            id, date, difficulty, language, title, baseXp, metadata,
        )
    }
}
