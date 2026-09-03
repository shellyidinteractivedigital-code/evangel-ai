import { useEffect, useState } from 'react';
import { listMyFaithItems, saveFaithItem } from '../../services/faithLibrary';
import DictateButton from '../../components/DictateButton';
import FaithActions from '../../components/FaithActions';
import ConvertNoteActions from '../../components/ConvertNoteActions';

export default function NotesPage({ notify, onStartCreator }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const load = () => listMyFaithItems().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (!text.trim()) return;
    await saveFaithItem({ kind: 'note', title: 'Note', text });
    setText(''); await load(); notify?.('Note saved');
  };
  return <section className="page">
    <div className="page-title"><div><p className="eyebrow">MY NOTES & SAVED LIBRARY</p><h2>Come back to what mattered.</h2><p>Any note can become a guided prayer or sermon draft.</p></div></div>
    <div className="editor glass"><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a note, question, insight, or study thought..."/><div className="editor-actions"><DictateButton onDictate={(spoken) => setText((value) => `${value}${value ? ' ' : ''}${spoken}`)} notify={notify} label="Dictate"/><button className="primary" onClick={save}>Save Note</button></div></div>
    <div className="saved-grid">{items.map((item) => <article className="glass saved-card" key={item.id}><small>{item.kind?.replace('_', ' ')}</small><h3>{item.title || item.scripture_ref || 'Saved item'}</h3><p>{item.text}</p><FaithActions item={item} notify={notify}/>{item.kind === 'note' && <ConvertNoteActions item={item} notify={notify} onConverted={load} onStartCreator={onStartCreator}/>}</article>)}</div>
  </section>;
}