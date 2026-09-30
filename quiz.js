import {cards as defaults} from './data.js';
import {houses,categories,STORAGE_KEY,CUSTOM_KEY,grade,summary,restore,move,customCards} from './model.js';
const $=id=>document.getElementById(id);
let storageOK=true;
function read(key){try{return localStorage.getItem(key)}catch{storageOK=false;return null}}
const cards=[...defaults,...customCards(read(CUSTOM_KEY))];
let state=restore(read(STORAGE_KEY),cards),selected=null,dragged=null,query='';
const byId=new Map(cards.map(c=>[c.id,c]));
const notes={people:'Place the eight thinkers. “The People” is a shared, unscored connection.',concepts:'Some terms cross houses. Broad connection cards are unscored; feedback explains the differences.',aphorisms:'Identify the primary association. These cards include paraphrases, story titles, and marked supplementary material.',applications:'Discussion, not a scored test. Place a modern case with a house and explain the connection aloud. More than one reading is possible.'};
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,version:2}))}catch{storageOK=false} $('storage-note').textContent=storageOK?'Progress is saved on this browser only.':'Browser storage is unavailable. You can still practice, but progress will not survive a refresh.'}
function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);return b}
function active(){return state.order.map(id=>byId.get(id)).filter(c=>c.cat===state.category)}
function say(message){$('result').textContent=message}
function focusCard(id){Array.from(document.querySelectorAll('[data-select]')).find(b=>b.dataset.select===id)?.focus()}
function select(id){selected=selected===id?null:id;render();if(selected){$('destinations').querySelector('button').focus()}else focusCard(id)}
function place(house){if(!selected)return;const id=selected;state=move(state,id,house);selected=null;say('');save();render();$('selection').textContent=house?`${byId.get(id).text} placed in ${houses[house]}.`:`${byId.get(id).text} returned to bank.`;focusCard(id)}
function speak(c){if(!('speechSynthesis' in window)){say('Pronunciation is unavailable in this browser.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(c.pronounce);u.lang='zh-CN';u.rate=.8;u.onerror=()=>say('Pronunciation could not play. Try another installed Mandarin voice or browser.');speechSynthesis.speak(u)}
function cardNode(c){
 const li=document.createElement('li');li.className='card';li.dataset.id=c.id;
 const tools=document.createElement('div');tools.className='card-tools';
 const choose=button(c.text,()=>select(c.id));choose.className='choose';choose.dataset.select=c.id;choose.setAttribute('aria-pressed',String(selected===c.id));choose.draggable=true;
 choose.addEventListener('dragstart',e=>{dragged=c.id;e.dataTransfer.setData('text/plain',c.id);e.dataTransfer.effectAllowed='move'});
 choose.addEventListener('dragend',()=>{dragged=null});tools.append(choose);
 if(c.pronounce){const sound=button('',()=>speak(c));sound.className='speaker';sound.setAttribute('aria-label','Hear '+c.pronounce);sound.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M11 5 6 9H3v6h3l5 4V5Z M15 8q5 4 0 8 M18 5q8 7 0 14"/></svg>';tools.append(sound)}
 li.append(tools);const kind=document.createElement('span');kind.className='kind';kind.textContent=c.kind+(c.scored?'':' · unscored');li.append(kind);
 if(c.prompt){const p=document.createElement('p');p.className='prompt';p.textContent=c.prompt;li.append(p)}
 if(state.checked.includes(c.id)&&state.placements[c.id]){
  const status=grade(c,state.placements[c.id]);const f=document.createElement('div');f.className='feedback '+status;
  const title=document.createElement('strong');title.textContent=status==='correct'?'Accepted association':status==='incorrect'?'Try another house':'One starting point for discussion';
  const p=document.createElement('p');p.textContent=c.explanation;f.append(title,p);
  const ref=document.createElement('p');ref.textContent=c.reference;f.append(ref);for(const source of c.sources||[]){const a=document.createElement('a');a.href=source.href;a.target='_blank';a.rel='noopener';a.textContent=source.label;f.append(a)}li.append(f);
 }
 return li;
}
function dropTarget(el,house){el.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move'});el.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain')||dragged;if(byId.get(id)?.cat!==state.category)return;selected=id;place(house);dragged=null})}
function render(){
 $('category-title').textContent=categories[state.category];$('category-note').textContent=notes[state.category];
 $('categories').replaceChildren();for(const [id,label]of Object.entries(categories)){const b=button(label,()=>{state.category=id;query='';$('search').value='';selected=null;$('reset-confirm').hidden=true;say('');save();render();$('categories').querySelector('[aria-current=true]').focus()});b.setAttribute('aria-current',String(state.category===id));$('categories').append(b)}
 const current=active(),s=summary(current,state.placements,state.checked);
 $('progress').textContent=`${s.placed} of ${s.total} placed`+(s.scored?` · ${s.correct} of ${s.scored} scored cards correct`:' · unscored discussion');
 $('check').textContent=state.category==='applications'?'Discuss placements':'Check placements';$('check').disabled=!s.placed;$('reset').disabled=!s.placed&&!current.some(c=>state.checked.includes(c.id));
 $('board').replaceChildren();
 for(const [id,name]of Object.entries(houses)){
  const section=document.createElement('section');section.className='house';section.setAttribute('aria-label',name);
  const assigned=current.filter(c=>state.placements[c.id]===id);const h=document.createElement('h3');h.textContent=name;const count=document.createElement('small');count.textContent=assigned.length+' placed';h.append(count);const ul=document.createElement('ul');
  for(const c of assigned)ul.append(cardNode(c));if(!assigned.length){const li=document.createElement('li');li.className='empty';li.textContent='No cards placed';ul.append(li)}section.append(h,ul);dropTarget(section,id);$('board').append(section);
 }
 const remaining=current.filter(c=>!state.placements[c.id]);const filtered=remaining.filter(c=>(c.text+' '+(c.prompt||'')).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 $('bank-list').replaceChildren(...filtered.map(cardNode));$('bank-empty').hidden=!!filtered.length;$('bank-empty').textContent=remaining.length?'No cards match. Clear your search to see the remaining cards.':'All cards in this category are placed. Check them, or select a placed card to move it.';
 $('destinations').replaceChildren();for(const [id,label]of Object.entries(houses)){const b=button('Place in '+label,()=>place(id));b.disabled=!selected;dropTarget(b,id);$('destinations').append(b)}
 $('destinations').hidden=!selected;$('return').hidden=!selected;$('cancel').hidden=!selected;
 $('selection').textContent=selected?'Selected: '+byId.get(selected).text:'Select a card to place it.';$('return').disabled=!selected||!state.placements[selected];$('cancel').disabled=!selected;
}
$('check').addEventListener('click',()=>{const ids=active().filter(c=>state.placements[c.id]).map(c=>c.id);state.checked=[...new Set([...state.checked,...ids])];save();render();const s=summary(active(),state.placements,state.checked);say(s.scored?`${s.correct} of ${s.scored} scored cards correct. ${s.total-s.placed} unplaced. Read the feedback below each placed card; select any card to move it.`:'Discussion notes are open. Give a concrete reason for the house you chose; these applications have no right/wrong score.')});
$('search').addEventListener('input',e=>{query=e.target.value;render()});
$('return').addEventListener('click',()=>place(null));$('cancel').addEventListener('click',()=>{const id=selected;selected=null;render();focusCard(id)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected){const id=selected;selected=null;render();focusCard(id)}});
$('reset').addEventListener('click',()=>{$('reset-confirm').hidden=false;$('confirm-reset').focus()});
$('cancel-reset').addEventListener('click',()=>{$('reset-confirm').hidden=true;$('reset').focus()});
$('confirm-reset').addEventListener('click',()=>{for(const c of active())state=move(state,c.id,null);selected=null;query='';$('search').value='';$('reset-confirm').hidden=true;save();render();say('This category has been reset. Your other categories are unchanged.');$('categories').querySelector('[aria-current=true]').focus()});
dropTarget($('bank-list'),null);
// Shuffle once on a fresh visit; saved progress keeps its card order.
if(!read(STORAGE_KEY)){for(let i=state.order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.order[i],state.order[j]]=[state.order[j],state.order[i]]}}
render();save();
