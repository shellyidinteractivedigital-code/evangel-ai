# EVANGEL Secure Payments Design

**Date:** 2026-08-27

## Goal

Add a production-oriented payment and entitlement architecture to EVANGEL using Stripe in test mode first, with Base44 as the authenticated backend and data layer. The design minimizes EVANGEL's PCI exposure by keeping raw payment credentials out of EVANGEL systems and using Stripe-hosted Checkout and Customer Portal.

## Current state

EVANGEL currently has the built-in Base44 `User` entity only. There are no payment, subscription, entitlement, webhook-ledger, or billing-audit entities yet. Payment UI must not be treated as production-ready until the backend pieces below exist and are verified.

## Chosen integration shape

- Primary surface: web.
- Payment collection: Stripe-hosted Checkout using Checkout Sessions.
- Billing model: freemium base tier with flat-rate EVANGEL Plus monthly and annual subscriptions.
- Subscription self-service: Stripe Customer Portal.
- Entitlement authority: verified Stripe webhook events only.
- Environment: Stripe test mode first. Live mode is a separate explicit activation step.
- Tax: do not guess registrations. Keep tax configuration as an explicit business setting and enable Stripe Tax only after registrations/obligations are confirmed.

## Security boundary

The browser is untrusted. The frontend may request an allowed plan key, such as `plus_monthly` or `plus_annual`, but it may not submit:

- an arbitrary amount;
- a raw Stripe Price ID;
- a Stripe secret;
- a user ID that the backend trusts without session verification;
- a subscription status that directly grants access.

The Base44 backend derives the authenticated user from the request/session, maps a small allowlisted plan key to a server-side Stripe Price ID, creates Checkout/Portal sessions, and returns only the safe redirect/session result required by the frontend.

## Payment data policy

EVANGEL must never store:

- card number;
- CVC;
- bank login credentials;
- raw payment-method payloads;
- Stripe secret keys;
- webhook secrets.

EVANGEL may store Stripe object identifiers and billing state required to operate the service, such as `cus_...`, `sub_...`, `price_...`, event IDs, entitlement states, and timestamps.

## Backend entities

### BillingAccount

One logical billing record per EVANGEL user.

Fields:

- `user_id`: Base44 user ID.
- `stripe_customer_id`: Stripe Customer ID.
- `stripe_subscription_id`: active/relevant Stripe Subscription ID when present.
- `plan_key`: normalized EVANGEL plan (`free`, `plus_monthly`, `plus_annual`).
- `status`: normalized subscription state.
- `current_period_end`: timestamp when supplied by Stripe.
- `cancel_at_period_end`: boolean.
- `last_verified_at`: timestamp of the last accepted Stripe-state update.

RLS:

- user may read only their own record;
- user may not create, update, or delete billing state directly;
- backend/admin path owns mutations.

### Entitlement

Server-managed access grants.

Fields:

- `user_id`.
- `feature_key`.
- `active`.
- `source`: e.g. `free`, `stripe_subscription`, `admin_grant`.
- `source_reference`: relevant Stripe object ID or internal grant reference.
- `expires_at`: nullable timestamp.
- `updated_at`.

RLS:

- user may read only their own entitlements;
- user may not create, update, or delete entitlements directly.

Initial feature keys may include:

- `plus`.
- `advanced_scholar`.
- `premium_voices`.
- `cloud_sync`.
- `unlimited_collections`.

### StripeEvent

Webhook idempotency and audit ledger.

Fields:

- `stripe_event_id`: unique Stripe event ID.
- `event_type`.
- `livemode`.
- `received_at`.
- `processed_at`.
- `status`: `received`, `processed`, `ignored`, `failed`.
- `object_reference`: related Stripe object ID when useful.
- `error_code`: sanitized internal error classification only.

RLS:

- no ordinary user read/write access;
- backend/admin only.

Do not store full event payloads by default. Keep the minimum audit metadata needed for replay protection and operations.

## Server-side plan allowlist

The frontend uses stable internal keys only:

```text
plus_monthly
plus_annual
```

The backend maps those keys to secrets/configuration such as:

```text
EVANGEL_PRICE_PLUS_MONTHLY=price_...
EVANGEL_PRICE_PLUS_ANNUAL=price_...
```

