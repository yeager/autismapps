<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale, setLocale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { speak } from '$lib/tts';
  import { ALL_APPS, CATEGORY_META, type AppCategory } from '$lib/apps';
  import { fly, fade } from 'svelte/transition';

  let activeCategory = $state<AppCategory | null>(null);
  const categories = Object.entries(CATEGORY_META) as [AppCategory, typeof CATEGORY_META[AppCategory]][];

  const LANGUAGES = [
    { code: "sv", flag: "🇸🇪", name: "Svenska" },
    { code: "en", flag: "🇬🇧", name: "English" },
  ];

  let langOpen = $state(false);
  let langRef: HTMLDivElement | undefined = $state();

  function toggleLang() { langOpen = !langOpen; }
  function pickLang(code: string) {
    setLocale(code);
    if (browser) { localStorage.setItem("locale", code); localStorage.setItem("lang", code); }
    langOpen = false;
  }

  $effect(() => {
    if (langOpen && browser) {
      const handler = (e: MouseEvent) => {
        if (langRef && !langRef.contains(e.target as Node)) langOpen = false;
      };
      document.addEventListener("click", handler, true);
      return () => document.removeEventListener("click", handler, true);
    }
  });

  const currentFlag = $derived(LANGUAGES.find(l => l.code === $locale)?.flag ?? "🇸🇪");
  const filtered = $derived(
    activeCategory ? ALL_APPS.filter((app) => app.category === activeCategory) : []
  );

  function selectCategory(cat: AppCategory) {
    activeCategory = activeCategory === cat ? null : cat;
    if (activeCategory) speak($t(CATEGORY_META[cat].label));
  }

  function openApp(app: typeof ALL_APPS[0]) {
    if (app.ready) goto(`${base}${app.route}`);
    else speak($t('app.coming_soon'));
  }

  function getCategoryColor(cat: AppCategory): string {
    return CATEGORY_META[cat].color;
  }
</script>

