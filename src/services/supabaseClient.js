const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfig = { configured: Boolean(url && anonKey), url, anonKey };

export async function supabaseFetch(path, options = {}) {
  if (!supabaseConfig.configured) throw new Error('Supabase public configuration is not set.');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return response.status === 204 ? null : response.json();
}
