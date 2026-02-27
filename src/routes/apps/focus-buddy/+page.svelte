<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  type Tab = 'timer' | 'tasks' | 'parked';
  type TimerState = 'idle' | 'work' | 'break' | 'longbreak';

  interface Task {
    id: string;
    text: string;
    done: boolean;
  }

  // Settings
  let workMin = $state(25);
  let breakMin = $state(5);
  let longBreakMin = $state(15);
  let longBreakAfter = $state(4);

  // State
  let tab = $state<Tab>('timer');
  let timerState = $state<TimerState>('idle');
  let secondsLeft = $state(0);
  let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
  let pomodoroCount = $state(0);

  // Tasks
  let tasks = $state<Task[]>([]);
  let newTask = $state('');
  let currentTaskIdx = $state(0);

  // Parked thoughts
  let parked = $state<string[]>([]);
  let newParked = $state('');

  $effect(() => { loadProgress(); });

  async function loadProgress() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'focus-buddy');
      if (data) {
        tasks = (data.tasks as Task[]) || [];
        parked = (data.parked as string[]) || [];
        pomodoroCount = (data.pomodoroCount as number) || 0;
      }
    }
  }

  async function save() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'focus-buddy', { tasks, parked, pomodoroCount });
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  function startWork() {
    stopTimer();
    timerState = 'work';
    secondsLeft = workMin * 60;
    tick();
    speak($t('focus.work_start'));
  }

  function startBreak() {
    stopTimer();
    const isLong = pomodoroCount > 0 && pomodoroCount % longBreakAfter === 0;
    timerState = isLong ? 'longbreak' : 'break';
    secondsLeft = (isLong ? longBreakMin : breakMin) * 60;
    tick();
    speak(isLong ? $t('focus.long_break') : $t('focus.break_start'));
  }

  function tick() {
    timerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        stopTimer();
        onTimerDone();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function resetTimer() {
    stopTimer();
    timerState = 'idle';
    secondsLeft = 0;
  }

  function onTimerDone() {
    // Beep via Web Audio
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 800;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 300);
    } catch {}

    if (timerState === 'work') {
      pomodoroCount++;
      speak($t('focus.work_done'));
      save();
      // Auto-suggest break
      timerState = 'idle';
    } else {
      speak($t('focus.break_done'));
      timerState = 'idle';
    }
  }

  // Progress circle
  function progressPct(): number {
    if (timerState === 'idle') return 0;
    const total = timerState === 'work' ? workMin * 60 : timerState === 'longbreak' ? longBreakMin * 60 : breakMin * 60;
    return total > 0 ? ((total - secondsLeft) / total) * 100 : 0;
  }

  // Tasks
  function addTask() {
    if (!newTask.trim()) return;
    tasks = [...tasks, { id: crypto.randomUUID(), text: newTask.trim(), done: false }];
    newTask = '';
    save();
  }

  function toggleTask(id: string) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    save();
  }

  function removeTask(id: string) {
    tasks = tasks.filter(t => t.id !== id);
    save();
  }

  // Parked thoughts
  function addParked() {
    if (!newParked.trim()) return;
    parked = [...parked, newParked.trim()];
    newParked = '';
    save();
    speak($t('focus.thought_parked'));
  }

  function removeParked(idx: number) {
    parked = parked.filter((_, i) => i !== idx);
    save();
  }

  function currentTask(): string {
    const active = tasks.filter(t => !t.done);
    return active.length > 0 ? active[0].text : $t('focus.no_tasks');
  }

  function stateColor(): string {
    if (timerState === 'work') return '#E74C3C';
    if (timerState === 'break' || timerState === 'longbreak') return '#27AE60';
    return '#3498DB';
  }
</script>

<WelcomeDialog appId="focus-buddy" titleKey="app.focus_buddy" purposeKey="welcome.focusBuddy.purpose" howKey="welcome.focusBuddy.how" goalKey="welcome.focusBuddy.goal" icon="🎯" />

