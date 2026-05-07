package dev.bytecode.android.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
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
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.KeyboardArrowDown
import androidx.compose.material.icons.outlined.KeyboardArrowRight
import androidx.compose.material.icons.outlined.OpenInNew
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
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.outlined.EmojiEvents
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocalFireDepartment
import androidx.compose.material.icons.outlined.MilitaryTech
import androidx.compose.material.icons.outlined.People
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.TextButton
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextOverflow
import kotlinx.coroutines.delay
import dev.bytecode.android.BuildConfig
import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.data.model.ChallengeSubmitResponse
import dev.bytecode.android.data.model.FriendDto
import dev.bytecode.android.data.model.OnboardingProfile
import dev.bytecode.android.data.model.PendingRequestDto
import dev.bytecode.android.data.model.RankedBoardResponse
import dev.bytecode.android.data.model.TestCaseResultDto
import androidx.compose.material3.Checkbox
import dev.bytecode.android.data.model.ChallengeDto
import dev.bytecode.android.data.model.DiscussionPostDto
import dev.bytecode.android.data.model.DuelDto
import dev.bytecode.android.data.model.SharedSolutionDto
import dev.bytecode.android.ui.challenge.ChallengeUiState
import dev.bytecode.android.ui.challenge.ChallengeViewModel
import dev.bytecode.android.ui.discussion.DiscussionUiState
import dev.bytecode.android.ui.discussion.DiscussionViewModel
import dev.bytecode.android.ui.duel.DuelUiState
import dev.bytecode.android.ui.duel.DuelViewModel
import dev.bytecode.android.ui.friends.FriendsUiState
import dev.bytecode.android.ui.friends.FriendsViewModel
import dev.bytecode.android.ui.leaderboard.LeaderboardTab
import dev.bytecode.android.ui.leaderboard.LeaderboardUiState
import dev.bytecode.android.ui.leaderboard.LeaderboardViewModel
import dev.bytecode.android.ui.badges.BadgesUiState
import dev.bytecode.android.ui.badges.BadgesViewModel
import dev.bytecode.android.ui.solution.SolutionUiState
import dev.bytecode.android.ui.solution.SolutionViewModel
import dev.bytecode.android.ui.state.AppUiState
import dev.bytecode.android.ui.theme.BytecodeTheme
import dev.bytecode.android.ui.theme.JetBrainsMonoFamily

private val JAVA_KEYWORDS = setOf(
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "final", "finally", "float", "for", "goto", "if", "implements",
    "import", "instanceof", "int", "interface", "long", "native", "new", "null",
    "package", "private", "protected", "public", "return", "short", "static",
    "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
    "transient", "true", "false", "try", "void", "volatile", "while",
    "fun", "val", "var", "when", "object", "companion", "data", "sealed",
    "open", "override", "suspend", "inline", "reified", "by", "in", "out",
    "where", "init", "constructor", "it", "is", "as", "typealias", "lateinit",
    "crossinline", "noinline", "vararg", "external",
)

private fun highlightCode(
    code: String,
    keywordColor: Color,
    stringColor: Color,
    numberColor: Color,
    commentColor: Color,
    typeColor: Color,
    defaultColor: Color,
): AnnotatedString = buildAnnotatedString {
    var i = 0
    val n = code.length
    while (i < n) {
        when {
            // Line comment
            i + 1 < n && code[i] == '/' && code[i + 1] == '/' -> {
                val end = code.indexOf('\n', i).let { if (it == -1) n else it }
                pushStyle(SpanStyle(color = commentColor))
                append(code.substring(i, end))
                pop(); i = end
            }
            // Block comment
            i + 1 < n && code[i] == '/' && code[i + 1] == '*' -> {
                val end = code.indexOf("*/", i + 2).let { if (it == -1) n else it + 2 }
                pushStyle(SpanStyle(color = commentColor))
                append(code.substring(i, end))
                pop(); i = end
            }
            // String literal
            code[i] == '"' -> {
                var j = i + 1
                while (j < n) {
                    if (code[j] == '\\') { j += 2; continue }
                    if (code[j] == '"') { j++; break }
                    j++
                }
                pushStyle(SpanStyle(color = stringColor))
                append(code.substring(i, j))
                pop(); i = j
            }
            // Char literal
            code[i] == '\'' -> {
                var j = i + 1
                while (j < n) {
                    if (code[j] == '\\') { j += 2; continue }
                    if (code[j] == '\'') { j++; break }
                    j++
                }
                pushStyle(SpanStyle(color = stringColor))
                append(code.substring(i, j))
                pop(); i = j
            }
            // Annotation
            code[i] == '@' -> {
                var j = i + 1
                while (j < n && (code[j].isLetterOrDigit() || code[j] == '_')) j++
                pushStyle(SpanStyle(color = numberColor))
                append(code.substring(i, j))
                pop(); i = j
            }
            // Number
            code[i].isDigit() -> {
                var j = i + 1
                if (code[i] == '0' && j < n && (code[j] == 'x' || code[j] == 'X')) {
                    j++
                    while (j < n && code[j].isLetterOrDigit()) j++
                } else {
                    while (j < n && (code[j].isDigit() || code[j] == '.' || code[j] == '_' ||
                                code[j] == 'L' || code[j] == 'f' || code[j] == 'F')) j++
                }
                pushStyle(SpanStyle(color = numberColor))
                append(code.substring(i, j))
                pop(); i = j
            }
            // Identifier
            code[i].isLetter() || code[i] == '_' -> {
                var j = i + 1
                while (j < n && (code[j].isLetterOrDigit() || code[j] == '_')) j++
                val word = code.substring(i, j)
                when {
                    word in JAVA_KEYWORDS -> {
                        pushStyle(SpanStyle(color = keywordColor, fontWeight = FontWeight.SemiBold))
                        append(word); pop()
                    }
                    word[0].isUpperCase() -> {
                        pushStyle(SpanStyle(color = typeColor))
                        append(word); pop()
                    }
                    else -> {
                        pushStyle(SpanStyle(color = defaultColor))
                        append(word); pop()
                    }
                }
                i = j
            }
            else -> {
                pushStyle(SpanStyle(color = defaultColor))
                append(code[i].toString())
                pop(); i++
            }
        }
    }
}

private object AppRoutes {
    const val AuthGraph = "auth"
    const val AppGraph = "app"
    const val Welcome = "auth/welcome"
    const val Onboarding = "auth/onboarding"
    const val SignIn = "auth/sign-in"
    const val Main = "app/main"
    const val Archive = "app/archive"
    const val ChallengeDetailPattern = "app/challenge/{challengeId}"
    const val CodeEditorPattern = "app/challenge/{challengeId}/editor"

