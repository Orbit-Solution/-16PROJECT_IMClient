import { ideamartService } from './ideamartService.js';
import { normalizePhone } from '../utils/phone.js';

const demoKey = 'divigamana-demo-session';
const listeners = new Set();
let user = JSON.parse(localStorage.getItem(demoKey) || 'null');

export function getCurrentUser() { return user; }
export function subscribeAuth(listener) { listeners.add(listener); return () => listeners.delete(listener); }
function publish() { localStorage.setItem(demoKey, JSON.stringify(user)); listeners.forEach((listener) => listener(user)); }

export async function requestLogin(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) throw new Error('වලංගු ශ්‍රී ලංකා ජංගම අංකයක් ඇතුළත් කරන්න.');
  await ideamartService.sendOtp(normalized);
  return { phone: normalized, operator: await ideamartService.getOperator(normalized) };
}

export async function verifyLogin(phone, otp) {
  const normalized = normalizePhone(phone);
  const result = await ideamartService.verifyOtp(normalized, otp);
  if (!result.ok) throw new Error('PIN අංකය නිවැරදි නොවේ.');
  user = { id: crypto.randomUUID?.() || String(Date.now()), phone: normalized, operator: await ideamartService.getOperator(normalized), status: 'ACTIVE', verifiedAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
  publish();
  return user;
}

export function logout() { user = null; localStorage.removeItem(demoKey); publish(); }
