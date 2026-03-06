<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { ACTIVITIES, getArasaacUrl } from '$lib/data/transition-helper';
  import type { Activity } from '$lib/data/transition-helper';
  import { fade } from 'svelte/transition';

  interface Props {
    onSelect: (activity: Activity) => void;
    onClose: () => void;
  }

  let { onSelect, onClose }: Props = $props();
</script>

<div class="grid-overlay" transition:fade={{ duration: 150 }}>
  <div class="grid-dialog" role="dialog" aria-modal="true" aria-label={$t('th.selectActivity')}>
    <div class="grid-header">
      <h2>{$t('th.selectActivity')}</h2>
      <button class="close-btn" onclick={onClose} aria-label="Close">✕</button>
    </div>
    <div class="activity-grid">
      {#each ACTIVITIES as activity}
        <button
          class="activity-card"
          onclick={() => { onSelect(activity); speak($t(activity.nameKey)); }}
          aria-label={$t(activity.nameKey)}
        >
          <img
            src={getArasaacUrl(activity.arasaacId)}
            alt={$t(activity.nameKey)}
            loading="lazy"
            width="80"
            height="80"
          />
          <span class="activity-label">{$t(activity.nameKey)}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .grid-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .grid-dialog {
    background: var(--bg-card, #fff);
    border-radius: 20px;
    max-width: 600px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .grid-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 12px;
    position: sticky;
    top: 0;
    background: var(--bg-card, #fff);
    border-radius: 20px 20px 0 0;
    z-index: 1;
  }

  .grid-header h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--bg-hover, #f0f0f0);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    padding: 12px 24px 24px;
  }

  .activity-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: 16px;
    border: 2px solid transparent;
    background: var(--bg, #f8f9fa);
    cursor: pointer;
    transition: all 0.15s ease;
    min-height: 44px;
  }

  .activity-card:hover,
  .activity-card:focus-visible {
    border-color: var(--primary, #3498DB);
    background: var(--bg-hover, #e8f4fd);
    transform: scale(1.05);
  }

  .activity-card img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
  }

  .activity-label {
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    .activity-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 8px 16px 16px;
    }
    .activity-card img {
      width: 60px;
      height: 60px;
    }
  }
</style>
