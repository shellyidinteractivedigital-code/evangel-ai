# EVANGEL native surfaces

These are source-ready widget extensions for the future signed native EVANGEL apps.

- `ios-widget/EVANGELWidget.swift`: WidgetKit/App Intents starting point.
- `android-widget/EVANGELWidget.kt`: Jetpack Glance starting point.

They intentionally contain no API keys or payment logic. The signed apps should share authenticated EVANGEL/Base44 data through an app-owned data layer and use deep links back into EVANGEL. Native signing, bundle identifiers, entitlements, app groups, Android manifest registration, and store submission remain platform-account steps.