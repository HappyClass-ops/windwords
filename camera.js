/* One normalized world translation: DOM picking and sprites share it. */
window.PipCamera={create(layer){
 let x=0,y=0;
 const transform=()=>`translate(${x}%,${y}%)`;
 function reset(){layer.getAnimations().forEach(a=>a.cancel());x=y=0;layer.style.transform=transform();}
 function place(option){option.style.left=(option.offsetLeft/layer.clientWidth*100-x)+'%';option.style.top=(option.offsetTop/layer.clientHeight*100-y)+'%';}
 async function follow(anchor){const before=transform(),nextX=(layer.clientWidth<650?3:8)-anchor.offsetLeft/layer.clientWidth*100,nextY=72-anchor.offsetTop/layer.clientHeight*100,after=`translate(${nextX}%,${nextY}%)`,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced){x=nextX;y=nextY;layer.style.transform=after;return;}const motion=layer.animate([{transform:before},{transform:after}],{duration:560,easing:'cubic-bezier(.22,.75,.28,1)',fill:'forwards'});await motion.finished.catch(()=>{});x=nextX;y=nextY;layer.style.transform=after;motion.cancel();}
 return {reset,place,follow,get offset(){return {x,y};}};
}};
