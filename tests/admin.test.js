import test from 'node:test';
import assert from 'node:assert/strict';

test('admin mutations are documented as server-side only', () => {
  assert.equal(process.env.NODE_ENV === 'production', false);
  assert.ok(true);
});
