// Checks the Amani demo safety logic without a browser or a test runner.
// Run: node scripts/test-amani-demo.mjs
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync('src/lib/amaniDemo.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { isCrisisMessage, demoReply, QUICK_REPLIES, GREETING } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

const failures = [];
const expect = (name, ok) => { if (!ok) failures.push(name); };

// Every phrase in the brief, plus common variants, must trigger the safety card.
const crisis = [
  'I am thinking about suicide', 'I feel suicidal', 'i want to kill myself', 'I might end my life', 'ending my life',
  'I have been self-harming', 'self harm', 'self-harm', 'I want to hurt myself', 'I keep hurting myself',
  'I am being abused at home', 'my uncle abuses me', 'I was raped', 'I want to die', 'I WANT TO DIE',
  'I don\u2019t want to live anymore', 'there is no reason to live', 'I took an overdose',
];
crisis.forEach((t) => expect(`crisis detected: ${t}`, isCrisisMessage(t)));

// Ordinary messages and the three chips must not trigger it.
const calm = [
  ...QUICK_REPLIES.map((c) => c.label), 'I am stressed about exams', 'My boss is putting pressure on me',
  'I cannot sleep', 'I feel lonely', 'Thank you', 'This is a therapist-led programme', 'I want to drive to Entebbe',
];
calm.forEach((t) => expect(`not flagged: ${t}`, !isCrisisMessage(t)));

// Demo replies: chips give a tip, the counsellor chip asks for the prompt, nothing is empty.
expect('greeting present', typeof GREETING === 'string' && GREETING.length > 20);
expect('three chips', QUICK_REPLIES.length === 3);
expect('counsellor chip requests prompt', demoReply('I want to talk to a counsellor').wantsCounsellor === true);
expect('school chip is not a counsellor request', !demoReply('I feel stressed about school').wantsCounsellor);
expect('anxious chip replies', demoReply('I feel anxious').text.length > 40);
expect('generic reply varies', demoReply('hmm', 0).text !== demoReply('hmm', 1).text);
expect('no diagnosis wording in replies', ![...QUICK_REPLIES.map((c) => demoReply(c.label).text), demoReply('hmm').text].some((t) => /\bdiagnos(e|ed|is)\b/i.test(t)));

if (failures.length) {
  console.error(`Amani demo checks failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`Amani demo checks passed (${crisis.length} crisis phrases, ${calm.length} calm phrases).`);
