/* Checkpoint contracts stay deterministic: urgency changes by mode, literacy does not. */
window.PipChallenge = (() => {
  'use strict';
  const bosses = {
    2: { id:'spore-bramble',name:'The Spore Bramble',theme:'moss',assetId:'spore-bramble',hazard:'bramble',music:'boss-moss',timerMs:{learning:15000,classic:15000},count:5,targetHits:{learning:3,classic:3},right:3,stages:1,kind:'verb',label:'Wake the sleepy words',intro:'Who disturbs my moss?',attack:'My brambles are growing!',hint:'Look for doing words. What can someone do?',defeat:'Ah... my vines rest...' },
    3: { id:'cloud-kraken',name:'The Cloud Kraken',theme:'kraken',assetId:'cloud-kraken',hazard:'squall',music:'boss-kraken',timerMs:{learning:15000,classic:15000},count:5,targetHits:{learning:5,classic:5},right:5,stages:1,kind:'noun',label:'Clear the rain ribbons',intro:'The rain will wash your words away!',attack:'Thunder rolls. Choose a naming word!',hint:'A noun names a person, place, animal or thing.',defeat:'The storm is clearing...' },
    4: { id:'gale-golem',name:'The Gale Golem',theme:'gale',assetId:'gale-golem',hazard:'whirlwind',music:'boss-gale',timerMs:{learning:10000,classic:10000},count:6,targetHits:{learning:7,classic:7},right:7,stages:1,kind:'adjective',label:'Still the cliff-winds',intro:'Feel the rush of the cliff-winds!',attack:'Whirlwind charge!',hint:'An adjective describes what a noun is like.',defeat:'The wild wind is a calm breeze now.' },
    5: { id:'magma-wyrm',name:'Void-Eater Chronos',theme:'volcano',assetId:'void-chronos',hazard:'lava',music:'boss-volcano',timerMs:{learning:8000,classic:8000},targetHits:{learning:10,classic:10},stages:3,intro:'The void awakens! Can your words seal the rift?',attack:'Prismatic void wave, strike!',defeat:'The beacons... they shine... the fire is calm at last!',rounds:[
      {count:5,right:2,kind:'noun',label:'Break the obsidian shield',hint:'Find naming words to crack the shield.'},
      {count:6,right:2,kind:'verb',label:'Dodge the magma fountains',hint:'Find action words Pip can do.'},
      {count:6,right:3,kind:'adverb',label:'Light the final beacon',hint:'Find words that tell how, when or where.'}
    ] }
  };
  function checkpoint(mode,phase,stage=0){
    const base=bosses[phase]||bosses[2],safeStage=Math.max(0,Math.min(base.stages-1,stage)),round=base.rounds?.[safeStage]||base;
    const learning=mode!=='classic';
    const totalHits=base.targetHits?.[learning?'learning':'classic']||(base.stages>1?base.rounds.reduce((s,r)=>s+r.right,0):5);
    return {...base,...round,stage:safeStage,stages:learning?1:base.stages,targetHits:totalHits,right:learning&&phase===5?10:round.right,timerMs:base.timerMs[learning?'learning':'classic'],learning};
  }
  return {bosses,checkpoint};
})();
