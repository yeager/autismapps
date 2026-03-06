<script lang="ts">
  /**
   * PromptGuide — Main PROMPT therapy guide component
   *
   * Provides a visual, step-by-step guide for PROMPT touch points
   * for Swedish speech sounds. Shows face diagram with highlighted
   * touch zones, directional arrows, and step-by-step instructions.
   */
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t, locale } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { browser } from '$app/environment';
  import { fade, fly, slide } from 'svelte/transition';

  import FaceDiagram from './FaceDiagram.svelte';
  import StepGuide from './StepGuide.svelte';
  import {
    promptData,
    CATEGORIES,
    PRESSURE_LEVELS,
    DURATION_TYPES,
    getSoundsByCategory,
    getArasaacUrl,
  } from '$lib/data/prompt-data.js';

  // ─── State ───
  let selectedCategory = $state<string | null>(null);
  let selectedSoundIdx = $state<number | null>(null);
  let currentStep = $state(0);
  let isSpeaking = $state(false);
  let showSafetyDisclaimer = $state(false);
  let disclaimerDismissed = $state(false);

  // Check if safety disclaimer has been seen
  if (browser) {
    const seen = localStorage.getItem('prompt-guide-disclaimer-seen');
    if (!seen) {
      showSafetyDisclaimer = true;
    } else {
      disclaimerDismissed = true;
    }
  }

  function dismissDisclaimer() {
    showSafetyDisclaimer = false;
    disclaimerDismissed = true;
    if (browser) {
      localStorage.setItem('prompt-guide-disclaimer-seen', 'true');
    }
  }

  // ─── Derived ───
  const categorySounds = $derived(
    selectedCategory ? getSoundsByCategory(selectedCategory) : []
  );
  const currentSound = $derived(
    selectedSoundIdx !== null && categorySounds.length > 0
      ? categorySounds[selectedSoundIdx]
      : null
  );
  const currentCategory = $derived(
    CATEGORIES.find(c => c.id === selectedCategory) ?? null
  );

  // i18n-aware labels
  const lang = $derived($locale?.startsWith('en') ? 'en' : 'sv');

  const pressureLabel = $derived(
    currentSound
      ? $t(PRESSURE_LEVELS[currentSound.pressure as keyof typeof PRESSURE_LEVELS]?.labelKey ?? '')
      : ''
  );
  const durationLabel = $derived(
    currentSound
      ? $t(DURATION_TYPES[currentSound.duration as keyof typeof DURATION_TYPES]?.labelKey ?? '')
      : ''
  );
  const steps = $derived(
    currentSound
      ? (lang === 'en' ? currentSound.steps_en : currentSound.steps_sv)
      : []
  );
  const description = $derived(
    currentSound
      ? (lang === 'en' ? currentSound.description_en : currentSound.description_sv)
      : ''
  );

  // ─── Actions ───
  function selectCategory(catId: string) {
    selectedCategory = catId;
    selectedSoundIdx = null;
    currentStep = 0;
  }

  function selectSound(idx: number) {
    selectedSoundIdx = idx;
    currentStep = 0;
  }

  function goBack() {
    if (selectedSoundIdx !== null) {
      selectedSoundIdx = null;
      currentStep = 0;
    } else if (selectedCategory) {
      selectedCategory = null;
    } else {
      goto(`${base}/`);
    }
  }

  async function playSound() {
    if (!currentSound || isSpeaking) return;
    isSpeaking = true;
    try {
      // Speak the sound itself, then the example word
      await speak(currentSound.sound, { rate: 0.3 });
      await new Promise(r => setTimeout(r, 400));
      await speak(currentSound.exampleWord, { rate: 0.4 });
    } catch (e) {
      console.warn('TTS error:', e);
    } finally {
      isSpeaking = false;
    }
  }

  async function speakWord() {
    if (!currentSound || isSpeaking) return;
    isSpeaking = true;
    try {
      await speak(currentSound.exampleWord, { rate: 0.4 });
    } catch (e) {
      console.warn('TTS error:', e);
    } finally {
      isSpeaking = false;
    }
  }
</script>

