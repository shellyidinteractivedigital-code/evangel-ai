import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const required = [
  'src/features/home/HomePage.jsx',
  'src/features/drive/DrivePage.jsx',
  'src/features/scholar/ScholarPage.jsx',
  'src/features/study/StudyPage.jsx',
  'src/features/faith-space/FaithSpacePage.jsx',
  'src/features/faith-space/FaithSpace3D.jsx',
  'src/features/journal/JournalPage.jsx',
  'src/features/creator/SermonPage.jsx',
  'src/features/voices/VoicesPage.jsx',
];

test('EVANGEL product experiences live in focused feature modules', () => {
  for (const path of required) assert.equal(existsSync(path), true, `missing ${path}`);
});

test('application composition and EVANGEL styling use normalized paths', () => {
  assert.equal(existsSync('src/app/App.jsx'), true, 'missing src/app/App.jsx');
  assert.equal(existsSync('src/styles/evangel.css'), true, 'missing src/styles/evangel.css');
  assert.equal(existsSync('src/App.jsx'), false, 'legacy src/App.jsx should be removed');
  assert.equal(existsSync('src/index.css'), false, 'legacy src/index.css should be removed');
});

test('main entrypoint imports normalized App and EVANGEL style paths', () => {
  const main = readFileSync('src/main.jsx', 'utf8');
  assert.match(main, /app\/App\.jsx/);
  assert.match(main, /styles\/evangel\.css/);
});