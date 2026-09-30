import test from 'node:test';
import assert from 'node:assert/strict';
import {cards} from '../data.js';
import {houses,categories,grade,summary,restore,move,customCards} from '../model.js';
const get=id=>cards.find(c=>c.id===id);
const expected={ru:'kongzi mengzi xunzi ren li junzi mengzi-nature xunzi-nature ru1 ru2 ru3 ru4 zhengming',dao:'laozi zhuangzi ziran pu dao1 dao2 dao3',mo:'mozi jianai feigong shangxian jieyong tianzhi mo1 mo2 mo3',fa:'hanfeizi shangyang fa shu shi fa1 fa2 fa3','ru mo':'yi xiao','ru dao fa':'wuwei','mo fa':'centralization'};
const key=new Map(Object.entries(expected).flatMap(([houses,ids])=>ids.split(' ').map(id=>[id,houses.split(' ')])));
test('57 unique cards, original four categories, valid sources and explanations',()=>{
 assert.equal(cards.length,57);assert.equal(new Set(cards.map(c=>c.id)).size,57);
 assert.deepEqual(Object.keys(categories),['people','concepts','aphorisms','applications']);
 for(const c of cards){assert.ok(Object.hasOwn(categories,c.cat));assert.ok(c.explanation.length>20);assert.ok(c.reference);assert.ok(c.sources.length);for(const s of c.sources)assert.match(s.href,/^https:\/\/drive.google.com\/file\/d\/[\w-]+\/view$/)}
 assert.deepEqual(Object.keys(categories).map(cat=>cards.filter(c=>c.cat===cat).length),[9,23,13,12]);
});
test('every scored card in every house matches the independent answer key',()=>{
 assert.equal(cards.filter(c=>c.scored).length,key.size);
 for(const c of cards.filter(c=>c.scored))for(const h of Object.keys(houses))assert.equal(grade(c,h),key.get(c.id).includes(h)?'correct':'incorrect',`${c.id} in ${h}`);
});
test('broad concepts and modern applications cannot produce a false right/wrong score',()=>{
 const unscored=cards.filter(c=>!c.scored);assert.equal(unscored.length,16);
 for(const c of unscored)for(const h of Object.keys(houses))assert.equal(grade(c,h),'discussion');
 for(const c of cards)for(const h of [undefined,null,'','fifth','toString'])assert.equal(grade(c,h),'unplaced');
 assert.ok(cards.filter(c=>c.cat==='applications').every(c=>!c.scored&&c.prompt.length>40));
});
test('only checked, accepted scored placements count; discussion and missing cards are excluded',()=>{
 const sample=[get('kongzi'),get('laozi'),get('people')];
 assert.deepEqual(summary(sample,{kongzi:'ru',laozi:'ru',people:'fa'},[]),{total:3,placed:3,scored:2,correct:0,reviewed:0});
 assert.deepEqual(summary(sample,{kongzi:'ru',people:'fa'},['kongzi','people','laozi']),{total:3,placed:2,scored:2,correct:1,reviewed:2});
});
test('moving, returning and category resets clear stale grades without erasing other categories',()=>{
 let state=restore(JSON.stringify({version:2,placements:{kongzi:'ru',ren:'ru'},checked:['kongzi','ren']}),cards);
 state=move(state,'kongzi','fa');assert.equal(state.placements.kongzi,'fa');assert.deepEqual(state.checked,['ren']);
 state=move(state,'kongzi',null);assert.equal(state.placements.kongzi,undefined);assert.equal(state.placements.ren,'ru');
 assert.equal(move(state,'fake','ru'),state);assert.equal(move(state,'ren','fake'),state);
});
test('saved progress sanitizes damaged, obsolete and duplicate data, adding new cards',()=>{
 for(const raw of [null,'','broken','null','[]','{"version":1}'])assert.deepEqual(restore(raw,cards),restore(null,cards));
 const restored=restore(JSON.stringify({version:2,category:'bogus',placements:{kongzi:'ru',ren:'fake',removed:'dao'},checked:['kongzi','kongzi','ren','removed'],order:['kongzi','kongzi','removed']}),cards);
 assert.deepEqual(restored.placements,{kongzi:'ru'});assert.deepEqual(restored.checked,['kongzi']);assert.equal(restored.category,'people');assert.equal(restored.order.length,57);assert.ok(restored.order.includes('zhengming'));
 const round=restore(JSON.stringify({...restored,version:2}),cards);assert.deepEqual(round,restored);
});
test('legacy custom cards load and malformed records cannot break practice',()=>{
 for(const raw of ['bad','null','[]','{}','{"Key People":[{"id":"bad","text":"Bad house","correctSchool":"toString"}]}'])assert.deepEqual(customCards(raw),[]);
 const raw=JSON.stringify({'Key People':[{id:'a',text:'Example',correctSchool:'儒家'},{id:'a',text:'Duplicate',correctSchool:'道家'},null,{id:'bad',text:'',correctSchool:'法家'}],'Applications':[{id:'b',text:'Case',correctSchool:'墨家'}]});
 const loaded=customCards(raw);assert.equal(loaded.length,2);assert.equal(loaded[0].id,'custom:a');assert.equal(grade(loaded[0],'ru'),'correct');assert.equal(grade(loaded[1],'fa'),'discussion');
 const long=customCards(JSON.stringify({'Key Concepts':[{id:'quote"',text:'x'.repeat(700),pronounce:'字'.repeat(200),correctSchool:'法家'}]}));assert.equal(long[0].text.length,500);assert.equal(long[0].pronounce.length,100);
});
