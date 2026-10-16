<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t, locale, pick } from '$lib/i18n';
  import { SIGN_CATEGORIES_PT, signSearchUrlPt, matchesPt, SPREAD_THE_SIGN } from '$lib/data/pt-br/sign-dictionary';
  import { get } from 'svelte/store';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const BASE = 'https://teckensprakslexikon.su.se';

  // Swedish words carry the lexicon id; the pt-BR words (SIGN_CATEGORIES_PT) only carry `pt`
  type Word = { sv?: string; en?: string; id?: string; vf?: string; pt?: string };
  type Category = { id: string; icon: string; color: string; words: Word[] };
  type View = 'categories' | 'words' | 'detail' | 'search';

  // Core vocabulary organized by category (Fitzgerald Key colors)
  const CATEGORIES_SV: Category[] = [
    {
      id: 'people',
      icon: '👤',
      color: '#f5c542', // yellow
      words: [
        { sv: 'mamma', en: 'mom', id: '00188', vf: 'mamma' },
        { sv: 'pappa', en: 'dad', id: '02557', vf: 'pappa' },
        { sv: 'kompis', en: 'friend', id: '02531', vf: 'kompis' },
        { sv: 'jag', en: 'I/me', id: '02798', vf: 'jag' },
        { sv: 'du', en: 'you', id: '02817', vf: 'du' },
      ]
    },
    {
      id: 'actions',
      icon: '🏃',
      color: '#4caf50', // green
      words: [
        { sv: 'äta', en: 'eat', id: '01267', vf: 'ata' },
        { sv: 'dricka', en: 'drink', id: '01377', vf: 'dricka' },
        { sv: 'sova', en: 'sleep', id: '00049', vf: 'sova' },
        { sv: 'leka', en: 'play', id: '01092', vf: 'leka' },
        { sv: 'hjälp', en: 'help', id: '19924', vf: 'hjalp' },
        { sv: 'stopp', en: 'stop', id: '11109', vf: 'stopp' },
      ]
    },
    {
      id: 'feelings',
      icon: '😊',
      color: '#2196f3', // blue
      words: [
        { sv: 'glad', en: 'happy', id: '00165', vf: 'glad' },
        { sv: 'ledsen', en: 'sad', id: '00185', vf: 'ledsen' },
        { sv: 'arg', en: 'angry', id: '01670', vf: 'arg' },
        { sv: 'rädd', en: 'scared', id: '03447', vf: 'radd' },
        { sv: 'trött', en: 'tired', id: '00966', vf: 'trott' },
      ]
    },
    {
      id: 'things',
      icon: '📦',
      color: '#ff9800', // orange
      words: [
        { sv: 'vatten', en: 'water', id: '00132', vf: 'vatten' },
        { sv: 'mjölk', en: 'milk', id: '08962', vf: 'lattmjolk' },
        { sv: 'bröd', en: 'bread', id: '00434', vf: 'brod' },
        { sv: 'bil', en: 'car', id: '02158', vf: 'bil' },
        { sv: 'hus', en: 'house', id: '00696', vf: 'hus' },
        { sv: 'katt', en: 'cat', id: '00344', vf: 'katt' },
        { sv: 'sko', en: 'shoe', id: '02224', vf: 'sko' },
        { sv: 'jacka', en: 'jacket', id: '00544', vf: 'jacka' },
      ]
    },
    {
      id: 'social',
      icon: '💬',
      color: '#9c27b0', // purple
      words: [
        { sv: 'ja', en: 'yes', id: '09027' },
        { sv: 'nej', en: 'no', id: '00274' },
        { sv: 'tack', en: 'thanks', id: '03442' },
        { sv: 'hej', en: 'hello', id: '00032' },
        { sv: 'toalett', en: 'toilet', id: '02800' },
      ]
    },
    {
      id: 'places',
      icon: '🏠',
      color: '#795548', // brown
      words: [
        { sv: 'skola', en: 'school', id: '00617' },
        { sv: 'hem', en: 'home', id: '10533' },
      ]
    }
  ];

  // pt-BR: no Libras source licenses its videos for use inside the app, so the sign opens on Spread The Sign (new tab)
  const CATEGORIES = $derived(pick<Category[]>({ sv: CATEGORIES_SV, en: CATEGORIES_SV, pt_BR: SIGN_CATEGORIES_PT }, $locale));
  const linkOnly = $derived(pick({ sv: false, en: false, pt_BR: true }, $locale));

  let view = $state<View>('categories');
  let selectedCategory = $state<Category | null>(null);
  let selectedWord = $state<Word | null>(null);
  let searchQuery = $state('');
  let searchResults = $state<Word[]>([]);
  let searching = $state(false);
  let videoError = $state(false);

  function getVideoUrl(id: string, vf: string) {
    const prefix = id.substring(0, 2);
    return `${BASE}/movies/${prefix}/${vf}-${id}-tecken.mp4`;
  }

  function getPhotoUrl(id: string, word: string) {
    const prefix = id.substring(0, 2);
    return `${BASE}/photos/${prefix}/${word}-${id}-photo-1-medium.jpg`;
  }

  function selectCategory(cat: Category) {
    selectedCategory = cat;
    view = 'words';
  }

  function wordText(word: Word): string {
    return pick({ sv: word.sv, en: word.en, pt_BR: word.pt }, get(locale)) ?? '';
  }

  function selectWord(word: Word) {
    selectedWord = word;
    videoError = false;
    view = 'detail';
    speak(wordText(word));
  }

  function back() {
    if (view === 'detail') {
      view = selectedCategory ? 'words' : 'search';
    } else if (view === 'words' || view === 'search') {
      view = 'categories';
      selectedCategory = null;
    } else {
      goto(base + '/');
    }
  }

  async function doSearch() {
    if (!searchQuery.trim()) return;
    if (linkOnly) return searchPt();
    searching = true;
    searchResults = [];
    try {
      const res = await fetch(`${BASE}/sok?q=${encodeURIComponent(searchQuery.trim())}`);
      const html = await res.text();
      // Parse results: find href="/ord/XXXXX">word</a>
      const matches = [...html.matchAll(/href="\/ord\/(\d+)">([^<]+)<\/a>/g)];
      const seen = new Set();
      searchResults = matches
        .filter(m => {
          if (seen.has(m[1])) return false;
          seen.add(m[1]);
          return m[2].trim().length > 0;
        })
        .map(m => ({ sv: m[2].trim(), en: m[2].trim(), id: m[1] }))
        .slice(0, 20);
    } catch (e) {
      console.error('Search failed:', e);
    }
    searching = false;
  }

  // pt-BR: the external site's pages are not read (its terms forbid using the data); search the local words
  function searchPt() {
    const q = searchQuery.trim();
    searchResults = CATEGORIES.flatMap((c) => c.words).filter((w) => matchesPt(w.pt ?? '', q));
    selectedCategory = null;
    view = 'search';
  }

  function openLibras(text: string) {
    window.open(signSearchUrlPt(text), '_blank', 'noopener');
  }

  function openExternal(id: string) {
    window.open(`${BASE}/ord/${id}`, '_blank');
  }
