<!--
  RewardsToggle — toggle rewards on/off for a specific app.
  Use in app settings or header.
-->
<script lang="ts">
  import { t } from '$lib/i18n';
  import { rewardsSettings, toggleAppRewards, isRewardsEnabled } from '$lib/rewards/store';

  let { appId }: { appId: string } = $props();

  let enabled = $derived(isRewardsEnabled(appId));

  function toggle() {
    toggleAppRewards(appId, !enabled);
  }
</script>

{#if $rewardsSettings.enabled}
  <label class="rewards-toggle">
    <input type="checkbox" checked={enabled} onchange={toggle} />
    <span class="toggle-label">⭐ {$t('rewards.toggle_label')}</span>
  </label>
{/if}

<style>
  .rewards-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 6px 0;
  }

  .rewards-toggle input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #ffd700;
  }

  .toggle-label {
    user-select: none;
  }
</style>
