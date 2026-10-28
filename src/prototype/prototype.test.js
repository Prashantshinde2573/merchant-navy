import test from 'node:test';
import assert from 'node:assert/strict';
import {demoTranslate,DEMO_SCOPE,DEMO_SCOPES} from './demoData.js';
import {demoEntitlement} from './entitlements.js';
import {preparePostTranslation} from '../services/postTranslation.js';
import {translateText} from '../services/translationService.js';
import {translateRequirementText} from '../services/requirementTranslation.js';

test('explicit demo translation stays local',async()=>{
 assert.equal(await demoTranslate(DEMO_SCOPE,'en','hi'),DEMO_SCOPES.hi);
 assert.equal((await preparePostTranslation(DEMO_SCOPE,'en','hi',{translate:demoTranslate})).translated,true);
});
test('live translation uses the existing lightweight provider by default',async()=>{
 const prior=globalThis.fetch;
 const urls=[];
 globalThis.fetch=async url=>{urls.push(url);return {ok:true,json:async()=>({responseStatus:200,responseData:{translatedText:'Bonjour à tous les marins.'}})};};
 try{
  assert.equal((await translateText('Hello to every sailor today.','en','fr')).success,true);
  assert.ok(urls[0].startsWith('https://api.mymemory.translated.net/get?'));
 }finally{globalThis.fetch=prior;}
});
test('unsupported fixtures fail honestly rather than showing a fabricated translation',async()=>{
 const result=await preparePostTranslation('Not a known demo sentence.','en','hi',{translate:demoTranslate});
 assert.equal(result.translated,false);assert.equal(result.value,'Not a known demo sentence.');
});
test('demo entitlements cover locked, unlocked, trial, downgrade and override',()=>{
 assert.equal(demoEntitlement('Silver','voice').unlocked,false);
 assert.equal(demoEntitlement('Gold','voice').unlocked,true);
 assert.equal(demoEntitlement('Gold','ports').unlocked,false);
 assert.equal(demoEntitlement('Premium','ports').unlocked,true);
 assert.equal(demoEntitlement('Silver','voice',{trial:true}).unlocked,true);
 assert.equal(demoEntitlement('Silver','ports',{override:true}).unlocked,true);
 assert.equal(demoEntitlement('Silver','unknown').unlocked,false);
});
