<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms, getPictogramUrl } from '$lib/arasaac';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  interface CommCard {
    id: string;
    label: string;
    pictogramUrl: string;
    pictogramId: number;
    isPhoto: boolean;
    photoData?: string; // base64 data URL for personal photos
  }

  interface CommPage {
    id: string;
    name: string;
    icon: string;
    color: string;
    cards: CommCard[];
  }

  // Default pages with ARASAAC pictograms
  const DEFAULT_PAGES: CommPage[] = [
    { id: 'favorites', name: 'commBook.page.favorites', icon: '⭐', color: '#F1C40F', cards: [] },
    { id: 'food', name: 'commBook.page.food', icon: '🍎', color: '#E67E22', cards: [] },
    { id: 'drinks', name: 'commBook.page.drinks', icon: '🥤', color: '#3498DB', cards: [] },
    { id: 'activities', name: 'commBook.page.activities', icon: '🎮', color: '#27AE60', cards: [] },
    { id: 'places', name: 'commBook.page.places', icon: '🏠', color: '#9B59B6', cards: [] },
    { id: 'people', name: 'commBook.page.people', icon: '👨‍👩‍👧‍👦', color: '#E74C3C', cards: [] },
    { id: 'feelings', name: 'commBook.page.feelings', icon: '😊', color: '#1ABC9C', cards: [] },
  ];

  const CATEGORY_WORDS: Record<string, string[]> = {
    food: ['apple', 'banana', 'bread', 'rice', 'chicken', 'pasta', 'egg', 'cheese', 'soup', 'pizza', 'fish', 'yogurt'],
    drinks: ['water', 'milk', 'juice', 'tea', 'smoothie', 'hot chocolate'],
    activities: ['play', 'draw', 'read', 'sing', 'swim', 'run', 'dance', 'watch TV', 'computer', 'playground', 'walk', 'sleep'],
    places: ['home', 'school', 'park', 'store', 'hospital', 'bathroom', 'kitchen', 'bedroom', 'car', 'bus'],
    people: ['mom', 'dad', 'brother', 'sister', 'teacher', 'friend', 'grandma', 'grandpa', 'doctor'],
    feelings: ['happy', 'sad', 'angry', 'tired', 'scared', 'excited', 'hungry', 'thirsty', 'sick', 'calm'],
  };

  let pages = $state<CommPage[]>(loadPages());
  let currentPageId = $state('favorites');
  let sentenceStrip = $state<CommCard[]>([]);
  let loading = $state(false);
  let editMode = $state(false);
  let showAddCard = $state(false);
  let newCardLabel = $state('');
  let searchQuery = $state('');
  let searchResults = $state<{ id: number; keyword: string; url: string }[]>([]);
  let searching = $state(false);

  const currentPage = $derived(pages.find(p => p.id === currentPageId) || pages[0]);

  function loadPages(): CommPage[] {
    try {
      const data = localStorage.getItem('comm-book-pages');
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_PAGES;
  }

  function savePages() {
    localStorage.setItem('comm-book-pages', JSON.stringify(pages));
  }

  $effect(() => {
    // Load default cards for pages that are empty (except favorites)
    const needsInit = pages.some(p => p.id !== 'favorites' && p.cards.length === 0 && CATEGORY_WORDS[p.id]);
    if (needsInit) initializePages();
  });

  async function initializePages() {
    loading = true;
    for (const page of pages) {
      if (page.id === 'favorites' || page.cards.length > 0) continue;
      const words = CATEGORY_WORDS[page.id];
      if (!words) continue;
      page.cards = await Promise.all(
        words.map(async (w) => {
          const results = await searchPictograms(w, 'en');
          const svResults = await searchPictograms(w, 'sv');
          return {
            id: crypto.randomUUID(),
            label: get(locale) === 'sv' ? (svResults[0]?.keyword || w) : w,
            pictogramUrl: results[0]?.url || '',
            pictogramId: results[0]?.id || 0,
            isPhoto: false,
          };
        })
      );
    }
    pages = [...pages];
    savePages();
    loading = false;
  }

  function tapCard(card: CommCard) {
    if (editMode) return;
    speak(card.label);
    sentenceStrip = [...sentenceStrip, card];
    // Auto-add to favorites if not there
    const favPage = pages.find(p => p.id === 'favorites');
    if (favPage && !favPage.cards.some(c => c.label === card.label)) {
      // Only auto-add after 3 taps (tracked in localStorage)
      const tapCounts: Record<string, number> = JSON.parse(localStorage.getItem('comm-book-taps') || '{}');
      tapCounts[card.label] = (tapCounts[card.label] || 0) + 1;
      localStorage.setItem('comm-book-taps', JSON.stringify(tapCounts));
      if (tapCounts[card.label] >= 3 && favPage.cards.length < 12) {
        favPage.cards = [...favPage.cards, { ...card, id: crypto.randomUUID() }];
        pages = [...pages];
        savePages();
      }
    }
  }

  function speakStrip() {
    if (sentenceStrip.length > 0) {
      speak(sentenceStrip.map(c => c.label).join(' '));
    }
  }

  function clearStrip() { sentenceStrip = []; }

  function removeFromStrip(index: number) {
    sentenceStrip = sentenceStrip.filter((_, i) => i !== index);
  }

  function removeCard(cardId: string) {
    const page = pages.find(p => p.id === currentPageId);
    if (page) {
      page.cards = page.cards.filter(c => c.id !== cardId);
      pages = [...pages];
      savePages();
    }
  }

  async function searchArasaac() {
    if (!searchQuery.trim()) return;
    searching = true;
    const results = await searchPictograms(searchQuery, get(locale));
    searchResults = results.slice(0, 12);
    searching = false;
  }

  function addSearchResult(result: { id: number; keyword: string; url: string }) {
    const page = pages.find(p => p.id === currentPageId);
    if (page) {
      page.cards = [...page.cards, {
        id: crypto.randomUUID(),
        label: result.keyword,
        pictogramUrl: result.url,
        pictogramId: result.id,
        isPhoto: false,
      }];
      pages = [...pages];
      savePages();
      showAddCard = false;
      searchQuery = '';
      searchResults = [];
    }
  }

  function addPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const page = pages.find(p => p.id === currentPageId);
        if (page) {
          const label = newCardLabel || file.name.replace(/\.\w+$/, '');
          page.cards = [...page.cards, {
            id: crypto.randomUUID(),
            label,
            pictogramUrl: reader.result as string,
            pictogramId: 0,
            isPhoto: true,
          }];
          pages = [...pages];
          savePages();
          showAddCard = false;
          newCardLabel = '';
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function exportBook() {
    const data = JSON.stringify(pages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comm-book.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importBook() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const imported = JSON.parse(text);
        if (Array.isArray(imported)) {
          pages = imported;
          savePages();
        }
      } catch { alert('Invalid file'); }
    };
    input.click();
  }
</script>

<WelcomeDialog appId="comm-book" titleKey="app.comm_book" purposeKey="welcome.commBook.purpose" howKey="welcome.commBook.how" goalKey="welcome.commBook.goal" icon="📖" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto('/')} aria-label={$t('app.back')}>←</button>
    <h1>📖 {$t('commBook.title')}</h1>
    <div class="hdr-actions">
      <button class="icon-btn" class:active={editMode} onclick={() => { editMode = !editMode; showAddCard = false; }} aria-label={$t('commBook.edit')}>✏️</button>
      {#if editMode}
        <button class="icon-btn" onclick={exportBook}>📤</button>
        <button class="icon-btn" onclick={importBook}>📥</button>
      {/if}
    </div>
  </header>

  <main class="cnt">
    <!-- Sentence strip -->
    {#if sentenceStrip.length > 0}
      <section class="strip-area">
        <div class="strip">
          {#each sentenceStrip as card, i}
            <button class="strip-card" onclick={() => removeFromStrip(i)}>
              {#if card.pictogramUrl}
                <img src={card.pictogramUrl} alt={card.label} width="40" height="40" />
              {/if}
              <span>{card.label}</span>
            </button>
          {/each}
        </div>
        <div class="strip-btns">
          <button class="speak-btn" onclick={speakStrip}>🔊</button>
          <button class="clear-btn" onclick={clearStrip}>✕</button>
        </div>
      </section>
    {/if}

    <!-- Tab bar -->
    <nav class="tabs" role="tablist">
      {#each pages as page}
        <button
          class="tab"
          class:active={currentPageId === page.id}
          style="--tab-color: {page.color}"
          onclick={() => { currentPageId = page.id; showAddCard = false; }}
          role="tab"
          aria-selected={currentPageId === page.id}
        >
          <span class="tab-icon">{page.icon}</span>
          <span class="tab-name">{$t(page.name)}</span>
        </button>
      {/each}
    </nav>

    {#if loading}
      <div class="loading">⏳ {$t('commBook.loading')}</div>
    {:else}
      <!-- Cards grid -->
      <section class="card-grid" role="tabpanel">
        {#each currentPage.cards as card (card.id)}
          <div class="comm-card-wrap">
            <button class="comm-card" onclick={() => tapCard(card)} style="border-color: {currentPage.color}">
              {#if card.pictogramUrl}
                <img src={card.pictogramUrl} alt={card.label} width="80" height="80" loading="lazy" />
              {/if}
              <span class="card-label">{card.label}</span>
            </button>
            {#if editMode}
              <button class="remove-btn" onclick={() => removeCard(card.id)}>✕</button>
            {/if}
          </div>
        {/each}

        {#if editMode}
          <button class="add-card-btn" onclick={() => showAddCard = !showAddCard} style="border-color: {currentPage.color}">
            <span class="add-icon">+</span>
            <span>{$t('commBook.addCard')}</span>
          </button>
        {/if}

        {#if currentPage.cards.length === 0 && !editMode}
          <p class="empty-hint">{$t('commBook.emptyHint')}</p>
        {/if}
      </section>

      <!-- Add card panel -->
      {#if showAddCard}
        <section class="add-panel" in:fade>
          <h3>{$t('commBook.addCard')}</h3>

          <div class="add-option">
            <h4>🔍 {$t('commBook.searchArasaac')}</h4>
            <div class="search-row">
              <input bind:value={searchQuery} placeholder={$t('commBook.searchPlaceholder')}
                onkeydown={(e) => { if (e.key === 'Enter') searchArasaac(); }} />
              <button onclick={searchArasaac} disabled={searching}>{searching ? '⏳' : '🔍'}</button>
            </div>
            {#if searchResults.length > 0}
              <div class="search-grid">
                {#each searchResults as result}
                  <button class="search-result" onclick={() => addSearchResult(result)}>
                    <img src={result.url} alt={result.keyword} width="56" height="56" />
                    <span>{result.keyword}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <div class="add-option">
            <h4>📸 {$t('commBook.addPhoto')}</h4>
            <input bind:value={newCardLabel} placeholder={$t('commBook.photoLabel')} />
            <button class="photo-btn" onclick={addPhoto}>📷 {$t('commBook.takePhoto')}</button>
          </div>
        </section>
      {/if}
    {/if}
  </main>

  <footer class="cr"><p>ARASAAC (CC BY-NC-SA) · Autismappar</p></footer>
</div>

<style>
  .app { display: flex; flex-direction: column; min-height: 100dvh; background: var(--bg, #f5f5f5); color: var(--text, #1a1a2e); }
  .hdr { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-card, #fff); border-bottom: 1px solid var(--border, #e0e0e0); }
  .back { background: none; border: none; font-size: 1.5em; cursor: pointer; padding: 4px 8px; }
  h1 { font-size: 1.3em; margin: 0; flex: 1; }
  h2, h3, h4 { margin: 0 0 8px; font-weight: 600; }
  h3 { font-size: 1em; }
  h4 { font-size: .9em; }
  .cnt { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto; width: 100%; }
  .cr { text-align: center; padding: 12px; font-size: .75em; opacity: .5; }

  .hdr-actions { display: flex; gap: 6px; }
  .icon-btn { background: none; border: 2px solid var(--border, #ddd); border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 1em; }
  .icon-btn.active { background: #3498DB20; border-color: #3498DB; }

  /* Strip */
  .strip-area { background: var(--bg-card, #fff); border-radius: 12px; padding: 10px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .strip { display: flex; gap: 6px; flex: 1; overflow-x: auto; }
  .strip-card { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border: 2px solid var(--border, #ddd); border-radius: 8px; background: var(--bg-card, #fff); cursor: pointer; flex-shrink: 0; }
  .strip-card img { border-radius: 4px; }
  .strip-card span { font-size: .8em; font-weight: 600; }
  .strip-btns { display: flex; gap: 4px; }
  .speak-btn, .clear-btn { padding: 6px 10px; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1em; }
  .speak-btn { background: #27AE60; color: white; }
  .clear-btn { background: #E74C3C; color: white; }

  /* Tabs */
  .tabs { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 4px; }
  .tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 12px; border: 2px solid var(--border, #ddd); border-radius: 10px; background: var(--bg-card, #fff); cursor: pointer; flex-shrink: 0; transition: all .15s; }
  .tab.active { border-color: var(--tab-color); background: color-mix(in srgb, var(--tab-color) 10%, white); }
  .tab-icon { font-size: 1.2em; }
  .tab-name { font-size: .7em; font-weight: 600; }

  .loading { text-align: center; padding: 30px; }

  /* Cards */
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
  .comm-card-wrap { position: relative; }
  .comm-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; border: 3px solid; border-radius: 12px; background: var(--bg-card, #fff); cursor: pointer; width: 100%; transition: all .15s; min-height: 110px; justify-content: center; }
  .comm-card:hover { transform: scale(1.03); box-shadow: 0 2px 8px rgba(0,0,0,.1); }
  .comm-card:active { transform: scale(0.97); }
  .comm-card img { border-radius: 6px; object-fit: cover; }
  .card-label { font-size: .8em; font-weight: 600; text-align: center; line-height: 1.2; }
  .remove-btn { position: absolute; top: -6px; right: -6px; width: 24px; height: 24px; border-radius: 50%; background: #E74C3C; color: white; border: 2px solid white; font-size: .7em; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .add-card-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px; border: 3px dashed; border-radius: 12px; background: transparent; cursor: pointer; min-height: 110px; opacity: .6; }
  .add-card-btn:hover { opacity: 1; }
  .add-icon { font-size: 2em; }
  .empty-hint { text-align: center; color: #888; font-style: italic; grid-column: 1 / -1; padding: 20px; }

  /* Add panel */
  .add-panel { background: var(--bg-card, #fff); border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.08); display: flex; flex-direction: column; gap: 16px; }
  .add-option { display: flex; flex-direction: column; gap: 8px; }
  .search-row { display: flex; gap: 6px; }
  .search-row input { flex: 1; padding: 8px 12px; border: 2px solid var(--border, #ddd); border-radius: 8px; font-size: .9em; }
  .search-row button { padding: 8px 14px; border: none; border-radius: 8px; background: #3498DB; color: white; cursor: pointer; font-size: 1em; }
  .search-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 6px; }
  .search-result { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; border: 1px solid var(--border, #ddd); border-radius: 8px; background: var(--bg-card, #fff); cursor: pointer; }
  .search-result:hover { border-color: #27AE60; }
  .search-result img { border-radius: 4px; }
  .search-result span { font-size: .7em; font-weight: 600; text-align: center; }
  .add-option input { padding: 8px 12px; border: 2px solid var(--border, #ddd); border-radius: 8px; font-size: .9em; }
  .photo-btn { padding: 10px 16px; background: #9B59B6; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }

  @media (prefers-color-scheme: dark) {
    .app { --bg: #1a1a2e; --text: #e0e0e0; --bg-card: #16213e; --border: #334155; }
    .tab.active { background: color-mix(in srgb, var(--tab-color) 15%, #16213e); }
  }
</style>
