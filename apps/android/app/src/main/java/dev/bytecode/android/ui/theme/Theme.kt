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
    primary = Color(0xFF9E5A22),
    onPrimary = Color(0xFFFFF9F5),
    secondary = Color(0xFFB86E33),
    onSecondary = Color(0xFFFFF9F5),
    tertiary = Color(0xFF4D7E4D),
    background = Color(0xFFF5F1EC),
    onBackground = Color(0xFF19140F),
    surface = Color(0xFFFEFBF8),
    onSurface = Color(0xFF19140F),
    surfaceVariant = Color(0xFFE9E1D9),
    onSurfaceVariant = Color(0xFF5B5248),
    outline = Color(0x33241910),
    error = Color(0xFF9F4E4E),
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
