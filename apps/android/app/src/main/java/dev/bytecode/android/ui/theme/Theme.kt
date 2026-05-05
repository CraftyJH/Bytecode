package dev.bytecode.android.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

private val DarkColors = darkColorScheme(
    primary = Color(0xFF7C8DFF),
    onPrimary = Color(0xFF101323),
    secondary = Color(0xFFB9C0FF),
    onSecondary = Color(0xFF141727),
    tertiary = Color(0xFF81D4C2),
    background = Color(0xFF0B1020),
    onBackground = Color(0xFFE5E9FF),
    surface = Color(0xFF11172B),
    onSurface = Color(0xFFE5E9FF),
    surfaceVariant = Color(0xFF1A2340),
    onSurfaceVariant = Color(0xFFBCC5E8),
    outline = Color(0xFF2A355C),
    error = Color(0xFFFF7F9D),
    onError = Color(0xFF310513),
)

private val LightColors = lightColorScheme(
    primary = Color(0xFF3F5CFF),
    onPrimary = Color(0xFFF8FAFF),
    secondary = Color(0xFF5E6AD2),
    onSecondary = Color(0xFFF8FAFF),
    tertiary = Color(0xFF009E7A),
    background = Color(0xFFF5F7FF),
    onBackground = Color(0xFF0F1830),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF0F1830),
    surfaceVariant = Color(0xFFEEF2FF),
    onSurfaceVariant = Color(0xFF4A567A),
    outline = Color(0xFFD9DEF5),
    error = Color(0xFFC73D5B),
    onError = Color(0xFFFFFFFF),
)

private val BytecodeShapes = Shapes(
    extraSmall = androidx.compose.foundation.shape.RoundedCornerShape(8.dp),
    small = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
    medium = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
    large = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
    extraLarge = androidx.compose.foundation.shape.RoundedCornerShape(28.dp),
)

@Composable
fun BytecodeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) DarkColors else LightColors
    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        shapes = BytecodeShapes,
        content = content,
    )
}
