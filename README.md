# EVANGEL

**Scripture. Precision. Presence.**

EVANGEL is a voice-first Scripture companion and living 3D faith workspace. The current web application connects Scripture listening, EVANGEL Scholar, Greek and Hebrew source awareness, Bible study, meaningful highlights, a living journal, sermon creation, device voices, and a spatial library into one coherent experience.

## Product map

- **Home** — connected entry point into listening, study, memory, and creation.
- **Drive Mode** — deliberately reduced voice-first Scripture flow for motion contexts.
- **Greek + Hebrew Scholar** — source and interpretation discipline for original-language study.
- **Bible Study** — search, listening, and four-color highlights: Truth, Growth, Heart, Context.
- **3D Faith Space** — spatial memory for saved verses, journals, highlights, and future study objects.
- **Living Journal** — save reflections and hear them read back.
- **Sermon Creator** — carry study into context, application, and illustration.
- **Voices** — enumerate and preview speech voices available on the current device/browser.

## Governing product rules

1. Scripture text, language evidence, translation choices, textual variants, commentary, and devotional interpretation stay distinguishable.
2. EVANGEL Scholar reports and compares evidence rather than claiming authority over the reader.
3. Creative output never silently becomes evidence about the biblical text.
4. Drive Mode stays simple and audio-first. Deeper reading and typing belong outside motion mode.
5. Prayer is invitational rather than forced into every interaction.
6. Current prototypes must not be marketed as automotive-certified, native-store-ready, or backed by scholarly corpora that are not actually installed.

See [`docs/architecture/PRODUCT_ARCHITECTURE.md`](docs/architecture/PRODUCT_ARCHITECTURE.md) and [`docs/architecture/SCHOLAR_SOURCE_POLICY.md`](docs/architecture/SCHOLAR_SOURCE_POLICY.md).

## Tech stack

- React 18
- Vite 6
- Base44 SDK + Base44 local development
- Three.js
- Lucide React
- Browser Web Speech APIs where supported

## Local development

Prerequisites: Node.js, the Base44 CLI, and Deno.

```bash
npm install
npm install -g base44@latest
base44 login
base44 link
base44 dev
```

Use `base44 dev` for normal local development. It starts the frontend and the local Base44 backend together. Do not run a separate `npm run dev` beside it, because that can create a second Vite instance disconnected from the intended backend.

For frontend-only work against the hosted backend:

```bash
base44 dev --remote
```

Be aware that remote-mode writes can affect hosted application data.

## Verification

Before merging:

```bash
npm run lint
npm run build
```

GitHub Actions repeats these checks for pull requests and pushes to `main`.

## GitHub + Base44

The Base44-connected GitHub repository synchronizes through Git. Keep the synchronized production branch named `main`. Work on feature branches, verify, merge to `main`, then publish explicitly from the Base44 dashboard. See [`docs/architecture/GITHUB_WORKFLOW.md`](docs/architecture/GITHUB_WORKFLOW.md).

## Scripture and source rights

The starter English passages are from the public-domain World English Bible. Original-language and lexical resources have different attribution and redistribution terms. See [`NOTICE.md`](NOTICE.md) and [`docs/architecture/SCHOLAR_SOURCE_POLICY.md`](docs/architecture/SCHOLAR_SOURCE_POLICY.md).

Do not add a complete copyrighted Bible translation, audio Bible, lexicon, or commentary corpus unless its license explicitly covers the intended display, caching, search, audio, sharing, and commercial use.

## Current production gaps

The repository is a working responsive web application, not yet a production native iOS/Android release. Production work still includes authenticated encrypted sync, account deletion, payments if used, privacy/security review, a complete vetted scholarly corpus, accessibility testing, human-factors driving-safety testing, licensed content where required, production monitoring, and platform approval before any CarPlay/Android Auto/vehicle integration claim.

## Repository organization

Runtime source belongs in `src/`. Architecture and implementation decisions belong in `docs/`. Optimized runtime imagery belongs in `public/assets/evangel/`. Historical ZIPs, duplicate exports, large publication bundles, and raw generated design archives should not be committed to ordinary Git history.