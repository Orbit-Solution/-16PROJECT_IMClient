export const isValidSriLankanPhone = (value) => /^((07\d{8})|(\+?947\d{8}))$/.test(String(value || '').replace(/[\s()-]/g, ''));
