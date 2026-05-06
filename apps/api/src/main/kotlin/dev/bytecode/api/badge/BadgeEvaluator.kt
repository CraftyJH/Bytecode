package dev.bytecode.api.badge

import dev.bytecode.api.social.FriendRepository
import dev.bytecode.api.submission.SubmissionEntity
import dev.bytecode.api.submission.SubmissionJpaRepository
import dev.bytecode.api.user.UserEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Service
class BadgeEvaluator(
    private val submissionRepo: SubmissionJpaRepository,
    private val badgeGrantRepo: BadgeGrantRepository,
    private val friendRepo: FriendRepository,
) {
    /**
     * Evaluate all badge rules for a user after a new correct first-solve.
     * Saves newly unlocked grants and returns the corresponding definitions.
     */
    @Transactional
    fun evaluate(user: UserEntity, submission: SubmissionEntity): List<BadgeDefinition> {
        val userId = user.id
        val alreadyGranted = badgeGrantRepo.findBadgeIdsByUserId(userId).toSet()

        val newGrants = BadgeCatalog.all
            .filter { it.id !in alreadyGranted }
            .filter { badge -> check(badge, userId, user, submission) }

        newGrants.forEach { badge ->
            badgeGrantRepo.save(BadgeGrantEntity(userId = userId, badgeId = badge.id))
        }

        return newGrants
    }

    private fun check(
        badge: BadgeDefinition,
        userId: UUID,
        user: UserEntity,
        submission: SubmissionEntity,
    ): Boolean = when (val rule = badge.rule) {
        is BadgeRule.SolveCount ->
            submissionRepo.countCorrectByUserId(userId) >= rule.threshold

        is BadgeRule.DifficultyCount ->
            submissionRepo.countCorrectByUserIdAndDifficulty(userId, rule.difficulty) >= rule.threshold

        is BadgeRule.TagCount ->
            submissionRepo.countCorrectByUserIdAndTag(userId, rule.tag) >= rule.threshold

        is BadgeRule.LanguageCount ->
            submissionRepo.countCorrectByUserIdAndLanguage(userId, rule.language) >= rule.threshold

        is BadgeRule.BilingualRule ->
            submissionRepo.countCorrectByUserIdAndLanguage(userId, "java") >= rule.threshold &&
                submissionRepo.countCorrectByUserIdAndLanguage(userId, "kotlin") >= rule.threshold

        is BadgeRule.OneLineSolve -> {
            val executableLines = submission.sourceCode
                .lines()
                .map { it.trim() }
                .filter { it.isNotBlank() && !it.startsWith("//") && !it.startsWith("/*") && !it.startsWith("*") }
            executableLines.size <= rule.maxLines
        }

        is BadgeRule.ChallengeTypeRule ->
            submissionRepo.countCorrectByUserIdAndChallengeType(userId, rule.type) >= 1

        is BadgeRule.SolutionUpvotesReceived ->
            submissionRepo.countSolutionUpvotesReceivedByUser(userId) >= rule.threshold

        is BadgeRule.FriendCount ->
            friendRepo.findAcceptedFriends(userId).size >= rule.threshold

        BadgeRule.FoundingMember ->
            user.isFoundingMember

        is BadgeRule.CreatedBefore -> {
            val cutoff = LocalDate.parse(rule.isoDate).atStartOfDay(java.time.ZoneOffset.UTC).toInstant()
            user.createdAt.isBefore(cutoff)
        }
    }
}
