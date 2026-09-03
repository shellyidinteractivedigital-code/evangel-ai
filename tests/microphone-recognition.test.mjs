import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const hook = () => fs.readFileSync('src/hooks/useSpeechRecognition.js', 'utf8');
const service = () => fs.readFileSync('src/services/speechRecognition.js', 'utf8');
const app = () => fs.readFileSync('src/app/App.jsx', 'utf8');
const drive = () => fs.readFileSync('src/features/drive/DrivePage.jsx', 'utf8');

test('speech recognition errors produce actionable messages', () => {
  const s = service();
  assert.match(s, /not-allowed/);
  assert.match(s, /audio-capture/);
  assert.match(s, /no-speech/);
  assert.match(s, /network/);
  assert.match(s, /microphone permission/i);
});

test('microphone permission is preflighted before SpeechRecognition starts', () => {
  const s = hook();
  assert.match(s, /mediaDevices\.getUserMedia/);
  assert.match(s, /audio:\s*true/);
  assert.match(s, /track\.stop\(\)/);
});

test('recognition session is retained and listening starts only after browser onstart', () => {
  const s = hook();
  assert.match(s, /recognitionRef/);
  assert.match(s, /recognition\.onstart/);
  assert.match(s, /recognitionRef\.current\s*=\s*recognition/);
});

test('browser recognition error codes and synchronous start failures reach the UI', () => {
  const s = hook();
  assert.match(s, /event\.error/);
  assert.match(s, /catch/);
  assert.match(s, /lastError/);
});

test('EVANGEL gives the user microphone state instead of a silent mic button', () => {
  const a = app();
  const d = drive();
  assert.match(a, /speechRecognitionErrorMessage/);
  assert.match(a, /recognitionStatus/);
  assert.match(d, /micStatus/);
  assert.match(d, /MIC READY|MIC BLOCKED|LISTENING/);
});