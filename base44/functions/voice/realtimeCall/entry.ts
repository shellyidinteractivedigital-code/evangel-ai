import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { secrets } from 'base44:runtime';
import { guardPremiumVoiceRequest } from '../../../shared/voice/security.js';

const REALTIME_VOICES = new Set(['marin','coral','shimmer','cedar','echo']);

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405, headers: { Allow: 'POST' } });
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const { sdp, voice: requestedVoice } = await req.json();
    if (typeof sdp !== 'string' || !sdp || sdp.length > 100000) return Response.json({ error: 'invalid_sdp' }, { status: 400 });
    if (!REALTIME_VOICES.has(requestedVoice)) return Response.json({ error: 'invalid_voice' }, { status: 400 });
    const voice = requestedVoice;
    const guard = await guardPremiumVoiceRequest({ base44, user, kind: 'realtime', units: 1, requestLimit: 10, unitLimit: 10 });
    if (!guard.ok) return Response.json({ error: guard.error }, { status: guard.status, headers: guard.retryAfter ? { 'Retry-After': String(guard.retryAfter) } : undefined });
    const key = secrets.get('OPENAI_API_KEY');
    if (!key) return Response.json({ error: 'realtime_voice_not_configured' }, { status: 503 });
    const form = new FormData();
    form.set('sdp', new Blob([sdp], { type: 'application/sdp' }), 'offer.sdp');
    form.set('session', new Blob([JSON.stringify({
      type: 'realtime',
      model: 'gpt-realtime',
      audio: { output: { voice } },
      instructions: 'You are EVANGEL Ask the Word. Be warm, concise, Scripture-centered, and humble. Clearly distinguish quoted Scripture, source evidence, translation, interpretation, and user reflection. Never claim to speak for God. For children, use short age-appropriate language and encourage a trusted grown-up for serious or scary concerns.'
    })], { type: 'application/json' }), 'session.json');
    const response = await fetch('https://api.openai.com/v1/realtime/calls', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
    const answer = await response.text();
    if (!response.ok) return Response.json({ error: 'realtime_provider_error' }, { status: 502 });
    return Response.json({ sdp: answer });
  } catch { return Response.json({ error: 'realtime_request_failed' }, { status: 500 }); }
});