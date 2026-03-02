<!--
  Diploma page — a beautiful, printable certificate showing the child's
  total stars, profile name, encouraging words, and app branding.
  Accessible from the header when stars > 0.
-->
<script lang="ts">
  import { t } from '$lib/i18n';
  import { totalStars } from '$lib/rewards/store';
  import { activeProfileId } from '$lib/stores/profile';
  import { getProfile } from '$lib/storage';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let profileName = $state('');
  let today = $state('');

  $effect(() => {
    if (browser && !$activeProfileId) {
      goto(`${base}/profiles`);
    }
  });

  $effect(() => {
    if ($activeProfileId) {
      getProfile($activeProfileId).then(p => {
        profileName = p?.name || '';
      });
    }
  });

  $effect(() => {
    today = new Date().toLocaleDateString('sv-SE', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  const displayName = $derived(profileName || $t('diploma.default_name'));

  function printDiploma() {
    window.print();
  }
</script>

<svelte:head>
  <title>{$t('diploma.page_title')}</title>
</svelte:head>

<div class="diploma-page">
  <div class="actions no-print">
    <button class="action-btn print-btn" onclick={printDiploma}>
      🖨️ {$t('diploma.print')}
    </button>
    <button class="action-btn export-btn" onclick={printDiploma}>
      📥 {$t('diploma.export')}
    </button>
  </div>

  <div class="diploma-certificate" id="diploma-certificate">
    <div class="diploma-outer-border">
      <div class="diploma-inner-border">
        <div class="diploma-content">
          <div class="decoration-top">
            ✦ ⭐ ✦ ⭐ ✦ ⭐ ✦
          </div>

          <h1 class="diploma-title">{$t('diploma.title')}</h1>

          <p class="diploma-subtitle">{$t('diploma.awarded_to')}</p>

          <p class="diploma-name">{displayName}</p>

          <div class="diploma-star-section">
            <div class="gold-star">⭐</div>
            <p class="star-count">{$totalStars} {$t('diploma.gold_stars')}</p>
          </div>

          <div class="diploma-encouragement">
            <p class="encourage-main">{$t('diploma.encourage_main')}</p>
            <p class="encourage-sub">{$t('diploma.encourage_sub')}</p>
          </div>

          <p class="diploma-date">{today}</p>

          <div class="decoration-bottom">
            ✦ ⭐ ✦ ⭐ ✦ ⭐ ✦
          </div>

          <div class="diploma-footer">
            <span>Autismappar v0.0.1</span>
            <span>·</span>
            <span>autismappar.se</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .diploma-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;
  }

  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .action-btn {
    padding: 12px 28px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    border: 2px solid #daa520;
    transition: all 0.2s;
    min-height: 48px;
    min-width: 48px;
  }

  .print-btn {
    background: #fff8dc;
    color: #333;
  }
  .print-btn:hover { background: #ffd700; }

  .export-btn {
    background: var(--bg-card, #fff);
    color: #333;
  }
  .export-btn:hover { background: #fff8dc; }

  .diploma-certificate {
    width: 100%;
    max-width: 700px;
    background: linear-gradient(145deg, #fffef5, #fff8dc, #fffef5);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(218, 165, 32, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .diploma-outer-border {
    margin: 16px;
    padding: 6px;
    border: 3px solid #daa520;
    border-radius: 14px;
  }

  .diploma-inner-border {
    padding: 32px 24px;
    border: 2px solid #b8860b;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(255, 248, 220, 0.5), rgba(255, 255, 245, 0.8));
  }

  .diploma-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .decoration-top, .decoration-bottom {
    font-size: 1.3rem;
    letter-spacing: 6px;
    color: #daa520;
    opacity: 0.8;
  }

  .diploma-title {
    font-size: 2.8rem;
    font-weight: 900;
    color: #b8860b;
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    text-transform: uppercase;
    letter-spacing: 4px;
    text-shadow: 0 2px 4px rgba(184, 134, 11, 0.15);
  }

  .diploma-subtitle {
    font-size: 1.1rem;
    color: #888;
    margin: 0;
    font-style: italic;
  }

  .diploma-name {
    font-size: 2.4rem;
    font-weight: 800;
    color: #333;
    margin: 4px 0;
    font-family: Georgia, 'Times New Roman', serif;
    border-bottom: 3px solid #daa520;
    padding-bottom: 6px;
    min-width: 200px;
  }

  .diploma-star-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin: 8px 0;
  }

  .gold-star {
    font-size: 4rem;
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
    animation: gentle-pulse 3s ease-in-out infinite;
  }

  @keyframes gentle-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .star-count {
    font-size: 1.4rem;
    font-weight: 800;
    color: #b8860b;
    margin: 0;
  }

  .diploma-encouragement { margin: 8px 0; }

  .encourage-main {
    font-size: 1.6rem;
    font-weight: 800;
    color: #2e7d32;
    margin: 0;
  }

  .encourage-sub {
    font-size: 1.2rem;
    color: #555;
    margin: 4px 0 0;
    font-style: italic;
  }

  .diploma-date {
    font-size: 0.95rem;
    color: #999;
    margin: 4px 0 0;
  }

  .diploma-footer {
    display: flex;
    gap: 8px;
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(218, 165, 32, 0.3);
  }

  @media print {
    .no-print { display: none !important; }
    .diploma-page { padding: 0; margin: 0; }
    .diploma-certificate {
      max-width: none;
      width: 100%;
      box-shadow: none;
      border-radius: 0;
      page-break-inside: avoid;
    }
    .diploma-outer-border { margin: 20px; }
    .gold-star { animation: none; }
    :global(header), :global(.app-header), :global(nav), :global(footer) {
      display: none !important;
    }
    :global(body) { margin: 0; padding: 0; }
    :global(.app-shell) { min-height: auto; }
  }

  :global(.reduced-motion) .gold-star { animation: none; }

  :global(.dark) .diploma-certificate {
    background: linear-gradient(145deg, #2a2510, #332c15, #2a2510);
  }
  :global(.dark) .diploma-inner-border {
    background: linear-gradient(180deg, rgba(42, 37, 16, 0.5), rgba(51, 44, 21, 0.8));
  }
  :global(.dark) .diploma-title { color: #ffd700; }
  :global(.dark) .diploma-name { color: #f0e6d0; border-bottom-color: #daa520; }
  :global(.dark) .encourage-main { color: #66bb6a; }
  :global(.dark) .encourage-sub { color: #bbb; }
  :global(.dark) .diploma-footer { color: #777; border-top-color: rgba(218, 165, 32, 0.2); }
</style>
