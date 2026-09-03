import test from 'node:test';
import assert from 'node:assert/strict';
import { toFaithItem } from '../src/services/faithItems.js';

test('toFaithItem returns the canonical EVANGEL fields', () => {
  const item = toFaithItem({ id:'v-1', kind:'verse', title:'John 3:16', text:'text', ref:'John 3:16' });
  assert.deepEqual(Object.keys(item), ['id','kind','title','text','ref','color','tags','createdAt','spatial']);
  assert.equal(item.kind, 'verse');
  assert.deepEqual(item.tags, []);
  assert.equal(item.spatial, null);
});