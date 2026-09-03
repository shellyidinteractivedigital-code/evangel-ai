import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Creator makes the subscriber idea the primary generation instruction', () => {
  const creator = readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  const backend = readFileSync('base44/functions/generateFaithContent/entry.ts', 'utf8');
  assert.match(creator, /creationPrompt/);
  assert.match(creator, /supportingNotes/);
  assert.match(creator, /What do you want to create\?/);
  assert.match(creator, /creationPrompt: creationPrompt\.trim\(\)/);
  assert.match(backend, /CREATOR IDEA/);
  assert.match(backend, /primary instruction/i);
  assert.match(backend, /avoid generic/i);
});

test('Creator lets subscribers choose or create a folder while saving', () => {
  const creator = readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  const folders = readFileSync('src/services/faithFolders.js', 'utf8');
  assert.match(creator, /selectedFolderId/);
  assert.match(creator, /newFolderName/);
  assert.match(creator, /Choose a folder/);
  assert.match(creator, /createFaithFolder/);
  assert.match(creator, /folder_id/);
  assert.match(folders, /FaithFolder\.create/);
  assert.match(folders, /FaithFolder\.filter/);
});

test('Creator displays simple numbered instructions', () => {
  const creator = readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  assert.match(creator, /1\. Choose/);
  assert.match(creator, /2\. Tell EVANGEL/);
  assert.match(creator, /3\. Shape/);
  assert.match(creator, /4\. Generate/);
  assert.match(creator, /5\. Save/);
});

test('Creator provides working start over and delete controls', () => {
  const creator = readFileSync('src/features/create/CreatePage.jsx', 'utf8');
  assert.match(creator, /const startOver = \(\) =>/);
  assert.match(creator, /window\.confirm\('Start over\?/);
  assert.match(creator, /Start over/);
  assert.match(creator, /deleteFaithItem\(item\.id\)/);
  assert.match(creator, /Delete saved item/);
});

test('Library confirms and deletes saved items through Base44', () => {
  const library = readFileSync('src/features/library/LibraryPage.jsx', 'utf8');
  const service = readFileSync('src/services/faithLibrary.js', 'utf8');
  assert.match(library, /window\.confirm/);
  assert.match(library, /deleteFaithItem\(item\.id\)/);
  assert.match(library, /Delete/);
  assert.match(service, /FaithItem\.delete\(itemId\)/);
});