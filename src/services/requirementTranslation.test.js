import test from 'node:test';
import assert from 'node:assert/strict';
import { splitRequirementTranslation, translateRequirementText } from './requirementTranslation.js';
import { REQUIREMENT_LANGUAGES, requirementCopy, requirementLocale, validateRequirementCopy, canonicalRequirementServices, normalizeRequirementDigits, localizedRequirementService, normalizeRequirementNumbers, requirementCurrencyHint, canonicalRequirementPorts, localizedRequirementPort } from './requirementLanguages.js';
import { selectRequirementVoice, requirementGreeting, requirementPrompt, createRequirementNarrator } from './requirementNarration.js';

const response = text => ({ok:true,json:async()=>({responseStatus:200,responseData:{translatedText:text}})});

test('all six language packs have complete fixed copy and microphone locales', () => {
  assert.equal(REQUIREMENT_LANGUAGES.length,6);
  assert.equal(validateRequirementCopy(),true);
  for(const {code,locale} of REQUIREMENT_LANGUAGES) {
    assert.equal(requirementLocale(code),locale);
    assert.ok(requirementCopy('What service do you need?',code));
    if(code!=='en') assert.notEqual(requirementCopy('Continue',code),'Continue');
  }
  assert.equal(requirementLocale('hi'),'hi-IN');
  assert.equal(requirementLocale('mr'),'mr-IN');
});

test('questions, greetings and spoken prompts use the same selected language', () => {
  const greeting=requirementGreeting(new Date(2026,9,26,14),'mr');
  assert.equal(greeting,'शुभ दुपार');
  const prompt=requirementPrompt({greeting,firstQuestion:true,describing:true,language:'mr'});
  assert.match(prompt,/तुम्हाला काय हवे आहे/);
  assert.doesNotMatch(prompt,/What do you need|post ready/);
});

test('classification tags keep canonical values while displayed service names are localized', () => {
  const translated=localizedRequirementService('Fresh Water Supply','hi');
  assert.equal(translated,'ताजे पानी की आपूर्ति');
  assert.equal(canonicalRequirementServices(translated,'hi'),'Fresh Water Supply');
  assert.equal(normalizeRequirementDigits('४०,००० / ٣٠ / ۵۰'),'40,000 / 30 / 50');
});

test('female voice selection never falls back to another language', () => {
  const en={name:'Samantha',lang:'en-US'};
  const hi={name:'Microsoft Swara Online (Natural)',lang:'hi-IN'};
  const mr={name:'Microsoft Aarohi Online (Natural)',lang:'mr-IN'};
  const fr={name:'Microsoft Denise Online (Natural)',lang:'fr-FR'};
  assert.equal(selectRequirementVoice([en,hi,mr,fr],'hi-IN'),hi);
  assert.equal(selectRequirementVoice([en,hi,mr,fr],'mr-IN'),mr);
  assert.equal(selectRequirementVoice([en,hi,mr,fr],'fr-FR'),fr);
  assert.equal(selectRequirementVoice([en,hi],'de-DE'),null);
});

test('non-English narration retains its own language and written units', () => {
  const spoken=[];
  class Utterance { constructor(text) {this.text=text;} }
  const narrator=createRequirementNarrator({synthesis:{getVoices:()=>[{name:'Lekha',lang:'hi-IN'}],speak:value=>spoken.push(value),cancel:()=>{}},Utterance,onState:()=>{},onError:()=>{}});
  narrator.speak('कल 150 MT पानी चाहिए।',{locale:'hi-IN'});
  assert.equal(spoken[0].lang,'hi-IN');
  assert.equal(spoken[0].text,'कल 150 MT पानी चाहिए।');
  narrator.stop();
});

test('UTF-8 chunks respect provider byte limits without dropping Unicode characters', () => {
  const text=('हमें मुंबई में ताजा पानी चाहिए। ').repeat(60);
  const chunks=splitRequirementTranslation(text);
  assert.ok(chunks.length>5);
  assert.ok(chunks.every(chunk=>new TextEncoder().encode(chunk).length<=450));
  assert.equal(chunks.join(' ').replace(/\s+/g,' ').trim(),text.replace(/\s+/g,' ').trim());
});

test('translation handles every paragraph and chunk, including text beyond the old truncation limit', async () => {
  const text=('Need fresh water at Mumbai. ').repeat(55)+'\n\nFinal certificate required.';
  const queries=[];
  const output=await translateRequirementText(text,'en','de',{fetcher:async url=>{const q=new URL(url).searchParams.get('q');queries.push(q);return response(`übersetzt ${q}`);}});
  assert.ok(queries.length>3);
  assert.match(output,/Final certificate required/);
  assert.equal(output.replaceAll('übersetzt ','').replace(/\s+/g,' ').trim(),text.replace(/\s+/g,' ').trim());
});

test('same-language text is returned unchanged and successful translations are cached', async () => {
  let calls=0;
  const fetcher=async()=>{calls++;return response('हमें पानी चाहिए।');};
  assert.equal(await translateRequirementText('Hello','en','en',{fetcher}),'Hello');
  const original='Need water for translation cache test.';
  assert.equal(await translateRequirementText(original,'en','hi',{fetcher}),'हमें पानी चाहिए।');
  await translateRequirementText(original,'en','hi',{fetcher});
  assert.equal(calls,1);
});

test('quota errors and provider warnings are rejected, never prefixed as fake translations', async () => {
  await assert.rejects(()=>translateRequirementText('quota test','en','fr',{fetcher:async()=>({ok:true,json:async()=>({responseStatus:429,responseData:{translatedText:'quota exceeded'}})})}));
  await assert.rejects(()=>translateRequirementText('warning test','en','mr',{fetcher:async()=>response('MYMEMORY WARNING: quota exceeded')}));
});

test('aborted language switches cannot complete or cache a stale translation', async () => {
  const controller=new AbortController();
  controller.abort();
  await assert.rejects(()=>translateRequirementText('abort test','en','hi',{signal:controller.signal,fetcher:async()=>response('stale')}),{name:'AbortError'});
});

test('an unchanged English sentence is not accepted as a translated post', async () => {
  const sentence='Need fresh water and a delivery certificate.';
  await assert.rejects(()=>translateRequirementText(sentence,'en','hi',{fetcher:async()=>response(sentence)}));
  assert.equal(selectRequirementVoice([{name:'Amélie',lang:'fr-FR'}],'fr-FR').name,'Amélie');
});

 test('native currencies, number formats and ports retain canonical post data', () => {
  assert.equal(requirementCurrencyHint('बजट 40000 भारतीय रुपये है।'),'INR');
  assert.equal(requirementCurrencyHint('40 euros'),'EUR');
  assert.equal(requirementCurrencyHint('USD 100 or INR 8000'),null);
  assert.equal(normalizeRequirementNumbers('40.000,50','de'),'40000.50');
  assert.equal(normalizeRequirementNumbers('40 000,50','fr'),'40000.50');
  assert.equal(canonicalRequirementPorts('मुंबई, चेन्नई'),'Mumbai, Chennai');
  assert.equal(localizedRequirementPort('Mumbai','hi'),'मुंबई');
 });
