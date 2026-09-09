# EVANGEL Brand, Story, and White Paper Design

## Purpose

Create one coherent EVANGEL identity that feels sacred, welcoming, dimensional, and easy to navigate. Replace distracting shooting-star and box-like visual motifs with a calm celestial environment. Present EVANGEL as a Scripture-centered learning companion created by believers and educators serving God.

## Approved Brand Direction

The central mark is an open Bible whose pages become an illuminated open road. The road represents Scripture becoming a lived path. A refined EVANGEL wordmark accompanies the symbol.

The environment uses a deep midnight-blue and black sky, warm gold light, restrained blue highlights, and realistic-looking sparkling stars. Stars twinkle gently in place at different depths. They do not shoot across the screen. Motion is slow, calm, and never competes with reading.

The identity must work as:

- a full hero illustration
- a horizontal app logo
- a compact square app icon
- a small navigation mark
- a monochrome fallback

## Visual System

### Logo and Art

The hero composition shows an open Bible in the foreground. A luminous road rises naturally from the center fold and travels toward a soft horizon. Small dimensional stars appear above and around the path. The visual must remain legible when cropped for desktop and mobile.

The logo must not suggest that EVANGEL, its creators, or its artificial intelligence is divine. The imagery represents study, guidance, hope, and a lived journey through Scripture.

### Star Field

Replace shooting stars with layered sparkling stars made from reusable CSS and Three.js primitives where appropriate. Use several sizes, soft bloom, slight depth variation, and independent twinkle timing. Avoid long trails, rapid movement, flashing, and dense particle clutter.

The 3D Faith Space retains movable saved-content cards because they are functional. Decorative geometric boxes, streaks, and unrelated shapes are removed. The background moves subtly through parallax and orbit so the space feels dimensional without making navigation difficult.

### Accessibility

All decorative art is ignored by assistive technology. Text contrast meets WCAG AA. Animation respects reduced-motion settings by stopping parallax and twinkle while preserving the static composition. No star flashes more than three times per second. Logo text remains readable without relying on the illustration.

## About Us

The page is written in first-person plural.

Core opening:

> We created EVANGEL because we believe Scripture should be understood, explored, and lived. We are believers and educators using technology in service to God.

The story explains that EVANGEL helps people ask questions, pray, study context, explore Hebrew and Greek, prepare sermons, and preserve meaningful work. It welcomes believers, seekers, families, pastors, teachers, and ministry communities.

The page clearly states that EVANGEL does not replace Scripture, prayer, pastors, teachers, community, or personal discernment. It does not claim to speak for God. Generated material is presented as a study and creative aid that users should verify and discern.

Sections:

1. Why We Created EVANGEL
2. Scripture Should Be Understood
3. Ancient Words, Living Meaning
4. Technology in Service, Never in Place of Faith
5. A Place for Prayer, Study, and Creation
6. Our Promise of Humility, Privacy, and Care

## White Paper

Working title: **EVANGEL: Scripture Understood, Explored, and Lived**

The paper serves believers, subscribers, churches, ministry partners, educators, responsible technology partners, and values-aligned supporters. Plain language leads, with technical detail contained in clearly labeled sections.

Chapters:

1. Executive Summary
2. The Need for an Accessible Scripture Companion
3. The EVANGEL Mission
4. The Concordant Study Method
5. Scripture Sources and Evidence Layers
6. Hebrew and Greek Word Education
7. Prayer, Sermon, and Scripture Creation
8. Voice, Listening, and Accessibility
9. Creator Notes, Folders, and Saved Work
10. The Navigable 3D Faith Space
11. Responsible Artificial Intelligence
12. Privacy, Subscriber Protection, and Security
13. Uses for Individuals, Families, Churches, and Educators
14. Product Architecture in Plain Language
15. Limitations and Human Discernment
16. Future Vision
17. Conclusion

The Concordant section distinguishes quoted Scripture, ancient-language source text, translation, interpretation, and personal reflection. It explains that word meanings depend on grammar and context and must not be reduced to inspirational dictionary definitions.

Claims about sources, languages, security, and product behavior must match implemented features and verifiable evidence. The paper must not claim endorsement by concordant.org or any outside ministry unless written permission exists.

## App Integration

- Replace the current text-only star brand treatment with the new reusable logo component.
- Add the new identity to desktop navigation, mobile header, home hero, About Us, and white-paper entry point.
- Replace shooting-star code in Faith Space with dimensional twinkling stars.
- Keep saved-content cards draggable and navigable.
- Add a readable About Us page and stable public route.
- Add a responsive in-app white-paper page with a downloadable document link when the final document is available.
- Reuse a small set of optimized assets rather than duplicating large images.

## Error and Performance Handling

Art must not block app startup. Provide CSS or SVG fallbacks if a raster hero asset fails. Lazy-load the large hero artwork. Keep animation GPU-friendly with transforms and opacity. Cap particle counts for mobile devices and reduce them further under reduced-motion or low-power conditions.

## Testing and Acceptance

Automated tests must verify:

- no shooting-star objects or trails remain
- the reusable logo appears in desktop and mobile navigation
- About Us and white-paper routes work
- approved About Us safeguards are present
- reduced-motion behavior is present
- decorative artwork has appropriate accessibility treatment
- saved Faith Space cards remain draggable and actionable
- production build, lint, and the complete regression suite pass

Visual review must cover desktop and mobile layouts, logo legibility, star density, text contrast, motion calmness, missing-asset fallback, and Faith Space navigation.

## Delivery

All code, optimized artwork, tests, and written content are saved to the existing Base44 EVANGEL app and mirrored to the existing GitHub repository on the main branch. A Base44 checkpoint is created after successful verification.
