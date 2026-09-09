# EVANGEL Luminous Covenant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary EVANGEL identity with the deep-blue and covenant-gold Luminous Covenant Celestial Seal across the app.

**Architecture:** Keep one code-native SVG source in `EvangelMark.jsx` and one favicon SVG in `public`. Add two optimized symbolic landscape images for Home and About, then connect them through page components and responsive CSS. Metadata and the manifest reference the same family.

**Tech Stack:** React, SVG, CSS, Vite, Base44 sandbox, built-in ImageGen, Node test runner

**Spec:** `docs/superpowers/specs/2026-09-09-evangel-luminous-covenant-design.md`

## Global Constraints

- Top-left logo field is deep sanctuary blue, never white.
- Seal, Bible, road, guiding star, and EVANGEL lettering use covenant gold and illuminated gold.
- Symbolic landscape imagery only, with no people.
- No shooting stars, random boxes, embedded image text, or distracting motion.
- Preserve accessible labels, responsive crops, readable contrast, and reduced-motion behavior.
- Avoid em and en dashes in new user-facing copy.

---

### Task 1: Celestial Seal component

**Files:**
- Modify: `src/components/brand/EvangelMark.jsx`
- Modify: `src/styles/evangel.css`
- Test: `tests/brand-identity.test.mjs`

**Interfaces:**
- Consumes: `EvangelMark({ compact, className })`
- Produces: shared primary and compact Luminous Covenant SVG variants

- [ ] **Step 1: Write the failing test**

Add assertions that the component contains `evangel-seal-field`, `evangel-guiding-star`, `evangel-book`, and `evangel-road`, and that the CSS top-left lockup uses `#061321`, `#e7b653`, or their variables without a white wordmark color.

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/brand-identity.test.mjs`
Expected: FAIL because the current component has no seal field or guiding star.

- [ ] **Step 3: Implement the mark**

Replace the wide temporary illustration with a circular seal viewBox. Use a unique React `useId()` suffix for SVG gradient IDs. Render the deep-blue circular field, gold rim, single star, dawn glow, open Bible, and centered road. Keep `aria-label="EVANGEL"` on the wrapper and `aria-hidden="true"` on the SVG. For the full variant, render EVANGEL and `THE WORD • THE WAY • THE LIGHT`.

- [ ] **Step 4: Add responsive gold lockup styles**

Style `.side-nav .evangel-wordmark b` and its descriptor in gold tones. Ensure compact mark size is at least 32 pixels and the Home mark scales without clipping.

- [ ] **Step 5: Verify and commit**

Run: `node --test tests/brand-identity.test.mjs && npm run lint && npm run typecheck`
Expected: PASS.
Commit: `feat: add Luminous Covenant Celestial Seal`

### Task 2: Favicon, install icons, and metadata

**Files:**
- Modify: `public/evangel-mark.svg`
- Create: `public/icons/evangel-192.png`
- Create: `public/icons/evangel-512.png`
- Modify: `public/manifest.webmanifest`
- Modify: `index.html`
- Test: `tests/share-metadata.test.mjs`
- Test: `tests/widgets.test.mjs`

**Interfaces:**
- Produces: favicon, PWA icon references, theme color, and social-image reference

- [ ] **Step 1: Write failing metadata assertions**

Require `public/evangel-mark.svg` to contain a deep-blue circle, Bible paths, a road path, and a star. Require manifest icons for 192 and 512 pixels. Require `index.html` to include `og:image` and `twitter:card=summary_large_image`.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/share-metadata.test.mjs tests/widgets.test.mjs`
Expected: FAIL on missing icon and social-image references.

- [ ] **Step 3: Implement assets and metadata**

Recreate the favicon as the simplified Luminous Covenant seal. Rasterize it at 192 and 512 pixels with transparency preserved around the circular seal. Add manifest icon entries with `purpose: "any maskable"`. Set theme color to `#061321`. Add social metadata pointing to `/brand/evangel-social-share.webp`.

- [ ] **Step 4: Verify and commit**

Run: `node --test tests/share-metadata.test.mjs tests/widgets.test.mjs && npm run build`
Expected: PASS.
Commit: `feat: apply EVANGEL seal to app metadata`

### Task 3: Home and About symbolic landscapes

