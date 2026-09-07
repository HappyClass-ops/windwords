const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const context={window:{}};vm.createContext(context);for(const file of ['vocabulary.js','selection.js'])vm.runInContext(fs.readFileSync(__dirname+'/../'+file,'utf8'),context);
const v=context.window.PipVocabulary,S=context.window.PipSelection;let seed=17;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
for(const phase of [2,3,4,5])for(const adverbs of [false,true])for(const target of ['noun','verb','adjective',...(adverbs?['adverb']:[])]){
 const kinds=['noun','verb','adjective',...(adverbs?['adverb']:[])],bank=v.phases[phase].words,selector=S.create(v.accepts,random);
 for(let round=0;round<60;round++){
  const boss=round%7===6,count=boss?5:4,right=boss?(phase===5?3:2):1,history=selector.history;
  const out=selector.draw(bank,kinds,target,count,right);assert.equal(new Set(out.map(o=>o.word)).size,out.length);assert.equal(out.filter(o=>o.bossCorrect).length,right);
  for(const item of out){assert.equal(item.bossCorrect,item.kind===target);if(!item.bossCorrect)assert.equal(v.accepts(item.word,target),false,'ambiguous accepted uses cannot be distractors');const eligible=item.bossCorrect?(bank[target]||[]):[...new Set(kinds.flatMap(k=>bank[k]))].filter(w=>!v.accepts(w,target));const need=item.bossCorrect?right:count-right;if(eligible.filter(w=>!history.flat().includes(w)).length>=need)assert(!history.flat().includes(item.word),'avoid previous two shown rounds when pools permit');}
 }
 selector.reset();assert.equal(selector.history.length,0);
}
const tiny=S.create(w=>w==='nest',()=>.5),bank={noun:['cat'],verb:['nest']};assert.equal(tiny.draw(bank,['noun','verb'],'verb',5,2).length,2);for(let i=0;i<10;i++)assert.equal(tiny.draw(bank,['noun','verb'],'verb',5,2).length,2);
const relax=S.create(()=>false,()=>.5);relax.draw({noun:['cat'],verb:['run']},['noun','verb'],'verb',2);relax.draw({noun:['dog'],verb:['hop']},['noun','verb'],'verb',2);const next=relax.draw({noun:['cat','dog'],verb:['sit']},['noun','verb'],'verb',2);assert(next.some(o=>o.word==='cat'),'oldest round relaxes before newest');
const homograph=S.create((word,target)=>word==='bag'&&(target==='noun'||target==='verb')||word==='run'&&target==='verb',()=>.5);const deliberate=homograph.draw({noun:['bag','cat'],verb:['run']},['noun','verb'],'verb',2,1);assert.equal(deliberate.filter(item=>item.bossCorrect).map(item=>item.word).join(','),'run','accepted secondary uses must never become deliberately targeted pictures');assert(!deliberate.some(item=>item.word==='bag'),'an accepted noun/verb collision cannot be used as a misleading verb distractor');
console.log('PASS: seeded normal/checkpoint selection across every phase/kind/adverb setting; exact counts, valid distractors, uniqueness, two-round history and finite shortage fallback.');
