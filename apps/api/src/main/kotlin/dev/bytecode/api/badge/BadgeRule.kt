package dev.bytecode.api.badge

sealed class BadgeRule {
    /** Total correct solves across all challenges. */
    data class SolveCount(val threshold: Int) : BadgeRule()

    /** Correct solves filtered by challenge difficulty ("easy" | "intermediate" | "hard"). */
    data class DifficultyCount(val difficulty: String, val threshold: Int) : BadgeRule()

    /** Correct solves on challenges tagged with the given tag. */
    data class TagCount(val tag: String, val threshold: Int) : BadgeRule()

    /** Correct solves in one specific language. */
    data class LanguageCount(val language: String, val threshold: Int) : BadgeRule()

    /** ≥threshold correct Java solves AND ≥threshold correct Kotlin solves. */
    data class BilingualRule(val threshold: Int) : BadgeRule()

    /** Submitted a correct solution whose source fits in ≤maxLines non-blank, non-comment lines. */
    data class OneLineSolve(val maxLines: Int = 1) : BadgeRule()

    /** Solved at least one challenge whose type equals the given value (e.g. "find_the_bug"). */
    data class ChallengeTypeRule(val type: String) : BadgeRule()

    /** Sum of upvotes received on the user's shared solutions. */
    data class SolutionUpvotesReceived(val threshold: Int) : BadgeRule()

    /** Number of accepted friends. */
    data class FriendCount(val threshold: Int) : BadgeRule()

    /** User's isFoundingMember flag is true. */
    object FoundingMember : BadgeRule()

    /** User's account was created before a specific ISO date (exclusive). */
    data class CreatedBefore(val isoDate: String) : BadgeRule()
}
