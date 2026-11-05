import test from 'node:test';
import assert from 'node:assert/strict';
import {transitionApplications as transition,COMPANY_EMAIL as owner,APPLICANT_EMAIL as applicant,compactBudget,quotePrice,compactMoneyText,unreadThreadMessages,quoteRequestMessage} from './companyWorkflow.js';
const post={id:'workflow-test-post',ownerId:owner,status:'Live',ports:['Chennai'],services:['Canal Transit Agency Support']};
const now='2026-11-05T09:30:00.000Z';
const quote={amount:'1500',currency:'USD',validUntil:'2026-12-05',details:'Mock quotation'};
const roundTrip=records=>JSON.parse(JSON.stringify(records));
function apply(){return transition([],'apply',applicant,{id:'test-application',post,message:'I can provide this service.'},now);}
function toQuote(){let records=apply();records=transition(records,'invite',owner,{id:'test-application',message:'Let us discuss.'},now);return transition(records,'requestQuote',owner,{id:'test-application'},now);}
test('complete Ronak-owner / Yuvraj-applicant journey survives serialized reloads',()=>{
 let records=roundTrip(apply());assert.equal(records[0].ownerId,owner);assert.equal(records[0].status,'applied');
 assert.equal(records[0].events[0].recipient,owner);
 records=roundTrip(transition(records,'invite',owner,{id:'test-application'},now));assert.equal(records[0].status,'discussion');assert.ok(records[0].threadId);
 for(const actor of [owner,applicant]) records=roundTrip(transition(records,'message',actor,{id:'test-application',message:'A mock chat reply'},now));
 assert.equal(records[0].messages.length,3);
 records=roundTrip(transition(records,'requestQuote',owner,{id:'test-application'},now));assert.equal(records[0].status,'quotation_requested');
 records=roundTrip(transition(records,'quote',applicant,{id:'test-application',...quote},now));assert.equal(records[0].status,'quoted');assert.equal(records[0].quote.amount,1500);
 records=roundTrip(transition(records,'award',owner,{id:'test-application'},now));assert.equal(records[0].status,'awarded');assert.equal(records[0].events.at(-1).recipient,applicant);
 records=roundTrip(transition(records,'complete',applicant,{id:'test-application'},now));assert.equal(records[0].status,'completed');assert.equal(records[0].events.at(-1).recipient,owner);
 records=roundTrip(transition(records,'review',owner,{id:'test-application',quality:5,communication:4,timeliness:5,feedback:'Mock feedback'},now));
 assert.equal(records[0].review.feedback,'Mock feedback');assert.equal(records[0].events.at(-1).recipient,applicant);
 assert.throws(()=>transition(records,'review',owner,{id:'test-application',quality:5,communication:5,timeliness:5},now),/already rated/);
});
test('duplicates do not create extra applications, invitations or awards',()=>{
 const records=apply();assert.equal(transition(records,'apply',applicant,{id:'duplicate',post,message:'Again'},now),records);
 const invited=transition(records,'invite',owner,{id:'test-application'},now);assert.equal(transition(invited,'invite',owner,{id:'test-application'},now),invited);
});
test('roles and dependencies reject invalid transitions',()=>{
 let records=apply();
 assert.throws(()=>transition([],'apply',owner,{post,message:'Self'},now),/own requirement/);
 assert.throws(()=>transition(records,'invite',applicant,{id:'test-application'},now),/request owner/);
 assert.throws(()=>transition(records,'quote',applicant,{id:'test-application',...quote},now),/request.*quotation first/);
 assert.throws(()=>transition(records,'message',applicant,{id:'test-application',message:'Too early'},now),/invitation/);
 assert.throws(()=>transition(records,'award',owner,{id:'test-application'},now),/submitted quotation/);
 records=toQuote();
 assert.throws(()=>transition(records,'quote',owner,{id:'test-application',...quote},now),/applying merchant/);
 assert.throws(()=>transition(records,'quote','another@example.test',{id:'test-application',...quote},now),/another company/);
 records=transition(records,'quote',applicant,{id:'test-application',...quote},now);
 assert.throws(()=>transition(records,'award',applicant,{id:'test-application'},now),/request owner/);
 records=transition(records,'award',owner,{id:'test-application'},now);
 assert.throws(()=>transition(records,'complete',owner,{id:'test-application'},now),/awarded merchant/);
 assert.throws(()=>transition(records,'review',owner,{id:'test-application',quality:5,communication:5,timeliness:5},now),/completed/);
});
test('invalid or expired quotations and incomplete ratings are rejected',()=>{
 let records=toQuote();
 for(const payload of [{...quote,amount:0},{...quote,currency:'INVALID'},{...quote,validUntil:'2020-01-01'}])assert.throws(()=>transition(records,'quote',applicant,{id:'test-application',...payload},now));
 records=transition(records,'quote',applicant,{id:'test-application',...quote},now);
 assert.throws(()=>transition(records,'award',owner,{id:'test-application'},'2027-01-01T10:00:00.000Z'),/expired/);
 records=transition(records,'award',owner,{id:'test-application'},now);records=transition(records,'complete',applicant,{id:'test-application'},now);
 assert.throws(()=>transition(records,'review',owner,{id:'test-application',quality:0,communication:5,timeliness:5},now),/all three/);
});
test('job-card amounts use one symbol, K notation and no missing-budget placeholder',()=>{
 assert.equal(compactBudget('250000.00','300000.00','INR'),'₹250K - 300K');
 assert.equal(compactBudget('1800','2200','USD'),'$1.8K - 2.2K');assert.equal(compactBudget('0','500','USD'),'$0 - 500');assert.equal(compactBudget('',null),'');
});

