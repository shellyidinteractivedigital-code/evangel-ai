# EVANGEL Brand, Story, and White Paper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a coherent EVANGEL identity with an open-Bible road logo, calm dimensional sparkling stars, an upbeat About Us story, and an evidence-centered in-app white paper.

**Architecture:** Use a reusable SVG `EvangelMark` for crisp branding at every size, a reusable CSS `SparklingStars` layer for lightweight ambient depth, and the existing Three.js scene for Faith Space stars. Keep long-form copy in focused content modules and render it through dedicated React pages. Maintain query-parameter navigation and existing functional draggable Faith Space cards.

**Tech Stack:** React 18, Vite 6, Three.js 0.171, CSS animations, inline accessible SVG, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-09-evangel-brand-story-whitepaper-design.md`

## Global Constraints

- Use first-person plural for About Us.
- Do not claim EVANGEL, its creators, or AI speaks for God.
- Do not imply endorsement by concordant.org or another ministry.
- Separate Scripture, source evidence, translation, interpretation, and personal reflection.
- Replace shooting stars with slow, stationary twinkling stars.
- Preserve draggable and actionable Faith Space cards.
- Decorative visuals use `aria-hidden="true"`.
- Respect `prefers-reduced-motion: reduce`.
- Use no em dash or en dash in user-facing copy.
- Mirror every verified release to Base44 and GitHub `main`.

---

### Task 1: Reusable EVANGEL Mark and Sparkling Star Layer

**Files:**
- Create: `src/components/brand/EvangelMark.jsx`
- Create: `src/components/brand/SparklingStars.jsx`
- Create: `tests/brand-identity.test.mjs`
- Modify: `src/styles/evangel.css`

**Interfaces:**
- Produces: `EvangelMark({ compact?: boolean, className?: string })`
- Produces: `SparklingStars({ className?: string, density?: 'soft' | 'rich' })`
- Consumers: App shell, Home page, About page, White Paper page

- [ ] **Step 1: Write the failing brand identity test**

Create `tests/brand-identity.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('EVANGEL mark renders an open Bible becoming a road',()=>{
  const mark=read('src/components/brand/EvangelMark.jsx');
  assert.match(mark,/evangel-book/);
  assert.match(mark,/evangel-road/);
  assert.match(mark,/EVANGEL/);
  assert.match(mark,/aria-label="EVANGEL"/);
});

test('sparkling stars are decorative and reduced-motion safe',()=>{
  const stars=read('src/components/brand/SparklingStars.jsx');
  const css=read('src/styles/evangel.css');
  assert.match(stars,/aria-hidden="true"/);
  assert.match(stars,/sparkling-star/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.sparkling-star/);
});
```

- [ ] **Step 2: Run the brand test and confirm RED**

Run: `node --test tests/brand-identity.test.mjs`

Expected: FAIL because the brand components do not exist.

- [ ] **Step 3: Implement the accessible SVG mark**

Create `EvangelMark.jsx` with an inline `viewBox="0 0 240 96"` SVG. Use two curved page paths with class `evangel-book`, a tapered center path with class `evangel-road`, a horizon glow circle, and text rendered outside the decorative paths as `EVANGEL`. The root link or span receives `aria-label="EVANGEL"`; inner decorative SVG receives `aria-hidden="true"`.

- [ ] **Step 4: Implement deterministic sparkling stars**

Create `SparklingStars.jsx` with a fixed array of 24 coordinate, size, depth, and delay records. Render spans with CSS custom properties `--x`, `--y`, `--size`, `--delay`, and `--depth`. Use no random values so hydration and tests remain stable.

- [ ] **Step 5: Add brand and star CSS**

Add SVG gold gradients, road glow, responsive compact sizing, radial star cores, bloom pseudo-elements, and 4 to 8 second independent opacity and scale cycles. Under reduced motion, set `animation:none` and preserve visible static stars.

- [ ] **Step 6: Run focused tests**

Run: `node --test tests/brand-identity.test.mjs`

Expected: 2 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/brand tests/brand-identity.test.mjs src/styles/evangel.css
git commit -m "feat: add EVANGEL road mark and sparkling stars"
```

### Task 2: Integrate the Brand into Navigation and Home

**Files:**
- Modify: `src/app/App.jsx`
- Modify: `src/features/home/HomePage.jsx`
- Modify: `src/styles/evangel.css`
- Test: `tests/brand-identity.test.mjs`

**Interfaces:**
- Consumes: `EvangelMark`, `SparklingStars`
- Preserves: `navigatePage(pageId)` and existing Home actions

- [ ] **Step 1: Extend the failing test**

Add assertions that `App.jsx` imports `EvangelMark` and uses it in both `brand` and `mobile-brand`, and that `HomePage.jsx` imports `SparklingStars`.

- [ ] **Step 2: Run focused test and confirm RED**

Run: `node --test tests/brand-identity.test.mjs`

Expected: FAIL because the existing shell still uses the ✦ character.

