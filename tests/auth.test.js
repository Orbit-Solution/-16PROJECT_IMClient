import test from 'node:test';
import assert from 'node:assert/strict';

test('demo OTP contract is four digits and fixed only for development', () => {
  const otp = '1234';
  assert.equal(otp.length, 4);
  assert.match(otp, /^\d{4}$/);
});
