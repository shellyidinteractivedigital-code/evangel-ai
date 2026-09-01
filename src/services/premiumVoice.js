import { base44 } from '../api/base44Client';
import { speakText } from './speech';

export const PREMIUM_VOICES = [
  { key: 'marin', name: 'Gentle & Reflective', style: 'Soft, luminous, comforting', presentation: 'female' },
  { key: 'cedar', name: 'Warm & Grounded', style: 'Calm, steady, reassuring', presentation: 'male' },
];

export async function playPremiumSpeech({ text, voice = 'marin', fallbackVoiceName = '' }) {
  try {
    const result = await base44.functions.invoke('voice/synthesize', { text, voice });
    const payload = result?.data || result;
    if (!payload?.audio_base64) throw new Error(payload?.error || 'premium_voice_unavailable');
    const audio = new Audio(`data:${payload.mime || 'audio/mpeg'};base64,${payload.audio_base64}`);
    await audio.play();
    return { premium: true, audio };
  } catch (error) {
    speakText({ text, voiceName: fallbackVoiceName });
    return { premium: false, error };
  }
}