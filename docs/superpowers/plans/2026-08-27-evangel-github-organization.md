# EVANGEL GitHub Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the existing working EVANGEL React/Vite/Base44 application into a clean, documented, CI-verified GitHub repository without changing current user-visible behavior.

**Architecture:** Keep Base44 at the repository root and split EVANGEL by product feature rather than by arbitrary technical layer. `src/app/App.jsx` becomes composition/navigation; each major experience gets a focused feature module; shared speech, local persistence, source registry, and FaithItem mapping move into hooks/services/data. Existing Base44 auth support remains where generated framework assumptions expect it.

**Tech Stack:** React 18, Vite 6, Base44 SDK, Three.js, Lucide React, browser Web Speech APIs, GitHub Actions, Node 20.

**Spec:** `docs/superpowers/specs/2026-08-27-evangel-github-organization-design.md`

## Global Constraints

- Preserve the current Home, Drive, Scholar, Study, 3D Faith Space, Journal, Creator, and Voices behavior.
- Preserve the midnight navy, warm gold, luminous ivory, glass-panel EVANGEL visual system.
- Keep `main` as the Base44 synchronized branch.
- Do not commit secrets, `.env` files, Base44 local link pointers, or private user data.
- Do not ingest copyrighted Bible translations without rights.
- Do not claim automotive certification or production-native mobile status.
- Keep Scholar evidence visibly separate from devotional/creative interpretation.
- `npm run lint` and `npm run build` must pass after every structural milestone.

---

### Task 1: Repository documentation and verification surface

**Files:**
- Modify: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `NOTICE.md`
- Create: `docs/architecture/PRODUCT_ARCHITECTURE.md`
- Create: `docs/architecture/SCHOLAR_SOURCE_POLICY.md`
- Create: `docs/architecture/GITHUB_WORKFLOW.md`
- Create: `.github/pull_request_template.md`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: existing Base44 local-development commands and current EVANGEL feature set.
- Produces: contributor-facing repository map and CI contract (`npm run lint`, `npm run build`).

- [ ] **Step 1: Replace the generic Base44 README with an EVANGEL-specific README**

Document purpose, feature map, local development, verification commands, Base44/GitHub sync, source policy, and production gaps.

- [ ] **Step 2: Add contributor and source notices**

Create `CONTRIBUTING.md` with branch/check rules and `NOTICE.md` with source/licensing status.

- [ ] **Step 3: Add architecture docs**

Write product boundaries, Scholar evidence rules, and GitHub/Base44 workflow.

- [ ] **Step 4: Add GitHub CI and pull request template**

Use Node 20 with checkout, setup-node, `npm ci`, `npm run lint`, and `npm run build`.

- [ ] **Step 5: Verify**

Run:

```bash
npm run lint
npm run build
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add README.md CONTRIBUTING.md NOTICE.md docs/architecture .github
git commit -m "docs: organize EVANGEL repository workflow"
```

### Task 2: Extract static product data and navigation

**Files:**
- Create: `src/app/navigation.js`
- Create: `src/data/starterScripture.js`
- Create: `src/data/scholarSources.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces: `NAV_ITEMS`, `STARTER_SCRIPTURE`, `SOURCE_REGISTRY`, `SCHOLAR_RULES`.
- Consumers: later feature components and app shell.

- [ ] **Step 1: Create navigation data**

Export the current route IDs, labels, and icon references from `src/app/navigation.js`.

- [ ] **Step 2: Create Scripture starter data**

Move the current public-domain starter passages into `src/data/starterScripture.js`.

- [ ] **Step 3: Create Scholar source data**

Move source registry and Scholar rules into `src/data/scholarSources.js`.

- [ ] **Step 4: Rewire App imports without behavior change**

`src/App.jsx` must import these constants rather than define them inline.

- [ ] **Step 5: Verify**

Run `npm run lint && npm run build` and expect exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/navigation.js src/data src/App.jsx
git commit -m "refactor: extract EVANGEL navigation and source data"
```

### Task 3: Extract shared browser hooks and services

**Files:**
- Create: `src/hooks/useLocalStorage.js`
- Create: `src/hooks/useSpeechVoices.js`
- Create: `src/hooks/useSpeechRecognition.js`
- Create: `src/services/speech.js`
- Create: `src/services/faithItems.js`
- Modify: `src/App.jsx`

**Interfaces:**
- `useLocalStorage(key, fallback) -> [value, setValue]`
- `useSpeechVoices() -> SpeechSynthesisVoice[]`
- `useSpeechRecognition({ onTranscript }) -> { listening, supported, start }`
- `speakText({ text, voiceName, rate, volume }) -> boolean`
- `toFaithItem(input) -> canonical FaithItem object`

- [ ] **Step 1: Move local-storage behavior into a hook**

Preserve current JSON serialization and fallback behavior.

- [ ] **Step 2: Move voice enumeration into a hook**

Preserve `speechSynthesis.getVoices()` plus `voiceschanged` handling.

- [ ] **Step 3: Move recognition into a hook**

Preserve browser-prefixed recognition support and typed fallback in the UI.

- [ ] **Step 4: Move speech playback into a service**

