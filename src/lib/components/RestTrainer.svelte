<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak, stop } from '$lib/tts';
  import { LEVELS, STAR_THRESHOLDS, SPEED_INCREMENT, MIN_SPEED, MAX_SPEED, DEFAULT_SPEED } from '$lib/data/rest-syllables.js';
  import { fade, scale } from 'svelte/transition';

  // === ReST-TRÄNAREN — Rapid Syllable Transition Training ===
  // Helps children with CAS practice smooth transitions between syllables.
  // Focus on prosody: stress, rhythm, timing.
  // DTTC-aligned: model → practice → evaluate

  type View = 'levels' | 'practice' | 'result';

  let view = $state<View>('levels');
  let currentLevelIdx = $state(0);
  let currentSeqIdx = $state(0);
  let speed = $state(DEFAULT_SPEED);
  let attempts = $state(0);
  let stars = $state(0);
  let totalStars = $state(0);
  let completedSequences = $state<Set<string>>(new Set());
  let isPlaying = $state(false);
  let activeSyllableIdx = $state(-1);
  let beatActive = $state(false);
  let showStarAnim = $state(false);
  let speedChallengeRound = $state(0);

  const currentLevel = $derived(LEVELS[currentLevelIdx]);
  const currentSeq = $derived(currentLevel?.sequences[currentSeqIdx]);
  const levelProgress = $derived(
    currentLevel ? currentLevel.sequences.filter(s => completedSequences.has(s.id)).length : 0
  );
  const levelTotal = $derived(currentLevel?.sequences.length ?? 0);

  // Reset speed when entering a level
  function selectLevel(idx: number) {
    currentLevelIdx = idx;
    currentSeqIdx = 0;
    speed = LEVELS[idx].defaultSpeed;
    attempts = 0;
    stars = 0;
    speedChallengeRound = 0;
    view = 'practice';
  }

  function nextSequence() {
    if (currentSeqIdx < currentLevel.sequences.length - 1) {
      currentSeqIdx++;
    } else {
      currentSeqIdx = 0; // Loop back
    }
    attempts = 0;
    stars = 0;
    speedChallengeRound = 0;
    if (currentLevel.speedChallenge) {
      speed = currentLevel.defaultSpeed;
    }
    view = 'practice';
  }

  /**
   * Play the syllable sequence with TTS, animating each syllable in time.
   */
  async function playSequence() {
    if (isPlaying || !currentSeq) return;
    isPlaying = true;
    activeSyllableIdx = -1;

    // Calculate interval between syllables based on speed
    // Lower speed = longer interval
    const baseInterval = 800; // ms at 1.0x
    const interval = baseInterval / Math.max(speed, 0.1);

    // Animate through syllables with beat
    for (let i = 0; i < currentSeq.syllables.length; i++) {
      activeSyllableIdx = i;
      beatActive = true;

      // Speak individual syllable
      const syllable = currentSeq.syllables[i];
      const isStressed = currentSeq.stress[i] === 1;
      // Stressed syllables are spoken slightly slower/louder (simulated with lower rate)
      const syllableRate = isStressed ? speed * 0.8 : speed;
      await speak(syllable, { rate: syllableRate });

      beatActive = false;

      // Wait between syllables (unless it's the last one)
      if (i < currentSeq.syllables.length - 1) {
        await new Promise(r => setTimeout(r, Math.min(interval * 0.3, 400)));
      }
    }

    // Small pause, then speak the whole sequence together
    await new Promise(r => setTimeout(r, 300));
    activeSyllableIdx = -1;

    const fullText = currentSeq.syllables.join(' ');
    await speak(fullText, { rate: speed });

    isPlaying = false;
  }

  /**
   * Self-assessment: child (or therapist) rates the attempt
   */
  function rateAttempt(rating: number) {
    attempts++;
    stars = rating;
    totalStars += rating;

    if (currentSeq) {
      completedSequences = new Set([...completedSequences, currentSeq.id]);
    }

    // Speed challenge: increase speed after each rated attempt
    if (currentLevel.speedChallenge && rating >= 2) {
      speedChallengeRound++;
      speed = Math.min(speed + SPEED_INCREMENT, MAX_SPEED);
    }

    showStarAnim = true;
    setTimeout(() => { showStarAnim = false; }, 1500);
    view = 'result';
  }

  function goBack() {
    stop();
    if (view === 'result') { view = 'practice'; }
    else if (view === 'practice') { view = 'levels'; }
  }

  function adjustSpeed(delta: number) {
    speed = Math.round(Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed + delta)) * 10) / 10;
  }
</script>

