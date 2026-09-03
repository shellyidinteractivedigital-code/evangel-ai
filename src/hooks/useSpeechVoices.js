import { useEffect, useState } from 'react';

export function useSpeechVoices() {
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices?.() || []);
    load();
    window.speechSynthesis?.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', load);
  }, []);
  return voices;
}