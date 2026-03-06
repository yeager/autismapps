<script lang="ts">
  /**
   * SequenceTrainer — Main component for sequence ordering training.
   *
   * Features:
   * - Drag-and-drop sequencing with ARASAAC pictograms
   * - Category & difficulty filtering
   * - TTS on tap
   * - Hint system
   * - Cause-and-effect mode
   * - Touch-friendly (tablets)
   * - Visual feedback with celebrations
   */
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly, scale } from 'svelte/transition';
  import { browser } from '$app/environment';

  import SequenceStep from './SequenceStep.svelte';
  import DragDropZone from './DragDropZone.svelte';
  import {
    sequences,
    CATEGORIES,
    DIFFICULTY_LEVELS,
    getSequences,
    getArasaacUrl,
    shuffleArray,
  } from '$lib/data/sequence-data.js';

  // ─── State ───
  type Screen = 'menu' | 'play' | 'result' | 'causeEffect';

  let screen = $state<Screen>('menu');
  let selectedCategory = $state<string | null>(null);
  let selectedLevel = $state<number | null>(null);
  let currentSequence = $state<any | null>(null);
  let scrambledSteps = $state<any[]>([]);
  let placedSteps = $state<(any | null)[]>([]);
  let results = $state<(boolean | null)[]>([]);
  let draggedStepIndex = $state<number | null>(null);
  let activeDropSlot = $state<number | null>(null);
  let showResult = $state(false);
  let isCorrectResult = $state(false);
  let hintedSlot = $state<number | null>(null);
  let causeEffectStep = $state<number | null>(null);

  // Touch drag state
  let touchDragElement = $state<HTMLElement | null>(null);
  let touchDragClone = $state<HTMLElement | null>(null);
  let touchStartX = 0;
  let touchStartY = 0;

  // Progress (persisted)
  let completedSequences = $state<Set<string>>(new Set());

  if (browser) {
    try {
      const saved = localStorage.getItem('seq-trainer-progress');
      if (saved) completedSequences = new Set(JSON.parse(saved));
    } catch {}
  }

  function saveProgress() {
    if (browser) {
      localStorage.setItem('seq-trainer-progress', JSON.stringify([...completedSequences]));
    }
  }

  // ─── Derived ───
  const filteredSequences = $derived(getSequences({
    category: selectedCategory || undefined,
    level: selectedLevel || undefined,
  }));

  const totalCompleted = $derived(completedSequences.size);
  const totalSequences = $derived(sequences.length);

  // ─── Actions ───
  function selectSequence(seq: any) {
    currentSequence = seq;
    scrambledSteps = shuffleArray(seq.steps);
    placedSteps = new Array(seq.steps.length).fill(null);
    results = new Array(seq.steps.length).fill(null);
    showResult = false;
    isCorrectResult = false;
    hintedSlot = null;
    causeEffectStep = null;
    draggedStepIndex = null;
    screen = 'play';
  }

  function handleDragStart(e: DragEvent, stepIndex: number) {
    draggedStepIndex = stepIndex;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(stepIndex));
    }
  }

  function handleDragEnd() {
    draggedStepIndex = null;
    activeDropSlot = null;
  }

  function handleDrop(slotIndex: number) {
    if (draggedStepIndex === null) return;
    const step = scrambledSteps[draggedStepIndex];
    if (!step) return;

    // If slot already has something, swap back to scrambled
    if (placedSteps[slotIndex] != null) {
      const existing = placedSteps[slotIndex];
      scrambledSteps = [...scrambledSteps, existing];
    }

    // Place step
    const newPlaced = [...placedSteps];
    newPlaced[slotIndex] = step;
    placedSteps = newPlaced;

    // Remove from scrambled
    scrambledSteps = scrambledSteps.filter((_, i) => i !== draggedStepIndex);
    draggedStepIndex = null;
    activeDropSlot = null;
    results = new Array(currentSequence.steps.length).fill(null);
    showResult = false;
  }

  function handleRemoveFromSlot(slotIndex: number) {
    if (placedSteps[slotIndex] == null) return;
    const step = placedSteps[slotIndex];
    scrambledSteps = [...scrambledSteps, step];
    const newPlaced = [...placedSteps];
    newPlaced[slotIndex] = null;
    placedSteps = newPlaced;
    results = new Array(currentSequence.steps.length).fill(null);
    showResult = false;
  }

  // ─── Touch Drag Support ───
  function handleTouchStart(e: TouchEvent, stepIndex: number) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    draggedStepIndex = stepIndex;

    const target = e.currentTarget as HTMLElement;
    touchDragElement = target;

    // Create a visual clone for dragging
    const clone = target.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.85';
    clone.style.transform = 'scale(1.1)';
    clone.style.width = target.offsetWidth + 'px';
    const rect = target.getBoundingClientRect();
    clone.style.left = (rect.left) + 'px';
    clone.style.top = (rect.top) + 'px';
    document.body.appendChild(clone);
    touchDragClone = clone;

    e.preventDefault();
  }

  function handleTouchMove(e: TouchEvent) {
    if (!touchDragClone || draggedStepIndex === null) return;
    const touch = e.touches[0];
    touchDragClone.style.left = (touch.clientX - 50) + 'px';
    touchDragClone.style.top = (touch.clientY - 60) + 'px';

    // Find drop target
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = elemBelow?.closest('[data-slot-index]');
    if (slot) {
      activeDropSlot = parseInt(slot.getAttribute('data-slot-index') || '-1');
    } else {
      activeDropSlot = null;
    }

    e.preventDefault();
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchDragClone) {
      touchDragClone.remove();
      touchDragClone = null;
    }

    if (activeDropSlot !== null && draggedStepIndex !== null) {
      handleDrop(activeDropSlot);
    }

    draggedStepIndex = null;
    activeDropSlot = null;
    touchDragElement = null;
  }

  function checkOrder() {
    if (!currentSequence) return;
    const allPlaced = placedSteps.every(s => s != null);
    if (!allPlaced) return;

    const newResults = placedSteps.map((step, i) =>
      step ? step.order === currentSequence.steps[i].order : false
    );
    results = newResults;
    isCorrectResult = newResults.every(r => r === true);
    showResult = true;

    if (isCorrectResult) {
      completedSequences.add(currentSequence.id);
      completedSequences = completedSequences;
      saveProgress();

      // Read celebration text
      const lang = $locale;
      speak(lang === 'sv' ? 'Rätt! Bra jobbat!' : 'Correct! Well done!', { lang });
    } else {
      const lang = $locale;
      speak(lang === 'sv' ? 'Inte riktigt rätt. Försök igen!' : 'Not quite right. Try again!', { lang });
    }
  }

  function giveHint() {
    if (!currentSequence) return;

    // Find first unfilled or incorrectly placed slot
    for (let i = 0; i < currentSequence.steps.length; i++) {
      const correctStep = currentSequence.steps[i];
      if (!placedSteps[i] || placedSteps[i].order !== correctStep.order) {
        // If there's something wrong here, remove it first
        if (placedSteps[i]) {
          scrambledSteps = [...scrambledSteps, placedSteps[i]];
        }

        // Find the correct step in scrambled
        const correctIdx = scrambledSteps.findIndex(s => s.order === correctStep.order);
        if (correctIdx >= 0) {
          const step = scrambledSteps[correctIdx];
          const newPlaced = [...placedSteps];
          newPlaced[i] = step;
          placedSteps = newPlaced;
          scrambledSteps = scrambledSteps.filter((_, idx) => idx !== correctIdx);
        }

        hintedSlot = i;
        const lang = $locale;
        speak(
          lang === 'sv'
            ? `Ledtråd: Steg ${i + 1} visas`
            : `Hint: Step ${i + 1} is shown`,
          { lang }
        );
        break;
      }
    }
  }

  function resetSequence() {
    if (!currentSequence) return;
    selectSequence(currentSequence);
  }

  function nextSequence() {
    const available = filteredSequences.filter(s => s.id !== currentSequence?.id);
    if (available.length > 0) {
      const next = available[Math.floor(Math.random() * available.length)];
      selectSequence(next);
    } else {
      screen = 'menu';
    }
  }

  function enterCauseEffect() {
    if (!currentSequence) return;
    // Place all steps correctly first
    placedSteps = [...currentSequence.steps];
    scrambledSteps = [];
    results = new Array(currentSequence.steps.length).fill(null);
    showResult = false;
    causeEffectStep = null;
    screen = 'causeEffect';
  }

  function toggleCauseEffectStep(order: number) {
    if (causeEffectStep === order) {
      causeEffectStep = null;
    } else {
      causeEffectStep = order;
      const step = currentSequence.steps.find((s: any) => s.order === order);
      if (step) {
        const lang = $locale;
        const desc = step.description[lang] || step.description.en;
        speak(
          lang === 'sv'
            ? `Vad händer om vi hoppar över: ${desc}?`
            : `What happens if we skip: ${desc}?`,
          { lang }
        );
      }
    }
  }

  function resetProgress() {
    completedSequences = new Set();
    saveProgress();
  }

  function goHome() {
    goto(`${base}/`);
  }

  function goBack() {
    if (screen === 'play' || screen === 'causeEffect') {
      screen = 'menu';
    } else {
      goHome();
    }
  }

  // Add global touch event listeners for drag
  if (browser) {
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  }
</script>

