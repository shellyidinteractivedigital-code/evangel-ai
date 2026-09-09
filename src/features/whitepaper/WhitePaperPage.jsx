import EvangelMark from '../../components/brand/EvangelMark';
import SparklingStars from '../../components/brand/SparklingStars';
import { EVANGEL_WHITE_PAPER } from '../../content/evangelWhitePaper';

export default function WhitePaperPage({onNavigate}){
 return <section className="page whitepaper-page">
  <header className="whitepaper-hero"><SparklingStars density="rich"/><EvangelMark/><p className="eyebrow">EVANGEL WHITE PAPER</p><h1>{EVANGEL_WHITE_PAPER.title}</h1><p>{EVANGEL_WHITE_PAPER.summary}</p></header>
  <nav className="whitepaper-toc glass" aria-label="White paper contents"><h2>Contents</h2>{EVANGEL_WHITE_PAPER.sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
  <article className="whitepaper-body">{EVANGEL_WHITE_PAPER.sections.map(s=><section id={s.id} key={s.id}><h2>{s.title}</h2>{s.body.map((p,i)=><p key={i}>{p}</p>)}</section>)}</article>
  <div className="whitepaper-actions"><button className="secondary" onClick={()=>onNavigate?.('about')}>About Us</button><button className="primary" onClick={()=>window.print()}>Print or Save as PDF</button></div>
 </section>;
}