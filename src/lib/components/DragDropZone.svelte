<script lang="ts">
  /**
   * DragDropZone — Drop zone area where steps are placed in order.
   * Supports both HTML5 drag-and-drop and touch-based drag.
   */
  import { t } from '$lib/i18n';

  interface Props {
    totalSlots: number;
    placedSteps: (any | null)[];
    onDrop: (slotIndex: number) => void;
    onRemove: (slotIndex: number) => void;
    activeDropSlot?: number | null;
    results?: (boolean | null)[];
  }

  let {
    totalSlots,
    placedSteps,
    onDrop,
    onRemove,
    activeDropSlot = null,
    results = [],
  }: Props = $props();

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e: DragEvent, slotIndex: number) {
    e.preventDefault();
    onDrop(slotIndex);
  }

  function handleSlotClick(slotIndex: number) {
    if (placedSteps[slotIndex]) {
      onRemove(slotIndex);
    }
  }

  function handleSlotKeydown(e: KeyboardEvent, slotIndex: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSlotClick(slotIndex);
    }
  }
</script>

<div class="drop-zone">
  <p class="zone-label">{$t('seq.dragHere')}</p>
  <div class="slots" style="--slot-count: {totalSlots}">
    {#each Array(totalSlots) as _, i}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="slot"
        class:filled={placedSteps[i] != null}
        class:active-drop={activeDropSlot === i}
        class:correct={results[i] === true}
        class:incorrect={results[i] === false}
        role="button"
        tabindex="0"
        aria-label="{$t('seq.step')} {i + 1}{placedSteps[i] ? ': ' + (placedSteps[i].description[$locale] || placedSteps[i].description.en) : ''}"
        ondragover={handleDragOver}
        ondrop={(e) => handleDrop(e, i)}
        onclick={() => handleSlotClick(i)}
        onkeydown={(e) => handleSlotKeydown(e, i)}
      >
        <div class="slot-number">{i + 1}</div>
        {#if placedSteps[i]}
          <img
            src={`https://static.arasaac.org/pictograms/${placedSteps[i].arasaacId}/${placedSteps[i].arasaacId}_500.png`}
            alt={placedSteps[i].description.en}
            class="slot-image"
            draggable="false"
          />
          {#if results[i] === true}
            <div class="slot-checkmark">✅</div>
          {:else if results[i] === false}
            <div class="slot-cross">❌</div>
          {/if}
        {:else}
          <div class="empty-slot">
            <span class="drop-icon">📥</span>
            <span class="drop-text">{$t('seq.emptySlot')}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<script context="module" lang="ts">
  import { locale } from '$lib/i18n';
</script>

<style>
  .drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 1.5rem;
    border: 3px dashed #adb5bd;
    min-height: 160px;
  }

  .zone-label {
    font-size: 1rem;
    color: #666;
    margin: 0;
    font-weight: 500;
  }

  .slots {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .slot {
    position: relative;
    width: 110px;
    height: 130px;
    border: 3px dashed #ccc;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .slot.filled {
    border-style: solid;
    border-color: #3498DB;
    background: #f0f8ff;
  }

  .slot.active-drop {
    border-color: #27AE60;
    background: #f0fff4;
    transform: scale(1.05);
    box-shadow: 0 0 16px rgba(39, 174, 96, 0.3);
  }

  .slot.correct {
    border-color: #27AE60;
    background: #f0fff4;
    animation: slotCorrect 0.5s ease;
  }

  .slot.incorrect {
    border-color: #E74C3C;
    background: #fff5f5;
    animation: slotShake 0.4s ease;
  }

  .slot-number {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #3498DB;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .slot-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 0.5rem;
    pointer-events: none;
  }

  .slot-checkmark, .slot-cross {
    position: absolute;
    bottom: -6px;
    right: -6px;
    font-size: 1.3rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
  }

  .empty-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    opacity: 0.5;
  }

  .drop-icon {
    font-size: 1.5rem;
  }

  .drop-text {
    font-size: 0.65rem;
    color: #999;
  }

  @keyframes slotCorrect {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
  }

  @keyframes slotShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @media (max-width: 480px) {
    .slot {
      width: 85px;
      height: 105px;
    }
    .slot-image {
      width: 60px;
      height: 60px;
    }
    .slots {
      gap: 0.5rem;
    }
  }
</style>
