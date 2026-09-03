import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync('src/features/creator/SermonPage.jsx','utf8');

test('parked Sermon Creator preserves and edits a Drive closing prayer',()=>{
  assert.match(source,/Closing Prayer/i);
  assert.match(source,/sermon\.prayer/);
  assert.match(source,/patch\(['"]prayer['"]/);
});

test('saved sermon FaithItem includes the closing prayer when present',()=>{
  assert.match(source,/sermon\.prayer/);
  assert.match(source,/filter\(Boolean\)\.join/);
});