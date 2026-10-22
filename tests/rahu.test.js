import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRahu } from '../src/services/rahuService.js';

test('uses the traditional weekday segment mapping', () => {
  const result = calculateRahu({ date: '2026-10-18', sunrise: '06:00', sunset: '18:00' });
  assert.equal(result.start, '16:30');
  assert.equal(result.end, '18:00');
});

test('calculates a deterministic interval for every weekday', () => {
  for (let day = 18; day <= 24; day += 1) {
    const result = calculateRahu({ date: `2026-10-${day}`, sunrise: '06:00', sunset: '18:00' });
    assert.match(result.start, /^\d{2}:\d{2}$/);
    assert.match(result.end, /^\d{2}:\d{2}$/);
  }
});