Unknown keys are rejected. The frontend cannot control quantity, recurring interval, currency, unit amount, or Price ID in the first release.

## Backend functions

### createCheckoutSession

Authenticated endpoint.

Responsibilities:

1. Resolve the authenticated Base44 user from the server-side request context.
2. Validate the submitted `plan_key` against the exact server allowlist.
3. Find or create a Stripe Customer tied to the authenticated EVANGEL user.
4. Create a Stripe Checkout Session in subscription mode using the allowlisted Price.
5. Attach internal correlation metadata that contains non-sensitive identifiers only.
6. Use safe success and cancel URLs owned by EVANGEL.
7. Return only the Checkout session URL or client-safe session identifier.

Protection:

- authentication required;
- no arbitrary amount or Price ID accepted;
- no secret values returned;
- prevent creation of duplicate active subscriptions when an equivalent active subscription already exists;
- use Stripe idempotency keys for retry-safe session/customer creation where applicable;
- rate limit checkout-session creation.

### createCustomerPortalSession

Authenticated endpoint.

Responsibilities:

1. Resolve authenticated EVANGEL user.
2. Resolve the user's BillingAccount and Stripe Customer ID.
3. Verify customer ownership before creating a portal session.
4. Create Stripe Customer Portal session with an EVANGEL-owned return URL.
5. Return only the safe portal URL.

### stripeWebhook

Public endpoint with cryptographic verification.

Responsibilities:

1. Read the original raw request body without mutation.
2. Read `Stripe-Signature`.
3. Verify the event using `STRIPE_WEBHOOK_SECRET` before parsing/acting on it.
4. Reject invalid signatures.
5. Check `StripeEvent` for prior processing of the event ID.
6. Record a minimal `received` ledger entry.
7. Handle only explicit allowlisted event types.
8. Re-fetch authoritative Stripe objects when needed instead of trusting mutable client state.
9. Update BillingAccount and Entitlement records idempotently.
10. Mark the event processed and return HTTP 2xx quickly.

Initial event allowlist:

- `checkout.session.completed`.
- `customer.subscription.created`.
- `customer.subscription.updated`.
- `customer.subscription.deleted`.
- `invoice.paid`.
- `invoice.payment_failed`.

Additional event types are added only when a concrete business rule requires them.

## Entitlement rules

A browser redirect to `/billing/success` never grants access by itself.

The app displays a pending/refreshing state until the verified backend billing/entitlement record reflects the Stripe event.

Example normalized policy:

- no active paid subscription: free entitlements only;
- active/trialing paid subscription when allowed by the chosen plan policy: Plus entitlements active;
- past_due: retain or restrict access according to an explicit grace-period policy, not an arbitrary frontend decision;
- canceled/deleted after effective end: revoke Stripe-derived Plus entitlements;
- refunds do not silently map to entitlement changes unless the relevant subscription/invoice business rule explicitly requires it.

## Customer Portal

Use Stripe Customer Portal for payment-method updates, invoice viewing, and subscription cancellation/management. EVANGEL should not build a custom card-management screen in the first release.

Cancellation default should preserve access through the paid period when the Stripe subscription remains active until period end.

## Secrets and configuration

Backend-only configuration:

- `STRIPE_SECRET_KEY`.
- `STRIPE_WEBHOOK_SECRET`.
- `EVANGEL_PRICE_PLUS_MONTHLY`.
- `EVANGEL_PRICE_PLUS_ANNUAL`.
- environment-specific EVANGEL return URLs where required.

Rules:

- never expose these through Vite/browser environment variables;
- never commit them to Git;
- never log secret values;
- keep test and live configuration separate;
- live-mode keys and webhook secrets are activated only after explicit approval and production readiness review.

## Logging and error handling

Logs may contain:

- internal request ID;
- sanitized Base44 user ID reference when operationally necessary;
- Stripe object/event IDs;
- normalized error code;
- event type;
- processing timing/status.

Logs must not contain:

- secret keys;
- webhook secrets;
- card data;
- CVC;
- complete request bodies that may include sensitive data;
- unnecessary personal data.

Frontend errors must be generic and actionable. Detailed internal errors remain server-side.

## RLS and authorization

Payment state is server-owned.

Ordinary users:

