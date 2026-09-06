# EVANGEL Concordant Scripture Intelligence Design

**Date:** 2026-09-06  
**Status:** Approved for implementation  
**Initial book:** Gospel of Luke  
**Scope:** Study, Scholar, Creator, EVANGEL Bot, prayer generator, sermon generator, Scripture-answer generator, saved work, and Faith Space

## Purpose

EVANGEL will apply a concordant method throughout the app by tracing verified biblical vocabulary consistently while keeping source text, grammar, translation, interpretation, application, and generated devotional writing visibly distinct.

The system will begin with a deep Gospel of Luke experience and use the same architecture for later biblical books.

## Governing principles

1. Determine what the text says before explaining what it means.
2. Preserve the distinction between a source-language word and its English renderings.
3. Use stable standard glosses as study anchors, not as claims that one English word fits every context.
4. Show contextual range across the passage, book, Luke-Acts, New Testament, Septuagint, and supported Hebrew background.
5. Never invent Greek, Hebrew, Aramaic, morphology, pronunciation, occurrences, textual variants, or citations.
6. Label direct lexical correspondence, Septuagint correspondence, conceptual background, translation, interpretation, application, illustration, prayer, and sermon as different evidence layers.
7. When evidence is unavailable or disputed, say so.
8. Generated content may explain evidence but may not silently create or alter it.
9. The creator's requested idea remains the primary creative instruction.
10. Concordant Publishing Concern materials remain link-only unless written permission permits another use.

## Chosen architecture

Use a shared, verified evidence engine rather than relying on prompt instructions alone.

The engine will be consumed by:

- Bible Study
- Original Language Scholar
- Gospel of Luke Journey
- EVANGEL Bot
- Creator
- Prayer generator
- Sermon generator
- Scripture-study generator
- Saved word studies
- Faith Space

A future phase may add a complete precomputed biblical alignment database. This implementation establishes the interfaces and provenance fields needed for that expansion without requiring the entire database now.

## Source policy

### Bundled and approved

- World English Bible for English reading and quotation
- Brenton English Septuagint for public-domain Septuagint comparison
- Greek Septuagint corpus distributed through the approved eBible source
- Open Scriptures Hebrew Bible with required CC BY attribution
- SBL Greek New Testament with required attribution
- MorphGNT when installed and used under its applicable terms

### Reference and cross-check

- STEP Bible and Tyndale House resources according to source-specific terms
- Major textual editions and lexicons may be named as references only when the app has a lawful data source or link

### Link-only

- Concordant Literal New Testament
- Concordant Keyword Concordance
- Concordant Greek Text and related Concordant publications

EVANGEL may explain and apply concordant analytical principles using original code and original prose. It must not reproduce or redistribute Concordant Publishing Concern content. The interface must not imply affiliation, sponsorship, or endorsement.

## Evidence model

A passage research bundle will contain:

- reference
- canonical book, chapter, and verse range
- selected passage
- surrounding context
- English source identity and rights
- source-language corpus identity and version
- original-language tokens
- surface form
- lemma
- transliteration
- pronunciation
- morphology
- stable standard gloss
- contextual senses
- occurrence references
- book-level count
- Luke-Acts count where applicable
- New Testament or Hebrew Bible count where supported
- Septuagint matches
- Hebrew source relationship
- relationship type
- textual variant notes
- translation notes
- evidence source
- confidence
- warnings

### Relationship types

Hebrew and Greek relationships must use one of these explicit labels:

- direct_source_word
- septuagint_correspondence
- quotation_or_allusion
- conceptual_parallel
- uncertain

A conceptual parallel must never be presented as a direct lexical equivalence.

## Shared modules

### Scripture reference parser

Normalizes book names, chapters, verses, and ranges. It rejects unresolved references rather than guessing.

### Corpus index

Loads and indexes the approved English, Greek, Hebrew, and Septuagint corpora. It supports passage lookup and lemma occurrence lookup without sending entire corpora to the language model.

### Language evidence provider

Returns only verified word records associated with the passage. Records without a lemma and evidence source are rejected.

### Concordant analyzer

Builds word-family and occurrence views. It preserves one-to-many relationships between a source word and contextual English renderings.

### Hebrew-Septuagint bridge

Provides Hebrew background only when supported by aligned data, quotation evidence, or a clearly labeled conceptual relationship.

### Evidence validator

Validates provenance, citation allowlists, source versions, and required fields before evidence reaches a generator.

### Presentation formatter

Produces consistent cards and labels for Study, Scholar, Creator, and the bot without changing the underlying evidence.

## Gospel of Luke Journey

The first guided book experience will contain eight movements:

1. Luke 1-2: Promise, covenant, songs, and incarnation
2. Luke 3-4: Preparation, testing, Spirit, and mission
3. Luke 5-9: Authority, healing, forgiveness, and discipleship
4. Luke 9:51-19:27: The journey toward Jerusalem
5. Luke 10-18: Mercy, prayer, wealth, outsiders, and reversal
6. Luke 19-21: Jerusalem, confrontation, and judgment
7. Luke 22-24: Supper, cross, resurrection, and opened Scriptures
8. Luke-Acts bridge: Promise becoming worldwide witness

Each movement will offer:

- overview
- key passages
- recurring vocabulary
- literary connections
- Greek word studies
- supported Hebrew and Septuagint background
- translation observations
- labeled interpretations
- reflection questions
- create prayer
- create sermon
- save study

Initial vocabulary will include verified records for terms such as euangelizomai, soteria, aphesis, ptōchos, eleos, metanoia, pneuma, chara, and other words only as corpus evidence permits.

## Bible Study experience

A selected passage will expose these actions:

- Read
- Context
- Original words
- Concordant occurrences
- Hebrew and Septuagint background
- Translation
- Interpretation
- Create prayer
- Create sermon
- Save word study

The default screen remains readable and uncluttered. Deep evidence opens progressively so subscribers are not forced through long technical panels.

## Scholar experience

Scholar will present a consistent evidence ladder:

1. TEXT: sourced Scripture
2. FORM: grammar and morphology
3. WORD: lemma and word family
4. RANGE: occurrences and contextual senses
5. BACKGROUND: Septuagint, Hebrew, quotation, or allusion
6. TRANSLATION: possible English renderings
7. INTERPRETATION: clearly labeled theological readings
8. APPLICATION: devotional use

Scholar will show disagreement and meaningful textual variants when verified data supports them.

## EVANGEL Bot behavior

The bot will automatically receive the selected passage's verified research bundle.

It may:

- answer a Scripture question
- create a complete prayer
- create a complete sermon
- explain verified Greek or Hebrew
- show relevant occurrences
- open the result in Creator
- save the result with provenance

It must not:

- generate unsupported language claims
- cite a passage absent from its verified evidence
- present interpretation as translation
- claim to speak for God
- tell a subscriber that unavailable evidence exists

When language evidence is unavailable, the response will state that clearly and continue with an appropriately limited Scripture answer.

## Generator behavior

All prayer, sermon, and Scripture-study generation will follow this evidence order:

1. subscriber idea
2. verified passage
3. literary context
4. relevant original-language evidence
5. supported Hebrew or Septuagint background
6. translation observations
7. labeled interpretation
8. application
9. requested devotional or preaching form

Generators will use a small number of relevant words rather than producing a vocabulary dump.

### Sermons

A sermon will include:

- title
- central truth
- compelling opening
- faithful passage context
- clear movement or points
- relevant Greek and Hebrew education
- concrete application
- requested style and length
- closing invitation or prayer

### Prayers

A prayer will address the subscriber's need directly, use language suitable for reading aloud, and avoid turning lexical material into artificial exposition.

### Scripture studies

A study will prioritize evidence, explain translation and interpretation separately, and provide practical questions or application.

## Saved work and provenance

FaithItem source snapshots will retain:

- selected passage
- surrounding context
- source identities
- corpus versions
- language evidence
- concordant analysis
- relationship labels
- generator settings
- warnings
- generated timestamp

Supported saved types include prayer, sermon, study, and word study. Reopening saved work will use the saved evidence snapshot so later corpus changes do not silently rewrite its history.

## User experience rules

- Greek and Hebrew must be educational and readable.
- Every original-language card includes transliteration and a short pronunciation aid.
- Technical depth is progressive, not forced.
- Source links appear near claims.
- Long generated material remains editable, listenable, shareable, foldered, and deletable.
- Creator retains Start over with confirmation for unsaved work.
- Mobile controls remain large enough to use comfortably.
- No page becomes a wall of text.

## Error handling

- Invalid passage: request a valid selectable passage.
- Missing source text: show the unavailable source and do not generate linguistic claims.
- Missing morphology: omit morphology and state the limitation.
- Unsupported Hebrew relationship: omit it or label it uncertain.
- Unsupported citation: remove it and add a warning.
- Generator failure: preserve the user's prompt and settings.
- Save failure: preserve the generated work locally on screen and explain how to retry.
- Corpus load failure: allow limited English study when the verified English passage remains available.

## Security and privacy

- Base44 authentication is required for generation and saved work.
- FaithItem ownership remains protected by row-level security.
- Service-role access remains server-only.
- Prompts and notes are length-limited and treated as untrusted input.
- The model cannot expand the citation allowlist.
- Generated output is never promoted into the evidence store.
- External links use safe browser attributes.
- No copyrighted Concordant content is bundled.

## Testing strategy

### Corpus tests

- reference parsing
- exact passage lookup
- Greek and Hebrew source retrieval
- lemma indexing
- occurrence counts
- Unicode preservation
- attribution and version fields

### Evidence tests

- reject words without provenance
- reject unsupported citations
- distinguish direct, Septuagint, and conceptual relationships
- prevent a standard gloss from becoming an exclusive definition
- preserve text, translation, and interpretation layers

### Generator contract tests

- every generator accepts the shared bundle
- language claims must match supplied evidence
- prayers, sermons, and studies follow their requested form
- creator idea remains primary
- unavailable evidence produces a limitation notice

### Interface tests

- Luke Journey navigation
- progressive evidence panels
- Study-to-Creator actions
- bot receives evidence automatically
- saved source snapshots
- mobile control labels
- delete and Start over remain functional

### Full verification

- all automated tests
- lint
- type checking
- production build
- Base44 preview logs
- focused manual checks for Luke 1, Luke 4, Luke 10, Luke 15, Luke 19, and Luke 24

## Delivery order

1. Shared evidence schema and validators
2. Corpus lookup and reference normalization
3. Luke vocabulary and movement data
4. Study progressive evidence interface
5. Scholar evidence ladder
6. Bot automatic evidence attachment
7. Generator contracts and prompts
8. Saved provenance and word studies
9. Full testing and Base44 checkpoint
10. GitHub synchronization

## Acceptance criteria

The implementation is complete when:

- selecting a supported Luke passage creates a verified evidence bundle
- Study and Scholar display the same underlying evidence consistently
- the bot automatically receives passage evidence
- all three generators use the shared evidence contract
- sermons educate with relevant original-language material
- unsupported language claims are filtered or prevented
- Hebrew relationships are explicitly typed
- saved work retains evidence provenance
- Concordant resources remain attributed links only
- the app remains readable on mobile
- deletion and Start over continue working
- tests, lint, type checking, build, and preview checks pass