    fun challengeDetail(id: String): String = "app/challenge/${Uri.encode(id)}"
    fun codeEditor(id: String): String = "app/challenge/${Uri.encode(id)}/editor"
}

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by koinViewModel()
    private val challengeViewModel: ChallengeViewModel by koinViewModel()
    private val leaderboardViewModel: LeaderboardViewModel by koinViewModel()
    private val friendsViewModel: FriendsViewModel by koinViewModel()
    private val discussionViewModel: DiscussionViewModel by koinViewModel()
    private val solutionViewModel: SolutionViewModel by koinViewModel()
    private val duelViewModel: DuelViewModel by koinViewModel()
    private val badgesViewModel: BadgesViewModel by koinViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BytecodeTheme(darkTheme = true) {
                Surface(
                    modifier = Modifier
                        .fillMaxSize()
                        .windowInsetsPadding(WindowInsets.statusBars),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    val state by viewModel.uiState.collectAsStateWithLifecycle()
                    val updateAvailable by viewModel.updateAvailable.collectAsStateWithLifecycle()
                    val updateDownloadUrl by viewModel.updateDownloadUrl.collectAsStateWithLifecycle()
                    val challengeState by challengeViewModel.uiState.collectAsStateWithLifecycle()
                    val leaderboardState by leaderboardViewModel.uiState.collectAsStateWithLifecycle()
                    val friendsState by friendsViewModel.uiState.collectAsStateWithLifecycle()
                    val discussionState by discussionViewModel.uiState.collectAsStateWithLifecycle()
                    val solutionState by solutionViewModel.uiState.collectAsStateWithLifecycle()
                    val duelState by duelViewModel.uiState.collectAsStateWithLifecycle()
                    val badgesState by badgesViewModel.uiState.collectAsStateWithLifecycle()
                    Box(modifier = Modifier.fillMaxSize()) {
                    AppScreen(
                        updateAvailable = updateAvailable,
                        updateDownloadUrl = updateDownloadUrl,
                        onDismissUpdate = { viewModel.dismissUpdate() },
                        state = state,
                        challengeState = challengeState,
                        leaderboardState = leaderboardState,
                        friendsState = friendsState,
                        discussionState = discussionState,
                        solutionState = solutionState,
                        duelState = duelState,
                        badgesState = badgesState,
                        onContinueWelcome = { viewModel.completeWelcome() },
                        onOnboardingNext = { profile, step -> viewModel.onboardingNext(profile, step) },
                        onOnboardingBack = { profile, step -> viewModel.onboardingBack(profile, step) },
                        onCompleteOnboarding = { profile -> viewModel.completeOnboarding(profile) },
                        onSignIn = { email, password -> viewModel.signIn(email, password) },
                        onSignOut = { viewModel.signOut() },
                        onRefresh = { viewModel.refresh() },
                        onOpenBilling = {
                            startActivity(Intent(Intent.ACTION_VIEW,
                                Uri.parse("${AppConfig.WEB_BASE_URL}/me/billing")))
                        },
                        onLoadChallenge = { challengeViewModel.loadDaily() },
                        onSelectChallenge = { dto -> challengeViewModel.selectChallenge(dto) },
                        onUpdateChallengeCode = { code -> challengeViewModel.updateCode(code) },
                        onSubmitChallenge = { challengeViewModel.submit() },
                        onResetChallengeCode = { challengeViewModel.resetCode() },
                        onClearSubmitResult = { challengeViewModel.clearSubmitResult() },
                        onToggleShareOnSubmit = { challengeViewModel.toggleShareOnSubmit() },
                        onLoadLeaderboard = { challengeViewModel.loadLeaderboard() },
                        onSelectLeaderboardTab = { tab -> leaderboardViewModel.selectTab(tab) },
                        onRefreshLeaderboard = { leaderboardViewModel.refresh() },
                        onLoadMyRanks = { leaderboardViewModel.loadMyRanks() },
                        onLoadFriends = { friendsViewModel.load() },
                        onFriendHandleChange = { handle -> friendsViewModel.updateHandleInput(handle) },
                        onSendFriendRequest = { friendsViewModel.sendRequest() },
                        onAcceptFriendRequest = { id -> friendsViewModel.acceptRequest(id) },
                        onRemoveFriend = { id -> friendsViewModel.removeFriend(id) },
                        onLoadDiscussion = { id -> discussionViewModel.loadPosts(id) },
                        onDiscussionBodyChange = { text -> discussionViewModel.updateBody(text) },
                        onPostDiscussion = { id -> discussionViewModel.postMessage(id) },
                        onDeletePost = { cid, pid -> discussionViewModel.deletePost(cid, pid) },
                        onUpvotePost = { cid, pid -> discussionViewModel.upvotePost(cid, pid) },
                        onLoadSolutions = { id -> solutionViewModel.loadSolutions(id) },
                        onUpvoteSolution = { cid, sid -> solutionViewModel.upvote(cid, sid) },
                        onRemoveSolutionUpvote = { cid, sid -> solutionViewModel.removeUpvote(cid, sid) },
                        onLoadDuels = { duelViewModel.load() },
                        onChallengeFriend = { oid, cid -> duelViewModel.challengeFriend(oid, cid) },
                        onAcceptDuel = { id -> duelViewModel.acceptDuel(id) },
                        onDeclineDuel = { id -> duelViewModel.declineDuel(id) },
                        onLoadBadges = { badgesViewModel.load() },
                        onSelectBadge = { id -> badgesViewModel.selectBadge(id) },
                        onUpdateHandle = { handle -> viewModel.updateHandle(handle) },
                    )
                    }
                }
            }
        }
    }
}

@Composable
private fun AppScreen(
    state: AppUiState,
    updateAvailable: Boolean,
    updateDownloadUrl: String?,
    onDismissUpdate: () -> Unit,
    challengeState: ChallengeUiState,
    leaderboardState: LeaderboardUiState,
    friendsState: FriendsUiState,
    discussionState: DiscussionUiState,
    solutionState: SolutionUiState,
    duelState: DuelUiState,
    badgesState: BadgesUiState,
    onContinueWelcome: () -> Unit,
    onOnboardingNext: (OnboardingProfile, Int) -> Unit,
    onOnboardingBack: (OnboardingProfile, Int) -> Unit,
    onCompleteOnboarding: (OnboardingProfile) -> Unit,
    onSignIn: (String, String) -> Unit,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenBilling: () -> Unit,
    onLoadChallenge: () -> Unit,
    onSelectChallenge: (dev.bytecode.android.data.model.ChallengeDto) -> Unit,
    onUpdateChallengeCode: (String) -> Unit,
    onSubmitChallenge: () -> Unit,
    onResetChallengeCode: () -> Unit,
    onClearSubmitResult: () -> Unit,
    onToggleShareOnSubmit: () -> Unit,
    onLoadLeaderboard: () -> Unit,
    onSelectLeaderboardTab: (LeaderboardTab) -> Unit,
    onRefreshLeaderboard: () -> Unit,
    onLoadMyRanks: () -> Unit,
    onLoadFriends: () -> Unit,
    onFriendHandleChange: (String) -> Unit,
    onSendFriendRequest: () -> Unit,
    onAcceptFriendRequest: (String) -> Unit,
    onRemoveFriend: (String) -> Unit,
    onLoadDiscussion: (String) -> Unit,
    onDiscussionBodyChange: (String) -> Unit,
    onPostDiscussion: (String) -> Unit,
    onDeletePost: (String, String) -> Unit,
    onUpvotePost: (String, String) -> Unit,
    onLoadSolutions: (String) -> Unit,
    onUpvoteSolution: (String, String) -> Unit,
    onRemoveSolutionUpvote: (String, String) -> Unit,
    onLoadDuels: () -> Unit,
    onChallengeFriend: (String, String) -> Unit,
    onAcceptDuel: (String) -> Unit,
    onDeclineDuel: (String) -> Unit,
    onLoadBadges: () -> Unit,
    onSelectBadge: (String?) -> Unit,
    onUpdateHandle: (String) -> Unit = {},
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
                        updateAvailable = updateAvailable,
                        updateDownloadUrl = updateDownloadUrl,
                        onDismissUpdate = onDismissUpdate,
                        challengeState = challengeState,
                        leaderboardState = leaderboardState,
                        friendsState = friendsState,
                        badgesState = badgesState,
                        onSignOut = onSignOut,
                        onRefresh = onRefresh,
                        onOpenBilling = onOpenBilling,
                        onLoadChallenge = onLoadChallenge,
                        onSelectChallenge = onSelectChallenge,
                        onOpenArchive = {
                            navController.navigate(AppRoutes.Archive) { launchSingleTop = true }
                        },
                        onOpenChallenge = { id ->
                            navController.navigate(AppRoutes.challengeDetail(id)) {
                                launchSingleTop = true
                            }
                        },
                        onSelectLeaderboardTab = onSelectLeaderboardTab,
                        onRefreshLeaderboard = onRefreshLeaderboard,
                        onLoadMyRanks = onLoadMyRanks,
                        onLoadFriends = onLoadFriends,
                        onFriendHandleChange = onFriendHandleChange,
                        onSendFriendRequest = onSendFriendRequest,
                        onAcceptFriendRequest = onAcceptFriendRequest,
                        onRemoveFriend = onRemoveFriend,
                        onLoadBadges = onLoadBadges,
                        onSelectBadge = onSelectBadge,
                        onUpdateHandle = onUpdateHandle,
                    )
                }
            }

            composable(
                route = AppRoutes.ChallengeDetailPattern,
                arguments = listOf(navArgument("challengeId") { type = NavType.StringType }),
            ) {
                ChallengeDetailScreen(
                    challengeState = challengeState,
                    discussionState = discussionState,
                    solutionState = solutionState,
                    duelState = duelState,
                    onBack = { navController.popBackStack() },
                    onOpenEditor = { id ->
                        navController.navigate(AppRoutes.codeEditor(id)) {
                            launchSingleTop = true
                        }
                    },
                    onLoadLeaderboard = onLoadLeaderboard,
                    onLoadDiscussion = onLoadDiscussion,
                    onDiscussionBodyChange = onDiscussionBodyChange,
                    onPostDiscussion = onPostDiscussion,
                    onDeletePost = onDeletePost,
                    onUpvotePost = onUpvotePost,
                    onLoadSolutions = onLoadSolutions,
                    onUpvoteSolution = onUpvoteSolution,
                    onRemoveSolutionUpvote = onRemoveSolutionUpvote,
                    onLoadDuels = onLoadDuels,
                    onChallengeFriend = onChallengeFriend,
                    onAcceptDuel = onAcceptDuel,
                    onDeclineDuel = onDeclineDuel,
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
                    onToggleShare = onToggleShareOnSubmit,
                )
            }

            composable(route = AppRoutes.Archive) {
                ArchiveScreen(onBack = { navController.popBackStack() })
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
                    text = "Code. Compete. Climb.",
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
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "v${BuildConfig.VERSION_NAME}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
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

private enum class MainTab {
    Home,
    Leaderboards,
    Badges,
    Friends,
    Profile,
}

@Composable
private fun MainShellScreen(
    state: AppUiState.LoggedIn,
    updateAvailable: Boolean,
    updateDownloadUrl: String?,
    onDismissUpdate: () -> Unit,
    challengeState: ChallengeUiState,
    leaderboardState: LeaderboardUiState,
    friendsState: FriendsUiState,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenBilling: () -> Unit,
    onLoadChallenge: () -> Unit,
    onSelectChallenge: (dev.bytecode.android.data.model.ChallengeDto) -> Unit,
    onOpenArchive: () -> Unit,
    onOpenChallenge: (String) -> Unit,
    onSelectLeaderboardTab: (LeaderboardTab) -> Unit,
    onRefreshLeaderboard: () -> Unit,
    onLoadMyRanks: () -> Unit,
    onLoadFriends: () -> Unit,
    onFriendHandleChange: (String) -> Unit,
    onSendFriendRequest: () -> Unit,
    onAcceptFriendRequest: (String) -> Unit,
    onRemoveFriend: (String) -> Unit,
    badgesState: BadgesUiState,
    onLoadBadges: () -> Unit,
    onSelectBadge: (String?) -> Unit,
    onUpdateHandle: (String) -> Unit = {},
) {
    var activeTab by remember { mutableStateOf(MainTab.Home) }
    Box(modifier = Modifier.fillMaxSize()) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 64.dp),
        ) {
            when (activeTab) {
                MainTab.Home -> HomeScreen(
                    state = state,
                    challengeState = challengeState,
                    onLoadChallenge = onLoadChallenge,
                    onSelectChallenge = { dto ->
                        onSelectChallenge(dto)
                        onOpenChallenge(dto.id)
                    },
                    onOpenArchive = onOpenArchive,
                )
                MainTab.Leaderboards -> LeaderboardsScreen(
                    leaderboardState = leaderboardState,
                    friendsState = friendsState,
                    hasFriends = friendsState.friends.isNotEmpty(),
                    onSelectTab = onSelectLeaderboardTab,
                    onRefresh = onRefreshLeaderboard,
                    onLoadMyRanks = onLoadMyRanks,
                    onLoadFriends = onLoadFriends,
                    onFriendHandleChange = onFriendHandleChange,
                    onSendFriendRequest = onSendFriendRequest,
                    onAcceptFriendRequest = onAcceptFriendRequest,
                    onRemoveFriend = onRemoveFriend,
                )
                MainTab.Badges -> BadgesScreen(
                    badgesState = badgesState,
                    userXpTotal = state.user.xpTotal,
                    onLoad = onLoadBadges,
                    onSelectBadge = onSelectBadge,
                )
                MainTab.Friends -> FriendsTabScreen(
                    friendsState = friendsState,
                    onLoad = onLoadFriends,
                    onFriendHandleChange = onFriendHandleChange,
                    onSendFriendRequest = onSendFriendRequest,
                    onAcceptFriendRequest = onAcceptFriendRequest,
                    onRemoveFriend = onRemoveFriend,
                )
                MainTab.Profile -> ProfileScreen(
                    state = state,
                    onSignOut = onSignOut,
                    onRefresh = onRefresh,
                    onOpenBilling = onOpenBilling,
                    onUpdateHandle = onUpdateHandle,
                )
            }
        }

        AppBottomNav(
            modifier = Modifier.align(Alignment.BottomCenter),
            activeTab = activeTab,
            onSelectTab = { activeTab = it },
        )

        if (updateAvailable) {
            UpdateBanner(
                downloadUrl = updateDownloadUrl,
                onDismiss = onDismissUpdate,
                modifier = Modifier.align(Alignment.TopCenter),
            )
        }
    }
}

