export const LEGAL_META = {
  brand: 'EVANGEL',
  operator: 'Heartmonics',
  supportEmail: 'support.evangel@gmail.com',
  website: 'https://evangel-ai.com',
  effectiveDate: 'August 30, 2026',
};

export const PRIVACY_SECTIONS = [
  ['What EVANGEL collects', 'We may collect account information, saved Scripture activity, highlights, journals, prayers, study collections, app settings, device and usage information, and information you choose to submit when using EVANGEL. We collect only what is reasonably needed to provide, secure, improve, and support the service.'],
  ['Payments', 'Payments and subscription billing are processed by Stripe. EVANGEL does not receive or store your full card number or CVC. We may store limited billing status and Stripe object identifiers needed to manage access to EVANGEL Plus.'],
  ['AI and study tools', 'Questions or requests submitted to AI-assisted study features may be processed by service providers used to generate the requested response. EVANGEL distinguishes Scripture/source evidence from generated interpretation and does not represent AI output as the voice of God.'],
  ['Voice and microphone', 'Microphone access is permission-based and activates only when you choose a voice feature. Voice input may be transmitted to a speech or AI service to fulfill the request. EVANGEL is designed not to retain raw microphone audio by default for ordinary voice commands. A future saved voice-note feature, if enabled, will be clearly identified before recording is retained.'],
  ['Children and family use', 'EVANGEL can be used for family Bible study. For children under 13, a parent or guardian should create or supervise access. We do not ask a child under 13 to create an independent paid account. Features that collect personal information from a child, including retained voice recordings, require appropriate parental notice and consent when applicable. Voice used only to fulfill a brief command should be processed only as long as reasonably necessary for that request unless a parent has expressly enabled a saved feature.'],
  ['Sharing', 'Journals, prayers, and saved study material are intended to be private to the user or supervised family profile unless the user or parent deliberately chooses to share them. Do not place information in EVANGEL that you do not want processed by the service.'],
  ['Data retention and deletion', 'We retain account and saved content as needed to provide the service and meet legal, security, and operational obligations. Users may contact support.evangel@gmail.com to request account assistance or deletion. Certain limited records may be retained where required for billing, fraud prevention, dispute resolution, or law.'],
  ['Service providers', 'EVANGEL may use infrastructure, payment, AI, speech, analytics, security, and communications providers to operate the service. These providers process information according to their role and applicable agreements.'],
  ['Contact', 'Privacy questions and account requests may be sent to support.evangel@gmail.com.'],
];

export const TERMS_SECTIONS = [
  ['Using EVANGEL', 'EVANGEL provides Scripture reading, study, journaling, prayer, voice, organizational, and AI-assisted tools. You are responsible for using the service lawfully and for the content you choose to save or share.'],
  ['Spiritual and professional guidance', 'EVANGEL is a study and reflection tool. It does not speak for God and is not a substitute for clergy, medical, mental-health, legal, financial, emergency, or other qualified professional advice.'],
  ['Accounts and family profiles', 'You are responsible for safeguarding your account. Parents and guardians are responsible for supervising child profiles and approving purchases, external sharing, and retained voice features for children where applicable.'],
  ['Subscriptions', 'EVANGEL Plus is a paid subscription when offered. The price, billing interval, renewal terms, and any introductory offer are shown before purchase. Web purchases are processed by Stripe. Purchases made through an app store may be governed by that store’s billing terms.'],
  ['Content and availability', 'We work to keep EVANGEL available and accurate, but features, providers, translations, voices, and content may change. Original-language and translation material is provided only where EVANGEL has an appropriate source and right to use it.'],
  ['Acceptable use', 'Do not misuse the service, attempt unauthorized access, interfere with security, scrape protected content, impersonate others, or use EVANGEL to violate law or the rights of another person.'],
  ['Changes and contact', 'We may update these terms as the service evolves. Material changes will be reflected by an updated effective date or other notice. Questions may be sent to support.evangel@gmail.com.'],
];

export const REFUND_SECTIONS = [
  ['Refund requests', 'If you purchased EVANGEL Plus directly on evangel-ai.com through Stripe and believe a charge was made in error, contact support.evangel@gmail.com with the account email and date of charge. Refund requests are reviewed in light of the circumstances, applicable law, and the status of the subscription.'],
  ['App-store purchases', 'Purchases made through Apple, Google, or another app marketplace are generally subject to that marketplace’s payment and refund process. EVANGEL cannot directly reverse a transaction controlled by an app store when the platform requires the refund to be handled there.'],
  ['Disputes', 'Please contact support.evangel@gmail.com before initiating a payment dispute so we can investigate the transaction and try to resolve the issue promptly. Nothing in this policy limits rights that cannot be waived under applicable law.'],
];

export const CANCELLATION_SECTIONS = [
  ['Cancel anytime', 'A recurring EVANGEL Plus subscription may be canceled at any time through the available billing-management flow. For web subscriptions, EVANGEL uses Stripe Customer Portal when available.'],
  ['Access after cancellation', 'Unless the checkout or applicable law states otherwise, canceling stops future renewal and paid access remains available through the end of the current paid billing period.'],
  ['Deleting the app is not cancellation', 'Removing EVANGEL from a device does not automatically cancel a paid subscription. Use the applicable billing portal or app-store subscription settings to cancel.'],
];

export const LEGAL_CONTENT = {
  privacy: { title: 'Privacy Policy', intro: 'How EVANGEL by Heartmonics handles account, study, voice, family, and billing information.', sections: PRIVACY_SECTIONS },
  terms: { title: 'Terms of Use', intro: 'The terms for using EVANGEL and its study, voice, family, and subscription features.', sections: TERMS_SECTIONS },
  refunds: { title: 'Refund & Dispute Policy', intro: 'How to contact us about a charge, refund request, or payment dispute.', sections: REFUND_SECTIONS },
  cancellation: { title: 'Subscription & Cancellation Policy', intro: 'How recurring EVANGEL Plus subscriptions renew and how to stop future renewal.', sections: CANCELLATION_SECTIONS },
};