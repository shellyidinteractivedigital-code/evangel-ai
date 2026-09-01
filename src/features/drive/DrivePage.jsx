import { BookOpenCheck, Heart, Mail, Mic, Play, Repeat2, Sparkles } from 'lucide-react';
import { speakEvangel } from '../../services/evangelVoice';

export default function DrivePage({ verse, voiceName, premiumVoice, answer, sermon, listening, micStatus, onAsk, onNext, onSave, onEmail, onSermon, onRepeat }) {
  const sermonStarted = Boolean(sermon?.title || sermon?.text || sermon?.application || sermon?.illustration || sermon?.prayer);
  return <section className="page drive-page">
    <div className="ambient-sky" aria-hidden="true"><span className="ambient-glow"/><span className="ambient-cloud ambient-cloud-a"/><span className="ambient-cloud ambient-cloud-b"/></div>
    <div className="drive-status">DRIVE SANCTUARY <span>• voice first • eyes on the road</span></div>
    <div className="drive-card glass">
      <p className="eyebrow">{listening ? 'LISTENING' : micStatus === 'blocked' ? 'MIC BLOCKED' : 'MIC READY'}</p>
      <h2>{verse.ref}</h2>
      <blockquote>{verse.text}</blockquote>
      <button className="drive-play" onClick={() => speakEvangel({ text: `${verse.ref}. ${verse.text}`, premiumVoice, fallbackVoiceName: voiceName })}><Play size={30}/> PLAY VERSE</button>
      <div className="drive-actions drive-actions-primary">
        <button className={listening ? 'is-listening' : ''} onClick={onAsk}><Mic/> {listening ? 'LISTENING' : 'ASK'}</button>
        <button onClick={onSermon}><BookOpenCheck/> SERMON</button>
        <button onClick={onSave}><Heart/> SAVE</button>
      </div>
      <div className="drive-actions drive-actions-secondary">
        <button onClick={onEmail}><Mail/> EMAIL ME</button>
        <button onClick={onRepeat}><Repeat2/> REPEAT</button>
        <button onClick={onNext}><Sparkles/> NEXT</button>
      </div>
      {answer?.answer && <div className="drive-answer glass" aria-live="polite"><small>EVANGEL ANSWER</small><p>{answer.answer}</p><span>{answer.nextAction}</span></div>}
      {sermonStarted && <div className="sermon-status"><BookOpenCheck size={17}/><span><b>Sermon draft active</b>{sermon.title ? ` • ${sermon.title}` : ' • say “title,” “point one,” “application,” “illustration,” or “closing prayer”'}</span></div>}
      <p className="safety-note">Speak your request. EVANGEL will answer aloud and save your ideas. Full reading and editing wait until you are safely parked.</p>
    </div>
  </section>;
}