<!--
  StarCounter — shows total gold stars for the current profile.
  Small, non-intrusive display for headers/nav.
-->
<script lang="ts">
  import { totalStars, rewardsSettings } from '$lib/rewards/store';
  import { activeProfileId } from '$lib/stores/profile';
  import { get } from 'svelte/store';
</script>

{#if $activeProfileId && get(rewardsSettings).enabled}
  <div class="star-counter" aria-label="{$totalStars} guldstjärnor">
    <span class="star-icon">⭐</span>
    <span class="star-count">{$totalStars}</span>
  </div>
{/if}

<style>
  .star-counter {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(255, 215, 0, 0.15);
    font-weight: 700;
    font-size: 0.9rem;
    color: #b8860b;
  }

  .star-icon {
    font-size: 1.1rem;
  }

  :global(.dark) .star-counter {
    background: rgba(255, 215, 0, 0.1);
    color: #ffd700;
  }
</style>
