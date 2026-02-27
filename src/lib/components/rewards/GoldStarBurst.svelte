<!--
  GoldStarBurst — shows a brief gold star animation + optional TTS praise.
  Use: <GoldStarBurst show={true} onDone={() => show = false} />
-->
<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  import { speak } from '$lib/tts';
  import { t } from '$lib/i18n';
  import { getRandomPraiseKey, rewardsSettings } from '$lib/rewards/store';
  import { get } from 'svelte/store';

  let { show = false, onDone = () => {} }: { show: boolean; onDone?: () => void } = $props();

  $effect(() => {
    if (show) {
      const s = get(rewardsSettings);
      if (s.praiseEnabled) {
        const praiseKey = getRandomPraiseKey();
        speak($t(praiseKey));
      }
      setTimeout(() => {
        onDone();
      }, 2500);
    }
  });
</script>

{#if show}
  <div class="star-burst-overlay" transition:scale={{ duration: 400, start: 0.2 }}>
    <div class="star-burst">
      <span class="big-star" in:scale={{ duration: 600, delay: 100 }}>⭐</span>
      <div class="sparkles">
        {#each Array(6) as _, i}
          <span
            class="sparkle"
            style="--angle: {i * 60}deg; --delay: {i * 80}ms"
            in:fly={{ y: -20, duration: 500, delay: 200 + i * 80 }}
          >✨</span>
        {/each}
      </div>
      <p class="praise-text" in:fly={{ y: 10, duration: 400, delay: 400 }}>
        {$t(getRandomPraiseKey())}
      </p>
    </div>
  </div>
{/if}

<style>
  .star-burst-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  .star-burst {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .big-star {
    font-size: 5rem;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
    animation: pulse-star 1s ease-in-out infinite alternate;
  }

  @keyframes pulse-star {
    from { transform: scale(1); }
    to { transform: scale(1.15); }
  }

  .sparkles {
    position: absolute;
    top: 50%;
    left: 50%;
  }

  .sparkle {
    position: absolute;
    font-size: 1.5rem;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-60px);
    animation: fade-sparkle 1.5s ease-out var(--delay) forwards;
    opacity: 0;
  }

  @keyframes fade-sparkle {
    0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-30px) scale(0.5); }
    30% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-60px) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-90px) scale(0.5); }
  }

  .praise-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    text-align: center;
    margin: 0;
  }
</style>
