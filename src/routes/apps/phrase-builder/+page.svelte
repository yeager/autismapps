<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { translateKeywords } from '$lib/arasaac/sv-lookup';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';

  interface PictoWord { word: string; url: string; id: number; }

  // Fitzgerald Key colors
  const COLORS = { subject: '#F1C40F', verb: '#27AE60', object: '#E67E22', desc: '#3498DB' };

  const SUBJECTS_EN = ['I', 'you', 'he', 'she', 'we', 'they', 'mom', 'dad', 'teacher', 'friend'];
  const VERBS_EN = ['want', 'eat', 'drink', 'go', 'play', 'read', 'like', 'see', 'hear', 'give', 'make', 'have'];
  const OBJECTS_EN = ['water', 'food', 'ball', 'book', 'car', 'apple', 'milk', 'cookie', 'home', 'school', 'music', 'puzzle'];

  let subjects = $state<PictoWord[]>([]);
  let verbs = $state<PictoWord[]>([]);
  let objects = $state<PictoWord[]>([]);
  let loading = $state(true);

  let selectedSubject = $state<PictoWord | null>(null);
  let selectedVerb = $state<PictoWord | null>(null);
  let selectedObject = $state<PictoWord | null>(null);
  let favorites = $state<string[]>([]);

  const sentence = $derived(
    [selectedSubject?.word, selectedVerb?.word, selectedObject?.word].filter(Boolean).join(' ')
  );

  $effect(() => { loadAll(); });

  async function loadAll() {
    loading = true;
    const lang = get(locale);
    const load = async (enWords: string[]) => {
      const translated = lang === 'sv' ? await translateKeywords(enWords) : null;
      return Promise.all(
        enWords.map(async (w, i) => {
          const res = await searchPictograms(w, 'en');
          const displayWord = translated ? translated[i].sv : w;
          return { word: displayWord, url: res[0]?.url || '', id: res[0]?.id || 0 };
        })
      );
    };
    [subjects, verbs, objects] = await Promise.all([load(SUBJECTS_EN), load(VERBS_EN), load(OBJECTS_EN)]);
    loading = false;
  }

  function speakSentence() {
    if (sentence) speak(sentence);
  }

  function saveFavorite() {
    if (sentence && !favorites.includes(sentence)) {
      favorites = [...favorites, sentence];
    }
  }

  function speakFav(fav: string) { speak(fav); }

  function clearSelection() {
    selectedSubject = null;
    selectedVerb = null;
    selectedObject = null;
  }
</script>

<WelcomeDialog appId="phrase-builder" titleKey="app.phrase_builder" purposeKey="welcome.phraseBuilder.purpose" howKey="welcome.phraseBuilder.how" goalKey="welcome.phraseBuilder.goal" icon="📝" />

