/* One normalized world translation: DOM picking and sprites share it. */
window.PipCamera={create(layer){
 let x=0,y=0;
 const transform=()=>`translate(${x}%,${y}%)`;
 function reset(){layer.getAnimations().forEach(a=>a.cancel());x=y=0;layer.style.transform=transform();}
 function place(option){option.style.left=(option.offsetLeft/layer.clientWidth*100-x)+'%';option.style.top=(option.offsetTop/layer.clientHeight*100-y)+'%';}
 async function follow(anchor){const before=transform();x=(layer.clientWidth<650?3:8)-anchor.offsetLeft/layer.clientWidth*100;y=72-anchor.offsetTop/layer.clientHeight*100;const after=transform();layer.style.transform=after;const motion=layer.animate([{transform:before},{transform:after}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:480,easing:'ease-out'});await motion.finished.catch(()=>{});}
 return {reset,place,follow,get offset(){return {x,y};}};
}};
