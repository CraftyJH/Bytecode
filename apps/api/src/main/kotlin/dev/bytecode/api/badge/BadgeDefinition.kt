package dev.bytecode.api.badge

data class BadgeDefinition(
    val id: String,
    val name: String,
    val description: String,
    val category: String,
    val dotTier: Int = 1,
    val rule: BadgeRule,
)

object BadgeCatalog {
    val all: List<BadgeDefinition> = listOf(
        // ── Completion ────────────────────────────────────────────────────────
        BadgeDefinition(
            id = "first-solve",
            name = "First Solve",
            description = "Submit your first correct solution.",
            category = "completion",
            dotTier = 1,
            rule = BadgeRule.SolveCount(1),
        ),
        BadgeDefinition(
            id = "ten-solver",
            name = "Ten Down",
            description = "Solve 10 challenges correctly.",
            category = "completion",
            dotTier = 2,
            rule = BadgeRule.SolveCount(10),
        ),
        BadgeDefinition(
            id = "fifty-solver",
            name = "Fifty Challenges",
            description = "Solve 50 challenges correctly.",
            category = "completion",
            dotTier = 3,
            rule = BadgeRule.SolveCount(50),
        ),
        BadgeDefinition(
            id = "century-solver",
            name = "Century Solver",
            description = "Solve 100 challenges correctly.",
            category = "completion",
            dotTier = 4,
            rule = BadgeRule.SolveCount(100),
        ),
        BadgeDefinition(
            id = "five-hundred-solver",
            name = "Five Hundred",
            description = "Solve 500 challenges correctly.",
            category = "completion",
            dotTier = 5,
            rule = BadgeRule.SolveCount(500),
        ),
        BadgeDefinition(
            id = "thousand-solver",
            name = "One Thousand",
            description = "Solve 1,000 challenges correctly.",
            category = "completion",
            dotTier = 5,
            rule = BadgeRule.SolveCount(1000),
        ),

        // ── Difficulty Mastery ────────────────────────────────────────────────
        BadgeDefinition(
            id = "easy-door",
            name = "Through the Easy Door",
            description = "Solve 50 Easy challenges.",
            category = "difficulty",
            dotTier = 2,
            rule = BadgeRule.DifficultyCount("easy", 50),
        ),
        BadgeDefinition(
            id = "intermediate-reader",
            name = "Intermediate Reader",
            description = "Solve 50 Intermediate challenges.",
            category = "difficulty",
            dotTier = 3,
            rule = BadgeRule.DifficultyCount("intermediate", 50),
        ),
        BadgeDefinition(
            id = "hard-mode",
            name = "Hard Mode",
            description = "Solve 50 Hard challenges.",
            category = "difficulty",
            dotTier = 4,
            rule = BadgeRule.DifficultyCount("hard", 50),
        ),

        // ── Category Mastery ──────────────────────────────────────────────────
        BadgeDefinition(
            id = "concurrent-mind",
            name = "Concurrent Mind",
            description = "Solve 25 concurrency challenges.",
            category = "category",
            dotTier = 3,
            rule = BadgeRule.TagCount("concurrency", 25),
        ),
        BadgeDefinition(
            id = "stream-surgeon",
            name = "Stream Surgeon",
            description = "Solve 25 streams challenges.",
            category = "category",
            dotTier = 3,
            rule = BadgeRule.TagCount("streams", 25),
        ),
        BadgeDefinition(
            id = "coroutine-captain",
            name = "Coroutine Captain",
            description = "Solve 25 Kotlin coroutine challenges.",
            category = "category",
            dotTier = 3,
            rule = BadgeRule.TagCount("coroutines", 25),
        ),
        BadgeDefinition(
            id = "compose-composer",
            name = "Compose Composer",
            description = "Solve 25 Jetpack Compose challenges.",
            category = "category",
            dotTier = 3,
            rule = BadgeRule.TagCount("compose", 25),
        ),
        BadgeDefinition(
            id = "spring-in-step",
            name = "Spring in Step",
            description = "Solve 25 Spring Boot challenges.",
            category = "category",
            dotTier = 3,
            rule = BadgeRule.TagCount("spring", 25),
        ),

        // ── Language ──────────────────────────────────────────────────────────
        BadgeDefinition(
            id = "bilingual",
            name = "Bilingual",
            description = "Solve 25 Java challenges and 25 Kotlin challenges.",
            category = "language",
            dotTier = 3,
            rule = BadgeRule.BilingualRule(25),
        ),
        BadgeDefinition(
            id = "kotlin-curious",
            name = "Kotlin Curious",
            description = "Solve 10 Kotlin challenges.",
            category = "language",
            dotTier = 2,
            rule = BadgeRule.LanguageCount("kotlin", 10),
        ),

        // ── Discovery ─────────────────────────────────────────────────────────
        BadgeDefinition(
            id = "one-liner",
            name = "One-Liner",
            description = "Submit a correct solution that fits in a single logical line.",
            category = "discovery",
            dotTier = 3,
            rule = BadgeRule.OneLineSolve(maxLines = 1),
        ),
        BadgeDefinition(
            id = "bug-hunter",
            name = "Bug Hunter",
            description = "Correctly solve a Find the Bug challenge.",
            category = "discovery",
            dotTier = 2,
            rule = BadgeRule.ChallengeTypeRule("find_the_bug"),
        ),

        // ── Social ────────────────────────────────────────────────────────────
        BadgeDefinition(
            id = "helpful",
            name = "Helpful",
            description = "Receive 10 upvotes on your shared solutions.",
            category = "social",
            dotTier = 2,
            rule = BadgeRule.SolutionUpvotesReceived(10),
        ),
        BadgeDefinition(
            id = "well-received",
            name = "Well Received",
            description = "Receive 50 upvotes on your shared solutions.",
            category = "social",
            dotTier = 3,
            rule = BadgeRule.SolutionUpvotesReceived(50),
        ),
        BadgeDefinition(
            id = "connected",
            name = "Connected",
            description = "Add 5 friends.",
            category = "social",
            dotTier = 2,
            rule = BadgeRule.FriendCount(5),
        ),
        BadgeDefinition(
            id = "well-connected",
            name = "Well Connected",
            description = "Add 20 friends.",
            category = "social",
            dotTier = 3,
            rule = BadgeRule.FriendCount(20),
        ),

        // ── Founding Member ───────────────────────────────────────────────────
        BadgeDefinition(
            id = "day-one",
            name = "Day One",
            description = "Joined Bytecode on launch day.",
            category = "founding",
            dotTier = 5,
            rule = BadgeRule.FoundingMember,
        ),
        BadgeDefinition(
            id = "beta-hunter",
            name = "Beta Hunter",
            description = "Joined Bytecode during the beta period.",
            category = "founding",
            dotTier = 4,
            rule = BadgeRule.CreatedBefore("2026-07-01"),
        ),
        BadgeDefinition(
            id = "early-adopter",
            name = "Early Adopter",
            description = "Joined Bytecode in the first three months.",
            category = "founding",
            dotTier = 3,
            rule = BadgeRule.CreatedBefore("2026-09-01"),
        ),
    )

    val byId: Map<String, BadgeDefinition> = all.associateBy { it.id }
}
