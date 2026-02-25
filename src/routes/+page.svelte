<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { ALL_APPS, CATEGORY_META, type AppCategory } from '$lib/apps';
  import { fly, fade } from 'svelte/transition';

  let activeCategory = $state<AppCategory | null>(null);

  const categories = Object.entries(CATEGORY_META) as [AppCategory, typeof CATEGORY_META[AppCategory]][];

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
      goto(app.route);
    } else {
      speak($t('app.coming_soon'));
    }
  }

  function getCategoryColor(cat: AppCategory): string {
    return CATEGORY_META[cat].color;
  }
</script>

<div class="launcher" class:has-category={activeCategory !== null}>
  <!-- Hero image — always present, fades when category selected -->
  <div class="hero-wrapper" class:faded={activeCategory !== null}>
    <img
      src="/icons/hero.svg"
      alt={$t('app.title') + ' — ' + $t('app.subtitle')}
      class="hero-image"
      draggable="false"
    />
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

  <!-- Top bar with settings -->
  <header class="launcher-header">
    <div class="brand">
      <h1>{$t('app.title')}</h1>
    </div>
    <button
      class="settings-icon"
      onclick={() => goto('/settings')}
      aria-label={$t('app.settings')}
      onfocus={() => speak($t('app.settings'))}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  </header>

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
      <div class="app-grid">
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
              <img src={app.icon} alt="" width="56" height="56" loading="lazy" onerror={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <span class="card-name">{$t(app.name)}</span>
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

  /* Header */
  .launcher-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .brand h1 {
    font-size: 1.3em;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .settings-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
  }
  .settings-icon:hover { background: var(--bg-hover); }

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

  /* App grid */
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }

  @media (max-width: 600px) {
    .app-grid {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
    }
  }

  .app-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 12px 16px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 170px;
    gap: 8px;
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
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: color-mix(in srgb, var(--card-accent) 10%, transparent);
    flex-shrink: 0;
  }
  .card-icon img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .card-name {
    font-weight: 600;
    font-size: 0.95em;
    line-height: 1.2;
  }

  .card-desc {
    font-size: 0.75em;
    color: var(--text-muted);
    line-height: 1.3;
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
</style>
