<script lang="ts">
  /**
   * MelodyTherapy — Main component for Melodisk Intonationsterapi (MIT)
   *
   * Implements the 4-step MIT protocol:
   * 1. Humming — hum the melody (no words)
   * 2. Singing — sing phrase with melody
   * 3. Sprechgesang — rhythmic speech with melody hints
   * 4. Speaking — say the phrase normally
   *
   * Uses Web Audio API for tone generation and Piper TTS for speech.
   */
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly } from 'svelte/transition';
  import { browser } from '$app/environment';

  import MelodyDisplay from './MelodyDisplay.svelte';
  import StepProgress from './StepProgress.svelte';
  import HandTap from './HandTap.svelte';
  import {
    phrases,
    CATEGORIES,
    MIT_STEPS,
    NOTE_FREQ,
    getPhrasesByCategory,
    getArasaacUrl,
  } from '$lib/data/mit-phrases.js';

  // ─── State ───
  let selectedCategory = $state<string | null>(null);
  let selectedPhraseIdx = $state(0);
  let currentStepIdx = $state(0);
  let isPlaying = $state(false);
  let activeNoteIndex = $state(-1);
  let tempo = $state(70); // BPM

  // Progress tracking (persisted)
  let completedSteps = $state<Set<string>>(new Set());

  // Load progress from localStorage on mount
  if (browser) {
    try {
      const saved = localStorage.getItem('mit-progress');
      if (saved) completedSteps = new Set(JSON.parse(saved));
    } catch {}
  }

  function saveProgress() {
    if (browser) {
      localStorage.setItem('mit-progress', JSON.stringify([...completedSteps]));
    }
  }

  // ─── Derived ───
  const categoryPhrases = $derived(
    selectedCategory ? getPhrasesByCategory(selectedCategory) : []
  );
  const currentPhrase = $derived(
    categoryPhrases.length > 0 ? categoryPhrases[selectedPhraseIdx] : null
  );
  const currentStep = $derived(MIT_STEPS[currentStepIdx]);
  const totalStars = $derived(completedSteps.size);

  // ─── Audio Context (Web Audio API) ───
  let audioCtx: AudioContext | null = null;

  function getAudioContext(): AudioContext {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Play melody using Web Audio API oscillator
   * @param melody Array of { note, duration }
   * @param withHumming If true, play softer/more muffled (humming simulation)
   */
  async function playMelody(
    melody: { note: string; duration: number }[],
    options: { humming?: boolean; fadeVolume?: number } = {}
  ): Promise<void> {
    const ctx = getAudioContext();
    const beatDuration = 60 / tempo;
    let time = ctx.currentTime + 0.05;
    const { humming = false, fadeVolume = 1.0 } = options;

    for (let i = 0; i < melody.length; i++) {
      const { note, duration } = melody[i];
      const freq = NOTE_FREQ[note as keyof typeof NOTE_FREQ] || 261.63;
      const noteDur = duration * beatDuration;

      // Create oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = humming ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Gentle envelope
      const vol = humming ? 0.15 * fadeVolume : 0.25 * fadeVolume;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.03);
      gain.gain.setValueAtTime(vol, time + noteDur - 0.05);
      gain.gain.linearRampToValueAtTime(0, time + noteDur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + noteDur);

      // Schedule note highlighting
      const noteIdx = i;
      const delay = (time - ctx.currentTime) * 1000;
      setTimeout(() => { activeNoteIndex = noteIdx; }, Math.max(0, delay));

      time += noteDur;
    }

    // Wait for melody to finish
    const totalDuration = melody.reduce((sum, m) => sum + m.duration * beatDuration, 0);
    await new Promise((r) => setTimeout(r, totalDuration * 1000 + 100));
    activeNoteIndex = -1;
  }

  /**
   * Play the current step for the current phrase
   */
  async function playCurrentStep() {
    if (!currentPhrase || isPlaying) return;
    isPlaying = true;

    try {
      const step = MIT_STEPS[currentStepIdx];

      switch (step.id) {
        case 'humming':
          // Pure melody, no words
          await playMelody(currentPhrase.melody, { humming: true });
          break;

        case 'singing':
          // Melody with words (play melody + TTS together)
          await playMelody(currentPhrase.melody, { humming: false });
          break;

        case 'sprechgesang':
          // Quieter melody + speech
          playMelody(currentPhrase.melody, { fadeVolume: 0.3 });
          await speak(currentPhrase.text, { rate: 0.4 });
          break;

        case 'speaking':
          // Just speech, no melody
          await speak(currentPhrase.text, { rate: 0.5 });
          break;
      }

      // Mark step as completed
      const stepKey = `${currentPhrase.id}-${step.id}`;
      completedSteps = new Set([...completedSteps, stepKey]);
      saveProgress();
    } catch (err) {
      console.error('Playback error:', err);
    } finally {
      isPlaying = false;
      activeNoteIndex = -1;
    }
  }

  // ─── Navigation ───
  function selectCategory(catId: string) {
    selectedCategory = catId;
    selectedPhraseIdx = 0;
    currentStepIdx = 0;
  }

  function goBack() {
    if (currentPhrase) {
      // If on a phrase, go back to phrase list
      selectedPhraseIdx = 0;
      currentStepIdx = 0;
      selectedCategory = selectedCategory; // stay in category
    } else if (selectedCategory) {
      selectedCategory = null;
    } else {
      goto(base + '/');
    }
  }

  function nextPhrase() {
    if (selectedPhraseIdx < categoryPhrases.length - 1) {
      selectedPhraseIdx++;
      currentStepIdx = 0;
    }
  }

  function prevPhrase() {
    if (selectedPhraseIdx > 0) {
      selectedPhraseIdx--;
      currentStepIdx = 0;
    }
  }

  function nextStep() {
    if (currentStepIdx < MIT_STEPS.length - 1) {
      currentStepIdx++;
    }
  }

  function prevStep() {
    if (currentStepIdx > 0) {
      currentStepIdx--;
    }
  }

  /**
   * Count completed steps for a specific phrase
   */
  function phraseStarCount(phraseId: string): number {
    return MIT_STEPS.filter((s) => completedSteps.has(`${phraseId}-${s.id}`)).length;
  }
