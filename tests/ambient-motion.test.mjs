import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const home=fs.readFileSync('src/features/home/HomePage.jsx','utf8');
const drive=fs.readFileSync('src/features/drive/DrivePage.jsx','utf8');
const css=fs.readFileSync('src/styles/evangel.css','utf8');

test('Home and Drive render ambient visual layers',()=>{
  assert.match(home,/ambient-sky/);
  assert.match(drive,/ambient-sky/);
  assert.match(css,/ambient-cloud/);
  assert.match(css,/@keyframes ambientDrift/);
});

test('ambient motion respects reduced-motion preference',()=>{
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/ambient-cloud/);
});