<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { ACTIVITIES, getArasaacUrl, ARASAAC_IDS } from '$lib/data/transition-helper';
  import type { SavedTransition } from '$lib/data/transition-helper';
  import { onMount } from 'svelte';

  interface Props {
    onUse: (firstId: string, thenId: string) => void;
  }

  let { onUse }: Props = $props();

  let saved = $state<SavedTransition[]>([]);

  onMount(() => {
    loadSaved();
  });

  function loadSaved() {
    saved = JSON.parse(localStorage.getItem('th-saved-transitions') || '[]');
  }

  function deleteSaved(id: string) {
    saved = saved.filter(s => s.id !== id);
    localStorage.setItem('th-saved-transitions', JSON.stringify(saved));
  }

  function getActivity(activityId: string) {
    return ACTIVITIES.find(a => a.id === activityId);
  }
</script>

<div class="saved-transitions">
  <h2>{$t('th.saved.title')}</h2>

  {#if saved.length === 0}
    <div class="empty-state">
      <span class="empty-icon">📋</span>
      <p>{$t('th.saved.empty')}</p>
    </div>
  {:else}
    <div class="saved-list">
      {#each saved as item}
        {@const first = getActivity(item.firstId)}
        {@const then = getActivity(item.thenId)}
        {#if first && then}
          <div class="saved-card">
            <div class="saved-content">
              <div class="saved-activity">
                <img src={getArasaacUrl(first.arasaacId)} alt={$t(first.nameKey)} width="50" height="50" />
                <span>{$t(first.nameKey)}</span>
              </div>
              <span class="arrow">→</span>
              <div class="saved-activity">
                <img src={getArasaacUrl(then.arasaacId)} alt={$t(then.nameKey)} width="50" height="50" />
                <span>{$t(then.nameKey)}</span>
              </div>
            </div>
            <div class="saved-actions">
              <button
                class="use-btn"
                onclick={() => { onUse(item.firstId, item.thenId); speak(`${$t('th.first')} ${$t(first.nameKey)}, ${$t('th.then')} ${$t(then.nameKey)}`); }}
              >
                ▶ {$t('th.saved.use')}
              </button>
              <button class="delete-btn" onclick={() => deleteSaved(item.id)}>
                🗑️
              </button>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .saved-transitions {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 16px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted, #999);
  }

  .empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
  }

  .saved-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 500px;
  }

  .saved-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-radius: 16px;
    border: 2px solid var(--border, #e0e0e0);
    background: var(--bg-card, #fff);
  }

  .saved-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .saved-activity {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .saved-activity img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 8px;
  }

  .saved-activity span {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .arrow {
    font-size: 1.5rem;
    color: var(--text-muted, #999);
    font-weight: 700;
  }

  .saved-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .use-btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 12px;
    border: none;
    background: var(--primary, #3498DB);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    min-height: 44px;
    transition: transform 0.15s ease;
  }
  .use-btn:hover { transform: scale(1.03); }

  .delete-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: none;
    background: var(--bg-hover, #f0f0f0);
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
  }
  .delete-btn:hover { background: #fee; }
</style>
