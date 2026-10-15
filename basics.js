import {houses,items,correct,stages} from './basics-data.js?v=stages';
import {attempt,record,passed,shuffled} from './stage-model.js';
const $=id=>document.getElementById(id);
for(const [id,name,han,label,idea,people,terms,nuance,source] of houses){
 const row=document.createElement('article');
 row.innerHTML=`<h3>${name} <span lang="zh">${han}</span><small>${label}</small></h3><div><p class="idea">${idea}</p><p class="people">${people}</p><details><summary>Key terms &amp; source</summary><p>${terms}</p><p>${nuance}</p><p class="muted">${source}</p></details></div>`;
 $('houses').append(row);
}
let stage=0,unlocked=0,queue=[],position=0,answered=false,auto=true,timer=null,active='learn';
let matching=attempt(),matrix=attempt(),selected=null,slots={};
const stageItems=()=>items.filter(i=>i.stage===stage);
const $button=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;return b;};
function stopTimer(){clearTimeout(timer);timer=null;}
function advance(){stopTimer();position++;render();$('prompt').focus();}
function schedule(){stopTimer();if(auto&&answered&&active==='practice'&&position<queue.length)timer=setTimeout(advance,5000);}
function mode(view){stopTimer();active=view;for(const [tab,section] of [['learn','guide'],['practice','exercise'],['matrix-tab','matrix']]){$(section).hidden=tab!==view;$(tab).setAttribute('aria-pressed',String(tab===view));}$('stage-controls').hidden=view==='learn';schedule();}
function stageNav(){const nav=$('stage-nav');nav.replaceChildren();stages.forEach((name,i)=>{const b=$button(`${i+1}. ${name}${i>unlocked?' · locked':''}`,()=>chooseStage(i));b.disabled=i>unlocked;b.setAttribute('aria-current',String(i===stage));nav.append(b);});}
function chooseStage(i){if(i>unlocked)return;stage=i;matching=attempt();matrix=attempt();slots={};selected=null;position=0;queue=shuffled(stageItems());render();drawMatrix();stageNav();$('matrix-feedback').textContent='Choose a card to begin.';}
function unlock(state){if(passed(state,stageItems())){unlocked=Math.max(unlocked,Math.min(stage+1,2));stageNav();return true;}return false;}
function completion(container,ok){if(ok&&stage<2)container.append($button(`Continue to ${stages[stage+1]}`,()=>chooseStage(stage+1)));}
function render(){stopTimer();answered=false;$('feedback').replaceChildren();$('next').hidden=true;$('choices').replaceChildren();
 $('count').textContent=`${stages[stage]} · ${Math.min(position+1,queue.length)} / ${queue.length} · ${matching.mistakes} mistakes`;
 if(position===queue.length){const ok=unlock(matching);$('prompt').textContent=ok?`${stages[stage]} passed — no mistakes.`:`Reset ${stages[stage].toLowerCase()} and try for a perfect round.`;
 $('feedback').textContent=ok?(stage===2?'All three stages passed.':'The next stage is unlocked.'):'Correct every card on the first attempt in one round to pass.';completion($('choices'),ok);return;}
 const item=queue[position];$('prompt').textContent=item.text;
 for(const [id,name,han] of houses){const b=$button(`${name} ${han}`,()=>{if(answered)return;answered=true;matching=record(matching,item,id);const ok=correct(item,id);for(const btn of $('choices').children)btn.disabled=true;b.dataset.result=ok?'correct':'incorrect';
 const label=houses.find(h=>h[0]===item.house)[1];$('feedback').textContent=`${ok?'Correct — '+label+'.':'This fits '+label+'.'} ${item.explanation}${item.source?' Source: '+item.source:''}`;
 $('count').textContent=`${stages[stage]} · ${position+1} / ${queue.length} · ${matching.mistakes} mistakes`;
 $('next').hidden=false;$('next').textContent=position+1===queue.length?'Finish round':'Next card';schedule();});$('choices').append(b);}
}
$('next').onclick=advance;
$('auto').onclick=()=>{auto=!auto;$('auto').textContent=`Auto-advance: ${auto?'on':'off'}`;$('auto').setAttribute('aria-pressed',String(auto));schedule();};
$('restart').onclick=()=>{matching=attempt();position=0;queue=shuffled(stageItems());render();$('prompt').focus();};
$('learn').onclick=()=>mode('learn');$('practice').onclick=()=>mode('practice');$('start').onclick=()=>{mode('practice');$('prompt').focus();};$('matrix-tab').onclick=()=>mode('matrix-tab');
function card(item){const b=$button(item.text,()=>{selected=item.id;drawMatrix();$('matrix-feedback').textContent=`Selected: ${item.text} Choose an empty box.`;document.querySelector('.empty-slot')?.focus();});b.className='matrix-card';b.draggable=true;b.dataset.card=String(item.id);b.setAttribute('aria-pressed',String(selected===item.id));
 if(Object.hasOwn(matrix.answers,item.id)){const ok=correct(item,matrix.answers[item.id]);b.dataset.result=ok?'correct':'incorrect';const status=document.createElement('small');status.textContent=ok?'Correct':'Move to another house';b.append(status);}
 b.ondragstart=e=>{selected=item.id;e.dataTransfer.setData('text/plain',String(item.id));e.dataTransfer.effectAllowed='move';};return b;}
