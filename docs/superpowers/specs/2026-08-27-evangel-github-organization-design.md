# EVANGEL GitHub Organization Design

**Date:** 2026-08-27

## Purpose

Organize the existing working EVANGEL Base44 React/Vite application into a GitHub-ready repository that is easy to understand, test, extend, and synchronize with Base44 without changing the product's current behavior.

The repository must preserve the product architecture already established in the EVANGEL materials: EVANGEL Scholar is the evidence path, the Spatial Studio is the user-work path, the 3D Faith Space is the organizing hub, Drive Mode is intentionally reduced and voice-first, and creative/devotional output remains visibly separate from textual or lexical evidence.

## Product boundaries

The source tree will follow the actual EVANGEL experience:

- **Home**: public/app entry and connected journey.
- **Scholar**: Greek/Hebrew source registry, evidence versus interpretation, translation and lexical study entry points.
- **Drive**: voice-first, low-distraction Scripture flow.
- **Study**: Scripture search, highlighting, saved study material.
- **Faith Space**: 3D visualization of canonical saved items.
- **Journal**: user reflections and saved moments.
- **Creator**: sermon structure and future devotional/comic/meme tools.
- **Voices**: browser/device voice discovery and selection.
- **Shared services**: speech, local persistence, notifications, canonical item mapping.

## Repository structure

```text
/
├── .github/
│   ├── workflows/ci.yml
│   └── pull_request_template.md
├── base44/
│   └── config.jsonc
├── docs/
│   ├── architecture/
│   │   ├── PRODUCT_ARCHITECTURE.md
│   │   ├── SCHOLAR_SOURCE_POLICY.md
│   │   └── GITHUB_WORKFLOW.md
│   └── superpowers/
│       ├── specs/
│       └── plans/
├── public/
│   └── assets/
│       └── evangel/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── navigation.js
│   ├── data/
│   │   ├── scholarSources.js
│   │   └── starterScripture.js
│   ├── features/
│   │   ├── creator/SermonPage.jsx
│   │   ├── drive/DrivePage.jsx
│   │   ├── faith-space/FaithSpace3D.jsx
│   │   ├── faith-space/FaithSpacePage.jsx
│   │   ├── home/HomePage.jsx
│   │   ├── journal/JournalPage.jsx
│   │   ├── scholar/ScholarPage.jsx
│   │   ├── study/StudyPage.jsx
│   │   └── voices/VoicesPage.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useSpeechRecognition.js
│   │   └── useSpeechVoices.js
│   ├── services/
│   │   ├── faithItems.js
│   │   └── speech.js
│   ├── styles/
│   │   └── evangel.css
│   └── main.jsx
├── .gitignore
├── CONTRIBUTING.md
├── NOTICE.md
├── README.md
├── package.json
└── vite.config.js
```

Existing Base44-generated authentication and UI support files remain in place unless a later task proves they can be safely moved without breaking framework assumptions.

## Canonical FaithItem boundary

The 3D Faith Space, Journal, Study, highlights, saved Scripture, and future creator tools should not each invent incompatible records. The repository will expose a small canonical mapping function for client-side items:

```js
export function toFaithItem({ id, kind, title, text, ref, color, tags = [], createdAt, spatial = null }) {
  return {
    id,
    kind,
    title,
    text,
    ref,
    color,
    tags,
    createdAt,
    spatial,
  };
}
```

This first reorganization does not migrate storage to a production backend. It keeps the existing local-storage behavior while isolating persistence so a Base44 entity or encrypted cloud-sync implementation can replace it later.

## Scholar source policy

The repository will keep source status explicit:

- World English Bible: public-domain English base text for bundled prototype reading.
- Open Scriptures Hebrew Bible: Hebrew text/morphology subject to its attribution terms.
- SBL Greek New Testament: Greek New Testament subject to its attribution terms.
- MorphGNT: Greek morphology/lemmas subject to its attribution/share-alike terms.
- STEP Bible/Tyndale House: reference/cross-check source, with source-specific licensing respected.
- Concordant Literal Version: link/reference-only until separate permission allows bundled use.

No source will be labeled as installed merely because it appears in the registry.

## Asset policy

GitHub should contain application assets required to build the app, but not act as an archive for every historical PDF, ZIP, generated mockup, or export.

- Keep optimized, app-used images under `public/assets/evangel/`.
- Keep source documents as Markdown summaries under `docs/` where practical.
- Keep large original design files, old ZIP builds, and publishable document bundles outside normal Git history or in GitHub Releases.
- Use Git LFS only when a binary must be versioned with the project and cannot reasonably be optimized below ordinary Git limits.
- Never commit secrets, `.env` files, provider keys, Base44 local link pointers, or private user data.

## GitHub workflow

The connected Base44 repository synchronizes automatically. The branch synchronized back into Base44 must remain `main`.

Development workflow:

1. Work on a feature branch when GitHub collaboration is used.
2. Run `npm run lint` and `npm run build` before merge.
3. CI repeats lint and build on pull requests and `main` pushes.
4. Merge into `main` only after checks pass.
5. Base44 receives the merged `main` changes through two-way sync.
6. Publishing remains a separate explicit action from the Base44 dashboard.

## CI design

GitHub Actions will use Node 20 and run:

```bash
npm ci
npm run lint
npm run build
```

No deploy step will be placed in GitHub Actions because Base44 is the application deployment surface and its documentation warns against bypassing synchronized state.

## Documentation

The root README will become EVANGEL-specific and include:

- product purpose;
- current feature map;
- product guardrails;
- local Base44 development steps;
- GitHub/Base44 synchronization rules;
- verification commands;
- source/licensing notice link;
- current production gaps.

`NOTICE.md` will document third-party Scripture/source status without selecting an open-source license for EVANGEL itself.

## Non-goals for this reorganization

- No claim of automotive certification.
- No native iOS or Android rewrite.
- No billing implementation.
- No production cloud sync.
- No ingestion of copyrighted Bible translations without rights.
- No change to the current theological or scholarly guardrails.
- No visual redesign beyond moving existing code into clearer units.

## Acceptance criteria

The reorganization is complete when:

1. `npm run lint` passes.
2. `npm run build` passes.
3. EVANGEL retains the current Home, Drive, Scholar, Study, 3D Faith Space, Journal, Creator, and Voices flows.
4. `src/App.jsx` is reduced to application composition/navigation rather than containing every feature implementation.
5. GitHub CI runs lint and build.
6. README and architecture docs explain the repository without requiring prior chat context.
7. No secrets or historical binary archives are introduced into ordinary Git history.
8. The branch remains `main` and is ready for Base44 two-way synchronization.