<script>
  import { t } from '$lib/i18n';
  import SagittalView from './SagittalView.svelte';
  import { tonguePositions } from '$lib/data/tongue-positions';

  export let darkMode = false;
  export let onClose = () => {};
  export let onSpeak = (text) => {};

  const allSounds = Object.keys(tonguePositions);

  let leftSound = 'a';
  let rightSound = 'i';

  $: leftPos = tonguePositions[leftSound];
  $: rightPos = tonguePositions[rightSound];
</script>

<div class="comparison-overlay">
  <div class="comparison-dialog" class:dark={darkMode}>
    <div class="comparison-header">
      <h2>{$t('tongueViewer.comparison.title')}</h2>
      <button class="close-btn" on:click={onClose} aria-label="Close">✕</button>
    </div>

    <div class="comparison-controls">
      <div class="sound-picker">
        <label for="left-sound">{$t('tongueViewer.comparison.sound')} 1:</label>
        <select id="left-sound" bind:value={leftSound}>
          {#each allSounds as s}
            <option value={s}>{tonguePositions[s].label} ({tonguePositions[s].ipa})</option>
          {/each}
        </select>
        <button class="speak-btn" on:click={() => onSpeak(tonguePositions[leftSound].example)} aria-label="Lyssna">
          🔊
        </button>
      </div>
      <div class="vs">↔</div>
      <div class="sound-picker">
        <label for="right-sound">{$t('tongueViewer.comparison.sound')} 2:</label>
        <select id="right-sound" bind:value={rightSound}>
          {#each allSounds as s}
            <option value={s}>{tonguePositions[s].label} ({tonguePositions[s].ipa})</option>
          {/each}
        </select>
        <button class="speak-btn" on:click={() => onSpeak(tonguePositions[rightSound].example)} aria-label="Lyssna">
          🔊
        </button>
      </div>
    </div>

    <div class="comparison-views">
      <div class="comparison-side">
        <div class="sound-label">{leftPos.label} <span class="ipa">[{leftPos.ipa}]</span></div>
        <div class="sound-example">"{leftPos.example}"</div>
        <SagittalView position={leftPos} {darkMode} />
      </div>
      <div class="comparison-side">
        <div class="sound-label">{rightPos.label} <span class="ipa">[{rightPos.ipa}]</span></div>
        <div class="sound-example">"{rightPos.example}"</div>
        <SagittalView position={rightPos} {darkMode} />
      </div>
    </div>

    <div class="comparison-diff">
      <h3>🔍 {$t('tongueViewer.comparison.differences')}</h3>
      <ul>
        {#if leftPos.lips !== rightPos.lips}
          <li>👄 {$t('tongueViewer.lips')}: <strong>{leftPos.lips}</strong> → <strong>{rightPos.lips}</strong></li>
        {/if}
        {#if leftPos.contact !== rightPos.contact}
          <li>👆 {$t('tongueViewer.contact')}: <strong>{leftPos.contact || '—'}</strong> → <strong>{rightPos.contact || '—'}</strong></li>
        {/if}
        {#if leftPos.velum !== rightPos.velum}
          <li>🫁 {$t('tongueViewer.velum')}: <strong>{leftPos.velum}</strong> → <strong>{rightPos.velum}</strong></li>
        {/if}
        {#if leftPos.voiced !== rightPos.voiced}
          <li>🔔 {$t('tongueViewer.voicing')}: <strong>{leftPos.voiced ? '✓' : '✕'}</strong> → <strong>{rightPos.voiced ? '✓' : '✕'}</strong></li>
        {/if}
        {#if leftPos.airflow !== rightPos.airflow}
          <li>💨 {$t('tongueViewer.airflow')}: <strong>{leftPos.airflow || '—'}</strong> → <strong>{rightPos.airflow || '—'}</strong></li>
        {/if}
        {#if Math.abs(leftPos.tip[1] - rightPos.tip[1]) > 0.1 || Math.abs(leftPos.body[1] - rightPos.body[1]) > 0.1}
          <li>👅 {$t('tongueViewer.tongueHeight')}: {leftPos.body[1] < rightPos.body[1] ? $t('tongueViewer.higher') + ' → ' + $t('tongueViewer.lower') : $t('tongueViewer.lower') + ' → ' + $t('tongueViewer.higher')}</li>
        {/if}
      </ul>
    </div>
  </div>
</div>

<style>
  .comparison-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
    overflow-y: auto;
  }

  .comparison-dialog {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .comparison-dialog.dark {
    background: #1a1a2e;
    color: #e0e0e0;
  }

  .comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .comparison-header h2 {
    margin: 0;
    font-size: 1.4rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .comparison-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .sound-picker {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sound-picker select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 2px solid #ddd;
    font-size: 1rem;
    min-height: 44px;
  }

  .dark .sound-picker select {
    background: #252545;
    color: #e0e0e0;
    border-color: #444;
  }

  .speak-btn {
    background: #4a90d9;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vs {
    font-size: 1.5rem;
    font-weight: bold;
    color: #888;
  }

  .comparison-views {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .comparison-views {
      grid-template-columns: 1fr;
    }
  }

  .comparison-side {
    text-align: center;
  }

  .sound-label {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .ipa {
    color: #888;
    font-weight: normal;
  }

  .sound-example {
    color: #888;
    font-style: italic;
    margin-bottom: 8px;
  }

  .comparison-diff {
    background: rgba(74, 144, 217, 0.08);
    border-radius: 12px;
    padding: 16px;
  }

  .comparison-diff h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
  }

  .comparison-diff ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .comparison-diff li {
    padding: 6px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 0.95rem;
  }

  .dark .comparison-diff {
    background: rgba(74, 144, 217, 0.12);
  }
</style>
