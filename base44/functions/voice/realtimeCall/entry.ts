import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { secrets } from 'base44:runtime';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const { sdp, voice: requestedVoice } = await req.json();
    if (typeof sdp !== 'string' || !sdp || sdp.length > 100000) return Response.json({ error: 'invalid_sdp' }, { status: 400 });
    const voice = requestedVoice === 'cedar' ? 'cedar' : 'marin';
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