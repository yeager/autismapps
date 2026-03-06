<script lang="ts">
  /**
   * ProsodyTrainer — Main prosody training component
   * 5 levels: stress (2-syl), stress (3-syl), intonation, emotion, full sentences
   */
  import { createEventDispatcher } from 'svelte';
  import PitchContour from './PitchContour.svelte';
  import StressPattern from './StressPattern.svelte';
  import RhythmBeats from './RhythmBeats.svelte';
  import {
    twoSyllableWords,
    threeSyllableWords,
    intonationSentences,
    emotionData,
    fullSentences,
    rhythmPatterns,
    LEVELS,
  } from '$lib/data/prosody-data.js';

  export let t: (key: string, params?: Record<string, string>) => string = (k) => k;
  export let speak: (text: string, opts?: { rate?: number }) => Promise<void> = async () => {};

  const dispatch = createEventDispatcher();

  type View = 'levels' | 'exercise' | 'rhythm';

  let view: View = 'levels';
  let currentLevel = 1;
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let showAnswer = false;
  let selectedStress = -1;
  let selectedType: string = '';
  let isPlaying = false;
  let bpm = 80;
  let rhythmIndex = 0;

  let pitchContourRef: PitchContour;
  let rhythmRef: RhythmBeats;

  // Get current data for level
  $: levelData = getLevelData(currentLevel, currentIndex);

  function getLevelData(level: number, idx: number) {
    switch (level) {
      case 1: {
        const w = twoSyllableWords[idx % twoSyllableWords.length];
        return { ...w, kind: 'stress' as const };
      }
      case 2: {
        const w = threeSyllableWords[idx % threeSyllableWords.length];
        return { ...w, kind: 'stress' as const };
      }
      case 3: {
        const s = intonationSentences[idx % intonationSentences.length];
        return { ...s, kind: 'intonation' as const };
      }
      case 4: {
        const e = emotionData[idx % emotionData.length];
        return { ...e, kind: 'emotion' as const, text: e.sentence };
      }
      case 5: {
        const f = fullSentences[idx % fullSentences.length];
        return { ...f, kind: 'fullSentence' as const };
      }
      default:
        return { kind: 'stress' as const, word: '', syllables: [], stress: 0, icon: '' };
    }
  }

  function getItemCount(level: number) {
    switch (level) {
      case 1: return twoSyllableWords.length;
      case 2: return threeSyllableWords.length;
      case 3: return intonationSentences.length;
      case 4: return emotionData.length;
      case 5: return fullSentences.length;
      default: return 0;
    }
  }

  function selectLevel(id: number) {
    currentLevel = id;
    currentIndex = 0;
    score = 0;
    streak = 0;
    showAnswer = false;
    selectedStress = -1;
    selectedType = '';
    view = 'exercise';
  }

  function openRhythm() {
    rhythmIndex = 0;
    view = 'rhythm';
  }

  function handleStressSelect(e: CustomEvent<{ index: number; correct: boolean }>) {
    selectedStress = e.detail.index;
    showAnswer = true;
    if (e.detail.correct) {
      score++;
      streak++;
    } else {
      streak = 0;
    }
  }

  function handleIntonationGuess(guess: string) {
    selectedType = guess;
    showAnswer = true;
    const data = levelData as any;
    if (guess === data.type) {
      score++;
      streak++;
    } else {
      streak = 0;
    }
  }

  function nextItem() {
    const count = getItemCount(currentLevel);
    currentIndex = (currentIndex + 1) % count;
    showAnswer = false;
    selectedStress = -1;
    selectedType = '';
  }

  function nextRhythm() {
    rhythmIndex = (rhythmIndex + 1) % rhythmPatterns.length;
    if (rhythmRef) rhythmRef.stop();
  }

  async function playTTS(text: string) {
    if (isPlaying) return;
    isPlaying = true;
    try {
      await speak(text, { rate: 0.7 });
    } catch {
      // TTS not available
    }
    isPlaying = false;
  }

  function goBack() {
    if (view !== 'levels') {
      if (rhythmRef) rhythmRef.stop();
      view = 'levels';
    } else {
      dispatch('back');
    }
  }
</script>

