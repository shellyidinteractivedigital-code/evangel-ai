import test from 'node:test';
import assert from 'node:assert/strict';
import { applySermonCommand, buildDriveEmail } from '../src/features/drive/driveSermon.js';

const verse = { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.' };

test('voice sermon commands build a structured draft without erasing prior points', () => {
  let sermon = applySermonCommand({}, { type: 'sermon_start' }, verse);
  sermon = applySermonCommand(sermon, { type: 'sermon_title', value: 'Stillness and Trust' }, verse);
  sermon = applySermonCommand(sermon, { type: 'sermon_point', value: 'Pause before reacting' }, verse);
  sermon = applySermonCommand(sermon, { type: 'sermon_point', value: 'Return to what the text says' }, verse);
  sermon = applySermonCommand(sermon, { type: 'sermon_application', value: 'Practice one quiet minute today' }, verse);
  assert.equal(sermon.title, 'Stillness and Trust');
  assert.match(sermon.text, /Psalm 46:10/);
  assert.match(sermon.text, /Pause before reacting/);
  assert.match(sermon.text, /Return to what the text says/);
  assert.equal(sermon.application, 'Practice one quiet minute today');
});

test('email handoff is a mailto URL with encoded passage and current work, never credentials', () => {
  const url = buildDriveEmail({ verse, answer: 'A short reflection.', sermon: { title: 'Stillness', text: 'Point one' } });
  assert.match(url, /^mailto:\?/);
  assert.match(url, /subject=/);
  assert.match(url, /body=/);
  const decoded = decodeURIComponent(url);
  assert.match(decoded, /Psalm 46:10/);
  assert.match(decoded, /Stillness/);
  assert.doesNotMatch(decoded, /password|api[_ -]?key|token=/i);
});