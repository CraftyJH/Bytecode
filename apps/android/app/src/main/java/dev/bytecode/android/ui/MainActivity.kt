package dev.bytecode.android.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.navigation
import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.MobileLessonSummary
import dev.bytecode.android.ui.state.AppUiState
import dev.bytecode.android.ui.state.selectedLessonSummary
import dev.bytecode.android.ui.theme.BytecodeTheme

private object AppRoutes {
    const val AuthGraph = "auth"
    const val AppGraph = "app"
    const val SignIn = "auth/sign-in"
    const val Dashboard = "app/dashboard"
    const val LessonPattern = "app/lesson/{track}/{module}/{lesson}"

    fun lesson(track: String, module: String, lesson: String): String =
        "app/lesson/${Uri.encode(track)}/${Uri.encode(module)}/${Uri.encode(lesson)}"
}

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BytecodeTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    val state by viewModel.uiState.collectAsStateWithLifecycle()
                    AppScreen(
                        state = state,
                        onSignIn = { email, password -> viewModel.signIn(email, password) },
                        onSignOut = { viewModel.signOut() },
                        onRefresh = { viewModel.refresh() },
                        onOpenLesson = { trackSlug, moduleSlug, lessonSlug ->
                            viewModel.openLesson(trackSlug, moduleSlug, lessonSlug)
                        },
                        onCloseLesson = { viewModel.clearLessonSelection() },
                        onOpenBilling = {
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("${AppConfig.WEB_BASE_URL}/me/billing"),
                            )
                            startActivity(intent)
                        },
                    )
                }
            }
        }
    }
}

