import { useCallback, useRef, useState } from 'react';

export function useSpeechRecognition({ onTranscript, onError }) {
  const [listening, setListening] = useState(false);
  const [lastError, setLastError] = useState('');
  const transcriptRef = useRef(onTranscript);
  const errorRef = useRef(onError);
  const recognitionRef = useRef(null);
  transcriptRef.current = onTranscript;
  errorRef.current = onError;
  const supported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = useCallback(async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return false;
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
      recognitionRef.current?.abort?.();
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => { setLastError(''); setListening(true); };
      recognition.onresult = (event) => transcriptRef.current?.(event.results?.[0]?.[0]?.transcript || '');
      recognition.onerror = (event) => { const code = event.error || 'unknown'; setLastError(code); setListening(false); errorRef.current?.(code); };
      recognition.onend = () => { setListening(false); recognitionRef.current = null; };
      recognition.start();
      return true;
    } catch (error) {
      const code = error?.name === 'NotAllowedError' ? 'not-allowed' : 'audio-capture';
      setLastError(code);
      setListening(false);
      errorRef.current?.(code);
      return false;
    }
  }, []);

  const stop = useCallback(() => recognitionRef.current?.stop?.(), []);
  return { listening, supported, start, stop, lastError };
}