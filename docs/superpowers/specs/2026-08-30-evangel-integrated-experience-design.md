# EVANGEL Integrated Experience Design

**Goal:** Make EVANGEL one connected Scripture experience across web/PWA, mobile shells, widgets, family profiles, sharing/groups, premium voice, and the Faith Space.

## Core promise

EVANGEL helps people grow closer to God by connecting what they hear, study, pray, journal, question, save, share, and teach into a living Scripture space they can return to.

## One backend, multiple surfaces

Base44 remains the canonical backend for authentication, entities, functions, billing, sharing, family profiles, and voice endpoints. The current React/Vite application remains the canonical web/PWA client. Native iOS/Android shells and widgets consume the same backend contracts instead of duplicating product state.

## Canonical records

- `FaithItem`: verse, highlight, note, journal, prayer, answered prayer, study, sermon, word study, collection, voice note.
- `ChildProfile`: parent-owned supervised profile with age band and explicit mic/share settings.
- `FaithGroup`: owner/member-controlled Bible study group.
- `ShareLink`: server-generated, revocable public token pointing to a shareable FaithItem.
- Existing billing entities continue to govern EVANGEL Plus.

## Public website

Publicly navigable sections must include Home, About, Bible Study, Scholar, Faith Space, Sermon Creator, Groups, Young Explorer/Family, EVANGEL Plus, Support, Privacy, Terms, Refunds, and Cancellation. Important destinations use real crawlable links or stable URLs.

## About EVANGEL

The About page explains that EVANGEL is not merely an AI chat product. It preserves continuity between Scripture, evidence, memory, prayer, reflection, and teaching. It explicitly distinguishes source evidence from interpretation and states that EVANGEL does not speak for God.

## Universal actions

Meaningful content should expose a consistent action pattern where appropriate:

`Save • Note • Highlight • Share`

Share uses the native Web Share API when available and falls back to clipboard. Authenticated saved FaithItems can also receive a revocable public EVANGEL share link.

## Bible Groups

Groups support a name, description, owner, members, invite code, shared FaithItems, and group-visible highlights/notes. Personal items remain private unless deliberately shared to a group. The initial group UX prioritizes invite link/code, shared passage/study, highlights, notes, prayers, and one-tap save back to personal Faith Space.

## Family / Young Explorer

Three age bands:

- Young Explorer: 5–7
- Growing Reader: 8–12
- Teen Study: 13+

Young Explorer uses very simple language: Read, Ask, Pray, Remember, My Bible World. Parent controls govern microphone, saved voice notes, external sharing, purchases, and profile deletion. No child email is required.

## Voice

Free tier keeps device/browser speech synthesis as a resilient fallback.

Premium voice provider abstraction exposes curated human-facing voice profiles. Initial Google Chirp 3 HD candidates:

- `warm_grounded_male` → `en-US-Chirp3-HD-Alnilam`
- `gentle_reflective_female` → `en-US-Chirp3-HD-Aoede`

Premium TTS must run through a protected Base44 backend function and never expose provider credentials. Voice commands remain permission-based and raw microphone audio is not retained by default.

## Microphone / realtime

The existing browser speech-recognition path remains a fallback. A protected realtime-voice gateway can later issue short-lived sessions for low-latency WebRTC voice. Tool actions must be constrained to EVANGEL capabilities such as read Scripture, save, open Scholar, journal, prayer, and search Faith Space.

## Faith Space visual direction

Replace generic spinning geometric nodes with a celestial library: readable glass Scripture/memory cards, midnight depth, gold edge light, restrained teal/violet accents, subtle stars/horizon, luminous connection lines, calm parallax, focus transitions, and reduced-motion support. The experience should visualize relationships between saved Scripture, notes, prayers, answered prayers, studies, and sermons.

## Widgets

Web/PWA widget-like card: daily verse + Listen + Open/Save.

iOS WidgetKit scaffold: small/medium Scripture widgets using App Intents for Open/Listen/Save where platform rules permit.

Android Glance scaffold: analogous small/medium Scripture widget.

Native widget targets are source-ready scaffolds until Apple/Google signing identities and native project provisioning are available.

## Visual assets

Generate and store optimized EVANGEL-owned artwork for web hero, Faith Space background, App Store promotional frames, and widget backgrounds. Avoid embedding copyrighted third-party artwork.

## GitHub

GitHub two-way sync is an account-level authorization step in Base44. The project currently uses Base44’s internal repository. The integrated source remains organized and Git-ready; once the owner connects GitHub, `main` becomes the synchronized branch.

## Verification

Every implementation block must run `npm test`, payment security scan, lint, and production build. Source scans must ensure child/privacy and billing guardrails remain intact. Native scaffolds must include build/readme instructions and no secrets.