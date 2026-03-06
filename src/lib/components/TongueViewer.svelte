<script>
  import { t } from '$lib/i18n';
  import { speak, stop as stopTTS } from '$lib/tts';
  import { fade, fly } from 'svelte/transition';
  import SagittalView from './SagittalView.svelte';
  import SoundComparison from './SoundComparison.svelte';
  import { tonguePositions, soundLevels, practiceSequences } from '$lib/data/tongue-positions';

  // ─── STATE ───
  let currentSound = 'a';
  let targetSound = '';
  let showTarget = false;
  let darkMode = false;
  let slowMotion = false;
  let showComparison = false;
  let activeLevel = 0; // index into soundLevels
  let activeTab = 'sounds'; // 'sounds' | 'sequences'

  // Sequence playback
  let playingSequence = false;
  let sequenceIndex = -1;
  let activeSequence = null;

  $: currentPos = tonguePositions[currentSound] || null;
  $: targetPos = showTarget && targetSound ? tonguePositions[targetSound] : null;
  $: animDuration = slowMotion ? 1200 : 300;
  $: activeSounds = soundLevels[activeLevel]?.sounds || [];

  function selectSound(sound) {
    if (playingSequence) return;
    currentSound = sound;
    const pos = tonguePositions[sound];
    if (pos) {
      speakText(pos.example);
    }
  }

  function toggleTarget() {
    showTarget = !showTarget;
    if (showTarget && !targetSound) {
      // Pick a different sound from the same level
      const others = activeSounds.filter(s => s !== currentSound);
      targetSound = others[0] || currentSound;
    }
  }

  function setTargetSound(sound) {
    targetSound = sound;
  }

  async function speakText(text) {
    try {
      await speak(text);
    } catch (e) {
      console.warn('TTS failed:', e);
    }
  }

  // ─── SEQUENCE PLAYBACK ───
  async function playSequence(seq) {
    if (playingSequence) {
      stopSequence();
      return;
    }
    activeSequence = seq;
    playingSequence = true;
    sequenceIndex = 0;

    for (let i = 0; i < seq.sounds.length; i++) {
      if (!playingSequence) break;
      sequenceIndex = i;
      currentSound = seq.sounds[i];
      const pos = tonguePositions[seq.sounds[i]];

      // Wait for animation
      await sleep(animDuration + 100);

      // Speak sound
      if (pos && playingSequence) {
        await speakText(pos.label.toLowerCase());
        await sleep(slowMotion ? 800 : 300);
      }
    }

    playingSequence = false;
    sequenceIndex = -1;
    activeSequence = null;
  }

  function stopSequence() {
    playingSequence = false;
    sequenceIndex = -1;
    activeSequence = null;
    stopTTS();
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
</script>

<div class="tongue-viewer" class:dark={darkMode}>
  <!-- Top controls -->
  <div class="top-bar">
    <div class="top-controls">
      <button
        class="control-btn"
        class:active={slowMotion}
        on:click={() => slowMotion = !slowMotion}
        aria-label={$t('tongueViewer.slowMotion')}
        title={$t('tongueViewer.slowMotion')}
      >
        🐢 {$t('tongueViewer.slowMotion')}
      </button>
      <button
        class="control-btn"
        class:active={showTarget}
        on:click={toggleTarget}
        aria-label={$t('tongueViewer.showTarget')}
        title={$t('tongueViewer.showTarget')}
      >
        👻 {$t('tongueViewer.showTarget')}
      </button>
      <button
        class="control-btn"
        on:click={() => showComparison = true}
        aria-label={$t('tongueViewer.compare')}
        title={$t('tongueViewer.compare')}
      >
        🔀 {$t('tongueViewer.compare')}
      </button>
      <button
        class="control-btn icon-only"
        class:active={darkMode}
        on:click={() => darkMode = !darkMode}
        aria-label={$t('tongueViewer.darkMode')}
        title={$t('tongueViewer.darkMode')}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  </div>

  <!-- Main content: SVG + sound info -->
  <div class="main-area">
    <div class="svg-container">
      <SagittalView
        position={currentPos}
        targetPosition={targetPos}
        {darkMode}
        {animDuration}
        showAirflow={true}
      />
    </div>

    <!-- Current sound info -->
    {#if currentPos}
      <div class="sound-info" transition:fade={{ duration: 150 }}>
        <div class="sound-big">{currentPos.label}</div>
        <div class="sound-ipa">[{currentPos.ipa}]</div>
        <div class="sound-example">
          "{currentPos.example}"
          <button class="speak-inline" on:click={() => speakText(currentPos.example)} aria-label="Lyssna">
            🔊
          </button>
        </div>
        <div class="sound-features">
          {#if currentPos.voiced}
            <span class="feature voiced">🔔 {$t('tongueViewer.voiced')}</span>
          {:else}
            <span class="feature voiceless">🔕 {$t('tongueViewer.voiceless')}</span>
          {/if}
          {#if currentPos.contact}
            <span class="feature contact">👆 {currentPos.contact}</span>
          {/if}
          {#if currentPos.airflow}
            <span class="feature airflow">💨 {currentPos.airflow}</span>
          {/if}
          {#if currentPos.velum === 'open'}
            <span class="feature nasal">👃 {$t('tongueViewer.nasal')}</span>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Target sound picker (if target mode is on) -->
  {#if showTarget}
    <div class="target-picker" transition:fly={{ y: 20, duration: 200 }}>
      <span class="target-label">👻 {$t('tongueViewer.targetLabel')}:</span>
      <div class="target-sounds">
        {#each activeSounds as s}
          <button
            class="target-btn"
            class:active={targetSound === s}
            on:click={() => setTargetSound(s)}
          >
            {tonguePositions[s].label}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Tab selector -->
  <div class="tab-bar">
    <button
      class="tab-btn"
      class:active={activeTab === 'sounds'}
      on:click={() => activeTab = 'sounds'}
    >
      🔤 {$t('tongueViewer.tab.sounds')}
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'sequences'}
      on:click={() => activeTab = 'sequences'}
    >
      🔁 {$t('tongueViewer.tab.sequences')}
    </button>
  </div>

  <!-- Sound selector / Sequences -->
  {#if activeTab === 'sounds'}
    <!-- Level tabs -->
    <div class="level-tabs">
      {#each soundLevels as level, i}
        <button
          class="level-tab"
          class:active={activeLevel === i}
          on:click={() => activeLevel = i}
        >
          <span class="level-icon">{level.icon}</span>
          <span class="level-num">{level.level}</span>
          <span class="level-name">{$t(level.labelKey)}</span>
        </button>
      {/each}
    </div>

    <!-- Sound grid -->
    <div class="sound-grid">
      {#each activeSounds as sound}
        {@const pos = tonguePositions[sound]}
        <button
          class="sound-btn"
          class:active={currentSound === sound}
          class:playing={playingSequence && currentSound === sound}
          on:click={() => selectSound(sound)}
          disabled={playingSequence}
        >
          <span class="sound-letter">{pos.label}</span>
          <span class="sound-sub">[{pos.ipa}]</span>
        </button>
      {/each}
    </div>
  {:else}
    <!-- Practice sequences -->
    <div class="sequences-list">
      {#each practiceSequences as seq}
        <button
          class="sequence-btn"
          class:playing={activeSequence?.id === seq.id}
          on:click={() => playSequence(seq)}
        >
          <span class="seq-text">{seq.text}</span>
          <span class="seq-action">
            {#if activeSequence?.id === seq.id}
              ⏹️ {$t('tongueViewer.stop')}
            {:else}
              ▶️ {$t('tongueViewer.play')}
            {/if}
          </span>
        </button>
      {/each}
    </div>

    <!-- Sequence progress -->
    {#if playingSequence && activeSequence}
      <div class="seq-progress">
        {#each activeSequence.sounds as s, i}
          <span
            class="seq-dot"
            class:active={i === sequenceIndex}
            class:done={i < sequenceIndex}
          >
            {tonguePositions[s]?.label || s}
          </span>
        {/each}
      </div>
    {/if}
  {/if}

  <!-- Comparison modal -->
  {#if showComparison}
    <SoundComparison
      {darkMode}
      onClose={() => showComparison = false}
      onSpeak={speakText}
    />
  {/if}
</div>

<style>
  .tongue-viewer {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background: #faf8f5;
    color: #333;
    padding: 8px;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .tongue-viewer.dark {
    background: #0f0f23;
    color: #e0e0e0;
  }

  /* ─── TOP BAR ─── */
  .top-bar {
    display: flex;
    justify-content: center;
  }

  .top-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .control-btn {
    padding: 8px 14px;
    border: 2px solid #ddd;
    border-radius: 12px;
    background: #fff;
    font-size: 0.85rem;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;
  }

  .dark .control-btn {
    background: #1a1a2e;
    border-color: #333;
    color: #e0e0e0;
  }

  .control-btn.active {
    background: #4a90d9;
    color: #fff;
    border-color: #4a90d9;
  }

  .control-btn.icon-only {
    padding: 8px;
  }

  /* ─── MAIN AREA ─── */
  .main-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-height: 0;
  }

  .svg-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 50vh;
  }

  /* ─── SOUND INFO ─── */
  .sound-info {
    text-align: center;
    padding: 8px;
  }

  .sound-big {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    color: #e8506a;
  }

  .sound-ipa {
    font-size: 1.1rem;
    color: #888;
    font-style: italic;
  }

  .sound-example {
    font-size: 1rem;
    color: #666;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .dark .sound-example {
    color: #aaa;
  }

  .speak-inline {
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    padding: 4px;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sound-features {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 4px;
  }

  .feature {
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 500;
  }

  .feature.voiced { background: #e8f5e9; color: #2e7d32; }
  .feature.voiceless { background: #fce4ec; color: #c62828; }
  .feature.contact { background: #fff3e0; color: #e65100; }
  .feature.airflow { background: #e3f2fd; color: #1565c0; }
  .feature.nasal { background: #f3e5f5; color: #7b1fa2; }

  .dark .feature.voiced { background: rgba(46, 125, 50, 0.2); }
  .dark .feature.voiceless { background: rgba(198, 40, 40, 0.2); }
  .dark .feature.contact { background: rgba(230, 81, 0, 0.2); }
  .dark .feature.airflow { background: rgba(21, 101, 192, 0.2); }
  .dark .feature.nasal { background: rgba(123, 31, 162, 0.2); }

  /* ─── TARGET PICKER ─── */
  .target-picker {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px;
    background: rgba(74, 144, 217, 0.08);
    border-radius: 12px;
  }

  .target-label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .target-sounds {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .target-btn {
    padding: 6px 12px;
    border: 2px solid transparent;
    border-radius: 8px;
    background: rgba(74, 144, 217, 0.1);
    font-size: 0.9rem;
    cursor: pointer;
    min-width: 44px;
    min-height: 44px;
    font-weight: 600;
  }

  .target-btn.active {
    border-color: #e8506a;
    background: rgba(232, 80, 106, 0.15);
  }

  /* ─── TAB BAR ─── */
  .tab-bar {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  .tab-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 10px 10px 0 0;
    background: #eee;
    font-size: 0.9rem;
    cursor: pointer;
    min-height: 44px;
    font-weight: 500;
    transition: background 0.15s;
  }

  .dark .tab-btn {
    background: #252545;
    color: #ccc;
  }

  .tab-btn.active {
    background: #4a90d9;
    color: #fff;
  }

  /* ─── LEVEL TABS ─── */
  .level-tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    padding: 4px 0;
    -webkit-overflow-scrolling: touch;
  }

  .level-tab {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 2px solid #ddd;
    border-radius: 10px;
    background: #fff;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    min-height: 44px;
    transition: all 0.15s;
  }

  .dark .level-tab {
    background: #1a1a2e;
    border-color: #333;
    color: #ccc;
  }

  .level-tab.active {
    background: #4a90d9;
    color: #fff;
    border-color: #4a90d9;
  }

  .level-icon {
    font-size: 1.2rem;
  }

  .level-num {
    font-weight: 800;
    font-size: 0.9rem;
  }

  .level-name {
    font-weight: 500;
  }

  /* ─── SOUND GRID ─── */
  .sound-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 8px;
    padding: 8px 0;
  }

  .sound-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 8px;
    border: 3px solid #e0e0e0;
    border-radius: 14px;
    background: #fff;
    cursor: pointer;
    min-height: 64px;
    min-width: 64px;
    transition: all 0.15s;
  }

  .dark .sound-btn {
    background: #1a1a2e;
    border-color: #333;
    color: #e0e0e0;
  }

  .sound-btn:hover:not(:disabled) {
    transform: scale(1.05);
    border-color: #4a90d9;
  }

  .sound-btn.active {
    background: #e8506a;
    color: #fff;
    border-color: #e8506a;
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(232, 80, 106, 0.3);
  }

  .sound-btn.playing {
    animation: pulse 0.5s ease-in-out infinite;
  }

  .sound-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sound-letter {
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1;
  }

  .sound-sub {
    font-size: 0.7rem;
    opacity: 0.7;
    margin-top: 2px;
  }

  /* ─── SEQUENCES ─── */
  .sequences-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0;
  }

  .sequence-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border: 2px solid #e0e0e0;
    border-radius: 14px;
    background: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    min-height: 56px;
    transition: all 0.15s;
  }

  .dark .sequence-btn {
    background: #1a1a2e;
    border-color: #333;
    color: #e0e0e0;
  }

  .sequence-btn.playing {
    border-color: #e8506a;
    background: rgba(232, 80, 106, 0.08);
  }

  .seq-text {
    font-weight: 700;
    font-family: monospace;
    letter-spacing: 2px;
  }

  .seq-action {
    font-size: 0.9rem;
  }

  .seq-progress {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
    padding: 8px;
  }

  .seq-dot {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    background: #eee;
    color: #888;
    transition: all 0.2s;
  }

  .dark .seq-dot {
    background: #252545;
    color: #666;
  }

  .seq-dot.active {
    background: #e8506a;
    color: #fff;
    transform: scale(1.15);
  }

  .seq-dot.done {
    background: #4caf50;
    color: #fff;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1.08); }
    50% { transform: scale(1.15); }
  }

  /* ─── RESPONSIVE ─── */
  @media (min-width: 768px) {
    .tongue-viewer {
      padding: 16px;
      gap: 12px;
    }

    .sound-grid {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
    }
  }

  @media (max-width: 400px) {
    .control-btn:not(.icon-only) span {
      display: none;
    }
    .level-name {
      display: none;
    }
  }
</style>
