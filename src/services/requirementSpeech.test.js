import test from 'node:test';
import assert from 'node:assert/strict';
import { startRequirementSpeech } from './requirementSpeech.js';

class FakeRecognition {
  static last;
  constructor() { FakeRecognition.last = this; }
  start() { this.started = true; }
  stop() { this.stopped = true; }
  abort() { this.aborted = true; }
}
function setup(Recognition = FakeRecognition) {
  const states = [], texts = [], errors = [];
  let finished = 0;
  const session = startRequirementSpeech({Recognition, initialText:'Need fresh water.',
    onState: value => states.push(value), onText:value => texts.push(value),
    onError:value => errors.push(value), onFinish:() => finished++});
  return {session, recognition:FakeRecognition.last, states, texts, errors, finished:() => finished};
}
const result = transcript => ({results:[[{transcript}]]});

test('voice starts only on request and appends editable interim/final text without submitting', () => {
  const state = setup();
  const rec = state.recognition;
  assert.equal(rec.lang,'en-IN');
  assert.equal(rec.interimResults,true);
  assert.deepEqual(state.states,['requesting']);
  rec.onstart();
  rec.onresult(result('At Mum'));
  rec.onresult(result('At Mumbai tomorrow.'));
  assert.deepEqual(state.texts,['Need fresh water. At Mum','Need fresh water. At Mumbai tomorrow.']);
  assert.equal(state.finished(),0);
  rec.onspeechend();
  rec.onend();
  assert.deepEqual(state.states,['requesting','listening','processing','complete']);
  assert.equal(state.finished(),1);
});

test('stopping shows processing and completes with text ready for review', () => {
  const state = setup();
  state.recognition.onstart();
  state.recognition.onresult(result('400 MT'));
  state.session.stop();
  assert.equal(state.states.at(-1),'processing');
  assert.equal(state.recognition.stopped,true);
  state.recognition.onend();
  assert.equal(state.states.at(-1),'complete');
});

test('permission denial leaves typed text intact and offers a typed fallback', () => {
  const state = setup();
  state.recognition.onerror({error:'not-allowed'});
  assert.match(state.errors[0],/Microphone access was denied/);
  assert.deepEqual(state.texts,[]);
  assert.equal(state.states.at(-1),'error');
  assert.equal(state.finished(),0);
  assert.equal(state.recognition.onend,null);
});

test('cancel/unmount disconnects handlers and ignores results from an old question', () => {
  const state = setup();
  const lateResult = state.recognition.onresult;
  state.session.cancel();
  lateResult(result('must not fill the next answer'));
  assert.equal(state.recognition.aborted,true);
  assert.equal(state.recognition.onresult,null);
  assert.deepEqual(state.texts,[]);
});

test('no-speech and unavailable recognizers provide clear errors', () => {
  const empty = setup();
  empty.recognition.onend();
  assert.match(empty.errors[0],/No speech detected/);
  const unavailable = setup(null);
  assert.equal(unavailable.states.at(-1),'error');
  assert.match(unavailable.errors[0],/unavailable/);
});

test('recognizer startup failures and network errors preserve the typed fallback', () => {
  class BrokenRecognition extends FakeRecognition { start() { throw new Error('Unavailable'); } }
  const broken = setup(BrokenRecognition);
  assert.match(broken.errors[0],/unavailable/);
  const network = setup();
  network.recognition.onerror({error:'network'});
  assert.match(network.errors[0],/could not connect/);
  assert.equal(network.finished(),0);
});

test('microphone uses the selected language locale', () => {
  const session=startRequirementSpeech({Recognition:FakeRecognition,initialText:'',locale:'mr-IN',onState:()=>{},onText:()=>{},onError:()=>{},onFinish:()=>{}});
  assert.equal(FakeRecognition.last.lang,'mr-IN');
  session.cancel();
});
