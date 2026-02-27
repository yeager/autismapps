<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';

  let duration = $state(5);
  let remaining = $state(0);
  let running = $state(false);
  let finished = $state(false);
  let interval: ReturnType<typeof setInterval> | null = null;
  let stars = $state(0);
  let fullscreen = $state(false);

  // First-Then
  let firstThenMode = $state(false);
  let firstQuery = $state('');
  let thenQuery = $state('');
  let firstPicto = $state<{ url: string; word: string } | null>(null);
  let thenPicto = $state<{ url: string; word: string } | null>(null);

  const PRESETS = [1, 2, 5, 10, 15, 30];

  const progress = $derived(duration > 0 ? 1 - remaining / (duration * 60) : 0);
  const progressColor = $derived(progress < 0.5 ? '#27AE60' : progress < 0.8 ? '#F1C40F' : '#E74C3C');
  const minutes = $derived(Math.floor(remaining / 60));
  const seconds = $derived(remaining % 60);
  const circumference = 2 * Math.PI * 140;
  const dashOffset = $derived(circumference * (1 - progress));

  function start() {
    remaining = duration * 60;
    running = true;
    finished = false;
    speak($t('timer.start'));
    interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
        finished = true;
        clearInterval(interval!);
        playChime();
        vibrate();
        stars++;
        speak($t('timer.done'));
      }
    }, 1000);
  }

  function pause() {
    running = false;
    if (interval) clearInterval(interval);
    speak($t('timer.pause'));
  }

  function resume() {
    running = true;
    interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
        finished = true;
        clearInterval(interval!);
        playChime();
        vibrate();
        stars++;
        speak($t('timer.done'));
      }
    }, 1000);
  }

  function reset() {
    running = false;
    finished = false;
    remaining = 0;
    if (interval) clearInterval(interval);
  }

  function playChime() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 523;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
      // Second chime
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 659;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc2.start();
        osc2.stop(ctx.currentTime + 1.5);
      }, 300);
    } catch {}
  }

  function vibrate() {
    try { navigator.vibrate?.([200, 100, 200, 100, 400]); } catch {}
  }

  async function searchFirst() {
    if (!firstQuery.trim()) return;
    const res = await searchPictograms(firstQuery, get(locale));
    if (res[0]) firstPicto = { url: res[0].url, word: firstQuery };
  }

  async function searchThen() {
    if (!thenQuery.trim()) return;
    const res = await searchPictograms(thenQuery, get(locale));
    if (res[0]) thenPicto = { url: res[0].url, word: thenQuery };
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      fullscreen = true;
    } else {
      document.exitFullscreen?.();
      fullscreen = false;
    }
  }
</script>

<WelcomeDialog appId="visual-timer" titleKey="app.visual_timer" purposeKey="welcome.visualTimer.purpose" howKey="welcome.visualTimer.how" goalKey="welcome.visualTimer.goal" icon="⏳" />

