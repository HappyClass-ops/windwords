/* Temporary Classic resources. No localStorage, DOM, or permanent upgrades. */
window.PipSupplies=(()=>{
  const items=[
    {id:'shield',art:'shield',name:'Cloud rescue',cost:4,detail:'One wrong landing costs no heart. Used automatically, then gone.'},
    {id:'heart',art:'heart',name:'Mend a heart',cost:3,detail:'Refill one missing heart now. You can carry three hearts.'},
    {id:'reveal',art:'chime',name:'Picture hint',cost:2,detail:'Add one word-type reveal. Use it inside a picture clue. Carry up to three.'}
  ];
  let classic=false,stars=0,shield=false,atStop=false,bought=new Set();
  function reset(mode){classic=mode==='classic';stars=0;shield=false;atStop=false;bought.clear();}
  function enter(){atStop=classic;bought.clear();}
  function leave(){atStop=false;}
  function stock(state){return items.map(item=>{
    const full=item.id==='shield'?shield:item.id==='heart'?state.hearts>=3:state.clues>=3;
    const reason=!classic||!atStop?'At Classic checkpoint stops':bought.has(item.id)?'Bought at this stop':full?'Already full':stars<item.cost?'Need '+(item.cost-stars)+' more run stars':'';
    return {...item,disabled:!!reason,label:reason||'Get · '+item.cost+' run stars'};
  });}
  function purchase(id,state){
    const item=stock(state).find(i=>i.id===id);if(!item||item.disabled)return false;
    stars-=item.cost;bought.add(id);
    if(id==='shield')shield=true;else if(id==='heart')state.hearts++;else state.clues++;
    return true;
  }
  return {reset,enter,leave,stock,purchase,earn(n){if(classic&&Number.isFinite(n)&&n>0)stars+=n;},consumeShield(){if(!classic||!shield)return false;shield=false;return true;},get stars(){return stars;},get atStop(){return atStop;}};
})();