- may read their own BillingAccount/Entitlement views;
- may request a checkout or portal session through authenticated backend functions;
- may not write BillingAccount, Entitlement, or StripeEvent records directly.

Admin access must remain explicit and should not be used as a substitute for webhook-driven billing truth.

## Frontend billing flow

### Upgrade

1. User selects EVANGEL Plus monthly or annual.
2. Frontend calls authenticated `createCheckoutSession({ plan_key })`.
3. Backend validates and creates Stripe-hosted Checkout.
4. Browser goes to Stripe.
5. Stripe completes payment/subscription workflow.
6. Stripe webhook updates EVANGEL billing state and entitlements.
7. User returns to EVANGEL.
8. EVANGEL queries the backend entitlement state and reflects Plus only after verification.

### Manage billing

1. Authenticated user chooses Manage Billing.
2. Frontend calls `createCustomerPortalSession()`.
3. Backend verifies customer ownership.
4. Browser opens Stripe Customer Portal.
5. Stripe changes emit webhooks.
6. EVANGEL updates from verified webhook state.

## Subscription recovery

Use Stripe's Billing recovery tools as the default recovery engine. EVANGEL handles `invoice.payment_failed` and resulting subscription state changes without implementing custom card retry logic.

The exact grace-period entitlement policy must be documented before live mode. Until then, test-mode implementation should expose the underlying normalized status and keep the policy isolated in one entitlement function.

## Tax

Do not automatically claim no tax obligation and do not automatically enable collection everywhere.

Before live mode:

1. confirm the legal selling entity and headquarters;
2. confirm where the business is registered/required to collect;
3. assign the correct Stripe product tax category;
4. configure Stripe Tax registrations/collection as legally appropriate;
5. validate customer-facing tax disclosures and invoices.

Threshold monitoring may be enabled as an operational aid, but it does not replace tax advice or registration decisions.

## Test plan

All payment work remains in Stripe test mode until production approval.

Required automated tests:

- unauthenticated checkout request rejected;
- unknown `plan_key` rejected;
- client-provided Price/amount ignored or rejected;
- duplicate-equivalent active subscription protected;
- checkout endpoint returns no Stripe secret;
- portal session requires ownership;
- invalid webhook signature rejected;
- modified webhook body fails verification;
- already-processed event is idempotent;
- unsupported event type is safely ignored;
- active subscription creates Plus entitlements;
- subscription deletion/revocation removes Stripe-derived Plus access at the correct effective time;
- payment-failure state does not trust frontend data;
- ordinary users cannot mutate billing, entitlement, or webhook records directly.

Manual test-mode scenarios:

- successful monthly subscription;
- successful annual subscription;
- canceled Checkout;
- 3DS/authentication-required test card;
- declined card;
- recurring payment success;
- recurring payment failure;
- cancellation at period end;
- Customer Portal payment-method update;
- repeated webhook delivery;
- invalid webhook signature;
- browser refresh on success page before webhook completion.

## Git and deployment controls

- implement on an isolated feature branch/worktree;
- add backend/payment tests before production code where test harness permits;
- GitHub CI runs test, lint, and build;
- no secrets in Git history;
- merge only after complete verification;
- Base44 receives the merged `main` tree through the existing sync flow;
- publish separately from the Base44 dashboard;
- live Stripe activation is not part of the initial implementation.

## Non-goals for the first payment release

- marketplace payouts or Stripe Connect;
- arbitrary donations;
- usage-based billing;
- custom card-entry UI;
- storing payment credentials;
- native App Store/Google Play billing;
- live charges before explicit production approval;
- automated tax/legal assumptions.

## Acceptance criteria

The secure payment backend is ready for test-mode product testing when:

1. BillingAccount, Entitlement, and StripeEvent models enforce the intended ownership rules.
2. Checkout and Customer Portal sessions are created only by authenticated backend code.
3. The client cannot choose amount, currency, or arbitrary Price ID.
4. Stripe webhook signatures are verified against the raw request body before any billing mutation.
5. Webhook event IDs are processed idempotently.
6. Paid access is derived from backend entitlements, never from a success redirect or browser-provided status.
7. secrets are absent from frontend bundles, logs, repository files, and CI output.
8. automated payment security tests pass.
9. existing EVANGEL tests, lint, and build continue to pass.
10. all integration remains in Stripe test mode pending separate live-mode approval.