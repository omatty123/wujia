import test from 'node:test';
import assert from 'node:assert/strict';
import {houses,items,stages} from '../basics-data.js';
import {attempt,record,passed,shuffled} from '../stage-model.js';
test('three stages cover all five houses; quotes have exact text and citations',()=>{
 assert.deepEqual(stages,['People','Concepts','Quotes']);assert.equal(new Set(items.map(i=>i.id)).size,items.length);
 for(let stage=0;stage<3;stage++)assert.deepEqual(new Set(items.filter(i=>i.stage===stage).map(i=>i.house)),new Set(houses.map(h=>h[0])));
 assert.equal(items.filter(i=>i.stage===0).length,11);
 for(const i of items.filter(i=>i.stage===2)){assert.ok(i.source);assert.equal(i.text,`“${i.quote}”`);}
});
test('only a complete flawless round passes; fixing mistakes cannot erase them',()=>{
 const list=items.filter(i=>i.stage===0);let state=attempt();assert.equal(passed(state,list),false);
 for(const i of list)state=record(state,i,i.house);assert.equal(passed(state,list),true);
 state=record(state,list[0],'fo');state=record(state,list[0],list[0].house);assert.equal(state.mistakes,1);assert.equal(passed(state,list),false);
 state=attempt();for(const i of list)state=record(state,i,i.house);assert.equal(passed(state,list),true);
 assert.equal(passed(state,items.filter(i=>i.stage===1)),false);assert.equal(passed(attempt(),[]),false);
});
test('shuffling preserves every card without altering the source',()=>{const original=items.map(i=>i.id);assert.deepEqual(shuffled(items).map(i=>i.id).sort((a,b)=>a-b),[...original].sort((a,b)=>a-b));assert.deepEqual(items.map(i=>i.id),original);});
