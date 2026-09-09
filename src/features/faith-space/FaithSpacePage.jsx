import { useMemo, useState } from 'react';
import { Eye, EyeOff, LocateFixed, RotateCcw, Trash2, Volume2 } from 'lucide-react';
import FaithSpace from '@/components/FaithSpace';
import DictateButton from '@/components/DictateButton';
import { deleteFaithItem, updateFaithItemPosition } from '@/services/faithLibrary';
import { speakEvangel } from '@/services/evangelVoice';

const MODES = [
  { id:'all', label:'My Journey', kinds:null },
  { id:'scripture', label:'Scripture', kinds:['verse','highlight'] },
  { id:'prayer', label:'Prayer', kinds:['prayer','answered_prayer'] },
  { id:'study', label:'Study + Sermons', kinds:['study','word_study','sermon','lesson','note','journal','drive_reflection','voice_note'] },
];

const KIND_LABELS = {
  verse:'Scripture', highlight:'Highlight', prayer:'Prayer', answered_prayer:'Answered prayer',
  journal:'Journal', note:'Note', drive_reflection:'Reflection', study:'Study',
  word_study:'Word study', sermon:'Sermon', collection:'Collection',
  voice_note:'Voice note', lesson:'Lesson',
};

export default function FaithSpacePage({ items = [], notify, onAddFaithNote, onOpenItem, premiumVoice, fallbackVoiceName, onReload }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [focusItemId, setFocusItemId] = useState('');
  const [motionPaused, setMotionPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [savingLayout, setSavingLayout] = useState(false);

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

  const sortedItems = useMemo(() => visibleItems.map((item) => item).sort((a,b) => {
    const section = (KIND_LABELS[a.kind] || 'Memory').localeCompare(KIND_LABELS[b.kind] || 'Memory');
    return section || String(a.title || a.ref || '').localeCompare(String(b.title || b.ref || ''));
  }), [visibleItems]);

  const save = async () => {
    if (!title.trim() && !text.trim()) { notify('Add a title or note to save'); return; }
    await onAddFaithNote?.({ title: title.trim() || 'Note', text: text.trim(), kind: 'note' });
    setTitle(''); setText('');
  };

  const select = (item) => {
    setSelected(item);
    setFocusItemId(item.id || '');
  };

  const savePosition = async (item, spatial) => {
    if (!item?.id) return;
    try {
      await updateFaithItemPosition(item.id, spatial);
      notify?.('Position saved');
      await onReload?.();
    } catch {
      notify?.('Could not save that position. Please try again.');
    }
  };

  const resetLayout = async () => {
    if (!visibleItems.some((item) => item.spatial)) {
      setResetSignal((value) => value + 1);
      return;
    }
    if (!window.confirm('Reset the visible cards to a clean automatic layout?')) return;
    setSavingLayout(true);
    try {
      for (const item of visibleItems) {
        if (item.id && item.spatial) await updateFaithItemPosition(item.id, null);
      }
      setSelected(null);
      setFocusItemId('');
      setResetSignal((value) => value + 1);
      await onReload?.();
      notify?.('Faith Space layout reset.');
    } catch {
      notify?.('Could not reset the layout. Please try again.');
    } finally {
      setSavingLayout(false);
    }
  };

  const remove = async (item) => {
    const name = item.title || item.ref || 'this saved item';
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteFaithItem(item.id);
      if (selected?.id === item.id) setSelected(null);
      if (focusItemId === item.id) setFocusItemId('');
      await onReload?.();
      notify?.('Saved item deleted.');
    } catch {
      notify?.('Could not delete this item. Please try again.');
    }
  };

  const listen = (item) => speakEvangel({
    text: `${item.title || item.ref || 'Saved item'}. ${item.text || ''}`,
    premiumVoice,
    fallbackVoiceName,
  });

  const emptyMessage = items.length
    ? 'No saved items match this view. Try My Journey or clear your search.'
    : 'Your Faith Space is empty. Save a verse, journal entry, note, prayer, highlight, or sermon and it will appear here.';

  return (
    <section className="page space-page">
      <div className="page-title faith-space-title">
        <div>
          <p className="eyebrow">YOUR SPIRITUAL MEMORY MAP</p>
          <h2>Faith Space</h2>
          <p>Drag a card to place it. Drag the background to look around. Use the list below whenever that is easier.</p>
        </div>
      </div>

      <div className="faith-space-toolbar glass">
        <div className="faith-space-modes" role="tablist" aria-label="Faith Space views">
          {MODES.map((entry) => <button key={entry.id} className={mode===entry.id?'active':''} onClick={()=>setMode(entry.id)}>{entry.label}</button>)}
        </div>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search your Faith Space" aria-label="Search your Faith Space" />
        <span>{visibleItems.length} visible</span>
      </div>

      <div className="faith-space-view-controls glass" aria-label="3D space controls">
        <button onClick={() => setMotionPaused((value) => !value)}>{motionPaused ? <Eye size={16}/> : <EyeOff size={16}/>} {motionPaused ? 'Resume motion' : 'Pause motion'}</button>
        <button onClick={resetLayout} disabled={savingLayout}><RotateCcw size={16}/> {savingLayout ? 'Resetting…' : 'Reset layout'}</button>
        <span><LocateFixed size={15}/> Drag cards to move · drag space to orbit · scroll or pinch to zoom</span>
      </div>

      <div className="space-shell glass">
        {visibleItems.length
          ? <FaithSpace
              items={visibleItems}
              onSelect={select}
              onOpenItem={onOpenItem}
              onPositionChange={savePosition}
              focusItemId={focusItemId}
              motionPaused={motionPaused}
              resetSignal={resetSignal}
              premiumVoice={premiumVoice}
              fallbackVoiceName={fallbackVoiceName}
              notify={notify}
              onConverted={onReload}
            />
          : <div className="faith-space-empty"><strong>{emptyMessage}</strong><span>Nothing fake is shown here. This space reflects your actual saved material.</span></div>}
        <div className="space-legend"><span>✦ Scripture</span><span>♥ Prayer</span><span>● Journal</span><span>◇ Study</span><span>▤ Sermons</span></div>
      </div>

      {selected && <div className="faith-selection-summary glass"><small>SELECTED</small><strong>{selected.title || selected.ref || 'Saved moment'}</strong><p>{selected.text || selected.ref || 'Saved in your Faith Space.'}</p><button className="primary" onClick={()=>onOpenItem?.(selected)}>Open in EVANGEL</button></div>}

      <section className="faith-space-index glass" aria-label="Faith Space item list">
        <div className="faith-space-index-head"><div><p className="eyebrow">EASY LIST</p><h3>Everything visible in this section</h3></div><span>{sortedItems.length} items</span></div>
        {sortedItems.length === 0 && <p className="empty">No items match this section.</p>}
        <div className="faith-space-index-list">
          {sortedItems.map((item) => (
            <article className={`faith-space-index-row ${focusItemId === item.id ? 'selected' : ''}`} key={item.id || `${item.kind}-${item.title}`}>
              <button className="faith-space-index-main" onClick={() => select(item)}>
                <small>{KIND_LABELS[item.kind] || 'Memory'}</small>
                <strong>{item.title || item.ref || 'Saved moment'}</strong>
                <span>{item.text || item.scripture_ref || item.ref || 'Saved in Faith Space'}</span>
              </button>
              <div className="faith-space-index-actions">
                <button onClick={() => { select(item); onOpenItem?.(item); }}>Open</button>
                <button onClick={() => listen(item)}><Volume2 size={15}/> Listen</button>
                <button className="danger" onClick={() => remove(item)}><Trash2 size={15}/> Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>

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