import { BookOpen, Car, Headphones, Highlighter, LibraryBig, Play, Sparkles, SquarePen } from 'lucide-react';
import { speakEvangel } from '../../services/evangelVoice';

export default function HomePage({ verse, voiceName, premiumVoice, onNavigate, onSaveVerse }) {
  const features = [
    ['Drive Sanctuary','Ask, listen, repeat, save, email and build a sermon by voice.',Car,'drive'],
    ['Study with meaning','Search passages and mark Truth, Growth, Heart or Context.',Highlighter,'study'],
    ['A living journal','Save the moment while it is alive, then return to it later.',SquarePen,'journal'],
    ['Build the sermon','Carry a passage into context, application and illustration.',Sparkles,'sermon'],
  ];
  return <section className="page home-page">
    <div className="hero-card glass">
      <div className="ambient-sky" aria-hidden="true"><span className="ambient-glow"/><span className="ambient-cloud ambient-cloud-a"/><span className="ambient-cloud ambient-cloud-b"/><span className="ambient-stars"/></div>
      <div className="hero-copy-layer"><p className="eyebrow">THE WORD IN FOCUS</p><h1>Hear it. Study it.<br/><span>Save it. Live it.</span></h1><p className="lede">A voice-first Scripture companion with a living 3D workspace for verses, questions, notes, prayers, studies, and sermons you want to return to.</p><div className="hero-actions"><button className="primary" onClick={() => onNavigate('drive')}><Headphones size={19}/> Start Listening</button><button className="secondary" onClick={() => onNavigate('space')}><LibraryBig size={19}/> Enter 3D Faith Space</button></div></div>
      <div className="verse-orb"><div className="halo"></div><BookOpen size={42}/><small>OFFICIAL DAILY VERSE</small><strong>{verse.ref}</strong><p>{verse.text}</p><button onClick={() => speakEvangel({ text: `${verse.ref}. ${verse.text}`, premiumVoice, fallbackVoiceName: voiceName })}><Play size={18}/> Read Aloud</button><button onClick={onSaveVerse}><Sparkles size={18}/> Save Daily Verse</button></div>
    </div>
    <div className="feature-grid">{features.map(([title,description,Icon,id]) => <button className="feature glass" key={title} onClick={() => onNavigate(id)}><Icon/><h3>{title}</h3><p>{description}</p></button>)}</div>
  </section>;
}