export function speechRecognitionErrorMessage(code='') {
  const value = String(code || '').toLowerCase();
  if (value === 'not-allowed' || value === 'service-not-allowed') return 'Microphone permission is blocked. Allow microphone access for EVANGEL in your browser or device settings, then try again.';
  if (value === 'audio-capture') return 'No working microphone was found. Check your microphone input and browser permission.';
  if (value === 'no-speech') return 'I did not hear any speech. Try again and speak after the listening indicator appears.';
  if (value === 'network') return 'Speech recognition could not reach the network service. Check your connection and try again.';
  if (value === 'aborted') return 'Listening stopped before speech was captured. Try again.';
  return 'I could not start voice recognition on this device. You can still type your request in Bible Study.';
}