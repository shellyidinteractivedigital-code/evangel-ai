import { BadgeCheck, BookOpenText, Languages, MessageCircleQuestion, NotebookPen, Scale } from 'lucide-react';
import { TRUTH_ORDER, truthLayer } from '../../services/truthMode';

const ICONS = { scripture: BookOpenText, source_data: Languages, translation: Scale, interpretation: MessageCircleQuestion, user_reflection: NotebookPen };

export default function TruthModePanel() {
  return <section className="truth-mode glass" aria-label="EVANGEL Truth Mode">
    <div className="truth-mode-head"><BadgeCheck/><div><p className="eyebrow">TRUTH MODE</p><h3>Know what kind of statement you are reading.</h3><p>EVANGEL keeps Scripture, source evidence, translation, interpretation, and your own reflection visibly separate.</p></div></div>
    <div className="truth-mode-grid">{TRUTH_ORDER.map(key=>{const layer=truthLayer(key);const Icon=ICONS[key];return <article key={key} className={`truth-layer truth-${key}`}><Icon/><div><small>{layer.label}</small><p>{layer.description}</p></div></article>})}</div>
    <p className="truth-mode-note">When sources disagree or evidence is incomplete, EVANGEL should say so rather than fill the gap with certainty.</p>
  </section>;
}