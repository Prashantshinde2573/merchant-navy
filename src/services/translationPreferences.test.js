import test from 'node:test';
import assert from 'node:assert/strict';
import { getUserPreferredLanguage, setUserPreferredLanguage, detectLanguage } from './translationService.js';

test('saved profile language is per viewer with supported-language fallback', () => {
  const previous = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
  try {
    setUserPreferredLanguage('hi','viewer-one');
    setUserPreferredLanguage('mr','viewer-two');
    assert.equal(getUserPreferredLanguage('viewer-one'),'hi');
    assert.equal(getUserPreferredLanguage('viewer-two'),'mr');
    assert.equal(getUserPreferredLanguage('viewer-three'),'en');
    values.set('merchant_navy_language:viewer-one','unsupported');
    assert.equal(getUserPreferredLanguage('viewer-one'),'en');
  } finally { if (previous===undefined) delete globalThis.localStorage; else globalThis.localStorage=previous; }
});
test('English port and services vocabulary is not mistaken for French', () => {
  assert.equal(detectLanguage('We require services at Mumbai port.'),'en');
  assert.equal(detectLanguage('Bonjour, besoin de nettoyage pour notre navire.'),'fr');
  assert.equal(detectLanguage('आम्हाला मुंबईत पाण्याचा पुरवठा पाहिजे.'),'mr');
  assert.equal(detectLanguage('मुंबई में पानी चाहिए।'),'hi');
});
