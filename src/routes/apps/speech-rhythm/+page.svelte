<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // === TALRYTMEN — Speech Rhythm ===
  // Prosody/rhythm training for CAS
  // Based on research showing prosody deficits are core to CAS
  // Tap-along, stress patterns, intonation contours

  type Mode = 'menu' | 'tap' | 'stress' | 'intonation';

  interface RhythmWord {
    text: string;
    syllables: string[];
    stressIndex: number;
    icon: string;
  }

  const RHYTHM_WORDS: RhythmWord[] = [
    { text: 'mamma', syllables: ['MAM', 'ma'], stressIndex: 0, icon: '👩' },
    { text: 'pappa', syllables: ['PAP', 'pa'], stressIndex: 0, icon: '👨' },
    { text: 'banan', syllables: ['ba', 'NAN'], stressIndex: 1, icon: '🍌' },
    { text: 'telefon', syllables: ['te', 'le', 'FON'], stressIndex: 2, icon: '📞' },
    { text: 'elefant', syllables: ['e', 'le', 'FANT'], stressIndex: 2, icon: '🐘' },
    { text: 'kanin', syllables: ['ka', 'NIN'], stressIndex: 1, icon: '🐰' },
    { text: 'krokodil', syllables: ['kro', 'ko', 'DIL'], stressIndex: 2, icon: '🐊' },
    { text: 'bil', syllables: ['BIL'], stressIndex: 0, icon: '🚗' },
    { text: 'hund', syllables: ['HUND'], stressIndex: 0, icon: '🐕' },
    { text: 'choklad', syllables: ['CHOK', 'lad'], stressIndex: 0, icon: '🍫' },
    { text: 'glass', syllables: ['GLASS'], stressIndex: 0, icon: '🍦' },
    { text: 'dator', syllables: ['DA', 'tor'], stressIndex: 0, icon: '💻' },
    { text: 'paraply', syllables: ['pa', 'ra', 'PLY'], stressIndex: 2, icon: '☂️' },
    { text: 'popcorn', syllables: ['POP', 'corn'], stressIndex: 0, icon: '🍿' },
    { text: 'fotboll', syllables: ['FOT', 'boll'], stressIndex: 0, icon: '⚽' },
  ];

  interface IntonationPattern {
    text: string;
    icon: string;
    contour: number[];
    type: 'statement' | 'question' | 'exclamation';
  }

  const INTONATION_PATTERNS: IntonationPattern[] = [
    { text: 'Det är en katt.', icon: '🐱', contour: [3, 3, 2, 3, 2], type: 'statement' },
    { text: 'Är det en katt?', icon: '🐱', contour: [3, 3, 2, 3, 5], type: 'question' },
    { text: 'Vilken fin katt!', icon: '🐱', contour: [4, 3, 4, 5, 3], type: 'exclamation' },
    { text: 'Jag vill ha glass.', icon: '🍦', contour: [3, 3, 2, 3, 2], type: 'statement' },
    { text: 'Vill du ha glass?', icon: '🍦', contour: [3, 2, 2, 3, 5], type: 'question' },
    { text: 'Vad god glass!', icon: '🍦', contour: [4, 4, 5, 3], type: 'exclamation' },
  ];

  let mode = $state<Mode>('menu');
  let currentWordIdx = $state(0);
  let currentIntonationIdx = $state(0);
  let bpm = $state(80);
  let score = $state(0);
  let streak = $state(0);
  let taps = $state<number[]>([]);
  let isPlaying = $state(false);
  let metronomeActive = $state(false);
  let metronomeTimer = $state<number | null>(null);
  let metronomeBeat = $state(0);
  let selectedStress = $state<number | null>(null);
  let showResult = $state(false);

  const currentWord = $derived(RHYTHM_WORDS[currentWordIdx]);
  const currentIntonation = $derived(INTONATION_PATTERNS[currentIntonationIdx]);

  function startMetronome() {
    stopMetronome();
    metronomeActive = true;
    metronomeBeat = 0;
    const interval = 60000 / bpm;
    metronomeTimer = setInterval(() => {
      metronomeBeat = (metronomeBeat + 1) % 4;
    }, interval) as unknown as number;
  }

  function stopMetronome() {
    if (metronomeTimer) { clearInterval(metronomeTimer); metronomeTimer = null; }
    metronomeActive = false;
  }

  function handleTap() { taps = [...taps, Date.now()]; }

  async function playWord() {
    if (isPlaying) return;
    isPlaying = true;
    await speak(currentWord.text, { rate: 0.7 });
    isPlaying = false;
  }

  async function playIntonation() {
    if (isPlaying) return;
    isPlaying = true;
    await speak(currentIntonation.text, { rate: 0.7 });
    isPlaying = false;
  }

  function checkStress(idx: number) {
    selectedStress = idx;
    showResult = true;
    if (idx === currentWord.stressIndex) { score++; streak++; } else { streak = 0; }
  }

  function nextWord() {
    currentWordIdx = (currentWordIdx + 1) % RHYTHM_WORDS.length;
    selectedStress = null; showResult = false; taps = [];
  }

  function nextIntonation() {
    currentIntonationIdx = (currentIntonationIdx + 1) % INTONATION_PATTERNS.length;
  }

  function goBack() {
    if (mode !== 'menu') { stopMetronome(); mode = 'menu'; } else { goto(`${base}/`); }
  }
