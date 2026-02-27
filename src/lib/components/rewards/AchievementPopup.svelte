<!--
  AchievementPopup — shown when a new achievement is unlocked.
  Listens to lastUnlockedAchievement store.
-->
<script lang="ts">
  import { scale, fly } from 'svelte/transition';
  import { speak } from '$lib/tts';
  import { t } from '$lib/i18n';
  import { lastUnlockedAchievement, rewardsSettings } from '$lib/rewards/store';
  import { ACHIEVEMENT_DEFS } from '$lib/rewards/types';
  import { get } from 'svelte/store';

  let visible = $state(false);
  let icon = $state('');
  let label = $state('');

  $effect(() => {
    const ach = $lastUnlockedAchievement;
    if (ach) {
      const def = ACHIEVEMENT_DEFS.find(d => d.key === ach.achievementKey);
      if (def) {
        icon = def.icon;
        label = $t(def.labelKey);
        visible = true;
        const s = get(rewardsSettings);
        if (s.praiseEnabled) {
          speak($t('rewards.achievement_unlocked') + '! ' + label);
        }
        setTimeout(() => {
          visible = false;
          lastUnlockedAchievement.set(null);
        }, 4000);
      }
    }
  });
</script>

{#if visible}
  <div class="achievement-popup" transition:fly={{ y: -80, duration: 500 }}>
    <div class="achievement-card" in:scale={{ duration: 400, delay: 100 }}>
      <span class="achievement-icon">{icon}</span>
      <div class="achievement-text">
        <p class="achievement-title">{$t('rewards.achievement_unlocked')}!</p>
        <p class="achievement-name">{label}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .achievement-popup {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    pointer-events: none;
  }

  .achievement-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 28px;
    background: linear-gradient(135deg, #fff8dc, #fffacd);
    border: 3px solid #ffd700;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
  }

  .achievement-icon {
    font-size: 2.5rem;
  }

  .achievement-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: #b8860b;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .achievement-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin: 2px 0 0;
  }
</style>
