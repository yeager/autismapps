<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const BASE = 'https://teckensprakslexikon.su.se';

  // Core vocabulary organized by category (Fitzgerald Key colors)
  const CATEGORIES = [
    {
      id: 'people',
      icon: '👤',
      color: '#f5c542', // yellow
      words: [
        { sv: 'mamma', en: 'mom', id: '00188' },
        { sv: 'pappa', en: 'dad', id: '06906' },
        { sv: 'kompis', en: 'friend', id: '04714' },
        { sv: 'jag', en: 'I/me', id: '02553' },
        { sv: 'du', en: 'you', id: '04804' },
      ]
    },
    {
      id: 'actions',
      icon: '🏃',
      color: '#4caf50', // green
      words: [
        { sv: 'äta', en: 'eat', id: '16263' },
        { sv: 'dricka', en: 'drink', id: '01377' },
        { sv: 'sova', en: 'sleep', id: '00049' },
        { sv: 'leka', en: 'play', id: '01092' },
        { sv: 'hjälp', en: 'help', id: '19924' },
        { sv: 'stopp', en: 'stop', id: '11109' },
      ]
    },
    {
      id: 'feelings',
      icon: '😊',
      color: '#2196f3', // blue
      words: [
        { sv: 'glad', en: 'happy', id: '00165' },
        { sv: 'ledsen', en: 'sad', id: '00185' },
        { sv: 'arg', en: 'angry', id: '01670' },
        { sv: 'rädd', en: 'scared', id: '08500' },
        { sv: 'trött', en: 'tired', id: '00110' },
      ]
    },
    {
      id: 'things',
      icon: '📦',
      color: '#ff9800', // orange
      words: [
        { sv: 'vatten', en: 'water', id: '00132' },
        { sv: 'mjölk', en: 'milk', id: '08962' },
        { sv: 'bröd', en: 'bread', id: '00434' },
        { sv: 'bil', en: 'car', id: '02158' },
        { sv: 'hus', en: 'house', id: '00696' },
        { sv: 'katt', en: 'cat', id: '00344' },
        { sv: 'sko', en: 'shoe', id: '02224' },
        { sv: 'jacka', en: 'jacket', id: '00544' },
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

  let view = $state('categories'); // 'categories' | 'words' | 'detail' | 'search'
  let selectedCategory = $state(null);
  let selectedWord = $state(null);
  let searchQuery = $state('');
  let searchResults = $state([]);
  let searching = $state(false);
  let videoError = $state(false);

  function getVideoUrl(id) {
    const prefix = id.substring(0, 2);
    return `${BASE}/movies/${prefix}/video-${id}-tecken.mp4`;
  }

  function getPhotoUrl(id, word) {
    const prefix = id.substring(0, 2);
    return `${BASE}/photos/${prefix}/${word}-${id}-photo-1-medium.jpg`;
  }

  function selectCategory(cat) {
    selectedCategory = cat;
    view = 'words';
  }

  function selectWord(word) {
    selectedWord = word;
    videoError = false;
    view = 'detail';
    speak(word.sv);
  }

  function back() {
    if (view === 'detail') {
      view = selectedCategory ? 'words' : 'search';
    } else if (view === 'words' || view === 'search') {
      view = 'categories';
      selectedCategory = null;
    } else {
      goto(`${base}/`);
    }
  }

  async function doSearch() {
    if (!searchQuery.trim()) return;
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

  function openExternal(id) {
    window.open(`${BASE}/ord/${id}`, '_blank');
  }
</script>

<WelcomeDialog appId="sign-dictionary" titleKey="app.sign_dictionary" purposeKey="welcome.signDictionary.purpose" howKey="welcome.signDictionary.how" goalKey="welcome.signDictionary.goal" icon="🤟" />

<div class="app-container" in:fade>
  <header class="sticky-header">
    <button class="back-btn" onclick={back} aria-label={$t('common.back')}>←</button>
    <h1>🤟 {$t('signDictionary.title')}</h1>
  </header>

  <main class="content">
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
              <span class="word-text">{word.sv}</span>
              <span class="word-action">🤟</span>
            </button>
          {/each}
        </div>
      {/if}

    {:else if view === 'words'}
      <h2>{selectedCategory.icon} {$t(`signDictionary.cat.${selectedCategory.id}`)}</h2>
      <div class="word-grid">
        {#each selectedCategory.words as word}
          <button
            class="word-card"
            style="--cat-color: {selectedCategory.color}"
            onclick={() => selectWord(word)}
          >
            <span class="word-text">{word.sv}</span>
            <span class="word-action">🤟</span>
          </button>
        {/each}
      </div>

    {:else if view === 'detail'}
      <div class="detail-view">
        <h2 class="detail-word">{selectedWord.sv}</h2>

        <div class="video-container">
          {#if !videoError}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
              controls
              autoplay
              loop
              playsinline
              src={getVideoUrl(selectedWord.id)}
              onerror={() => videoError = true}
              class="sign-video"
            >
            </video>
          {:else}
            <div class="video-fallback">
              <p>🤟</p>
              <button class="link-btn" onclick={() => openExternal(selectedWord.id)}>
                {$t('signDictionary.openExternal')}
              </button>
            </div>
          {/if}
        </div>

        <div class="detail-actions">
          <button class="action-btn speak-btn" onclick={() => speak(selectedWord.sv)}>
            🔊 {$t('signDictionary.listen')}
          </button>
          <button class="action-btn external-btn" onclick={() => openExternal(selectedWord.id)}>
            🔗 {$t('signDictionary.openExternal')}
          </button>
        </div>

        <p class="detail-hint">{$t('signDictionary.hint')}</p>
      </div>
    {/if}
  </main>

  <footer class="credit">
    <p>
      <a href="https://teckensprakslexikon.su.se" target="_blank" rel="noopener">
        Svenskt teckenspråkslexikon
      </a>
      © Stockholms universitet · CC BY-NC-SA 4.0
    </p>
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

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
  }

  .back-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    padding: 0.25rem 0.5rem;
    min-width: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
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
