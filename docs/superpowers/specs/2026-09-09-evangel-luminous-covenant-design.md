# EVANGEL Luminous Covenant Brand System

Date: 2026-09-09
Status: Approved design
App: Evangelai.ai
Base44 app ID: 6a909e3367998a3c5c5d1783

## 1. Purpose

EVANGEL needs a memorable sacred-modern identity that feels hopeful, trustworthy, human, and premium. The visual system must support Scripture study, prayer, sermon creation, listening, saved work, and the Concordant study method without looking generic, theatrical, cluttered, or denominationally exclusive.

## 2. Approved Creative Direction

The approved direction is the Luminous Covenant version of the Celestial Seal.

The central symbol is a circular midnight-blue seal containing an open Bible that becomes an illuminated golden road. The road leads toward a soft dawn horizon beneath one guiding star. The mark communicates Scripture as the beginning of a lived path. It remains symbolic and does not depict people.

The identity uses calm dimensional light rather than spectacle. Stars sparkle softly in place. It contains no shooting stars, random boxes, excessive particles, or decorative motion that competes with reading.

## 3. Logo Family

### Primary lockup

The primary lockup combines the Celestial Seal with the EVANGEL wordmark. It is used on the Home page, About page, whitepaper, and wide branded surfaces.

### Navigation lockup

The navigation version pairs a simplified seal with the EVANGEL name and the existing Scripture-focused descriptor. In the top-left desktop position, the seal and wordmark use covenant gold, illuminated gold, and deep sanctuary blue. The top-left logo does not use a white treatment. It remains readable in the desktop sidebar.

### Compact mark

The compact mark contains the simplified circular seal, open Bible, road, and guiding star. It is used in mobile navigation, small buttons, loading states, and profile-sized surfaces.

### App icon and favicon

The app icon uses the compact mark on a midnight field with a luminous gold rim. The Bible and road must remain recognizable at small sizes. The favicon uses the simplest geometry and no wordmark.

### Wordmark

EVANGEL is set in a refined high-contrast serif with generous letter spacing. Supporting interface typography remains highly readable. Decorative type is not used for paragraphs or controls.

Approved display line: “THE WORD • THE WAY • THE LIGHT”.

## 4. Color and Material Language

- Midnight: #02060B
- Deep sanctuary blue: #061321
- Horizon blue: #17384D
- Covenant gold: #E7B653
- Illuminated gold: #F7DB9A
- Scripture ivory: #F7F3E8
- Calm silver text: #AAB6C6

Surfaces use restrained glass, deep blue-black depth, thin gold edges, and soft internal highlights. The seal may use subtle dimensional metal and enamel cues but must remain crisp enough to reproduce as an SVG.

## 5. Home Image System

The Home hero uses a cinematic symbolic landscape. An open Bible in the foreground becomes a gently illuminated road that travels into a hopeful dawn horizon. The atmosphere includes sparse stationary sparkling stars, deep blue distance, soft gold light, and generous negative space for the existing headline and actions.

The image contains no embedded words, watermarks, people, crosses added as scenery, excessive clouds, fantasy architecture, shooting stars, or clutter. The page remains readable without the image.

The road direction visually echoes the road inside the Celestial Seal so the icon feels connected to the experience.

## 6. About Image System

The About page uses a quieter companion image: an open Bible near the beginning of a luminous path at first light. The mood is heartfelt, welcoming, and educational. The image supports the approved first-person plural story about believers and educators using technology in service to God.

The image does not imply that EVANGEL speaks for God, replaces Scripture, or has endorsement from concordant.org.

## 7. Concordant and Whitepaper Treatment

The whitepaper uses the formal seal and a restrained star field. Concordant-method sections receive a subtle source-study motif using lines, word forms, and contextual connections, not invented manuscript imagery.

Hebrew and Greek examples remain selectable text in the interface. They are not baked into generated images. Source evidence, translation, interpretation, and reflection remain visually distinguishable.

## 8. Motion

Stars may twinkle through opacity and scale changes. The horizon glow may breathe slowly. The seal may receive a very subtle light sweep only on large hero surfaces.

There are no shooting stars, fast parallax, spinning seals, pulsing text, or continuous movement that distracts from Scripture. All nonessential motion stops under prefers-reduced-motion.

## 9. Accessibility and Responsive Behavior

- The logo has an accessible text label.
- Decorative images use empty alternative text.
- Meaningful hero and About images receive concise descriptive alternative text.
- Text contrast meets WCAG AA.
- The seal remains recognizable at 32 pixels.
- The wordmark hides before it becomes illegible.
- Mobile crops preserve the Bible, road, and horizon.
- Content and controls remain usable when images fail to load.
- Generated raster assets use responsive formats and dimensions to avoid unnecessary download size.

## 10. Asset Set

The implementation will provide:

1. Primary Celestial Seal SVG
2. Compact Celestial Seal SVG
3. Navigation wordmark lockup
4. Favicon SVG
5. Installable app icons at required sizes
6. Home cinematic landscape
7. About symbolic landscape
8. Social-share image
9. Whitepaper brand header treatment

Project filenames will be stable, descriptive, and versioned during review. Selected final assets will replace the current temporary mark references.

## 11. Application Integration

The shared EvangelMark component becomes the single vector source for primary and compact logo variants. Page-specific images are referenced from public brand assets. The Home, About, whitepaper, desktop navigation, mobile header, manifest, favicon, and social metadata use the same approved identity.

The implementation avoids duplicating complex SVG markup across pages.

## 12. Interaction and Link Integrity

Every visible interactive control must have a working destination or action. The implementation will audit desktop navigation, mobile navigation, footer links, Home calls to action, About and whitepaper links, legal and support links, Creator and Library actions, Faith Space actions, and persistent EVANGEL Bot shortcuts.

Play and Listen buttons must route through the selected EVANGEL API voice. Voice previews must play the voice named on the card. Ask the Word must use a supported realtime voice. Loading, success, subscription, configuration, provider, and rate-limit states must be visible. A failed API request must never silently play a different device voice.

Keyboard activation, disabled states during requests, and descriptive accessible labels are required.

## 13. Quality and Verification

Automated tests will verify:

- The primary and compact mark are used in required surfaces.
- Manifest and favicon reference the approved asset family.
- Home and About reference the approved responsive images.
- Decorative imagery is accessible.
- Shooting-star implementation is absent.
- Reduced-motion behavior remains present.
- Existing voice, generator, billing, security, and Faith Space behavior remains intact.

Visual verification will cover desktop and mobile composition, icon legibility, image cropping, contrast, missing-image fallback, and reduced-motion behavior.

## 14. Separate Voice Access Workstream

After the brand work, EVANGEL will enable Marin and Cedar for every signed-in account with conservative free-account limits. Marin is the free gentle female voice and Cedar is the free warm male voice. Coral, Shimmer, Onyx, and Echo remain premium. Voice requests remain authenticated, server-side, allowlisted, and rate-limited. API failures must display a clear message and must never masquerade as a selected voice by silently substituting a device voice.

## 15. Non-Goals

This project does not change EVANGEL theology, rewrite generator content, add a new image-generation feature for subscribers, clone a user voice, remove authentication, expose provider keys, or claim endorsement by concordant.org.