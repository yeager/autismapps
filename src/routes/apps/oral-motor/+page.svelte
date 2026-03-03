<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  type Exercise = {
    id: string;
    icon: string;
    labelKey: string;
    descKey: string;
    steps: { emoji: string; cueKey: string }[];
  };

  const EXERCISES: Exercise[] = [
    {
      id: 'tongue', icon: '👅', labelKey: 'oralMotor.tongue', descKey: 'oralMotor.tongue.desc',
      steps: [
        { emoji: '👅⬆️', cueKey: 'oralMotor.tongue.up' },
        { emoji: '👅⬇️', cueKey: 'oralMotor.tongue.down' },
        { emoji: '👅⬅️', cueKey: 'oralMotor.tongue.left' },
        { emoji: '👅➡️', cueKey: 'oralMotor.tongue.right' },
        { emoji: '👅🔄', cueKey: 'oralMotor.tongue.circle' },
      ]
    },
    {
      id: 'lips', icon: '👄', labelKey: 'oralMotor.lips', descKey: 'oralMotor.lips.desc',
      steps: [
        { emoji: '😗', cueKey: 'oralMotor.lips.pucker' },
        { emoji: '😁', cueKey: 'oralMotor.lips.smile' },
        { emoji: '😗😁', cueKey: 'oralMotor.lips.puckerSmile' },
        { emoji: '💋', cueKey: 'oralMotor.lips.kiss' },
        { emoji: '🐟', cueKey: 'oralMotor.lips.fish' },
      ]
    },
    {
      id: 'jaw', icon: '🦷', labelKey: 'oralMotor.jaw', descKey: 'oralMotor.jaw.desc',
      steps: [
        { emoji: '😮', cueKey: 'oralMotor.jaw.open' },
        { emoji: '😶', cueKey: 'oralMotor.jaw.close' },
        { emoji: '😮😶', cueKey: 'oralMotor.jaw.openClose' },
        { emoji: '🔄', cueKey: 'oralMotor.jaw.side' },
        { emoji: '😬', cueKey: 'oralMotor.jaw.clench' },
      ]
    },
    {
      id: 'breath', icon: '💨', labelKey: 'oralMotor.breath', descKey: 'oralMotor.breath.desc',
      steps: [
        { emoji: '🌬️', cueKey: 'oralMotor.breath.blow' },
        { emoji: '😤', cueKey: 'oralMotor.breath.puff' },
        { emoji: '🎈', cueKey: 'oralMotor.breath.balloon' },
        { emoji: '🕯️', cueKey: 'oralMotor.breath.candle' },
        { emoji: '😮‍💨', cueKey: 'oralMotor.breath.long' },
      ]
    },
  ];

  let selectedExercise = $state<Exercise | null>(null);
  let currentStep = $state(0);
  let isPlaying = $state(false);
  let speechRate = $state(0.6);
  let completedSteps = $state<Set<string>>(new Set());

  function selectExercise(ex: Exercise) {
    selectedExercise = ex;
    currentStep = 0;
    completedSteps = new Set();
    speak($t(ex.labelKey), { rate: speechRate });
  }

  async function playStep(stepIdx: number) {
    if (!selectedExercise) return;
    currentStep = stepIdx;
    isPlaying = true;
    const step = selectedExercise.steps[stepIdx];
    await speak($t(step.cueKey), { rate: speechRate });
    isPlaying = false;
    completedSteps = new Set([...completedSteps, `${selectedExercise.id}-${stepIdx}`]);
  }

  async function playAll() {
    if (!selectedExercise) return;
    isPlaying = true;
    for (let i = 0; i < selectedExercise.steps.length; i++) {
      currentStep = i;
      const step = selectedExercise.steps[i];
      await speak($t(step.cueKey), { rate: speechRate });
      completedSteps = new Set([...completedSteps, `${selectedExercise.id}-${i}`]);
      await new Promise(r => setTimeout(r, 1500));
    }
    isPlaying = false;
  }

  function repeatStep() {
    if (selectedExercise) playStep(currentStep);
  }

  const allDone = $derived(
    selectedExercise ? completedSteps.size >= selectedExercise.steps.length : false
  );
</script>

