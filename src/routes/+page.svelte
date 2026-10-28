<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale, setLocale, READY_LOCALES, getLocaleDef } from '$lib/i18n';
  import { getLocaleDomainRedirect } from '$lib/i18n/domain-routing.js';
  import { browser } from '$app/environment';
  import { speak } from '$lib/tts';
  import { ALL_APPS, CATEGORY_META, isAvailableIn, type AppCategory } from '$lib/apps';
  import { flagSvg } from '$lib/flags';

  let activeCategory = $state<AppCategory | null>(null);
  let searchQuery = $state('');
  let showAllApps = $state(false);
  let langOpen = $state(false);
  let aboutOpen = $state(false);
  let userName = $state('');
  let userAvatar = $state('👋');
  let langRef: HTMLDivElement | undefined = $state();

  const categories = Object.entries(CATEGORY_META) as [AppCategory, typeof CATEGORY_META[AppCategory]][];
  const languages = READY_LOCALES;
  const featuredIds = new Set(['talk-board', 'picture-schedule', 'visual-timer', 'calm-room', 'emotion-map', 'word-builder', 'day-planner', 'chooser']);
  const currentFlag = $derived(getLocaleDef($locale).flag);
  // toLocaleLowerCase needs a BCP-47 tag ('pt_BR' throws a RangeError)
  const bcp47 = $derived(getLocaleDef($locale).bcp47);
  const visibleApps = $derived.by(() => {
    const query = searchQuery.trim().toLocaleLowerCase(bcp47);
    const matching = ALL_APPS.filter((app) => {
      const matchesCategory = !activeCategory || app.category === activeCategory;
      const searchableText = [$t(app.name), $t(app.description), ...(app.searchTerms ?? [])].join(' ');
      const matchesQuery = !query || searchableText.toLocaleLowerCase(bcp47).includes(query);
      return matchesCategory && matchesQuery;
    });

    return searchQuery.trim() || activeCategory || showAllApps
      ? matching
      : matching.filter((app) => featuredIds.has(app.id));
  });
  const sectionTitle = $derived(
    activeCategory
      ? $t(CATEGORY_META[activeCategory].label)
      : searchQuery.trim() || showAllApps
        ? $t('home.all')
        : $t('home.featured')
  );

  $effect(() => {
    if (browser) {
      userName = localStorage.getItem('userName') || '';
      userAvatar = localStorage.getItem('userAvatar') || '👋';
      const requestedCategory = new URLSearchParams(window.location.search).get('category');
      if (requestedCategory && Object.hasOwn(CATEGORY_META, requestedCategory)) {
        activeCategory = requestedCategory as AppCategory;
      }
    }
  });

  async function chooseLanguage(code: string) {
    if (browser) {
      const redirect = getLocaleDomainRedirect(code, window.location.href);
      if (redirect) {
        window.location.assign(redirect);
        return;
      }
    }
    const appliedLocale = await setLocale(code);
    if (browser) localStorage.setItem('locale', appliedLocale);
    langOpen = false;
  }

  function handleOutsideClick(event: MouseEvent) {
    if (langOpen && langRef && !langRef.contains(event.target as Node)) langOpen = false;
  }

  $effect(() => {
    if (langOpen && browser) {
      document.addEventListener('click', handleOutsideClick, true);
      return () => document.removeEventListener('click', handleOutsideClick, true);
    }
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      aboutOpen = false;
      langOpen = false;
    }
  }

  function selectCategory(category: AppCategory | null) {
    activeCategory = activeCategory === category ? null : category;
    showAllApps = false;
    if (category) speak($t(CATEGORY_META[category].label));
  }

  function openApp(app: (typeof ALL_APPS)[number]) {
    if (!isAvailableIn(app, $locale)) {
      speak($t('app.coming_soon'));
      return;
    }
    speak($t(app.name));
    const url = new URL(base + app.route, window.location.origin);
    if (userName) {
      url.searchParams.set('userName', userName);
      url.searchParams.set('userAvatar', userAvatar);
    }
    goto(url.pathname + url.search);
  }

  function categoryColor(category: AppCategory) {
    return CATEGORY_META[category]?.color ?? '#315a49';
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="home-page">
  <header class="site-nav">
    <a class="brand" href={base + '/'} aria-label={$t('app.title.brand')}>
      <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="brand-name">{$t('app.title.brand')}</span>
    </a>

    <nav class="nav-links" aria-label={$t('app.title.brand')}>
      <a class="nav-link active" href={base + '/'}>{$t('home.explore')}</a>
      <a class="nav-link" href={base + '/about'}>{$t('about.title')}</a>
    </nav>

    <div class="nav-actions">
      <div class="lang-switcher" bind:this={langRef}>
        <button class="nav-icon-button language-button" onclick={() => langOpen = !langOpen} aria-label={$t('settings.language')} aria-expanded={langOpen}>
          <span class="lang-flag">{@html flagSvg(currentFlag)}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
        </button>
        {#if langOpen}
          <div class="lang-dropdown">
            {#each languages as language}
              <button class="lang-option" class:active={$locale === language.code} onclick={() => chooseLanguage(language.code)}>
                <span>{@html flagSvg(language.flag)}</span><span>{language.label}</span>
                {#if $locale === language.code}<span class="lang-check" aria-hidden="true">✓</span>{/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <a class="nav-icon-button" href={base + '/settings'} aria-label={$t('app.settings')}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.09-.03a1.7 1.7 0 0 0-1.8.2 1.7 1.7 0 0 0-.72 1.5V22h-3.4v-.1a1.7 1.7 0 0 0-1.13-1.6 1.7 1.7 0 0 0-1.8.2l-.08.06-2.94-1.7.03-.09a1.7 1.7 0 0 0-.2-1.8A1.7 1.7 0 0 0 4.5 16H4v-3.4h.1a1.7 1.7 0 0 0 1.6-1.13 1.7 1.7 0 0 0-.2-1.8l-.06-.08 1.7-2.94.09.03a1.7 1.7 0 0 0 1.8-.2A1.7 1.7 0 0 0 9.75 5V4.5h3.4v.1a1.7 1.7 0 0 0 1.13 1.6 1.7 1.7 0 0 0 1.8-.2l.08-.06 2.94 1.7-.03.09a1.7 1.7 0 0 0 .2 1.8 1.7 1.7 0 0 0 1.5.72h.5v3.4h-.1a1.7 1.7 0 0 0-1.6 1.13Z"/></svg>
      </a>
      <button class="nav-icon-button about-button" onclick={() => aboutOpen = true} aria-label={$t('about.title')}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v5M12 8h.01"/></svg>
      </button>
    </div>
  </header>

  <main>
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-dot"></span>{$t('home.eyebrow')}</p>
        <h1 id="home-title">{userName ? $t('welcome.hello_name', { name: userName }) : $t('home.headline')}</h1>
        <p class="hero-intro">{$t('home.intro')}</p>
        <a class="hero-link" href="#verktyg">
          {$t('home.explore')}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <div class="trust-points" aria-label={$t('home.free')}>
          <span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>{$t('home.free')}</span>
          <span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2 4 4v5c0 4 2.5 7 6 9 3.5-2 6-5 6-9V4l-6-2Z"/><path d="m7.5 10 1.7 1.7 3.5-3.5"/></svg>{$t('home.private')}</span>
          <span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 3-5 7h5l-1 7 7-9H9l1-5Z"/></svg>{$t('home.offline')}</span>
        </div>
      </div>
      <div class="hero-art" role="img" aria-label={$t('home.headline')}>
        <img src={`${base}/images/home-journey.webp`} alt="" fetchpriority="high" />
        <div class="art-note"><span class="note-sparkle">✳</span><span>{$t('home.eyebrow')}</span></div>
      </div>
    </section>

    <section class="tool-library" id="verktyg" aria-labelledby="tools-title">
      <div class="library-heading">
        <div>
          <p class="eyebrow library-eyebrow">{$t('app.subtitle')}</p>
          <h2 id="tools-title">{$t('home.all')}</h2>
        </div>
        <label class="search-box">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <span class="sr-only">{$t('app.search')}</span>
          <input bind:value={searchQuery} type="search" placeholder={$t('app.search')} autocomplete="off" />
          {#if searchQuery}
            <button class="clear-search" onclick={() => searchQuery = ''} aria-label={$t('app.back')}>×</button>
          {/if}
        </label>
      </div>

      <div class="category-list" aria-label={$t('app.choose_category')}>
        <button class="category-chip" class:selected={!activeCategory} onclick={() => selectCategory(null)} aria-pressed={!activeCategory}>
          <span class="chip-dot all-dot"></span>{$t('app.all')}
        </button>
        {#each categories as [key, meta]}
          <button class="category-chip" class:selected={activeCategory === key} style={`--chip-color:${meta.color}`} onclick={() => selectCategory(key)} aria-pressed={activeCategory === key}>
            <span class="chip-dot"></span>{$t(meta.label)}<span class="chip-count">{ALL_APPS.filter((app) => app.category === key).length}</span>
          </button>
        {/each}
      </div>

      <div class="apps-heading">
        <h3>{sectionTitle}</h3>
        <span>{visibleApps.length} {$t('home.tools_count')}</span>
      </div>

      {#if visibleApps.length}
        <div class="app-grid">
          {#each visibleApps as app (app.id)}
            <button class="app-card" class:coming-soon={!isAvailableIn(app, $locale)} onclick={() => openApp(app)} onfocus={() => speak($t(app.name) + '. ' + $t(app.description))} style={`--card-accent:${categoryColor(app.category)}`} aria-label={`${$t(app.name)}: ${$t(app.description)}`}>
              <span class="card-icon"><img src={`${base}${app.icon}`} alt="" width="42" height="42" loading="lazy" /></span>
              <span class="card-content"><span class="card-name" lang={bcp47}>{$t(app.name)}</span><span class="card-desc">{$t(app.description)}</span></span>
              <svg class="card-arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              {#if !isAvailableIn(app, $locale)}<span class="card-badge">{$t('app.coming_soon')}</span>{/if}
            </button>
          {/each}
        </div>
      {:else}
        <p class="empty-state">{$t('home.search_empty')}</p>
      {/if}

      {#if !activeCategory && !searchQuery && !showAllApps}
        <button class="browse-all" onclick={() => showAllApps = true}>{$t('home.show_all')}<span aria-hidden="true">↓</span></button>
      {:else if showAllApps && !activeCategory && !searchQuery}
        <button class="browse-all" onclick={() => showAllApps = false}>{$t('home.show_less')}<span aria-hidden="true">↑</span></button>
      {/if}
    </section>
  </main>

  <footer class="site-footer">
    <a class="footer-brand" href={base + '/'}><span class="brand-mark small" aria-hidden="true"><span></span><span></span><span></span></span>{$t('app.title.brand')}</a>
    <p>© {new Date().getFullYear()} {$t('app.title.brand')}</p>
    <a href={base + '/instruktioner'}>{$t('instructions.title')}</a>
    <a href={base + '/about'}>{$t('about.title')}</a>
  </footer>
</div>

{#if aboutOpen}
  <div class="about-overlay">
    <dialog open class="about-modal" aria-modal="true" aria-labelledby="about-title">
      <button class="about-close" onclick={() => aboutOpen = false} aria-label={$t('app.back')}>×</button>
      <span class="about-mark" aria-hidden="true">✳</span>
      <h2 id="about-title">{$t('about.title')}</h2>
      <p class="about-tagline">{$t('about.tagline')}</p>
      <div class="about-section"><h3>{$t('about.whatIs')}</h3><p>{$t('about.description')}</p></div>
      <div class="about-section"><h3>{$t('about.forWhom')}</h3><p>{$t('about.audience.children')} · {$t('about.audience.parents')} · {$t('about.audience.teachers')} · {$t('about.audience.therapists')}</p></div>
      <div class="about-section"><h3>{$t('about.developer')}</h3><p><strong>Daniel Nylander</strong></p><a href="mailto:daniel@danielnylander.se">daniel@danielnylander.se</a></div>
      <div class="about-credits"><a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> · <a href="https://github.com/rhasspy/piper" target="_blank" rel="noopener">Piper</a><p>CC BY-NC-SA 4.0</p></div>
    </dialog>
  </div>
{/if}

<style>
  .home-page { min-height: 100dvh; color: var(--text); background: var(--bg); }
  .site-nav { width: min(1320px, calc(100% - 64px)); min-height: 82px; margin: 0 auto; display: flex; align-items: center; gap: 48px; border-bottom: 1px solid var(--border); }
  .brand, .footer-brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; color: var(--text); }
  .brand-name { font-size: 1.1rem; font-weight: 750; letter-spacing: -.04em; }
  .brand-mark { position: relative; display: inline-flex; align-items: end; gap: 3px; width: 34px; height: 34px; padding: 7px; border-radius: 11px; background: #315a49; transform: rotate(-5deg); }
  .brand-mark span { display: block; width: 5px; border-radius: 5px; background: #f8f4e9; transform: rotate(5deg); }
  .brand-mark span:nth-child(1) { height: 12px; opacity: .7; }
  .brand-mark span:nth-child(2) { height: 19px; }
  .brand-mark span:nth-child(3) { height: 15px; opacity: .85; }
  .nav-links { display: flex; align-items: center; gap: 30px; height: 82px; }
  .nav-link { height: 100%; display: inline-flex; align-items: center; position: relative; color: var(--text-muted); font-size: .92rem; font-weight: 600; text-decoration: none; }
  .nav-link:hover, .nav-link.active { color: var(--text); }
  .nav-link.active::after { content: ''; position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; background: #315a49; }
  .nav-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .nav-icon-button { display: inline-flex; align-items: center; justify-content: center; gap: 5px; width: 42px; height: 42px; border: 1px solid transparent; border-radius: 50%; color: var(--text); text-decoration: none; transition: background .18s, border-color .18s; }
  .nav-icon-button:hover { background: var(--bg-card); border-color: var(--border); }
  .lang-switcher { position: relative; }
  .lang-flag { display: grid; place-items: center; width: 21px; height: 16px; }
  .lang-flag :global(svg) { width: 21px; height: 16px; display: block; }
  .lang-dropdown { position: absolute; z-index: 30; top: 48px; right: 0; width: 170px; padding: 5px; border: 1px solid var(--border); border-radius: 14px; background: var(--bg-card); box-shadow: 0 16px 40px #18392c1c; }
  .lang-option { width: 100%; min-height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 10px; text-align: left; border-radius: 9px; }
  .lang-option:hover, .lang-option.active { background: var(--bg-hover); }
  .lang-option :global(svg) { display: block; width: 21px; height: 16px; }
  .lang-check { margin-left: auto; color: #315a49; }

  main { width: min(1320px, calc(100% - 64px)); margin: 0 auto; }
  .hero { min-height: 415px; display: grid; grid-template-columns: .95fr 1.05fr; align-items: center; gap: 52px; padding: 48px 0 44px; }
  .hero-copy { padding: 18px 0 16px; }
  .eyebrow { display: flex; align-items: center; gap: 9px; margin: 0 0 18px; color: var(--accent); font-size: .76rem; font-weight: 750; letter-spacing: .12em; line-height: 1.3; text-transform: uppercase; }
  .eyebrow-dot { width: 8px; height: 8px; border-radius: 50%; background: #b66d4c; box-shadow: 0 0 0 4px #b66d4c1d; }
  .hero h1 { max-width: 560px; margin: 0; color: var(--text); font-size: clamp(2.65rem, 5vw, 4.35rem); font-weight: 680; letter-spacing: -.065em; line-height: 1.02; text-wrap: balance; }
  .hero-intro { max-width: 495px; margin: 22px 0 0; color: var(--text-secondary); font-size: 1.08rem; line-height: 1.7; }
  .hero-link { width: fit-content; display: inline-flex; align-items: center; gap: 12px; margin-top: 25px; padding: 13px 18px; border-radius: 999px; background: var(--accent); color: var(--bg-card); font-size: .9rem; font-weight: 700; text-decoration: none; transition: background .18s, transform .18s; }
  .hero-link:hover { background: var(--accent-hover); transform: translateY(-1px); }
  .trust-points { display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 27px; color: var(--text-muted); font-size: .74rem; font-weight: 600; }
  .trust-points span { display: inline-flex; align-items: center; gap: 6px; }
  .trust-points svg { width: 15px; height: 15px; fill: none; stroke: #63806e; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .hero-art { position: relative; height: 360px; overflow: hidden; border: 1px solid #e8e2d5; border-radius: 26px; background: #f5f0e5; box-shadow: 0 20px 50px #36564412; }
  .hero-art img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .art-note { position: absolute; right: 19px; bottom: 18px; display: flex; align-items: center; gap: 8px; padding: 9px 13px; border: 1px solid #ffffffa8; border-radius: 999px; background: #fffaf0e8; color: #42614d; font-size: .72rem; font-weight: 650; backdrop-filter: blur(8px); }
  .note-sparkle { font-size: 1.1rem; color: #bd7958; }

  .tool-library { padding: 38px 0 78px; border-top: 1px solid var(--border); scroll-margin-top: 24px; }
  .library-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
  .library-eyebrow { margin-bottom: 9px; color: #7e8d83; font-size: .68rem; }
  .library-heading h2 { margin: 0; color: var(--text); font-size: 1.7rem; font-weight: 680; letter-spacing: -.04em; }
  .search-box { width: min(330px, 44vw); height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-card); color: var(--text-muted); transition: border-color .18s, box-shadow .18s; }
  .search-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent); }
  .search-box input[type='search'] { width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; border-radius: 0; outline: 0; box-shadow: none; appearance: none; background: transparent; color: var(--text); font: inherit; font-size: .87rem; }
  .search-box input[type='search']:focus { border: 0; outline: 0; box-shadow: none; }
  .search-box input[type='search']::placeholder { color: var(--text-muted); }
  .clear-search { width: 26px; height: 26px; flex: 0 0 auto; border-radius: 50%; color: #68776e; font-size: 1.2rem; }
  .clear-search:hover { background: var(--bg-hover); }
  .category-list { display: flex; gap: 9px; padding: 22px 0 24px; overflow-x: auto; scrollbar-width: none; }
  .category-list::-webkit-scrollbar { display: none; }
  .category-chip { min-height: 38px; flex: 0 0 auto; display: inline-flex; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--border); border-radius: 999px; background: transparent; color: var(--text-secondary); font-size: .78rem; font-weight: 650; transition: all .18s; }
  .category-chip:hover { border-color: var(--accent); background: var(--bg-card); color: var(--text); }
  .category-chip.selected { border-color: var(--accent); background: var(--accent); color: var(--bg-card); }
  .chip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--chip-color, #315a49); }
  .category-chip.selected .chip-dot { background: #fff; }
  .all-dot { background: #b66d4c; }
  .chip-count { min-width: 18px; padding: 2px 5px; border-radius: 99px; background: var(--bg-hover); color: var(--text-secondary); font-size: .68rem; text-align: center; }
  .category-chip.selected .chip-count { background: #ffffff27; color: #fff; }
  .apps-heading { display: flex; align-items: baseline; gap: 10px; margin: 4px 0 14px; }
  .apps-heading h3 { margin: 0; color: var(--text); font-size: 1.1rem; font-weight: 680; letter-spacing: -.025em; }
  .apps-heading > span { color: var(--text-muted); font-size: .75rem; }
  .app-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 11px; }
  .app-card { min-width: 0; min-height: 94px; position: relative; display: flex; align-items: center; gap: 13px; padding: 14px 15px; border: 1px solid var(--border); border-radius: 15px; background: var(--bg-card); color: var(--text); text-align: left; transition: transform .18s, border-color .18s, box-shadow .18s; }
  .app-card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--card-accent) 42%, var(--border)); box-shadow: 0 9px 24px #20382a12; }
  .app-card:active { transform: translateY(0) scale(.99); }
  .app-card.coming-soon { opacity: .62; }
  .card-icon { width: 51px; height: 51px; flex: 0 0 51px; display: grid; place-items: center; border-radius: 13px; background: color-mix(in srgb, var(--card-accent) 10%, #fff); }
  .card-icon img { width: 39px; height: 39px; object-fit: contain; }
  .card-content { min-width: 0; display: flex; flex: 1; flex-direction: column; gap: 5px; }
  .card-name { overflow: hidden; color: var(--text); font-size: .85rem; font-weight: 690; line-height: 1.2; text-overflow: ellipsis; }
  .card-desc { display: -webkit-box; overflow: hidden; color: var(--text-muted); font-size: .72rem; line-height: 1.4; line-clamp: 2; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .card-arrow { flex: 0 0 auto; color: #a5afa8; transition: transform .18s, color .18s; }
  .app-card:hover .card-arrow { transform: translateX(2px); color: var(--card-accent); }
  .card-badge { position: absolute; top: 5px; right: 7px; padding: 2px 5px; border-radius: 5px; background: #f0f1ed; color: #899187; font-size: .56rem; }
  .empty-state { padding: 40px 16px; border: 1px dashed #dce3dd; border-radius: 14px; color: #718076; text-align: center; }
  .browse-all { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 44px; margin: 24px auto 0; padding: 0 16px; border: 1px solid var(--border); border-radius: 999px; color: var(--accent); font-size: .81rem; font-weight: 680; transition: background .18s; }
  .browse-all:hover { background: var(--bg-hover); }
  .browse-all span { font-size: 1rem; }
  .site-footer { min-height: 74px; display: flex; align-items: center; gap: 24px; padding: 12px max(32px, calc((100% - 1320px) / 2)); border-top: 1px solid var(--border); color: var(--text-muted); font-size: .74rem; }
  .site-footer p { margin: 0 auto 0 0; }
  .site-footer > a:last-child { color: inherit; text-decoration: none; }
  .footer-brand { gap: 8px; color: var(--text-secondary); font-size: .78rem; font-weight: 700; }
  .brand-mark.small { width: 25px; height: 25px; gap: 2px; padding: 5px; border-radius: 8px; }
  .brand-mark.small span { width: 4px; }
  .brand-mark.small span:nth-child(1) { height: 9px; }
  .brand-mark.small span:nth-child(2) { height: 14px; }
  .brand-mark.small span:nth-child(3) { height: 11px; }

  .about-overlay { position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 20px; background: #14251fc2; backdrop-filter: blur(6px); }
  .about-modal { position: relative; width: min(520px, 100%); max-height: min(84dvh, 720px); overflow: auto; margin: auto; padding: 34px; border: 1px solid var(--border); border-radius: 22px; background: var(--bg-card); color: var(--text); box-shadow: 0 26px 80px #10241940; }
  .about-close { position: absolute; top: 14px; right: 15px; width: 36px; height: 36px; border-radius: 50%; color: var(--text-muted); font-size: 1.5rem; }
  .about-close:hover { background: var(--bg-hover); }
  .about-mark { display: grid; place-items: center; width: 42px; height: 42px; margin-bottom: 15px; border-radius: 13px; background: #315a49; color: #fff; font-size: 1.35rem; }
  .about-modal h2 { margin: 0 0 6px; font-size: 1.6rem; letter-spacing: -.04em; }
  .about-tagline { margin: 0 0 25px; color: var(--text-muted); }
  .about-section { margin: 18px 0; line-height: 1.65; }
  .about-section h3 { margin: 0 0 5px; font-size: .87rem; }
  .about-section p { margin: 0; color: var(--text-secondary); font-size: .88rem; }
  .about-section a, .about-credits a { color: var(--accent); }
  .about-credits { padding-top: 16px; border-top: 1px solid var(--border); font-size: .82rem; }
  .about-credits p { margin: 7px 0 0; color: var(--text-muted); font-size: .75rem; }

  @media (max-width: 960px) {
    .site-nav, main { width: min(100% - 44px, 780px); }
    .hero { min-height: 350px; gap: 28px; grid-template-columns: 1fr .92fr; }
    .hero-art { height: 300px; }
    .app-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .site-footer { padding-right: 22px; padding-left: 22px; }
  }
  @media (max-width: 650px) {
    .site-nav, main { width: calc(100% - 36px); }
    .site-nav { min-height: 68px; gap: 16px; }
    .brand { gap: 8px; }
    .brand-mark { width: 30px; height: 30px; }
    .brand-name { font-size: .98rem; }
    .nav-links { height: 68px; gap: 15px; margin-left: auto; }
    .nav-link { font-size: .76rem; }
    .nav-actions { margin-left: 0; gap: 1px; }
    .nav-icon-button { width: 35px; height: 38px; }
    .about-button { display: none; }
    .hero { display: flex; flex-direction: column; align-items: stretch; gap: 23px; padding: 37px 0 34px; }
    .hero-copy { padding: 0; }
    .eyebrow { margin-bottom: 13px; font-size: .67rem; }
    .hero h1 { max-width: 430px; font-size: clamp(2.5rem, 12vw, 3.75rem); }
    .hero-intro { max-width: 480px; margin-top: 14px; font-size: .98rem; line-height: 1.6; }
    .hero-link { margin-top: 18px; }
    .trust-points { gap: 8px 13px; margin-top: 18px; font-size: .67rem; }
    .hero-art { height: clamp(180px, 48vw, 270px); border-radius: 18px; }
    .art-note { right: 10px; bottom: 10px; padding: 7px 10px; font-size: .65rem; }
    .tool-library { padding: 30px 0 54px; }
    .library-heading { align-items: stretch; flex-direction: column; gap: 16px; }
    .library-heading h2 { font-size: 1.5rem; }
    .search-box { width: 100%; height: 46px; }
    .category-list { gap: 7px; margin-right: -18px; padding: 17px 18px 20px 0; }
    .category-chip { min-height: 36px; padding: 0 10px; font-size: .74rem; }
    .app-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .app-card { min-height: 82px; gap: 9px; padding: 11px 10px; border-radius: 12px; }
    .card-icon { width: 41px; height: 41px; flex-basis: 41px; border-radius: 11px; }
    .card-icon img { width: 32px; height: 32px; }
    .card-name { font-size: .77rem; }
    .card-desc { font-size: .65rem; }
    .card-arrow { display: none; }
    .site-footer { min-height: 65px; gap: 12px; padding: 10px 18px; font-size: .66rem; }
    .footer-brand { font-size: .69rem; }
  }
  @media (max-width: 390px) {
    .site-nav, main { width: calc(100% - 28px); }
    .nav-links { gap: 10px; }
    .nav-link { font-size: .7rem; }
    .nav-icon-button { width: 32px; }
    .app-card { min-height: 77px; gap: 7px; padding: 9px 8px; }
    .card-icon { width: 36px; height: 36px; flex-basis: 36px; }
    .card-icon img { width: 29px; height: 29px; }
    .site-footer > a:last-child { display: none; }
  }
</style>
