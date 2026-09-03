# EVANGEL Prayer, Sermon, and Scripture Generators

Date: 2026-09-02

## Purpose

Extend EVANGEL's existing Creator, Bible Study, Prayer, Journal, Saved, and 3D Faith Space experiences with three connected generators: Scripture Study, Prayer, and Sermon. The experience serves ministers, serious students, and curious readers while preserving EVANGEL's governing principle of translational precision.

The generators must distinguish verified source text from linguistic evidence, interpretation, application, and creative writing. EVANGEL does not speak for God, replace a pastor, church, conscience, medical care, or emergency services.

## Product principles

1. Scripture quotations come only from an installed and verified corpus or licensed provider response.
2. The launch translation is the public-domain World English Bible. Licensed translations can be added through a provider adapter.
3. Original-language claims come only from installed, versioned Hebrew, Aramaic, and Greek datasets. The language model may explain retrieved evidence but may not invent lemmas, parsing, definitions, or occurrence counts.
4. The concordant method traces a source-language lemma consistently across its occurrences while acknowledging grammar, idiom, and context. No interface may suggest that one English gloss fits every occurrence.
5. Generated prayers, sermons, illustrations, and applications are labeled as generated material.
6. Text-Centered mode is the default. Optional denominational perspectives are explicit, named, and separate from the textual evidence.
7. Every result is editable, versioned, searchable, exportable, and organized in user-controlled folders.

## User experience

### Persistent EVANGEL bot

Every application page includes the EVANGEL bot as a consistent contextual guide. On desktop it opens as a collapsible side panel or compact floating control. On mobile it opens as a bottom sheet. It remains reachable without covering primary navigation, form controls, Scripture text, or driving-safety controls.

The bot receives only an explicit, minimal page-context envelope: current page type, selected item IDs, selected passage reference, active generator step, and user-approved draft excerpts. It does not automatically send the user's complete library, journal, prayer history, or private notes to a model. The interface shows which current item is in context and lets the user remove it before asking a question.

Page-specific capabilities include:

- Home and 3D Faith Space: navigate, find saved work, resume drafts, and explain available tools.
- Creator: turn notes into a sermon, ask the guided interview questions, revise selected sections, and save versions.
- Bible Study: explain verified context, open concordant Hebrew, Aramaic, or Greek word studies, and carry an evidence bundle into Prayer or Sermon Creator.
- Prayer: guide prayer settings, refine generated language, and connect a prayer to its supporting passage.
- Journal: help reflect on selected notes and send only user-selected material to Creator.
- Saved and folders: search, organize, tag, move, duplicate, export, and recover items after confirmation.
- Voices and Settings: explain voice, translation, tradition, privacy, and accessibility choices.

The bot retains the same visible conversation while navigating, but page context updates separately. The user can pin a passage, note, study, prayer, or sermon to keep it in context across pages. New conversations start without pinned private content unless the user intentionally retains it.

The bot can recommend actions but must request confirmation before saving, overwriting, moving, exporting, sharing, or deleting content. Destructive actions remain recoverable where possible. In Drive Mode, the bot uses the existing voice-first safety gate and does not expose reading-heavy interactions.

### Creator page

The Creator page contains three primary actions: Create a Sermon, Create a Prayer, and Study Scripture. A user can begin from a blank prompt or from existing notes.

Accepted sermon sources include pasted notes, uploaded text documents, voice-to-text notes, Journal entries, saved highlights, and previous Scripture studies. Imported content is preserved as a source snapshot. EVANGEL identifies candidate passages and themes, shows them to the user for confirmation, and never silently changes the user's quoted Scripture.

The note-to-sermon flow asks:

1. Confirm the passage or topic.
2. Select the audience.
3. Select a target speaking time from 5, 10, 20, 30, 45, or 60 minutes, with a custom option.
4. Select a style: teaching, inspirational, conversational, prophetic, evangelistic, storytelling, academic, humorous, or pastoral.
5. Select Text-Centered mode or an available tradition.
6. Select a structure: three-point, verse-by-verse, topical, narrative, devotional, or testimony-based.
7. Select an emotional direction, such as hope, conviction, healing, courage, joy, repentance, or comfort.
8. Optionally add a personal story, church theme, quotation, desired invitation, or closing instruction.

The generated sermon contains a title, central truth, verified passage, context, concordant word study, opening, complete manuscript, points and transitions, illustrations, practical application, closing prayer, and optional invitation, benediction, discussion questions, or appropriate humor. It reports an estimated speaking time.

Restyling creates a new version while retaining the original. Commands such as "make this more joyful," "shorten to 15 minutes," "add more Greek," or "simplify for teenagers" operate on selected sections or the complete manuscript.

### Prayer generator

The prayer interview asks who or what the prayer concerns, desired length, emotional need, individual or group use, tone, and whether Scripture should appear throughout. Templates include healing, gratitude, grief, forgiveness, protection, courage, relationships, morning, evening, meals, ceremonies, and recovery. Templates are extensible data, not hard-coded UI branches.

The result contains a verified Scripture foundation, optional original-language insight, prayer, reflection pause, optional congregational responses, and a closing affirmation grounded in the selected passage. Generated language is never formatted as a quotation from God.

### Scripture Study generator

The user may enter a passage, topic, English term, Hebrew term, Aramaic term, or Greek term. The result contains verified passage text, historical and literary context, original script, transliteration, pronunciation guide, lemma, morphology, concordant standard gloss, semantic range, significant occurrences, related passages, translation comparison, study questions, and reflection.

Evidence, interpretation, tradition-specific perspective, and application render as visually distinct sections. Create a Sermon and Create a Prayer actions pass the verified research bundle into Creator without another lookup.

## Architecture

The implementation extends the existing FastAPI backend and browser PWA through focused modules:

