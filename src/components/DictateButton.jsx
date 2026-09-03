import { Mic } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { speechRecognitionErrorMessage } from '../services/speechRecognition';

export default function DictateButton({ onDictate, notify, label = 'Dictate' }) {
  const { listening, supported, start, lastError } = useSpeechRecognition({
    onTranscript: (t) => { if (t) onDictate?.(t); },
    onError: (code) => notify?.(speechRecognitionErrorMessage(code)),
  });
  const onClick = () => {
    if (!supported) { notify?.('Voice input is not supported here. You can still type.'); return; }
    start();
  };
  return (
    <button type="button" className={`pill ${listening ? 'gold' : ''}`} onClick={onClick} aria-label={label}>
      <Mic size={18} />
      <span>{listening ? 'Listening…' : label}</span>
    </button>
  );
}