@Composable
private fun UpdateBanner(
    downloadUrl: String?,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.95f))
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(
            text = "Update available",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onPrimary,
            modifier = Modifier.weight(1f),
        )
        if (downloadUrl != null) {
            TextButton(
                onClick = {
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(downloadUrl)))
                },
            ) {
                Text(
                    "Download",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onPrimary,
                )
            }
        }
        IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
            Text(
                "✕",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onPrimary,
            )
        }
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
        Triple(MainTab.Leaderboards, "Ranks", Icons.Outlined.EmojiEvents),
        Triple(MainTab.Badges, "Badges", Icons.Outlined.MilitaryTech),
        Triple(MainTab.Friends, "Friends", Icons.Outlined.People),
        Triple(MainTab.Profile, "Profile", Icons.Outlined.AccountCircle),
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
    onLoadChallenge: () -> Unit,
    onSelectChallenge: (dev.bytecode.android.data.model.ChallengeDto) -> Unit,
    onOpenArchive: () -> Unit,
) {
    LaunchedEffect(Unit) { onLoadChallenge() }

    val daily = challengeState.dailyChallenges

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column {
                    Text(
                        "Hey, ${state.user.email?.substringBefore("@") ?: "there"}!",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        "Ready to code?",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Surface(
                    shape = MaterialTheme.shapes.small,
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                ) {
                    Text(
                        "${state.user.xpTotal} XP",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }
        }
        item {
            BytecodeSectionCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        Icons.Outlined.LocalFireDepartment,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(32.dp),
                    )
                    Column {
                        Text(
                            "${state.user.streakCount} day streak",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                        )
                        Text(
                            "Keep it going!",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
        item {
            Text(
                "Today's Challenges",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
            )
        }
        if (challengeState.dailyLoading) {
            item {
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(modifier = Modifier.size(32.dp))
                }
            }
        } else if (challengeState.dailyError != null) {
            item {
                Text(
                    challengeState.dailyError,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error,
                )
            }
        } else {
            item {
                DifficultyCard(
                    difficulty = "Easy",
                    challenge = daily?.easy,
                    onSelect = onSelectChallenge,
                )
            }
            item {
                DifficultyCard(
                    difficulty = "Intermediate",
                    challenge = daily?.intermediate,
                    onSelect = onSelectChallenge,
                )
            }
            item {
                DifficultyCard(
                    difficulty = "Hard",
                    challenge = daily?.hard,
                    onSelect = onSelectChallenge,
                )
            }
        }
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.25f)),
                onClick = onOpenArchive,
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column {
                        Text(
                            "Past Challenges",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.SemiBold,
                        )
                        Text(
                            "Browse the archive",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Icon(
                        Icons.Outlined.ArrowBack,
                        contentDescription = null,
                        modifier = Modifier
                            .size(20.dp)
                            .then(
                                Modifier.scale(scaleX = -1f, scaleY = 1f)
                            ),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}

@Composable
private fun DifficultyCard(
    difficulty: String,
    challenge: dev.bytecode.android.data.model.ChallengeDto?,
    onSelect: (dev.bytecode.android.data.model.ChallengeDto) -> Unit,
) {
    val difficultyColor = when (difficulty.lowercase()) {
        "easy" -> androidx.compose.ui.graphics.Color(0xFF4CAF50)
        "intermediate", "medium" -> androidx.compose.ui.graphics.Color(0xFFFFC107)
        else -> androidx.compose.ui.graphics.Color(0xFFF44336)
    }
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, difficultyColor.copy(alpha = 0.4f)),
        onClick = { challenge?.let { onSelect(it) } },
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Surface(
                        shape = MaterialTheme.shapes.extraSmall,
                        color = difficultyColor.copy(alpha = 0.15f),
                    ) {
                        Text(
                            difficulty,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = difficultyColor,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                if (challenge != null) {
                    Text(
                        challenge.title,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        "${challenge.baseXp} XP · ${challenge.language.replaceFirstChar { it.titlecase() }}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                } else {
                    Text(
                        "No challenge today",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            if (challenge != null) {
                Text(
                    "›",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun FriendsTabScreen(
    friendsState: FriendsUiState,
    onLoad: () -> Unit,
    onFriendHandleChange: (String) -> Unit,
    onSendFriendRequest: () -> Unit,
    onAcceptFriendRequest: (String) -> Unit,
    onRemoveFriend: (String) -> Unit,
) {
    FriendsLeaderboardContent(
        friendsState = friendsState,
        onLoadFriends = onLoad,
        onFriendHandleChange = onFriendHandleChange,
        onSendFriendRequest = onSendFriendRequest,
        onAcceptFriendRequest = onAcceptFriendRequest,
        onRemoveFriend = onRemoveFriend,
    )
}

@Composable
private fun ProfileScreen(
    state: AppUiState.LoggedIn,
    onSignOut: () -> Unit,
    onRefresh: () -> Unit,
    onOpenBilling: () -> Unit,
    onUpdateHandle: (String) -> Unit = {},
) {
    val displayName = state.user.handle
        ?: state.user.email?.substringBefore("@")
        ?: "there"
    val billingPlan = state.billing?.plan ?: "free"

    var handleInput by remember(state.user.handle) { mutableStateOf(state.user.handle ?: "") }
    var handleSaved by remember { mutableStateOf(false) }
    var settingsExpanded by remember { mutableStateOf(false) }
    var accountExpanded by remember { mutableStateOf(false) }
    var appSettingsExpanded by remember { mutableStateOf(false) }
    var statsExpanded by remember { mutableStateOf(false) }
    var leaderboardVisible by remember { mutableStateOf(true) }
    var dailyReminder by remember { mutableStateOf(false) }
    var friendActivity by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(top = 20.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {

        // ── 1. Screen title ─────────────────────────────────────────────────
        item {
            Box(
                modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    "Account",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }

        // ── 2. Welcome banner ───────────────────────────────────────────────
        item {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.07f),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.18f)),
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.18f), CircleShape),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            displayName.firstOrNull()?.uppercaseChar()?.toString() ?: "?",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Welcome back,",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            displayName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                    AccessBadge(
                        label = if (billingPlan == "premium") "Premium" else "Free",
                        tone = if (billingPlan == "premium") BadgeTone.Success else BadgeTone.Default,
                    )
                }
            }
        }

        // ── 3. Settings (collapsible) ───────────────────────────────────────
        item {
            Surface(
                modifier = Modifier.fillMaxWidth().animateContentSize(),
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
            ) {
                Column {
                    // Header row — tap to expand/collapse
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { settingsExpanded = !settingsExpanded }
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Icon(
                            Icons.Outlined.Settings,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                            tint = MaterialTheme.colorScheme.primary,
                        )
                        Text(
                            "Settings",
                            style = MaterialTheme.typography.titleSmall,
                            modifier = Modifier.weight(1f),
                        )
                        Icon(
                            if (settingsExpanded) Icons.Outlined.KeyboardArrowDown else Icons.Outlined.KeyboardArrowRight,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }

                    if (settingsExpanded) {
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f))

                        // ── Account sub-section ─────────────────────────────
                        Column(modifier = Modifier.animateContentSize()) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { accountExpanded = !accountExpanded }
                                    .padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                Icon(
                                    Icons.Outlined.AccountCircle,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                                Text(
                                    "Account",
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.weight(1f),
                                )
                                Icon(
                                    if (accountExpanded) Icons.Outlined.KeyboardArrowDown else Icons.Outlined.KeyboardArrowRight,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }

                            if (accountExpanded) {
                                Column(
                                    modifier = Modifier
                                        .padding(horizontal = 16.dp)
                                        .padding(bottom = 12.dp),
                                    verticalArrangement = Arrangement.spacedBy(10.dp),
                                ) {
                                    // Email (read-only)
                                    OutlinedTextField(
                                        value = state.user.email ?: "",
                                        onValueChange = {},
                                        modifier = Modifier.fillMaxWidth(),
                                        readOnly = true,
                                        singleLine = true,
                                        label = { Text("Email") },
                                    )
                                    // Display name
                                    OutlinedTextField(
                                        value = handleInput,
                                        onValueChange = { handleInput = it; handleSaved = false },
                                        modifier = Modifier.fillMaxWidth(),
                                        singleLine = true,
                                        label = { Text("Display name") },
                                        placeholder = { Text("Choose a name") },
                                    )
                                    Button(
                                        onClick = {
                                            if (handleInput.isNotBlank()) {
                                                onUpdateHandle(handleInput.trim())
                                                handleSaved = true
                                            }
                                        },
                                        enabled = handleInput.isNotBlank() && handleInput.trim() != state.user.handle,
                                        modifier = Modifier.fillMaxWidth(),
                                    ) {
                                        Text(if (handleSaved) "Saved!" else "Save display name")
                                    }
                                    // Billing / plan — link to web
                                    OutlinedButton(
                                        onClick = onOpenBilling,
                                        modifier = Modifier.fillMaxWidth(),
                                    ) {
                                        Icon(
                                            Icons.Outlined.OpenInNew,
                                            contentDescription = null,
                                            modifier = Modifier.size(14.dp),
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Manage billing on bytecode.dev")
                                    }
                                }
                            }
                        }

                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f))

                        // ── Application sub-section ─────────────────────────
                        Column(modifier = Modifier.animateContentSize()) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { appSettingsExpanded = !appSettingsExpanded }
                                    .padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                Icon(
                                    Icons.Outlined.Info,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                                Text(
                                    "Application",
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.weight(1f),
                                )
                                Icon(
                                    if (appSettingsExpanded) Icons.Outlined.KeyboardArrowDown else Icons.Outlined.KeyboardArrowRight,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }

                            if (appSettingsExpanded) {
                                Column(
                                    modifier = Modifier
                                        .padding(horizontal = 16.dp)
                                        .padding(bottom = 12.dp),
                                    verticalArrangement = Arrangement.spacedBy(0.dp),
                                ) {
                                    SettingsToggleRow(
                                        label = "Show me on leaderboards",
                                        description = "Others can see your rank on public boards",
                                        checked = leaderboardVisible,
                                        onCheckedChange = { leaderboardVisible = it },
                                    )
                                    HorizontalDivider(
                                        modifier = Modifier.padding(vertical = 4.dp),
                                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.08f),
                                    )
                                    SettingsToggleRow(
                                        label = "Daily challenge reminder",
                                        description = "Get notified when today's challenges are ready",
                                        checked = dailyReminder,
                                        onCheckedChange = { dailyReminder = it },
                                    )
                                    HorizontalDivider(
                                        modifier = Modifier.padding(vertical = 4.dp),
                                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.08f),
                                    )
                                    SettingsToggleRow(
                                        label = "Friend activity",
                                        description = "Know when friends solve challenges or accept duels",
                                        checked = friendActivity,
                                        onCheckedChange = { friendActivity = it },
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // ── 4. Stats (collapsible) ──────────────────────────────────────────
        item {
            Surface(
                modifier = Modifier.fillMaxWidth().animateContentSize(),
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { statsExpanded = !statsExpanded }
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Icon(
                            Icons.Outlined.EmojiEvents,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                            tint = MaterialTheme.colorScheme.primary,
                        )
                        Text(
                            "Your stats",
                            style = MaterialTheme.typography.titleSmall,
                            modifier = Modifier.weight(1f),
                        )
                        Icon(
                            if (statsExpanded) Icons.Outlined.KeyboardArrowDown else Icons.Outlined.KeyboardArrowRight,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }

                    if (statsExpanded) {
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f))
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(14.dp),
                        ) {
                            StatRow(
                                icon = Icons.Outlined.LocalFireDepartment,
                                label = "Streak",
                                value = "${state.user.streakCount} day${if (state.user.streakCount == 1) "" else "s"}",
                                iconTint = MaterialTheme.colorScheme.error,
                            )
                            HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.07f))
                            StatRow(
                                icon = Icons.Outlined.EmojiEvents,
                                label = "Total XP",
                                value = "${state.user.xpTotal} XP",
                                iconTint = MaterialTheme.colorScheme.primary,
                            )
                            HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.07f))
                            StatRow(
                                icon = Icons.Outlined.MilitaryTech,
                                label = "Plan",
                                value = (state.billing?.plan ?: "free").replaceFirstChar { it.titlecase() },
                                iconTint = if (billingPlan == "premium") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            val premiumUntil = state.billing?.premiumUntil ?: state.user.premiumUntil
                            if (premiumUntil != null) {
                                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.07f))
                                StatRow(
                                    icon = Icons.Outlined.Info,
                                    label = "Premium until",
                                    value = premiumUntil.take(10),
                                    iconTint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }
        }

        // ── 5. Action buttons ───────────────────────────────────────────────
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                OutlinedButton(onClick = onRefresh, modifier = Modifier.weight(1f)) {
                    Text("Refresh")
                }
                OutlinedButton(
                    onClick = onSignOut,
                    modifier = Modifier.weight(1f),
                    colors = androidx.compose.material3.ButtonDefaults.outlinedButtonColors(
                        contentColor = MaterialTheme.colorScheme.error,
                    ),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.5f)),
                ) {
                    Text("Sign out")
                }
            }
        }
    }
}