<div class="focus-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('focus.title')}</h1>
    <span class="pomo-badge">🍅 {pomodoroCount}</span>
  </header>

  <nav class="tab-bar">
    <button class="tab" class:active={tab === 'timer'} onclick={() => (tab = 'timer')}>⏱️ {$t('focus.timer')}</button>
    <button class="tab" class:active={tab === 'tasks'} onclick={() => (tab = 'tasks')}>📋 {$t('focus.tasks')}</button>
    <button class="tab" class:active={tab === 'parked'} onclick={() => (tab = 'parked')}>💭 {$t('focus.parked')}</button>
  </nav>

  {#if tab === 'timer'}
    <div class="timer-page" transition:fade>
      <!-- Current task display -->
      <div class="current-task">
        <span class="task-label">{$t('focus.working_on')}:</span>
        <span class="task-name">{currentTask()}</span>
      </div>

      <!-- Timer circle -->
      <div class="timer-ring" style="--progress: {progressPct()}; --color: {stateColor()}">
        <div class="timer-inner">
          <span class="timer-time">{formatTime(secondsLeft)}</span>
          <span class="timer-state">
            {#if timerState === 'work'}{$t('focus.focus_time')}
            {:else if timerState === 'break'}{$t('focus.break_time')}
            {:else if timerState === 'longbreak'}{$t('focus.long_break_time')}
            {:else}{$t('focus.ready')}
            {/if}
          </span>
        </div>
      </div>

      <!-- Controls -->
      <div class="timer-controls">
        {#if timerState === 'idle'}
          <button class="ctrl-btn work" onclick={startWork}>▶️ {$t('focus.start_work')}</button>
          <button class="ctrl-btn break-btn" onclick={startBreak}>☕ {$t('focus.start_break')}</button>
        {:else}
          <button class="ctrl-btn stop" onclick={resetTimer}>⏹️ {$t('focus.stop')}</button>
        {/if}
      </div>

      <!-- Quick park button (always visible during work) -->
      {#if timerState === 'work'}
        <div class="quick-park">
          <input type="text" bind:value={newParked} placeholder={$t('focus.quick_thought')}
            onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') addParked(); }}>
          <button class="park-btn" onclick={addParked}>💭</button>
        </div>
      {/if}
    </div>

  {:else if tab === 'tasks'}
    <div class="tasks-page" transition:fade>
      <div class="add-row">
        <input type="text" bind:value={newTask} placeholder={$t('focus.add_task')}
          onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') addTask(); }}>
        <button class="add-btn" onclick={addTask}>+</button>
      </div>

      <div class="task-list">
        {#each tasks as task}
          <div class="task-item" class:done={task.done}>
            <button class="check-btn" onclick={() => toggleTask(task.id)}>
              {task.done ? '✅' : '⬜'}
            </button>
            <span class="task-text">{task.text}</span>
            <button class="del-btn" onclick={() => removeTask(task.id)} aria-label="Remove">✕</button>
          </div>
        {/each}
        {#if tasks.length === 0}
          <p class="empty">{$t('focus.no_tasks_yet')}</p>
        {/if}
      </div>
    </div>

  {:else if tab === 'parked'}
    <div class="parked-page" transition:fade>
      <p class="parked-desc">{$t('focus.parked_desc')}</p>

      <div class="add-row">
        <input type="text" bind:value={newParked} placeholder={$t('focus.add_thought')}
          onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') addParked(); }}>
        <button class="add-btn" onclick={addParked}>+</button>
      </div>

      <div class="parked-list">
        {#each parked as thought, i}
          <div class="parked-item">
            <span>💭 {thought}</span>
            <button class="del-btn" onclick={() => removeParked(i)} aria-label="Remove">✕</button>
          </div>
        {/each}
        {#if parked.length === 0}
          <p class="empty">{$t('focus.no_parked')}</p>
        {/if}
      </div>
    </div>
  {/if}

  <footer class="credit">{$t('focus.credit')}</footer>
</div>

<style>
  .focus-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .pomo-badge { font-weight: 700; font-size: 1em; }

  .tab-bar { display: flex; border-bottom: 1px solid var(--border); }
  .tab {
    flex: 1; padding: 12px; text-align: center; font-weight: 600; font-size: 0.9em;
    border-bottom: 3px solid transparent; transition: all 0.15s; min-height: 48px;
  }
  .tab.active { border-bottom-color: #3498DB; color: #3498DB; }

  /* Timer */
  .timer-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .current-task {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 12px 20px; background: var(--bg-card); border-radius: var(--radius); width: 100%; max-width: 400px;
  }
  .task-label { font-size: 0.8em; color: var(--text-muted); }
  .task-name { font-weight: 700; font-size: 1.1em; }

  .timer-ring {
    width: 240px; height: 240px; border-radius: 50%; position: relative;
    background: conic-gradient(var(--color) calc(var(--progress) * 1%), var(--border) 0);
    display: flex; align-items: center; justify-content: center;
  }
  .timer-inner {
    width: 210px; height: 210px; border-radius: 50%; background: var(--bg);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  }
  .timer-time { font-size: 3em; font-weight: 800; font-variant-numeric: tabular-nums; }
  .timer-state { font-size: 0.9em; color: var(--text-muted); font-weight: 600; }

  .timer-controls { display: flex; gap: 12px; }
  .ctrl-btn {
    padding: 14px 28px; border-radius: 100px; font-weight: 700; font-size: 1em;
    border: none; min-height: 48px;
  }
  .ctrl-btn.work { background: #E74C3C; color: white; }
  .ctrl-btn.break-btn { background: #27AE60; color: white; }
  .ctrl-btn.stop { background: var(--bg-card); border: 2px solid var(--border); }

  .quick-park {
    display: flex; gap: 8px; width: 100%; max-width: 400px;
  }
  .quick-park input {
    flex: 1; padding: 12px 16px; border: 2px solid var(--border); border-radius: 100px;
    font-size: 0.95em; background: var(--bg-card);
  }
  .park-btn {
    width: 48px; height: 48px; border-radius: 50%; border: 2px solid #9B59B6;
    font-size: 1.2em; background: rgba(155,89,182,0.1);
  }

  /* Tasks & Parked */
  .tasks-page, .parked-page { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .parked-desc { text-align: center; color: var(--text-muted); font-size: 0.85em; }

  .add-row { display: flex; gap: 8px; }
  .add-row input {
    flex: 1; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px;
    font-size: 1em; background: var(--bg-card);
  }
  .add-btn {
    width: 48px; height: 48px; border-radius: 12px; border: 2px solid #3498DB;
    font-size: 1.5em; font-weight: 700; color: #3498DB; background: rgba(52,152,219,0.1);
  }

  .task-list, .parked-list { display: flex; flex-direction: column; gap: 6px; }
  .task-item, .parked-item {
    display: flex; align-items: center; gap: 10px; padding: 12px;
    background: var(--bg-card); border-radius: var(--radius); border: 1px solid var(--border);
  }
  .task-item.done { opacity: 0.5; }
  .task-item.done .task-text { text-decoration: line-through; }
  .check-btn { font-size: 1.2em; background: none; border: none; padding: 4px; min-width: 36px; min-height: 36px; }
  .task-text { flex: 1; font-weight: 600; }
  .del-btn {
    width: 32px; height: 32px; border-radius: 8px; border: none;
    color: var(--text-muted); font-size: 1em; background: transparent;
  }
  .del-btn:hover { background: rgba(231,76,60,0.1); color: #E74C3C; }

  .parked-item span { flex: 1; }
  .empty { text-align: center; color: var(--text-muted); padding: 24px; }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }

  @media (prefers-reduced-motion: reduce) {
    .tab, .ctrl-btn { transition: none; }
  }
</style>
