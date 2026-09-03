import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');

test('share metadata is EVANGEL branded and uses the production manifest', () => {
  const html = read('index.html');
  assert.match(html, /<title>EVANGEL — Scripture Listening, Study & Faith Space<\/title>/);
  assert.match(html, /href="\/evangel-mark\.svg"/);
  assert.match(html, /href="\/manifest\.webmanifest"/);
  assert.match(html, /https:\/\/evangel-ai\.com\//);
  assert.doesNotMatch(html, /Base44 APP|base44\.com\/logo_v2/);
});

test('runtime share surfaces use evangel-ai.com and not the legacy no-hyphen domain', () => {
  const sources = [
    'src/data/legalContent.js',
    'public/widgets/evangel-widget.js',
    'base44/functions/sharing/createShareLink/entry.ts',
  ].map(read).join('\n');
  assert.match(sources, /https:\/\/evangel-ai\.com/);
  assert.doesNotMatch(sources, /https:\/\/evangelai\.ai/i);
});

test('Base44 functions use the supported SDK import', () => {
  const paths = [
    'base44/functions/groups/join/entry.ts',
    'base44/functions/sharing/createShareLink/entry.ts',
    'base44/functions/sharing/getSharedItem/entry.ts',
  ];
  for (const path of paths) {
    const source = read(path);
    assert.match(source, /npm:@base44\/sdk@0\.8\.44/);
    assert.doesNotMatch(source, /npm:@base44\/sdk\/functions/);
  }
});