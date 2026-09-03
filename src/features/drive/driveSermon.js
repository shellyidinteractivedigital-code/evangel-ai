function clean(value = '') { return String(value).trim(); }

export function applySermonCommand(current = {}, command = {}, verse = {}) {
  const base = {
    title: current.title || '',
    text: current.text || '',
    application: current.application || '',
    illustration: current.illustration || '',
    prayer: current.prayer || '',
  };
  const ref = verse.ref || 'Selected passage';
  const passage = verse.text || '';
  if (command.type === 'sermon_start') {
    if (!base.text) base.text = `${ref}\n${passage}`.trim();
    return base;
  }
  const value = clean(command.value);
  if (!value) return base;
  if (command.type === 'sermon_title') return { ...base, title: value };
  if (command.type === 'sermon_point') {
    const starter = base.text || `${ref}\n${passage}`.trim();
    return { ...base, text: `${starter}\n\n• ${value}` };
  }
  if (command.type === 'sermon_application') return { ...base, application: value };
  if (command.type === 'sermon_illustration') return { ...base, illustration: value };
  if (command.type === 'sermon_prayer') return { ...base, prayer: value };
  return base;
}

export function formatDriveWork({ verse = {}, answer = '', sermon = {} }) {
  const lines = [
    'EVANGEL Drive Sanctuary',
    '',
    verse.ref || 'Selected passage',
    verse.text || '',
  ];
  if (answer) lines.push('', 'Reflection', answer);
  if (sermon.title || sermon.text || sermon.application || sermon.illustration || sermon.prayer) {
    lines.push('', 'Sermon Draft');
    if (sermon.title) lines.push(`Title: ${sermon.title}`);
    if (sermon.text) lines.push(sermon.text);
    if (sermon.application) lines.push('', `Application: ${sermon.application}`);
    if (sermon.illustration) lines.push('', `Illustration: ${sermon.illustration}`);
    if (sermon.prayer) lines.push('', `Closing prayer: ${sermon.prayer}`);
  }
  lines.push('', 'Created in EVANGEL. Review and edit when safely parked.');
  return lines.join('\n');
}

export function buildDriveEmail({ verse, answer = '', sermon = {} }) {
  const subject = sermon.title ? `EVANGEL Sermon Draft: ${sermon.title}` : `EVANGEL: ${verse?.ref || 'Saved reflection'}`;
  const body = formatDriveWork({ verse, answer, sermon });
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}