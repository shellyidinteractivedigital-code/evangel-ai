import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('creator supports guided sermon controls and note sources', () => {
  const creator = fs.readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  const notes = fs.readFileSync('src/components/ConvertNoteActions.jsx', 'utf8');
  const app = fs.readFileSync('src/app/App.jsx', 'utf8');
  assert.match(creator, /GeneratorInterview/);
  assert.match(creator, /speakingMinutes/);
  assert.match(creator, /theologicalMode/);
  assert.match(creator, /generateFaithContent/);
  assert.match(notes, /onStartCreator/);
  assert.match(app, /creatorSource/);
});

test('generator result preserves source linkage when saved', () => {
  const creator = fs.readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  const library = fs.readFileSync('src/services/faithLibrary.js', 'utf8');
  assert.match(creator, /source_item_id/);
  assert.match(library, /generator_settings/);
  assert.match(library, /source_snapshot/);
});