<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale, getLocaleDef, pick } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';
  import { ALL_WORDS, WORD_CATEGORIES, pictogramUrl, wordLabel, wordPicto, type Word, type WordCategory } from '$lib/sagostunden/words';
  import { TEMPLATES, type StoryTemplate } from '$lib/sagostunden/templates';
  import { generateStory, type GeneratedStory } from '$lib/sagostunden/engine';
  import { saveStory, getAllStories, deleteStory, toggleFavorite, type SavedStory } from '$lib/sagostunden/storage';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { awardStar, GoldStarBurst } from '$lib/rewards';

  // View state
  let view = $state<'select' | 'story' | 'saved'>('select');

  // Word selection
  let selectedCategory = $state<WordCategory>('djur');
  let selectedWords = $state<Record<string, Word>>({});

  // Template
  let selectedTemplate = $state<StoryTemplate | null>(null);

  // Generated story
  let currentStory = $state<GeneratedStory | null>(null);

  // Saved stories
  let savedStories = $state<SavedStory[]>([]);

  // Settings
  let fontSize = $state(24);
  let showPictograms = $state(true);
  let showStar = $state(false);

  // Story language: en keeps the Swedish stories as before (switch to en: 'en' to enable the English templates)
  const storyLang = $derived(pick({ sv: 'sv', en: 'sv', pt_BR: 'pt_BR' }, $locale));
  const label = (word: Word) => wordLabel(word, storyLang);
  const picto = (word: Word) => pictogramUrl(wordPicto(word, storyLang), 100);

  // Slots needed by current template
  let neededSlots = $derived(selectedTemplate?.slots ?? []);

  const SLOT_LABELS: Record<string, { emoji: string; key: string }> = {
    DJUR: { emoji: '🐾', key: 'sagostunden.slot.DJUR' },
    PLATS: { emoji: '🏠', key: 'sagostunden.slot.PLATS' },
    SAK: { emoji: '🎁', key: 'sagostunden.slot.SAK' },
    MAT: { emoji: '🍎', key: 'sagostunden.slot.MAT' },
    PERSON: { emoji: '👤', key: 'sagostunden.slot.PERSON' },
    VERB: { emoji: '⚡', key: 'sagostunden.slot.VERB' },
  };

  const SLOT_TO_CAT: Record<string, WordCategory> = {
    DJUR: 'djur',
    PLATS: 'platser',
    SAK: 'saker',
    MAT: 'mat',
    PERSON: 'personer',
    VERB: 'verb',
  };

  /** Template title in the UI language (sv / en / pt_BR; unknown locales fall back to en) */
  function templateTitle(template: StoryTemplate): string {
    return pick(template.title, $locale);
  }

  function savedStoryTitle(story: SavedStory): string {
    const template = TEMPLATES.find((item) => item.id === story.templateId);
    return template ? templateTitle(template) : story.title;
  }

  function selectWord(slot: string, word: Word) {
    selectedWords = { ...selectedWords, [slot]: word };
    speak(label(word));
    // Auto-advance: scroll to next empty slot
    setTimeout(() => {
      const nextEmpty = neededSlots.find(s => s !== slot && !selectedWords[s]);
      if (nextEmpty) {
        const el = document.getElementById(`slot-${nextEmpty}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // All slots filled — scroll to create button
        const btn = document.getElementById('create-btn');
        if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }

  function removeWord(slot: string) {
    const copy = { ...selectedWords };
    delete copy[slot];
    selectedWords = copy;
  }

  async function createStory() {
    if (!selectedTemplate) return;
    currentStory = generateStory(selectedTemplate, selectedWords, storyLang);
    view = 'story';
    await awardStar('sagostunden', 'rewards.star.completed');
    showStar = true;
    setTimeout(() => showStar = false, 2000);
  }

  async function randomStory() {
    currentStory = generateStory(undefined, undefined, storyLang);
    view = 'story';
    await awardStar('sagostunden', 'rewards.star.completed');
    showStar = true;
    setTimeout(() => showStar = false, 2000);
  }

  async function save() {
    if (!currentStory) return;
    await saveStory({
      storyId: currentStory.id,
      title: templateTitle(currentStory.template),
      // $state proxies can't be cloned into IndexedDB (DataCloneError): store a plain copy
      paragraphs: $state.snapshot(currentStory.paragraphs),
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

  async function removeSaved(id: number | undefined) {
    if (id === undefined) return;
    await deleteStory(id);
    await loadSaved();
  }

  async function toggleFav(id: number | undefined) {
    if (id === undefined) return;
    await toggleFavorite(id);
    await loadSaved();
  }

  function readAloud() {
    if (!currentStory) return;
    const text = currentStory.paragraphs.join(' ');
    speak(text);
  }

  function wordsForSlot(slot: string): Word[] {
    const cat = SLOT_TO_CAT[slot];
    return cat ? ALL_WORDS.filter(w => w.category === cat) : [];
  }

  function openSavedStory(story: SavedStory) {
    const storedTemplate = TEMPLATES.find(template => template.id === story.templateId);
    const template: StoryTemplate = storedTemplate ?? {
      id: story.templateId,
      title: { en: story.title },
      titleKey: '',
      slots: Object.keys(story.wordIds),
      paragraphs: { sv: story.paragraphs, en: story.paragraphs },
    };
    const words = Object.fromEntries(
      Object.entries(story.wordIds)
        .map(([slot, wordId]) => [slot, ALL_WORDS.find(word => word.id === wordId)])
        .filter((entry): entry is [string, Word] => entry[1] !== undefined)
    );

    currentStory = {
      id: story.storyId,
      template,
      words,
      paragraphs: story.paragraphs,
      locale: 'sv',
      createdAt: story.createdAt,
    };
    view = 'story';
  }

  // IndexedDB is available only in the browser, never during SSR/prerendering.
  onMount(() => {
    void loadSaved();
  });
</script>

<WelcomeDialog
  appId="sagostunden"
  titleKey="app.sagostunden"
  purposeKey="welcome.sagostunden.purpose"
  howKey="welcome.sagostunden.how"
  goalKey="welcome.sagostunden.goal"
  icon="📖"
/>

<GoldStarBurst show={showStar} />

<main class="sagostunden" style="--fs: {fontSize}px">
  <!-- Page title + tabs -->
  <div class="page-title">
    <h1>📖 {$t('app.sagostunden')}</h1>
    <div class="nav-tabs">
      <button class:active={view === 'select'} onclick={() => view = 'select'}>
        ✨ {$t('sagostunden.create')}
      </button>
      <button class:active={view === 'saved'} onclick={() => { view = 'saved'; loadSaved(); }}>
        💾 {$t('sagostunden.saved')}
      </button>
    </div>
  </div>

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
              onclick={() => { 
                selectedTemplate = tmpl; 
                selectedWords = {}; 
                speak(templateTitle(tmpl));
                // Scroll to first slot after template selection
                setTimeout(() => {
                  const firstSlot = tmpl.slots[0];
                  const el = document.getElementById(`slot-${firstSlot}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
              }}
            >
              <span class="template-title">{templateTitle(tmpl)}</span>
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
            <div class="slot-section" id="slot-{slot}">
              <h3>{SLOT_LABELS[slot]?.emoji} {$t(SLOT_LABELS[slot]?.key)}</h3>

              {#if selectedWords[slot]}
                <div class="selected-word">
                  {#if showPictograms}
                    <img
                      src={picto(selectedWords[slot])}
                      alt={label(selectedWords[slot])}
                      class="picto-small"
                      loading="lazy"
                    />
                  {/if}
                  <span>{label(selectedWords[slot])}</span>
                  <button class="remove-btn" onclick={() => removeWord(slot)}>✕</button>
                </div>
              {:else}
                <div class="word-grid">
                  {#each wordsForSlot(slot) as word}
                    <button
                      class="word-btn"
                      onclick={() => selectWord(slot, word)}
                    >
                      {#if showPictograms}
                        <img
                          src={picto(word)}
                          alt={label(word)}
                          class="picto-thumb"
                          loading="lazy"
                        />
                      {/if}
                      <span>{label(word)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Step 3: Generate -->
        <div class="step actions">
          <button class="big-btn primary" id="create-btn" onclick={createStory}>
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
        <h2 class="story-title">{templateTitle(currentStory.template)}</h2>

        <!-- Word pictograms row -->
        {#if showPictograms}
          <div class="story-words-row">
            {#each Object.entries(currentStory.words) as [slot, word]}
              <div class="story-word-badge">
                <img
                  src={picto(word)}
                  alt={label(word)}
                  class="picto-small"
                  loading="lazy"
                />
                <span>{label(word)}</span>
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
                <h3>{savedStoryTitle(story)}</h3>
                <span class="saved-date">
                  {new Date(story.createdAt).toLocaleDateString(getLocaleDef($locale).bcp47)}
                </span>
              </div>
              <p class="saved-preview">{story.paragraphs[0]}</p>
              <div class="saved-actions">
                <button onclick={() => openSavedStory(story)}>
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

  .page-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .page-title h1 {
    font-size: 28px;
    margin: 0;
    flex: 1;
  }

  .nav-tabs {
    display: flex;
    gap: 8px;
  }

  .nav-tabs button {
    padding: 10px 20px;
    border-radius: 12px;
    border: 2px solid #9B59B6;
    background: white;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-tabs button.active {
    background: #9B59B6;
    color: white;
  }

  .step {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 24px;
    color: #2C3E50;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    color: #8E44AD;
    margin: 16px 0 8px;
  }

  .hint {
    font-size: 16px;
    color: #666;
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
    border: 3px solid #ddd;
    border-radius: 16px;
    background: white;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-size: 16px;
  }

  .template-card:hover {
    border-color: #9B59B6;
    transform: translateY(-2px);
  }

  .template-card.selected {
    border-color: #9B59B6;
    background: #F3E5F5;
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
    border: 2px solid #ddd;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.15s;
  }

  .word-btn:hover {
    border-color: #9B59B6;
    background: #FAFAFA;
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
    background: #F3E5F5;
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
    border: 2px solid #eee;
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
    background: #9B59B6;
    color: white;
  }

  .big-btn.secondary {
    background: #ECF0F1;
    color: #2C3E50;
    border: 2px solid #BDC3C7;
  }

  /* Story view */
  .story-title {
    font-size: 32px;
    text-align: center;
    color: #8E44AD;
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
    background: #F3E5F5;
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
    color: #2C3E50;
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
    border: 2px solid #ddd;
    border-radius: 16px;
    background: white;
  }

  .saved-card.favorite {
    border-color: #F1C40F;
    background: #FFFDE7;
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
    color: #999;
  }

  .saved-preview {
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;
  }

  .saved-actions {
    display: flex;
    gap: 8px;
  }

  .saved-actions button {
    padding: 8px 16px;
    border: 2px solid #ddd;
    border-radius: 10px;
    background: white;
    font-size: 16px;
    cursor: pointer;
  }

  .empty-msg {
    text-align: center;
    font-size: 20px;
    color: #999;
    padding: 40px;
  }

  /* Settings */
  .settings {
    margin-top: 24px;
    padding: 16px;
    border: 2px solid #eee;
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
    color: #999;
    padding: 24px 0;
  }

  @media (max-width: 600px) {
    .template-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    .word-grid {
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    }
  }
</style>
