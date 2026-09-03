import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const t=()=>fs.readFileSync('src/features/faith-space/FaithSpace3D.jsx','utf8');
test('Faith Space uses readable spatial cards instead of geometric demo nodes',()=>{const s=t();assert.doesNotMatch(s,/IcosahedronGeometry|GridHelper/);assert.match(s,/faith-memory-card/);assert.match(s,/faith-connections/);assert.match(s,/Answered|answered_prayer/);});
test('Faith Space supports keyboard focus and reduced motion',()=>{const s=t();assert.match(s,/tabIndex/);assert.match(s,/prefers-reduced-motion/);});