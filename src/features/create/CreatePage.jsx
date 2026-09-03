import { useEffect, useState } from 'react';
import { FolderPlus, Save, Share2, Sparkles, Volume2, X } from 'lucide-react';
import { listMyFaithItems, saveFaithItem } from '../../services/faithLibrary';
import { createFaithFolder, listMyFaithFolders } from '../../services/faithFolders';
import { nativeShare } from '../../services/share';
import { speakEvangel } from '../../services/evangelVoice';
import DictateButton from '../../components/DictateButton';
import FaithActions from '../../components/FaithActions';
import GeneratorInterview from '../generators/GeneratorInterview';
import GeneratedResult, { resultToText } from '../generators/GeneratedResult';
import { buildResearchBundle } from '../generators/researchBundle';
import { generateFaithContent } from '../generators/generatorClient';

const KINDS = [
  { id: 'prayer', label: 'Prayer', kind: 'prayer', generator: 'prayer', example: 'Write a prayer for a family rebuilding trust after a difficult year.' },
  { id: 'scripture', label: 'Scripture Study', kind: 'study', generator: 'scripture_study', example: 'Explain how this passage teaches courage when the future is uncertain.' },
  { id: 'sermon', label: 'Sermon', kind: 'sermon', generator: 'sermon', example: 'Create a hopeful sermon about forgiveness that opens with a story and ends with a memorable invitation.' },
];
const DEFAULT_INTERVIEW = { speakingMinutes: 20, style: 'pastoral', theologicalMode: 'text_centered', structure: 'three_point', emotionalDirection: 'hope', audience: 'general', theme: '' };
const WEB_SOURCE = { key: 'web', displayName: 'World English Bible', rights: 'Public domain' };

