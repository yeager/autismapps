<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  interface Step {
    id: string;
    emoji: string;
    text: string;
    done: boolean;
  }

  interface Schedule {
    id: string;
    name: string;
    steps: Step[];
  }

  // Preset templates
  const TEMPLATES: { name: string; key: string; steps: { emoji: string; text: string }[] }[] = [
    {
      name: 'vs.template.morning', key: 'morning',
      steps: [
        { emoji: '🌅', text: 'vs.step.wake_up' },
        { emoji: '🚿', text: 'vs.step.shower' },
        { emoji: '👕', text: 'vs.step.get_dressed' },
        { emoji: '🍳', text: 'vs.step.breakfast' },
        { emoji: '🦷', text: 'vs.step.brush_teeth' },
        { emoji: '🎒', text: 'vs.step.pack_bag' },
        { emoji: '👋', text: 'vs.step.go' },
      ]
    },
    {
      name: 'vs.template.evening', key: 'evening',
      steps: [
        { emoji: '🏠', text: 'vs.step.come_home' },
        { emoji: '🍽️', text: 'vs.step.dinner' },
        { emoji: '🛁', text: 'vs.step.bath' },
        { emoji: '🦷', text: 'vs.step.brush_teeth' },
        { emoji: '📖', text: 'vs.step.read' },
        { emoji: '🛏️', text: 'vs.step.bed' },
      ]
    },
    {
      name: 'vs.template.school', key: 'school',
      steps: [
        { emoji: '🏫', text: 'vs.step.arrive' },
        { emoji: '📚', text: 'vs.step.lesson' },
        { emoji: '☕', text: 'vs.step.break_time' },
        { emoji: '📚', text: 'vs.step.lesson' },
        { emoji: '🍽️', text: 'vs.step.lunch' },
        { emoji: '📚', text: 'vs.step.lesson' },
        { emoji: '🏠', text: 'vs.step.go_home' },
      ]
    },
  ];

  let schedules = $state<Schedule[]>([]);
  let activeSchedule = $state<Schedule | null>(null);
  let editMode = $state(false);
  let newStepText = $state('');
  let newStepEmoji = $state('📌');

  $effect(() => { loadData(); });

  async function loadData() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'visual-support');
      if (data?.schedules) schedules = data.schedules as Schedule[];
    }
  }

  async function save() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'visual-support', { schedules });
  }

  function createFromTemplate(tpl: typeof TEMPLATES[0]) {
    const schedule: Schedule = {
      id: crypto.randomUUID(),
      name: $t(tpl.name),
      steps: tpl.steps.map(s => ({ id: crypto.randomUUID(), emoji: s.emoji, text: $t(s.text), done: false })),
    };
    schedules = [...schedules, schedule];
    activeSchedule = schedule;
    save();
  }

  function toggleStep(stepId: string) {
    if (!activeSchedule) return;
    activeSchedule.steps = activeSchedule.steps.map(s =>
      s.id === stepId ? { ...s, done: !s.done } : s
    );
    const step = activeSchedule.steps.find(s => s.id === stepId);
    if (step) {
      speak(step.done ? `${step.text} — ${$t('vs.done')}!` : step.text);
    }
    // Update in schedules array
    schedules = schedules.map(s => s.id === activeSchedule!.id ? activeSchedule! : s);
    save();
  }

  function resetSchedule() {
    if (!activeSchedule) return;
    activeSchedule.steps = activeSchedule.steps.map(s => ({ ...s, done: false }));
    schedules = schedules.map(s => s.id === activeSchedule!.id ? activeSchedule! : s);
    save();
  }

  function deleteSchedule(id: string) {
    schedules = schedules.filter(s => s.id !== id);
    if (activeSchedule?.id === id) activeSchedule = null;
    save();
  }

  function addStep() {
    if (!activeSchedule || !newStepText.trim()) return;
    activeSchedule.steps = [...activeSchedule.steps, { id: crypto.randomUUID(), emoji: newStepEmoji, text: newStepText.trim(), done: false }];
    schedules = schedules.map(s => s.id === activeSchedule!.id ? activeSchedule! : s);
    newStepText = '';
    save();
  }

  function removeStep(stepId: string) {
    if (!activeSchedule) return;
    activeSchedule.steps = activeSchedule.steps.filter(s => s.id !== stepId);
    schedules = schedules.map(s => s.id === activeSchedule!.id ? activeSchedule! : s);
    save();
  }

  function completedCount(): number {
    return activeSchedule?.steps.filter(s => s.done).length || 0;
  }

  function goBack() {
    if (activeSchedule) { activeSchedule = null; editMode = false; }
    else goto('/');
  }
</script>

