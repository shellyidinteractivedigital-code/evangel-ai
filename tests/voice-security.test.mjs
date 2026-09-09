import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('premium voice keys stay server-side and voices are allowlisted',()=>{const t=read('base44/functions/voice/synthesize/entry.ts');assert.match(t,/OPENAI_API_KEY/);assert.match(t,/marin/);assert.match(t,/cedar/);assert.doesNotMatch(t,/VITE_OPENAI_API_KEY/);});
test('realtime mic gateway uses authenticated WebRTC call proxy',()=>{const t=read('base44/functions/voice/realtimeCall/entry.ts');assert.match(t,/auth\.me/);assert.match(t,/application\/sdp/);assert.match(t,/\/v1\/realtime\/calls/);assert.match(t,/Never claim to speak for God/);});

test('Voice Sanctuary offers every built-in narration voice',()=>{
  const service=read('src/services/premiumVoice.js');
  const backend=read('base44/functions/voice/synthesize/entry.ts');
  const voices=['alloy','ash','ballad','coral','echo','fable','nova','onyx','sage','shimmer','verse','marin','cedar'];
  for(const voice of voices){assert.match(service,new RegExp(`key: '${voice}'`));assert.match(backend,new RegExp(`'${voice}'`));}
});

test('voice endpoints enforce paid entitlement, POST-only access, and server-side quotas',()=>{
  const synth=read('base44/functions/voice/synthesize/entry.ts');
  const realtime=read('base44/functions/voice/realtimeCall/entry.ts');
  const guard=read('base44/shared/voice/security.js');
  const usage=read('base44/entities/VoiceUsageWindow.jsonc');
  for(const endpoint of [synth,realtime]){
    assert.match(endpoint,/req\.method !== 'POST'/);
    assert.match(endpoint,/guardPremiumVoiceRequest/);
    assert.match(endpoint,/Retry-After/);
  }
  assert.match(guard,/feature_key: 'premium_voices'/);
  assert.match(guard,/active: true/);
  assert.match(guard,/VoiceUsageWindow/);
  assert.match(guard,/expires_at/);
  const usageSchema=JSON.parse(usage);
  assert.deepEqual(usageSchema.rls,{create:false,read:false,update:false,delete:false});
});

test('Voice Sanctuary distinguishes realtime voices from narration-only choices',()=>{
  const service=read('src/services/premiumVoice.js');
  const page=read('src/features/voices/VoicesPage.jsx');
  const wrapper=read('src/services/evangelVoice.js');
  assert.match(service,/realtimeCompatible/);
  assert.match(page,/Narration only/);
  assert.match(page,/v\.realtimeCompatible/);
  assert.match(wrapper,/voice: premiumVoice/);
  assert.doesNotMatch(wrapper,/premiumVoice === 'cedar'/);
});