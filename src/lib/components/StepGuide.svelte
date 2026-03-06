<script lang="ts">
  /**
   * StepGuide — Step-by-step PROMPT instructions for a sound
   *
   * Displays 4 steps with icons, current step highlighted.
   * Emits step changes for the face diagram to sync.
   */
  import { fly } from 'svelte/transition';

  let {
    steps = [] as string[],
    currentStep = $bindable(0),
    pressure = 'medium',
    duration = 'brief',
    pressureLabel = '',
    durationLabel = '',
  }: {
    steps?: string[];
    currentStep?: number;
    pressure?: string;
    duration?: string;
    pressureLabel?: string;
    durationLabel?: string;
  } = $props();

  const STEP_ICONS = ['🖐️', '👆', '➡️', '✅'];
  const STEP_LABELS = ['Förbered', 'Beröringspunkt', 'Rörelseriktning', 'Släpp'];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep = currentStep + 1;
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep = currentStep - 1;
    }
  }

  function goToStep(idx: number) {
    currentStep = idx;
  }

  // Pressure bar visualization
  const pressureBars = $derived(
    pressure === 'light' ? 1 : pressure === 'medium' ? 2 : 3
  );
</script>

<div class="step-guide">
  <!-- Pressure & Duration indicators -->
  <div class="indicators">
    <div class="indicator">
      <span class="indicator-label">Tryck:</span>
      <span class="pressure-bars" aria-label="{pressureLabel}">
        {#each Array(3) as _, i}
          <span
            class="bar"
            class:active={i < pressureBars}
            style:background-color={i < pressureBars
              ? (pressure === 'light' ? '#27AE60' : pressure === 'medium' ? '#F39C12' : '#E74C3C')
              : '#DDD'}
          ></span>
        {/each}
      </span>
      <span class="indicator-text">{pressureLabel}</span>
    </div>
    <div class="indicator">
      <span class="indicator-label">Längd:</span>
      <span class="indicator-text">{durationLabel}</span>
    </div>
  </div>

  <!-- Step progress dots -->
  <div class="step-dots" role="tablist" aria-label="Steg">
    {#each steps as _, i}
      <button
        class="dot"
        class:active={i === currentStep}
        class:completed={i < currentStep}
        role="tab"
        aria-selected={i === currentStep}
        aria-label="Steg {i + 1}"
        onclick={() => goToStep(i)}
      >
        {i + 1}
      </button>
      {#if i < steps.length - 1}
        <div class="dot-line" class:completed={i < currentStep}></div>
      {/if}
    {/each}
  </div>

  <!-- Current step display -->
  <div class="step-content" role="tabpanel">
    {#each steps as step, i}
      {#if i === currentStep}
        <div class="step-card" in:fly={{ y: 20, duration: 250 }}>
          <div class="step-header">
            <span class="step-icon">{STEP_ICONS[i] || '📌'}</span>
            <span class="step-number">Steg {i + 1}</span>
            <span class="step-label">{STEP_LABELS[i] || ''}</span>
          </div>
          <p class="step-text">{step}</p>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Navigation buttons -->
  <div class="step-nav">
    <button
      class="nav-btn"
      onclick={prevStep}
      disabled={currentStep === 0}
      aria-label="Föregående steg"
    >
      ← Tillbaka
    </button>
    <span class="step-counter">{currentStep + 1} / {steps.length}</span>
    <button
      class="nav-btn primary"
      onclick={nextStep}
      disabled={currentStep >= steps.length - 1}
      aria-label="Nästa steg"
    >
      Nästa →
    </button>
  </div>
</div>

<style>
  .step-guide {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  .indicators {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
  }

  .indicator-label {
    font-weight: 600;
    color: #555;
  }

  .indicator-text {
    font-weight: 500;
    color: #333;
  }

  .pressure-bars {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .bar {
    width: 20px;
    height: 8px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .step-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin: 1rem 0;
  }

  .dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2.5px solid #BDC3C7;
    background: white;
    font-weight: 700;
    font-size: 1rem;
    color: #7F8C8D;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dot.active {
    border-color: #3498DB;
    background: #3498DB;
    color: white;
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  }

  .dot.completed {
    border-color: #27AE60;
    background: #27AE60;
    color: white;
  }

  .dot-line {
    width: 24px;
    height: 3px;
    background: #BDC3C7;
    transition: background 0.3s;
  }

  .dot-line.completed {
    background: #27AE60;
  }

  .step-content {
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-card {
    background: white;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border-left: 5px solid #3498DB;
    width: 100%;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .step-icon {
    font-size: 1.5rem;
  }

  .step-number {
    font-weight: 700;
    color: #3498DB;
    font-size: 0.9rem;
  }

  .step-label {
    color: #7F8C8D;
    font-size: 0.85rem;
  }

  .step-text {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #2C3E50;
    margin: 0;
    font-weight: 500;
  }

  .step-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    gap: 0.5rem;
  }

  .nav-btn {
    padding: 0.6rem 1.2rem;
    border: 2px solid #BDC3C7;
    border-radius: 12px;
    background: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #555;
  }

  .nav-btn:hover:not(:disabled) {
    border-color: #3498DB;
    color: #3498DB;
  }

  .nav-btn.primary {
    background: #3498DB;
    color: white;
    border-color: #3498DB;
  }

  .nav-btn.primary:hover:not(:disabled) {
    background: #2980B9;
  }

  .nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .step-counter {
    font-weight: 600;
    color: #7F8C8D;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    .step-text {
      font-size: 1.1rem;
    }
    .step-card {
      padding: 1rem;
    }
  }
</style>
