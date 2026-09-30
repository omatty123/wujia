export const houses = {ru:'Ru 儒家',dao:'Dao 道家',mo:'Mo 墨家',fa:'Fa 法家'};
export const categories = {people:'Key People',concepts:'Key Concepts',aphorisms:'Aphorisms',applications:'Applications'};
export const STORAGE_KEY='hist212-matrix-v2';
export const CUSTOM_KEY='matrixCustomItemsV1';
export function grade(card, house) {
  if (!Object.hasOwn(houses,house)) return 'unplaced';
  if (!card.scored) return 'discussion';
  return card.answers.includes(house) ? 'correct' : 'incorrect';
}
export function summary(cards, placements, checked) {
  const result={total:cards.length,placed:0,scored:0,correct:0,reviewed:0};
  for (const c of cards) {
    if(c.scored) result.scored++;
    if(grade(c,placements[c.id])!=='unplaced') result.placed++;
    if(checked.includes(c.id) && placements[c.id]) {
      result.reviewed++;
      if(grade(c,placements[c.id])==='correct') result.correct++;
    }
  }
  return result;
}
export function restore(raw,cards) {
  const empty={category:'people',placements:{},checked:[],order:cards.map(c=>c.id)};
  try {
    const state=JSON.parse(raw);
    if(!state || state.version!==2) return empty;
    const ids=new Set(cards.map(c=>c.id));
    const placements=Object.fromEntries(Object.entries(state.placements||{}).filter(([id,h])=>ids.has(id)&&Object.hasOwn(houses,h)));
    const checked=Array.isArray(state.checked)?[...new Set(state.checked.filter(id=>ids.has(id)&&placements[id]))]:[];
    const order=Array.isArray(state.order)?[...new Set(state.order.filter(id=>ids.has(id)))]:[];
    return {category:Object.hasOwn(categories,state.category)?state.category:'people',placements,checked,order:[...order,...empty.order.filter(id=>!order.includes(id))]};
  } catch {return empty;}
}
export function move(state,id,house) {
  if(!state.order.includes(id) || (house!==null&&!Object.hasOwn(houses,house))) return state;
  const placements={...state.placements};
  if(house===null) delete placements[id]; else placements[id]=house;
  return {...state,placements,checked:state.checked.filter(x=>x!==id)};
}
export function customCards(raw) {
  const catMap=Object.fromEntries(Object.entries(categories).map(([k,v])=>[v,k]));
  const schoolMap={'儒家':'ru','道家':'dao','墨家':'mo','法家':'fa'};
  const out=[], ids=new Set();
  try {
    const obj=JSON.parse(raw);
    for(const [label,cat] of Object.entries(catMap)) {
      if(!Array.isArray(obj?.[label])) continue;
      for(const c of obj[label].slice(0,200)) {
        if(!c||typeof c.id!=='string'||typeof c.text!=='string'||!c.text.trim()||!Object.hasOwn(schoolMap,c.correctSchool)||ids.has(c.id)) continue;
        ids.add(c.id);
        out.push({id:'custom:'+c.id,text:c.text.slice(0,500),pronounce:typeof c.pronounce==='string'?c.pronounce.slice(0,100):'',cat,answers:[schoolMap[c.correctSchool]],scored:cat!=='applications',kind:'Custom card',reference:'Added in this browser',source:'',explanation:'This card uses the association supplied in the custom-card editor. It has not been checked against the course readings.'});
      }
    }
  }catch{}
  return out;
}
