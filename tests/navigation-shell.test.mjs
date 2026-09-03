import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('src/app/App.jsx', 'utf8');
const css = fs.readFileSync('src/styles/evangel.css', 'utf8');

test('app shell uses the premium desktop and mobile navigation classes defined by EVANGEL CSS', () => {
  assert.match(css, /\.side-nav\{/);
  assert.match(css, /\.mobile-nav\{/);
  assert.match(app, /className="side-nav glass"/);
  assert.match(app, /className="mobile-nav glass"/);
});