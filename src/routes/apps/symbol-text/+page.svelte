<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  interface SymbolWord {
    word: string;
    pictogramUrl: string;
    loading: boolean;
  }

  let inputText = $state('');
  let symbolWords = $state<SymbolWord[]>([]);
  let processing = $state(false);
  let savedTexts = $state<{ text: string; words: SymbolWord[] }[]>(loadSaved());
  let fontSize = $state<'small' | 'medium' | 'large'>('medium');

  const FONT_SIZES = { small: '0.9em', medium: '1.1em', large: '1.4em' };
  const PICTO_SIZES = { small: 40, medium: 56, large: 72 };

  // Common small words that don't need pictograms
  const SKIP_WORDS = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been',
    'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as',
    'it', 'this', 'that', 'en', 'ett', 'den', 'det', 'och', 'eller', 'men', 'i', 'på',
    'till', 'för', 'av', 'med', 'från', 'som', 'är', 'var', 'har', 'hade']);

  function loadSaved(): { text: string; words: SymbolWord[] }[] {
    try {
      const data = localStorage.getItem('symbol-texts');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  function saveSavedTexts() {
    localStorage.setItem('symbol-texts', JSON.stringify(savedTexts));
  }

  async function processText() {
    if (!inputText.trim()) return;
    processing = true;
    const words = inputText.trim().split(/\s+/);
    const lang = get(locale);

    symbolWords = words.map(w => ({ word: w, pictogramUrl: '', loading: true }));

    // Process in parallel
    await Promise.all(
      symbolWords.map(async (sw, i) => {
        const clean = sw.word.replace(/[.,!?;:]/g, '').toLowerCase();
        if (SKIP_WORDS.has(clean) || clean.length <= 1) {
          symbolWords[i] = { ...sw, loading: false };
          return;
        }
        try {
          const results = await searchPictograms(clean, lang);
          if (results.length > 0) {
            symbolWords[i] = { ...sw, pictogramUrl: results[0].url, loading: false };
          } else if (lang === 'sv') {
            // Fallback to English search
            const enResults = await searchPictograms(clean, 'en');
            symbolWords[i] = { ...sw, pictogramUrl: enResults[0]?.url || '', loading: false };
          } else {
            symbolWords[i] = { ...sw, loading: false };
          }
        } catch {
          symbolWords[i] = { ...sw, loading: false };
        }
      })
    );
    processing = false;
  }

  function speakText() {
    speak(symbolWords.map(w => w.word).join(' '));
  }

  function saveText() {
    if (symbolWords.length > 0) {
      savedTexts = [{ text: inputText, words: [...symbolWords] }, ...savedTexts.slice(0, 19)];
      saveSavedTexts();
    }
  }

  function loadText(saved: { text: string; words: SymbolWord[] }) {
    inputText = saved.text;
    symbolWords = [...saved.words];
  }

  function deleteSaved(index: number) {
    savedTexts = savedTexts.filter((_, i) => i !== index);
    saveSavedTexts();
  }

  function clearAll() {
    inputText = '';
    symbolWords = [];
  }

  // Example sentences
  const EXAMPLES_SV = ['Jag vill äta frukost', 'Vi ska gå till parken', 'Jag känner mig glad idag'];
  const EXAMPLES_EN = ['I want to eat breakfast', 'We are going to the park', 'I feel happy today'];

  function loadExample(ex: string) {
    inputText = ex;
    processText();
  }

  const examples = $derived(get(locale) === 'sv' ? EXAMPLES_SV : EXAMPLES_EN);
</script>

<WelcomeDialog appId="symbol-text" titleKey="app.symbol_text" purposeKey="welcome.symbolText.purpose" howKey="welcome.symbolText.how" goalKey="welcome.symbolText.goal" icon="🔤" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)} aria-label={$t('app.back')}>←</button>
    <h1>🔤 {$t('symbolText.title')}</h1>
    <div class="size-btns">
      <button class:active={fontSize === 'small'} onclick={() => fontSize = 'small'}>A</button>
      <button class:active={fontSize === 'medium'} onclick={() => fontSize = 'medium'} style="font-size:1.1em">A</button>
      <button class:active={fontSize === 'large'} onclick={() => fontSize = 'large'} style="font-size:1.3em">A</button>
    </div>
  </header>

  <main class="cnt">
    <section class="input-area">
      <textarea
        bind:value={inputText}
        placeholder={$t('symbolText.placeholder')}
        rows="3"
        onkeydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); processText(); } }}
      ></textarea>
      <div class="input-actions">
        <button class="go-btn" onclick={processText} disabled={processing || !inputText.trim()}>
          {processing ? '⏳' : '✨'} {$t('symbolText.convert')}
        </button>
        {#if symbolWords.length > 0}
          <button class="speak-btn" onclick={speakText}>🔊</button>
          <button class="save-btn" onclick={saveText}>💾</button>
          <button class="clear-btn" onclick={clearAll}>✕</button>
        {/if}
      </div>
    </section>

    {#if symbolWords.length === 0 && !processing}
      <section class="examples">
        <h2>{$t('symbolText.examples')}</h2>
        <div class="example-list">
          {#each examples as ex}
            <button class="example-btn" onclick={() => loadExample(ex)}>"{ex}"</button>
          {/each}
        </div>
      </section>
    {/if}

    {#if symbolWords.length > 0}
      <section class="symbol-display" aria-label={$t('symbolText.result')}>
        <div class="symbol-words" style="font-size: {FONT_SIZES[fontSize]}">
          {#each symbolWords as sw}
            <div class="symbol-word">
              {#if sw.loading}
                <div class="picto-placeholder" style="width:{PICTO_SIZES[fontSize]}px;height:{PICTO_SIZES[fontSize]}px">⏳</div>
              {:else if sw.pictogramUrl}
                <img src={sw.pictogramUrl} alt={sw.word} width={PICTO_SIZES[fontSize]} height={PICTO_SIZES[fontSize]} loading="lazy" />
              {:else}
                <div class="picto-placeholder empty" style="width:{PICTO_SIZES[fontSize]}px;height:{PICTO_SIZES[fontSize]}px"></div>
              {/if}
              <span class="word-label">{sw.word}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if savedTexts.length > 0}
      <section class="saved">
        <h2>{$t('symbolText.saved')}</h2>
        {#each savedTexts as saved, i}
          <div class="saved-row">
            <button class="saved-text" onclick={() => loadText(saved)}>{saved.text}</button>
            <button class="del-btn" onclick={() => deleteSaved(i)}>🗑️</button>
          </div>
        {/each}
      </section>
    {/if}
  </main>

  <footer class="cr"><p>Widgit-inspirerat · ARASAAC (CC BY-NC-SA) · Autismappar</p></footer>
</div>

<style>
  .app { display: flex; flex-direction: column; min-height: 100dvh; background: var(--bg, #f5f5f5); color: var(--text, #1a1a2e); }
  .hdr { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-card, #fff); border-bottom: 1px solid var(--border, #e0e0e0); }
  .back { background: none; border: none; font-size: 1.5em; cursor: pointer; padding: 4px 8px; }
  h1 { font-size: 1.3em; margin: 0; flex: 1; }
  h2 { font-size: 1em; margin: 0 0 8px; font-weight: 600; }
  .cnt { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto; width: 100%; }
  .cr { text-align: center; padding: 12px; font-size: .75em; opacity: .5; }

  .size-btns { display: flex; gap: 4px; }
  .size-btns button { padding: 4px 8px; border: 1px solid var(--border, #ccc); border-radius: 6px; background: var(--bg-card, #fff); cursor: pointer; font-weight: 600; }
  .size-btns button.active { background: #3498DB; color: white; border-color: #3498DB; }

  .input-area { background: var(--bg-card, #fff); border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  textarea { width: 100%; padding: 12px; border: 2px solid var(--border, #ddd); border-radius: 10px; font-size: 1em; font-family: inherit; resize: vertical; background: var(--bg, #f5f5f5); color: var(--text, #1a1a2e); }
  textarea:focus { border-color: #3498DB; outline: none; }
  .input-actions { display: flex; gap: 8px; margin-top: 8px; }
  .go-btn { padding: 10px 20px; background: #3498DB; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: .95em; cursor: pointer; }
  .go-btn:disabled { opacity: .5; cursor: not-allowed; }
  .speak-btn, .save-btn, .clear-btn { padding: 8px 14px; border: 2px solid var(--border, #ddd); border-radius: 10px; background: var(--bg-card, #fff); cursor: pointer; font-size: 1.1em; }
  .speak-btn:hover { border-color: #27AE60; }
  .save-btn:hover { border-color: #3498DB; }
  .clear-btn:hover { border-color: #E74C3C; }

  .examples { }
  .example-list { display: flex; flex-direction: column; gap: 6px; }
  .example-btn { padding: 10px 14px; background: var(--bg-card, #fff); border: 1px solid var(--border, #ddd); border-radius: 10px; text-align: left; cursor: pointer; font-style: italic; }
  .example-btn:hover { border-color: #3498DB; }

  .symbol-display { background: var(--bg-card, #fff); border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .symbol-words { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: flex-end; }
  .symbol-word { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .symbol-word img { border-radius: 6px; border: 1px solid var(--border, #eee); }
  .picto-placeholder { display: flex; align-items: center; justify-content: center; border-radius: 6px; background: var(--bg, #f0f0f0); font-size: .8em; }
  .picto-placeholder.empty { border: 1px dashed var(--border, #ccc); }
  .word-label { font-weight: 600; text-align: center; }

  .saved-row { display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--bg-card, #fff); border-radius: 10px; margin-bottom: 6px; border: 1px solid var(--border, #eee); }
  .saved-text { flex: 1; background: none; border: none; text-align: left; cursor: pointer; font-size: .9em; padding: 4px; }
  .del-btn { background: none; border: none; cursor: pointer; font-size: 1em; }

  @media (prefers-color-scheme: dark) {
    .app { --bg: #1a1a2e; --text: #e0e0e0; --bg-card: #16213e; --border: #334155; }
  }
</style>
