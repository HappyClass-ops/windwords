/* Tiny original procedural biome soundscapes: no downloads or generation credits.
   Only scheduled while audible. Existing music remains the quiet melodic layer. */
window.PipAmbience=(()=>{
  let ctx,bus,interval,step=0,phase=2,on=false,ducked=false;
  const scales={2:[392,494,587,784],3:[330,392,494,659],4:[440,554,659,880],5:[196,247,294,392]};
  function tick(){if(!on||!ctx||document.hidden)return;const notes=scales[phase]||scales[2],t=ctx.currentTime;
    for(let i=0;i<2;i++){const osc=ctx.createOscillator(),g=ctx.createGain();osc.type=phase===5?'triangle':'sine';osc.frequency.value=notes[(step+i*2)%4]*(i? .5:1);g.gain.setValueAtTime(0,t+i*.35);g.gain.linearRampToValueAtTime(phase===5?.028:.022,t+i*.35+.12);g.gain.exponentialRampToValueAtTime(.0001,t+i*.35+2);osc.connect(g).connect(bus);osc.start(t+i*.35);osc.stop(t+i*.35+2.1);}step++;
  }
  return{set(p,audioContext,audible,duck=false){phase=p;on=audible;ducked=duck;if(!ctx&&audioContext){ctx=audioContext;bus=ctx.createGain();bus.connect(ctx.destination);}if(bus)bus.gain.setTargetAtTime(on?(ducked?.2:.7):0,ctx.currentTime,.15);if(on&&ctx&&!interval){tick();interval=setInterval(tick,2300);}if(!on&&interval){clearInterval(interval);interval=null;}}};
})();
