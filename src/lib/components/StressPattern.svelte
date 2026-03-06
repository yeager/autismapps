<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  /** Array of syllable strings */
  export let syllables: string[] = [];
  /** Index of the stressed syllable */
  export let stressIndex: number = 0;
  /** Whether to show the answer (highlight correct stress) */
  export let showAnswer = false;
  /** Whether user can interact (pick stressed syllable) */
  export let interactive = true;
  /** User's selected index (-1 = none) */
  export let selectedIndex: number = -1;

  const dispatch = createEventDispatcher();

  function handleClick(idx: number) {
    if (!interactive || showAnswer) return;
    selectedIndex = idx;
    dispatch('select', { index: idx, correct: idx === stressIndex });
  }
</script>

<div class="stress-pattern">
  <!-- Visual dots row -->
  <div class="dots-row">
    {#each syllables as _, i}
      <div
        class="dot"
        class:big={showAnswer && i === stressIndex}
        class:small={showAnswer && i !== stressIndex}
        class:neutral={!showAnswer}
        style={showAnswer && i === stressIndex ? 'background: #E91E63' : showAnswer ? 'background: #3498DB' : ''}
      />
    {/each}
  </div>

  <!-- Syllable buttons -->
  <div class="syllables-row">
    {#each syllables as syl, i}
      <button
        class="syllable-btn"
        class:stressed={showAnswer && i === stressIndex}
        class:unstressed={showAnswer && i !== stressIndex}
        class:selected={selectedIndex === i}
        class:correct={showAnswer && selectedIndex === i && i === stressIndex}
        class:wrong={showAnswer && selectedIndex === i && i !== stressIndex}
        onclick={() => handleClick(i)}
        disabled={!interactive || showAnswer}
      >
        {#if showAnswer && i === stressIndex}
          {syl.toUpperCase()}
        {:else}
          {syl}
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .stress-pattern {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .dots-row {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    height: 50px;
    justify-content: center;
  }

  .dot {
    border-radius: 50%;
    transition: all 0.3s ease;
    background: var(--border, #ccc);
  }

  .dot.neutral {
    width: 24px;
    height: 24px;
  }

  .dot.big {
    width: 40px;
    height: 40px;
    box-shadow: 0 0 12px rgba(233, 30, 99, 0.4);
  }

  .dot.small {
    width: 20px;
    height: 20px;
  }

  .syllables-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .syllable-btn {
    padding: 0.8rem 1.5rem;
    border-radius: 14px;
    border: 3px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1.4rem;
    font-weight: 700;
    cursor: pointer;
    min-width: 60px;
    min-height: 56px;
    transition: all 0.2s ease;
    color: var(--text, #333);
  }

  .syllable-btn:hover:not(:disabled) {
    border-color: #9B59B6;
    transform: scale(1.05);
  }

  .syllable-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .syllable-btn:disabled {
    cursor: default;
  }

  .syllable-btn.selected {
    border-color: #9B59B6;
    background: rgba(155, 89, 182, 0.1);
  }

  .syllable-btn.stressed {
    background: #E91E63;
    color: #fff;
    border-color: #E91E63;
    font-size: 1.6rem;
    transform: scale(1.1);
  }

  .syllable-btn.unstressed {
    background: #3498DB;
    color: #fff;
    border-color: #3498DB;
    opacity: 0.7;
    font-size: 1.1rem;
  }

  .syllable-btn.correct {
    border-color: #2ECC71;
    background: #2ECC71;
    color: #fff;
    animation: pulse-correct 0.4s ease;
  }

  .syllable-btn.wrong {
    border-color: #E74C3C;
    background: #E74C3C;
    color: #fff;
    animation: shake 0.4s ease;
  }

  @keyframes pulse-correct {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1.1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
</style>
