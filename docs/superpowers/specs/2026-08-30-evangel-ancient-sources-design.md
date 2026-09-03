# EVANGEL Ancient Sources Design

**Goal:** Expand Truth Mode so EVANGEL can search public-domain ancient/early Bible witnesses inside the app while linking, rather than copying, sources whose digital transcriptions or images are not licensed for commercial reuse.

## Searchable in EVANGEL

- World English Bible (WEB): public-domain English base Bible.
- Brenton English Septuagint: public-domain 1851 English translation of the Septuagint.
- Brenton Greek Septuagint: public-domain ancient Greek Septuagint corpus, including deuterocanonical/apocryphal books in the eBible edition.
- Open Scriptures Hebrew Bible / Westminster Leningrad Codex: Hebrew/source-data layer subject to its attribution requirements.
- SBLGNT / MorphGNT: Greek New Testament/source-data layer subject to their attribution licenses.

The first implementation step makes WEB + Brenton English + Brenton Greek searchable in the general Study interface because all three can be bundled immediately from eBible public-domain VPL files. Hebrew/Greek morphology remains in Scholar until its richer corpus importer is complete.

## Official external witness links

- Concordant Literal Version: link to concordant.org only. Never copy/display their protected website text.
- Codex Sinaiticus: official project link only for commercial EVANGEL; electronic transcription/images are non-commercial licensed.
- Codex Vaticanus (Vat.gr.1209): official Vatican Library viewer link only unless separate reuse permission is obtained.
- Dead Sea Scrolls: official Israel Antiquities Authority viewer/reference link only unless separate reuse permission is obtained.

## Truth Mode categories

Every source is assigned a category:

- `scripture_translation`
- `ancient_language_text`
- `manuscript_witness`
- `critical_edition`
- `external_translation`
- `interpretation`

A manuscript witness must never be described as a translation. A modern translation must never be described as an ancient manuscript. AI commentary remains interpretation.

## Source selector

Bible Study receives a source selector with:

- WEB — English Bible
- Brenton English LXX — English Septuagint
- Greek Septuagint — Ancient Greek

Search results show the active source title and source class. Search remains client-side/local after first corpus load.

## Ancient Witness panel

Scholar adds a timeline and witness panel:

- Dead Sea Scrolls — ancient Hebrew/Aramaic manuscript witnesses
- Septuagint tradition — ancient Greek translation tradition
- Codex Vaticanus — 4th century Greek biblical manuscript
- Codex Sinaiticus — 4th century Greek biblical manuscript
- Leningrad Codex — medieval Hebrew manuscript/source for WLC
- Modern critical/source editions
- Modern translations and comparison tools

External items open the official holding institution in a new tab and are labeled `Official external source`.

## Source metadata

Each bundled source records:

- source key
- display name
- language
- category
- rights status
- attribution text
- official URL
- local corpus path when bundled

## Acceptance criteria

1. WEB, Brenton English LXX, and Brenton Greek LXX are locally searchable.
2. Search UI clearly identifies the active source.
3. Concordant opens concordant.org and is never bundled.
4. Sinaiticus, Vaticanus, and DSS links are official external links.
5. Truth Mode labels distinguish manuscript, translation, source text, and interpretation.
6. Tests, payment-security scan, lint, and production build remain green.