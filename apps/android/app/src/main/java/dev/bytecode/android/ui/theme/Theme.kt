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
    primary = Color(0xFFC77B3A),
    onPrimary = Color(0xFF0B0B0F),
    secondary = Color(0xFFD88C4B),
    onSecondary = Color(0xFF0B0B0F),
    tertiary = Color(0xFF6FA86F),
    background = Color(0xFF0B0B0F),
    onBackground = Color(0xFFFAFAF7),
    surface = Color(0xFF14141A),
    onSurface = Color(0xFFFAFAF7),
    surfaceVariant = Color(0xFF1C1C24),
    onSurfaceVariant = Color(0xFFA8A8A8),
    outline = Color(0x2EFFFFFF),
    error = Color(0xFFC77B7B),
    onError = Color(0xFF0B0B0F),
)

private val LightColors = lightColorScheme(
    primary = Color(0xFFFF6B35),
    onPrimary = Color(0xFFFFFFFF),
    secondary = Color(0xFFFF8C5A),
    onSecondary = Color(0xFFFFFFFF),
    tertiary = Color(0xFF4CAF50),
    background = Color(0xFFF4F6F9),
    onBackground = Color(0xFF1A1A1A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1A1A1A),
    surfaceVariant = Color(0xFFEEEEEE),
    onSurfaceVariant = Color(0xFF666666),
    outline = Color(0x1A000000),
    error = Color(0xFFF44336),
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
