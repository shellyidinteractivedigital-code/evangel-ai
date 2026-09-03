import { useMemo, useState } from 'react';
import { BookOpenText, CheckCircle2, Heart, Highlighter, Languages, MessageCircleHeart, NotebookPen, ScrollText, Sparkles } from 'lucide-react';

const ICONS = {
  verse: BookOpenText,
  highlight: Highlighter,
  note: NotebookPen,
  journal: NotebookPen,
  prayer: Heart,
  answered_prayer: CheckCircle2,
  study: Languages,
  word_study: Languages,
  sermon: ScrollText,
  collection: Sparkles,
};

const SAMPLE_ITEMS = [
  { id:'demo-verse', kind:'verse', title:'John 1:5', text:'The light shines in the darkness, and the darkness has not overcome it.' },
  { id:'demo-prayer', kind:'prayer', title:'Prayer • Jan 12', text:'Help me keep walking toward the light.' },
  { id:'demo-journal', kind:'journal', title:'Journal', text:'This changed how I see God’s goodness in a hard season.' },
  { id:'demo-word', kind:'word_study', title:'Greek Study • φῶς', text:'phōs • light' },
  { id:'demo-sermon', kind:'sermon', title:'Sermon • Light in Darkness', text:'A study growing into something to teach.' },
  { id:'demo-answer', kind:'answered_prayer', title:'Answered • Mar 3', text:'A moment I want to remember.' },
];

const POSITIONS = [
  { x:50,y:48,z:80,scale:1.18,rot:0 },
  { x:16,y:20,z:-50,scale:.82,rot:-7 },
  { x:15,y:65,z:-25,scale:.88,rot:5 },
  { x:78,y:22,z:-45,scale:.86,rot:6 },
  { x:78,y:65,z:-30,scale:.86,rot:-5 },
  { x:51,y:15,z:-75,scale:.78,rot:2 },
  { x:34,y:34,z:-95,scale:.72,rot:-4 },
  { x:66,y:38,z:-100,scale:.72,rot:4 },
  { x:35,y:76,z:-110,scale:.68,rot:2 },
  { x:65,y:78,z:-115,scale:.68,rot:-3 },
];

function cardLabel(item){
  if(item.kind==='answered_prayer') return 'ANSWERED PRAYER';
  if(item.kind==='word_study') return 'WORD STUDY';
  return String(item.kind || 'memory').replaceAll('_',' ').toUpperCase();
}

export default function FaithSpace3D({ items = [], onSelect }) {
  const [focused,setFocused]=useState(null);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const memories=useMemo(()=>{
    const source=items.length ? items : SAMPLE_ITEMS;
    return source.slice(0,10).map((item,index)=>({ ...item, _position: POSITIONS[index % POSITIONS.length] }));
  },[items]);

  const showingSamples=!items.length;
  const primary=memories[0];
  const connectionTargets=memories.slice(1,6);
  return <div className={`faith-space-canvas celestial-faith-space ${reducedMotion?'reduced-motion':''}`} aria-label="Interactive 3D Faith Space">
    <div className="faith-sky" aria-hidden="true"><div className="faith-stars"></div><div className="faith-cloud cloud-a"></div><div className="faith-cloud cloud-b"></div><div className="faith-horizon"></div><div className="faith-light-path"></div></div>
    <svg className="faith-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {primary && connectionTargets.map((item,index)=><path key={item.id||index} d={`M 50 48 Q 50 ${36+index*7} ${item._position.x} ${item._position.y}`} />)}
    </svg>
    <div className="faith-space-stage">
      {memories.map((item,index)=>{const Icon=ICONS[item.kind]||MessageCircleHeart;const p=item._position;const active=focused===(item.id||index);return <button
        type="button"
        tabIndex={0}
        key={item.id||`${item.kind}-${index}`}
        className={`faith-memory-card faith-kind-${item.kind||'memory'} ${index===0?'hero-memory':''} ${active?'focused':''}`}
        style={{ '--x':`${p.x}%`,'--y':`${p.y}%`,'--z':`${p.z}px`,'--scale':p.scale,'--rot':`${p.rot}deg` }}
        onFocus={()=>setFocused(item.id||index)}
        onBlur={()=>setFocused(null)}
        onMouseEnter={()=>setFocused(item.id||index)}
        onMouseLeave={()=>setFocused(null)}
        onClick={()=>onSelect?.(item)}
      >
        <span className="faith-card-glow" aria-hidden="true"></span>
        <span className="faith-memory-label"><Icon size={15}/>{cardLabel(item)}</span>
        <strong>{item.title||item.ref||'Saved moment'}</strong>
        <p>{item.text||item.scripture_ref||'A moment from your journey.'}</p>
        {item.kind==='answered_prayer'&&<span className="answered-mark"><CheckCircle2 size={14}/> Answered</span>}
      </button>})}
    </div>
    <div className="faith-space-caption"><Sparkles/><div><strong>{showingSamples?'Example Faith Space':'Your faith has a memory.'}</strong><span>{showingSamples?'These are sample memories. Save your own Scripture, prayers, notes, and sermons to replace them.':'Scripture, prayers, notes, discoveries, and teaching stay connected.'}</span></div></div>
  </div>;
}