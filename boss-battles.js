/* Upgraded boss presentation, circular countdown, persistent health, and sprite animations. */
window.PipBossBattle = (() => {
  'use strict';
  let root, nameNode, stageNode, fillNode, liveNode, spriteNode, imgNode, timerCircle, secondsNode, timerProgress, orbitNode;
  let timer, deadline, duration, pausedRemaining = 0, profile, onExpire, encounterTotal = 5, currentHitsLeft = 5;

  const ASSET_MAP = {
    'moss': 'spore-bramble',
    'kraken': 'cloud-kraken',
    'gale': 'gale-golem',
    'volcano': 'void-chronos'
  };

  function mount(node) {
    root = node;
    nameNode = root.querySelector('.boss-name');
    stageNode = root.querySelector('.boss-stage');
    fillNode = root.querySelector('.urgency-fill');
    liveNode = root.querySelector('.boss-live');
    spriteNode = root.querySelector('.boss-sprite');

    if (!root.querySelector('.boss-img')) {
      imgNode = document.createElement('img');
      imgNode.className = 'boss-img';
      imgNode.alt = '';
      imgNode.onerror = () => { root.classList.remove('has-sprite'); };
      spriteNode.prepend(imgNode);
    } else {
      imgNode = root.querySelector('.boss-img');
    }

    if (!root.querySelector('.boss-timer-circle')) {
      const circleWrap = document.createElement('div');
      circleWrap.className = 'boss-timer-circle';
      circleWrap.setAttribute('role', 'timer');
      circleWrap.setAttribute('aria-label', 'Boss attack timer');
      circleWrap.innerHTML = `
        <svg viewBox="0 0 60 60" class="timer-svg" aria-hidden="true">
          <circle class="timer-bg" cx="30" cy="30" r="25"></circle>
          <circle class="timer-ring" cx="30" cy="30" r="25"></circle>
        </svg>
        <span class="timer-seconds">--</span>
      `;
      const targetWrap = root.querySelector('.boss-meter-wrap') || root.querySelector('.boss-top-hud') || root;
      targetWrap.appendChild(circleWrap);
    }
    timerCircle = root.querySelector('.boss-timer-circle');
    secondsNode = root.querySelector('.timer-seconds');
    timerProgress = root.querySelector('.timer-ring');
    orbitNode = root.querySelector('.timer-orbit-tracker');
    if (!orbitNode && timerCircle) {
      orbitNode = document.createElement('div');
      orbitNode.className = 'timer-orbit-tracker';
      orbitNode.setAttribute('aria-hidden', 'true');
      orbitNode.innerHTML = `
        <span class="timer-sprite-runner">
          <svg viewBox="0 0 24 24" class="timer-sprite-svg" aria-hidden="true">
            <circle class="timer-sprite-glow" cx="12" cy="12" r="8"></circle>
            <path class="timer-sprite-spark" d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"></path>
            <circle class="timer-sprite-core" cx="12" cy="12" r="3.5"></circle>
          </svg>
        </span>
      `;
      timerCircle.appendChild(orbitNode);
    }
  }

  function announce(message) {
    if (liveNode) liveNode.textContent = message;
  }

  function setSpriteState(category = 'idle') {
    if (!profile || !imgNode) return;
    const assetFolder = profile.assetId || ASSET_MAP[profile.theme] || 'cloud-kraken';
    const src = `assets/bosses/${assetFolder}/${category}/frame-01.png`;
    imgNode.src = src;
    imgNode.onload = () => { root.classList.add('has-sprite'); };
    root.dataset.animState = category;
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function drawTimer() {
    if (!root || !deadline) return;
    const remaining = Math.max(0, deadline - performance.now());
    const ratio = duration ? remaining / duration : 0;
    const secs = Math.ceil(remaining / 1000);

    if (fillNode) fillNode.style.transform = `scaleX(${ratio})`;

    if (timerProgress) {
      const circumference = 2 * Math.PI * 25; // ~157.08
      const offset = circumference * (1 - ratio);
      timerProgress.style.strokeDashoffset = String(offset);
      timerProgress.style.strokeDasharray = String(circumference);
    }
    if (secondsNode) secondsNode.textContent = String(secs);
    if (orbitNode) {
      const angle = (1 - ratio) * 360;
      orbitNode.style.transform = `rotate(${angle.toFixed(1)}deg)`;
    }

    root.classList.toggle('boss-warning', ratio <= 0.32);
    if (timerCircle) {
      timerCircle.classList.toggle('warning', ratio <= 0.32);
      timerCircle.classList.toggle('critical', ratio <= 0.15);
      timerCircle.setAttribute('aria-label', `Boss attacks in ${secs} seconds`);
    }

    if (remaining > 0) return;
    stopTimer();
    root.classList.add('boss-attacking');
    setSpriteState('attack');
    announce(profile.attack);

    Promise.resolve(onExpire?.(profile)).finally(() => {
      setTimeout(() => {
        root?.classList.remove('boss-attacking');
        setSpriteState('idle');
        if (root?.classList.contains('active')) resetTimer();
      }, 750);
    });
  }

  function resetTimer() {
    if (!profile || !root?.classList.contains('active')) return;
    stopTimer();
    duration = profile.timerMs;
    deadline = performance.now() + duration;
    pausedRemaining = 0;
    if (fillNode) fillNode.style.transform = 'scaleX(1)';
    if (orbitNode) orbitNode.style.transform = 'rotate(0deg)';
    root.classList.remove('boss-warning');
    if (timerCircle) timerCircle.classList.remove('warning', 'critical');
    timer = setInterval(drawTimer, 100);
    drawTimer();
  }

  function start(nextProfile, callbacks = {}) {
    profile = nextProfile;
    onExpire = callbacks.onExpire;
    encounterTotal = profile.targetHits || 5;
    if (callbacks.preserveHealth !== true || currentHitsLeft <= 0) {
      currentHitsLeft = encounterTotal;
    }

    root.hidden = false;
    root.dataset.boss = profile.theme;
    root.className = 'boss-container active boss-entering';
    root.setAttribute('aria-label', `${profile.name}, checkpoint boss`);
    nameNode.textContent = profile.name;
    stageNode.textContent = profile.stages > 1 ? `Stage ${profile.stage + 1} of ${profile.stages} · ${profile.label}` : 'Checkpoint battle';

    setSpriteState('idle');
    setHealth(currentHitsLeft, encounterTotal);
    announce(profile.intro);

    setTimeout(() => root?.classList.remove('boss-entering'), 1000);
    if (callbacks.autostart !== false) {
      if (callbacks.preserveTimer && deadline && deadline > performance.now()) {
        // Keep running existing timer
      } else {
        resetTimer();
      }
    }
  }

  function setHealth(remaining, total = encounterTotal) {
    if (!root) return;
    currentHitsLeft = remaining;
    encounterTotal = total;
    const healthFill = root.querySelector('.boss-health-fill');
    if (healthFill) {
      const ratio = Math.max(0, Math.min(1, remaining / Math.max(1, total)));
      healthFill.style.transform = `scaleX(${ratio})`;
    }
  }

  function hit(remaining, total = encounterTotal) {
    setHealth(remaining, total);
    root.classList.remove('boss-hit');
    void root.offsetWidth;
    root.classList.add('boss-hit');
    announce(remaining ? `${remaining} hit${remaining === 1 ? '' : 's'} left to calm` : `${profile.name} is calm`);
    setTimeout(() => {
      root?.classList.remove('boss-hit');
      if (remaining > 0) setSpriteState('idle');
    }, 500);
    resetTimer();
  }

  function defeat() {
    if (!root) return;
    stopTimer();
    root.classList.remove('boss-warning', 'boss-attacking');
    root.classList.add('boss-defeated');
    setSpriteState('defeat');
    setHealth(0, encounterTotal);
    announce(profile?.defeat || 'The sky is calm again.');
  }

  function stop() {
    stopTimer();
    profile = null;
    deadline = 0;
    pausedRemaining = 0;
    if (!root) return;
    root.className = 'boss-container';
    root.hidden = true;
    root.removeAttribute('data-boss');
    root.removeAttribute('aria-label');
  }

  function pause() {
    if (timer && deadline) {
      pausedRemaining = Math.max(0, deadline - performance.now());
      stopTimer();
    }
  }

  function resume(preserve = false) {
    if (profile && root?.classList.contains('active')) {
      if (pausedRemaining > 0) {
        duration = profile.timerMs;
        deadline = performance.now() + pausedRemaining;
        pausedRemaining = 0;
        timer = setInterval(drawTimer, 100);
        drawTimer();
      } else if (!preserve || !deadline || deadline <= performance.now()) {
        resetTimer();
      }
    }
  }

  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());

  return { mount, start, resetTimer, hit, defeat, stop, pause, resume, announce, setSpriteState, setHealth };
})();
