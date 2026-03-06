<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fly, fade } from 'svelte/transition';
  import { getPictoUrl } from '$lib/data/perspective-scenarios';

  export let scenario: any;
  export let onCorrect: () => void = () => {};
  export let onWrong: () => void = () => {};
  export let levelColor: string = '#E67E22';

  let storyStep = 0;
  let phase: 'story' | 'question' | 'done' = 'story';
  let selectedAnswer: string | null = null;
  let isCorrect: boolean | null = null;
  let showExplanation = false;

  $: pictoUrl = getPictoUrl(scenario.pictoId);
  $: totalSteps = scenario.storyKeys.length;
  $: currentStepText = $t(scenario.storyKeys[storyStep]);

  function readStep() {
    speak(currentStepText);
  }

  function nextStep() {
    if (storyStep < totalSteps - 1) {
      storyStep++;
      setTimeout(() => readStep(), 200);
    } else {
      phase = 'question';
      setTimeout(() => speak($t(scenario.questionKey)), 200);
    }
  }

  function prevStep() {
    if (storyStep > 0) {
      storyStep--;
      setTimeout(() => readStep(), 200);
    }
  }

  function selectAnswer(answer: string) {
    selectedAnswer = answer;
    isCorrect = answer === scenario.correctAnswer;
    speak($t(answer));
    setTimeout(() => {
      if (isCorrect) {
        onCorrect();
        showExplanation = true;
        setTimeout(() => speak($t(scenario.explanationKey)), 300);
      } else {
        onWrong();
        setTimeout(() => {
          selectedAnswer = null;
          isCorrect = null;
        }, 1200);
      }
    }, 1000);
  }

  function finishScenario() {
    phase = 'done';
  }

  // Auto-read first step
  $: if (storyStep === 0 && phase === 'story') {
    setTimeout(() => readStep(), 400);
  }
</script>

<div class="fb-card" style="--lc: {levelColor}" in:fly={{ y: 20, duration: 300 }}>
  <!-- Story illustration -->
  <div class="picto-area">
    <button class="picto-btn" on:click={readStep} aria-label={$t('pt.read_aloud')}>
      <img src={pictoUrl} alt="" width="100" height="100" loading="lazy" />
      <span class="speaker-icon">🔊</span>
    </button>
  </div>

  {#if phase === 'story'}
    <!-- Story steps with progress -->
    <div class="step-progress">
      {#each scenario.storyKeys as _, i}
        <div class="step-dot" class:active={i <= storyStep} class:current={i === storyStep}></div>
      {/each}
    </div>

    <div class="story-step" in:fly={{ x: 20, duration: 200 }} key={storyStep}>
      <p class="step-text">{currentStepText}</p>
    </div>

    <div class="step-nav">
      <button class="nav-btn" on:click={prevStep} disabled={storyStep === 0}>← {$t('pt.prev')}</button>
      <span class="step-counter">{storyStep + 1} / {totalSteps}</span>
      <button class="nav-btn primary" on:click={nextStep} style="background: {levelColor}">
        {storyStep === totalSteps - 1 ? $t('pt.answer_question') : $t('pt.next')} →
      </button>
    </div>

  {:else if phase === 'question'}
    <div class="question-area" in:fly={{ y: 10, duration: 200 }}>
      <h3 class="question-text">❓ {$t(scenario.questionKey)}</h3>

      {#if !showExplanation}
        <div class="answer-choices">
          {#each scenario.answerChoices as answer}
            {@const chosen = selectedAnswer === answer}
            {@const correct = chosen && isCorrect === true}
            {@const wrong = chosen && isCorrect === false}
            <button
              class="answer-btn"
              class:correct
              class:wrong
              on:click={() => selectAnswer(answer)}
              disabled={selectedAnswer !== null}
            >
              {$t(answer)}
            </button>
          {/each}
        </div>
      {:else}
        <div class="explanation" in:fade={{ duration: 300 }}>
          <div class="explanation-box">
            <span class="explanation-icon">💡</span>
            <p>{$t(scenario.explanationKey)}</p>
          </div>
          <button class="continue-btn" on:click={finishScenario} style="background: {levelColor}">
            {$t('pt.continue')} →
          </button>
        </div>
      {/if}
    </div>

  {:else if phase === 'done'}
    <div class="done-area" in:fade={{ duration: 300 }}>
      <span class="done-emoji">🧩</span>
      <p class="done-text">{$t('pt.great_thinking')}</p>
    </div>
  {/if}
</div>

<style>
  .fb-card {
    background: var(--bg-card, white);
    border: 2px solid var(--lc);
    border-radius: var(--radius, 16px);
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
  }
  .picto-area {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }
  .picto-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 12px;
    transition: transform 0.15s;
  }
  .picto-btn:hover { transform: scale(1.05); }
  .picto-btn img { border-radius: 8px; }
  .speaker-icon {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 1.1em;
    background: white;
    border-radius: 50%;
    padding: 2px 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }

  .step-progress {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .step-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--border, #ddd);
    transition: all 0.2s;
  }
  .step-dot.active { background: var(--lc); }
  .step-dot.current { transform: scale(1.3); box-shadow: 0 0 0 3px color-mix(in srgb, var(--lc) 30%, transparent); }

  .story-step { text-align: center; min-height: 60px; }
  .step-text {
    font-size: 1.1em;
    line-height: 1.6;
    padding: 0 8px;
  }

  .step-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    gap: 8px;
  }
  .nav-btn {
    padding: 10px 16px;
    border: 2px solid var(--border, #ddd);
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--bg-card, white);
  }
  .nav-btn:hover:not(:disabled) { border-color: var(--lc); }
  .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .nav-btn.primary { color: white; border-color: transparent; }
  .step-counter { font-size: 0.85em; color: var(--text-muted, #888); }

  .question-area { text-align: center; }
  .question-text {
    font-size: 1.1em;
    margin-bottom: 16px;
    color: var(--text, #333);
  }
  .answer-choices {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .answer-btn {
    padding: 14px 18px;
    background: var(--bg-card, white);
    border: 2px solid var(--border, #ddd);
    border-radius: 12px;
    font-size: 1.05em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .answer-btn:hover:not(:disabled) {
    border-color: var(--lc);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .answer-btn.correct {
    border-color: #27AE60;
    background: #E8F5E9;
  }
  .answer-btn.wrong {
    border-color: #E74C3C;
    background: #FFEBEE;
    animation: shake 0.4s ease-in-out;
  }

  .explanation-box {
    background: #FFF3E0;
    border: 2px solid #FFB74D;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
    text-align: left;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .explanation-icon { font-size: 1.5em; flex-shrink: 0; }
  .explanation-box p { margin: 0; line-height: 1.5; }

  .continue-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
  }
  .continue-btn:hover { opacity: 0.9; }

  .done-area {
    text-align: center;
    padding: 20px;
  }
  .done-emoji { font-size: 3em; }
  .done-text {
    font-size: 1.2em;
    font-weight: 600;
    color: #E67E22;
    margin-top: 8px;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
</style>
