import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, FolderOpen, Trash2, Volume2 } from 'lucide-react';
import { deleteFaithItem, listMyFaithItems } from '../../services/faithLibrary';
import { speakEvangel } from '../../services/evangelVoice';

const KINDS = ['prayer', 'verse', 'sermon'];
const KIND_LABEL = { prayer: 'Prayer', verse: 'Scripture', sermon: 'Sermon' };
const UNTAGGED = 'Unfiled';

export default function LibraryPage({ notify, voiceName, premiumVoice, onNavigate, onDeleted }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState({});
  const [query, setQuery] = useState('');

  const load = () => listMyFaithItems().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const saved = useMemo(() => (items || []).filter((i) => KINDS.includes(i.kind)), [items]);

  const counts = useMemo(() => ({
    prayer: saved.filter((i) => i.kind === 'prayer').length,
    verse: saved.filter((i) => i.kind === 'verse').length,
    sermon: saved.filter((i) => i.kind === 'sermon').length,
  }), [saved]);

  const folders = useMemo(() => {
    const map = new Map();
    saved.forEach((item) => {
      const tags = (item.tags && item.tags.length) ? item.tags : [UNTAGGED];
      tags.forEach((tag) => {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag).push(item);
      });
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [saved]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return folders;
    return folders
      .map(([tag, list]) => [tag, list.filter((i) => `${i.title} ${i.text} ${i.scripture_ref || ''}`.toLowerCase().includes(q))])
      .filter(([, list]) => list.length);
  }, [folders, query]);

  const toggle = (tag) => setOpen((o) => ({ ...o, [tag]: !o[tag] }));
  const listen = (item) => speakEvangel({ text: `${item.title || item.scripture_ref || ''}. ${item.text || ''}`, premiumVoice, fallbackVoiceName: voiceName });
  const remove = async (item) => {
    const name = item.title || item.scripture_ref || 'this saved item';
    if (!window.confirm(`Delete "${name }"? This cannot be undone.`)) return;
    try {
      await deleteFaithItem(item.id);
      setItems((current) => current.filter((savedItem) => savedItem.id !== item.id));
      await onDeleted?.();
      notify?.('Saved item deleted.');
    } catch {
      notify?.('Could not delete this item. Please try again.');
    }
  };

  return (
    <section className="page">
      <div className="page-title">
        <div>
          <p className="eyebrow">MY LIBRARY</p>
          <h2>Prayers, Scripture & Sermons — sorted by tag.</h2>
          <p>Open a folder to find what you saved, or search across everything at once.</p>
        </div>
      </div>

      <div className="library-stats">
        <div className="glass library-stat"><small>PRAYERS</small><strong>{counts.prayer}</strong></div>
        <div className="glass library-stat"><small>SCRIPTURE</small><strong>{counts.verse}</strong></div>
        <div className="glass library-stat"><small>SERMONS</small><strong>{counts.sermon}</strong></div>
      </div>

      <div className="search">
        <FolderOpen size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your prayers, scripture, and sermons…" />
      </div>

      <div className="library-folders">
        {filtered.length === 0 && <p className="empty">No items match yet. Save prayers, scripture, or sermons to fill your library.</p>}
        {filtered.map(([tag, list]) => (
          <div className="glass library-folder" key={tag}>
            <button className="library-folder-head" onClick={() => toggle(tag)} aria-expanded={!!open[tag]}>
              <FolderOpen size={18} />
              <span>{tag}</span>
              <em>{list.length}</em>
              <ChevronDown size={18} className={open[tag] ? 'flip' : ''} />
            </button>
            {open[tag] && (
              <div className="library-folder-items">
                {list.map((item) => (
                  <article className="library-item" key={item.id}>
                    <small>{KIND_LABEL[item.kind]}</small>
                    <strong>{item.title || item.scripture_ref || 'Saved item'}</strong>
                    <p>{item.text}</p>
                    <div className="faith-actions">
                      <button onClick={() => listen(item)}><Volume2 size={15} /> Listen</button>
                      {item.scripture_ref && <button onClick={() => onNavigate?.('study')}>Open in Study</button>}
                      <button className="danger" onClick={() => remove(item)} aria-label={`Delete ${item.title || 'saved item'}`}><Trash2 size={15} /> Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}