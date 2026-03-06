<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { TIMER_PRESETS } from '$lib/data/transition-helper';
  import { onDestroy } from 'svelte';

  let duration = $state(5); // minutes
  let remaining = $state(0); // seconds
  let running = $state(false);
  let finished = $state(false);
  let interval: ReturnType<typeof setInterval> | null = null;

  const totalSeconds = $derived(duration * 60);
  const progress = $derived(totalSeconds > 0 ? 1 - remaining / totalSeconds : 0);
  const progressColor = $derived(
    progress < 0.5 ? '#27AE60' : progress < 0.8 ? '#F1C40F' : '#E74C3C'
  );
  const minutes = $derived(Math.floor(remaining / 60));
  const seconds = $derived(remaining % 60);

  // SVG circle
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = $derived(circumference * (1 - progress));

  function start() {
    remaining = duration * 60;
    running = true;
    finished = false;
    speak($t('th.timer.start'));
    tick();
  }

  function tick() {
    interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
        finished = true;
        clearInterval(interval!);
        interval = null;
        playAlert();
        vibrate();
        speak($t('th.timer.timeUp'));
      }
    }, 1000);
  }

  function pause() {
    running = false;
    if (interval) { clearInterval(interval); interval = null; }
    speak($t('th.timer.pause'));
  }

  function resume() {
    running = true;
    speak($t('th.timer.resume'));
    tick();
  }

  function reset() {
    running = false;
    finished = false;
    remaining = 0;
    if (interval) { clearInterval(interval); interval = null; }
  }

  function playAlert() {
    try {
      const ctx = new AudioContext();
      // Gentle 3-note chime
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.4;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
        osc.start(startTime);
        osc.stop(startTime + 0.8);
      });
    } catch { /* Web Audio not available */ }
  }

  function vibrate() {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="visual-countdown">
  {#if !running && !finished && remaining === 0}
    <!-- Duration picker -->
    <h2>{$t('th.timer.selectTime')}</h2>
    <div class="presets">
      {#each TIMER_PRESETS as preset}
        <button
          class="preset-btn"
          class:active={duration === preset}
          onclick={() => { duration = preset; speak(`${preset} ${$t('th.timer.minutes')}`); }}
        >
          {preset} {$t('th.timer.min')}
        </button>
      {/each}
    </div>
    <button class="start-btn" onclick={start}>
      ▶ {$t('th.timer.start')}
    </button>
  {:else}
    <!-- Timer display -->
    <div class="timer-display">
      <svg viewBox="0 0 300 300" class="timer-svg">
        <!-- Background circle -->
        <circle cx="150" cy="150" r={radius} fill="none" stroke="var(--border, #e0e0e0)" stroke-width="14" />
        <!-- Progress circle -->
        <circle
          cx="150" cy="150" r={radius}
          fill="none"
          stroke={progressColor}
          stroke-width="14"
          stroke-linecap="round"
          stroke-dasharray={circumference}
          stroke-dashoffset={dashOffset}
          transform="rotate(-90 150 150)"
          style="transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease;"
        />
      </svg>
      <div class="timer-text" style="color: {progressColor}">
        {#if finished}
          <span class="timer-done">✓</span>
        {:else}
          <span class="timer-digits">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        {/if}
      </div>
    </div>

    <!-- Progress bar (mobile-friendly fallback) -->
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        style="width: {progress * 100}%; background: {progressColor};"
      ></div>
    </div>

    {#if finished}
      <div class="done-message">
        <p>🎉 {$t('th.timer.timeUp')}</p>
        <button class="action-btn" onclick={reset}>
          🔄 {$t('th.timer.reset')}
        </button>
      </div>
    {:else}
      <div class="timer-controls">
        {#if running}
          <button class="action-btn pause-btn" onclick={pause}>
            ⏸ {$t('th.timer.pause')}
          </button>
        {:else}
          <button class="action-btn resume-btn" onclick={resume}>
            ▶ {$t('th.timer.resume')}
          </button>
        {/if}
        <button class="action-btn reset-btn" onclick={reset}>
          ⏹ {$t('th.timer.reset')}
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .visual-countdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;
  }

  h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
  }

  .presets {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .preset-btn {
    padding: 14px 22px;
    border-radius: 16px;
    border: 2px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.15s ease;
  }

  .preset-btn.active {
    border-color: var(--primary, #3498DB);
    background: var(--primary, #3498DB);
    color: white;
    transform: scale(1.05);
  }

  .preset-btn:hover:not(.active) {
    border-color: var(--primary, #3498DB);
    background: var(--bg-hover, #e8f4fd);
  }

  .start-btn {
    padding: 16px 40px;
    border-radius: 20px;
    border: none;
    background: #27AE60;
    color: white;
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 44px;
    transition: transform 0.15s ease;
  }
  .start-btn:hover { transform: scale(1.05); }

  .timer-display {
    position: relative;
    width: 280px;
    height: 280px;
  }

  .timer-svg {
    width: 100%;
    height: 100%;
  }

  .timer-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer-digits {
    font-size: 3.5rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .timer-done {
    font-size: 4rem;
    font-weight: 800;
  }

  .progress-bar-track {
    width: 100%;
    max-width: 320px;
    height: 12px;
    border-radius: 6px;
    background: var(--bg-hover, #eee);
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.5s ease, background 0.5s ease;
  }

  .done-message {
    text-align: center;
  }

  .done-message p {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 16px;
  }

  .timer-controls {
    display: flex;
    gap: 12px;
  }

  .action-btn {
    padding: 14px 24px;
    border-radius: 16px;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    transition: transform 0.15s ease;
  }
  .action-btn:hover { transform: scale(1.05); }

  .pause-btn { background: #F1C40F; color: #333; }
  .resume-btn { background: #27AE60; color: white; }
  .reset-btn { background: var(--bg-hover, #eee); color: var(--text, #333); }

  @media (max-width: 480px) {
    .timer-display {
      width: 220px;
      height: 220px;
    }
    .timer-digits {
      font-size: 2.5rem;
    }
    .preset-btn {
      padding: 10px 16px;
      font-size: 1rem;
    }
  }
</style>