<div class="phrase-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('phrase.title')}</h1>
  </header>

  <!-- Sentence preview -->
  <div class="sentence-preview">
    <div class="preview-slots">
      <div class="slot" style="border-color: {COLORS.subject}">
        {#if selectedSubject}
          <img src={selectedSubject.url} alt={selectedSubject.word} width="48" height="48" />
          <span>{selectedSubject.word}</span>
        {:else}
          <span class="slot-hint">{$t('phrase.who')}</span>
        {/if}
      </div>
      <div class="slot" style="border-color: {COLORS.verb}">
        {#if selectedVerb}
          <img src={selectedVerb.url} alt={selectedVerb.word} width="48" height="48" />
          <span>{selectedVerb.word}</span>
        {:else}
          <span class="slot-hint">{$t('phrase.does')}</span>
        {/if}
      </div>
      <div class="slot" style="border-color: {COLORS.object}">
        {#if selectedObject}
          <img src={selectedObject.url} alt={selectedObject.word} width="48" height="48" />
          <span>{selectedObject.word}</span>
        {:else}
          <span class="slot-hint">{$t('phrase.what')}</span>
        {/if}
      </div>
    </div>
    <div class="preview-actions">
      <button class="act-btn speak" onclick={speakSentence} disabled={!sentence}>🔊</button>
      <button class="act-btn" onclick={saveFavorite} disabled={!sentence}>⭐</button>
      <button class="act-btn" onclick={clearSelection}>🗑️</button>
    </div>
  </div>

  {#if loading}
    <div class="loading"><div class="spinner"></div></div>
  {:else}
    <div class="columns">
      <!-- Subject column -->
      <div class="column" style="--col: {COLORS.subject}">
        <h3 class="col-header">{$t('phrase.subject')}</h3>
        <div class="col-items">
          {#each subjects as s}
            <button class="col-item" class:active={selectedSubject?.word === s.word}
              onclick={() => { selectedSubject = s; speak(s.word); }}>
              {#if s.url}<img src={s.url} alt={s.word} width="44" height="44" />{/if}
              <span>{s.word}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Verb column -->
      <div class="column" style="--col: {COLORS.verb}">
        <h3 class="col-header">{$t('phrase.verb')}</h3>
        <div class="col-items">
          {#each verbs as v}
            <button class="col-item" class:active={selectedVerb?.word === v.word}
              onclick={() => { selectedVerb = v; speak(v.word); }}>
              {#if v.url}<img src={v.url} alt={v.word} width="44" height="44" />{/if}
              <span>{v.word}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Object column -->
      <div class="column" style="--col: {COLORS.object}">
        <h3 class="col-header">{$t('phrase.object')}</h3>
        <div class="col-items">
          {#each objects as o}
            <button class="col-item" class:active={selectedObject?.word === o.word}
              onclick={() => { selectedObject = o; speak(o.word); }}>
              {#if o.url}<img src={o.url} alt={o.word} width="44" height="44" />{/if}
              <span>{o.word}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Favorites -->
  {#if favorites.length > 0}
    <div class="favorites">
      <h3>⭐ {$t('phrase.favorites')}</h3>
      <div class="fav-list">
        {#each favorites as fav}
          <button class="fav-chip" onclick={() => speakFav(fav)}>{fav}</button>
        {/each}
      </div>
    </div>
  {/if}

  <footer class="credit">
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
    · Uses <a href="https://en.wikipedia.org/wiki/Fitzgerald_Key" target="_blank" rel="noopener">Fitzgerald Key</a> color coding
  </footer>
</div>

<style>
  .phrase-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; }

  .sentence-preview {
    display: flex; align-items: center; gap: 12px; padding: 14px 16px;
    background: var(--bg-card); border-bottom: 2px solid var(--border);
  }
  .preview-slots { display: flex; gap: 8px; flex: 1; }
  .slot {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 10px; border: 3px dashed; border-radius: var(--radius); min-height: 80px; justify-content: center;
  }
  .slot img { border-radius: 6px; }
  .slot span { font-size: 0.8em; font-weight: 600; }
  .slot-hint { font-size: 0.8em; color: var(--text-muted); font-style: italic; }
  .preview-actions { display: flex; flex-direction: column; gap: 4px; }
  .act-btn {
    width: 44px; height: 44px; border-radius: var(--radius-sm); font-size: 1.1em;
    display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--bg);
  }
  .act-btn:disabled { opacity: 0.3; }
  .act-btn.speak { background: #27AE60; color: white; border-color: #27AE60; }

  .columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; flex: 1; padding: 8px; }
  .column { background: color-mix(in srgb, var(--col) 5%, transparent); border-radius: var(--radius); padding: 8px; }
  .col-header {
    text-align: center; font-size: 0.8em; font-weight: 700; padding: 6px;
    color: var(--col); text-transform: uppercase; letter-spacing: 0.05em;
  }
  .col-items { display: flex; flex-direction: column; gap: 4px; }
  .col-item {
    display: flex; align-items: center; gap: 6px; padding: 8px;
    background: var(--bg-card); border: 2px solid transparent; border-radius: 8px;
    font-size: 0.8em; font-weight: 500; transition: all 0.15s; border-left: 3px solid var(--col);
  }
  .col-item:hover { border-color: var(--col); }
  .col-item.active { background: color-mix(in srgb, var(--col) 15%, transparent); border-color: var(--col); }
  .col-item img { border-radius: 4px; flex-shrink: 0; }

  .favorites { padding: 12px 16px; border-top: 1px solid var(--border); }
  .favorites h3 { font-size: 0.9em; margin-bottom: 8px; }
  .fav-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .fav-chip {
    padding: 6px 14px; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 100px; font-size: 0.85em; font-weight: 500; transition: background 0.15s;
  }
  .fav-chip:hover { background: var(--bg-hover); }

  .loading { flex: 1; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: #3498DB; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }
</style>
