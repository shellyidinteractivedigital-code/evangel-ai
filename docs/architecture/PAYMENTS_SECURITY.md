# EVANGEL Payment Security

EVANGEL uses authenticated Base44 backend functions and Stripe-hosted Checkout. The browser submits only `plus_monthly` or `plus_annual`; the server maps that key to a secret Stripe Price ID. Raw card data and Stripe secrets never enter the EVANGEL frontend or database.

Required Base44 **test-mode** secrets are `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `EVANGEL_PRICE_PLUS_MONTHLY`, `EVANGEL_PRICE_PLUS_ANNUAL`, and optionally `EVANGEL_APP_URL`. Never prefix secrets with `VITE_`, `REACT_APP_`, or `NEXT_PUBLIC_`.

Configure the Stripe test webhook at `https://<EVANGEL-domain>/functions/billing/stripeWebhook` for: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`.

The webhook reads the original raw body, verifies `Stripe-Signature`, rejects live events in this test-mode build, checks event IDs for duplicate delivery, and only then uses Base44 service-role access. BillingAccount and Entitlement are user-readable but server-owned. StripeEvent is backend-only. A browser return to `?billing=success` never grants access.

Only `active` and `trialing` subscriptions create Stripe-derived Plus entitlements. `past_due`, `unpaid`, and `canceled` do not. Cancel-at-period-end access ends at its effective period end.

Run `npm test`, `npm run security:payments`, `npm run lint`, and `npm run build` before integration. Live payments require a separate decision on legal selling entity, actual monthly/annual amounts and currency, refund/cancellation terms, tax obligations, live Products/Prices, live webhook secret, and explicit approval to switch from test to live mode.