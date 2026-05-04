package dev.bytecode.android.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import dev.bytecode.android.config.AppConfig
import dev.bytecode.android.ui.state.AppUiState
import dev.bytecode.android.ui.theme.BytecodeTheme

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
    onOpenBilling: () -> Unit,
) {
    when (state) {
        is AppUiState.Loading -> {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                CircularProgressIndicator()
                Spacer(modifier = Modifier.height(12.dp))
                Text("Loading…")
            }
        }
        is AppUiState.LoggedOut -> {
            SignInScreen(
                loading = false,
                error = null,
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
        is AppUiState.LoggedIn -> {
            DashboardScreen(
                state = state,
                onSignOut = onSignOut,
                onRefresh = onRefresh,
                onOpenBilling = onOpenBilling,
            )
        }
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
    onOpenBilling: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Top,
    ) {
        Text("Welcome back", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(state.user.email ?: "Unknown user", style = MaterialTheme.typography.bodyLarge)
        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Account", style = MaterialTheme.typography.titleMedium)
                Spacer(modifier = Modifier.height(8.dp))
                val billingRole = state.billing?.role ?: state.user.role
                val billingPlan = state.billing?.plan ?: if (state.user.isPremium) "premium" else "free"
                val streak = state.user.streakCount
                Text("Role: $billingRole")
                Text("Plan: ${if (billingPlan == "premium") "Premium" else "Free"}")
                Text("Streak: $streak days")
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

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

        Spacer(modifier = Modifier.height(16.dp))
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

        Spacer(modifier = Modifier.height(24.dp))
        HorizontalDivider()
        Spacer(modifier = Modifier.height(12.dp))
        Text("Next: Curriculum + lessons in app", style = MaterialTheme.typography.bodySmall)
    }
}

