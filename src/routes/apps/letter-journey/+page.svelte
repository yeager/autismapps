<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { fade } from 'svelte/transition';

  // === VERBAL DYSPRAXIA-ADAPTED DESIGN ===
  // Based on DTTC (Dynamic Temporal and Tactile Cueing), NDP-3, ReST:
  // 1. Movement sequences, not isolated sounds
  // 2. Slow tempo → gradual speed increase
  // 3. Massive repetition (motor learning requires 100+ reps)
  // 4. Coarticulation practice (CV, VC, CVC combos)
  // 5. Prosody (rhythm/stress) from the start
  // 6. Multisensory: visual + auditory + mouth position cues
  // 7. Vowels equally important as consonants
  // 8. Immediate corrective model (never leave child lost)

  type Mode = 'menu' | 'explore' | 'find' | 'soundout' | 'syllable' | 'coarticulation';

  const LETTER_NAMES: Record<string, string> = {
    A: 'ah', B: 'beh', C: 'seh', D: 'deh', E: 'eh',
    F: 'eff', G: 'geh', H: 'hå', I: 'ih', J: 'jih',
    K: 'kå', L: 'ell', M: 'emm', N: 'enn', O: 'oh',
    P: 'peh', Q: 'kuh', R: 'err', S: 'ess', T: 'teh',
    U: 'uh', V: 'veh', W: 'dubbelveh', X: 'eks', Y: 'yh',
    Z: 'seta', Å: 'å', Ä: 'äh', Ö: 'öh'
  };

  const LETTER_SOUNDS: Record<string, string> = {
    A: 'aaa', B: 'b', C: 'sss', D: 'd', E: 'eee',
    F: 'fff', G: 'g', H: 'hhh', I: 'iii', J: 'jjj',
    K: 'k', L: 'lll', M: 'mmm', N: 'nnn', O: 'ooo',
    P: 'p', Q: 'k', R: 'rrr', S: 'sss', T: 't',
    U: 'uuu', V: 'vvv', W: 'vvv', X: 'ks', Y: 'yyy',
    Z: 'sss', Å: 'ååå', Ä: 'äää', Ö: 'ööö'
  };

  const MOUTH_CUES: Record<string, string> = {
    A: '😮', B: '👄', C: '😬', D: '👅', E: '😊',
    F: '🦷', G: '😶', H: '😯', I: '😁', J: '😊',
    K: '😶', L: '👅', M: '👄', N: '👅', O: '😮',
    P: '👄', Q: '😶', R: '👅', S: '😬', T: '👅',
    U: '😗', V: '🦷', W: '😗', X: '😬', Y: '😗',
    Z: '😬', Å: '😮', Ä: '😊', Ö: '😗'
  };

  const MOUTH_DESC: Record<string, string> = {
    A: 'letter.mouth.a', B: 'letter.mouth.b', C: 'letter.mouth.c',
    D: 'letter.mouth.d', E: 'letter.mouth.e', F: 'letter.mouth.f',
    G: 'letter.mouth.g', H: 'letter.mouth.h', I: 'letter.mouth.i',
    K: 'letter.mouth.k', L: 'letter.mouth.l', M: 'letter.mouth.m',
    N: 'letter.mouth.n', O: 'letter.mouth.o', P: 'letter.mouth.p',
    R: 'letter.mouth.r', S: 'letter.mouth.s', T: 'letter.mouth.t',
    U: 'letter.mouth.u', V: 'letter.mouth.v', Å: 'letter.mouth.aa',
    Ä: 'letter.mouth.ae', Ö: 'letter.mouth.oe'
  };

  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö']);
  const CONSONANTS_FOR_CV = ['B', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'];
  const VOWELS_FOR_CV = ['A', 'E', 'I', 'O', 'U', 'Å', 'Ä', 'Ö'];

  function letterColor(ch: string): string {
    return VOWELS.has(ch) ? '#E74C3C' : '#3498DB';
  }

  interface WordEntry {
    word: string;
    hint: string;
    syllables: string[];
    stress: number;
  }

  const WORDS_L1: WordEntry[] = [
    { word: 'SOL', hint: 'letter.word.sun', syllables: ['SOL'], stress: 0 },
    { word: 'KATT', hint: 'letter.word.cat', syllables: ['KATT'], stress: 0 },
    { word: 'HUS', hint: 'letter.word.house', syllables: ['HUS'], stress: 0 },
    { word: 'BIL', hint: 'letter.word.car', syllables: ['BIL'], stress: 0 },
    { word: 'MUS', hint: 'letter.word.mouse', syllables: ['MUS'], stress: 0 },
    { word: 'BÅT', hint: 'letter.word.boat', syllables: ['BÅT'], stress: 0 },
    { word: 'ARM', hint: 'letter.word.arm', syllables: ['ARM'], stress: 0 },
    { word: 'BEN', hint: 'letter.word.leg', syllables: ['BEN'], stress: 0 },
    { word: 'NÄSA', hint: 'letter.word.nose', syllables: ['NÄ', 'SA'], stress: 0 },
    { word: 'LÅS', hint: 'letter.word.lock', syllables: ['LÅS'], stress: 0 },
    { word: 'ÖGA', hint: 'letter.word.eye', syllables: ['Ö', 'GA'], stress: 0 },
    { word: 'ÖRA', hint: 'letter.word.ear', syllables: ['Ö', 'RA'], stress: 0 },
  ];

  const WORDS_L2: WordEntry[] = [
    { word: 'BOLL', hint: 'letter.word.ball', syllables: ['BOLL'], stress: 0 },
    { word: 'FISK', hint: 'letter.word.fish', syllables: ['FISK'], stress: 0 },
    { word: 'HUND', hint: 'letter.word.dog', syllables: ['HUND'], stress: 0 },
    { word: 'DÖRR', hint: 'letter.word.door', syllables: ['DÖRR'], stress: 0 },
    { word: 'STOL', hint: 'letter.word.chair', syllables: ['STOL'], stress: 0 },
    { word: 'BLAD', hint: 'letter.word.leaf', syllables: ['BLAD'], stress: 0 },
    { word: 'GLAD', hint: 'letter.word.happy', syllables: ['GLAD'], stress: 0 },
    { word: 'STOR', hint: 'letter.word.big', syllables: ['STOR'], stress: 0 },
    { word: 'GRIS', hint: 'letter.word.pig', syllables: ['GRIS'], stress: 0 },
    { word: 'LAMM', hint: 'letter.word.lamb', syllables: ['LAMM'], stress: 0 },
  ];

  const WORDS_L3: WordEntry[] = [
    { word: 'ÄPPLE', hint: 'letter.word.apple', syllables: ['ÄPP', 'LE'], stress: 0 },
    { word: 'SKOLA', hint: 'letter.word.school', syllables: ['SKO', 'LA'], stress: 0 },
    { word: 'BJÖRN', hint: 'letter.word.bear', syllables: ['BJÖRN'], stress: 0 },
    { word: 'BLOMMA', hint: 'letter.word.flower', syllables: ['BLOM', 'MA'], stress: 0 },
    { word: 'STJÄRNA', hint: 'letter.word.star', syllables: ['STJÄR', 'NA'], stress: 0 },
    { word: 'VATTEN', hint: 'letter.word.water', syllables: ['VAT', 'TEN'], stress: 0 },
    { word: 'ELEFANT', hint: 'letter.word.elephant', syllables: ['E', 'LE', 'FANT'], stress: 2 },
    { word: 'BANANER', hint: 'letter.word.bananas', syllables: ['BA', 'NA', 'NER'], stress: 2 },
  ];

  const LETTERS = Object.keys(LETTER_NAMES);
  const ENCOURAGEMENTS = ['letter.great', 'letter.fantastic', 'letter.star', 'letter.amazing', 'letter.well_done', 'letter.keep_going'];
  const TRY_AGAIN_MSGS = ['letter.almost', 'letter.so_close', 'letter.you_can', 'letter.dont_give_up'];

  // State
  let mode = $state<Mode>('menu');
  let stars = $state(0);
  let streak = $state(0);
  let level = $state(1);
  let totalCorrect = $state(0);
  let lettersLearned = $state<string[]>([]);

  // Explore mode
  let selectedLetter = $state<string | null>(null);
  let showMouthCue = $state(false);

  // Find mode
  let targetLetter = $state<string | null>(null);
  let findChoices = $state<string[]>([]);
  let findFeedback = $state('');
  let findAnswered = $state(false);
  let findRepeatCount = $state(0); // DTTC: track repeats

  // Sound-out mode
  let currentWord = $state<WordEntry | null>(null);
  let wordIdx = $state(0);
  let soundFeedback = $state('');
  let wordComplete = $state(false);
  let wordRepeatCount = $state(0);

  // Syllable mode
  let syllableWord = $state<WordEntry | null>(null);
  let syllableIdx = $state(0);
  let syllableFeedback = $state('');

  // Coarticulation mode (CV/VC practice — core CAS technique)
  let cvConsonant = $state('B');
  let cvPairs = $state<string[]>([]);
  let cvIdx = $state(0);
  let cvFeedback = $state('');
  let cvDirection = $state<'cv' | 'vc'>('cv'); // consonant-vowel or vowel-consonant

  // Speed control (DTTC: start slow, increase gradually)
  let speechRate = $state(0.4); // Very slow default for dyspraxia

  // Celebration
  let showCelebration = $state(false);

  $effect(() => { loadProgress(); });

  async function loadProgress() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'letter-journey');
      if (data) {
        stars = (data.stars as number) || 0;
        streak = (data.streak as number) || 0;
        level = (data.level as number) || 1;
        totalCorrect = (data.totalCorrect as number) || 0;
        lettersLearned = (data.lettersLearned as string[]) || [];
      }
    }
  }

  async function saveProgress() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'letter-journey', { stars, streak, level, totalCorrect, lettersLearned });
  }

  function recordCorrect(letter?: string) {
    totalCorrect++;
    streak++;
    stars++;
    if (streak % 5 === 0) stars += 2;
    if (letter && !lettersLearned.includes(letter)) lettersLearned = [...lettersLearned, letter];
    if (totalCorrect % 20 === 0) level = Math.min(level + 1, 3);
    saveProgress();
  }

  function recordWrong() {
    streak = 0;
    saveProgress();
  }

  function celebrate() {
    showCelebration = true;
    setTimeout(() => { showCelebration = false; }, 1200);
  }

  function speakSlow(text: string) {
    speak(text, { rate: speechRate });
  }

  function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // === EXPLORE ===
  function exploreLetter(letter: string) {
    selectedLetter = letter;
    showMouthCue = true;
    speakSlow(`${letter}. ${LETTER_NAMES[letter]}. ${LETTER_SOUNDS[letter]}.`);
    recordCorrect(letter);
  }

  // === FIND ===
  function startFindRound() {
    findAnswered = false;
    findFeedback = '';
    findRepeatCount = 0;
    const target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    targetLetter = target;
    const others = LETTERS.filter(l => l !== target).sort(() => Math.random() - 0.5).slice(0, 5);
    findChoices = [...others, target].sort(() => Math.random() - 0.5);
    setTimeout(() => speakSlow(LETTER_SOUNDS[target]), 400);
  }

  function answerFind(letter: string) {
    if (findAnswered) return;
    findAnswered = true;
    if (letter === targetLetter) {
      findFeedback = $t(randomItem(ENCOURAGEMENTS));
      recordCorrect(letter);
      celebrate();
      speakSlow($t('letter.correct'));
    } else {
      findFeedback = $t(randomItem(TRY_AGAIN_MSGS));
      recordWrong();
      setTimeout(() => {
        if (targetLetter) speakSlow(targetLetter + '. ' + LETTER_SOUNDS[targetLetter]);
      }, 800);
    }
  }

  function repeatFind() {
    // DTTC: repeat same target for motor learning consolidation
    if (!targetLetter) return;
    findAnswered = false;
    findFeedback = '';
    findRepeatCount++;
    const others = LETTERS.filter(l => l !== targetLetter).sort(() => Math.random() - 0.5).slice(0, 5);
    findChoices = [...others, targetLetter].sort(() => Math.random() - 0.5);
    setTimeout(() => speakSlow(LETTER_SOUNDS[targetLetter!]), 400);
  }

  // === SOUND OUT ===
  function startSoundOut() {
    wordComplete = false;
    wordIdx = 0;
    soundFeedback = '';
    wordRepeatCount = 0;
    const words = level <= 1 ? WORDS_L1 : level <= 2 ? [...WORDS_L1, ...WORDS_L2] : [...WORDS_L1, ...WORDS_L2, ...WORDS_L3];
    currentWord = randomItem(words);
    setTimeout(() => speakSlow(currentWord!.word), 300);
  }

  function repeatSoundOut() {
    // DTTC: repeat same word
    if (!currentWord) return;
    wordComplete = false;
    wordIdx = 0;
    soundFeedback = '';
    wordRepeatCount++;
    setTimeout(() => speakSlow(currentWord!.word), 300);
  }

  function soundCurrentLetter() {
    if (!currentWord || wordIdx >= currentWord.word.length) return;
    const letter = currentWord.word[wordIdx];
    const sound = LETTER_SOUNDS[letter] || letter;
    speakSlow(sound);
    soundFeedback = `"${letter}" → ${sound}`;
  }

  function nextSoundLetter() {
    if (!currentWord) return;
    if (wordIdx < currentWord.word.length) {
      const letter = currentWord.word[wordIdx];
      recordCorrect(letter);
      wordIdx++;
      if (wordIdx >= currentWord.word.length) {
        wordComplete = true;
        soundFeedback = $t(randomItem(ENCOURAGEMENTS));
        celebrate();
        setTimeout(() => speakSlow(currentWord!.word), 300);
      } else {
        const nextLetter = currentWord.word[wordIdx];
        setTimeout(() => speakSlow(LETTER_SOUNDS[nextLetter] || nextLetter), 200);
        soundFeedback = `"${nextLetter}" → ${LETTER_SOUNDS[nextLetter] || nextLetter}`;
      }
    }
  }

  // === SYLLABLE ===
  function startSyllable() {
    syllableIdx = 0;
    syllableFeedback = '';
    const words = level <= 1
      ? WORDS_L1.filter(w => w.syllables.length > 1)
      : [...WORDS_L2, ...WORDS_L3].filter(w => w.syllables.length > 1);
    syllableWord = words.length > 0 ? randomItem(words) : WORDS_L3[0];
    setTimeout(() => speakSlow(syllableWord!.word), 300);
  }

  function tapSyllable(idx: number) {
    if (!syllableWord || idx !== syllableIdx) return;
    speakSlow(syllableWord.syllables[idx]);
    syllableIdx++;
    if (syllableIdx >= syllableWord.syllables.length) {
      syllableFeedback = $t(randomItem(ENCOURAGEMENTS));
      recordCorrect();
      celebrate();
      setTimeout(() => speakSlow(syllableWord!.word), 600);
    }
  }

  // === COARTICULATION (new CAS mode) ===
  // Practice smooth transitions between consonant + vowel (or vowel + consonant)
  // This is the CORE of CAS therapy: motor planning for transitions, not isolated sounds
  function startCoarticulation() {
    cvIdx = 0;
    cvFeedback = '';
    // Generate CV or VC pairs for current consonant
    if (cvDirection === 'cv') {
      cvPairs = VOWELS_FOR_CV.map(v => cvConsonant + v);
    } else {
      cvPairs = VOWELS_FOR_CV.map(v => v + cvConsonant);
    }
    setTimeout(() => speakSlow(cvPairs[0]), 400);
  }

  function tapCvPair(idx: number) {
    if (idx !== cvIdx) return;
    speakSlow(cvPairs[idx]);
    cvIdx++;
    if (cvIdx >= cvPairs.length) {
      cvFeedback = $t(randomItem(ENCOURAGEMENTS));
      recordCorrect(cvConsonant);
      celebrate();
    } else {
      setTimeout(() => speakSlow(cvPairs[cvIdx]), 400);
    }
  }

  function replayCv() {
    if (cvIdx < cvPairs.length) speakSlow(cvPairs[cvIdx]);
  }

  function setMode(m: Mode) {
    mode = m;
    if (m === 'find') startFindRound();
    else if (m === 'soundout') startSoundOut();
    else if (m === 'syllable') startSyllable();
    else if (m === 'coarticulation') startCoarticulation();
  }
