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
  let aboutOpen = $state(false);

  function toggleLang() {
    langOpen = !langOpen;
  }

  function pickLang(code: string) {
    setLocale(code);
    if (browser) localStorage.setItem("locale", code);
    langOpen = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (langOpen && langRef && !langRef.contains(e.target as Node)) {
      langOpen = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && aboutOpen) {
      aboutOpen = false;
    }
  }

  // Attach click-outside listener
  $effect(() => {
    if (langOpen && browser) {
      const handler = (e: MouseEvent) => handleClickOutside(e);
      document.addEventListener("click", handler, true);
      return () => document.removeEventListener("click", handler, true);
    }
  });

  const currentFlag = $derived(LANGUAGES.find(l => l.code === $locale)?.flag ?? "🇸🇪");

  const filtered = $derived(
    activeCategory ? ALL_APPS.filter((app) => app.category === activeCategory) : []
  );

  function selectCategory(cat: AppCategory) {
    if (activeCategory === cat) {
      activeCategory = null;
    } else {
      activeCategory = cat;
      speak($t(CATEGORY_META[cat].label));
    }
  }

  function openApp(app: typeof ALL_APPS[0]) {
    if (app.ready) {
      speak($t(app.name));
      goto(base + app.route);
    } else {
      speak($t('app.coming_soon'));
    }
  }

  function getCategoryColor(cat: AppCategory): string {
    return CATEGORY_META[cat].color;
  }
</script>

<!-- svelte:window for keyboard events -->
<svelte:window onkeydown={handleKeydown} />

