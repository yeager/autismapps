<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms, getPictogramUrl } from '$lib/arasaac';

  interface WordKey { key: string; en: string; }
  interface ThemeBoard {
    id: string;
    label: string;
    emoji: string;
    color: string;
    words: WordKey[];
  }

  const THEMES: ThemeBoard[] = [
    { id: 'school', label: 'situation.school', emoji: '🏫', color: '#3498DB', words: [
      { key: 'teacher', en: 'teacher' }, { key: 'book', en: 'book' }, { key: 'pencil', en: 'pencil' }, { key: 'desk', en: 'desk' }, { key: 'friend', en: 'friend' }, { key: 'play', en: 'play' }, { key: 'read', en: 'read' }, { key: 'write', en: 'write' }, { key: 'listen', en: 'listen' }, { key: 'draw', en: 'draw' }, { key: 'count', en: 'count' }, { key: 'sing', en: 'sing' }
    ]},
    { id: 'home', label: 'situation.home', emoji: '🏠', color: '#27AE60', words: [
      { key: 'bed', en: 'bed' }, { key: 'table', en: 'table' }, { key: 'chair', en: 'chair' }, { key: 'door', en: 'door' }, { key: 'window', en: 'window' }, { key: 'television', en: 'television' }, { key: 'kitchen', en: 'kitchen' }, { key: 'bathroom', en: 'bathroom' }, { key: 'sleep', en: 'sleep' }, { key: 'eat', en: 'eat' }, { key: 'clean', en: 'clean' }, { key: 'cook', en: 'cook' }
    ]},
    { id: 'food', label: 'situation.food', emoji: '🍎', color: '#E67E22', words: [
      { key: 'water', en: 'water' }, { key: 'milk', en: 'milk' }, { key: 'bread', en: 'bread' }, { key: 'apple', en: 'apple' }, { key: 'banana', en: 'banana' }, { key: 'rice', en: 'rice' }, { key: 'chicken', en: 'chicken' }, { key: 'soup', en: 'soup' }, { key: 'hungry', en: 'hungry' }, { key: 'thirsty', en: 'thirsty' }, { key: 'plate', en: 'plate' }, { key: 'spoon', en: 'spoon' }
    ]},
    { id: 'hygiene', label: 'situation.hygiene', emoji: '🚿', color: '#9B59B6', words: [
      { key: 'soap', en: 'soap' }, { key: 'toothbrush', en: 'toothbrush' }, { key: 'towel', en: 'towel' }, { key: 'shower', en: 'shower' }, { key: 'toilet', en: 'toilet' }, { key: 'wash_hands', en: 'wash hands' }, { key: 'comb', en: 'comb' }, { key: 'mirror', en: 'mirror' }, { key: 'clean', en: 'clean' }, { key: 'dry', en: 'dry' }, { key: 'shampoo', en: 'shampoo' }, { key: 'tissue', en: 'tissue' }
    ]},
    { id: 'doctor', label: 'situation.doctor', emoji: '🏥', color: '#E74C3C', words: [
      { key: 'doctor', en: 'doctor' }, { key: 'medicine', en: 'medicine' }, { key: 'pain', en: 'pain' }, { key: 'stomach', en: 'stomach' }, { key: 'head', en: 'head' }, { key: 'arm', en: 'arm' }, { key: 'leg', en: 'leg' }, { key: 'thermometer', en: 'thermometer' }, { key: 'bandage', en: 'bandage' }, { key: 'wait', en: 'wait' }, { key: 'sick', en: 'sick' }, { key: 'better', en: 'better' }
    ]},
    { id: 'playground', label: 'situation.playground', emoji: '🛝', color: '#F1C40F', words: [
      { key: 'swing', en: 'swing' }, { key: 'slide', en: 'slide' }, { key: 'ball', en: 'ball' }, { key: 'run', en: 'run' }, { key: 'jump', en: 'jump' }, { key: 'climb', en: 'climb' }, { key: 'sand', en: 'sand' }, { key: 'friend', en: 'friend' }, { key: 'turn', en: 'turn' }, { key: 'share', en: 'share' }, { key: 'push', en: 'push' }, { key: 'catch', en: 'catch' }
    ]},
    { id: 'transport', label: 'situation.transport', emoji: '🚌', color: '#1ABC9C', words: [
      { key: 'car', en: 'car' }, { key: 'bus', en: 'bus' }, { key: 'bicycle', en: 'bicycle' }, { key: 'train', en: 'train' }, { key: 'walk', en: 'walk' }, { key: 'road', en: 'road' }, { key: 'stop', en: 'stop' }, { key: 'go', en: 'go' }, { key: 'seat_belt', en: 'seat belt' }, { key: 'ticket', en: 'ticket' }, { key: 'fast', en: 'fast' }, { key: 'slow', en: 'slow' }
    ]},
    { id: 'feelings', label: 'situation.feelings', emoji: '😊', color: '#E91E63', words: [
      { key: 'happy', en: 'happy' }, { key: 'sad', en: 'sad' }, { key: 'angry', en: 'angry' }, { key: 'scared', en: 'scared' }, { key: 'tired', en: 'tired' }, { key: 'excited', en: 'excited' }, { key: 'calm', en: 'calm' }, { key: 'worried', en: 'worried' }, { key: 'surprised', en: 'surprised' }, { key: 'proud', en: 'proud' }, { key: 'bored', en: 'bored' }, { key: 'shy', en: 'shy' }
    ]}
  ];

  const CORE_KEYS: WordKey[] = [
    { key: 'yes', en: 'yes' }, { key: 'no', en: 'no' }, { key: 'more', en: 'more' },
    { key: 'stop', en: 'stop' }, { key: 'help', en: 'help' }, { key: 'i_want', en: 'I want' }
  ];

  let activeTheme = $state<ThemeBoard | null>(null);
  let boardPictograms = $state<{ word: string; id: number; url: string }[]>([]);
  let corePictograms = $state<{ word: string; id: number; url: string }[]>([]);
  let loading = $state(false);

  async function selectTheme(theme: ThemeBoard) {
    activeTheme = theme;
    loading = true;
    speak($t(theme.label));

    const results = await Promise.all(
      theme.words.map(async (item) => {
        const res = await searchPictograms(item.en, 'en');
        const displayWord = $t(`sit.${item.key}`);
        return res[0] ? { word: displayWord, id: res[0].id, url: res[0].url } : { word: displayWord, id: 0, url: '' };
      })
    );
    boardPictograms = results;
    if (corePictograms.length === 0) {
      corePictograms = await Promise.all(
        CORE_KEYS.map(async (item) => {
          const res = await searchPictograms(item.en, 'en');
          const displayWord = $t(`sit.${item.key}`);
          return res[0] ? { word: displayWord, id: res[0].id, url: res[0].url } : { word: displayWord, id: 0, url: '' };
        })
      );
    }
    loading = false;
  }

  function speakWord(word: string) {
    speak(word);
  }