@Composable
private fun AppScreen(
    state: AppUiState,
    onSignIn: (String, String) -> Unit,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenLesson: (String, String, String) -> Unit,
    onCloseLesson: () -> Unit,
    onOpenBilling: () -> Unit,
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    LaunchedEffect(state, currentRoute) {
        when (state) {
            is AppUiState.LoggedIn -> {
                if (currentRoute == null || !currentRoute.startsWith(AppRoutes.AppGraph)) {
                    navController.navigate(AppRoutes.Dashboard) {
                        popUpTo(AppRoutes.AuthGraph) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }
            is AppUiState.LoggedOut,
            is AppUiState.Error,
            -> {
                if (currentRoute == null || !currentRoute.startsWith(AppRoutes.AuthGraph)) {
                    navController.navigate(AppRoutes.SignIn) {
                        popUpTo(AppRoutes.AppGraph) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }
            AppUiState.Loading -> Unit
        }
    }

    NavHost(
        navController = navController,
        startDestination = AppRoutes.AuthGraph,
    ) {
        navigation(
            route = AppRoutes.AuthGraph,
            startDestination = AppRoutes.SignIn,
        ) {
            composable(AppRoutes.SignIn) {
                when (state) {
                    is AppUiState.LoggedOut -> {
                        SignInScreen(
                            loading = state.loading,
                            error = state.error,
                            onSignIn = onSignIn,
                        )
                    }
                    is AppUiState.Error -> {
                        SignInScreen(
                            loading = false,
                            error = state.message,
                            onSignIn = onSignIn,
                        )
                    }
                    AppUiState.Loading -> LoadingScreen("Loading…")
                    is AppUiState.LoggedIn -> LoadingScreen("Opening dashboard…")
                }
            }
        }

        navigation(
            route = AppRoutes.AppGraph,
            startDestination = AppRoutes.Dashboard,
        ) {
            composable(AppRoutes.Dashboard) {
                val loggedInState = state as? AppUiState.LoggedIn
                if (loggedInState == null) {
                    LoadingScreen("Loading dashboard…")
                } else {
                    DashboardScreen(
                        state = loggedInState,
                        onSignOut = onSignOut,
                        onRefresh = onRefresh,
                        onOpenLesson = { trackSlug, moduleSlug, lessonSlug ->
                            onOpenLesson(trackSlug, moduleSlug, lessonSlug)
                            navController.navigate(
                                AppRoutes.lesson(trackSlug, moduleSlug, lessonSlug),
                            ) {
                                launchSingleTop = true
                            }
                        },
                        onOpenBilling = onOpenBilling,
                    )
                }
            }

            composable(
                route = AppRoutes.LessonPattern,
                arguments = listOf(
                    navArgument("track") { type = NavType.StringType },
                    navArgument("module") { type = NavType.StringType },
                    navArgument("lesson") { type = NavType.StringType },
                ),
            ) { entry ->
                val trackSlug = Uri.decode(entry.arguments?.getString("track").orEmpty())
                val moduleSlug = Uri.decode(entry.arguments?.getString("module").orEmpty())
                val lessonSlug = Uri.decode(entry.arguments?.getString("lesson").orEmpty())

                val loggedInState = state as? AppUiState.LoggedIn
                if (loggedInState == null) {
                    LoadingScreen("Loading lesson…")
                } else {
                    LessonRouteScreen(
                        state = loggedInState,
                        trackSlug = trackSlug,
                        moduleSlug = moduleSlug,
                        lessonSlug = lessonSlug,
                        onOpenLesson = onOpenLesson,
                        onBack = {
                            onCloseLesson()
                            if (!navController.popBackStack()) {
                                navController.navigate(AppRoutes.Dashboard) {
                                    launchSingleTop = true
                                }
                            }
                        },
                        onOpenBilling = onOpenBilling,
                    )
                }
            }
        }
    }
}

@Composable
private fun LoadingScreen(message: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        CircularProgressIndicator()
        Spacer(modifier = Modifier.height(12.dp))
        Text(message)
    }
}

@Composable
private fun SignInScreen(
    loading: Boolean,
    error: String?,
    onSignIn: (String, String) -> Unit,
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 420.dp),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.large,
            tonalElevation = 2.dp,
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Bytecode Android", style = MaterialTheme.typography.headlineSmall)
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    "Sign in to continue your learning path",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text("Email") },
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text("Password") },
                    visualTransformation = PasswordVisualTransformation(),
                )
                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = { onSignIn(email.trim(), password) },
                    enabled = !loading && email.isNotBlank() && password.isNotBlank(),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    if (loading) {
                        CircularProgressIndicator(modifier = Modifier.width(18.dp), strokeWidth = 2.dp)
                    } else {
                        Text("Sign in")
                    }
                }

                if (!error.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Surface(
                        color = MaterialTheme.colorScheme.error.copy(alpha = 0.12f),
                        shape = MaterialTheme.shapes.small,
                    ) {
                        Text(
                            text = error,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun DashboardScreen(
    state: AppUiState.LoggedIn,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenLesson: (String, String, String) -> Unit,
    onOpenBilling: () -> Unit,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            BytecodeSectionCard {
                Text("Welcome back", style = MaterialTheme.typography.headlineSmall)
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    state.user.email ?: "Unknown user",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    val billingRole = state.billing?.role ?: state.user.role
                    val billingPlan = state.billing?.plan ?: "free"
                    AccessBadge(
                        label = if (billingPlan == "premium") "Premium" else "Free",
                        tone = if (billingPlan == "premium") BadgeTone.Success else BadgeTone.Default,
                    )
                    AccessBadge(
                        label = billingRole.replaceFirstChar { it.titlecase() },
                        tone = BadgeTone.Default,
                    )
                }
            }
        }
        item {
            BytecodeSectionCard {
                SectionHeader(
                    title = "Account",
                    subtitle = "Your profile and learning streak",
                )
                Spacer(modifier = Modifier.height(8.dp))
                KeyValueRow("Role", state.user.role.replaceFirstChar { it.titlecase() })
                KeyValueRow(
                    "Streak",
                    "${state.user.streakCount} day${if (state.user.streakCount == 1) "" else "s"}",
                )
                KeyValueRow("Premium until", state.user.premiumUntil ?: "—")
            }
        }
        item {
            BytecodeSectionCard {
                SectionHeader(
                    title = "Billing",
                    subtitle = "Manage subscription and premium access",
                )
                Spacer(modifier = Modifier.height(8.dp))
                val billing = state.billing
                val subscriptionStatus = billing?.subscription?.status ?: "none"
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        "Subscription status",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    AccessBadge(
                        label = subscriptionStatus,
                        tone = when {
                            subscriptionStatus.equals("active", ignoreCase = true) -> BadgeTone.Success
                            subscriptionStatus.equals("past_due", ignoreCase = true) -> BadgeTone.Warning
                            else -> BadgeTone.Default
                        },
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                KeyValueRow("Plan", billing?.plan ?: "free")
                KeyValueRow("Premium until", billing?.premiumUntil ?: state.user.premiumUntil ?: "—")
                billing?.subscription?.graceExpiresAt?.let { KeyValueRow("Grace ends", it) }
                Spacer(modifier = Modifier.height(14.dp))
                Button(onClick = onOpenBilling, modifier = Modifier.fillMaxWidth()) {
                    Text("Manage billing on web")
                }
            }
        }
        item {
            BytecodeSectionCard {
                SectionHeader(
                    title = "Curriculum",
                    subtitle = "Continue from where you left off",
                )
                if (state.curriculumError != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Surface(
                        color = MaterialTheme.colorScheme.error.copy(alpha = 0.12f),
                        shape = MaterialTheme.shapes.small,
                    ) {
                        Text(
                            text = "Sync issue: ${state.curriculumError}",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                CurriculumBrowser(
                    state = state,
                    onOpenLesson = onOpenLesson,
                )
            }
        }
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Button(
                    onClick = onRefresh,
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Refresh")
                }
                OutlinedButton(
                    onClick = onSignOut,
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Sign out")
                }
            }
        }
    }
}

@Composable
private fun CurriculumBrowser(
    state: AppUiState.LoggedIn,
    onOpenLesson: (String, String, String) -> Unit,
) {
    if (state.curriculum.tracks.isEmpty()) {
        Text(
            "No curriculum loaded yet.",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            style = MaterialTheme.typography.bodyMedium,
        )
        return
    }

    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        state.curriculum.tracks.forEach { track ->
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                shape = MaterialTheme.shapes.medium,
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = track.title,
                            style = MaterialTheme.typography.titleMedium,
                        )
                        AccessBadge(
                            label = when {
                                track.isLocked -> "Locked"
                                track.isPremium -> "Premium"
                                else -> "Free"
                            },
                            tone = when {
                                track.isLocked -> BadgeTone.Warning
                                track.isPremium -> BadgeTone.Success
                                else -> BadgeTone.Default
                            },
                        )
                    }
                    Text(
                        track.tagline,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))

                    track.modules.forEach { module ->
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            color = MaterialTheme.colorScheme.surface,
                            shape = MaterialTheme.shapes.small,
                        ) {
                            Column(
                                modifier = Modifier.padding(12.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    Text(
                                        text = module.title,
                                        style = MaterialTheme.typography.titleSmall,
                                    )
                                    AccessBadge(
                                        label = when {
                                            module.isLocked -> "Locked"
                                            module.isPremium -> "Premium"
                                            else -> "Free"
                                        },
                                        tone = when {
                                            module.isLocked -> BadgeTone.Warning
                                            module.isPremium -> BadgeTone.Success
                                            else -> BadgeTone.Default
                                        },
                                    )
                                }
                                LessonButtons(
                                    trackSlug = track.slug,
                                    moduleSlug = module.slug,
                                    lessons = module.lessons,
                                    onOpenLesson = onOpenLesson,
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun LessonButtons(
    trackSlug: String,
    moduleSlug: String,
    lessons: List<MobileLessonSummary>,
    onOpenLesson: (String, String, String) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        lessons.forEach { lesson ->
            OutlinedButton(
                onClick = { onOpenLesson(trackSlug, moduleSlug, lesson.slug) },
                enabled = !lesson.isLocked,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        "${lesson.title} (${lesson.duration}m)",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f),
                    )
                    if (lesson.isLocked) {
                        AccessBadge(label = "Locked", tone = BadgeTone.Warning)
                    } else if (lesson.isPremium) {
                        AccessBadge(label = "Premium", tone = BadgeTone.Success)
                    }
                }
            }
        }
    }
}

