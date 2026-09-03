# EVANGEL Release Design

## Goal
Ship a coherent EVANGEL release in Base44 and GitHub with a premium navigation shell, voice-first Drive Sanctuary, sermon drafting and email handoff, many device voices, moving ambient visuals, preserved 3D Faith Space, and clean verification.

## Architecture
Keep the current React/Vite/Base44 architecture. Extend the existing DrivePage and App state rather than introducing a second voice or sermon system. Use browser speech synthesis for device voices, Web Speech recognition as progressive enhancement, Base44 FaithItem persistence for signed-in storage, and safe `mailto:` handoff for email so no user email credentials are stored.

## Drive Sanctuary
Drive mode remains voice-first and intentionally limits reading-heavy editing. It exposes PLAY, ASK, SERMON, SAVE, EMAIL ME, NEXT, and REPEAT. Spoken commands update a lightweight sermon draft in App state. Full editing stays in Sermon Creator when parked.

## Question flow
Drive questions use a deterministic local Scripture helper for the currently selected verse and common intents such as context, application, hope, peace, and courage. The response is short, spoken, and saveable. This release does not claim divine authority and does not fabricate original-language evidence.

## Email handoff
Email uses a generated `mailto:` URL containing the current passage plus either the short answer or sermon draft. This works without collecting mailbox credentials. A future authenticated transactional email service can replace the handoff without changing the Drive UI.

## Visual system
Correct the App/CSS class mismatch so the existing premium side navigation is actually used. Add animated cloud/light layers to Home and Drive with reduced-motion support. Preserve the midnight navy, gold, ivory, glass visual direction.

## Quality gate
All existing tests plus release regression tests must pass. Production build, lint, typecheck, payment-secret scan, and git status must be clean before merge/sync. GitHub sync must use the existing server-side GitHub connector and never expose its token to the client.