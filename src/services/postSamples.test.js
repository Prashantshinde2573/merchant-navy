import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanRequirementSamples,FRENCH_REQUIREMENT} from '../data/postSamples.js';
test('removes only the retired sample and seeds French requirement once',()=>{
 const other={id:'keep',scopeOfWork:'Need 40 litre freshwater at Mumbai, budget 40000'};
 const result=cleanRequirementSamples([{id:'retire',title:'I want a 40 litre empty water freshwater or Mumbai port with 40000 budget post&#x20;'},other]);
 assert.deepEqual(result.removedIds,['retire']);
 assert.ok(result.posts.includes(other));
 assert.equal(result.posts[0].sourceLanguage,'fr');
 assert.deepEqual(cleanRequirementSamples(result.posts).posts,result.posts);
 assert.equal(result.posts.filter(p=>p.id===FRENCH_REQUIREMENT.id).length,1);
});
