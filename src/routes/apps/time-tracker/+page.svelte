<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const PRESETS = [
    { min: 5, icon: '🧹', key: 'timeTracker.preset.tidy' },
    { min: 10, icon: '📚', key: 'timeTracker.preset.homework' },
    { min: 15, icon: '🎮', key: 'timeTracker.preset.play' },
    { min: 20, icon: '🎨', key: 'timeTracker.preset.create' },
    { min: 2, icon: '🪥', key: 'timeTracker.preset.brush' },
    { min: 30, icon: '🏃', key: 'timeTracker.preset.exercise' },
  ];

  let running = $state(false);
  let totalSeconds = $state(0);
  let remaining = $state(0);
  let timer = null;
  let currentPreset = $state(null);
  let finished = $state(false);

  function start(preset) {
    currentPreset = preset;
    totalSeconds = preset.min * 60;
    remaining = totalSeconds;
    running = true;
    finished = false;
    speak(`${$t(preset.key)}: ${preset.min} ${$t('timeTracker.minutes')}`);
    tick();
  }

  function tick() {
    timer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        stop();
        finished = true;
        speak($t('timeTracker.timesUp'));
      }
    }, 1000);
  }

  function stop() {
    running = false;
    if (timer) { clearInterval(timer); timer = null; }
  }

  function reset() {
    stop();
    remaining = 0;
    currentPreset = null;
    finished = false;
  }

  let mins = $derived(Math.floor(remaining / 60));
  let secs = $derived(remaining % 60);
  let progress = $derived(totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0);
  let display = $derived(`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
</script>

<WelcomeDialog appId="time-tracker" titleKey="app.time_tracker" purposeKey="welcome.timeTracker.purpose" howKey="welcome.timeTracker.how" goalKey="welcome.timeTracker.goal" icon="⏱️" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => { stop(); goto(`${base}/`); }}>←</button>
    <h1>⏱️ {$t('timeTracker.title')}</h1>
  </header>

  <main class="cnt">
    {#if !currentPreset && !running}
      <h2>{$t('timeTracker.pickActivity')}</h2>
      <div class="grid">
        {#each PRESETS as p}
          <button class="card" onclick={() => start(p)}>
            <span class="ico">{p.icon}</span>
            <span class="nm">{$t(p.key)}</span>
            <span class="dur">{p.min} min</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="timer-display">
        <div class="circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" stroke-width="6"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke={finished ? '#4caf50' : '#2196f3'} stroke-width="6"
              stroke-dasharray="283" stroke-dashoffset={283 - (283 * progress / 100)}
              stroke-linecap="round" transform="rotate(-90 50 50)"/>
          </svg>
          <div class="timer-text">
            <span class="time-big">{display}</span>
            {#if currentPreset}<span class="preset-icon">{currentPreset.icon}</span>{/if}
          </div>
        </div>
      </div>

      {#if finished}
        <div class="done" in:fade>
          <p>🎉 {$t('timeTracker.timesUp')}</p>
          <button class="action-btn" onclick={reset}>🔄 {$t('timeTracker.newTimer')}</button>
        </div>
      {:else}
        <div class="controls">
          {#if running}
            <button class="action-btn pause" onclick={stop}>⏸️ {$t('timeTracker.pause')}</button>
          {:else}
            <button class="action-btn" onclick={tick}>▶️ {$t('timeTracker.resume')}</button>
          {/if}
          <button class="action-btn" onclick={reset}>⏹️ {$t('timeTracker.stop')}</button>
        </div>
      {/if}
    {/if}
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; }
  h2 { text-align:center; margin:.5rem 0 1rem; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.4rem; padding:1.25rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .ico { font-size:2rem; }
  .nm { font-weight:600; }
  .dur { font-size:.85rem; color:var(--text-secondary); }
  .timer-display { display:flex; justify-content:center; margin:2rem 0; }
  .circle { position:relative; width:220px; height:220px; }
  .circle svg { width:100%; height:100%; }
  .timer-text { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; }
  .time-big { font-size:2.5rem; font-weight:700; font-variant-numeric:tabular-nums; display:block; }
  .preset-icon { font-size:2rem; }
  .controls,.done { display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; }
  .action-btn { padding:.75rem 1.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.1rem; cursor:pointer; min-height:48px; }
  .pause { border-color:#ff9800; }
  .done p { font-size:1.5rem; font-weight:700; color:#4caf50; width:100%; text-align:center; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
