package dev.bytecode.api.badge

import org.springframework.stereotype.Component
import java.awt.Color
import java.awt.Font
import java.awt.RenderingHints
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO

@Component
class ShareCardRenderer {

    private val background = Color(0x14, 0x14, 0x1A)
    private val accent     = Color(0xC7, 0x7B, 0x3A)
    private val textPrimary   = Color(0xE8, 0xE8, 0xF0)
    private val textSecondary = Color(0xA0, 0xA0, 0xAA)
    private val border     = Color(0x2A, 0x2A, 0x34)

    fun render(badge: BadgeDefinition): ByteArray {
        val width = 1200
        val height = 630
        val img = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)
        val g = img.createGraphics()

        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB)

        // Background
        g.color = background
        g.fillRect(0, 0, width, height)

        // Border frame
        g.color = border
        g.drawRect(0, 0, width - 1, height - 1)

        // Accent bar top
        g.color = accent
        g.fillRect(0, 0, width, 6)

        // Category pill
        g.color = border
        val pillW = 160; val pillH = 36; val pillX = 80; val pillY = 80
        g.fillRoundRect(pillX, pillY, pillW, pillH, pillH, pillH)
        g.font = Font("SansSerif", Font.BOLD, 14)
        g.color = accent
        val catLabel = badge.category.uppercase()
        val catFm = g.fontMetrics
        val catLabelX = pillX + (pillW - catFm.stringWidth(catLabel)) / 2
        g.drawString(catLabel, catLabelX, pillY + pillH / 2 + catFm.ascent / 2 - 2)

        // Badge name
        g.color = textPrimary
        g.font = Font("SansSerif", Font.BOLD, 72)
        g.drawString(badge.name, 80, 240)

        // Description
        g.color = textSecondary
        g.font = Font("SansSerif", Font.PLAIN, 32)
        val descLines = wrapText(badge.description, g, width - 160)
        descLines.forEachIndexed { i, line ->
            g.drawString(line, 80, 310 + i * 46)
        }

        // Dot tier
        val dotY = 500
        repeat(badge.dotTier) { i ->
            g.color = accent
            g.fillOval(80 + i * 28, dotY, 18, 18)
        }
        repeat(5 - badge.dotTier) { i ->
            g.color = border
            g.fillOval(80 + (badge.dotTier + i) * 28, dotY, 18, 18)
        }

        // Branding
        g.color = textSecondary
        g.font = Font("Monospaced", Font.BOLD, 22)
        g.drawString("BYTECODE", width - 200, height - 40)

        g.dispose()

        val out = ByteArrayOutputStream()
        ImageIO.write(img, "png", out)
        return out.toByteArray()
    }

    private fun wrapText(text: String, g: java.awt.Graphics2D, maxWidth: Int): List<String> {
        val words = text.split(" ")
        val lines = mutableListOf<String>()
        var current = StringBuilder()
        val fm = g.fontMetrics
        for (word in words) {
            val test = if (current.isEmpty()) word else "$current $word"
            if (fm.stringWidth(test) <= maxWidth) {
                current = StringBuilder(test)
            } else {
                if (current.isNotEmpty()) lines.add(current.toString())
                current = StringBuilder(word)
            }
        }
        if (current.isNotEmpty()) lines.add(current.toString())
        return lines
    }
}
