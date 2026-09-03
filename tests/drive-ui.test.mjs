import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('Drive Sanctuary exposes large voice-first ask sermon save email repeat and next controls',()=>{
  const drive=read('src/features/drive/DrivePage.jsx');
  for(const label of ['ASK','SERMON','SAVE','EMAIL ME','REPEAT','NEXT']) assert.match(drive,new RegExp(label));
  assert.match(drive,/drive-answer/);
  assert.match(drive,/sermon-status/);
});

test('App routes speech through Drive command parser and grounded answer/sermon helpers',()=>{
  const app=read('src/app/App.jsx');
  assert.match(app,/parseDriveCommand/);
  assert.match(app,/answerDriveQuestion/);
  assert.match(app,/applySermonCommand/);
  assert.match(app,/buildDriveEmail/);
});