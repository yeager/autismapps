<script lang="ts">
  import { ttsStatus } from '$lib/tts';
  import { t } from '$lib/i18n';
  import { fly } from 'svelte/transition';

  const downloading = $derived($ttsStatus.downloading);
  const progress = $derived($ttsStatus.downloadProgress);
</script>

{#if downloading}
  <div class="tts-banner" transition:fly={{ y: -40, duration: 300 }}>
    <div class="banner-content">
      <span class="icon">🔊</span>
      <div class="info">
        <span class="label">{$t('tts.downloading') || 'Laddar ner röst...'}</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress}%"></div>
        </div>
      </div>
      <span class="pct">{progress}%</span>
    </div>
  </div>
{/if}

<style>
  .tts-banner {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    background: var(--bg-card, #fff);
    border: 2px solid var(--accent, #3498db);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    padding: 12px 20px;
    min-width: 280px;
    max-width: calc(100vw - 32px);
  }
  .banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .icon { font-size: 1.5em; flex-shrink: 0; }
  .info { flex: 1; min-width: 0; }
  .label {
    font-weight: 600;
    font-size: 0.95em;
    color: var(--text, #333);
    display: block;
    margin-bottom: 6px;
  }
  .progress-bar {
    height: 8px;
    background: var(--border, #e0e0e0);
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--accent, #3498db);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  .pct {
    font-weight: 700;
    font-size: 0.9em;
    color: var(--accent, #3498db);
    flex-shrink: 0;
    min-width: 40px;
    text-align: right;
  }
</style>
