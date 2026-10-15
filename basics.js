import {houses,items,correct,stages} from './basics-data.js?v=stages';
import {attempt,record,passed,shuffled} from './stage-model.js';
const $=id=>document.getElementById(id);
const reader={ru:'1emibfvbdqQzbkvP06jRgV9CKmIKAZbu8',dao:'1K_jfC8zaTjdB1VYEi4FXZO3yqAtY2Tj3',mo:'1ZR_jv9bJUShgKZgy-WdSpjamrXIhXnkO',fa:'1Y426EWeCiphSUSY-Phh9vrf3uR8wvu1L',fo:'1DgdxWmNkDr22Sze26MjL-juHOmhtmLPF'};
for(const [id,name,han,label,idea,people,terms,nuance,source] of houses){
 const row=document.createElement('article');
 row.innerHTML=`<h3>${name} <span lang="zh">${han}</span><small>${label}</small></h3><div><p class="idea">${idea}</p><p class="people">${people}</p><details><summary>Key terms &amp; source</summary><p>${terms}</p><p>${nuance}</p><p class="muted">${source} · <a href="https://drive.google.com/file/d/${reader[id]}/view">Course reading</a></p></details></div>`;
 $('houses').append(row);
}
let stage=0,unlocked=0,queue=[],position=0,answered=false,auto=true,timer=null,active='learn';
let matching=attempt(),matrix=attempt(),selected=null;
const stageItems=()=>items.filter(i=>i.stage===stage);
const $button=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;return b;};
function stopTimer(){clearTimeout(timer);timer=null;}
function advance(){stopTimer();position++;render();$('prompt').focus();}
function schedule(){stopTimer();if(auto&&answered&&active==='practice'&&position<queue.length)timer=setTimeout(advance,5000);}
function mode(view){stopTimer();active=view;for(const [tab,section] of [['learn','guide'],['practice','exercise'],['matrix-tab','matrix']]){$(section).hidden=tab!==view;$(tab).setAttribute('aria-pressed',String(tab===view));}$('stage-controls').hidden=view==='learn';schedule();}
function stageNav(){const nav=$('stage-nav');nav.replaceChildren();stages.forEach((name,i)=>{const b=$button(`${i+1}. ${name}${i>unlocked?' · locked':''}`,()=>chooseStage(i));b.disabled=i>unlocked;b.setAttribute('aria-current',String(i===stage));nav.append(b);});}
function chooseStage(i){if(i>unlocked)return;stage=i;matching=attempt();matrix=attempt();selected=null;position=0;queue=shuffled(stageItems());render();drawMatrix();stageNav();$('matrix-feedback').textContent='Choose a card to begin.';}
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
function card(item){const b=$button(item.text,()=>{selected=item.id;drawMatrix();$('matrix-feedback').textContent=`Selected: ${item.text} Choose a house.`;document.querySelector('.house-column>button').focus();});b.className='matrix-card';b.draggable=true;b.dataset.card=String(item.id);b.setAttribute('aria-pressed',String(selected===item.id));
 if(Object.hasOwn(matrix.answers,item.id)){const ok=correct(item,matrix.answers[item.id]);b.dataset.result=ok?'correct':'incorrect';const status=document.createElement('small');status.textContent=ok?'Correct':'Move to another house';b.append(status);}
 b.ondragstart=e=>{selected=item.id;e.dataTransfer.setData('text/plain',String(item.id));e.dataTransfer.effectAllowed='move';};return b;}
function place(house,id=selected){const item=stageItems().find(i=>i.id===id);if(!item||matrix.answers[id]===house)return;matrix=record(matrix,item,house);selected=null;drawMatrix();const ok=correct(item,house);$('matrix-feedback').textContent=`${ok?'Correct.':'Try another house. This round now has a mistake.'} ${item.explanation}${item.source?' Source: '+item.source:''}`;}
function drawMatrix(){const board=$('matrix-board'),bank=$('matrix-bank');board.replaceChildren();bank.replaceChildren();$('matrix-completion').replaceChildren();
 const list=stageItems();for(const [id,name,han] of houses){const col=document.createElement('div');col.className='house-column';col.dataset.house=id;const b=$button(`${name} ${han}`,()=>place(id));b.setAttribute('aria-label',`Place in ${name}`);col.append(b);
 col.ondragover=e=>{e.preventDefault();col.classList.add('drop-target');};col.ondragleave=()=>col.classList.remove('drop-target');col.ondrop=e=>{e.preventDefault();col.classList.remove('drop-target');const raw=e.dataTransfer.getData('text/plain');if(/^\d+$/.test(raw))place(id,Number(raw));};
 for(const item of list.filter(i=>matrix.answers[i.id]===id))col.append(card(item));board.append(col);}
 for(const item of queue.filter(i=>!Object.hasOwn(matrix.answers,i.id)))bank.append(card(item));
 const right=list.filter(i=>correct(i,matrix.answers[i.id])).length;const ok=unlock(matrix);$('matrix-progress').textContent=`${stages[stage]} · ${right} / ${list.length} correct · ${matrix.mistakes} mistakes`;
 if(ok){$('matrix-completion').textContent=stage===2?'All three stages passed.':`${stages[stage]} passed — no mistakes. `;completion($('matrix-completion'),true);}
 else if(Object.keys(matrix.answers).length===list.length){$('matrix-completion').textContent='Reset this stage and complete it without mistakes to pass.';}}
$('matrix-reset').onclick=()=>{matrix=attempt();selected=null;drawMatrix();$('matrix-feedback').textContent='Stage reset. Choose a card to begin.';};
chooseStage(0);

// Skip the feedback delay with Right Arrow, without skipping unanswered cards.
document.addEventListener('keydown',event=>{
 if(event.key!=='ArrowRight'||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
 if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 if(active==='practice'&&answered&&position<queue.length){event.preventDefault();advance();}
});
