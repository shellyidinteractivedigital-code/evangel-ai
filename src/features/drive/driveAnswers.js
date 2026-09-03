function lower(value = '') { return String(value).toLowerCase(); }

export function answerDriveQuestion({ question = '', verse }) {
  const ref = verse?.ref || 'this passage';
  const text = verse?.text || '';
  const q = lower(question);

  if (/god.*(?:pick|chose|choose|send)|divinely|meant.*for me/.test(q)) {
    return {
      answer: `EVANGEL does not claim that God chose ${ref} specifically for you, and it cannot determine divine intent. What it can do is help you read the passage carefully: ${ref} says, “${text}”`,
      nextAction: 'Ask for context or application.',
    };
  }

  if (/context|before|after|chapter|setting/.test(q)) {
    return {
      answer: `Context for ${ref}: start with the words actually present in the passage, “${text}” Then read the surrounding verses and chapter before building a larger interpretation. In Drive Mode I keep this short; open Bible Study when parked for the full surrounding text.`,
      nextAction: 'Open Bible Study when parked.',
    };
  }

  if (/apply|application|today|do with this|practice/.test(q)) {
    return {
      answer: `A practical way to apply ${ref} today is to pause before reacting, return to the passage itself, and choose one action consistent with it. Here the central words are, “${text}” Practice that idea in one specific moment rather than trying to solve everything at once.`,
      nextAction: 'Save this application or add it to a sermon.',
    };
  }

  if (/hope|peace|fear|courage|anxious|anxiety|grief|strength/.test(q)) {
    return {
      answer: `${ref} may be useful for reflection because it says, “${text}” EVANGEL can help you stay with the wording, consider its context, and turn it into a prayer or practical reflection without claiming more certainty than the text supports.`,
      nextAction: 'Ask for context, application, or save this moment.',
    };
  }

  return {
    answer: `${ref} says, “${text}” A careful first reading is to notice the main action or claim in those words before adding interpretation. EVANGEL can help with context, application, or a sermon outline, but it does not claim to speak for God.`,
    nextAction: 'Say context, application, start a sermon, or save this.',
  };
}