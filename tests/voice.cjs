const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
let networkCalls=0,plays=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
class Audio{constructor(url){this.url=url;}play(){plays.push(this);return Promise.resolve();}pause(){}}
const context={console,setTimeout,clearTimeout,Date,Error,String,Audio,fetch:async()=>{networkCalls++;throw Error('network must not be used');}};
context.window=context;context.speechSynthesis={cancel(){}};
context.PipVoiceManifest={scriptVersion:'v1',styleVersion:'s1',clips:[
  ...['A','B','C','D'].map(text=>({text,role:'teacher',scriptVersion:'v1',styleVersion:'s1',src:'/local/'+text+'.mp3'})),
  {text:'B',role:'pip',scriptVersion:'v1',styleVersion:'s1',src:'/local/pip-B.mp3'}
]};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../voice.js','utf8'),context);
(async()=>{let unavailable=0;const voice=context.PipVoice;voice.configure({enabled:()=>true,duck:()=>{},unavailable:()=>unavailable++});
  const old=voice.say('A');voice.say('B');assert.equal(await old,'cancelled');await sleep(250);assert.equal(plays.length,1);assert.equal(plays[0].url,'/local/B.mp3');
  voice.say('C');await sleep(210);voice.say('D');await sleep(250);assert.equal(plays.at(-1).url,'/local/D.mp3','latest local request wins');
  assert.equal(await voice.say('Missing'),'unavailable');assert.equal(unavailable,1,'missing local clip reports internally once');assert.equal(networkCalls,0,'missing clips never call a speech API');
  voice.say('B','pip');await sleep(250);assert.equal(plays.at(-1).playbackRate,1.45);assert.equal(plays.at(-1).preservesPitch,false);voice.stop();
  console.log('PASS: local-manifest playback, latest-intent cancellation, silent missing clips, no remote calls, and Pip pitch treatment.');
})().catch(e=>{context.PipVoice.stop();console.error(e);process.exitCode=1;});
