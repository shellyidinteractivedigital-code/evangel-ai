import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Scholar includes a light Revelation Through Time awareness panel',()=>{
  assert.equal(fs.existsSync('src/features/scholar/RevelationThroughTime.jsx'),true);
  const panel=fs.readFileSync('src/features/scholar/RevelationThroughTime.jsx','utf8');
  for(const phrase of ['Revelation Through Time','What changed','Text','Translation','Interpretation','Culture','Good to know']) assert.match(panel,new RegExp(phrase,'i'));
  assert.match(panel,/same book|different questions/i);
  assert.match(panel,/Roman|empire/i);
  assert.match(panel,/Hebrew Scripture|Daniel|Ezekiel|Isaiah/i);
});

test('Scholar renders Revelation Through Time',()=>{
  const page=fs.readFileSync('src/features/scholar/ScholarPage.jsx','utf8');
  assert.match(page,/RevelationThroughTime/);
});