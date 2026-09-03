package ai.evangel.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Column
import androidx.glance.layout.Spacer
import androidx.glance.layout.height
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

class EVANGELWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent { ScriptureWidgetContent() }
    }
}

@Composable
private fun ScriptureWidgetContent() {
    Column(modifier = GlanceModifier.background(ColorProvider(Color(0xFF071426)))) {
        Text("EVANGEL", style = TextStyle(color = ColorProvider(Color(0xFFE7BD67))))
        Spacer(GlanceModifier.height(8.dp))
        Text("Psalm 23:1", style = TextStyle(color = ColorProvider(Color.White)))
        Text("The Lord is my shepherd; I shall not want.", style = TextStyle(color = ColorProvider(Color(0xFFD5DDE7))))
    }
}

class EVANGELWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = EVANGELWidget()
}