<div class="sequence-trainer" ontouchmove={handleTouchMove} ontouchend={handleTouchEnd}>
  <!-- Top bar -->
  <header class="top-bar">
    <button class="back-btn" onclick={goBack} aria-label={$t('seq.back')}>
      ← {$t('seq.back')}
    </button>
    <h1 class="app-title">🔢 {$t('app.sequence_trainer')}</h1>
    <div class="progress-badge">
      {$t('seq.progress', { done: String(totalCompleted), total: String(totalSequences) })}
    </div>
  </header>

  {#if screen === 'menu'}
    <!-- ═══ MENU SCREEN ═══ -->
    <div class="menu" in:fade={{ duration: 200 }}>
      <!-- Level filter -->
      <section class="filter-section">
        <h2>{$t('seq.chooseLevel')}</h2>
        <div class="level-buttons">
          <button
            class="level-btn"
            class:active={selectedLevel === null}
            onclick={() => selectedLevel = null}
          >
            {$t('seq.allLevels')}
          </button>
          {#each DIFFICULTY_LEVELS as lv}
            <button
              class="level-btn"
              class:active={selectedLevel === lv.level}
              style="--level-color: {lv.color}"
              onclick={() => selectedLevel = lv.level}
            >
              {lv.icon} {$t(lv.labelKey)}
            </button>
          {/each}
        </div>
      </section>

      <!-- Category filter -->
      <section class="filter-section">
        <h2>{$t('seq.chooseCategory')}</h2>
        <div class="category-grid">
          <button
            class="category-card"
            class:active={selectedCategory === null}
            onclick={() => selectedCategory = null}
          >
            <span class="cat-icon">📋</span>
            <span class="cat-label">{$t('seq.allLevels')}</span>
          </button>
          {#each CATEGORIES as cat}
            <button
              class="category-card"
              class:active={selectedCategory === cat.id}
              style="--cat-color: {cat.color}"
              onclick={() => selectedCategory = cat.id}
            >
              <span class="cat-icon">{cat.icon}</span>
              <span class="cat-label">{$t(cat.labelKey)}</span>
            </button>
          {/each}
        </div>
      </section>

      <!-- Sequence list -->
      <section class="sequence-list">
        <h2>{$t('seq.chooseSequence')}</h2>
        <div class="sequence-grid">
          {#each filteredSequences as seq}
            <button
              class="sequence-card"
              class:completed={completedSequences.has(seq.id)}
              onclick={() => selectSequence(seq)}
            >
              <div class="seq-header">
                <span class="seq-level">{'⭐'.repeat(seq.level)}</span>
                {#if completedSequences.has(seq.id)}
                  <span class="completed-badge">✅</span>
                {/if}
              </div>
              <img
                src={getArasaacUrl(seq.steps[0].arasaacId)}
                alt=""
                class="seq-preview"
              />
              <span class="seq-title">{seq.title[$locale] || seq.title.en}</span>
              <span class="seq-steps">{seq.steps.length} {$t('seq.step')}</span>
            </button>
          {/each}
        </div>
      </section>

      <!-- Reset progress -->
      {#if totalCompleted > 0}
        <button class="reset-btn" onclick={resetProgress}>
          🔄 {$t('seq.resetProgress')}
        </button>
      {/if}
    </div>

  {:else if screen === 'play'}
    <!-- ═══ PLAY SCREEN ═══ -->
    <div class="play-screen" in:fly={{ y: 30, duration: 300 }}>
      <h2 class="sequence-title">
        {currentSequence?.title[$locale] || currentSequence?.title.en}
      </h2>

      <p class="instruction">{$t('seq.tapToHear')}</p>

      <!-- Scrambled steps (source) -->
      {#if scrambledSteps.length > 0}
        <div class="scrambled-area">
          <p class="area-label">{$t('seq.dragInstruction')}</p>
          <div class="steps-row">
            {#each scrambledSteps as step, i}
              <SequenceStep
                {step}
                index={i}
                isDragging={draggedStepIndex === i}
                ondragstart={(e) => handleDragStart(e, i)}
                ondragend={handleDragEnd}
                ontouchstart={(e) => handleTouchStart(e, i)}
              />
            {/each}
          </div>
        </div>
      {/if}

      <!-- Drop zone -->
      <div class="drop-area">
        <div class="drop-zone-wrapper">
          <p class="zone-label">{$t('seq.dragHere')}</p>
          <div class="slots-row">
            {#each Array(currentSequence?.steps.length || 0) as _, i}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="slot"
                class:filled={placedSteps[i] != null}
                class:active-drop={activeDropSlot === i}
                class:correct={results[i] === true}
                class:incorrect={results[i] === false}
                class:hinted={hintedSlot === i}
                data-slot-index={i}
                role="button"
                tabindex="0"
                ondragover={(e) => { e.preventDefault(); activeDropSlot = i; }}
                ondragleave={() => { if (activeDropSlot === i) activeDropSlot = null; }}
                ondrop={(e) => { e.preventDefault(); handleDrop(i); }}
                onclick={() => handleRemoveFromSlot(i)}
                onkeydown={(e) => { if (e.key === 'Enter') handleRemoveFromSlot(i); }}
              >
                <div class="slot-number">{i + 1}</div>
                {#if placedSteps[i]}
                  <img
                    src={getArasaacUrl(placedSteps[i].arasaacId)}
                    alt={placedSteps[i].description[$locale] || placedSteps[i].description.en}
                    class="slot-image"
                    draggable="false"
                  />
                  <p class="slot-label">{placedSteps[i].description[$locale] || placedSteps[i].description.en}</p>
                  {#if results[i] === true}
                    <div class="slot-badge">✅</div>
                  {:else if results[i] === false}
                    <div class="slot-badge">❌</div>
                  {/if}
                {:else}
                  <div class="empty-slot-content">
                    <span class="drop-icon">📥</span>
                    <span class="drop-text">{$t('seq.emptySlot')}</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="action-bar">
        <button class="action-btn hint-btn" onclick={giveHint} disabled={scrambledSteps.length === 0}>
          💡 {$t('seq.hint')}
        </button>

        {#if !showResult}
          <button
            class="action-btn check-btn"
            onclick={checkOrder}
            disabled={placedSteps.some(s => s == null)}
          >
            ✔️ {$t('seq.checkOrder')}
          </button>
        {:else if isCorrectResult}
          <button class="action-btn next-btn" onclick={nextSequence}>
            ➡️ {$t('seq.nextSequence')}
          </button>
          <button class="action-btn cause-btn" onclick={enterCauseEffect}>
            🤔 {$t('seq.causeEffectMode')}
          </button>
        {:else}
          <button class="action-btn retry-btn" onclick={resetSequence}>
            🔄 {$t('seq.tryAgain')}
          </button>
        {/if}
      </div>

      <!-- Result overlay -->
      {#if showResult}
        <div class="result-overlay" in:scale={{ duration: 300 }}>
          {#if isCorrectResult}
            <div class="celebration">
              <span class="big-emoji">🎉</span>
              <p class="result-text correct-text">{$t('seq.correct')}</p>
            </div>
          {:else}
            <p class="result-text incorrect-text">{$t('seq.incorrect')}</p>
          {/if}
        </div>
      {/if}
    </div>

  {:else if screen === 'causeEffect'}
    <!-- ═══ CAUSE & EFFECT SCREEN ═══ -->
    <div class="cause-effect-screen" in:fly={{ y: 30, duration: 300 }}>
      <h2 class="sequence-title">
        🤔 {$t('seq.causeEffectTitle')}
      </h2>
      <h3 class="ce-subtitle">
        {currentSequence?.title[$locale] || currentSequence?.title.en}
      </h3>

      <p class="instruction">{$t('seq.thinkAboutIt')}</p>

      <div class="ce-steps">
        {#each currentSequence?.steps || [] as step, i}
          <div class="ce-step-wrapper">
            <SequenceStep
              {step}
              index={i}
              showOrder={true}
              disabled={true}
              causeEffectHidden={causeEffectStep === step.order}
              ontap={() => toggleCauseEffectStep(step.order)}
            />
            {#if causeEffectStep === step.order}
              <div class="ce-explanation" in:fly={{ y: -10, duration: 200 }}>
                <p>{$t('seq.causeEffectExplain', { step: step.description[$locale] || step.description.en })}</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="action-bar">
        <button class="action-btn" onclick={() => screen = 'play'}>
          ← {$t('seq.back')}
        </button>
        <button class="action-btn next-btn" onclick={nextSequence}>
          ➡️ {$t('seq.nextSequence')}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .sequence-trainer {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Top bar */
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .back-btn {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #3498DB;
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
  }

  .back-btn:hover {
    background: #f0f8ff;
  }

  .app-title {
    font-size: 1.3rem;
    margin: 0;
    color: #333;
  }

  .progress-badge {
    background: #e8f5e9;
    color: #2e7d32;
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* Menu screen */
  .menu {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .filter-section h2, .sequence-list h2 {
    font-size: 1.1rem;
    color: #555;
    margin: 0 0 0.5rem;
  }

  .level-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .level-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #ddd;
    border-radius: 2rem;
    background: white;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .level-btn.active {
    border-color: var(--level-color, #3498DB);
    background: color-mix(in srgb, var(--level-color, #3498DB) 10%, white);
    font-weight: 600;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem;
  }

  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 1rem 0.5rem;
    border: 2px solid #eee;
    border-radius: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-card.active {
    border-color: var(--cat-color, #3498DB);
    background: color-mix(in srgb, var(--cat-color, #3498DB) 8%, white);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .cat-icon {
    font-size: 2rem;
  }

  .cat-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #444;
    text-align: center;
  }

  .sequence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .sequence-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.75rem;
    border: 2px solid #eee;
    border-radius: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sequence-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .sequence-card.completed {
    border-color: #27AE60;
    background: #f0fff4;
  }

  .seq-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }

  .seq-level {
    font-size: 0.7rem;
  }

  .completed-badge {
    font-size: 1rem;
  }

  .seq-preview {
    width: 70px;
    height: 70px;
    object-fit: contain;
    border-radius: 0.5rem;
  }

  .seq-title {
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    color: #333;
  }

  .seq-steps {
    font-size: 0.75rem;
    color: #888;
  }

  .reset-btn {
    align-self: center;
    background: none;
    border: 1px solid #ddd;
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    color: #888;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .reset-btn:hover {
    border-color: #E74C3C;
    color: #E74C3C;
  }

  /* Play screen */
  .play-screen {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
  }

  .sequence-title {
    font-size: 1.2rem;
    margin: 0;
    text-align: center;
    color: #333;
  }

  .instruction {
    text-align: center;
    color: #888;
    margin: 0;
    font-size: 0.9rem;
  }

  .scrambled-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .area-label {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
  }

  .steps-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5rem;
  }

  /* Drop zone inline */
  .drop-area {
    margin-top: 0.5rem;
  }

  .drop-zone-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 1.5rem;
    border: 3px dashed #adb5bd;
  }

  .zone-label {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
    font-weight: 500;
  }

  .slots-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .slot {
    position: relative;
    width: 110px;
    min-height: 140px;
    border: 3px dashed #ccc;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    background: white;
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 0.5rem 0.25rem;
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
  }

  .slot.incorrect {
    border-color: #E74C3C;
    background: #fff5f5;
    animation: slotShake 0.4s ease;
  }

  .slot.hinted {
    border-color: #F39C12;
    background: #fffde7;
    box-shadow: 0 0 12px rgba(243, 156, 18, 0.3);
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
    width: 75px;
    height: 75px;
    object-fit: contain;
    border-radius: 0.5rem;
    pointer-events: none;
  }

  .slot-label {
    font-size: 0.7rem;
    text-align: center;
    color: #555;
    margin: 0;
    line-height: 1.2;
    max-width: 100px;
  }

  .slot-badge {
    position: absolute;
    bottom: -6px;
    right: -6px;
    font-size: 1.2rem;
  }

  .empty-slot-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    opacity: 0.4;
  }

  .drop-icon {
    font-size: 1.5rem;
  }

  .drop-text {
    font-size: 0.65rem;
    color: #999;
  }

  /* Action bar */
  .action-bar {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .action-btn {
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .action-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .hint-btn {
    background: #FFF3CD;
    color: #856404;
  }

  .check-btn {
    background: #3498DB;
    color: white;
  }

  .check-btn:not(:disabled):hover {
    background: #2980b9;
    transform: translateY(-1px);
  }

  .retry-btn {
    background: #E74C3C;
    color: white;
  }

  .next-btn {
    background: #27AE60;
    color: white;
  }

  .cause-btn {
    background: #9B59B6;
    color: white;
  }

  /* Result overlay */
  .result-overlay {
    text-align: center;
    padding: 1rem;
  }

  .celebration {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .big-emoji {
    font-size: 3rem;
    animation: bounce 0.6s ease infinite alternate;
  }

  .result-text {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
  }

  .correct-text {
    color: #27AE60;
  }

  .incorrect-text {
    color: #E74C3C;
  }

  /* Cause & Effect screen */
  .cause-effect-screen {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .ce-subtitle {
    margin: 0;
    color: #666;
    font-size: 1rem;
  }

  .ce-steps {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
  }

  .ce-step-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .ce-explanation {
    background: #FFF3CD;
    border: 1px solid #F39C12;
    border-radius: 0.75rem;
    padding: 0.5rem 0.75rem;
    max-width: 150px;
    text-align: center;
    font-size: 0.8rem;
    color: #856404;
  }

  .ce-explanation p {
    margin: 0;
  }

  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
  }

  @keyframes slotShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  /* Mobile */
  @media (max-width: 600px) {
    .sequence-trainer {
      padding: 0.5rem;
    }

    .app-title {
      font-size: 1.1rem;
    }

    .slot {
      width: 85px;
      min-height: 115px;
    }

    .slot-image {
      width: 55px;
      height: 55px;
    }

    .sequence-grid {
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    }

    .action-btn {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>
