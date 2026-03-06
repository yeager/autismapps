<script lang="ts">
  import { t } from '$lib/i18n';

  interface Props {
    activity: { id: string; label: string; arasaacId: number; senses: string[]; type: string };
    draggable?: boolean;
    removable?: boolean;
    compact?: boolean;
    onremove?: () => void;
  }

  let { activity, draggable = true, removable = false, compact = false, onremove }: Props = $props();

  function getPictogramUrl(id: number): string {
    return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
  }

  function handleDragStart(e: DragEvent) {
    if (!draggable) return;
    e.dataTransfer?.setData('text/plain', JSON.stringify(activity));
  }
</script>

<div
  class="activity-card"
  class:compact
  class:draggable
  draggable={draggable ? 'true' : 'false'}
  ondragstart={handleDragStart}
  role={draggable ? 'listitem' : undefined}
>
  <img
    src={getPictogramUrl(activity.arasaacId)}
    alt={$t(activity.label)}
    class="pictogram"
    loading="lazy"
  />
  <span class="label">{$t(activity.label)}</span>
  {#if removable && onremove}
    <button class="remove-btn" onclick={onremove} aria-label={$t('sensory.diet.remove')}>✕</button>
  {/if}
</div>

<style>
  .activity-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border-radius: 12px;
    background: var(--card-bg, #f8f9fa);
    border: 2px solid transparent;
    transition: all 0.2s;
    position: relative;
    min-width: 80px;
  }

  .activity-card.draggable {
    cursor: grab;
  }

  .activity-card.draggable:hover {
    border-color: #3498DB;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .activity-card.draggable:active {
    cursor: grabbing;
  }

  .activity-card.compact {
    flex-direction: row;
    min-width: unset;
    padding: 4px 8px;
    gap: 8px;
  }

  .pictogram {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: contain;
    background: white;
  }

  .compact .pictogram {
    width: 36px;
    height: 36px;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
    color: var(--text-color, #2c3e50);
  }

  .compact .label {
    font-size: 0.8rem;
  }

  .remove-btn {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: #E74C3C;
    color: white;
    font-size: 0.65rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
  }

  .compact .remove-btn {
    position: static;
    margin-left: auto;
  }
</style>
