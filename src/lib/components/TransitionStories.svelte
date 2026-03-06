<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { TRANSITION_STORIES, getArasaacUrl } from '$lib/data/transition-helper';
  import type { TransitionStory } from '$lib/data/transition-helper';
  import { fade } from 'svelte/transition';

  let selectedStory = $state<TransitionStory | null>(null);
  let currentStep = $state(0);

  const isLastStep = $derived(selectedStory ? currentStep >= selectedStory.steps.length - 1 : false);
  const storyDone = $derived(selectedStory ? currentStep >= selectedStory.steps.length : false);

  function selectStory(story: TransitionStory) {
    selectedStory = story;
    currentStep = 0;
    speak($t(story.steps[0].textKey));
  }

  function nextStep() {
    if (!selectedStory) return;
    if (isLastStep) {
      currentStep = selectedStory.steps.length; // mark done
      speak($t('th.stories.done'));
    } else {
      currentStep++;
      speak($t(selectedStory.steps[currentStep].textKey));
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      if (selectedStory) speak($t(selectedStory.steps[currentStep].textKey));
    }
  }

  function restart() {
    currentStep = 0;
    if (selectedStory) speak($t(selectedStory.steps[0].textKey));
  }

  function backToList() {
    selectedStory = null;
    currentStep = 0;
  }
</script>

<div class="transition-stories">
  {#if !selectedStory}
    <!-- Story list -->
    <h2>{$t('th.stories.title')}</h2>
    <p class="instruction">{$t('th.stories.instruction')}</p>
    <div class="story-list">
      {#each TRANSITION_STORIES as story}
        <button class="story-card" onclick={() => selectStory(story)}>
          <div class="story-preview">
            {#each story.steps.slice(0, 3) as step, i}
              <img
                src={getArasaacUrl(step.arasaacId)}
                alt=""
                width="50"
                height="50"
                style="z-index: {3-i}; margin-left: {i > 0 ? '-12px' : '0'}"
              />
            {/each}
          </div>
          <span class="story-title">{$t(story.titleKey)}</span>
          <span class="story-steps">{story.steps.length} steg</span>
        </button>
      {/each}
    </div>
  {:else if storyDone}
    <!-- Story complete -->
    <div class="story-done" transition:fade={{ duration: 200 }}>
      <div class="done-emoji">🎉</div>
      <h2>{$t('th.stories.done')}</h2>
      <div class="done-actions">
        <button class="action-btn" onclick={restart}>
          🔄 {$t('th.stories.restart')}
        </button>
        <button class="action-btn secondary" onclick={backToList}>
          ← {$t('th.stories.title')}
        </button>
      </div>
    </div>
  {:else}
    <!-- Story step -->
    <button class="back-link" onclick={backToList}>← {$t('th.stories.title')}</button>
    <h2>{$t(selectedStory.titleKey)}</h2>

    <!-- Step indicator -->
    <div class="step-dots">
      {#each selectedStory.steps as _, i}
        <div class="dot" class:active={i === currentStep} class:done={i < currentStep}></div>
      {/each}
    </div>

    {#key currentStep}
      <div class="story-step" transition:fade={{ duration: 200 }}>
        <img
          src={getArasaacUrl(selectedStory.steps[currentStep].arasaacId)}
          alt=""
          class="step-image"
        />
        <p class="step-text">{$t(selectedStory.steps[currentStep].textKey)}</p>
      </div>
    {/key}

    <div class="step-nav">
      <button
        class="nav-btn"
        onclick={prevStep}
        disabled={currentStep === 0}
      >
        ← {$t('th.stories.prev')}
      </button>
      <span class="step-counter">{currentStep + 1} / {selectedStory.steps.length}</span>
      <button class="nav-btn primary" onclick={nextStep}>
        {isLastStep ? $t('th.stories.done') + ' ✓' : $t('th.stories.next') + ' →'}
      </button>
    </div>
  {/if}
</div>

<style>
  .transition-stories {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 8px;
  }

  .instruction {
    color: var(--text-muted, #666);
    margin: 0 0 16px;
    text-align: center;
  }

  .story-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 480px;
  }

  .story-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 16px;
    border: 2px solid var(--border, #e0e0e0);
    background: var(--bg-card, #fff);
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
    min-height: 44px;
  }

  .story-card:hover,
  .story-card:focus-visible {
    border-color: var(--primary, #3498DB);
    transform: scale(1.02);
  }

  .story-preview {
    display: flex;
    flex-shrink: 0;
  }

  .story-preview img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: 2px solid var(--bg-card, #fff);
    object-fit: contain;
    background: var(--bg, #f8f9fa);
  }

  .story-title {
    font-weight: 700;
    font-size: 1.05rem;
    flex: 1;
  }

  .story-steps {
    font-size: 0.85rem;
    color: var(--text-muted, #999);
    white-space: nowrap;
  }

  .back-link {
    align-self: flex-start;
    background: none;
    border: none;
    color: var(--primary, #3498DB);
    font-weight: 600;
    cursor: pointer;
    padding: 8px 0;
    margin-bottom: 8px;
  }

  .step-dots {
    display: flex;
    gap: 8px;
    margin: 12px 0;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--border, #ddd);
    transition: all 0.2s ease;
  }

  .dot.active {
    background: var(--primary, #3498DB);
    transform: scale(1.3);
  }

  .dot.done {
    background: #27AE60;
  }

  .story-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .step-image {
    width: 200px;
    height: 200px;
    object-fit: contain;
    border-radius: 16px;
  }

  .step-text {
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.4;
    max-width: 400px;
  }

  .step-nav {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
  }

  .step-counter {
    font-weight: 600;
    color: var(--text-muted, #666);
    font-size: 0.95rem;
  }

  .nav-btn {
    padding: 12px 20px;
    border-radius: 14px;
    border: 2px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    transition: all 0.15s ease;
  }

  .nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .nav-btn.primary {
    background: var(--primary, #3498DB);
    color: white;
    border-color: var(--primary, #3498DB);
  }

  .nav-btn:hover:not(:disabled) { transform: scale(1.05); }

  .story-done {
    text-align: center;
    padding: 40px 20px;
  }

  .done-emoji {
    font-size: 4rem;
    margin-bottom: 12px;
  }

  .done-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
  }

  .action-btn {
    padding: 14px 24px;
    border-radius: 16px;
    border: none;
    background: var(--primary, #3498DB);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    transition: transform 0.15s ease;
  }

  .action-btn.secondary {
    background: var(--bg-hover, #eee);
    color: var(--text, #333);
  }

  .action-btn:hover { transform: scale(1.05); }

  @media (max-width: 480px) {
    .step-image {
      width: 150px;
      height: 150px;
    }
    .step-text {
      font-size: 1.2rem;
    }
  }
</style>
