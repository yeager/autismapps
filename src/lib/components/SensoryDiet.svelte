<script lang="ts">
  import { t } from '$lib/i18n';
  import { ACTIVITIES, TIME_SLOTS, getRecommendedActivities } from '$lib/data/sensory-data.js';
  import ActivityCard from './ActivityCard.svelte';

  interface Props {
    ratings: Record<string, string>;
    diet: Record<string, any[]>; // timeSlotId -> activities
    ondietchange: (diet: Record<string, any[]>) => void;
  }

  let { ratings, diet, ondietchange }: Props = $props();

  let showRecommended = $state(true);
  let dragOverSlot = $state<string | null>(null);

  const recommended = $derived(getRecommendedActivities(ratings));

  const displayActivities = $derived(() => {
    if (showRecommended && recommended.length > 0) return recommended;
    return ACTIVITIES;
  });

  function handleDragOver(e: DragEvent, slotId: string) {
    e.preventDefault();
    dragOverSlot = slotId;
  }

  function handleDragLeave() {
    dragOverSlot = null;
  }

  function handleDrop(e: DragEvent, slotId: string) {
    e.preventDefault();
    dragOverSlot = null;
    try {
      const data = e.dataTransfer?.getData('text/plain');
      if (!data) return;
      const activity = JSON.parse(data);
      const current = diet[slotId] || [];
      // Don't add duplicates
      if (current.some((a: any) => a.id === activity.id)) return;
      const newDiet = { ...diet, [slotId]: [...current, activity] };
      ondietchange(newDiet);
    } catch { /* ignore parse errors */ }
  }

  function removeActivity(slotId: string, activityId: string) {
    const current = diet[slotId] || [];
    const newDiet = { ...diet, [slotId]: current.filter((a: any) => a.id !== activityId) };
    ondietchange(newDiet);
  }

  // Touch support for mobile drag
  let touchActivity: any = null;

  function handleTouchStart(e: TouchEvent, activity: any) {
    touchActivity = activity;
  }

  function handleSlotTap(slotId: string) {
    if (!touchActivity) return;
    const current = diet[slotId] || [];
    if (current.some((a: any) => a.id === touchActivity.id)) {
      touchActivity = null;
      return;
    }
    const newDiet = { ...diet, [slotId]: [...current, touchActivity] };
    ondietchange(newDiet);
    touchActivity = null;
  }
</script>

<div class="sensory-diet">
  <h3>{$t('sensory.diet.title')}</h3>
  <p class="instructions">{$t('sensory.diet.instructions')}</p>

  <div class="diet-layout">
    <!-- Activity palette -->
    <div class="activity-palette">
      <div class="palette-header">
        <h4>{$t('sensory.diet.available')}</h4>
        <div class="filter-tabs">
          <button
            class:active={showRecommended}
            onclick={() => showRecommended = true}
            disabled={recommended.length === 0}
          >
            ⭐ {$t('sensory.diet.recommended')}
          </button>
          <button
            class:active={!showRecommended}
            onclick={() => showRecommended = false}
          >
            📋 {$t('sensory.diet.all')}
          </button>
        </div>
      </div>
      <div class="activity-grid">
        {#each displayActivities() as activity (activity.id)}
          <div ontouchstart={(e) => handleTouchStart(e, activity)}>
            <ActivityCard {activity} draggable={true} />
          </div>
        {/each}
      </div>
    </div>

    <!-- Time slots -->
    <div class="time-slots">
      {#each TIME_SLOTS as slot (slot.id)}
        <div
          class="time-slot"
          class:drag-over={dragOverSlot === slot.id}
          style="--slot-color: {slot.color}"
          ondragover={(e) => handleDragOver(e, slot.id)}
          ondragleave={handleDragLeave}
          ondrop={(e) => handleDrop(e, slot.id)}
          onclick={() => handleSlotTap(slot.id)}
          role="region"
          aria-label={$t(slot.label)}
        >
          <div class="slot-header">
            <span class="slot-emoji">{slot.emoji}</span>
            <span class="slot-label">{$t(slot.label)}</span>
          </div>
          <div class="slot-activities">
            {#if diet[slot.id]?.length > 0}
              {#each diet[slot.id] as activity (activity.id)}
                <ActivityCard
                  {activity}
                  draggable={false}
                  removable={true}
                  compact={true}
                  onremove={() => removeActivity(slot.id, activity.id)}
                />
              {/each}
            {:else}
              <div class="drop-hint">{$t('sensory.diet.dropHere')}</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  {#if touchActivity}
    <div class="touch-hint">
      Tap a time slot to add: <strong>{$t(touchActivity.label)}</strong>
    </div>
  {/if}
</div>

<style>
  .sensory-diet {
    width: 100%;
  }

  h3 {
    margin: 0 0 4px;
    font-size: 1.3rem;
    color: var(--text-color, #2c3e50);
  }

  .instructions {
    color: #666;
    font-size: 0.85rem;
    margin: 0 0 16px;
  }

  .diet-layout {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .activity-palette {
    flex: 1;
    min-width: 250px;
  }

  .palette-header h4 {
    margin: 0 0 8px;
    font-size: 1rem;
  }

  .filter-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
  }

  .filter-tabs button {
    padding: 4px 10px;
    border-radius: 16px;
    border: 1px solid #ddd;
    background: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-tabs button.active {
    background: #3498DB;
    color: white;
    border-color: #3498DB;
  }

  .filter-tabs button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
    padding: 4px;
  }

  .time-slots {
    flex: 1;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .time-slot {
    border: 2px dashed #ddd;
    border-radius: 12px;
    padding: 12px;
    min-height: 70px;
    transition: all 0.2s;
    background: var(--card-bg, #f8f9fa);
  }

  .time-slot.drag-over {
    border-color: var(--slot-color);
    background: color-mix(in srgb, var(--slot-color) 10%, white);
  }

  .slot-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #eee;
  }

  .slot-emoji {
    font-size: 1.3rem;
  }

  .slot-label {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--slot-color);
  }

  .slot-activities {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .drop-hint {
    color: #aaa;
    font-size: 0.8rem;
    font-style: italic;
    padding: 8px;
  }

  .touch-hint {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #2c3e50;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    z-index: 100;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @media (max-width: 600px) {
    .diet-layout {
      flex-direction: column;
    }

    .activity-grid {
      max-height: 250px;
    }
  }
</style>