**Files:**
- Create: `public/brand/evangel-home-road.webp`
- Create: `public/brand/evangel-about-road.webp`
- Create: `public/brand/evangel-social-share.webp`
- Modify: `src/features/home/HomePage.jsx`
- Modify: `src/features/about/AboutPage.jsx`
- Modify: `src/styles/evangel.css`
- Test: `tests/brand-identity.test.mjs`

**Interfaces:**
- Produces: responsive symbolic image layers with meaningful or decorative alt text

- [ ] **Step 1: Write failing image-integration tests**

Assert that Home references `/brand/evangel-home-road.webp`, About references `/brand/evangel-about-road.webp`, each page preserves `SparklingStars`, and decorative image layers use `alt=""` and `aria-hidden="true"`.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/brand-identity.test.mjs`
Expected: FAIL because image assets are not referenced.

- [ ] **Step 3: Generate the Home landscape**

Use built-in ImageGen with this exact production prompt:

```text
Use case: stylized-concept
Asset type: responsive EVANGEL website hero
Primary request: a cinematic sacred-modern symbolic landscape where an open Bible in the foreground becomes a gently illuminated golden road leading toward a hopeful dawn horizon
Scene/backdrop: deep sanctuary-blue night transitioning into first light, sparse stationary sparkling stars
Style/medium: premium photorealistic 3D editorial image
Composition/framing: wide landscape, important Bible and road on the right half, generous dark negative space for headline copy on the left
Lighting/mood: reverent, uplifting, calm, dimensional gold light
Color palette: #02060B, #061321, #17384D, #E7B653, #F7DB9A
Constraints: no people, no embedded text, no watermark, no cross scenery, no buildings, no shooting stars, no boxes, no visual clutter
```

Inspect the output. Reject any result with illegible pages, people, embedded letters, extra religious symbols, or a road that does not visually emerge from the Bible.

- [ ] **Step 4: Generate About and social crops**

Use the same visual language. About is quieter, with the Bible at the beginning of the path and more centered negative space. Social share is a 1.91:1 crop with the seal area readable and no generated text.

- [ ] **Step 5: Integrate responsive image layers**

Add image elements or pseudo-background layers behind content. Keep the existing content as the primary reading layer. Add mobile `object-position` rules preserving the Bible and road, plus a dark gradient for text contrast.

- [ ] **Step 6: Verify and commit**

Run: `node --test tests/brand-identity.test.mjs && npm run lint && npm run typecheck && npm run build`
Expected: PASS.
Commit: `feat: add EVANGEL symbolic landscape system`

### Task 4: Whitepaper and global visual consistency

**Files:**
- Modify: `src/features/whitepaper/WhitePaperPage.jsx`
- Modify: `src/styles/evangel.css`
- Test: `tests/whitepaper.test.mjs`
- Test: `tests/faith-space-stars.test.mjs`

**Interfaces:**
- Consumes: `EvangelMark`, `SparklingStars`
- Produces: formal seal treatment and consistent restrained motion

- [ ] **Step 1: Write failing visual consistency assertions**

Require the whitepaper hero to use the full seal variant and require CSS reduced-motion rules for seal sweep, horizon glow, and sparkling stars. Assert shooting-star identifiers remain absent.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/whitepaper.test.mjs tests/faith-space-stars.test.mjs`
Expected: FAIL on the missing Luminous Covenant whitepaper class.

- [ ] **Step 3: Implement formal treatment**

Add `whitepaper-luminous-covenant` to the header, a thin gold rule, deep-blue seal field, and restrained star layer. Keep Hebrew and Greek as selectable text, never raster content.

- [ ] **Step 4: Verify and commit**

Run: `node --test tests/whitepaper.test.mjs tests/faith-space-stars.test.mjs && npm run build`
Expected: PASS.
Commit: `feat: unify EVANGEL whitepaper branding`

### Task 5: Full visual and regression verification

**Files:**
- Modify only if verification reveals a defect

- [ ] **Step 1: Run full automated verification**

Run: `npm test && npm run lint && npm run typecheck && npm run build && git diff --check`
Expected: zero failures and exit code 0.

- [ ] **Step 2: Inspect desktop and mobile**

Verify Home, About, whitepaper, desktop top-left logo, mobile header, favicon, and install icon. Confirm no white top-left logo, no image text artifacts, correct crops, readable controls, and no shooting motion.

- [ ] **Step 3: Create Base44 checkpoint and sync GitHub**

Checkpoint name: `Launch EVANGEL Luminous Covenant identity`.
Sync exact Base44 files to GitHub `main`, then verify byte parity for all changed text files.