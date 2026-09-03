# EVANGEL Secure Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and debug a Stripe test-mode subscription backend for EVANGEL where Base44 authenticates users, Stripe-hosted Checkout collects payment, verified webhooks own subscription truth, and server-managed entitlements control paid features.

**Architecture:** Base44 Deno functions live under `base44/functions/`; reusable payment logic lives under `base44/shared/billing/`. The browser may submit only an internal plan key. Checkout/portal functions authenticate the Base44 user, use server-side Stripe configuration, and return a safe redirect URL. The public webhook verifies the raw Stripe signature, deduplicates event IDs, and mutates BillingAccount/Entitlement records only with service-role authority.

**Tech Stack:** React 18, Vite 6, Base44 SDK/backend functions, Deno TypeScript, Stripe Checkout/Billing/Customer Portal, Node built-in test runner for pure security logic, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-27-evangel-secure-payments-design.md`

## Global Constraints

- Stripe test mode only. No live charges or live-key activation.
- Do not invent monthly/annual prices. Price IDs come from backend secrets/configuration.
- The browser cannot submit arbitrary Stripe Price IDs, amount, currency, or entitlement state.
- BillingAccount, Entitlement, and StripeEvent are server-owned; users may only read their own BillingAccount/Entitlement state.
- A Checkout success redirect never grants paid access.
- Webhook signatures must be verified from the original raw body before any mutation.
- Stripe event IDs must be idempotent.
- Never store or log card numbers, CVC, bank credentials, Stripe secret keys, or webhook secrets.
- Existing EVANGEL `npm test`, `npm run lint`, and `npm run build` must remain green.

---

### Task 1: Add backend payment model schemas and security contracts

**Files:**
- Create: `base44/entities/BillingAccount.jsonc`
- Create: `base44/entities/Entitlement.jsonc`
- Create: `base44/entities/StripeEvent.jsonc`
- Create: `tests/billing-schema.test.mjs`

**Interfaces:**
- BillingAccount user-readable by matching `data.user_id` to `{{user.id}}`; no ordinary user writes.
- Entitlement user-readable by matching `data.user_id` to `{{user.id}}`; no ordinary user writes.
- StripeEvent has no ordinary user access.

- [ ] Write a failing test asserting all three schema files exist, use required billing fields, and do not grant user create/update/delete access.
- [ ] Run `npm test` and verify the new test fails because schemas do not exist.
- [ ] Add the schemas with explicit RLS.
- [ ] Run `npm test` and verify the schema test passes.
- [ ] Run `npm run lint && npm run build`.
- [ ] Commit `feat: add secured billing entity schemas`.

### Task 2: Add pure plan, entitlement, and webhook policy logic

**Files:**
- Create: `base44/shared/billing/config.ts`
- Create: `base44/shared/billing/policy.ts`
- Create: `tests/billing-policy.test.mjs`

**Interfaces:**
- `normalizePlanKey(input) -> 'plus_monthly' | 'plus_annual' | null`
- `priceSecretNameForPlan(planKey) -> exact secret name`
- `normalizeSubscriptionStatus(stripeStatus) -> normalized state`
- `entitlementStateForSubscription({status, cancelAtPeriodEnd, currentPeriodEnd, now}) -> {plusActive, effectiveUntil}`
- `SUPPORTED_WEBHOOK_EVENTS` exact allowlist.

- [ ] Write failing tests for unknown plan rejection, no raw Price acceptance, active/trialing access, canceled/deleted revocation policy, and webhook allowlist.
- [ ] Verify RED.
- [ ] Implement minimal pure policy/config modules.
- [ ] Verify GREEN and run full suite.
- [ ] Commit `feat: add billing security policy`.

### Task 3: Add Stripe/Base44 shared server helpers

**Files:**
- Create: `base44/shared/billing/stripe.ts`
- Create: `base44/shared/billing/base44.ts`
- Create: `base44/shared/billing/http.ts`
- Create: `tests/billing-source-security.test.mjs`

**Interfaces:**
- `getStripe(req)` reads `STRIPE_SECRET_KEY` inside request-time code only.
- `requireAuthenticatedUser(req)` creates Base44 request client and calls `auth.me()`.
- `serviceClient(req)` returns the request client's `asServiceRole`.
- HTTP helpers return sanitized JSON errors without leaking exception bodies.

- [ ] Write source-security tests asserting backend-only secret reads and absence of `VITE_STRIPE_SECRET_KEY`/`REACT_APP_STRIPE_SECRET_KEY` patterns.
- [ ] Verify RED.
- [ ] Implement helpers with `npm:stripe` and `base44:runtime`.
- [ ] Verify GREEN and full suite.
- [ ] Commit `feat: add secure billing backend helpers`.

### Task 4: Build authenticated Checkout Session function

**Files:**
- Create: `base44/functions/billing/createCheckoutSession/entry.ts`
- Create: `tests/checkout-function.test.mjs`

**Interfaces:**
- Input JSON: `{ plan_key: 'plus_monthly' | 'plus_annual' }` only.
- Output JSON: `{ url: string }` on success.
- Rejects unauthenticated requests, unknown plans, missing price config, and duplicate equivalent active subscription.
- Derives user identity server-side.

- [ ] Write a failing structural/security test proving the function exists, uses `auth.me`, only consumes `plan_key`, maps to a server secret, and never reads a client-provided price/amount/currency.
- [ ] Verify RED.
- [ ] Implement customer lookup/creation, active-subscription guard, and Stripe Checkout Session creation in `subscription` mode.
- [ ] Use non-sensitive metadata to correlate Base44 user ID.
- [ ] Verify tests, lint, and build.
- [ ] Commit `feat: add authenticated Stripe checkout function`.

### Task 5: Build authenticated Customer Portal function

**Files:**
- Create: `base44/functions/billing/createCustomerPortalSession/entry.ts`
- Create: `tests/portal-function.test.mjs`

**Interfaces:**
- Input: no customer ID trusted from the browser.
- Output JSON: `{ url: string }`.
- Resolves BillingAccount for authenticated `user.id` and uses its Stripe Customer ID.

- [ ] Write failing ownership/security test.
- [ ] Verify RED.
- [ ] Implement authenticated portal session creation and safe return URL.
- [ ] Verify full suite.
- [ ] Commit `feat: add secured Stripe customer portal`.

### Task 6: Build verified idempotent Stripe webhook

**Files:**
- Create: `base44/functions/billing/stripeWebhook/entry.ts`
- Create: `base44/shared/billing/webhook.ts`
- Create: `tests/webhook-security.test.mjs`

**Interfaces:**
- Direct HTTP endpoint; no user auth expected.
- Reads `await req.text()` before Stripe construction.
- Verifies `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET` using `stripe.webhooks.constructEventAsync`/equivalent raw-body verification.
- Checks StripeEvent by exact `stripe_event_id` before mutations.
- Handles only `SUPPORTED_WEBHOOK_EVENTS`.
- Uses service-role Base44 entity operations.

- [ ] Write failing source/security tests for raw-body verification, signature header, webhook secret, exact event allowlist, and idempotency lookup.
- [ ] Verify RED.
- [ ] Implement event verification and minimal ledger handling.
- [ ] Implement subscription/customer correlation and BillingAccount upsert.
- [ ] Implement Plus entitlement synchronization from normalized subscription state.
- [ ] Mark processed/ignored/failed events with sanitized metadata only.
- [ ] Verify full suite.
- [ ] Commit `feat: add verified idempotent Stripe webhook`.

### Task 7: Add frontend billing service and EVANGEL Plus screen

**Files:**
- Create: `src/services/billing.js`
- Create: `src/features/billing/BillingPage.jsx`
- Modify: `src/app/navigation.js`
- Modify: `src/app/App.jsx`
- Modify: `src/styles/evangel.css`
- Create: `tests/billing-ui-security.test.mjs`

**Interfaces:**
- `startCheckout(planKey)` calls `base44.functions.invoke('billing/createCheckoutSession', { plan_key: planKey })` and navigates only to returned URL.
- `openBillingPortal()` calls `billing/createCustomerPortalSession` with no customer ID.
- UI never renders or accepts raw Price IDs.
- Success UI says billing is being verified; it does not unlock features locally.

- [ ] Write failing source-security tests for no amount/Price input and correct function invocation.
- [ ] Verify RED.
- [ ] Add Plus monthly/annual option labels without inventing dollar amounts until Stripe Price configuration exists.
- [ ] Add Manage Billing action.
- [ ] Add clear test-mode/configuration messaging when price secrets are absent.
- [ ] Verify full suite.
- [ ] Commit `feat: add EVANGEL secure billing experience`.

### Task 8: CI and security verification

**Files:**
- Modify: `.github/workflows/ci.yml`
- Create: `scripts/check-payment-secrets.mjs`
- Create: `docs/architecture/PAYMENTS_SECURITY.md`

**Interfaces:**
- CI executes `npm test`, `npm run lint`, `npm run build`, and secret/source checks.

- [ ] Write the secret/source scanner to fail on committed Stripe secret key patterns, webhook secret values, client-prefixed Stripe secret names, and obvious raw-card field storage patterns in EVANGEL code.
- [ ] Add it to CI and `package.json` as `security:payments`.
- [ ] Document test-mode setup, required secret names, webhook endpoint, Stripe Dashboard configuration, and live-mode gate.
- [ ] Run `npm test && npm run security:payments && npm run lint && npm run build`.
- [ ] Scan tracked files for oversized binaries and `.env` files.
- [ ] Create a Base44 checkpoint after merge.

## Production activation gate

The implementation may be merged in test mode without real pricing. Live payments remain disabled until all of the following are separately confirmed:

- EVANGEL legal selling entity;
- monthly and annual price amounts/currency;
- Stripe live account readiness;
- live Products/Prices;
- tax registrations/Stripe Tax configuration as applicable;
- privacy policy/terms/refund/cancellation disclosures;
- live webhook endpoint and live webhook secret;
- final test-mode payment matrix completed;
- explicit user approval to switch from test to live mode.