const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
let calls=0,latest,fail=false;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const manifest={scriptVersion:'s2',styleVersion:'p1',clips:[{text:'Hello Pip',role:'pip',scriptVersion:'s2',styleVersion:'p1',src:'assets/audio/fixture.mp3',nativeDelivery:true}]};
const context={setTimeout,clearTimeout,Date,Error,String,PipVoiceManifest:manifest,Audio:class{constructor(url){this.url=url;latest=this;}play(){return fail?Promise.reject(Error('missing clip')):Promise.resolve();}pause(){}},fetch:async()=>{calls++;throw Error('remote speech disabled');}};
context.window=context;context.speechSynthesis={cancel(){}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../voice.js','utf8'),context);
(async()=>{const voice=context.PipVoice;let enabled=true,unavailable=0;voice.configure({enabled:()=>enabled,duck(){},unavailable(){unavailable++;}});
  for(let i=0;i<2;i++){const done=voice.say('Hello Pip','pip');await sleep(210);assert.equal(latest.url,'assets/audio/fixture.mp3');assert.equal(latest.playbackRate,undefined);latest.onended();assert.equal(await done,'ended');}
  assert.equal(calls,0,'local fixed replay bypasses speech API');
  fail=true;assert.equal(await voice.say('Hello Pip','pip'),'unavailable');assert.equal(calls,0,'failed local clip stays offline');
  manifest.styleVersion='p2';assert.equal(await voice.say('Hello Pip','pip'),'unavailable');assert.equal(unavailable,2,'missing/version-mismatched clips settle silently');
  enabled=false;assert.equal(await voice.say('Hello Pip','pip'),'disabled');
  console.log('PASS: versioned local lookup, replay, failure, cancellation, mute, no double pitch, and zero remote calls.');
})().catch(e=>{context.PipVoice.stop();console.error(e);process.exitCode=1;});
