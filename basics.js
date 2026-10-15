import {houses,items,correct} from './basics-data.js';
const $=id=>document.getElementById(id);
const reader={ru:'1emibfvbdqQzbkvP06jRgV9CKmIKAZbu8',dao:'1K_jfC8zaTjdB1VYEi4FXZO3yqAtY2Tj3',mo:'1ZR_jv9bJUShgKZgy-WdSpjamrXIhXnkO',fa:'1Y426EWeCiphSUSY-Phh9vrf3uR8wvu1L',fo:'1DgdxWmNkDr22Sze26MjL-juHOmhtmLPF'};
for(const [id,name,han,label,idea,people,terms,nuance,source] of houses){
 const row=document.createElement('article');
 row.innerHTML=`<h3>${name} <span lang="zh">${han}</span><small>${label}</small></h3><div><p class="idea">${idea}</p><p class="people">${people}</p><details><summary>Key terms &amp; source</summary><p>${terms}</p><p>${nuance}</p><p class="muted">${source} · <a href="https://drive.google.com/file/d/${reader[id]}/view">Course reading</a></p></details></div>`;
 $('houses').append(row);
}
let queue=[...items],position=0,missed=[],answered=false,auto=true,timer=null,active="learn";
function stopTimer(){clearTimeout(timer);timer=null;}
function advance(){stopTimer();position++;render();$("prompt").focus();}
function schedule(){stopTimer();if(auto&&answered&&active==="practice"&&position<queue.length)timer=setTimeout(advance,5000);}
function mode(view){stopTimer();active=view;for(const [tab,section] of [['learn','guide'],['practice','exercise'],['matrix-tab','matrix']]){$(section).hidden=tab!==view;$(tab).setAttribute('aria-pressed',String(tab===view));}schedule();}

function render(){stopTimer();answered=false;$('feedback').replaceChildren();$('next').hidden=true;$('choices').replaceChildren();
 if(position===queue.length){$('count').textContent='Round complete';$('prompt').textContent=missed.length?`${missed.length} ideas to review`:'All ideas matched.';
 $('feedback').textContent=missed.length?'Review the statements you missed, with the same short explanations.':'Use a passage from the readings to support your house’s position in the debate.';
 if(missed.length){const b=document.createElement('button');b.textContent='Review missed statements';b.onclick=()=>{queue=missed;missed=[];position=0;render();$('prompt').focus();};$('choices').append(b);}return;}
 const item=queue[position];$('count').textContent=`${position+1} / ${queue.length}`;$('prompt').textContent=item.text;
 for(const [id,name,han] of houses){const b=document.createElement('button');b.textContent=`${name} ${han}`;b.onclick=()=>{if(answered)return;answered=true;const ok=correct(item,id);if(!ok)missed.push(item);for(const btn of $('choices').children)btn.disabled=true;b.dataset.result=ok?'correct':'incorrect';
 const label=houses.find(h=>h[0]===item.house)[1];$('feedback').textContent=`${ok?'Correct — '+label+'.':'This statement fits '+label+'.'} ${item.explanation}`;
 $('next').hidden=false;$('next').textContent=position+1===queue.length?'Finish round':'Next statement';schedule();};$('choices').append(b);}
}
$('next').onclick=advance;
$('auto').onclick=()=>{auto=!auto;$('auto').textContent=`Auto-advance: ${auto?'on':'off'}`;$('auto').setAttribute('aria-pressed',String(auto));schedule();};
$('restart').onclick=()=>{queue=[...items];position=0;missed=[];render();$('prompt').focus();};
$('learn').onclick=()=>mode('learn');$('practice').onclick=()=>mode('practice');$('start').onclick=()=>{mode('practice');$('prompt').focus();};render();

$('matrix-tab').onclick=()=>mode('matrix-tab');
let selected=null;const placements=new Map();
function card(item){const b=document.createElement('button');b.className='matrix-card';b.draggable=true;b.dataset.card=String(item.id);b.setAttribute('aria-pressed',String(selected===item.id));b.textContent=item.text;
 if(placements.has(item.id)){const ok=correct(item,placements.get(item.id));b.dataset.result=ok?'correct':'incorrect';const status=document.createElement('small');status.textContent=ok?'Correct':'Move to another house';b.append(status);}
 b.onclick=()=>{selected=item.id;drawMatrix();$('matrix-feedback').textContent=`Selected: ${item.text} Choose a house.`;document.querySelector('.house-column>button').focus();};
 b.ondragstart=e=>{selected=item.id;e.dataTransfer.setData('text/plain',String(item.id));e.dataTransfer.effectAllowed='move';};
 return b;
}
function place(house,id=selected){const item=items.find(i=>i.id===id);if(!item)return;placements.set(id,house);selected=null;drawMatrix();const ok=correct(item,house);$('matrix-feedback').textContent=`${ok?'Correct.':'Try another house.'} ${item.explanation}`;}
function drawMatrix(){const board=$('matrix-board'),bank=$('matrix-bank');board.replaceChildren();bank.replaceChildren();
 for(const [id,name,han] of houses){const col=document.createElement('div');col.className='house-column';col.dataset.house=id;const b=document.createElement('button');b.textContent=`${name} ${han}`;b.setAttribute('aria-label',`Place in ${name}`);b.onclick=()=>place(id);col.append(b);
 col.ondragover=e=>{e.preventDefault();col.classList.add('drop-target');};col.ondragleave=()=>col.classList.remove('drop-target');col.ondrop=e=>{e.preventDefault();const raw=e.dataTransfer.getData('text/plain');if(/^\d+$/.test(raw))place(id,Number(raw));};
 for(const item of items.filter(i=>placements.get(i.id)===id))col.append(card(item));board.append(col);}
 for(const item of items.filter(i=>!placements.has(i.id)))bank.append(card(item));
 const right=items.filter(i=>correct(i,placements.get(i.id))).length;$('matrix-progress').textContent=`${placements.size} / ${items.length} placed · ${right} correct${right===items.length?' · Matrix complete':''}`;
}
$('matrix-reset').onclick=()=>{placements.clear();selected=null;drawMatrix();$('matrix-feedback').textContent='Matrix reset. Choose a statement to begin.';};drawMatrix();
