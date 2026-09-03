import { LEGAL_CONTENT, LEGAL_META } from '../../data/legalContent';

export default function LegalPage({ type = 'privacy', onNavigate }) {
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.privacy;
  return <section className="page legal-page">
    <div className="page-title"><div><p className="eyebrow">EVANGEL • TRUST & TRANSPARENCY</p><h2>{content.title}</h2><p>{content.intro}</p><small>Effective {LEGAL_META.effectiveDate} • EVANGEL by {LEGAL_META.operator}</small></div></div>
    <div className="legal-layout">
      <nav className="legal-nav glass" aria-label="Legal pages">
        {Object.entries(LEGAL_CONTENT).map(([id,item]) => <button className={id===type?'active':''} key={id} onClick={()=>onNavigate?.(id)}>{item.title}</button>)}
        <button onClick={()=>onNavigate?.('support')}>Support</button>
      </nav>
      <article className="legal-document glass">
        <p className="legal-note">These policies describe the current EVANGEL service and are intended as operational customer disclosures. They should be reviewed for the final legal entity, jurisdictions, and app-store launch before commercial publication.</p>
        {content.sections.map(([heading, body]) => <section key={heading}><h3>{heading}</h3><p>{body}</p></section>)}
      </article>
    </div>
  </section>;
}