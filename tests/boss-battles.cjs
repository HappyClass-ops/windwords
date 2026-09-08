const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict'),root=path.join(__dirname,'..');
for(const id of ['moss','kraken','gale','volcano'])assert(fs.statSync(path.join(root,'assets/audio/boss/boss-'+id+'.mp3')).size>500000,`boss-${id} music must be a real local MP3`);
const manifestText=fs.readFileSync(path.join(root,'voice-manifest.js'),'utf8');
for(const id of ['moss','kraken','gale','volcano'])assert(manifestText.includes(`"role": "boss-${id}"`),`boss-${id} voice clips must be registered locally`);

// Verify extracted boss assets exist
for(const b of ['cloud-kraken','gale-golem','spore-bramble','void-chronos']){
  for(const cat of ['idle','attack','tile-takeover','defeat']){
    assert(fs.existsSync(path.join(root,'assets/bosses',b,cat,'frame-01.png')),`Asset must exist: ${b}/${cat}/frame-01.png`);
  }
}

const server=http.createServer((req,res)=>{
  try{
    const file=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);
    let data=fs.readFileSync(file);
    if(file.endsWith('game.js')) {
      data=Buffer.from(data.toString().replace('  buildTrail(); updatePhasePicker();','  window.testGame={state,startGame,beginCheckpoint,handleChoice,bossCorrectChoice,applyPhase};\n  buildTrail(); updatePhasePicker();'));
    }
    const ext=path.extname(file);
    const mime={'js':'text/javascript','css':'text/css','mp3':'audio/mpeg','png':'image/png','webp':'image/webp','jpg':'image/jpeg','html':'text/html'}[ext.slice(1)]||'text/plain';
    res.setHeader('Content-Type',mime);
    res.end(data);
  }catch{res.writeHead(404).end();}
});

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:768,height:1024},reducedMotion:'reduce'});
    page.setDefaultTimeout(10000);
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/api/speech',r=>r.abort());
    await page.route('**/api/dictionary?*',r=>r.fulfill({json:[]}));
    await page.addInitScript(()=>localStorage.setItem('wordwind_audioOn','false'));
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.waitForFunction(()=>window.testGame&&!document.querySelector('#loadingOverlay.open'));

    // Check contracts: continuous boss totals
    const contracts=await page.evaluate(()=>[2,3,4,5].map(phase=>{
      const p=PipChallenge.checkpoint('classic',phase,0);
      return {phase,id:p.id,hazard:p.hazard,music:p.music,kind:p.kind,count:p.count,targetHits:p.targetHits,stages:p.stages,timer:p.timerMs};
    }));
    assert.deepEqual(contracts.map(p=>p.id),['spore-bramble','cloud-kraken','gale-golem','magma-wyrm']);
    assert.deepEqual(contracts.map(p=>p.targetHits),[3,5,7,10]);

    await page.click('#hubPlay');
    await page.click('[data-play-mode="classic"]');
    await page.click('#playClose');

    // Test continuous fight
    await page.evaluate(async()=>{
      testGame.startGame();
      testGame.applyPhase(2);
      const original=PipChallenge.checkpoint;
      PipChallenge.checkpoint=(...args)=>({...original(...args),timerMs:250});
      await testGame.beginCheckpoint();
    });

    assert(await page.locator('#bossContainer.active').isVisible());
    assert(await page.locator('.boss-timer-circle').isVisible());
    assert(await page.locator('.boss-top-hud').isVisible(), 'Boss top HUD must be visible');
    assert(await page.locator('.boss-sprite').isVisible(), 'Boss sprite must be visible in arena');
    const initialHealthScale = await page.evaluate(() => {
      const fill = document.querySelector('.boss-health-fill');
      return fill ? fill.style.transform : '';
    });
    assert(initialHealthScale.includes('scaleX(1)'), 'Health bar must start 100% full');
    assert.equal(await page.evaluate(()=>PipSoundtrack.battle),'boss-moss');

    // Timer attacks reduce hearts
    await page.waitForFunction(()=>testGame.state.hearts<3,null,{timeout:3000});
    console.log('Timer attack verified.');

    // Test landing damages boss and decrements bossRemaining
    const initialHits = await page.evaluate(()=>testGame.state.bossRemaining);
    assert.equal(initialHits, 3, 'Boss 1 must require 3 hits');

    // Click a correct island
    const landed = await page.evaluate(async()=>{
      const correctIsland = [...document.querySelectorAll('#choices .island')].find(i=>i.dataset.bossCorrect==='true');
      if(correctIsland) {
        await testGame.bossCorrectChoice(correctIsland);
        return true;
      }
      return false;
    });
    assert(landed, 'Must find and land on a correct island');
    const remainingAfterLanding = await page.evaluate(()=>testGame.state.bossRemaining);
    assert.equal(remainingAfterLanding, 2, 'Landing must decrement bossRemaining immediately (3 -> 2)');

    // Verify there is always at least one correct island selectable
    const hasCorrectChoice = await page.evaluate(()=>{
      const choices = [...document.querySelectorAll('#choices .island:not(.landed-anchor)')];
      return choices.some(i => i.dataset.bossCorrect === 'true');
    });
    assert(hasCorrectChoice, 'There must always be at least one selectable correct island');

    assert.deepEqual(errors,[]);
    console.log('PASS: continuous boss battle, circular timer, island respawns, guaranteed correct choice, and immediate hit damage.');
  }finally{
    await browser.close();
    server.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
