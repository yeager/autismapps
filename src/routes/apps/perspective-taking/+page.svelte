<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { awardStar, GoldStarBurst } from '$lib/rewards';
  import { fly, fade } from 'svelte/transition';
  import { ALL_LEVELS } from '$lib/data/perspective-scenarios';
  import ScenarioCard from '$lib/components/ScenarioCard.svelte';
  import FalseBeliefCard from '$lib/components/FalseBeliefCard.svelte';
  import SecondOrderCard from '$lib/components/SecondOrderCard.svelte';
  import EmotionFaces from '$lib/components/EmotionFaces.svelte';

  let activeLevel = $state<typeof ALL_LEVELS[0] | null>(null);
  let currentScenarioIndex = $state(0);
  let score = $state(0);
  let totalQuestions = $state(0);
  let showStar = $state(false);
  let showConfetti = $state(false);
  let levelComplete = $state(false);

  let currentScenario = $derived(activeLevel ? activeLevel.scenarios[currentScenarioIndex] : null);
  let isLastScenario = $derived(activeLevel ? currentScenarioIndex >= activeLevel.scenarios.length - 1 : false);

  function selectLevel(level: typeof ALL_LEVELS[0]) {
    activeLevel = level;
    currentScenarioIndex = 0;
    score = 0;
    totalQuestions = 0;
    levelComplete = false;
    speak($t(level.labelKey));
  }

  function goBack() {
    if (levelComplete || !activeLevel) {
      activeLevel = null;
      levelComplete = false;
    } else {
      activeLevel = null;
    }
  }

  async function onCorrect() {
    score++;
    totalQuestions++;
    showStar = true;
    await awardStar('perspective-taking', 'rewards.star.perspective');
    setTimeout(() => { showStar = false; }, 1500);
  }

  function onWrong() {
    totalQuestions++;
    // Shake feedback already handled by ScenarioCard
  }

  function nextScenario() {
    if (isLastScenario) {
      levelComplete = true;
      showConfetti = true;
      speak($t('pt.level_complete'));
      setTimeout(() => { showConfetti = false; }, 3000);
    } else {
      currentScenarioIndex++;
    }
  }
</script>

<WelcomeDialog
  appId="perspective-taking"
  titleKey="app.perspective_taking"
  purposeKey="welcome.perspectiveTaking.purpose"
  howKey="welcome.perspectiveTaking.how"
  goalKey="welcome.perspectiveTaking.goal"
  icon="🧠"
/>

