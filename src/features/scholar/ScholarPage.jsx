import { Languages } from 'lucide-react';
import { SOURCE_REGISTRY, SCHOLAR_RULES } from '../../data/scholarSources';
import TruthModePanel from '../truth/TruthModePanel';
import AncientWitnessPanel from './AncientWitnessPanel';
import RevelationThroughTime from './RevelationThroughTime';

export default function ScholarPage() {
  return <section className="page">
    <div className="page-title"><div><p className="eyebrow">ORIGINAL LANGUAGE SCHOLAR</p><h2>Greek, Hebrew and concordance without collapsing the layers.</h2><p>EVANGEL separates source text, morphology, lexical evidence, translation, textual variants and interpretation so devotional reflection never masquerades as linguistic fact.</p></div></div>
    <TruthModePanel/>
    <div className="scholar-rules">{SCHOLAR_RULES.map(([label,text])=><article className="glass scholar-rule" key={label}><small>{label}</small><p>{text}</p></article>)}</div>
    <div className="page-title"><div><p className="eyebrow">SOURCE REGISTRY</p><h3>What can be bundled, what needs attribution, and what stays link-only.</h3></div></div>
    <div className="source-table glass">{SOURCE_REGISTRY.map(src=><div className="source-row" key={src.name}><div><strong>{src.name}</strong><span>{src.layer}</span></div><div><b>{src.license}</b><span>{src.use}</span></div><em className={`source-status ${src.status}`}>{src.status}</em></div>)}</div>
    <AncientWitnessPanel/>
    <RevelationThroughTime/>
    <div className="interpretation-note glass"><Languages size={28}/><div><strong>Devotional frame</strong><p>Prayer, Christ-centered reflection, and themes such as Christ consciousness may be offered as clearly labeled spiritual interpretation. They are never presented as if a Greek or Hebrew lemma proves a theological conclusion by itself.</p></div></div>
  </section>;
}