import { Bookmark, Highlighter, NotebookPen, Share2 } from 'lucide-react';
import { nativeShare } from '../services/share';

export default function FaithActions({item,onSave,onNote,onHighlight,shareUrl,notify}){
  const share=async()=>{try{const result=await nativeShare(item,shareUrl);notify?.(result==='copied'?'Copied for sharing':'Share opened');}catch{notify?.('Sharing was canceled.');}};
  return <div className="faith-actions" aria-label="Faith item actions">
    {onSave&&<button onClick={()=>onSave(item)}><Bookmark size={16}/> Save</button>}
    {onNote&&<button onClick={()=>onNote(item)}><NotebookPen size={16}/> Note</button>}
    {onHighlight&&<button onClick={()=>onHighlight(item)}><Highlighter size={16}/> Highlight</button>}
    <button onClick={share}><Share2 size={16}/> Share</button>
  </div>;
}