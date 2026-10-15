import {houses,items,correct} from './basics-data.js';
const $=id=>document.getElementById(id);
const reader={ru:'1emibfvbdqQzbkvP06jRgV9CKmIKAZbu8',dao:'1K_jfC8zaTjdB1VYEi4FXZO3yqAtY2Tj3',mo:'1ZR_jv9bJUShgKZgy-WdSpjamrXIhXnkO',fa:'1Y426EWeCiphSUSY-Phh9vrf3uR8wvu1L',fo:'1DgdxWmNkDr22Sze26MjL-juHOmhtmLPF'};
for(const [id,name,han,label,idea,people,terms,nuance,source] of houses){
 const row=document.createElement('article');
 row.innerHTML=`<h3>${name} <span lang="zh">${han}</span><small>${label}</small></h3><div><p class="idea">${idea}</p><p class="people">${people}</p><details><summary>Key terms &amp; source</summary><p>${terms}</p><p>${nuance}</p><p class="muted">${source} · <a href="https://drive.google.com/file/d/${reader[id]}/view">Course reading</a></p></details></div>`;
 $('houses').append(row);
}
let queue=[...items],position=0,missed=[],answered=false;
function mode(practice){$('guide').hidden=practice;$('exercise').hidden=!practice;$('learn').setAttribute('aria-pressed',String(!practice));$('practice').setAttribute('aria-pressed',String(practice));}
function render(){answered=false;$('feedback').replaceChildren();$('next').hidden=true;$('choices').replaceChildren();
 if(position===queue.length){$('count').textContent='Round complete';$('prompt').textContent=missed.length?`${missed.length} ideas to review`:'All ideas matched.';
 $('feedback').textContent=missed.length?'Review the statements you missed, with the same short explanations.':'Use a passage from the readings to support your house’s position in the debate.';
 if(missed.length){const b=document.createElement('button');b.textContent='Review missed statements';b.onclick=()=>{queue=missed;missed=[];position=0;render();$('prompt').focus();};$('choices').append(b);}return;}
 const item=queue[position];$('count').textContent=`${position+1} / ${queue.length}`;$('prompt').textContent=item.text;
 for(const [id,name,han] of houses){const b=document.createElement('button');b.textContent=`${name} ${han}`;b.onclick=()=>{if(answered)return;answered=true;const ok=correct(item,id);if(!ok)missed.push(item);for(const btn of $('choices').children)btn.disabled=true;b.dataset.result=ok?'correct':'incorrect';
 const label=houses.find(h=>h[0]===item.house)[1];$('feedback').textContent=`${ok?'Correct — '+label+'.':'This statement fits '+label+'.'} ${item.explanation}`;
 $('next').hidden=false;$('next').textContent=position+1===queue.length?'Finish round':'Next statement';$('next').focus();};$('choices').append(b);}
}
$('next').onclick=()=>{position++;render();$('prompt').focus();};
$('restart').onclick=()=>{queue=[...items];position=0;missed=[];render();$('prompt').focus();};
$('learn').onclick=()=>mode(false);$('practice').onclick=()=>mode(true);$('start').onclick=()=>{mode(true);$('prompt').focus();};render();
