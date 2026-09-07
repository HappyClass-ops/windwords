const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict'),root=path.join(__dirname,'..');
const server=http.createServer((req,res)=>{try{
  const file=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);
  let data=fs.readFileSync(file);
  if(file.endsWith('game.js'))data=Buffer.from(data.toString().replace('  buildTrail(); updatePhasePicker();','  window.testGame={state,startGame,handleChoice,camera};\n  buildTrail(); updatePhasePicker();'));
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/html');res.end(data);
}catch{res.writeHead(404).end();}});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    await page.addInitScript(()=>localStorage.setItem('wordwind_audioOn','false'));
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.waitForFunction(()=>window.testGame&&!document.querySelector('#loadingOverlay.open'));
    await page.evaluate(()=>testGame.startGame());
    for(let leap=1;leap<=3;leap++){
      const result=await page.evaluate(async leap=>{
        const shell=document.getElementById('game'),pip=document.getElementById('pip'),sky=document.getElementById('skyScene'),world=document.getElementById('world'),s=testGame.state;
        const island=[...document.querySelectorAll('#choices>.island')].find(node=>PipVocabulary.accepts(node.dataset.word,s.targetKind));
        const beforeBg=getComputedStyle(sky).backgroundPosition,beforeX=new DOMMatrix(getComputedStyle(world).transform).m41,frames=[];
        window.jump=testGame.handleChoice(island);
        for(let i=0;i<130;i++){
          const r=pip.getBoundingClientRect(),g=shell.getBoundingClientRect(),style=getComputedStyle(pip),matrix=new DOMMatrix(getComputedStyle(world).transform);
          frames.push({visible:style.visibility!=='hidden'&&Number(style.opacity)>.1&&r.right>g.left&&r.left<g.right&&r.bottom>g.top&&r.top<g.bottom,worldX:matrix.m41,bg:getComputedStyle(sky).backgroundPosition});
          await new Promise(resolve=>setTimeout(resolve,20));
          if(!s.busy&&s.phaseScore===leap)break;
        }
        await window.jump;
        return {beforeBg,afterBg:getComputedStyle(sky).backgroundPosition,beforeX,frames};
      },leap);
      const longest=result.frames.reduce((state,frame)=>frame.visible?{longest:state.longest,run:0}:{longest:Math.max(state.longest,state.run+1),run:state.run+1},{longest:0,run:0}).longest;
      assert(longest<=2,`Pip vanished for ${longest*20}ms during landing ${leap}`);
      if(leap>1)assert(Math.max(...result.frames.map(frame=>frame.worldX))<result.beforeX+80,`world camera reset during landing ${leap}, producing the empty half-second frame`);
      const numbers=value=>value.match(/-?\d+(?:\.\d+)?/g).map(Number),a=numbers(result.beforeBg),b=numbers(result.afterBg),pan=Math.hypot((b[0]||0)-(a[0]||0),(b[1]||0)-(a[1]||0));
      assert(pan>=4,`sky background barely moved on landing ${leap} (${result.beforeBg} -> ${result.afterBg})`);
    }
    console.log('PASS: Pip remains visible, camera continuity holds, and the sky visibly pans through three landings.');
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;server.close();});
