import { Save, Volume2 } from 'lucide-react';
import { speakEvangel } from '../../services/evangelVoice';
import DictateButton from '../../components/DictateButton';

export default function JournalPage({ journalText, onJournalTextChange, journals, onJournalsChange, notify, voiceName, premiumVoice }) {
  const saveJournal = () => {
    if (!journalText.trim()) return;
    onJournalsChange([...journals,{title:`Journal ${journals.length+1}`,text:journalText,date:new Date().toISOString()}]);
    onJournalTextChange('');
    notify('Journal saved');
  };
  return <section className="page"><div className="page-title"><div><p className="eyebrow">LIVING JOURNAL</p><h2>Save what moved you.</h2></div></div><div className="editor glass"><input placeholder="Title"/><textarea value={journalText} onChange={e=>onJournalTextChange(e.target.value)} placeholder="A verse, thought, question, prayer, or reflection..."/><div className="editor-actions"><DictateButton onDictate={(t)=>onJournalTextChange((journalText?journalText+' ':'')+t)} notify={notify} label="Dictate"/><button className="primary" onClick={saveJournal}><Save size={18}/> Save to My Space</button><button className="secondary" onClick={()=>speakEvangel({ text: journalText, premiumVoice, fallbackVoiceName: voiceName })}><Volume2 size={18}/> Read Back</button></div></div><div className="journal-grid">{journals.slice().reverse().map((journal,index)=><article className="glass journal-card" key={index}><small>{new Date(journal.date).toLocaleDateString()}</small><p>{journal.text}</p></article>)}</div></section>;
}