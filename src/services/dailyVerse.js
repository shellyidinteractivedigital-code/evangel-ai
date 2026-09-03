const DEVOTIONAL_BOOKS = new Set([
  'Psalms','Proverbs','Isaiah','Jeremiah','Lamentations','Matthew','Mark','Luke','John','Acts','Romans',
  '1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians',
  '1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]);

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function seededShuffle(items, seed) {
  const copy = [...items];
  const random = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getLocalDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dayOfYear(date) {
  const year = date.getFullYear();
  const startUtc = Date.UTC(year, 0, 1);
  const currentUtc = Date.UTC(year, date.getMonth(), date.getDate());
  return Math.floor((currentUtc - startUtc) / 86400000);
}

function daysInYear(year) {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

function eligibleVerses(corpus) {
  return corpus.filter((verse) =>
    verse?.sourceKey === 'web' &&
    DEVOTIONAL_BOOKS.has(verse.bookName) &&
    typeof verse.text === 'string' &&
    verse.text.length >= 45 &&
    verse.text.length <= 320
  );
}

export function buildDailyVerseSchedule(corpus, year = new Date().getFullYear()) {
  const eligible = eligibleVerses(corpus);
  if (!eligible.length) return [];
  const needed = daysInYear(year);
  const shuffled = seededShuffle(eligible, year * 2654435761);
  if (shuffled.length >= needed) return shuffled.slice(0, needed);
  const schedule = [];
  for (let i = 0; i < needed; i += 1) schedule.push(shuffled[i % shuffled.length]);
  return schedule;
}

export function getDailyVerse(corpus, date = new Date()) {
  const schedule = buildDailyVerseSchedule(corpus, date.getFullYear());
  if (!schedule.length) return null;
  return schedule[dayOfYear(date) % schedule.length];
}