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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }

  .welcome-dialog {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    max-width: 440px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .welcome-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0 0 1.2rem;
    font-size: 1.5rem;
    color: #2c3e50;
  }

  .welcome-section {
    text-align: left;
    margin-bottom: 1rem;
    padding: 0.8rem;
    background: #f8f9fa;
    border-radius: 0.75rem;
  }

  .section-label {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: #555;
  }

  .welcome-section p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #333;
  }

  .dont-show {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 1rem 0;
    font-size: 0.85rem;
    color: #777;
    cursor: pointer;
  }

  .dont-show input {
    cursor: pointer;
  }

  .welcome-start {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .welcome-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .welcome-start:active {
    transform: translateY(0);
  }

  @media (prefers-color-scheme: dark) {
    .welcome-dialog {
      background: #1e1e2e;
      color: #cdd6f4;
    }
    h2 { color: #cdd6f4; }
    .welcome-section {
      background: #313244;
    }
    .section-label { color: #a6adc8; }
    .welcome-section p { color: #bac2de; }
    .dont-show { color: #a6adc8; }
  }
</style>
