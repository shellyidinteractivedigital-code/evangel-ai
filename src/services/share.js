import { base44 } from '../api/base44Client';

export function shareTextFor(item){
  const ref=item.scripture_ref||item.ref||'';
  return [item.title||ref,item.text||'',ref&&item.title!==ref?ref:''].filter(Boolean).join('\n\n');
}
export async function nativeShare(item,url){
  const text=shareTextFor(item);
  if(typeof navigator!=='undefined' && navigator.share){ await navigator.share({title:item.title||'EVANGEL',text,url}); return 'shared'; }
  if(typeof navigator!=='undefined' && navigator.clipboard){ await navigator.clipboard.writeText(url?`${text}\n\n${url}`:text); return 'copied'; }
  return 'unavailable';
}
export async function createPublicShare(faithItemId,includeNotes=false){
  const res=await base44.functions.invoke('sharing/createShareLink',{faith_item_id:faithItemId,include_notes:includeNotes});
  return res?.data||res;
}