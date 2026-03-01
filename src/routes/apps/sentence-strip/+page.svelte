<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms, getPictogramUrl } from '$lib/arasaac';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  // Fitzgerald Key colors
  const FK = {
    starter: '#9B59B6',
    subject: '#F1C40F',
    verb: '#27AE60',
    object: '#E67E22',
    desc: '#3498DB',
  };

  const STARTERS_EN = [
    { text: 'I want', key: 'sentenceStrip.iWant', phase: 4 },
    { text: 'I see', key: 'sentenceStrip.iSee', phase: 6 },
    { text: 'I hear', key: 'sentenceStrip.iHear', phase: 6 },
    { text: 'I feel', key: 'sentenceStrip.iFeel', phase: 6 },
    { text: 'I have', key: 'sentenceStrip.iHave', phase: 6 },
    { text: 'I like', key: 'sentenceStrip.iLike', phase: 6 },
  ];

  const CATEGORIES = [
    { id: 'food', icon: '🍎', words: ['apple', 'banana', 'bread', 'milk', 'water', 'cookie', 'juice', 'sandwich'] },
    { id: 'toys', icon: '🧸', words: ['ball', 'car', 'doll', 'puzzle', 'blocks', 'book', 'teddy bear', 'crayons'] },
    { id: 'actions', icon: '🏃', words: ['play', 'run', 'swim', 'draw', 'sing', 'dance', 'read', 'sleep'] },
    { id: 'feelings', icon: '😊', words: ['happy', 'sad', 'angry', 'tired', 'scared', 'excited', 'calm', 'hungry'] },
    { id: 'places', icon: '🏠', words: ['home', 'school', 'park', 'store', 'bathroom', 'kitchen', 'outside', 'bed'] },
  ];

  interface StripItem {
    text: string;
    pictogramUrl: string;
    color: string;
    type: 'starter' | 'word';
  }

  interface PictoItem {
    word: string;
    wordSv: string;
    url: string;
  }

  let strip = $state<StripItem[]>([]);
  let selectedCategory = $state<typeof CATEGORIES[0] | null>(null);
  let categoryPictos = $state<PictoItem[]>([]);
  let loadingPictos = $state(false);
  let savedStrips = $state<StripItem[][]>(loadSavedStrips());
  let currentPhase = $state<number>(6);

  function loadSavedStrips(): StripItem[][] {
    try {
      const data = localStorage.getItem('sentence-strips');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  function saveStrips() {
    localStorage.setItem('sentence-strips', JSON.stringify(savedStrips));
  }

  async function loadCategory(cat: typeof CATEGORIES[0]) {
    selectedCategory = cat;
    loadingPictos = true;
    categoryPictos = await Promise.all(
      cat.words.map(async (w) => {
        const results = await searchPictograms(w, 'en');
        const svResults = await searchPictograms(w, 'sv');
        return {
          word: w,
          wordSv: svResults?.[0]?.keyword || w,
          url: results[0]?.url || '',
        };
      })
    );
    loadingPictos = false;
  }

  function addStarter(starter: typeof STARTERS_EN[0]) {
    const label = $t(starter.key);
    strip = [...strip, { text: label, pictogramUrl: '', color: FK.starter, type: 'starter' }];
    speak(label);
  }

  function addWord(picto: PictoItem) {
    const lang = get(locale);
    const label = lang === 'sv' ? picto.wordSv : picto.word;
    const color = selectedCategory?.id === 'actions' ? FK.verb
      : selectedCategory?.id === 'feelings' ? FK.desc
      : FK.object;
    strip = [...strip, { text: label, pictogramUrl: picto.url, color, type: 'word' }];
    speak(label);
  }

  function removeFromStrip(index: number) {
    strip = strip.filter((_, i) => i !== index);
  }

  function speakStrip() {
    if (strip.length > 0) speak(strip.map(s => s.text).join(' '));
  }

  function clearStrip() { strip = []; }

  function saveCurrentStrip() {
    if (strip.length > 0) {
      savedStrips = [...savedStrips, [...strip]];
      saveStrips();
    }
  }

  function deleteSaved(index: number) {
    savedStrips = savedStrips.filter((_, i) => i !== index);
    saveStrips();
  }

  function loadSaved(saved: StripItem[]) {
    strip = [...saved];
  }

  const phaseStarters = $derived(STARTERS_EN.filter(s => s.phase <= currentPhase));
</script>

<WelcomeDialog appId="sentence-strip" titleKey="app.sentence_strip" purposeKey="welcome.sentenceStrip.purpose" howKey="welcome.sentenceStrip.how" goalKey="welcome.sentenceStrip.goal" icon="📋" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)} aria-label={$t('app.back')}>←</button>
    <h1>📋 {$t('sentenceStrip.title')}</h1>
    <div class="phase-select">
      <label>{$t('sentenceStrip.phase')}:</label>
      <select bind:value={currentPhase}>
        <option value={4}>IV</option>
        <option value={5}>V</option>
        <option value={6}>VI</option>
      </select>
    </div>
  </header>

  <main class="cnt">
    <section class="strip-area" aria-label={$t('sentenceStrip.strip')}>
      <div class="strip" role="list">
        {#if strip.length === 0}
          <p class="strip-hint">{$t('sentenceStrip.hint')}</p>
        {:else}
          {#each strip as item, i (i)}
            <button class="strip-item" style="border-color: {item.color}; background: {item.color}15" onclick={() => removeFromStrip(i)} aria-label="{item.text}">
              {#if item.pictogramUrl}
                <img src={item.pictogramUrl} alt={item.text} width="56" height="56" />
              {/if}
              <span class="strip-label" style="color: {item.color}">{item.text}</span>
            </button>
          {/each}
        {/if}
      </div>
      {#if strip.length > 0}
        <div class="strip-actions">
          <button class="action-btn speak" onclick={speakStrip}>🔊 {$t('sentenceStrip.speak')}</button>
          <button class="action-btn save" onclick={saveCurrentStrip}>💾 {$t('sentenceStrip.save')}</button>
          <button class="action-btn clear" onclick={clearStrip}>✕</button>
        </div>
      {/if}
    </section>

    <section class="starters">
      <h2>{$t('sentenceStrip.starters')}</h2>
      <div class="starter-grid">
        {#each phaseStarters as starter}
          <button class="starter-btn" style="background: {FK.starter}20; border-color: {FK.starter}" onclick={() => addStarter(starter)}>
            <span class="starter-text">{$t(starter.key)}</span>
            <span class="starter-phase">Fas {starter.phase}</span>
          </button>
        {/each}
      </div>
    </section>

    <section class="categories">
      <h2>{$t('sentenceStrip.pickWord')}</h2>
      <div class="cat-tabs">
        {#each CATEGORIES as cat}
          <button class="cat-tab" class:active={selectedCategory?.id === cat.id} onclick={() => loadCategory(cat)}>
            <span class="cat-icon">{cat.icon}</span>
            <span class="cat-name">{$t(`sentenceStrip.cat.${cat.id}`)}</span>
          </button>
        {/each}
      </div>

      {#if loadingPictos}
        <div class="loading">⏳ {$t('sentenceStrip.loading')}</div>
      {:else if categoryPictos.length > 0}
        <div class="word-grid">
          {#each categoryPictos as picto}
            <button class="word-btn" onclick={() => addWord(picto)}>
              {#if picto.url}
                <img src={picto.url} alt={picto.word} width="64" height="64" loading="lazy" />
              {/if}
              <span>{get(locale) === 'sv' ? picto.wordSv : picto.word}</span>
            </button>
          {/each}
        </div>
      {/if}
    </section>

    {#if savedStrips.length > 0}
      <section class="saved">
        <h2>{$t('sentenceStrip.saved')}</h2>
        {#each savedStrips as saved, i}
          <div class="saved-strip">
            <button class="saved-content" onclick={() => loadSaved(saved)}>
              {#each saved as item}
                <span class="saved-item" style="color: {item.color}">{item.text}</span>
              {/each}
            </button>
            <button class="saved-speak" onclick={() => speak(saved.map(s => s.text).join(' '))}>🔊</button>
            <button class="saved-delete" onclick={() => deleteSaved(i)}>🗑️</button>
          </div>
        {/each}
      </section>
    {/if}
  </main>

  <footer class="cr"><p>PECS® (Frost & Bondy) · ARASAAC (CC BY-NC-SA) · Autismappar</p></footer>
</div>

<style>
  .app { display: flex; flex-direction: column; min-height: 100dvh; background: var(--bg, #f5f5f5); color: var(--text, #1a1a2e); }
  .hdr { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-card, #fff); border-bottom: 1px solid var(--border, #e0e0e0); flex-wrap: wrap; }
  .back { background: none; border: none; font-size: 1.5em; cursor: pointer; padding: 4px 8px; }
  h1 { font-size: 1.3em; margin: 0; flex: 1; }
  h2 { font-size: 1em; margin: 0 0 8px; font-weight: 600; }
  .cnt { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto; width: 100%; }
  .cr { text-align: center; padding: 12px; font-size: .75em; opacity: .5; }
  .phase-select { display: flex; align-items: center; gap: 6px; font-size: .85em; }
  .phase-select select { padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border, #ccc); }
  .strip-area { background: var(--bg-card, #fff); border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .strip { display: flex; gap: 8px; overflow-x: auto; padding: 8px 0; min-height: 90px; align-items: center; }
  .strip-hint { color: #888; font-style: italic; text-align: center; width: 100%; }
  .strip-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; border: 3px solid; border-radius: 10px; background: white; cursor: pointer; transition: all .15s ease; min-width: 70px; flex-shrink: 0; }
  .strip-item:hover { transform: scale(0.95); opacity: .7; }
  .strip-item img { border-radius: 4px; }
  .strip-label { font-size: .8em; font-weight: 600; text-align: center; }
  .strip-actions { display: flex; gap: 8px; margin-top: 8px; justify-content: center; }
  .action-btn { padding: 8px 16px; border: 2px solid; border-radius: 10px; font-weight: 600; font-size: .85em; cursor: pointer; color: white; }
  .action-btn.speak { background: #27AE60; border-color: #27AE60; }
  .action-btn.save { background: #3498DB; border-color: #3498DB; }
  .action-btn.clear { background: #E74C3C; border-color: #E74C3C; }
  .starter-grid { display: flex; gap: 8px; flex-wrap: wrap; }
  .starter-btn { padding: 10px 16px; border: 2px solid; border-radius: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .starter-btn:hover { transform: scale(1.05); }
  .starter-text { font-weight: 700; font-size: 1em; }
  .starter-phase { font-size: .65em; opacity: .6; }
  .cat-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
  .cat-tab { padding: 8px 14px; border: 2px solid var(--border, #ddd); border-radius: 10px; cursor: pointer; background: var(--bg-card, #fff); display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
  .cat-tab.active { border-color: #E67E22; background: #E67E2215; }
  .cat-icon { font-size: 1.3em; }
  .cat-name { font-size: .75em; font-weight: 600; }
  .word-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 8px; margin-top: 8px; }
  .word-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border: 2px solid var(--border, #ddd); border-radius: 10px; background: var(--bg-card, #fff); cursor: pointer; }
  .word-btn:hover { border-color: #E67E22; transform: scale(1.03); }
  .word-btn img { border-radius: 4px; }
  .word-btn span { font-size: .8em; font-weight: 600; text-align: center; }
  .loading { text-align: center; padding: 20px; }
  .saved-strip { display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--bg-card, #fff); border-radius: 10px; margin-bottom: 6px; border: 1px solid var(--border, #eee); }
  .saved-content { display: flex; gap: 6px; flex: 1; flex-wrap: wrap; background: none; border: none; cursor: pointer; padding: 4px; }
  .saved-item { font-weight: 600; font-size: .85em; }
  .saved-speak, .saved-delete { background: none; border: none; cursor: pointer; font-size: 1.1em; padding: 4px; }
  @media (prefers-color-scheme: dark) {
    .app { --bg: #1a1a2e; --text: #e0e0e0; --bg-card: #16213e; --border: #334155; }
    .strip-item { background: #16213e; }
  }
</style>
