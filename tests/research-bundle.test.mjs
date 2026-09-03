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

test('research bundle rejects unverified passages', () => {
  assert.throws(() => buildResearchBundle({
    reference: 'Invented 1:1',
    passage: null,
    source: { key: 'web' },
  }), /verified_passage_required/);
});

test('research bundle keeps only sourced language records', () => {
  const result = buildResearchBundle({
    reference: 'John 1:1',
    passage: { ref: 'John 1:1', text: 'In the beginning was the Word.' },
    source: { key: 'web', displayName: 'World English Bible', rights: 'Public domain' },
    languageRecords: [
      { lemma: 'λόγος', transliteration: 'logos', evidenceSource: 'SBLGNT' },
      { lemma: 'invented' },
    ],
  });
  assert.equal(result.words.length, 1);
  assert.equal(result.words[0].lemma, 'λόγος');
});