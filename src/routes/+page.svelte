<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { ALL_APPS, CATEGORY_META, type AppCategory } from '$lib/apps';

  let search = $state('');
  let activeCategory = $state<AppCategory | 'all'>('all');

  const categories = Object.entries(CATEGORY_META) as [AppCategory, typeof CATEGORY_META[AppCategory]][];

  const filtered = $derived(
    ALL_APPS.filter((app) => {
      const matchCat = activeCategory === 'all' || app.category === activeCategory;
      const matchSearch = !search || $t(app.name).toLowerCase().includes(search.toLowerCase()) || $t(app.description).toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
  );

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

<div class="launcher">
  <!-- Header -->
  <header class="launcher-header">
    <div class="brand">
      <svg class="logo" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="#4F46E5" opacity="0.1"/>
        <circle cx="24" cy="24" r="16" fill="#4F46E5" opacity="0.15"/>
        <path d="M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z" fill="#4F46E5"/>
        <circle cx="19" cy="22" r="2.5" fill="#4F46E5"/>
        <circle cx="29" cy="22" r="2.5" fill="#4F46E5"/>
        <path d="M18 29c0 0 2 3 6 3s6-3 6-3" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
      <div>
        <h1>{$t('app.title')}</h1>
        <p class="subtitle">{$t('app.subtitle')}</p>
      </div>
    </div>
    <button class="settings-icon" onclick={() => goto('/settings')} aria-label={$t('app.settings')}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  </header>

  <!-- Search -->
  <div class="search-bar">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
    <input
      type="search"
      bind:value={search}
      placeholder={$t('app.search')}
      aria-label={$t('app.search')}
    />
  </div>

  <!-- Category filter -->
  <nav class="categories" aria-label="Filter by category">
    <button
      class="cat-pill"
      class:active={activeCategory === 'all'}
      onclick={() => activeCategory = 'all'}
      style="--pill-color: var(--accent)"
    >
      {$t('app.all')}
    </button>
    {#each categories as [key, meta]}
      <button
        class="cat-pill"
        class:active={activeCategory === key}
        onclick={() => activeCategory = key}
        onfocus={() => speak($t(meta.label))}
        style="--pill-color: {meta.color}"
      >
        <span class="cat-emoji">{meta.emoji}</span>
        {$t(meta.label)}
      </button>
    {/each}
  </nav>

  <!-- App grid -->
  <div class="app-grid" role="list">
    {#each filtered as app (app.id)}
      <button
        class="app-card"
        class:coming-soon={!app.ready}
        role="listitem"
        onclick={() => openApp(app)}
        onfocus={() => speak($t(app.name) + '. ' + $t(app.description))}
        style="--card-accent: {getCategoryColor(app.category)}"
        aria-label="{$t(app.name)}: {$t(app.description)}"
      >
        <div class="card-icon">
          <img src={app.icon} alt="" width="64" height="64" loading="lazy" onerror={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
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

<style>
  .launcher {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
  }

  .launcher-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding: 8px 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .brand h1 {
    font-size: 1.8em;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .subtitle {
    color: var(--text-muted);
    font-size: 0.9em;
    margin-top: 2px;
  }

  .settings-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
  }
  .settings-icon:hover { background: var(--bg-hover); }

  /* Search */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 18px;
    margin-bottom: 20px;
    transition: border-color var(--transition);
  }
  .search-bar:focus-within {
    border-color: var(--accent);
  }
  .search-bar input {
    flex: 1;
    border: none;
    outline: none;
    background: none;
    font: inherit;
    font-size: 1.05em;
    color: var(--text);
  }
  .search-bar input::placeholder {
    color: var(--text-muted);
  }

  /* Categories */
  .categories {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 24px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .categories::-webkit-scrollbar { display: none; }

  .cat-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 100px;
    font-weight: 500;
    font-size: 0.9em;
    white-space: nowrap;
    background: var(--bg-card);
    border: 2px solid var(--border);
    transition: all var(--transition);
    min-height: 44px;
  }
  .cat-pill:hover {
    background: var(--bg-hover);
    border-color: var(--pill-color);
  }
  .cat-pill.active {
    background: var(--pill-color);
    color: white;
    border-color: var(--pill-color);
  }
  .cat-emoji {
    font-size: 1.1em;
  }

  /* App grid */
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  @media (max-width: 600px) {
    .app-grid {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 12px;
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
    transition: all var(--transition);
    min-height: 170px;
    gap: 8px;
  }
  .app-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--card-accent);
  }
  .app-card:active {
    transform: translateY(0);
  }
  .app-card.coming-soon {
    opacity: 0.55;
  }
  .app-card.coming-soon:hover {
    opacity: 0.75;
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
</style>