<div class="launcher">
  <img class="hero-bg" src={`${base}/icons/hero.svg`} alt="" aria-hidden="true" />
  <header class="launcher-header">
    <div class="brand"><h1>🧩 {$t('app.title')}</h1></div>
    <div class="header-actions">
      <div class="lang-switcher" bind:this={langRef}>
        <button class="icon-btn" onclick={toggleLang} aria-label="Switch language">
          <span class="lang-flag">{currentFlag}</span>
        </button>
        {#if langOpen}
          <div class="lang-dropdown" transition:fly={{ y: -8, duration: 200 }}>
            {#each LANGUAGES as lang}
              <button class="lang-option" class:active={$locale === lang.code} onclick={() => pickLang(lang.code)}>
                <span>{lang.flag}</span><span>{lang.name}</span>
                {#if $locale === lang.code}<span class="check">✓</span>{/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <button class="icon-btn" onclick={() => goto(`${base}/settings`)} aria-label={$t('app.settings')}>⚙️</button>
      <button class="icon-btn" onclick={() => goto(`${base}/about`)} aria-label={$t('about.title')}>ℹ️</button>
    </div>
  </header>

  <div class="main-area">
    <nav class="categories" aria-label={$t('app.choose_category')}>
      {#each categories as [key, meta]}
        <button
          class="cat-btn"
          class:active={activeCategory === key}
          onclick={() => selectCategory(key)}
          aria-pressed={activeCategory === key}
          style="--cat-color: {meta.color}"
        >
          <span class="cat-emoji">{meta.emoji}</span>
          <span class="cat-label">{$t(meta.label)}</span>
          <span class="cat-count">{ALL_APPS.filter(a => a.category === key).length}</span>
        </button>
      {/each}
    </nav>

    <div class="app-area">
      {#if activeCategory}
        <div class="app-section" transition:fade={{ duration: 150 }}>
          <div class="section-header">
            <h2 style="color: {getCategoryColor(activeCategory)}">
              {CATEGORY_META[activeCategory].emoji} {$t(CATEGORY_META[activeCategory].label)}
            </h2>
            <button class="close-btn" onclick={() => activeCategory = null}>✕</button>
          </div>
          <div class="app-grid">
            {#each filtered as app (app.id)}
              <button
                class="app-card"
                class:coming-soon={!app.ready}
                onclick={() => openApp(app)}
                style="--card-accent: {getCategoryColor(app.category)}"
              >
                <div class="card-icon">
                  <img src={`${base}${app.icon}`} alt="" width="48" height="48" loading="lazy" onerror={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
                <span class="card-name" lang={$locale}>{$t(app.name)}</span>
                {#if !app.ready}<span class="card-badge">{$t('app.coming_soon')}</span>{/if}
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <div class="welcome-area">
          <p class="welcome-msg">{$t('app.choose_category')}</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .launcher {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
    background: var(--bg, #fff);
    color: var(--text, #2C3E50);
  }

  .launcher-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 16px;
    border-bottom: 2px solid var(--border, #eee);
    flex-shrink: 0;
    min-height: 48px;
    background: var(--bg-card, #fff);
  }

  .brand h1 { font-size: 1.15em; font-weight: 700; margin: 0; }

  .header-actions { display: flex; align-items: center; gap: 2px; }

  .icon-btn {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 10px; font-size: 1.3em;
    background: none; border: none; cursor: pointer;
    color: var(--text, #2C3E50);
  }
  .icon-btn:hover { background: var(--bg-hover, #f0f0f0); }
  .lang-flag { font-size: 1.4em; }
  .lang-switcher { position: relative; }
  .lang-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0;
    background: var(--bg-card, #fff); border: 2px solid var(--border, #ddd);
    border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    min-width: 150px; max-width: calc(100vw - 16px); z-index: 100; overflow: hidden;
  }
  .lang-option {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 12px 16px; font-size: 1.05em; border: none; background: none; cursor: pointer;
    color: var(--text, #2C3E50); min-height: 48px;
  }
  .lang-option:hover { background: var(--bg-hover, #f0f0f0); }
  .lang-option.active { font-weight: 700; }
  .check { color: var(--accent, #3498DB); margin-left: auto; }

  /* Main: sidebar + content */
  .main-area { flex: 1; display: flex; overflow: hidden; min-height: 0; }

  /* Categories — sidebar */
  .categories {
    display: flex; flex-direction: column; gap: 4px;
    padding: 8px; overflow-y: auto; flex-shrink: 0;
    width: 190px; border-right: 2px solid var(--border, #eee);
    background: var(--bg-card, #fafafa);
  }

  .cat-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 10px; border-radius: 12px;
    font-weight: 600; font-size: 0.88em;
    background: none; border: 2px solid transparent;
    cursor: pointer; min-height: 44px;
    color: var(--text, #2C3E50); text-align: left;
  }
  .cat-btn:hover { border-color: var(--cat-color); background: color-mix(in srgb, var(--cat-color) 8%, transparent); }
  .cat-btn.active { background: var(--cat-color); color: white; border-color: var(--cat-color); }

  .cat-emoji { font-size: 1.2em; flex-shrink: 0; }
  .cat-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cat-count {
    font-size: 0.7em; padding: 1px 6px; border-radius: 100px;
    background: rgba(0,0,0,0.08); flex-shrink: 0;
  }
  .cat-btn.active .cat-count { background: rgba(255,255,255,0.25); }

  /* App area */
  .app-area { flex: 1; overflow-y: auto; min-width: 0; }

  .app-section { padding: 10px 14px; height: 100%; display: flex; flex-direction: column; }

  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px; flex-shrink: 0;
  }
  .section-header h2 { font-size: 1.1em; font-weight: 700; margin: 0; }

  .close-btn {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; border: none; background: none;
    font-size: 1.1em; cursor: pointer; color: var(--text-muted, #999);
  }
  .close-btn:hover { background: var(--bg-hover, #f0f0f0); }

  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px; flex: 1; align-content: start;
  }

  .app-card {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: 10px 6px 8px; background: var(--bg-card, #fff);
    border: 2px solid var(--border, #eee); border-radius: 12px;
    cursor: pointer; gap: 4px; position: relative;
    color: var(--text, #2C3E50); transition: all 0.15s;
  }
  .app-card:hover { border-color: var(--card-accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .app-card:active { transform: scale(0.97); }
  .app-card.coming-soon { opacity: 0.4; }

  .card-icon {
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    border-radius: 10px; background: color-mix(in srgb, var(--card-accent) 10%, transparent);
  }
  .card-icon img { width: 34px; height: 34px; object-fit: contain; }

  .card-name {
    font-weight: 600; font-size: 0.8em; line-height: 1.2;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    hyphens: auto; overflow-wrap: break-word; min-height: 2.4em;
  }

  .card-badge {
    position: absolute; top: 3px; right: 3px;
    font-size: 0.55em; font-weight: 600; padding: 1px 5px;
    border-radius: 100px; background: var(--border, #ddd); color: var(--text-muted, #999);
  }

  .welcome-area { display: flex; align-items: center; justify-content: center; height: 100%; }
  .welcome-msg { font-size: 1.2em; color: var(--text-muted, #999); text-align: center; }

  /* ===== PORTRAIT / MOBILE ===== */
  @media (max-width: 700px), (orientation: portrait) and (max-width: 1024px) {
    .main-area { flex-direction: column; }

    .categories {
      flex-direction: row; width: auto;
      border-right: none; border-bottom: 2px solid var(--border, #eee);
      overflow-x: auto; overflow-y: hidden;
      padding: 6px 8px; gap: 4px;
    }

    .cat-btn {
      flex-direction: column; gap: 2px;
      padding: 6px 10px; min-width: 72px; min-height: 52px; flex-shrink: 0;
      font-size: 0.75em; text-align: center;
    }
    .cat-label { white-space: nowrap; font-size: 0.85em; text-align: center; overflow: visible; }
    .cat-count { display: none; }

    .app-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 6px; }
    .app-card { padding: 8px 4px 6px; }
    .card-icon { width: 38px; height: 38px; }
    .card-icon img { width: 28px; height: 28px; }
    .card-name { font-size: 0.75em; }
  }

  /* ===== LARGE LANDSCAPE ===== */
  @media (min-width: 1200px) {
    .categories { width: 230px; }
    .app-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  }

  /* High contrast */
  :global(.theme-high-contrast) .cat-btn.active { background: #fff; color: #000; border-color: #fff; }
  :global(.theme-high-contrast) .app-card:hover { border-color: #fff; }

  .hero-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; opacity: 0.08; pointer-events: none; user-select: none; }
  :global(.theme-high-contrast) .hero-bg { opacity: 0.03; }
  .launcher-header { position: relative; z-index: 1; }
  .main-area { position: relative; z-index: 1; }

  @media (prefers-reduced-motion: reduce) { .app-card { transition: none; } }
</style>
