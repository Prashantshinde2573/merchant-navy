import test from 'node:test';
import assert from 'node:assert/strict';
import {requestReviewError} from './requestReview.js';
import {buildRequestVoiceDraft} from './requestVoiceDraft.js';
test('manual requests publish without an AI acknowledgment',()=>assert.equal(requestReviewError(false,false),''));
test('AI-assisted requests require acknowledgment even after switching back to the manual form',async()=>{
 const draft=await buildRequestVoiceDraft('Need fresh water at Mumbai.','en',{});
 assert.ok(requestReviewError(draft.aiAssisted,false));assert.equal(requestReviewError(draft.aiAssisted,true),'');
});
test('an empty AI session does not require acknowledgment for manual content',async()=>{
 const draft=await buildRequestVoiceDraft('','en',{scopeOfWork:'Manual post'});
 assert.equal(requestReviewError(draft.aiAssisted,false),'');
});
test('an unclear AI session that changes no manual details does not mark the post AI-generated',async()=>{
 const draft=await buildRequestVoiceDraft('not sure','en',{scopeOfWork:'Manual post',selectedPorts:[],selectedServices:[],currency:'USD',minBudget:'',maxBudget:'',serviceDates:'',isAsap:false});
 assert.equal(draft.aiAssisted,false);assert.equal(requestReviewError(draft.aiAssisted,false),'');
});