Preserve current selected-voice behavior.

- [ ] **Step 5: Add canonical FaithItem mapper**

Use stable fields: `id`, `kind`, `title`, `text`, `ref`, `color`, `tags`, `createdAt`, `spatial`.

- [ ] **Step 6: Rewire App and verify**

Run `npm run lint && npm run build` and expect exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/hooks src/services src/App.jsx
git commit -m "refactor: isolate EVANGEL speech and persistence services"
```

### Task 4: Extract feature pages from the monolithic App

**Files:**
- Create: `src/features/home/HomePage.jsx`
- Create: `src/features/drive/DrivePage.jsx`
- Create: `src/features/scholar/ScholarPage.jsx`
- Create: `src/features/study/StudyPage.jsx`
- Create: `src/features/faith-space/FaithSpacePage.jsx`
- Move: `src/components/FaithSpace3D.jsx` -> `src/features/faith-space/FaithSpace3D.jsx`
- Create: `src/features/journal/JournalPage.jsx`
- Create: `src/features/creator/SermonPage.jsx`
- Create: `src/features/voices/VoicesPage.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Each page consumes only the state/actions it needs through props.
- `App.jsx` remains the owner of cross-feature state during this reorganization.
- Faith Space consumes canonical library items and `onSelect(item)`.

- [ ] **Step 1: Extract Home and Drive**

Move their JSX verbatim into focused components with prop interfaces.

- [ ] **Step 2: Extract Scholar and Study**

Move Scholar source rendering and Study/highlighter UI with no copy changes.

- [ ] **Step 3: Extract Faith Space**

Move the Three.js component and wrapper page together under `features/faith-space`.

- [ ] **Step 4: Extract Journal, Creator, and Voices**

Keep existing local-state behavior and callback semantics.

- [ ] **Step 5: Reduce `App.jsx` to composition**

App keeps navigation, cross-feature state, notifications, and page selection; feature markup lives in feature modules.

- [ ] **Step 6: Verify**

Run `npm run lint && npm run build` and expect exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/features src/App.jsx src/components/FaithSpace3D.jsx
git commit -m "refactor: split EVANGEL into product feature modules"
```

### Task 5: Normalize application and style paths

**Files:**
- Create: `src/app/App.jsx`
- Create: `src/styles/evangel.css`
- Modify: `src/main.jsx`
- Remove after migration: `src/App.jsx`
- Remove after migration: `src/index.css`

**Interfaces:**
- `src/main.jsx` imports `src/app/App.jsx` and `src/styles/evangel.css`.
- No user-visible styling change is allowed in this task.

- [ ] **Step 1: Move App composition into `src/app/App.jsx`**

Update relative imports.

- [ ] **Step 2: Move EVANGEL CSS into `src/styles/evangel.css`**

Preserve rules byte-for-byte except import-path adjustments.

- [ ] **Step 3: Update main entrypoint**

Point `src/main.jsx` at the new App and style locations.

- [ ] **Step 4: Remove obsolete root source files**

Delete `src/App.jsx` and `src/index.css` only after successful imports.

- [ ] **Step 5: Verify**

Run `npm run lint && npm run build` and expect exit 0.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "refactor: normalize EVANGEL application structure"
```

### Task 6: Asset and history hygiene

**Files:**
- Modify: `.gitignore`
- Create: `public/assets/evangel/README.md`

**Interfaces:**
- Produces a documented place for optimized runtime assets.
- Historical PDFs, ZIP exports, and original design binaries remain outside normal source history unless deliberately added later.

- [ ] **Step 1: Extend `.gitignore` for local/export artifacts**

Ignore common generated archives, temp exports, local environment files, and OS/editor artifacts without ignoring runtime assets.

- [ ] **Step 2: Document runtime asset policy**

Explain optimized web assets versus archival/source binaries.

- [ ] **Step 3: Audit repository object sizes**

Run:

```bash
find . -type f -not -path './.git/*' -size +25M -print
```

Expected: no ordinary source file unexpectedly exceeds 25 MiB.

- [ ] **Step 4: Verify**

Run `npm run lint && npm run build` and expect exit 0.

- [ ] **Step 5: Commit**

```bash
git add .gitignore public/assets/evangel/README.md
git commit -m "chore: define EVANGEL repository asset policy"
```

### Task 7: Final repository verification

**Files:**
- No new product files expected.

**Interfaces:**
- Verifies all prior tasks as one clean repository.

- [ ] **Step 1: Run full checks**

```bash
npm ci
npm run lint
npm run build
git status --short
```

Expected: install succeeds, lint exits 0, build exits 0, working tree is clean after final commit.

- [ ] **Step 2: Inspect repository map**

```bash
find src docs .github public/assets/evangel -maxdepth 3 -type f | sort
```

Expected: feature modules, architecture docs, CI, and runtime asset policy are discoverable.

- [ ] **Step 3: Verify synchronized branch**

```bash
git branch --show-current
```

Expected: `main`.

- [ ] **Step 4: Final commit if verification generated any tracked change**

Only commit intentional tracked changes. Do not commit build output or local Base44 link files.