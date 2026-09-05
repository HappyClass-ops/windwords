/* Latest-intent speech, shared in-flight requests and a bounded persistent audio cache.
   The service owns its API key. Never put an ElevenLabs key in this static site. */
window.PipVoice = (() => {
  const endpoint='https://prep2-phonics-api.goldenhappyaku.workers.dev/api/speech';
  const pending=new Map(),memory=new Map();let token=0,active=null,timer=null,backoff=0,duck=()=>{},enabled=()=>true;
  function stop(){token++;clearTimeout(timer);if(active){active.pause();active=null;}window.speechSynthesis?.cancel();duck(false);}
  async function clip(text){
    if(memory.has(text))return memory.get(text);
    if(pending.has(text))return pending.get(text);
    const request=(async()=>{const cacheKey=new Request(new URL('voice-cache/'+encodeURIComponent(text),location.href));let cache;try{cache=await caches.open('pip-teacher-v1');const saved=await cache.match(cacheKey);if(saved)return URL.createObjectURL(await saved.blob());}catch{}
      if(Date.now()<backoff)throw Error('Voice service cooling down');
      const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
      try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text}),signal:controller.signal});if(!r.ok){if(r.status>=500||r.status===429)backoff=Date.now()+30000;throw Error('Voice service HTTP '+r.status);}if(!r.headers.get('content-type')?.startsWith('audio/'))throw Error('Invalid speech response');const blob=await r.blob();if(!blob.size)throw Error('Empty speech');try{if(cache){await cache.put(cacheKey,new Response(blob,{headers:{'Content-Type':blob.type}}));const keys=await cache.keys();for(const old of keys.slice(0,Math.max(0,keys.length-180)))await cache.delete(old);}}catch{}return URL.createObjectURL(blob);}finally{clearTimeout(timeout);}
    })();pending.set(text,request);try{const url=await request;memory.set(text,url);if(memory.size>100){const first=memory.keys().next().value;URL.revokeObjectURL(memory.get(first));memory.delete(first);}return url;}finally{pending.delete(text);}
  }
  function browser(text,role,id){if(!window.speechSynthesis){duck(false);return;}const voice=new SpeechSynthesisUtterance(text);voice.lang='en-GB';voice.rate=role==='pip'?1:.82;voice.pitch=role==='pip'?1.8:1;voice.volume=.42;const british=speechSynthesis.getVoices().find(v=>/^en-GB/i.test(v.lang));if(british)voice.voice=british;voice.onend=voice.onerror=()=>{if(id===token)duck(false);};speechSynthesis.speak(voice);}
  function say(text,role='teacher'){stop();if(!enabled())return;const clean=String(text||'').trim();if(!clean)return;const id=token;timer=setTimeout(async()=>{duck(true);try{const url=await clip(/[.!?]$/.test(clean)?clean:clean+'.');if(id!==token||!enabled())return;const audio=new Audio(url);audio.volume=role==='pip'?.38:.44;if(role==='pip'){audio.preservesPitch=false;audio.webkitPreservesPitch=false;audio.playbackRate=1.4;}active=audio;audio.onended=audio.onerror=()=>{if(id===token){active=null;duck(false);}};await audio.play();}catch{if(id===token&&enabled())browser(clean,role,id);}},180);}
  return{configure(options){duck=options.duck;enabled=options.enabled;},say,stop};
})();
