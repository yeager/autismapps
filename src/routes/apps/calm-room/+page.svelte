<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';

  type Activity = 'breathing' | 'pressure' | 'sounds' | 'colors' | 'grounding' | 'relaxation' | 'stress' | null;

  let activeActivity = $state<Activity>(null);

  // Breathing
  let breathPhase = $state<'inhale' | 'hold' | 'exhale'>('inhale');
  let breathCount = $state(0);
  let breathRunning = $state(false);
  let breathTimer: ReturnType<typeof setTimeout> | null = null;
  let breathScale = $state(1);

  const BREATH_PATTERNS = [
    { id: '4-7-8', label: 'calm.pattern_478', inhale: 4, hold: 7, exhale: 8 },
    { id: '4-4-4', label: 'calm.pattern_box', inhale: 4, hold: 4, exhale: 4 },
    { id: '3-0-6', label: 'calm.pattern_simple', inhale: 3, hold: 0, exhale: 6 },
    { id: '5-0-5', label: 'calm.pattern_calm', inhale: 5, hold: 0, exhale: 5 },
  ];
  let breathPattern = $state(BREATH_PATTERNS[0]);

  // Pressure
  let pressing = $state(false);
  let pressureSize = $state(80);

  // Sounds
  let activeSound = $state<string | null>(null);
  let audioCtx: AudioContext | null = null;
  let soundNodes: { osc?: OscillatorNode; gain?: GainNode; noise?: AudioBufferSourceNode }[] = [];

  // Stress level (from GTK4 lugnarummet)
  let stressLevel = $state(3);
  let showEmergency = $state(false);
  const STRESS_EMOJIS: Record<number, string> = { 1: '😊', 2: '🙂', 3: '😐', 4: '😕', 5: '😟', 6: '😰', 7: '😫', 8: '🤯', 9: '😭', 10: '💥' };

  // Colors
  let colorHue = $state(200);
  let colorRunning = $state(false);
  let colorInterval: ReturnType<typeof setInterval> | null = null;

  // Grounding
  let groundingStep = $state(0);
  const GROUNDING_STEPS = [
    { sense: '👀', count: 5, key: 'calm.grounding.see' },
    { sense: '👂', count: 4, key: 'calm.grounding.hear' },
    { sense: '✋', count: 3, key: 'calm.grounding.touch' },
    { sense: '👃', count: 2, key: 'calm.grounding.smell' },
    { sense: '👅', count: 1, key: 'calm.grounding.taste' }
  ];

  // Relaxation
  let relaxStep = $state(0);
  const RELAX_PARTS = ['calm.relax.feet', 'calm.relax.legs', 'calm.relax.stomach', 'calm.relax.hands', 'calm.relax.arms', 'calm.relax.shoulders', 'calm.relax.face'];

  const ACTIVITIES = [
    { id: 'breathing' as const, emoji: '🌬️', label: 'calm.breathing', color: '#87CEEB' },
    { id: 'pressure' as const, emoji: '🫂', label: 'calm.pressure', color: '#DDA0DD' },
    { id: 'sounds' as const, emoji: '🎵', label: 'calm.sounds', color: '#98D8C8' },
    { id: 'colors' as const, emoji: '🌈', label: 'calm.colors', color: '#FFD1DC' },
    { id: 'grounding' as const, emoji: '🌍', label: 'calm.grounding_title', color: '#C3B1E1' },
    { id: 'relaxation' as const, emoji: '🧘', label: 'calm.relaxation', color: '#FFDAB9' },
    { id: 'stress' as const, emoji: '📊', label: 'calm.stress_check', color: '#B0C4DE' }
  ];

  function selectActivity(a: Activity) {
    stopAll();
    activeActivity = a;
    if (a) speak($t(ACTIVITIES.find(x => x.id === a)!.label));
  }

  function stopAll() {
    breathRunning = false;
    if (breathTimer) clearTimeout(breathTimer);
    stopSound();
    colorRunning = false;
    if (colorInterval) clearInterval(colorInterval);
  }

  // Breathing 4-7-8
  function startBreathing() {
    breathRunning = true;
    breathCycle();
  }

  function breathCycle() {
    if (!breathRunning) return;
    const p = breathPattern;
    const countDown = (from: number, next: () => void) => {
      breathCount = from;
      if (from <= 0) { next(); return; }
      breathTimer = setTimeout(() => countDown(from - 1, next), 1000);
    };
    // Inhale
    breathPhase = 'inhale';
    breathScale = 1.6;
    breathCount = p.inhale;
    speak($t('calm.breathe_in'));
    countDown(p.inhale, () => {
      if (!breathRunning) return;
      if (p.hold > 0) {
        // Hold
        breathPhase = 'hold';
        breathCount = p.hold;
        speak($t('calm.hold'));
        countDown(p.hold, () => {
          if (!breathRunning) return;
          doExhale();
        });
      } else {
        doExhale();
      }
    });

    function doExhale() {
      breathPhase = 'exhale';
      breathScale = 1;
      breathCount = p.exhale;
      speak($t('calm.breathe_out'));
      countDown(p.exhale, () => { if (breathRunning) breathCycle(); });
    }
  }

  function stopBreathing() { breathRunning = false; if (breathTimer) clearTimeout(breathTimer); breathScale = 1; }

  // Pressure
  function pressDown() {
    pressing = true;
    const grow = () => {
      if (pressing && pressureSize < 250) {
        pressureSize += 2;
        requestAnimationFrame(grow);
      }
    };
    grow();
    try { navigator.vibrate?.(5000); } catch {}
  }
  function pressUp() { pressing = false; pressureSize = 80; try { navigator.vibrate?.(0); } catch {} }

  // Sounds (Web Audio API)
  function playSound(type: string) {
    stopSound();
    activeSound = type;
    audioCtx = new AudioContext();
    if (type === 'whitenoise') {
      const bufferSize = audioCtx.sampleRate * 5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.3;
      source.connect(gain);
      gain.connect(audioCtx.destination);
      source.start();
      soundNodes = [{ noise: source, gain }];
    } else if (type === 'rain') {
      // Brown noise for rain
      const bufferSize = audioCtx.sampleRate * 5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.4;
      source.connect(gain);
      gain.connect(audioCtx.destination);
      source.start();
      soundNodes = [{ noise: source, gain }];
    } else if (type === 'heartbeat') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 60;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      // Pulse pattern
      const pulse = () => {
        if (activeSound !== 'heartbeat' || !audioCtx) return;
        const now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        gain.gain.setValueAtTime(0, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        setTimeout(pulse, 800);
      };
      pulse();
      soundNodes = [{ osc, gain }];
    } else if (type === 'ocean') {
      // Filtered noise with LFO
      const bufferSize = audioCtx.sampleRate * 5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.1;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      const gain = audioCtx.createGain();
      gain.gain.value = 0.25;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      source.start();
      soundNodes = [{ noise: source, gain }];
    }
  }

  function stopSound() {
    activeSound = null;
    soundNodes.forEach(n => {
      try { n.osc?.stop(); } catch {}
      try { n.noise?.stop(); } catch {}
    });
    soundNodes = [];
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
  }

  // Colors
  function startColors() {
    colorRunning = true;
    colorInterval = setInterval(() => { colorHue = (colorHue + 0.5) % 360; }, 50);
  }
  function stopColors() { colorRunning = false; if (colorInterval) clearInterval(colorInterval); }

  // Grounding
  function nextGrounding() {
    if (groundingStep < GROUNDING_STEPS.length - 1) {
      groundingStep++;
      speak($t(GROUNDING_STEPS[groundingStep].key));
    }
  }
  function resetGrounding() { groundingStep = 0; }

  // Relaxation
  function nextRelax() {
    if (relaxStep < RELAX_PARTS.length - 1) {
      relaxStep++;
      speak($t(RELAX_PARTS[relaxStep]));
    }
  }
  function resetRelax() { relaxStep = 0; }
