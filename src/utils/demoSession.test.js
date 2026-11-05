import test from 'node:test';
import assert from 'node:assert/strict';
import {readDemoSession,saveDemoSession,clearDemoSession} from './demoSession.js';
function storage(){const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};}
test('two browser-tab sessions retain different accounts across reads',()=>{
 const ronak=storage(),yuvraj=storage();saveDemoSession(ronak,'ronakrawat3@gmail.com');saveDemoSession(yuvraj,'shivhare.yuvraj@gmail.com');
 assert.equal(readDemoSession(ronak).currentUser,'ronakrawat3@gmail.com');assert.equal(readDemoSession(yuvraj).currentUser,'shivhare.yuvraj@gmail.com');
 assert.equal(readDemoSession(ronak).isAuthenticated,true);assert.equal(readDemoSession(yuvraj).isAuthenticated,true);
 clearDemoSession(ronak);assert.equal(readDemoSession(ronak).isAuthenticated,false);assert.equal(readDemoSession(yuvraj).isAuthenticated,true);
});