@Composable
private fun StatRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    iconTint: androidx.compose.ui.graphics.Color = androidx.compose.ui.graphics.Color.Unspecified,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = iconTint,
        )
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f),
        )
        Text(
            value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
        )
    }
}

@Composable
private fun SettingsToggleRow(
    label: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCheckedChange(!checked) }
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
            Text(label, style = MaterialTheme.typography.bodyMedium)
            Text(description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        androidx.compose.material3.Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
        )
    }
}

@Composable
private fun FloatingSettingsButton(modifier: Modifier = Modifier) {
    var menuExpanded by remember { mutableStateOf(false) }
    var showAppInfo by remember { mutableStateOf(false) }
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (pressed) 0.80f else 1f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessHigh),
        label = "settings_scale",
        finishedListener = { pressed = false },
    )

    Box(modifier = modifier) {
        IconButton(
            onClick = {
                pressed = true
                menuExpanded = true
            },
            modifier = Modifier
                .scale(scale)
                .background(
                    color = MaterialTheme.colorScheme.surface.copy(alpha = 0.88f),
                    shape = CircleShape,
                ),
        ) {
            Icon(
                Icons.Outlined.Settings,
                contentDescription = "Settings",
                modifier = Modifier.size(20.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        DropdownMenu(
            expanded = menuExpanded,
            onDismissRequest = { menuExpanded = false },
        ) {
            DropdownMenuItem(
                text = { Text("App Info") },
                onClick = {
                    menuExpanded = false
                    showAppInfo = true
                },
                leadingIcon = {
                    Icon(Icons.Outlined.Info, contentDescription = null, modifier = Modifier.size(18.dp))
                },
            )
        }
    }

    if (showAppInfo) {
        AppInfoDialog(onDismiss = { showAppInfo = false })
    }
}

@Composable
private fun AppInfoDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("App Info") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    "v${BuildConfig.VERSION_NAME}",
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.primary,
                )
                Surface(
                    shape = MaterialTheme.shapes.medium,
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        KeyValueRow("Version", BuildConfig.VERSION_NAME)
                        KeyValueRow("Version code", BuildConfig.VERSION_CODE.toString())
                        KeyValueRow("Build type", BuildConfig.BUILD_TYPE.replaceFirstChar { it.titlecase() })
                        KeyValueRow("Package", BuildConfig.APPLICATION_ID)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        },
    )
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

