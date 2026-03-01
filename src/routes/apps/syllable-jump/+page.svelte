<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, scale } from 'svelte/transition';

  // === STAVELSEHOPPET — Syllable Jumping Game ===
  // Break words into syllables with visual/rhythmic cues
  // Tap along with syllable beats — motor planning for CAS

  type WordEntry = {
    word: string;
    syllables: string[];
    icon: string;
  };

  const WORD_SETS: { labelKey: string; words: WordEntry[] }[] = [
    {
      labelKey: 'syllableJump.set.easy',
      words: [
        { word: 'mamma', syllables: ['mam', 'ma'], icon: '👩' },
        { word: 'pappa', syllables: ['pap', 'pa'], icon: '👨' },
        { word: 'banan', syllables: ['ba', 'nan'], icon: '🍌' },
        { word: 'lampa', syllables: ['lam', 'pa'], icon: '💡' },
        { word: 'kissa', syllables: ['kis', 'sa'], icon: '🐱' },
        { word: 'bada', syllables: ['ba', 'da'], icon: '🛁' },
        { word: 'sova', syllables: ['so', 'va'], icon: '😴' },
        { word: 'äta', syllables: ['ä', 'ta'], icon: '🍽️' },
      ]
    },
    {
      labelKey: 'syllableJump.set.medium',
      words: [
        { word: 'elefant', syllables: ['e', 'le', 'fant'], icon: '🐘' },
        { word: 'telefon', syllables: ['te', 'le', 'fon'], icon: '📱' },
        { word: 'banana', syllables: ['ba', 'na', 'na'], icon: '🍌' },
        { word: 'paraply', syllables: ['pa', 'ra', 'ply'], icon: '☂️' },
        { word: 'tomat', syllables: ['to', 'mat'], icon: '🍅' },
        { word: 'cykel', syllables: ['cy', 'kel'], icon: '🚲' },
        { word: 'potatis', syllables: ['po', 'ta', 'tis'], icon: '🥔' },
        { word: 'kanin', syllables: ['ka', 'nin'], icon: '🐰' },
      ]
    },
    {
      labelKey: 'syllableJump.set.hard',
      words: [
        { word: 'helikopter', syllables: ['he', 'li', 'kop', 'ter'], icon: '🚁' },
        { word: 'krokodil', syllables: ['kro', 'ko', 'dil'], icon: '🐊' },
        { word: 'fjäril', syllables: ['fjä', 'ril'], icon: '🦋' },
        { word: 'dinosaurie', syllables: ['di', 'no', 'sau', 'ri', 'e'], icon: '🦕' },
        { word: 'vattenmelon', syllables: ['vat', 'ten', 'me', 'lon'], icon: '🍉' },
        { word: 'jordgubbe', syllables: ['jord', 'gub', 'be'], icon: '🍓' },
        { word: 'ambulans', syllables: ['am', 'bu', 'lans'], icon: '🚑' },
        { word: 'choklad', syllables: ['chok', 'lad'], icon: '🍫' },
      ]
    },
  ];

  let selectedSetIdx = $state<number | null>(null);
  let currentWordIdx = $state(0);
  let tappedSyllables = $state<number[]>([]);
  let isPlaying = $state(false);
  let speechRate = $state(0.6);
  let showCelebration = $state(false);
  let bounceIdx = $state(-1);

  const currentSet = $derived(selectedSetIdx !== null ? WORD_SETS[selectedSetIdx] : null);
  const currentWord = $derived(currentSet ? currentSet.words[currentWordIdx] : null);
  const allTapped = $derived(
    currentWord ? tappedSyllables.length >= currentWord.syllables.length : false
  );

  function selectSet(idx: number) {
    selectedSetIdx = idx;
    currentWordIdx = 0;
    tappedSyllables = [];
    showCelebration = false;
  }

  async function tapSyllable(idx: number) {
    if (!currentWord || isPlaying || idx !== tappedSyllables.length) return;
    isPlaying = true;
    bounceIdx = idx;
    tappedSyllables = [...tappedSyllables, idx];
    await speak(currentWord.syllables[idx], { rate: speechRate });
    setTimeout(() => { bounceIdx = -1; }, 400);
    isPlaying = false;

    // If all tapped, say the whole word
    if (tappedSyllables.length >= currentWord.syllables.length) {
      await new Promise(r => setTimeout(r, 500));
      isPlaying = true;
      await speak(currentWord.word, { rate: Math.min(speechRate + 0.2, 1.0) });
      isPlaying = false;
    }
  }

  async function playWholeWord() {
    if (!currentWord || isPlaying) return;
    isPlaying = true;
    // Animate each syllable in sequence
    for (let i = 0; i < currentWord.syllables.length; i++) {
      bounceIdx = i;
      tappedSyllables = currentWord.syllables.map((_, j) => j).filter(j => j <= i);
      await speak(currentWord.syllables[i], { rate: speechRate });
      await new Promise(r => setTimeout(r, 300));
    }
    bounceIdx = -1;
    await new Promise(r => setTimeout(r, 400));
    await speak(currentWord.word, { rate: Math.min(speechRate + 0.2, 1.0) });
    isPlaying = false;
  }

  function nextWord() {
    if (!currentSet) return;
    if (currentWordIdx < currentSet.words.length - 1) {
      currentWordIdx++;
      tappedSyllables = [];
    } else {
      showCelebration = true;
    }
  }

  function resetWord() {
    tappedSyllables = [];
  }
