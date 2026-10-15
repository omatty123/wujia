import test from 'node:test';
import assert from 'node:assert/strict';
import {houses,items,correct} from '../basics-data.js';
test('all five houses have four basic associations and source references',()=>{
 assert.deepEqual(houses.map(h=>h[0]),['ru','dao','mo','fa','fo']);
 assert.equal(new Set(items.map(i=>i.id)).size,20);
 for(const h of houses){assert.equal(items.filter(i=>i.house===h[0]).length,4);assert.ok(h[8]);}
 const key=['ru','fo','mo','fa','dao','mo','ru','fo','dao','fa','fo','ru','dao','mo','fa','dao','fa','mo','ru','fo'];
 for(const [n,item] of items.entries())for(const h of houses)assert.equal(correct(item,h[0]),key[n]===h[0]);
});