- [ ] **Step 3: Replace shell glyphs**

Import `EvangelMark` in `App.jsx`. Replace the desktop `brand-mark` and mobile ✦ text with compact mark instances. Preserve the existing home navigation click target and keyboard behavior.

- [ ] **Step 4: Replace the home ambient star background**

Import `SparklingStars` in `HomePage.jsx`. Replace `<span className="ambient-stars"/>` with `<SparklingStars density="rich"/>`. Add an `evangel-road-horizon` visual behind the hero copy without covering buttons or daily verse content.

- [ ] **Step 5: Add responsive integration CSS**

Keep the horizontal wordmark readable in the sidebar and use the compact symbol in the mobile header. Ensure art uses `pointer-events:none` and maintains current content stacking.

- [ ] **Step 6: Verify focused behavior**

Run: `node --test tests/brand-identity.test.mjs tests/natural-voice-routing.test.mjs`

Expected: PASS with navigation and voice tests unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/app/App.jsx src/features/home/HomePage.jsx src/styles/evangel.css tests/brand-identity.test.mjs
git commit -m "feat: apply EVANGEL identity to shell and home"
```

### Task 3: Replace Faith Space Shooting Stars

**Files:**
- Modify: `src/components/FaithSpace.jsx`
- Modify: `src/styles/evangel.css`
- Create: `tests/faith-space-stars.test.mjs`

**Interfaces:**
- Preserves: drag, orbit, zoom, pause, reset, open, listen, and delete behavior
- Produces: Three.js star layers that twinkle without linear trails

- [ ] **Step 1: Write the failing Faith Space star test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('Faith Space uses dimensional twinkling stars without shooting trails',()=>{
  const scene=read('src/components/FaithSpace.jsx');
  assert.doesNotMatch(scene,/shootingStars|LineBasicMaterial|velocity|\bvel\b/);
  assert.match(scene,/twinklePhase/);
  assert.match(scene,/starLayers/);
});

test('Faith Space retains navigation and movable saved cards',()=>{
  const scene=read('src/components/FaithSpace.jsx');
  for(const behavior of ['pointerdown','wheel','reset','drag','OrbitControls']){
    assert.match(scene,new RegExp(behavior,'i'));
  }
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test tests/faith-space-stars.test.mjs`

Expected: FAIL because `shootingStars` and line trails remain.

- [ ] **Step 3: Remove shooting-star construction and animation**

Delete the line geometry, velocity records, delays, and travel animation. Keep two point-cloud layers. Give each layer `twinklePhase`, `twinkleSpeed`, and a small Z-axis drift value. Animate material opacity and point scale only, plus very slow rotation.

- [ ] **Step 4: Preserve interaction boundaries**

Do not change label creation, pointer handlers, stored spatial positions, camera orbit, zoom, pause, reset, or saved-item actions.

- [ ] **Step 5: Run Faith Space regression tests**

Run: `node --test tests/faith-space-stars.test.mjs tests/faith-space*.test.mjs`

