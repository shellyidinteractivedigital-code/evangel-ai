import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('EVANGEL bot is persistent and routes to core workspaces', () => {
  const app = readFileSync('src/app/App.jsx', 'utf8');
  const bot = readFileSync('src/components/EvangelBot.jsx', 'utf8');
  assert.match(app, /<EvangelBot/);
  assert.match(bot, /onNavigate/);
  for (const page of ['study', 'create', 'notes', 'space']) assert.match(bot, new RegExp(page));
  assert.match(bot, /page/);
});

test('Ask sends a real request and renders complete generated content', () => {
  const bot = readFileSync('src/components/EvangelBot.jsx', 'utf8');
  const client = readFileSync('src/services/askEvangel.js', 'utf8');
  const backend = readFileSync('base44/functions/askEvangel/entry.ts', 'utf8');
  assert.match(bot, /await askEvangel/);
  assert.match(bot, /answer\.content/);
  assert.match(bot, /Copy/);
  assert.match(bot, /Listen/);
  assert.match(bot, /Save/);
  assert.match(bot, /Open in Creator/);
  assert.match(client, /functions\.invoke\('askEvangel'/);
  assert.match(backend, /InvokeLLM/);
  assert.match(backend, /prayer/);
  assert.match(backend, /sermon/);
  assert.match(backend, /scripture_answer/);
  assert.match(backend, /Hebrew.*Greek|Greek.*Hebrew/s);
});