</script>

<WelcomeDialog appId="syllable-jump" titleKey="app.syllable_jump" purposeKey="welcome.syllableJump.purpose" howKey="welcome.syllableJump.how" goalKey="welcome.syllableJump.goal" icon="🦘" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedSetIdx !== null ? (selectedSetIdx = null, showCelebration = false) : goto(`${base}/`)}>←</button>
    <h1>🦘 {$t('syllableJump.title')}</h1>
  </header>

  <main class="cnt">
    {#if selectedSetIdx === null}
      <p class="intro">{$t('syllableJump.intro')}</p>
      <div class="sets">
        {#each WORD_SETS as set, i}
          <button class="set-card" onclick={() => selectSet(i)}>
            <span class="set-stars">{'⭐'.repeat(i + 1)}</span>
            <span class="set-name">{$t(set.labelKey)}</span>
            <span class="set-count">{set.words.length} {$t('syllableJump.words')}</span>
          </button>
        {/each}
      </div>
    {:else if showCelebration}
      <div class="celebration" transition:fade>
        <span class="trophy">🎉</span>
        <p>{$t('syllableJump.setDone')}</p>
        <button class="btn" onclick={() => { selectedSetIdx = null; showCelebration = false; }}>
          {$t('syllableJump.backToSets')}
        </button>
      </div>
    {:else if currentWord}
      <div class="word-view">
        <div class="speed-control">
          <label>{$t('syllableJump.speed')}: {speechRate.toFixed(1)}x</label>
          <input type="range" min="0.4" max="1.0" step="0.1" bind:value={speechRate} />
        </div>

        <div class="progress">{currentWordIdx + 1} / {currentSet?.words.length}</div>

        <div class="word-icon" class:bounce={allTapped}>{currentWord.icon}</div>
        <div class="word-text">{currentWord.word}</div>

        <div class="syllables">
          {#each currentWord.syllables as syl, i}
            <button
              class="syl-btn"
              class:tapped={tappedSyllables.includes(i)}
              class:next={i === tappedSyllables.length}
              class:bouncing={bounceIdx === i}
              onclick={() => tapSyllable(i)}
              disabled={isPlaying || i !== tappedSyllables.length}
              transition:scale={{ delay: i * 80 }}
            >
              {syl}
            </button>
          {/each}
        </div>

        <p class="syllable-count">
          {currentWord.syllables.length} {$t('syllableJump.syllableCount')}
        </p>

        <div class="actions">
          <button class="btn listen" onclick={playWholeWord} disabled={isPlaying}>
            🔊 {$t('syllableJump.listen')}
          </button>
          <button class="btn reset" onclick={resetWord}>
            🔄 {$t('syllableJump.reset')}
          </button>
        </div>

        {#if allTapped}
          <div class="done-bar" transition:fade>
            <span>✅ {$t('syllableJump.great')}</span>
            <button class="btn next-btn" onclick={nextWord}>➡️ {$t('syllableJump.next')}</button>
          </div>
        {/if}
      </div>
    {/if}
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .intro { text-align:center; color:var(--text-secondary); margin-bottom:1rem; }

  .sets { display:flex; flex-direction:column; gap:.75rem; }
  .set-card { display:flex; align-items:center; gap:1rem; padding:1.2rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:56px; }
  .set-card:active { transform:scale(0.97); }
  .set-stars { font-size:1.2rem; }
  .set-name { flex:1; font-weight:600; font-size:1.1rem; }
  .set-count { font-size:.85rem; color:var(--text-secondary); }

  .word-view { display:flex; flex-direction:column; align-items:center; gap:1rem; }
  .speed-control { display:flex; flex-direction:column; align-items:center; gap:.3rem; width:100%; }
  .speed-control label { font-weight:600; font-size:.9rem; }
  .speed-control input[type="range"] { width:70%; accent-color:#E74C3C; }
  .progress { font-size:.9rem; color:var(--text-secondary); font-weight:600; }
  .word-icon { font-size:4rem; transition:transform .3s; }
  .word-icon.bounce { animation:bounce .5s; }
  .word-text { font-size:1.8rem; font-weight:700; letter-spacing:2px; }

  .syllables { display:flex; gap:.75rem; flex-wrap:wrap; justify-content:center; margin:1rem 0; }
  .syl-btn { min-width:64px; min-height:64px; padding:.8rem 1rem; border-radius:16px; border:3px solid var(--border); background:var(--bg-card); font-size:1.3rem; font-weight:700; cursor:pointer; transition:all .2s; }
  .syl-btn.next { border-color:#E74C3C; animation:glow 1.5s infinite; }
  .syl-btn.tapped { background:#27AE60; color:#fff; border-color:#27AE60; transform:scale(1.05); }
  .syl-btn.bouncing { animation:bounce .4s; background:#F1C40F; }
  .syl-btn:disabled { cursor:default; }

  .syllable-count { font-size:.95rem; color:var(--text-secondary); }

  @keyframes bounce { 0%,100% { transform:translateY(0); } 40% { transform:translateY(-12px); } }
  @keyframes glow { 0%,100% { box-shadow:0 0 0 0 rgba(231,76,60,.3); } 50% { box-shadow:0 0 12px 4px rgba(231,76,60,.3); } }

  .actions { display:flex; gap:1rem; }
  .btn { padding:.7rem 1.2rem; border-radius:12px; border:2px solid var(--border); background:var(--bg-card); font-size:1rem; cursor:pointer; font-weight:600; min-height:48px; }
  .btn:disabled { opacity:.5; }
  .listen { background:#E74C3C; color:#fff; border-color:#E74C3C; }
  .reset { background:#95A5A6; color:#fff; border-color:#95A5A6; }
  .next-btn { background:#27AE60; color:#fff; border-color:#27AE60; }

  .done-bar { display:flex; align-items:center; gap:1rem; padding:1rem; background:rgba(39,174,96,.1); border-radius:12px; font-weight:600; }

  .celebration { text-align:center; padding:2rem; }
  .trophy { font-size:4rem; display:block; margin-bottom:1rem; }
  .celebration p { font-weight:700; font-size:1.3rem; margin-bottom:1rem; }

  .cr { text-align:center; padding:.5rem; font-size:.75rem; color:var(--text-secondary); }
</style>
