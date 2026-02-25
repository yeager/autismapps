<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { translateKeywords } from '$lib/arasaac/sv-lookup';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';

  interface CoreWord { word: string; category: string; color: string; id: number; url: string; }

  const CORE_VOCAB: { word: string; category: string }[] = [
    // People (yellow)
    { word: 'I', category: 'people' }, { word: 'you', category: 'people' }, { word: 'he', category: 'people' },
    { word: 'she', category: 'people' }, { word: 'we', category: 'people' }, { word: 'they', category: 'people' },
    { word: 'mom', category: 'people' }, { word: 'dad', category: 'people' },
    // Actions (green)
    { word: 'want', category: 'actions' }, { word: 'go', category: 'actions' }, { word: 'stop', category: 'actions' },
    { word: 'help', category: 'actions' }, { word: 'eat', category: 'actions' }, { word: 'drink', category: 'actions' },
    { word: 'play', category: 'actions' }, { word: 'read', category: 'actions' }, { word: 'give', category: 'actions' },
    { word: 'take', category: 'actions' }, { word: 'make', category: 'actions' }, { word: 'see', category: 'actions' },
    { word: 'hear', category: 'actions' }, { word: 'like', category: 'actions' }, { word: 'do', category: 'actions' },
    { word: 'have', category: 'actions' }, { word: 'can', category: 'actions' },
    // Descriptions (blue)
    { word: 'big', category: 'descriptions' }, { word: 'small', category: 'descriptions' },
    { word: 'good', category: 'descriptions' }, { word: 'bad', category: 'descriptions' },
    { word: 'hot', category: 'descriptions' }, { word: 'cold', category: 'descriptions' },
    { word: 'more', category: 'descriptions' }, { word: 'not', category: 'descriptions' },
    // Things (orange)
    { word: 'food', category: 'things' }, { word: 'water', category: 'things' }, { word: 'home', category: 'things' },
    { word: 'school', category: 'things' }, { word: 'book', category: 'things' }, { word: 'ball', category: 'things' },
    // Places (purple)
    { word: 'here', category: 'places' }, { word: 'there', category: 'places' },
    { word: 'up', category: 'places' }, { word: 'down', category: 'places' },
    { word: 'in', category: 'places' }, { word: 'out', category: 'places' },
    // Feelings (pink)
    { word: 'happy', category: 'feelings' }, { word: 'sad', category: 'feelings' },
    { word: 'angry', category: 'feelings' }, { word: 'scared', category: 'feelings' },
    // Questions (teal)
    { word: 'what', category: 'questions' }, { word: 'where', category: 'questions' },
    { word: 'who', category: 'questions' }, { word: 'when', category: 'questions' },
    // Social (coral)
    { word: 'yes', category: 'social' }, { word: 'no', category: 'social' },
    { word: 'please', category: 'social' }, { word: 'thank you', category: 'social' },
    { word: 'hello', category: 'social' }, { word: 'goodbye', category: 'social' }
  ];

  const CATEGORY_COLORS: Record<string, string> = {
    people: '#F1C40F', actions: '#27AE60', descriptions: '#3498DB',
    things: '#E67E22', places: '#9B59B6', feelings: '#E91E63',
    questions: '#1ABC9C', social: '#E74C3C'
  };

  const CATEGORIES = ['people', 'actions', 'descriptions', 'things', 'places', 'feelings', 'questions', 'social'];

  let words = $state<CoreWord[]>([]);
  let sentence = $state<CoreWord[]>([]);
  let activeCategory = $state<string | null>(null);
  let loading = $state(true);

  const filtered = $derived(activeCategory ? words.filter(w => w.category === activeCategory) : words);

  $effect(() => { loadWords(); });

  async function loadWords() {
    loading = true;
    const lang = get(locale);
    const allEnWords = CORE_VOCAB.map(v => v.word);
    const translated = lang === 'sv' ? await translateKeywords(allEnWords) : null;

    const results = await Promise.all(
      CORE_VOCAB.map(async ({ word, category }, i) => {
        const res = await searchPictograms(word, 'en');
        const displayWord = translated ? translated[i].sv : word;
        return {
          word: displayWord, category, color: CATEGORY_COLORS[category] || '#999',
          id: res[0]?.id || 0, url: res[0]?.url || ''
        };
      })
    );
    words = results;
    loading = false;
  }

  function addWord(w: CoreWord) {
    sentence = [...sentence, w];
    speak(w.word);
  }

  function removeLastWord() {
    sentence = sentence.slice(0, -1);
  }

  function clearSentence() {
    sentence = [];
  }

  function speakSentence() {
    const text = sentence.map(w => w.word).join(' ');
    speak(text);
  }
