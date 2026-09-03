import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDriveCommand } from '../src/features/drive/driveCommands.js';

const cases = [
  ['play the verse', 'play'],
  ['repeat that', 'repeat'],
  ['next verse', 'next'],
  ['save this', 'save'],
  ['email me this', 'email'],
  ['start a sermon', 'sermon_start'],
  ['title: Faith on the Road', 'sermon_title'],
  ['point one: keep going', 'sermon_point'],
  ['application: forgive quickly', 'sermon_application'],
  ['illustration: the lighthouse', 'sermon_illustration'],
  ['closing prayer: give us courage', 'sermon_prayer'],
  ['what does this mean', 'ask'],
];

test('Drive Sanctuary parser recognizes core spoken commands', () => {
  for (const [input, type] of cases) assert.equal(parseDriveCommand(input).type, type, input);
});

test('Drive Sanctuary parser preserves sermon field values', () => {
  assert.equal(parseDriveCommand('title: Faith on the Road').value, 'Faith on the Road');
  assert.equal(parseDriveCommand('point two: Stay awake').value, 'Stay awake');
});