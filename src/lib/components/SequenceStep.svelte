<script lang="ts">
  /**
   * SequenceStep — A single draggable step card with ARASAAC pictogram.
   * Handles drag events for both mouse and touch.
   */
  import { t, locale } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { getArasaacUrl } from '$lib/data/sequence-data.js';

  interface Props {
    step: { description: { en: string; sv: string }; arasaacId: number; order: number };
    index: number;
    isDragging?: boolean;
    isCorrect?: boolean | null;
    isHinted?: boolean;
    showOrder?: boolean;
    disabled?: boolean;
    causeEffectHidden?: boolean;
    ondragstart?: (e: DragEvent) => void;
    ondragend?: (e: DragEvent) => void;
    ontouchstart?: (e: TouchEvent) => void;
    ontap?: () => void;
  }

  let {
    step,
    index,
    isDragging = false,
    isCorrect = null,
    isHinted = false,
    showOrder = false,
    disabled = false,
    causeEffectHidden = false,
    ondragstart,
    ondragend,
    ontouchstart,
    ontap,
  }: Props = $props();

  const imgUrl = $derived(getArasaacUrl(step.arasaacId));
  const lang = $derived($locale);
  const description = $derived(step.description[lang] || step.description.en);

  function handleTap() {
    speak(description, { lang });
    ontap?.();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTap();
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="step-card"
  class:dragging={isDragging}
  class:correct={isCorrect === true}
  class:incorrect={isCorrect === false}
  class:hinted={isHinted}
  class:disabled
  class:cause-effect-hidden={causeEffectHidden}
  draggable={!disabled}
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-label={description}
  ondragstart={ondragstart}
  ondragend={ondragend}
  ontouchstart={ontouchstart}
  onclick={handleTap}
  onkeydown={handleKeydown}
>
  {#if causeEffectHidden}
    <div class="hidden-overlay">
      <span class="hidden-icon">❓</span>
    </div>
  {:else}
    <div class="step-image-wrap">
      <img
        src={imgUrl}
        alt={description}
        class="step-image"
        draggable="false"
      />
      {#if isCorrect === true}
        <div class="checkmark">✅</div>
      {/if}
      {#if showOrder}
        <div class="order-badge">{step.order}</div>
      {/if}
      {#if isHinted}
        <div class="hint-badge">💡</div>
      {/if}
    </div>
    <p class="step-label">{description}</p>
  {/if}
</div>

<style>
  .step-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem;
    border-radius: 1rem;
    background: white;
    border: 3px solid #e0e0e0;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.3s;
    position: relative;
    min-width: 100px;
    max-width: 140px;
  }

  .step-card:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .step-card:active:not(.disabled) {
    cursor: grabbing;
  }

  .step-card.dragging {
    opacity: 0.4;
    transform: scale(0.95);
  }

  .step-card.correct {
    border-color: #27AE60;
    background: #f0fff4;
    animation: correctPulse 0.5s ease;
  }

  .step-card.incorrect {
    border-color: #E74C3C;
    background: #fff5f5;
    animation: shake 0.4s ease;
  }

  .step-card.hinted {
    border-color: #F39C12;
    background: #fffde7;
    box-shadow: 0 0 12px rgba(243, 156, 18, 0.4);
  }

  .step-card.disabled {
    cursor: default;
    opacity: 0.8;
  }

  .step-card.cause-effect-hidden {
    background: #f0f0f0;
    border-color: #ccc;
    border-style: dashed;
    min-height: 140px;
    justify-content: center;
  }

  .step-image-wrap {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .step-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
    pointer-events: none;
  }

  .checkmark {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 1.5rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
  }

  .order-badge {
    position: absolute;
    top: -6px;
    left: -6px;
    background: #3498DB;
    color: white;
    font-weight: bold;
    font-size: 0.85rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }

  .hint-badge {
    position: absolute;
    bottom: -6px;
    right: -6px;
    font-size: 1.2rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
  }

  .hidden-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
  }

  .hidden-icon {
    font-size: 2.5rem;
  }

  .step-label {
    font-size: 0.8rem;
    text-align: center;
    margin: 0;
    color: #333;
    line-height: 1.2;
    max-width: 120px;
    word-wrap: break-word;
  }

  @keyframes correctPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  @media (max-width: 480px) {
    .step-card {
      min-width: 80px;
      max-width: 110px;
      padding: 0.4rem;
    }
    .step-image-wrap {
      width: 75px;
      height: 75px;
    }
    .step-label {
      font-size: 0.7rem;
    }
  }
</style>