export default function CreatePage({ notify, voiceName, premiumVoice, onSaved, verse, sourceItem, onClearSource }) {
  const [type, setType] = useState('sermon');
  const [creationPrompt, setCreationPrompt] = useState('');
  const [supportingNotes, setSupportingNotes] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [busy, setBusy] = useState(false);
  const [interview, setInterview] = useState(DEFAULT_INTERVIEW);
  const [generated, setGenerated] = useState(null);
  const kindDef = KINDS.find((kind) => kind.id === type);

  const load = async () => {
    try {
      const [savedItems, savedFolders] = await Promise.all([listMyFaithItems(), listMyFaithFolders()]);
      setItems((savedItems || []).filter((item) => ['prayer', 'study', 'sermon'].includes(item.kind)));
      setFolders(savedFolders || []);
    } catch {
      setItems([]); setFolders([]);
    }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!sourceItem) return;
    const target = sourceItem.targetKind === 'prayer' ? 'prayer' : 'sermon';
    setType(target);
    setCreationPrompt(sourceItem.generatedAnswer ? `Improve and personalize this ${target} while preserving its central message.` : `Create a ${target} from this idea and these notes.`);
    setSupportingNotes(sourceItem.text || '');
    setTitle(sourceItem.title || 'Message from my notes');
    if (sourceItem.generatedAnswer) setText(sourceItem.text || '');
  }, [sourceItem]);

  const buildItem = (folderId = selectedFolderId) => ({
    kind: kindDef.kind,
    title: title.trim() || kindDef.label,
    text: text.trim(),
    scripture_ref: verse?.ref || sourceItem?.scripture_ref || '',
    tags: [interview.style, interview.theologicalMode, sourceItem ? 'from_note' : 'generated'],
    source_item_id: sourceItem?.id || '',
    folder_id: folderId || '',
    generator_type: generated ? kindDef.generator : '',
    generator_settings: generated ? { ...interview, creationPrompt: creationPrompt.trim() } : null,
    source_snapshot: generated ? { passage: verse || null, creationPrompt: creationPrompt.trim(), supportingNotes: supportingNotes.trim(), note: sourceItem ? { id: sourceItem.id, title: sourceItem.title } : null } : null,
  });

  const resolveFolder = async () => {
    if (!newFolderName.trim()) return selectedFolderId;
    const folder = await createFaithFolder(newFolderName);
    setSelectedFolderId(folder.id);
    setNewFolderName('');
    await listMyFaithFolders().then(setFolders);
    return folder.id;
  };

  const save = async () => {
    if (!text.trim()) return notify?.('Generate or write your draft first.');
    setBusy(true);
    try {
      const folderId = await resolveFolder();
      await saveFaithItem(buildItem(folderId));
      const folderName = folders.find((folder) => folder.id === folderId)?.name || (folderId ? 'your new folder' : 'Faith Space');
      notify?.(`${kindDef.label} saved to ${folderName}`);
      setTitle(''); setText(''); setCreationPrompt(''); setSupportingNotes(''); setGenerated(null); onClearSource?.();
      await load(); await onSaved?.();
    } catch { notify?.('Sign in to save your work and folders.'); }
    finally { setBusy(false); }
  };

  const generate = async () => {
    if (!creationPrompt.trim()) return notify?.('Tell EVANGEL what you want to create first.');
    if (!verse?.ref || !verse?.text) return notify?.('Open a Scripture passage first, then return to Create.');
    setBusy(true);
    try {
      const researchBundle = buildResearchBundle({ reference: verse.ref, passage: verse, source: WEB_SOURCE });
      const response = await generateFaithContent({
        type: kindDef.generator,
        creationPrompt: creationPrompt.trim(),
        supportingNotes: supportingNotes.trim(),
        interview,
        researchBundle,
        sourceNotes: supportingNotes.trim(),
      });
      setGenerated(response);
      setTitle(response.title || title);
      setText(resultToText(response));
      notify?.('Your idea-first draft is ready. Review and make it your own.');
    } catch (error) {
      notify?.(error?.message === 'verified_passage_required' ? 'A verified Scripture passage is required.' : error?.message === 'creation_prompt_required' ? 'Describe what you want EVANGEL to create.' : 'Generation could not finish. Please try again.');
    } finally { setBusy(false); }
  };

  const share = async () => {
    if (!text.trim()) return notify?.('Create something to share first.');
    try { await nativeShare(buildItem()); notify?.('Share opened'); } catch { notify?.('Sharing was canceled.'); }
  };
  const listen = (value) => speakEvangel({ text: value, premiumVoice, fallbackVoiceName: voiceName });

  return <section className="page">
    <div className="page-title"><div><p className="eyebrow">CREATOR</p><h2>Turn your idea into a meaningful message.</h2><p>Your idea leads. Scripture grounds it. You control the voice, length, audience, and final words.</p></div></div>
    <div className="creator-steps glass" aria-label="How to use Creator"><b>Easy instructions</b><ol><li>1. Choose Prayer, Sermon, or Scripture Study.</li><li>2. Tell EVANGEL exactly what you want.</li><li>3. Shape the length, style, audience, and feeling.</li><li>4. Generate, then edit any word.</li><li>5. Save it in a folder you choose.</li></ol></div>
    {sourceItem && <div className="source-banner glass"><div><b>Ideas added from: {sourceItem.title || 'Note'}</b><p>{sourceItem.text}</p></div><button onClick={onClearSource} aria-label="Remove note source"><X size={18}/></button></div>}
    <div className="segmented" role="tablist" aria-label="Content type">{KINDS.map((kind) => <button key={kind.id} className={`pill ${type === kind.id ? 'gold' : ''}`} onClick={() => setType(kind.id)} role="tab" aria-selected={type === kind.id}>{kind.label}</button>)}</div>
    <div className="creator-prompt glass">
      <label htmlFor="creation-prompt"><b>What do you want to create?</b><span>This is the main instruction. Be specific about the message, people, problem, story, and ending you want.</span></label>
      <textarea id="creation-prompt" value={creationPrompt} onChange={(event) => setCreationPrompt(event.target.value)} placeholder={kindDef.example} rows={5}/>
      <DictateButton onDictate={(spoken) => setCreationPrompt((value) => `${value}${value ? ' ' : ''}${spoken}`)} notify={notify} label="Speak my idea"/>
      <label htmlFor="supporting-notes"><b>Supporting notes or story, optional</b><span>Add key points, personal experiences, names, illustrations, or phrases you want included.</span></label>
      <textarea id="supporting-notes" value={supportingNotes} onChange={(event) => setSupportingNotes(event.target.value)} placeholder="Ideas, story details, key points, or a closing thought..." rows={4}/>
    </div>
    <GeneratorInterview value={interview} onChange={setInterview} disabled={busy}/>
    <div className="editor glass">
      <p className="source-line"><b>Supporting Scripture:</b> {verse?.ref || 'Choose a passage in Study'} {verse?.text ? '• WEB' : ''}</p>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={`Draft title, optional, ${kindDef.label}`}/>
      <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Your complete generated draft will appear here. You can edit every word."/>
      <div className="editor-actions">
        <button className="primary" disabled={busy || !creationPrompt.trim()} onClick={generate}><Sparkles size={18}/> {busy ? 'Creating from your idea…' : `Create my ${kindDef.label}`}</button>
        <button className="secondary" onClick={share}><Share2 size={18}/> Share</button>
        <button className="secondary" onClick={() => listen(text)}><Volume2 size={18}/> Listen</button>
      </div>
      <div className="folder-save">
        <label><span>Choose a folder</span><select value={selectedFolderId} onChange={(event) => { setSelectedFolderId(event.target.value); setNewFolderName(''); }}><option value="">Faith Space, no folder</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></label>
        <span className="folder-or">or</span>
        <label><span>Create a new folder</span><input value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)} placeholder="Sunday Sermons"/></label>
        <button className="primary" disabled={busy || !text.trim()} onClick={save}><FolderPlus size={18}/><Save size={16}/> Save to folder</button>
      </div>
    </div>
    <GeneratedResult result={generated} onUseDraft={(nextTitle, nextText) => { setTitle(nextTitle); setText(nextText); }}/>
    <div className="page-title"><div><p className="eyebrow">YOUR SAVED</p><h3>Prayers · Studies · Sermons</h3></div></div>
    <div className="saved-grid">{items.length === 0 && <p className="empty">Nothing saved yet.</p>}{items.map((item) => <article className="glass saved-card" key={item.id}><small>{item.kind?.replace('_', ' ')}{item.folder_id ? ' · foldered' : ''}</small><h3>{item.title || item.scripture_ref || 'Saved item'}</h3><p>{item.text}</p><div className="editor-actions"><button className="secondary" onClick={() => listen(`${item.title}. ${item.text}`)}><Volume2 size={16}/> Listen</button><FaithActions item={item} notify={notify}/></div></article>)}</div>
  </section>;
}