<!-- ═══════════════════════════════════════ -->
<!-- SAFETY DISCLAIMER MODAL                 -->
<!-- ═══════════════════════════════════════ -->
{#if showSafetyDisclaimer}
  <div class="disclaimer-overlay" transition:fade={{ duration: 200 }}>
    <div class="disclaimer-modal" in:fly={{ y: 30, duration: 300 }}>
      <div class="disclaimer-icon">⚠️</div>
      <h2>{$t('promptGuide.safety.title')}</h2>
      <div class="disclaimer-warnings">
        <div class="warning-item">
          <span class="warning-icon">👩‍⚕️</span>
          <p>{$t('promptGuide.safety.consultFirst')}</p>
        </div>
        <div class="warning-item">
          <span class="warning-icon">🤲</span>
          <p>{$t('promptGuide.safety.gentlePressure')}</p>
        </div>
        <div class="warning-item">
          <span class="warning-icon">🛑</span>
          <p>{$t('promptGuide.safety.stopIfUncomfortable')}</p>
        </div>
      </div>
      <button class="disclaimer-btn" onclick={dismissDisclaimer}>
        {$t('promptGuide.safety.understand')}
      </button>
    </div>
  </div>
{/if}

<div class="prompt-guide">
  <!-- Header -->
  <header class="app-header">
    <button class="back-btn" onclick={goBack} aria-label={$t('common.back')}>
      ←
    </button>
    <h1>
      {#if currentSound}
        <span class="sound-display">/{currentSound.ipa}/</span>
        <span class="sound-name">{currentSound.sound.toUpperCase()}</span>
      {:else if selectedCategory}
        <span>{currentCategory?.icon} {$t(currentCategory?.labelKey ?? '')}</span>
      {:else}
        <span>🤲 {$t('app.prompt_guide')}</span>
      {/if}
    </h1>
    {#if currentSound}
      <button
        class="tts-btn"
        onclick={playSound}
        disabled={isSpeaking}
        aria-label="Lyssna på ljudet"
      >
        {isSpeaking ? '⏳' : '🔊'}
      </button>
    {:else}
      <div style="width: 44px"></div>
    {/if}
  </header>

  <!-- Safety reminder banner (persistent, subtle) -->
  {#if disclaimerDismissed}
    <div class="safety-banner">
      ⚠️ {$t('promptGuide.safety.reminderShort')}
    </div>
  {/if}

  <!-- ═══ CATEGORY SELECTION ═══ -->
  {#if !selectedCategory}
    <section class="categories" in:fade={{ duration: 200 }}>
      <p class="intro-text">{$t('promptGuide.intro')}</p>
      <div class="category-grid">
        {#each CATEGORIES as cat}
          <button
            class="category-card"
            style="--cat-color: {cat.color}"
            onclick={() => selectCategory(cat.id)}
          >
            <span class="cat-icon">{cat.icon}</span>
            <span class="cat-label">{$t(cat.labelKey)}</span>
            <span class="cat-count">{getSoundsByCategory(cat.id).length} {$t('promptGuide.sounds')}</span>
          </button>
        {/each}
      </div>
    </section>

  <!-- ═══ SOUND SELECTION GRID ═══ -->
  {:else if selectedSoundIdx === null}
    <section class="sounds" in:fade={{ duration: 200 }}>
      <div class="sound-grid">
        {#each categorySounds as sound, i}
          <button
            class="sound-card"
            style="--cat-color: {currentCategory?.color}"
            onclick={() => selectSound(i)}
          >
            <span class="sound-letter">{sound.sound}</span>
            <span class="sound-ipa">/{sound.ipa}/</span>
            <span class="sound-word">{sound.exampleWord}</span>
          </button>
        {/each}
      </div>
    </section>

  <!-- ═══ SOUND DETAIL VIEW ═══ -->
  {:else if currentSound}
    <section class="sound-detail" in:fade={{ duration: 200 }}>
      <!-- Face Diagram + Touch Point -->
      <div class="detail-layout">
        <div class="diagram-side">
          <FaceDiagram
            touchZone={currentSound.touchZone}
            touchZoneSecondary={currentSound.touchZoneSecondary ?? ''}
            direction={currentSound.direction}
            pressure={currentSound.pressure}
            activeStep={currentStep + 1}
          />
        </div>

        <div class="info-side">
          <!-- Description -->
          <div class="description-card">
            <p>{description}</p>
          </div>

          <!-- Step-by-step guide -->
          <StepGuide
            {steps}
            bind:currentStep
            pressure={currentSound.pressure}
            duration={currentSound.duration}
            {pressureLabel}
            {durationLabel}
          />
        </div>
      </div>

      <!-- Example word with ARASAAC pictogram -->
      <div class="example-word-section">
        <div class="example-card" onclick={speakWord} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && speakWord()}>
          <img
            src={getArasaacUrl(currentSound.arasaacId)}
            alt={currentSound.exampleWord}
            class="arasaac-img"
            loading="lazy"
          />
          <div class="example-info">
            <span class="example-label">{$t('promptGuide.exampleWord')}</span>
            <span class="example-text">{currentSound.exampleWord}</span>
            <span class="example-sound">/{currentSound.ipa}/ i "{currentSound.exampleWord}"</span>
          </div>
          <span class="play-icon" class:speaking={isSpeaking}>🔊</span>
        </div>
      </div>

      <!-- Video placeholder -->
      {#if currentSound.videoPlaceholder}
        <div class="video-placeholder">
          <div class="video-thumb">
            <span class="video-play-icon">▶</span>
          </div>
          <div class="video-info">
            <span class="video-label">{$t('promptGuide.videoComingSoon')}</span>
            <span class="video-desc">{$t('promptGuide.videoDesc')}</span>
          </div>
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  /* ═══ GLOBAL ═══ */
  .prompt-guide {
    max-width: 900px;
    margin: 0 auto;
    padding: 0.5rem;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* ═══ HEADER ═══ */
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0;
    gap: 0.75rem;
  }

  .app-header h1 {
    font-size: 1.3rem;
    margin: 0;
    flex: 1;
    text-align: center;
    color: #2C3E50;
  }

  .sound-display {
    font-size: 1.6rem;
    font-weight: 800;
    color: #E74C3C;
    margin-right: 0.5rem;
  }

  .sound-name {
    font-size: 1.1rem;
    color: #7F8C8D;
    font-weight: 500;
  }

  .back-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #BDC3C7;
    background: white;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .back-btn:hover {
    border-color: #3498DB;
    color: #3498DB;
  }

  .tts-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #3498DB;
    background: white;
    font-size: 1.3rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tts-btn:hover:not(:disabled) {
    background: #3498DB;
  }

  .tts-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ═══ SAFETY ═══ */
  .safety-banner {
    background: #FFF3CD;
    color: #856404;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    text-align: center;
    margin-bottom: 0.75rem;
    border: 1px solid #FFE69C;
  }

  .disclaimer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .disclaimer-modal {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    max-width: 440px;
    width: 100%;
    text-align: center;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  .disclaimer-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .disclaimer-modal h2 {
    margin: 0 0 1.25rem;
    color: #2C3E50;
    font-size: 1.4rem;
  }

  .disclaimer-warnings {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .warning-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #FFF8E1;
    border-radius: 12px;
    border-left: 4px solid #F39C12;
  }

  .warning-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .warning-item p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: #333;
  }

  .disclaimer-btn {
    padding: 0.85rem 2rem;
    background: #27AE60;
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
  }

  .disclaimer-btn:hover {
    background: #219A52;
  }

  /* ═══ INTRO ═══ */
  .intro-text {
    text-align: center;
    color: #555;
    font-size: 1.05rem;
    margin: 0.5rem 0 1.25rem;
    line-height: 1.6;
  }

  /* ═══ CATEGORIES ═══ */
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 1.25rem 0.75rem;
    border-radius: 16px;
    border: 2.5px solid var(--cat-color);
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .category-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    background: color-mix(in srgb, var(--cat-color) 8%, white);
  }

  .cat-icon {
    font-size: 2.2rem;
  }

  .cat-label {
    font-weight: 700;
    font-size: 1rem;
    color: #2C3E50;
  }

  .cat-count {
    font-size: 0.8rem;
    color: #7F8C8D;
  }

  /* ═══ SOUND GRID ═══ */
  .sound-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem;
  }

  .sound-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1rem 0.5rem;
    border-radius: 14px;
    border: 2.5px solid var(--cat-color, #BDC3C7);
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .sound-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
    background: color-mix(in srgb, var(--cat-color) 8%, white);
  }

  .sound-letter {
    font-size: 1.8rem;
    font-weight: 800;
    color: #2C3E50;
  }

  .sound-ipa {
    font-size: 0.85rem;
    color: #7F8C8D;
    font-style: italic;
  }

  .sound-word {
    font-size: 0.8rem;
    color: #95A5A6;
  }

  /* ═══ SOUND DETAIL ═══ */
  .detail-layout {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .diagram-side {
    flex: 0 0 auto;
    width: 45%;
    min-width: 200px;
  }

  .info-side {
    flex: 1;
    min-width: 0;
  }

  .description-card {
    background: #F8F9FA;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    border-left: 4px solid #3498DB;
  }

  .description-card p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.6;
    color: #333;
  }

  /* ═══ EXAMPLE WORD ═══ */
  .example-word-section {
    margin-bottom: 1rem;
  }

  .example-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: white;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.2s;
  }

  .example-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  }

  .arasaac-img {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    object-fit: contain;
    background: #F5F5F5;
    padding: 4px;
  }

  .example-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .example-label {
    font-size: 0.75rem;
    color: #95A5A6;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .example-text {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2C3E50;
  }

  .example-sound {
    font-size: 0.85rem;
    color: #7F8C8D;
    font-style: italic;
  }

  .play-icon {
    font-size: 1.5rem;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .play-icon.speaking {
    opacity: 1;
    animation: pulse-icon 1s ease-in-out infinite;
  }

  @keyframes pulse-icon {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  /* ═══ VIDEO PLACEHOLDER ═══ */
  .video-placeholder {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #F0F0F0;
    border-radius: 14px;
    border: 2px dashed #BDC3C7;
    opacity: 0.7;
  }

  .video-thumb {
    width: 80px;
    height: 56px;
    background: #333;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .video-play-icon {
    color: white;
    font-size: 1.5rem;
    opacity: 0.7;
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .video-label {
    font-weight: 600;
    color: #555;
    font-size: 0.95rem;
  }

  .video-desc {
    font-size: 0.8rem;
    color: #95A5A6;
  }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 640px) {
    .detail-layout {
      flex-direction: column;
    }

    .diagram-side {
      width: 100%;
      max-width: 280px;
      margin: 0 auto;
    }

    .category-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .sound-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 641px) and (max-width: 900px) {
    .diagram-side {
      width: 40%;
    }
  }
</style>