</script>

<WelcomeDialog appId="situation-cards" titleKey="app.situation_cards" purposeKey="welcome.situationCards.purpose" howKey="welcome.situationCards.how" goalKey="welcome.situationCards.goal" icon="🃏" />

<div class="situation-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => activeTheme ? (activeTheme = null) : goto(base + '/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{activeTheme ? $t(activeTheme.label) : $t('situation.title')}</h1>
  </header>

  {#if !activeTheme}
    <div class="themes-grid">
      {#each THEMES as theme}
        <button class="theme-card" style="--tc: {theme.color}" onclick={() => selectTheme(theme)} onfocus={() => speak($t(theme.label))}>
          <span class="theme-emoji">{theme.emoji}</span>
          <span class="theme-name">{$t(theme.label)}</span>
        </button>
      {/each}
    </div>
  {:else}
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>{$t('situation.loading')}</p>
      </div>
    {:else}
      <div class="board-grid">
        {#each boardPictograms as item}
          <button class="pictogram-card" onclick={() => speakWord(item.word)} style="--tc: {activeTheme.color}">
            {#if item.url}
              <img src={item.url} alt={item.word} width="80" height="80" loading="lazy" />
            {:else}
              <span class="fallback-emoji">❓</span>
            {/if}
            <span class="picto-label">{item.word}</span>
          </button>
        {/each}
      </div>

      <div class="core-bar">
        <span class="core-label">{$t('situation.core_words')}</span>
        <div class="core-words">
          {#each corePictograms as item}
            <button class="core-btn" onclick={() => speakWord(item.word)}>
              {#if item.url}
                <img src={item.url} alt={item.word} width="36" height="36" />
              {/if}
              <span>{item.word}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  {/if}

  <footer class="credit">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0</footer>
</div>

<style>
  .situation-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; }

  .themes-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px; padding: 20px; flex: 1;
  }
  .theme-card {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 28px 16px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); transition: all 0.2s; min-height: 140px; justify-content: center;
  }
  .theme-card:hover { border-color: var(--tc); transform: translateY(-2px); box-shadow: 0 4px 16px color-mix(in srgb, var(--tc) 20%, transparent); }
  .theme-emoji { font-size: 2.5em; }
  .theme-name { font-weight: 600; }

  .board-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px; padding: 16px; flex: 1;
  }
  .pictogram-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 12px 8px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); transition: all 0.15s;
  }
  .pictogram-card:hover { border-color: var(--tc); transform: scale(1.05); }
  .pictogram-card:active { transform: scale(0.95); }
  .pictogram-card img { border-radius: 8px; object-fit: contain; }
  .picto-label { font-size: 0.8em; font-weight: 600; text-align: center; }
  .fallback-emoji { font-size: 2em; }

  .core-bar {
    position: sticky; bottom: 0; background: var(--bg); border-top: 2px solid var(--border);
    padding: 10px 16px;
  }
  .core-label { font-size: 0.7em; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .core-words { display: flex; gap: 8px; overflow-x: auto; padding: 6px 0; }
  .core-btn {
    display: flex; align-items: center; gap: 4px; padding: 8px 14px;
    background: #3498DB; color: white; border-radius: 100px; font-weight: 600;
    font-size: 0.85em; white-space: nowrap; flex-shrink: 0;
  }
  .core-btn img { border-radius: 4px; }
  .core-btn:active { transform: scale(0.95); }

  .loading { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: #3498DB; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .credit { text-align: center; padding: 12px; font-size: 0.75em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
</style>
