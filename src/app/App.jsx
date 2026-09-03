import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Car, CircleUserRound, Download, Home, LibraryBig, Mic, Settings, SquarePen } from 'lucide-react';
import { NAV_ITEMS } from './navigation';
import { STARTER_SCRIPTURE } from '../data/starterScripture';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSpeechVoices } from '../hooks/useSpeechVoices';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { speakEvangel } from '../services/evangelVoice';
import { speechRecognitionErrorMessage } from '../services/speechRecognition';
import { toFaithItem } from '../services/faithItems';
import { loadScripture } from '../services/scripture';
import { getDailyVerse, getLocalDayKey } from '../services/dailyVerse';
import { listMyFaithItems, saveFaithItem } from '../services/faithLibrary';
import { parseDriveCommand } from '../features/drive/driveCommands';
import { answerDriveQuestion } from '../features/drive/driveAnswers';
import { applySermonCommand, buildDriveEmail } from '../features/drive/driveSermon';
import HomePage from '../features/home/HomePage';
import DrivePage from '../features/drive/DrivePage';
import ScholarPage from '../features/scholar/ScholarPage';
import StudyPage from '../features/study/StudyPage';
import FaithSpacePage from '../features/faith-space/FaithSpacePage';
import JournalPage from '../features/journal/JournalPage';
import SermonPage from '../features/creator/SermonPage';
import CreatePage from '../features/create/CreatePage';
import LibraryPage from '../features/library/LibraryPage';
import VoicesPage from '../features/voices/VoicesPage';
import BillingPage from '../features/billing/BillingPage';
import LegalPage from '../features/legal/LegalPage';
import SupportPage from '../features/support/SupportPage';
import AboutPage from '../features/about/AboutPage';
import GroupsPage from '../features/groups/GroupsPage';
import YoungExplorerPage from '../features/family/YoungExplorerPage';
import NotesPage from '../features/notes/NotesPage';
import SharedItemPage from '../features/share/SharedItemPage';
import EvangelBot from '../components/EvangelBot';

const VERSES = STARTER_SCRIPTURE;

