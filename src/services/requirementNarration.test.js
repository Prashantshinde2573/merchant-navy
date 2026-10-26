import test from 'node:test';
import assert from 'node:assert/strict';
import { requirementGreeting, selectRequirementVoice, prepareRequirementNarration, requirementPrompt, createRequirementNarrator } from './requirementNarration.js';

const at = hour => new Date(2026, 9, 26, hour, 0);
const samantha = { name:'Samantha', lang:'en-US' };
const neerja = { name:'Microsoft Neerja Online (Natural)', lang:'en-IN' };

test('greeting uses Good afternoon locally between noon and five, otherwise Hey', () => {
  for (const [hour, expected] of [[0,'Hey'],[5,'Hey'],[11,'Hey'],[12,'Good afternoon'],[16,'Good afternoon'],[17,'Hey'],[23,'Hey']]) {
    assert.equal(requirementGreeting(at(hour)), expected);
  }
});

test('natural female voices outrank basic voices and male voices are never selected', () => {
  const male = {name:'Microsoft Prabhat Online (Natural)',lang:'en-IN'};
  assert.equal(selectRequirementVoice([male,samantha,neerja]),neerja);
  assert.equal(selectRequirementVoice([male,samantha]),samantha);
  assert.equal(selectRequirementVoice([male,{name:'Google UK English Male',lang:'en-GB'}]),null);
  assert.equal(selectRequirementVoice([{name:'Unknown English voice',lang:'en-IN'}]),null);
});

test('quality is preferred over accent, then Indian English among comparable female voices', () => {
  const aria = {name:'Microsoft Aria Online (Natural)',lang:'en-US'};
  const sangeeta = {name:'Sangeeta',lang:'en-IN'};
  assert.equal(selectRequirementVoice([sangeeta,aria]),aria);
  assert.equal(selectRequirementVoice([aria,neerja]),neerja);
  assert.equal(selectRequirementVoice([samantha,{name:'Samantha (Enhanced)',lang:'en-US'}]).name,'Samantha (Enhanced)');
});

test('greeting and following text share one conversational sentence with sensible punctuation', () => {
  const text = requirementPrompt({greeting:'Good afternoon',firstQuestion:true,heading:'Describe your requirement',support:'Help text',describing:true});
  assert.equal(text,'Good afternoon, let’s get your post ready. What do you need? Tell me about the work, and I’ll help with the details.');
  const next = requirementPrompt({firstQuestion:false,heading:'Which port is this for?',support:'Include all the ports you need.'});
  assert.equal(next,'Which port is this for? Include all the ports you need.');
  assert.equal(requirementPrompt({firstQuestion:false,heading:'Review your post',support:'Check the details.'}),'Review your post. Check the details.');
});

test('spoken units, budgets and dates expand without changing the displayed post', () => {
  const source = 'Supply 150 MT ASAP. Budget INR 40,000 – 50,000. Needed 27/10/2026.';
  assert.equal(prepareRequirementNarration(source),'Supply 150 metric tonnes as soon as possible. Budget 40,000 to 50,000 Indian rupees. Needed 27 October 2026.');
  assert.equal(prepareRequirementNarration('Budget ₹40,000.'),'Budget 40,000 Indian rupees.');
  assert.equal(prepareRequirementNarration('31/02/2026'),'31/02/2026');
  assert.match(source,/150 MT ASAP/);
});

class Utterance { constructor(text) { this.text = text; } }
function setup(voices = [samantha]) {
  const states = [], errors = [], spoken = [], selected = [];
  const listeners = new Set();
  let cancellations = 0, available = voices;
  const synthesis = {
    getVoices:() => available, speak:value=>spoken.push(value), cancel:()=>cancellations++,
    addEventListener:(_,listener)=>listeners.add(listener), removeEventListener:(_,listener)=>listeners.delete(listener)
  };
  const narrator = createRequirementNarrator({synthesis, Utterance, onState:value=>states.push(value), onError:value=>errors.push(value), onVoice:value=>selected.push(value),voiceWaitMs:20});
  return {narrator,synthesis,states,errors,spoken,selected,listeners,cancellations:()=>cancellations,
    loadVoices(value) { available=value; for (const listener of [...listeners]) listener(); }};
}

