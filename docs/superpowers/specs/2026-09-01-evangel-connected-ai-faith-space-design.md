# EVANGEL Connected AI + Faith Space Design

**Date:** September 1, 2026

## Goal

Make AI, Scripture study, sermon creation, prayer, journaling, sharing, and spatial organization feel like one coherent EVANGEL system. Every major page can ask EVANGEL for help, turn results into reusable Faith Items, save or share them, and place them into a persistent interactive 3D Faith Space.

## Product Principle

EVANGEL is Scripture-centered, not chat-centered. AI helps the user read, compare, organize, create, and remember. It never presents itself as divine authority and never collapses source text, linguistic evidence, translation choices, interpretation, and personal reflection into one unlabeled answer.

## Core Architecture

All major pages use one shared `EVANGEL Copilot` interface. The page supplies a context object describing the current passage, page, selected Faith Items, profile mode, and requested action. The Copilot calls a Base44 server function that returns a structured response with evidence layers and optional generated artifacts.

The shared flow is:

`Page context -> EVANGEL Copilot -> Evidence/Concordance engine -> Structured answer -> Create/Transform -> FaithItem -> FaithRelation -> 3D Faith Space -> Save/Share/Voice`

The system must not create separate AI implementations for each page. Page-specific UI is allowed, but the AI request/response contract stays shared.

## Pages Covered

The shared AI layer is available on:

- Home
- Drive Sanctuary
- Bible Study
- Scholar
- Faith Space
- Journal
- Sermon Creator
- Notes
- Groups
- Young Explorer / Family
- Shared item view where appropriate

Billing, legal, privacy, refunds, cancellation, and support remain functional pages but do not need generative AI controls.

## EVANGEL Copilot

### Core actions

Every participating page may offer these context-aware actions where relevant:

- Ask EVANGEL
- Explain
- Find related Scripture
- Show context
- Show Greek / Hebrew
- Concordance
- Compare translations
- Create Prayer
- Create Sermon
- Create Journal Entry
- Create Study
- Create Word Study
- Create Questions
- Create Discussion Guide
- Summarize
- Organize in Faith Space
- Read Aloud
- Save
- Share

The visible action set may be reduced by page and profile mode.

### Request contract

The frontend sends a structured request containing:

- `page`
- `mode`: adult, drive, young_explorer, growing_reader, teen_study
- `question`
- `scripture_ref`
- `scripture_text`
- `source_key`
- `selected_item_ids`
- `selected_text`
- `desired_artifact`
- `conversation_context` limited to what is necessary for the current task

No API keys or provider secrets may be sent to the browser.

### Response contract

The backend returns:

- `answer`
- `evidence_layers`
- `related_refs`
- `suggested_actions`
- optional `artifact`
- optional `relations`
- `safety_label`

Each evidence layer has a `type`, `label`, `content`, and optional `source` / `reference` metadata.

## Concordance / Evidence Model

EVANGEL answers biblical questions using visibly separated evidence layers.

### Scripture

Direct quoted or paraphrased passage content with reference and translation/source identifier.

### Original Language

Where bundled source data supports it, show Hebrew or Greek form, lemma, transliteration, morphology, and gloss possibilities. The app must not fabricate lexical or morphological details when source data is unavailable.

### Concordance

Find occurrences of the same lemma, translated term, or concept across the bundled corpora. Results must distinguish exact lexical matches from broader thematic matches.

### Translation

Explain meaningful differences among bundled or permitted translations without pretending that one English rendering is identical to the source-language wording.

### Context

Provide literary, canonical, historical, or structural context. Historical claims should be labeled as historical/background information rather than Scripture text.

### Interpretation

Theological or devotional interpretation is labeled as interpretation. EVANGEL never claims a lemma alone proves a theological conclusion.

### Personal Reflection

Questions, prayer prompts, and application are labeled as reflection/application, not evidence.

## AI Artifact Types

AI output can become a `FaithItem` with one of these kinds:

