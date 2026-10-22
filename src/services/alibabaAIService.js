export async function generateSinhalaReading(payload) {
  const configured = Boolean(import.meta.env.VITE_ALIBABA_CLOUD_BASE_URL && import.meta.env.VITE_ALIBABA_CLOUD_MODEL);
  if (!configured) return { provider: 'mock', result: payload.fallbackResult, usage: { input_tokens: 0, output_tokens: 0, estimated_cost: 0 } };
  throw new Error('Alibaba AI calls must be made by a server-side function; configure the deployment adapter before enabling live mode.');
}
