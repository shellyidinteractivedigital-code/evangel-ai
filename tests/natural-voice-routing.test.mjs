import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

test('central EVANGEL narration service prefers premium speech with device fallback', () => {
  const s = read('src/services/evangelVoice.js');
  assert.match(s, /playPremiumSpeech/);
  assert.match(s, /speakText/);
  assert.match(s, /marin|cedar/);
});

test('Home Drive Journal and Faith Space do not call raw browser speech directly', () => {
  for (const path of [
    'src/features/home/HomePage.jsx',
    'src/features/drive/DrivePage.jsx',
    'src/features/journal/JournalPage.jsx',
    'src/components/FaithSpace.jsx',
  ]) {
    const s = read(path);
    assert.doesNotMatch(s, /from ['"]\.\.\/\.\.\/services\/speech['"]|from ['"]\.\.\/services\/speech['"]/);
    assert.match(s, /evangelVoice|speakEvangel/);
  }
});

test('EVANGEL app stores a premium narrator choice independent of device voice fallback', () => {
  const s = read('src/app/App.jsx');
  assert.match(s, /evangel\.premiumVoice/);
  assert.match(s, /premiumVoice/);
  assert.match(s, /fallbackVoiceName/);
});

test('Voices page can select Marin or Cedar for the app, not only preview them', () => {
  const s = read('src/features/voices/VoicesPage.jsx');
  assert.match(s, /onPremiumVoiceChange/);
  assert.match(s, /SELECTED/);
  assert.match(s, /MARIN/i);
  assert.match(s, /CEDAR/i);
});