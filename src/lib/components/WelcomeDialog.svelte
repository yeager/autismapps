<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';

  /** Unique app ID for localStorage key */
  export let appId = '';
  /** i18n key for the app name */
  export let titleKey = '';
  /** i18n key for what the app is for */
  export let purposeKey = '';
  /** i18n key for how the app works */
  export let howKey = '';
  /** i18n key for the goal */
  export let goalKey = '';
  /** Emoji icon for the app */
  export let icon = '📱';

  let show = false;
  let dontShowAgain = false;
  let showDetails = false;

  const STORAGE_KEY = `welcome-dismissed-${appId}`;

  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        show = true;
      }
    }
  });

  function dismiss() {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    show = false;
  }
</script>

{#if show}
  <div class="welcome-overlay" transition:fade={{ duration: 200 }}>
    <div class="welcome-dialog" role="dialog" aria-modal="true" aria-label={$t(titleKey)}>
      <div class="welcome-icon">{icon}</div>
      <h2>{$t(titleKey)}</h2>

      <div class="welcome-section">
        <div class="section-label">🎯 {$t('welcome.whatIsThis')}</div>
        <p>{$t(purposeKey)}</p>
      </div>

      <button
        class="welcome-more"
        type="button"
        aria-expanded={showDetails}
        aria-controls="welcome-details"
        on:click={() => (showDetails = !showDetails)}
      >
        {$t(showDetails ? 'welcome.lessDetails' : 'welcome.moreDetails')}
      </button>

      <div class="welcome-details" id="welcome-details" class:expanded={showDetails}>
        <div class="welcome-section">
          <div class="section-label">❓ {$t('welcome.howItWorks')}</div>
          <p>{$t(howKey)}</p>
        </div>

        <div class="welcome-section">
          <div class="section-label">💡 {$t('welcome.goal')}</div>
          <p>{$t(goalKey)}</p>
        </div>
      </div>

      <label class="dont-show">
        <input type="checkbox" bind:checked={dontShowAgain} />
        {$t('welcome.dontShowAgain')}
      </label>

      <button class="welcome-start" on:click={dismiss}>
        {$t('welcome.letsGo')} 🚀
      </button>
    </div>
  </div>
{/if}

<style>
  .welcome-overlay {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    background: rgba(28, 47, 37, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 90;
    padding: 1rem;
    backdrop-filter: blur(5px);
  }

  .welcome-dialog {
    box-sizing: border-box;
    background: var(--bg-card, #fff);
    color: var(--text, #26392f);
    border: 1px solid var(--border, #e1e7e1);
    border-radius: 1.25rem;
    padding: 1.75rem;
    max-width: 440px;
    width: min(100%, 440px);
    min-width: 0;
    max-height: calc(100dvh - 2rem);
    overflow-y: auto;
    text-align: center;
    box-shadow: 0 20px 60px rgba(16, 36, 25, 0.25);
  }

  .welcome-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0 0 1.2rem;
    font-size: 1.5rem;
    color: var(--text, #26392f);
  }

  .welcome-section {
    text-align: left;
    margin-bottom: 1rem;
    padding: 0.8rem;
    background: var(--bg-hover, #edf1ed);
    border-radius: 0.75rem;
  }

  .section-label {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: var(--text-secondary, #637168);
  }

  .welcome-section p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text, #26392f);
  }

  .welcome-more {
    display: none;
    border: 0;
    background: transparent;
    color: var(--accent, #315a49);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 650;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    cursor: pointer;
    padding: 0.4rem;
    margin: 0 auto 0.45rem;
  }

  .welcome-details {
    display: contents;
  }

  .dont-show {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 1rem 0;
    font-size: 0.85rem;
    color: var(--text-muted, #748178);
    cursor: pointer;
  }

  .dont-show input {
    cursor: pointer;
  }

  .welcome-start {
    background: var(--accent, #315a49);
    color: white;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 999px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: transform 0.15s, background 0.15s;
  }

  .welcome-start:hover {
    background: var(--accent-hover, #254737);
    transform: translateY(-1px);
  }

  .welcome-start:active {
    transform: translateY(0);
  }

  @media (max-width: 560px), (max-height: 640px) {
    .welcome-overlay {
      align-items: flex-start;
      overflow-y: auto;
      padding: max(0.5rem, env(safe-area-inset-top)) 0.5rem max(0.5rem, env(safe-area-inset-bottom));
    }

    .welcome-dialog {
      max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 1rem);
      padding: 0.85rem;
      border-radius: 1rem;
    }

    .welcome-icon { display: none; }
    h2 { margin-bottom: 0.5rem; font-size: 1.2rem; }
    .welcome-section { margin-bottom: 0.5rem; padding: 0.6rem; }
    .section-label { font-size: 0.8rem; }
    .welcome-section p { font-size: 0.86rem; line-height: 1.35; }
    .welcome-more { display: block; }
    .welcome-details { display: none; }
    .welcome-details.expanded { display: block; }
    .dont-show { margin: 0.5rem 0; font-size: 0.78rem; }
    .welcome-start { padding: 0.7rem 1.25rem; font-size: 1rem; }
  }
</style>
