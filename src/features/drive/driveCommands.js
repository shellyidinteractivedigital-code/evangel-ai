const FIELD_RULES = [
  ['sermon_title', /^title\s*:\s*(.+)$/i],
  ['sermon_point', /^point(?:\s+(?:one|two|three|four|five|\d+))?\s*:\s*(.+)$/i],
  ['sermon_application', /^application\s*:\s*(.+)$/i],
  ['sermon_illustration', /^(?:illustration|story)\s*:\s*(.+)$/i],
  ['sermon_prayer', /^(?:closing\s+prayer|prayer)\s*:\s*(.+)$/i],
];

export function parseDriveCommand(transcript = '') {
  const text = String(transcript).trim();
  for (const [type, pattern] of FIELD_RULES) {
    const match = text.match(pattern);
    if (match) return { type, value: match[1].trim(), raw: text };
  }
  const words = text.toLowerCase();
  if (/\b(email|send)\b/.test(words) && /\b(me|myself|this)\b/.test(words)) return { type: 'email', value: '', raw: text };
  if (/\b(start|create|begin|make)\b.*\bsermon\b|\bsermon\b.*\b(start|create|begin|make)\b/.test(words)) return { type: 'sermon_start', value: '', raw: text };
  if (/\brepeat\b/.test(words)) return { type: 'repeat', value: '', raw: text };
  if (/\bnext\b/.test(words)) return { type: 'next', value: '', raw: text };
  if (/\bsave\b/.test(words)) return { type: 'save', value: '', raw: text };
  if (/\b(play|read)\b/.test(words)) return { type: 'play', value: '', raw: text };
  if (text) return { type: 'ask', value: text, raw: text };
  return { type: 'unknown', value: '', raw: text };
}