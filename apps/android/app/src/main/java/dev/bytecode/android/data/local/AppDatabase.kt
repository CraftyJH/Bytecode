package dev.bytecode.android.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

// Phase 0: empty schema — entities and DAOs are added per-phase as features ship.
@Database(entities = [], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase()