</script>

<WelcomeDialog appId="calm-room" titleKey="app.calm_room" purposeKey="welcome.calmRoom.purpose" howKey="welcome.calmRoom.how" goalKey="welcome.calmRoom.goal" icon="🧘" />

<div class="calm-page" style={activeActivity === 'colors' && colorRunning ? `background: hsl(${colorHue}, 60%, 85%)` : ''}>
  <header class="app-header">
    <button class="back-btn" onclick={() => activeActivity ? selectActivity(null) : goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('calm.title')}</h1>
  </header>

  {#if !activeActivity}
    <div class="activities-grid">
      {#each ACTIVITIES as act}
        <button class="activity-card" style="background: {act.color}20; border-color: {act.color}"
          onclick={() => selectActivity(act.id)}>
          <span class="act-emoji">{act.emoji}</span>
          <span class="act-label">{$t(act.label)}</span>
        </button>
      {/each}
    </div>
  {:else if activeActivity === 'breathing'}
    <div class="breath-area">
      {#if !breathRunning}
        <div class="pattern-selector">
          {#each BREATH_PATTERNS as p}
            <button
              class="pattern-btn"
              class:active={breathPattern.id === p.id}
              onclick={() => { breathPattern = p; }}
            >
              <span class="pattern-name">{$t(p.label)}</span>
              <span class="pattern-timing">{p.inhale}-{p.hold}-{p.exhale}</span>
            </button>
          {/each}
        </div>
      {/if}
      <div class="breath-circle" style="transform: scale({breathScale}); transition: transform {breathPhase === 'inhale' ? breathPattern.inhale + 's' : breathPhase === 'exhale' ? breathPattern.exhale + 's' : '0s'} ease-in-out">
        <span class="breath-text">{$t('calm.' + breathPhase)}</span>
        <span class="breath-count">{breathCount}</span>
      </div>
      {#if !breathRunning}
        <button class="calm-btn" onclick={startBreathing}>{$t('calm.start')}</button>
      {:else}
        <button class="calm-btn stop" onclick={stopBreathing}>{$t('calm.stop')}</button>
      {/if}
    </div>
  {:else if activeActivity === 'pressure'}
    <div class="pressure-area">
      <p class="pressure-hint">{$t('calm.hold_press')}</p>
      <button class="pressure-circle" style="width: {pressureSize}px; height: {pressureSize}px"
        onpointerdown={pressDown} onpointerup={pressUp} onpointerleave={pressUp}>
        <span>{pressing ? '🫂' : '👆'}</span>
      </button>
    </div>
  {:else if activeActivity === 'sounds'}
    <div class="sounds-area">
      <p>{$t('calm.choose_sound')}</p>
      <div class="sound-grid">
        {#each [
          { id: 'whitenoise', emoji: '📻', label: 'calm.sound.whitenoise' },
          { id: 'rain', emoji: '🌧️', label: 'calm.sound.rain' },
          { id: 'heartbeat', emoji: '💓', label: 'calm.sound.heartbeat' },
          { id: 'ocean', emoji: '🌊', label: 'calm.sound.ocean' }
        ] as sound}
          <button class="sound-card" class:active={activeSound === sound.id}
            onclick={() => activeSound === sound.id ? stopSound() : playSound(sound.id)}>
            <span class="sound-emoji">{sound.emoji}</span>
            <span>{$t(sound.label)}</span>
            {#if activeSound === sound.id}<span class="playing">♪</span>{/if}
          </button>
        {/each}
      </div>
    </div>
  {:else if activeActivity === 'colors'}
    <div class="colors-area">
      {#if !colorRunning}
        <button class="calm-btn" onclick={startColors}>{$t('calm.start')}</button>
      {:else}
        <button class="calm-btn stop" onclick={stopColors}>{$t('calm.stop')}</button>
      {/if}
    </div>
  {:else if activeActivity === 'grounding'}
    <div class="grounding-area">
      <div class="ground-card">
        <span class="ground-sense">{GROUNDING_STEPS[groundingStep].sense}</span>
        <h2>{$t(GROUNDING_STEPS[groundingStep].key)}</h2>
        <span class="ground-count">{GROUNDING_STEPS[groundingStep].count}</span>
      </div>
      <div class="ground-dots">
        {#each GROUNDING_STEPS as _, i}
          <div class="gdot" class:active={i <= groundingStep}></div>
        {/each}
      </div>
      <button class="calm-btn" onclick={nextGrounding} disabled={groundingStep >= GROUNDING_STEPS.length - 1}>
        {$t('calm.next')}
      </button>
      <button class="link-btn" onclick={resetGrounding}>{$t('calm.restart')}</button>
    </div>
  {:else if activeActivity === 'relaxation'}
    <div class="relax-area">
      <div class="relax-card">
        <span class="relax-emoji">🧘</span>
        <h2>{$t(RELAX_PARTS[relaxStep])}</h2>
        <p>{$t('calm.relax_instruction')}</p>
      </div>
      <div class="ground-dots">
        {#each RELAX_PARTS as _, i}
          <div class="gdot" class:active={i <= relaxStep}></div>
        {/each}
      </div>
      <button class="calm-btn" onclick={nextRelax} disabled={relaxStep >= RELAX_PARTS.length - 1}>
        {$t('calm.next')}
      </button>
      <button class="link-btn" onclick={resetRelax}>{$t('calm.restart')}</button>
    </div>
  {:else if activeActivity === 'stress'}
    <div class="stress-area">
      <h2>{$t('calm.how_stressed')}</h2>
      <div class="stress-emoji">{STRESS_EMOJIS[stressLevel] || '😐'}</div>
      <input type="range" min="1" max="10" step="1" bind:value={stressLevel} class="stress-slider" />
      <div class="stress-labels">
        <span>{$t('calm.stress_calm')}</span>
        <span>{$t('calm.stress_medium')}</span>
        <span>{$t('calm.stress_overload')}</span>
      </div>
      <p class="stress-advice">
        {#if stressLevel <= 3}
          {$t('calm.advice_low')}
        {:else if stressLevel <= 5}
          {$t('calm.advice_medium')}
        {:else if stressLevel <= 7}
          {$t('calm.advice_high')}
        {:else}
          {$t('calm.advice_critical')}
        {/if}
      </p>
      {#if stressLevel >= 7}
        <button class="emergency-btn" onclick={() => { showEmergency = true; speak($t('calm.you_are_safe')); }}>
          🆘 {$t('calm.need_help_now')}
        </button>
      {/if}
    </div>
  {/if}

  <!-- Emergency overlay -->
  {#if showEmergency}
    <div class="emergency-overlay" role="button" tabindex="-1" onclick={() => { showEmergency = false; }} onkeydown={(e) => { if (e.key === 'Escape') showEmergency = false; }}>
      <div class="emergency-card" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
        <h2>💙 {$t('calm.you_are_safe')}</h2>
        <p>{$t('calm.emergency_msg')}</p>
        <div class="emergency-actions">
          <button class="calm-btn" onclick={() => { showEmergency = false; selectActivity('breathing'); }}>
            🫁 {$t('calm.breathing')}
          </button>
          <button class="calm-btn" style="background: var(--border)" onclick={() => { showEmergency = false; }}>
            {$t('calm.im_ok')}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <footer class="credit">
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
  </footer>
</div>

<style>
  .calm-page {
    display: flex; flex-direction: column; min-height: 100dvh;
    transition: background 0.5s ease;
  }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: inherit; z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; }

  .activities-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px; padding: 20px; flex: 1;
  }
  .activity-card {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
    padding: 28px 16px; border: 2px solid; border-radius: 20px; transition: all 0.2s; min-height: 140px;
  }
  .activity-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
  .act-emoji { font-size: 2.5em; }
  .act-label { font-weight: 600; font-size: 1em; }

  /* Breathing */
  .pattern-selector { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; }
  .pattern-btn { padding: 0.5rem 1rem; border: 2px solid var(--border, #ddd); border-radius: 12px; background: var(--bg-card, #fff); cursor: pointer; text-align: center; min-height: 48px; display: flex; flex-direction: column; gap: 2px; }
  .pattern-btn.active { border-color: #87CEEB; background: #e0f4ff; }
  .pattern-name { font-weight: 600; font-size: 0.85rem; }
  .pattern-timing { font-size: 0.75rem; color: var(--text-secondary, #888); }
  .breath-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; padding: 20px; }
  .breath-circle {
    width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, #87CEEB, #B0E0E6);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
    box-shadow: 0 0 40px rgba(135,206,235,0.3);
  }
  .breath-text { font-size: 1.2em; font-weight: 700; color: #2C3E50; }
  .breath-count { font-size: 2.5em; font-weight: 800; color: #2C3E50; }

  /* Pressure */
  .pressure-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
  .pressure-hint { color: var(--text-muted); font-size: 1.1em; }
  .pressure-circle {
    border-radius: 50%; background: linear-gradient(135deg, #DDA0DD, #E6B0E6);
    display: flex; align-items: center; justify-content: center; font-size: 2em;
    transition: width 0.1s, height 0.1s; cursor: pointer; user-select: none;
    box-shadow: 0 0 30px rgba(221,160,221,0.3);
  }

  /* Sounds */
  .sounds-area { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .sound-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 400px; width: 100%; }
  .sound-card {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 24px 16px; border: 2px solid var(--border); border-radius: 16px;
    background: var(--bg-card); transition: all 0.2s; position: relative;
  }
  .sound-card.active { border-color: #27AE60; background: rgba(39,174,96,0.05); }
  .sound-emoji { font-size: 2em; }
  .sound-card span:not(.sound-emoji):not(.playing) { font-weight: 500; font-size: 0.9em; }
  .playing { position: absolute; top: 8px; right: 8px; color: #27AE60; animation: pulse 1s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

  /* Colors */
  .colors-area { flex: 1; display: flex; align-items: center; justify-content: center; }

  /* Grounding & Relaxation */
  .grounding-area, .relax-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 20px; }
  .ground-card, .relax-card { text-align: center; padding: 30px; background: var(--bg-card); border-radius: 20px; box-shadow: var(--shadow); }
  .ground-sense, .relax-emoji { font-size: 3em; }
  .ground-card h2, .relax-card h2 { font-size: 1.3em; margin: 10px 0; }
  .ground-count { font-size: 3em; font-weight: 800; color: #9B59B6; }
  .relax-card p { color: var(--text-muted); margin-top: 8px; }
  .ground-dots { display: flex; gap: 8px; }
  .gdot { width: 12px; height: 12px; border-radius: 50%; background: var(--border); transition: background 0.3s; }
  .gdot.active { background: #9B59B6; }

  .calm-btn {
    padding: 14px 40px; border-radius: 100px; font-weight: 700; font-size: 1.1em;
    background: #27AE60; color: white; border: none; transition: transform 0.15s;
  }
  .calm-btn.stop { background: #E74C3C; }
  .calm-btn:active { transform: scale(0.95); }
  .calm-btn:disabled { opacity: 0.4; }
  .link-btn { background: none; border: none; color: var(--text-muted); font-size: 0.9em; text-decoration: underline; }

  /* Stress check */
  .stress-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 20px; }
  .stress-emoji { font-size: 4em; transition: all 0.3s; }
  .stress-slider { width: 80%; max-width: 300px; height: 8px; accent-color: #3498DB; }
  .stress-labels { display: flex; justify-content: space-between; width: 80%; max-width: 300px; font-size: 0.75em; color: var(--text-muted); }
  .stress-advice { text-align: center; max-width: 300px; color: var(--text-muted); font-size: 0.95em; line-height: 1.5; }
  .emergency-btn {
    padding: 16px 32px; background: #E74C3C; color: white; border-radius: 100px;
    font-size: 1.2em; font-weight: 700; border: none; animation: emergencyPulse 2s infinite;
  }
  @keyframes emergencyPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(231,76,60,0.4); } 50% { box-shadow: 0 0 0 12px rgba(231,76,60,0); } }

  .emergency-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .emergency-card {
    background: var(--bg); border-radius: 20px; padding: 32px; max-width: 380px; text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .emergency-card h2 { font-size: 1.5em; margin-bottom: 12px; }
  .emergency-card p { color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }
  .emergency-actions { display: flex; gap: 10px; justify-content: center; }

  .credit { text-align: center; padding: 12px; font-size: 0.75em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) {
    .breath-circle { transition: none !important; }
    .playing { animation: none; }
  }
</style>
