import { useMemo, useState } from 'react';
import { Bot, BookOpen, Clipboard, ExternalLink, FolderOpen, MessageCircle, Save, ScrollText, StickyNote, Volume2, X } from 'lucide-react';
import { askEvangel } from '../services/askEvangel';
import { saveFaithItem } from '../services/faithLibrary';
import { speakEvangel } from '../services/evangelVoice';

const LINKS = [
  { page: 'study', label: 'Study Scripture', Icon: BookOpen },
  { page: 'create', label: 'Create', Icon: ScrollText },
  { page: 'notes', label: 'My Notes', Icon: StickyNote },
  { page: 'space', label: 'Faith Space', Icon: FolderOpen },
];

const PAGE_HELP = {
  home: 'Ask for a complete prayer, sermon, or Scripture answer based on today’s passage.',
  study: 'Ask a question about the selected passage, or request a complete prayer or sermon.',
  create: 'Ask for a fresh draft, then open it in Creator to change its style and length.',
  notes: 'Ask EVANGEL to turn the theme of your notes into a prayer or sermon.',
  space: 'Ask a new question or open your saved prayers, sermons, and studies.',
  drive: 'For safety, use Drive’s large voice controls while driving.',
};

export default function EvangelBot({ page, onNavigate, passage, notify, voiceName, premiumVoice, onUseInCreator }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const guidance = useMemo(() => PAGE_HELP[page] || 'Ask for a prayer, sermon, or Scripture answer.', [page]);

  const ask = async (event) => {
    event.preventDefault();
    if (!question.trim() || busy) return;
    setBusy(true); setError(''); setAnswer(null);
    try {
      const result = await askEvangel({ question: question.trim(), page, passage: passage ? { ...passage, source: 'World English Bible' } : null, languageEvidence: [] });
      setAnswer(result);
    } catch (requestError) {
      setError(requestError?.code === 'unauthorized' ? 'Please sign in to ask EVANGEL.' : requestError?.message || 'EVANGEL could not create an answer. Please try again.');
    } finally { setBusy(false); }
  };

  const copy = async () => {
    if (!answer?.content) return;
    try { await navigator.clipboard.writeText(`${answer.title}\n\n${answer.content}`); notify?.('Answer copied'); }
    catch { notify?.('Copy is unavailable in this browser.'); }
  };

  const save = async () => {
    if (!answer?.content) return;
    const kind = answer.content_type === 'sermon' ? 'sermon' : answer.content_type === 'prayer' ? 'prayer' : 'study';
    try {
      await saveFaithItem({
        kind,
        title: answer.title,
        text: answer.content,
        scripture_ref: answer.passage?.ref || '',
        tags: ['evangel_bot', 'generated'],
        generator_type: answer.content_type === 'scripture_answer' ? 'scripture_study' : answer.content_type,
        generator_settings: { question, page },
        source_snapshot: { passage: answer.passage, question },
      });
      notify?.(`${kind === 'study' ? 'Scripture answer' : kind} saved to Faith Space`);
    } catch { notify?.('Please sign in to save this answer.'); }
  };

  const openInCreator = () => {
    if (!answer) return;
    onUseInCreator?.({
      id: '',
      title: answer.title,
      text: answer.content,
      scripture_ref: answer.passage?.ref || '',
      targetKind: answer.content_type === 'prayer' ? 'prayer' : 'sermon',
      generatedAnswer: answer,
    });
    setOpen(false);
  };

  return <div className={`evangel-bot ${open ? 'open' : ''}`}>
    {open && <section className="evangel-bot-panel glass" aria-label="EVANGEL assistant">
      <header><div><small>ASK EVANGEL</small><b><Bot size={18}/> Prayer · Sermon · Scripture</b></div><button onClick={() => setOpen(false)} aria-label="Close EVANGEL bot"><X size={18}/></button></header>
      <p>{guidance}</p>
      <form onSubmit={ask}>
        <label htmlFor="evangel-question">What would you like EVANGEL to create?</label>
        <textarea id="evangel-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Write a prayer for peace, create a sermon about forgiveness, or explain this passage." rows={3}/>
        <button className="primary evangel-ask-button" type="submit" disabled={busy || !question.trim()}>{busy ? 'Creating your answer…' : 'Ask EVANGEL'}</button>
      </form>
      {error && <div className="evangel-bot-error" role="alert"><p>{error}</p><button onClick={() => onNavigate('billing')}>Check subscription</button></div>}
      {answer && <article className="evangel-bot-result" aria-live="polite">
        <small>{answer.content_type?.replace('_', ' ')}</small>
        <h3>{answer.title}</h3>
        <div className="evangel-answer-content">{answer.content}</div>
        {answer.scripture_references?.length > 0 && <p><b>Scripture:</b> {answer.scripture_references.join(', ')}</p>}
        {answer.language_insights?.map((word) => <div className="language-insight" key={`${word.lemma}-${word.evidence_source}`}><b>{word.language}: {word.lemma}</b> <span>{word.transliteration}</span><p>{word.meaning}</p><small>{word.evidence_source}</small></div>)}
        {answer.language_notice && <p className="source-warning">{answer.language_notice}</p>}
        <small>{answer.caution}</small>
        <div className="evangel-result-actions">
          <button onClick={copy}><Clipboard size={15}/> Copy</button>
          <button onClick={() => speakEvangel({ text: `${answer.title}. ${answer.content}`, premiumVoice, fallbackVoiceName: voiceName })}><Volume2 size={15}/> Listen</button>
          <button onClick={save}><Save size={15}/> Save</button>
          <button onClick={openInCreator}><ExternalLink size={15}/> Open in Creator</button>
        </div>
      </article>}
      <div className="evangel-bot-links">{LINKS.map(({ page: target, label, Icon }) => <button key={target} onClick={() => { onNavigate(target); setOpen(false); }}><Icon size={15}/>{label}</button>)}</div>
    </section>}
    <button className="evangel-bot-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}><MessageCircle size={22}/><span>EVANGEL</span></button>
  </div>;
}