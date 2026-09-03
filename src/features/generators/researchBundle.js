const MAX_LANGUAGE_RECORDS = 100;

function normalizedWord(record) {
  if (!record?.lemma || !record?.evidenceSource) return null;
  return {
    language: record.language || '',
    surface: record.surface || '',
    lemma: record.lemma,
    transliteration: record.transliteration || '',
    pronunciation: record.pronunciation || '',
    morphology: record.morphology || '',
    standardGloss: record.standardGloss || '',
    contextualSenses: Array.isArray(record.contextualSenses) ? record.contextualSenses : [],
    occurrences: Array.isArray(record.occurrences) ? record.occurrences : [],
    evidenceSource: record.evidenceSource,
    corpusVersion: record.corpusVersion || '',
  };
}

export function buildResearchBundle({
  reference,
  passage,
  source,
  languageRecords = [],
}) {
  if (!passage?.ref || !passage?.text || !source?.key) {
    throw new Error('verified_passage_required');
  }

  const words = languageRecords
    .slice(0, MAX_LANGUAGE_RECORDS)
    .map(normalizedWord)
    .filter(Boolean);

  return {
    reference: reference || passage.ref,
    passage: { ref: passage.ref, text: passage.text },
    source: {
      key: source.key,
      displayName: source.displayName || source.key,
      rights: source.rights || '',
    },
    words,
    warnings: words.length ? [] : ['No verified original-language evidence is attached.'],
  };
}