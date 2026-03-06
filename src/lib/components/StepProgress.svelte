<script lang="ts">
  /**
   * StepProgress — 4-step MIT progression indicator
   * Shows: Humming → Singing → Sprechgesang → Speaking
   * With star markers for completed steps per phrase.
   */
  import { t } from '$lib/i18n';

  type MITStep = {
    id: string;
    labelKey: string;
    icon: string;
    descKey: string;
    color: string;
  };

  export let steps: MITStep[] = [];
  export let currentStepIndex: number = 0;
  export let completedSteps: Set<string> = new Set();
  export let phraseId: string = '';
  export let onStepSelect: (index: number) => void = () => {};
</script>

<div class="step-progress" role="tablist" aria-label="MIT-steg">
  {#each steps as step, i}
    {@const stepKey = `${phraseId}-${step.id}`}
    {@const isActive = i === currentStepIndex}
    {@const isDone = completedSteps.has(stepKey)}
    {@const isReachable = i <= currentStepIndex || isDone || (i > 0 && completedSteps.has(`${phraseId}-${steps[i-1].id}`))}

    <button
      class="step-pill"
      class:active={isActive}
      class:done={isDone}
      class:locked={!isReachable}
      style="--step-color: {step.color}"
      role="tab"
      aria-selected={isActive}
      aria-label="{$t(step.labelKey)} {isDone ? '✓' : ''}"
      onclick={() => isReachable && onStepSelect(i)}
      disabled={!isReachable}
    >
      <span class="step-num">{i + 1}</span>
      <span class="step-icon">{step.icon}</span>
      <span class="step-label">{$t(step.labelKey)}</span>
      {#if isDone}
        <span class="step-star">⭐</span>
      {/if}
    </button>
  {/each}
</div>

<!-- Progress line connecting steps -->
<div class="progress-line">
  <div class="progress-fill" style="width: {((currentStepIndex) / (steps.length - 1)) * 100}%"></div>
</div>

<style>
  .step-progress {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .step-pill {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem 0.7rem;
    border-radius: 24px;
    border: 2px solid var(--border, #e0e0e0);
    background: var(--bg-card, #fff);
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.25s ease;
    min-height: 44px;
    position: relative;
  }

  .step-pill.active {
    background: var(--step-color);
    color: #fff;
    border-color: var(--step-color);
    transform: scale(1.05);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--step-color) 40%, transparent);
  }

  .step-pill.done {
    border-color: var(--step-color);
    background: color-mix(in srgb, var(--step-color) 15%, var(--bg-card, #fff));
  }

  .step-pill.locked {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .step-pill:not(.locked):hover:not(.active) {
    transform: scale(1.02);
    border-color: var(--step-color);
  }

  .step-num {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  .step-icon {
    font-size: 1.1rem;
  }

  .step-label {
    font-weight: 600;
    white-space: nowrap;
  }

  .step-star {
    font-size: 0.9rem;
    position: absolute;
    top: -6px;
    right: -4px;
  }

  .progress-line {
    width: 80%;
    height: 4px;
    background: var(--border, #e0e0e0);
    border-radius: 2px;
    margin: 0.5rem auto 0;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3498DB, #27AE60, #F39C12, #E74C3C);
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  @media (max-width: 480px) {
    .step-label {
      display: none;
    }
    .step-pill {
      padding: 0.5rem;
    }
  }
</style>
