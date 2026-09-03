export const PLAN_KEYS=Object.freeze(['plus_monthly','plus_annual']);
const PRICE_SECRET_BY_PLAN=Object.freeze({plus_monthly:'EVANGEL_PRICE_PLUS_MONTHLY',plus_annual:'EVANGEL_PRICE_PLUS_ANNUAL'});
export const SUPPORTED_WEBHOOK_EVENTS=Object.freeze(['checkout.session.completed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed']);
export function normalizePlanKey(input){return typeof input==='string'&&PLAN_KEYS.includes(input)?input:null;}
export function priceSecretNameForPlan(planKey){return normalizePlanKey(planKey)?PRICE_SECRET_BY_PLAN[planKey]:null;}
export function planKeyFromPriceId(priceId,configuredPrices){if(!priceId||!configuredPrices)return'free';if(priceId===configuredPrices.plus_monthly)return'plus_monthly';if(priceId===configuredPrices.plus_annual)return'plus_annual';return'free';}