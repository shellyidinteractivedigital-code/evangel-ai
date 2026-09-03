import { GraduationCap, Heart, ScrollText } from 'lucide-react';
import { saveFaithItem } from '../services/faithLibrary';

const TARGETS = [
  { kind: 'prayer', label: 'Prayer', Icon: Heart, guided: true },
  { kind: 'sermon', label: 'Sermon', Icon: ScrollText, guided: true },
  { kind: 'lesson', label: 'Lesson', Icon: GraduationCap, guided: false },
];

export default function ConvertNoteActions({ item, notify, onConverted, onStartCreator }) {
  const convert = async (kind, label, guided) => {
    if (guided && onStartCreator) {
      onStartCreator({ ...item, targetKind: kind });
      return;
    }
    try {
      await saveFaithItem({ kind, title: item.title || 'Note', text: item.text || '', scripture_ref: item.scripture_ref || item.ref || '', source_item_id: item.id, tags: ['from_note'] });
      notify?.(`Saved as ${label}`);
      await onConverted?.();
    } catch { notify?.('Sign in to save'); }
  };
  return <div className="faith-actions" aria-label="Turn this note into">{TARGETS.map(({ kind, label, Icon, guided }) => <button key={kind} onClick={() => convert(kind, label, guided)}><Icon size={15}/> {guided ? `Create ${label}` : label}</button>)}</div>;
}