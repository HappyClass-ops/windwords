(() => {
  "use strict";

  const {phases: PHASES, phaseOrder: PHASE_ORDER, climbsPerPhase: CLIMBS_PER_PHASE} = PipVocabulary;

  const KIND_HELP = {
    noun: "a naming word for a person, place, animal or thing",
    verb: "an action or doing word",
    adjective: "a word that describes a noun",
    adverb: "a word that tells how, when or where an action happens"
  };

  const ADVERB_HELP = {
    up: ["towards a higher place", "Hop up on the log."], in: ["inside a place", "Pip went in."], on: ["in place above a surface", "Sit on the log."], off: ["away from a place or surface", "Hop off the log."], back: ["towards the place you came from", "Step back."], well: ["in a good way", "She can sing well."], quick: ["in a fast way", "Run quick!"], bad: ["in a poor way", "It went bad."], mad: ["in an angry way", "He ran mad."], then: ["after that", "Then he ran."], yet: ["up to this time", "Not yet."], much: ["a large amount", "Do not yell so much."], less: ["a smaller amount", "Chat less."],
    down: ["towards a lower place", "Sit down."], near: ["not far away", "Stay near."], far: ["a long way away", "Do not go far."], now: ["at this time", "Feed the sheep now."], soon: ["after a short time", "See you soon."], tonight: ["during this night", "We sail tonight."], hard: ["with a lot of effort", "Push hard."], deep: ["far down", "Dig deep."], high: ["at or towards a high place", "Fly high."], fair: ["in an honest way", "Play fair."], too: ["more than is needed", "The tea is too hot."],
    fast: ["at high speed", "The crab ran fast."], slow: ["at low speed", "Go slow."], soft: ["in a quiet or gentle way", "Tread soft."], swift: ["in a quick way", "Run swift."], smart: ["in a clever way", "Work smart."], strict: ["in a firm way", "Act strict."], flat: ["in a level position", "Lie flat."], next: ["immediately after", "What comes next?"], still: ["without moving", "Stand still."], just: ["only a short time ago", "He just jumped."], past: ["beyond a place", "The frog swam past."], west: ["towards the west", "Fly west."], best: ["better than all the others", "He did best."],
    safely: ["without getting hurt or damaged", "Pip landed safely."], bravely: ["in a brave way", "She climbed bravely."], politely: ["with good manners", "Speak politely."], widely: ["over a large area", "Open it widely."], rudely: ["without good manners", "He spoke rudely."], loudly: ["with a lot of sound", "She shouted loudly."], proudly: ["in a pleased and confident way", "He stood proudly."], neatly: ["in a tidy way", "Write neatly."], sweetly: ["in a kind or pleasant way", "She sang sweetly."], cheaply: ["for little money", "It sold cheaply."], slowly: ["at a low speed", "Walk slowly."], softly: ["in a gentle or quiet way", "The fox crept softly."], swiftly: ["very quickly", "Pip flew swiftly."], gladly: ["in a happy and willing way", "I gladly helped."], boldly: ["in a brave and confident way", "Step boldly."], crisply: ["in a clear, sharp way", "Speak crisply."], brightly: ["with lots of light", "The star shone brightly."], strictly: ["in a firm way", "Follow it strictly."], sadly: ["in an unhappy way", "He sobbed sadly."], badly: ["in a poor way", "The kite flew badly."], dimly: ["with only a little light", "The lamp glowed dimly."], gently: ["in a kind, careful way", "Stroke the kitten gently."], calmly: ["in a quiet, peaceful way", "Wait calmly."], late: ["after the expected time", "Do not arrive late."], today: ["on this day", "We bake today."], away: ["to another place", "Run away!"], out: ["away from inside", "Go out."], round: ["in a circle or to the other side", "Turn round."], home: ["to the place where you live", "Go home."], close: ["to a nearby place", "Come close."], quite: ["to a fairly large degree", "The cave is quite dark."]
  };

  const ids = ["game", "skyScene", "world", "choices", "pip", "lives", "promptCard", "promptKicker", "promptVerb", "targetWord", "promptHelp", "promptAudio", "scoreText", "coinText", "clueText", "shopButton", "soundButton", "dictionaryButton", "trail", "toast", "particles", "pipTalk", "levelBanner", "levelNumber", "levelName", "levelMessage", "wordHelper", "wordHelperClose", "helperWord", "helperKind", "helperDefinition", "helperExample", "fullDictionaryLink", "loadingOverlay", "introOverlay", "storyOverlay", "storyText", "storyNextButton", "storySkipButton", "storyReplayButton", "shopOverlay", "dictionaryOverlay", "resultOverlay", "checkpointReview", "reviewProgress", "reviewCard", "reviewImage", "reviewWord", "reviewKind", "reviewNext", "playButton", "introShopButton", "introDictionaryButton", "closeShopButton", "backToTrailButton", "closeDictionaryButton", "dictionaryPhases", "dictionarySearch", "dictionaryList", "shopCoins", "rewardFill", "rewardMessage", "resultEyebrow", "resultTitle", "resultCopy", "resultScore", "resultBest", "resultCoins", "resultPip", "againButton", "choosePhaseButton", "announcer", "phasePicker", "unlockText", "difficultyPicker", "homeBest", "homeStars", "homeCheckpoints", "bossContainer", "adminOverlay", "closeAdminButton"];
  const els = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));

  const store = {
    read(key, fallback) { try { const value = localStorage.getItem(`wordwind_${key}`); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } },
    write(key, value) { try { localStorage.setItem(`wordwind_${key}`, JSON.stringify(value)); } catch {} }
  };

  const state = {
    running: false, busy: false, score: 0, phaseScore: 0, phase: 2,
    selectedPhase: Math.min(5, Math.max(2, store.read("selectedPhase", 2))),
    unlockedPhase: Math.min(5, Math.max(2, store.read("unlockedPhase", 2))),
    storyIndex: 0, best: store.read("best", 0), coins: store.read("coins", 0),
    maxHearts: 3, hearts: 3, shield: store.read("shield", false),
    boots: store.read("boots", false), includeAdverbs: store.read("includeAdverbs", false),
    targetKind: "noun", previousKind: "", anchor: document.getElementById("startIsland"),
    audioOn: store.read("audioOn", true), bossMode: false, bossRemaining: 0, bossTargetPhase: 3, finaleStage: 0,
    clues: 2, streak: 0, bestStreak: store.read("bestStreak", 0),
    totalCorrect: store.read("totalCorrect", 0), checkpoints: store.read("checkpoints", 0),
    dictionaryPhase: 2, stageStart: 0, revealed: new Set(), assisted: new Set(), checkpointWords: [], missedWords: []
  };
  if (state.selectedPhase > state.unlockedPhase) state.selectedPhase = state.unlockedPhase;

  class Sound {
    constructor() {
      this.ctx = null; this.sceneName = ""; this.ducked = false;
      // Legacy recordings stay on disk for safety, but are no longer loaded.
      this.music = {}; this.bossEffects=new Set();this.bossCues=new Set();
      this.files = {
        jump: "assets/audio/jump-whoosh.mp3", land: "assets/audio/soft-land.mp3",
        correct: "assets/audio/correct-chime.mp3", wrong: "assets/audio/wrong-wind.mp3",
        coin: "assets/audio/star-collect.mp3", checkpoint: "assets/audio/checkpoint-fanfare.mp3",
        clue: "assets/audio/clue-open.mp3", purchase: "assets/audio/upgrade-buy.mp3"
      };
    }
    makeAudio(src, volume, loop = false) { const audio = new Audio(src); audio.preload = "auto"; audio.volume = volume; audio.loop = loop; return audio; }
    ready() { const AudioCtx = window.AudioContext || window.webkitAudioContext; if (!AudioCtx) return; if (!this.ctx) this.ctx = new AudioCtx(); if (this.ctx.state === "suspended") this.ctx.resume(); }
    tone(freq, duration, type = "sine", volume = .12, delay = 0, endFreq = null) { if (!state.audioOn) return; this.ready(); if (!this.ctx) return; const t = this.ctx.currentTime + delay; const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); osc.type = type; osc.frequency.setValueAtTime(freq, t); if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration); gain.gain.setValueAtTime(volume * .35, t); gain.gain.exponentialRampToValueAtTime(.001, t + duration); osc.connect(gain).connect(this.ctx.destination); osc.start(t); osc.stop(t + duration); }
    effect(name, volume = .5) { if (!state.audioOn || !this.files[name]) return; const audio = this.makeAudio(this.files[name], volume * .38); audio.play().catch(() => {}); }
    stopBossEffects(){for(const t of this.bossCues)clearTimeout(t);this.bossCues.clear();for(const a of this.bossEffects){a.pause();a.removeAttribute('src');a.load();}this.bossEffects.clear();}
    bossStrike(profile,delay){if(!state.audioOn)return;const cue=setTimeout(()=>{this.bossCues.delete(cue);if(!state.audioOn||document.hidden||!state.bossMode)return;const a=this.makeAudio(`assets/audio/boss/boss-${profile.theme}-strike.mp3`,.38);this.bossEffects.add(a);a.onended=a.onerror=()=>this.bossEffects.delete(a);a.play().catch(()=>this.bossEffects.delete(a));},Math.max(0,delay));this.bossCues.add(cue);}
    jump() { this.effect("jump", .34); } land() { this.effect("land", .42); }
    correct() { this.effect("correct", .42); }
    crack(stage) { this.tone(330 - stage * 60, .07 + stage * .025, "sawtooth", .1 + stage * .025, 0, 90); }
    boom() { this.effect("wrong", .48); } coin() { this.effect("coin", .38); }
    checkpoint() { this.effect("checkpoint", .48); } clue() { this.effect("clue", .4); } purchase() { this.effect("purchase", .5); }
    scene(name) {
      this.sceneName = name;
      Object.values(this.music).forEach(audio=>audio.pause());
      PipSoundtrack.scene(name==='flight'?({2:'sky',3:'forest',4:'crystal',5:'volcano'}[state.phase]):name);
      PipSoundtrack.unlock();
    }
    duck(on) { this.ducked = on; PipSoundtrack.duck(on); }
    toggle() { state.audioOn = !state.audioOn; store.write("audioOn", state.audioOn); if (state.audioOn) this.ready(); else {stopNarration();this.stopBossEffects();} PipSoundtrack.refresh(); updateSoundButton(); }
  }
  const sound = new Sound();
  PipSoundtrack.configure({enabled:()=>state.audioOn});
  PipBossBattle.mount(els.bossContainer);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  PipVoice.configure({enabled:()=>state.audioOn,duck:on=>{sound.duck(on);if(on)PipBossBattle.hold('speech');else PipBossBattle.release('speech');},unavailable:()=>{}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)sound.stopBossEffects();});
  let voiceRequestToken=0,storyVoiceToken=0;
  const stopNarration=()=>{storyVoiceToken++;PipVoice.stop();};
  const speak=text=>PipVoice.say(text,'teacher');
  const speakPip=text=>PipVoice.say(text,'pip');
  const speakBoss=(profile,line)=>PipVoice.say(line,`boss-${profile.theme}`);

  function showOverlay(el) { if(state.running && state.busy && (el===els.shopOverlay || el===els.dictionaryOverlay)) return; stopNarration(); el.classList.add("open"); }
  function hideOverlay(el) { if (!el) return; if (el.contains(document.activeElement)) document.activeElement.blur(); el.classList.remove("open"); els.game.scrollTop = 0; els.game.scrollLeft = 0; window.scrollTo(0, 0); }
  function phaseDetails(phase = state.phase) { return {...PHASES[phase],name:PipAdventure.regions[phase].name,message:PipAdventure.regions[phase].story}; }
  function enabledKinds() { return (state.includeAdverbs || PipAdventure.settings(state.phase).extraAdverbs) ? ["noun", "verb", "adjective", "adverb"] : ["noun", "verb", "adjective"]; }
  function article(kind) { return /^[aeiou]/.test(kind) ? "an" : "a"; }
  function pluralKind(kind) { return kind === "adjective" ? "adjectives" : `${kind}s`; }
  function choose(list) { return list[Math.floor(Math.random() * list.length)]; }
  // Keep informal inherited entries discoverable in the catalogue, but do not
  // force them into scored primary-school adverb challenges.
  const REVIEW_ADVERBS = new Set(['bad','mad','strict','swift','soft','smart','quick']);
  function playableBank(phase) { const words=PHASES[phase].words; return {...words,adverb:words.adverb.filter(word=>!REVIEW_ADVERBS.has(word))}; }
  function shuffle(list) { return list.map(value => ({ value, order: Math.random() })).sort((a, b) => a.order - b.order).map(item => item.value); }

  function pipSay(message, duration = 1900) { clearTimeout(pipSay.timer); els.pipTalk.textContent = message; els.pipTalk.classList.add("show"); els.pip.classList.add("talking"); pipSay.timer = setTimeout(() => { els.pipTalk.classList.remove("show"); els.pip.classList.remove("talking"); }, duration); }
  function closeWordHelper() { if (!els.wordHelper.classList.contains('show')) return; els.wordHelper.classList.remove('show'); [...els.game.children].forEach(el=>{if(el!==els.wordHelper)el.inert=false;}); stopNarration(); voiceRequestToken++; if (showWordHelper.opener?.isConnected) showWordHelper.opener.focus({preventScroll:true}); groundPip(); }
  function helpFor(word, kind) { if (kind === "adverb" && ADVERB_HELP[word]) return ADVERB_HELP[word]; const definitions = { noun: [`“${word}” names a person, place, animal or thing.`, `The word “${word}” is a noun.`], verb: [`“${word}” tells an action that someone or something can do.`, `The word “${word}” is a verb.`], adjective: [`“${word}” can describe what a noun is like.`, `The word “${word}” is an adjective.`] }; return definitions[kind] || [KIND_HELP[kind], `The word is “${word}”.`]; }
  function narrateHelp(){const c=showWordHelper.current;if(!c||!els.wordHelper.classList.contains('show'))return;const masked=els.wordHelper.dataset.kind==='hidden';speak(c.word+'. '+(c.meaning||'Look closely at the picture.')+(masked?'':' This picture shows a '+c.kind+'.'));}
  function showWordHelper(word, kind, phase = state.bossMode ? state.bossTargetPhase : PipAdventure.settings(state.phase).wordPhase) {
    if(state.running && state.busy)return;
    showWordHelper.opener = document.activeElement;
    const entry = PipVocabulary.get(phase,kind,word); const help = helpFor(word,kind);
    const guide = {noun:'What can you name in the picture? Look at the person, place, animal or thing with Pip.',verb:'What is happening? Look at what Pip or another character is doing.',adjective:'What is it like? Look at colour, size, shape, feeling or another describing detail.',adverb:'How, when or where does it happen? Look at the way, time or place of the action.'}[kind];
    els.wordHelper.dataset.kind=kind; els.helperWord.textContent=word; els.helperKind.textContent=kind+' picture'; els.helperDefinition.textContent=guide; els.helperExample.textContent=help.join(' ');
    const img=document.getElementById('helperImage'); img.hidden=false; img.alt=word+' — '+kind+' picture'; img.src=entry?.image||''; img.onerror=()=>{img.hidden=true;};
    const others=PipVocabulary.kindsFor(word).filter(k=>k!==kind); document.getElementById('helperOther').textContent=others.length?'This word can have other jobs too: '+others.join(', ')+'. This picture shows one meaning.':'';
    els.fullDictionaryLink.href='https://happyclass-ops.github.io/prep2-phonics/?word='+encodeURIComponent(word); els.fullDictionaryLink.dataset.word=word;
    [...els.game.children].forEach(el=>{if(el!==els.wordHelper)el.inert=true;}); els.wordHelper.classList.add('show'); els.wordHelperClose.focus();
    showWordHelper.current={word,kind,phase,meaning:null};if(state.running)state.assisted.add(word+":"+state.targetKind);
    const masked=state.running && PipAdventure.mode==='classic' && !state.revealed.has(phase+':'+kind+':'+word);
    if(masked){els.wordHelper.dataset.kind='hidden';els.helperKind.textContent='Picture clue';els.helperDefinition.textContent='Look closely. What job could this word do?';els.helperExample.textContent='The word type is hidden. Use a reveal to check your idea.';img.alt='Picture clue for '+word;document.getElementById('helperOther').textContent='';}
    const reveal=document.getElementById('helperReveal');reveal.hidden=!masked;reveal.disabled=state.clues<=0;reveal.textContent=state.clues>0?'Reveal word type · '+state.clues+' left':'No reveals left this run';
    for(const id of ['helperPrev','helperNext','fullDictionaryLink'])document.getElementById(id).hidden=state.running;
    stopNarration();const request=++voiceRequestToken;
    els.helperDefinition.textContent=masked?'Meaning / picture':'Meaning and word type';
    els.helperExample.textContent='Finding the meaning…';
    PipMeanings.get(word,kind).then(result=>{
      if(request!==voiceRequestToken||!els.wordHelper.classList.contains('show'))return;
      const meaning=result?.definition||'The meaning is unavailable right now. Ask your teacher about this picture.';
      els.helperExample.textContent=meaning;
      els.helperExample.title=result?'Definition: '+result.source:'';
      showWordHelper.current.meaning=meaning;document.getElementById('helperOther').textContent=(!masked&&others.length?'This word can have other jobs too: '+others.join(', ')+'. ':'')+(result?'Meaning: '+result.source+'.':'');
      narrateHelp();
    });
  }
  function useClue(word, kind) { if (!state.running || state.busy) return; sound.clue(); showWordHelper(word,kind); }

  function setCamera(step = state.phaseScore) { const phaseRise = (state.phase - 2) * 12; const vertical = Math.max(12, 72 - phaseRise - step * 4.5); const horizontal = 50 + Math.sin((step + state.phase * 1.7) * 1.08) * 12; els.skyScene.style.backgroundPosition = `${horizontal.toFixed(1)}% ${vertical.toFixed(1)}%`; }
  function climbSky() { els.game.classList.remove("climbing"); void els.game.offsetWidth; els.game.classList.add("climbing"); setCamera(); setTimeout(() => els.game.classList.remove("climbing"), 1000); for (let i = 0; i < 18; i++) { const gust = document.createElement("i"); gust.className = "altitude-streak"; gust.style.left = `${5 + Math.random() * 90}%`; gust.style.top = `${-10 - Math.random() * 45}%`; gust.style.setProperty("--fall", `${110 + Math.random() * 80}%`); gust.style.animationDelay = `${Math.random() * .16}s`; els.particles.appendChild(gust); gust.addEventListener("animationend", () => gust.remove()); } }
  async function announceBanner(label, name, message, duration = 2300) { els.levelNumber.textContent = label; els.levelName.textContent = name; els.levelMessage.textContent = message; els.levelBanner.classList.remove("show"); void els.levelBanner.offsetWidth; els.levelBanner.classList.add("show"); sound.correct(); await Promise.all([speakPip(`${label}. ${name}. ${message}`),sleep(duration)]); els.levelBanner.classList.remove("show"); }
  async function showReadyCue(epoch){els.levelNumber.textContent='READY…';els.levelName.textContent='Get set';els.levelMessage.textContent='The islands are moving into place.';els.levelBanner.classList.remove('show');void els.levelBanner.offsetWidth;els.levelBanner.classList.add('show');await sleep(550);if(epoch!==runEpoch)return;els.levelNumber.textContent='GO!';els.levelName.textContent='Find the right words';sound.correct();await sleep(450);els.levelBanner.classList.remove('show');}

  function updatePhasePicker() { document.querySelectorAll(".phase-choice").forEach(button => { const phase = Number(button.dataset.phase); const locked = phase > state.unlockedPhase; button.disabled = locked; button.classList.toggle("active", phase === state.selectedPhase); button.classList.toggle("locked", locked); button.setAttribute("aria-pressed", String(phase === state.selectedPhase)); button.setAttribute("aria-label", locked ? `Phase ${phase}, locked` : `Start at Phase ${phase}, ${PHASES[phase].short}`); }); els.unlockText.textContent = state.unlockedPhase === 5 ? "All phases ready" : `Up to Phase ${state.unlockedPhase} ready`; updateDifficultyPicker(); updateHomeRecord(); }
  function updateDifficultyPicker() { document.querySelectorAll(".difficulty-choice").forEach(button => { const hard = button.dataset.difficulty === "hard"; const active = hard === state.includeAdverbs; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); }); }
  function updateHomeRecord() { els.homeBest.textContent = state.best; els.homeStars.textContent = state.coins; els.homeCheckpoints.textContent = state.checkpoints; }
  function updateSoundButton() { els.soundButton.classList.toggle("muted", !state.audioOn); els.soundButton.setAttribute("aria-label", state.audioOn ? "Turn sound off" : "Turn sound on"); }
  function applyPhase(phase, preview = false) { state.phase = phase; PipAdventure.apply(phase); els.game.dataset.phase = String(phase); els.game.dataset.level = String(phase - 1); if (!preview) { els.promptKicker.textContent = `Phase ${phase} · ${phaseDetails().name} · ${state.phaseScore}/${CLIMBS_PER_PHASE}`; setCamera(); } }

  const storyPages = ['Oh! The islands have floated into the sky, and our friends are stranded. Will you help me bring them home?', 'We will cross the sky islands, floating forest and crystal peaks, all the way to the volcano. Read the words to find a safe path.', 'After six leaps, help me light a beacon. Then choose which path we will take next. Let’s fly!'];
  function narrateStory() { const token=++storyVoiceToken;els.storyReplayButton.hidden=true;speakPip(storyPages[state.storyIndex]).then(result=>{if(token!==storyVoiceToken||!els.storyOverlay.classList.contains('open'))return;if(result==='unavailable'||result==='timeout')els.storyReplayButton.hidden=false;}); }
  function renderStory() { els.storyText.textContent = storyPages[state.storyIndex]; els.storyNextButton.textContent = state.storyIndex === storyPages.length - 1 ? "Let's fly" : "Next"; narrateStory(); }
  function beginStory() { PipAdventure.hideHub(); sound.ready(); sound.scene("flight"); state.storyIndex = 0; hideOverlay(els.introOverlay); showOverlay(els.storyOverlay); renderStory(); }
  function advanceStory() { if (state.storyIndex >= 2) { hideOverlay(els.storyOverlay); startGame(); return; } state.storyIndex += 1; renderStory(); }

  function updateHud() {
    els.scoreText.textContent = state.score; els.coinText.textContent = state.running&&PipAdventure.mode==='classic'?PipSupplies.stars:state.coins; els.coinText.title=state.running&&PipAdventure.mode==='classic'?'Run stars · spend at checkpoint stops':'Saved stars · cosmetic rewards'; els.shopButton.hidden=state.running; els.clueText.textContent = String(state.clues); els.shopCoins.textContent = state.coins; els.lives.innerHTML = "";
    for (let i = 0; i < state.maxHearts; i++) { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 32 29"); svg.setAttribute("aria-hidden", "true"); svg.classList.add("heart"); if (i >= state.hearts) svg.classList.add("lost"); svg.innerHTML = '<path d="M16 27S2 18.5 2 9.7C2 4.7 5.4 2 9.3 2c3 0 5.2 1.8 6.7 4.2C17.5 3.8 19.7 2 22.7 2 26.6 2 30 4.7 30 9.7 30 18.5 16 27 16 27Z" fill="#ee655e" stroke="#fff7df" stroke-width="2"/>'; els.lives.appendChild(svg); }
    els.lives.setAttribute("aria-label", `${state.hearts} of ${state.maxHearts} hearts`);
    [...els.trail.children].forEach((dot, index) => { if (dot.classList.contains("trail-gate")) dot.classList.toggle("ready", state.bossMode); else dot.classList.toggle("done", index < state.phaseScore); });
    els.game.classList.toggle("out-of-clues", state.clues <= 0); document.querySelectorAll(".learn-word span").forEach(badge => { badge.textContent = String(state.clues); }); updateHomeRecord();
  }
  function buildTrail() { els.trail.innerHTML = ""; for (let i = 0; i < CLIMBS_PER_PHASE; i++) { const dot = document.createElement("span"); dot.className = "trail-dot"; els.trail.appendChild(dot); } const gate = document.createElement("span"); gate.className = "trail-gate"; gate.textContent = "◆"; gate.setAttribute("aria-hidden", "true"); els.trail.appendChild(gate); }
  function chooseKind() { const available = enabledKinds().filter(kind => kind !== state.previousKind); const kind = choose(available); state.previousKind = kind; return kind; }

  const selection=PipSelection.create(PipVocabulary.accepts);
  function makeOptions(count) { return selection.draw(playableBank(PipAdventure.settings(state.phase).wordPhase),enabledKinds(),state.targetKind,count,1); }
  function makeBossOptions(targetPhase, count = 5, profile=PipChallenge.checkpoint(PipAdventure.mode,state.phase,state.finaleStage)) {
    const actualPhase = (state.phase === 5) ? 5 : targetPhase;
    const kinds = (actualPhase === 5) ? ['noun', 'verb', 'adjective', 'adverb'] : [...new Set([...enabledKinds(), profile.kind])];
    const initialRight = (actualPhase === 5) ? 3 : 2;
    const options = selection.draw(playableBank(actualPhase), kinds, state.targetKind, count, initialRight);
    return options;
  }

  function createIsland(option, index, count) {
    const island = document.createElement("div"); island.className = `island count-${count} pos-${String.fromCharCode(97 + index)}`; island.setAttribute("role", "button"); island.setAttribute("tabindex", "0"); island.setAttribute("aria-label", `${option.word}. Choose this word`); island.dataset.word = option.word; island.dataset.kind = option.kind; island.dataset.bossCorrect = String(Boolean(option.bossCorrect));
    island.style.setProperty("--drift-delay", `${-(index * .61 + count * .17)}s`); island.innerHTML = `<div class="island-inner"><img class="island-art" src="assets/wind-island-v2.webp" alt=""><i class="island-glint" aria-hidden="true"></i></div><div class="word-plaque">${option.word}</div><button class="learn-word" type="button" aria-label="Use a clue for ${option.word}">?<span>${state.clues}</span></button><button class="speak-word" type="button" aria-label="Hear ${option.word}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h3l4 3V7L8 10H5Zm10-1.5a5 5 0 0 1 0 7"/></svg></button>`;
    const leap = event => { if (event.target.closest("button")) return; if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return; event.preventDefault(); handleChoice(island); };
    island.addEventListener("click", leap); island.addEventListener("keydown", leap);
    island.querySelector(".speak-word").addEventListener("click", event => { event.stopPropagation(); sound.ready(); speak(option.word); });
    island.querySelector(".learn-word").addEventListener("click", event => { event.stopPropagation(); sound.ready(); useClue(option.word, option.kind); });
    island.addEventListener("pointerenter", () => els.pip.classList.add("engaged")); island.addEventListener("pointerleave", () => els.pip.classList.remove("engaged")); return island;
  }

  function placeChoice(option,index,count){const island=createIsland(option,index,count);els.choices.appendChild(island);camera.place(island);return island;}
  function choiceCount() { if (state.phase === 2) return state.phaseScore < 3 ? 2 : 3; if (state.phase === 3) return 3; return 4; }
  function setPrompt(kind, boss = false) { els.promptCard.dataset.kind = kind; if (boss) { const profile=PipChallenge.checkpoint(PipAdventure.mode,state.phase,state.finaleStage);els.promptVerb.textContent = "Find"; els.promptKicker.textContent = `${profile.name}${profile.stages>1?' · Stage '+(profile.stage+1)+'/'+profile.stages:''}`; els.targetWord.textContent = `all the ${pluralKind(kind)}`; els.promptHelp.textContent = `${state.bossRemaining} islands are right`; } else { els.promptVerb.textContent = "Land on"; els.promptKicker.textContent = `Phase ${state.phase} · ${phaseDetails().name} · ${state.phaseScore}/${CLIMBS_PER_PHASE}`; els.targetWord.textContent = `${article(kind)} ${kind}`; els.promptHelp.textContent = KIND_HELP[kind]; } }
  function newRound() { if (!state.running) return; state.revealed.clear();state.assisted.clear(); groundPip(true); if (state.phaseScore >= CLIMBS_PER_PHASE) { beginCheckpoint(); return; } state.busy = false; state.bossMode = false; sound.scene('flight');els.game.classList.remove("at-checkpoint"); state.anchor.classList.remove("checkpoint"); clearTimeout(toast.timer); els.toast.classList.remove("show"); closeWordHelper(); state.targetKind = chooseKind(); setPrompt(state.targetKind, false); els.choices.className = ""; els.choices.innerHTML = ""; const count = choiceCount(),options=makeOptions(count);beginPractice(options); options.forEach((option, index) => placeChoice(option,index,count)); updateHud(); const lines = { noun: "Find a naming word!", verb: "Which word can I do?", adjective: "Find a describing word!", adverb: "How, when or where?" }; setTimeout(() => pipSay(lines[state.targetKind]), 220); setTimeout(() => {if(state.running&&!state.busy&&!els.wordHelper.classList.contains('show')&&!document.querySelector('.scene-dialog:not([hidden])')&&document.getElementById('supplyScene').hidden)speak(`Land on ${article(state.targetKind)} ${state.targetKind}.`);}, 340); }

  function drawReplacementOption(mustBeCorrect, targetKind = state.targetKind, reservedWords = new Set()) {
    const activePhase = (state.bossMode && state.phase === 5) ? 5 : (state.bossTargetPhase || PipAdventure.settings(state.phase).wordPhase);
    const bank = playableBank(activePhase);
    const kinds = (activePhase === 5) ? ['noun', 'verb', 'adjective', 'adverb'] : enabledKinds();
    const onScreen = new Set([...document.querySelectorAll('#choices .island')].map(isl => isl.dataset.word));
    reservedWords.forEach(word=>onScreen.add(word));
    if (mustBeCorrect) {
      const candidates = (bank[targetKind] || []).filter(w => !onScreen.has(w));
      const fallbackWord = (bank[targetKind] && bank[targetKind][0]) || 'whale';
      const word = choose(candidates.length ? candidates : [fallbackWord]);
      return { word, kind: targetKind, bossCorrect: true };
    } else {
      const wrongKinds = kinds.filter(k => k !== targetKind);
      const kind = choose(wrongKinds.length ? wrongKinds : kinds);
      const candidates = (bank[kind] || []).filter(w => !onScreen.has(w) && !PipVocabulary.accepts(w, targetKind));
      const fallbackWord = (bank[kind] && bank[kind][0]) || 'safe';
      const word = choose(candidates.length ? candidates : [fallbackWord]);
      return { word, kind, bossCorrect: false };
    }
  }

  const bossIslandScheduler=(()=>{
    const LOOKAHEAD=4;
    let maxGapMs=2000;
    let generation=0,sequence=0,lastCorrectSlot='',gapActive=false;
    const slots=new Map(),plans=[],timers=new Set();
    const slotId=island=>[...island.classList].find(c=>c.startsWith('pos-'))||'';
    const isSafe=island=>island&&island.isConnected&&island!==state.anchor&&!island.classList.contains('awaiting-pip');
    const isSelectable=island=>isSafe(island)&&island.dataset.bossLifecycle==='active'&&!island.classList.contains('boss-cleared')&&!island.classList.contains('boss-hazard')&&island.getAttribute('aria-disabled')!=='true';
    const selectable=()=>[...slots.values()].map(slot=>slot.current).filter(isSelectable);
    const reserved=()=>new Set(plans.map(plan=>plan.option.word));
    function later(ms,expected=generation){return new Promise(resolve=>{const record={id:0,resolve};record.id=setTimeout(()=>{timers.delete(record);resolve(expected===generation);},ms);timers.add(record);});}
    function clearTimers(){for(const record of timers){clearTimeout(record.id);record.resolve(false);}timers.clear();}
    function candidateSlots(){return [...slots.values()].filter(slot=>slot.current&&isSafe(slot.current)&&!slot.promise);}
    function makePlan(preferredSlot='',forceCorrect=false,fast=false){
      const correct=forceCorrect||sequence%3===1;
      let candidates=candidateSlots();
      if(preferredSlot)candidates=candidates.filter(slot=>slot.id===preferredSlot);
      const unplanned=candidates.filter(slot=>!plans.some(plan=>plan.slotId===slot.id));if(unplanned.length)candidates=unplanned;
      if(correct&&candidates.length>1){const moved=candidates.filter(slot=>slot.id!==lastCorrectSlot);if(moved.length)candidates=moved;}
      const slot=choose(candidates.length?candidates:candidateSlots());
      if(!slot)return null;
      const option=drawReplacementOption(correct,state.targetKind,reserved());
      const plan={slotId:slot.id,option,correct,emptyMs:Math.max(0,Math.min(fast?80:180+(sequence%3)*110,maxGapMs-760)),order:sequence++};
      if(correct)lastCorrectSlot=slot.id;
      return plan;
    }
    function fillPlans(){while(plans.length<LOOKAHEAD){const plan=makePlan();if(!plan)break;plans.push(plan);}}
    function takePlan(id,forceCorrect=false,fast=false){
      let index=forceCorrect?-1:plans.findIndex(plan=>plan.slotId===id);
      let plan=index>=0?plans.splice(index,1)[0]:makePlan(id,forceCorrect,fast);
      if(forceCorrect&&plan&&!plan.correct){plan.option=drawReplacementOption(true,state.targetKind,reserved());plan.correct=true;plan.emptyMs=80;}
      fillPlans();return plan;
    }
    function showGap(show){
      if(show===gapActive)return;gapActive=show;
      els.game.classList.toggle('boss-waiting-islands',show);
      if(show){els.promptHelp.textContent='New islands arriving…';PipBossBattle.announce('New islands arriving…');PipBossBattle.hold('islands');}
      else{PipBossBattle.release('islands');if(state.bossMode)setPrompt(state.targetKind,true);}
    }
    function pendingCorrect(){return [...slots.values()].some(slot=>slot.nextCorrect&&slot.promise);}
    function ensureCorrectSoon(expected=generation){
      if(expected!==generation||!state.running||!state.bossMode)return;
      if(selectable().some(island=>island.dataset.bossCorrect==='true')){showGap(false);return;}
      showGap(true);
      if(pendingCorrect())return;
      const target=candidateSlots().find(slot=>slot.id!==lastCorrectSlot)||candidateSlots()[0];
      if(target){replace(target.current,'promise',{forceCorrect:true,fast:true});return;}
      later(80,expected).then(valid=>{if(valid)ensureCorrectSoon(expected);});
    }
    function assess(expected=generation){if(expected===generation)ensureCorrectSoon(expected);}
    async function runReplacement(slot,island,plan,expected){
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      island.dataset.bossLifecycle='destruction';
      island.removeAttribute('data-boss-correct');
      island.setAttribute('aria-disabled','true');island.setAttribute('tabindex','-1');
      assess(expected);
      if(!reduced){const motion=island.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(70px) scale(.92)'}],{duration:420,easing:'ease-in',fill:'forwards'});await motion.finished.catch(()=>{});}
      if(expected!==generation||slot.current!==island||!state.running||!state.bossMode)return false;
      island.remove();slot.current=null;slot.lifecycle='empty';assess(expected);
      if(!(await later(plan.emptyMs,expected))||slot.current)return false;
      slot.lifecycle='spawning';
      const next=createIsland(plan.option,slot.index,slot.count);
      next.className=`island count-${slot.count} ${slot.id} boss-island-spawning`;
      next.removeAttribute('data-boss-correct');
      next.dataset.bossSlot=slot.id;next.dataset.bossInstance=String(++slot.instance);next.dataset.bossLifecycle='spawning';
      next.setAttribute('aria-disabled','true');next.setAttribute('tabindex','-1');
      slot.current=next;els.choices.appendChild(next);camera.place(next);
      const spawn=next.animate([{opacity:0,transform:'translateY(24px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:reduced?0:340,easing:'ease-out'});
      await spawn.finished.catch(()=>{});
      if(expected!==generation||slot.current!==next||!next.isConnected)return false;
      next.classList.remove('boss-island-spawning');next.dataset.bossCorrect=String(Boolean(plan.option.bossCorrect));next.dataset.bossLifecycle='active';slot.lifecycle='active';
      next.setAttribute('aria-disabled','false');next.setAttribute('tabindex','0');return true;
    }
    function replace(island,reason='player',options={}){
      if(!state.running||!state.bossMode||!island)return Promise.resolve(false);
      const id=island.dataset.bossSlot||slotId(island),slot=slots.get(id);
      if(!slot||slot.current!==island)return slot?.promise||Promise.resolve(false);
      if(slot.promise)return slot.promise;
      if(island===state.anchor||island.classList.contains('awaiting-pip'))return Promise.resolve(false);
      const plan=takePlan(id,options.forceCorrect,options.fast);if(!plan)return Promise.resolve(false);
      plan.spawnAt=performance.now()+(matchMedia('(prefers-reduced-motion: reduce)').matches?0:420)+plan.emptyMs;
      slot.nextCorrect=plan.correct;slot.lifecycle='destruction';
      const expected=generation;
      slot.promise=Promise.resolve().then(()=>runReplacement(slot,island,plan,expected)).finally(()=>{if(expected!==generation)return;slot.promise=null;slot.nextCorrect=false;fillPlans();assess(expected);});
      assess(expected);return slot.promise;
    }
    function randomTarget(){fillPlans();const eligible=selectable();if(!eligible.length)return null;const planned=plans.find(plan=>eligible.some(island=>(island.dataset.bossSlot||slotId(island))===plan.slotId));return planned?eligible.find(island=>(island.dataset.bossSlot||slotId(island))===planned.slotId):choose(eligible);}
    function start(config={}){stop();generation++;maxGapMs=Math.max(500,Number(config.maxGapMs)||2000);for(const island of els.choices.querySelectorAll('.island')){const id=slotId(island);if(!id)continue;const count=Number(([...island.classList].find(c=>c.startsWith('count-'))||'count-5').slice(6))||5,index=id.charCodeAt(4)-97;island.dataset.bossSlot=id;island.dataset.bossInstance='1';island.dataset.bossLifecycle='active';slots.set(id,{id,count,index,current:island,instance:1,lifecycle:'active',promise:null,nextCorrect:false});}fillPlans();assess();}
    function stop(){generation++;clearTimers();plans.length=0;slots.clear();sequence=0;lastCorrectSlot='';if(gapActive)showGap(false);}
    return{start,stop,replace,randomTarget,assess,snapshot:()=>({generation,gapActive,maxGapMs,plans:plans.map(plan=>({...plan,option:{...plan.option}})),slots:[...slots.values()].map(slot=>({id:slot.id,lifecycle:slot.lifecycle,instance:slot.instance,pending:Boolean(slot.promise)}))})};
  })();

  function respawnBossIsland(oldIsland,reason='player'){return bossIslandScheduler.replace(oldIsland,reason);}

  async function triggerBossHazard(profile){
    const epoch=runEpoch,battle=PipBossBattle.generation;
    const valid=()=>epoch===runEpoch&&battle===PipBossBattle.generation&&state.running&&state.bossMode;
    if(!valid()||state.busy||document.hidden||els.wordHelper.classList.contains('show'))return;
    const target=bossIslandScheduler.randomTarget();if(!target)return;
    const className={bramble:'bramble-bound',squall:'storm-sunk',whirlwind:'wind-shrouded',lava:'lava-melted'}[profile.hazard];
    state.busy=true;setChoicesDisabled(true);
    target.classList.add('hazard-telegraphed');
    sound.bossStrike(profile,profile.windupMs-profile.sfxPeakMs);
    try{
      await sleep(profile.windupMs);
      if(!valid()||document.hidden||!target.isConnected||target===state.anchor)return;
      PipBossBattle.strike();
      target.classList.remove('hazard-telegraphed');
      target.classList.add('boss-hazard','hazard-spent',className);
      target.setAttribute('aria-disabled','true');target.setAttribute('tabindex','-1');
      PipBossBattle.announce(profile.theme==='kraken'?'Thunder strike!':profile.attack);
      await respawnBossIsland(target,'hazard');
      if(!valid()||document.hidden)return;
      toast(profile.learning?profile.hint:'An island shifts! Keep going.');
      // Teaching stays available in text/help; the attack is carried by its actual sound.
    } finally {
      target.classList.remove('hazard-telegraphed');
      if(valid()){state.busy=false;setChoicesDisabled(false);}
    }
  }

  async function beginCheckpoint() {
    const epoch = runEpoch;
    if (state.bossMode || !state.running) return;
    sound.stopBossEffects();
    bossIslandScheduler.stop();
    state.busy = true;
    state.bossMode = true;
    state.bossTargetPhase = (state.phase === 5) ? 5 : PipAdventure.settings(state.phase).wordPhase;
    state.anchor.classList.add("checkpoint");
    els.game.classList.add("at-checkpoint");
    setCamera(CLIMBS_PER_PHASE + 1);
    updateHud();

    const profile = PipChallenge.checkpoint(PipAdventure.mode, state.phase, state.finaleStage);
    const finale = profile.stages > 1;
    els.game.classList.remove('boss-moss', 'boss-kraken', 'boss-gale', 'boss-volcano', 'boss-won');
    els.game.classList.add('boss-active', 'boss-' + profile.theme);
    els.game.classList.toggle('finale', finale);
    sound.scene(profile.music);

    if (state.finaleStage === 0 || !state.encounterHealth) {
      state.encounterHealthMax = profile.stages > 1 ? profile.rounds.reduce((s, r) => s + r.right, 0) : profile.targetHits;
      state.encounterHealth = state.encounterHealthMax;
    }
    state.bossRemaining = profile.right;

    PipBossBattle.start(profile, {
      onExpire: triggerBossHazard,
      autostart: false,
      preserveHealth: state.finaleStage > 0
    });
    PipBossBattle.setHealth(state.encounterHealth, state.encounterHealthMax);

    const preview = (profile.stages > 1 ? 'Stage ' + (profile.stage + 1) + ' of ' + profile.stages + ' · ' : '') + profile.label;
    await announceBanner("BOSS BATTLE", profile.name, preview, 900);
    if (!state.running || epoch !== runEpoch) return;

    state.targetKind = profile.kind || chooseKind();
    els.choices.className = "boss-round";
    els.choices.innerHTML = "";
    const options = makeBossOptions(state.bossTargetPhase, profile.count, profile);
    beginPractice(options);
    setPrompt(state.targetKind, true);
    options.forEach((option, index) => placeChoice(option, index, options.length));
    pipSay(profile.label, 2300);
    await speakBoss(profile,profile.intro);
    if(!state.running||epoch!==runEpoch||!state.bossMode)return;
    await speak(`Find all the ${pluralKind(state.targetKind)}. ${state.bossRemaining} islands are right.`);
    if(!state.running||epoch!==runEpoch||!state.bossMode)return;
    await showReadyCue(epoch);
    if(!state.running||epoch!==runEpoch||!state.bossMode)return;
    bossIslandScheduler.start({maxGapMs:2000});
    state.busy = false;
    PipBossBattle.startCountdown();
    updateHud();
  }

  function applyWardrobe(){
    const look=wardrobe.equipped;
    PipAppearance.render(look,document.querySelectorAll('#pip .pip-sprite,#hubPip .pip-atlas-frame,#shopPip .pip-atlas-frame,#shopMirrorPip,#resultPip'),{pin:true}).catch(()=>{});
    updateHud();window.dispatchEvent(new Event('wardrobechange'));
  }
  const wardrobe=PipWardrobe.create({storage:localStorage,wallet:{balance:()=>state.coins,sync:value=>{state.coins=value;}},changed:applyWardrobe});
  const practice=PipPractice.create({entries:PipVocabulary.entries,storage:localStorage});
  let practiceRound=0,practiceId='',roundWrong=false;const practiceSession=Date.now().toString(36)+Math.random().toString(36).slice(2);
  function beginPractice(options){practiceId=practiceSession+':'+(++practiceRound);roundWrong=false;state.assisted.clear();state.revealed.clear();practice.present(practiceId,state.phase,options,state.targetKind);}
  let runEpoch=0;
  const camera=PipCamera.create(els.world);
  function cancelRunMotion(){runEpoch++;sound.stopBossEffects();stopNarration();bossIslandScheduler.stop();PipBossBattle.stop();els.game.classList.remove('boss-active','boss-moss','boss-kraken','boss-gale','boss-volcano','boss-waiting-islands');els.pip.getAnimations().forEach(a=>a.cancel());els.world.getAnimations().forEach(a=>a.cancel());}
  function updateBeacon(lit=false){const beacon=document.getElementById('beaconStation');beacon.dataset.lit=String(lit);beacon.style.setProperty('--approach',String(Math.min(1,state.phaseScore/CLIMBS_PER_PHASE)));beacon.setAttribute('aria-label',lit?'Beacon restored':'Beacon ahead: '+state.phaseScore+' of '+CLIMBS_PER_PHASE+' leaps');}
  function getPipPosition(island) { return { left: island.offsetLeft + island.offsetWidth * .5 - els.pip.offsetWidth * .5, top: island.offsetTop + island.offsetHeight * .37 - els.pip.offsetHeight * .9 }; }
  // Islands are responsive; never keep an old pixel landing after a viewport change.
  function groundPip(force = false) {
    if ((!force && state.busy) || !state.anchor?.isConnected) return;
    const pos = getPipPosition(state.anchor);
    els.pip.style.left = `${pos.left}px`; els.pip.style.top = `${pos.top}px`;
    els.pip.classList.remove('face-left');
  }
  new ResizeObserver(() => groundPip()).observe(els.world);
  window.addEventListener('resize', () => requestAnimationFrame(() => groundPip()));
  async function animatePipTo(island) {
    const epoch=runEpoch;
    const start = { left: els.pip.offsetLeft, top: els.pip.offsetTop }; const end = getPipPosition(island);
    const dx = end.left - start.left; const dy = end.top - start.top; const distance = Math.hypot(dx, dy);
    els.pip.classList.remove('face-left');
    const lift = Math.max(els.game.clientHeight * .15, Math.min(els.game.clientHeight * .25, distance * .42));
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.round(Math.max(680, Math.min(930, 620 + distance * .34)));
    els.pip.classList.add("crouch"); island.classList.add("awaiting-pip"); await sleep(145);if(epoch!==runEpoch)return;
    els.pip.classList.remove("crouch"); els.pip.classList.add("airborne"); els.game.classList.add("pip-jumping"); sound.jump();
    const motion = els.pip.animate([
      { transform: "translate3d(0,0,0) rotate(0deg) scale(1)", offset: 0, easing: "cubic-bezier(.3,.02,.65,.32)" },
      { transform: `translate3d(${dx * .16}px,${dy * .16 - lift * .56}px,0) rotate(${-Math.sign(dx) * 5}deg) scale(.96,1.06)`, offset: .2, easing: "cubic-bezier(.18,.72,.28,1)" },
      { transform: `translate3d(${dx * .48}px,${dy * .48 - lift}px,0) rotate(${Math.sign(dx) * 2}deg) scale(1.02)`, offset: .48, easing: "cubic-bezier(.45,0,.72,.42)" },
      { transform: `translate3d(${dx * .78}px,${dy * .78 - lift * .55}px,0) rotate(${Math.sign(dx) * 7}deg) scale(1.02,.98)`, offset: .78, easing: "cubic-bezier(.2,.75,.28,1)" },
      { transform: `translate3d(${dx}px,${dy}px,0) rotate(0deg) scale(.98,1.03)`, offset: 1 }
    ], { duration, easing: "linear", fill: "forwards" });
    setTimeout(() => {if(epoch===runEpoch)els.pip.classList.add("glide");}, duration * .28); await motion.finished.catch(()=>{});if(epoch!==runEpoch)return;
    els.pip.style.left = `${end.left}px`; els.pip.style.top = `${end.top}px`; motion.cancel();
    els.game.classList.remove("pip-jumping"); els.pip.classList.remove("airborne", "glide"); els.pip.classList.add("land"); island.classList.remove("awaiting-pip"); island.classList.add("pip-impact"); sound.land();
    await sleep(290); els.pip.classList.remove("land",'face-left'); island.classList.remove("pip-impact");
  }
  function setChoicesDisabled(disabled) { els.choices.querySelectorAll(".island").forEach(island => { const locked=disabled||island.classList.contains("boss-cleared")||island.classList.contains('hazard-spent');island.setAttribute("aria-disabled", String(locked)); island.setAttribute("tabindex", locked ? "-1" : "0"); }); }
  function toast(message, bad = false) { els.toast.textContent = message; els.toast.classList.toggle("bad", bad); els.toast.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => els.toast.classList.remove("show"), 2100); }

  function burstAt(island) { const gameRect = els.game.getBoundingClientRect(); const rect = island.getBoundingClientRect(); const x = rect.left - gameRect.left + rect.width / 2; const y = rect.top - gameRect.top + rect.height * .25; const colours = ["#ffcb50", "#ef6f62", "#6ee0c2", "#ffffff", "#3d86d8"]; for (let i = 0; i < 18; i++) { const bit = document.createElement("i"); const angle = Math.random() * Math.PI * 2; const distance = gameRect.width * (.04 + Math.random() * .07); bit.className = "particle"; bit.style.left = `${x}px`; bit.style.top = `${y}px`; bit.style.setProperty("--s", `${3 + Math.random() * gameRect.width * .008}px`); bit.style.setProperty("--c", colours[i % colours.length]); bit.style.setProperty("--x", `${Math.cos(angle) * distance}px`); bit.style.setProperty("--y", `${Math.sin(angle) * distance}px`); els.particles.appendChild(bit); bit.addEventListener("animationend", () => bit.remove()); } }
  function clearLandedWord(island) { const plaque=island.querySelector('.word-plaque');if(!plaque)return;plaque.setAttribute('aria-hidden','true');island.setAttribute('aria-label','Landing island');island.querySelectorAll('button').forEach(button=>button.remove());const motion=plaque.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 -18px'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:320,easing:'ease-out',fill:'forwards'});motion.finished.catch(()=>{}).then(()=>plaque.remove()); }
  async function moveNewAnchor(target) { const epoch=runEpoch,old=state.anchor;const left=target.offsetLeft/els.world.clientWidth*100,top=target.offsetTop/els.world.clientHeight*100;target.style.left=left+'%';target.style.top=top+'%';document.querySelectorAll('.landed-anchor').forEach(node=>{if(node!==target)node.remove();});target.classList.add('landed-anchor');target.removeAttribute('role');target.removeAttribute('tabindex');target.querySelectorAll('button').forEach(b=>b.remove());els.world.insertBefore(target,els.choices);state.anchor=target;if(old!==target)old.remove();els.choices.replaceChildren();groundPip(true);await camera.follow(target);if(epoch!==runEpoch)return;groundPip(true); }
  async function awardCorrect() {
    state.streak += 1; state.bestStreak = Math.max(state.bestStreak, state.streak); state.totalCorrect += 1;
    const base = 1; const hardBonus = state.includeAdverbs ? 1 : 0; const streakBonus = state.streak % 3 === 0 ? 1 : 0;
    const gain = (PipAdventure.mode==='learning'?1:base + hardBonus + streakBonus) * PipAdventure.settings(state.phase).multiplier; PipSupplies.earn(gain); state.score += 1; state.best = Math.max(state.best, state.score);
    await wardrobe.earn(1);
    store.write("best", state.best); store.write("bestStreak", state.bestStreak); store.write("totalCorrect", state.totalCorrect);
    PipAdventure.record(state.phase,state.score-state.stageStart); return { gain:PipAdventure.mode==='classic'?gain:1, streakBonus };
  }
  async function correctChoice(island) { const epoch=runEpoch; island.classList.add("correct"); clearLandedWord(island); const reward = await awardCorrect(); if(epoch!==runEpoch||!state.running)return; starReward(island,reward.gain); state.phaseScore += 1;updateBeacon(); sound.correct(); sound.coin(); burstAt(island); climbSky(); updateHud(); [...els.choices.querySelectorAll(".island")].filter(choice => choice !== island).forEach((choice, index) => { choice.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${-135 - index * 22}%, ${42 + index * 13}%)`, opacity: 0 }], { duration: 720, fill: "forwards", easing: "cubic-bezier(.35,.05,.8,.5)" }); }); await sleep(510);if(epoch!==runEpoch||!state.running)return; await moveNewAnchor(island); await sleep(140);if(epoch!==runEpoch||!state.running)return;newRound(); }
  async function bossCorrectChoice(island) {
    const epoch = runEpoch;
    if(!island||island.dataset.bossConsumed==='true'||island.dataset.bossLifecycle!=='active')return;
    island.dataset.bossConsumed='true';
    const pos = getPipPosition(island);
    const alreadyAtIsland = Math.abs(els.pip.offsetLeft - pos.left) < 6 && Math.abs(els.pip.offsetTop - pos.top) < 6;
    if (!alreadyAtIsland) {
      state.busy = true;
      setChoicesDisabled(true);
      await animatePipTo(island);
      if (epoch !== runEpoch || !state.running) return;
    }

    const profile = PipChallenge.checkpoint(PipAdventure.mode, state.phase, state.finaleStage);
    const previousAnchor = state.anchor;

    // 1. Mark island as landed and cleared so it cannot score again until refreshed
    island.classList.add("correct", "landed-anchor", "boss-cleared");
    clearLandedWord(island);
    island.querySelectorAll("button").forEach(b => b.disabled = true);
    state.anchor = island;

    // 2. Immediate hit and boss damage
    state.bossRemaining = Math.max(0, state.bossRemaining - 1);
    if (state.encounterHealth == null) state.encounterHealth = state.encounterHealthMax || profile.targetHits || 5;
    state.encounterHealth = Math.max(0, state.encounterHealth - 1);
    PipBossBattle.hit(state.encounterHealth, state.encounterHealthMax || profile.targetHits || 5);
    sound.correct();
    sound.coin();
    burstAt(island);
    const reward = await awardCorrect();
    if(epoch!==runEpoch||!state.running)return;
    starReward(island, reward.gain);
    updateHud();
    toast(state.bossRemaining ? `${state.bossRemaining} right island${state.bossRemaining === 1 ? '' : 's'} left` : (state.encounterHealth > 0 ? "Stage clear!" : "Boss calmed!"));

    // 3. Only after Pip safely lands on another island:
    // an island falls and respawns with a new word. Never remove Pip's current platform.
    if (previousAnchor && previousAnchor !== island && previousAnchor.isConnected) {
      if (previousAnchor.id === 'startIsland') {
        previousAnchor.style.display = 'none';
      } else {
        respawnBossIsland(previousAnchor,'landing');
      }
    }

    // 4. Progression check: fight continues until state.bossRemaining reaches 0!
    if (state.bossRemaining <= 0) {
      bossIslandScheduler.stop();
      if (PipAdventure.mode === 'classic' && state.phase === 5 && state.finaleStage < 2) {
        state.finaleStage++;
        await moveNewAnchor(island);
        if (epoch !== runEpoch) return;
        state.bossMode = false;
        await sleep(matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 350);
        await beginCheckpoint();
      } else {
        sound.stopBossEffects();
        PipBossBattle.defeat();
        els.game.classList.add('boss-won');
        updateBeacon(true);
        await speakBoss(profile, profile.defeat);
        if (epoch !== runEpoch) return;
        await completeCheckpoint();
      }
    } else {
      setPrompt(state.targetKind, true);
      state.busy = false;
      setChoicesDisabled(false);
    }
  }

  async function revealRightAnswers(){const right=[...els.choices.querySelectorAll('.island')].filter(node=>node.dataset.bossCorrect==='true');if(!right.length)return;right.forEach(node=>node.classList.add('answer-reveal'));const phrase=right.length===1?'This was the right word.':'These were the right words.';toast(phrase);els.announcer.textContent=phrase;await sleep(matchMedia('(prefers-reduced-motion: reduce)').matches?350:1400);}
  async function wrongChoice(island) { const epoch=runEpoch; state.streak = 0; island.classList.add("wrong"); els.pip.classList.add("panic"); const acceptedKinds = PipVocabulary.kindsFor(island.dataset.word); const uses = acceptedKinds.map(kind => `${article(kind)} ${kind}`).join(" or "); const phrase = `“${island.dataset.word}” can be ${uses}, not ${article(state.targetKind)} ${state.targetKind}.`; toast(phrase, true); els.announcer.textContent = phrase; await sleep(170); for (let i = 1; i <= 3; i++) { if(epoch!==runEpoch)return;island.classList.add(`crack-${i}`); sound.crack(i); await sleep(i === 3 ? 230 : 260); } if(epoch!==runEpoch)return;els.pip.classList.remove("panic"); if (PipSupplies.consumeShield()) { burstAt(island); toast("Cloud shield rescue!"); sound.correct(); await returnPipToAnchor();if(epoch!==runEpoch)return; if(state.bossMode) await respawnBossIsland(island,'wrong'); else island.remove();if(epoch!==runEpoch)return; state.busy = false; setChoicesDisabled(false); return; } sound.boom(); els.pip.classList.add("fall"); const distance = els.game.clientHeight * .72; const fallPip = els.pip.animate([{ transform: "translateY(0)" }, { transform: `translateY(${distance}px)` }], { duration: 720, fill: "forwards", easing: "cubic-bezier(.5,.1,.8,.7)" }); const fallIsland = island.animate([{ transform: "translateY(0) rotate(0)", opacity: 1 }, { transform: `translateY(${distance * .7}px) rotate(-18deg)`, opacity: 0 }], { duration: 660, fill: "forwards", easing: "ease-in" }); await Promise.all([fallPip.finished, fallIsland.finished]).catch(()=>{});if(epoch!==runEpoch)return; if(PipAdventure.mode==='classic' && !adminGodMode)state.hearts -= 1; updateHud(); fallPip.cancel(); fallIsland.cancel(); els.pip.classList.remove("fall"); if(state.bossMode) await respawnBossIsland(island,'wrong'); else island.remove();if(epoch!==runEpoch)return; if (state.hearts <= 0) { state.running = false; await revealRightAnswers();if(epoch!==runEpoch)return;await reviewWords(state.missedWords,{eyebrow:'Words to practise',title:'Let’s learn from that run',lastLabel:'Ready for another go'});if(epoch!==runEpoch)return;showResult(false); } else { await returnPipToAnchor();if(epoch!==runEpoch)return; state.busy = false; setChoicesDisabled(false); } }
  async function returnPipToAnchor() { const epoch=runEpoch; const end = getPipPosition(state.anchor); const start = { left: els.pip.offsetLeft, top: els.pip.offsetTop }; const dx = end.left - start.left; const dy = end.top - start.top;els.pip.classList.remove('face-left'); const motion = els.pip.animate([{ transform: "translate3d(0,0,0) scale(1)", opacity: 1 }, { transform: `translate3d(${dx * .52}px,${dy * .52 - els.game.clientHeight * .08}px,0) scale(.92)`, opacity: .78, offset: .52 }, { transform: `translate3d(${dx}px,${dy}px,0) scale(1)`, opacity: 1 }], { duration: 520, fill: "forwards", easing: "cubic-bezier(.16,1,.3,1)" }); await motion.finished.catch(()=>{});if(epoch!==runEpoch)return; els.pip.style.left = `${end.left}px`; els.pip.style.top = `${end.top}px`; motion.cancel(); els.pip.classList.add("flash"); burstAt(state.anchor); await sleep(260); els.pip.classList.remove("flash",'face-left'); }

  function reviewWords(source,{eyebrow,title,lastLabel}){const words=[...source],total=words.length;if(!total)return Promise.resolve();let index=0,meaningToken=0;const reviewEyebrow=document.getElementById('reviewEyebrow'),reviewTitle=document.getElementById('reviewTitle'),reviewDefinition=document.getElementById('reviewDefinition');return new Promise(resolve=>{const draw=()=>{const item=words[index],entry=PipVocabulary.get(item.phase,item.kind,item.word),token=++meaningToken;reviewEyebrow.textContent=eyebrow;reviewTitle.textContent=title;els.reviewProgress.textContent=`Word ${index+1} of ${total}`;els.reviewWord.textContent=item.word;els.reviewKind.textContent=item.kind;els.reviewImage.src=entry?.image||'';els.reviewImage.alt=`${item.word} — ${item.kind} picture`;reviewDefinition.textContent='Finding the meaning…';PipMeanings.get(item.word,item.kind).then(result=>{if(token===meaningToken)reviewDefinition.textContent=result?.definition||'Look at the picture and say what this word means.';});els.reviewNext.textContent=index===total-1?lastLabel:'Next word';els.reviewCard.classList.remove('review-pop');void els.reviewCard.offsetWidth;els.reviewCard.classList.add('review-pop');speak(item.word);};els.reviewNext.onclick=()=>{if(index<total-1){index++;draw();els.reviewNext.focus({preventScroll:true});return;}hideOverlay(els.checkpointReview);resolve();};draw();showOverlay(els.checkpointReview);els.reviewNext.focus({preventScroll:true});});}
  async function reviewCheckpointWords(){await reviewWords(state.checkpointWords,{eyebrow:'Beacon restored!',title:'Well done, word explorer!',lastLabel:'See my journey'});PipBossBattle.stop();els.game.classList.remove('boss-active','boss-moss','boss-kraken','boss-gale','boss-volcano');}
  async function completeCheckpoint() { const epoch=runEpoch,awardKey=practiceSession+':checkpoint:'+epoch+':'+state.phase;if(state.checkpointAwarded===awardKey)return;state.checkpointAwarded=awardKey;updateBeacon(true);state.busy = true; await wardrobe.earn(5,awardKey);if(epoch!==runEpoch)return;PipSupplies.earn(5); state.checkpoints += 1; store.write("checkpoints", state.checkpoints); sound.checkpoint(); updateHomeRecord(); PipAdventure.record(state.phase,state.score-state.stageStart,true); await reviewCheckpointWords();if(!state.running||epoch!==runEpoch)return; if (state.phase >= 5) { state.running = false; await announceBanner("SUMMIT CLEAR", "The islands are safe!", "Every beacon shines. You brought everyone home.", 2500); if(epoch===runEpoch)showResult(true); return; } await PipAdventure.checkpointStop(); if(!state.running||epoch!==runEpoch)return; await PipAdventure.chooseNext(state.phase); if(!state.running||epoch!==runEpoch)return; const nextPhase = state.phase + 1; state.stageStart=state.score; state.unlockedPhase = Math.max(state.unlockedPhase, nextPhase); state.selectedPhase = nextPhase; store.write("unlockedPhase", state.unlockedPhase); store.write("selectedPhase", nextPhase); state.phase = nextPhase; state.phaseScore = 0;state.checkpointWords=[];updateBeacon(); state.bossMode = false; state.previousKind = ""; state.anchor.classList.remove("checkpoint"); els.game.classList.remove("at-checkpoint"); els.choices.innerHTML = ""; resetAnchor(); const pos=getPipPosition(state.anchor); els.pip.style.left=pos.left+"px"; els.pip.style.top=pos.top+"px"; applyPhase(nextPhase); els.promptVerb.textContent = "Ready for"; els.targetWord.textContent = `Phase ${nextPhase}`; els.promptHelp.textContent = phaseDetails().message; buildTrail(); updatePhasePicker(); updateHud(); await announceBanner(`PHASE ${nextPhase} UNLOCKED`, phaseDetails().name, `The beacon shines! On to ${phaseDetails().name}.`, 2500); pipSay(`Welcome to ${phaseDetails().name}.`, 2100); await sleep(320);if(epoch!==runEpoch)return; newRound(); }
  async function handleChoice(island) { const epoch=runEpoch;if (island.classList.contains("boss-cleared") || !state.running || state.busy || island.getAttribute("aria-disabled") === "true") return; sound.ready(); closeWordHelper(); els.pip.classList.remove("engaged", "talking"); els.pipTalk.classList.remove("show"); state.busy = true; setChoicesDisabled(true); await animatePipTo(island);if(epoch!==runEpoch||!state.running)return;const wordPhase=PipAdventure.settings(state.phase).wordPhase,reviewKey=island.dataset.word+':'+island.dataset.kind;if(!state.checkpointWords.some(item=>item.key===reviewKey))state.checkpointWords.push({key:reviewKey,word:island.dataset.word,kind:island.dataset.kind,phase:wordPhase});const accepted=PipVocabulary.accepts(island.dataset.word,state.targetKind),right=state.bossMode?island.dataset.bossCorrect==='true':accepted;if(!right&&!state.missedWords.some(item=>item.key===reviewKey))state.missedWords.push({key:reviewKey,word:island.dataset.word,kind:island.dataset.kind,phase:wordPhase});practice.attempt(practiceId,island.dataset.word,state.targetKind,{correct:right,assisted:state.assisted.has(island.dataset.word+":"+state.targetKind),firstTry:!roundWrong});if(!right)roundWrong=true; if (state.bossMode) { if (right) await bossCorrectChoice(island); else await wrongChoice(island); } else if (accepted) await correctChoice(island); else await wrongChoice(island); groundPip(true); }

  function resetAnchor() { camera.reset();document.querySelectorAll(".landed-anchor").forEach(e=>e.remove());let start = document.getElementById("startIsland"); if (!start) { start = document.createElement("div"); start.id = "startIsland"; start.className = "island anchor"; start.setAttribute("aria-hidden", "true"); start.innerHTML = '<div class="island-inner"><img class="island-art" src="assets/wind-island-v2.webp" alt=""></div>'; els.world.insertBefore(start, els.choices); } start.className = "island anchor"; start.removeAttribute("style"); state.anchor = start; els.pip.getAnimations().forEach(a=>a.cancel()); els.pip.classList.remove("fall","panic","flash","airborne","glide","crouch","land",'face-left'); els.pip.removeAttribute("style"); }
  function startGame() { cancelRunMotion();selection.reset(); PipAdventure.resetRun(); PipAdventure.hideHub(); stopNarration();PipBossBattle.stop(); state.stageStart=0;state.checkpointWords=[];state.missedWords=[]; sound.ready(); sound.scene("flight"); hideOverlay(els.introOverlay); hideOverlay(els.storyOverlay); hideOverlay(els.resultOverlay); hideOverlay(els.shopOverlay); hideOverlay(els.dictionaryOverlay);hideOverlay(els.checkpointReview); closeWordHelper(); state.running = true; state.busy = false; state.score = 0; state.phaseScore = 0; state.phase = state.selectedPhase; state.hearts = 3; state.clues = 2; PipSupplies.reset(PipAdventure.mode); state.streak = 0; state.previousKind = ""; state.bossMode = false; state.bossRemaining = 0;state.finaleStage=0; els.game.classList.remove("run-won", "run-lost", "finale", "boss-active", "boss-moss", "boss-kraken", "boss-gale", "boss-volcano"); els.choices.innerHTML = ""; els.choices.className = ""; resetAnchor(); applyPhase(state.phase); buildTrail(); const startPosition = getPipPosition(state.anchor); els.pip.style.left = `${startPosition.left}px`; els.pip.style.top = `${startPosition.top}px`; updateHud();updateBeacon(); newRound(); }
  function showResult(success) { bossIslandScheduler.stop();PipBossBattle.stop();sound.scene(success?'village':'map');els.game.classList.remove('finale','boss-active','boss-moss','boss-kraken','boss-gale','boss-volcano','boss-waiting-islands'); els.game.classList.toggle("run-won", success); els.game.classList.toggle("run-lost", !success); els.resultPip.classList.toggle("success", success); els.resultPip.classList.toggle("failed", !success); els.resultEyebrow.textContent = success ? "All checkpoints clear" : "The wind caught Pip"; els.resultTitle.textContent = success ? "Wordwind champion!" : "Ready for another go?"; els.resultCopy.textContent = success ? "The last beacon shines! Pip has brought the villagers home, and the islands are settling safely." : `Pip reached Phase ${state.phase}. That route was tricky—but your personal best is waiting.`; els.resultScore.textContent = state.score; els.resultBest.textContent = state.best; els.resultCoins.textContent = state.coins; updateHomeRecord(); showOverlay(els.resultOverlay); }

  function updateShop() { const costs = { shield: 8, heart: 30, boots: 60 }; els.shopCoins.textContent = state.coins; const remaining = []; document.querySelectorAll(".buy-button").forEach(button => { const item = button.dataset.item; const owned = (item === "shield" && state.shield) || (item === "heart" && state.maxHearts >= 4) || (item === "boots" && state.boots); button.textContent = owned ? "Equipped" : `Get · ${costs[item]} ✦`; button.disabled = owned || state.coins < costs[item]; button.closest(".shop-item").classList.toggle("owned", owned); if (!owned) remaining.push(costs[item]); }); const next = remaining.length ? Math.min(...remaining) : 0; const progress = next ? Math.min(100, state.coins / next * 100) : 100; els.rewardFill.style.width = `${progress}%`; els.rewardMessage.textContent = next ? (state.coins >= next ? "An upgrade is ready!" : `${next - state.coins} stars to go`) : "Pack complete!"; }
  let shopReturnOverlay = null;
  function openShop() { PipAdventure.openShop(); }
  function closeShop() { hideOverlay(els.shopOverlay); if (shopReturnOverlay && !state.running) showOverlay(shopReturnOverlay); sound.scene(state.running ? "flight" : "flight"); shopReturnOverlay = null; }
  function buy(item) { if(!state.running||PipAdventure.mode!=='classic'||!PipSupplies.purchase(item,state))return false; sound.purchase();updateHud();return true; }
  function returnToPhaseChoice() { state.running = false; hideOverlay(els.resultOverlay); hideOverlay(els.shopOverlay); hideOverlay(els.dictionaryOverlay); els.game.classList.remove("run-won", "run-lost"); updatePhasePicker(); applyPhase(state.selectedPhase, true); PipAdventure.showHub(); }

  let dictionaryReturnOverlay = null;
  function renderDictionary() {
    els.dictionaryPhases.innerHTML = "";
    PHASE_ORDER.forEach(phase => { const button = document.createElement("button"); button.type = "button"; button.textContent = `Phase ${phase}`; button.className = phase === state.dictionaryPhase ? "active" : ""; button.setAttribute("aria-pressed", String(phase === state.dictionaryPhase)); button.addEventListener("click", () => { state.dictionaryPhase = phase; renderDictionary(); }); els.dictionaryPhases.appendChild(button); });
    document.querySelectorAll('#dictionaryKinds [data-kind]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.kind===document.getElementById('dictionaryKind').value)));const query = els.dictionarySearch.value.trim().toLowerCase(); els.dictionaryList.innerHTML = "";
    const labels = { noun: "Nouns", verb: "Verbs", adjective: "Adjectives", adverb: "Adverbs" };
    Object.entries(PHASES[state.dictionaryPhase].words).forEach(([kind, words]) => {
      if (document.getElementById("dictionaryKind").value && document.getElementById("dictionaryKind").value !== kind) return; const matches = words.filter(word => !query || word.includes(query)); if (!matches.length) return;
      const group = document.createElement("section"); group.className = `dictionary-group ${kind}`; group.innerHTML = `<h3>${labels[kind]} <span>${matches.length}</span></h3><div class="word-chips"></div>`;
      matches.forEach(word => { const button = document.createElement("button"); button.type = "button"; const progress=practice.get(word,kind);button.textContent = word+" "+"★".repeat(progress.stars)+"☆".repeat(3-progress.stars); button.setAttribute("aria-label", `See and hear ${word}, ${kind}, ${progress.stars} practice stars`); button.addEventListener("click", () => { if (word.toLowerCase() === "dog") registerDogAdminClick(); sound.clue(); showWordHelper(word,kind,state.dictionaryPhase); }); group.querySelector(".word-chips").appendChild(button); }); els.dictionaryList.appendChild(group);
    });
    if (!els.dictionaryList.children.length) els.dictionaryList.innerHTML = '<p class="dictionary-empty">No matching words.</p>';
  }

  let adminGodMode = false;
  let dogClickCount = 0;
  let dogClickTimer = null;

  function registerDogAdminClick() {
    dogClickCount++;
    clearTimeout(dogClickTimer);
    dogClickTimer = setTimeout(() => { dogClickCount = 0; }, 6000);
    if (dogClickCount >= 10) {
      dogClickCount = 0;
      sound.coin();
      if (els.wordHelper && els.wordHelper.classList.contains("show")) closeWordHelper();
      if (els.dictionaryOverlay && els.dictionaryOverlay.classList.contains("open")) hideOverlay(els.dictionaryOverlay);
      toast("🛠️ Secret Admin Panel Unlocked!");
      openAdminPanel();
    } else if (dogClickCount >= 5) {
      toast(`Admin unlock: ${dogClickCount}/10 clicks on “dog”`);
    }
  }

  function openAdminPanel() {
    if (els.wordHelper && els.wordHelper.classList.contains("show")) closeWordHelper();
    if (els.dictionaryOverlay && els.dictionaryOverlay.classList.contains("open")) hideOverlay(els.dictionaryOverlay);
    document.querySelectorAll('.scene-dialog').forEach(d => { d.hidden = true; d.classList?.remove('open'); });
    showOverlay(els.adminOverlay);
  }

  function closeAdminPanel() {
    hideOverlay(els.adminOverlay);
  }

  function initAdminPanel() {
    els.closeAdminButton?.addEventListener("click", closeAdminPanel);
    els.adminOverlay?.addEventListener("click", event => { if (event.target === els.adminOverlay) closeAdminPanel(); });

    // Phases 2-5 direct jump
    [2, 3, 4, 5].forEach(p => {
      document.getElementById(`adminPhase${p}`)?.addEventListener("click", () => {
        closeAdminPanel();
        startGame();
        state.selectedPhase = p;
        state.phase = p;
        applyPhase(p);
        toast(`Jumped to Phase ${p}`);
      });
    });

    // Boss Battles direct jump
    const bossMap = [
      { id: 'adminBossBramble', phase: 2, stage: 0, name: 'The Spore Bramble' },
      { id: 'adminBossKraken', phase: 3, stage: 0, name: 'The Cloud Kraken' },
      { id: 'adminBossGolem', phase: 4, stage: 0, name: 'The Gale Golem' },
      { id: 'adminBossChronos1', phase: 5, stage: 0, name: 'Chronos · Stage 1 (Nouns)' },
      { id: 'adminBossChronos2', phase: 5, stage: 1, name: 'Chronos · Stage 2 (Verbs)' },
      { id: 'adminBossChronos3', phase: 5, stage: 2, name: 'Chronos · Stage 3 (Adverbs)' }
    ];
    bossMap.forEach(b => {
      document.getElementById(b.id)?.addEventListener("click", async () => {
        closeAdminPanel();
        startGame();
        applyPhase(b.phase);
        state.finaleStage = b.stage;
        await beginCheckpoint();
        toast(`Started ${b.name}`);
      });
    });

    // Player State & Cheats
    document.getElementById("adminAddCoins")?.addEventListener("click", () => {
      wardrobe.earn(100);
      PipSupplies.earn(100);

      updateHud();
      toast("+100 Stars Added!");
    });

    document.getElementById("adminMaxHearts")?.addEventListener("click", () => {
      state.hearts = 3;
      updateHud();
      toast("Hearts Restored to 3/3");
    });

    document.getElementById("adminAddClues")?.addEventListener("click", () => {
      state.clues += 10;
      updateHud();
      toast("+10 Clues Added!");
    });

    document.getElementById("adminGodMode")?.addEventListener("click", () => {
      adminGodMode = !adminGodMode;
      const btn = document.getElementById("adminGodMode");
      if (btn) btn.textContent = `🛡️ God Mode: ${adminGodMode ? 'ON' : 'OFF'}`;
      toast(`God Mode ${adminGodMode ? 'Activated' : 'Deactivated'}`);
    });

    document.getElementById("adminInstaKill")?.addEventListener("click", async () => {
      if (!state.bossMode) {
        toast("No active boss encounter");
        return;
      }
      closeAdminPanel();
      state.bossRemaining = 0;
      state.encounterHealth = 0;
      PipBossBattle.defeat();
      els.game.classList.add('boss-won');
      updateBeacon(true);
      const profile = PipChallenge.checkpoint(PipAdventure.mode, state.phase, state.finaleStage);
      await speakBoss(profile, profile.defeat);
      await completeCheckpoint();
      toast("Boss Defeated!");
    });

    // Progression
    document.getElementById("adminUnlockAll")?.addEventListener("click", () => {
      state.unlockedPhase = 5;
      store.write("unlockedPhase", 5);
      updatePhasePicker();
      toast("All 5 phases unlocked!");
    });

    document.getElementById("adminMasterWords")?.addEventListener("click", () => {
      let count = 0;
      const pid = practiceId || ('admin_' + Date.now());
      [2, 3, 4, 5].forEach(ph => {
        if (!PHASES[ph]) return;
        Object.entries(PHASES[ph].words).forEach(([k, words]) => {
          words.forEach(w => {
            practice.attempt(pid, w, k, { correct: true, assisted: false, firstTry: true });
            practice.attempt(pid, w, k, { correct: true, assisted: false, firstTry: true });
            practice.attempt(pid, w, k, { correct: true, assisted: false, firstTry: true });
            count++;
          });
        });
      });
      renderDictionary();
      toast(`Mastered ${count} words with 3 stars!`);
    });

    document.getElementById("adminResetSave")?.addEventListener("click", () => {
      if (confirm("Reset all saved progress and high scores?")) {
        localStorage.clear();
        location.reload();
      }
    });

    // FX testing
    document.getElementById("adminAnimIdle")?.addEventListener("click", () => {
      PipBossBattle.setSpriteState('idle');
      toast("Sprite set to Idle");
    });
    document.getElementById("adminAnimAttack")?.addEventListener("click", () => {
      PipBossBattle.setSpriteState('attack');
      toast("Sprite set to Attack");
    });
    document.getElementById("adminAnimDefeat")?.addEventListener("click", () => {
      PipBossBattle.setSpriteState('defeat');
      toast("Sprite set to Defeat");
    });
    document.getElementById("adminTriggerHazard")?.addEventListener("click", () => {
      if (!state.bossMode) {
        toast("Enter a boss encounter first");
        return;
      }
      const profile = PipChallenge.checkpoint(PipAdventure.mode, state.phase, state.finaleStage);
      triggerBossHazard(profile);
      toast("Hazard triggered!");
    });
  }

  function openDictionary() { if(state.running){if(state.busy)return;toast('Use an island’s ? for a picture clue. The full word book is in the village.');return;} if (els.dictionaryOverlay.classList.contains("open")) { closeDictionary(); return; } dictionaryReturnOverlay = [els.introOverlay, els.storyOverlay, els.resultOverlay].find(overlay => overlay.classList.contains("open")) || null; if (dictionaryReturnOverlay) hideOverlay(dictionaryReturnOverlay); state.dictionaryPhase = state.running ? state.phase : state.selectedPhase; els.dictionarySearch.value = ""; renderDictionary(); showOverlay(els.dictionaryOverlay); }
  function closeDictionary() { hideOverlay(els.dictionaryOverlay); if (dictionaryReturnOverlay && !state.running) showOverlay(dictionaryReturnOverlay); dictionaryReturnOverlay = null; if(!state.running)PipAdventure.showHub('book'); groundPip(); }

  els.playButton.addEventListener("click", beginStory); els.againButton.addEventListener("click", startGame); els.choosePhaseButton.addEventListener("click", returnToPhaseChoice);
  els.shopButton.addEventListener("click", openShop); els.introShopButton.addEventListener("click", openShop); els.closeShopButton.addEventListener("click", closeShop); els.backToTrailButton.addEventListener("click", closeShop);
  els.dictionaryButton.addEventListener("click", openDictionary); els.introDictionaryButton.addEventListener("click", openDictionary); els.closeDictionaryButton.addEventListener("click", closeDictionary); els.dictionarySearch.addEventListener("input", renderDictionary); els.soundButton.addEventListener("click", () => sound.toggle());
  els.storyNextButton.addEventListener("click", advanceStory); els.storySkipButton.addEventListener("click", startGame); els.storyReplayButton.addEventListener("click", narrateStory); els.wordHelperClose.addEventListener("click", closeWordHelper);
  els.helperWord?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (els.helperWord.textContent.trim().toLowerCase() === "dog") registerDogAdminClick();
  });
  els.helperImage?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (els.helperWord.textContent.trim().toLowerCase() === "dog") registerDogAdminClick();
  });

  els.shopOverlay.addEventListener("click", event => { if (event.target === els.shopOverlay) closeShop(); });
  els.dictionaryOverlay.addEventListener("click", event => { if (event.target === els.dictionaryOverlay) closeDictionary(); });
  els.fullDictionaryLink.addEventListener("click", () => { const word = els.fullDictionaryLink.dataset.word || "word"; navigator.clipboard?.writeText(word).catch(() => {}); toast(`Opening the full dictionary for “${word}”.`); });
  document.addEventListener("keydown", event => { if (event.key !== "Escape") return; if (els.wordHelper.classList.contains("show")) closeWordHelper(); else if (els.shopOverlay.classList.contains("open")) closeShop(); else if (els.adminOverlay && els.adminOverlay.classList.contains("open")) closeAdminPanel(); else if (els.dictionaryOverlay.classList.contains("open")) closeDictionary(); });
  els.promptAudio.addEventListener("click", () => { sound.ready(); const prompt = state.bossMode ? `Find all the ${pluralKind(state.targetKind)}. ${state.bossRemaining} islands are right.` : `Land on ${article(state.targetKind)} ${state.targetKind}. ${KIND_HELP[state.targetKind]}.`; speak(prompt); });
  document.querySelectorAll(".buy-button").forEach(button => button.addEventListener("click", () => buy(button.dataset.item)));
  document.querySelectorAll(".phase-choice").forEach(button => button.addEventListener("click", () => { const phase = Number(button.dataset.phase); if (phase > state.unlockedPhase) return; state.selectedPhase = phase; store.write("selectedPhase", phase); updatePhasePicker(); applyPhase(phase, true); }));
  document.querySelectorAll(".difficulty-choice").forEach(button => button.addEventListener("click", () => { state.includeAdverbs = button.dataset.difficulty === "hard"; store.write("includeAdverbs", state.includeAdverbs); updateDifficultyPicker(); }));


  document.querySelectorAll('#dictionaryKinds [data-kind]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('dictionaryKind').value=button.dataset.kind;renderDictionary();}));
  document.getElementById('helperReplay').addEventListener('click',narrateHelp);
  for (const [id,delta] of [['helperPrev',-1],['helperNext',1]]) document.getElementById(id).addEventListener('click',()=>{ const c=showWordHelper.current; if(!c)return; const list=PHASES[c.phase].words[c.kind]; const word=list[(list.indexOf(c.word)+delta+list.length)%list.length]; const opener=showWordHelper.opener; showWordHelper(word,c.kind,c.phase); showWordHelper.opener=opener; });
  els.wordHelper.addEventListener('keydown',event=>{ if(event.key!=='Tab')return; const items=[...els.wordHelper.querySelectorAll('button,a[href]')].filter(e=>!e.hidden&&!e.disabled); const first=items[0],last=items.at(-1); if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();} else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();} });
  const originalCorrect=sound.correct.bind(sound);sound.correct=()=>{originalCorrect();if(wardrobe.equipped.chime==='chime')sound.tone(1046,.18,'sine',.05,.1);};

  function starReward(island,gain){const node=document.createElement('div');node.className='reward-flight';node.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 3 6 13 15 2-11 11 3 15-13-7-13 7 3-15L3 18l15-2Z"/></svg><b>+'+gain+'</b>';const a=island.getBoundingClientRect(),g=els.game.getBoundingClientRect(),h=els.coinText.getBoundingClientRect();node.style.left=(a.left-g.left+a.width/2)+'px';node.style.top=(a.top-g.top)+'px';els.particles.append(node);const motion=node.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate(0,-65px)',opacity:1,offset:.45},{transform:'translate('+(h.left-a.left-a.width/2)+'px,'+(h.top-a.top)+'px) scale(.3)',opacity:0}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?150:1100,easing:'ease-in',fill:'forwards'});motion.finished.finally(()=>node.remove());}
  document.getElementById('helperReveal').onclick=()=>{const c=showWordHelper.current;if(!c||state.clues<=0||!state.running)return;const key=c.phase+':'+c.kind+':'+c.word;if(!state.revealed.has(key)){state.clues--;state.revealed.add(key);}const opener=showWordHelper.opener;showWordHelper(c.word,c.kind,c.phase);showWordHelper.opener=opener;updateHud();};
  PipAdventure.attach({wardrobe,practice,openPracticeWord:(word,phase)=>{const entry=PipVocabulary.entries.find(e=>e.word===word&&e.phase===phase)||PipVocabulary.entries.find(e=>e.word===word);if(entry){openDictionary();showWordHelper(word,entry.kind,entry.phase);}},cancelRun:cancelRunMotion,previewSound:()=>{if(state.audioOn){sound.ready();sound.tone(1046,.18,'sine',.05,.1);}},stock:()=>PipSupplies.stock(state),purchase:id=>buy(id),supplies:PipSupplies,state,stopVoice:stopNarration,ground:groundPip,refresh:()=>{updatePhasePicker();updateHud();},beginStory,toggleSound:()=>sound.toggle(),openBook:openDictionary,openShop,hideMenus:()=>{closeWordHelper();for(const overlay of [els.introOverlay,els.storyOverlay,els.resultOverlay,els.dictionaryOverlay,els.shopOverlay])hideOverlay(overlay);}});
  window.PipAdmin = { open: openAdminPanel, close: closeAdminPanel, registerDogClick: registerDogAdminClick };
  initAdminPanel();
  buildTrail(); updatePhasePicker(); updateSoundButton(); applyPhase(state.selectedPhase, true); updateHud();
  const assets = ["assets/wind-garden-bg-v2.webp", "assets/wind-island-v2.webp", "assets/journey/beacon-tower.webp", "assets/journey/pip-walk.webp", "assets/journey/ui/go-play-v2.webp", "assets/pip-sprite-atlas-v4.webp", "assets/pip-phase3-rainfinder-atlas-v2.webp", "assets/pip-phase4-windrider-atlas-v2.webp", "assets/pip-phase5-starpilot-atlas-v2.webp"];
  Promise.all(assets.map(src => new Promise(resolve => { const image = new Image(); image.onload = image.onerror = resolve; image.src = src; }))).then(() => { hideOverlay(els.loadingOverlay); PipAdventure.showHub(); });
})();
