import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

test('Voice Sanctuary renders only the six connected API voices', () => {
  const page = read('src/features/voices/VoicesPage.jsx');
  assert.doesNotMatch(page, /voices\.map|ON THIS DEVICE|speakText/);
  assert.match(page, /PREMIUM_VOICES\.map/);
});

test('API voice preview never silently substitutes a device voice', () => {
  const page = read('src/features/voices/VoicesPage.jsx');
  const service = read('src/services/premiumVoice.js');
  assert.doesNotMatch(page, /fallbackVoiceName/);
  assert.match(page, /voiceError/);
  assert.match(service, /allowDeviceFallback = false/);
  assert.match(service, /if \(allowDeviceFallback\)/);
});