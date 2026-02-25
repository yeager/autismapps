<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  type View = 'menu' | 'exercise';

  interface Exercise {
    id: string;
    name: string;
    icon: string;
    steps: { text: string; duration: number }[]; // duration in seconds
  }

  const EXERCISES: Exercise[] = [
    {
      id: 'breathing', name: 'break.ex.breathing', icon: '🌬️',
      steps: [
        { text: 'break.step.breathe_in', duration: 4 },
        { text: 'break.step.hold', duration: 4 },
        { text: 'break.step.breathe_out', duration: 6 },
        { text: 'break.step.breathe_in', duration: 4 },
        { text: 'break.step.hold', duration: 4 },
        { text: 'break.step.breathe_out', duration: 6 },
        { text: 'break.step.breathe_in', duration: 4 },
        { text: 'break.step.hold', duration: 4 },
        { text: 'break.step.breathe_out', duration: 6 },
      ]
    },
    {
      id: 'body-scan', name: 'break.ex.body_scan', icon: '🧘',
      steps: [
        { text: 'break.step.close_eyes', duration: 3 },
        { text: 'break.step.feel_feet', duration: 5 },
        { text: 'break.step.feel_legs', duration: 5 },
        { text: 'break.step.feel_stomach', duration: 5 },
        { text: 'break.step.feel_hands', duration: 5 },
        { text: 'break.step.feel_shoulders', duration: 5 },
        { text: 'break.step.feel_head', duration: 5 },
        { text: 'break.step.open_eyes', duration: 3 },
      ]
    },
    {
      id: 'counting', name: 'break.ex.counting', icon: '🔢',
      steps: [
        { text: 'break.step.look_5_see', duration: 10 },
        { text: 'break.step.touch_4', duration: 8 },
        { text: 'break.step.hear_3', duration: 8 },
        { text: 'break.step.smell_2', duration: 6 },
        { text: 'break.step.taste_1', duration: 5 },
      ]
    },
    {
      id: 'stretching', name: 'break.ex.stretching', icon: '🤸',
      steps: [
        { text: 'break.step.reach_up', duration: 5 },
        { text: 'break.step.touch_toes', duration: 5 },
        { text: 'break.step.twist_left', duration: 5 },
        { text: 'break.step.twist_right', duration: 5 },
        { text: 'break.step.shoulder_rolls', duration: 5 },
        { text: 'break.step.neck_circles', duration: 5 },
        { text: 'break.step.shake_out', duration: 4 },
      ]
    },
    {
      id: 'grounding', name: 'break.ex.grounding', icon: '🌳',
      steps: [
        { text: 'break.step.feet_on_floor', duration: 5 },
        { text: 'break.step.press_hands', duration: 5 },
        { text: 'break.step.name_room', duration: 8 },
        { text: 'break.step.deep_breath', duration: 6 },
        { text: 'break.step.say_safe', duration: 4 },
      ]
    },
  ];

  let view = $state<View>('menu');
  let activeExercise = $state<Exercise | null>(null);
  let stepIdx = $state(0);
  let countdown = $state(0);
  let timer = $state<ReturnType<typeof setInterval> | null>(null);
  let exerciseDone = $state(false);

  function startExercise(ex: Exercise) {
    activeExercise = ex;
    stepIdx = 0;
    exerciseDone = false;
    view = 'exercise';
    runStep();
  }

  function runStep() {
    if (!activeExercise || stepIdx >= activeExercise.steps.length) {
      exerciseDone = true;
      speak($t('break.well_done'));
      return;
    }
    const step = activeExercise.steps[stepIdx];
    countdown = activeExercise.steps[stepIdx].duration;
    speak($t(activeExercise.steps[stepIdx].text));

    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer!);
        timer = null;
        stepIdx++;
        runStep();
      }
    }, 1000);
  }

  function goBack() {
    if (timer) { clearInterval(timer); timer = null; }
    if (view === 'exercise') { view = 'menu'; activeExercise = null; }
    else goto('/');
  }

  function progressPct(): number {
    if (!activeExercise) return 0;
    return ((stepIdx) / activeExercise.steps.length) * 100;
  }
</script>

<div class="break-page">
  <header class="app-header">
    <button class="back-btn" onclick={goBack} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('break.title')}</h1>
  </header>

  {#if view === 'menu'}
    <div class="menu-page" transition:fade>
      <p class="instruction">{$t('break.pick')}</p>
      <div class="ex-grid">
        {#each EXERCISES as ex}
          <button class="ex-card" onclick={() => startExercise(ex)}>
            <span class="ex-icon">{ex.icon}</span>
            <h3>{$t(ex.name)}</h3>
          </button>
        {/each}
      </div>
    </div>

  {:else if view === 'exercise' && activeExercise}
    <div class="exercise-page" transition:fade>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progressPct()}%"></div>
      </div>

      {#if !exerciseDone}
        
        <div class="step-display">
          <span class="step-icon">{activeExercise.icon}</span>
          <p class="step-text">{$t(activeExercise.steps[stepIdx].text)}</p>
          <div class="countdown-ring">
            <span class="countdown-num">{countdown}</span>
          </div>
          <p class="step-counter">{stepIdx + 1} / {activeExercise.steps.length}</p>
        </div>
      {:else}
        <div class="done-display">
          <span class="done-emoji">🌟</span>
          <h2>{$t('break.well_done')}</h2>
          <p>{$t('break.feeling_better')}</p>
          <button class="next-btn" onclick={() => { view = 'menu'; }}>{$t('break.back_to_menu')}</button>
        </div>
      {/if}
    </div>
  {/if}

  <footer class="credit">{$t('break.credit')}</footer>
</div>

<style>
  .break-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }

  .menu-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .instruction { text-align: center; color: var(--text-muted); font-weight: 600; }
  .ex-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; width: 100%; max-width: 500px; }
  .ex-card {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 24px 12px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); transition: all 0.2s; min-height: 48px;
  }
  .ex-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: #27AE60; }
  .ex-icon { font-size: 2.5em; }
  .ex-card h3 { font-size: 0.95em; font-weight: 700; text-align: center; }

  .exercise-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .progress-bar { width: 100%; height: 8px; background: var(--border); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: #27AE60; border-radius: 100px; transition: width 0.5s; }

  .step-display { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 32px; }
  .step-icon { font-size: 3em; }
  .step-text { font-size: 1.4em; font-weight: 700; text-align: center; max-width: 300px; }
  .countdown-ring {
    width: 120px; height: 120px; border-radius: 50%; border: 6px solid #27AE60;
    display: flex; align-items: center; justify-content: center;
  }
  .countdown-num { font-size: 3em; font-weight: 800; font-variant-numeric: tabular-nums; }
  .step-counter { font-size: 0.85em; color: var(--text-muted); }

  .done-display { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px; text-align: center; }
  .done-emoji { font-size: 4em; }
  .done-display h2 { font-size: 1.6em; font-weight: 800; }
  .done-display p { color: var(--text-muted); }
  .next-btn {
    padding: 14px 32px; background: #27AE60; color: white;
    border-radius: 100px; font-weight: 700; font-size: 1em; border: none; min-height: 48px;
  }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }

  @media (prefers-reduced-motion: reduce) {
    .ex-card, .progress-fill { transition: none; }
  }
</style>