```text
backend/app/
  routers/
    assistant.py
    scripture.py
    prayer.py
    sermon.py
    folders.py
  services/
    assistant/
      context.py
      orchestrator.py
      actions.py
      permissions.py
    scripture/
      provider.py
      corpus.py
      references.py
    languages/
      repository.py
      concordance.py
      morphology.py
    generation/
      gateway.py
      schemas.py
      prompts.py
      validation.py
    prayer/
      composer.py
      templates.py
    sermon/
      interview.py
      composer.py
      restyle.py
      timing.py
    library/
      folders.py
      versions.py
      exports.py
```

Each module exposes typed contracts and depends on interfaces rather than a particular data or model provider. Scripture retrieval and linguistic retrieval remain independent from generative composition. New translations, traditions, languages, models, output formats, and prayer templates can be registered without changing generator routes.

The EVANGEL bot is an orchestrator over existing typed services. It does not duplicate generator logic, access the database directly, or create a second model-provider client. Read-only actions and proposed mutations use separate contracts. All model traffic continues through the single existing gateway.

## Data contracts

Every generator request has a client-generated request ID. Every response records the generator version, selected settings, source references, corpus versions, provider identifiers, creation time, warnings, and parent item or source-note IDs.

Every bot request includes a conversation ID, page-context envelope, explicitly attached item IDs, requested action, and client-generated request ID. Stored conversation turns record which context items and source records supported the answer. Private content is not placed in analytics or diagnostic logs.

Scripture citations use canonical book identifiers and normalized verse ranges. A verified passage bundle includes the exact displayed text, translation identifier, rights metadata, retrieval time, and integrity hash.

A word-study record includes language, surface form, lemma, transliteration, pronunciation, morphology, standard gloss, contextual senses, occurrence references, corpus version, and evidence source. Explanatory prose cites the word-study record IDs used.

Generated items use immutable version rows linked to a stable item ID. Editing or restyling creates a new version. Folder moves change organization metadata and do not rewrite content history.

## Folder organization

Default folders are Sermons, Prayers, Scripture Studies, Series, Drafts, and Favorites. Users may create, rename, move, nest, and reorder folders. Items support tags, stars, search, duplicate, archive, export, and recoverable version history.

Sermon Series is a collection type that orders multiple sermon items while leaving each sermon in its chosen folder. Source notes and generated results remain linked in both directions.

The current `folder` metadata field remains readable during migration. New folder records receive stable IDs, parent IDs, names, positions, and timestamps. Existing string folders are migrated idempotently.

## Generation pipeline

1. Validate and normalize user input.
2. Resolve and retrieve the requested passage from a verified source.
3. Retrieve relevant linguistic records and concordance occurrences.
4. Build a research bundle that contains evidence only.
5. Send the research bundle and selected creative controls through the single existing model gateway using strict structured-output schemas.
6. Validate every returned Scripture quotation and linguistic assertion against the research bundle.
7. Reject, remove, or regenerate unsupported claims.
8. Store the source snapshot, research bundle, generated result, settings, citations, and warnings as a new version.
9. Return a render-ready object to the Creator page.

If a verified corpus or provider is unavailable, EVANGEL may save the user's draft and settings but must not fabricate a passage or word study. The UI explains which source is unavailable and offers retry without losing work.

## Theology and tradition profiles

Text-Centered mode uses the passage and retrieved linguistic evidence without applying a named denominational framework. Tradition profiles are optional overlays containing a name, concise scope statement, approved source list, interpretive notes, and disclosure text.

Tradition output appears under a labeled perspective heading. When traditions disagree, EVANGEL presents the differences respectfully and does not manufacture consensus. A profile cannot override the verified Scripture text or linguistic evidence.

## Safety and integrity

The validator blocks invented Bible quotations, invalid references, unsupported original-language claims, manipulative claims of divine authority, targeted spiritual coercion, ridicule of protected or vulnerable people, and dangerous substitutions for professional help.

Humor may be warm and observational. God, Scripture, suffering, disability, trauma, and vulnerable people are not punchlines. Prophetic style refers to rhetorical urgency and biblical themes, not a claim that EVANGEL received new revelation.

## Exports

Users can export one item or a folder as plain text, Markdown, editable document, PDF, print manuscript, presentation outline, or audio script. Exports include translation attribution, source citations, generator disclosures, and version metadata appropriate to the format.

## Testing and acceptance

Unit tests cover reference parsing, timing estimates, interview defaults, concordance grouping, morphology display, folder nesting, version creation, and schema validation. Contract tests cover Scripture and language-provider adapters. Integration tests cover notes to sermon, study to prayer, restyling, save and restore, and offline draft recovery.

Bot tests cover availability on every routed page, mobile and desktop accessibility, context changes during navigation, pinning and removing context, read-only versus mutating actions, confirmation gates, Drive Mode restrictions, and prevention of unrelated private-content retrieval.

Adversarial tests confirm that the generator cannot convert invented text into a Bible quotation, mislabel generated language as God's speech, or assert Hebrew or Greek data absent from the retrieved evidence bundle.

The feature is accepted when a user can create, save, find, restyle, version, move, and export each generator output; create a sermon directly from Creator notes; see verified Scripture and source-language evidence; use the EVANGEL bot from every page with correct and minimal context; and recover gracefully from unavailable external services without losing input.

## Initial delivery boundary

The first production increment includes the WEB adapter, one vetted Hebrew dataset, one vetted Greek dataset, concordant word-study retrieval, all three generator APIs, Creator interviews, note-to-sermon, folder and version models, the persistent contextual EVANGEL bot, Markdown and print exports, validation, and automated tests.

Licensed translations, additional traditions, audio generation, native mobile interfaces, collaborative editing, and additional export formats use the same interfaces but remain later increments.