package dev.bytecode.android.di

import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.ChallengeRepository
import dev.bytecode.android.data.repository.LeaderboardRepository
import dev.bytecode.android.data.repository.SessionStore
import dev.bytecode.android.data.repository.BadgeRepository
import dev.bytecode.android.data.repository.SocialRepository
import dev.bytecode.android.data.repository.UserRepository
import dev.bytecode.android.ui.MainViewModel
import dev.bytecode.android.ui.badges.BadgesViewModel
import dev.bytecode.android.ui.challenge.ChallengeViewModel
import dev.bytecode.android.ui.discussion.DiscussionViewModel
import dev.bytecode.android.ui.duel.DuelViewModel
import dev.bytecode.android.ui.friends.FriendsViewModel
import dev.bytecode.android.ui.leaderboard.LeaderboardViewModel
import dev.bytecode.android.ui.solution.SolutionViewModel
import org.koin.android.ext.koin.androidApplication
import org.koin.android.ext.koin.androidContext
import org.koin.core.module.dsl.viewModel
import org.koin.dsl.module

val appModule = module {

    // ── Repositories ──────────────────────────────────────────────────────────

    single { SessionStore(androidContext()) }
    single { AuthRepository(androidContext()) }
    single { UserRepository(androidContext()) }
    single { ChallengeRepository(androidContext()) }
    single { LeaderboardRepository(androidContext()) }
    single { SocialRepository(androidContext()) }
    single { BadgeRepository(androidContext()) }

    // ── ViewModels ────────────────────────────────────────────────────────────

    viewModel { MainViewModel(androidApplication(), get(), get(), get()) }
    viewModel { ChallengeViewModel(androidApplication(), get(), get(), get()) }
    viewModel { LeaderboardViewModel(androidApplication(), get(), get()) }
    viewModel { FriendsViewModel(androidApplication(), get(), get()) }
    viewModel { DiscussionViewModel(androidApplication(), get(), get()) }
    viewModel { SolutionViewModel(androidApplication(), get(), get()) }
    viewModel { DuelViewModel(androidApplication(), get(), get(), get()) }
    viewModel { BadgesViewModel(androidApplication(), get(), get()) }
}
