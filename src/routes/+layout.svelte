<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale, setLocale, detectLocale, isReadyLocale, getLocaleDef } from '$lib/i18n';
  import { theme, textSize, reducedMotion, themeClass, textSizeClass } from '$lib/a11y';
  import { speak, preloadVoice } from '$lib/tts';
  import { browser } from '$app/environment';
  import { requestServiceWorkerUpdate } from '$lib/pwa/update-check.js';
  import AchievementPopup from '$lib/components/rewards/AchievementPopup.svelte';
  import StarCounter from '$lib/components/rewards/StarCounter.svelte';
  import { ALL_APPS, isBlockedIn } from '$lib/apps';
  import ComingSoonNotice from '$lib/components/ComingSoonNotice.svelte';

  let { children } = $props();

  // The production build is served below /launcher; pathname therefore
  // includes the configured base while the route id remains the root route.
  const isHome = $derived($page.route.id === '/');
  const currentApp = $derived(ALL_APPS.find((a) => a.route === $page.route.id));
  // Remember whether the page itself supplied a title before the layout sets
  // its localized fallback. Otherwise the fallback would be mistaken for a
  // page title on the next locale change and remain in the previous language.
  let hasPageSpecificTitle = false;

  // Each production domain is one language (autismappar.se = sv, autismapps.online = en)
  // and wins over a saved choice — except for ready locales without a domain of their
  // own (pt_BR), which can only be reached by choosing them on one of those domains.
  const DOMAIN_LOCALES = ['sv', 'en'];
  function domainLocale(): string | null {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname === 'autismappar.se' || hostname.endsWith('.autismappar.se')) return 'sv';
    if (hostname === 'autismapps.online' || hostname.endsWith('.autismapps.online')) return 'en';
    return null;
  }
  // Locale decided at startup ('' on the server). Until its dictionary loads the store still says 'en',
  // so a direct URL to an app blocked in that locale must already be treated as blocked.
  const saved = browser ? localStorage.getItem('locale') : null;
  const savedReady = saved && isReadyLocale(saved) ? saved : null;
  const initial = browser
    ? (savedReady && !DOMAIN_LOCALES.includes(savedReady) ? savedReady : null) ||
      domainLocale() ||
      savedReady ||
      detectLocale(navigator.language)
    : '';
  let localeReady = $state(false);
  const blockedApp = $derived(
    currentApp &&
      (isBlockedIn(currentApp, $locale) || (!localeReady && initial && isBlockedIn(currentApp, initial)))
      ? currentApp
      : null
  );

  function goSettings() {
    goto(base + '/settings');
  }

  // Loopia and browsers can keep cached files for a long time. Check for an
  // updated service worker when the app opens and when it returns to the foreground.
  // The worker activates the new cache; the user can reopen the app to load it.
  onMount(() => {
    if (!('serviceWorker' in navigator)) return;

    let checking = false;

    async function checkForUpdate() {
      if (!navigator.onLine || checking) return;
      checking = true;
      try {
        await requestServiceWorkerUpdate(navigator.serviceWorker, navigator.onLine);
      } catch {
        // Offline or a temporary hosting error: the next foreground check retries.
      } finally {
        checking = false;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') void checkForUpdate();
    }

    void checkForUpdate();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleVisibilityChange);
    };
  });

  // Initialize locale (see `initial`) + preload that locale's Piper voice
  if (browser) {
    hasPageSpecificTitle = Boolean(document.querySelector('head > title')?.textContent?.trim());
    setLocale(initial).then((code) => {
      localeReady = true;
      preloadVoice(code);
    });
  }

  function setMeta(selector: string, content: string) {
    document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
  }

  $effect(() => {
    if (!browser) return;

    const def = getLocaleDef($locale);
    // Only sv and en have their own manifest (one per production domain)
    const language = $locale === 'sv' ? 'sv' : 'en';
    const brand = $t('app.title.brand');
    const description = $t('home.intro');
    const canonicalUrl = window.location.origin + window.location.pathname;

    document.documentElement.lang = def.bcp47;
    if ($page.route.id === '/' || !hasPageSpecificTitle) {
      document.title = `${brand} — ${$t('app.subtitle')}`;
    }
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', `${brand} — ${$t('home.headline')}`);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', def.bcp47.replace('-', '_'));
    setMeta('meta[property="og:site_name"]', brand);
    setMeta('meta[name="twitter:title"]', `${brand} — ${$t('home.headline')}`);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="apple-mobile-web-app-title"]', brand);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    setMeta('meta[property="og:url"]', canonicalUrl);

    const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (manifest) manifest.href = `${base}/manifest-${language}.json`;
  });
</script>

<div
  class="app-shell {$themeClass} {$textSizeClass}"
  class:reduced-motion={$reducedMotion}
>
  {#if !isHome}
    <header class="app-header">
      <a
        class="back-btn"
        href={base + '/'}
        aria-label={$t('app.back')}
        onfocus={() => speak($t('app.back'))}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span>{$t('app.back')}</span>
      </a>

      <a class="header-brand" href={base + '/'} aria-label={$t('app.title.brand')}>
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span>{$t('app.title.brand')}</span>
      </a>

      <div class="header-spacer"></div>

      <StarCounter />

      <button
        class="rewards-btn"
        onclick={() => goto(base + '/rewards')}
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
    {#if blockedApp}
      <ComingSoonNotice app={blockedApp} />
    {:else}
      {@render children()}
    {/if}
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
    min-height: 68px;
    padding: 10px max(24px, calc((100% - 1320px) / 2));
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(16px);
    gap: 14px;
  }

  .header-brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: var(--text);
    text-decoration: none;
    font-size: .9rem;
    font-weight: 750;
    letter-spacing: -.03em;
  }
  .brand-mark { display: inline-flex; align-items: end; gap: 3px; width: 30px; height: 30px; padding: 6px; border-radius: 9px; background: #315a49; transform: rotate(-5deg); }
  .brand-mark span { display: block; width: 5px; border-radius: 5px; background: #f8f4e9; transform: rotate(5deg); }
  .brand-mark span:nth-child(1) { height: 10px; opacity: .7; }
  .brand-mark span:nth-child(2) { height: 17px; }
  .brand-mark span:nth-child(3) { height: 13px; opacity: .85; }

  .header-spacer {
    flex: 1;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: inherit;
    text-decoration: none;
    padding: 8px 13px 8px 10px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--bg-card);
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
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-card);
    transition: background var(--transition);
  }
  .settings-btn:hover { background: var(--bg-hover); }

  .rewards-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-card);
    transition: background var(--transition);
    font-size: 1.2rem;
    border: none;
    background: none;
    cursor: pointer;
  }
  .rewards-btn:hover { background: var(--bg-hover); }

  @media (max-width: 560px) {
    .app-header { min-height: 60px; padding: 8px 14px; gap: 7px; }
    .header-brand { gap: 6px; font-size: .76rem; }
    .brand-mark { width: 26px; height: 26px; padding: 5px; }
    .back-btn { width: 40px; min-width: 40px; padding: 0; justify-content: center; }
    .back-btn span { display: none; }
    .settings-btn, .rewards-btn { width: 40px; height: 40px; }
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