- verse
- highlight
- note
- journal
- prayer
- answered_prayer
- study
- sermon
- word_study
- collection
- voice_note

The existing `FaithItem` entity remains the canonical saved object model.

When AI creates a sermon, prayer, study, note, journal, or word study, the user can edit before saving. Saving persists the generated artifact to `FaithItem` rather than only local state.

## Faith Relations

A new `FaithRelation` entity represents graph edges between saved Faith Items.

Fields:

- `owner_user_id`
- `from_item_id`
- `to_item_id`
- `relation_type`
- `label`
- `created_at`
- `updated_at`

Allowed relation types:

- supports
- references
- derived_from
- answers
- continues
- groups_with
- contrasts
- same_theme
- same_passage

All records are owner-private through Base44 RLS.

Examples:

- sermon `derived_from` study
- study `references` verse
- prayer `derived_from` journal
- answered prayer `answers` prayer
- two studies `same_passage`
- several items `groups_with` a collection

## Real Interactive 3D Faith Space

The current layered HTML depth treatment is replaced by a true Three.js WebGL workspace.

### Interaction

Users can:

- orbit / rotate
- pan
- zoom
- click nodes
- keyboard-focus accessible node equivalents
- drag nodes into new positions
- multi-select nodes
- search and focus/fly to a matching node
- filter by kind, Scripture book/reference, tag, date, collection, or color
- show/hide relation lines

### Persistence

Each `FaithItem.spatial` object stores its durable placement and layout metadata. Minimum structure:

```json
{
  "x": 0,
  "y": 0,
  "z": 0,
  "layout": "galaxy",
  "cluster": "",
  "pinned": false
}
```

Moving a node updates the server-backed Faith Item when the item exists in Base44. Local-only legacy items may retain local coordinates until migrated.

### Layout modes

Faith Space supports:

- Galaxy
- Timeline
- Scripture Book
- Collections

`Galaxy` emphasizes relationships and themes. `Timeline` orders by creation date. `Scripture Book` clusters by biblical book/reference. `Collections` groups saved collections and their members.

### Organizational AI

AI can propose, but not silently force, organization actions such as:

- cluster by theme
- cluster by passage
- group prayers
- group sermon research
- create a collection from selected items
- link selected items
- find orphaned/unconnected items
- suggest related memories

The user confirms organization changes that modify saved spatial positions or relations.

### Selection actions

Selecting one or more nodes allows:

- Ask about these
- Create Sermon
- Create Prayer
- Create Study
- Create Collection
- Link Items
- Share
- Move / Pin

## Save and Share Everywhere

AI output and user-created material use a consistent action bar:

- Save
- Add to Faith Space
- Continue with AI
- Read Aloud
- Share

When an item is already persisted, Share may create a public token-backed share link using the existing `ShareLink` system. Unsaved transient content can use native text sharing but must not pretend to have a durable public URL.

The canonical production domain is `https://evangel-ai.com`.

## Sermon Creator Upgrade

Sermon Creator supports AI-assisted generation for:

- title
- main idea
- passage/context
- outline / points
- concordance references
- original-language notes
- application
- illustration
- closing prayer
- discussion questions

AI additions must remain editable. The user can generate one field at a time or request a full draft.

Saving the sermon creates/updates a `FaithItem(kind='sermon')` and may create `FaithRelation` records back to the verses, notes, studies, prayers, or word studies used to create it.

## Prayer and Journal Upgrade

Journal and Notes can ask AI to:

- reflect without overclaiming
- find related Scripture
- turn the entry into a prayer
- turn the entry into a study question
- summarize
- continue writing
- save the result as a linked Faith Item

Prayer creation clearly labels generated wording as a suggested prayer, never as a divine message.

## Study / Scholar Upgrade

Study becomes the primary concordance-style exploration page while Scholar remains the deeper evidence/source view.

Study can:

- search bundled Scripture corpora
- ask a question about a selected passage
- show related references
- open Original Language evidence
- open Concordance matches
- compare translations
- transform findings into saved artifacts

