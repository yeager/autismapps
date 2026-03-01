<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  let count = $state(0);
  let maxCount = $state(10);
  let items = $state<string[]>([]);

  const COUNTER_EMOJIS = ['🍎', '⭐', '🐟', '🌸', '🎈', '🦋', '🍊', '🐛', '🌻', '🔵'];

  function addOne() {
    if (count >= maxCount) return;
    count++;
    items = [...items, COUNTER_EMOJIS[(count - 1) % COUNTER_EMOJIS.length]];
    speak(String(count));
  }

  function removeOne() {
    if (count <= 0) return;
    count--;
    items = items.slice(0, -1);
    speak(String(count));
  }

  function reset() {
    count = 0;
    items = [];
  }

  function speakCount() {
    speak(String(count));
  }

  function setMax(n: number) {
    maxCount = n;
    reset();
  }
</script>

<WelcomeDialog appId="counting" titleKey="app.counting" purposeKey="welcome.counting.purpose" howKey="welcome.counting.how" goalKey="welcome.counting.goal" icon="🔢" />

<div class="counting-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto(`${base}/`)} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('counting.title')}</h1>
  </header>

  <div class="content" transition:fade>
    <div class="max-selector">
      {#each [5, 10, 20, 50] as n}
        <button class="max-btn" class:active={maxCount === n} onclick={() => setMax(n)}>{n}</button>
      {/each}
    </div>

    <div class="count-display">
      <button class="big-num" onclick={speakCount}>{count}</button>
      <span class="count-of">/ {maxCount}</span>
    </div>

    <div class="item-grid">
      {#each items as emoji, i}
        <span class="item" style="animation-delay: {i * 50}ms">{emoji}</span>
      {/each}
    </div>

    <div class="controls">
      <button class="ctrl minus" onclick={removeOne} disabled={count <= 0}>−</button>
      <button class="ctrl reset" onclick={reset}>🔄</button>
      <button class="ctrl plus" onclick={addOne} disabled={count >= maxCount}>+</button>
    </div>

    <div class="progress-bar">
      <div class="bar-fill" style="width: {maxCount > 0 ? (count / maxCount) * 100 : 0}%"></div>
    </div>
  </div>

  <footer class="credit">{$t('counting.credit')}</footer>
</div>

<style>
  .counting-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }

  .content { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }

  .max-selector { display: flex; gap: 8px; }
  .max-btn { padding: 8px 16px; border-radius: 100px; border: 2px solid var(--border); font-weight: 700; background: var(--bg-card); min-height: 40px; }
  .max-btn.active { border-color: #3498DB; background: rgba(52,152,219,0.1); }

  .count-display { display: flex; align-items: baseline; gap: 8px; }
  .big-num { font-size: 5em; font-weight: 900; background: none; border: none; color: #3498DB; font-variant-numeric: tabular-nums; }
  .count-of { font-size: 1.5em; color: var(--text-muted); font-weight: 600; }

  .item-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 400px; min-height: 60px; }
  .item { font-size: 2em; animation: popIn 0.2s ease; }
  @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

  .controls { display: flex; gap: 16px; }
  .ctrl { width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--border); font-size: 2em; font-weight: 800; background: var(--bg-card); }
  .ctrl.plus { border-color: #27AE60; color: #27AE60; }
  .ctrl.minus { border-color: #E74C3C; color: #E74C3C; }
  .ctrl.reset { font-size: 1.5em; }
  .ctrl:disabled { opacity: 0.3; }

  .progress-bar { width: 100%; max-width: 400px; height: 10px; background: var(--border); border-radius: 100px; overflow: hidden; }
  .bar-fill { height: 100%; background: #27AE60; border-radius: 100px; transition: width 0.3s; }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
  @media (prefers-reduced-motion: reduce) { .item { animation: none; } .bar-fill { transition: none; } }
</style>