</script>

<div class="point-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('point.title')}</h1>
  </header>

  <!-- Sentence strip -->
  <div class="sentence-strip">
    <div class="strip-words">
      {#each sentence as w, i}
        <div class="strip-word" style="border-color: {w.color}">
          {#if w.url}<img src={w.url} alt={w.word} width="36" height="36" />{/if}
          <span>{w.word}</span>
        </div>
      {/each}
      {#if sentence.length === 0}
        <span class="strip-placeholder">{$t('point.tap_words')}</span>
      {/if}
    </div>
    <div class="strip-actions">
      <button class="strip-btn" onclick={removeLastWord} disabled={sentence.length === 0}>⌫</button>
      <button class="strip-btn speak" onclick={speakSentence} disabled={sentence.length === 0}>🔊</button>
      <button class="strip-btn" onclick={clearSentence} disabled={sentence.length === 0}>🗑️</button>
    </div>
  </div>

  <!-- Category tabs -->
  <div class="cat-tabs">
    <button class="cat-tab" class:active={!activeCategory} onclick={() => { activeCategory = null; }}>
      {$t('app.all')}
    </button>
    {#each CATEGORIES as cat}
      <button class="cat-tab" class:active={activeCategory === cat} style="--cc: {CATEGORY_COLORS[cat]}"
        onclick={() => { activeCategory = activeCategory === cat ? null : cat; }}>
        {$t('point.cat.' + cat)}
      </button>
    {/each}
  </div>

  {#if loading}
    <div class="loading"><div class="spinner"></div></div>
  {:else}
    <div class="words-grid">
      {#each filtered as w}
        <button class="word-card" style="--wc: {w.color}" onclick={() => addWord(w)} onfocus={() => speak(w.word)}>
          {#if w.url}
            <img src={w.url} alt={w.word} width="52" height="52" />
          {/if}
          <span class="word-label">{w.word}</span>
        </button>
      {/each}
    </div>
  {/if}

  <footer class="credit">
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
    · Inspired by core vocabulary research (Cross et al., 2006; Banajee et al., 2003)
  </footer>
</div>

<style>
  .point-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; }

  .sentence-strip {
    display: flex; align-items: center; gap: 8px; padding: 10px 16px;
    background: var(--bg-card); border-bottom: 2px solid var(--border); min-height: 70px;
  }
  .strip-words { display: flex; gap: 6px; flex: 1; overflow-x: auto; align-items: center; }
  .strip-word {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 4px 8px; border-radius: 8px; border-bottom: 3px solid; font-size: 0.75em; font-weight: 600;
    background: var(--bg); flex-shrink: 0;
  }
  .strip-word img { border-radius: 4px; }
  .strip-placeholder { color: var(--text-muted); font-style: italic; font-size: 0.9em; }
  .strip-actions { display: flex; gap: 4px; flex-shrink: 0; }
  .strip-btn {
    width: 44px; height: 44px; border-radius: var(--radius-sm); font-size: 1.2em;
    display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--bg-card);
  }
  .strip-btn:disabled { opacity: 0.3; }
  .strip-btn.speak { background: #27AE60; color: white; border-color: #27AE60; }

  .cat-tabs {
    display: flex; gap: 4px; padding: 8px 12px; overflow-x: auto;
    border-bottom: 1px solid var(--border);
  }
  .cat-tab {
    padding: 6px 14px; border-radius: 100px; font-size: 0.8em; font-weight: 600;
    white-space: nowrap; border: 2px solid var(--border); background: var(--bg-card); transition: all 0.15s;
  }
  .cat-tab.active { background: var(--cc, #3498DB); color: white; border-color: var(--cc, #3498DB); }

  .words-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px; padding: 12px; flex: 1;
  }
  .word-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 10px 6px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); border-left: 4px solid var(--wc); transition: all 0.15s;
  }
  .word-card:hover { transform: scale(1.05); border-color: var(--wc); }
  .word-card:active { transform: scale(0.93); }
  .word-card img { border-radius: 6px; }
  .word-label { font-size: 0.75em; font-weight: 600; text-align: center; }

  .loading { flex: 1; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: #3498DB; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); line-height: 1.4; }
  .credit a { color: inherit; text-decoration: underline; }
</style>
