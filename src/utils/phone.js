export function normalizePhone(value) {
  const raw = String(value || '').replace(/[\s()-]/g, '');
  if (/^07\d{8}$/.test(raw)) return `+94${raw.slice(1)}`;
  if (/^947\d{8}$/.test(raw)) return `+${raw}`;
  if (/^\+947\d{8}$/.test(raw)) return raw;
  return null;
}
