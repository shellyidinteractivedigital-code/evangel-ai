import { base44 } from '../../api/base44Client';

export async function generateFaithContent(input) {
  const result = await base44.functions.invoke('generateFaithContent', input);
  const payload = result?.data || result;
  if (payload?.error) throw new Error(payload.error);
  return payload;
}