test('invitation preserves mock attachment and formatting and rejects oversized inputs',()=>{
 const invite={id:'test-application',message:'Please discuss.',messageHtml:'<p><strong>Please discuss.</strong></p>',fileName:'scope.pdf',fileType:'application/pdf',fileSize:128};
 const records=transition(apply(),'invite',owner,invite,now);
 assert.equal(records[0].invitation.fileName,'scope.pdf');
 assert.equal(records[0].invitation.messageHtml,invite.messageHtml);
 assert.match(records[0].messages[0].body,/scope.pdf/);
 assert.throws(()=>transition(apply(),'invite',owner,{...invite,fileSize:21*1024*1024},now));
 assert.throws(()=>transition(apply(),'invite',owner,{...invite,message:'x'.repeat(1501)},now));
 const fixture=transition([],'invite',owner,{...invite,id:`reference-application-${post.id}`,post,reference:{scopeSummary:'Demo application'}},now);
 assert.equal(fixture[0].status,'discussion');
 assert.equal(fixture[0].applicantId,applicant);
});

 test('large quotation and saved message amounts use compact notation',()=>{
 assert.equal(quotePrice({amount:270000,currency:'INR'}),'₹270K');
 assert.equal(quotePrice({amount:275000,currency:'INR'}),'₹275K');
 assert.equal(compactMoneyText('₹270,000.00 · Valid until tomorrow'),'₹270K · Valid until tomorrow');
 });

test('invites and chat messages maintain participant-specific unread counts',()=>{
 let records=transition(apply(),'invite',owner,{id:'test-application',message:'Please discuss.'},now);
 assert.equal(unreadThreadMessages(records[0],owner),0);assert.equal(unreadThreadMessages(records[0],applicant),1);
 records=transition(roundTrip(records),'markThreadRead',applicant,{id:'test-application'},now);
 assert.equal(unreadThreadMessages(records[0],applicant),0);
 records=transition(records,'message',applicant,{id:'test-application',message:'Available to help.'},now);
 assert.equal(unreadThreadMessages(records[0],owner),1);assert.equal(unreadThreadMessages(records[0],applicant),0);
 records=transition(records,'markThreadRead',owner,{id:'test-application'},now);
 assert.equal(unreadThreadMessages(records[0],owner),0);
});
test('quote request is editable before Send and persists the sent message',()=>{
 const draft=quoteRequestMessage('Bluesea Marine Works Pvt Ltd.');
 let records=transition(apply(),'invite',owner,{id:'test-application',message:'Discuss.'},now);
 assert.equal(records[0].status,'discussion');assert.match(draft,/Hi Bluesea/);
 const edited=draft+'\nPlease include documentation.';
 records=transition(records,'requestQuote',owner,{id:'test-application',message:edited},now);
 assert.equal(records[0].status,'quotation_requested');assert.equal(records[0].messages.at(-1).body,edited);
 assert.equal(records[0].messages.at(-1).type,'quote_requested');
});
