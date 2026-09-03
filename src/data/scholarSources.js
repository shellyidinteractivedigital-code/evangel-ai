export const SOURCE_REGISTRY = [
  { name: 'World English Bible', layer: 'English base text', license: 'Public Domain', use: 'Bundled reading, audio, search and quotation', status: 'approved' },
  { name: 'Brenton English Septuagint', layer: 'English Septuagint translation', license: 'Public Domain', use: 'Bundled reading, audio, search and quotation from the eBible developer distribution', status: 'approved' },
  { name: 'Greek Septuagint (Brenton corpus)', layer: 'Ancient Greek Septuagint text', license: 'Public Domain', use: 'Bundled ancient-language search and comparison from the eBible developer distribution', status: 'approved' },
  { name: 'Open Scriptures Hebrew Bible', layer: 'Hebrew OT + morphology', license: 'CC BY 4.0', use: 'Hebrew text, lemmas and morphology with attribution', status: 'approved' },
  { name: 'SBL Greek New Testament', layer: 'Greek NT', license: 'CC BY 4.0', use: 'Greek text with attribution', status: 'approved' },
  { name: 'MorphGNT', layer: 'Greek morphology + lemmas', license: 'CC BY-SA', use: 'Parsing and lemmatization with source terms preserved', status: 'approved' },
  { name: 'STEP Bible / Tyndale House', layer: 'Lexical + alignment reference', license: 'Source-specific', use: 'Cross-check Strong numbers, morphology, variants and lexical data before publication', status: 'reference' },
  { name: 'Concordant Literal Version', layer: 'Translation comparison', license: 'Copyrighted', use: 'Link/reference only unless written permission is obtained', status: 'link-only' },
];

export const SCHOLAR_RULES = [
  ['TEXT', 'Show the Scripture text exactly as sourced. Never silently rewrite it.'],
  ['LANGUAGE', 'Show Hebrew or Greek, transliteration, lemma, morphology and lexical gloss as separate fields.'],
  ['TRANSLATION', 'Explain literal possibilities without pretending one English gloss exhausts the original word.'],
  ['VARIANTS', 'Flag meaningful manuscript or textual variants rather than hiding them.'],
  ['INTERPRETATION', 'Label theology, devotional reflection and spiritual application as interpretation, not as lexical fact.'],
  ['HUMILITY', 'When scholars disagree, say so clearly and show the major readings or views.'],
];