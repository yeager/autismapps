<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fly, fade } from 'svelte/transition';
  import EmotionFaces from './EmotionFaces.svelte';
  import { getPictoUrl } from '$lib/data/perspective-scenarios';

  // Props
  export let scenario: any;
  export let onCorrect: () => void = () => {};
  export let onWrong: () => void = () => {};
  export let levelColor: string = '#3498DB';

  // State
  let phase: 'scenario' | 'emotion' | 'think' | 'do' | 'done' = 'scenario';
  let selectedAnswer: string | null = null;
  let isCorrect: boolean | null = null;
  let showExplanation = false;

  $: pictoUrl = getPictoUrl(scenario.pictoId);

  function readScenario() {
    speak($t(scenario.scenarioKey));
  }

  function selectEmotion(emotion: string) {
    selectedAnswer = emotion;
    isCorrect = emotion === scenario.correctEmotion;
    speak($t(`pt.emotion.${emotion}`));
    setTimeout(() => {
      if (isCorrect) {
        onCorrect();
        phase = 'think';
        selectedAnswer = null;
        isCorrect = null;
      } else {
        onWrong();
        // Reset after showing wrong
        setTimeout(() => {
          selectedAnswer = null;
          isCorrect = null;
        }, 1200);
      }
    }, 1000);
  }

  function selectThink(choice: string) {
    selectedAnswer = choice;
    isCorrect = choice === scenario.correctThink;
    speak($t(choice));
    setTimeout(() => {
      if (isCorrect) {
        onCorrect();
        phase = 'do';
        selectedAnswer = null;
        isCorrect = null;
      } else {
        onWrong();
        setTimeout(() => {
          selectedAnswer = null;
          isCorrect = null;
        }, 1200);
      }
    }, 1000);
  }

  function selectDo(choice: string) {
    selectedAnswer = choice;
    isCorrect = choice === scenario.correctDo;
    speak($t(choice));
    setTimeout(() => {
      if (isCorrect) {
        onCorrect();
        phase = 'done';
      } else {
        onWrong();
        setTimeout(() => {
          selectedAnswer = null;
          isCorrect = null;
        }, 1200);
      }
    }, 1000);
  }

  function reset() {
    phase = 'scenario';
    selectedAnswer = null;
    isCorrect = null;
    showExplanation = false;
  }

  // Auto-read scenario when phase changes
  $: if (phase === 'scenario') {
    // delayed to avoid speaking during transitions
    setTimeout(() => readScenario(), 300);
  }
</script>

