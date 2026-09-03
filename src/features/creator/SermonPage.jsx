import { Save, Share2 } from 'lucide-react';
import { saveFaithItem } from '../../services/faithLibrary';
import { nativeShare } from '../../services/share';
import DictateButton from '../../components/DictateButton';

export default function SermonPage({ sermon, onSermonChange, verse, notify, onSaved }) {
  const patch = (field, value) => onSermonChange({ ...sermon, [field]: value });
  const item = () => ({
    kind: 'sermon',
    title: sermon.title || `Sermon on ${verse.ref}`,
    text: [sermon.text, sermon.application, sermon.illustration, sermon.prayer].filter(Boolean).join('\n\n'),
    scripture_ref: verse.ref,
  });
  const save = async () => {
    try {
      await saveFaithItem(item());
      await onSaved?.();
      notify('Sermon saved to your Faith Space');
    } catch {
      notify('Sign in to save this sermon');
    }
  };

  return <section className="page">
    <div className="page-title"><div><p className="eyebrow">SERMON CREATOR</p><h2>From passage to message.</h2></div></div>
    <div className="sermon-grid">
      <label className="glass"><div className="field-head"><span>Title</span><DictateButton onDictate={(t)=>patch('title',(sermon.title?sermon.title+' ':'')+t)} notify={notify} label="Dictate"/></div><input value={sermon.title || ''} onChange={e => patch('title', e.target.value)}/></label>
      <label className="glass"><div className="field-head"><span>Text / Context</span><DictateButton onDictate={(t)=>patch('text',(sermon.text?sermon.text+' ':'')+t)} notify={notify} label="Dictate"/></div><textarea value={sermon.text || ''} onChange={e => patch('text', e.target.value)} placeholder={verse.ref}/></label>
      <label className="glass"><div className="field-head"><span>Application</span><DictateButton onDictate={(t)=>patch('application',(sermon.application?sermon.application+' ':'')+t)} notify={notify} label="Dictate"/></div><textarea value={sermon.application || ''} onChange={e => patch('application', e.target.value)}/></label>
      <label className="glass"><div className="field-head"><span>Illustration, story, comic or gentle humor</span><DictateButton onDictate={(t)=>patch('illustration',(sermon.illustration?sermon.illustration+' ':'')+t)} notify={notify} label="Dictate"/></div><textarea value={sermon.illustration || ''} onChange={e => patch('illustration', e.target.value)}/></label>
      <label className="glass"><div className="field-head"><span>Closing Prayer</span><DictateButton onDictate={(t)=>patch('prayer',(sermon.prayer?sermon.prayer+' ':'')+t)} notify={notify} label="Dictate"/></div><textarea value={sermon.prayer || ''} onChange={e => patch('prayer', e.target.value)}/></label>
    </div>
    <div className="editor-actions">
      <button className="primary" onClick={save}><Save size={18}/> Save Sermon</button>
      <button className="secondary" onClick={() => nativeShare(item()).then(() => notify('Share opened')).catch(() => {})}><Share2 size={18}/> Share</button>
    </div>
  </section>;
}