Scholar can receive the same Copilot request contract but defaults to evidence-rich responses and shows the complete Truth Mode labels.

## Young Explorer

Young Explorer is a child-safe, visually warm experience built on the same system with a restricted mode.

Primary areas:

- Story Cloud: read/listen
- Question Star: ask
- Prayer Garden: create a suggested prayer
- Memory Constellation: view saved child-profile items
- Create Corner: simple reflection/devotional activity

### Child AI rules

For `young_explorer` mode:

- use shorter vocabulary and sentences
- avoid frightening or graphic elaboration
- never claim God directly told the child something
- never encourage secrecy from parents/guardians
- purchases remain unavailable
- external sharing follows the parent-controlled `external_sharing_enabled` flag
- microphone use follows `mic_enabled`
- saved voice notes follow `saved_voice_notes_enabled`
- responses should invite a trusted grown-up when a question requires adult context

Saved child artifacts carry `profile_id` so they remain attributable to the supervised child profile.

## Child Visual System

Young Explorer uses a coordinated EVANGEL illustration set rather than unrelated stock art. Visual themes include friendly clouds, stars, garden elements, books, gentle animals, light paths, and constellation memories. Images must support the product hierarchy and never obstruct readable text.

The illustration set may be added as static runtime assets under `public/assets/evangel/young-explorer/`.

## Data and Security

### Existing entities retained

- FaithItem
- ShareLink
- FaithGroup
- ChildProfile

### New entity

- FaithRelation

### Server-side AI

All generative AI/provider calls run in Base44 backend functions. Provider secrets remain server-side. The frontend never embeds model API credentials.

### Ownership

Faith Items and Faith Relations remain owner-scoped through RLS. Child profiles remain parent-scoped. Group membership continues to use the existing group security model.

## Error Handling

If AI is unavailable:

- core Scripture reading/search still works
- local/device voices still work where supported
- editing and saving remain available
- user sees an explicit `AI unavailable` message rather than a fabricated result

If concordance evidence is unavailable for a requested language/source, EVANGEL says the evidence is unavailable and may offer plain Scripture search instead.

If 3D/WebGL is unavailable, Faith Space falls back to an accessible 2D organized card/graph view using the same Faith Items and relations.

## Accessibility

- reduced-motion preference disables nonessential flight/orbit animation
- keyboard users can select and open all Faith Items
- a non-WebGL list/graph equivalent is maintained
- AI output uses semantic headings and labeled evidence sections
- child visual backgrounds retain readable contrast

## Testing Requirements

Automated tests must cover:

- one shared Copilot request contract across pages
- evidence layer separation
- no invented original-language claims when source data is absent
- AI provider keys stay server-side
- sermon/prayer/journal/study artifact conversion
- save/share behavior
- FaithRelation ownership and relation creation
- 3D coordinate persistence
- layout transformation determinism
- 2D fallback
- Young Explorer safety transformations and parent gates
- old domain regression protection
- all visible buttons have working handlers or are intentionally disabled with explanation

Final release gate remains:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run security:payments`

## Rollout Order

1. Shared Copilot contract and Base44 AI backend
2. Evidence/concordance engine
3. Canonical artifact save/share transformation
4. FaithRelation persistence
5. Real Three.js Faith Space with 2D fallback
6. AI organization/actions inside Faith Space
7. Sermon, Journal, Notes, Study, Scholar integrations
8. Young Explorer AI mode and illustrations
9. Groups/shared-item integration
10. full button/action audit, regression tests, release verification, Base44 main, GitHub mirror

## Success Criteria

The upgrade is complete when a user can start from any major EVANGEL space, ask AI for help, see Scripture/evidence clearly separated from interpretation, create a sermon/prayer/study/journal artifact, save it, see it appear in a persistent interactive Faith Space, connect it to related material, return to it later, and share it through the correct production domain. A supervised child can perform the equivalent simplified flow within parent-controlled safety boundaries.