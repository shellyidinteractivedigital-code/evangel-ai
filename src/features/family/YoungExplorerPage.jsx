import { useEffect, useState } from 'react';
import { BookOpen, Heart, Mic, ShieldCheck, Sparkles } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import KidsAnimalsSection from './KidsAnimalsSection';

export default function YoungExplorerPage({ onNavigate, notify, voiceName, premiumVoice }) {
  const [profiles, setProfiles] = useState([]);
  const [nickname, setNickname] = useState('');

  const load = async () => {
    try {
      const u = await base44.auth.me();
      setProfiles(await base44.entities.ChildProfile.filter({ parent_user_id: u.id }));
    } catch {
      setProfiles([]);
    }
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!nickname.trim()) return;
    const u = await base44.auth.me();
    await base44.entities.ChildProfile.create({
      parent_user_id: u.id,
      nickname: nickname.trim(),
      age_band: 'young_explorer',
      mic_enabled: false,
      saved_voice_notes_enabled: false,
      external_sharing_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setNickname('');
    load();
    notify?.('Young Explorer profile created');
  };

  return (
    <section className="page family-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">EVANGEL FAMILY</p>
          <h2>A safe place for young questions about God.</h2>
          <p>Young Explorer is written so a beginning reader can understand it, while parents control microphone, saved voice, sharing, and purchases.</p>
        </div>
      </div>

      <KidsAnimalsSection voiceName={voiceName} premiumVoice={premiumVoice} notify={notify} />

      <div className="young-explorer glass">
        <h3>Hi! Welcome to EVANGEL.</h3>
        <p>We can read Bible stories, ask questions, say prayers, and save the things you want to remember.</p>
        <div className="kid-actions">
          <button onClick={() => onNavigate('study')}><BookOpen /> READ<small>Hear a Bible story</small></button>
          <button onClick={() => onNavigate('scholar')}><Sparkles /> ASK<small>Ask about God or the Bible</small></button>
          <button onClick={() => onNavigate('journal')}><Heart /> PRAY<small>Say a prayer</small></button>
          <button onClick={() => onNavigate('space')}><Sparkles /> REMEMBER<small>My Bible World</small></button>
        </div>
        <p className="kid-safety"><ShieldCheck size={18} /> Some things need your grown-up. Buying, sharing outside EVANGEL, and important settings stay behind parent controls.</p>
      </div>

      <div className="parent-panel glass">
        <h3>Parent controls</h3>
        <p>Microphone and external sharing start OFF. Saved voice notes start OFF for under-13 profiles.</p>
        <div className="inline-form">
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Child nickname or first name" />
          <button className="primary" onClick={add}>Add Young Explorer</button>
        </div>
        {profiles.map((p) => (
          <div className="profile-row" key={p.id}>
            <strong>{p.nickname}</strong>
            <span>{p.age_band.replace('_', ' ')}</span>
            <span><Mic size={14} /> Mic {p.mic_enabled ? 'on' : 'off'}</span>
          </div>
        ))}
      </div>
    </section>
  );
}