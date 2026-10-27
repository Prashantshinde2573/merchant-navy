import test from 'node:test';
import assert from 'node:assert/strict';
import {startRequirementVoiceOpening} from './requirementVoiceOpening.js';

function setup(hour=9) {
 const spoken=[],states=[],errors=[],recognizers=[];
 class Utterance {constructor(text){this.text=text;}}
 const options={language:'en',locale:'en-IN',now:()=>new Date(2026,9,27,hour),Utterance,
  synthesis:{getVoices:()=>[{name:'Samantha',lang:'en-US'}],speak:value=>spoken.push(value),cancel:()=>{}},
  recognitionFactory:options=>{recognizers.push(options);return{stop:()=>states.push('processing'),cancel:()=>{}};},
  onText:()=>{},onState:value=>states.push(value),onError:value=>errors.push(value),onFinish:()=>{}
 };
 const session=startRequirementVoiceOpening(options);
 return{session,options,spoken,states,errors,recognizers};
}
test('opening speaks the greeting then exact prompt before creating a microphone session',()=>{
 const state=setup(9);
 assert.equal(state.spoken[0].text,'Good morning. Please describe your requirements.');
 assert.equal(state.recognizers.length,0);
 state.spoken[0].onstart();
 assert.equal(state.states.at(-1),'speaking');
 assert.equal(state.recognizers.length,0);
 state.spoken[0].onend();
 assert.equal(state.recognizers.length,1);
 assert.equal(state.recognizers[0].locale,'en-IN');
 state.session.cancel();
});
test('each new session re-evaluates morning, afternoon and evening at start time',()=>{
 for(const[hour,greeting]of[[9,'Good morning'],[14,'Good afternoon'],[19,'Good evening']]){
  const state=setup(hour);
  assert.equal(state.spoken[0].text,`${greeting}. Please describe your requirements.`);
  state.session.cancel();
 }
});
test('canceling or stopping the opening never starts the microphone from late playback events',()=>{
 for(const action of ['stop','cancel']){
  const state=setup();const lateEnd=state.spoken[0].onend;
  state.session[action]();lateEnd();
  assert.equal(state.recognizers.length,0);
 }
});
test('failed or interrupted playback cannot silently skip ahead to listening',()=>{
 for(const error of ['not-allowed','synthesis-failed','interrupted']){
  const state=setup();state.spoken[0].onerror({error});
  assert.equal(state.recognizers.length,0);
  if(error!=='interrupted')assert.equal(state.states.at(-1),'error');
  state.session.cancel();
 }
});
test('unavailable playback reports an error without requesting microphone access',()=>{
 const state=setup();state.session.cancel();
 startRequirementVoiceOpening({...state.options,synthesis:null});
 assert.equal(state.recognizers.length,0);
 assert.equal(state.errors.length,1);
});
