/* On-demand elementary meanings; no credentials or eager catalogue downloads.
   Picture-specific originals take priority over the dictionary's first POS sense. */
window.PipMeanings=(()=>{
  const originals={
    'noun:sink':'A basin with taps where you wash your hands or dishes.',
    'verb:sink':'To go down below the surface of water.',
    'noun:sail':'A large piece of cloth that catches the wind to move a boat.',
    'verb:sail':'To travel across water in a boat.',
    'noun:bark':'The outer covering of a tree trunk or branch.',
    'verb:bark':'To make the short, sharp sound a dog makes.'
  };
  const cache=new Map(),pending=new Map();
  const form=s=>String(s||'').toLowerCase().replace(/\*/g,'').replace(/:\d+$/,'');
  const clean=s=>String(s||'').replace(/\{bc\}/g,'').replace(/\{sx\|([^|}]+)[^}]*\}/g,'$1').replace(/\{[^}]*\}/g,'').replace(/\s+/g,' ').trim();
  function select(entries,word,kind){
    if(!Array.isArray(entries))return null;
    for(const e of entries){
      if(!e||typeof e!=='object'||e.meta?.offensive)continue;
      const forms=[e.meta?.id,e.hwi?.hw,...(e.meta?.stems||[])].map(form);
      const pos=String(e.fl||'').toLowerCase().split(/[,; ]+/);
      if(!forms.includes(form(word))||!pos.includes(kind))continue;
      const definition=e.shortdef?.map(clean).find(Boolean);
      if(definition)return {definition,source:'Merriam-Webster Elementary Dictionary'};
    }
    return null;
  }
  async function get(word,kind){
    const key=kind+':'+word;
    if(originals[key])return {definition:originals[key],source:'Pip’s English'};
    if(cache.has(key))return cache.get(key);
    if(pending.has(key))return pending.get(key);
    if(!/^[a-z]+(?:-[a-z]+)*$/.test(word))return null;
    const request=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);
      try{
        const response=await fetch('https://prep2-phonics-api.goldenhappyaku.workers.dev/api/dictionary?word='+encodeURIComponent(word),{signal:controller.signal});
        if(!response.ok)return null;
        const result=select(await response.json(),word,kind);
        // Successful missing senses are cached, transient service failures are not.
        cache.set(key,result);if(cache.size>512)cache.delete(cache.keys().next().value);
        return result;
      }catch{return null;}finally{clearTimeout(timer);}
    })();
    pending.set(key,request);try{return await request;}finally{pending.delete(key);}
  }
  return {get};
})();
