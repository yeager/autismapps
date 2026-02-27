<script>
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { fade } from 'svelte/transition';
  import { get } from 'svelte/store';

  const TASKS = [
    { id: 'brush-teeth', icon: '🪥', steps: ['💧', '🪥', '⏱️', '🚰'], times: ['morning', 'evening'] },
    { id: 'get-dressed', icon: '👕', steps: ['👖', '👕', '🧦', '👟'], times: ['morning'] },
    { id: 'wash-hands', icon: '🧼', steps: ['💧', '🧼', '👐', '🧻'], times: ['morning', 'afternoon', 'evening'] },
    { id: 'pack-bag', icon: '🎒', steps: ['📚', '✏️', '🥪', '🎒'], times: ['morning'] },
    { id: 'set-table', icon: '🍽️', steps: ['🍽️', '🥄', '🥛', '🧻'], times: ['morning', 'afternoon', 'evening'] },
    { id: 'tidy-up', icon: '🧹', steps: ['📦', '🧹', '🧽', '✅'], times: ['afternoon', 'evening'] },
    { id: 'bedtime', icon: '🛏️', steps: ['🪥', '👕', '📖', '💤'], times: ['evening'] },
    { id: 'homework', icon: '📝', steps: ['📚', '✏️', '⏱️', '✅'], times: ['afternoon'] },
  ];

  let view = $state('board'); // 'board' | 'task'
  let selectedTask = $state(null);
  let completedToday = $state({});
  let currentStep = $state(0);
  let stepDone = $state([]);
  let showCelebration = $state(false);

  // Load progress
  $effect(() => {
    const pid = get(activeProfileId);
    if (pid) {
      getAppProgress(pid, 'practice-board').then(data => {
        if (data) {
          const today = new Date().toDateString();
          if (data.date === today) {
            completedToday = data.completed || {};
          }
        }
      });
    }
  });

  function saveProgress() {
    const pid = get(activeProfileId);
    if (pid) {
      saveAppProgress(pid, 'practice-board', {
        date: new Date().toDateString(),
        completed: completedToday,
      });
    }
  }

  function openTask(task) {
    selectedTask = task;
    currentStep = 0;
    stepDone = task.steps.map(() => false);
    view = 'task';
    speak($t(`practiceBoard.task.${task.id}`));
  }

  function toggleStep(i) {
    stepDone = stepDone.map((v, idx) => idx === i ? !v : v);
    if (stepDone[i]) {
      speak($t(`practiceBoard.step.${selectedTask.id}.${i}`));
    }
    // Check if all done
    if (stepDone.every(Boolean)) {
      completedToday = { ...completedToday, [selectedTask.id]: true };
      saveProgress();
      showCelebration = true;
      speak($t('practiceBoard.wellDone'));
      setTimeout(() => {
        showCelebration = false;
        view = 'board';
      }, 2500);
    }
  }

  function back() {
    if (view === 'task') {
      view = 'board';
      selectedTask = null;
    } else {
      goto('/');
    }
  }

  let completedCount = $derived(Object.values(completedToday).filter(Boolean).length);
  let totalTasks = $derived(TASKS.length);

  function getTimeIcon(t) {
    if (t === 'morning') return '🌅';
    if (t === 'afternoon') return '☀️';
    return '🌙';
  }
</script>

<WelcomeDialog appId="practice-board" titleKey="app.practice_board" purposeKey="welcome.practiceBoard.purpose" howKey="welcome.practiceBoard.how" goalKey="welcome.practiceBoard.goal" icon="📊" />

<div class="app-container" in:fade>
  <header class="sticky-header">
    <button class="back-btn" onclick={back} aria-label={$t('common.back')}>←</button>
    <h1>📋 {$t('practiceBoard.title')}</h1>
    {#if view === 'board'}
      <span class="counter">{completedCount}/{totalTasks}</span>
    {/if}
  </header>

  <main class="content">
    {#if view === 'board'}
      <p class="intro">{$t('practiceBoard.intro')}</p>

      <div class="task-grid">
        {#each TASKS as task}
          <button
            class="task-card"
            class:completed={completedToday[task.id]}
            onclick={() => openTask(task)}
          >
            <span class="task-icon">{task.icon}</span>
            <span class="task-name">{$t(`practiceBoard.task.${task.id}`)}</span>
            <div class="task-times">
              {#each task.times as time}
                <span class="time-badge" title={$t(`practiceBoard.time.${time}`)}>{getTimeIcon(time)}</span>
              {/each}
            </div>
            {#if completedToday[task.id]}
              <span class="done-badge">✅</span>
            {/if}
          </button>
        {/each}
      </div>

    {:else if view === 'task'}
      <div class="task-detail">
        <h2>{selectedTask.icon} {$t(`practiceBoard.task.${selectedTask.id}`)}</h2>

        <div class="steps">
          {#each selectedTask.steps as stepIcon, i}
            <button
              class="step-card"
              class:step-done={stepDone[i]}
              onclick={() => toggleStep(i)}
            >
              <span class="step-number">{i + 1}</span>
              <span class="step-icon">{stepIcon}</span>
              <span class="step-text">{$t(`practiceBoard.step.${selectedTask.id}.${i}`)}</span>
              {#if stepDone[i]}
                <span class="step-check">✅</span>
              {/if}
            </button>
          {/each}
        </div>

        {#if showCelebration}
          <div class="celebration" in:fade>
            <span class="celebration-icon">🎉</span>
            <p>{$t('practiceBoard.wellDone')}</p>
          </div>
        {/if}
      </div>
    {/if}
  </main>

  <footer class="credit">
    <p>Autismappar · CC BY-NC-SA 4.0</p>
  </footer>
</div>

<style>
  .app-container {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
  }

  .back-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    min-width: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 { font-size: 1.4rem; margin: 0; flex: 1; }
  h2 { text-align: center; margin: 0.5rem 0 1.5rem; }

  .counter {
    font-size: 1rem;
    font-weight: 600;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }

  .content {
    flex: 1;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .intro {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  .task-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  .task-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border: 2px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s;
    min-height: 48px;
  }

  .task-card:hover { transform: translateY(-2px); }
  .task-card.completed { border-color: #4caf50; opacity: 0.7; }

  .task-icon { font-size: 2.5rem; }
  .task-name { font-weight: 600; font-size: 1rem; text-align: center; }

  .task-times {
    display: flex;
    gap: 0.25rem;
  }

  .time-badge { font-size: 0.9rem; }

  .done-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1.2rem;
  }

  /* Steps */
  .task-detail { text-align: center; }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .step-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 2px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    min-height: 48px;
    text-align: left;
    width: 100%;
  }

  .step-card:hover:not(.step-done) { border-color: var(--accent, #2196f3); }

  .step-done {
    border-color: #4caf50;
    background: #e8f5e9;
  }

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-done .step-number { background: #4caf50; color: #fff; }

  .step-icon { font-size: 1.8rem; flex-shrink: 0; }
  .step-text { flex: 1; font-size: 1.1rem; font-weight: 500; }
  .step-check { font-size: 1.3rem; }

  /* Celebration */
  .celebration {
    margin-top: 2rem;
    text-align: center;
  }

  .celebration-icon {
    font-size: 4rem;
    display: block;
    animation: bounce 0.6s ease;
  }

  .celebration p {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4caf50;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .credit {
    padding: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
  }

  @media (prefers-reduced-motion: reduce) {
    .task-card { transition: none; }
    .celebration-icon { animation: none; }
    .step-card { transition: none; }
  }
</style>
