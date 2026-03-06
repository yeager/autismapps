<!--
  MouthMotor.svelte — Main articulation guide component.
  Sound grid → tap sound → see sagittal + front view + ARASAAC pictogram + TTS.
  Also includes sound pair comparison mode.
-->
<script>
  import { t } from '$lib/i18n';
  import { speak, stop } from '$lib/tts';
  import { fade, fly } from 'svelte/transition';
  import MouthDiagram from './MouthDiagram.svelte';
  import LipView from './LipView.svelte';
  import { sounds, SOUND_TYPES, SOUND_PAIRS, getSound, getSoundsByType } from '$lib/data/mouth-sounds';

  /** @type {'grid' | 'detail' | 'compare'} */
  let view = $state('grid');

  /** @type {import('$lib/data/mouth-sounds').sounds[0] | null} */
  let selectedSound = $state(null);

  /** @type {{ a: import('$lib/data/mouth-sounds').sounds[0], b: import('$lib/data/mouth-sounds').sounds[0], contrastKey: string } | null} */
  let selectedPair = $state(null);

  /** Whether to show sound pairs section */
  let showPairs = $state(false);

  function selectSound(sound) {
    selectedSound = sound;
    view = 'detail';
    playSound(sound);
  }

  function playSound(sound) {
    // Speak the sound itself, then example word
    const text = sound.symbol === sound.id
      ? `${sound.symbol}. ${sound.exampleWord}.`
      : `${sound.symbol}. ${sound.exampleWord}.`;
    speak(text, { rate: 0.2 });
  }

  function playSoundOnly(sound) {
    speak(sound.symbol, { rate: 0.15 });
  }

  function selectPair(pair) {
    const a = getSound(pair.a);
    const b = getSound(pair.b);
    if (a && b) {
      selectedPair = { a, b, contrastKey: pair.contrastKey };
      view = 'compare';
    }
  }

  function goBack() {
    if (view === 'detail' || view === 'compare') {
      stop();
      view = 'grid';
      selectedSound = null;
      selectedPair = null;
    }
  }

  // Airflow description key
  function airflowKey(af) {
    return `mouthMotor.airflow.${af}`;
  }

  // ARASAAC URL
  function arasaacUrl(id) {
    return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
  }
</script>