<div class="launcher" class:has-category={activeCategory !== null}>
  <!-- Hero image — always present, fades when category selected -->
  <div class="hero-wrapper" class:faded={activeCategory !== null}>
    <img
      src={`${base}/icons/hero-v2.svg`}
      alt={$t('app.title') + ' — ' + $t('app.subtitle')}
      class="hero-image"
      draggable="false"
    />
    <div class="hero-text-overlay">
      <h2 class="hero-title">{$t('app.title.brand')}</h2>
      <p class="hero-subtitle">{$t('app.subtitle')}</p>
    </div>

    <!-- Floating toolbar on hero -->
    <div class="hero-toolbar">
      <!-- Language switcher -->
      <div class="lang-switcher" bind:this={langRef}>
        <button
          class="hero-btn"
          onclick={toggleLang}
          aria-label="Byt språk"
          aria-expanded={langOpen}
        >
          <span class="lang-flag">{currentFlag}</span>
          <svg class="lang-chevron" class:open={langOpen} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        {#if langOpen}
          <div class="lang-dropdown">
            {#each LANGUAGES as lang}
              <button
                class="lang-option"
                class:active={$locale === lang.code}
                onclick={() => pickLang(lang.code)}
              >
                <span class="lang-option-flag">{lang.flag}</span>
                <span class="lang-option-name">{lang.name}</span>
                {#if $locale === lang.code}
                  <span class="lang-check">✓</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Settings -->
      <button
        class="hero-btn"
        onclick={() => goto(base + '/settings')}
        aria-label={$t('app.settings')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      <!-- About (popup) -->
      <button
        class="hero-btn"
        onclick={() => aboutOpen = true}
        aria-label={$t('about.title')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      </button>
    </div>

    {#if !activeCategory}
      <div class="hero-overlay" transition:fade={{ duration: 300 }}>
        <div class="hero-cta">
          <p class="hero-tagline">{$t('app.choose_category')}</p>
          <svg class="hero-arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    {/if}
  </div>

  <!-- About popup modal -->
  {#if aboutOpen}
    <div class="about-overlay" transition:fade={{ duration: 200 }} onclick={() => aboutOpen = false} role="presentation">
      <div class="about-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={$t('about.title')}>
        <button class="about-close" onclick={() => aboutOpen = false} aria-label="Stäng">✕</button>
        <div class="about-icon">🧩</div>
        <h2>{$t('about.title')}</h2>
        <p class="about-tagline">{$t('about.tagline')}</p>

        <div class="about-section">
          <h3>{$t('about.whatIs')}</h3>
          <p>{$t('about.description')}</p>
        </div>

        <div class="about-section">
          <h3>{$t('about.forWhom')}</h3>
          <ul>
            <li>{$t('about.audience.children')}</li>
            <li>{$t('about.audience.parents')}</li>
            <li>{$t('about.audience.teachers')}</li>
            <li>{$t('about.audience.therapists')}</li>
          </ul>
        </div>

        <div class="about-section about-dev">
          <h3>{$t('about.developer')}</h3>
          <p><strong>Daniel Nylander</strong></p>
          <div class="about-links">
            <a href="mailto:daniel@danielnylander.se">✉️ daniel@danielnylander.se</a>
            <a href="https://github.com/yeager" target="_blank" rel="noopener">🐙 github.com/yeager</a>
            <a href="https://danielnylander.se" target="_blank" rel="noopener">🌐 danielnylander.se</a>
          </div>
        </div>

        <div class="about-section about-credits">
          <p><a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> · <a href="https://github.com/rhasspy/piper" target="_blank" rel="noopener">Piper</a></p>
          <p class="about-license">🇸🇪 {$t('about.madeIn')} · CC BY-NC-SA 4.0</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Category buttons -->
  <nav class="categories" aria-label={$t('app.choose_category')}>
    {#each categories as [key, meta]}
      <button
        class="cat-btn"
        class:active={activeCategory === key}
        onclick={() => selectCategory(key)}
        onfocus={() => speak($t(meta.label))}
        aria-pressed={activeCategory === key}
        aria-label={$t(meta.label)}
        style="--cat-color: {meta.color}"
      >
        <span class="cat-emoji" aria-hidden="true">{meta.emoji}</span>
        <span class="cat-label">{$t(meta.label)}</span>
        <span class="cat-count">{ALL_APPS.filter(a => a.category === key).length}</span>
      </button>
    {/each}
  </nav>

  <!-- App grid — only visible when category selected -->
  {#if activeCategory}
    <div class="app-section" transition:fly={{ y: 40, duration: 350 }}>
      <div class="section-header">
        <h2 style="color: {getCategoryColor(activeCategory)}">
          {CATEGORY_META[activeCategory].emoji} {$t(CATEGORY_META[activeCategory].label)}
        </h2>
        <button class="close-section" onclick={() => activeCategory = null} aria-label={$t('app.back')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="app-grid" style="--card-min: {filtered.length <= 3 ? '160px' : filtered.length <= 6 ? '140px' : '120px'}; --card-min-mobile: {filtered.length <= 3 ? '120px' : filtered.length <= 6 ? '100px' : '90px'}">
        {#each filtered as app, i (app.id)}
          <button
            class="app-card"
            class:coming-soon={!app.ready}
            onclick={() => openApp(app)}
            onfocus={() => speak($t(app.name) + '. ' + $t(app.description))}
            style="--card-accent: {getCategoryColor(app.category)}; --delay: {i * 50}ms"
            aria-label="{$t(app.name)}: {$t(app.description)}"
          >
            <div class="card-icon">
              <img src={`${base}${app.icon}`} alt="" width="56" height="56" loading="lazy" onerror={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <span class="card-name" lang={$locale}>{$t(app.name)}</span>
            <span class="card-desc">{$t(app.description)}</span>
            {#if !app.ready}
              <span class="card-badge">{$t('app.coming_soon')}</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .launcher {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    position: relative;
    overflow-x: hidden;
  }

  /* Hero image */
  .hero-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
    max-height: 70dvh;
    overflow: hidden;
    transition: opacity 0.5s ease, filter 0.5s ease, max-height 0.5s ease;
  }

  .hero-wrapper.faded {
    max-height: 30dvh;
    opacity: 0.2;
    filter: blur(2px);
  }

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  .hero-text-overlay {
    position: absolute;
    top: 12%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 3;
    pointer-events: none;
  }
  .hero-title {
    font-size: clamp(2rem, 6vw, 4.5rem);
    font-weight: 800;
    color: white;
    letter-spacing: -0.02em;
    margin: 0;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }
  .hero-subtitle {
    font-size: clamp(0.9rem, 2vw, 1.5rem);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.05em;
    margin: 4px 0 0;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  }

  .hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 20px 30px;
    background: linear-gradient(transparent, rgba(0,0,0,0.4));
    display: flex;
    justify-content: center;
  }

  .hero-cta {
    text-align: center;
    color: white;
  }

  .hero-tagline {
    font-size: 1.2em;
    font-weight: 600;
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .hero-arrow {
    animation: bounce 2s ease infinite;
    opacity: 0.8;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  /* Floating toolbar on hero */
  .hero-toolbar {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .hero-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    color: white;
    transition: background 0.15s;
    border: none;
    background: none;
    cursor: pointer;
  }
  .hero-btn:hover { background: rgba(255, 255, 255, 0.2); }

  /* About modal */
  .about-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }

  .about-modal {
    background: var(--bg-card, white);
    color: var(--text, #333);
    border-radius: 1.5rem;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    max-height: 85dvh;
    overflow-y: auto;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  .about-close {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.2rem;
    color: var(--text-muted, #999);
    border: none;
    background: none;
    cursor: pointer;
    transition: background 0.15s;
  }
  .about-close:hover { background: var(--bg-hover, #f0f0f0); }

  .about-icon { font-size: 3rem; margin-bottom: 0.5rem; }

  .about-modal h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }

  .about-tagline {
    font-style: italic;
    color: var(--text-secondary, #666);
    margin-bottom: 1.5rem;
  }

  .about-section {
    text-align: left;
    margin-bottom: 1.2rem;
  }

  .about-section h3 {
    font-size: 1rem;
    margin: 0 0 0.4rem;
  }

  .about-section p {
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .about-section ul {
    margin: 0;
    padding-left: 1.25rem;
    line-height: 1.8;
  }

  .about-dev { text-align: center; }

  .about-links {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }
  .about-links a {
    color: var(--text-secondary, #666);
    text-decoration: none;
    font-size: 0.9rem;
  }
  .about-links a:hover { color: var(--text, #333); }

  .about-credits {
    text-align: center;
    border-top: 1px solid var(--border, #eee);
    padding-top: 1rem;
  }
  .about-credits a { color: var(--accent, #2196f3); }
  .about-license {
    font-size: 0.85rem;
    color: var(--text-muted, #999);
    margin-top: 0.5rem;
  }

  /* Categories */
  .categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    padding: 16px 20px;
  }

  @media (max-width: 600px) {
    .categories {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 12px 16px;
    }
  }

  .cat-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 0.95em;
    background: var(--bg-card);
    border: 2px solid var(--border);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 56px;
    position: relative;
    overflow: hidden;
  }

  .cat-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--cat-color);
    border-radius: 0 2px 2px 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .cat-btn:hover {
    border-color: var(--cat-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--cat-color) 20%, transparent);
  }

  .cat-btn:hover::before,
  .cat-btn.active::before {
    opacity: 1;
  }

  .cat-btn.active {
    background: var(--cat-color);
    color: white;
    border-color: var(--cat-color);
    transform: scale(1.02);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--cat-color) 30%, transparent);
  }

  .cat-emoji {
    font-size: 1.4em;
    flex-shrink: 0;
  }

  .cat-label {
    flex: 1;
    text-align: left;
  }

  .cat-count {
    font-size: 0.75em;
    padding: 2px 8px;
    border-radius: 100px;
    background: rgba(0,0,0,0.08);
  }

  .cat-btn.active .cat-count {
    background: rgba(255,255,255,0.25);
  }

  /* App section */
  .app-section {
    padding: 0 20px 40px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
  }

  .section-header h2 {
    font-size: 1.3em;
    font-weight: 700;
  }

  .close-section {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background var(--transition);
    color: var(--text-muted);
  }
  .close-section:hover {
    background: var(--bg-hover);
    color: var(--text);
  }

  /* App grid — adaptive: fewer apps = bigger cards */
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--card-min, 160px), 1fr));
    gap: 14px;
  }

  @media (max-width: 600px) {
    .app-grid {
      grid-template-columns: repeat(auto-fill, minmax(var(--card-min-mobile, 130px), 1fr));
      gap: 10px;
    }
  }

  .app-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 12px 8px 10px;
    justify-content: center;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    aspect-ratio: 1;
    gap: 6px;
    animation: cardIn 0.4s ease both;
    animation-delay: var(--delay);
  }

  @keyframes cardIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .app-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
    border-color: var(--card-accent);
  }
  .app-card:active {
    transform: translateY(0) scale(0.98);
  }
  .app-card.coming-soon {
    opacity: 0.5;
  }
  .app-card.coming-soon:hover {
    opacity: 0.7;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: color-mix(in srgb, var(--card-accent) 10%, transparent);
    flex-shrink: 0;
  }
  .card-icon img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }

  .card-name {
    font-weight: 600;
    font-size: 0.8em;
    line-height: 1.15;
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    -webkit-hyphens: auto;
    lang: sv;
  }

  .card-desc {
    font-size: 0.65em;
    color: var(--text-muted);
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 0.65em;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    background: var(--border);
    color: var(--text-muted);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .hero-arrow { animation: none; }
    .app-card { animation: none; }
    .hero-wrapper { transition: none; }
  }

  /* Language switcher */
  .lang-switcher {
    position: relative;
  }

  .lang-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
    min-height: 44px;
    min-width: 44px;
    justify-content: center;
  }
  .lang-btn:hover { background: var(--bg-hover); }

  .lang-flag {
    font-size: 1.4em;
    line-height: 1;
  }

  .lang-chevron {
    transition: transform 0.2s ease;
    color: var(--text-muted);
  }
  .lang-chevron.open {
    transform: rotate(180deg);
  }

  .lang-dropdown {
    position: fixed;
    top: auto;
    right: 12px;
    margin-top: 6px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: var(--radius);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-width: 160px;
    overflow: hidden;
    z-index: 10001;
  }

  .lang-option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 16px;
    font-size: 0.95em;
    font-weight: 500;
    color: white;
    transition: background 0.15s;
    min-height: 48px;
    border: none;
    background: none;
    cursor: pointer;
  }
  .lang-option:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  .lang-option.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }

  .lang-option-flag {
    font-size: 1.3em;
  }

  .lang-option-name {
    flex: 1;
    text-align: left;
  }

  .lang-check {
    color: #4FC3F7;
    flex-shrink: 0;
  }
</style>
