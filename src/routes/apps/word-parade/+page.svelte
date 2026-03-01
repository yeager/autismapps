<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // === ORDPARADEN — Word Parade ===
  // Minimal pair practice — words differing by one phoneme
  // Critical for phonological therapy in CAS/dyspraxia
  // Two modes: Practice (hear both) and Quiz (identify which)

  interface MinimalPair {
    word1: string;
    word2: string;
    icon1: string;
    icon2: string;
    contrastType: string; // e.g. 'voicing', 'place', 'manner'
  }

  const MINIMAL_PAIRS: MinimalPair[] = [
    // Voicing contrasts
    { word1: 'bil', word2: 'pil', icon1: '🚗', icon2: '➡️', contrastType: 'voicing' },
    { word1: 'boll', word2: 'poll', icon1: '⚽', icon2: '📊', contrastType: 'voicing' },
    { word1: 'dal', word2: 'tal', icon1: '🏔️', icon2: '🔢', contrastType: 'voicing' },
    { word1: 'gul', word2: 'kul', icon1: '🟡', icon2: '😄', contrastType: 'voicing' },
    { word1: 'glas', word2: 'klass', icon1: '🥛', icon2: '🏫', contrastType: 'voicing' },
    // Place contrasts
    { word1: 'mat', word2: 'nat', icon1: '🍕', icon2: '🌙', contrastType: 'place' },
    { word1: 'mål', word2: 'nål', icon1: '🎯', icon2: '🪡', contrastType: 'place' },
    { word1: 'lam', word2: 'ram', icon1: '🐑', icon2: '🖼️', contrastType: 'place' },
    { word1: 'lek', word2: 'rek', icon1: '🎮', icon2: '📝', contrastType: 'place' },
    { word1: 'bak', word2: 'tak', icon1: '🍞', icon2: '🏠', contrastType: 'place' },
    // Manner contrasts
    { word1: 'mus', word2: 'bus', icon1: '🐭', icon2: '😈', contrastType: 'manner' },
    { word1: 'ris', word2: 'bis', icon1: '🍚', icon2: '🐝', contrastType: 'manner' },
    { word1: 'sol', word2: 'bol', icon1: '☀️', icon2: '⚽', contrastType: 'manner' },
    { word1: 'fin', word2: 'vin', icon1: '✨', icon2: '🍷', contrastType: 'manner' },
    { word1: 'fot', word2: 'bot', icon1: '🦶', icon2: '💊', contrastType: 'manner' },
    // Vowel contrasts
    { word1: 'hus', word2: 'has', icon1: '🏠', icon2: '🐰', contrastType: 'vowel' },
    { word1: 'sol', word2: 'sal', icon1: '☀️', icon2: '🏛️', contrastType: 'vowel' },
    { word1: 'bok', word2: 'bak', icon1: '📖', icon2: '🍞', contrastType: 'vowel' },
  ];

  type AppMode = 'menu' | 'practice' | 'quiz';

  let mode = $state<AppMode>('menu');
  let currentPairIdx = $state(0);
  let score = $state(0);
  let totalQuiz = $state(0);
  let isPlaying = $state(false);
  let quizTarget = $state<1 | 2>(1);
  let quizAnswer = $state<1 | 2 | null>(null);
  let showQuizResult = $state(false);

  const currentPair = $derived(MINIMAL_PAIRS[currentPairIdx]);

  async function playWord(word: string) {
    if (isPlaying) return;
    isPlaying = true;
    await speak(word, { rate: 0.7 });
    isPlaying = false;
  }

  async function playBoth() {
    if (isPlaying) return;
    isPlaying = true;
    await speak(currentPair.word1, { rate: 0.7 });
    await new Promise(r => setTimeout(r, 1000));
    await speak(currentPair.word2, { rate: 0.7 });
    isPlaying = false;
  }

  function startQuizRound() {
    quizTarget = Math.random() > 0.5 ? 1 : 2;
    quizAnswer = null;
    showQuizResult = false;
    // Auto-play the target
    const word = quizTarget === 1 ? currentPair.word1 : currentPair.word2;
    playWord(word);
  }

  function answerQuiz(choice: 1 | 2) {
    quizAnswer = choice;
    showQuizResult = true;
    totalQuiz++;
    if (choice === quizTarget) score++;
  }

  function nextPair() {
    currentPairIdx = (currentPairIdx + 1) % MINIMAL_PAIRS.length;
    quizAnswer = null;
    showQuizResult = false;
    if (mode === 'quiz') startQuizRound();
  }

  function goBack() {
    if (mode !== 'menu') { mode = 'menu'; } else { goto(`${base}/`); }
  }
</script>

