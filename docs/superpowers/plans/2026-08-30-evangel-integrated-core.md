# EVANGEL Integrated Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make EVANGEL a connected Scripture workspace with About, Notes/Saved Library, persistent sermons, Bible Groups, supervised family profiles, universal save/share, and source-transparent Truth Mode.

**Architecture:** Use Base44 entities as the canonical backend. `FaithItem` is the shared record for verses, notes, journals, prayers, studies, sermons, highlights, and word studies. Groups, child profiles, and share links use separate secured entities. Frontend pages consume the same services so web, mobile shells, and widgets can share one backend.

**Tech Stack:** React 18, Base44 SDK/entities/functions, Vite, Node tests.

**Spec:** `docs/superpowers/specs/2026-08-30-evangel-integrated-experience-design.md`

## Global Constraints
- Preserve evidence vs interpretation boundaries in Scholar.
- Keep child external sharing disabled by default.
- Keep journals/prayers private by default.
- Do not store raw card data, EIN, SSN, or raw child voice recordings.
- All saved sermons must become FaithItem records.
- Share links must be server-created and revocable.
- Existing test, payment-security, lint, and build commands must remain green.

---

### Task 1: Canonical FaithItem persistence
- Create `src/services/faithData.js` with list/create/update helpers.
- Replace sermon local-only save with FaithItem persistence.
- Expose Notes & Saved page using FaithItem records.
- Test: `tests/integrated-core.test.mjs`.

### Task 2: About EVANGEL
- Create `src/features/about/AboutPage.jsx` with the approved positioning: Scripture first, evidence separated from interpretation, AI as tool not authority, memory/continuity as differentiator.
- Add navigation/footer entry.

### Task 3: Universal share
- Create `src/services/share.js` and `src/components/FaithActions.jsx`.
- Use Web Share API when available, copy-link fallback otherwise.
- Create server function for ShareLink creation and public shared-item resolution.
- Add Save, Note, Highlight, Share controls to Scripture/study/saved items where meaningful.

### Task 4: Bible Groups
- Use FaithGroup with owner/member access.
- Add group creation/join-by-code UI.
- Allow group-visible FaithItems and copyable invite links.
- Keep My Highlights visually distinct from group highlights.

### Task 5: Young Explorer / Family
- Use ChildProfile secured to parent.
- Add age bands: young_explorer, growing_reader, teen_study.
- Mic, saved voice notes, and external sharing default off.
- Child-facing interface uses Read, Ask, Pray, Remember, My Bible World.

### Task 6: Truth Mode
- Add `src/features/truth/TruthModePanel.jsx` and `src/services/truthMode.js`.
- Label content as Scripture Text, Source Data, Translation, Interpretation, or User Reflection.
- Scholar claims must retain source status and licensing notes.
- AI-generated interpretation must never be visually presented as original-language fact.

### Task 7: Verification
Run `npm test && npm run security:payments && npm run lint && npm run build` and create a Base44 checkpoint.