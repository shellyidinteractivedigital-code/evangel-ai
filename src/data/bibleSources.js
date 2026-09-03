export const LXX_BOOK_NAMES = {
  GEN:'Genesis',EXO:'Exodus',LEV:'Leviticus',NUM:'Numbers',DEU:'Deuteronomy',JOS:'Joshua',JDG:'Judges',RUT:'Ruth',
  '1SA':'Kings I','2SA':'Kings II','1KI':'Kings III','2KI':'Kings IV','1CH':'Chronicles I','2CH':'Chronicles II',EZR:'Ezra',NEH:'Nehemiah',
  JOB:'Job',PSA:'Psalms',PRO:'Proverbs',ECC:'Ecclesiastes',SOL:'Song of Solomon',ISA:'Isaiah',JER:'Jeremiah',LAM:'Lamentations',EZE:'Ezekiel',
  HOS:'Hosea',JOE:'Joel',AMO:'Amos',OBA:'Obadiah',JON:'Jonah',MIC:'Micah',NAH:'Nahum',HAB:'Habakkuk',ZEP:'Zephaniah',HAG:'Haggai',ZEC:'Zechariah',MAL:'Malachi',
  TOB:'Tobit',JDT:'Judith',ESG:'Esther (Greek)',WIS:'Wisdom',SIR:'Sirach',BAR:'Baruch',EPJ:'Epistle of Jeremiah',SUS:'Susanna',BEL:'Bel and the Dragon',
  '1MA':'I Maccabees','2MA':'II Maccabees','1ES':'I Esdras',PRM:'Prayer of Manasseh','3MA':'III Maccabees','4MA':'IV Maccabees',DNG:'Daniel (Greek)'
};

export const BIBLE_SOURCES = {
  web: {
    key:'web',
    id:'engwebp',
    displayName:'World English Bible',
    shortName:'WEB',
    language:'English',
    category:'scripture_translation',
    rights:'Public Domain',
    localPath:'/data/engwebp_vpl.txt',
    officialUrl:'https://ebible.org/engwebp/',
    notice:'World English Bible (WEB), public domain. Text is displayed unchanged from the eBible.org developer distribution.'
  },
  brenton_en: {
    key:'brenton_en',
    id:'eng-Brenton',
    displayName:'Brenton English Septuagint',
    shortName:'Brenton LXX',
    language:'English',
    category:'scripture_translation',
    rights:'Public Domain',
    localPath:'/data/eng-Brenton_vpl.txt',
    officialUrl:'https://ebible.org/eng-Brenton/',
    bookNames:LXX_BOOK_NAMES,
    notice:'Brenton English Septuagint, first published in 1851 and now public domain. Includes the Septuagint canon and deuterocanonical/apocryphal books in the eBible edition.'
  },
  brenton_grc: {
    key:'brenton_grc',
    id:'grcbrent',
    displayName:'Greek Septuagint (Brenton corpus)',
    shortName:'Greek LXX',
    language:'Ancient Greek',
    category:'ancient_language_text',
    rights:'Public Domain',
    localPath:'/data/grcbrent_vpl.txt',
    officialUrl:'https://ebible.org/find/show.php?id=grcbrent',
    bookNames:{...LXX_BOOK_NAMES,EZR:'Ezra / Nehemiah'},
    notice:'Ancient Greek Septuagint corpus compiled in the Brenton edition and distributed by eBible as public domain. This is an ancient-language text, not an English translation.'
  },
  oshb_hebrew: {
    key:'oshb_hebrew',
    id:'oshb-wlc',
    displayName:'Open Scriptures Hebrew Bible / WLC',
    shortName:'Hebrew WLC',
    language:'Hebrew',
    category:'ancient_language_text',
    rights:'WLC public domain; OSHB data CC BY 4.0',
    localPath:'/data/oshb_wlc_vpl.txt',
    officialUrl:'https://github.com/openscriptures/morphhb',
    notice:'Hebrew text based on the Westminster Leningrad Codex. Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb. OSHB lemma/morphology work is CC BY 4.0; the WLC base text is public domain.'
  },
  sblgnt: {
    key:'sblgnt',
    id:'sblgnt',
    displayName:'SBL Greek New Testament',
    shortName:'SBLGNT',
    language:'Greek',
    category:'critical_edition',
    rights:'CC BY 4.0',
    localPath:'/data/sblgnt_vpl.txt',
    officialUrl:'https://sblgnt.com/',
    notice:'SBL Greek New Testament, critically edited by Michael W. Holmes. Licensed under Creative Commons Attribution 4.0 International by the Society of Biblical Literature and Logos Bible Software.'
  }
};

export const EXTERNAL_WITNESSES = [
  {
    key:'concordant',
    name:'Concordant Literal Version',
    category:'external_translation',
    era:'Modern translation',
    rights:'Copyrighted / link only',
    url:'https://www.concordant.org/',
    description:'Literal-translation comparison tool. EVANGEL links to concordant.org and does not reproduce protected site text.'
  },
  {
    key:'dead_sea_scrolls',
    name:'Dead Sea Scrolls',
    category:'manuscript_witness',
    era:'c. 3rd century BCE–1st century CE',
    rights:'Official external source',
    url:'https://www.deadseascrolls.org.il/',
    description:'Ancient Hebrew and Aramaic manuscript witnesses. Open the Israel Antiquities Authority viewer for images and reference material.'
  },
  {
    key:'vaticanus',
    name:'Codex Vaticanus (Vat.gr.1209)',
    category:'manuscript_witness',
    era:'4th century CE',
    rights:'Official external source',
    url:'https://digi.vatlib.it/view/MSS_Vat.gr.1209',
    description:'4th-century Greek biblical manuscript. Open the Vatican Library digital viewer; EVANGEL does not reproduce its protected digital images.'
  },
  {
    key:'sinaiticus',
    name:'Codex Sinaiticus',
    category:'manuscript_witness',
    era:'4th century CE',
    rights:'Official external source',
    url:'https://www.codexsinaiticus.org/',
    description:'4th-century Greek biblical manuscript. EVANGEL links to the official project rather than bundling its non-commercial digital transcription/images.'
  }
];

export const SOURCE_TIMELINE = [
  { era:'c. 3rd century BCE–1st century CE', title:'Dead Sea Scrolls', category:'manuscript_witness' },
  { era:'Ancient Greek tradition', title:'Septuagint (LXX)', category:'ancient_language_text' },
  { era:'4th century CE', title:'Codex Vaticanus', category:'manuscript_witness' },
  { era:'4th century CE', title:'Codex Sinaiticus', category:'manuscript_witness' },
  { era:'1008 CE', title:'Leningrad Codex / WLC source tradition', category:'manuscript_witness' },
  { era:'Modern', title:'Critical/source editions and modern translations', category:'critical_edition' }
];