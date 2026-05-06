package dev.bytecode.android.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import org.koin.androidx.viewmodel.ext.android.viewModel as koinViewModel
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.MenuBook
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
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
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
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
import dev.bytecode.android.data.model.ChallengeSubmitResponse
import dev.bytecode.android.data.model.MobileLessonSummary
import dev.bytecode.android.data.model.OnboardingProfile
import dev.bytecode.android.data.model.TestCaseResultDto
import dev.bytecode.android.ui.challenge.ChallengeUiState
import dev.bytecode.android.ui.challenge.ChallengeViewModel
import dev.bytecode.android.ui.state.AppUiState
import dev.bytecode.android.ui.state.selectedLessonSummary
import dev.bytecode.android.ui.theme.BytecodeTheme
import dev.bytecode.android.ui.theme.JetBrainsMonoFamily

private object AppRoutes {
    const val AuthGraph = "auth"
    const val AppGraph = "app"
    const val Welcome = "auth/welcome"
    const val Onboarding = "auth/onboarding"
    const val SignIn = "auth/sign-in"
    const val Main = "app/main"
    const val LessonPattern = "app/lesson/{track}/{module}/{lesson}"
    const val ChallengeDetailPattern = "app/challenge/{challengeId}"
    const val CodeEditorPattern = "app/challenge/{challengeId}/editor"

    fun lesson(track: String, module: String, lesson: String): String =
        "app/lesson/${Uri.encode(track)}/${Uri.encode(module)}/${Uri.encode(lesson)}"

    fun challengeDetail(id: String): String = "app/challenge/${Uri.encode(id)}"
    fun codeEditor(id: String): String = "app/challenge/${Uri.encode(id)}/editor"
}

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by koinViewModel()
    private val challengeViewModel: ChallengeViewModel by koinViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BytecodeTheme(darkTheme = true) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    val state by viewModel.uiState.collectAsStateWithLifecycle()
                    val challengeState by challengeViewModel.uiState.collectAsStateWithLifecycle()
                    AppScreen(
                        state = state,
                        challengeState = challengeState,
                        onContinueWelcome = { viewModel.completeWelcome() },
                        onOnboardingNext = { profile, step -> viewModel.onboardingNext(profile, step) },
                        onOnboardingBack = { profile, step -> viewModel.onboardingBack(profile, step) },
                        onCompleteOnboarding = { profile -> viewModel.completeOnboarding(profile) },
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
                        onUpdateEditorCode = { code -> viewModel.updateEditorCode(code) },
                        onRunEditorCode = { viewModel.runEditorCode() },
                        onResetEditorCode = { viewModel.resetEditorCode() },
                        onLoadChallenge = { challengeViewModel.loadToday() },
                        onUpdateChallengeCode = { code -> challengeViewModel.updateCode(code) },
                        onSubmitChallenge = { challengeViewModel.submit() },
                        onResetChallengeCode = { challengeViewModel.resetCode() },
                        onClearSubmitResult = { challengeViewModel.clearSubmitResult() },
                        onLoadLeaderboard = { challengeViewModel.loadLeaderboard() },
                    )
                }
            }
        }
    }
}