</script>

<WelcomeDialog appId="sign-dictionary" titleKey="app.sign_dictionary" purposeKey="welcome.signDictionary.purpose" howKey="welcome.signDictionary.how" goalKey="welcome.signDictionary.goal" icon="🤟" />

<div class="app-container" in:fade>

  <main class="content">

  <div class="page-title">

    <h1>🤟 {$t('signDictionary.title')}</h1>

  </div>

    {#if view === 'categories'}
      <p class="intro">{$t('signDictionary.intro')}</p>

      <div class="search-bar">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={$t('signDictionary.searchPlaceholder')}
          onkeydown={(e) => e.key === 'Enter' && doSearch()}
        />
        <button class="search-btn" onclick={doSearch} disabled={searching}>
          {searching ? '⏳' : '🔍'}
        </button>
      </div>

      <div class="categories">
        {#each CATEGORIES as cat}
          <button
            class="category-card"
            style="--cat-color: {cat.color}"
            onclick={() => selectCategory(cat)}
          >
            <span class="cat-icon">{cat.icon}</span>
            <span class="cat-name">{$t(`signDictionary.cat.${cat.id}`)}</span>
            <span class="cat-count">{cat.words.length} {$t('signDictionary.signs')}</span>
          </button>
        {/each}
      </div>

    {:else if view === 'search'}
      <h2>{$t('signDictionary.searchResults')}: "{searchQuery}"</h2>
      {#if searchResults.length === 0}
        <p class="empty">{$t('signDictionary.noResults')}</p>
      {:else}
        <div class="word-grid">
          {#each searchResults as word}
            <button class="word-card" onclick={() => selectWord(word)}>
              <span class="word-text">{wordText(word)}</span>
              <span class="word-action">🤟</span>
            </button>
          {/each}
        </div>
      {/if}
      {#if linkOnly}
        <button class="link-btn libras-btn" onclick={() => openLibras(searchQuery)}>
          🔗 {$t('signDictionary.searchExternal', { q: searchQuery.trim() })}
        </button>
      {/if}

    {:else if view === 'words' && selectedCategory}
      <h2>{selectedCategory.icon} {$t(`signDictionary.cat.${selectedCategory.id}`)}</h2>
      <div class="word-grid">
        {#each selectedCategory.words as word}
          <button
            class="word-card"
            style="--cat-color: {selectedCategory.color}"
            onclick={() => selectWord(word)}
          >
            <span class="word-text">{wordText(word)}</span>
            <span class="word-action">🤟</span>
          </button>
        {/each}
      </div>

    {:else if view === 'detail' && selectedWord}
      <div class="detail-view">
        <h2 class="detail-word">{wordText(selectedWord)}</h2>

        {#if linkOnly}
          <div class="libras-card">
            <p class="libras-emoji">🤟</p>
            <button class="link-btn libras-btn" onclick={() => openLibras(selectedWord?.pt ?? '')}>
              {$t('signDictionary.watchOnSite')} ↗
            </button>
            <p class="libras-note">{$t('signDictionary.externalNote')}</p>
          </div>
        {:else}
        <div class="video-container">
          {#if !videoError}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
              controls
              autoplay
              loop
              playsinline
              src={getVideoUrl(selectedWord.id ?? '', selectedWord.vf || selectedWord.sv || '')}
              onerror={() => videoError = true}
              class="sign-video"
            >
            </video>
          {:else}
            <div class="video-fallback">
              <p>🤟</p>
              <button class="link-btn" onclick={() => selectedWord?.id && openExternal(selectedWord.id)}>
                {$t('signDictionary.openExternal')}
              </button>
            </div>
          {/if}
        </div>
        {/if}

        <div class="detail-actions">
          <button class="action-btn speak-btn" onclick={() => speak((linkOnly ? selectedWord?.pt : selectedWord?.sv) ?? '')}>
            🔊 {$t('signDictionary.listen')}
          </button>
          {#if !linkOnly}
          <button class="action-btn external-btn" onclick={() => selectedWord?.id && openExternal(selectedWord.id)}>
            🔗 {$t('signDictionary.openExternal')}
          </button>
          {/if}
        </div>

        <p class="detail-hint">{$t('signDictionary.hint')}</p>
      </div>
    {/if}
  </main>

  <footer class="credit">
    {#if linkOnly}
      <p><a href={SPREAD_THE_SIGN} target="_blank" rel="noopener">{$t('signDictionary.creditPt')}</a></p>
    {:else}
    <p>
      <a href="https://teckensprakslexikon.su.se" target="_blank" rel="noopener">
        Svenskt teckenspråkslexikon
      </a>
      © Stockholms universitet · CC BY-NC-SA 4.0
    </p>
    {/if}
  </footer>
</div>

<style>
  .app-container {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  h1 {
    font-size: 1.4rem;
    margin: 0;
  }

  .content {
    flex: 1;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .intro {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  /* Search */
  .search-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .search-bar input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 1.1rem;
    background: var(--bg-card);
    color: var(--text);
    min-height: 48px;
  }

  .search-btn {
    padding: 0.75rem 1rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    font-size: 1.2rem;
    cursor: pointer;
    min-width: 48px;
    min-height: 48px;
  }

  /* Categories */
  .categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border: 2px solid var(--cat-color, var(--border));
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    min-height: 48px;
  }

  .category-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .cat-icon {
    font-size: 2rem;
  }

  .cat-name {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .cat-count {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  /* Word grid */
  .word-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .word-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 2px solid var(--cat-color, var(--border));
    border-radius: 12px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s;
    min-height: 48px;
    font-size: 1.1rem;
  }

  .word-card:hover {
    transform: translateY(-1px);
  }

  .word-text {
    font-weight: 600;
  }

  .word-action {
    font-size: 1.3rem;
  }

  /* Detail */
  .detail-view {
    text-align: center;
  }

  .detail-word {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .video-container {
    margin: 1rem 0;
    border-radius: 16px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .video-fallback {
    color: #fff;
    text-align: center;
    padding: 2rem;
  }

  .video-fallback p {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .link-btn {
    background: var(--accent, #2196f3);
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    min-height: 48px;
  }

  .detail-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin: 1.5rem 0;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    font-size: 1.1rem;
    cursor: pointer;
    min-height: 48px;
  }

  .speak-btn:hover {
    background: #e3f2fd;
  }

  .detail-hint {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-style: italic;
  }

  .empty {
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem;
  }

  h2 {
    margin: 0 0 0.5rem;
  }

  .libras-card {
    margin: 1rem 0;
    padding: 2rem 1rem;
    border-radius: 16px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  .libras-emoji { font-size: 4rem; margin: 0; }
  .libras-btn { font-size: 1.15rem; font-weight: 700; }
  .libras-note { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }

  /* Credit footer */
  .credit {
    padding: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
  }

  .credit a {
    color: var(--text-secondary);
  }

  @media (prefers-reduced-motion: reduce) {
    .category-card, .word-card {
      transition: none;
    }
  }
</style>
