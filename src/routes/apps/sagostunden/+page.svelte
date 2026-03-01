<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
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
    DJUR: { emoji: '🐾', label: 'Djur' },
    PLATS: { emoji: '🏠', label: 'Plats' },
    SAK: { emoji: '🎁', label: 'Sak' },
    MAT: { emoji: '🍎', label: 'Mat' },
    PERSON: { emoji: '👤', label: 'Person' },
    VERB: { emoji: '⚡', label: 'Handling' },
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
              onclick={() => { selectedTemplate = tmpl; selectedWords = {}; }}
            >
              <span class="template-title">{tmpl.title}</span>
              <span class="template-slots">
                {tmpl.slots.map(s => SLOT_LABELS[s]?.emoji || '').join(' ')}
              </span>
            </button>
          {/each}
        </div>
      </div>

      {#if selectedTemplate}
        <!-- Step 2: Pick words for slots -->
        <div class="step">
          <h2>2. {$t('sagostunden.pick_words')}</h2>
          <p class="hint">{$t('sagostunden.pick_words_hint')}</p>

          {#each neededSlots as slot}
            <div class="slot-section">
              <h3>{SLOT_LABELS[slot]?.emoji} {SLOT_LABELS[slot]?.label}</h3>

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
          <button class="big-btn primary" onclick={createStory}>
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
        <h2 class="story-title">{currentStory.template.title}</h2>

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
                <h3>{story.title}</h3>
                <span class="saved-date">
                  {new Date(story.createdAt).toLocaleDateString('sv-SE')}
                </span>
              </div>
              <p class="saved-preview">{story.paragraphs[0]}</p>
              <div class="saved-actions">
                <button onclick={() => { currentStory = { paragraphs: story.paragraphs, template: { title: story.title }, words: {} }; view = 'story'; }}>
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

  .step {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 24px;
    color: var(--text);
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    color: var(--accent, #8E44AD);
    margin: 16px 0 8px;
  }

  .hint {
    font-size: 16px;
    color: var(--text-muted);
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
  }

  .template-card.selected {
    border-color: var(--accent, #9B59B6);
    background: var(--bg-hover);
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
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.15s;
  }

  .word-btn:hover {
    border-color: var(--accent, #9B59B6);
    background: var(--bg-hover);
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
    background: var(--bg-hover);
    border-radius: 12px;
    font-size: 20px;
    font-weight: 700;
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
    border: 2px solid var(--border);
    border-radius: 16px;
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
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    }
    .top-bar h1 { font-size: 22px; }
  }
</style>