</script>

<WelcomeDialog appId="letter-journey" titleKey="app.letter_journey" purposeKey="welcome.letterJourney.purpose" howKey="welcome.letterJourney.how" goalKey="welcome.letterJourney.goal" icon="🔤" />

<div class="letter-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => mode === 'menu' ? goto('/') : (mode = 'menu')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('letter.title')}</h1>
    <div class="stats-bar">
      <span class="stat">⭐ {stars}</span>
      <span class="stat fire">🔥 {streak}</span>
    </div>
  </header>

  {#if mode === 'menu'}
    <div class="menu-page" transition:fade>
      <div class="menu-hero">
        <h2>{$t('letter.title')}</h2>
        <p class="menu-subtitle">{$t('letter.choose_adventure')}</p>
        <span class="level-badge">{$t('letter.level')} {level} · {lettersLearned.length}/29</span>
      </div>

      <div class="mode-grid">
        <button class="mode-card" onclick={() => setMode('explore')}>
          <span class="mode-emoji">🔤</span>
          <h3>{$t('letter.mode.explore')}</h3>
          <p>{$t('letter.mode.explore_desc')}</p>
        </button>
        <button class="mode-card" onclick={() => setMode('find')}>
          <span class="mode-emoji">🎯</span>
          <h3>{$t('letter.mode.find')}</h3>
          <p>{$t('letter.mode.find_desc')}</p>
        </button>
        <button class="mode-card" onclick={() => setMode('soundout')}>
          <span class="mode-emoji">📖</span>
          <h3>{$t('letter.mode.soundout')}</h3>
          <p>{$t('letter.mode.soundout_desc')}</p>
        </button>
        <button class="mode-card" onclick={() => setMode('syllable')}>
          <span class="mode-emoji">🥁</span>
          <h3>{$t('letter.mode.syllable')}</h3>
          <p>{$t('letter.mode.syllable_desc')}</p>
        </button>
        <button class="mode-card coartic" onclick={() => setMode('coarticulation')}>
          <span class="mode-emoji">🗣️</span>
          <h3>{$t('letter.mode.coarticulation')}</h3>
          <p>{$t('letter.mode.coarticulation_desc')}</p>
        </button>
      </div>

      <div class="speed-control">
        <span class="speed-label">{$t('letter.speech_speed')}</span>
        <div class="speed-options">
          <button class="speed-btn" class:active={speechRate === 0.4} onclick={() => { speechRate = 0.4; }}>🐢</button>
          <button class="speed-btn" class:active={speechRate === 0.6} onclick={() => { speechRate = 0.6; }}>🚶</button>
          <button class="speed-btn" class:active={speechRate === 0.8} onclick={() => { speechRate = 0.8; }}>🏃</button>
          <button class="speed-btn" class:active={speechRate === 1.0} onclick={() => { speechRate = 1.0; }}>🚀</button>
        </div>
        <p class="speed-hint">{$t('letter.speed_hint')}</p>
      </div>
    </div>

  {:else if mode === 'explore'}
    <div class="explore-page" transition:fade>
      <p class="instruction">{$t('letter.explore_instruction')}</p>

      {#if selectedLetter}
        <div class="letter-detail">
          <div class="letter-big" style="color: {letterColor(selectedLetter)}">{selectedLetter}</div>
          <div class="letter-info">
            <div class="info-row">
              <span class="info-label">{$t('letter.name')}:</span>
              <span class="info-value">{LETTER_NAMES[selectedLetter]}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{$t('letter.sound')}:</span>
              <span class="info-value">{LETTER_SOUNDS[selectedLetter]}</span>
            </div>
            {#if showMouthCue}
              <div class="mouth-cue">
                <span class="mouth-emoji">{MOUTH_CUES[selectedLetter] || '👄'}</span>
                <span class="mouth-text">{$t(MOUTH_DESC[selectedLetter] || 'letter.mouth.default')}</span>
              </div>
            {/if}
            <span class="vowel-tag" class:vowel={VOWELS.has(selectedLetter)}>
              {VOWELS.has(selectedLetter) ? $t('letter.vowel') : $t('letter.consonant')}
            </span>
          </div>
          <button class="replay-btn" onclick={() => speakSlow(`${selectedLetter}. ${LETTER_NAMES[selectedLetter!]}. ${LETTER_SOUNDS[selectedLetter!]}.`)}>
            🔊 {$t('letter.hear_again')}
          </button>
        </div>
      {/if}

      <div class="letter-grid">
        {#each LETTERS as letter}
          <button class="letter-btn" style="--lc: {letterColor(letter)}"
            class:learned={lettersLearned.includes(letter)}
            onclick={() => exploreLetter(letter)}>
            {letter}
          </button>
        {/each}
      </div>
    </div>

  {:else if mode === 'find'}
    <div class="find-page" transition:fade>
      <p class="instruction">{$t('letter.find_instruction')}</p>
      {#if targetLetter}
        <p class="find-prompt">{$t('letter.which_says')} "{LETTER_SOUNDS[targetLetter]}"?</p>
      {/if}
      <button class="replay-btn" onclick={() => { if (targetLetter) speakSlow(LETTER_SOUNDS[targetLetter]); }}>🔊 {$t('letter.play_again')}</button>

      {#if findFeedback}<p class="feedback">{findFeedback}</p>{/if}

      <div class="find-grid">
        {#each findChoices as letter}
          <button class="letter-btn big" style="--lc: {letterColor(letter)}"
            class:correct={findAnswered && letter === targetLetter}
            class:wrong={findAnswered && letter !== targetLetter}
            onclick={() => answerFind(letter)}
            disabled={findAnswered}>
            {letter}
          </button>
        {/each}
      </div>

      {#if findAnswered}
        <div class="round-actions">
          <button class="repeat-btn" onclick={repeatFind}>🔄 {$t('letter.repeat_same')}{findRepeatCount > 0 ? ` (${findRepeatCount})` : ''}</button>
          <button class="next-btn" onclick={startFindRound}>{$t('letter.next')} ➡️</button>
        </div>
      {/if}
    </div>

  {:else if mode === 'soundout'}
    <div class="soundout-page" transition:fade>
      <p class="instruction">{$t('letter.soundout_instruction')}</p>

      {#if currentWord}
        <div class="word-display">
          {#each currentWord.word.split('') as ch, i}
            <span class="word-letter"
              class:done={i < wordIdx}
              class:active={i === wordIdx}
              style="color: {i === wordIdx ? letterColor(ch) : i < wordIdx ? '#27AE60' : 'var(--text-muted)'}">
              {ch}
            </span>
          {/each}
        </div>
        <p class="word-hint">({$t(currentWord.hint)})</p>

        {#if soundFeedback}<p class="feedback">{soundFeedback}</p>{/if}

        {#if !wordComplete}
          <div class="sound-actions">
            <button class="action-btn" onclick={soundCurrentLetter}>🔊 {$t('letter.hear_sound')}</button>
            <button class="action-btn primary" onclick={nextSoundLetter}>➡️ {$t('letter.next_sound')}</button>
          </div>
          {#if currentWord.word[wordIdx]}
            {@const ch = currentWord.word[wordIdx]}
            <div class="mouth-cue-inline">
              <span class="mouth-emoji">{MOUTH_CUES[ch] || '👄'}</span>
              <span>{$t(MOUTH_DESC[ch] || 'letter.mouth.default')}</span>
            </div>
          {/if}
        {:else}
          <div class="round-actions">
            <button class="repeat-btn" onclick={repeatSoundOut}>🔄 {$t('letter.repeat_same')}{wordRepeatCount > 0 ? ` (${wordRepeatCount})` : ''}</button>
            <button class="next-btn" onclick={startSoundOut}>{$t('letter.new_word')} 🔄</button>
          </div>
        {/if}
      {/if}
    </div>

  {:else if mode === 'syllable'}
    <div class="syllable-page" transition:fade>
      <p class="instruction">{$t('letter.syllable_instruction')}</p>

      {#if syllableWord}
        <div class="syllable-display">
          {#each syllableWord.syllables as syl, i}
            <button class="syllable-btn"
              class:done={i < syllableIdx}
              class:active={i === syllableIdx}
              class:stressed={i === syllableWord.stress}
              onclick={() => tapSyllable(i)}
              disabled={i !== syllableIdx}>
              {syl}
            </button>
            {#if i < syllableWord.syllables.length - 1}
              <span class="syllable-dot">·</span>
            {/if}
          {/each}
        </div>
        <p class="word-hint">({$t(syllableWord.hint)})</p>

        {#if syllableFeedback}<p class="feedback">{syllableFeedback}</p>{/if}

        <button class="replay-btn" onclick={() => { if (syllableWord) speakSlow(syllableWord.word); }}>🔊 {$t('letter.hear_word')}</button>

        {#if syllableIdx >= syllableWord.syllables.length}
          <button class="next-btn" onclick={startSyllable}>{$t('letter.new_word')} 🔄</button>
        {/if}
      {/if}
    </div>

  {:else if mode === 'coarticulation'}
    <div class="coartic-page" transition:fade>
      <p class="instruction">{$t('letter.coartic_instruction')}</p>

      <!-- Pick consonant and direction -->
      <div class="cv-controls">
        <div class="cv-direction">
          <button class="dir-btn" class:active={cvDirection === 'cv'} onclick={() => { cvDirection = 'cv'; startCoarticulation(); }}>
            {$t('letter.cv')} (BA, BE…)
          </button>
          <button class="dir-btn" class:active={cvDirection === 'vc'} onclick={() => { cvDirection = 'vc'; startCoarticulation(); }}>
            {$t('letter.vc')} (AB, EB…)
          </button>
        </div>
        <div class="consonant-picker">
          {#each CONSONANTS_FOR_CV as c}
            <button class="cons-btn" class:active={cvConsonant === c}
              onclick={() => { cvConsonant = c; startCoarticulation(); }}>
              {c}
            </button>
          {/each}
        </div>
      </div>

      <!-- CV pair sequence -->
      <div class="cv-sequence">
        {#each cvPairs as pair, i}
          <button class="cv-btn"
            class:done={i < cvIdx}
            class:active={i === cvIdx}
            onclick={() => tapCvPair(i)}
            disabled={i !== cvIdx}>
            {pair}
          </button>
        {/each}
      </div>

      {#if cvFeedback}<p class="feedback">{cvFeedback}</p>{/if}

      <div class="cv-actions">
        <button class="replay-btn" onclick={replayCv}>🔊 {$t('letter.hear_again')}</button>
        {#if cvIdx >= cvPairs.length}
          <button class="next-btn" onclick={startCoarticulation}>{$t('letter.again')} 🔄</button>
        {/if}
      </div>
    </div>
  {/if}

  {#if showCelebration}
    <div class="celebration" transition:fade>
      <span class="celeb-emoji">🎉</span>
    </div>
  {/if}

  <footer class="credit">
    {$t('letter.credit')}
  </footer>
</div>

<style>
  .letter-page { display: flex; flex-direction: column; min-height: 100dvh; position: relative; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .stats-bar { display: flex; gap: 10px; }
  .stat { font-weight: 600; font-size: 1em; }
  .fire { color: #E74C3C; }

  .menu-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .menu-hero { text-align: center; }
  .menu-hero h2 { font-size: 1.8em; font-weight: 800; }
  .menu-subtitle { color: var(--text-muted); }
  .level-badge { display: inline-block; background: #3498DB; color: white; padding: 4px 16px; border-radius: 100px; font-weight: 600; font-size: 0.85em; }

  .mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; width: 100%; max-width: 700px; }
  .mode-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 20px 16px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); transition: all 0.2s; text-align: center;
  }
  .mode-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: #3498DB; }
  .mode-card.coartic { border-color: #E67E22; }
  .mode-card.coartic:hover { border-color: #D35400; }
  .mode-emoji { font-size: 2em; }
  .mode-card h3 { font-size: 1em; font-weight: 700; }
  .mode-card p { font-size: 0.8em; color: var(--text-muted); }

  .speed-control { text-align: center; padding: 12px; }
  .speed-control label { font-weight: 600; font-size: 0.9em; }
  .speed-options { display: flex; gap: 8px; justify-content: center; margin: 8px 0; }
  .speed-btn {
    width: 56px; height: 56px; font-size: 1.5em; border-radius: 50%;
    border: 2px solid var(--border); transition: all 0.15s;
  }
  .speed-btn.active { border-color: #3498DB; background: rgba(52,152,219,0.1); }
  .speed-hint { font-size: 0.75em; color: var(--text-muted); }

  .instruction { text-align: center; padding: 12px; font-weight: 600; color: var(--text-muted); }
  .feedback { text-align: center; font-size: 1.1em; font-weight: 700; color: #27AE60; padding: 8px; }
  .replay-btn {
    display: block; margin: 0 auto; padding: 10px 20px; background: var(--bg-card);
    border: 1px solid var(--border); border-radius: 100px; font-weight: 600;
  }
  .next-btn {
    padding: 14px 32px; background: #3498DB;
    color: white; border-radius: 100px; font-weight: 700; font-size: 1.05em; border: none;
  }
  .repeat-btn {
    padding: 14px 32px; background: var(--bg-card);
    border: 2px solid #E67E22; color: #E67E22; border-radius: 100px; font-weight: 700; font-size: 1.05em;
  }
  .round-actions { display: flex; gap: 12px; justify-content: center; margin: 16px 0; flex-wrap: wrap; }
  .action-btn {
    padding: 12px 24px; border-radius: 100px; border: 2px solid var(--border);
    font-weight: 600; background: var(--bg-card); min-height: 48px;
  }
  .action-btn.primary { background: #27AE60; color: white; border-color: #27AE60; }

  .letter-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 8px; padding: 12px;
  }
  .letter-btn {
    width: 100%; aspect-ratio: 1; font-size: 1.5em; font-weight: 800;
    border-radius: 14px; border: 3px solid var(--lc);
    background: color-mix(in srgb, var(--lc) 10%, transparent);
    color: var(--lc); transition: all 0.15s; position: relative; min-height: 48px;
  }
  .letter-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px color-mix(in srgb, var(--lc) 30%, transparent); }
  .letter-btn:active { transform: scale(0.95); }
  .letter-btn.learned::after {
    content: '✓'; position: absolute; top: 2px; right: 4px; font-size: 0.4em; color: #27AE60;
  }
  .letter-btn.big { min-width: 80px; min-height: 80px; font-size: 2em; }
  .letter-btn.correct { background: rgba(39,174,96,0.3); border-color: #27AE60; }
  .letter-btn.wrong { opacity: 0.4; }

  .letter-detail {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 16px; background: var(--bg-card); border-radius: var(--radius);
    margin: 0 16px; box-shadow: var(--shadow);
  }
  .letter-big { font-size: 4em; font-weight: 900; }
  .letter-info { display: flex; flex-direction: column; gap: 6px; align-items: center; }
  .info-row { display: flex; gap: 8px; }
  .info-label { font-weight: 600; color: var(--text-muted); }
  .info-value { font-weight: 700; font-size: 1.1em; }
  .mouth-cue {
    display: flex; align-items: center; gap: 8px; padding: 10px 16px;
    background: rgba(52,152,219,0.08); border-radius: 12px; margin-top: 4px;
  }
  .mouth-emoji { font-size: 1.8em; }
  .mouth-text { font-size: 0.85em; max-width: 200px; }
  .vowel-tag {
    display: inline-block; padding: 2px 12px; border-radius: 100px; font-size: 0.75em; font-weight: 600;
    background: rgba(52,152,219,0.1); color: #3498DB;
  }
  .vowel-tag.vowel { background: rgba(231,76,60,0.1); color: #E74C3C; }

  .mouth-cue-inline {
    display: flex; align-items: center; gap: 8px; justify-content: center;
    padding: 12px; margin: 8px 16px; background: rgba(52,152,219,0.05);
    border-radius: var(--radius); font-size: 0.85em;
  }

  .find-page { flex: 1; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .find-prompt { font-size: 1.3em; font-weight: 700; }
  .find-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 320px; }

  .soundout-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .word-display { display: flex; gap: 6px; justify-content: center; padding: 16px; }
  .word-letter {
    font-size: 3em; font-weight: 900; transition: all 0.3s;
    padding: 4px 2px; letter-spacing: 4px;
  }
  .word-letter.active { transform: scale(1.2); }
  .word-letter.done { opacity: 0.5; }
  .word-hint { text-align: center; color: var(--text-muted); font-style: italic; }
  .sound-actions { display: flex; gap: 10px; }

  .syllable-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .syllable-display { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .syllable-btn {
    padding: 16px 24px; font-size: 1.8em; font-weight: 800; border-radius: 16px;
    border: 3px solid var(--border); background: var(--bg-card); transition: all 0.2s; min-height: 48px;
  }
  .syllable-btn.active { border-color: #E67E22; background: rgba(230,126,34,0.1); transform: scale(1.05); }
  .syllable-btn.done { border-color: #27AE60; background: rgba(39,174,96,0.1); color: #27AE60; }
  .syllable-btn.stressed { text-decoration: underline; text-decoration-color: #E74C3C; text-underline-offset: 4px; }
  .syllable-btn:disabled:not(.active) { opacity: 0.4; }
  .syllable-dot { font-size: 1.5em; color: var(--text-muted); }

  /* Coarticulation mode */
  .coartic-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cv-controls { display: flex; flex-direction: column; gap: 12px; align-items: center; width: 100%; max-width: 500px; }
  .cv-direction { display: flex; gap: 8px; }
  .dir-btn {
    padding: 10px 20px; border-radius: 100px; border: 2px solid var(--border);
    font-weight: 600; background: var(--bg-card); min-height: 48px;
  }
  .dir-btn.active { border-color: #E67E22; background: rgba(230,126,34,0.1); color: #E67E22; }
  .consonant-picker {
    display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
  }
  .cons-btn {
    width: 48px; height: 48px; border-radius: 12px; font-size: 1.2em; font-weight: 800;
    border: 2px solid var(--border); background: var(--bg-card); color: #3498DB;
  }
  .cons-btn.active { border-color: #3498DB; background: rgba(52,152,219,0.15); }
  .cv-sequence {
    display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; padding: 16px;
  }
  .cv-btn {
    padding: 16px 24px; font-size: 1.6em; font-weight: 800; border-radius: 16px;
    border: 3px solid var(--border); background: var(--bg-card); transition: all 0.2s; min-height: 48px;
  }
  .cv-btn.active { border-color: #E67E22; background: rgba(230,126,34,0.1); transform: scale(1.08); }
  .cv-btn.done { border-color: #27AE60; background: rgba(39,174,96,0.1); color: #27AE60; }
  .cv-btn:disabled:not(.active) { opacity: 0.4; }
  .cv-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

  .celebration {
    position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.2); z-index: 100; pointer-events: none;
  }
  .celeb-emoji { font-size: 5em; animation: celebBounce 0.5s ease; }
  @keyframes celebBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.4); } }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); line-height: 1.4; }
  .explore-page { flex: 1; padding: 0; }

  @media (prefers-reduced-motion: reduce) {
    .celeb-emoji { animation: none; }
    .word-letter, .letter-btn, .syllable-btn, .cv-btn { transition: none; }
  }
</style>