export default function App() {
  const initialParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const shareToken = initialParams?.get('share') || '';
  const initialPage = shareToken ? 'shared' : (initialParams?.get('page') || 'home');
  const [page, setPage] = useState(initialPage);
  const navigatePage = (nextPage) => {
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextPage === 'home') url.searchParams.delete('page'); else url.searchParams.set('page', nextPage);
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };
  const [verseIndex, setVerseIndex] = useState(-1);
  const [scriptureCorpus, setScriptureCorpus] = useState([]);
  const [dailyVerse, setDailyVerse] = useState(STARTER_SCRIPTURE[0]);
  const [dailyVerseKey, setDailyVerseKey] = useState(() => getLocalDayKey(new Date()));
  const [saved, setSaved] = useLocalStorage('evangel.saved', []);
  const [journals, setJournals] = useLocalStorage('evangel.journals', []);
  const [highlights, setHighlights] = useLocalStorage('evangel.highlights', []);
  const [voiceName, setVoiceName] = useLocalStorage('evangel.voice', '');
  const [premiumVoice, setPremiumVoice] = useLocalStorage('evangel.premiumVoice', 'marin');
  const [remoteFaithItems, setRemoteFaithItems] = useState([]);
  const [creatorSource, setCreatorSource] = useState(null);
  const voices = useSpeechVoices();
  const [query, setQuery] = useState('');
  const [journalText, setJournalText] = useState('');
  const [sermon, setSermon] = useState({ title: '', text: '', application: '', illustration: '', prayer: '' });
  const [driveAnswer, setDriveAnswer] = useState(null);
  const [toast, setToast] = useState('');
  const exploreVerse = verseIndex < 0 ? dailyVerse : VERSES[verseIndex % VERSES.length];
  const verse = exploreVerse;

  const refreshFaithItems = useCallback(async () => {
    try {
      const records = await listMyFaithItems();
      setRemoteFaithItems(Array.isArray(records) ? records : []);
    } catch {
      setRemoteFaithItems([]);
    }
  }, []);

  useEffect(() => {
    if (page === 'space') refreshFaithItems();
  }, [page, refreshFaithItems]);

  useEffect(() => {
    let active = true;
    loadScripture()
      .then((corpus) => {
        if (!active) return;
        setScriptureCorpus(corpus);
        const selected = getDailyVerse(corpus, new Date());
        if (selected) setDailyVerse(selected);
      })
      .catch(() => {
        if (active) setDailyVerse(STARTER_SCRIPTURE[0]);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!scriptureCorpus.length) return undefined;
    const timer = window.setInterval(() => {
      const now = new Date();
      const nextKey = getLocalDayKey(now);
      if (nextKey === dailyVerseKey) return;
      const selected = getDailyVerse(scriptureCorpus, now);
      if (selected) {
        setDailyVerse(selected);
        setDailyVerseKey(nextKey);
        setVerseIndex(-1);
        setDriveAnswer(null);
      }
    }, 60000);
    return () => window.clearInterval(timer);
  }, [scriptureCorpus, dailyVerseKey]);

  const libraryItems = useMemo(() => [
    ...remoteFaithItems.map((item) => toFaithItem({
      id: item.id,
      kind: item.kind || 'note',
      title: item.title || item.scripture_ref || 'Saved item',
      text: item.text || '',
      ref: item.scripture_ref || '',
      color: item.color || '',
      tags: item.tags || [],
      createdAt: item.created_at,
      spatial: item.spatial || null,
    })),
    ...saved.map((item, index) => toFaithItem({ ...item, title: item.ref, kind: 'verse', id: `local-v-${index}` })),
    ...journals.map((item, index) => toFaithItem({ ...item, title: item.title || 'Journal', kind: item.kind || 'journal', id: item.id || `local-j-${index}`, createdAt: item.date })),
    ...highlights.map((item, index) => toFaithItem({ ...item, title: item.ref, kind: 'highlight', id: `local-h-${index}` })),
  ], [remoteFaithItems, saved, journals, highlights]);

  const notify = (message) => { setToast(message); setTimeout(() => setToast(''), 2200); };
  const saveVerse = () => {
    if (!saved.some((item) => item.ref === verse.ref)) setSaved([...saved, verse]);
    notify('Saved to your Faith Space');
  };
  const saveDailyVerse = () => {
    if (!saved.some((item) => item.ref === dailyVerse.ref)) setSaved([...saved, dailyVerse]);
    notify('Official daily verse saved to your Faith Space');
  };
  const addFaithNote = async (note) => {
    try {
      await saveFaithItem({ kind: note.kind || 'note', title: note.title || 'Note', text: note.text || '' });
      await refreshFaithItems();
    } catch {
      setJournals([{ id: `j-${Date.now()}`, title: note.title || 'Note', text: note.text || '', date: new Date().toISOString(), kind: note.kind || 'note' }, ...journals]);
    }
    notify('Saved to your Faith Space');
  };
  const saveDriveMoment = () => {
    saveVerse();
    if (driveAnswer?.answer) setJournals([{ id: `j-${Date.now()}`, title: `${verse.ref} reflection`, text: driveAnswer.answer, date: new Date().toISOString(), kind: 'drive_reflection' }, ...journals]);
  };
  const nextVerse = () => { setVerseIndex((value) => value < 0 ? 0 : (value + 1) % VERSES.length); setDriveAnswer(null); };
  const openFaithItem = (item) => {
    const ref = item.ref || item.scripture_ref || '';
    if (ref) setQuery(ref);
    if (['verse','highlight','study','word_study'].includes(item.kind)) {
      navigatePage('study');
      return;
    }
    if (item.kind === 'sermon') {
      setSermon({ title: item.title || '', text: item.text || '', application: '', illustration: '', prayer: '' });
      navigatePage('sermon');
      return;
    }
    if (['journal','drive_reflection','prayer','answered_prayer','voice_note'].includes(item.kind)) {
      setJournalText(item.text || '');
      navigatePage('journal');
      return;
    }
    if (item.kind === 'note') {
      navigatePage('notes');
      return;
    }
    navigatePage('space');
  };

  const startCreatorFromNote = (item) => {
    setCreatorSource(item);
    navigatePage('create');
    notify('Note added to Creator');
  };

  const studyVerses = scriptureCorpus.length ? scriptureCorpus : VERSES;
  const filteredVerses = query.trim() ? studyVerses.filter((item) => `${item.ref} ${item.text}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100) : studyVerses.slice(0, 100);
  const say = (text) => speakEvangel({ text, premiumVoice, fallbackVoiceName: voiceName });
  const startSermon = () => {
    setSermon((current) => applySermonCommand(current, { type: 'sermon_start' }, verse));
    notify('Sermon draft started');
    say('Sermon draft started. Say title, point one, application, illustration, closing prayer, or email me.');
  };
  const emailDriveWork = () => {
    if (typeof window !== 'undefined') window.location.href = buildDriveEmail({ verse, answer: driveAnswer?.answer || '', sermon });
  };

  const handleTranscript = (transcript) => {
    const command = parseDriveCommand(transcript);
    if (command.type === 'next') return nextVerse();
    if (command.type === 'save') return saveDriveMoment();
    if (command.type === 'play' || command.type === 'repeat') return say(driveAnswer?.answer || `${verse.ref}. ${verse.text}`);
    if (command.type === 'email') return emailDriveWork();
    if (command.type === 'sermon_start') return startSermon();
    if (command.type.startsWith('sermon_')) {
      setSermon((current) => applySermonCommand(current, command, verse));
      notify('Sermon draft updated');
      return say('Added to your sermon draft.');
    }
    if (command.type === 'ask') {
      const result = answerDriveQuestion({ question: command.value, verse });
      setDriveAnswer(result);
      setQuery(command.value);
      return say(`${result.answer} ${result.nextAction}`);
    }
  };
  const { listening, supported: recognitionSupported, start: beginRecognition, lastError } = useSpeechRecognition({ onTranscript: handleTranscript, onError: (code) => notify(speechRecognitionErrorMessage(code)) });
  const recognitionStatus = listening ? 'listening' : lastError ? 'blocked' : 'ready';
  const startRecognition = () => {
    if (!recognitionSupported) { notify('Voice recognition is not supported here. Type your request in Bible Study instead.'); return; }
    beginRecognition();
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ saved, journals, highlights, sermon }, null, 2)], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'evangel-library.json';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  return <div className="app-shell">
    <aside className="side-nav glass"><button className="brand" onClick={() => navigatePage('home')}><span className="brand-mark">✦</span><span><b>EVANGEL</b><small>Scripture • Precision • Presence</small></span></button><nav>{NAV_ITEMS.map(([id,label,Icon]) => <button key={id} className={page===id?'active':''} onClick={() => navigatePage(id)}><Icon size={20}/><span>{label}</span></button>)}</nav><div className="sidebar-foot"><button onClick={exportData}><Download size={18}/> Export My Library</button><button onClick={() => navigatePage('voices')}><Settings size={18}/> Settings</button></div></aside>
    <main className="main"><header className="topbar glass"><div className="mobile-brand">✦ <b>EVANGEL</b></div><div className="top-actions"><button className="pill gold" onClick={() => navigatePage('drive')}><Car size={16}/> DRIVE</button><button className="pill" onClick={() => navigatePage('space')}><LibraryBig size={16}/> FAITH SPACE</button><button className={`mic ${listening?'listening':''}`} onClick={startRecognition} aria-label="Voice command"><Mic size={21}/></button><CircleUserRound size={24}/></div></header>
      {page==='home' && <HomePage verse={dailyVerse} voiceName={voiceName} premiumVoice={premiumVoice} onNavigate={navigatePage} onSaveVerse={saveDailyVerse}/>} 
      {page==='drive' && <DrivePage verse={verse} voiceName={voiceName} premiumVoice={premiumVoice} micStatus={recognitionStatus} answer={driveAnswer} sermon={sermon} listening={listening} onAsk={startRecognition} onNext={nextVerse} onSave={saveDriveMoment} onEmail={emailDriveWork} onSermon={startSermon} onRepeat={() => say(driveAnswer?.answer || `${verse.ref}. ${verse.text}`)}/>} 
      {page==='scholar' && <ScholarPage/>}
      {page==='study' && <StudyPage query={query} onQueryChange={setQuery} verses={filteredVerses} highlights={highlights} onHighlightsChange={setHighlights} notify={notify} voiceName={voiceName}/>} 
      {page==='space' && <FaithSpacePage items={libraryItems} notify={notify} onAddFaithNote={addFaithNote} onOpenItem={openFaithItem} premiumVoice={premiumVoice} fallbackVoiceName={voiceName} onReload={refreshFaithItems}/>} 
      {page==='journal' && <JournalPage journalText={journalText} onJournalTextChange={setJournalText} journals={journals} onJournalsChange={setJournals} notify={notify} voiceName={voiceName} premiumVoice={premiumVoice}/>} 
      {page==='sermon' && <SermonPage sermon={sermon} onSermonChange={setSermon} verse={verse} notify={notify} onSaved={refreshFaithItems}/>} 
      {page==='create' && <CreatePage notify={notify} voiceName={voiceName} premiumVoice={premiumVoice} onSaved={refreshFaithItems} verse={verse} sourceItem={creatorSource} onClearSource={() => setCreatorSource(null)}/>}
      {page==='library' && <LibraryPage notify={notify} voiceName={voiceName} premiumVoice={premiumVoice} onNavigate={navigatePage} onDeleted={refreshFaithItems}/>} 
      {page==='voices' && <VoicesPage voices={voices} voiceName={voiceName} onVoiceNameChange={setVoiceName} premiumVoice={premiumVoice} onPremiumVoiceChange={setPremiumVoice}/>} 
      {page==='billing' && <BillingPage/>}
      {['privacy','terms','refunds','cancellation'].includes(page) && <LegalPage type={page} onNavigate={navigatePage}/>}
      {page==='support' && <SupportPage onNavigate={navigatePage}/>} 
      {page==='about' && <AboutPage/>}
      {page==='groups' && <GroupsPage notify={notify}/>} 
      {page==='family' && <YoungExplorerPage onNavigate={navigatePage} notify={notify} voiceName={voiceName} premiumVoice={premiumVoice}/>} 
      {page==='notes' && <NotesPage notify={notify} onStartCreator={startCreatorFromNote}/>} 
      {page==='shared' && <SharedItemPage token={shareToken} notify={notify}/>} 
    </main>
    <nav className="mobile-nav glass">{[['home',Home,'Home'],['space',LibraryBig,'Faith'],['drive',Mic,'Listen'],['study',BookOpen,'Study'],['journal',SquarePen,'Journal']].map(([id,Icon,label]) => <button className={page===id?'active':''} key={id} onClick={() => navigatePage(id)}><Icon size={21}/><small>{label}</small></button>)}</nav>
    <footer className="legal-footer"><span>EVANGEL by Heartmonics</span><button onClick={()=>navigatePage('about')}>About</button><button onClick={()=>navigatePage('groups')}>Groups</button><button onClick={()=>navigatePage('privacy')}>Privacy</button><button onClick={()=>navigatePage('terms')}>Terms</button><button onClick={()=>navigatePage('refunds')}>Refunds</button><button onClick={()=>navigatePage('cancellation')}>Cancellation</button><button onClick={()=>navigatePage('support')}>Support</button><a href="mailto:support.evangel@gmail.com">support.evangel@gmail.com</a></footer>
    <EvangelBot page={page} onNavigate={navigatePage} passage={verse} notify={notify} voiceName={voiceName} premiumVoice={premiumVoice} onUseInCreator={startCreatorFromNote}/>
    {toast && <div className="toast">{toast}</div>}
  </div>;
}