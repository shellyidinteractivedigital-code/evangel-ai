import { useMemo, useState } from 'react';
import FaithSpace from '@/components/FaithSpace';
import DictateButton from '@/components/DictateButton';

const MODES = [
  { id:'all', label:'My Journey', kinds:null },
  { id:'scripture', label:'Scripture', kinds:['verse','highlight'] },
  { id:'prayer', label:'Prayer', kinds:['prayer','answered_prayer'] },
  { id:'study', label:'Study + Sermons', kinds:['study','word_study','sermon','lesson','note','journal','drive_reflection','voice_note'] },
];

export default function FaithSpacePage({ items = [], notify, onAddFaithNote, onOpenItem, premiumVoice, fallbackVoiceName, onReload }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const visibleItems = useMemo(() => {
    const active = MODES.find((entry) => entry.id === mode) || MODES[0];
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (active.kinds && !active.kinds.includes(item.kind)) return false;
      if (!needle) return true;
      return [item.title,item.text,item.ref,item.kind,...(item.tags || [])]
        .filter(Boolean).join(' ').toLowerCase().includes(needle);
    });
  }, [items, mode, query]);

  const save = async () => {
    if (!title.trim() && !text.trim()) { notify('Add a title or note to save'); return; }
    await onAddFaithNote?.({ title: title.trim() || 'Note', text: text.trim(), kind: 'note' });
    setTitle(''); setText('');
  };

  const select = (item) => {
    setSelected(item);
  };

  const emptyMessage = items.length
    ? 'No saved items match this view. Try My Journey or clear your search.'
    : 'Your Faith Space is empty. Save a verse, journal entry, note, prayer, highlight, or sermon and it will appear here.';

  return (
    <section className="page space-page">
      <div className="page-title faith-space-title">
        <div>
          <p className="eyebrow">YOUR SPIRITUAL MEMORY MAP</p>
          <h2>Faith Space</h2>
          <p>This is your saved library made visible. Tap a card to inspect it, then Open to continue working with it in the right EVANGEL tool.</p>
        </div>
      </div>

      <div className="faith-space-toolbar glass">
        <div className="faith-space-modes" role="tablist" aria-label="Faith Space views">
          {MODES.map((entry) => <button key={entry.id} className={mode===entry.id?'active':''} onClick={()=>setMode(entry.id)}>{entry.label}</button>)}
        </div>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search your Faith Space" aria-label="Search your Faith Space" />
        <span>{visibleItems.length} visible</span>
      </div>

      <div className="space-shell glass">
        {visibleItems.length
          ? <FaithSpace items={visibleItems} onSelect={select} onOpenItem={onOpenItem} premiumVoice={premiumVoice} fallbackVoiceName={fallbackVoiceName} notify={notify} onConverted={onReload} />
          : <div className="faith-space-empty"><strong>{emptyMessage}</strong><span>Nothing fake is shown here. This space reflects your actual saved material.</span></div>}
        <div className="space-legend"><span>✦ Scripture</span><span>♥ Prayer</span><span>● Journal</span><span>◇ Study</span><span>▤ Sermons</span></div>
      </div>

      {selected && <div className="faith-selection-summary glass"><small>SELECTED</small><strong>{selected.title || selected.ref || 'Saved moment'}</strong><p>{selected.text || selected.ref || 'Saved in your Faith Space.'}</p><button className="primary" onClick={()=>onOpenItem?.(selected)}>Open in EVANGEL</button></div>}

      <div className="faith-save">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <DictateButton onDictate={(t) => setTitle((title ? title + ' ' : '') + t)} notify={notify} label="Dictate title" />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="A short note, prayer, or reflection" />
        <DictateButton onDictate={(t) => setText((text ? text + ' ' : '') + t)} notify={notify} label="Dictate" />
        <button className="primary" onClick={save}>Save to Faith Space</button>
      </div>
    </section>
  );
}