<div class="scenario-card" style="--lc: {levelColor}" in:fly={{ y: 20, duration: 300 }}>
  <!-- Pictogram illustration -->
  <div class="picto-area">
    <button class="picto-btn" on:click={readScenario} aria-label={$t('pt.read_aloud')}>
      <img src={pictoUrl} alt="" width="120" height="120" loading="lazy" />
      <span class="speaker-icon">🔊</span>
    </button>
  </div>

  <!-- Scenario text -->
  <div class="scenario-text">
    <p>{$t(scenario.scenarioKey)}</p>
  </div>

  {#if phase === 'scenario'}
    <button class="start-btn" on:click={() => { phase = 'emotion'; }} style="background: {levelColor}">
      {$t('pt.start_questions')} →
    </button>

  {:else if phase === 'emotion'}
    <div class="question-area" in:fly={{ y: 10, duration: 200 }}>
      <h3>{$t(scenario.emotionQuestion)}</h3>
      <div class="emotion-choices">
        {#each scenario.emotionChoices as emotion}
          {@const chosen = selectedAnswer === emotion}
          {@const correct = chosen && isCorrect === true}
          {@const wrong = chosen && isCorrect === false}
          <button
            class="emotion-btn"
            class:correct
            class:wrong
            on:click={() => selectEmotion(emotion)}
            disabled={selectedAnswer !== null}
          >
            <EmotionFaces {emotion} size={60} />
            <span>{$t(`pt.emotion.${emotion}`)}</span>
          </button>
        {/each}
      </div>
    </div>

  {:else if phase === 'think'}
    <div class="question-area" in:fly={{ y: 10, duration: 200 }}>
      <h3>💭 {$t(scenario.thinkQuestion)}</h3>
      <div class="choice-list">
        {#each scenario.thinkChoices as choice}
          {@const chosen = selectedAnswer === choice}
          {@const correct = chosen && isCorrect === true}
          {@const wrong = chosen && isCorrect === false}
          <button
            class="choice-btn"
            class:correct
            class:wrong
            on:click={() => selectThink(choice)}
            disabled={selectedAnswer !== null}
          >
            {$t(choice)}
          </button>
        {/each}
      </div>
    </div>

  {:else if phase === 'do'}
    <div class="question-area" in:fly={{ y: 10, duration: 200 }}>
      <h3>🤔 {$t(scenario.doQuestion)}</h3>
      <div class="choice-list">
        {#each scenario.doChoices as choice}
          {@const chosen = selectedAnswer === choice}
          {@const correct = chosen && isCorrect === true}
          {@const wrong = chosen && isCorrect === false}
          <button
            class="choice-btn"
            class:correct
            class:wrong
            on:click={() => selectDo(choice)}
            disabled={selectedAnswer !== null}
          >
            {$t(choice)}
          </button>
        {/each}
      </div>
    </div>

  {:else if phase === 'done'}
    <div class="done-area" in:fade={{ duration: 300 }}>
      <span class="done-emoji">🌟</span>
      <p class="done-text">{$t('pt.well_done')}</p>
    </div>
  {/if}
</div>

<style>
  .scenario-card {
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
  .picto-btn:active { transform: scale(0.95); }
  .picto-btn img { border-radius: 8px; }
  .speaker-icon {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 1.2em;
    background: white;
    border-radius: 50%;
    padding: 2px 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
  .scenario-text {
    text-align: center;
    font-size: 1.1em;
    line-height: 1.5;
    margin-bottom: 16px;
    padding: 0 8px;
  }
  .start-btn {
    display: block;
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .start-btn:hover { opacity: 0.9; }
  .start-btn:active { transform: scale(0.98); }

  .question-area { text-align: center; }
  .question-area h3 {
    font-size: 1em;
    margin-bottom: 14px;
    color: var(--text, #333);
  }

  .emotion-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }
  .emotion-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: var(--bg-card, white);
    border: 2px solid var(--border, #ddd);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    min-width: 90px;
  }
  .emotion-btn:hover:not(:disabled) {
    border-color: var(--lc);
    transform: translateY(-2px);
  }
  .emotion-btn:active:not(:disabled) { transform: scale(0.95); }
  .emotion-btn span { font-size: 0.85em; font-weight: 600; }
  .emotion-btn.correct {
    border-color: #27AE60;
    background: #E8F5E9;
  }
  .emotion-btn.wrong {
    border-color: #E74C3C;
    background: #FFEBEE;
    animation: shake 0.4s ease-in-out;
  }

  .choice-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .choice-btn {
    padding: 12px 16px;
    background: var(--bg-card, white);
    border: 2px solid var(--border, #ddd);
    border-radius: 12px;
    font-size: 1em;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  .choice-btn:hover:not(:disabled) {
    border-color: var(--lc);
    transform: translateX(4px);
  }
  .choice-btn.correct {
    border-color: #27AE60;
    background: #E8F5E9;
  }
  .choice-btn.wrong {
    border-color: #E74C3C;
    background: #FFEBEE;
    animation: shake 0.4s ease-in-out;
  }

  .done-area {
    text-align: center;
    padding: 20px;
  }
  .done-emoji { font-size: 3em; }
  .done-text {
    font-size: 1.2em;
    font-weight: 600;
    color: #27AE60;
    margin-top: 8px;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
</style>
