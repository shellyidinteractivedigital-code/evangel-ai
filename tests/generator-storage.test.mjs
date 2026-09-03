import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (name) => JSON.parse(fs.readFileSync(`base44/entities/${name}.jsonc`, 'utf8'));

test('generator storage is private, foldered, and versioned', () => {
  const folder = read('FaithFolder');
  const version = read('FaithItemVersion');
  const item = read('FaithItem');
  assert.equal(folder.rls.read['data.owner_user_id'], '{{user.id}}');
  assert.equal(version.rls.read['data.owner_user_id'], '{{user.id}}');
  assert.equal(item.properties.folder_id.type, 'string');
  assert.equal(item.properties.current_version_id.type, 'string');
});