Expected: all Faith Space tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/FaithSpace.jsx src/styles/evangel.css tests/faith-space-stars.test.mjs
git commit -m "feat: replace shooting stars with calm 3D sparkle"
```

### Task 4: Rewrite About Us

**Files:**
- Modify: `src/features/about/AboutPage.jsx`
- Modify: `src/styles/evangel.css`
- Create: `tests/about-story.test.mjs`

**Interfaces:**
- Consumes: `EvangelMark`, `SparklingStars`
- Produces: public About Us experience at `?page=about`

- [ ] **Step 1: Write the failing About Us test**

Assert the page contains `We created EVANGEL`, `believers and educators`, `Hebrew and Greek`, `does not replace Scripture`, `does not claim to speak for God`, and the six approved section headings.

- [ ] **Step 2: Run test and confirm RED**

Run: `node --test tests/about-story.test.mjs`

Expected: FAIL because the current page lacks the approved upbeat shared story.

- [ ] **Step 3: Implement the approved copy**

Lead with the approved paragraph from the spec. Add concise sections for why EVANGEL was created, Scripture understanding, ancient words, technology in service, connected prayer and creation, and the promise of humility, privacy, and care. Use paragraphs rather than long poetic fragments.

- [ ] **Step 4: Add visual framing**

Place `EvangelMark` and a soft `SparklingStars` layer in the hero. Add the open-road horizon treatment and readable content sections with generous spacing. Avoid decorative box grids where a flowing section works.

- [ ] **Step 5: Run focused tests**

Run: `node --test tests/about-story.test.mjs tests/integrated-core.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/about/AboutPage.jsx src/styles/evangel.css tests/about-story.test.mjs
git commit -m "feat: tell the EVANGEL story with clarity and hope"
```

### Task 5: Create the In-App White Paper

**Files:**
- Create: `src/content/evangelWhitePaper.js`
- Create: `src/features/whitepaper/WhitePaperPage.jsx`
- Modify: `src/styles/evangel.css`
- Create: `tests/whitepaper.test.mjs`

**Interfaces:**
- Produces: `EVANGEL_WHITE_PAPER` with `title`, `summary`, and ordered `sections`
- Produces: `WhitePaperPage({ onNavigate })`

- [ ] **Step 1: Write the failing white-paper test**

Assert the content module exports all 17 chapter IDs; includes Concordant method, Hebrew and Greek, responsibility, privacy, limitations, and source-layer distinctions; and contains no endorsement claim.

- [ ] **Step 2: Run test and confirm RED**

Run: `node --test tests/whitepaper.test.mjs`

Expected: FAIL because the content and page do not exist.

- [ ] **Step 3: Write the evidence-centered white paper**

Create complete prose for every chapter listed in the spec. Describe only implemented behavior. Explain that Concordant is a method of comparing usage and context, not an endorsement. State that lexical possibilities depend on grammar and context. Explain AI limitations and human review.

- [ ] **Step 4: Build the reader page**

Render a title area, executive summary, linked table of contents, semantic `article` sections, source and responsibility callouts, and a return-to-About action. Use `EvangelMark` and `SparklingStars` in the header.

- [ ] **Step 5: Add print and mobile styles**

Use a single readable column, large headings, restrained gold rules, `scroll-margin-top` anchors, and `@media print` rules that remove navigation controls and dark backgrounds while keeping black text on white.

- [ ] **Step 6: Run focused tests**

Run: `node --test tests/whitepaper.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/evangelWhitePaper.js src/features/whitepaper/WhitePaperPage.jsx src/styles/evangel.css tests/whitepaper.test.mjs
git commit -m "feat: add EVANGEL white paper"
```

### Task 6: Route and Link the White Paper

**Files:**
- Modify: `src/app/App.jsx`
- Modify: `src/app/navigation.js`
- Modify: `src/features/about/AboutPage.jsx`
- Test: `tests/whitepaper.test.mjs`
- Test: `tests/integrated-core.test.mjs`

**Interfaces:**
- Consumes: `WhitePaperPage`
- Produces: stable public route `?page=whitepaper`

- [ ] **Step 1: Extend routing tests and confirm RED**

Assert `App.jsx` imports and renders `WhitePaperPage` for `page==='whitepaper'`, About Us links to it, and navigation exposes `White Paper`.

- [ ] **Step 2: Implement routing**

Import `WhitePaperPage` in `App.jsx` and render it with `onNavigate={navigatePage}`. Add a footer link and About Us call-to-action. Add a navigation item only if it fits without crowding; otherwise keep the footer and About links as the two discoverable entry points.

- [ ] **Step 3: Verify URL behavior**

Open `?page=whitepaper`, confirm refresh preserves the page, then navigate to About and Home using visible controls.

- [ ] **Step 4: Run routing tests**

Run: `node --test tests/whitepaper.test.mjs tests/integrated-core.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/App.jsx src/app/navigation.js src/features/about/AboutPage.jsx tests/whitepaper.test.mjs tests/integrated-core.test.mjs
git commit -m "feat: connect public EVANGEL white paper"
```

### Task 7: Full Verification, Visual Review, and Release Sync

**Files:**
- Review all files changed in Tasks 1 through 6
- Update tests only when they assert obsolete implementation details

**Interfaces:**
- Produces: verified Base44 checkpoint and GitHub `main` parity

- [ ] **Step 1: Run the full automated suite**

```bash
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: every command exits 0 with no test failures, lint errors, type errors, build errors, or whitespace errors.

- [ ] **Step 2: Review desktop presentation**

Verify the sidebar mark, mobile mark, Home hero, About Us, White Paper, and Faith Space. Confirm logo legibility, calm star motion, readable content, working buttons, and no visual overlap.

- [ ] **Step 3: Review mobile presentation**

At widths 390 and 430 pixels, verify no horizontal overflow, large readable text, uncluttered stars, usable navigation, and stable Faith Space controls.

- [ ] **Step 4: Review accessibility and fallback behavior**

Enable reduced motion and confirm all star and parallax animation stops. Disable the hero art in developer tools and confirm SVG/CSS fallback remains branded and readable. Keyboard through all links and controls.

- [ ] **Step 5: Verify removed visuals**

Run:

```bash
rg -n "shootingStars|LineBasicMaterial|ambientStars" src
```

Expected: no obsolete shooting-star or old ambient-star animation implementation remains.

- [ ] **Step 6: Create Base44 checkpoint**

Create checkpoint named `Launch EVANGEL road identity and white paper` only after all checks pass.

- [ ] **Step 7: Mirror to GitHub**

Compare every changed Base44 file with GitHub `main`, create or update each exact path, then re-fetch and confirm byte-equivalent content.

- [ ] **Step 8: Report verified evidence**

Report exact test count, lint result, typecheck result, build result, checkpoint name, and GitHub parity. Do not claim success from edits alone.
