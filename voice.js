/* Latest-intent playback for the checked-in voice manifest. Missing clips stay silent. */
window.PipVoice = (() => {
  let token=0,active=null,timer=null,duck=()=>{},enabled=()=>true,unavailable=()=>{};
  let settle=null,watchdog=null;
  function finish(result){clearTimeout(watchdog);const resolve=settle;settle=null;duck(false);resolve?.(result);}
  function stop(){token++;clearTimeout(timer);if(active){active.pause();active=null;}window.speechSynthesis?.cancel();finish('cancelled');}
  async function playback(clean,role,id){
    const manifest=window.PipVoiceManifest;
    const bundle=manifest?.clips?.find(c=>(c.text===clean||c.text===clean+'.'||clean===c.text+'.')&&c.role===role&&c.scriptVersion===manifest.scriptVersion&&c.styleVersion===manifest.styleVersion);
    let failed=false,audio;
    const fallback=()=>{if(failed||id!==token)return;failed=true;if(audio){audio.pause();if(active===audio)active=null;}if(!enabled()){finish('disabled');return;}unavailable();finish('unavailable');};
    if(!bundle){fallback();return;}
    try{if(id!==token)return;if(!enabled()){finish('disabled');return;}audio=new Audio(bundle.src);audio.volume=role==='pip'?.49:.44;if(role==='pip'&&!bundle.nativeDelivery){audio.preservesPitch=false;audio.webkitPreservesPitch=false;audio.playbackRate=1.45;}active=audio;audio.onended=()=>{if(id===token&&!failed){active=null;finish('ended');}};audio.onerror=fallback;await audio.play();}catch{fallback();}
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
