package dev.bytecode.android.di

import androidx.room.Room
import dev.bytecode.android.data.local.AppDatabase
import dev.bytecode.android.data.repository.AuthRepository
import dev.bytecode.android.data.repository.ChallengeRepository
import dev.bytecode.android.data.repository.SessionStore
import dev.bytecode.android.data.repository.UserRepository
import dev.bytecode.android.ui.MainViewModel
import dev.bytecode.android.ui.challenge.ChallengeViewModel
import org.koin.android.ext.koin.androidApplication
import org.koin.android.ext.koin.androidContext
import org.koin.core.module.dsl.viewModel
import org.koin.dsl.module

val appModule = module {

    // ── Infrastructure ────────────────────────────────────────────────────────

    single {
        Room.databaseBuilder(
            androidContext(),
            AppDatabase::class.java,
            "bytecode.db",
        ).build()
    }

    // ── Repositories ──────────────────────────────────────────────────────────

    single { SessionStore(androidContext()) }
    single { AuthRepository(androidContext()) }
    single { UserRepository(androidContext()) }
    single { ChallengeRepository(androidContext()) }

    // ── ViewModels ────────────────────────────────────────────────────────────

    viewModel { MainViewModel(androidApplication(), get(), get(), get()) }
    viewModel { ChallengeViewModel(androidApplication(), get(), get(), get()) }
}
