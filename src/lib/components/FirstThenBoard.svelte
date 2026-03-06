<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { getArasaacUrl, ARASAAC_IDS } from '$lib/data/transition-helper';
  import type { Activity, SavedTransition } from '$lib/data/transition-helper';
  import ActivityGrid from './ActivityGrid.svelte';

  interface Props {
    onStartTimer: () => void;
  }

  let { onStartTimer }: Props = $props();

  let firstActivity = $state<Activity | null>(null);
  let thenActivity = $state<Activity | null>(null);
  let pickingFor = $state<'first' | 'then' | null>(null);
  let justSaved = $state(false);

  function selectActivity(activity: Activity) {
    if (pickingFor === 'first') {
      firstActivity = activity;
    } else if (pickingFor === 'then') {
      thenActivity = activity;
    }
    pickingFor = null;

    // Announce the board state
    if (firstActivity && thenActivity) {
      speak(`${$t('th.first')} ${$t(firstActivity.nameKey)}, ${$t('th.then')} ${$t(thenActivity.nameKey)}`);
    }
  }

  function clearBoard() {
    firstActivity = null;
    thenActivity = null;
  }

  function saveTransition() {
    if (!firstActivity || !thenActivity) return;
    const saved: SavedTransition[] = JSON.parse(localStorage.getItem('th-saved-transitions') || '[]');
    // Don't save duplicates
    const exists = saved.some(s => s.firstId === firstActivity!.id && s.thenId === thenActivity!.id);
    if (!exists) {
      saved.push({
        id: crypto.randomUUID(),
        firstId: firstActivity.id,
        thenId: thenActivity.id,
        createdAt: Date.now()
      });
      localStorage.setItem('th-saved-transitions', JSON.stringify(saved));
    }
    justSaved = true;
    speak($t('th.saved'));
    setTimeout(() => justSaved = false, 2000);
  }
</script>

<div class="first-then-board">
  <p class="instruction">{$t('th.firstThen.instruction')}</p>

  <div class="board">
    <!-- FIRST -->
    <div class="board-side">
      <div class="board-label">
        <img src={getArasaacUrl(ARASAAC_IDS.first)} alt={$t('th.first')} width="40" height="40" />
        <span>{$t('th.first')}</span>
      </div>
      <button
        class="board-slot"
        class:filled={firstActivity}
        onclick={() => pickingFor = 'first'}
        aria-label={firstActivity ? $t(firstActivity.nameKey) : $t('th.pickFirst')}
      >
        {#if firstActivity}
          <img src={getArasaacUrl(firstActivity.arasaacId)} alt={$t(firstActivity.nameKey)} width="120" height="120" />
          <span class="slot-label">{$t(firstActivity.nameKey)}</span>
        {:else}
          <div class="slot-placeholder">
            <span class="plus">+</span>
            <span>{$t('th.pickFirst')}</span>
          </div>
        {/if}
      </button>
    </div>

    <!-- Arrow -->
    <div class="board-arrow" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M8 24h28M28 16l8 8-8 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    </div>

    <!-- THEN -->
    <div class="board-side">
      <div class="board-label">
        <img src={getArasaacUrl(ARASAAC_IDS.then)} alt={$t('th.then')} width="40" height="40" />
        <span>{$t('th.then')}</span>
      </div>
      <button
        class="board-slot"
        class:filled={thenActivity}
        onclick={() => pickingFor = 'then'}
        aria-label={thenActivity ? $t(thenActivity.nameKey) : $t('th.pickThen')}
      >
        {#if thenActivity}
          <img src={getArasaacUrl(thenActivity.arasaacId)} alt={$t(thenActivity.nameKey)} width="120" height="120" />
          <span class="slot-label">{$t(thenActivity.nameKey)}</span>
        {:else}
          <div class="slot-placeholder">
            <span class="plus">+</span>
            <span>{$t('th.pickThen')}</span>
          </div>
        {/if}
      </button>
    </div>
  </div>

  {#if firstActivity && thenActivity}
    <div class="board-actions">
      <button class="action-btn save-btn" onclick={saveTransition} disabled={justSaved}>
        {justSaved ? '✓ ' + $t('th.saved') : '💾 ' + $t('th.saveTransition')}
      </button>
      <button class="action-btn timer-btn" onclick={onStartTimer}>
        ⏱️ {$t('th.startTimer')}
      </button>
      <button class="action-btn clear-btn" onclick={clearBoard}>
        🗑️ {$t('th.clearBoard')}
      </button>
    </div>
  {:else if firstActivity || thenActivity}
    <div class="board-actions">
      <button class="action-btn clear-btn" onclick={clearBoard}>
        🗑️ {$t('th.clearBoard')}
      </button>
    </div>
  {/if}
</div>

{#if pickingFor}
  <ActivityGrid
    onSelect={selectActivity}
    onClose={() => pickingFor = null}
  />
{/if}

<style>
  .first-then-board {
    padding: 16px;
  }

  .instruction {
    text-align: center;
    font-size: 1.1rem;
    color: var(--text-muted, #666);
    margin: 0 0 20px;
  }

  .board {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .board-side {
    flex: 1;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .board-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.3rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .board-label img {
    border-radius: 8px;
  }

  .board-slot {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 20px;
    border: 3px dashed var(--border, #ccc);
    background: var(--bg, #f8f9fa);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    transition: all 0.2s ease;
    min-height: 140px;
  }

  .board-slot:hover,
  .board-slot:focus-visible {
    border-color: var(--primary, #3498DB);
    background: var(--bg-hover, #e8f4fd);
    transform: scale(1.02);
  }

  .board-slot.filled {
    border-style: solid;
    border-color: var(--primary, #3498DB);
    background: var(--bg-card, #fff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .board-slot img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }

  .slot-label {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .slot-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--text-muted, #999);
  }

  .plus {
    font-size: 2.5rem;
    font-weight: 300;
    line-height: 1;
  }

  .slot-placeholder span:last-child {
    font-size: 0.85rem;
    text-align: center;
  }

  .board-arrow {
    color: var(--text-muted, #999);
    flex-shrink: 0;
  }

  .board-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .action-btn {
    padding: 12px 20px;
    border-radius: 14px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    transition: all 0.15s ease;
  }

  .save-btn {
    background: var(--primary, #3498DB);
    color: white;
  }
  .save-btn:disabled {
    background: #27AE60;
  }

  .timer-btn {
    background: #27AE60;
    color: white;
  }

  .clear-btn {
    background: var(--bg-hover, #f0f0f0);
    color: var(--text, #333);
  }

  .action-btn:hover:not(:disabled) {
    transform: scale(1.05);
    filter: brightness(1.1);
  }

  @media (max-width: 480px) {
    .board-slot img {
      width: 80px;
      height: 80px;
    }
    .board-label {
      font-size: 1rem;
    }
    .board-label img {
      width: 30px;
      height: 30px;
    }
    .board-slot {
      min-height: 110px;
      padding: 10px;
    }
  }
</style>
