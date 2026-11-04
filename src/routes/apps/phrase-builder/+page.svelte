<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { awardStar, GoldStarBurst } from '$lib/rewards';
  import { activeProfileId } from '$lib/stores/profile';

  interface PictoWord { word: string; url: string; id: number; }

  // Fitzgerald Key colors
  const COLORS = { subject: '#F1C40F', verb: '#27AE60', object: '#E67E22', desc: '#3498DB' };

  // English keys for ARASAAC pictogram search + i18n keys for display labels
  const SUBJECT_KEYS = ['I', 'you', 'he', 'she', 'we', 'they', 'mom', 'dad', 'teacher', 'friend'];
  const VERB_KEYS = ['want', 'eat', 'drink', 'go', 'play', 'read', 'like', 'see', 'hear', 'give', 'make', 'have'];
  const OBJECT_KEYS = ['water', 'food', 'ball', 'book', 'car', 'apple', 'milk', 'cookie', 'home', 'school', 'music', 'puzzle'];

  let subjects = $state<PictoWord[]>([]);
  let verbs = $state<PictoWord[]>([]);
  let objects = $state<PictoWord[]>([]);
  let loading = $state(true);

  let selectedSubject = $state<PictoWord | null>(null);
  let selectedVerb = $state<PictoWord | null>(null);
  let selectedObject = $state<PictoWord | null>(null);
  let favorites = $state<string[]>([]);
  let customPhrase = $state('');
  let favoritesProfileKey = $state('');
  let favoritesReady = $state(false);
  let showStar = $state(false);
  let lastCompleteSentence = $state('');

  const sentence = $derived(
    [selectedSubject?.word, selectedVerb?.word, selectedObject?.word].filter(Boolean).join(' ')
  );

  const phraseBankKey = $derived(`autismapps:phrase-bank:v1:${$activeProfileId ?? 'default'}:${$locale}`);

  $effect(() => {
    if (!browser) return;
    const key = phraseBankKey;
    favoritesReady = false;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) || '[]');
      favorites = Array.isArray(stored)
        ? stored.filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0).slice(0, 100)
        : [];
    } catch {
      favorites = [];
    }
    favoritesProfileKey = key;
    favoritesReady = true;
  });

  $effect(() => {
    if (browser && favoritesReady && favoritesProfileKey === phraseBankKey) {
      try {
        localStorage.setItem(favoritesProfileKey, JSON.stringify(favorites));
      } catch {
        // Keep the phrase bank usable for the current visit if storage is unavailable.
      }
    }
  });

  $effect(() => { loadAll(); });

  $effect(() => {
    // Award star when a complete phrase is built
    if (selectedSubject && selectedVerb && selectedObject && sentence && sentence !== lastCompleteSentence) {
      lastCompleteSentence = sentence;
      awardStarAsync();
    }
  });

  async function loadAll() {
    loading = true;
    const load = async (keys: string[]) => {
      return Promise.all(
        keys.map(async (key) => {
          const res = await searchPictograms(key, 'en');
          const displayWord = $t(`phrase.word.${key}`);
          return { word: displayWord, url: res[0]?.url || '', id: res[0]?.id || 0 };
        })
      );
    };
    [subjects, verbs, objects] = await Promise.all([load(SUBJECT_KEYS), load(VERB_KEYS), load(OBJECT_KEYS)]);
    loading = false;
  }

  function speakSentence() {
    if (sentence) speak(sentence);
  }

  function saveFavorite() {
    addFavorite(sentence);
  }

  function speakFav(fav: string) { speak(fav); }

  function addCustomPhrase() {
    const phrase = customPhrase.trim().replace(/\s+/g, ' ').slice(0, 120);
    if (!phrase) return;
    addFavorite(phrase);
    customPhrase = '';
  }

  function addFavorite(phrase: string) {
    const normalized = phrase.trim().replace(/\s+/g, ' ');
    if (!normalized || favorites.some((favorite) => favorite.toLocaleLowerCase() === normalized.toLocaleLowerCase())) return;
    favorites = [...favorites, normalized].slice(-100);
  }

  function removeFavorite(phrase: string) {
    favorites = favorites.filter((favorite) => favorite !== phrase);
  }

  function clearSelection() {
    selectedSubject = null;
    selectedVerb = null;
    selectedObject = null;
  }

  async function awardStarAsync() {
    await awardStar('phrase-builder', 'rewards.star.completed');
    showStar = true;
    setTimeout(() => showStar = false, 2000);
  }
