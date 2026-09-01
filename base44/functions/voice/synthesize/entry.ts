import { createClientFromRequest, secrets } from 'base44:runtime';

const ALLOWED_VOICES = new Set(['marin','cedar']);
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const { text, voice } = await req.json();
    if (typeof text !== 'string' || !text.trim() || text.length > 4096) return Response.json({ error: 'invalid_text' }, { status: 400 });
    if (!ALLOWED_VOICES.has(voice)) return Response.json({ error: 'invalid_voice' }, { status: 400 });
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