# EVANGEL Base44 Generators and Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add modular prayer, sermon, and concordant Scripture-study generators plus a contextual EVANGEL bot to the existing `Evangelai.ai` Base44 app, then synchronize verified source to `shellyidinteractivedigital-code/evangelai-ai`.

**Architecture:** Extend the existing React, Vite, and Base44 application rather than importing the older FastAPI ZIP. Base44 entities store private user content and immutable versions, Base44 backend functions retrieve evidence and generate structured content, and one shared assistant shell appears on every page. Existing Scripture corpora and the single Base44 SDK client remain authoritative.

**Tech Stack:** React 18, Vite 6, Base44 SDK, Base44 entities and Deno functions, Zod, Node test runner, ESLint, SBLGNT, OSHB/WLC, World English Bible.

**Spec:** `docs/superpowers/specs/2026-09-02-evangel-generators-design.md`

## Global Constraints

- Preserve the live `Evangelai.ai` Base44 app as the source of truth.
- Do not overwrite the live app with the older Python ZIP.
- Scripture quotations must come from installed corpora or licensed providers.
- Original-language claims must be traceable to installed, versioned evidence.
- Text-Centered mode is the default; traditions are labeled perspectives.
- Generated content must never be presented as Scripture or as God speaking.
- Private notes are attached to the bot only by explicit user action.
- Every mutation requires the current user and respects entity RLS.
- GitHub target is `shellyidinteractivedigital-code/evangelai-ai`, branch `main`.
- Required verification is `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.

---

### Task 1: Preserve Current Base44 State and Add Design Documents

**Files:**
- Create: `docs/superpowers/specs/2026-09-02-evangel-generators-design.md`
- Create: `docs/superpowers/plans/2026-09-02-evangel-base44-generators-plan.md`

**Interfaces:**
- Consumes: Base44 app ID `6a909e3367998a3c5c5d1783`.
- Produces: A named Base44 checkpoint and committed design documents.

- [ ] **Step 1: Create a pre-generator checkpoint**

Create checkpoint `Before prayer sermon scripture generators` for app `6a909e3367998a3c5c5d1783`.

- [ ] **Step 2: Add the approved specification and this plan**

Write both Markdown files without modifying existing architecture documents.

- [ ] **Step 3: Verify documents contain no placeholders**

Run: `rg -n "T[B]D|T[O]DO|PLACEHOLD[E]R" docs/superpowers`

Expected: no matches in the two new files.

- [ ] **Step 4: Create a documentation checkpoint**

Create checkpoint `Generator design and implementation plan`.

---

### Task 2: Add Folder and Immutable Version Entities

**Files:**
- Create: `base44/entities/FaithFolder.jsonc`
- Create: `base44/entities/FaithItemVersion.jsonc`
- Modify: `base44/entities/FaithItem.jsonc`
- Create: `tests/generator-storage.test.mjs`

**Interfaces:**
- Consumes: Current-user ownership convention in `FaithItem`.
- Produces: `FaithFolder`, `FaithItemVersion`, and optional `folder_id`, `current_version_id`, `generator_type`, and `generator_settings` fields on `FaithItem`.

- [ ] **Step 1: Write the failing schema test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (name) => JSON.parse(fs.readFileSync(`base44/entities/${name}.jsonc`, 'utf8'));

test('generator storage is private, foldered, and versioned', () => {
  const folder = read('FaithFolder');
  const version = read('FaithItemVersion');
  const item = read('FaithItem');
  assert.equal(folder.rls.read['data.owner_user_id'], '{{user.id}}');
  assert.equal(version.rls.read['data.owner_user_id'], '{{user.id}}');
  assert.equal(item.properties.folder_id.type, 'string');
  assert.equal(item.properties.current_version_id.type, 'string');
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/generator-storage.test.mjs`

Expected: FAIL because `FaithFolder.jsonc` does not exist.

- [ ] **Step 3: Add minimal private schemas**

Define `FaithFolder` with `owner_user_id`, `parent_folder_id`, `name`, `position`, `created_at`, and `updated_at`. Define `FaithItemVersion` with `owner_user_id`, `faith_item_id`, `version_number`, `content`, `settings`, `sources`, `warnings`, and `created_at`. Apply create, read, update, and delete RLS using `data.owner_user_id: {{user.id}}`.

