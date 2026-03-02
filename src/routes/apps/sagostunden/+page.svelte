<script>
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';
  import { ALL_WORDS, WORD_CATEGORIES, pictogramUrl } from '$lib/sagostunden/words';
  import { TEMPLATES, fillTemplate } from '$lib/sagostunden/templates';
  import { generateStory } from '$lib/sagostunden/engine';
  import { saveStory, getAllStories, deleteStory, toggleFavorite } from '$lib/sagostunden/storage';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';

  // View state
  let view = $state('select'); // 'select' | 'story' | 'saved'

  // Word selection
  let selectedCategory = $state('djur');
  let selectedWords = $state({});  // slot → word

  // Template
  let selectedTemplate = $state(null);

  // Generated story
  let currentStory = $state(null);

  // Saved stories
  let savedStories = $state([]);

  // Settings
  let fontSize = $state(24);
  let showPictograms = $state(true);

  // Slots needed by current template
  let neededSlots = $derived(selectedTemplate ? selectedTemplate.slots : []);

  const SLOT_LABELS = {
    DJUR: { emoji: '🐾', labelKey: 'sagostunden.cat.animals' },
    PLATS: { emoji: '🏠', labelKey: 'sagostunden.cat.places' },
    SAK: { emoji: '🎁', labelKey: 'sagostunden.cat.things' },
    MAT: { emoji: '🍎', labelKey: 'sagostunden.cat.food' },
    PERSON: { emoji: '👤', labelKey: 'sagostunden.cat.people' },
    VERB: { emoji: '⚡', labelKey: 'sagostunden.cat.actions' },
  };

  const SLOT_TO_CAT = {
    DJUR: 'djur',
    PLATS: 'platser',
    SAK: 'saker',
    MAT: 'mat',
    PERSON: 'personer',
    VERB: 'verb',
  };

  function selectWord(slot, word) {
    selectedWords = { ...selectedWords, [slot]: word };

    // Auto-advance to next empty slot with visual highlight
    tick().then(() => {
      const nextEmpty = neededSlots.find(s => s !== slot && !selectedWords[s]);
      if (nextEmpty) {
        const el = document.getElementById('slot-' + nextEmpty);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('slot-highlight');
          setTimeout(() => el.classList.remove('slot-highlight'), 2000);
        }
      } else {
        // All slots filled — scroll to create button
        const btn = document.getElementById('create-story-btn');
        if (btn) {
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          btn.classList.add('pulse');
          setTimeout(() => btn.classList.remove('pulse'), 2000);
        }
      }
    });
  }

  function removeWord(slot) {
    const copy = { ...selectedWords };
    delete copy[slot];
    selectedWords = copy;
  }

  function createStory() {
    if (!selectedTemplate) return;
    currentStory = generateStory(selectedTemplate, selectedWords);
    view = 'story';
  }

  function randomStory() {
    currentStory = generateStory();
    view = 'story';
  }

  async function save() {
    if (!currentStory) return;
    await saveStory({
      storyId: currentStory.id,
      title: currentStory.template.title,
      titleKey: currentStory.template.titleKey,
      paragraphs: currentStory.paragraphs,
      wordIds: Object.fromEntries(
        Object.entries(currentStory.words).map(([k, w]) => [k, w.id])
      ),
      templateId: currentStory.template.id,
      createdAt: currentStory.createdAt,
      favorite: false,
    });
    await loadSaved();
  }

  async function loadSaved() {
    savedStories = await getAllStories();
  }

  async function removeSaved(id) {
    await deleteStory(id);
    await loadSaved();
  }

  async function toggleFav(id) {
    await toggleFavorite(id);
    await loadSaved();
  }

  function readAloud() {
    if (!currentStory) return;
    const text = currentStory.paragraphs.join(' ');
    speak(text);
  }

  function printStory() {
    if (!currentStory) return;
    const title = storyTitle(currentStory.template);
    const words = Object.entries(currentStory.words);
    const paragraphs = currentStory.paragraphs;
    const pictos = words.map(([_, w]) => ({
      src: pictogramUrl(w.arasaac, 300),
      label: w.sv
    }));
    const paraPictos = paragraphs.map((_, i) =>
      paragraphPictograms(currentStory, i).map(p => ({
        src: pictogramUrl(p.arasaac, 300),
        label: p.sv
      }))
    );

    const printHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<title>${title} — Sagostunden</title>
<style>
  @page { margin: 20mm; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #2C3E50; line-height: 1.6; padding: 24px; }
  .header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid #7C3AED; padding-bottom: 16px; }
  .header h1 { font-size: 28px; color: #7C3AED; margin-bottom: 4px; }
  .header .subtitle { font-size: 14px; color: #666; }
  .words-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin: 20px 0; }
  .word-badge { text-align: center; }
  .word-badge img { width: 80px; height: 80px; object-fit: contain; display: block; margin: 0 auto 4px; }
  .word-badge span { font-size: 14px; font-weight: 600; }
  .paragraph { margin: 24px 0; page-break-inside: avoid; }
  .para-pictos { display: flex; gap: 12px; margin-bottom: 8px; }
  .para-pictos img { width: 100px; height: 100px; object-fit: contain; border: 1px solid #e0e0e0; border-radius: 8px; padding: 4px; }
  .para-text { font-size: 20px; line-height: 1.7; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #e0e0e0; text-align: center; font-size: 11px; color: #999; }
  .footer .app-info { margin-bottom: 4px; }
  @media print { body { padding: 0; } .no-print { display: none !important; } }
</style>
</head>
<body>
  <div class="header">
    <h1>📖 ${title}</h1>
    <div class="subtitle">Skapad med Sagostunden — autismappar.se</div>
  </div>
  <div class="words-row">
    ${pictos.map(p => `<div class="word-badge"><img src="${p.src}" alt="${p.label}"><span>${p.label}</span></div>`).join('')}
  </div>
  ${paragraphs.map((para, i) => `
    <div class="paragraph">
      <div class="para-pictos">
        ${paraPictos[i].map(p => `<img src="${p.src}" alt="${p.label}" title="${p.label}">`).join('')}
      </div>
      <p class="para-text">${para}</p>
    </div>
  `).join('')}
  <div class="footer">
    <div class="app-info">Sagostunden v1.0 — autismappar.se/launcher/apps/sagostunden</div>
    <div>Bildstöd från ARASAAC (CC BY-NC-SA 4.0) — arasaac.org</div>
  </div>
  <div class="no-print" style="text-align:center;margin-top:24px">
    <button onclick="window.print()" style="font-size:18px;padding:12px 32px;background:#7C3AED;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨️ Skriv ut</button>
  </div>
</body>
</html>`;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(printHtml);
      printWin.document.close();
      // Wait for images to load, then auto-print
      printWin.onload = () => setTimeout(() => printWin.print(), 500);
    }
  }

  /** Get pictograms relevant to a specific paragraph */
  function paragraphPictograms(story, paraIndex) {
    if (!story || !story.template || !story.words) return [];
    const lang = 'sv';
    const paraTemplate = story.template.paragraphs?.[lang]?.[paraIndex] || '';
    const pics = [];
    const seen = new Set();
    for (const [slot, word] of Object.entries(story.words)) {
      // Check if this slot's placeholder appears in this paragraph template
      if (paraTemplate.includes('{' + slot + '}') || 
          paraTemplate.includes('{en_' + slot + '}') || 
          paraTemplate.includes('{a_' + slot + '}')) {
        if (!seen.has(word.id)) {
          seen.add(word.id);
          pics.push(word);
        }
      }
    }
    return pics;
  }

  function wordsForSlot(slot) {
    const cat = SLOT_TO_CAT[slot];
    return cat ? ALL_WORDS.filter(w => w.category === cat) : [];
  }

  /** Get translated story title, falling back to raw title */
  function storyTitle(tmpl) {
    if (tmpl.titleKey) {
      const translated = $t(tmpl.titleKey);
      if (translated && translated !== tmpl.titleKey) return translated;
    }
    return tmpl.title;
  }

  /** Get translated title for saved story */
  function savedTitle(story) {
    if (story.titleKey) {
      const translated = $t(story.titleKey);
      if (translated && translated !== story.titleKey) return translated;
    }
    return story.title;
  }

  // Init
  loadSaved();
</script>

<WelcomeDialog
  appId="sagostunden"
  titleKey="app.sagostunden"
  purposeKey="welcome.sagostunden.purpose"
  howKey="welcome.sagostunden.how"
  goalKey="welcome.sagostunden.goal"
  icon="📖"
/>

<main class="sagostunden" style="--fs: {fontSize}px">
  <!-- Top nav (no back button — app shell provides one) -->
  <nav class="top-bar">
    <h1>📖 {$t('app.sagostunden')}</h1>
    <div class="nav-tabs">
      <button class:active={view === 'select'} onclick={() => view = 'select'}>
        ✨ {$t('sagostunden.create')}
      </button>
      <button class:active={view === 'saved'} onclick={() => { view = 'saved'; loadSaved(); }}>
        💾 {$t('sagostunden.saved')}
      </button>
    </div>
  </nav>

  {#if view === 'select'}
    <section class="select-view" transition:fade={{ duration: 200 }}>
      <!-- Step 1: Pick template -->
      <div class="step">
        <h2>1. {$t('sagostunden.pick_template')}</h2>
        <div class="template-grid">
          {#each TEMPLATES as tmpl}
            <button
              class="template-card"
              class:selected={selectedTemplate?.id === tmpl.id}
              onclick={() => { selectedTemplate = tmpl; selectedWords = {}; tick().then(() => { const el = document.getElementById('step-words'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); }}
            >
              <span class="template-title">{storyTitle(tmpl)}</span>
              <span class="template-slots">
                {tmpl.slots.map(s => SLOT_LABELS[s]?.emoji || '').join(' ')}
              </span>
            </button>
          {/each}
        </div>
      </div>

      {#if selectedTemplate}
        <!-- Step 2: Pick words for slots -->
        <div class="step" id="step-words">
          <h2>2. {$t('sagostunden.pick_words')}</h2>
          <p class="hint">{$t('sagostunden.pick_words_hint')}</p>

          {#each neededSlots as slot}
            <div class="slot-section" id={"slot-" + slot}>
              <h3>{SLOT_LABELS[slot]?.emoji} {$t(SLOT_LABELS[slot]?.labelKey)}</h3>

              {#if selectedWords[slot]}
                <div class="selected-word">
                  {#if showPictograms}
                    <img
                      src={pictogramUrl(selectedWords[slot].arasaac, 100)}
                      alt={selectedWords[slot].sv}
                      class="picto-small"
                      loading="lazy"
                    />
                  {/if}
                  <span>{selectedWords[slot].sv}</span>
                  <button class="remove-btn" onclick={() => removeWord(slot)}>✕</button>
                </div>
              {:else}
                <div class="word-grid">
                  {#each wordsForSlot(slot) as word}
                    <button
                      class="word-btn"
                      onclick={() => { selectWord(slot, word); speak(word.sv); }}
                    >
                      {#if showPictograms}
                        <img
                          src={pictogramUrl(word.arasaac, 100)}
                          alt={word.sv}
                          class="picto-thumb"
                          loading="lazy"
                        />
                      {/if}
                      <span>{word.sv}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Step 3: Generate -->
        <div class="step actions">
          <button id="create-story-btn" class="big-btn primary" onclick={createStory}>
            📖 {$t('sagostunden.create_story')}
          </button>
        </div>
      {/if}

      <div class="step actions">
        <button class="big-btn secondary" onclick={randomStory}>
          🎲 {$t('sagostunden.random_story')}
        </button>
      </div>

      <!-- Settings -->
      <details class="settings">
        <summary>⚙️ {$t('sagostunden.settings')}</summary>
        <label>
          {$t('sagostunden.font_size')}: {fontSize}px
          <input type="range" min="16" max="48" step="2" bind:value={fontSize} />
        </label>
        <label>
          <input type="checkbox" bind:checked={showPictograms} />
          {$t('sagostunden.show_pictograms')}
        </label>
      </details>
    </section>

  {:else if view === 'story'}
    <section class="story-view" transition:fade={{ duration: 200 }}>
      {#if currentStory}
        <h2 class="story-title">{storyTitle(currentStory.template)}</h2>

        <!-- Word pictograms row -->
        {#if showPictograms}
          <div class="story-words-row">
            {#each Object.entries(currentStory.words) as [slot, word]}
              <div class="story-word-badge">
                <img
                  src={pictogramUrl(word.arasaac, 100)}
                  alt={word.sv}
                  class="picto-small"
                  loading="lazy"
                />
                <span>{word.sv}</span>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Story text with pictograms -->
        <div class="story-text" style="font-size: var(--fs)">
          {#each currentStory.paragraphs as para, i}
            <div class="story-paragraph" transition:fade={{ delay: i * 300, duration: 400 }}>
              <div class="para-pictos">
                {#each paragraphPictograms(currentStory, i) as picto}
                  <img
                    src={pictogramUrl(picto.arasaac, 300)}
                    alt={picto.sv}
                    class="para-picto-img"
                    loading="lazy"
                  />
                {/each}
              </div>
              <p>{para}</p>
            </div>
          {/each}
        </div>

        <div class="story-actions">
          <button class="big-btn primary" onclick={readAloud}>
            🔊 {$t('sagostunden.read_aloud')}
          </button>
          <button class="big-btn secondary" onclick={save}>
            💾 {$t('sagostunden.save_story')}
          </button>
          <button class="big-btn secondary" onclick={printStory}>
            🖨️ {$t('sagostunden.print') || 'Skriv ut'}
          </button>
          <button class="big-btn secondary" onclick={() => view = 'select'}>
            ✨ {$t('sagostunden.new_story')}
          </button>
        </div>
      {/if}
    </section>

  {:else if view === 'saved'}
    <section class="saved-view" transition:fade={{ duration: 200 }}>
      <h2>💾 {$t('sagostunden.saved_stories')}</h2>

      {#if savedStories.length === 0}
        <p class="empty-msg">{$t('sagostunden.no_saved')}</p>
      {:else}
        <div class="saved-list">
          {#each savedStories as story}
            <div class="saved-card" class:favorite={story.favorite}>
              <div class="saved-header">
                <h3>{savedTitle(story)}</h3>
                <span class="saved-date">
                  {new Date(story.createdAt).toLocaleDateString('sv-SE')}
                </span>
              </div>
              <p class="saved-preview">{story.paragraphs[0]}</p>
              <div class="saved-actions">
                <button onclick={() => { currentStory = { paragraphs: story.paragraphs, template: { title: story.title, titleKey: story.titleKey }, words: {} }; view = 'story'; }}>
                  📖 {$t('sagostunden.read')}
                </button>
                <button onclick={() => toggleFav(story.id)}>
                  {story.favorite ? '⭐' : '☆'}
                </button>
                <button onclick={() => removeSaved(story.id)}>🗑️</button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}

  <footer class="credit">
    {$t('sagostunden.credit')}
  </footer>
</main>

<style>
  .sagostunden {
    max-width: 900px;
    margin: 0 auto;
    padding: 16px;
    font-family: system-ui, sans-serif;
    min-height: 100dvh;
    --fs: 24px;
    color: var(--text, #2C3E50);
    background: var(--bg, #FFFFFF);
  }

  .top-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .top-bar h1 {
    font-size: 28px;
    margin: 0;
    flex: 1;
    color: var(--text, #2C3E50);
  }

  .nav-tabs {
    display: flex;
    gap: 8px;
  }

  .nav-tabs button {
    padding: 10px 20px;
    border-radius: var(--radius, 12px);
    border: 2px solid var(--border, #9B59B6);
    background: var(--bg-card, white);
    color: var(--text, #2C3E50);
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-tabs button.active {
    background: #9B59B6;
    color: white;
  }

  :global(.theme-high-contrast) .nav-tabs button.active {
    background: #FFFFFF;
    color: #000000;
    border-color: #FFFFFF;
  }

  .step {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 24px;
    color: var(--text, #2C3E50);
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    color: var(--text, #8E44AD);
    margin: 16px 0 8px;
  }

  .hint {
    font-size: 16px;
    color: var(--text-muted, #666);
    margin-bottom: 12px;
  }

  /* Template grid */
  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .template-card {
    padding: 16px;
    border: 3px solid var(--border, #ddd);
    border-radius: var(--radius, 16px);
    background: var(--bg-card, white);
    color: var(--text, #2C3E50);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-size: 16px;
  }

  .template-card:hover {
    border-color: #9B59B6;
    transform: translateY(-2px);
  }

  :global(.theme-high-contrast) .template-card:hover {
    border-color: #FFFFFF;
  }

  .template-card.selected {
    border-color: #9B59B6;
    background: #F3E5F5;
  }

  :global(.theme-high-contrast) .template-card.selected {
    border-color: #FFFFFF;
    background: #333333;
    color: #FFFFFF;
  }

  .template-title {
    display: block;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .template-slots {
    font-size: 24px;
  }

  /* Word grid */
  .word-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }

  .word-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px;
    border: 2px solid var(--border, #ddd);
    border-radius: var(--radius, 12px);
    background: var(--bg-card, white);
    color: var(--text, #2C3E50);
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.15s;
  }

  .word-btn:hover {
    border-color: #9B59B6;
    background: var(--bg-hover, #FAFAFA);
  }

  :global(.theme-high-contrast) .word-btn:hover {
    border-color: #FFFFFF;
  }

  .picto-thumb {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  .picto-small {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .selected-word {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-hover, #F3E5F5);
    border: 2px solid var(--border, transparent);
    border-radius: var(--radius, 12px);
    font-size: 20px;
    font-weight: 700;
    color: var(--text, #2C3E50);
  }

  .remove-btn {
    margin-left: auto;
    background: #E74C3C;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 18px;
    cursor: pointer;
  }

  .slot-section {
    margin-bottom: 20px;
    padding: 12px;
    border: 2px solid var(--border, #eee);
    border-radius: var(--radius, 16px);
  }

  /* Buttons */
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  .big-btn {
    padding: 16px 32px;
    border-radius: var(--radius, 16px);
    border: none;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s;
  }

  .big-btn:hover {
    transform: scale(1.05);
  }

  .big-btn.primary {
    background: #9B59B6;
    color: white;
  }

  :global(.theme-high-contrast) .big-btn.primary {
    background: #FFFFFF;
    color: #000000;
    border: 2px solid #FFFFFF;
  }

  .big-btn.secondary {
    background: var(--bg-card, #ECF0F1);
    color: var(--text, #2C3E50);
    border: 2px solid var(--border, #BDC3C7);
  }

  /* Story view */
  .story-title {
    font-size: 32px;
    text-align: center;
    color: var(--text, #8E44AD);
    margin-bottom: 20px;
  }

  .story-words-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-bottom: 24px;
  }

  .story-word-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: var(--bg-hover, #F3E5F5);
    border: 2px solid var(--border, transparent);
    border-radius: var(--radius, 12px);
    font-weight: 600;
    font-size: 14px;
    color: var(--text, #2C3E50);
  }

  .story-text {
    max-width: 700px;
    margin: 0 auto 24px;
    line-height: 1.8;
  }

  .story-text p {
    margin: 8px 0 0;
    color: var(--text, #2C3E50);
  }

  .story-paragraph {
    margin: 20px 0;
    padding: 16px;
    background: var(--bg-hover, #FAFAFA);
    border-radius: var(--radius, 16px);
    border: 2px solid var(--border, #eee);
  }

  .para-pictos {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-bottom: 8px;
  }

  .para-picto-img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 12px;
    background: white;
    padding: 4px;
    border: 2px solid var(--border, #ddd);
  }

  .story-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
  }

  /* Saved view */
  .saved-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .saved-card {
    padding: 16px;
    border: 2px solid var(--border, #ddd);
    border-radius: var(--radius, 16px);
    background: var(--bg-card, white);
    color: var(--text, #2C3E50);
  }

  .saved-card.favorite {
    border-color: #F1C40F;
    background: var(--bg-hover, #FFFDE7);
  }

  :global(.theme-high-contrast) .saved-card.favorite {
    border-color: #F1C40F;
    background: #333300;
  }

  .saved-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .saved-header h3 {
    margin: 0;
    font-size: 20px;
    color: var(--text, #2C3E50);
  }

  .saved-date {
    font-size: 14px;
    color: var(--text-muted, #999);
  }

  .saved-preview {
    font-size: 16px;
    color: var(--text-muted, #666);
    margin-bottom: 12px;
  }

  .saved-actions {
    display: flex;
    gap: 8px;
  }

  .saved-actions button {
    padding: 8px 16px;
    border: 2px solid var(--border, #ddd);
    border-radius: var(--radius, 10px);
    background: var(--bg-card, white);
    color: var(--text, #2C3E50);
    font-size: 16px;
    cursor: pointer;
  }

  .empty-msg {
    text-align: center;
    font-size: 20px;
    color: var(--text-muted, #999);
    padding: 40px;
  }

  /* Settings */
  .settings {
    margin-top: 24px;
    padding: 16px;
    border: 2px solid var(--border, #eee);
    border-radius: var(--radius, 16px);
  }

  .settings summary {
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text, #2C3E50);
  }

  .settings label {
    display: block;
    margin: 12px 0;
    font-size: 16px;
    color: var(--text, #2C3E50);
  }

  .settings input[type="range"] {
    width: 100%;
    margin-top: 4px;
  }

  .credit {
    text-align: center;
    font-size: 14px;
    color: var(--text-muted, #999);
    padding: 24px 0;
  }

  @media (max-width: 600px) {
    .template-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    .word-grid {
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    }
    .top-bar h1 { font-size: 22px; }
  }

  .slot-highlight {
    animation: slot-glow 0.6s ease-in-out 2;
    border-color: var(--accent, #3498db) !important;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.3);
  }
  @keyframes slot-glow {
    0%, 100% { box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1); }
    50% { box-shadow: 0 0 0 8px rgba(52, 152, 219, 0.4); }
  }
  .pulse {
    animation: btn-pulse 0.5s ease-in-out 3;
  }
  @keyframes btn-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
</style>

