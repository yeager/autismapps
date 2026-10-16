<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t, locale, pick } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const PERIODS_SE = [
    { id: 'assembly', icon: '👋', time: '08:00' },
    { id: 'swedish', icon: '📖', time: '08:30' },
    { id: 'math', icon: '🔢', time: '09:15' },
    { id: 'break1', icon: '🏃', time: '10:00' },
    { id: 'english', icon: '🇬🇧', time: '10:30' },
    { id: 'lunch', icon: '🍽️', time: '11:30' },
    { id: 'art', icon: '🎨', time: '12:30' },
    { id: 'science', icon: '🔬', time: '13:15' },
    { id: 'break2', icon: '🏃', time: '14:00' },
    { id: 'pe', icon: '⚽', time: '14:15' },
    { id: 'home', icon: '🏠', time: '15:00' },
  ];

  // Brazilian morning shift (turno da manhã)
  const PERIODS_BR = [
    { id: 'assembly', icon: '👋', time: '07:00' },
    { id: 'portuguese', icon: '📖', time: '07:10' },
    { id: 'math', icon: '🔢', time: '08:00' },
    { id: 'science', icon: '🔬', time: '08:50' },
    { id: 'snack', icon: '🍎', time: '09:40' },
    { id: 'history_geography', icon: '🌎', time: '10:00' },
    { id: 'english', icon: '🔤', time: '10:50' },
    { id: 'art', icon: '🎨', time: '11:40' },
    { id: 'pe', icon: '⚽', time: '12:20' },
    { id: 'home', icon: '🏠', time: '13:00' },
  ];

  const PERIODS = $derived(pick({ sv: PERIODS_SE, en: PERIODS_SE, pt_BR: PERIODS_BR }, $locale));

  let completed = $state<Record<string, boolean>>({});
  let now = $state('');

  function updateNow() {
    const d = new Date();
    now = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  updateNow();

  function toggle(id: string) {
    completed = { ...completed, [id]: !completed[id] };
    if (completed[id]) speak(`${$t(`schoolDay.period.${id}`)} ✅`);
  }

  let currentIdx = $derived(PERIODS.findLastIndex(p => p.time <= now));
</script>

<WelcomeDialog appId="school-day" titleKey="app.school_day" purposeKey="welcome.schoolDay.purpose" howKey="welcome.schoolDay.how" goalKey="welcome.schoolDay.goal" icon="🏫" />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">

    <h1>🏫 {$t('schoolDay.title')}</h1>

  </div>

    <div class="timeline">
      {#each PERIODS as period, i}
        <button
          class="period"
          class:current={i === currentIdx}
          class:done={completed[period.id]}
          class:past={i < currentIdx && !completed[period.id]}
          onclick={() => toggle(period.id)}
        >
          <span class="time">{period.time}</span>
          <span class="p-icon">{period.icon}</span>
          <span class="p-name">{$t(`schoolDay.period.${period.id}`)}</span>
          {#if completed[period.id]}<span class="check">✅</span>{/if}
          {#if i === currentIdx}<span class="now-badge">{$t('schoolDay.now')}</span>{/if}
        </button>
      {/each}
    </div>
  </main>
  <footer class="cr"><p>{$t('app.title.brand')} · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .timeline { display:flex; flex-direction:column; gap:.5rem; }
  .period { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:48px; text-align:left; position:relative; }
  .period.current { border-color:var(--accent,#2196f3); background:#e3f2fd; }
  .period.done { border-color:#4caf50; opacity:.7; }
  .period.past { opacity:.5; }
  .time { font-size:.85rem; color:var(--text-secondary); min-width:45px; font-weight:600; font-variant-numeric:tabular-nums; }
  .p-icon { font-size:1.5rem; }
  .p-name { flex:1; font-weight:500; font-size:1.05rem; }
  .check { font-size:1rem; }
  .now-badge { background:var(--accent,#2196f3); color:#fff; font-size:.7rem; font-weight:700; padding:.15rem .5rem; border-radius:8px; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
