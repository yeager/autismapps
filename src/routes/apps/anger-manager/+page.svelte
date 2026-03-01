<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const LEVELS = [
    { id: 1, emoji: '😌', color: '#4caf50', label: 'angerManager.level.calm' },
    { id: 2, emoji: '😐', color: '#8bc34a', label: 'angerManager.level.ok' },
    { id: 3, emoji: '😤', color: '#ff9800', label: 'angerManager.level.annoyed' },
    { id: 4, emoji: '😡', color: '#f44336', label: 'angerManager.level.angry' },
    { id: 5, emoji: '🤯', color: '#b71c1c', label: 'angerManager.level.furious' },
  ];

  const STRATEGIES = [
    { icon: '🫁', key: 'angerManager.strat.breathe' },
    { icon: '🔢', key: 'angerManager.strat.count' },
    { icon: '🚶', key: 'angerManager.strat.walk' },
    { icon: '💧', key: 'angerManager.strat.water' },
    { icon: '🧸', key: 'angerManager.strat.squeeze' },
    { icon: '🎵', key: 'angerManager.strat.music' },
    { icon: '✏️', key: 'angerManager.strat.draw' },
    { icon: '🗣️', key: 'angerManager.strat.talk' },
  ];

  let selected = $state(null);
  let showStrategies = $state(false);

  function selectLevel(level) {
    selected = level;
    speak($t(level.label));
    showStrategies = level.id >= 3;
  }

  function useStrategy(s) {
    speak($t(s.key));
  }
</script>

<WelcomeDialog appId="anger-manager" titleKey="app.anger_manager" purposeKey="welcome.angerManager.purpose" howKey="welcome.angerManager.how" goalKey="welcome.angerManager.goal" icon="🌡️" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)}>←</button>
    <h1>🌋 {$t('angerManager.title')}</h1>
  </header>

  <main class="cnt">
    <h2>{$t('angerManager.howAngry')}</h2>
    <div class="thermometer">
      {#each LEVELS as level}
        <button
          class="level"
          class:active={selected?.id === level.id}
          style="--lc: {level.color}"
          onclick={() => selectLevel(level)}
        >
          <span class="level-emoji">{level.emoji}</span>
          <span class="level-label">{$t(level.label)}</span>
          <div class="level-bar"></div>
        </button>
      {/each}
    </div>

    {#if showStrategies}
      <div class="strategies" in:fade>
        <h2>{$t('angerManager.tryThis')}</h2>
        <div class="strat-grid">
          {#each STRATEGIES as s}
            <button class="strat-card" onclick={() => useStrategy(s)}>
              <span class="strat-icon">{s.icon}</span>
              <span class="strat-text">{$t(s.key)}</span>
            </button>
          {/each}
        </div>
      </div>
    {:else if selected && selected.id < 3}
      <div class="positive" in:fade>
        <span class="big">⭐</span>
        <p>{$t('angerManager.doingGreat')}</p>
      </div>
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
  .thermometer { display:flex; flex-direction:column-reverse; gap:.5rem; }
  .level { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:48px; position:relative; overflow:hidden; }
  .level.active { border-color:var(--lc); }
  .level-bar { position:absolute; left:0; top:0; bottom:0; width:6px; background:var(--lc); }
  .level-emoji { font-size:2rem; }
  .level-label { font-weight:600; font-size:1.1rem; flex:1; }
  .strat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
  .strat-card { display:flex; align-items:center; gap:.75rem; padding:1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .strat-card:hover { border-color:var(--accent,#2196f3); }
  .strat-icon { font-size:1.8rem; }
  .strat-text { font-weight:500; text-align:left; }
  .positive { text-align:center; padding:2rem; }
  .big { font-size:4rem; display:block; }
  .positive p { font-size:1.3rem; font-weight:600; color:#4caf50; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
