/* Code-native boss presentation and urgency timer. Gameplay decisions remain in game.js. */
window.PipBossBattle = (() => {
  'use strict';
  let root,nameNode,stageNode,fillNode,liveNode,timer,deadline,duration,profile,onExpire;
  function mount(node){root=node;nameNode=root.querySelector('.boss-name');stageNode=root.querySelector('.boss-stage');fillNode=root.querySelector('.urgency-fill');liveNode=root.querySelector('.boss-live');}
  function announce(message){if(liveNode)liveNode.textContent=message;}
  function stopTimer(){clearInterval(timer);timer=null;}
  function drawTimer(){
    if(!root||!deadline)return;const remaining=Math.max(0,deadline-performance.now()),ratio=duration?remaining/duration:0;
    fillNode.style.transform=`scaleX(${ratio})`;root.classList.toggle('boss-warning',ratio<=.32);root.style.setProperty('--boss-seconds',String(Math.ceil(remaining/1000)));
    if(remaining>0)return;stopTimer();root.classList.add('boss-attacking');announce(profile.attack);
    Promise.resolve(onExpire?.(profile)).finally(()=>setTimeout(()=>{root?.classList.remove('boss-attacking');if(root?.classList.contains('active'))resetTimer();},700));
  }
  function resetTimer(){if(!profile||!root?.classList.contains('active'))return;stopTimer();duration=profile.timerMs;deadline=performance.now()+duration;fillNode.style.transform='scaleX(1)';root.classList.remove('boss-warning');timer=setInterval(drawTimer,100);}
  function start(nextProfile,callbacks={}){
    profile=nextProfile;onExpire=callbacks.onExpire;root.hidden=false;root.dataset.boss=profile.theme;root.className='boss-container active boss-entering';root.setAttribute('aria-label',`${profile.name}, checkpoint boss`);
    nameNode.textContent=profile.name;stageNode.textContent=profile.stages>1?`Stage ${profile.stage+1} of ${profile.stages}`:'Checkpoint battle';root.querySelector('.boss-sprite').setAttribute('aria-label',profile.name);root.querySelector('.boss-health-fill').style.transform='scaleX(1)';announce(profile.intro);setTimeout(()=>root?.classList.remove('boss-entering'),1000);if(callbacks.autostart!==false)resetTimer();
  }
  function setHealth(remaining,total){if(root)root.querySelector('.boss-health-fill').style.transform=`scaleX(${Math.max(0,remaining/Math.max(1,total))})`;}
  function hit(remaining,total){setHealth(remaining,total);root.classList.remove('boss-hit');void root.offsetWidth;root.classList.add('boss-hit');announce(remaining?`${remaining} rune${remaining===1?'':'s'} left`:`${profile.name} is calm`);setTimeout(()=>root?.classList.remove('boss-hit'),500);resetTimer();}
  function defeat(){if(!root)return;stopTimer();root.classList.remove('boss-warning','boss-attacking');root.classList.add('boss-defeated');setHealth(0,1);announce(profile?.defeat||'The sky is calm again.');}
  function stop(){stopTimer();profile=null;deadline=0;if(!root)return;root.className='boss-container';root.hidden=true;root.removeAttribute('data-boss');root.removeAttribute('aria-label');}
  function pause(){stopTimer();}function resume(){if(profile&&root?.classList.contains('active'))resetTimer();}
  document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
  return {mount,start,resetTimer,hit,defeat,stop,pause,resume,announce};
})();