- [ ] **Step 4: Extend FaithItem without removing existing fields or RLS**

Add optional `folder_id`, `current_version_id`, `generator_type`, `generator_settings`, and `source_snapshot` properties.

- [ ] **Step 5: Run tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 6: Checkpoint**

Create checkpoint `Private folders and generator versions`.

---

### Task 3: Add Verified Research Bundle Service

**Files:**
- Create: `src/features/generators/researchBundle.js`
- Modify: `src/services/scripture.js`
- Create: `tests/research-bundle.test.mjs`

**Interfaces:**
- Consumes: `loadScriptureSource(sourceKey)` and installed corpus metadata from `BIBLE_SOURCES`.
- Produces: `buildResearchBundle({ reference, sourceKey, languageRecords })` returning `{ passage, source, words, warnings }`.

- [ ] **Step 1: Write a failing evidence-boundary test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildResearchBundle } from '../src/features/generators/researchBundle.js';

test('research bundle never invents unavailable word data', () => {
  const result = buildResearchBundle({
    reference: 'John 1:1',
    passage: { ref: 'John 1:1', text: 'In the beginning was the Word.' },
    source: { key: 'web', displayName: 'World English Bible', rights: 'Public domain' },
    languageRecords: [],
  });
  assert.deepEqual(result.words, []);
  assert.match(result.warnings.join(' '), /original-language evidence/i);
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/research-bundle.test.mjs`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement a pure research-bundle builder**

```js
export function buildResearchBundle({ reference, passage, source, languageRecords = [] }) {
  if (!passage?.ref || !passage?.text || !source?.key) throw new Error('verified_passage_required');
  return {
    reference,
    passage: { ref: passage.ref, text: passage.text },
    source: { key: source.key, displayName: source.displayName, rights: source.rights },
    words: languageRecords.filter((word) => word?.lemma && word?.evidenceSource),
    warnings: languageRecords.length ? [] : ['No verified original-language evidence is attached.'],
  };
}
```

- [ ] **Step 4: Run focused and complete tests**

Run: `node --test tests/research-bundle.test.mjs && npm test`

Expected: all tests pass.

- [ ] **Step 5: Checkpoint**

Create checkpoint `Verified generator research bundles`.

---

### Task 4: Add Structured Generator Backend Function

**Files:**
- Create: `base44/functions/generateFaithContent/function.jsonc`
- Create: `base44/functions/generateFaithContent/entry.ts`
- Create: `src/features/generators/generatorClient.js`
- Create: `tests/generator-contract.test.mjs`

**Interfaces:**
- Consumes: `{ type, interview, researchBundle, sourceNotes }` and `base44.integrations.Core.InvokeLLM`.
- Produces: `{ type, title, sections, citations, warnings, disclosure }`.

- [ ] **Step 1: Write a failing contract test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('generator requires evidence and labels generated content', () => {
  const source = fs.readFileSync('base44/functions/generateFaithContent/entry.ts', 'utf8');
  assert.match(source, /verified_passage_required/);
  assert.match(source, /Generated by EVANGEL/);
  assert.match(source, /InvokeLLM/);
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/generator-contract.test.mjs`

Expected: FAIL because the function does not exist.

- [ ] **Step 3: Implement authentication and input validation**

Use `createClientFromRequest(req)`, require `await base44.auth.me()`, accept only `prayer`, `sermon`, or `scripture_study`, and reject requests without `researchBundle.passage`.

- [ ] **Step 4: Invoke structured generation**

Call `base44.integrations.Core.InvokeLLM({ prompt, response_json_schema })`. The schema requires `title`, `sections`, `citations`, `warnings`, and `disclosure`. The prompt forbids new Scripture quotations or original-language facts outside the research bundle.

- [ ] **Step 5: Validate returned citations**

Reject citations not present in `researchBundle.passage.ref` or the attached word records. Append `Generated by EVANGEL. Verify interpretation with trusted teachers and source material.`

- [ ] **Step 6: Add the frontend client**

```js
import { base44 } from '../../api/base44Client';

export async function generateFaithContent(input) {
  const result = await base44.functions.invoke('generateFaithContent', input);
  return result?.data || result;
}
```

- [ ] **Step 7: Run tests, lint, and typecheck**

Run: `npm test && npm run lint && npm run typecheck`

Expected: all commands exit 0.

- [ ] **Step 8: Checkpoint**

Create checkpoint `Evidence-bound faith generators`.

---

### Task 5: Upgrade Creator and Connect Notes to Sermons

**Files:**
- Modify: `src/features/create/CreatePage.jsx`
- Modify: `src/features/creator/SermonPage.jsx`
- Modify: `src/features/notes/NotesPage.jsx`
- Modify: `src/components/ConvertNoteActions.jsx`
- Create: `src/features/generators/GeneratorInterview.jsx`
- Create: `src/features/generators/GeneratedResult.jsx`
- Create: `tests/creator-generator-flow.test.mjs`

**Interfaces:**
- Consumes: `generateFaithContent(input)`, `saveFaithItem(item)`, research bundles, and selected note IDs.
- Produces: guided prayer, sermon, and study generation with save and restyle actions.

- [ ] **Step 1: Write the failing UI wiring test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('creator supports guided sermon controls and note sources', () => {
  const creator = fs.readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  const notes = fs.readFileSync('src/components/ConvertNoteActions.jsx', 'utf8');
  assert.match(creator, /GeneratorInterview/);
  assert.match(creator, /speakingMinutes/);
  assert.match(creator, /theologicalMode/);
  assert.match(notes, /source_item_id/);
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/creator-generator-flow.test.mjs`

Expected: FAIL because the new guided controls are absent.

- [ ] **Step 3: Add the reusable interview component**

Fields are passage or topic, audience, speaking minutes, style, theological mode, structure, emotional direction, optional story, and closing choice. Defaults are `general`, `20`, `pastoral`, `text_centered`, `three_point`, `hope`, and `closing_prayer`.

- [ ] **Step 4: Connect notes without losing source text**

`ConvertNoteActions` navigates to Creator with `source_item_id`, title, and text. Creator displays the attached note and offers a remove button before generation.

- [ ] **Step 5: Add restyling as a new version**

Restyle requests include the prior generated result and a bounded instruction. Saving creates a `FaithItemVersion`, then updates only the parent `FaithItem.current_version_id`.

- [ ] **Step 6: Run tests and build**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Expected: all commands exit 0.

- [ ] **Step 7: Checkpoint**

Create checkpoint `Guided Creator and note to sermon`.

---

### Task 6: Add Persistent Contextual EVANGEL Bot

**Files:**
- Create: `src/features/assistant/EvangelBot.jsx`
- Create: `src/features/assistant/assistantContext.js`
- Create: `src/features/assistant/assistantActions.js`
- Modify: `src/app/App.jsx`
- Modify: `src/styles/evangel.css`
- Create: `tests/evangel-bot.test.mjs`

**Interfaces:**
- Consumes: `{ page, selectedItem, passage, generatorStep, driveMode }`.
- Produces: a persistent bot shell with explicit attachments and confirmed mutations.

- [ ] **Step 1: Write the failing shell test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('EVANGEL bot is mounted once around all pages', () => {
  const app = fs.readFileSync('src/app/App.jsx', 'utf8');
  const bot = fs.readFileSync('src/features/assistant/EvangelBot.jsx', 'utf8');
  assert.match(app, /<EvangelBot/);
  assert.match(bot, /Remove from context/);
  assert.match(bot, /Confirm/);
  assert.match(bot, /driveMode/);
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/evangel-bot.test.mjs`

Expected: FAIL because `EvangelBot.jsx` does not exist.

- [ ] **Step 3: Implement minimal context envelopes**

```js
export function buildAssistantContext({ page, passage, selectedItem, generatorStep }) {
  return {
    page,
    passageRef: passage?.ref || '',
    selectedItemId: selectedItem?.id || '',
    selectedExcerpt: selectedItem?.attached ? selectedItem.text.slice(0, 6000) : '',
    generatorStep: generatorStep || '',
  };
}
```

- [ ] **Step 4: Mount one responsive bot shell**

Mount `EvangelBot` after the page content in `App.jsx`. Render a collapsible side panel above 900px and a bottom sheet below 900px. Do not mount it on the unauthenticated shared-item surface.

- [ ] **Step 5: Gate mutations**

Read-only actions execute immediately. Save, move, export, share, overwrite, and delete actions enter a confirmation state and execute only after the user presses Confirm.

- [ ] **Step 6: Enforce Drive Mode**

When `driveMode` is true, hide reading-heavy history and expose only listen, stop, next, save, and return controls.

- [ ] **Step 7: Run all verification**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Expected: all commands exit 0.

- [ ] **Step 8: Checkpoint**

Create checkpoint `EVANGEL bot on every app page`.

---

### Task 7: Add Folder Management and Exports

**Files:**
- Create: `src/features/library/FolderTree.jsx`
- Create: `src/services/faithFolders.js`
- Modify: `src/features/library/LibraryPage.jsx`
- Modify: `src/services/faithLibrary.js`
- Create: `tests/folder-library.test.mjs`

**Interfaces:**
- Consumes: `FaithFolder`, `FaithItem`, and `FaithItemVersion` entities.
- Produces: nested private folders, item moves, search filters, and Markdown or print exports.

- [ ] **Step 1: Write failing folder tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_FOLDERS, moveFaithItem } from '../src/services/faithFolders.js';

test('default folders are stable and moves require confirmation', async () => {
  assert.deepEqual(DEFAULT_FOLDERS, ['Sermons', 'Prayers', 'Scripture Studies', 'Series', 'Drafts', 'Favorites']);
  await assert.rejects(() => moveFaithItem('item-1', 'folder-1', { confirmed: false }), /confirmation_required/);
});
```

- [ ] **Step 2: Implement Base44 folder service**

Use `base44.entities.FaithFolder.list/create/update/delete` and `base44.entities.FaithItem.update`. Do not use service-role access in the browser.

- [ ] **Step 3: Add accessible nested folder UI**

Render folders as buttons with `aria-expanded`, visible item counts, create, rename, move, and archive actions. Deletion is unavailable while a folder contains items.

- [ ] **Step 4: Add exports**

Create Markdown with title, translation attribution, source citations, generated-content disclosure, body, and version metadata. Print uses the same normalized export model.

- [ ] **Step 5: Run verification**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Expected: all commands exit 0.

- [ ] **Step 6: Checkpoint**

Create checkpoint `Organized generator library and exports`.

---

### Task 8: Final Verification and GitHub Synchronization

**Files:**
- Modify only files already reviewed in Tasks 1 through 7.

**Interfaces:**
- Consumes: verified Base44 source tree and active GitHub connector for `shellyidinteractivedigital-code`.
- Produces: Base44 checkpoint and synchronized `main` branch in `shellyidinteractivedigital-code/evangelai-ai`.

- [ ] **Step 1: Run the complete verification suite**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Expected: all commands exit 0 with no ignored failure.

- [ ] **Step 2: Review repository payload**

Exclude `.env*`, secrets, build output, `node_modules`, historical ZIPs, duplicate PDFs and DOCX files, and raw archives. Include source, schemas, functions, tests, public runtime corpora, documentation, and GitHub workflows.

- [ ] **Step 3: Confirm repository existence and default branch**

Target exactly `shellyidinteractivedigital-code/evangelai-ai`, branch `main`. If the repository does not exist, stop and create it as private through the authenticated GitHub account before synchronization.

- [ ] **Step 4: Synchronize in batches**

Use the existing `syncGitHubBuild` function with at most 100 files and 10 MiB per file. Use commit message `feat: add EVANGEL faith generators and contextual bot`. Preserve existing Git history by building each tree on the current `main` tree.

- [ ] **Step 5: Verify the returned commit**

Confirm the response reports `ok: true`, branch `main`, the expected file count, and a commit URL under `https://github.com/shellyidinteractivedigital-code/evangelai-ai/commit/`.

- [ ] **Step 6: Create final Base44 checkpoint**

Create checkpoint `Verified generators bot and GitHub sync`.

- [ ] **Step 7: Report deployment boundary**

Report Base44 sandbox verification and Git commit separately. Do not claim public Base44 publication unless the app is explicitly published and its live status is verified.