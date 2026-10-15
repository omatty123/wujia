export function attempt(){return {answers:{},mistakes:0};}
export function record(state,item,house){return {answers:{...state.answers,[item.id]:house},mistakes:state.mistakes+(house===item.house?0:1)};}
export function passed(state,items){return items.length>0&&state.mistakes===0&&items.every(i=>state.answers[i.id]===i.house);}
export function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
