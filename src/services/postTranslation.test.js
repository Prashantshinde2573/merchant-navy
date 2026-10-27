import test from 'node:test';
import assert from 'node:assert/strict';
import {originalPostLanguage,normalizePostLanguage,preparePostTranslation} from './postTranslation.js';

test('Hindi post automatically requests English for an English viewer, preserving original content',async()=>{
 const original='मुंबई में जहाज की सफाई की आवश्यकता है।\nबजट 50000 रुपये।';
 const result=await preparePostTranslation(original,undefined,'en',{translate:async(text,from,to)=>{
   assert.equal(text,original);assert.equal(from,'hi');assert.equal(to,'en');return 'Vessel cleaning required in Mumbai.\nBudget INR 50000.';
 }});
 assert.equal(result.translated,true);assert.equal(result.target,'en');assert.equal(result.source,'hi');assert.match(original,/मुंबई/);
});
test('same-language post has no translated state or provider request',async()=>{
 const result=await preparePostTranslation('Fresh water required in Mumbai.','en','en',{translate:()=>{throw new Error('Must not request translation');}});
 assert.equal(result.translated,false);assert.equal(result.value,'Fresh water required in Mumbai.');
});
test('viewer preference dynamically reverses the translation direction',async()=>{
 let pair;
 const result=await preparePostTranslation('Fresh water required in Mumbai.','en','hi',{translate:async(_,source,target)=>{pair=[source,target];return 'मुंबई में ताजा पानी चाहिए।';}});
 assert.deepEqual(pair,['en','hi']);assert.equal(result.translated,true);
});
test('language metadata is normalized, with detection for older posts',()=>{
 assert.equal(originalPostLanguage('नमस्ते','hi-IN'),'hi');
 assert.equal(normalizePostLanguage('Hindi'),'hi');
 assert.equal(originalPostLanguage('मुंबई में पानी चाहिए।',null),'hi');
 assert.equal(originalPostLanguage('English content','invalid'),'en');
});
test('unavailable and unchanged translations return original without a toggle',async()=>{
 const original='मुंबई में पानी चाहिए।';
 const failure=await preparePostTranslation(original,'hi','en',{translate:async()=>{throw new Error('Offline');}});
 assert.equal(failure.translated,false);assert.equal(failure.value,original);
 const unchanged=await preparePostTranslation(original,'hi','en',{translate:async()=>original});
 assert.equal(unchanged.translated,false);
});
test('an old viewer-language request cannot finish after it has been canceled',async()=>{
 const controller=new AbortController();
 const pending=preparePostTranslation('नमस्ते','hi','en',{signal:controller.signal,translate:async()=>{controller.abort();return 'Hello';}});
 await assert.rejects(pending,{name:'AbortError'});
});