<div class="vs-page">
  <header class="app-header">
    <button class="back-btn" onclick={goBack} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{activeSchedule ? activeSchedule.name : $t('vs.title')}</h1>
    {#if activeSchedule}
      <span class="progress-badge">{completedCount()}/{activeSchedule.steps.length}</span>
    {/if}
  </header>

  {#if !activeSchedule}
    <div class="home-page" transition:fade>
      {#if schedules.length > 0}
        <h2 class="section-title">{$t('vs.my_schedules')}</h2>
        <div class="schedule-list">
          {#each schedules as s}
            <div class="schedule-card">
              <button class="schedule-btn" onclick={() => (activeSchedule = s)}>
                <span class="sched-name">{s.name}</span>
                <span class="sched-count">{s.steps.length} {$t('vs.steps')}</span>
              </button>
              <button class="del-btn" onclick={() => deleteSchedule(s.id)}>✕</button>
            </div>
          {/each}
        </div>
      {/if}

      <h2 class="section-title">{$t('vs.templates')}</h2>
      <div class="template-grid">
        {#each TEMPLATES as tpl}
          <button class="tpl-card" onclick={() => createFromTemplate(tpl)}>
            <span class="tpl-emoji">{tpl.steps[0].emoji}</span>
            <span class="tpl-name">{$t(tpl.name)}</span>
          </button>
        {/each}
      </div>
    </div>

  {:else}
    <div class="schedule-page" transition:fade>
      <!-- Progress bar -->
      <div class="progress-bar">
        <div class="progress-fill" style="width: {activeSchedule.steps.length > 0 ? (completedCount() / activeSchedule.steps.length) * 100 : 0}%"></div>
      </div>

      <div class="step-list">
        {#each activeSchedule.steps as step, i}
          <div class="step-row" class:done={step.done} class:current={!step.done && (i === 0 || activeSchedule.steps[i-1].done)}>
            <button class="step-check" onclick={() => toggleStep(step.id)} aria-label={step.done ? 'Undo' : 'Complete'}>
              {step.done ? '✅' : '⬜'}
            </button>
            <span class="step-emoji">{step.emoji}</span>
            <span class="step-text">{step.text}</span>
            <button class="step-speak" onclick={() => speak(step.text)}>🔊</button>
            {#if editMode}
              <button class="del-btn sm" onclick={() => removeStep(step.id)}>✕</button>
            {/if}
          </div>
        {/each}
      </div>

      {#if editMode}
        <div class="add-step-row">
          <input type="text" bind:value={newStepEmoji} class="emoji-input" maxlength="4">
          <input type="text" bind:value={newStepText} placeholder={$t('vs.add_step')}
            onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') addStep(); }}>
          <button class="add-btn" onclick={addStep}>+</button>
        </div>
      {/if}

      <div class="sched-actions">
        <button class="action-btn" onclick={() => (editMode = !editMode)}>
          {editMode ? '✓ ' + $t('vs.done_editing') : '✏️ ' + $t('vs.edit')}
        </button>
        <button class="action-btn" onclick={resetSchedule}>🔄 {$t('vs.reset')}</button>
      </div>
    </div>
  {/if}

  <footer class="credit">{$t('vs.credit')}</footer>
</div>

<style>
  .vs-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .progress-badge { font-weight: 700; font-size: 0.9em; color: #27AE60; }

  .home-page { flex: 1; padding: 16px; }
  .section-title { font-size: 1em; font-weight: 700; color: var(--text-muted); margin: 16px 0 8px; }

  .schedule-list { display: flex; flex-direction: column; gap: 8px; }
  .schedule-card { display: flex; align-items: center; gap: 8px; }
  .schedule-btn {
    flex: 1; display: flex; justify-content: space-between; align-items: center;
    padding: 16px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); font-weight: 600; min-height: 48px;
  }
  .schedule-btn:hover { border-color: #3498DB; }
  .sched-count { font-size: 0.8em; color: var(--text-muted); }

  .template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
  .tpl-card {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 20px 12px; border: 2px dashed var(--border); border-radius: var(--radius);
    background: var(--bg-card); min-height: 48px;
  }
  .tpl-card:hover { border-color: #3498DB; border-style: solid; }
  .tpl-emoji { font-size: 2em; }
  .tpl-name { font-weight: 600; font-size: 0.9em; }

  /* Schedule view */
  .schedule-page { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .progress-bar { height: 8px; background: var(--border); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: #27AE60; border-radius: 100px; transition: width 0.3s; }

  .step-list { display: flex; flex-direction: column; gap: 6px; }
  .step-row {
    display: flex; align-items: center; gap: 10px; padding: 14px 12px;
    background: var(--bg-card); border-radius: var(--radius); border: 2px solid var(--border);
    transition: all 0.2s;
  }
  .step-row.done { opacity: 0.5; border-color: #27AE60; }
  .step-row.current { border-color: #3498DB; box-shadow: 0 0 0 2px rgba(52,152,219,0.2); }
  .step-check { font-size: 1.3em; background: none; border: none; min-width: 40px; min-height: 40px; }
  .step-emoji { font-size: 1.5em; }
  .step-text { flex: 1; font-weight: 600; }
  .step-speak { background: none; border: none; font-size: 1.1em; padding: 4px; min-width: 36px; min-height: 36px; }

  .add-step-row { display: flex; gap: 8px; align-items: center; }
  .emoji-input { width: 48px; padding: 10px; border: 2px solid var(--border); border-radius: 12px; text-align: center; font-size: 1.2em; }
  .add-step-row input:not(.emoji-input) { flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 12px; font-size: 1em; }
  .add-btn { width: 48px; height: 48px; border-radius: 12px; border: 2px solid #3498DB; font-size: 1.5em; color: #3498DB; background: rgba(52,152,219,0.1); }

  .sched-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .action-btn {
    padding: 10px 20px; border-radius: 100px; border: 1px solid var(--border);
    font-weight: 600; font-size: 0.9em; background: var(--bg-card); min-height: 48px;
  }

  .del-btn { width: 32px; height: 32px; border-radius: 8px; border: none; color: var(--text-muted); background: none; font-size: 1em; }
  .del-btn:hover { color: #E74C3C; background: rgba(231,76,60,0.1); }
  .del-btn.sm { width: 28px; height: 28px; }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }

  @media (prefers-reduced-motion: reduce) {
    .step-row, .progress-fill { transition: none; }
  }
</style>
