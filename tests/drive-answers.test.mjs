import test from 'node:test';
import assert from 'node:assert/strict';
import { answerDriveQuestion } from '../src/features/drive/driveAnswers.js';

const verse = { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.' };

test('Drive answer stays grounded in the selected passage and is short enough to speak', () => {
  const result = answerDriveQuestion({ question: 'What does this mean?', verse });
  assert.match(result.answer, /Psalm 46:10/);
  assert.match(result.answer, /Be still/i);
  assert.ok(result.answer.length < 520);
  assert.ok(result.nextAction);
});

test('Drive answer does not claim divine appointment or that EVANGEL speaks for God', () => {
  const result = answerDriveQuestion({ question: 'Did God pick this verse for me?', verse });
  assert.doesNotMatch(result.answer, /God (?:picked|chose|sent) this verse for you/i);
  assert.match(result.answer, /cannot know|cannot determine|does not claim/i);
});

test('Drive answer recognizes application and context intents', () => {
  assert.match(answerDriveQuestion({ question: 'How do I apply this?', verse }).answer, /practice|apply|today/i);
  assert.match(answerDriveQuestion({ question: 'Give me context', verse }).answer, /context/i);
});