import { base44 } from '../api/base44Client';
import { speakText } from './speech';

export const PREMIUM_VOICES = [
  { key: 'marin', name: 'Gentle Prayer', style: 'Soft, luminous, and comforting', presentation: 'female', realtimeCompatible: true },
  { key: 'cedar', name: 'Warm Sermon', style: 'Calm, grounded, and reassuring', presentation: 'male', realtimeCompatible: true },
  { key: 'onyx', name: 'Deep Pulpit', style: 'Rich, weighty, and authoritative', presentation: 'male', realtimeCompatible: false },
  { key: 'sage', name: 'Bible Study', style: 'Clear, thoughtful, and educational', presentation: 'neutral', realtimeCompatible: true },
  { key: 'ballad', name: 'Sacred Story', style: 'Expressive, heartfelt, and reflective', presentation: 'neutral', realtimeCompatible: true },
  { key: 'coral', name: 'Joyful Faith', style: 'Bright, uplifting, and welcoming', presentation: 'female', realtimeCompatible: true },
  { key: 'verse', name: 'Scripture Reading', style: 'Measured, reverent, and clear', presentation: 'neutral', realtimeCompatible: true },
  { key: 'nova', name: 'Modern Devotional', style: 'Fresh, warm, and conversational', presentation: 'female', realtimeCompatible: false },
  { key: 'fable', name: 'Gospel Narrative', style: 'Story-rich, intimate, and engaging', presentation: 'neutral', realtimeCompatible: false },
  { key: 'alloy', name: 'Everyday Encouragement', style: 'Balanced, friendly, and natural', presentation: 'neutral', realtimeCompatible: true },
  { key: 'ash', name: 'Quiet Reflection', style: 'Gentle, steady, and contemplative', presentation: 'neutral', realtimeCompatible: true },
  { key: 'echo', name: 'Bold Proclamation', style: 'Confident, resonant, and direct', presentation: 'male', realtimeCompatible: true },
  { key: 'shimmer', name: 'Hopeful Prayer', style: 'Tender, bright, and peaceful', presentation: 'female', realtimeCompatible: true },
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