<WelcomeDialog appId="word-parade" titleKey="app.word_parade" purposeKey="welcome.wordParade.purpose" howKey="welcome.wordParade.how" goalKey="welcome.wordParade.goal" icon="👯" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={goBack}>←</button>
    <h1>👯 {$t('wordParade.title')}</h1>
    {#if mode !== 'menu'}<span class="score-badge">{$t('wordParade.score')}: {score}</span>{/if}
  </header>

  <main class="cnt">
    {#if mode === 'menu'}
      <p class="intro">{$t('wordParade.intro')}</p>
      <div class="modes">
        <button class="mode-card" onclick={() => mode = 'practice'}>
          <span class="mode-icon">🔊</span>
          <span class="mode-name">{$t('wordParade.practiceMode')}</span>
        </button>
        <button class="mode-card quiz-card" onclick={() => { mode = 'quiz'; startQuizRound(); }}>
          <span class="mode-icon">❓</span>
          <span class="mode-name">{$t('wordParade.quizMode')}</span>
        </button>
      </div>

    {:else if mode === 'practice'}
      <div class="pair-display">
        <span class="pair-label">{$t('wordParade.pair')} {currentPairIdx + 1}/{MINIMAL_PAIRS.length}</span>
        <div class="pair-cards">
          <button class="word-card" onclick={() => playWord(currentPair.word1)}>
            <span class="wc-icon">{currentPair.icon1}</span>
            <span class="wc-text">{currentPair.word1}</span>
          </button>
          <span class="vs">↔</span>
          <button class="word-card" onclick={() => playWord(currentPair.word2)}>
            <span class="wc-icon">{currentPair.icon2}</span>
            <span class="wc-text">{currentPair.word2}</span>
          </button>
        </div>
        <div class="actions">
          <button class="btn listen-btn" onclick={() => playWord(currentPair.word1)} disabled={isPlaying}>🔊 {$t('wordParade.listen1')}</button>
          <button class="btn listen-btn" onclick={() => playWord(currentPair.word2)} disabled={isPlaying}>🔊 {$t('wordParade.listen2')}</button>
          <button class="btn both-btn" onclick={playBoth} disabled={isPlaying}>🔊🔊 {$t('wordParade.listenBoth')}</button>
        </div>
        <button class="btn next-btn" onclick={nextPair}>{$t('wordParade.next')} →</button>
      </div>

    {:else if mode === 'quiz'}
      <div class="quiz-display">
        <p class="quiz-q">{$t('wordParade.whichOne')}</p>
        <button class="btn replay-btn" onclick={() => playWord(quizTarget === 1 ? currentPair.word1 : currentPair.word2)} disabled={isPlaying}>🔊 {$t('speechRhythm.listen')}</button>
        <div class="quiz-options">
          <button class="quiz-opt" class:correct={showQuizResult && quizTarget === 1} class:wrong={showQuizResult && quizAnswer === 1 && quizTarget !== 1} onclick={() => !showQuizResult && answerQuiz(1)} disabled={showQuizResult}>
            <span class="qo-icon">{currentPair.icon1}</span>
            <span class="qo-text">{currentPair.word1}</span>
          </button>
          <button class="quiz-opt" class:correct={showQuizResult && quizTarget === 2} class:wrong={showQuizResult && quizAnswer === 2 && quizTarget !== 2} onclick={() => !showQuizResult && answerQuiz(2)} disabled={showQuizResult}>
            <span class="qo-icon">{currentPair.icon2}</span>
            <span class="qo-text">{currentPair.word2}</span>
          </button>
        </div>
        {#if showQuizResult}
          <p class="result" class:success={quizAnswer === quizTarget}>
            {quizAnswer === quizTarget ? $t('wordParade.correct') : $t('wordParade.tryAgain')}
          </p>
        {/if}
        <button class="btn next-btn" onclick={nextPair}>{$t('wordParade.next')} →</button>
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
  .mode-card{display:flex;align-items:center;gap:1rem;padding:1.5rem;border:2px solid var(--border);border-radius:20px;background:var(--bg-card);cursor:pointer}
  .mode-card:active{transform:scale(.97)}
  .quiz-card{border-color:#9B59B6}
  .mode-icon{font-size:2.5rem} .mode-name{font-weight:700;font-size:1.2rem}

  .pair-display,.quiz-display{display:flex;flex-direction:column;align-items:center;gap:1.2rem}
  .pair-label{font-size:.9rem;color:var(--text-secondary);font-weight:600}
  .pair-cards{display:flex;align-items:center;gap:1rem;width:100%}
  .word-card{flex:1;display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;border:3px solid var(--border);border-radius:20px;background:var(--bg-card);cursor:pointer;min-height:120px}
  .word-card:active{transform:scale(.96)}
  .wc-icon{font-size:2.5rem} .wc-text{font-size:1.6rem;font-weight:800}
  .vs{font-size:1.5rem;font-weight:700;color:var(--text-secondary)}

  .actions{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center}
  .btn{padding:.7rem 1rem;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);font-size:.95rem;cursor:pointer;font-weight:600;min-height:48px}
  .btn:disabled{opacity:.5}
  .listen-btn{background:#2ECC71;color:#fff;border-color:#2ECC71}
  .both-btn{background:#3498DB;color:#fff;border-color:#3498DB}
  .replay-btn{background:#F39C12;color:#fff;border-color:#F39C12}
  .next-btn{background:#3498DB;color:#fff;border-color:#3498DB}

  .quiz-q{font-size:1.3rem;font-weight:700;text-align:center}
  .quiz-options{display:flex;gap:1rem;width:100%}
  .quiz-opt{flex:1;display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;border:3px solid var(--border);border-radius:20px;background:var(--bg-card);cursor:pointer;min-height:120px}
  .quiz-opt:active{transform:scale(.96)}
  .quiz-opt.correct{border-color:#2ECC71;background:rgba(46,204,113,.15)}
  .quiz-opt.wrong{border-color:#E74C3C;background:rgba(231,76,60,.15)}
  .qo-icon{font-size:2.5rem} .qo-text{font-size:1.4rem;font-weight:700}

  .result{font-size:1.3rem;font-weight:700;text-align:center}
  .result.success{color:#2ECC71} .result:not(.success){color:#E74C3C}

  .cr{text-align:center;padding:.5rem;font-size:.75rem;color:var(--text-secondary)}
</style>
