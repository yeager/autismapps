<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  interface EnergyEntry {
    level: number;
    time: string;
  }

  const LEVELS = [
    { level: 1, emoji: '😴', color: '#3498DB', label: 'energy.level.1', strategies: 'energy.strat.1' },
    { level: 2, emoji: '😊', color: '#2ECC71', label: 'energy.level.2', strategies: 'energy.strat.2' },
    { level: 3, emoji: '😄', color: '#F1C40F', label: 'energy.level.3', strategies: 'energy.strat.3' },
    { level: 4, emoji: '😤', color: '#E67E22', label: 'energy.level.4', strategies: 'energy.strat.4' },
    { level: 5, emoji: '🤯', color: '#E74C3C', label: 'energy.level.5', strategies: 'energy.strat.5' },
  ];

  let currentLevel = $state<number | null>(null);
  let history = $state<EnergyEntry[]>([]);
  let showStrategies = $state(false);

  $effect(() => { loadData(); });

  async function loadData() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'energy-meter');
      if (data) {
        history = (data.history as EnergyEntry[]) || [];
        currentLevel = (data.currentLevel as number) || null;
      }
    }
  }

  async function save() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'energy-meter', { history, currentLevel });
  }

  function setLevel(lvl: number) {
    currentLevel = lvl;
    showStrategies = true;
    const info = LEVELS[lvl - 1];
    speak(`${$t(info.label)}`);

    // Add to history
    history = [...history, { level: lvl, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    if (history.length > 20) history = history.slice(-20);
    save();
  }

  function getLevelInfo(lvl: number) {
    return LEVELS[lvl - 1] || LEVELS[2];
  }

  function thermometerHeight(lvl: number): number {
    return (lvl / 5) * 100;
  }
</script>

<div class="energy-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('energy.title')}</h1>
  </header>

  <div class="content" transition:fade>
    <p class="instruction">{$t('energy.how_feeling')}</p>

    <div class="meter-area">
      <!-- Thermometer -->
      <div class="thermometer">
        <div class="thermo-track">
          {#each LEVELS.slice().reverse() as info}
            <button class="thermo-level"
              class:active={currentLevel === info.level}
              style="--lvl-color: {info.color}"
              onclick={() => setLevel(info.level)}>
              <span class="lvl-emoji">{info.emoji}</span>
              <span class="lvl-num">{info.level}</span>
            </button>
          {/each}
        </div>
        {#if currentLevel}
          <div class="thermo-fill" style="height: {thermometerHeight(currentLevel)}%; background: {getLevelInfo(currentLevel).color}"></div>
        {/if}
      </div>

      <!-- Current state -->
      {#if currentLevel && showStrategies}
        {@const info = getLevelInfo(currentLevel)}
        <div class="state-card" style="border-color: {info.color}">
          <span class="state-emoji">{info.emoji}</span>
          <h2 style="color: {info.color}">{$t(info.label)}</h2>
          <div class="strategies">
            <h3>{$t('energy.strategies')}</h3>
            <p>{$t(info.strategies)}</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- History -->
    {#if history.length > 0}
      <div class="history">
        <h3>{$t('energy.today')}</h3>
        <div class="history-row">
          {#each history as entry}
            {@const info = getLevelInfo(entry.level)}
            <div class="history-dot" style="background: {info.color}" title="{entry.time}: {entry.level}">
              <span class="dot-emoji">{info.emoji}</span>
              <span class="dot-time">{entry.time}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <footer class="credit">{$t('energy.credit')}</footer>
</div>

<style>
  .energy-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }

  .content { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .instruction { text-align: center; font-weight: 700; font-size: 1.1em; }

  .meter-area { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; justify-content: center; }

  .thermometer { position: relative; width: 80px; }
  .thermo-track { display: flex; flex-direction: column; gap: 4px; }
  .thermo-level {
    display: flex; align-items: center; gap: 8px; padding: 12px;
    border: 3px solid var(--border); border-radius: 16px;
    background: var(--bg-card); transition: all 0.15s; min-height: 48px;
  }
  .thermo-level:hover { border-color: var(--lvl-color); transform: scale(1.05); }
  .thermo-level.active { border-color: var(--lvl-color); background: color-mix(in srgb, var(--lvl-color) 15%, transparent); }
  .lvl-emoji { font-size: 1.5em; }
  .lvl-num { font-weight: 800; font-size: 1.1em; }

  .state-card {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 24px; background: var(--bg-card); border: 3px solid;
    border-radius: 20px; max-width: 300px; box-shadow: var(--shadow);
  }
  .state-emoji { font-size: 3em; }
  .state-card h2 { font-size: 1.3em; font-weight: 800; }
  .strategies { text-align: center; }
  .strategies h3 { font-size: 0.85em; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; }
  .strategies p { font-size: 0.9em; line-height: 1.5; }

  .history { width: 100%; max-width: 500px; }
  .history h3 { font-size: 0.9em; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; }
  .history-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .history-dot {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 6px 8px; border-radius: 12px; opacity: 0.8;
  }
  .dot-emoji { font-size: 1.2em; }
  .dot-time { font-size: 0.6em; color: white; font-weight: 600; }

  .thermo-fill { display: none; } /* simplified — using button-based meter instead */

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }

  @media (prefers-reduced-motion: reduce) {
    .thermo-level { transition: none; }
  }
</style>
