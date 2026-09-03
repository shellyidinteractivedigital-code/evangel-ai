export const TRUTH_LAYERS = Object.freeze({
  scripture: { key: 'scripture', label: 'SCRIPTURE TEXT', description: 'Quoted biblical text shown from the named translation or source.' },
  source_data: { key: 'source_data', label: 'SOURCE DATA', description: 'Greek or Hebrew text, lemma, morphology, manuscript or lexical data tied to a named source.' },
  translation: { key: 'translation', label: 'TRANSLATION', description: 'An English rendering or explanation of possible meanings. A translation is not identical to the original word.' },
  interpretation: { key: 'interpretation', label: 'INTERPRETATION', description: 'Theological, devotional, historical, or AI-assisted interpretation. It must never be presented as source text.' },
  user_reflection: { key: 'user_reflection', label: 'YOUR REFLECTION', description: 'Your own prayer, journal, note, question, or application.' },
});

export const TRUTH_ORDER = ['scripture','source_data','translation','interpretation','user_reflection'];

export function truthLayer(key) {
  return TRUTH_LAYERS[key] || TRUTH_LAYERS.interpretation;
}

export function truthStatement({ layer, text, source = '', confidence = 'source-labeled' }) {
  return { ...truthLayer(layer), text, source, confidence };
}