import { Mail, ShieldCheck } from 'lucide-react';
import { LEGAL_META } from '../../data/legalContent';

export default function SupportPage({ onNavigate }) {
  return <section className="page support-page">
    <div className="page-title"><div><p className="eyebrow">EVANGEL SUPPORT</p><h2>We are here to help.</h2><p>Account, billing, privacy, family, and product questions can all start here.</p></div></div>
    <div className="support-grid">
      <article className="glass support-card"><Mail/><h3>Email support</h3><p>For account help, billing questions, privacy requests, or general support.</p><a className="primary" href={`mailto:${LEGAL_META.supportEmail}`}>{LEGAL_META.supportEmail}</a></article>
      <article className="glass support-card"><ShieldCheck/><h3>Billing & subscriptions</h3><p>Web subscriptions use Stripe-hosted Checkout and billing management. EVANGEL does not store your full card number or CVC.</p><button className="secondary" onClick={()=>onNavigate?.('billing')}>Open EVANGEL Plus</button></article>
    </div>
    <div className="support-links glass"><strong>Policies</strong><button onClick={()=>onNavigate?.('privacy')}>Privacy</button><button onClick={()=>onNavigate?.('terms')}>Terms</button><button onClick={()=>onNavigate?.('refunds')}>Refunds</button><button onClick={()=>onNavigate?.('cancellation')}>Cancellation</button></div>
  </section>;
}