{#if showStar}
  <GoldStarBurst />
{/if}

<div class="pt-page">
  <div class="page-title">
    {#if activeLevel}
      <button class="sub-back" onclick={goBack} aria-label={$t('pt.back')}>←</button>
    {/if}
    <h1>{activeLevel ? $t(activeLevel.labelKey) : $t('app.perspective_taking')}</h1>
  </div>

  {#if !activeLevel}
    <!-- Level selection -->
    <p class="intro-text">{$t('pt.intro')}</p>
    <div class="levels-grid">
      {#each ALL_LEVELS as level}
        <button
          class="level-card"
          style="--lc: {level.color}"
          onclick={() => selectLevel(level)}
          onfocus={() => speak($t(level.labelKey))}
        >
          <span class="level-emoji">{level.emoji}</span>
          <span class="level-name">{$t(level.labelKey)}</span>
          <span class="level-desc">{$t(level.descKey)}</span>
          <span class="level-age">{level.ageRange} {$t('pt.years')}</span>
        </button>
      {/each}
    </div>

    <!-- Emotion faces preview -->
    <div class="emotion-preview">
      <h2>{$t('pt.emotions_title')}</h2>
      <div class="emotion-faces-row">
        {#each ['happy', 'sad', 'angry', 'scared', 'surprised', 'confused'] as emotion}
          <button class="emotion-preview-btn" onclick={() => speak($t(`pt.emotion.${emotion}`))}>
            <EmotionFaces {emotion} size={50} />
            <span>{$t(`pt.emotion.${emotion}`)}</span>
          </button>
        {/each}
      </div>
    </div>

  {:else if levelComplete}
    <!-- Level complete screen -->
    <div class="complete-screen" in:fade={{ duration: 300 }}>
      {#if showConfetti}
        <div class="confetti-container">
          {#each Array(20) as _, i}
            <div
              class="confetti-piece"
              style="
                --x: {Math.random() * 100}%;
                --delay: {Math.random() * 0.5}s;
                --color: {['#FFD700', '#FF6B6B', '#4FC3F7', '#81C784', '#FFB74D', '#CE93D8'][i % 6]};
                --rotation: {Math.random() * 360}deg;
              "
            ></div>
          {/each}
        </div>
      {/if}

      <span class="complete-emoji">🎉</span>
      <h2>{$t('pt.level_complete')}</h2>
      <div class="score-display">
        <span class="score-number">{score}</span>
        <span class="score-slash">/</span>
        <span class="score-total">{totalQuestions}</span>
      </div>
      <p class="score-label">{$t('pt.correct_answers')}</p>

      <div class="complete-stars">
        {#each Array(Math.min(score, 5)) as _}
          <span class="star">⭐</span>
        {/each}
      </div>

      <div class="complete-actions">
        <button class="action-btn" onclick={() => { currentScenarioIndex = 0; score = 0; totalQuestions = 0; levelComplete = false; }}>
          🔄 {$t('pt.try_again')}
        </button>
        <button class="action-btn primary" style="background: {activeLevel.color}" onclick={goBack}>
          ← {$t('pt.choose_level')}
        </button>
      </div>
    </div>

  {:else if currentScenario}
    <!-- Scenario progress -->
    <div class="scenario-progress">
      <span class="progress-text">
        {currentScenarioIndex + 1} / {activeLevel.scenarios.length}
      </span>
      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width: {((currentScenarioIndex + 1) / activeLevel.scenarios.length) * 100}%; background: {activeLevel.color}"
        ></div>
      </div>
      <span class="score-text">⭐ {score}</span>
    </div>

    <!-- Render appropriate card based on level type -->
    {#key currentScenario.id}
      {#if activeLevel.level <= 2}
        <ScenarioCard
          scenario={currentScenario}
          levelColor={activeLevel.color}
          {onCorrect}
          {onWrong}
        />
      {:else if activeLevel.level === 3}
        <FalseBeliefCard
          scenario={currentScenario}
          levelColor={activeLevel.color}
          {onCorrect}
          {onWrong}
        />
      {:else}
        <SecondOrderCard
          scenario={currentScenario}
          levelColor={activeLevel.color}
          {onCorrect}
          {onWrong}
        />
      {/if}
    {/key}

    <!-- Next button (shown after scenario done phase) -->
    <div class="next-area">
      <button class="next-btn" style="background: {activeLevel.color}" onclick={nextScenario}>
        {isLastScenario ? $t('pt.finish') : $t('pt.next_scenario')} →
      </button>
    </div>
  {/if}

  <footer class="credit">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0</footer>
</div>

<style>
  .pt-page {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .page-title {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px 8px;
  }
  .page-title h1 {
    font-size: 1.3em;
    margin: 0;
  }
  .sub-back {
    background: none;
    border: 2px solid var(--border, #ddd);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.15s;
  }
  .sub-back:hover { border-color: #333; }

  .intro-text {
    padding: 0 20px;
    color: var(--text-muted, #666);
    line-height: 1.5;
  }

  .levels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
    padding: 16px 20px;
  }
  .level-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 14px;
    background: var(--bg-card, white);
    border: 2px solid var(--border, #ddd);
    border-radius: var(--radius, 16px);
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  .level-card:hover {
    border-color: var(--lc);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px color-mix(in srgb, var(--lc) 20%, transparent);
  }
  .level-emoji { font-size: 2.5em; }
  .level-name { font-weight: 700; font-size: 1em; }
  .level-desc { font-size: 0.8em; color: var(--text-muted, #666); }
  .level-age {
    font-size: 0.75em;
    padding: 3px 10px;
    background: color-mix(in srgb, var(--lc) 15%, transparent);
    color: var(--lc);
    border-radius: 100px;
    font-weight: 600;
  }

  .emotion-preview {
    padding: 20px;
  }
  .emotion-preview h2 {
    font-size: 1.1em;
    margin-bottom: 12px;
  }
  .emotion-faces-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
  .emotion-preview-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .emotion-preview-btn:hover { transform: scale(1.1); }
  .emotion-preview-btn span { font-size: 0.75em; font-weight: 600; }

  .scenario-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 20px;
  }
  .progress-text { font-size: 0.85em; font-weight: 600; color: var(--text-muted, #888); white-space: nowrap; }
  .progress-bar {
    flex: 1;
    height: 6px;
    background: var(--border, #ddd);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  .score-text { font-size: 0.9em; font-weight: 600; white-space: nowrap; }

  .next-area {
    padding: 16px 20px;
    display: flex;
    justify-content: center;
  }
  .next-btn {
    padding: 12px 28px;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .next-btn:hover { opacity: 0.9; }

  .complete-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
  }
  .complete-emoji { font-size: 4em; }
  .complete-screen h2 { margin: 12px 0 20px; }
  .score-display {
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-size: 2em;
    font-weight: 700;
  }
  .score-number { color: #27AE60; }
  .score-slash { color: var(--text-muted, #888); }
  .score-total { color: var(--text, #333); }
  .score-label { color: var(--text-muted, #666); margin-top: 4px; }

  .complete-stars {
    display: flex;
    gap: 4px;
    font-size: 1.5em;
    margin: 16px 0;
  }
  .star { animation: popIn 0.3s ease-out backwards; }
  .star:nth-child(2) { animation-delay: 0.1s; }
  .star:nth-child(3) { animation-delay: 0.2s; }
  .star:nth-child(4) { animation-delay: 0.3s; }
  .star:nth-child(5) { animation-delay: 0.4s; }

  .complete-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .action-btn {
    padding: 12px 20px;
    border: 2px solid var(--border, #ddd);
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    background: var(--bg-card, white);
    transition: all 0.15s;
  }
  .action-btn:hover { transform: translateY(-2px); }
  .action-btn.primary { color: white; border-color: transparent; }

  /* Confetti */
  .confetti-container {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--color);
    left: var(--x);
    top: -10px;
    transform: rotate(var(--rotation));
    animation: confettiFall 2.5s ease-in var(--delay) forwards;
  }
  .confetti-piece:nth-child(odd) { border-radius: 50%; }

  @keyframes confettiFall {
    0% { top: -10px; opacity: 1; }
    100% { top: 110%; opacity: 0; transform: rotate(calc(var(--rotation) + 720deg)); }
  }
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); opacity: 1; }
  }

  .credit {
    text-align: center;
    padding: 12px;
    font-size: 0.75em;
    color: var(--text-muted, #888);
    margin-top: auto;
  }
  .credit a { color: inherit; text-decoration: underline; }
</style>
