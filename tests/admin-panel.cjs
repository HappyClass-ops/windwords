const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');
const assert = require('assert/strict');

const root = path.join(__dirname, '..');
const server = http.createServer((req, res) => {
  try {
    const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
    let data = fs.readFileSync(file);
    if (file.endsWith('game.js')) {
      const inject = "  window.testGame={state,startGame,beginCheckpoint,handleChoice,bossCorrectChoice,applyPhase,openAdmin:openAdminPanel,closeAdmin:closeAdminPanel};\n  initAdminPanel();";
      data = Buffer.from(data.toString().replace('  initAdminPanel();', inject));
    }
    const ext = path.extname(file);
    const mime = { 'js': 'text/javascript', 'css': 'text/css', 'mp3': 'audio/mpeg', 'png': 'image/png', 'webp': 'image/webp', 'jpg': 'image/jpeg', 'html': 'text/html' }[ext.slice(1)] || 'text/plain';
    res.setHeader('Content-Type', mime);
    res.end(data);
  } catch { res.writeHead(404).end(); }
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/api/speech', r => r.abort());
    await page.route('**/api/dictionary?*', r => r.fulfill({ json: [] }));
    await page.addInitScript(() => localStorage.setItem('wordwind_audioOn', 'false'));
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.waitForFunction(() => window.testGame && !document.querySelector('#loadingOverlay.open'));

    console.log('1. Testing Village Hub -> Word Book -> Dog 10x secret click...');
    // Open Word Book from Village Hub
    await page.click('#hubBook');
    await page.locator('#dictionaryOverlay.open').waitFor();
    assert(await page.locator('#dictionaryOverlay').isVisible(), 'Word book must open');

    // Find the word "dog" in the word book
    const dogChip = page.locator('#dictionaryList button').filter({ hasText: /^dog\s/ });
    await dogChip.waitFor();
    assert(await dogChip.isVisible(), 'Word chip for "dog" must be visible in word book');
    assert(!await page.locator('#adminOverlay.open').isVisible(), 'Admin panel must be closed initially');

    // Click "dog" chip once -> Opens helper card
    await dogChip.click();
    await page.locator('#wordHelper.show').waitFor();
    assert.equal((await page.locator('#helperWord').textContent()).trim().toLowerCase(), 'dog');

    // Click "dog" 9 more times on the card
    for (let i = 2; i <= 10; i++) {
      await page.click('#helperWord');
    }

    // Secret Admin Panel must automatically unlock and open!
    await page.locator('#adminOverlay.open').waitFor();
    assert(await page.locator('#adminOverlay.open').isVisible(), 'Admin panel must be open after 10 clicks on dog');
    assert(!await page.locator('#wordHelper.show').isVisible(), 'Word helper card must close when admin panel unlocks');
    console.log('   ✓ Secret 10-click unlock on "dog" opens Admin Panel cleanly.');

    console.log('2. Testing Player State Cheats (+100 Stars, +10 Clues, Restore Hearts)...');
    const startCoins = await page.evaluate(() => testGame.state.coins);
    await page.click('#adminAddCoins');
    assert.equal(await page.evaluate(() => testGame.state.coins), startCoins + 100, '+100 Stars cheat works');

    await page.click('#adminAddClues');
    assert(await page.evaluate(() => testGame.state.clues) >= 10, '+10 Clues cheat works');

    await page.click('#adminMaxHearts');
    assert.equal(await page.evaluate(() => testGame.state.hearts), 3, 'Restore hearts cheat works');
    console.log('   ✓ Player state cheats work.');

    console.log('3. Testing God Mode Invulnerability...');
    await page.click('#adminGodMode');
    assert.equal(await page.locator('#adminGodMode').textContent(), '🛡️ God Mode: ON');
    console.log('   ✓ God Mode toggle works.');

    console.log('4. Testing Direct Boss Jump to Gale Golem (Phase 4)...');
    await page.click('#adminBossGolem');
    await page.waitForSelector('#bossContainer.active .boss-img');
    assert(await page.locator('#bossContainer.active').isVisible(), 'Boss container active');
    assert(await page.locator('.boss-timer-circle').isVisible(), 'Boss timer circle active');
    assert.equal(await page.evaluate(() => testGame.state.phase), 4, 'Boss phase is 4 for Gale Golem');
    console.log('   ✓ Boss direct jump to Gale Golem works.');

    console.log('5. Testing Boss FX testing and Instant Defeat...');
    // Re-open Admin Panel during boss
    await page.evaluate(() => window.PipAdmin.open());
    await page.locator('#adminOverlay.open').waitFor();

    // Test Sprite Pose to Attack
    await page.click('#adminAnimAttack');
    assert(await page.locator('#bossContainer[data-anim-state="attack"]').isVisible(), 'Sprite switches to attack pose');

    // Test Instant Defeat
    await page.click('#adminInstaKill');
    await page.waitForSelector('#bossContainer[data-anim-state="defeat"]', { state: 'attached', timeout: 5000 });
    console.log('   ✓ Instant Kill boss cheat triggers defeat pose and finishes checkpoint.');

    console.log('6. Testing Phase Direct Jump to Phase 3...');
    await page.evaluate(() => window.PipAdmin.open());
    await page.locator('#adminOverlay.open').waitFor();
    await page.click('#adminPhase3');
    await page.waitForTimeout(500);
    const stateInfo = await page.evaluate(() => ({ phase: testGame.state.phase, running: testGame.state.running, selectedPhase: testGame.state.selectedPhase, busy: testGame.state.busy }));
    console.log('   State info after adminPhase3:', stateInfo);
    assert.equal(stateInfo.phase, 3, 'Phase 3 active');
    console.log('   ✓ Direct Phase Jump to Phase 3 works.');

    console.log('7. Testing Close buttons and Escape key...');
    await page.evaluate(() => window.PipAdmin.open());
    await page.locator('#adminOverlay.open').waitFor();
    // Press Escape
    await page.keyboard.press('Escape');
    await page.locator('#adminOverlay.open').waitFor({ state: 'hidden' });
    assert(!await page.locator('#adminOverlay.open').isVisible(), 'Escape closes admin panel');
    console.log('   ✓ Escape key closes admin panel cleanly.');

    assert.deepEqual(errors, []);
    console.log('\nALL ADMIN PANEL TESTS PASSED 100%!');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
