<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import { awardStar, GoldStarBurst } from '$lib/rewards';

  // === MUNGYMNASTIKEN — Mouth Gym ===
  // Animated visual guides for oral motor exercises
  // Based on PROMPT therapy principles:
  // - Hierarchical motor control (jaw → lips → tongue)
  // - Tactile-kinesthetic awareness
  // - Graded movement complexity

  type Category = 'tongue' | 'lips' | 'jaw' | 'breath';

  interface Exercise {
    id: string;
    category: Category;
    name: string;
    icon: string;
    steps: { instruction: string; animation: string; holdSeconds: number }[];
    reps: number;
  }

  const EXERCISES: Exercise[] = [
    // Tongue exercises
    { id: 'tongue-up', category: 'tongue', name: 'Tungan upp', icon: '👅', reps: 5, steps: [
      { instruction: 'Öppna munnen stort', animation: '😮', holdSeconds: 0 },
      { instruction: 'Lyft tungspetsen till gommen', animation: '👅⬆️', holdSeconds: 3 },
      { instruction: 'Håll kvar! Räkna till 3', animation: '👅✨', holdSeconds: 3 },
      { instruction: 'Släpp ner tungan. Bra!', animation: '😊', holdSeconds: 0 },
    ]},
    { id: 'tongue-side', category: 'tongue', name: 'Tungan åt sidan', icon: '👅', reps: 5, steps: [
      { instruction: 'Öppna munnen lite', animation: '😮', holdSeconds: 0 },
      { instruction: 'Rör tungan åt vänster', animation: '👅⬅️', holdSeconds: 2 },
      { instruction: 'Nu åt höger!', animation: '👅➡️', holdSeconds: 2 },
      { instruction: 'Snabbare! Vänster-höger', animation: '👅↔️', holdSeconds: 0 },
    ]},
    { id: 'tongue-circle', category: 'tongue', name: 'Tungcirkel', icon: '👅', reps: 3, steps: [
      { instruction: 'Stäng munnen', animation: '😶', holdSeconds: 0 },
      { instruction: 'Kör tungan runt innanför kinden', animation: '👅🔄', holdSeconds: 4 },
      { instruction: 'Nu åt andra hållet!', animation: '👅🔃', holdSeconds: 4 },
    ]},
    { id: 'tongue-click', category: 'tongue', name: 'Tungklick', icon: '👅', reps: 10, steps: [
      { instruction: 'Tryck tungan mot gommen', animation: '👅⬆️', holdSeconds: 1 },
      { instruction: 'Klicka! Dra ner snabbt', animation: '👅💥', holdSeconds: 0 },
      { instruction: 'Lyssna på klicket!', animation: '👂✨', holdSeconds: 0 },
    ]},
    // Lip exercises
    { id: 'lip-round', category: 'lips', name: 'Runda läppar', icon: '👄', reps: 5, steps: [
      { instruction: 'Gör läpparna runda som ett O', animation: '😗', holdSeconds: 3 },
      { instruction: 'Dra ut läpparna brett', animation: '😁', holdSeconds: 3 },
      { instruction: 'Runda igen!', animation: '😗', holdSeconds: 3 },
    ]},
    { id: 'lip-pop', category: 'lips', name: 'Läppsmäll', icon: '👄', reps: 8, steps: [
      { instruction: 'Tryck ihop läpparna hårt', animation: '😶', holdSeconds: 1 },
      { instruction: 'Smäll med läpparna!', animation: '👄💥', holdSeconds: 0 },
      { instruction: 'Bra! En gång till', animation: '✨', holdSeconds: 0 },
    ]},
    { id: 'lip-vibrate', category: 'lips', name: 'Brumma', icon: '👄', reps: 5, steps: [
      { instruction: 'Slappna av läpparna', animation: '😌', holdSeconds: 0 },
      { instruction: 'Blås luft — brrrrr!', animation: '👄💨', holdSeconds: 3 },
      { instruction: 'Håll i gång brummandet!', animation: '👄🎵', holdSeconds: 3 },
    ]},
    // Jaw exercises
    { id: 'jaw-open', category: 'jaw', name: 'Gapa stort', icon: '😮', reps: 5, steps: [
      { instruction: 'Öppna munnen så stort du kan', animation: '😮', holdSeconds: 3 },
      { instruction: 'Stäng långsamt', animation: '😶', holdSeconds: 2 },
      { instruction: 'Bra kontroll!', animation: '✨', holdSeconds: 0 },
    ]},
    { id: 'jaw-slide', category: 'jaw', name: 'Käken åt sidan', icon: '😮', reps: 5, steps: [
      { instruction: 'Skjut käken åt vänster', animation: '😶⬅️', holdSeconds: 2 },
      { instruction: 'Tillbaka till mitten', animation: '😶', holdSeconds: 1 },
      { instruction: 'Nu åt höger', animation: '😶➡️', holdSeconds: 2 },
    ]},
    // Breathing exercises
    { id: 'breath-blow', category: 'breath', name: 'Blåsa', icon: '💨', reps: 5, steps: [
      { instruction: 'Andas in djupt genom näsan', animation: '👃💨', holdSeconds: 3 },
      { instruction: 'Blås ut långsamt genom munnen', animation: '😗💨', holdSeconds: 5 },
      { instruction: 'Försök göra det jämnt', animation: '🌬️', holdSeconds: 0 },
    ]},
    { id: 'breath-straw', category: 'breath', name: 'Sugrörspust', icon: '🥤', reps: 5, steps: [
      { instruction: 'Runda läpparna som runt ett sugrör', animation: '😗', holdSeconds: 0 },
      { instruction: 'Blås ut en tunn luftström', animation: '😗💨', holdSeconds: 4 },
      { instruction: 'Försök blåsa ut ett ljus!', animation: '🕯️💨', holdSeconds: 0 },
    ]},
  ];

  const CATEGORIES: { id: Category; icon: string; color: string }[] = [
    { id: 'tongue', icon: '👅', color: '#E74C3C' },
    { id: 'lips', icon: '👄', color: '#E91E63' },
    { id: 'jaw', icon: '😮', color: '#9B59B6' },
    { id: 'breath', icon: '💨', color: '#3498DB' },
  ];

  let selectedCategory = $state<Category | null>(null);
  let selectedExercise = $state<Exercise | null>(null);
  let currentStep = $state(0);
  let currentRep = $state(0);
  let holdTimer = $state(0);
  let holdInterval = $state<number | null>(null);
  let exerciseDone = $state(false);
  let showStar = $state(false);

  const categoryExercises = $derived(selectedCategory ? EXERCISES.filter(e => e.category === selectedCategory) : []);

  function selectExercise(ex: Exercise) {
    selectedExercise = ex;
    currentStep = 0;
    currentRep = 1;
    holdTimer = 0;
    exerciseDone = false;
  }

  function startHold(seconds: number) {
    if (holdInterval) clearInterval(holdInterval);
    holdTimer = seconds;
    holdInterval = setInterval(() => {
      holdTimer--;
      if (holdTimer <= 0) {
        if (holdInterval) clearInterval(holdInterval);
        holdInterval = null;
      }
    }, 1000) as unknown as number;
  }

  function nextStep() {
    if (!selectedExercise) return;
    if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }

    if (currentStep < selectedExercise.steps.length - 1) {
      currentStep++;
      const step = selectedExercise.steps[currentStep];
      if (step.holdSeconds > 0) startHold(step.holdSeconds);
    } else if (currentRep < selectedExercise.reps) {
      currentRep++;
      currentStep = 0;
      const step = selectedExercise.steps[0];
      if (step.holdSeconds > 0) startHold(step.holdSeconds);
    } else {
      exerciseDone = true;
      awardStarAsync();
    }
  }

  function goBack() {
    if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
    if (exerciseDone || selectedExercise) { selectedExercise = null; exerciseDone = false; }
    else if (selectedCategory) { selectedCategory = null; }
    else { goto(base + '/'); }
  }

  async function awardStarAsync() {
    await awardStar('mouth-gym', 'rewards.star.completed');
    showStar = true;
    setTimeout(() => showStar = false, 2000);
  }
