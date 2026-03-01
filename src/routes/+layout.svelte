<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale, setLocale } from '$lib/i18n';
  import { theme, textSize, reducedMotion, themeClass, textSizeClass } from '$lib/a11y';
  import { speak, preloadVoice } from '$lib/tts';
  import { browser } from '$app/environment';
  import AchievementPopup from '$lib/components/rewards/AchievementPopup.svelte';
  import StarCounter from '$lib/components/rewards/StarCounter.svelte';

  let { children } = $props();

  const isHome = $derived($page.url.pathname === base + '/' || $page.url.pathname === base);
  const isApp = $derived($page.url.pathname.startsWith(base + '/apps/'));

  function goBack() {
    if (isApp) {
      goto(`${base}/`);
    } else {
      history.back();
    }
  }

  function goSettings() {
    goto(`${base}/settings`);
  }

  // Initialize locale + preload Piper TTS voice
  if (browser) {
    const saved = localStorage.getItem('locale') || localStorage.getItem('lang');
    if (saved) {
      setLocale(saved);
      localStorage.setItem('locale', saved);
      localStorage.setItem('lang', saved);
    }
    // Preload Piper WASM voice on first load
    preloadVoice();
  }
</script>

<div
  class="app-shell {$themeClass} {$textSizeClass}"
  class:reduced-motion={$reducedMotion}
>
  {#if !isHome}
    <header class="app-header">
      <button
        class="back-btn"
        onclick={goBack}
        aria-label={$t('app.back')}
        onfocus={() => speak($t('app.back'))}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span>{$t('app.back')}</span>
      </button>

      <div class="header-spacer"></div>

      <StarCounter />

      <button
        class="rewards-btn"
        onclick={() => goto(`${base}/rewards`)}
        aria-label={$t('rewards.nav')}
      >
        ⭐
      </button>

      <button
        class="settings-btn"
        onclick={goSettings}
        aria-label={$t('app.settings')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>
    </header>
  {/if}

  <main class="app-main" class:has-header={!isHome}>
    {@render children()}
  </main>

  <AchievementPopup />
</div>

<style>
  .app-shell {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 12px 20px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
    gap: 12px;
  }

  .header-spacer {
    flex: 1;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px 8px 10px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 1em;
    transition: background var(--transition);
    min-height: 44px;
    min-width: 44px;
  }
  .back-btn:hover { background: var(--bg-hover); }

  .settings-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
  }
  .settings-btn:hover { background: var(--bg-hover); }

  .rewards-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
    font-size: 1.2rem;
    border: none;
    background: none;
    cursor: pointer;
  }
  .rewards-btn:hover { background: var(--bg-hover); }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .app-main.has-header {
    /* padding handled by individual pages */
  }
</style>
