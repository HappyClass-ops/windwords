const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict'),root=path.join(__dirname,'..');
const gameText=fs.readFileSync(path.join(root,'game.js'),'utf8');
assert(!gameText.includes('ElevenLabs voice is unavailable'),'obsolete remote-voice failure must stay out of the player UI');
assert(fs.existsSync(path.join(root,'docs','VOICE-COVERAGE.md')),'local voice coverage log must be maintained');
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
      data=Buffer.from(data.toString().replace('  buildTrail(); updatePhasePicker();','  window.testGame={state,startGame,beginCheckpoint,handleChoice,bossCorrectChoice,respawnBossIsland,triggerBossHazard,bossIslandScheduler,applyPhase};\n  buildTrail(); updatePhasePicker();'));
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
    assert.deepEqual(contracts.map(p=>p.timer),[15000,15000,10000,8000]);

    await page.click('#hubPlay');
    await page.click('[data-play-mode="classic"]');
    await page.click('#playClose');

    // Test continuous fight
    await page.evaluate(()=>{
      testGame.startGame();
      testGame.applyPhase(2);
      window.originalCheckpoint=PipChallenge.checkpoint;
      PipChallenge.checkpoint=(...args)=>({...originalCheckpoint(...args),timerMs:250});
      window.voiceResolvers=[];
      PipVoice.say=()=>new Promise(resolve=>voiceResolvers.push(resolve));
      window.beginBoss=testGame.beginCheckpoint();
    });

    assert(await page.locator('#bossContainer.active').isVisible());
    await page.waitForTimeout(2300);
    assert.equal(await page.evaluate(()=>testGame.state.busy),true,'fight must stay locked until introductory speech completes');
    assert.equal(await page.locator('.timer-seconds').textContent(),'1','timer must remain visibly full during the introduction');
    await page.evaluate(()=>voiceResolvers.shift()?.('ended'));
    await page.waitForFunction(()=>voiceResolvers.length===1);
    assert.equal(await page.evaluate(()=>testGame.state.busy),true,'boss introduction itself must keep gameplay locked');
    assert.equal(await page.locator('.timer-seconds').textContent(),'1','timer stays full until the boss introduction completes');
    await page.evaluate(()=>voiceResolvers.shift()?.('ended'));
    await page.evaluate(()=>beginBoss);
    assert(await page.locator('.boss-timer-circle').isVisible());
    assert(await page.locator('.boss-top-hud').isVisible(), 'Boss top HUD must be visible');
    assert(await page.locator('.boss-sprite').isVisible(), 'Boss sprite must be visible in arena');
    const lookahead=await page.evaluate(()=>testGame.bossIslandScheduler.snapshot());
    assert(lookahead.plans.length>=3,'scheduler plans several replacements ahead');
    assert(lookahead.plans.every(plan=>plan.slotId&&plan.option.word&&Number.isFinite(plan.emptyMs)),'each planned replacement binds a slot, word and spawn delay');
    assert(lookahead.plans.some(plan=>plan.correct)&&lookahead.plans.some(plan=>!plan.correct),'planned sequence mixes correct answers and distractors');
    const initialHealthScale = await page.evaluate(() => {
      const fill = document.querySelector('.boss-health-fill');
      return fill ? fill.style.transform : '';
    });
    assert(initialHealthScale.includes('scaleX(1)'), 'Health bar must start 100% full');
    assert.equal(await page.evaluate(()=>PipSoundtrack.battle),'boss-moss');

    // Timer drops replace an island without reducing hearts (Pip does not lose a life)
    await page.waitForTimeout(600); // Allow 250ms timer to drop
    const heartsAfterDrop = await page.evaluate(() => testGame.state.hearts);
    assert.equal(heartsAfterDrop, 3, 'Pip must not lose a life when timer drops');
    console.log('Timer drop verified: island replaced, no life lost.');

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

    await page.evaluate(async()=>{
      const consumed=document.querySelector('#choices .boss-cleared');
      await testGame.bossCorrectChoice(consumed);
    });
    assert.equal(await page.evaluate(()=>testGame.state.bossRemaining),2,'a consumed island instance must never score twice');

    await page.evaluate(async()=>{
      const target=[...document.querySelectorAll('#choices .island')].find(i=>i!==testGame.state.anchor);
      window.checkedSlot=[...target.classList].find(c=>c.startsWith('pos-'));
      await Promise.all([testGame.respawnBossIsland(target),testGame.respawnBossIsland(target)]);
    });
    await page.waitForFunction(()=>{const snapshot=testGame.bossIslandScheduler.snapshot();return snapshot.slots.length===5&&snapshot.slots.every(slot=>slot.lifecycle==='active'&&!slot.pending);});
    const slotCheck=await page.evaluate(()=>{const matching=[...document.querySelectorAll('#choices .'+checkedSlot)];return {after:document.querySelectorAll('#choices .island').length,matching:matching.length,plaques:matching.map(i=>i.querySelectorAll('.word-plaque').length),controls:matching.map(i=>i.querySelectorAll('button').length)};});
    assert.equal(slotCheck.after,5,'replacement restores the fixed slot count');
    assert.equal(slotCheck.matching,1,'a fixed slot owns exactly one island instance');
    assert.deepEqual(slotCheck.plaques,[1],'replacement owns exactly one label');
    assert.deepEqual(slotCheck.controls,[2],'replacement owns exactly one control set');

    const gapCheck=await page.evaluate(async()=>{
      const trace=[];
      const hold=PipBossBattle.hold,release=PipBossBattle.release;
      PipBossBattle.hold=reason=>{if(reason==='islands')trace.push({type:'hold',at:performance.now()});return hold(reason);};
      PipBossBattle.release=reason=>{if(reason==='islands')trace.push({type:'release',at:performance.now()});return release(reason);};
      document.querySelectorAll('#choices .island[data-boss-lifecycle="active"]').forEach(island=>{if(island.dataset.bossCorrect==='true')island.dataset.bossCorrect='false';});
      testGame.bossIslandScheduler.assess();
      const deadline=performance.now()+2500;
      while((!trace.some(item=>item.type==='release'))&&performance.now()<deadline)await new Promise(resolve=>setTimeout(resolve,25));
      PipBossBattle.hold=hold;PipBossBattle.release=release;
      const start=trace.find(item=>item.type==='hold'),end=trace.find(item=>item.type==='release');
      return {trace,duration:start&&end?end.at-start.at:null,correct:[...document.querySelectorAll('#choices .island[data-boss-lifecycle="active"]')].some(island=>island.dataset.bossCorrect==='true')};
    });
    assert(gapCheck.trace.some(item=>item.type==='hold'),'zero-answer gap pauses the encounter timer');
    assert(gapCheck.trace.some(item=>item.type==='release'),'promised correct island resumes the timer');
    assert(gapCheck.duration<=2000,'zero-answer gap resolves within the configured two-second limit');
    assert(gapCheck.correct,'gap ends only when a correct island is actually selectable');

    const safety=await page.evaluate(async()=>{
      PipBossBattle.hold('test');
      const anchor=testGame.state.anchor;
      const destination=[...document.querySelectorAll('#choices .island[data-boss-lifecycle="active"]')].find(island=>island!==anchor);
      const instance=destination.dataset.bossInstance;
      destination.classList.add('awaiting-pip');
      const profile=originalCheckpoint('classic',2,0);
      await testGame.triggerBossHazard(profile);
      const result={anchorSafe:anchor.isConnected,destinationSafe:destination.isConnected&&destination.dataset.bossInstance===instance&&destination.dataset.bossLifecycle==='active'};
      destination.classList.remove('awaiting-pip');
      PipBossBattle.release('test');
      return result;
    });
    assert(safety.anchorSafe,'random destruction never removes Pip current platform');
    assert(safety.destinationSafe,'random destruction never removes an in-flight destination');

    const bossChecks=[];
    await page.evaluate(()=>{PipChallenge.checkpoint=originalCheckpoint;window.countdownStarts=0;const start=PipBossBattle.startCountdown;PipBossBattle.startCountdown=()=>{countdownStarts++;return start();};});
    for(const phase of [3,4,5]){
      bossChecks.push(await page.evaluate(async phase=>{
        PipVoice.say=()=>Promise.resolve(phase===4?'unavailable':'disabled');
        testGame.startGame();testGame.applyPhase(phase);testGame.state.finaleStage=0;
        await testGame.beginCheckpoint();
        PipBossBattle.hold('verification');
        const profile=originalCheckpoint('classic',phase,0),islands=[...document.querySelectorAll('#choices .island')];
        const destination=islands[0];destination.classList.add('awaiting-pip');
        const planned=testGame.bossIslandScheduler.randomTarget();
        destination.classList.remove('awaiting-pip');
        const result={phase,count:islands.length,slots:new Set(islands.map(i=>i.dataset.bossSlot)).size,timer:document.querySelector('.timer-seconds').textContent,target:profile.targetHits,remaining:testGame.state.bossRemaining,labels:islands.map(i=>i.querySelectorAll('.word-plaque').length),controls:islands.map(i=>i.querySelectorAll('button').length),hasCorrect:islands.some(i=>i.dataset.bossCorrect==='true'),hasDistractor:islands.some(i=>i.dataset.bossCorrect!=='true'),destinationAvoided:planned!==destination,lifecycle:testGame.bossIslandScheduler.snapshot().slots.map(slot=>slot.lifecycle)};
        PipBossBattle.release('verification');return result;
      },phase));
    }
    assert.deepEqual(bossChecks.map(x=>x.target),[5,7,10]);
    assert.deepEqual(bossChecks.map(x=>x.timer),['15','10','8']);
    assert.deepEqual(bossChecks.map(x=>x.count),[5,6,5]);
    for(const check of bossChecks){assert.equal(check.slots,check.count,`boss ${check.phase} keeps one island per slot`);assert(check.labels.every(n=>n===1)&&check.controls.every(n=>n===2),`boss ${check.phase} keeps one label/control set per island`);assert(check.hasCorrect&&check.hasDistractor,`boss ${check.phase} includes correct answers and distractors`);assert(check.destinationAvoided,`boss ${check.phase} planner excludes in-flight destination`);assert(check.lifecycle.every(x=>x==='active'),`boss ${check.phase} starts with active slots`);}
    assert.equal(await page.evaluate(()=>countdownStarts),3,'muted and failed local speech start each encounter countdown exactly once');

    const retryStarts=await page.evaluate(async()=>{
      const before=countdownStarts;
      window.voiceResolvers=[];const realStop=PipVoice.stop;PipVoice.say=()=>new Promise(resolve=>voiceResolvers.push(resolve));PipVoice.stop=()=>{while(voiceResolvers.length)voiceResolvers.shift()('cancelled');};
      testGame.startGame();testGame.applyPhase(2);const stale=testGame.beginCheckpoint();
      await new Promise(resolve=>setTimeout(resolve,250));
      testGame.startGame();PipVoice.stop=realStop;PipVoice.say=()=>Promise.resolve('disabled');testGame.applyPhase(2);
      await testGame.beginCheckpoint();await stale;
      return countdownStarts-before;
    });
    assert.equal(retryStarts,1,'cancelling an introduction and retrying starts only the new countdown');

    const cleared=await page.evaluate(async()=>{
      PipBossBattle.hold('verification');
      const target=document.querySelector('#choices .island[data-boss-lifecycle="active"]');
      testGame.respawnBossIsland(target,'test-clear');
      testGame.startGame();
      await new Promise(resolve=>setTimeout(resolve,250));
      return {slots:testGame.bossIslandScheduler.snapshot().slots.length,active:document.getElementById('bossContainer').classList.contains('active'),waiting:document.getElementById('game').classList.contains('boss-waiting-islands')};
    });
    assert.deepEqual(cleared,{slots:0,active:false,waiting:false},'retry clears pending scheduler events and boss countdown state');

    assert.deepEqual(errors,[]);
    console.log('PASS: all four boss contracts, intro gating, timers, safe scheduled island replacement, gap recovery, idempotent scoring, and cleanup.');
  }finally{
    await browser.close();
    server.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
