const HOUR_MS = 60 * 60 * 1000;

function currentWindow(now = new Date()) {
  const start = Math.floor(now.getTime() / HOUR_MS) * HOUR_MS;
  return {
    key: new Date(start).toISOString(),
    expiresAt: new Date(start + HOUR_MS).toISOString(),
    retryAfter: Math.max(1, Math.ceil((start + HOUR_MS - now.getTime()) / 1000)),
  };
}

export async function guardPremiumVoiceRequest({ base44, user, kind, units = 1, requestLimit, unitLimit }) {
  const service = base44.asServiceRole;
  const entitlements = await service.entities.Entitlement.filter({
    user_id: user.id,
    feature_key: 'premium_voices',
    active: true,
  }, '-updated_date', 1);
  const entitlement = entitlements?.[0];
  if (!entitlement || (entitlement.expires_at && new Date(entitlement.expires_at).getTime() <= Date.now())) {
    return { ok: false, status: 403, error: 'premium_voice_subscription_required' };
  }

  const window = currentWindow();
  const rows = await service.entities.VoiceUsageWindow.filter({
    user_id: user.id,
    kind,
    window_key: window.key,
  }, '-updated_date', 1);
  const usage = rows?.[0];
  const requestCount = Number(usage?.request_count || 0);
  const unitCount = Number(usage?.unit_count || 0);
  if (requestCount >= requestLimit || unitCount + units > unitLimit) {
    return { ok: false, status: 429, error: 'voice_rate_limited', retryAfter: window.retryAfter };
  }

  const next = {
    user_id: user.id,
    kind,
    window_key: window.key,
    request_count: requestCount + 1,
    unit_count: unitCount + units,
    expires_at: window.expiresAt,
  };
  if (usage) await service.entities.VoiceUsageWindow.update(usage.id, next);
  else await service.entities.VoiceUsageWindow.create(next);
  return { ok: true };
}