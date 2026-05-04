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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
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
        Text("Bytecode Android", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(20.dp))

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
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium,
            )
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
            .padding(horizontal = 24.dp),
        contentPadding = PaddingValues(vertical = 24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text("Welcome back", style = MaterialTheme.typography.headlineMedium)
        }
        item {
            Text(state.user.email ?: "Unknown user", style = MaterialTheme.typography.bodyLarge)
        }
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Account", style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    val billingRole = state.billing?.role ?: state.user.role
                    val billingPlan = state.billing?.plan ?: "free"
                    Text("Role: $billingRole")
                    Text("Plan: ${if (billingPlan == "premium") "Premium" else "Free"}")
                    Text("Streak: ${state.user.streakCount} days")
                }
            }
        }
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Billing", style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    val billing = state.billing
                    Text("Subscription status: ${billing?.subscription?.status ?: "none"}")
                    Text("Subscription plan: ${billing?.plan ?: "free"}")
                    Text("Premium until: ${billing?.premiumUntil ?: state.user.premiumUntil ?: "—"}")
                    billing?.subscription?.graceExpiresAt?.let { Text("Grace ends: $it") }
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(onClick = onOpenBilling, modifier = Modifier.fillMaxWidth()) {
                        Text("Manage billing on web")
                    }
                }
            }
        }
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Curriculum", style = MaterialTheme.typography.titleMedium)
                    if (state.curriculumError != null) {
                        Text(
                            text = "Curriculum sync issue: ${state.curriculumError}",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                        )
                    }
                    CurriculumBrowser(
                        state = state,
                        onOpenLesson = onOpenLesson,
                    )
                }
            }
        }
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Button(onClick = onRefresh) {
                    Text("Refresh")
                }
                Button(onClick = onSignOut) {
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
        Text("No curriculum loaded yet.")
        return
    }

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        state.curriculum.tracks.forEach { track ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    val trackAccess = when {
                        track.isLocked -> "Premium locked"
                        track.isPremium -> "Premium"
                        else -> "Free"
                    }
                    Text(
                        text = "${track.title} • $trackAccess",
                        style = MaterialTheme.typography.titleSmall,
                    )
                    Text(track.tagline, style = MaterialTheme.typography.bodySmall)

                    track.modules.forEach { module ->
                        val moduleAccess = when {
                            module.isLocked -> "Premium locked"
                            module.isPremium -> "Premium"
                            else -> "Free"
                        }
                        Text(
                            text = "${module.title} • $moduleAccess",
                            style = MaterialTheme.typography.labelLarge,
                        )
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
                val premiumLabel = when {
                    lesson.isLocked -> " • Locked"
                    lesson.isPremium -> " • Premium"
                    else -> ""
                }
                Text("${lesson.title} (${lesson.duration}m)$premiumLabel")
            }
        }
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

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            OutlinedButton(onClick = onBack) {
                Text("Back to curriculum")
            }
            if (isLockedPremium) {
                Button(onClick = onOpenBilling) {
                    Text("Unlock with premium")
                }
            }
        }

        Text(
            text = selectedContent?.lesson?.title ?: selectedSummary?.title ?: "Lesson",
            style = MaterialTheme.typography.headlineSmall,
        )
        val breadcrumb = buildString {
            append(selectedContent?.track?.title ?: state.selectedTrackSlug ?: "")
            if (!selectedContent?.module?.title.isNullOrBlank()) {
                append(" / ")
                append(selectedContent?.module?.title)
            }
        }
        if (breadcrumb.isNotBlank()) {
            Text(breadcrumb, style = MaterialTheme.typography.bodySmall)
        }

        when {
            isLockedPremium -> {
                Text(
                    "This lesson is part of the premium curriculum. Upgrade on web billing to continue.",
                    color = MaterialTheme.colorScheme.error,
                )
            }
            state.curriculumError != null -> {
                Text(
                    text = state.curriculumError,
                    color = MaterialTheme.colorScheme.error,
                )
                OutlinedButton(onClick = onRetry) {
                    Text("Retry lesson load")
                }
            }
            selectedContent == null -> {
                CircularProgressIndicator()
                Text("Loading lesson…")
            }
            selectedContent.content.isBlank() -> {
                Text("Lesson content is currently empty.")
            }
            else -> {
                Card(modifier = Modifier.fillMaxSize()) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp)
                            .verticalScroll(scrollState),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Text(
                            text = selectedContent.content,
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }
                }
            }
        }
    }
}
