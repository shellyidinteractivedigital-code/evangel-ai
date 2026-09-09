import { useState } from 'react';
import { Headphones, Mic, Square, Volume2 } from 'lucide-react';
import { PREMIUM_VOICES, playPremiumSpeech } from '../../services/premiumVoice';
import { useAskTheWord } from '../../hooks/useAskTheWord';

const PREVIEW = 'Be still, and know that I am God.';

function voiceErrorMessage(error) {
  const code = error?.response?.data?.error || error?.message || '';
  if (code.includes('subscription')) return 'Premium voice access is not active for this account yet.';
  if (code.includes('configured')) return 'The OpenAI voice connection is not configured in Base44 yet.';
  if (code.includes('rate')) return 'The voice limit was reached. Please try again shortly.';
  if (code.includes('provider')) return 'The connected voice provider could not complete this preview.';
  return 'That API voice could not play. No substitute voice was used.';
}

export default function VoicesPage({ premiumVoice, onPremiumVoiceChange }) {
  const ask = useAskTheWord();
  const [voiceError, setVoiceError] = useState('');
  const [previewing, setPreviewing] = useState('');

  const previewVoice = async (voice) => {
    setVoiceError('');
    setPreviewing(voice.key);
    onPremiumVoiceChange?.(voice.key);
    const result = await playPremiumSpeech({ text: PREVIEW, voice: voice.key });
    setPreviewing('');
    if (!result.premium) setVoiceError(voiceErrorMessage(result.error));
  };

  return <section className="page voices-page">
    <div className="page-title"><div>
      <p className="eyebrow">VOICE SANCTUARY</p>
      <h2>Choose how the Word meets you.</h2>
      <p>These are the six EVANGEL voices connected through the secure API. No phone or computer voices are substituted here.</p>
    </div></div>

    {(voiceError || ask.status === 'error') && <div className="billing-error" role="alert">
      {voiceError || 'Realtime voice could not connect. Your selected API voice has not been replaced.'}
    </div>}

    <div className="premium-voice-grid">{PREMIUM_VOICES.map((v) => <article className={`premium-voice-card glass ${premiumVoice === v.key ? 'selected' : ''}`} key={v.key}>
      <Headphones/>
      <small>EVANGEL API • {v.key.toUpperCase()} • {v.presentation.toUpperCase()}</small>
      <h3>{v.name}</h3>
      <p>{v.style}</p>
      <button className="primary" disabled={previewing === v.key} onClick={() => previewVoice(v)}>
        <Volume2 size={17}/> {previewing === v.key ? 'Playing...' : premiumVoice === v.key ? 'PREVIEW SELECTED VOICE' : 'Use This Voice'}
      </button>
      {v.realtimeCompatible
        ? <button className="secondary" onClick={() => ask.status === 'listening' ? ask.stop() : ask.start(v.key).catch(() => {})}>
            {ask.status === 'listening' ? <Square size={17}/> : <Mic size={17}/>} {ask.status === 'listening' ? 'Stop Ask the Word' : 'Ask the Word'}
          </button>
        : <small>Narration only</small>}
    </article>)}</div>
  </section>;
}