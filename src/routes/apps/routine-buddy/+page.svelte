<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const ROUTINES = [
    { id: 'morning', icon: '🌅', steps: [
      { icon: '⏰', key: 'routineBuddy.wake' },
      { icon: '🚽', key: 'routineBuddy.toilet' },
      { icon: '🧼', key: 'routineBuddy.wash' },
      { icon: '👕', key: 'routineBuddy.dress' },
      { icon: '🥣', key: 'routineBuddy.breakfast' },
      { icon: '🪥', key: 'routineBuddy.brush' },
      { icon: '🎒', key: 'routineBuddy.pack' },
      { icon: '🚪', key: 'routineBuddy.leave' },
    ]},
    { id: 'evening', icon: '🌙', steps: [
      { icon: '🍽️', key: 'routineBuddy.dinner' },
      { icon: '🛁', key: 'routineBuddy.bath' },
      { icon: '👕', key: 'routineBuddy.pyjamas' },
      { icon: '🪥', key: 'routineBuddy.brushEvening' },
      { icon: '📖', key: 'routineBuddy.story' },
      { icon: '💤', key: 'routineBuddy.sleep' },
    ]},
    { id: 'school', icon: '🏫', steps: [
      { icon: '🚪', key: 'routineBuddy.arrive' },
      { icon: '🎒', key: 'routineBuddy.unpack' },
      { icon: '📚', key: 'routineBuddy.lesson' },
      { icon: '🏃', key: 'routineBuddy.recess' },
      { icon: '🍽️', key: 'routineBuddy.lunch' },
      { icon: '📚', key: 'routineBuddy.lesson2' },
      { icon: '🏠', key: 'routineBuddy.goHome' },
    ]},
  ];

  let routine = $state(null);
  let step = $state(0);
  let done = $state([]);

  function start(r) {
    routine = r;
    step = 0;
    done = r.steps.map(() => false);
    speak($t(`routineBuddy.routine.${r.id}`));
  }

  function toggleStep(i) {
    done = done.map((v, idx) => idx === i ? !v : v);
    if (done[i]) speak(`${$t(routine.steps[i].key)} ✅`);
    if (done.every(Boolean)) speak($t('routineBuddy.allDone'));
  }
</script>

<WelcomeDialog appId="routine-buddy" titleKey="app.routine_buddy" purposeKey="welcome.routineBuddy.purpose" howKey="welcome.routineBuddy.how" goalKey="welcome.routineBuddy.goal" icon="🔁" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => routine ? (routine = null) : goto(`${base}/`)}>←</button>
    <h1>🗓️ {$t('routineBuddy.title')}</h1>
  </header>

  <main class="cnt">
    {#if !routine}
      <div class="grid">
        {#each ROUTINES as r}
          <button class="card" onclick={() => start(r)}>
            <span class="ico">{r.icon}</span>
            <span class="nm">{$t(`routineBuddy.routine.${r.id}`)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <h2>{routine.icon} {$t(`routineBuddy.routine.${routine.id}`)}</h2>
      <div class="steps">
        {#each routine.steps as s, i}
          <button class="step" class:step-done={done[i]} onclick={() => toggleStep(i)}>
            <span class="step-num">{i+1}</span>
            <span class="step-icon">{s.icon}</span>
            <span class="step-text">{$t(s.key)}</span>
            {#if done[i]}<span class="check">✅</span>{/if}
          </button>
        {/each}
      </div>
      {#if done.every(Boolean)}
        <div class="success" in:fade><span>🎉</span><p>{$t('routineBuddy.allDone')}</p></div>
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
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:1rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; }
  .steps { display:flex; flex-direction:column; gap:.5rem; }
  .step { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:48px; text-align:left; }
  .step-done { border-color:#4caf50; background:#e8f5e9; }
  .step-num { width:28px; height:28px; border-radius:50%; background:var(--border); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.85rem; flex-shrink:0; }
  .step-done .step-num { background:#4caf50; color:#fff; }
  .step-icon { font-size:1.5rem; }
  .step-text { flex:1; font-weight:500; }
  .check { font-size:1rem; }
  .success { text-align:center; margin-top:1.5rem; }
  .success span { font-size:3rem; }
  .success p { font-size:1.3rem; font-weight:700; color:#4caf50; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
