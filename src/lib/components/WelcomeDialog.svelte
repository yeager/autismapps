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

      <div class="welcome-section">
        <div class="section-label">❓ {$t('welcome.howItWorks')}</div>
        <p>{$t(howKey)}</p>
      </div>

      <div class="welcome-section">
        <div class="section-label">💡 {$t('welcome.goal')}</div>
        <p>{$t(goalKey)}</p>
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
    background: var(--bg-card, #fff);
    color: var(--text, #26392f);
    border: 1px solid var(--border, #e1e7e1);
    border-radius: 1.25rem;
    padding: 1.75rem;
    max-width: 440px;
    width: 100%;
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

  @media (max-width: 560px) {
    .welcome-dialog { padding: 1.25rem; }
    .welcome-icon { font-size: 2.5rem; }
    h2 { margin-bottom: .9rem; font-size: 1.3rem; }
    .welcome-section { margin-bottom: .7rem; padding: .7rem; }
    .welcome-section p { font-size: .87rem; }
  }
</style>