</script>

<WelcomeDialog appId="phrase-builder" titleKey="app.phrase_builder" purposeKey="welcome.phraseBuilder.purpose" howKey="welcome.phraseBuilder.how" goalKey="welcome.phraseBuilder.goal" icon="📝" />

<GoldStarBurst show={showStar} />

<div class="phrase-page">
  <div class="page-title">

    <h1>{$t('phrase.title')}</h1>

  </div>

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
  <section class="favorites" aria-labelledby="phrase-bank-title">
    <div class="favorites-heading">
      <h2 id="phrase-bank-title">⭐ {$t('phrase.favorites')}</h2>
      <form class="custom-phrase-form" onsubmit={(event) => { event.preventDefault(); addCustomPhrase(); }}>
        <label class="sr-only" for="custom-phrase">{$t('phrase.custom_placeholder')}</label>
        <input id="custom-phrase" bind:value={customPhrase} maxlength="120" placeholder={$t('phrase.custom_placeholder')} />
        <button type="submit" disabled={!customPhrase.trim()}>{$t('phrase.add_custom')}</button>
      </form>
    </div>
    {#if favorites.length > 0}
      <div class="fav-list">
        {#each favorites as fav (fav)}
          <div class="fav-item">
            <button class="fav-chip" onclick={() => speakFav(fav)} aria-label={`${$t('phrase.speak_favorite')}: ${fav}`}>🔊 {fav}</button>
            <button class="remove-favorite" onclick={() => removeFavorite(fav)} aria-label={`${$t('phrase.remove_favorite')}: ${fav}`}>×</button>
          </div>
        {/each}
      </div>
    {:else}
      <p class="favorites-empty">{$t('phrase.favorites_empty')}</p>
    {/if}
  </section>

  <footer class="credit">
    {$t('app.credit.pictograms')}: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
    · Uses <a href="https://www.communicationcommunity.com/fitzgerald-key-for-aac/" target="_blank" rel="noopener">Fitzgerald Key</a> color coding
  </footer>
</div>

<style>
  .phrase-page { display: flex; flex-direction: column; min-height: 100dvh; }

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

  .favorites { padding: 14px 16px; border-top: 1px solid var(--border); }
  .favorites-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 10px; }
  .favorites h2 { font-size: 1em; margin: 0; }
  .custom-phrase-form { display: flex; gap: 8px; min-width: min(100%, 440px); }
  .custom-phrase-form input { min-width: 0; flex: 1; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--text); font: inherit; }
  .custom-phrase-form button { padding: 8px 12px; border: 1px solid var(--accent); border-radius: var(--radius-sm); background: var(--accent); color: white; font: inherit; font-weight: 650; }
  .custom-phrase-form button:disabled { opacity: .5; }
  .fav-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .fav-item { display: inline-flex; align-items: center; border: 1px solid var(--border); border-radius: 999px; background: var(--bg-card); overflow: hidden; }
  .fav-chip {
    min-height: 42px; padding: 6px 12px; background: transparent; border: 0;
    font-size: 0.85em; font-weight: 500; transition: background 0.15s;
  }
  .fav-chip:hover { background: var(--bg-hover); }
  .remove-favorite { width: 38px; min-height: 42px; border: 0; border-left: 1px solid var(--border); background: transparent; color: var(--text-muted); font: inherit; font-size: 1.2em; }
  .remove-favorite:hover { color: var(--text); background: var(--bg-hover); }
  .favorites-empty { margin: 0; color: var(--text-muted); font-size: .9em; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

  @media (max-width: 620px) {
    .favorites-heading { align-items: stretch; flex-direction: column; }
    .custom-phrase-form { min-width: 0; }
  }

  .loading { flex: 1; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: #3498DB; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }
</style>
