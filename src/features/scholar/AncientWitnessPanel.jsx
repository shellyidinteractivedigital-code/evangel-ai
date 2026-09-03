import { ExternalLink, Landmark, ScrollText } from 'lucide-react';
import { EXTERNAL_WITNESSES, SOURCE_TIMELINE } from '../../data/bibleSources';

export default function AncientWitnessPanel(){
  return <section className="ancient-witness-section">
    <div className="page-title"><div><p className="eyebrow">SOURCE TIMELINE</p><h3>Where the witnesses sit in history.</h3><p>A manuscript, an ancient-language text, a modern critical edition, and a translation are different kinds of evidence. Truth Mode keeps them separate.</p></div></div>
    <div className="source-timeline glass">
      {SOURCE_TIMELINE.map((item,index)=><div className="timeline-item" key={`${item.title}-${index}`}><span className="timeline-dot"></span><div><small>{item.era}</small><strong>{item.title}</strong><em>{item.category.replaceAll('_',' ')}</em></div></div>)}
    </div>

    <div className="page-title ancient-title"><div><p className="eyebrow">ANCIENT WITNESSES & OFFICIAL COMPARISONS</p><h3>Go to the holding source when EVANGEL should not reproduce it.</h3></div></div>
    <div className="witness-grid">
      {EXTERNAL_WITNESSES.map(item=><article className="glass witness-card" key={item.key}>
        {item.category==='manuscript_witness'?<Landmark/>:<ScrollText/>}
        <small>{item.era}</small>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <div className="witness-meta"><span>{item.category.replaceAll('_',' ')}</span><span>{item.rights}</span></div>
        <a href={item.url} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Official external source</a>
      </article>)}
    </div>
  </section>;
}