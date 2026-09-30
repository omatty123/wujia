import {categories,customCards,CUSTOM_KEY,houses} from './model.js';
const $=id=>document.getElementById(id);
let bank=Object.fromEntries(Object.values(categories).map(c=>[c,[]]));
const schoolMap={ru:'儒家',dao:'道家',mo:'墨家',fa:'法家'};
try {for(const c of customCards(localStorage.getItem(CUSTOM_KEY)))bank[categories[c.cat]].push({id:c.id.slice(7),text:c.text,pronounce:c.pronounce,correctSchool:schoolMap[c.answers[0]]})}catch{$('storage-note').textContent='Browser storage is unavailable. Cards cannot be saved.'}
function save(next){try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(next));bank=next;return true}catch{$('message').textContent='Could not save. Your existing cards have not been changed. Check browser storage settings.';return false}}
function render(){
 $('list').replaceChildren();
 for(const [cat,items] of Object.entries(bank))for(const item of items){const li=document.createElement('li'),label=document.createElement('span'),del=document.createElement('button');label.textContent=`${item.text} · ${cat} · ${Object.values(houses).find(h=>h.includes(item.correctSchool))}`;del.type='button';del.textContent='Delete';del.setAttribute('aria-label','Delete '+item.text);del.addEventListener('click',()=>{const next={...bank,[cat]:bank[cat].filter(c=>c.id!==item.id)};if(save(next)){render();$('message').textContent='Card deleted.';$('text').focus()}});li.append(label,del);$('list').append(li)}
 const empty=!Object.values(bank).some(c=>c.length);$('wipe').disabled=empty;if(empty){const li=document.createElement('li');li.textContent='No custom cards saved.';$('list').append(li)}
}
$('add-form').addEventListener('submit',e=>{e.preventDefault();const cat=$('cat').value,text=$('text').value.trim();if(!text){$('text').setCustomValidity('Enter card text.');$('text').reportValidity();return}if(bank[cat].length>=200){$('message').textContent='This category has 200 custom cards. Delete a card before adding another.';return}const item={id:crypto.randomUUID(),text,pronounce:$('pronounce').value.trim(),correctSchool:$('school').value};if(save({...bank,[cat]:[...bank[cat],item]})){render();$('message').textContent='Card saved. Return to or refresh the quiz to use it.';$('text').value='';$('pronounce').value='';$('text').focus()}});
$('text').addEventListener('input',()=>$('text').setCustomValidity(''));
$('wipe').addEventListener('click',()=>{$('wipe-confirm').hidden=false;$('confirm-wipe').focus()});
$('cancel-wipe').addEventListener('click',()=>{$('wipe-confirm').hidden=true;$('wipe').focus()});
$('confirm-wipe').addEventListener('click',()=>{if(save(Object.fromEntries(Object.values(categories).map(c=>[c,[]])))){$('wipe-confirm').hidden=true;render();$('message').textContent='Custom cards deleted.';$('text').focus()}});
render();
