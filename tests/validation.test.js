import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from '../src/utils/phone.js';
import { isValidSriLankanPhone } from '../src/utils/validation.js';

test('normalizes Sri Lankan mobile formats', () => {
  assert.equal(normalizePhone('077 123 4567'), '+94771234567');
  assert.equal(normalizePhone('+94771234567'), '+94771234567');
  assert.equal(normalizePhone('0711234567'), '+94711234567');
});

test('rejects invalid phone numbers', () => {
  assert.equal(normalizePhone('0112345678'), null);
  assert.equal(isValidSriLankanPhone('1234'), false);
});
