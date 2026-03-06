<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { fade, fly } from 'svelte/transition';

  import FingerTapping from '$lib/components/FingerTapping.svelte';
  import TracingPaths from '$lib/components/TracingPaths.svelte';
  import PatternCopy from '$lib/components/PatternCopy.svelte';
  import ConnectDots from '$lib/components/ConnectDots.svelte';
  import PinchSpread from '$lib/components/PinchSpread.svelte';
  import DrawingChallenge from '$lib/components/DrawingChallenge.svelte';

  const EXERCISES = [
    { id: 'tapping', icon: '👆', key: 'fineMotor.tapping' },
    { id: 'tracing', icon: '✏️', key: 'fineMotor.tracing' },
    { id: 'pattern', icon: '🔵', key: 'fineMotor.pattern' },
    { id: 'connect', icon: '🔗', key: 'fineMotor.connect' },
    { id: 'pinch', icon: '🤏', key: 'fineMotor.pinch' },
    { id: 'drawing', icon: '🎨', key: 'fineMotor.drawing' },
  ];

  let activeExercise = $state(null);
  let progress = $state(loadProgress());

  function loadProgress() {
    if (typeof localStorage === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('fine-motor-progress') || '{}');
    } catch { return {}; }
  }

  function saveProgress(p) {
    progress = p;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fine-motor-progress', JSON.stringify(p));
    }
  }

  function getStars(exerciseId) {
    return progress[exerciseId]?.stars || 0;
  }

  function getBest(exerciseId) {
    return progress[exerciseId]?.best || null;
  }

  function handleComplete(detail) {
    const { exerciseId, stars, score } = detail;
    const current = progress[exerciseId] || { stars: 0, best: null };
    const newStars = Math.max(current.stars, stars);
    const newBest = current.best === null ? score : Math.max(current.best, score);
    saveProgress({ ...progress, [exerciseId]: { stars: newStars, best: newBest } });
  }

  // Web Audio feedback
  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tap') {
        osc.frequency.value = 600;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.frequency.value = 523;
        gain.gain.value = 0.3;
        osc.start();
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'error') {
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        gain.gain.value = 0.2;
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {}
  }

  function goBack() {
    if (activeExercise) {
      activeExercise = null;
    } else {
      goto(base + '/');
    }
  }
</script>

<WelcomeDialog appId="fine-motor" titleKey="app.fine_motor" purposeKey="welcome.fineMotor.purpose" howKey="welcome.fineMotor.how" goalKey="welcome.fineMotor.goal" icon="✋" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={goBack}>←</button>
    <h1>✋ {$t('fineMotor.title')}</h1>
    {#if activeExercise}
      <span class="exercise-name">{$t(EXERCISES.find(e => e.id === activeExercise)?.key + '.title')}</span>
    {/if}
  </header>

  <main class="cnt">
    {#if !activeExercise}
      <div class="exercise-grid" in:fly={{ y: 20, duration: 300 }}>
        {#each EXERCISES as ex}
          <button class="exercise-card" onclick={() => activeExercise = ex.id}>
            <span class="exercise-icon">{ex.icon}</span>
            <span class="exercise-label">{$t(ex.key + '.title')}</span>
            <div class="stars">
              {#each [1, 2, 3] as s}
                <span class="star" class:earned={getStars(ex.id) >= s}>⭐</span>
              {/each}
            </div>
            {#if getBest(ex.id) !== null}
              <span class="best">{$t('fineMotor.best')}: {getBest(ex.id)}</span>
            {/if}
          </button>
        {/each}
      </div>
    {:else if activeExercise === 'tapping'}
      <FingerTapping {playSound} oncomplete={(e) => handleComplete(e.detail)} />
    {:else if activeExercise === 'tracing'}
      <TracingPaths {playSound} oncomplete={(e) => handleComplete(e.detail)} />
    {:else if activeExercise === 'pattern'}
      <PatternCopy {playSound} oncomplete={(e) => handleComplete(e.detail)} />
    {:else if activeExercise === 'connect'}
      <ConnectDots {playSound} oncomplete={(e) => handleComplete(e.detail)} />
    {:else if activeExercise === 'pinch'}
      <PinchSpread {playSound} oncomplete={(e) => handleComplete(e.detail)} />
    {:else if activeExercise === 'drawing'}
      <DrawingChallenge {playSound} oncomplete={(e) => handleComplete(e.detail)} />
    {/if}
  </main>
</div>

<style>
  .app {
    min-height: 100dvh;
    background: linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%);
    display: flex;
    flex-direction: column;
  }
  .hdr {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    border-bottom: 2px solid #c8e6c9;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .back {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
  }
  .back:hover { background: #e0e0e0; }
  h1 { font-size: 1.3rem; margin: 0; }
  .exercise-name {
    margin-left: auto;
    font-size: 0.9rem;
    color: #666;
  }
  .cnt {
    flex: 1;
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }
  .exercise-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
  .exercise-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 1rem;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .exercise-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    border-color: #66bb6a;
  }
  .exercise-card:active { transform: scale(0.97); }
  .exercise-icon { font-size: 2.5rem; }
  .exercise-label {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    color: #333;
  }
  .stars { display: flex; gap: 2px; }
  .star { font-size: 1rem; opacity: 0.2; transition: opacity 0.3s; }
  .star.earned { opacity: 1; }
  .best {
    font-size: 0.75rem;
    color: #888;
    margin-top: -0.25rem;
  }
</style>
