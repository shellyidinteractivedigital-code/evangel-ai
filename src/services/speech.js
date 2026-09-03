export function speakText({ text, voiceName, rate = 0.95, volume = 1 }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const chosen = voices.find((voice) => voice.name === voiceName);
  if (chosen) utterance.voice = chosen;
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = volume;
  window.speechSynthesis.speak(utterance);
  return true;
}