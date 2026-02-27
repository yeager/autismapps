<!--
  DiplomaCard — a printable diploma with child's name, gold star, date, and achievement.
  Can be printed via window.print() or saved as image.
-->
<script lang="ts">
  import { t } from '$lib/i18n';
  import { ACHIEVEMENT_DEFS } from '$lib/rewards/types';
  import type { Diploma } from '$lib/rewards/types';

  let { diploma }: { diploma: Diploma } = $props();

  const def = $derived(ACHIEVEMENT_DEFS.find(d => d.key === diploma.achievementKey));
  const dateStr = $derived(new Date(diploma.earnedAt).toLocaleDateString('sv-SE', {
    year: 'numeric', month: 'long', day: 'numeric'
  }));

  function printDiploma() {
    window.print();
  }
</script>

<div class="diploma-wrapper">
  <div class="diploma" id="diploma-{diploma.id}">
    <div class="diploma-border">
      <div class="diploma-inner">
        <div class="diploma-stars-top">⭐ ⭐ ⭐</div>

        <h1 class="diploma-title">{$t('rewards.diploma.title')}</h1>

        <p class="diploma-awarded">{$t('rewards.diploma.awarded_to')}</p>
        <p class="diploma-name">{diploma.childName}</p>

        <div class="diploma-star-big">🌟</div>

        <p class="diploma-achievement">
          {def ? $t(def.labelKey) : diploma.achievementKey}
        </p>
        {#if def}
          <p class="diploma-desc">{$t(def.descKey)}</p>
        {/if}

        <p class="diploma-date">{dateStr}</p>

        <div class="diploma-stars-bottom">⭐ ⭐ ⭐</div>
      </div>
    </div>
  </div>

  <button class="print-btn no-print" onclick={printDiploma}>
    🖨️ {$t('rewards.diploma.print')}
  </button>
</div>

<style>
  .diploma-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .diploma {
    width: 100%;
    max-width: 600px;
    aspect-ratio: 4 / 3;
    background: linear-gradient(135deg, #fffef5, #fff8dc);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  }

  .diploma-border {
    margin: 12px;
    padding: 24px;
    border: 4px double #daa520;
    border-radius: 12px;
    height: calc(100% - 24px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .diploma-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
  }

  .diploma-stars-top, .diploma-stars-bottom {
    font-size: 1.2rem;
    letter-spacing: 8px;
  }

  .diploma-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #b8860b;
    margin: 4px 0;
    font-family: Georgia, serif;
  }

  .diploma-awarded {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }

  .diploma-name {
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;
    margin: 4px 0;
    font-family: Georgia, serif;
  }

  .diploma-star-big {
    font-size: 3rem;
    margin: 8px 0;
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
  }

  .diploma-achievement {
    font-size: 1.1rem;
    font-weight: 600;
    color: #444;
    margin: 0;
  }

  .diploma-desc {
    font-size: 0.85rem;
    color: #777;
    margin: 2px 0 0;
    font-style: italic;
  }

  .diploma-date {
    font-size: 0.85rem;
    color: #888;
    margin: 8px 0 0;
  }

  .print-btn {
    padding: 10px 24px;
    border-radius: 12px;
    background: var(--bg-card, #fff);
    border: 2px solid #daa520;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }
  .print-btn:hover {
    background: #fff8dc;
  }

  @media print {
    .no-print { display: none !important; }
    .diploma {
      box-shadow: none;
      max-width: none;
      width: 100%;
      break-inside: avoid;
    }
  }
</style>
