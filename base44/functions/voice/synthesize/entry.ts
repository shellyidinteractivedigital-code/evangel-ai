import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { secrets } from 'base44:runtime';
import { guardPremiumVoiceRequest } from '../../../shared/voice/security.js';

const ALLOWED_VOICES = new Set(['marin','coral','shimmer','cedar','onyx','echo']);
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405, headers: { Allow: 'POST' } });
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const { text, voice } = await req.json();
    if (typeof text !== 'string' || !text.trim() || text.length > 4096) return Response.json({ error: 'invalid_text' }, { status: 400 });
    if (!ALLOWED_VOICES.has(voice)) return Response.json({ error: 'invalid_voice' }, { status: 400 });
    const guard = await guardPremiumVoiceRequest({ base44, user, kind: 'synthesis', units: text.length, requestLimit: 30, unitLimit: 60000 });
    if (!guard.ok) return Response.json({ error: guard.error }, { status: guard.status, headers: guard.retryAfter ? { 'Retry-After': String(guard.retryAfter) } : undefined });
    const key = secrets.get('OPENAI_API_KEY');
    if (!key) return Response.json({ error: 'premium_voice_not_configured' }, { status: 503 });
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini-tts', input: text, voice, instructions: 'Warm, comforting, reverent, natural Scripture narration. Never theatrical. Use gentle pauses and clear diction.', response_format: 'mp3' }),
    });
    if (!response.ok) return Response.json({ error: 'voice_provider_error' }, { status: 502 });
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
    return Response.json({ audio_base64: btoa(binary), mime: 'audio/mpeg' });
  } catch { return Response.json({ error: 'voice_request_failed' }, { status: 500 }); }
});