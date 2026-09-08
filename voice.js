/* Latest-intent speech, shared in-flight requests and a bounded persistent audio cache.
   The service owns its API key. Never put an ElevenLabs key in this static site. */
window.PipVoice = (() => {
  const endpoint='https://prep2-phonics-api.goldenhappyaku.workers.dev/api/speech';
  const pending=new Map(),memory=new Map();let token=0,active=null,timer=null,backoff=0,duck=()=>{},enabled=()=>true,unavailable=()=>{};
  let settle=null,watchdog=null;
  function finish(result){clearTimeout(watchdog);const resolve=settle;settle=null;duck(false);resolve?.(result);}
  function stop(){token++;clearTimeout(timer);if(active){active.pause();active=null;}window.speechSynthesis?.cancel();finish('cancelled');}
  async function clip(text){
    if(memory.has(text))return memory.get(text);
    if(pending.has(text))return pending.get(text);
    const request=(async()=>{const cacheKey=new Request(new URL('voice-cache/'+encodeURIComponent(text),location.href));let cache;try{cache=await caches.open('pip-teacher-v1');const saved=await cache.match(cacheKey);if(saved)return URL.createObjectURL(await saved.blob());}catch{}
      if(Date.now()<backoff)throw Error('Voice service cooling down');
      const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
      try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text}),signal:controller.signal});if(!r.ok){if(r.status>=500||r.status===429)backoff=Date.now()+30000;throw Error('Voice service HTTP '+r.status);}if(!r.headers.get('content-type')?.startsWith('audio/'))throw Error('Invalid speech response');const blob=await r.blob();if(!blob.size)throw Error('Empty speech');try{if(cache){await cache.put(cacheKey,new Response(blob,{headers:{'Content-Type':blob.type}}));const keys=await cache.keys();for(const old of keys.slice(0,Math.max(0,keys.length-180)))await cache.delete(old);}}catch{}return URL.createObjectURL(blob);}finally{clearTimeout(timeout);}
    })();pending.set(text,request);try{const url=await request;memory.set(text,url);if(memory.size>100){const first=memory.keys().next().value;URL.revokeObjectURL(memory.get(first));memory.delete(first);}return url;}finally{pending.delete(text);}
  }
  async function playback(clean,role,id,allowBundle=true){
    const manifest=window.PipVoiceManifest;
    const bundle=allowBundle&&manifest?.clips?.find(c=>(c.text===clean||c.text===clean+'.'||clean===c.text+'.')&&c.role===role&&c.scriptVersion===manifest.scriptVersion&&c.styleVersion===manifest.styleVersion);
    let failed=false,audio;
    const fallback=()=>{if(failed||id!==token)return;failed=true;if(audio){audio.pause();if(active===audio)active=null;}if(!enabled()){finish('disabled');return;}if(bundle){playback(clean,role,id,false);return;}unavailable();finish('unavailable');};
    try{const url=bundle?bundle.src:await clip(/[.!?]$/.test(clean)?clean:clean+'.');if(id!==token)return;if(!enabled()){finish('disabled');return;}audio=new Audio(url);audio.volume=role==='pip'?.49:.44;if(role==='pip'&&!bundle?.nativeDelivery){audio.preservesPitch=false;audio.webkitPreservesPitch=false;audio.playbackRate=1.45;}active=audio;audio.onended=()=>{if(id===token&&!failed){active=null;finish('ended');}};audio.onerror=fallback;await audio.play();}catch{fallback();}
  }
  function say(text,role='teacher'){
    stop();if(!enabled())return Promise.resolve('disabled');
    const clean=String(text||'').trim();if(!clean)return Promise.resolve('empty');
    const id=token,completion=new Promise(resolve=>settle=resolve);
    // A stalled browser/audio device must never strand a checkpoint.
    watchdog=setTimeout(()=>{if(id!==token)return;if(active){active.pause();active=null;}window.speechSynthesis?.cancel();token++;finish('timeout');},Math.min(120000,20000+clean.length*120));
    timer=setTimeout(()=>{duck(true);playback(clean,role,id);},180);
    return completion;
  }
  return{configure(options){duck=options.duck;enabled=options.enabled;unavailable=options.unavailable||unavailable;},say,stop};
})();