<div class="rest-trainer">
  {#if view === 'levels'}
    <!-- Level Selection -->
    <div class="section" in:fade>
      <p class="intro">{$t('restTrainer.intro')}</p>

      <div class="level-grid">
        {#each LEVELS as level, idx}
          {@const done = level.sequences.filter(s => completedSequences.has(s.id)).length}
          <button
            class="level-card"
            class:completed={done === level.sequences.length}
            onclick={() => selectLevel(idx)}
          >
            <span class="level-icon">{level.icon}</span>
            <span class="level-num">{$t('restTrainer.level')} {level.id}</span>
            <span class="level-name">{$t(level.nameKey)}</span>
            <span class="level-desc">{$t(level.descKey)}</span>
            {#if done > 0}
              <span class="level-progress">{done}/{level.sequences.length}</span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="total-stars">
        ⭐ {totalStars} {$t('restTrainer.starsCollected')}
      </div>
    </div>

  {:else if view === 'practice'}
    <!-- Practice View -->
    <div class="section" in:fade>
      <div class="practice-header">
        <button class="back-btn" onclick={goBack} aria-label="Tillbaka">←</button>
        <span class="level-badge">{currentLevel.icon} {$t('restTrainer.level')} {currentLevel.id}</span>
        <span class="seq-counter">{currentSeqIdx + 1}/{levelTotal}</span>
      </div>

      <!-- Syllable Display -->
      {#if currentSeq}
        <div class="syllable-display">
          <div class="syllables">
            {#each currentSeq.syllables as syl, i}
              <div
                class="syllable-card"
                class:stressed={currentSeq.stress[i] === 1}
                class:active={activeSyllableIdx === i}
                class:beat={activeSyllableIdx === i && beatActive}
                style="font-size: {currentSeq.stress[i] === 1 ? '2.8rem' : '1.8rem'}"
              >
                <span class="syl-text">{currentSeq.stress[i] === 1 ? syl.toUpperCase() : syl}</span>
              </div>
              {#if i < currentSeq.syllables.length - 1}
                <span class="syl-dash">–</span>
              {/if}
            {/each}
          </div>

          <!-- Stress Pattern Indicator -->
          <div class="stress-pattern">
            {#each currentSeq.stress as s}
              <div
                class="stress-dot"
                class:big={s === 1}
              ></div>
            {/each}
          </div>
        </div>

        <!-- Beat Indicator -->
        <div class="beat-indicator">
          {#each currentSeq.syllables as _, i}
            <div
              class="beat-dot"
              class:pulse={activeSyllableIdx === i}
            ></div>
          {/each}
        </div>
      {/if}

      <!-- Controls -->
      <div class="controls">
        <button
          class="play-btn"
          onclick={playSequence}
          disabled={isPlaying}
        >
          {#if isPlaying}
            <span class="playing-anim">🔊</span>
          {:else}
            ▶️
          {/if}
          <span>{isPlaying ? $t('restTrainer.playing') : $t('restTrainer.listen')}</span>
        </button>

        <!-- Speed Control -->
        <div class="speed-control">
          <label class="speed-label">{$t('restTrainer.speed')}: {speed.toFixed(1)}x</label>
          <div class="speed-row">
            <button class="speed-btn" onclick={() => adjustSpeed(-0.1)} disabled={speed <= MIN_SPEED}>−</button>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              step="0.1"
              bind:value={speed}
              class="speed-slider"
            />
            <button class="speed-btn" onclick={() => adjustSpeed(0.1)} disabled={speed >= MAX_SPEED}>+</button>
          </div>
          {#if currentLevel.speedChallenge}
            <span class="speed-challenge-badge">⚡ {$t('restTrainer.speedChallenge')} — {$t('restTrainer.round')} {speedChallengeRound + 1}</span>
          {/if}
        </div>
      </div>

      <!-- Self-Assessment -->
      <div class="assessment">
        <p class="assess-label">{$t('restTrainer.howDidItGo')}</p>
        <div class="star-buttons">
          <button class="star-btn" onclick={() => rateAttempt(1)} title={$t('restTrainer.tried')}>
            <span class="star-icon">⭐</span>
            <span class="star-text">{$t('restTrainer.tried')}</span>
          </button>
          <button class="star-btn" onclick={() => rateAttempt(2)} title={$t('restTrainer.good')}>
            <span class="star-icon">⭐⭐</span>
            <span class="star-text">{$t('restTrainer.good')}</span>
          </button>
          <button class="star-btn" onclick={() => rateAttempt(3)} title={$t('restTrainer.perfect')}>
            <span class="star-icon">⭐⭐⭐</span>
            <span class="star-text">{$t('restTrainer.perfect')}</span>
          </button>
        </div>
      </div>
    </div>

  {:else if view === 'result'}
    <!-- Result View -->
    <div class="section result-view" in:fade>
      {#if showStarAnim}
        <div class="star-burst" in:scale={{ duration: 500 }}>
          {#each Array(stars) as _}
            <span class="burst-star">⭐</span>
          {/each}
        </div>
      {/if}

      <div class="result-card">
        <div class="result-stars">
          {#each Array(3) as _, i}
            <span class="result-star" class:earned={i < stars}>⭐</span>
          {/each}
        </div>
        <h2 class="result-text">
          {#if stars === 3}
            {$t('restTrainer.resultPerfect')} 🎉
          {:else if stars === 2}
            {$t('restTrainer.resultGood')} 👏
          {:else}
            {$t('restTrainer.resultTried')} 💪
          {/if}
        </h2>
        {#if currentSeq}
          <p class="result-sequence">{currentSeq.display}</p>
        {/if}
      </div>

      <div class="result-actions">
        <button class="btn retry-btn" onclick={() => { attempts = 0; stars = 0; view = 'practice'; }}>
          🔁 {$t('restTrainer.tryAgain')}
        </button>
        <button class="btn next-btn" onclick={nextSequence}>
          {$t('restTrainer.next')} →
        </button>
        <button class="btn levels-btn" onclick={() => { view = 'levels'; }}>
          📋 {$t('restTrainer.allLevels')}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .rest-trainer {
    width: 100%;
  }

  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }

  .intro {
    text-align: center;
    color: var(--text-secondary, #666);
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.5;
  }

  /* Level Grid */
  .level-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .level-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.2rem 0.8rem;
    align-items: center;
    padding: 1.2rem;
    border: 3px solid var(--border, #ddd);
    border-radius: 18px;
    background: var(--bg-card, #fff);
    cursor: pointer;
    text-align: left;
    transition: transform 0.1s;
  }

  .level-card:active { transform: scale(0.97); }
  .level-card.completed { border-color: #2ECC71; background: #f0fff4; }

  .level-icon { grid-row: span 2; font-size: 2rem; }
  .level-num { font-weight: 800; font-size: 0.8rem; color: var(--text-secondary, #666); text-transform: uppercase; letter-spacing: 0.5px; }
  .level-name { grid-column: 2; font-weight: 700; font-size: 1.1rem; }
  .level-desc { grid-column: 2; font-size: 0.85rem; color: var(--text-secondary, #666); }
  .level-progress { grid-row: span 2; font-weight: 700; font-size: 0.85rem; color: #2ECC71; }

  .total-stars {
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    background: var(--bg-card, #fff);
    border-radius: 14px;
    border: 2px solid #F1C40F;
  }

  /* Practice Header */
  .practice-header {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
  }

  .back-btn {
    background: none;
    border: 2px solid var(--border, #ddd);
    border-radius: 12px;
    padding: 0.5rem 0.8rem;
    font-size: 1.2rem;
    cursor: pointer;
    min-height: 44px;
  }

  .level-badge {
    font-weight: 700;
    font-size: 1rem;
    flex: 1;
  }

  .seq-counter {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
    background: var(--bg-card, #fff);
    padding: 0.3rem 0.7rem;
    border-radius: 10px;
    border: 2px solid var(--border, #ddd);
  }

  /* Syllable Display */
  .syllable-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem 1rem;
    background: var(--bg-card, #fff);
    border-radius: 24px;
    border: 3px solid var(--border, #ddd);
    width: 100%;
    min-height: 160px;
    justify-content: center;
  }

  .syllables {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .syllable-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 1.2rem;
    border-radius: 16px;
    background: var(--bg, #f8f8f8);
    border: 3px solid var(--border, #ddd);
    transition: all 0.2s ease;
    min-width: 60px;
    min-height: 60px;
  }

  .syllable-card.stressed {
    border-color: #E91E63;
    background: #FFF0F5;
    font-weight: 900;
  }

  .syllable-card.active {
    border-color: #3498DB;
    background: #EBF5FB;
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
  }

  .syllable-card.beat {
    animation: syllablePulse 0.3s ease;
  }

  .syllable-card.stressed.active {
    border-color: #E91E63;
    background: #FCE4EC;
    box-shadow: 0 4px 20px rgba(233, 30, 99, 0.4);
  }

  .syl-text {
    font-weight: 700;
    letter-spacing: 1px;
  }

  .syl-dash {
    font-size: 1.5rem;
    color: var(--text-secondary, #999);
    font-weight: 300;
  }

  /* Stress Pattern Dots */
  .stress-pattern {
    display: flex;
    gap: 0.8rem;
    align-items: flex-end;
  }

  .stress-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ddd;
    transition: all 0.2s;
  }

  .stress-dot.big {
    width: 28px;
    height: 28px;
    background: #E91E63;
  }

  /* Beat Indicator */
  .beat-indicator {
    display: flex;
    gap: 1.2rem;
    justify-content: center;
  }

  .beat-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--border, #ddd);
    transition: all 0.15s;
  }

  .beat-dot.pulse {
    background: #3498DB;
    transform: scale(1.4);
    box-shadow: 0 0 16px rgba(52, 152, 219, 0.5);
    animation: beatPulse 0.4s ease;
  }

  /* Controls */
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 1rem 2rem;
    border-radius: 20px;
    border: 3px solid #2ECC71;
    background: #2ECC71;
    color: #fff;
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 56px;
    width: 100%;
    max-width: 300px;
    transition: transform 0.1s;
  }

  .play-btn:active { transform: scale(0.95); }
  .play-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .playing-anim {
    animation: speakerPulse 0.5s infinite;
  }

  /* Speed Control */
  .speed-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.8rem;
    background: var(--bg-card, #fff);
    border-radius: 16px;
    border: 2px solid var(--border, #ddd);
  }

  .speed-label {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .speed-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .speed-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .speed-btn:disabled { opacity: 0.3; }

  .speed-slider {
    flex: 1;
    accent-color: #3498DB;
    height: 8px;
  }

  .speed-challenge-badge {
    font-size: 0.85rem;
    font-weight: 700;
    color: #E67E22;
    background: #FFF3E0;
    padding: 0.3rem 0.8rem;
    border-radius: 10px;
  }

  /* Assessment */
  .assessment {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 1rem;
    background: var(--bg-card, #fff);
    border-radius: 20px;
    border: 2px solid var(--border, #ddd);
  }

  .assess-label {
    font-weight: 700;
    font-size: 1.05rem;
    margin: 0;
  }

  .star-buttons {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }

  .star-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.8rem 0.5rem;
    border-radius: 14px;
    border: 2px solid var(--border, #ddd);
    background: var(--bg, #f8f8f8);
    cursor: pointer;
    min-height: 72px;
    transition: transform 0.1s;
  }

  .star-btn:active { transform: scale(0.93); }

  .star-icon { font-size: 1.2rem; }
  .star-text { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary, #666); }

  /* Result View */
  .result-view {
    gap: 1.5rem;
    padding-top: 1rem;
  }

  .star-burst {
    display: flex;
    gap: 0.5rem;
    font-size: 3rem;
  }

  .burst-star {
    animation: starFloat 1.5s ease forwards;
  }

  .result-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 2rem;
    background: var(--bg-card, #fff);
    border-radius: 24px;
    border: 3px solid var(--border, #ddd);
    width: 100%;
  }

  .result-stars {
    display: flex;
    gap: 0.5rem;
    font-size: 2.5rem;
  }

  .result-star { opacity: 0.2; filter: grayscale(1); }
  .result-star.earned { opacity: 1; filter: none; }

  .result-text {
    font-size: 1.5rem;
    margin: 0;
    text-align: center;
  }

  .result-sequence {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-secondary, #666);
    letter-spacing: 2px;
  }

  .result-actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    width: 100%;
  }

  .btn {
    padding: 0.8rem 1.2rem;
    border-radius: 14px;
    border: 2px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1.05rem;
    cursor: pointer;
    font-weight: 600;
    min-height: 50px;
    text-align: center;
    transition: transform 0.1s;
  }

  .btn:active { transform: scale(0.97); }

  .retry-btn { background: #E67E22; color: #fff; border-color: #E67E22; }
  .next-btn { background: #3498DB; color: #fff; border-color: #3498DB; }
  .levels-btn { background: var(--bg-card, #fff); color: var(--text, #333); }

  /* Animations */
  @keyframes syllablePulse {
    0% { transform: scale(1.1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1.1); }
  }

  @keyframes beatPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1.4); }
  }

  @keyframes speakerPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  @keyframes starFloat {
    0% { transform: scale(0) translateY(0); opacity: 0; }
    30% { transform: scale(1.3) translateY(-10px); opacity: 1; }
    100% { transform: scale(1) translateY(-30px); opacity: 0.8; }
  }

  /* Responsive — bigger cards on tablet */
  @media (min-width: 600px) {
    .syllable-card { min-width: 80px; min-height: 80px; padding: 1rem 1.5rem; }
    .play-btn { max-width: 400px; }
  }
</style>
