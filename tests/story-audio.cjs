const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..');
const lines=[
  'Oh! The islands have floated into the sky, and our friends are stranded. Will you help me bring them home?',
  'We will cross the sky islands, floating forest and crystal peaks, all the way to the volcano. Read the words to find a safe path.',
  'After six leaps, help me light a beacon. Then choose which path we will take next. Let’s fly!'
];
const fakeVoice=`window.voiceTrace=[];window.voicePending=[];let active=null;window.PipVoice={configure(){},say(text,role){if(active)active.finish('cancelled');let settled=false,resolve;const promise=new Promise(r=>resolve=r);const request={text,role,promise,finish(result){if(settled)return;settled=true;if(active===request)active=null;resolve(result);}};active=request;voicePending.push(request);voiceTrace.push({type:'say',text,role});return promise;},stop(){voiceTrace.push({type:'stop'});if(active)active.finish('cancelled');}};`;
const server=http.createServer((req,res)=>{try{const url=req.url.split('?')[0],file=path.join(root,url==='/'?'index.html':url);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/html');if(url==='/voice.js')return res.end(fakeVoice);let data=fs.readFileSync(file);if(file.endsWith('game.js'))data=Buffer.from(data.toString().replace('  buildTrail(); updatePhasePicker();','  window.testGame={beginStory};\n  buildTrail(); updatePhasePicker();'));res.end(data);}catch{res.writeHead(404).end();}});

(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({channel:'chrome',headless:true});try{
  const page=await browser.newPage();page.setDefaultTimeout(5000);await page.route('**/api/speech',r=>r.abort());await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.testGame&&!document.getElementById('loadingOverlay').classList.contains('open'));

  await page.evaluate(()=>{voiceTrace.length=0;testGame.beginStory();});
  assert.deepEqual(await page.evaluate(()=>voiceTrace.map(event=>event.type)),['stop','say'],'overlay must initialize before first narration');
  assert.equal(await page.evaluate(()=>voiceTrace.at(-1).text),lines[0]);
  assert(await page.locator('#storyOverlay').evaluate(element=>element.classList.contains('open')));

  await page.click('#storyNextButton');await page.click('#storyNextButton');
  assert.deepEqual(await page.evaluate(()=>voiceTrace.filter(event=>event.type==='say').map(event=>event.text)),lines,'rapid Next keeps only the latest page intent');

  await page.evaluate(()=>voicePending.at(-1).finish('unavailable'));
  await page.locator('#storyReplayButton:visible').waitFor();
  await page.click('#storyReplayButton');
  assert.equal(await page.evaluate(()=>voiceTrace.at(-1).text),lines[2]);
  assert(await page.locator('#storyReplayButton').isHidden());

  await page.locator('#soundButton').dispatchEvent('click'); // Exercise mute lifecycle; story overlay covers HUD.
  assert.equal(await page.evaluate(()=>voiceTrace.at(-1).type),'stop','mute cancels story narration');
  assert(await page.locator('#storyReplayButton').isHidden());
  await page.locator('#soundButton').dispatchEvent('click');

  await page.evaluate(()=>testGame.beginStory());await page.click('#storySkipButton');
  assert.equal(await page.evaluate(()=>voiceTrace.at(-1).type),'stop','Skip cancels story narration');
  assert.equal(await page.locator('#storyOverlay').evaluate(element=>element.classList.contains('open')),false);

  await page.evaluate(()=>testGame.beginStory());const stale=await page.evaluate(()=>voicePending.length-1);await page.evaluate(()=>PipAdventure.showHub());
  assert.equal(await page.evaluate(()=>voiceTrace.at(-1).type),'stop','back to the village cancels story narration');
  assert.equal(await page.locator('#storyOverlay').evaluate(element=>element.classList.contains('open')),false);
  await page.evaluate(index=>voicePending[index].finish('unavailable'),stale);
  assert(await page.locator('#storyReplayButton').isHidden(),'a stale failure must not reopen replay');

  console.log('PASS: first-line start order; rapid Next, replay after failure, Skip, mute, back and stale narration cancellation; fake audio only.');
}finally{await browser.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