</script>

<WelcomeDialog appId="mouth-gym" titleKey="app.mouth_gym" purposeKey="welcome.mouthGym.purpose" howKey="welcome.mouthGym.how" goalKey="welcome.mouthGym.goal" icon="💪" />

<GoldStarBurst show={showStar} />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">
    {#if exerciseDone || selectedExercise}<button class="sub-back" onclick={goBack} aria-label="Tillbaka">←</button>{/if}
    <h1>💪 {$t('mouthGym.title')}</h1>

  </div>

    {#if !selectedCategory}
      <p class="intro">{$t('mouthGym.intro')}</p>
      <p class="mirror-hint">🪞 {$t('mouthGym.mirror')}</p>
      <div class="categories">
        {#each CATEGORIES as cat}
          <button class="cat-card" style="border-color: {cat.color}" onclick={() => selectedCategory = cat.id}>
            <span class="cat-icon">{cat.icon}</span>
            <span class="cat-name">{$t(`mouthGym.category.${cat.id}`)}</span>
            <span class="cat-count">{EXERCISES.filter(e => e.category === cat.id).length}</span>
          </button>
        {/each}
      </div>

    {:else if !selectedExercise}
      <div class="exercise-list">
        {#each categoryExercises as ex}
          <button class="ex-card" onclick={() => selectExercise(ex)}>
            <span class="ex-icon">{ex.icon}</span>
            <span class="ex-name">{ex.name}</span>
            <span class="ex-reps">{ex.reps}x</span>
          </button>
        {/each}
      </div>

    {:else if exerciseDone}
      <div class="done-screen">
        <span class="done-icon">🎉</span>
        <h2>{$t('mouthGym.done')}</h2>
        <button class="btn next-btn" onclick={() => { selectedExercise = null; exerciseDone = false; }}>
          {$t('mouthGym.next')}
        </button>
      </div>

    {:else}
      <div class="exercise-view">
        <div class="ex-header">
          <span class="ex-title">{selectedExercise.name}</span>
          <span class="ex-progress">{$t('mouthGym.reps')}: {currentRep}/{selectedExercise.reps}</span>
        </div>

        <div class="step-display">
          <div class="animation-area">
            <span class="anim">{selectedExercise.steps[currentStep].animation}</span>
          </div>
          <p class="step-instruction">{selectedExercise.steps[currentStep].instruction}</p>
          <span class="step-num">{$t('mouthGym.step')} {currentStep + 1} {$t('mouthGym.of')} {selectedExercise.steps.length}</span>
        </div>

        {#if holdTimer > 0}
          <div class="hold-timer">
            <div class="timer-circle">
              <span class="timer-num">{holdTimer}</span>
            </div>
            <span class="hold-text">{$t('mouthGym.hold')} {holdTimer} {$t('mouthGym.seconds')}</span>
          </div>
        {/if}

        <button class="btn next-step-btn" onclick={nextStep} disabled={holdTimer > 0}>
          {currentStep < selectedExercise.steps.length - 1 ? `${$t('mouthGym.step')} →` : currentRep < selectedExercise.reps ? '🔁 Nästa rep' : '✅ Klar!'}
        </button>
      </div>
    {/if}
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app{min-height:100dvh;display:flex;flex-direction:column;background:var(--bg);color:var(--text)}
  h1{font-size:1.4rem;margin:0;flex:1}
  .cnt{flex:1;padding:1rem;max-width:600px;margin:0 auto;width:100%}
  .intro{text-align:center;color:var(--text-secondary);margin-bottom:.5rem;font-size:1.1rem}
  .mirror-hint{text-align:center;font-size:1rem;color:#E91E63;font-weight:600;margin-bottom:1rem}

  .categories{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .cat-card{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;border:3px solid var(--border);border-radius:20px;background:var(--bg-card);cursor:pointer}
  .cat-card:active{transform:scale(.96)}
  .cat-icon{font-size:3rem} .cat-name{font-weight:700;font-size:1.1rem} .cat-count{font-size:.85rem;color:var(--text-secondary)}

  .exercise-list{display:flex;flex-direction:column;gap:.75rem}
  .ex-card{display:flex;align-items:center;gap:1rem;padding:1.2rem;border:2px solid var(--border);border-radius:16px;background:var(--bg-card);cursor:pointer;min-height:56px}
  .ex-card:active{transform:scale(.97)}
  .ex-icon{font-size:2rem} .ex-name{flex:1;font-weight:600;font-size:1.05rem} .ex-reps{font-size:.85rem;color:var(--text-secondary);font-weight:600}

  .exercise-view{display:flex;flex-direction:column;align-items:center;gap:1.2rem}
  .ex-header{display:flex;justify-content:space-between;width:100%;align-items:center}
  .ex-title{font-weight:700;font-size:1.2rem} .ex-progress{font-size:.9rem;color:var(--text-secondary);font-weight:600}

  .step-display{display:flex;flex-direction:column;align-items:center;gap:.8rem;padding:2rem;background:var(--bg-card);border-radius:24px;border:2px solid var(--border);width:100%}
  .animation-area{width:120px;height:120px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;border:3px solid var(--border)}
  .anim{font-size:3rem}
  .step-instruction{font-size:1.2rem;font-weight:600;text-align:center;line-height:1.4}
  .step-num{font-size:.85rem;color:var(--text-secondary)}

  .hold-timer{display:flex;flex-direction:column;align-items:center;gap:.5rem}
  .timer-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#E91E63,#9C27B0);display:flex;align-items:center;justify-content:center;animation:pulse 1s infinite}
  .timer-num{font-size:2rem;font-weight:900;color:#fff}
  .hold-text{font-weight:600;color:#E91E63}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}

  .btn{padding:.7rem 1.2rem;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);font-size:1rem;cursor:pointer;font-weight:600;min-height:48px}
  .btn:disabled{opacity:.5}
  .next-step-btn{background:#E91E63;color:#fff;border-color:#E91E63;width:100%;font-size:1.1rem}
  .next-btn{background:#3498DB;color:#fff;border-color:#3498DB}

  .done-screen{display:flex;flex-direction:column;align-items:center;gap:1rem;padding:3rem 1rem}
  .done-icon{font-size:5rem}
  .done-screen h2{font-size:1.8rem}

  .cr{text-align:center;padding:.5rem;font-size:.75rem;color:var(--text-secondary)}
</style>
