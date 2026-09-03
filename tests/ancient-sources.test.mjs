import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Brenton English and Greek Septuagint corpora are bundled',()=>{
  for(const path of ['public/data/eng-Brenton_vpl.txt','public/data/grcbrent_vpl.txt']){
    assert.equal(fs.existsSync(path),true,`missing ${path}`);
    const text=fs.readFileSync(path,'utf8');
    assert.ok(text.length>1000000,`${path} too small`);
    assert.match(text,/GEN 1:1/);
  }
});

test('source registry distinguishes translations, ancient language text, manuscripts and external sources',()=>{
  const src=fs.readFileSync('src/data/bibleSources.js','utf8');
  for(const token of ['eng-Brenton','grcbrent','oshb_wlc_vpl.txt','sblgnt_vpl.txt','scripture_translation','ancient_language_text','critical_edition','manuscript_witness','concordant.org','codexsinaiticus.org','digi.vatlib.it','deadseascrolls.org.il']) assert.match(src,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
});

test('Hebrew WLC and SBLGNT original-language corpora are bundled',()=>{
  const heb=fs.readFileSync('public/data/oshb_wlc_vpl.txt','utf8');
  const grk=fs.readFileSync('public/data/sblgnt_vpl.txt','utf8');
  assert.match(heb,/^GEN 1:1 /m);
  assert.match(heb,/בְּרֵאשִׁ֖ית/);
  assert.match(grk,/^JHN 1:1 /m);
  assert.match(grk,/Ἐν ἀρχῇ/);
  assert.ok(heb.split(/\r?\n/).filter(Boolean).length>23000);
  assert.ok(grk.split(/\r?\n/).filter(Boolean).length>7900);
});

test('Study exposes a source selector and uses the multi-source scripture service',()=>{
  const page=fs.readFileSync('src/features/study/StudyPage.jsx','utf8');
  const svc=fs.readFileSync('src/services/scripture.js','utf8');
  const registry=fs.readFileSync('src/data/bibleSources.js','utf8');
  assert.match(page,/sourceKey/);
  assert.match(page,/BIBLE_SOURCES/);
  assert.match(svc,/loadScriptureSource/);
  assert.match(registry,/eng-Brenton_vpl\.txt/);
  assert.match(registry,/grcbrent_vpl\.txt/);
});

test('Scholar exposes Ancient Witnesses and Source Timeline',()=>{
  const page=fs.readFileSync('src/features/scholar/ScholarPage.jsx','utf8');
  const panel=fs.readFileSync('src/features/scholar/AncientWitnessPanel.jsx','utf8');
  const combined=`${page}\n${panel}`;
  assert.match(combined,/Ancient Witnesses/i);
  assert.match(combined,/Source Timeline/i);
  assert.match(combined,/Official external source/i);
});