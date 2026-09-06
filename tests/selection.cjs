const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const context={window:{}};vm.createContext(context);for(const file of ['vocabulary.js','selection.js'])vm.runInContext(fs.readFileSync(__dirname+'/../'+file,'utf8'),context);
const v=context.window.PipVocabulary,S=context.window.PipSelection;let seed=17;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
for(const phase of [2,3,4,5])for(const adverbs of [false,true])for(const target of ['noun','verb','adjective',...(adverbs?['adverb']:[])]){
 const kinds=['noun','verb','adjective',...(adverbs?['adverb']:[])],bank=v.phases[phase].words,selector=S.create(v.accepts,random);
 for(let round=0;round<60;round++){
  const boss=round%7===6,count=boss?5:4,right=boss?(phase===5?3:2):1,history=selector.history;
  const out=selector.draw(bank,kinds,target,count,right);assert.equal(new Set(out.map(o=>o.word)).size,out.length);assert.equal(out.filter(o=>o.bossCorrect).length,right);
  for(const item of out){assert.equal(item.bossCorrect,v.accepts(item.word,target));const eligible=[...new Set(kinds.flatMap(k=>bank[k]))].filter(w=>v.accepts(w,target)===item.bossCorrect);const need=item.bossCorrect?right:count-right;if(eligible.filter(w=>!history.flat().includes(w)).length>=need)assert(!history.flat().includes(item.word),'avoid previous two shown rounds when pools permit');}
 }
 selector.reset();assert.equal(selector.history.length,0);
}
const tiny=S.create(w=>w==='nest',()=>.5),bank={noun:['nest','cat']};assert.equal(tiny.draw(bank,['noun'],'verb',5,2).length,2);for(let i=0;i<10;i++)assert.equal(tiny.draw(bank,['noun'],'verb',5,2).length,2);
const relax=S.create(w=>w==='nest',()=>.5);relax.draw({noun:['nest','cat']},['noun'],'verb',2);relax.draw({noun:['nest','dog']},['noun'],'verb',2);const next=relax.draw({noun:['nest','cat','dog']},['noun'],'verb',2);assert(next.some(o=>o.word==='cat'),'oldest round relaxes before newest');
console.log('PASS: seeded normal/checkpoint selection across every phase/kind/adverb setting; exact counts, valid distractors, uniqueness, two-round history and finite shortage fallback.');
