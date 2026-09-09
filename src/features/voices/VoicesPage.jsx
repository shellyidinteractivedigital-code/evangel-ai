import { Headphones, Mic, Square, Volume2 } from 'lucide-react';
import { speakText } from '../../services/speech';
import { PREMIUM_VOICES, playPremiumSpeech } from '../../services/premiumVoice';
import { useAskTheWord } from '../../hooks/useAskTheWord';

const PREVIEW='Be still, and know that I am God.';

export default function VoicesPage({ voices, voiceName, onVoiceNameChange, premiumVoice, onPremiumVoiceChange }) {
  const ask=useAskTheWord();
  return <section className="page voices-page"><div className="page-title"><div><p className="eyebrow">VOICE SANCTUARY</p><h2>Choose how the Word meets you.</h2><p>Premium neural voices are offered when the secure voice service is configured. Device voices remain available as a private, resilient fallback.</p></div></div>
    <div className="premium-voice-grid">{PREMIUM_VOICES.map(v=><article className={`premium-voice-card glass ${premiumVoice===v.key?'selected':''}`} key={v.key}><Headphones/><small>EVANGEL PREMIUM • {v.key.toUpperCase()} • {v.presentation.toUpperCase()}</small><h3>{v.name}</h3><p>{v.style}</p><button className="primary" onClick={()=>{onPremiumVoiceChange?.(v.key);playPremiumSpeech({text:PREVIEW,voice:v.key,fallbackVoiceName:voiceName});}}><Volume2 size={17}/> {premiumVoice===v.key?'SELECTED':'Use This Voice'}</button>{v.realtimeCompatible?<button className="secondary" onClick={()=>ask.status==='listening'?ask.stop():ask.start(v.key)}>{ask.status==='listening'?<Square size={17}/>:<Mic size={17}/>} {ask.status==='listening'?'Stop Ask the Word':'Ask the Word'}</button>:<small>Narration only</small>}</article>)}</div>
    {ask.status==='error'&&<div className="billing-error" role="alert">Realtime voice is not configured yet. Device microphone commands remain available.</div>}
    <div className="page-title voice-device-title"><div><p className="eyebrow">ON THIS DEVICE</p><h3>More voices already on your phone or computer.</h3></div></div>
    <div className="voice-grid">{voices.map(v=><button key={`${v.name}-${v.lang}`} className={`voice-card glass ${voiceName===v.name?'selected':''}`} onClick={()=>{onVoiceNameChange(v.name);speakText({text:PREVIEW,voiceName:v.name});}}><Volume2/><strong>{v.name}</strong><span>{v.lang}</span>{voiceName===v.name&&<small>SELECTED</small>}</button>)}</div>{!voices.length&&<div className="empty glass">No device voices were returned yet. Premium voices can still work when the server voice service is configured.</div>}
  </section>;
}