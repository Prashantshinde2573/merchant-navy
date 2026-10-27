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

test('chat reply context maps a bare budget and named date without losing earlier fields',async()=>{
 const turns=[{text:'Need fresh water.',field:null},{text:'Mumbai',field:'ports'},{text:'15 November 2026',field:'timeline'},{text:'50000 to 60000',field:'budget'}];
 const draft=await buildRequestVoiceDraft(turns.map(turn=>turn.text).join('\n'),'en',empty,{turns});
 assert.deepEqual(draft.selectedServices,['Fresh Water Supply']);assert.deepEqual(draft.selectedPorts,['Mumbai']);
 assert.equal(draft.minBudget,'50000');assert.equal(draft.maxBudget,'60000');
 assert.equal(draft.serviceDates,'15/11/2026 - 15/11/2026');
 assert.equal(draft.scopeOfWork,'Need fresh water.');assert.equal(draft.aiAssisted,true);
});
test('later corrections update budget, port and timing instead of reviving earlier answers',async()=>{
 const turns=[{text:'Need fresh water at Mumbai tomorrow, budget INR 40000.',field:null},{text:'Actually use Chennai, budget INR 50000 and deadline 15 November 2026.',field:null}];
 const draft=await buildRequestVoiceDraft(turns.map(turn=>turn.text).join('\n'),'en',empty,{turns});
 assert.deepEqual(draft.selectedPorts,['Chennai']);assert.equal(draft.minBudget,'50000');assert.equal(draft.currency,'INR');
 assert.equal(draft.serviceDates,'15/11/2026 - 15/11/2026');assert.deepEqual(draft.selectedServices,['Fresh Water Supply']);
});
test('one voice response maps multiple services, ports, budget and a date range',async()=>{
 const draft=await buildRequestVoiceDraft('Need fresh water and hull cleaning at Mumbai and Chennai. Budget INR 50000 to 60000. Needed 15 to 20 November 2026.','en',empty);
 assert.deepEqual(draft.selectedServices,['Fresh Water Supply','Underwater Hull Cleaning']);
 assert.deepEqual(draft.selectedPorts,['Chennai','Mumbai']);assert.equal(draft.minBudget,'50000');assert.equal(draft.maxBudget,'60000');
 assert.equal(draft.serviceDates,'15/11/2026 - 20/11/2026');
});
test('unclear contextual replies and quantities cannot become ports, services or budgets',async()=>{
 for(const[field,text]of[['ports','50000'],['services','not sure'],['budget','150 MT'],['timeline','maybe later']]){
  const draft=await buildRequestVoiceDraft(text,'en',empty,{turns:[{field,text}]});
  assert.deepEqual(draft.selectedPorts,[]);assert.deepEqual(draft.selectedServices,[]);assert.equal(draft.minBudget,'');assert.equal(draft.serviceDates,'');
 }
});
test('new details preserve manual fields and explicit additions retain prior services',async()=>{
 const initial={...empty,scopeOfWork:'Manual vessel specification.',selectedPorts:['Chennai'],selectedServices:['Fresh Water Supply'],currency:'EUR',minBudget:'2000',maxBudget:'3000'};
 const draft=await buildRequestVoiceDraft('Also add hull cleaning.','en',initial);
 assert.deepEqual(draft.selectedServices,['Fresh Water Supply','Underwater Hull Cleaning']);assert.deepEqual(draft.selectedPorts,['Chennai']);assert.equal(draft.currency,'EUR');assert.equal(draft.minBudget,'2000');assert.match(draft.scopeOfWork,/Manual vessel/);
});
test('corrections inside one voice recording use the latest values',async()=>{
 const draft=await buildRequestVoiceDraft('Need fresh water in Mumbai budget INR 40000, actually use Chennai budget INR 55000.','en',empty);
 assert.deepEqual(draft.selectedPorts,['Chennai']);assert.equal(draft.minBudget,'55000');
});
test('explicitly labelled custom service and location map without assigning vague values',async()=>{
 const draft=await buildRequestVoiceDraft('Service required: technical inspection at the vessel. Location: Alang. Budget INR 50000.','en',empty);
 assert.deepEqual(draft.selectedServices,['technical inspection']);assert.deepEqual(draft.selectedPorts,['Alang']);assert.equal(draft.minBudget,'50000');
});
test('invalid and reversed date ranges preserve the manual deadline',async()=>{
 for(const text of ['Need water by 31 November 2026.','Needed 20 November 2026 to 15 November 2026.']){
  const draft=await buildRequestVoiceDraft(text,'en',{...empty,serviceDates:'10/12/2026 - 12/12/2026'});
  assert.equal(draft.serviceDates,'10/12/2026 - 12/12/2026');
 }
});
test('multiple services and ports spread across one response are retained',async()=>{
 const draft=await buildRequestVoiceDraft('Need fresh water in Mumbai. Need hull cleaning in Chennai. Budget INR 60000.','en',empty);
 assert.deepEqual(draft.selectedServices,['Fresh Water Supply','Underwater Hull Cleaning']);assert.deepEqual(draft.selectedPorts,['Mumbai','Chennai']);
});
