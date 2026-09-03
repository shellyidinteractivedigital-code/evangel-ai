import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

test('visible Faith Space cards are real click targets while the overlay still lets canvas drag events through', () => {
  const renderer = read('src/components/FaithSpace.jsx');
  const css = read('src/styles/evangel.css');
  assert.match(renderer, /addEventListener\(["']click["']/);
  assert.match(css, /faith-label-layer[^}]*pointer-events\s*:\s*none/s);
  assert.match(css, /faith-node-card[^}]*pointer-events\s*:\s*auto/s);
});

test('selecting a node does not tear down and recreate the Three scene', () => {
  const renderer = read('src/components/FaithSpace.jsx');
  assert.match(renderer, /onSelectRef/);
  assert.doesNotMatch(renderer, /\[sourceItems,\s*onSelect/);
});

test('Faith Space never substitutes fake sample nodes for an empty filter result', () => {
  const renderer = read('src/components/FaithSpace.jsx');
  const page = read('src/features/faith-space/FaithSpacePage.jsx');
  assert.doesNotMatch(renderer, /SAMPLE_ITEMS/);
  assert.match(page, /No saved items match this view|Your Faith Space is empty/);
});

test('Faith Space labels render user text safely without innerHTML', () => {
  const renderer = read('src/components/FaithSpace.jsx');
  assert.doesNotMatch(renderer, /innerHTML/);
  assert.match(renderer, /textContent/);
});

test('Faith Space merges Base44 FaithItem records with local saved material and preserves item kinds', () => {
  const app = read('src/app/App.jsx');
  assert.match(app, /listMyFaithItems/);
  assert.match(app, /remoteFaithItems/);
  assert.match(app, /item\.kind\s*\|\|\s*['"]journal['"]/);
  assert.match(app, /scripture_ref/);
});

test('Open from Faith Space routes the selected material to a useful EVANGEL workspace', () => {
  const app = read('src/app/App.jsx');
  const page = read('src/features/faith-space/FaithSpacePage.jsx');
  const renderer = read('src/components/FaithSpace.jsx');
  assert.match(app, /openFaithItem/);
  assert.match(app, /navigatePage\(['"]study['"]\)/);
  assert.match(app, /navigatePage\(['"]journal['"]\)/);
  assert.match(app, /navigatePage\(['"]sermon['"]\)/);
  assert.match(page, /onOpenItem/);
  assert.match(renderer, /onOpenItem/);
});

test('remote FaithItem saves can refresh Faith Space without a page reload', () => {
  const app = read('src/app/App.jsx');
  const sermon = read('src/features/creator/SermonPage.jsx');
  assert.match(app, /refreshFaithItems/);
  assert.match(sermon, /onSaved/);
});