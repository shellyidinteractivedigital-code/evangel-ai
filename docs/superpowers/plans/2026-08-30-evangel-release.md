# EVANGEL Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver and verify the EVANGEL Drive Sanctuary, premium shell, voice/sermon/email workflow, ambient visuals, and clean Base44/GitHub release.

**Architecture:** Extend the current React/Vite/Base44 app with small focused helpers and existing state. Keep driving interactions voice-first, use browser TTS/STT progressively, and use Base44 persistence plus mailto handoff without adding client secrets.

**Tech Stack:** React 18, Vite 6, Base44 SDK, Web Speech APIs, Node test runner, ESLint, TypeScript checkJs.

**Spec:** `docs/superpowers/specs/2026-08-30-evangel-release-design.md`

## Global Constraints
- Do not claim EVANGEL speaks for God.
- Drive Mode must remain voice-first and avoid reading-heavy editing.
- No GitHub, OpenAI, Stripe, or email credentials in client code.
- Preserve reduced-motion accessibility.
- Do not weaken existing payment or RLS tests.

---

### Task 1: Clean baseline typecheck
**Files:** `src/components/ui/button.jsx`, `src/components/ui/input.jsx`, `src/components/ui/label.jsx`, `src/components/ui/input-otp.jsx`, `src/components/AuthLayout.jsx`, `src/lib/app-params.js`, `src/vite-env.d.ts`, `tests/typecheck-baseline.test.mjs`
**Interfaces:** Produces a zero-error `npm run typecheck` baseline.
- [ ] Add a regression test that invokes TypeScript and fails on current errors.
- [ ] Run it and observe failure.
- [ ] Add explicit JSDoc/DOM-compatible types and browser storage shim typing.
- [ ] Re-run typecheck regression and full tests.

### Task 2: Premium navigation regression
**Files:** `src/app/App.jsx`, `tests/navigation-shell.test.mjs`
**Interfaces:** App renders CSS-matched `side-nav` and `mobile-nav` classes.
- [ ] Add failing source regression test for class mismatch.
- [ ] Run and observe failure.
- [ ] Correct shell class names.
- [ ] Re-run test.

### Task 3: Drive Sanctuary command model
**Files:** `src/features/drive/driveCommands.js`, `tests/drive-commands.test.mjs`
**Interfaces:** `parseDriveCommand(transcript)` returns `{type, value}` for play, repeat, next, save, ask, sermon, sermon fields, email, and unknown.
- [ ] Write parser behavior tests first.
- [ ] Observe failure.
- [ ] Implement pure parser.
- [ ] Re-run tests.

### Task 4: Spoken Scripture answer helper
**Files:** `src/features/drive/driveAnswers.js`, `tests/drive-answers.test.mjs`
**Interfaces:** `answerDriveQuestion({ question, verse })` returns a short grounded answer and suggested next action.
- [ ] Write grounding and non-divine-authority tests.
- [ ] Observe failure.
- [ ] Implement deterministic response helper.
- [ ] Re-run tests.

### Task 5: Sermon draft and email handoff
**Files:** `src/features/drive/driveSermon.js`, `tests/drive-sermon.test.mjs`
**Interfaces:** `applySermonCommand(sermon, command, verse)` and `buildDriveEmail({verse, answer, sermon})`.
- [ ] Write sermon mutation and mailto tests first.
- [ ] Observe failure.
- [ ] Implement helpers with URL encoding and no credentials.
- [ ] Re-run tests.

### Task 6: Drive UI integration and ambient motion
**Files:** `src/features/drive/DrivePage.jsx`, `src/features/home/HomePage.jsx`, `src/app/App.jsx`, `src/styles/evangel.css`, `tests/drive-ui.test.mjs`, `tests/ambient-motion.test.mjs`
**Interfaces:** DrivePage receives callbacks for ask, sermon, email, repeat and displays answer/draft status; Home/Drive expose ambient layers.
- [ ] Add failing source-level UI tests.
- [ ] Observe failure.
- [ ] Integrate commands and callbacks in App.
- [ ] Add large Drive controls and ambient layers with reduced-motion CSS.
- [ ] Re-run UI/full tests.

### Task 7: Release verification and Git sync
**Files:** no production changes unless verification reveals defects.
**Interfaces:** clean test/build/lint/typecheck/security output; Git branch commit; GitHub synchronization via existing server-side function.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run security:payments`.
- [ ] Commit verified work on release branch.
- [ ] Merge verified release to main.
- [ ] Sync GitHub with the existing authenticated server-side workflow and verify resulting commit.