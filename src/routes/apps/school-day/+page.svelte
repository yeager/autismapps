<script>
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const PERIODS = [
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

  let completed = $state({});
  let now = $state('');

  function updateNow() {
    const d = new Date();
    now = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  updateNow();

  function toggle(id) {
    completed = { ...completed, [id]: !completed[id] };
    if (completed[id]) speak(`${$t(`schoolDay.period.${id}`)} ✅`);
  }

  let currentIdx = $derived(PERIODS.findLastIndex(p => p.time <= now));
</script>

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto('/')}>←</button>
    <h1>🏫 {$t('schoolDay.title')}</h1>
    <span class="clock">{now}</span>
  </header>

  <main class="cnt">
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
          {#if i === currentIdx}<span class="now-badge">NU</span>{/if}
        </button>
      {/each}
    </div>
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  .clock { font-weight:700; font-variant-numeric:tabular-nums; }
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
