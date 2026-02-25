<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { translateKeywords } from '$lib/arasaac/sv-lookup';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';

  interface MatItem { word: string; id: number; url: string; zone: 'positive' | 'neutral' | 'negative' | 'unplaced'; }

  const TOPICS = [
    { id: 'food', label: 'mat.topic.food', emoji: '🍎', words: ['pizza', 'vegetables', 'fruit', 'candy', 'milk', 'water', 'bread', 'soup', 'rice', 'chicken'] },
    { id: 'school', label: 'mat.topic.school', emoji: '🏫', words: ['reading', 'math', 'drawing', 'music', 'gym', 'recess', 'writing', 'computer', 'homework', 'group work'] },
    { id: 'activities', label: 'mat.topic.activities', emoji: '⚽', words: ['swimming', 'football', 'drawing', 'music', 'dancing', 'cooking', 'reading', 'gaming', 'walking', 'cycling'] },
    { id: 'feelings', label: 'mat.topic.feelings', emoji: '💭', words: ['school', 'home', 'friends', 'family', 'bedtime', 'morning', 'eating', 'homework', 'playing', 'shopping'] }
  ];

  let activeTopic = $state<typeof TOPICS[0] | null>(null);
  let items = $state<MatItem[]>([]);
  let loading = $state(false);
  let dragItem = $state<MatItem | null>(null);
  let sessions = $state<{ topic: string; date: string; items: MatItem[] }[]>([]);

  async function selectTopic(topic: typeof TOPICS[0]) {
    activeTopic = topic;
    loading = true;
    speak($t(topic.label));
    const lang = get(locale);
    const translated = lang === 'sv' ? await translateKeywords(topic.words) : null;
    const results = await Promise.all(
      topic.words.map(async (w, i) => {
        const res = await searchPictograms(w, 'en');
        const displayWord = translated ? translated[i].sv : w;
        return { word: displayWord, id: res[0]?.id || 0, url: res[0]?.url || '', zone: 'unplaced' as const };
      })
    );
    items = results;
    loading = false;
  }

  function placeItem(item: MatItem, zone: 'positive' | 'neutral' | 'negative') {
    items = items.map(i => i.word === item.word ? { ...i, zone } : i);
    speak(item.word);
  }

  function startDrag(item: MatItem) { dragItem = item; }

  function dropOnZone(zone: 'positive' | 'neutral' | 'negative') {
    if (dragItem) { placeItem(dragItem, zone); dragItem = null; }
  }

  function saveSession() {
    if (!activeTopic) return;
    sessions = [...sessions, { topic: activeTopic.id, date: new Date().toISOString(), items: [...items] }];
    speak($t('mat.saved'));
  }

  function resetMat() {
    items = items.map(i => ({ ...i, zone: 'unplaced' as const }));
  }

  const unplaced = $derived(items.filter(i => i.zone === 'unplaced'));
  const positive = $derived(items.filter(i => i.zone === 'positive'));
  const neutral = $derived(items.filter(i => i.zone === 'neutral'));
  const negative = $derived(items.filter(i => i.zone === 'negative'));
</script>

