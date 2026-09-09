# EVANGEL Free Voice and Interaction Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable Marin and Cedar for every signed-in account and verify every visible link, play control, voice preview, and Ask the Word action.

**Architecture:** Extend the server-side voice guard with an explicit free-voice policy while retaining authentication, allowlists, and quotas. Centralize visible audio request state so API failures never masquerade as successful playback. Add a static route/action contract test and targeted runtime-oriented service tests.

**Tech Stack:** React, Base44 SDK, Base44 backend functions, OpenAI speech and realtime APIs, Node test runner

**Spec:** `docs/superpowers/specs/2026-09-09-evangel-luminous-covenant-design.md`

## Global Constraints

- Marin and Cedar are available to every signed-in account.
- Coral, Shimmer, Onyx, and Echo require active premium voice entitlement.
- Provider keys stay server-side.
- Every request remains authenticated, allowlisted, and rate-limited.
- No voice request may silently substitute a browser voice on the Voice Sanctuary page.
- Every visible link and button must perform its advertised action or return a clear message.

---

### Task 1: Free voice authorization policy

**Files:**
- Modify: `base44/shared/voice/security.js`
- Modify: `base44/functions/voice/synthesize/entry.ts`
- Modify: `base44/functions/voice/realtimeCall/entry.ts`
- Test: `tests/voice-security.test.mjs`
- Test: `tests/voice-api-only.test.mjs`

**Interfaces:**
- Consumes: `guardPremiumVoiceRequest({ base44, user, kind, units, requestLimit, unitLimit, voice })`
- Produces: authorization decision for free or premium voice plus quota enforcement

- [ ] **Step 1: Write failing policy tests**

Assert `FREE_VOICES = new Set(['marin','cedar'])` exists server-side. Assert both endpoints pass `voice` into the guard. Assert the guard bypasses entitlement only when `FREE_VOICES.has(voice)`, while still reaching `VoiceUsageWindow`.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/voice-security.test.mjs tests/voice-api-only.test.mjs`
Expected: FAIL because the current guard requires entitlement for all six voices.

- [ ] **Step 3: Implement minimal policy**

Add `voice` to the guard contract. For Marin and Cedar, skip only the entitlement lookup. Do not skip authentication or usage quotas. Use conservative free limits of 12 synthesis requests and 12,000 characters per hour, and 3 realtime sessions per hour. Keep existing premium limits for the other voices.

- [ ] **Step 4: Verify and commit**

Run: `node --test tests/voice-security.test.mjs tests/voice-api-only.test.mjs`
Expected: PASS.
Commit: `feat: enable Marin and Cedar for signed-in users`

### Task 2: Voice page access and error states

**Files:**
- Modify: `src/services/premiumVoice.js`
- Modify: `src/features/voices/VoicesPage.jsx`
- Modify: `src/hooks/useAskTheWord.js`
- Test: `tests/voice-api-only.test.mjs`
- Test: `tests/natural-voice-routing.test.mjs`

**Interfaces:**
- Produces: `playPremiumSpeech({ text, voice, allowDeviceFallback }) -> Promise<{premium:boolean,audio?:HTMLAudioElement,error?:Error}>`
- Produces visible `previewing`, `listening`, and `voiceError` states

- [ ] **Step 1: Write failing UI assertions**

Require Marin and Cedar cards to display `Included for every account`. Require the other four to display `Premium`. Require preview buttons to await `playPremiumSpeech`, disable while loading, and show explicit subscription, configuration, provider, and rate-limit messages.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/voice-api-only.test.mjs tests/natural-voice-routing.test.mjs`
Expected: FAIL on missing access labels.

- [ ] **Step 3: Implement UI and service behavior**

Add `access: 'included'` to Marin and Cedar and `access: 'premium'` to the other entries. Preserve exact API voice keys. Keep `allowDeviceFallback=false` on previews. Surface normalized backend errors and never mark a preview successful until audio playback begins.

- [ ] **Step 4: Verify and commit**

