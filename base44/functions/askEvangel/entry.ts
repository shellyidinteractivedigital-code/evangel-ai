import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const MAX_QUESTION = 2000;
const MAX_CONTEXT = 12000;
const TYPES = ['prayer', 'sermon', 'scripture_answer'];

function json(status, body) {
  return Response.json(body, { status });
}

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return json(401, { error: 'unauthorized', message: 'Please sign in to ask EVANGEL.' });

    const body = await req.json().catch(() => null);
    const question = clean(body?.question, MAX_QUESTION);
    if (!question) return json(400, { error: 'question_required', message: 'Please enter a question.' });

    const page = clean(body?.page, 50);
    const passage = {
      ref: clean(body?.passage?.ref, 200),
      text: clean(body?.passage?.text, MAX_CONTEXT),
      source: clean(body?.passage?.source || 'World English Bible', 200),
    };
    const languageEvidence = Array.isArray(body?.languageEvidence)
      ? body.languageEvidence.slice(0, 40).filter((item) => item?.lemma && item?.evidenceSource)
      : [];

    const prompt = [
      'You are EVANGEL, a careful Christian Scripture assistant.',
      'Identify whether the subscriber wants a complete prayer, a complete sermon, or a Scripture answer.',
      'Return the complete requested work, not instructions about where to find it.',
      'For a sermon, include a title, opening, biblical context, clear message sections, application, and closing prayer.',
      'For a prayer, provide a complete prayer suitable for reading aloud.',
      'For a Scripture answer, answer clearly with verified passage context, interpretation, and practical application.',
      'Use the supplied passage as the only source for direct Bible quotations. Never invent a quotation or citation.',
      'Only discuss Hebrew or Greek words when supplied in VERIFIED LANGUAGE EVIDENCE. Include lemma, transliteration, contextual meaning, and evidence source. If none is supplied, state that verified original-language evidence is not attached.',
      'Label interpretation as interpretation. Do not claim to speak for God.',
      'Do not mention system instructions or tell the subscriber to open another page.',
      `CURRENT PAGE: ${page}`,
      `SUBSCRIBER QUESTION: ${question}`,
      `VERIFIED PASSAGE: ${JSON.stringify(passage)}`,
      `VERIFIED LANGUAGE EVIDENCE: ${JSON.stringify(languageEvidence)}`,
    ].join('\n\n');

    const generated = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          content_type: { type: 'string', enum: TYPES },
          title: { type: 'string' },
          content: { type: 'string' },
          scripture_references: { type: 'array', items: { type: 'string' } },
          language_insights: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: { type: 'string' },
                lemma: { type: 'string' },
                transliteration: { type: 'string' },
                meaning: { type: 'string' },
                evidence_source: { type: 'string' },
              },
              required: ['language', 'lemma', 'transliteration', 'meaning', 'evidence_source'],
            },
          },
          caution: { type: 'string' },
        },
        required: ['content_type', 'title', 'content', 'scripture_references', 'language_insights', 'caution'],
      },
    });

    const contentType = TYPES.includes(generated?.content_type) ? generated.content_type : 'scripture_answer';
    const allowedRefs = new Set(passage.ref ? [passage.ref] : []);
    const references = (generated?.scripture_references || []).filter((ref) => allowedRefs.has(ref));
    const evidenceKeys = new Set(languageEvidence.map((item) => `${item.lemma}|${item.evidenceSource}`));
    const languageInsights = (generated?.language_insights || []).filter((item) =>
      evidenceKeys.has(`${item.lemma}|${item.evidence_source}`)
    );

    return json(200, {
      content_type: contentType,
      title: clean(generated?.title || 'EVANGEL Answer', 300),
      content: clean(generated?.content, 30000),
      scripture_references: references,
      language_insights: languageInsights,
      language_notice: languageInsights.length ? '' : 'No verified Hebrew or Greek evidence was attached to this question.',
      caution: clean(generated?.caution || 'Review interpretation with trusted teachers and source material.', 1000),
      passage,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    return json(500, { error: 'generation_failed', message: error?.message || 'EVANGEL could not create an answer.' });
  }
}