<div class="prosody-app">
  <header class="hdr">
    <button class="back" on:click={goBack}>←</button>
    <h1>🎶 {t('prosody.title')}</h1>
    {#if view === 'exercise'}
      <span class="score-badge">{t('prosody.score')}: {score}</span>
    {/if}
  </header>

  <main class="cnt">
    {#if view === 'levels'}
      <!-- Level select menu -->
      <p class="intro">{t('prosody.intro')}</p>

      <div class="level-grid">
        {#each LEVELS as level}
          <button class="level-card" on:click={() => selectLevel(level.id)}>
            <span class="level-icon">{level.icon}</span>
            <div class="level-info">
              <span class="level-name">{t(level.titleKey)}</span>
              <span class="level-desc">{t(level.descKey)}</span>
            </div>
            <span class="level-arrow">→</span>
          </button>
        {/each}

        <!-- Rhythm bonus section -->
        <button class="level-card rhythm-card" on:click={openRhythm}>
          <span class="level-icon">🥁</span>
          <div class="level-info">
            <span class="level-name">{t('prosody.rhythm.title')}</span>
            <span class="level-desc">{t('prosody.rhythm.desc')}</span>
          </div>
          <span class="level-arrow">→</span>
        </button>
      </div>

    {:else if view === 'rhythm'}
      <!-- Rhythm exercise -->
      {@const rp = rhythmPatterns[rhythmIndex]}
      <div class="exercise-card">
        <div class="exercise-header">
          <span class="ex-icon">{rp.icon}</span>
          <span class="ex-text">{rp.text}</span>
        </div>
        <button class="btn listen-btn" on:click={() => playTTS(rp.text)} disabled={isPlaying}>
          🔊 {t('prosody.listen')}
        </button>
        <RhythmBeats
          bind:this={rhythmRef}
          beats={rp.beats}
          pattern={rp.pattern}
          bind:bpm
        />
        <button class="btn next-btn" on:click={nextRhythm}>
          {t('prosody.next')} →
        </button>
      </div>

    {:else if view === 'exercise'}
      <!-- Exercise view based on level -->
      <div class="progress-row">
        <span class="progress-text">
          {t('prosody.level')} {currentLevel} · {currentIndex + 1}/{getItemCount(currentLevel)}
        </span>
        {#if streak >= 3}
          <span class="streak-badge">🔥 {streak}</span>
        {/if}
      </div>

      {#if currentLevel <= 2}
        <!-- Stress pattern exercise -->
        {@const data = levelData as any}
        <div class="exercise-card">
          <div class="exercise-header">
            <span class="ex-icon">{data.icon}</span>
            <span class="ex-word">{data.word}</span>
          </div>
          <button class="btn listen-btn" on:click={() => playTTS(data.word)} disabled={isPlaying}>
            🔊 {t('prosody.listen')}
          </button>
          <p class="instruction">{t('prosody.stress.instruction')}</p>
          <StressPattern
            syllables={data.syllables}
            stressIndex={data.stress}
            {showAnswer}
            selectedIndex={selectedStress}
            on:select={handleStressSelect}
          />
          {#if showAnswer}
            <p class="result" class:success={selectedStress === data.stress}>
              {selectedStress === data.stress ? t('prosody.correct') : t('prosody.tryAgain')}
            </p>
          {/if}
          <button class="btn next-btn" on:click={nextItem}>
            {t('prosody.next')} →
          </button>
        </div>

      {:else if currentLevel === 3}
        <!-- Intonation exercise: listen and identify type -->
        {@const data = levelData as any}
        <div class="exercise-card">
          <div class="exercise-header">
            <span class="ex-icon">{data.icon}</span>
            <span class="ex-text">{data.text}</span>
          </div>
          <PitchContour
            bind:this={pitchContourRef}
            contour={data.contour}
            type={data.type}
            animate={true}
          />
          <button class="btn listen-btn" on:click={() => playTTS(data.text)} disabled={isPlaying}>
            🔊 {t('prosody.listen')}
          </button>
          <p class="instruction">{t('prosody.intonation.instruction')}</p>
          <div class="type-picker">
            <button
              class="type-btn"
              class:correct={showAnswer && data.type === 'statement'}
              class:wrong={showAnswer && selectedType === 'statement' && data.type !== 'statement'}
              class:selected={selectedType === 'statement'}
              on:click={() => !showAnswer && handleIntonationGuess('statement')}
              disabled={showAnswer}
            >
              📝 {t('prosody.statement')}
            </button>
            <button
              class="type-btn"
              class:correct={showAnswer && data.type === 'question'}
              class:wrong={showAnswer && selectedType === 'question' && data.type !== 'question'}
              class:selected={selectedType === 'question'}
              on:click={() => !showAnswer && handleIntonationGuess('question')}
              disabled={showAnswer}
            >
              ❓ {t('prosody.question')}
            </button>
            <button
              class="type-btn"
              class:correct={showAnswer && data.type === 'exclamation'}
              class:wrong={showAnswer && selectedType === 'exclamation' && data.type !== 'exclamation'}
              class:selected={selectedType === 'exclamation'}
              on:click={() => !showAnswer && handleIntonationGuess('exclamation')}
              disabled={showAnswer}
            >
              ❗ {t('prosody.exclamation')}
            </button>
          </div>
          {#if showAnswer}
            <p class="result" class:success={selectedType === data.type}>
              {selectedType === data.type ? t('prosody.correct') : t('prosody.tryAgain')}
            </p>
          {/if}
          <button class="btn next-btn" on:click={nextItem}>
            {t('prosody.next')} →
          </button>
        </div>

      {:else if currentLevel === 4}
        <!-- Emotion expression -->
        {@const data = levelData as any}
        <div class="exercise-card">
          <div class="exercise-header">
            <span class="ex-icon emotion-icon">{data.icon}</span>
            <span class="ex-emotion">{t(`prosody.emotion.${data.emotion}`)}</span>
          </div>
          <p class="ex-sentence">{data.text}</p>
          <PitchContour
            bind:this={pitchContourRef}
            contour={data.contour}
            type="emotion"
            animate={true}
          />
          <button class="btn listen-btn" on:click={() => playTTS(data.text)} disabled={isPlaying}>
            🔊 {t('prosody.listen')}
          </button>
          <p class="instruction">{t('prosody.emotion.instruction')}</p>
          <div class="emotion-hint">
            <span class="hint-label">{t('prosody.emotion.hint')}:</span>
            {#if data.emotion === 'glad'}
              {t('prosody.emotion.hint.glad')}
            {:else if data.emotion === 'ledsen'}
              {t('prosody.emotion.hint.ledsen')}
            {:else if data.emotion === 'arg'}
              {t('prosody.emotion.hint.arg')}
            {:else if data.emotion === 'förvånad'}
              {t('prosody.emotion.hint.förvånad')}
            {/if}
          </div>
          <button class="btn next-btn" on:click={nextItem}>
            {t('prosody.next')} →
          </button>
        </div>

      {:else if currentLevel === 5}
        <!-- Full sentences -->
        {@const data = levelData as any}
        <div class="exercise-card">
          <div class="exercise-header">
            <span class="ex-icon">{data.icon}</span>
            <span class="ex-text">{data.text}</span>
            <span class="type-badge">
              {data.type === 'question' ? '❓' : data.type === 'exclamation' ? '❗' : '📝'}
            </span>
          </div>
          <PitchContour
            bind:this={pitchContourRef}
            contour={data.contour}
            type={data.type}
            animate={true}
          />
          <button class="btn listen-btn" on:click={() => playTTS(data.text)} disabled={isPlaying}>
            🔊 {t('prosody.listen')}
          </button>
          <p class="instruction">{t('prosody.fullSentence.instruction')}</p>
          <button class="btn next-btn" on:click={nextItem}>
            {t('prosody.next')} →
          </button>
        </div>
      {/if}
    {/if}
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .prosody-app {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg, #fafafa);
    color: var(--text, #333);
  }

  .hdr {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-card, #fff);
    border-bottom: 1px solid var(--border, #e0e0e0);
  }

  .back {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text, #333);
    min-width: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 1.4rem;
    margin: 0;
    flex: 1;
  }

  .score-badge {
    background: #E91E63;
    color: #fff;
    padding: 0.3rem 0.7rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .cnt {
    flex: 1;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .intro {
    text-align: center;
    color: var(--text-secondary, #666);
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  /* Level grid */
  .level-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .level-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.2rem;
    border: 2px solid var(--border, #e0e0e0);
    border-radius: 16px;
    background: var(--bg-card, #fff);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }

  .level-card:hover {
    border-color: #9B59B6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .level-card:active {
    transform: scale(0.98);
  }

  .rhythm-card {
    border-color: #E67E22;
    margin-top: 0.5rem;
  }

  .level-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .level-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
  }

  .level-name {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .level-desc {
    font-size: 0.85rem;
    color: var(--text-secondary, #666);
  }

  .level-arrow {
    font-size: 1.3rem;
    color: var(--text-secondary, #999);
  }

  /* Progress row */
  .progress-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }

  .progress-text {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
  }

  .streak-badge {
    font-weight: 700;
    font-size: 1rem;
  }

  /* Exercise card */
  .exercise-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }

  .exercise-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    background: var(--bg-card, #fff);
    border-radius: 20px;
    border: 2px solid var(--border, #e0e0e0);
    width: 100%;
    text-align: center;
  }

  .ex-icon {
    font-size: 3rem;
  }

  .emotion-icon {
    font-size: 4rem;
  }

  .ex-word {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .ex-text {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.4;
  }

  .ex-emotion {
    font-size: 1.6rem;
    font-weight: 700;
    text-transform: capitalize;
  }

  .ex-sentence {
    font-size: 1.3rem;
    font-style: italic;
    text-align: center;
    color: var(--text-secondary, #555);
    margin: 0;
  }

  .type-badge {
    font-size: 1.5rem;
  }

  .instruction {
    text-align: center;
    font-size: 1rem;
    color: var(--text-secondary, #666);
    font-style: italic;
    margin: 0;
  }

  /* Buttons */
  .btn {
    padding: 0.7rem 1.2rem;
    border-radius: 14px;
    border: 2px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;
    min-height: 48px;
    transition: all 0.15s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .listen-btn {
    background: #2ECC71;
    color: #fff;
    border-color: #2ECC71;
    font-size: 1.1rem;
  }

  .listen-btn:hover:not(:disabled) {
    background: #27AE60;
  }

  .next-btn {
    background: #3498DB;
    color: #fff;
    border-color: #3498DB;
  }

  .next-btn:hover {
    background: #2980B9;
  }

  /* Type picker (intonation guessing) */
  .type-picker {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .type-btn {
    padding: 0.7rem 1rem;
    border-radius: 14px;
    border: 3px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 48px;
    transition: all 0.2s;
  }

  .type-btn:hover:not(:disabled) {
    border-color: #9B59B6;
    transform: scale(1.03);
  }

  .type-btn.selected {
    border-color: #9B59B6;
    background: rgba(155, 89, 182, 0.1);
  }

  .type-btn.correct {
    border-color: #2ECC71;
    background: #2ECC71;
    color: #fff;
  }

  .type-btn.wrong {
    border-color: #E74C3C;
    background: #E74C3C;
    color: #fff;
  }

  .type-btn:disabled {
    cursor: default;
  }

  /* Result */
  .result {
    font-size: 1.3rem;
    font-weight: 700;
    text-align: center;
    margin: 0;
  }

  .result.success {
    color: #2ECC71;
  }

  .result:not(.success) {
    color: #E74C3C;
  }

  /* Emotion hint */
  .emotion-hint {
    padding: 0.8rem;
    background: var(--bg-card, #f8f9fa);
    border-radius: 12px;
    border: 1px solid var(--border, #e0e0e0);
    text-align: center;
    font-size: 0.95rem;
    width: 100%;
  }

  .hint-label {
    font-weight: 700;
    color: #9B59B6;
  }

  /* Footer */
  .cr {
    text-align: center;
    padding: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-secondary, #999);
  }

  @media (prefers-color-scheme: dark) {
    .exercise-header {
      background: var(--bg-card, #1e1e2e);
    }
    .emotion-hint {
      background: var(--bg-card, #313244);
    }
  }
</style>
