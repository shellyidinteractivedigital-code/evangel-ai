import { base44 } from '../api/base44Client';

export async function askEvangel(input) {
  const response = await base44.functions.invoke('askEvangel', input);
  const payload = response?.data || response;
  if (payload?.error) {
    const error = new Error(payload.message || payload.error);
    error.code = payload.error;
    throw error;
  }
  return payload;
}