Run: `node --test tests/voice-api-only.test.mjs tests/natural-voice-routing.test.mjs && npm run typecheck`
Expected: PASS.
Commit: `fix: make EVANGEL voice access and errors explicit`

### Task 3: Link and action contract audit

**Files:**
- Create: `tests/interaction-contract.test.mjs`
- Modify: `src/app/App.jsx`
- Modify only affected page components identified by the test

**Interfaces:**
- Consumes: `NAV_ITEMS`, page route conditions, page callbacks
- Produces: verified route coverage and non-placeholder interactions

- [ ] **Step 1: Write the failing contract test**

Parse route identifiers from `src/app/navigation.js` and assert each has a corresponding `page==='id'` render path in `App.jsx`. Assert footer destinations `about`, `whitepaper`, `privacy`, `terms`, `refunds`, `cancellation`, and `support` are rendered. Scan clickable JSX for empty handlers, `href="#"`, and `javascript:` URLs.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/interaction-contract.test.mjs`
Expected: FAIL on any uncovered or placeholder action; if the static route contract is already complete, add the first observed broken control from the live audit as the red case.

- [ ] **Step 3: Repair only proven failures**

Wire each failing control to `navigatePage`, its existing action callback, or an explicit disabled state with explanatory copy. Do not add new destinations beyond the approved app pages.

- [ ] **Step 4: Verify and commit**

Run: `node --test tests/interaction-contract.test.mjs`
Expected: PASS.
Commit: `fix: complete EVANGEL link and action contracts`

### Task 4: Playback route audit

**Files:**
- Modify: `src/services/evangelVoice.js`
- Modify affected Play or Listen consumers
- Test: `tests/playback-controls.test.mjs`

**Interfaces:**
- Consumes: `speakEvangel({ text, premiumVoice, fallbackVoiceName })`
- Produces: consistent selected-voice playback with actionable failure feedback

- [ ] **Step 1: Write failing playback assertions**

Require Home, Drive, Journal, Creator, Library, Faith Space, and EVANGEL Bot playback to pass `premiumVoice`. Require the Voice Sanctuary to call the API-only preview. Require empty text to return an explicit non-playing result.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/playback-controls.test.mjs`
Expected: FAIL on any control that bypasses the central service.

- [ ] **Step 3: Repair the proven playback paths**

Route every affected control through `speakEvangel` or API-only `playPremiumSpeech`. Add user-visible notification callbacks where playback can fail. Do not expose keys or raw provider error bodies.

- [ ] **Step 4: Verify and commit**

Run: `node --test tests/playback-controls.test.mjs tests/natural-voice-routing.test.mjs tests/voice-api-only.test.mjs`
Expected: PASS.
Commit: `fix: connect every EVANGEL playback control`

### Task 5: End-to-end verification and release

**Files:**
- Modify only if verification reveals a defect

- [ ] **Step 1: Run full verification**

Run: `npm test && npm run lint && npm run typecheck && npm run build && git diff --check`
Expected: zero failures and exit code 0.

- [ ] **Step 2: Verify live signed-in behavior**

With a normal signed-in account, preview Marin and Cedar and confirm real API audio. Confirm Coral, Shimmer, Onyx, and Echo show premium access when entitlement is absent. Test Ask the Word with Marin and Cedar. Click every navigation, footer, Home CTA, About CTA, whitepaper action, and playback surface.

- [ ] **Step 3: Diagnose configuration failures without fallback**

If the UI reports configuration failure, verify `OPENAI_API_KEY` exists in Base44 secrets without printing it. If it reports provider failure, inspect `voice/synthesize` and `voice/realtimeCall` error logs. If it reports subscription failure for Marin or Cedar, treat it as a policy regression.

- [ ] **Step 4: Create checkpoint and sync**

Checkpoint name: `Enable free Marin and Cedar and verify all interactions`.
Sync Base44 changes to GitHub `main`, then verify byte parity for every changed text file.