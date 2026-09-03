import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getDailyVerse, getLocalDayKey, buildDailyVerseSchedule } from '../src/services/dailyVerse.js';

process.env.TZ = 'America/Los_Angeles';

function makeVerse(index) {
  return {
    sourceKey: 'web',
    bookName: index % 2 ? 'Psalms' : 'John',
    chapter: Math.floor(index / 20) + 1,
    verse: (index % 20) + 1,
    ref: `${index % 2 ? 'Psalms' : 'John'} ${Math.floor(index / 20) + 1}:${(index % 20) + 1}`,
    text: `A meaningful daily Scripture text number ${index} with enough words to be readable and useful for reflection today.`,
  };
}

const corpus = Array.from({ length: 500 }, (_, index) => makeVerse(index));

test('same local calendar day always returns the same daily verse', () => {
  const morning = new Date(2026, 8, 1, 8, 0, 0);
  const evening = new Date(2026, 8, 1, 23, 30, 0);
  assert.equal(getLocalDayKey(morning), '2026-09-01');
  assert.equal(getLocalDayKey(evening), '2026-09-01');
  assert.deepEqual(getDailyVerse(corpus, morning), getDailyVerse(corpus, evening));
});

test('consecutive days advance to different verses when the corpus is large enough', () => {
  const dayOne = getDailyVerse(corpus, new Date(2026, 8, 1, 12));
  const dayTwo = getDailyVerse(corpus, new Date(2026, 8, 2, 12));
  assert.notEqual(dayOne.ref, dayTwo.ref);
});

test('daily verse advances correctly across daylight-saving calendar boundaries', () => {
  const beforeSpringShift = getDailyVerse(corpus, new Date(2026, 2, 8, 12));
  const afterSpringShift = getDailyVerse(corpus, new Date(2026, 2, 9, 12));
  assert.notEqual(beforeSpringShift.ref, afterSpringShift.ref);
});

test('yearly schedule avoids repeats when at least 366 eligible verses are available', () => {
  const schedule = buildDailyVerseSchedule(corpus, 2026);
  assert.equal(schedule.length, 365);
  assert.equal(new Set(schedule.map((verse) => verse.ref)).size, 365);
});

test('daily verse selector favors readable devotional books and reasonable verse lengths', () => {
  const noisy = [
    { sourceKey:'web', bookName:'Numbers', chapter:1, verse:1, ref:'Numbers 1:1', text:'Short.' },
    ...corpus,
  ];
  const schedule = buildDailyVerseSchedule(noisy, 2026);
  assert.ok(schedule.every((verse) => ['Psalms','John'].includes(verse.bookName)));
  assert.ok(schedule.every((verse) => verse.text.length >= 45 && verse.text.length <= 320));
});

test('EVANGEL app loads the full WEB corpus for the official daily verse and keeps manual Next Verse separate', () => {
  const app = fs.readFileSync('src/app/App.jsx', 'utf8');
  assert.match(app, /loadScripture/);
  assert.match(app, /getDailyVerse/);
  assert.match(app, /dailyVerse/);
  assert.match(app, /exploreVerse/);
  assert.match(app, /Official daily verse/);
});