function place(house,row,id=selected){
 const item=stageItems().find(i=>i.id===id),key=`${house}:${row}`;
 if(!item||Object.values(slots).includes(key))return;
 const capacity=stageItems().filter(i=>i.house===house).length;
 if(row<0||row>=capacity)return;
 if(matrix.answers[id]!==house)matrix=record(matrix,item,house);
 slots[id]=key;selected=null;drawMatrix();
 const ok=correct(item,house);$('matrix-feedback').textContent=`${ok?'Correct.':'Try another house. This round now has a mistake.'} ${item.explanation}${item.source?' Source: '+item.source:''}`;
}
function drawMatrix(){const board=$('matrix-board'),bank=$('matrix-bank');board.replaceChildren();bank.replaceChildren();$('matrix-completion').replaceChildren();
 const list=stageItems(),counts=Object.fromEntries(houses.map(h=>[h[0],list.filter(i=>i.house===h[0]).length]));
 const table=document.createElement('table');table.className='matrix-table';table.dataset.stage=stage;
 const caption=document.createElement('caption');caption.textContent=`${stages[stage]} — one card per box`;table.append(caption);
 const head=document.createElement('thead'),hr=document.createElement('tr');
 const corner=document.createElement('th');corner.scope='col';corner.textContent='Row';hr.append(corner);
 for(const [,name,han] of houses){const th=document.createElement('th');th.scope='col';th.textContent=`${name} ${han}`;hr.append(th);}head.append(hr);table.append(head);
 const body=document.createElement('tbody');
 for(let row=0;row<Math.max(...Object.values(counts));row++){
 const tr=document.createElement('tr'),label=document.createElement('th');label.scope='row';label.textContent=String(row+1);tr.append(label);
 for(const [house,name] of houses){const td=document.createElement('td');
 if(row>=counts[house]){td.className='unused-slot';td.textContent='—';td.setAttribute('aria-label',`${name}, row ${row+1}: no card needed`);tr.append(td);continue;}
 const key=`${house}:${row}`,placed=list.find(i=>slots[i.id]===key),box=document.createElement('div');box.className='matrix-box';box.dataset.slot=key;
 if(placed)box.append(card(placed));else{const button=$button('Drop here',()=>place(house,row));button.className='empty-slot';button.setAttribute('aria-label',`${name}, row ${row+1}, empty box`);box.append(button);}
 td.ondragenter=td.ondragover=e=>{if(placed)return;e.preventDefault();e.dataTransfer.dropEffect='move';box.classList.add('drop-target');};box.ondragleave=()=>box.classList.remove('drop-target');
 td.ondrop=e=>{e.preventDefault();box.classList.remove('drop-target');if(placed)return;const raw=e.dataTransfer.getData('text/plain');if(/^\d+$/.test(raw))place(house,row,Number(raw));};
 td.append(box);tr.append(td);
 }body.append(tr);}table.append(body);board.append(table);
 $('matrix-return').disabled=selected===null||!Object.hasOwn(matrix.answers,selected);
 for(const item of queue.filter(i=>!Object.hasOwn(matrix.answers,i.id)))bank.append(card(item));
 const right=list.filter(i=>correct(i,matrix.answers[i.id])).length;const ok=unlock(matrix);$('matrix-progress').textContent=`${stages[stage]} · ${right} / ${list.length} correct · ${matrix.mistakes} mistakes`;
 if(ok){$('matrix-completion').textContent=stage===2?'All three stages passed.':`${stages[stage]} passed — no mistakes. `;completion($('matrix-completion'),true);}
 else if(Object.keys(matrix.answers).length===list.length){$('matrix-completion').textContent='Reset this stage and complete it without mistakes to pass.';}}
$('matrix-return').onclick=()=>{if(selected===null)return;delete slots[selected];delete matrix.answers[selected];selected=null;drawMatrix();$('matrix-feedback').textContent='Card returned. Mistakes remain counted until you reset.';};
$('matrix-reset').onclick=()=>{matrix=attempt();slots={};selected=null;drawMatrix();$('matrix-feedback').textContent='Stage reset. Choose a card to begin.';};
chooseStage(0);

// Skip the feedback delay with Right Arrow, without skipping unanswered cards.
document.addEventListener('keydown',event=>{
 if(event.key!=='ArrowRight'||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
 if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 if(active==='practice'&&answered&&position<queue.length){event.preventDefault();advance();}
});
