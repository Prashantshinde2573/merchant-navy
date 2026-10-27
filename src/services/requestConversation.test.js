import test from 'node:test';
import assert from 'node:assert/strict';
import {requestConversationTurn} from './requestConversation.js';
const initial={scopeOfWork:'',selectedServices:[],selectedPorts:[],currency:'USD',minBudget:'',maxBudget:'',serviceDates:'',isAsap:false};
test('chat asks one missing question while preserving the collected request',async()=>{
 const first=await requestConversationTurn('We need fresh water.','en',initial);
 assert.equal(first.question,'Which port is this for?');
 const next=await requestConversationTurn('We need fresh water.\nMumbai','en',initial);
 assert.deepEqual(next.draft.selectedPorts,['Mumbai']);
 assert.equal(next.question,'When do you need it?');
 assert.match(next.draft.scopeOfWork,/fresh water/);
});
test('a complete chat request goes to review without redundant questions',async()=>{
 const result=await requestConversationTurn('Need fresh water in Mumbai tomorrow, budget INR 40000.','en',initial);
 assert.equal(result.question,'Your request is ready to review.');
 assert.equal(result.draft.currency,'INR');
});