<WelcomeDialog appId="oral-motor" titleKey="app.oral_motor" purposeKey="welcome.oralMotor.purpose" howKey="welcome.oralMotor.how" goalKey="welcome.oralMotor.goal" icon="👄" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedExercise ? (selectedExercise = null) : goto(base + '/')}>←</button>
    <h1>👄 {$t('oralMotor.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedExercise}
      <p class="intro">{$t('oralMotor.intro')}</p>
      <div class="grid">
        {#each EXERCISES as ex}
          <button class="card" onclick={() => selectExercise(ex)}>
            <span class="ico">{ex.icon}</span>
            <span class="nm">{$t(ex.labelKey)}</span>
            <span class="desc">{$t(ex.descKey)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="exercise">
        <h2>{selectedExercise.icon} {$t(selectedExercise.labelKey)}</h2>

        <div class="speed-control">
          <label>{$t('oralMotor.speed')}: {speechRate.toFixed(1)}x</label>
          <input type="range" min="0.4" max="1.0" step="0.1" bind:value={speechRate} />
        </div>

        <div class="steps">
          {#each selectedExercise.steps as step, i}
            <button
              class="step-btn"
              class:active={currentStep === i && isPlaying}
              class:done={completedSteps.has(`${selectedExercise.id}-${i}`)}
              onclick={() => playStep(i)}
              disabled={isPlaying}
            >
              <span class="step-num">{i + 1}</span>
              <span class="step-emoji">{step.emoji}</span>
              <span class="step-cue">{$t(step.cueKey)}</span>
              {#if completedSteps.has(`${selectedExercise.id}-${i}`)}
                <span class="check">✅</span>
              {/if}
            </button>
          {/each}
        </div>

        <div class="actions">
          <button class="btn play-all" onclick={playAll} disabled={isPlaying}>
            ▶️ {$t('oralMotor.playAll')}
          </button>
          <button class="btn repeat" onclick={repeatStep} disabled={isPlaying}>
            🔁 {$t('oralMotor.repeat')}
          </button>
        </div>

        {#if allDone}
          <div class="celebration" transition:fade>
            <span class="star">⭐</span>
            <p>{$t('oralMotor.allDone')}</p>
          </div>
        {/if}
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
  h2 { text-align:center; margin:.5rem 0 1rem; font-size:1.3rem; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .intro { text-align:center; color:var(--text-secondary); margin-bottom:1rem; font-size:1.05rem; }
  .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.4rem; padding:1.2rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; transition:transform .15s; }
  .card:active { transform:scale(0.96); }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; font-size:1.05rem; }
  .desc { font-size:.85rem; color:var(--text-secondary); text-align:center; }
  .exercise { display:flex; flex-direction:column; gap:1rem; }
  .speed-control { display:flex; flex-direction:column; align-items:center; gap:.4rem; }
  .speed-control label { font-weight:600; font-size:.95rem; }
  .speed-control input[type="range"] { width:80%; max-width:300px; accent-color:#E67E22; }
  .steps { display:flex; flex-direction:column; gap:.75rem; }
  .step-btn { display:flex; align-items:center; gap:.75rem; padding:1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:56px; transition:all .2s; text-align:left; }
  .step-btn.active { border-color:#E67E22; background:rgba(230,126,34,.1); transform:scale(1.02); }
  .step-btn.done { border-color:#27AE60; }
  .step-btn:disabled { opacity:.6; cursor:not-allowed; }
  .step-num { background:#E67E22; color:#fff; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.9rem; flex-shrink:0; }
  .step-emoji { font-size:1.5rem; }
  .step-cue { flex:1; font-size:1rem; }
  .check { font-size:1.2rem; }
  .actions { display:flex; gap:1rem; justify-content:center; margin-top:.5rem; }
  .btn { padding:.8rem 1.5rem; border-radius:12px; border:2px solid var(--border); background:var(--bg-card); font-size:1rem; cursor:pointer; font-weight:600; min-height:48px; transition:transform .15s; }
  .btn:active { transform:scale(0.96); }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
  .play-all { background:#E67E22; color:#fff; border-color:#E67E22; }
  .repeat { background:#3498DB; color:#fff; border-color:#3498DB; }
  .celebration { text-align:center; padding:1.5rem; background:rgba(241,196,15,.15); border-radius:16px; }
  .star { font-size:3rem; display:block; margin-bottom:.5rem; }
  .celebration p { font-weight:700; font-size:1.2rem; }
  .cr { text-align:center; padding:.5rem; font-size:.75rem; color:var(--text-secondary); }
</style>