</script>

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={goBack} aria-label="Tillbaka">←</button>
    <h1>🎵 {$t('melodyTherapy.title')}</h1>
    <div class="star-count" aria-label="{totalStars} stjärnor">⭐ {totalStars}</div>
  </header>

  <main class="cnt">
    {#if !selectedCategory}
      <!-- Category selection -->
      <p class="intro">{$t('melodyTherapy.intro')}</p>

      <div class="categories" in:fade>
        {#each CATEGORIES as cat}
          {@const catPhrases = getPhrasesByCategory(cat.id)}
          {@const catStars = catPhrases.reduce((sum, p) => sum + phraseStarCount(p.id), 0)}
          {@const catMaxStars = catPhrases.length * 4}

          <button
            class="cat-card"
            style="--cat-color: {cat.color}"
            onclick={() => selectCategory(cat.id)}
          >
            <span class="cat-icon">{cat.icon}</span>
            <div class="cat-info">
              <span class="cat-name">{$t(cat.labelKey)}</span>
              <span class="cat-count">{catPhrases.length} {$t('melodyTherapy.phrases')}</span>
            </div>
            <div class="cat-stars">
              ⭐ {catStars}/{catMaxStars}
            </div>
          </button>
        {/each}
      </div>

    {:else if currentPhrase}
      <!-- Phrase practice view -->
      <div class="practice" in:fly={{ y: 20, duration: 300 }}>
        <!-- Phrase navigation -->
        <div class="phrase-nav">
          <button class="nav-btn" onclick={prevPhrase} disabled={selectedPhraseIdx === 0}>⬅️</button>
          <span class="phrase-counter">{selectedPhraseIdx + 1} / {categoryPhrases.length}</span>
          <button class="nav-btn" onclick={nextPhrase} disabled={selectedPhraseIdx >= categoryPhrases.length - 1}>➡️</button>
        </div>

        <!-- Phrase card -->
        <div class="phrase-card">
          <img
            class="phrase-pic"
            src={getArasaacUrl(currentPhrase.arasaacId)}
            alt={currentPhrase.text}
            loading="lazy"
          />
          <div class="phrase-text">{currentPhrase.text}</div>
          <div class="phrase-stars">
            {#each MIT_STEPS as step}
              {@const done = completedSteps.has(`${currentPhrase.id}-${step.id}`)}
              <span class="mini-star" class:earned={done}>{done ? '⭐' : '☆'}</span>
            {/each}
          </div>
        </div>

        <!-- Melody visualization -->
        <MelodyDisplay
          melody={currentPhrase.melody}
          syllables={currentPhrase.syllables}
          {activeNoteIndex}
          stepId={currentStep.id}
        />

        <!-- Step progress -->
        <StepProgress
          steps={MIT_STEPS}
          currentStepIndex={currentStepIdx}
          {completedSteps}
          phraseId={currentPhrase.id}
          onStepSelect={(i) => currentStepIdx = i}
        />

        <!-- Current step description -->
        <p class="step-desc">{$t(currentStep.descKey)}</p>

        <!-- Play area with hand tap -->
        <div class="play-area">
          <HandTap
            {isPlaying}
            {tempo}
            noteCount={currentPhrase.melody.length}
          />

          <button
            class="play-btn"
            onclick={playCurrentStep}
            disabled={isPlaying}
            style="--step-color: {currentStep.color}"
          >
            {#if isPlaying}
              <span class="playing-icon">🔊</span>
              <span>{$t('melodyTherapy.playing')}</span>
            {:else}
              <span class="play-icon">▶️</span>
              <span>{$t('melodyTherapy.play')} — {$t(currentStep.labelKey)}</span>
            {/if}
          </button>
        </div>

        <!-- Tempo control -->
        <div class="tempo-control">
          <label>{$t('melodyTherapy.tempo')}: {tempo} BPM</label>
          <input type="range" min="40" max="100" step="5" bind:value={tempo} />
          <div class="tempo-labels">
            <span>🐢</span>
            <span>🐇</span>
          </div>
        </div>

        <!-- Step navigation -->
        <div class="step-nav">
          <button class="btn" onclick={prevStep} disabled={currentStepIdx === 0}>
            ← {$t('melodyTherapy.prevStep')}
          </button>
          <button
            class="btn next-btn"
            onclick={nextStep}
            disabled={currentStepIdx >= MIT_STEPS.length - 1}
            style="--step-color: {MIT_STEPS[Math.min(currentStepIdx + 1, MIT_STEPS.length - 1)].color}"
          >
            {$t('melodyTherapy.nextStep')} →
          </button>
        </div>
      </div>

    {:else}
      <!-- Phrase list for selected category -->
      <div class="phrase-list" in:fade>
        <h2 class="cat-title">
          {$t(CATEGORIES.find(c => c.id === selectedCategory)?.labelKey || '')}
        </h2>
        {#each categoryPhrases as phrase, i}
          <button
            class="phrase-list-item"
            onclick={() => { selectedPhraseIdx = i; currentStepIdx = 0; }}
          >
            <img
              class="phrase-list-pic"
              src={getArasaacUrl(phrase.arasaacId)}
              alt={phrase.text}
              loading="lazy"
            />
            <span class="phrase-list-text">{phrase.text}</span>
            <div class="phrase-list-stars">
              {#each MIT_STEPS as step}
                {@const done = completedSteps.has(`${phrase.id}-${step.id}`)}
                <span class="tiny-star">{done ? '⭐' : '☆'}</span>
              {/each}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  /* ─── Layout ─── */
  .app { min-height: 100dvh; display: flex; flex-direction: column; background: var(--bg, #f5f5f5); color: var(--text, #333); }
  .hdr { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--bg-card, #fff); border-bottom: 1px solid var(--border, #e0e0e0); }
  .back { font-size: 1.5rem; background: none; border: none; cursor: pointer; color: var(--text); min-width: 48px; min-height: 48px; display: flex; align-items: center; justify-content: center; }
  h1 { font-size: 1.4rem; margin: 0; flex: 1; }
  .star-count { font-size: 1rem; font-weight: 700; background: linear-gradient(135deg, #F1C40F, #E67E22); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .cnt { flex: 1; padding: 1rem; max-width: 600px; margin: 0 auto; width: 100%; }
  .intro { text-align: center; color: var(--text-secondary, #777); margin-bottom: 1rem; font-size: 1.05rem; }
  .cr { text-align: center; padding: 0.5rem; font-size: 0.75rem; color: var(--text-secondary, #777); }

  /* ─── Categories ─── */
  .categories { display: flex; flex-direction: column; gap: 0.75rem; }
  .cat-card { display: flex; align-items: center; gap: 1rem; padding: 1.2rem; border: 2px solid var(--border, #e0e0e0); border-radius: 16px; background: var(--bg-card, #fff); cursor: pointer; min-height: 64px; transition: all 0.2s; border-left: 5px solid var(--cat-color); }
  .cat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .cat-card:active { transform: scale(0.98); }
  .cat-icon { font-size: 2rem; }
  .cat-info { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
  .cat-name { font-weight: 700; font-size: 1.15rem; }
  .cat-count { font-size: 0.85rem; color: var(--text-secondary, #777); }
  .cat-stars { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }

  /* ─── Phrase List ─── */
  .phrase-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .cat-title { text-align: center; margin: 0 0 1rem; font-size: 1.3rem; }
  .phrase-list-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem; border: 2px solid var(--border, #e0e0e0); border-radius: 12px; background: var(--bg-card, #fff); cursor: pointer; min-height: 56px; }
  .phrase-list-item:active { transform: scale(0.98); }
  .phrase-list-pic { width: 48px; height: 48px; object-fit: contain; border-radius: 8px; }
  .phrase-list-text { flex: 1; font-weight: 600; font-size: 1.1rem; text-align: left; }
  .phrase-list-stars { display: flex; gap: 2px; }
  .tiny-star { font-size: 0.7rem; }

  /* ─── Practice View ─── */
  .practice { display: flex; flex-direction: column; align-items: center; gap: 1rem; }

  .phrase-nav { display: flex; align-items: center; gap: 1rem; }
  .nav-btn { width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--border); background: var(--bg-card); font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .nav-btn:disabled { opacity: 0.3; }
  .phrase-counter { font-weight: 700; font-size: 1rem; }

  .phrase-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem; background: var(--bg-card, #fff); border-radius: 20px; border: 2px solid var(--border, #e0e0e0); width: 100%; }
  .phrase-pic { width: 100px; height: 100px; object-fit: contain; border-radius: 12px; }
  .phrase-text { font-size: 2rem; font-weight: 800; letter-spacing: 2px; text-align: center; }
  .phrase-stars { display: flex; gap: 4px; }
  .mini-star { font-size: 1.2rem; transition: transform 0.3s; }
  .mini-star.earned { transform: scale(1.2); }

  .step-desc { text-align: center; font-size: 0.95rem; color: var(--text-secondary, #777); font-style: italic; margin: 0; }

  /* ─── Play Area ─── */
  .play-area { display: flex; align-items: center; gap: 1rem; justify-content: center; width: 100%; }
  .play-btn { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; border-radius: 16px; border: 3px solid var(--step-color); background: var(--step-color); color: #fff; font-size: 1.1rem; font-weight: 700; cursor: pointer; min-height: 56px; transition: all 0.2s; flex: 1; max-width: 320px; justify-content: center; }
  .play-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px color-mix(in srgb, var(--step-color) 40%, transparent); }
  .play-btn:active:not(:disabled) { transform: scale(0.97); }
  .play-btn:disabled { opacity: 0.7; cursor: wait; }
  .play-icon { font-size: 1.3rem; }
  .playing-icon { font-size: 1.3rem; animation: pulse 0.8s ease-in-out infinite alternate; }

  @keyframes pulse {
    from { opacity: 0.6; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1.1); }
  }

  /* ─── Tempo ─── */
  .tempo-control { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; width: 100%; }
  .tempo-control label { font-weight: 600; font-size: 0.9rem; }
  .tempo-control input[type="range"] { width: 70%; accent-color: #9B59B6; }
  .tempo-labels { display: flex; justify-content: space-between; width: 70%; font-size: 0.8rem; }

  /* ─── Step Nav ─── */
  .step-nav { display: flex; gap: 1rem; width: 100%; justify-content: center; }
  .btn { padding: 0.7rem 1rem; border-radius: 12px; border: 2px solid var(--border, #e0e0e0); background: var(--bg-card, #fff); font-size: 0.95rem; cursor: pointer; font-weight: 600; min-height: 48px; }
  .btn:disabled { opacity: 0.4; }
  .next-btn { background: var(--step-color); color: #fff; border-color: var(--step-color); }

  /* ─── Dark Mode ─── */
  @media (prefers-color-scheme: dark) {
    .cat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  }
</style>
