<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { fade } from 'svelte/transition';
  import { get } from 'svelte/store';

  const TIME_SLOTS = [
    { id: 'morning', icon: '🌅', time: '07:00' },
    { id: 'breakfast', icon: '🥣', time: '08:00' },
    { id: 'school_start', icon: '🏫', time: '09:00' },
    { id: 'lunch', icon: '🍽️', time: '12:00' },
    { id: 'school_end', icon: '🎒', time: '15:00' },
    { id: 'snack', icon: '🍎', time: '15:30' },
    { id: 'play', icon: '🎮', time: '16:00' },
    { id: 'dinner', icon: '🍝', time: '18:00' },
    { id: 'evening', icon: '🛁', time: '19:00' },
    { id: 'bedtime', icon: '🛏️', time: '20:00' },
  ];

  const ACTIVITY_ICONS = ['📚','🎨','🎮','⚽','🎵','🧩','📺','🍳','🧹','🚶','🏊','🚴','🎭','✏️','🧘'];

  let completed = $state({});
  let editing = $state(null);
  let customActivities = $state({});

  $effect(() => {
    const pid = get(activeProfileId);
    if (pid) {
      getAppProgress(pid, 'day-planner').then(data => {
        if (data) {
          const today = new Date().toDateString();
          if (data.date === today) {
            completed = data.completed || {};
            customActivities = data.custom || {};
          }
        }
      });
    }
  });

  function save() {
    const pid = get(activeProfileId);
    if (pid) {
      saveAppProgress(pid, 'day-planner', {
        date: new Date().toDateString(),
        completed,
        custom: customActivities,
      });
    }
  }

  function toggle(id) {
    completed = { ...completed, [id]: !completed[id] };
    const slot = TIME_SLOTS.find(s => s.id === id);
    if (completed[id] && slot) speak(`${$t(`dayPlanner.slot.${id}`)} ✅`);
    save();
  }

  function setCustomIcon(slotId, icon) {
    customActivities = { ...customActivities, [slotId]: icon };
    editing = null;
    save();
  }

  let doneCount = $derived(Object.values(completed).filter(Boolean).length);
</script>

<WelcomeDialog appId="day-planner" titleKey="app.day_planner" purposeKey="welcome.dayPlanner.purpose" howKey="welcome.dayPlanner.how" goalKey="welcome.dayPlanner.goal" icon="📅" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)}>←</button>
    <h1>📅 {$t('dayPlanner.title')}</h1>
    <span class="counter">{doneCount}/{TIME_SLOTS.length}</span>
  </header>

  <main class="cnt">
    <div class="timeline">
      {#each TIME_SLOTS as slot}
        <div class="slot" class:done={completed[slot.id]}>
          <span class="time">{slot.time}</span>
          <button class="slot-icon" onclick={() => editing = editing === slot.id ? null : slot.id}>
            {customActivities[slot.id] || slot.icon}
          </button>
          <button class="slot-label" onclick={() => { toggle(slot.id); }}>
            {$t(`dayPlanner.slot.${slot.id}`)}
          </button>
          {#if completed[slot.id]}
            <span class="check">✅</span>
          {/if}
        </div>
        {#if editing === slot.id}
          <div class="icon-picker" in:fade>
            {#each ACTIVITY_ICONS as icon}
              <button class="pick-btn" onclick={() => setCustomIcon(slot.id, icon)}>{icon}</button>
            {/each}
          </div>
        {/if}
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
  .counter { font-size:1rem; font-weight:600; background:#e8f5e9; color:#2e7d32; padding:.25rem .75rem; border-radius:20px; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .timeline { display:flex; flex-direction:column; gap:.5rem; }
  .slot { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); }
  .slot.done { border-color:#4caf50; opacity:.7; }
  .time { font-size:.85rem; color:var(--text-secondary); min-width:45px; font-weight:600; }
  .slot-icon { font-size:1.8rem; background:none; border:none; cursor:pointer; min-width:48px; min-height:48px; }
  .slot-label { flex:1; font-size:1.1rem; font-weight:500; background:none; border:none; cursor:pointer; text-align:left; color:var(--text); min-height:48px; display:flex; align-items:center; }
  .check { font-size:1.2rem; }
  .icon-picker { display:flex; flex-wrap:wrap; gap:.5rem; padding:.75rem; background:var(--bg-card); border:1px solid var(--border); border-radius:12px; }
  .pick-btn { font-size:1.5rem; background:none; border:none; cursor:pointer; min-width:44px; min-height:44px; border-radius:8px; }
  .pick-btn:hover { background:#e3f2fd; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