private enum class BadgeTone {
    Default,
    Success,
    Warning,
}

@Composable
private fun BytecodeSectionCard(content: @Composable () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shape = MaterialTheme.shapes.medium,
        tonalElevation = 2.dp,
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(2.dp),
            content = { content() },
        )
    }
}

@Composable
private fun SectionHeader(title: String, subtitle: String) {
    Text(title, style = MaterialTheme.typography.titleLarge)
    Spacer(modifier = Modifier.height(2.dp))
    Text(
        subtitle,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
}

@Composable
private fun KeyValueRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top,
    ) {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
        )
    }
}

@Composable
private fun AccessBadge(label: String, tone: BadgeTone) {
    val (container, content) = when (tone) {
        BadgeTone.Default -> MaterialTheme.colorScheme.surfaceVariant to MaterialTheme.colorScheme.onSurfaceVariant
        BadgeTone.Success -> MaterialTheme.colorScheme.tertiary.copy(alpha = 0.2f) to MaterialTheme.colorScheme.tertiary
        BadgeTone.Warning -> MaterialTheme.colorScheme.error.copy(alpha = 0.15f) to MaterialTheme.colorScheme.error
    }
    Surface(
        shape = MaterialTheme.shapes.small,
        color = container,
    ) {
        Text(
            label,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelMedium,
            color = content,
        )
    }
}

