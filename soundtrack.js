/* Original local arrangements plus pre-rendered ElevenLabs SFX ambience.
   One active scene bus; old scenes fade out and disconnect. No runtime API cost. */
window.PipSoundtrack = (() => {
  'use strict';
  const themes = {
    village:{bpm:94,root:60,scale:[0,2,4,7,9],chords:[0,3,4,0],melody:[0,2,3,2,1,-1,0,4,3,2,1,-1,2,1,0,-1],tone:'triangle',ambience:'village'},
    shop:{bpm:108,root:57,scale:[0,2,4,7,9],chords:[0,4,3,0],melody:[0,-1,2,3,-1,2,1,-1,3,4,3,-1,2,1,0,-1],tone:'sine',ambience:'shop'},
    map:{bpm:70,root:62,scale:[0,2,3,7,10],chords:[0,3,1,4],melody:[0,-1,-1,2,-1,3,-1,-1,4,-1,3,-1,2,-1,1,-1],tone:'sine',ambience:'map'},
    sky:{bpm:104,root:62,scale:[0,2,4,7,9],chords:[0,4,3,0],melody:[0,1,2,-1,3,2,4,3,2,-1,1,2,3,1,0,-1],tone:'triangle',ambience:'village'},
    forest:{bpm:86,root:57,scale:[0,2,3,7,9],chords:[0,3,1,4],melody:[0,2,-1,3,1,-1,2,4,3,-1,2,1,0,-1,1,-1],tone:'triangle',ambience:'forest'},
    crystal:{bpm:78,root:64,scale:[0,2,4,6,9],chords:[0,3,2,4],melody:[4,-1,2,-1,3,1,-1,2,0,-1,4,3,-1,2,1,-1],tone:'sine',ambience:'crystal'},
    volcano:{bpm:112,root:45,scale:[0,2,3,7,10],chords:[0,1,3,0],melody:[0,-1,0,2,3,-1,2,1,0,2,3,-1,4,3,2,-1],tone:'triangle',ambience:'volcano'}
  };
  let context,active,timer,current='village',enabled=()=>true,ducked=false,unlocked=false;
  const hz = midi => 440*Math.pow(2,(midi-69)/12);
  function level(){return enabled()&&!document.hidden?(ducked?.24:1):0;}
  function volume(){if(active&&context)active.bus.gain.setTargetAtTime(level()*.22,context.currentTime,.18);}
  function note(midi,t,duration,amp,type,bus){
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type=type;oscillator.frequency.value=hz(midi);
    gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(amp,t+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    oscillator.connect(gain).connect(bus);oscillator.start(t);oscillator.stop(t+duration+.03);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  function schedule(){
    if(!active||!context||context.state!=='running'||!enabled()||document.hidden)return;
    const a=active,p=themes[a.name],beat=60/p.bpm;
    // Look ahead only 150ms; a throttled tab never catches up with a burst of notes.
    if(a.next<context.currentTime-.2)a.next=context.currentTime+.03;
    while(a.next<context.currentTime+.15){
      const s=a.step++,bar=Math.floor(s/8),position=s%8,chord=p.chords[Math.floor(bar/2)%4];
      const tone=degree=>p.root+p.scale[(degree%5+5)%5]+12*Math.floor(degree/5);
      const variation=Math.floor(bar/8)%3,melody=p.melody[(s+(variation===1?8:0))%16];
      if(melody>=0 && !(variation===2&&position%2)){
        const m=tone(melody)+(p.root<50?12:0);
        note(m,a.next,beat*(p.tone==='sine'?1.6:.75),.19,p.tone,a.bus);
        if(p.tone==='sine')note(m+12,a.next,beat*.45,.035,'sine',a.bus);
      }
      if(position%2===0)note(tone(chord+(position/2)%3)-12,a.next,beat*.85,.10,'triangle',a.bus);
      if(position===0||position===4)note(tone(chord)-24,a.next,beat*1.8,.20,'sine',a.bus);
      if(p.bpm>=90&&(position===2||position===6))note(34,a.next,.07,.08,'triangle',a.bus);
      a.next+=beat/2;
    }
  }
  function retire(a){
    if(!a)return;
    a.bus.gain.cancelScheduledValues(context.currentTime);
    a.bus.gain.setTargetAtTime(0,context.currentTime,.16);
    setTimeout(()=>{a.audio.pause();a.audio.removeAttribute('src');a.audio.load();a.source.disconnect();a.bus.disconnect();},900);
  }
  function start(){
    if(!unlocked||!enabled()||document.hidden||!context)return;
    if(active?.name===current){volume();active.audio.play().catch(()=>{});return;}
    retire(active);
    const bus=context.createGain();bus.gain.value=0;bus.connect(context.destination);
    const audio=new Audio(`assets/audio/zones/${themes[current].ambience}-ambience.mp3`);
    audio.loop=true;audio.preload='none';audio.volume=.48;
    const source=context.createMediaElementSource(audio);source.connect(bus);
    active={name:current,bus,audio,source,next:context.currentTime+.03,step:0};
    audio.play().catch(()=>{});volume();schedule();
    if(!timer)timer=setInterval(schedule,50);
  }
  function unlock(){
    if(!enabled())return;
    const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
    context ||= new AudioContext();unlocked=true;
    context.resume().then(start).catch(()=>{});
  }
  function scene(name){current=themes[name]?name:'sky';start();}
  function refresh(){
    volume();
    if(!enabled()||document.hidden){active?.audio.pause();if(timer){clearInterval(timer);timer=null;}}
    else {unlock();if(active){active.next=context.currentTime+.03;if(!timer)timer=setInterval(schedule,50);}}
  }
  document.addEventListener('pointerdown',unlock,{passive:true});
  document.addEventListener('keydown',unlock);
  document.addEventListener('visibilitychange',refresh);
  return {configure(options){enabled=options.enabled||enabled;},scene,unlock,refresh,duck(on){ducked=on;volume();},get current(){return current;}};
})();
