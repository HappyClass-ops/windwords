/* Finite word selection. A shown round, not an answer/help opening, owns history. */
window.PipSelection = (() => {
  function create(accepts, random = Math.random) {
    let history=[];
    const shuffle=items=>{const out=items.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
    function draw(bank,kinds,target,count,correctCount=1) {
      const unique=new Map();
      // Catalogue type chooses what we deliberately teach. Broader acceptance is
      // only a scoring safety net, never permission to show a noun picture as a
      // verb target (for example, "bag"). Prefer the explicit target entry when
      // the same spelling exists in more than one catalogue bank.
      for(const kind of kinds)for(const word of bank[kind]||[])if(!unique.has(word)||kind===target)unique.set(word,{word,kind,bossCorrect:kind===target});
      const rank=word=>history.at(-1)?.includes(word)?2:history.at(-2)?.includes(word)?1:0;
      const take=(items,n)=>shuffle(items).sort((a,b)=>rank(a.word)-rank(b.word)).slice(0,n);
      const correct=take([...unique.values()].filter(item=>item.bossCorrect),Math.min(count,correctCount));
      // Short banks yield fewer choices, never extra valid answers or a rejection loop.
      const wrong=[...unique.values()].filter(item=>!item.bossCorrect&&!accepts(item.word,target));
      const options=shuffle([...correct,...take(wrong,Math.max(0,count-correct.length))]);
      history=[...history,options.map(item=>item.word)].slice(-2);
      return options;
    }
    return {draw,reset(){history=[];},get history(){return history.map(round=>round.slice());}};
  }
  return {create};
})();
