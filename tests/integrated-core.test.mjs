import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('integrated EVANGEL core exposes about groups family notes and universal share',()=>{
 for(const p of ['src/features/about/AboutPage.jsx','src/features/groups/GroupsPage.jsx','src/features/family/YoungExplorerPage.jsx','src/features/notes/NotesPage.jsx','src/components/FaithActions.jsx','src/services/share.js']) assert.equal(fs.existsSync(p),true,`missing ${p}`);
 const nav=read('src/app/navigation.js'); for(const word of ['About','Groups','Young Explorer','Notes']) assert.match(nav,new RegExp(word,'i'));
 const share=read('src/services/share.js'); assert.match(share,/navigator\.share/); assert.match(share,/clipboard/i);
});
test('sermons persist as FaithItem rather than only local toast',()=>{
 const sermon=read('src/features/creator/SermonPage.jsx'); assert.match(sermon,/FaithItem|saveFaithItem/); assert.match(sermon,/sermon/i);
});