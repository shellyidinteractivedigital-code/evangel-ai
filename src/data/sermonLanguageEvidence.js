export const SURPRISE_SERMON_IDEAS = [
  'Speak to the person who feels forgotten. Move from honest loneliness toward the truth that faithful love still sees them, and end with a gentle invitation to take one next step.',
  'Create a message for someone beginning again after failure. Name the shame without feeding it, show how grace restores movement, and close with courageous hope.',
  'Preach to a family carrying grief. Make room for tears, show how Scripture holds sorrow and hope together, and finish with a prayer that feels safe to hear aloud.',
  'Create a sermon about forgiveness that does not excuse harm. Distinguish release from denial, offer wise practical steps, and end with freedom rather than pressure.',
  'Speak to people exhausted by uncertainty. Begin in the tension of not knowing, uncover the passage’s steady promise, and give them one practice for tomorrow morning.',
  'Create a sermon about belonging for people who feel outside the circle. Use a vivid human story, reveal the welcome within the passage, and close with a memorable invitation.',
  'Preach about courage when fear is reasonable. Do not shame fear. Show how faith can move with trembling hands and finish with a strong, compassionate prayer.',
  'Create a message about mercy that reaches both the wounded person and the person learning to change. Make it honest, specific, hopeful, and deeply human.',
];

const VERIFIED_SERMON_WORDS = {
  'John 3:16': [{
    language: 'Greek',
    surface: 'ἠγάπησεν',
    lemma: 'ἀγαπάω',
    transliteration: 'agapaō',
    pronunciation: 'ah-gah-PAH-oh',
    morphology: 'aorist active indicative, third person singular',
    standardGloss: 'to love',
    contextualSenses: ['to love expressed through self-giving action'],
    occurrences: ['John 3:16'],
    evidenceSource: 'SBL Greek New Testament, John 3:16',
    corpusVersion: 'SBLGNT',
  }],
  'Psalm 46:10': [{
    language: 'Hebrew',
    surface: 'הַרְפּוּ',
    lemma: 'רָפָה',
    transliteration: 'harpû / rāphâ',
    pronunciation: 'har-POO / raw-FAH',
    morphology: 'Hiphil imperative, masculine plural',
    standardGloss: 'let go; cease',
    contextualSenses: ['cease striving or hostile action in order to recognize God’s rule'],
    occurrences: ['Psalm 46:10'],
    evidenceSource: 'Open Scriptures Hebrew Bible (WLC), Psalm 46:11 in Hebrew versification',
    corpusVersion: 'OSHB WLC',
  }],
  'Psalm 121:8': [{
    language: 'Hebrew',
    surface: 'יִשְׁמָר',
    lemma: 'שָׁמַר',
    transliteration: 'yishmor / shāmar',
    pronunciation: 'yish-MORE / shah-MAR',
    morphology: 'Qal imperfect, third person masculine singular',
    standardGloss: 'to keep; guard; watch',
    contextualSenses: ['to watch over with continuing care'],
    occurrences: ['Psalm 121:8'],
    evidenceSource: 'Open Scriptures Hebrew Bible (WLC), Psalm 121:8',
    corpusVersion: 'OSHB WLC',
  }],
  'Philippians 4:6-7': [{
    language: 'Greek',
    surface: 'φρουρήσει',
    lemma: 'φρουρέω',
    transliteration: 'phrourēsei / phroureō',
    pronunciation: 'froo-RAY-see / froo-REH-oh',
    morphology: 'future active indicative, third person singular',
    standardGloss: 'to guard',
    contextualSenses: ['to protect or keep watch like a sentry'],
    occurrences: ['Philippians 4:7'],
    evidenceSource: 'SBL Greek New Testament, Philippians 4:7',
    corpusVersion: 'SBLGNT',
  }],
  'Isaiah 41:10': [{
    language: 'Hebrew',
    surface: 'אִמַּצְתִּיךָ',
    lemma: 'אָמַץ',
    transliteration: 'immastîkā / āmats',
    pronunciation: 'ee-maht-STEE-khah / ah-MAHTS',
    morphology: 'Piel perfect, first person singular with second person suffix',
    standardGloss: 'to strengthen',
    contextualSenses: ['to make strong or give courage'],
    occurrences: ['Isaiah 41:10'],
    evidenceSource: 'Open Scriptures Hebrew Bible (WLC), Isaiah 41:10',
    corpusVersion: 'OSHB WLC',
  }],
};

export function getSermonLanguageEvidence(passage) {
  const ref = String(passage?.ref || '').trim();
  return (VERIFIED_SERMON_WORDS[ref] || []).map((word) => ({ ...word }));
}

export function getSurpriseSermonIdea(index = Date.now()) {
  const safeIndex = Math.abs(Number(index) || 0) % SURPRISE_SERMON_IDEAS.length;
  return SURPRISE_SERMON_IDEAS[safeIndex];
}