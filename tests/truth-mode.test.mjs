import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(p,'utf8');

test('Truth Mode exposes explicit evidence layers',()=>{
  assert.equal(fs.existsSync('src/features/truth/TruthModePanel.jsx'),true);
  assert.equal(fs.existsSync('src/services/truthMode.js'),true);
  const service=read('src/services/truthMode.js');
  for(const label of ['scripture','source_data','translation','interpretation','user_reflection']) assert.match(service,new RegExp(label));
});

test('Scholar renders Truth Mode and source registry',()=>{
  const scholar=read('src/features/scholar/ScholarPage.jsx');
  assert.match(scholar,/TruthModePanel/);
  assert.match(scholar,/SOURCE_REGISTRY/);
});