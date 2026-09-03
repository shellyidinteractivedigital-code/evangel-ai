import { useState } from 'react';
import { speakEvangel } from '../../services/evangelVoice';

const ANIMALS = [
  { emoji: '🦁', name: 'Brave Lion', line: 'The Lord gives me courage to be brave and kind.', ref: 'Proverbs 28:1' },
  { emoji: '🐑', name: 'Little Lamb', line: 'The Lord is my shepherd; I have everything I need.', ref: 'Psalm 23:1' },
  { emoji: '🕊️', name: 'Gentle Dove', line: 'The Spirit came down like a gentle, peaceful dove.', ref: 'Matthew 3:16' },
  { emoji: '🐋', name: 'Big Fish', line: 'God sent a big fish to help Jonah learn to listen.', ref: 'Jonah 1:17' },
  { emoji: '🐴', name: 'Little Donkey', line: 'Jesus rode into town on a gentle, humble donkey.', ref: 'Matthew 21:5' },
  { emoji: '🐘', name: 'Kind Elephant', line: 'Be kind and gentle to everyone, big and small.', ref: 'Ephesians 4:32' },
];

export default function KidsAnimalsSection({ voiceName, premiumVoice, notify }) {
  const [active, setActive] = useState(null);

  const hear = (a) => {
    setActive(a.name);
    speakEvangel({ text: `Hi! I'm the ${a.name}. ${a.line}`, premiumVoice, fallbackVoiceName: voiceName });
    notify?.(`${a.name} is talking!`);
  };

  return (
    <section className="kids-animals">
      <div className="kids-animals-head">
        <p className="eyebrow">BIBLE ANIMAL FRIENDS</p>
        <h2>Tiny stories, big hearts.</h2>
        <p>Tap a cute animal friend to hear a gentle Bible truth made for young explorers.</p>
      </div>
      <div className="kids-animal-grid">
        {ANIMALS.map((a) => (
          <button key={a.name} type="button" className={`kids-animal-card ${active === a.name ? 'talking' : ''}`} onClick={() => hear(a)}>
            <span className="kids-emoji" aria-hidden="true">{a.emoji}</span>
            <strong>{a.name}</strong>
            <small>{a.line}</small>
            <span className="kids-ref">{a.ref}</span>
          </button>
        ))}
      </div>
    </section>
  );
}