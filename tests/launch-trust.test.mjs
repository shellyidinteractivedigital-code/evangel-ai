import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

test('EVANGEL exposes public legal and support pages required for paid launch', () => {
  assert.equal(fs.existsSync('src/features/legal/LegalPage.jsx'), true);
  assert.equal(fs.existsSync('src/features/support/SupportPage.jsx'), true);
  const legal = read('src/features/legal/LegalPage.jsx');
  const legalContent = read('src/data/legalContent.js');
  const support = read('src/features/support/SupportPage.jsx');
  const app = read('src/app/App.jsx');
  for (const word of ['Privacy', 'Terms', 'Refund', 'Cancellation']) assert.match(`${legal}\n${legalContent}`, new RegExp(word, 'i'));
  assert.match(`${support}\n${legalContent}`, /support\.evangel@gmail\.com/i);
  assert.match(app, /legal-footer/);
});

test('launch trust copy protects child privacy and never stores tax identifiers in the app', () => {
  const content = read('src/data/legalContent.js');
  assert.match(content, /under 13/i);
  assert.match(content, /parent|guardian/i);
  assert.match(content, /voice/i);
  assert.doesNotMatch(content, /\bEIN\b\s*[:=]\s*\d/i);
  assert.doesNotMatch(content, /\bSSN\b\s*[:=]\s*\d/i);
});


test('legal and support pages have stable public query URLs', () => {
  const app = read('src/app/App.jsx');
  assert.match(app, /URLSearchParams/);
  assert.match(app, /page/);
  assert.match(app, /history\.replaceState|history\.pushState/);
});