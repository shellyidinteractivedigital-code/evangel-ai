import { BookOpenText, History, Languages, Landmark, Sparkles } from 'lucide-react';

const CHANGES = [
  {
    key:'text',
    label:'Text',
    icon:BookOpenText,
    title:'The wording was transmitted, not reinvented.',
    body:'Revelation has real manuscript variants, but that is different from saying the book was wholesale rewritten. Truth Mode should show the actual variant, the witnesses behind it, and how much it changes the meaning.',
    note:'Good to know: an older English Bible is not automatically closer to the oldest Greek manuscript evidence.'
  },
  {
    key:'translation',
    label:'Translation',
    icon:Languages,
    title:'English changed a lot more than the apocalypse did.',
    body:'Different translations make different choices about Greek words, sentence structure, and manuscript readings. EVANGEL keeps the source text and the English rendering in separate lanes so we can compare without pretending they are the same thing.',
    note:'Good to know: “literal” can still involve choices. Languages are wonderfully inconvenient like that.'
  },
  {
    key:'interpretation',
    label:'Interpretation',
    icon:History,
    title:'Same book. Different questions across history.',
    body:'Early Christians, medieval interpreters, Reformation readers, and modern futurist traditions have not all asked Revelation the same questions. The history of interpretation changed dramatically even when the underlying passage did not.',
    note:'Good to know: “Christians have always believed this” is a claim worth checking, not a shortcut.'
  },
  {
    key:'culture',
    label:'Culture',
    icon:Landmark,
    title:'John wrote inside a Roman world, not outside history.',
    body:'The first readers lived among Roman civic religion, imperial imagery, temples, commerce, and social expectations. Revelation also draws densely on Hebrew Scripture, especially Daniel, Ezekiel, Isaiah, Exodus, Zechariah, and the Psalms. Both backgrounds matter.',
    note:'Good to know: a symbol can echo Hebrew Scripture and also speak into the Roman world around the first readers.'
  }
];

export default function RevelationThroughTime(){
  return <section className="revelation-through-time">
    <div className="page-title"><div><p className="eyebrow">REVELATION THROUGH TIME</p><h3>What changed, what did not, and why people read it so differently.</h3><p>A light, evidence-first tour of text, translation, interpretation, and culture. No panic board required.</p></div></div>
    <div className="revelation-change-grid">
      {CHANGES.map(({key,label,icon:Icon,title,body,note})=><article className={`glass revelation-change revelation-${key}`} key={key}>
        <div className="revelation-change-head"><Icon/><span>{label}</span></div>
        <h4>{title}</h4>
        <p>{body}</p>
        <div className="good-to-know"><Sparkles size={15}/><span><b>Good to know:</b> {note.replace(/^Good to know:\s*/,'')}</span></div>
      </article>)}
    </div>
    <div className="glass revelation-awareness-note"><strong>Awareness without overclaiming.</strong><p>EVANGEL can show when a manuscript reading changed, when a translation changed, when an interpretation changed, and when Christian culture changed. Those are four different questions, and keeping them separate makes the history much easier to understand.</p></div>
  </section>;
}