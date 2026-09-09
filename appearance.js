/* Pose-aligned bitmap layers are composed on look changes, never per animation frame. */
window.PipAppearance=(()=>{
  const images=new Map(),looks=new Map(),tokens=new WeakMap();let pinned='';
  const image=src=>{if(images.has(src))return images.get(src);const p=new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>{images.delete(src);reject(Error('Missing appearance art'));};i.src=src;});images.set(src,p);if(images.size>36)images.delete(images.keys().next().value);return p;};
  const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
  const blob=c=>new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(URL.createObjectURL(b)):reject(Error('Composition failed')),'image/png'));
  function trimCache(){for(const [key,entry] of looks){if(looks.size<=6)break;if(key!==pinned&&entry.result){if(!entry.result.legacy){URL.revokeObjectURL(entry.result.action);URL.revokeObjectURL(entry.result.walk);}URL.revokeObjectURL(entry.result.thumb);looks.delete(key);}}}
  async function build(look){
    const cat=PipCosmetics,root=cat.root,outfit=cat.byId[look.outfit];
    if(outfit?.art){const [a,w]=await Promise.all([image(outfit.art),image(outfit.walk)]);const thumb=canvas(160,160);thumb.getContext('2d').drawImage(a,0,0,a.width/3,a.height/2,0,0,160,160);return {action:outfit.art,walk:outfit.walk,thumb:await blob(thumb),legacy:true};}
    const rendered=[];
    for(const mode of ['action','walk']){
      const width=mode==='walk'?2048:768,height=mode==='walk'?256:512,baseName=look.fur==='original-fur'?'base':'fur-'+look.fur;
      const [base,foreground]=await Promise.all([image(root+baseName+'-'+mode+'.webp'),image(root+'foreground-'+mode+'.webp')]);
      const c=canvas(width,height),ctx=c.getContext('2d');ctx.drawImage(base,0,0,width,height);
      const front=canvas(width,height),f=front.getContext('2d');f.drawImage(base,0,0,width,height);f.globalCompositeOperation='destination-in';f.drawImage(foreground,0,0,width,height);
      for(const slot of ['clothes','boots','held']){const item=cat.byId[look[slot]];if(!item.empty)ctx.drawImage(await image(root+'layers/'+item.id+'-'+mode+'.webp'),0,0,width,height);}
      ctx.drawImage(front,0,0);const hat=cat.byId[look.head];if(!hat.empty)ctx.drawImage(await image(root+'layers/'+hat.id+'-'+mode+'.webp'),0,0,width,height);rendered.push(c);
    }
    const thumb=canvas(160,160);thumb.getContext('2d').drawImage(rendered[0],0,0,256,256,0,0,160,160);
    const [action,walk,thumbnail]=await Promise.all([blob(rendered[0]),blob(rendered[1]),blob(thumb)]);return {action,walk,thumb:thumbnail};
  }
  function compose(raw){const look=PipCosmetics.clean(raw),key=JSON.stringify(look);if(looks.has(key))return looks.get(key).promise;const entry={};entry.promise=build(look).then(result=>{entry.result=result;trimCache();return result;}).catch(e=>{looks.delete(key);throw e;});looks.set(key,entry);return entry.promise;}
  async function render(look,nodes,{pin=false}={}){if(pin)pinned=JSON.stringify(PipCosmetics.clean(look));const jobs=[...nodes].map(node=>{const token={};tokens.set(node,token);return {node,token};});const result=await compose(look);for(const {node,token} of jobs){if(tokens.get(node)!==token||!node.isConnected)continue;node.style.setProperty('--pip-look-action',`url("${result.action}")`);node.style.setProperty('--pip-look-walk',`url("${result.walk}")`);node.style.backgroundImage=`url("${result.action}")`;node.dataset.dressed='true';node.parentElement.dataset.glow=look.glow;}return result;}
  return {compose,render};
})();
