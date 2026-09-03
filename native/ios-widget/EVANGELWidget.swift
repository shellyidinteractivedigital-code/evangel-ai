import WidgetKit
import SwiftUI
import AppIntents

struct ScriptureEntry: TimelineEntry {
    let date: Date
    let reference: String
    let text: String
}

struct ScriptureProvider: TimelineProvider {
    func placeholder(in context: Context) -> ScriptureEntry { ScriptureEntry(date: .now, reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.") }
    func getSnapshot(in context: Context, completion: @escaping (ScriptureEntry) -> Void) { completion(placeholder(in: context)) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<ScriptureEntry>) -> Void) {
        let entry = placeholder(in: context)
        completion(Timeline(entries: [entry], policy: .after(Calendar.current.date(byAdding: .hour, value: 6, to: .now)!)))
    }
}

struct OpenEVANGELIntent: AppIntent {
    static var title: LocalizedStringResource = "Open EVANGEL"
    static var openAppWhenRun = true
    func perform() async throws -> some IntentResult { .result() }
}

struct EVANGELWidgetView: View {
    var entry: ScriptureProvider.Entry
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("EVANGEL").font(.caption).tracking(2).foregroundStyle(.yellow)
            Text(entry.reference).font(.title3).fontWeight(.semibold)
            Text(entry.text).font(.caption).lineLimit(4)
            if #available(iOS 17.0, *) { Button(intent: OpenEVANGELIntent()) { Label("Open", systemImage: "book") } }
        }.containerBackground(for: .widget) { LinearGradient(colors:[Color(red:0.02,green:0.05,blue:0.10),.black],startPoint:.top,endPoint:.bottom) }
    }
}

struct EVANGELWidget: Widget {
    let kind = "EVANGELScriptureWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: ScriptureProvider()) { EVANGELWidgetView(entry: $0) }
            .configurationDisplayName("EVANGEL Scripture")
            .description("Keep a verse from your Scripture journey close.")
            .supportedFamilies([.systemSmall,.systemMedium])
    }
}