{#if view === 'grid'}
  <div class="grid-view" in:fade>
    <!-- Sound type sections -->
    {#each SOUND_TYPES as type}
      {@const typeSounds = getSoundsByType(type.id)}
      <section class="type-section">
        <h2 class="type-header" style="border-color: {type.color}">
          <span class="type-icon">{type.icon}</span>
          {$t(type.labelKey)}
        </h2>
        <div class="sound-grid">
          {#each typeSounds as sound}
            <button class="sound-btn" style="border-color: {type.color}; --accent: {type.color}"
              onclick={() => selectSound(sound)}
              aria-label="{sound.symbol} - {sound.exampleWord}">
              <span class="sound-symbol">{sound.symbol}</span>
              {#if sound.ipa !== sound.symbol}
                <span class="sound-ipa">/{sound.ipa}/</span>
              {/if}
            </button>
          {/each}
        </div>
      </section>
    {/each}

    <!-- Sound pairs toggle -->
    <button class="pairs-toggle" onclick={() => showPairs = !showPairs}>
      🔀 {$t('mouthMotor.compareSounds')}
      <span class="toggle-arrow">{showPairs ? '▲' : '▼'}</span>
    </button>

    {#if showPairs}
      <div class="pairs-section" transition:fly={{ y: 20, duration: 200 }}>
        <div class="pairs-grid">
          {#each SOUND_PAIRS as pair}
            <button class="pair-btn" onclick={() => selectPair(pair)}>
              <span class="pair-sounds">{pair.a} ↔ {pair.b}</span>
              <span class="pair-contrast">{$t(pair.contrastKey)}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

{:else if view === 'detail' && selectedSound}
  <div class="detail-view" in:fade>
    <button class="back-detail" onclick={goBack}>← {$t('mouthMotor.allSounds')}</button>

    <!-- Sound header -->
    <div class="detail-header">
      <span class="detail-symbol">{selectedSound.symbol}</span>
      <span class="detail-ipa">/{selectedSound.ipa}/</span>
      <button class="play-btn" onclick={() => playSoundOnly(selectedSound)} aria-label="Play sound">
        🔊
      </button>
    </div>

    <!-- Diagrams side by side -->
    <div class="diagrams">
      <div class="diagram-wrapper">
        <h3>{$t('mouthMotor.sideView')}</h3>
        <MouthDiagram sound={selectedSound} />
      </div>
      <div class="diagram-wrapper">
        <h3>{$t('mouthMotor.frontView')}</h3>
        <LipView sound={selectedSound} />
      </div>
    </div>

    <!-- Articulation details -->
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label">👄 {$t('mouthMotor.lips')}</span>
        <span class="detail-value">{$t(`mouthMotor.lips.${selectedSound.lips}`)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">👅 {$t('mouthMotor.tongue')}</span>
        <span class="detail-value">{$t(`mouthMotor.tongue.${selectedSound.tongue}`)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">🦷 {$t('mouthMotor.jaw')}</span>
        <span class="detail-value">{$t(`mouthMotor.jaw.${selectedSound.jaw}`)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">💨 {$t('mouthMotor.airflow')}</span>
        <span class="detail-value">{$t(airflowKey(selectedSound.airflow))}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">👃 {$t('mouthMotor.velum')}</span>
        <span class="detail-value">{$t(`mouthMotor.velum.${selectedSound.velum}`)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">🔔 {$t('mouthMotor.voicing')}</span>
        <span class="detail-value">{$t(selectedSound.voiced ? 'mouthMotor.voiced' : 'mouthMotor.voiceless')}</span>
      </div>
    </div>

    <!-- Example word with ARASAAC pictogram -->
    <div class="example-section">
      <h3>📖 {$t('mouthMotor.example')}</h3>
      <div class="example-card">
        <img src={arasaacUrl(selectedSound.exampleArasaac)} alt={selectedSound.exampleWord}
          class="arasaac-img" loading="lazy"
          onerror={(e) => e.target.style.display='none'} />
        <div class="example-text">
          <span class="example-word">{selectedSound.exampleWord}</span>
          <button class="play-word-btn" onclick={() => speak(selectedSound.exampleWord, { rate: 0.2 })}>
            🔊 {$t('mouthMotor.listen')}
          </button>
        </div>
      </div>
    </div>
  </div>

{:else if view === 'compare' && selectedPair}
  <div class="compare-view" in:fade>
    <button class="back-detail" onclick={goBack}>← {$t('mouthMotor.allSounds')}</button>

    <h2 class="compare-title">
      {selectedPair.a.symbol} ↔ {selectedPair.b.symbol}
      <span class="compare-contrast">{$t(selectedPair.contrastKey)}</span>
    </h2>

    <div class="compare-columns">
      <!-- Sound A -->
      <div class="compare-col">
        <button class="compare-sound-btn" onclick={() => playSoundOnly(selectedPair.a)}>
          <span class="compare-symbol">{selectedPair.a.symbol}</span>
          <span class="compare-ipa">/{selectedPair.a.ipa}/</span>
          🔊
        </button>
        <MouthDiagram sound={selectedPair.a} />
        <LipView sound={selectedPair.a} />
        <div class="compare-details">
          <p>👄 {$t(`mouthMotor.lips.${selectedPair.a.lips}`)}</p>
          <p>👅 {$t(`mouthMotor.tongue.${selectedPair.a.tongue}`)}</p>
          <p>🔔 {$t(selectedPair.a.voiced ? 'mouthMotor.voiced' : 'mouthMotor.voiceless')}</p>
        </div>
        <div class="compare-example">
          <img src={arasaacUrl(selectedPair.a.exampleArasaac)} alt={selectedPair.a.exampleWord}
            class="arasaac-img-sm" loading="lazy" onerror={(e) => e.target.style.display='none'} />
          <span>{selectedPair.a.exampleWord}</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="compare-divider">
        <span class="vs">VS</span>
      </div>

      <!-- Sound B -->
      <div class="compare-col">
        <button class="compare-sound-btn" onclick={() => playSoundOnly(selectedPair.b)}>
          <span class="compare-symbol">{selectedPair.b.symbol}</span>
          <span class="compare-ipa">/{selectedPair.b.ipa}/</span>
          🔊
        </button>
        <MouthDiagram sound={selectedPair.b} />
        <LipView sound={selectedPair.b} />
        <div class="compare-details">
          <p>👄 {$t(`mouthMotor.lips.${selectedPair.b.lips}`)}</p>
          <p>👅 {$t(`mouthMotor.tongue.${selectedPair.b.tongue}`)}</p>
          <p>🔔 {$t(selectedPair.b.voiced ? 'mouthMotor.voiced' : 'mouthMotor.voiceless')}</p>
        </div>
        <div class="compare-example">
          <img src={arasaacUrl(selectedPair.b.exampleArasaac)} alt={selectedPair.b.exampleWord}
            class="arasaac-img-sm" loading="lazy" onerror={(e) => e.target.style.display='none'} />
          <span>{selectedPair.b.exampleWord}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ─── Grid View ─── */
  .grid-view { display: flex; flex-direction: column; gap: 1.5rem; }

  .type-section { display: flex; flex-direction: column; gap: 0.75rem; }
  .type-header {
    font-size: 1.1rem; font-weight: 700; margin: 0;
    padding: 0.5rem 0.75rem;
    border-left: 4px solid var(--border);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .type-icon { font-size: 1.2rem; }

  .sound-grid {
    display: flex; flex-wrap: wrap; gap: 0.6rem;
    padding: 0 0.25rem;
  }

  .sound-btn {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-width: 56px; min-height: 56px;
    padding: 0.5rem 0.6rem;
    border: 3px solid var(--border);
    border-radius: 14px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    gap: 0.1rem;
  }
  .sound-btn:active { transform: scale(0.92); }
  .sound-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

  .sound-symbol { font-size: 1.4rem; font-weight: 800; }
  .sound-ipa { font-size: 0.65rem; color: var(--text-secondary); font-style: italic; }

  /* Sound Pairs */
  .pairs-toggle {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.8rem; width: 100%;
    border: 2px dashed var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    cursor: pointer; font-weight: 600; font-size: 1rem;
  }
  .toggle-arrow { font-size: 0.8rem; }

  .pairs-section { padding: 0.5rem 0; }
  .pairs-grid { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .pair-btn {
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    padding: 0.6rem 1rem; border: 2px solid var(--border); border-radius: 12px;
    background: var(--bg-card); cursor: pointer; min-height: 48px;
    transition: transform 0.15s;
  }
  .pair-btn:active { transform: scale(0.95); }
  .pair-sounds { font-size: 1.1rem; font-weight: 700; }
  .pair-contrast { font-size: 0.7rem; color: var(--text-secondary); }

  /* ─── Detail View ─── */
  .detail-view { display: flex; flex-direction: column; gap: 1.2rem; }

  .back-detail {
    align-self: flex-start;
    background: none; border: none; cursor: pointer;
    font-size: 1rem; font-weight: 600;
    color: var(--text-secondary);
    padding: 0.3rem 0; min-height: 44px;
    display: flex; align-items: center;
  }

  .detail-header {
    display: flex; align-items: baseline; gap: 0.8rem;
    justify-content: center;
  }
  .detail-symbol { font-size: 3rem; font-weight: 900; }
  .detail-ipa { font-size: 1.5rem; color: var(--text-secondary); font-style: italic; font-family: serif; }
  .play-btn {
    font-size: 1.8rem; background: none; border: none; cursor: pointer;
    min-width: 48px; min-height: 48px;
    display: flex; align-items: center; justify-content: center;
  }

  .diagrams {
    display: flex; gap: 1rem; justify-content: center; align-items: flex-start;
    flex-wrap: wrap;
  }
  .diagram-wrapper {
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
  }
  .diagram-wrapper h3 {
    font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin: 0;
  }

  .details-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;
  }
  .detail-item {
    display: flex; flex-direction: column; gap: 0.15rem;
    padding: 0.6rem 0.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .detail-label { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }
  .detail-value { font-size: 1rem; font-weight: 700; }

  .example-section { display: flex; flex-direction: column; gap: 0.5rem; }
  .example-section h3 { font-size: 1rem; margin: 0; }
  .example-card {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 16px;
  }
  .arasaac-img {
    width: 80px; height: 80px; object-fit: contain;
    border-radius: 8px; background: white;
  }
  .example-text { display: flex; flex-direction: column; gap: 0.4rem; }
  .example-word { font-size: 1.4rem; font-weight: 800; }
  .play-word-btn {
    font-size: 0.9rem; font-weight: 600;
    background: #3498DB; color: white;
    border: none; border-radius: 8px;
    padding: 0.4rem 0.8rem; cursor: pointer;
    min-height: 36px;
  }

  /* ─── Compare View ─── */
  .compare-view { display: flex; flex-direction: column; gap: 1rem; }
  .compare-title {
    text-align: center; font-size: 1.3rem; margin: 0;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  }
  .compare-contrast { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }

  .compare-columns {
    display: flex; gap: 0.5rem; align-items: flex-start;
  }
  .compare-col {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    min-width: 0;
  }
  .compare-divider {
    display: flex; align-items: center; justify-content: center;
    padding: 0 0.25rem;
    align-self: center;
  }
  .vs {
    font-weight: 900; font-size: 1rem; color: var(--text-secondary);
    background: var(--bg-card); border: 2px solid var(--border);
    border-radius: 50%; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
  }

  .compare-sound-btn {
    display: flex; align-items: baseline; gap: 0.3rem;
    background: none; border: 2px solid var(--border); border-radius: 10px;
    padding: 0.4rem 0.6rem; cursor: pointer; min-height: 44px;
    font-size: 0.9rem;
  }
  .compare-symbol { font-size: 1.5rem; font-weight: 900; }
  .compare-ipa { font-size: 0.8rem; color: var(--text-secondary); font-style: italic; }

  .compare-details {
    text-align: center; font-size: 0.8rem;
    display: flex; flex-direction: column; gap: 0.15rem;
  }
  .compare-details p { margin: 0; }

  .compare-example {
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
    font-weight: 700; font-size: 0.95rem;
  }
  .arasaac-img-sm {
    width: 50px; height: 50px; object-fit: contain;
    border-radius: 6px; background: white;
  }

  /* Responsive: stack compare on narrow screens */
  @media (max-width: 400px) {
    .compare-columns { flex-direction: column; align-items: center; }
    .compare-divider { padding: 0.5rem 0; }
    .diagrams { flex-direction: column; align-items: center; }
  }
</style>
