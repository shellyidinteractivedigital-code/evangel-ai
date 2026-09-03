import { useRef, useState } from 'react';
import { base44 } from '../api/base44Client';

export function useAskTheWord() {
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const stop = () => {
    streamRef.current?.getTracks?.().forEach(track=>track.stop());
    pcRef.current?.close?.();
    pcRef.current = null; streamRef.current = null;
    if (audioRef.current) { audioRef.current.srcObject = null; audioRef.current.remove(); audioRef.current = null; }
    setStatus('idle');
  };

  const start = async (voice='marin') => {
    stop(); setStatus('connecting');
    try {
      const pc = new RTCPeerConnection(); pcRef.current = pc;
      const audio = document.createElement('audio'); audio.autoplay = true; audio.setAttribute('playsinline',''); audioRef.current = audio;
      pc.ontrack = event => { audio.srcObject = event.streams[0]; };
      pc.createDataChannel('oai-events');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      streamRef.current = stream; stream.getTracks().forEach(track=>pc.addTrack(track,stream));
      const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
      const result = await base44.functions.invoke('voice/realtimeCall', { sdp: offer.sdp, voice });
      const payload = result?.data || result;
      if (!payload?.sdp) throw new Error(payload?.error || 'realtime_unavailable');
      await pc.setRemoteDescription({ type:'answer', sdp: payload.sdp });
      setStatus('listening');
      return true;
    } catch (error) { stop(); setStatus('error'); throw error; }
  };

  return { status, start, stop };
}