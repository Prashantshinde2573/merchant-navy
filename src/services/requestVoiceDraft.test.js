import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRequestVoiceDraft } from './requestVoiceDraft.js';

const empty = {scopeOfWork:'',selectedServices:[],selectedPorts:[],currency:'USD',minBudget:'',maxBudget:'',serviceDates:'',isAsap:false};
test('End Input maps actual speech onto existing form fields without sample values', async () => {
  const draft = await buildRequestVoiceDraft('Need 150 MT fresh water at Mumbai tomorrow, budget INR 40000.', 'en', empty);
  assert.deepEqual(draft.selectedServices,['Fresh Water Supply']);
  assert.deepEqual(draft.selectedPorts,['Mumbai']);
  assert.equal(draft.currency,'INR');
  assert.equal(Number(draft.minBudget),40000);
  assert.match(draft.scopeOfWork,/150 MT/);
  assert.ok(draft.serviceDates);
});
test('empty voice session returns manual information unchanged', async () => {
  const initial = {...empty,scopeOfWork:'Manual details',selectedPorts:['Chennai'],minBudget:'2000',maxBudget:'3000'};
  assert.deepEqual(await buildRequestVoiceDraft('', 'en', initial),initial);
});
test('unclear speech leaves unanswered fields blank and preserves manual values', async () => {
  const initial = {...empty,scopeOfWork:'Original specifications',selectedPorts:['Chennai'],currency:'EUR',minBudget:'2000',maxBudget:'3000'};
  const draft = await buildRequestVoiceDraft('Please arrange a safety inspection.', 'en', initial);
  assert.deepEqual(draft.selectedPorts,['Chennai']);
  assert.deepEqual(draft.selectedServices,[]);
  assert.equal(draft.minBudget,'2000');
  assert.equal(draft.maxBudget,'3000');
  assert.equal(draft.serviceDates,'');
  assert.equal(draft.scopeOfWork,'Original specifications\n\nPlease arrange a safety inspection.');
});
test('non-English scope remains original while recognized fields use canonical values', async () => {
  const draft = await buildRequestVoiceDraft('मुंबई में ताजा पानी चाहिए। बजट 40000 रुपये है।','hi',empty,{translate:async()=> 'Need fresh water in Mumbai, budget INR 40000.'});
  assert.deepEqual(draft.selectedPorts,['Mumbai']);
  assert.equal(draft.currency,'INR');
  assert.match(draft.scopeOfWork,/मुंबई/);
});
test('failed translation never fills a fabricated draft, and cancellation prevents handoff', async () => {
  await assert.rejects(buildRequestVoiceDraft('पानी चाहिए','hi',empty,{translate:async()=>{throw new Error('Unavailable');}}));
  const controller=new AbortController(); controller.abort();
  await assert.rejects(buildRequestVoiceDraft('पानी चाहिए','hi',empty,{signal:controller.signal,translate:async()=> 'Need water.'}),{name:'AbortError'});
});
