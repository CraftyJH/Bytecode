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
        val releaseDate = LocalDate.of(2026, 5, 6)
        if (challengeRepo.findByReleaseDate(releaseDate) != null) return

        val metadata = """
            {
              "description": "Given a list of integers, return the sum of all even numbers in the list. Return 0 if there are no even numbers.",
              "starterCode": "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int sumEvens(ArrayList<Integer> nums) {\n        // Your code here\n        return 0;\n    }\n}",
              "visibleExamples": [
                {"input": "[1, 2, 3, 4]", "output": "6", "explanation": "2 + 4 = 6"},
                {"input": "[0, -2, 5, 10]", "output": "8", "explanation": "0 + (-2) + 10 = 8"}
              ]
            }
        """.trimIndent()

        jdbc.update(
            """
            INSERT INTO challenges (id, release_date, difficulty, language, type, title, tags, tracks, base_xp, metadata)
            VALUES (?, ?, ?, ?, ?, ?, '{}'::text[], '{}'::text[], ?, ?::jsonb)
            ON CONFLICT (id) DO NOTHING
            """.trimIndent(),
            "2026-05-06-easy-java",
            releaseDate,
            "easy",
            "java",
            "function",
            "Sum Even Numbers",
            10,
            metadata,
        )
    }
}
