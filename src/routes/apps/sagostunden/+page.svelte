<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly } from 'svelte/transition';
  import { ALL_WORDS, WORD_CATEGORIES, pictogramUrl } from '$lib/sagostunden/words';
  import { TEMPLATES } from '$lib/sagostunden/templates';
  import { generateStory } from '$lib/sagostunden/engine';
  import { saveStory, getAllStories, deleteStory, toggleFavorite } from '$lib/sagostunden/storage';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';

  // Wizard step: 1=pick template, 2=pick words, 3=read story
  let step = $state(1);
  let view = $state('create'); // 'create' | 'saved'

  // Word selection
  let selectedWords = $state({});
  let activeSlotIndex = $state(0);

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
  let activeSlot = $derived(neededSlots[activeSlotIndex] || null);
  let allSlotsFilled = $derived(
    neededSlots.length > 0 && neededSlots.every(s => selectedWords[s])
  );

  const SLOT_TO_CAT = {
    DJUR: 'djur',
    PLATS: 'platser',
    SAK: 'saker',
    MAT: 'mat',
    PERSON: 'personer',
    VERB: 'verb',
  };

  const SLOT_LABEL_KEYS = {
    DJUR:   { emoji: '🐾', key: 'sagostunden.slot.animal' },
    PLATS:  { emoji: '🏠', key: 'sagostunden.slot.place' },
    SAK:    { emoji: '🎁', key: 'sagostunden.slot.thing' },
    MAT:    { emoji: '🍎', key: 'sagostunden.slot.food' },
    PERSON: { emoji: '👤', key: 'sagostunden.slot.character' },
    VERB:   { emoji: '⚡', key: 'sagostunden.slot.action' },
  };

  function wordLabel(word) {
    const lang = $locale?.startsWith('en') ? 'en' : 'sv';
    return word[lang] || word.sv;
  }

  function selectTemplate(tmpl) {
    selectedTemplate = tmpl;
    selectedWords = {};
    activeSlotIndex = 0;
    step = 2;
  }

  function selectWord(slot, word) {
    selectedWords = { ...selectedWords, [slot]: word };
    const lang = $locale?.startsWith('en') ? 'en' : 'sv';
    speak(word[lang] || word.sv);

    // Auto-advance to next unfilled slot or create story
    const nextEmpty = neededSlots.findIndex((s, i) => i > activeSlotIndex && !selectedWords[s] && s !== slot);
    if (nextEmpty >= 0) {
      activeSlotIndex = nextEmpty;
    } else {
      // Check if all filled
      const updated = { ...selectedWords, [slot]: word };
      const allDone = neededSlots.every(s => updated[s]);
      if (allDone) {
        // Small delay so user sees the selection, then auto-create
        setTimeout(() => createStory(), 400);
      }
    }
  }

  function removeWord(slot) {
    const copy = { ...selectedWords };
    delete copy[slot];
    selectedWords = copy;
    // Jump to that slot
    const idx = neededSlots.indexOf(slot);
    if (idx >= 0) activeSlotIndex = idx;
  }

  function createStory() {
    if (!selectedTemplate) return;
    const lang = $locale?.startsWith('en') ? 'en' : 'sv';
    currentStory = generateStory(selectedTemplate, selectedWords, lang);
    step = 3;
  }

  function randomStory() {
    const lang = $locale?.startsWith('en') ? 'en' : 'sv';
    currentStory = generateStory(undefined, undefined, lang);
    step = 3;
    view = 'create';
  }

  function newStory() {
    step = 1;
    selectedTemplate = null;
    selectedWords = {};
    activeSlotIndex = 0;
    currentStory = null;
    view = 'create';
  }

  async function save() {
    if (!currentStory) return;
    const lang = $locale?.startsWith('en') ? 'en' : 'sv';
    const titleKey = currentStory.template.titleKey;
    await saveStory({
      storyId: currentStory.id,
      title: $t(titleKey) || currentStory.template.title,
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

  function wordsForSlot(slot) {
    const cat = SLOT_TO_CAT[slot];
    return cat ? ALL_WORDS.filter(w => w.category === cat) : [];
  }

  // Init
  loadSaved();
</script>

<WelcomeDialog appId="sagostunden" titleKey="app.sagostunden" purposeKey="welcome.sagostunden.purpose" howKey="welcome.sagostunden.how" goalKey="welcome.sagostunden.goal" icon="📖" />

<main class="sagostunden" style="--fs: {fontSize}px">
  <!-- Top nav -->
  <nav class="top-bar">
    <button class="back-btn" onclick={() => goto(`${base}/`)}>← {$t('common.back')}</button>
    <h1>📖 {$t('app.sagostunden')}</h1>
    <div class="nav-tabs">
      <button class:active={view === 'create'} onclick={newStory}>
        ✨ {$t('sagostunden.create')}
      </button>
      <button class:active={view === 'saved'} onclick={() => { view = 'saved'; loadSaved(); }}>
        💾 {$t('sagostunden.saved')}
      </button>
    </div>
  </nav>

  {#if view === 'create'}

    <!-- Step indicator -->
    {#if step <= 3}
      <div class="step-indicator">
        <div class="step-dot" class:active={step === 1} class:done={step > 1}
             onclick={() => { if (step > 1) { step = 1; selectedTemplate = null; selectedWords = {}; activeSlotIndex = 0; } }}>
          <span class="step-num">{step > 1 ? '✓' : '1'}</span>
          <span class="step-label">{$t('sagostunden.pick_template')}</span>
        </div>
        <div class="step-line" class:done={step > 1}></div>
        <div class="step-dot" class:active={step === 2} class:done={step > 2}
             onclick={() => { if (step > 2 && selectedTemplate) { step = 2; activeSlotIndex = 0; } }}>
          <span class="step-num">{step > 2 ? '✓' : '2'}</span>
          <span class="step-label">{$t('sagostunden.pick_words')}</span>
        </div>
        <div class="step-line" class:done={step > 2}></div>
        <div class="step-dot" class:active={step === 3}>
          <span class="step-num">3</span>
          <span class="step-label">{$t('sagostunden.read')}</span>
        </div>
      </div>
    {/if}

    <!-- STEP 1: Pick template -->
    {#if step === 1}
      <section class="wizard-step" transition:fade={{ duration: 200 }}>
        <h2>{$t('sagostunden.pick_template')}</h2>
        <div class="template-grid">
          {#each TEMPLATES as tmpl}
            <button
              class="template-card"
              onclick={() => selectTemplate(tmpl)}
            >
              <span class="template-title">{$t(tmpl.titleKey) || tmpl.title}</span>
              <span class="template-slots">
                {tmpl.slots.map(s => SLOT_LABEL_KEYS[s]?.emoji || '').join(' ')}
              </span>
            </button>
          {/each}
        </div>

        <div class="actions" style="margin-top: 24px;">
          <button class="big-btn secondary" onclick={randomStory}>
            🎲 {$t('sagostunden.random_story')}
          </button>
        </div>
      </section>

    <!-- STEP 2: Pick words, one slot at a time -->
    {:else if step === 2}
      <section class="wizard-step" transition:fade={{ duration: 200 }}>
        <!-- Slot tabs -->
        <div class="slot-tabs">
          {#each neededSlots as slot, i}
            <button
              class="slot-tab"
              class:active={i === activeSlotIndex}
              class:filled={selectedWords[slot]}
              onclick={() => { activeSlotIndex = i; }}
            >
              <span class="slot-tab-emoji">{SLOT_LABEL_KEYS[slot]?.emoji}</span>
              {#if selectedWords[slot]}
                <img
                  src={pictogramUrl(selectedWords[slot].arasaac, 80)}
                  alt={wordLabel(selectedWords[slot])}
                  class="slot-tab-picto"
                />
              {/if}
              <span class="slot-tab-label">
                {$t(SLOT_LABEL_KEYS[slot]?.key) || slot}
              </span>
            </button>
          {/each}
        </div>

        <!-- Active slot word picker -->
        {#if activeSlot}
          {#key activeSlot}
            <div class="slot-picker" transition:fly={{ x: 50, duration: 250 }}>
              <h2>
                {SLOT_LABEL_KEYS[activeSlot]?.emoji}
                {$t(SLOT_LABEL_KEYS[activeSlot]?.key) || activeSlot}
              </h2>

              {#if selectedWords[activeSlot]}
                <div class="selected-word">
                  <img
                    src={pictogramUrl(selectedWords[activeSlot].arasaac, 150)}
                    alt={wordLabel(selectedWords[activeSlot])}
                    class="picto-large"
                  />
                  <span class="selected-word-text">{wordLabel(selectedWords[activeSlot])}</span>
                  <button class="remove-btn" onclick={() => removeWord(activeSlot)}>✕</button>
                </div>
              {:else}
                <div class="word-grid">
                  {#each wordsForSlot(activeSlot) as word}
                    <button
                      class="word-btn"
                      onclick={() => selectWord(activeSlot, word)}
                    >
                      <img
                        src={pictogramUrl(word.arasaac, 150)}
                        alt={wordLabel(word)}
                        class="picto-word"
                        loading="lazy"
                      />
                      <span class="word-label">{wordLabel(word)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/key}
        {/if}

        {#if allSlotsFilled}
          <div class="actions" style="margin-top: 20px;">
            <button class="big-btn primary" onclick={createStory}>
              📖 {$t('sagostunden.create_story')}
            </button>
          </div>
        {/if}
      </section>

    <!-- STEP 3: Read story -->
    {:else if step === 3}
      <section class="wizard-step" transition:fade={{ duration: 200 }}>
        {#if currentStory}
          <h2 class="story-title">{$t(currentStory.template.titleKey) || currentStory.template.title}</h2>

          <!-- Word pictograms row -->
          <div class="story-words-row">
            {#each Object.entries(currentStory.words) as [slot, word]}
              <div class="story-word-badge">
                <img
                  src={pictogramUrl(word.arasaac, 100)}
                  alt={wordLabel(word)}
                  class="picto-badge"
                />
                <span>{wordLabel(word)}</span>
              </div>
            {/each}
          </div>

          <!-- Story text -->
          <div class="story-text" style="font-size: var(--fs)">
            {#each currentStory.paragraphs as para, i}
              <p transition:fade={{ delay: i * 300, duration: 400 }}>{para}</p>
            {/each}
          </div>

          <div class="story-actions">
            <button class="big-btn primary" onclick={readAloud}>
              🔊 {$t('sagostunden.read_aloud')}
            </button>
            <button class="big-btn secondary" onclick={save}>
              💾 {$t('sagostunden.save_story')}
            </button>
            <button class="big-btn secondary" onclick={newStory}>
              ✨ {$t('sagostunden.new_story')}
            </button>
          </div>
        {/if}
      </section>
    {/if}

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

  {:else if view === 'saved'}
    <section class="wizard-step" transition:fade={{ duration: 200 }}>
      <h2>💾 {$t('sagostunden.saved_stories')}</h2>

      {#if savedStories.length === 0}
        <p class="empty-msg">{$t('sagostunden.no_saved')}</p>
      {:else}
        <div class="saved-list">
          {#each savedStories as story}
            <div class="saved-card" class:favorite={story.favorite}>
              <div class="saved-header">
                <h3>{story.title}</h3>
                <span class="saved-date">
                  {new Date(story.createdAt).toLocaleDateString($locale?.startsWith('en') ? 'en-GB' : 'sv-SE')}
                </span>
              </div>
              <p class="saved-preview">{story.paragraphs[0]}</p>
              <div class="saved-actions">
                <button onclick={() => { currentStory = { paragraphs: story.paragraphs, template: { title: story.title, titleKey: '' }, words: {} }; step = 3; view = 'create'; }}>
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
  }

  .back-btn {
    font-size: 18px;
    padding: 8px 16px;
    border-radius: 12px;
    border: 2px solid var(--border);
    background: var(--bg-card);
    cursor: pointer;
    font-weight: 600;
  }

  .nav-tabs {
    display: flex;
    gap: 8px;
  }

  .nav-tabs button {
    padding: 10px 20px;
    border-radius: 12px;
    border: 2px solid var(--accent, #9B59B6);
    background: var(--bg-card);
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-tabs button.active {
    background: var(--accent, #9B59B6);
    color: white;
  }

  /* Step indicator */
  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 28px;
    padding: 0 16px;
  }

  .step-dot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  .step-dot.active, .step-dot.done {
    opacity: 1;
  }

  .step-num {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
  }

  .step-dot.active .step-num {
    background: var(--accent, #9B59B6);
    color: white;
  }

  .step-dot.done .step-num {
    background: #27AE60;
    color: white;
  }

  .step-label {
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  .step-line {
    height: 3px;
    width: 60px;
    background: var(--border);
    margin: 0 8px;
    margin-bottom: 20px;
    transition: background 0.2s;
  }

  .step-line.done {
    background: #27AE60;
  }

  /* Wizard step */
  .wizard-step {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 24px;
    color: var(--text);
    margin-bottom: 16px;
  }

  /* Template grid */
  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .template-card {
    padding: 16px;
    border: 3px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-size: 16px;
  }

  .template-card:hover {
    border-color: var(--accent, #9B59B6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

  /* Slot tabs */
  .slot-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .slot-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 16px;
    border: 3px solid var(--border);
    border-radius: 14px;
    background: var(--bg-card);
    cursor: pointer;
    transition: all 0.2s;
    min-width: 80px;
  }

  .slot-tab.active {
    border-color: var(--accent, #9B59B6);
    background: var(--bg-hover);
    transform: scale(1.05);
  }

  .slot-tab.filled {
    border-color: #27AE60;
  }

  .slot-tab-emoji {
    font-size: 24px;
  }

  .slot-tab-picto {
    width: 40px;
    height: 40px;
    object-fit: contain;
    display: block;
  }

  .slot-tab-label {
    font-size: 13px;
    font-weight: 600;
  }

  /* Word grid — BIG pictograms for kids */
  .word-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .word-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px;
    border: 3px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.15s;
  }

  .word-btn:hover {
    border-color: var(--accent, #9B59B6);
    background: var(--bg-hover);
    transform: scale(1.05);
  }

  /* Pictogram in word picker — large and clear */
  .picto-word {
    width: 96px;
    height: 96px;
    object-fit: contain;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .word-label {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }

  /* Selected word display */
  .selected-word {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--bg-hover);
    border-radius: 16px;
    border: 3px solid #27AE60;
  }

  .picto-large {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block !important;
  }

  .selected-word-text {
    font-size: 24px;
    font-weight: 700;
    flex: 1;
  }

  .remove-btn {
    background: #E74C3C;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;
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
    border-radius: 16px;
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
    background: var(--accent, #9B59B6);
    color: white;
  }

  .big-btn.secondary {
    background: var(--bg-card);
    color: var(--text);
    border: 2px solid var(--border);
  }

  /* Story view */
  .story-title {
    font-size: 32px;
    text-align: center;
    color: var(--accent, #8E44AD);
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
    background: var(--bg-hover);
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
  }

  .picto-badge {
    width: 56px;
    height: 56px;
    object-fit: contain;
    display: block !important;
  }

  .story-text {
    max-width: 700px;
    margin: 0 auto 24px;
    line-height: 1.8;
  }

  .story-text p {
    margin: 16px 0;
    color: var(--text);
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
    border: 2px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
  }

  .saved-card.favorite {
    border-color: var(--accent, #F1C40F);
    background: var(--bg-hover);
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
  }

  .saved-date {
    font-size: 14px;
    color: var(--text-muted);
  }

  .saved-preview {
    font-size: 16px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .saved-actions {
    display: flex;
    gap: 8px;
  }

  .saved-actions button {
    padding: 8px 16px;
    border: 2px solid var(--border);
    border-radius: 10px;
    background: var(--bg-card);
    font-size: 16px;
    cursor: pointer;
  }

  .empty-msg {
    text-align: center;
    font-size: 20px;
    color: var(--text-muted);
    padding: 40px;
  }

  /* Settings */
  .settings {
    margin-top: 24px;
    padding: 16px;
    border: 2px solid var(--border);
    border-radius: 16px;
  }

  .settings summary {
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }

  .settings label {
    display: block;
    margin: 12px 0;
    font-size: 16px;
  }

  .settings input[type="range"] {
    width: 100%;
    margin-top: 4px;
  }

  .credit {
    text-align: center;
    font-size: 14px;
    color: var(--text-muted);
    padding: 24px 0;
  }

  @media (max-width: 600px) {
    .template-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    .word-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
    .picto-word {
      width: 80px;
      height: 80px;
    }
    .top-bar h1 { font-size: 22px; }
    .step-line { width: 30px; }
  }
</style>