</script>

<WelcomeDialog appId="speech-rhythm" titleKey="app.speech_rhythm" purposeKey="welcome.speechRhythm.purpose" howKey="welcome.speechRhythm.how" goalKey="welcome.speechRhythm.goal" icon="🎵" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={goBack}>←</button>
    <h1>🎵 {$t('speechRhythm.title')}</h1>
    {#if mode !== 'menu'}<span class="score-badge">{$t('speechRhythm.score')}: {score}</span>{/if}
  </header>

  <main class="cnt">
    {#if mode === 'menu'}
      <p class="intro">{$t('speechRhythm.intro')}</p>
      <div class="modes">
        <button class="mode-card tap-bg" onclick={() => { mode = 'tap'; taps = []; }}>
          <span class="mode-icon">🥁</span>
          <span class="mode-name">{$t('speechRhythm.mode.tap')}</span>
          <span class="mode-desc">{$t('speechRhythm.tap.instruction')}</span>
        </button>
        <button class="mode-card stress-bg" onclick={() => { mode = 'stress'; selectedStress = null; showResult = false; }}>
          <span class="mode-icon">💪</span>
          <span class="mode-name">{$t('speechRhythm.mode.stress')}</span>
          <span class="mode-desc">{$t('speechRhythm.stress.instruction')}</span>
        </button>
        <button class="mode-card intonation-bg" onclick={() => mode = 'intonation'}>
          <span class="mode-icon">🎶</span>
          <span class="mode-name">{$t('speechRhythm.mode.intonation')}</span>
          <span class="mode-desc">{$t('speechRhythm.intonation.instruction')}</span>
        </button>
      </div>

    {:else if mode === 'tap'}
      <div class="exercise">
        <div class="word-display">
          <span class="word-icon">{currentWord.icon}</span>
          <span class="word-text">{currentWord.text}</span>
          <div class="syllable-boxes">
            {#each currentWord.syllables as syl, i}
              <span class="syl-box" class:stressed={i === currentWord.stressIndex}>{syl}</span>
            {/each}
          </div>
        </div>
        <button class="btn listen-btn" onclick={playWord} disabled={isPlaying}>🔊 {$t('speechRhythm.listen')}</button>
        <div class="metronome">
          <div class="tempo-control">
            <label>{$t('speechRhythm.speed')}: {bpm} {$t('speechRhythm.bpm')}</label>
            <input type="range" min="40" max="120" step="10" bind:value={bpm} />
          </div>
          <div class="metro-dots">
            {#each [0,1,2,3] as beat}
              <div class="metro-dot" class:active={metronomeActive && metronomeBeat === beat}></div>
            {/each}
          </div>
          <button class="btn metro-btn" onclick={() => metronomeActive ? stopMetronome() : startMetronome()}>
            {metronomeActive ? '⏹️ Stop' : '▶️ Start'}
          </button>
        </div>
        <button class="tap-area" onclick={handleTap}>🥁<span class="tap-count">{taps.length} tapp{taps.length !== 1 ? 'ar' : ''}</span></button>
        <button class="btn next-btn" onclick={nextWord}>{$t('speechRhythm.next')} →</button>
      </div>

    {:else if mode === 'stress'}
      <div class="exercise">
        <div class="word-display">
          <span class="word-icon">{currentWord.icon}</span>
          <span class="word-text">{currentWord.text}</span>
        </div>
        <button class="btn listen-btn" onclick={playWord} disabled={isPlaying}>🔊 {$t('speechRhythm.listen')}</button>
        <p class="instruction">{$t('speechRhythm.stress.instruction')}</p>
        <div class="syllable-picker">
          {#each currentWord.syllables as syl, i}
            <button class="syl-btn" class:correct={showResult && i === currentWord.stressIndex} class:wrong={showResult && selectedStress === i && i !== currentWord.stressIndex} onclick={() => !showResult && checkStress(i)} disabled={showResult}>{syl}</button>
          {/each}
        </div>
        {#if showResult}
          <p class="result" class:success={selectedStress === currentWord.stressIndex}>
            {selectedStress === currentWord.stressIndex ? $t('speechRhythm.correct') : $t('speechRhythm.tryAgain')}
          </p>
        {/if}
        <div class="stats"><span>{$t('speechRhythm.streak')}: {streak} 🔥</span></div>
        <button class="btn next-btn" onclick={nextWord}>{$t('speechRhythm.next')} →</button>
      </div>

    {:else if mode === 'intonation'}
      <div class="exercise">
        <div class="word-display">
          <span class="word-icon">{currentIntonation.icon}</span>
          <span class="word-text intonation-text">{currentIntonation.text}</span>
          <span class="type-badge">{currentIntonation.type === 'question' ? '❓' : currentIntonation.type === 'exclamation' ? '❗' : '📝'}</span>
        </div>
        <div class="contour-viz">
          {#each currentIntonation.contour as pitch}
            <div class="contour-bar" style="height: {pitch * 20}%; background: hsl({200 + pitch * 30}, 70%, 50%);"><span class="contour-dot"></span></div>
          {/each}
        </div>
        <p class="instruction">{$t('speechRhythm.intonation.instruction')}</p>
        <button class="btn listen-btn" onclick={playIntonation} disabled={isPlaying}>🔊 {$t('speechRhythm.listen')}</button>
        <button class="btn next-btn" onclick={nextIntonation}>{$t('speechRhythm.next')} →</button>
      </div>
    {/if}
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app{min-height:100dvh;display:flex;flex-direction:column;background:var(--bg);color:var(--text)}
  .hdr{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:.75rem;padding:1rem;background:var(--bg-card);border-bottom:1px solid var(--border)}
  .back{font-size:1.5rem;background:none;border:none;cursor:pointer;color:var(--text);min-width:48px;min-height:48px;display:flex;align-items:center;justify-content:center}
  h1{font-size:1.4rem;margin:0;flex:1}
  .score-badge{background:#E91E63;color:#fff;padding:.3rem .7rem;border-radius:12px;font-weight:700;font-size:.85rem}
  .cnt{flex:1;padding:1rem;max-width:600px;margin:0 auto;width:100%}
  .intro{text-align:center;color:var(--text-secondary);margin-bottom:1.5rem;font-size:1.1rem}
  .modes{display:flex;flex-direction:column;gap:1rem}
  .mode-card{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;border:2px solid var(--border);border-radius:20px;background:var(--bg-card);cursor:pointer;text-align:center}
  .mode-card:active{transform:scale(.97)}
  .tap-bg{border-color:#E67E22} .stress-bg{border-color:#9B59B6} .intonation-bg{border-color:#3498DB}
  .mode-icon{font-size:2.5rem} .mode-name{font-weight:700;font-size:1.2rem} .mode-desc{font-size:.9rem;color:var(--text-secondary)}
  .exercise{display:flex;flex-direction:column;align-items:center;gap:1.2rem}
  .word-display{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;background:var(--bg-card);border-radius:20px;border:2px solid var(--border);width:100%}
  .word-icon{font-size:3rem} .word-text{font-size:2rem;font-weight:800;letter-spacing:2px} .intonation-text{font-size:1.5rem;letter-spacing:1px}
  .syllable-boxes{display:flex;gap:.5rem}
  .syl-box{padding:.5rem .8rem;border-radius:10px;background:var(--bg);font-weight:700;font-size:1.1rem;border:2px solid var(--border)}
  .syl-box.stressed{background:#E91E63;color:#fff;border-color:#E91E63;font-size:1.3rem}
  .btn{padding:.7rem 1.2rem;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);font-size:1rem;cursor:pointer;font-weight:600;min-height:48px}
  .btn:disabled{opacity:.5}
  .listen-btn{background:#2ECC71;color:#fff;border-color:#2ECC71;font-size:1.1rem}
  .next-btn{background:#3498DB;color:#fff;border-color:#3498DB}
  .metronome{display:flex;flex-direction:column;align-items:center;gap:.5rem;width:100%;padding:1rem;background:var(--bg-card);border-radius:16px;border:2px solid var(--border)}
  .tempo-control{display:flex;flex-direction:column;align-items:center;gap:.3rem;width:100%}
  .tempo-control label{font-weight:600;font-size:.9rem}
  .tempo-control input[type="range"]{width:70%;accent-color:#E67E22}
  .metro-dots{display:flex;gap:1rem}
  .metro-dot{width:24px;height:24px;border-radius:50%;background:var(--border);transition:all .1s}
  .metro-dot.active{background:#E67E22;transform:scale(1.3);box-shadow:0 0 12px rgba(230,126,34,.6)}
  .metro-btn{background:#E67E22;color:#fff;border-color:#E67E22}
  .tap-area{width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,#E67E22,#D35400);color:#fff;border:4px solid #BF6516;font-size:3rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(230,126,34,.4)}
  .tap-area:active{transform:scale(.9)}
  .tap-count{font-size:.8rem;font-weight:600}
  .instruction{text-align:center;font-size:1rem;color:var(--text-secondary);font-style:italic}
  .syllable-picker{display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center}
  .syl-btn{padding:.8rem 1.5rem;border-radius:14px;border:3px solid var(--border);background:var(--bg-card);font-size:1.3rem;font-weight:700;cursor:pointer;min-width:60px;min-height:56px}
  .syl-btn:active{transform:scale(.95)}
  .syl-btn.correct{border-color:#2ECC71;background:#2ECC71;color:#fff}
  .syl-btn.wrong{border-color:#E74C3C;background:#E74C3C;color:#fff}
  .result{font-size:1.3rem;font-weight:700;text-align:center}
  .result.success{color:#2ECC71} .result:not(.success){color:#E74C3C}
  .stats{font-size:.95rem;font-weight:600}
  .contour-viz{display:flex;align-items:flex-end;gap:6px;height:120px;padding:1rem;background:var(--bg-card);border-radius:16px;border:2px solid var(--border);width:100%;justify-content:center}
  .contour-bar{width:30px;border-radius:8px 8px 0 0;display:flex;justify-content:center;align-items:flex-start;padding-top:4px;transition:height .3s;min-height:10%}
  .contour-dot{width:12px;height:12px;border-radius:50%;background:#fff}
  .type-badge{font-size:1.5rem}
  .cr{text-align:center;padding:.5rem;font-size:.75rem;color:var(--text-secondary)}
</style>