<div class="mat-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => activeTopic ? (activeTopic = null) : goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('mat.title')}</h1>
    {#if activeTopic}
      <div class="header-actions">
        <button class="icon-btn" onclick={saveSession} aria-label={$t('mat.save')}>💾</button>
        <button class="icon-btn" onclick={resetMat} aria-label={$t('mat.reset')}>🔄</button>
      </div>
    {/if}
  </header>

  {#if !activeTopic}
    <p class="intro">{$t('mat.choose_topic')}</p>
    <div class="topics-grid">
      {#each TOPICS as topic}
        <button class="topic-card" onclick={() => selectTopic(topic)}>
          <span class="topic-emoji">{topic.emoji}</span>
          <span>{$t(topic.label)}</span>
        </button>
      {/each}
    </div>
    <div class="method-credit">
      <p>{$t('mat.credit')}</p>
    </div>
  {:else if loading}
    <div class="loading"><div class="spinner"></div></div>
  {:else}
    <div class="mat-layout">
      <div class="zones">
        <div class="zone positive" role="region" aria-label={$t('mat.positive')}
          ondragover={(e) => e.preventDefault()} ondrop={() => dropOnZone('positive')}>
          <h3>😊 {$t('mat.positive')}</h3>
          <div class="zone-items">
            {#each positive as item}
              <button class="zone-item" onclick={() => speak(item.word)}>
                {#if item.url}<img src={item.url} alt={item.word} width="48" height="48" />{/if}
                <span>{item.word}</span>
              </button>
            {/each}
          </div>
        </div>
        <div class="zone neutral-zone" role="region" aria-label={$t('mat.neutral')}
          ondragover={(e) => e.preventDefault()} ondrop={() => dropOnZone('neutral')}>
          <h3>😐 {$t('mat.neutral')}</h3>
          <div class="zone-items">
            {#each neutral as item}
              <button class="zone-item" onclick={() => speak(item.word)}>
                {#if item.url}<img src={item.url} alt={item.word} width="48" height="48" />{/if}
                <span>{item.word}</span>
              </button>
            {/each}
          </div>
        </div>
        <div class="zone negative-zone" role="region" aria-label={$t('mat.negative')}
          ondragover={(e) => e.preventDefault()} ondrop={() => dropOnZone('negative')}>
          <h3>😟 {$t('mat.negative')}</h3>
          <div class="zone-items">
            {#each negative as item}
              <button class="zone-item" onclick={() => speak(item.word)}>
                {#if item.url}<img src={item.url} alt={item.word} width="48" height="48" />{/if}
                <span>{item.word}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      {#if unplaced.length > 0}
        <div class="unplaced-bar">
          <p class="bar-label">{$t('mat.tap_to_place')}</p>
          <div class="unplaced-items">
            {#each unplaced as item}
              <div class="unplaced-card" role="listitem" draggable="true" ondragstart={() => startDrag(item)}>
                {#if item.url}<img src={item.url} alt={item.word} width="56" height="56" />{/if}
                <span class="unplaced-label">{item.word}</span>
                <div class="place-buttons">
                  <button class="place-btn pos" onclick={() => placeItem(item, 'positive')} aria-label="Positive">😊</button>
                  <button class="place-btn neu" onclick={() => placeItem(item, 'neutral')} aria-label="Neutral">😐</button>
                  <button class="place-btn neg" onclick={() => placeItem(item, 'negative')} aria-label="Negative">😟</button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <footer class="credit">
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
    · Inspired by <a href="https://www.talkingmats.com" target="_blank" rel="noopener">Talking Mats™</a> framework
  </footer>
</div>

<style>
  .mat-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .header-actions { display: flex; gap: 6px; }
  .icon-btn { width: 40px; height: 40px; font-size: 1.2em; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; }
  .icon-btn:hover { background: var(--bg-hover); }

  .intro { text-align: center; padding: 20px; color: var(--text-muted); }
  .topics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; padding: 0 20px 20px; }
  .topic-card {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 24px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); font-weight: 600; transition: all 0.2s;
  }
  .topic-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .topic-emoji { font-size: 2em; }
  .method-credit { text-align: center; padding: 16px; font-size: 0.8em; color: var(--text-muted); }

  .mat-layout { flex: 1; display: flex; flex-direction: column; }

  .zones { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; flex: 1; min-height: 300px; }
  .zone {
    border-radius: var(--radius); padding: 12px; display: flex; flex-direction: column; gap: 8px; min-height: 200px;
  }
  .zone h3 { font-size: 0.9em; text-align: center; margin-bottom: 4px; }
  .positive { background: rgba(39, 174, 96, 0.1); border: 2px dashed #27AE60; }
  .neutral-zone { background: rgba(241, 196, 15, 0.1); border: 2px dashed #F1C40F; }
  .negative-zone { background: rgba(231, 76, 60, 0.1); border: 2px dashed #E74C3C; }
  .zone-items { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
  .zone-item {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 6px; background: var(--bg-card); border-radius: 8px; font-size: 0.75em; font-weight: 500;
    border: 1px solid var(--border); transition: transform 0.15s;
  }
  .zone-item:active { transform: scale(0.95); }
  .zone-item img { border-radius: 4px; }

  .unplaced-bar {
    border-top: 2px solid var(--border); padding: 12px 16px; background: var(--bg);
  }
  .bar-label { font-size: 0.75em; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
  .unplaced-items { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
  .unplaced-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); min-width: 90px; cursor: grab; flex-shrink: 0;
  }
  .unplaced-card img { border-radius: 6px; }
  .unplaced-label { font-size: 0.75em; font-weight: 600; }
  .place-buttons { display: flex; gap: 4px; }
  .place-btn {
    width: 32px; height: 32px; font-size: 1em; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s;
  }
  .place-btn:active { transform: scale(1.2); }
  .pos { background: rgba(39,174,96,0.2); }
  .neu { background: rgba(241,196,15,0.2); }
  .neg { background: rgba(231,76,60,0.2); }

  .loading { flex: 1; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: #3498DB; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .credit { text-align: center; padding: 12px; font-size: 0.75em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }
</style>
