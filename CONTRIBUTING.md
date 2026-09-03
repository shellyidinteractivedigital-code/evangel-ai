# Contributing to EVANGEL

## Branching

- Keep `main` stable and Base44-synchronizable.
- Create a focused branch for structural or feature work.
- Prefer small commits that leave the app buildable.

## Required checks

Run before opening or merging a pull request:

```bash
npm run lint
npm run build
```

## Product guardrails

- Preserve the distinction between source evidence and interpretation.
- Do not present generated spiritual guidance as direct divine instruction.
- Do not claim automotive certification or native mobile readiness unless formally achieved.
- Do not add copyrighted Scripture or scholarly data without verified rights.
- Do not commit secrets, `.env` files, credentials, private user data, or Base44 local-link files.
- Keep Drive Mode low-distraction and voice-first.

## Code organization

Organize code by EVANGEL product responsibility: Home, Scholar, Drive, Study, Faith Space, Journal, Creator, Voices, and shared services. Avoid putting unrelated product flows back into one monolithic component.

## Assets

Only commit optimized assets actually needed by the application or repository documentation. Use GitHub Releases or an external document store for historical bundles and large generated archives. Use Git LFS only when a large binary truly needs source-version tracking.