@Composable
private fun AppScreen(
    state: AppUiState,
    challengeState: ChallengeUiState,
    onContinueWelcome: () -> Unit,
    onOnboardingNext: (OnboardingProfile, Int) -> Unit,
    onOnboardingBack: (OnboardingProfile, Int) -> Unit,
    onCompleteOnboarding: (OnboardingProfile) -> Unit,
    onSignIn: (String, String) -> Unit,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenLesson: (String, String, String) -> Unit,
    onCloseLesson: () -> Unit,
    onOpenBilling: () -> Unit,
    onUpdateEditorCode: (String) -> Unit,
    onRunEditorCode: () -> Unit,
    onResetEditorCode: () -> Unit,
    onLoadChallenge: () -> Unit,
    onUpdateChallengeCode: (String) -> Unit,
    onSubmitChallenge: () -> Unit,
    onResetChallengeCode: () -> Unit,
    onClearSubmitResult: () -> Unit,
    onLoadLeaderboard: () -> Unit,
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    LaunchedEffect(state, currentRoute) {
        when (state) {
            is AppUiState.LoggedIn -> {
                if (currentRoute == null || !currentRoute.startsWith(AppRoutes.AppGraph)) {
                    navController.navigate(AppRoutes.Main) {
                        popUpTo(AppRoutes.AuthGraph) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }
            AppUiState.Welcome -> {
                if (currentRoute != AppRoutes.Welcome) {
                    navController.navigate(AppRoutes.Welcome) {
                        popUpTo(AppRoutes.AppGraph) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }
            is AppUiState.Onboarding -> {
                if (currentRoute != AppRoutes.Onboarding) {
                    navController.navigate(AppRoutes.Onboarding) {
                        popUpTo(AppRoutes.AppGraph) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }
            is AppUiState.LoggedOut,
            is AppUiState.Error,
            -> {
                if (currentRoute != AppRoutes.SignIn) {
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
            startDestination = AppRoutes.Welcome,
        ) {
            composable(AppRoutes.Welcome) {
                when (state) {
                    AppUiState.Welcome -> {
                        WelcomeScreen(onContinue = onContinueWelcome)
                    }
                    is AppUiState.Onboarding -> LoadingScreen("Opening onboarding…")
                    AppUiState.Loading -> LoadingScreen("Preparing welcome…")
                    is AppUiState.LoggedOut,
                    is AppUiState.Error,
                    -> LoadingScreen("Opening sign in…")
                    is AppUiState.LoggedIn -> LoadingScreen("Opening dashboard…")
                }
            }

            composable(AppRoutes.Onboarding) {
                when (state) {
                    is AppUiState.Onboarding -> {
                        OnboardingScreen(
                            onboarding = state,
                            onBack = onOnboardingBack,
                            onNext = onOnboardingNext,
                            onFinish = onCompleteOnboarding,
                        )
                    }
                    AppUiState.Welcome -> LoadingScreen("Opening welcome…")
                    AppUiState.Loading -> LoadingScreen("Preparing onboarding…")
                    is AppUiState.LoggedOut,
                    is AppUiState.Error,
                    -> LoadingScreen("Opening sign in…")
                    is AppUiState.LoggedIn -> LoadingScreen("Opening dashboard…")
                }
            }

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
                    AppUiState.Welcome -> LoadingScreen("Opening welcome…")
                    is AppUiState.Onboarding -> LoadingScreen("Opening onboarding…")
                    AppUiState.Loading -> LoadingScreen("Loading…")
                    is AppUiState.LoggedIn -> LoadingScreen("Opening dashboard…")
                }
            }
        }

        navigation(
            route = AppRoutes.AppGraph,
            startDestination = AppRoutes.Main,
        ) {
            composable(AppRoutes.Main) {
                val loggedInState = state as? AppUiState.LoggedIn
                if (loggedInState == null) {
                    LoadingScreen("Loading app…")
                } else {
                    MainShellScreen(
                        state = loggedInState,
                        challengeState = challengeState,
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
                        onUpdateEditorCode = onUpdateEditorCode,
                        onRunEditorCode = onRunEditorCode,
                        onResetEditorCode = onResetEditorCode,
                        onLoadChallenge = onLoadChallenge,
                        onOpenChallenge = { id ->
                            navController.navigate(AppRoutes.challengeDetail(id)) {
                                launchSingleTop = true
                            }
                        },
                    )
                }
            }

            composable(
                route = AppRoutes.ChallengeDetailPattern,
                arguments = listOf(navArgument("challengeId") { type = NavType.StringType }),
            ) {
                ChallengeDetailScreen(
                    challengeState = challengeState,
                    onBack = { navController.popBackStack() },
                    onOpenEditor = { id ->
                        navController.navigate(AppRoutes.codeEditor(id)) {
                            launchSingleTop = true
                        }
                    },
                    onLoadLeaderboard = onLoadLeaderboard,
                )
            }

            composable(
                route = AppRoutes.CodeEditorPattern,
                arguments = listOf(navArgument("challengeId") { type = NavType.StringType }),
            ) {
                CodeEditorScreen(
                    challengeState = challengeState,
                    onBack = {
                        onClearSubmitResult()
                        navController.popBackStack()
                    },
                    onUpdateCode = onUpdateChallengeCode,
                    onSubmit = onSubmitChallenge,
                    onReset = onResetChallengeCode,
                )
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
                        onUpdateEditorCode = onUpdateEditorCode,
                        onRunEditorCode = onRunEditorCode,
                        onResetEditorCode = onResetEditorCode,
                        onBack = {
                            onCloseLesson()
                            if (!navController.popBackStack()) {
                                navController.navigate(AppRoutes.Main) {
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
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 420.dp),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.large,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
        ) {
            Column(
                modifier = Modifier.padding(horizontal = 24.dp, vertical = 32.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = "BYTECODE",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
                Text(
                    text = "Mobile Learning",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(8.dp))
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                Text(
                    text = message,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun WelcomeScreen(
    onContinue: () -> Unit,
) {
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
                .widthIn(max = 460.dp),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.large,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
        ) {
            Column(
                modifier = Modifier.padding(28.dp),
                verticalArrangement = Arrangement.spacedBy(0.dp),
            ) {
                Text(
                    text = "BYTECODE",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Learn Java. Write real code. Ship.",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Focused lessons, interactive exercises, and a built-in code runner — all on your phone.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(20.dp))
                Button(
                    onClick = onContinue,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Get started")
                }
            }
        }
    }
}

@Composable
private fun OnboardingScreen(
    onboarding: AppUiState.Onboarding,
    onBack: (OnboardingProfile, Int) -> Unit,
    onNext: (OnboardingProfile, Int) -> Unit,
    onFinish: (OnboardingProfile) -> Unit,
) {
    var profile by remember(onboarding.profile) { mutableStateOf(onboarding.profile) }
    val step = onboarding.step.coerceIn(0, 3)

    val title = when (step) {
        0 -> "Why did you choose Bytecode?"
        1 -> "What do you want from the app?"
        2 -> "Your current experience level"
        else -> "Preferred language to start with"
    }
    val subtitle = "Step ${step + 1} of 4"

    val options = when (step) {
        0 -> listOf("Career growth", "Exam prep", "Build side projects", "Curiosity")
        1 -> listOf("Structured curriculum", "Daily practice", "Build confidence", "Job readiness")
        2 -> listOf("Brand new", "Beginner", "Intermediate", "Advanced")
        else -> listOf("Java", "Kotlin")
    }

    val selected = when (step) {
        0 -> profile.motivation
        1 -> profile.goal
        2 -> profile.experienceLevel
        else -> profile.preferredLanguage
    }

    val canContinue = selected.isNotBlank()

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
                .widthIn(max = 500.dp),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.large,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
        ) {
            Column(
                modifier = Modifier.padding(22.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
                Text(
                    text = title,
                    style = MaterialTheme.typography.headlineSmall,
                )
                Text(
                    text = "Your answers shape the home and curriculum experience.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )

                options.forEach { option ->
                    val isSelected = option == selected
                    OnboardingChoiceRow(
                        label = option,
                        selected = isSelected,
                        onSelect = {
                            profile = when (step) {
                                0 -> profile.copy(motivation = option)
                                1 -> profile.copy(goal = option)
                                2 -> profile.copy(experienceLevel = option)
                                else -> profile.copy(preferredLanguage = option)
                            }
                        },
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    OutlinedButton(
                        onClick = { onBack(profile, step) },
                        enabled = step > 0,
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Back")
                    }
                    if (step < 3) {
                        Button(
                            onClick = { onNext(profile, step) },
                            enabled = canContinue,
                            modifier = Modifier.weight(1f),
                        ) {
                            Text("Next")
                        }
                    } else {
                        Button(
                            onClick = { onFinish(profile) },
                            enabled = canContinue,
                            modifier = Modifier.weight(1f),
                        ) {
                            Text("Finish")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun OnboardingChoiceRow(
    label: String,
    selected: Boolean,
    onSelect: () -> Unit,
) {
    val buttonColors = if (selected) {
        androidx.compose.material3.ButtonDefaults.outlinedButtonColors(
            containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.16f),
            contentColor = MaterialTheme.colorScheme.primary,
        )
    } else {
        androidx.compose.material3.ButtonDefaults.outlinedButtonColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f),
            contentColor = MaterialTheme.colorScheme.onSurface,
        )
    }

    OutlinedButton(
        onClick = onSelect,
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium,
        colors = buttonColors,
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(vertical = 2.dp),
            style = MaterialTheme.typography.bodyMedium,
        )
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
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("BYTECODE", style = MaterialTheme.typography.headlineSmall, color = MaterialTheme.colorScheme.primary)
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
    challengeState: ChallengeUiState,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenProfile: () -> Unit,
    onOpenBillingDetails: () -> Unit,
    onOpenLesson: (String, String, String) -> Unit,
    onOpenBilling: () -> Unit,
    onLoadChallenge: () -> Unit,
    onOpenChallenge: (String) -> Unit,
) {
    HomeScreen(
        state = state,
        challengeState = challengeState,
        onSignOut = onSignOut,
        onRefresh = onRefresh,
        onOpenProfile = onOpenProfile,
        onOpenBillingDetails = onOpenBillingDetails,
        onOpenLesson = onOpenLesson,
        onOpenBilling = onOpenBilling,
        onLoadChallenge = onLoadChallenge,
        onOpenChallenge = onOpenChallenge,
    )
}

private enum class MainTab {
    Home,
    Curriculum,
    Account,
}

@Composable
private fun MainShellScreen(
    state: AppUiState.LoggedIn,
    challengeState: ChallengeUiState,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenLesson: (String, String, String) -> Unit,
    onOpenBilling: () -> Unit,
    onUpdateEditorCode: (String) -> Unit,
    onRunEditorCode: () -> Unit,
    onResetEditorCode: () -> Unit,
    onLoadChallenge: () -> Unit,
    onOpenChallenge: (String) -> Unit,
) {
    var activeTab by remember { mutableStateOf(MainTab.Home) }
    Box(modifier = Modifier.fillMaxSize()) {
        // Content area — pad bottom so it doesn't hide behind the nav bar
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 64.dp),
        ) {
            when (activeTab) {
                MainTab.Home -> HomeScreen(
                    state = state,
                    challengeState = challengeState,
                    onSignOut = onSignOut,
                    onRefresh = onRefresh,
                    onOpenProfile = { activeTab = MainTab.Account },
                    onOpenBillingDetails = { activeTab = MainTab.Account },
                    onOpenLesson = onOpenLesson,
                    onOpenBilling = onOpenBilling,
                    onLoadChallenge = onLoadChallenge,
                    onOpenChallenge = onOpenChallenge,
                )
                MainTab.Curriculum -> CurriculumScreen(
                    state = state,
                    onOpenLesson = onOpenLesson,
                )
                MainTab.Account -> AccountScreen(
                    state = state,
                    onSignOut = onSignOut,
                    onRefresh = onRefresh,
                    onOpenBilling = onOpenBilling,
                )
            }
        }

        // Bottom nav bar pinned to the bottom
        AppBottomNav(
            modifier = Modifier.align(Alignment.BottomCenter),
            activeTab = activeTab,
            onSelectTab = { activeTab = it },
        )
    }
}

@Composable
private fun AppBottomNav(
    modifier: Modifier = Modifier,
    activeTab: MainTab,
    onSelectTab: (MainTab) -> Unit,
) {
    val navItems = listOf(
        Triple(MainTab.Home, "Home", Icons.Outlined.Home),
        Triple(MainTab.Curriculum, "Learn", Icons.Outlined.MenuBook),
        Triple(MainTab.Account, "Account", Icons.Outlined.AccountCircle),
    )
    NavigationBar(
        modifier = modifier
            .fillMaxWidth()
            .windowInsetsPadding(WindowInsets.navigationBars),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 0.dp,
    ) {
        navItems.forEach { (tab, label, icon) ->
            NavigationBarItem(
                selected = activeTab == tab,
                onClick = { onSelectTab(tab) },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        modifier = Modifier.size(22.dp),
                    )
                },
                label = { Text(label, style = MaterialTheme.typography.labelSmall) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    indicatorColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )
        }
    }
}

@Composable
private fun HomeScreen(
    state: AppUiState.LoggedIn,
    challengeState: ChallengeUiState,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenProfile: () -> Unit,
    onOpenBillingDetails: () -> Unit,
    onOpenLesson: (String, String, String) -> Unit,
    onOpenBilling: () -> Unit,
    onLoadChallenge: () -> Unit,
    onOpenChallenge: (String) -> Unit,
) {
    LaunchedEffect(Unit) { onLoadChallenge() }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            DailyChallengeCard(
                challengeState = challengeState,
                onOpen = onOpenChallenge,
            )
        }
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
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    OutlinedButton(
                        onClick = onOpenProfile,
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Profile")
                    }
                    OutlinedButton(
                        onClick = onOpenBillingDetails,
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Billing details")
                    }
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
                KeyValueRow("Total XP", "${state.user.xpTotal} XP")
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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    OutlinedButton(
                        onClick = onOpenBillingDetails,
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Open in app")
                    }
                    Button(onClick = onOpenBilling, modifier = Modifier.weight(1f)) {
                        Text("Manage on web")
                    }
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
private fun CurriculumScreen(
    state: AppUiState.LoggedIn,
    onOpenLesson: (String, String, String) -> Unit,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item {
            BytecodeSectionCard {
                SectionHeader(
                    title = "Curriculum & editor",
                    subtitle = "Browse tracks and run code like the web app",
                )
                if (!state.curriculumError.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    InfoBanner(
                        text = "Sync issue: ${state.curriculumError}",
                        tone = BadgeTone.Warning,
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
                CurriculumBrowser(
                    state = state,
                    onOpenLesson = onOpenLesson,
                )
            }
        }
        val selectedLesson = state.selectedLesson
        if (selectedLesson != null) {
            item {
                BytecodeSectionCard {
                    SectionHeader(
                        title = "Editor",
                        subtitle = "${selectedLesson.lesson.title} (${selectedLesson.lesson.language})",
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    EditorPanel(state = state)
                }
            }
        }
    }
}

@Composable
private fun AccountScreen(
    state: AppUiState.LoggedIn,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenBilling: () -> Unit,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item {
            BytecodeSectionCard {
                SectionHeader(
                    title = "Account overview",
                    subtitle = state.user.email ?: "Unknown user",
                )
                Spacer(modifier = Modifier.height(8.dp))
                val billing = state.billing
                val status = billing?.subscription?.status ?: "none"
                KeyValueRow("Role", state.user.role.replaceFirstChar { it.titlecase() })
                KeyValueRow("Plan", billing?.plan ?: "free")
                KeyValueRow("Subscription", status)
                KeyValueRow("Streak", "${state.user.streakCount} day${if (state.user.streakCount == 1) "" else "s"}")
                KeyValueRow("Total XP", "${state.user.xpTotal} XP")
                KeyValueRow("Premium until", billing?.premiumUntil ?: state.user.premiumUntil ?: "—")
                billing?.subscription?.currentPeriodEnd?.let { KeyValueRow("Current period end", it) }
                billing?.subscription?.graceExpiresAt?.let { KeyValueRow("Grace ends", it) }
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = onOpenBilling,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Manage billing on web")
                }
            }
        }
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Button(onClick = onRefresh, modifier = Modifier.weight(1f)) {
                    Text("Refresh")
                }
                OutlinedButton(onClick = onSignOut, modifier = Modifier.weight(1f)) {
                    Text("Sign out")
                }
            }
        }
    }
}

@Composable
private fun EditorPanel(state: AppUiState.LoggedIn) {
    val lesson = state.selectedLesson ?: return
    val expected = lesson.lesson.expectedOutput
    val output = remember(state.editorResult) {
        val result = state.editorResult ?: return@remember null
        (result.stdout.ifBlank { result.stderr }).ifBlank { null }
    }
    val runTone = when {
        state.editorRunning -> BadgeTone.Default
        !state.editorError.isNullOrBlank() && state.editorError.contains("match", ignoreCase = true) -> {
            if (state.editorError.contains("does not", ignoreCase = true)) BadgeTone.Warning else BadgeTone.Success
        }
        !state.editorError.isNullOrBlank() -> BadgeTone.Warning
        else -> BadgeTone.Default
    }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        OutlinedTextField(
            value = state.editorCode.orEmpty(),
            onValueChange = {},
            enabled = false,
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp),
            textStyle = MaterialTheme.typography.bodySmall.copy(fontFamily = JetBrainsMonoFamily),
            label = { Text("Code editor (interactive editor opens in lesson screen)") },
        )
        if (!expected.isNullOrBlank()) {
            InfoBanner(
                text = "Expected output:\n$expected",
                tone = BadgeTone.Default,
            )
        }
        if (state.editorRunning) {
            InfoBanner(text = "Running code…", tone = BadgeTone.Default)
        }
        if (!state.editorError.isNullOrBlank()) {
            InfoBanner(text = state.editorError, tone = runTone)
        }
        if (!output.isNullOrBlank()) {
            Surface(
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                shape = MaterialTheme.shapes.small,
            ) {
                Text(
                    text = output,
                    modifier = Modifier.padding(10.dp),
                    style = MaterialTheme.typography.bodySmall,
                    fontFamily = JetBrainsMonoFamily,
                )
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
    Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
        lessons.forEachIndexed { index, lesson ->
            val isLast = index == lessons.size - 1
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(enabled = !lesson.isLocked) {
                        onOpenLesson(trackSlug, moduleSlug, lesson.slug)
                    }
                    .background(
                        color = if (lesson.isLocked)
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                        else
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    )
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        lesson.title,
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (lesson.isLocked)
                            MaterialTheme.colorScheme.onSurfaceVariant
                        else
                            MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        "${lesson.duration} min",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                when {
                    lesson.isLocked -> AccessBadge(label = "Locked", tone = BadgeTone.Warning)
                    lesson.isPremium -> AccessBadge(label = "Premium", tone = BadgeTone.Success)
                }
            }
            if (!isLast) {
                HorizontalDivider(
                    color = MaterialTheme.colorScheme.outline.copy(alpha = 0.12f),
                )
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
        border = BorderStroke(
            width = 1.dp,
            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.18f),
        ),
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
        BadgeTone.Success -> MaterialTheme.colorScheme.primary.copy(alpha = 0.16f) to MaterialTheme.colorScheme.primary
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
private fun AppScaffold(
    title: String,
    subtitle: String? = null,
    onBack: () -> Unit,
    content: @Composable () -> Unit,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shape = MaterialTheme.shapes.medium,
                border = BorderStroke(
                    width = 1.dp,
                    color = MaterialTheme.colorScheme.outline.copy(alpha = 0.18f),
                ),
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 4.dp, end = 16.dp, top = 6.dp, bottom = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.Outlined.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.primary,
                        )
                    }
                    Column {
                        Text(title, style = MaterialTheme.typography.titleLarge)
                        if (!subtitle.isNullOrBlank()) {
                            Text(
                                subtitle,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }
        item {
            content()
        }
    }
}

@Composable
private fun InfoBanner(
    text: String,
    tone: BadgeTone,
    modifier: Modifier = Modifier,
) {
    val (container, content) = when (tone) {
        BadgeTone.Default -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f) to MaterialTheme.colorScheme.onSurfaceVariant
        BadgeTone.Success -> MaterialTheme.colorScheme.primary.copy(alpha = 0.14f) to MaterialTheme.colorScheme.primary
        BadgeTone.Warning -> MaterialTheme.colorScheme.error.copy(alpha = 0.12f) to MaterialTheme.colorScheme.error
    }
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .animateContentSize(),
        color = container,
        shape = MaterialTheme.shapes.small,
    ) {
        Text(
            text = text,
            color = content,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
        )
    }
}

@Composable
private fun LoadingPlaceholder(lines: Int = 3) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        repeat(lines) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(if (it == 0) 18.dp else 14.dp),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                shape = MaterialTheme.shapes.small,
            ) {}
        }
    }
}

@Composable
private fun ProfileScreen(
    state: AppUiState.LoggedIn,
    onBack: () -> Unit,
) {
    AppScaffold(
        title = "Profile",
        subtitle = "Identity and progress",
        onBack = onBack,
    ) {
        BytecodeSectionCard {
            SectionHeader(
                title = "Account details",
                subtitle = "Pulled from your authenticated session",
            )
            Spacer(modifier = Modifier.height(8.dp))
            KeyValueRow("Email", state.user.email ?: "—")
            KeyValueRow("Role", state.user.role.replaceFirstChar { it.titlecase() })
            KeyValueRow("Streak", "${state.user.streakCount} day${if (state.user.streakCount == 1) "" else "s"}")
            KeyValueRow("Total XP", "${state.user.xpTotal} XP")
            KeyValueRow("Premium until", state.user.premiumUntil ?: "—")
        }
    }
}

@Composable
private fun BillingScreen(
    state: AppUiState.LoggedIn,
    onBack: () -> Unit,
    onOpenBilling: () -> Unit,
) {
    val billing = state.billing
    val status = billing?.subscription?.status ?: "none"
    AppScaffold(
        title = "Billing",
        subtitle = "Subscription and entitlement status",
        onBack = onBack,
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            BytecodeSectionCard {
                SectionHeader(
                    title = "Current plan",
                    subtitle = "Status synchronized from backend billing",
                )
                Spacer(modifier = Modifier.height(8.dp))
                if (billing == null) {
                    LoadingPlaceholder(lines = 4)
                    Spacer(modifier = Modifier.height(8.dp))
                    InfoBanner(
                        text = "Billing is still syncing. Pull to refresh shortly.",
                        tone = BadgeTone.Default,
                    )
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        AccessBadge(
                            label = "Plan: ${billing.plan}",
                            tone = if (billing.plan == "premium") BadgeTone.Success else BadgeTone.Default,
                        )
                        AccessBadge(
                            label = status,
                            tone = when {
                                status.equals("active", ignoreCase = true) -> BadgeTone.Success
                                status.equals("past_due", ignoreCase = true) -> BadgeTone.Warning
                                else -> BadgeTone.Default
                            },
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    KeyValueRow("Premium until", billing.premiumUntil ?: state.user.premiumUntil ?: "—")
                    billing.subscription?.graceExpiresAt?.let { KeyValueRow("Grace ends", it) }
                }
            }
            InfoBanner(
                text = "Billing changes are completed on web to keep checkout and card management secure.",
                tone = BadgeTone.Default,
            )
            Button(
                onClick = onOpenBilling,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open billing on web")
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
    onUpdateEditorCode: (String) -> Unit,
    onRunEditorCode: () -> Unit,
    onResetEditorCode: () -> Unit,
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
        onUpdateEditorCode = onUpdateEditorCode,
        onRunEditorCode = onRunEditorCode,
        onResetEditorCode = onResetEditorCode,
    )
}

@Composable
private fun LessonScreen(
    state: AppUiState.LoggedIn,
    onBack: () -> Unit,
    onRetry: () -> Unit,
    onOpenBilling: () -> Unit,
    onUpdateEditorCode: (String) -> Unit,
    onRunEditorCode: () -> Unit,
    onResetEditorCode: () -> Unit,
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
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 4.dp, end = 12.dp, top = 6.dp, bottom = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        Icons.Outlined.ArrowBack,
                        contentDescription = "Back",
                        tint = MaterialTheme.colorScheme.primary,
                    )
                }
                Text(
                    lessonTitle,
                    style = MaterialTheme.typography.titleSmall,
                    modifier = Modifier.weight(1f),
                )
                if (isLockedPremium) {
                    Button(onClick = onOpenBilling) {
                        Text("Unlock")
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
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.14f)),
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
                            Spacer(modifier = Modifier.height(12.dp))
                            HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                "Practice",
                                style = MaterialTheme.typography.titleMedium,
                            )
                            Text(
                                text = "Run code on the same backend runner as the website.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            val editorCode = state.editorCode.orEmpty()
                            Surface(
                                color = MaterialTheme.colorScheme.surface,
                                shape = MaterialTheme.shapes.small,
                            ) {
                                BasicTextField(
                                    value = editorCode,
                                    onValueChange = onUpdateEditorCode,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(220.dp)
                                        .padding(10.dp),
                                    textStyle = TextStyle(
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontFamily = JetBrainsMonoFamily,
                                        fontSize = MaterialTheme.typography.bodySmall.fontSize,
                                    ),
                                    cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                                )
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                OutlinedButton(
                                    onClick = onResetEditorCode,
                                    modifier = Modifier.weight(1f),
                                    enabled = !state.editorRunning,
                                ) {
                                    Text("Reset")
                                }
                                Button(
                                    onClick = onRunEditorCode,
                                    modifier = Modifier.weight(1f),
                                    enabled = !state.editorRunning && editorCode.isNotBlank(),
                                ) {
                                    if (state.editorRunning) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.width(16.dp),
                                            strokeWidth = 2.dp,
                                        )
                                    } else {
                                        Text("Run code")
                                    }
                                }
                            }

                            selectedContent.lesson.expectedOutput?.takeIf { it.isNotBlank() }?.let { expected ->
                                InfoBanner(
                                    text = "Expected output:\n$expected",
                                    tone = BadgeTone.Default,
                                )
                            }
                            state.editorError?.takeIf { it.isNotBlank() }?.let { message ->
                                val tone = if (message.contains("match", ignoreCase = true) &&
                                    !message.contains("does not", ignoreCase = true)
                                ) {
                                    BadgeTone.Success
                                } else {
                                    BadgeTone.Warning
                                }
                                InfoBanner(text = message, tone = tone)
                            }
                            state.editorResult?.let { result ->
                                val outputText = if (result.stderr.isNotBlank()) result.stderr else result.stdout
                                Surface(
                                    color = MaterialTheme.colorScheme.surface,
                                    shape = MaterialTheme.shapes.small,
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text(
                                            text = "Output (${result.status.description})",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = outputText.ifBlank { "No output" },
                                            style = MaterialTheme.typography.bodySmall,
                                            fontFamily = JetBrainsMonoFamily,
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        }
    }
}

private sealed interface LessonBlock {
    data class Heading(val level: Int, val text: String) : LessonBlock
    data class Paragraph(val text: String) : LessonBlock
    data class BulletList(val items: List<String>) : LessonBlock
    data class OrderedList(val items: List<String>) : LessonBlock
    data class CodeBlock(val language: String?, val code: String) : LessonBlock
    data class Note(val text: String) : LessonBlock
    data class Divider(val ignored: Unit = Unit) : LessonBlock
}

private fun normalizeInlineMarkdown(text: String): String =
    text
        .replace("**", "")
        .replace("*", "")
        .replace("`", "")
        .trim()

private fun parseLessonBlocks(content: String): List<LessonBlock> {
    val blocks = mutableListOf<LessonBlock>()
    val lines = content.lines()
    var index = 0
    var inCode = false
    var codeLanguage: String? = null
    val codeBuffer = mutableListOf<String>()
    var inNote = false
    val noteBuffer = mutableListOf<String>()

    fun flushParagraph(startIndex: Int): Int {
        val paragraphLines = mutableListOf<String>()
        var i = startIndex
        while (i < lines.size) {
            val raw = lines[i]
            val trimmed = raw.trim()
            if (
                trimmed.isBlank() ||
                trimmed.startsWith("```") ||
                trimmed.startsWith("##") ||
                trimmed.startsWith("- ") ||
                trimmed.matches(Regex("^\\d+\\.\\s+.*")) ||
                trimmed.startsWith("<Note>") ||
                trimmed.startsWith("</Note>") ||
                trimmed == "---"
            ) {
                break
            }
            paragraphLines.add(raw)
            i += 1
        }
        val paragraph = normalizeInlineMarkdown(paragraphLines.joinToString("\n").trim())
        if (paragraph.isNotBlank()) {
            blocks.add(LessonBlock.Paragraph(paragraph))
        }
        return i
    }

    while (index < lines.size) {
        val rawLine = lines[index]
        val trimmed = rawLine.trim()

        if (inCode) {
            if (trimmed.startsWith("```")) {
                val code = codeBuffer.joinToString("\n").trimEnd()
                if (code.isNotBlank()) {
                    blocks.add(LessonBlock.CodeBlock(language = codeLanguage, code = code))
                }
                codeBuffer.clear()
                inCode = false
                codeLanguage = null
            } else {
                codeBuffer.add(rawLine)
            }
            index += 1
            continue
        }

        if (inNote) {
            if (trimmed.startsWith("</Note>")) {
                val noteText = normalizeInlineMarkdown(noteBuffer.joinToString(" ").trim())
                if (noteText.isNotBlank()) {
                    blocks.add(LessonBlock.Note(noteText))
                }
                noteBuffer.clear()
                inNote = false
            } else {
                noteBuffer.add(trimmed)
            }
            index += 1
            continue
        }

        if (trimmed.isBlank()) {
            index += 1
            continue
        }
        if (trimmed == "---") {
            blocks.add(LessonBlock.Divider())
            index += 1
            continue
        }
        if (trimmed.startsWith("<Note>")) {
            val inline = trimmed.removePrefix("<Note>").removeSuffix("</Note>").trim()
            if (trimmed.endsWith("</Note>")) {
                val text = normalizeInlineMarkdown(inline)
                if (text.isNotBlank()) {
                    blocks.add(LessonBlock.Note(text))
                }
            } else {
                inNote = true
                if (inline.isNotBlank()) {
                    noteBuffer.add(inline)
                }
            }
            index += 1
            continue
        }
        if (trimmed.startsWith("<Exercise>") || trimmed.startsWith("</Exercise>")) {
            index += 1
            continue
        }
        if (trimmed.startsWith("<Quiz")) {
            index += 1
            continue
        }
        if (trimmed.startsWith("```")) {
            val language = trimmed.removePrefix("```").trim().ifBlank { null }
            inCode = true
            codeLanguage = language
            codeBuffer.clear()
            index += 1
            continue
        }
        if (trimmed.startsWith("### ")) {
            blocks.add(LessonBlock.Heading(3, normalizeInlineMarkdown(trimmed.removePrefix("### "))))
            index += 1
            continue
        }
        if (trimmed.startsWith("## ")) {
            blocks.add(LessonBlock.Heading(2, normalizeInlineMarkdown(trimmed.removePrefix("## "))))
            index += 1
            continue
        }
        if (trimmed.startsWith("# ")) {
            blocks.add(LessonBlock.Heading(1, normalizeInlineMarkdown(trimmed.removePrefix("# "))))
            index += 1
            continue
        }

        if (trimmed.startsWith("- ")) {
            val items = mutableListOf<String>()
            var i = index
            while (i < lines.size) {
                val candidate = lines[i].trim()
                if (!candidate.startsWith("- ")) break
                items.add(normalizeInlineMarkdown(candidate.removePrefix("- ")))
                i += 1
            }
            if (items.isNotEmpty()) {
                blocks.add(LessonBlock.BulletList(items))
            }
            index = i
            continue
        }

        if (trimmed.matches(Regex("^\\d+\\.\\s+.*"))) {
            val items = mutableListOf<String>()
            var i = index
            while (i < lines.size) {
                val candidate = lines[i].trim()
                if (!candidate.matches(Regex("^\\d+\\.\\s+.*"))) break
                items.add(normalizeInlineMarkdown(candidate.replaceFirst(Regex("^\\d+\\.\\s+"), "")))
                i += 1
            }
            if (items.isNotEmpty()) {
                blocks.add(LessonBlock.OrderedList(items))
            }
            index = i
            continue
        }

        val nextIndex = flushParagraph(index)
        if (nextIndex == index) {
            index += 1
        } else {
            index = nextIndex
        }
    }

    if (inCode && codeBuffer.isNotEmpty()) {
        blocks.add(
            LessonBlock.CodeBlock(
                language = codeLanguage,
                code = codeBuffer.joinToString("\n").trimEnd(),
            ),
        )
    }
    if (inNote && noteBuffer.isNotEmpty()) {
        val noteText = normalizeInlineMarkdown(noteBuffer.joinToString(" ").trim())
        if (noteText.isNotBlank()) {
            blocks.add(LessonBlock.Note(noteText))
        }
    }

    return blocks
}

@Composable
private fun CodeEditorLikeBlock(language: String?, code: String) {
    Surface(
        color = MaterialTheme.colorScheme.background,
        shape = MaterialTheme.shapes.small,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.22f)),
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.7f))
                    .padding(horizontal = 12.dp, vertical = 7.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = language?.ifBlank { "code" } ?: "code",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontFamily = JetBrainsMonoFamily,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                    listOf(
                        MaterialTheme.colorScheme.error.copy(alpha = 0.6f),
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.5f),
                        MaterialTheme.colorScheme.tertiary.copy(alpha = 0.5f),
                    ).forEach { dotColor ->
                        Surface(
                            modifier = Modifier.size(8.dp),
                            color = dotColor,
                            shape = MaterialTheme.shapes.extraSmall,
                        ) {}
                    }
                }
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
            Text(
                text = code,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                style = MaterialTheme.typography.bodySmall,
                fontFamily = JetBrainsMonoFamily,
                color = MaterialTheme.colorScheme.onSurface,
            )
        }
    }
}

@Composable
private fun LessonContentRenderer(content: String) {
    val blocks = remember(content) { parseLessonBlocks(content) }
    blocks.forEach { block ->
        when (block) {
            is LessonBlock.Heading -> {
                val style = when (block.level) {
                    1 -> MaterialTheme.typography.headlineSmall
                    2 -> MaterialTheme.typography.titleLarge
                    else -> MaterialTheme.typography.titleMedium
                }
                Text(
                    text = block.text,
                    style = style,
                    color = MaterialTheme.colorScheme.onSurface,
                )
            }
            is LessonBlock.Paragraph -> {
                Text(
                    text = block.text,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface,
                )
            }
            is LessonBlock.BulletList -> {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    block.items.forEach { item ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                            Text(
                                text = "•",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            Text(
                                text = item,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.weight(1f),
                            )
                        }
                    }
                }
            }
            is LessonBlock.OrderedList -> {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    block.items.forEachIndexed { idx, item ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                            Text(
                                text = "${idx + 1}.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            Text(
                                text = item,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.weight(1f),
                            )
                        }
                    }
                }
            }
            is LessonBlock.CodeBlock -> {
                CodeEditorLikeBlock(language = block.language, code = block.code)
            }
            is LessonBlock.Note -> {
                InfoBanner(text = block.text, tone = BadgeTone.Default)
            }
            is LessonBlock.Divider -> {
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
    }
}

// ── Daily Challenge screens ───────────────────────────────────────────────────

@Composable
private fun DailyChallengeCard(
    challengeState: ChallengeUiState,
    onOpen: (String) -> Unit,
) {
    BytecodeSectionCard {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Daily Challenge", style = MaterialTheme.typography.titleLarge)
            if (challengeState.challenge != null) {
                AccessBadge(
                    label = challengeState.challenge.difficulty.replaceFirstChar { it.titlecase() },
                    tone = when (challengeState.challenge.difficulty) {
                        "easy" -> BadgeTone.Success
                        "intermediate" -> BadgeTone.Warning
                        else -> BadgeTone.Warning
                    },
                )
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        when {
            challengeState.isLoading -> {
                LoadingPlaceholder(lines = 2)
            }
            challengeState.error != null -> {
                InfoBanner(text = challengeState.error, tone = BadgeTone.Warning)
            }
            challengeState.challenge != null -> {
                val c = challengeState.challenge
                Text(
                    c.title,
                    style = MaterialTheme.typography.titleMedium,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    "${c.baseXp} XP · ${c.language.replaceFirstChar { it.titlecase() }}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { onOpen(c.id) },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Solve Today's Challenge")
                }
            }
            else -> {
                Text(
                    "No challenge available today.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun ChallengeDetailScreen(
    challengeState: ChallengeUiState,
    onBack: () -> Unit,
    onOpenEditor: (String) -> Unit,
    onLoadLeaderboard: () -> Unit,
) {
    val challenge = challengeState.challenge

    LaunchedEffect(challenge?.id) {
        if (challenge != null) onLoadLeaderboard()
    }

    AppScaffold(
        title = challenge?.title ?: "Today's Challenge",
        subtitle = challenge?.let { "${it.difficulty.replaceFirstChar { c -> c.titlecase() }} · ${it.language.replaceFirstChar { c -> c.titlecase() }}" },
        onBack = onBack,
    ) {
        if (challenge == null) {
            LoadingPlaceholder(lines = 4)
            return@AppScaffold
        }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            BytecodeSectionCard {
                SectionHeader(title = "Problem", subtitle = "${challenge.baseXp} XP")
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    challenge.description,
                    style = MaterialTheme.typography.bodyMedium,
                )
            }
            if (challenge.visibleExamples.isNotEmpty()) {
                BytecodeSectionCard {
                    SectionHeader(title = "Examples", subtitle = "Visible test cases")
                    Spacer(modifier = Modifier.height(8.dp))
                    challenge.visibleExamples.forEachIndexed { i, ex ->
                        if (i > 0) Spacer(modifier = Modifier.height(10.dp))
                        Surface(
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            shape = MaterialTheme.shapes.small,
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                KeyValueRow("Input", ex.input)
                                KeyValueRow("Output", ex.output)
                                if (!ex.explanation.isNullOrBlank()) {
                                    Text(
                                        ex.explanation,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                            }
                        }
                    }
                }
            }
            Button(
                onClick = { onOpenEditor(challenge.id) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open Editor")
            }
            // Leaderboard
            BytecodeSectionCard {
                SectionHeader(
                    title = "Today's Leaderboard",
                    subtitle = "First correct solves",
                )
                Spacer(modifier = Modifier.height(8.dp))
                when {
                    challengeState.leaderboardLoading -> LoadingPlaceholder(lines = 3)
                    challengeState.leaderboard == null || challengeState.leaderboard.entries.isEmpty() -> {
                        Text(
                            "No solves yet — be the first!",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    else -> {
                        challengeState.leaderboard.entries.forEachIndexed { i, entry ->
                            if (i > 0) {
                                HorizontalDivider(
                                    modifier = Modifier.padding(vertical = 6.dp),
                                    color = MaterialTheme.colorScheme.outline.copy(alpha = 0.12f),
                                )
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    Text(
                                        "#${i + 1}",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = when (i) {
                                            0 -> MaterialTheme.colorScheme.primary
                                            1 -> MaterialTheme.colorScheme.onSurfaceVariant
                                            2 -> MaterialTheme.colorScheme.onSurfaceVariant
                                            else -> MaterialTheme.colorScheme.onSurfaceVariant
                                        },
                                    )
                                    Text(
                                        entry.displayName,
                                        style = MaterialTheme.typography.bodyMedium,
                                    )
                                }
                                val timeStr = remember(entry.solvedAt) {
                                    try {
                                        val instant = java.time.Instant.parse(entry.solvedAt)
                                        val local = instant.atZone(java.time.ZoneId.systemDefault())
                                        "%02d:%02d".format(local.hour, local.minute)
                                    } catch (_: Exception) { "" }
                                }
                                if (timeStr.isNotBlank()) {
                                    Text(
                                        timeStr,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CodeEditorScreen(
    challengeState: ChallengeUiState,
    onBack: () -> Unit,
    onUpdateCode: (String) -> Unit,
    onSubmit: () -> Unit,
    onReset: () -> Unit,
) {
    val challenge = challengeState.challenge
    val result = challengeState.submitResult

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        // Header bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.medium,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 4.dp, end = 12.dp, top = 6.dp, bottom = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Outlined.ArrowBack, contentDescription = "Back", tint = MaterialTheme.colorScheme.primary)
                }
                Text(
                    challenge?.title ?: "Editor",
                    style = MaterialTheme.typography.titleSmall,
                    modifier = Modifier.weight(1f),
                )
                if (challenge != null) {
                    AccessBadge(
                        label = challenge.language.replaceFirstChar { it.titlecase() },
                        tone = BadgeTone.Default,
                    )
                }
            }
        }

        // Code editor
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.medium,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.14f)),
        ) {
            BasicTextField(
                value = challengeState.code,
                onValueChange = onUpdateCode,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp),
                textStyle = TextStyle(
                    color = MaterialTheme.colorScheme.onSurface,
                    fontFamily = JetBrainsMonoFamily,
                    fontSize = MaterialTheme.typography.bodySmall.fontSize,
                ),
                cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
            )
        }

        // Action buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            OutlinedButton(
                onClick = onReset,
                modifier = Modifier.weight(1f),
                enabled = !challengeState.isSubmitting,
            ) {
                Text("Reset")
            }
            Button(
                onClick = onSubmit,
                modifier = Modifier.weight(1f),
                enabled = !challengeState.isSubmitting && challengeState.code.isNotBlank(),
            ) {
                if (challengeState.isSubmitting) {
                    CircularProgressIndicator(modifier = Modifier.width(16.dp), strokeWidth = 2.dp)
                } else {
                    Text("Submit")
                }
            }
        }

        // Error banner
        if (!challengeState.error.isNullOrBlank()) {
            InfoBanner(text = challengeState.error, tone = BadgeTone.Warning)
        }

        // Submit result panel
        if (result != null) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = if (result.isCorrect)
                    MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                else
                    MaterialTheme.colorScheme.error.copy(alpha = 0.1f),
                shape = MaterialTheme.shapes.medium,
                border = BorderStroke(
                    1.dp,
                    if (result.isCorrect) MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
                    else MaterialTheme.colorScheme.error.copy(alpha = 0.3f),
                ),
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            if (result.isCorrect) "All tests passed!" else "Some tests failed",
                            style = MaterialTheme.typography.titleSmall,
                            color = if (result.isCorrect) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                        )
                        if (result.xpAwarded != null && result.xpAwarded > 0) {
                            AccessBadge(label = "+${result.xpAwarded} XP", tone = BadgeTone.Success)
                        }
                    }
                    if (!result.compileError.isNullOrBlank()) {
                        Text(
                            "Compile error: ${result.compileError}",
                            style = MaterialTheme.typography.bodySmall,
                            fontFamily = JetBrainsMonoFamily,
                            color = MaterialTheme.colorScheme.error,
                        )
                    } else {
                        result.visibleResults.forEach { tc ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.Top,
                            ) {
                                Text(
                                    if (tc.passed) "✓" else "✗",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = if (tc.passed) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                                )
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        "Expected: ${tc.expected}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                    if (!tc.actual.isNullOrBlank()) {
                                        Text(
                                            "Got: ${tc.actual}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = if (tc.passed) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.error,
                                        )
                                    }
                                    if (!tc.error.isNullOrBlank()) {
                                        Text(
                                            "Error: ${tc.error}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.error,
                                        )
                                    }
                                }
                            }
                        }
                        if (result.hiddenTotal > 0) {
                            Text(
                                "Hidden tests: ${result.hiddenPass}/${result.hiddenTotal} passed",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        result.runtimeMs?.let { ms ->
                            Text(
                                "Runtime: ${ms}ms",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }
    }
}
