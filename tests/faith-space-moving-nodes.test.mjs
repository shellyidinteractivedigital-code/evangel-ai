import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const renderer = () => fs.readFileSync('src/components/FaithSpace.jsx', 'utf8');
const page = () => fs.readFileSync('src/features/faith-space/FaithSpacePage.jsx', 'utf8');
const css = () => fs.readFileSync('src/styles/evangel.css', 'utf8');

test('Faith Space renders readable moving nodes with DOM labels over the 3D scene', () => {
  const s = renderer();
  assert.match(s, /CSS2DRenderer/);
  assert.match(s, /CSS2DObject/);
  assert.match(s, /faith-node-card/);
  assert.match(s, /node\.anchor/);
  assert.match(s, /Math\.sin\(/);
});

test('Faith Space groups nodes into purposeful neighborhoods instead of random placement', () => {
  const s = renderer();
  assert.match(s, /NEIGHBORHOODS/);
  assert.match(s, /verse/);
  assert.match(s, /prayer/);
  assert.match(s, /journal/);
  assert.match(s, /sermon/);
  assert.doesNotMatch(s, /Math\.random\(\).*mesh\.position/);
});

test('Faith Space selection exposes human-readable actions and metadata', () => {
  const s = renderer();
  assert.match(s, /faith-node-detail/);
  assert.match(s, /Open/);
  assert.match(s, /Listen/);
  assert.match(s, /Share/);
  assert.match(s, /createdAt|Saved/);
});

test('Faith Space page has view modes and search to help humans find their material', () => {
  const s = page();
  assert.match(s, /My Journey/);
  assert.match(s, /Scripture/);
  assert.match(s, /Prayer/);
  assert.match(s, /Study \+ Sermons/);
  assert.match(s, /Search your Faith Space/);
});

test('Faith Space node labels have readable CSS and selected states', () => {
  const s = css();
  assert.match(s, /\.faith-node-card/);
  assert.match(s, /\.faith-node-card\.selected/);
  assert.match(s, /\.faith-node-detail/);
});