@Composable
private fun LessonRouteScreen(
    state: AppUiState.LoggedIn,
    trackSlug: String,
    moduleSlug: String,
    lessonSlug: String,
    onOpenLesson: (String, String, String) -> Unit,
    onBack: () -> Unit,
    onOpenBilling: () -> Unit,
) {
    LaunchedEffect(trackSlug, moduleSlug, lessonSlug) {
        if (
            state.selectedTrackSlug != trackSlug ||
            state.selectedModuleSlug != moduleSlug ||
            state.selectedLessonSlug != lessonSlug
        ) {
            onOpenLesson(trackSlug, moduleSlug, lessonSlug)
        }
    }

    LessonScreen(
        state = state,
        onBack = onBack,
        onRetry = { onOpenLesson(trackSlug, moduleSlug, lessonSlug) },
        onOpenBilling = onOpenBilling,
    )
}

@Composable
private fun LessonScreen(
    state: AppUiState.LoggedIn,
    onBack: () -> Unit,
    onRetry: () -> Unit,
    onOpenBilling: () -> Unit,
) {
    val selectedSummary = state.selectedLessonSummary()
    val isLockedPremium = selectedSummary?.isLocked == true
    val selectedContent = state.selectedLesson
    val scrollState = rememberScrollState()
    val lessonTitle = selectedContent?.lesson?.title ?: selectedSummary?.title ?: "Lesson"
    val breadcrumb = buildString {
        append(selectedContent?.track?.title ?: state.selectedTrackSlug ?: "")
        if (!selectedContent?.module?.title.isNullOrBlank()) {
            append(" / ")
            append(selectedContent?.module?.title)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.medium,
            tonalElevation = 2.dp,
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                OutlinedButton(onClick = onBack) {
                    Text("Back to curriculum")
                }
                if (isLockedPremium) {
                    Button(onClick = onOpenBilling) {
                        Text("Unlock with premium")
                    }
                }
            }
        }

        Surface(
            modifier = Modifier
                .fillMaxSize()
                .widthIn(max = 860.dp),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.large,
            tonalElevation = 1.dp,
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
            ) {
            Text(
                text = lessonTitle,
                style = MaterialTheme.typography.headlineSmall,
            )
            if (breadcrumb.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    breadcrumb,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Spacer(modifier = Modifier.height(10.dp))

            when {
                isLockedPremium -> {
                    Surface(
                        color = MaterialTheme.colorScheme.error.copy(alpha = 0.12f),
                        shape = MaterialTheme.shapes.small,
                    ) {
                        Text(
                            "This lesson is part of premium. Upgrade on web billing to continue.",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                        )
                    }
                }
                state.curriculumError != null -> {
                    Surface(
                        color = MaterialTheme.colorScheme.error.copy(alpha = 0.12f),
                        shape = MaterialTheme.shapes.small,
                    ) {
                        Text(
                            text = state.curriculumError,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedButton(onClick = onRetry) {
                        Text("Retry lesson load")
                    }
                }
                selectedContent == null -> {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        CircularProgressIndicator()
                        Text("Loading lesson…", style = MaterialTheme.typography.bodyMedium)
                    }
                }
                selectedContent.content.isBlank() -> {
                    Text(
                        "Lesson content is currently empty.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                else -> {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                        shape = MaterialTheme.shapes.medium,
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 16.dp, vertical = 14.dp)
                                .verticalScroll(scrollState),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                        ) {
                            LessonContentRenderer(selectedContent.content)
                        }
                    }
                }
            }
        }
        }
    }
}

private data class LessonSegment(
    val isCode: Boolean,
    val text: String,
)

private fun parseLessonSegments(content: String): List<LessonSegment> {
    val segments = mutableListOf<LessonSegment>()
    val buffer = StringBuilder()
    var inCode = false

    fun flush() {
        if (buffer.isNotEmpty()) {
            val text = buffer.toString().trimEnd()
            if (text.isNotBlank()) {
                segments.add(LessonSegment(isCode = inCode, text = text))
            }
            buffer.clear()
        }
    }

    content.lineSequence().forEach { line ->
        if (line.trim().startsWith("```")) {
            flush()
            inCode = !inCode
        } else {
            buffer.append(line).append('\n')
        }
    }
    flush()
    return segments
}

@Composable
private fun LessonContentRenderer(content: String) {
    val segments = remember(content) { parseLessonSegments(content) }
    segments.forEach { segment ->
        if (segment.isCode) {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shape = MaterialTheme.shapes.small,
                tonalElevation = 1.dp,
            ) {
                Text(
                    text = segment.text,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                    style = MaterialTheme.typography.bodySmall,
                    fontFamily = FontFamily.Monospace,
                )
            }
        } else {
            Text(
                text = segment.text,
                style = MaterialTheme.typography.bodyLarge,
            )
        }
    }
}
