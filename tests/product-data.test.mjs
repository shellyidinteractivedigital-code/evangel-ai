import test from 'node:test';
import assert from 'node:assert/strict';

import { STARTER_SCRIPTURE } from '../src/data/starterScripture.js';
import { SOURCE_REGISTRY, SCHOLAR_RULES } from '../src/data/scholarSources.js';

 test('starter Scripture preserves the current five passages', () => {
  assert.equal(STARTER_SCRIPTURE.length, 5);
  assert.equal(STARTER_SCRIPTURE[0].ref, 'John 3:16');
  assert.equal(STARTER_SCRIPTURE[2].ref, 'Psalm 121:8');
});

test('Scholar registry keeps Concordant link-only and separates evidence rules', () => {
  const concordant = SOURCE_REGISTRY.find((source) => source.name === 'Concordant Literal Version');
  assert.equal(concordant?.status, 'link-only');
  assert.ok(SCHOLAR_RULES.some(([label]) => label === 'INTERPRETATION'));
  assert.ok(SCHOLAR_RULES.some(([label]) => label === 'HUMILITY'));
});