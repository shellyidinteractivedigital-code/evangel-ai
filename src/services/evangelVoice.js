import { playPremiumSpeech } from './premiumVoice';
import { speakText } from './speech';

export async function speakEvangel({ text, premiumVoice = 'marin', fallbackVoiceName = '' }) {
  if (!text) return { premium: false };
  try {
    return await playPremiumSpeech({ text, voice: premiumVoice, fallbackVoiceName });
  } catch (error) {
    speakText({ text, voiceName: fallbackVoiceName });
    return { premium: false, error };
  }
}