test('female voice uses neutral pitch and steady pacing, not an artificial high pitch', () => {
  const state=setup([neerja]);
  assert.equal(state.spoken.length,0);
  state.narrator.speak('Hey, which port is this for?');
  const utterance=state.spoken[0];
  assert.equal(utterance.voice,neerja);
  assert.equal(utterance.pitch,1);
  assert.equal(utterance.rate,1);
  assert.equal(utterance.volume,1);
  assert.equal(state.selected[0].natural,true);
  utterance.onstart();
  assert.equal(state.states.at(-1),'speaking');
  utterance.onend();
  assert.equal(state.states.at(-1),'idle');
});

test('greeting stays in the same utterance as the question for a smooth transition', () => {
  const state=setup();
  state.narrator.speak('Hey, let’s get your post ready. What do you need?');
  assert.equal(state.spoken.length,1);
  assert.equal(state.spoken[0].text,"Hey, let's get your post ready. What do you need?");
  assert.equal(state.spoken[0].rate,0.98);
});

test('waits for asynchronously loaded female voices instead of choosing a male default', () => {
  const state=setup([{name:'Rishi',lang:'en-IN'}]);
  state.narrator.speak('A question');
  assert.equal(state.spoken.length,0);
  assert.equal(state.states.at(-1),'starting');
  state.loadVoices([samantha]);
  assert.equal(state.spoken[0].voice,samantha);
  assert.equal(state.listeners.size,0);
});

test('missing female voice reports the limitation rather than falling back to male', async () => {
  const state=setup([]);
  state.narrator.speak('A question');
  await new Promise(resolve=>setTimeout(resolve,35));
  assert.equal(state.spoken.length,0);
  assert.equal(state.states.at(-1),'error');
  assert.match(state.errors.at(-1),/female voice/);
  assert.equal(state.listeners.size,0);
});

test('mute cancels voice discovery and late-loaded voices cannot start playback', async () => {
  const state=setup([]);
  state.narrator.speak('A question');
  const lateListener=[...state.listeners][0];
  state.narrator.stop();
  state.loadVoices([neerja]);
  lateListener();
  await new Promise(resolve=>setTimeout(resolve,30));
  assert.equal(state.spoken.length,0);
  assert.equal(state.states.at(-1),'idle');
  assert.equal(state.listeners.size,0);
});

test('mute, recording and unmount immediately cancel active speech and ignore late callbacks', () => {
  const state=setup();
  state.narrator.speak('A question');
  const utterance=state.spoken[0], lateStart=utterance.onstart;
  state.narrator.stop();
  assert.equal(state.cancellations(),1);
  assert.equal(utterance.onstart,null);
  lateStart();
  assert.equal(state.states.at(-1),'idle');
});

test('next question replaces previous speech with the same voice and pacing', () => {
  const state=setup();
  state.narrator.speak('First question');
  const lateEnd=state.spoken[0].onend;
  state.narrator.speak('Next question');
  state.spoken[1].onstart();
  lateEnd();
  assert.equal(state.states.at(-1),'speaking');
  assert.equal(state.cancellations(),1);
  assert.equal(state.spoken[0].voice,state.spoken[1].voice);
  assert.equal(state.spoken[0].rate,state.spoken[1].rate);
  state.spoken[1].onend();
});

test('speech errors preserve text and permit retry', () => {
  const state=setup();
  state.narrator.speak('A question');
  state.spoken[0].onerror({error:'not-allowed'});
  assert.match(state.errors.at(-1),/Try Listen again/);
  state.narrator.speak('A question');
  assert.equal(state.errors.at(-1),'');
  state.spoken[1].onerror({error:'interrupted'});
  assert.equal(state.states.at(-1),'idle');
});

test('unavailable engines and synchronous failures fall back to text', () => {
  const errors=[];
  createRequirementNarrator({synthesis:null,Utterance:null,onState:()=>{},onError:value=>errors.push(value)}).speak('Question');
  assert.match(errors[0],/unavailable/);
  const state=setup();
  state.synthesis.speak=()=>{throw new Error('Blocked');};
  state.narrator.speak('Question');
  assert.equal(state.states.at(-1),'error');
  assert.match(state.errors.at(-1),/continue with the text/);
});