private enum class BadgeTone { Default, Success, Warning }

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

private enum class ChallengeTab { Problem, Discuss, Solutions, Duel }

@Composable
private fun ChallengeDetailScreen(
    challengeState: ChallengeUiState,
    discussionState: DiscussionUiState,
    solutionState: SolutionUiState,
    duelState: DuelUiState,
    onBack: () -> Unit,
    onOpenEditor: (String) -> Unit,
    onLoadLeaderboard: () -> Unit,
    onLoadDiscussion: (String) -> Unit,
    onDiscussionBodyChange: (String) -> Unit,
    onPostDiscussion: (String) -> Unit,
    onDeletePost: (String, String) -> Unit,
    onUpvotePost: (String, String) -> Unit,
    onLoadSolutions: (String) -> Unit,
    onUpvoteSolution: (String, String) -> Unit,
    onRemoveSolutionUpvote: (String, String) -> Unit,
    onLoadDuels: () -> Unit,
    onChallengeFriend: (String, String) -> Unit,
    onAcceptDuel: (String) -> Unit,
    onDeclineDuel: (String) -> Unit,
) {
    val challenge = challengeState.challenge
    var activeTab by remember { mutableStateOf(ChallengeTab.Problem) }

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
        Column(modifier = Modifier.fillMaxSize()) {
            // Tab bar
            ScrollableTabRow(
                selectedTabIndex = activeTab.ordinal,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = MaterialTheme.colorScheme.primary,
                edgePadding = 0.dp,
            ) {
                ChallengeTab.entries.forEach { tab ->
                    val locked = tab != ChallengeTab.Problem && !challengeState.hasSolvedToday
                    Tab(
                        selected = activeTab == tab,
                        onClick = { activeTab = tab },
                        text = {
                            Text(
                                if (locked) "${tab.name} 🔒" else tab.name,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        },
                    )
                }
            }

            when (activeTab) {
                ChallengeTab.Problem -> ChallengeProblemTab(
                    challenge = challenge,
                    challengeState = challengeState,
                    onOpenEditor = onOpenEditor,
                )
                ChallengeTab.Discuss -> {
                    if (!challengeState.hasSolvedToday) {
                        SolveGateScreen()
                    } else {
                        LaunchedEffect(challenge.id) { onLoadDiscussion(challenge.id) }
                        ChallengeDiscussTab(
                            challengeId = challenge.id,
                            discussionState = discussionState,
                            onBodyChange = onDiscussionBodyChange,
                            onPost = onPostDiscussion,
                            onDelete = onDeletePost,
                            onUpvote = onUpvotePost,
                        )
                    }
                }
                ChallengeTab.Solutions -> {
                    if (!challengeState.hasSolvedToday) {
                        SolveGateScreen()
                    } else {
                        LaunchedEffect(challenge.id) { onLoadSolutions(challenge.id) }
                        ChallengeSolutionsTab(
                            challengeId = challenge.id,
                            solutionState = solutionState,
                            onUpvote = onUpvoteSolution,
                            onRemoveUpvote = onRemoveSolutionUpvote,
                        )
                    }
                }
                ChallengeTab.Duel -> {
                    if (!challengeState.hasSolvedToday) {
                        SolveGateScreen()
                    } else {
                        LaunchedEffect(Unit) { onLoadDuels() }
                        ChallengeDuelTab(
                            challengeId = challenge.id,
                            duelState = duelState,
                            onChallengeFriend = onChallengeFriend,
                            onAccept = onAcceptDuel,
                            onDecline = onDeclineDuel,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun SolveGateScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        contentAlignment = Alignment.Center,
    ) {
        Surface(
            shape = MaterialTheme.shapes.large,
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.25f)),
        ) {
            Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                ) {
                    Icon(
                        Icons.Outlined.Info,
                        contentDescription = null,
                        modifier = Modifier
                            .padding(16.dp)
                            .size(36.dp),
                        tint = MaterialTheme.colorScheme.primary,
                    )
                }
                Text(
                    "Solve First to Unlock",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    "Complete today's challenge to see the discussion, community solutions, and duels.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                )
            }
        }
    }
}

@Composable
private fun ChallengeProblemTab(
    challenge: ChallengeDto,
    challengeState: ChallengeUiState,
    onOpenEditor: (String) -> Unit,
) {
    LazyColumn(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            BytecodeSectionCard {
                SectionHeader(title = "Problem", subtitle = "${challenge.baseXp} XP")
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    challenge.description,
                    style = MaterialTheme.typography.bodyMedium,
                )
            }
        }
        if (challenge.visibleExamples.isNotEmpty()) {
            item {
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
        }
        item {
            Button(
                onClick = { onOpenEditor(challenge.id) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open Editor")
            }
        }
        item {
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
                                        color = if (i == 0) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                    Text(entry.displayName, style = MaterialTheme.typography.bodyMedium)
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
private fun ChallengeDiscussTab(
    challengeId: String,
    discussionState: DiscussionUiState,
    onBodyChange: (String) -> Unit,
    onPost: (String) -> Unit,
    onDelete: (String, String) -> Unit,
    onUpvote: (String, String) -> Unit,
) {
    Column(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            if (discussionState.isLoading) {
                item { LoadingPlaceholder(lines = 3) }
            } else if (discussionState.posts.isEmpty()) {
                item {
                    Text(
                        "No discussion yet — start the conversation!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(vertical = 8.dp),
                    )
                }
            } else {
                items(discussionState.posts) { post ->
                    DiscussionPostRow(
                        post = post,
                        onUpvote = { onUpvote(challengeId, post.id) },
                        onDelete = if (post.isOwn) ({ onDelete(challengeId, post.id) }) else null,
                    )
                }
            }
        }
        if (!discussionState.error.isNullOrBlank()) {
            InfoBanner(text = discussionState.error, tone = BadgeTone.Warning, modifier = Modifier.padding(horizontal = 16.dp))
        }
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.15f)),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                BasicTextField(
                    value = discussionState.body,
                    onValueChange = onBodyChange,
                    modifier = Modifier.weight(1f),
                    textStyle = TextStyle(
                        color = MaterialTheme.colorScheme.onSurface,
                        fontSize = MaterialTheme.typography.bodyMedium.fontSize,
                    ),
                    cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                    decorationBox = { inner ->
                        if (discussionState.body.isEmpty()) {
                            Text(
                                "Add to the discussion…",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        inner()
                    },
                )
                Button(
                    onClick = { onPost(challengeId) },
                    enabled = discussionState.body.isNotBlank() && !discussionState.isSending,
                ) {
                    Text("Post")
                }
            }
        }
    }
}

@Composable
private fun DiscussionPostRow(
    post: DiscussionPostDto,
    onUpvote: () -> Unit,
    onDelete: (() -> Unit)?,
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = MaterialTheme.shapes.small,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.12f)),
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(post.authorName, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
                    OutlinedButton(onClick = onUpvote, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)) {
                        Text("▲ ${post.upvotes}", style = MaterialTheme.typography.labelSmall)
                    }
                    if (onDelete != null) {
                        OutlinedButton(onClick = onDelete, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)) {
                            Text("Delete", style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
            Text(post.body, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
private fun ChallengeSolutionsTab(
    challengeId: String,
    solutionState: SolutionUiState,
    onUpvote: (String, String) -> Unit,
    onRemoveUpvote: (String, String) -> Unit,
) {
    if (solutionState.isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }
    if (!solutionState.error.isNullOrBlank()) {
        InfoBanner(text = solutionState.error, tone = BadgeTone.Warning, modifier = Modifier.padding(16.dp))
        return
    }
    if (solutionState.solutions.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
            Text(
                "No shared solutions yet.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        return
    }
    LazyColumn(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        items(solutionState.solutions) { sol ->
            SharedSolutionCard(
                solution = sol,
                onUpvote = { onUpvote(challengeId, sol.submissionId) },
                onRemoveUpvote = { onRemoveUpvote(challengeId, sol.submissionId) },
            )
        }
    }
}

@Composable
private fun SharedSolutionCard(
    solution: SharedSolutionDto,
    onUpvote: () -> Unit,
    onRemoveUpvote: () -> Unit,
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = MaterialTheme.shapes.medium,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.14f)),
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column {
                    Text(solution.authorName, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
                    Text(
                        buildString {
                            append(solution.language.replaceFirstChar { it.titlecase() })
                            solution.runtimeMs?.let { append(" · ${it}ms") }
                        },
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                OutlinedButton(
                    onClick = if (solution.hasUpvoted) onRemoveUpvote else onUpvote,
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                ) {
                    Text(
                        "${if (solution.hasUpvoted) "▼" else "▲"} ${solution.upvotes}",
                        style = MaterialTheme.typography.labelSmall,
                        color = if (solution.hasUpvoted) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
                    )
                }
            }
            Surface(
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                shape = MaterialTheme.shapes.small,
            ) {
                Text(
                    solution.sourceCode,
                    modifier = Modifier.padding(8.dp).fillMaxWidth(),
                    style = MaterialTheme.typography.bodySmall,
                    fontFamily = JetBrainsMonoFamily,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 20,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
private fun ChallengeDuelTab(
    challengeId: String,
    duelState: DuelUiState,
    onChallengeFriend: (String, String) -> Unit,
    onAccept: (String) -> Unit,
    onDecline: (String) -> Unit,
) {
    if (duelState.isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }
    LazyColumn(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        if (duelState.pendingDuels.isNotEmpty()) {
            item { SectionHeader(title = "Pending Duels", subtitle = "${duelState.pendingDuels.size}") }
            items(duelState.pendingDuels) { duel ->
                DuelCard(duel = duel, onAccept = { onAccept(duel.id) }, onDecline = { onDecline(duel.id) })
            }
        }
        if (duelState.activeDuels.isNotEmpty()) {
            item { SectionHeader(title = "Active Duels", subtitle = "${duelState.activeDuels.size}") }
            items(duelState.activeDuels) { duel ->
                DuelCard(duel = duel, onAccept = null, onDecline = null)
            }
        }
        if (duelState.completedDuels.isNotEmpty()) {
            item { SectionHeader(title = "Completed", subtitle = "${duelState.completedDuels.size}") }
            items(duelState.completedDuels.take(5)) { duel ->
                DuelCard(duel = duel, onAccept = null, onDecline = null)
            }
        }
        if (duelState.friends.isNotEmpty()) {
            item { SectionHeader(title = "Challenge a Friend", subtitle = "") }
            items(duelState.friends) { friend ->
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    shape = MaterialTheme.shapes.small,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.12f)),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(friend.displayName, style = MaterialTheme.typography.bodyMedium)
                        OutlinedButton(
                            onClick = { onChallengeFriend(friend.userId, challengeId) },
                            enabled = !duelState.isChallenging,
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                        ) {
                            Text("Duel", style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
        }
        if (duelState.pendingDuels.isEmpty() && duelState.activeDuels.isEmpty() && duelState.friends.isEmpty()) {
            item {
                Text(
                    "No duels yet. Add friends to challenge them!",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        if (!duelState.error.isNullOrBlank()) {
            item { InfoBanner(text = duelState.error, tone = BadgeTone.Warning) }
        }
        if (!duelState.actionMessage.isNullOrBlank()) {
            item { InfoBanner(text = duelState.actionMessage, tone = BadgeTone.Success) }
        }
    }
}

@Composable
private fun DuelCard(
    duel: DuelDto,
    onAccept: (() -> Unit)?,
    onDecline: (() -> Unit)?,
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = MaterialTheme.shapes.small,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.12f)),
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    "${duel.challengerName} vs ${duel.opponentName}",
                    style = MaterialTheme.typography.bodyMedium,
                )
                AccessBadge(
                    label = duel.status.replaceFirstChar { it.titlecase() },
                    tone = when (duel.status) {
                        "active" -> BadgeTone.Default
                        "completed" -> BadgeTone.Success
                        else -> BadgeTone.Default
                    },
                )
            }
            if (duel.winnerId != null) {
                val winnerLabel = when {
                    duel.isChallenger && duel.winnerId == duel.challengerName -> "You won! 🏆"
                    !duel.isChallenger && duel.winnerId == duel.opponentName -> "You won! 🏆"
                    duel.isChallenger -> "${duel.opponentName} won"
                    else -> "${duel.challengerName} won"
                }
                Surface(
                    shape = MaterialTheme.shapes.extraSmall,
                    color = if (winnerLabel.startsWith("You")) MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)
                            else MaterialTheme.colorScheme.surfaceVariant,
                ) {
                    Text(
                        winnerLabel,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = if (winnerLabel.startsWith("You")) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
            if (onAccept != null || onDecline != null) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (onAccept != null && !duel.isChallenger) {
                        Button(onClick = onAccept) { Text("Accept") }
                    }
                    if (onDecline != null && !duel.isChallenger) {
                        OutlinedButton(onClick = onDecline) { Text("Decline") }
                    }
                }
            }
        }
    }
}

@Composable
private fun SuccessOverlay(onDismiss: () -> Unit) {
    var visible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        visible = true
        delay(2500)
        onDismiss()
    }
    val scale by animateFloatAsState(
        targetValue = if (visible) 1f else 0.5f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMedium),
        label = "successScale",
    )
    val alpha by animateFloatAsState(
        targetValue = if (visible) 1f else 0f,
        label = "successAlpha",
    )
    Box(
        modifier = Modifier
            .fillMaxSize()
            .alpha(alpha)
            .background(MaterialTheme.colorScheme.background.copy(alpha = 0.85f))
            .clickable(onClick = onDismiss),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = Modifier.scale(scale),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                        shape = CircleShape,
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Text("✓", style = MaterialTheme.typography.displayMedium, color = MaterialTheme.colorScheme.primary)
            }
            Text(
                "All tests passed!",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary,
            )
            Text(
                "Tap to dismiss",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun SyntaxHighlightedField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val keywordColor = MaterialTheme.colorScheme.primary
    val stringColor = Color(0xFFA8C77B)
    val numberColor = Color(0xFFC77BA8)
    val commentColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f)
    val typeColor = Color(0xFF7BA8C7)
    val defaultColor = MaterialTheme.colorScheme.onSurface

    var tfv by remember { mutableStateOf(TextFieldValue(text = value)) }
    LaunchedEffect(value) {
        if (tfv.text != value) tfv = TextFieldValue(text = value)
    }

    BasicTextField(
        value = TextFieldValue(
            annotatedString = highlightCode(tfv.text, keywordColor, stringColor, numberColor, commentColor, typeColor, defaultColor),
            selection = tfv.selection,
        ),
        onValueChange = { newTfv ->
            tfv = newTfv
            onValueChange(newTfv.text)
        },
        modifier = modifier,
        textStyle = TextStyle(
            fontFamily = JetBrainsMonoFamily,
            fontSize = MaterialTheme.typography.bodySmall.fontSize,
        ),
        cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
    )
}

@Composable
private fun CodeEditorScreen(
    challengeState: ChallengeUiState,
    onBack: () -> Unit,
    onUpdateCode: (String) -> Unit,
    onSubmit: () -> Unit,
    onReset: () -> Unit,
    onToggleShare: () -> Unit,
) {
    val challenge = challengeState.challenge
    val result = challengeState.submitResult
    var overlayDismissed by remember { mutableStateOf(false) }
    val showOverlay = result?.isCorrect == true && !overlayDismissed
    LaunchedEffect(result?.isCorrect) {
        if (result?.isCorrect != true) overlayDismissed = false
    }

    Box(modifier = Modifier.fillMaxSize()) {
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
            SyntaxHighlightedField(
                value = challengeState.code,
                onValueChange = onUpdateCode,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp),
            )
        }

        // Snippet bar — quick-insert buttons above the action row
        androidx.compose.foundation.lazy.LazyRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            contentPadding = PaddingValues(horizontal = 2.dp),
        ) {
            val snippets = listOf(
                "    " to "Tab",
                "{" to "{",
                "}" to "}",
                "(" to "(",
                ")" to ")",
                ";" to ";",
                "->" to "->",
                "it" to "it",
                "val " to "val",
                "var " to "var",
                "fun " to "fun",
                "return " to "return",
            )
            items(snippets.size) { i ->
                val (insert, label) = snippets[i]
                Surface(
                    onClick = { onUpdateCode(challengeState.code + insert) },
                    shape = MaterialTheme.shapes.extraSmall,
                    color = MaterialTheme.colorScheme.surface,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.25f)),
                ) {
                    Text(
                        label,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontFamily = JetBrainsMonoFamily,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
        }

        // Share toggle
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(onClick = onToggleShare),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Checkbox(
                checked = challengeState.shareOnSubmit,
                onCheckedChange = { onToggleShare() },
            )
            Text(
                "Share solution if correct",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
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
                            if (result.isCorrect) "✓ All tests passed!" else "✗ Some tests failed",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = if (result.isCorrect) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                        )
                        if (result.xpAwarded != null && result.xpAwarded > 0) {
                            AccessBadge(label = "+${result.xpAwarded} XP", tone = BadgeTone.Success)
                        }
                    }
                    // Badge earn row — shown prominently when badges are awarded
                    if (result.badgesEarned.isNotEmpty()) {
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = MaterialTheme.shapes.small,
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.08f),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
                        ) {
                            Column(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                verticalArrangement = Arrangement.spacedBy(4.dp),
                            ) {
                                Text(
                                    "Badge${if (result.badgesEarned.size > 1) "s" else ""} earned!",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.primary,
                                    fontWeight = FontWeight.SemiBold,
                                )
                                result.badgesEarned.forEach { badge ->
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                    ) {
                                        Icon(
                                            Icons.Outlined.MilitaryTech,
                                            contentDescription = null,
                                            modifier = Modifier.size(18.dp),
                                            tint = MaterialTheme.colorScheme.primary,
                                        )
                                        Column {
                                            Text(badge.name, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Medium)
                                            Text(badge.description, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                    }
                                }
                            }
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
    if (showOverlay) {
        SuccessOverlay(onDismiss = { overlayDismissed = true })
    }
    }
}

// ── Leaderboards screen ───────────────────────────────────────────────────────

private val leaderboardTabs = listOf(
    LeaderboardTab.PersonalBest,
    LeaderboardTab.Friends,
    LeaderboardTab.Weekly,
    LeaderboardTab.Global,
    LeaderboardTab.Java,
    LeaderboardTab.Kotlin,
    LeaderboardTab.Easy,
    LeaderboardTab.Intermediate,
    LeaderboardTab.Hard,
)

private fun LeaderboardTab.label() = when (this) {
    LeaderboardTab.PersonalBest -> "My Stats"
    LeaderboardTab.Global -> "All-time"
    LeaderboardTab.Weekly -> "This week"
    LeaderboardTab.Java -> "Java"
    LeaderboardTab.Kotlin -> "Kotlin"
    LeaderboardTab.Easy -> "Easy"
    LeaderboardTab.Intermediate -> "Intermediate"
    LeaderboardTab.Hard -> "Hard"
    LeaderboardTab.Friends -> "Friends"
}

@Composable
private fun LeaderboardsScreen(
    leaderboardState: LeaderboardUiState,
    friendsState: FriendsUiState,
    hasFriends: Boolean,
    onSelectTab: (LeaderboardTab) -> Unit,
    onRefresh: () -> Unit,
    onLoadMyRanks: () -> Unit,
    onLoadFriends: () -> Unit,
    onFriendHandleChange: (String) -> Unit,
    onSendFriendRequest: () -> Unit,
    onAcceptFriendRequest: (String) -> Unit,
    onRemoveFriend: (String) -> Unit,
) {
    LaunchedEffect(Unit) {
        onLoadMyRanks()
        // Friends-first default when user has friends; otherwise This Week
        val initial = if (hasFriends) LeaderboardTab.Friends else LeaderboardTab.Weekly
        onSelectTab(initial)
    }

    val activeIndex = leaderboardTabs.indexOf(leaderboardState.activeTab).coerceAtLeast(0)

    Column(modifier = Modifier.fillMaxSize()) {
        // Screen title
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 2.dp,
        ) {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)) {
                Text("Leaderboards", style = MaterialTheme.typography.headlineSmall)
                leaderboardState.myRanks?.let { ranks ->
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        ranks.weeklyRank?.let { rank ->
                            val label = if (rank <= 10) "This week #$rank" else "This week #$rank"
                            Text(
                                label,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.primary,
                            )
                        }
                        ranks.globalRank?.let { rank ->
                            Text(
                                "All-time #$rank",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }

        // Tab row
        ScrollableTabRow(
            selectedTabIndex = activeIndex,
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.primary,
            edgePadding = 16.dp,
        ) {
            leaderboardTabs.forEachIndexed { idx, tab ->
                Tab(
                    selected = idx == activeIndex,
                    onClick = { onSelectTab(tab) },
                    text = {
                        Text(
                            tab.label(),
                            style = MaterialTheme.typography.labelMedium,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    },
                )
            }
        }

        // Board content
        when (leaderboardState.activeTab) {
            LeaderboardTab.PersonalBest -> PersonalBestContent(myRanks = leaderboardState.myRanks)
            LeaderboardTab.Friends -> FriendsLeaderboardContent(
                friendsState = friendsState,
                onLoadFriends = onLoadFriends,
                onFriendHandleChange = onFriendHandleChange,
                onSendFriendRequest = onSendFriendRequest,
                onAcceptFriendRequest = onAcceptFriendRequest,
                onRemoveFriend = onRemoveFriend,
            )
            else -> {
                val board = leaderboardState.boards[leaderboardState.activeTab]
                RankedBoardContent(
                    board = board,
                    isLoading = leaderboardState.isLoading,
                    error = leaderboardState.error,
                    onRefresh = onRefresh,
                )
            }
        }
    }
}

@Composable
private fun PersonalBestContent(myRanks: dev.bytecode.android.data.model.MyRanksResponse?) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text(
                "Your Stats",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
            )
        }
        if (myRanks == null) {
            item {
                Box(modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(modifier = Modifier.size(28.dp))
                }
            }
        } else {
            item {
                BytecodeSectionCard {
                    SectionHeader(title = "This Week", subtitle = "Resets every Monday 00:00 UTC")
                    Spacer(modifier = Modifier.height(8.dp))
                    if (myRanks.weeklyRank != null) {
                        KeyValueRow("Your rank", "#${myRanks.weeklyRank}")
                        KeyValueRow("Your score", "${myRanks.weeklyScore} XP")
                    } else {
                        Text(
                            "Solve a challenge this week to appear on the board.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
            item {
                BytecodeSectionCard {
                    SectionHeader(title = "All-time", subtitle = "Your lifetime position")
                    Spacer(modifier = Modifier.height(8.dp))
                    if (myRanks.globalRank != null) {
                        KeyValueRow("Your rank", "#${myRanks.globalRank}")
                        KeyValueRow("Total XP", "${myRanks.globalScore} XP")
                    } else {
                        Text(
                            "Complete a challenge to earn your first XP.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    shape = MaterialTheme.shapes.medium,
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            "The default leaderboard shows your progress vs. yourself.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            "Switch to Friends, This Week, or All-time to compare with others.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun RankedBoardContent(
    board: RankedBoardResponse?,
    isLoading: Boolean,
    error: String?,
    onRefresh: () -> Unit,
) {
    when {
        isLoading && board == null -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        }
        !error.isNullOrBlank() && board == null -> {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                InfoBanner(text = error, tone = BadgeTone.Warning)
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedButton(onClick = onRefresh) { Text("Retry") }
            }
        }
        else -> {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                contentPadding = PaddingValues(vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                // Around-me section (shown when user is not in top 50)
                val aroundMe = board?.aroundMe
                if (!aroundMe.isNullOrEmpty()) {
                    item {
                        Text(
                            "Your position",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(vertical = 4.dp),
                        )
                    }
                    items(aroundMe) { entry ->
                        val isMe = entry.userId == board.entries.firstOrNull()?.userId
                        RankedEntryRow(
                            rank = entry.rank,
                            displayName = entry.displayName,
                            score = entry.score,
                            isHighlighted = board.myRank == entry.rank,
                        )
                    }
                    item { HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp)) }
                    item {
                        Text(
                            "Top 50",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(vertical = 4.dp),
                        )
                    }
                }

                val entries = board?.entries ?: emptyList()
                if (entries.isEmpty() && !isLoading) {
                    item {
                        Text(
                            "No entries yet. Be the first!",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(vertical = 24.dp),
                        )
                    }
                } else {
                    items(entries) { entry ->
                        RankedEntryRow(
                            rank = entry.rank,
                            displayName = entry.displayName,
                            score = entry.score,
                            isHighlighted = board?.myRank == entry.rank,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun RankedEntryRow(
    rank: Int,
    displayName: String,
    score: Long,
    isHighlighted: Boolean,
) {
    val bgColor = if (isHighlighted)
        MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)
    else
        MaterialTheme.colorScheme.surface

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = bgColor,
        shape = MaterialTheme.shapes.small,
        border = if (isHighlighted) BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)) else null,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            val rankColor = when (rank) {
                1 -> MaterialTheme.colorScheme.primary
                2, 3 -> MaterialTheme.colorScheme.secondary
                else -> MaterialTheme.colorScheme.onSurfaceVariant
            }
            Text(
                text = "#$rank",
                style = MaterialTheme.typography.labelLarge,
                color = rankColor,
                modifier = Modifier.widthIn(min = 36.dp),
            )
            Text(
                text = displayName,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.weight(1f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                text = "$score XP",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
            )
        }
    }
}

@Composable
private fun FriendsLeaderboardContent(
    friendsState: FriendsUiState,
    onLoadFriends: () -> Unit,
    onFriendHandleChange: (String) -> Unit,
    onSendFriendRequest: () -> Unit,
    onAcceptFriendRequest: (String) -> Unit,
    onRemoveFriend: (String) -> Unit,
) {
    LaunchedEffect(Unit) { onLoadFriends() }
    val context = androidx.compose.ui.platform.LocalContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        // Add friend
        item {
            BytecodeSectionCard {
                SectionHeader(title = "Add a friend", subtitle = "Enter their email address")
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = friendsState.handleInput,
                    onValueChange = onFriendHandleChange,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("email@example.com") },
                )
                if (!friendsState.actionMessage.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(6.dp))
                    InfoBanner(text = friendsState.actionMessage, tone = BadgeTone.Success)
                }
                if (!friendsState.error.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(6.dp))
                    InfoBanner(text = friendsState.error, tone = BadgeTone.Warning)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onSendFriendRequest,
                    enabled = friendsState.handleInput.isNotBlank() && !friendsState.isSending,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    if (friendsState.isSending) {
                        CircularProgressIndicator(modifier = Modifier.width(16.dp), strokeWidth = 2.dp)
                    } else {
                        Text("Send request")
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedButton(
                    onClick = {
                        val intent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, "Join me on Bytecode — daily coding challenges for Java & Kotlin! https://bytecode.dev/get-the-app")
                        }
                        context.startActivity(Intent.createChooser(intent, "Invite a friend"))
                    },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Share invite link")
                }
            }
        }

        // Pending incoming
        if (friendsState.incomingRequests.isNotEmpty()) {
            item {
                Text(
                    "Pending requests (${friendsState.incomingRequests.size})",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            items(friendsState.incomingRequests) { req ->
                FriendRequestRow(
                    displayName = req.displayName,
                    email = req.email,
                    onAccept = { onAcceptFriendRequest(req.userId) },
                )
            }
        }

        // Friends list
        if (friendsState.friends.isNotEmpty()) {
            item {
                Text(
                    "Friends (${friendsState.friends.size})",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            items(friendsState.friends) { friend ->
                FriendRow(
                    friend = friend,
                    onRemove = { onRemoveFriend(friend.userId) },
                )
            }
        } else if (!friendsState.isLoading) {
            item {
                Text(
                    "No friends yet. Add someone to compare scores!",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(vertical = 8.dp),
                )
            }
        }

        if (friendsState.isLoading) {
            item {
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
        }
    }
}

@Composable
private fun FriendRequestRow(
    displayName: String,
    email: String?,
    onAccept: () -> Unit,
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shape = MaterialTheme.shapes.medium,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(displayName, style = MaterialTheme.typography.bodyMedium)
                if (!email.isNullOrBlank()) {
                    Text(email, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Button(onClick = onAccept) { Text("Accept") }
        }
    }
}

@Composable
private fun FriendRow(
    friend: FriendDto,
    onRemove: () -> Unit,
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shape = MaterialTheme.shapes.medium,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.18f)),
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(friend.displayName, style = MaterialTheme.typography.bodyMedium)
                if (!friend.email.isNullOrBlank()) {
                    Text(friend.email, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            OutlinedButton(onClick = onRemove) { Text("Remove") }
        }
    }
}

// ── Badges screen ─────────────────────────────────────────────────────────────

@Composable
private fun BadgesScreen(
    badgesState: BadgesUiState,
    userXpTotal: Int = 0,
    onLoad: () -> Unit,
    onSelectBadge: (String?) -> Unit,
) {
    LaunchedEffect(Unit) { onLoad() }

    val selected = badgesState.selectedBadgeId?.let { id ->
        badgesState.badges.firstOrNull { it.id == id }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(vertical = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item(span = { GridItemSpan(maxLineSpan) }) {
                Text("Badges", style = MaterialTheme.typography.headlineSmall)
            }

            if (badgesState.isLoading) {
                item(span = { GridItemSpan(maxLineSpan) }) {
                    Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                }
            }

            val errorMsg = badgesState.error
            if (!errorMsg.isNullOrBlank()) {
                item(span = { GridItemSpan(maxLineSpan) }) {
                    Text(
                        errorMsg,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error,
                    )
                }
            }

            val categories = badgesState.badges
                .groupBy { it.category }
                .entries
                .sortedBy { it.key }

            categories.forEach { (category, badges) ->
                item(span = { GridItemSpan(maxLineSpan) }) {
                    Text(
                        category.replaceFirstChar { it.uppercase() },
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                items(badges) { badge ->
                    BadgeTile(badge = badge, userXpTotal = userXpTotal, onClick = { onSelectBadge(badge.id) })
                }
            }
        }

        if (selected != null) {
            BadgeDetailSheet(badge = selected, onDismiss = { onSelectBadge(null) })
        }
    }
}

@Composable
private fun BadgeTile(
    badge: dev.bytecode.android.data.model.BadgeResponse,
    userXpTotal: Int = 0,
    onClick: () -> Unit,
) {
    val earned = badge.earned
    val estimatedSolves = userXpTotal / 10
    val progressHint: String? = if (!earned) {
        when (badge.id) {
            "solve-1"   -> "$estimatedSolves/1"
            "solve-10"  -> "$estimatedSolves/10"
            "solve-50"  -> "$estimatedSolves/50"
            "solve-100" -> "$estimatedSolves/100"
            "solve-500" -> "$estimatedSolves/500"
            "diff-easy" -> "$estimatedSolves/50"
            "diff-med"  -> "$estimatedSolves/50"
            "diff-hard" -> "$estimatedSolves/50"
            else -> null
        }
    } else null

    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.small,
        color = if (earned) MaterialTheme.colorScheme.primary.copy(alpha = 0.08f)
                else MaterialTheme.colorScheme.surface,
        border = BorderStroke(
            1.dp,
            if (earned) MaterialTheme.colorScheme.primary.copy(alpha = 0.4f)
            else MaterialTheme.colorScheme.outline.copy(alpha = 0.15f),
        ),
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Icon(
                imageVector = Icons.Outlined.MilitaryTech,
                contentDescription = null,
                modifier = Modifier.size(28.dp),
                tint = if (earned) MaterialTheme.colorScheme.primary
                       else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.25f),
            )
            Text(
                badge.name,
                style = MaterialTheme.typography.labelSmall,
                color = if (earned) MaterialTheme.colorScheme.onSurface
                        else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            )
            if (progressHint != null) {
                Text(
                    progressHint,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                )
            }
            // Dot tier
            Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                repeat(5) { i ->
                    val filled = earned && i < badge.dotTier
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .background(
                                color = if (filled) MaterialTheme.colorScheme.primary
                                        else MaterialTheme.colorScheme.outline.copy(alpha = 0.25f),
                                shape = androidx.compose.foundation.shape.CircleShape,
                            ),
                    )
                }
            }
        }
    }
}

@Composable
private fun BadgeDetailSheet(
    badge: dev.bytecode.android.data.model.BadgeResponse,
    onDismiss: () -> Unit,
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.scrim.copy(alpha = 0.5f))
            .clickable(onClick = onDismiss),
        contentAlignment = Alignment.Center,
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .clickable(enabled = false, onClick = {}),
            shape = MaterialTheme.shapes.large,
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Icon(
                    imageVector = Icons.Outlined.MilitaryTech,
                    contentDescription = null,
                    modifier = Modifier.size(56.dp),
                    tint = if (badge.earned) MaterialTheme.colorScheme.primary
                           else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f),
                )
                Text(badge.name, style = MaterialTheme.typography.headlineSmall)
                Text(
                    badge.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                )
                // Dot tier
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    repeat(5) { i ->
                        val filled = badge.earned && i < badge.dotTier
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .background(
                                    color = if (filled) MaterialTheme.colorScheme.primary
                                            else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                                    shape = androidx.compose.foundation.shape.CircleShape,
                                ),
                        )
                    }
                }
                if (badge.earned && badge.earnedAt != null) {
                    Text(
                        "Earned ${badge.earnedAt.take(10)}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                } else if (!badge.earned) {
                    Text(
                        "Not yet earned",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                OutlinedButton(onClick = onDismiss, modifier = Modifier.fillMaxWidth()) {
                    Text("Close")
                }
            }
        }
    }
}

@Composable
private fun ArchiveScreen(onBack: () -> Unit) {
    val difficulties = listOf("All", "Easy", "Intermediate", "Hard")
    val languages = listOf("All", "Java", "Kotlin")
    var selectedDifficulty by remember { mutableStateOf("All") }
    var selectedLanguage by remember { mutableStateOf("All") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.navigationBars),
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Outlined.ArrowBack, contentDescription = "Back")
            }
            Text(
                "Challenge Archive",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(start = 4.dp),
            )
        }
        HorizontalDivider()

        // Filter chips
        Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
            Text(
                "Difficulty",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(6.dp))
            androidx.compose.foundation.lazy.LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(difficulties) { diff ->
                    val selected = selectedDifficulty == diff
                    Surface(
                        onClick = { selectedDifficulty = diff },
                        shape = MaterialTheme.shapes.extraLarge,
                        color = if (selected) MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                                else MaterialTheme.colorScheme.surface,
                        border = BorderStroke(
                            1.dp,
                            if (selected) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                        ),
                    ) {
                        Text(
                            diff,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                            style = MaterialTheme.typography.labelMedium,
                            color = if (selected) MaterialTheme.colorScheme.primary
                                    else MaterialTheme.colorScheme.onSurface,
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                "Language",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(6.dp))
            androidx.compose.foundation.lazy.LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(languages) { lang ->
                    val selected = selectedLanguage == lang
                    Surface(
                        onClick = { selectedLanguage = lang },
                        shape = MaterialTheme.shapes.extraLarge,
                        color = if (selected) MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                                else MaterialTheme.colorScheme.surface,
                        border = BorderStroke(
                            1.dp,
                            if (selected) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                        ),
                    ) {
                        Text(
                            lang,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                            style = MaterialTheme.typography.labelMedium,
                            color = if (selected) MaterialTheme.colorScheme.primary
                                    else MaterialTheme.colorScheme.onSurface,
                        )
                    }
                }
            }
        }
        HorizontalDivider()

        // Empty state
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            contentAlignment = Alignment.Center,
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.surface,
                ) {
                    Icon(
                        Icons.Outlined.EmojiEvents,
                        contentDescription = null,
                        modifier = Modifier
                            .padding(20.dp)
                            .size(40.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Text(
                    "Archive coming soon",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    "Past challenges will appear here after each day's challenge expires. Check back after your first week!",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                )
            }
        }
    }
}