<div class="timer-page" class:fullscreen>
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('timer.title')}</h1>
    <div class="header-actions">
      <span class="star-count" aria-label="{stars} stars">⭐ {stars}</span>
      <button class="icon-btn" onclick={toggleFullscreen}>⛶</button>
    </div>
  </header>

  <div class="timer-body">
    <!-- First-Then Board -->
    {#if firstThenMode && (firstPicto || thenPicto)}
      <div class="first-then">
        <div class="ft-card first">
          <span class="ft-label">{$t('timer.first')}</span>
          {#if firstPicto}
            <img src={firstPicto.url} alt={firstPicto.word} width="80" height="80" />
            <span>{firstPicto.word}</span>
          {/if}
        </div>
        <span class="ft-arrow">→</span>
        <div class="ft-card then">
          <span class="ft-label">{$t('timer.then')}</span>
          {#if thenPicto}
            <img src={thenPicto.url} alt={thenPicto.word} width="80" height="80" />
            <span>{thenPicto.word}</span>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Timer Circle -->
    <div class="timer-circle">
      <svg viewBox="0 0 300 300" class="timer-svg">
        <circle cx="150" cy="150" r="140" fill="none" stroke="var(--border)" stroke-width="12" opacity="0.3" />
        <circle cx="150" cy="150" r="140" fill="none" stroke={progressColor} stroke-width="12"
          stroke-linecap="round" stroke-dasharray={circumference} stroke-dashoffset={dashOffset}
          transform="rotate(-90 150 150)" class="progress-ring" />
      </svg>
      <div class="timer-display">
        {#if finished}
          <span class="done-emoji">🎉</span>
          <span class="done-text">{$t('timer.done')}</span>
        {:else if running || remaining > 0}
          <span class="time-text">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        {:else}
          <span class="time-text">{duration}:00</span>
        {/if}
      </div>
    </div>

    <!-- Controls -->
    {#if !running && !finished && remaining === 0}
      <div class="presets">
        {#each PRESETS as p}
          <button class="preset-btn" class:active={duration === p} onclick={() => { duration = p; speak(p + ' ' + $t('timer.minutes')); }}>
            {p} {$t('timer.min')}
          </button>
        {/each}
      </div>

      <label class="ft-toggle">
        <input type="checkbox" bind:checked={firstThenMode} />
        <span>{$t('timer.first_then')}</span>
      </label>

      {#if firstThenMode}
        <div class="ft-search">
          <div class="ft-field">
            <span>{$t('timer.first')}:</span>
            <input type="text" bind:value={firstQuery} placeholder={$t('board.search_pictograms')} onkeydown={(e) => { if (e.key === 'Enter') searchFirst(); }} />
            <button onclick={searchFirst}>🔍</button>
          </div>
          <div class="ft-field">
            <span>{$t('timer.then')}:</span>
            <input type="text" bind:value={thenQuery} placeholder={$t('board.search_pictograms')} onkeydown={(e) => { if (e.key === 'Enter') searchThen(); }} />
            <button onclick={searchThen}>🔍</button>
          </div>
        </div>
      {/if}

      <button class="start-btn" onclick={start}>{$t('timer.start')}</button>
    {:else if running}
      <button class="pause-btn" onclick={pause}>{$t('timer.pause')}</button>
    {:else if !running && remaining > 0}
      <div class="paused-actions">
        <button class="start-btn" onclick={resume}>{$t('timer.resume')}</button>
        <button class="reset-btn" onclick={reset}>{$t('timer.reset')}</button>
      </div>
    {:else if finished}
      <button class="start-btn" onclick={reset}>{$t('timer.again')}</button>
    {/if}
  </div>

  <footer class="credit">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0</footer>
</div>

<style>
  .timer-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .timer-page.fullscreen { background: var(--bg); }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
  .star-count { font-size: 1em; font-weight: 600; }
  .icon-btn { width: 40px; height: 40px; font-size: 1.2em; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; }

  .timer-body { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 20px; gap: 20px; }

  .first-then { display: flex; align-items: center; gap: 12px; }
  .ft-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 12px 20px; border-radius: var(--radius); border: 2px solid var(--border); background: var(--bg-card);
  }
  .ft-label { font-size: 0.75em; font-weight: 700; text-transform: uppercase; }
  .first .ft-label { color: #3498DB; }
  .then .ft-label { color: #27AE60; }
  .ft-arrow { font-size: 2em; color: var(--text-muted); }
  .ft-card img { border-radius: 8px; }

  .timer-circle { position: relative; width: 280px; height: 280px; }
  .timer-svg { width: 100%; height: 100%; }
  .progress-ring { transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease; }
  .timer-display {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .time-text { font-size: 3.5em; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
  .done-emoji { font-size: 3em; }
  .done-text { font-size: 1.3em; font-weight: 700; color: #27AE60; }

  .presets { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .preset-btn {
    padding: 10px 20px; border-radius: 100px; border: 2px solid var(--border);
    font-weight: 600; font-size: 1em; transition: all 0.15s; background: var(--bg-card);
  }
  .preset-btn.active { background: #3498DB; color: white; border-color: #3498DB; }
  .preset-btn:hover:not(.active) { border-color: #3498DB; }

  .ft-toggle { display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; }
  .ft-toggle input { width: 20px; height: 20px; }

  .ft-search { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .ft-field { display: flex; align-items: center; gap: 6px; }
  .ft-field span { font-weight: 600; font-size: 0.85em; }
  .ft-field input { padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.9em; width: 140px; }
  .ft-field button { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-card); border: 1px solid var(--border); }

  .start-btn {
    padding: 16px 48px; border-radius: 100px; background: #27AE60; color: white;
    font-size: 1.2em; font-weight: 700; border: none; transition: transform 0.15s;
  }
  .start-btn:active { transform: scale(0.95); }
  .pause-btn {
    padding: 16px 48px; border-radius: 100px; background: #F1C40F; color: #333;
    font-size: 1.2em; font-weight: 700; border: none;
  }
  .reset-btn {
    padding: 16px 32px; border-radius: 100px; background: var(--bg-card);
    border: 2px solid var(--border); font-weight: 600;
  }
  .paused-actions { display: flex; gap: 10px; }

  .credit { text-align: center; padding: 12px; font-size: 0.75em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) { .progress-ring { transition: none; } }
</style>
