<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { EMOTIONS, getArasaacUrl } from '$lib/data/transition-helper';
  import type { EmotionOption } from '$lib/data/transition-helper';
  import { fade, scale } from 'svelte/transition';

  let selected = $state<EmotionOption | null>(null);

  function selectEmotion(emotion: EmotionOption) {
    selected = emotion;
    speak($t(emotion.nameKey));
    setTimeout(() => speak($t('th.checkin.thanks')), 1500);
  }

  function reset() {
    selected = null;
  }
</script>

<div class="emotion-checkin">
  {#if !selected}
    <h2>{$t('th.checkin.title')}</h2>
    <p class="instruction">{$t('th.checkin.instruction')}</p>

    <div class="emotion-grid">
      {#each EMOTIONS as emotion}
        <button
          class="emotion-card"
          style="--emotion-color: {emotion.color}"
          onclick={() => selectEmotion(emotion)}
          aria-label={$t(emotion.nameKey)}
        >
          <img
            src={getArasaacUrl(emotion.arasaacId)}
            alt={$t(emotion.nameKey)}
            width="80"
            height="80"
          />
          <span class="emotion-emoji">{emotion.emoji}</span>
          <span class="emotion-label">{$t(emotion.nameKey)}</span>
        </button>
      {/each}
    </div>
  {:else}
    <div class="checkin-result" transition:scale={{ duration: 300, start: 0.8 }}>
      <div class="result-card" style="--emotion-color: {selected.color}">
        <img
          src={getArasaacUrl(selected.arasaacId)}
          alt={$t(selected.nameKey)}
          width="120"
          height="120"
        />
        <span class="result-emoji">{selected.emoji}</span>
        <span class="result-label">{$t(selected.nameKey)}</span>
      </div>
      <p class="thanks">{$t('th.checkin.thanks')}</p>
      <button class="action-btn" onclick={reset}>
        🔄 {$t('th.checkin.tryAgain')}
      </button>
    </div>
  {/if}
</div>

<style>
  .emotion-checkin {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 8px;
  }

  .instruction {
    color: var(--text-muted, #666);
    margin: 0 0 24px;
    text-align: center;
    font-size: 1.05rem;
  }

  .emotion-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    width: 100%;
    max-width: 420px;
  }

  .emotion-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 12px;
    border-radius: 20px;
    border: 3px solid var(--emotion-color);
    background: var(--bg-card, #fff);
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 44px;
  }

  .emotion-card:hover,
  .emotion-card:focus-visible {
    transform: scale(1.08);
    box-shadow: 0 6px 20px color-mix(in srgb, var(--emotion-color) 30%, transparent);
  }

  .emotion-card img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
  }

  .emotion-emoji {
    font-size: 1.5rem;
  }

  .emotion-label {
    font-weight: 700;
    font-size: 0.95rem;
  }

  .checkin-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px 20px;
  }

  .result-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 28px;
    border-radius: 24px;
    border: 4px solid var(--emotion-color);
    background: var(--bg-card, #fff);
    box-shadow: 0 8px 30px color-mix(in srgb, var(--emotion-color) 20%, transparent);
  }

  .result-card img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }

  .result-emoji {
    font-size: 2.5rem;
  }

  .result-label {
    font-size: 1.5rem;
    font-weight: 800;
  }

  .thanks {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text, #333);
  }

  .action-btn {
    padding: 14px 24px;
    border-radius: 16px;
    border: none;
    background: var(--bg-hover, #f0f0f0);
    color: var(--text, #333);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    transition: transform 0.15s ease;
  }

  .action-btn:hover { transform: scale(1.05); }

  @media (max-width: 480px) {
    .emotion-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .emotion-card img {
      width: 60px;
      height: 60px;
    }
  }
</style>
