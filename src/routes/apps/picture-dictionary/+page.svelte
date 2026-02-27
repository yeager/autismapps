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
  import { hasTakkSign, getTakkSign, openSignVideo } from '$lib/takk';

  type Mode = 'categories' | 'browse' | 'flashcard' | 'quiz';

  interface Word {
    category: string;
    sv: string;
    en: string;
    emoji: string;
  }

  const CATEGORIES: Record<string, { name: string; icon: string }> = {
    animals: { name: 'dict.cat.animals', icon: '🐾' },
    food: { name: 'dict.cat.food', icon: '🍎' },
    clothes: { name: 'dict.cat.clothes', icon: '👕' },
    body: { name: 'dict.cat.body', icon: '🫀' },
    home: { name: 'dict.cat.home', icon: '🏠' },
    school: { name: 'dict.cat.school', icon: '📚' },
  };

  const WORDS: Word[] = [
    // Animals
    { category: 'animals', sv: 'hund', en: 'dog', emoji: '🐕' },
    { category: 'animals', sv: 'katt', en: 'cat', emoji: '🐈' },
    { category: 'animals', sv: 'häst', en: 'horse', emoji: '🐴' },
    { category: 'animals', sv: 'ko', en: 'cow', emoji: '🐄' },
    { category: 'animals', sv: 'fågel', en: 'bird', emoji: '🐦' },
    { category: 'animals', sv: 'fisk', en: 'fish', emoji: '🐟' },
    { category: 'animals', sv: 'kanin', en: 'rabbit', emoji: '🐇' },
    { category: 'animals', sv: 'gris', en: 'pig', emoji: '🐷' },
    { category: 'animals', sv: 'anka', en: 'duck', emoji: '🦆' },
    { category: 'animals', sv: 'fjäril', en: 'butterfly', emoji: '🦋' },
    { category: 'animals', sv: 'björn', en: 'bear', emoji: '🐻' },
    { category: 'animals', sv: 'lejon', en: 'lion', emoji: '🦁' },
    { category: 'animals', sv: 'elefant', en: 'elephant', emoji: '🐘' },
    { category: 'animals', sv: 'orm', en: 'snake', emoji: '🐍' },
    { category: 'animals', sv: 'groda', en: 'frog', emoji: '🐸' },
    // Food
    { category: 'food', sv: 'äpple', en: 'apple', emoji: '🍎' },
    { category: 'food', sv: 'banan', en: 'banana', emoji: '🍌' },
    { category: 'food', sv: 'bröd', en: 'bread', emoji: '🍞' },
    { category: 'food', sv: 'mjölk', en: 'milk', emoji: '🥛' },
    { category: 'food', sv: 'ost', en: 'cheese', emoji: '🧀' },
    { category: 'food', sv: 'ägg', en: 'egg', emoji: '🥚' },
    { category: 'food', sv: 'kött', en: 'meat', emoji: '🥩' },
    { category: 'food', sv: 'ris', en: 'rice', emoji: '🍚' },
    { category: 'food', sv: 'soppa', en: 'soup', emoji: '🍲' },
    { category: 'food', sv: 'glass', en: 'ice cream', emoji: '🍦' },
    { category: 'food', sv: 'morot', en: 'carrot', emoji: '🥕' },
    { category: 'food', sv: 'tomat', en: 'tomato', emoji: '🍅' },
    { category: 'food', sv: 'vatten', en: 'water', emoji: '💧' },
    { category: 'food', sv: 'juice', en: 'juice', emoji: '🧃' },
    // Clothes
    { category: 'clothes', sv: 'tröja', en: 'sweater', emoji: '🧥' },
    { category: 'clothes', sv: 'byxor', en: 'pants', emoji: '👖' },
    { category: 'clothes', sv: 'skor', en: 'shoes', emoji: '👟' },
    { category: 'clothes', sv: 'mössa', en: 'hat', emoji: '🧢' },
    { category: 'clothes', sv: 'vantar', en: 'mittens', emoji: '🧤' },
    { category: 'clothes', sv: 'jacka', en: 'jacket', emoji: '🧥' },
    { category: 'clothes', sv: 'strumpor', en: 'socks', emoji: '🧦' },
    { category: 'clothes', sv: 'klänning', en: 'dress', emoji: '👗' },
    { category: 'clothes', sv: 't-shirt', en: 't-shirt', emoji: '👕' },
    { category: 'clothes', sv: 'stövlar', en: 'boots', emoji: '👢' },
    // Body
    { category: 'body', sv: 'huvud', en: 'head', emoji: '🗣️' },
    { category: 'body', sv: 'öga', en: 'eye', emoji: '👁️' },
    { category: 'body', sv: 'öra', en: 'ear', emoji: '👂' },
    { category: 'body', sv: 'näsa', en: 'nose', emoji: '👃' },
    { category: 'body', sv: 'mun', en: 'mouth', emoji: '👄' },
    { category: 'body', sv: 'hand', en: 'hand', emoji: '✋' },
    { category: 'body', sv: 'fot', en: 'foot', emoji: '🦶' },
    { category: 'body', sv: 'arm', en: 'arm', emoji: '💪' },
    { category: 'body', sv: 'ben', en: 'leg', emoji: '🦵' },
    { category: 'body', sv: 'mage', en: 'stomach', emoji: '🫃' },
    { category: 'body', sv: 'hjärta', en: 'heart', emoji: '❤️' },
    { category: 'body', sv: 'tand', en: 'tooth', emoji: '🦷' },
    // Home
    { category: 'home', sv: 'hus', en: 'house', emoji: '🏠' },
    { category: 'home', sv: 'dörr', en: 'door', emoji: '🚪' },
    { category: 'home', sv: 'fönster', en: 'window', emoji: '🪟' },
    { category: 'home', sv: 'stol', en: 'chair', emoji: '🪑' },
    { category: 'home', sv: 'bord', en: 'table', emoji: '🍽️' },
    { category: 'home', sv: 'säng', en: 'bed', emoji: '🛏️' },
    { category: 'home', sv: 'lampa', en: 'lamp', emoji: '💡' },
    { category: 'home', sv: 'tv', en: 'tv', emoji: '📺' },
    { category: 'home', sv: 'kök', en: 'kitchen', emoji: '🍳' },
    { category: 'home', sv: 'badrum', en: 'bathroom', emoji: '🛁' },
    { category: 'home', sv: 'soffa', en: 'sofa', emoji: '🛋️' },
    { category: 'home', sv: 'nyckel', en: 'key', emoji: '🔑' },
    // School
    { category: 'school', sv: 'bok', en: 'book', emoji: '📕' },
    { category: 'school', sv: 'penna', en: 'pen', emoji: '✏️' },
    { category: 'school', sv: 'lärare', en: 'teacher', emoji: '👩‍🏫' },
    { category: 'school', sv: 'skola', en: 'school', emoji: '🏫' },
    { category: 'school', sv: 'väska', en: 'bag', emoji: '🎒' },
    { category: 'school', sv: 'papper', en: 'paper', emoji: '📄' },
    { category: 'school', sv: 'sax', en: 'scissors', emoji: '✂️' },
    { category: 'school', sv: 'linjal', en: 'ruler', emoji: '📏' },
    { category: 'school', sv: 'dator', en: 'computer', emoji: '💻' },
    { category: 'school', sv: 'klocka', en: 'clock', emoji: '🕐' },
  ];

  const ENCOURAGEMENTS = ['dict.great', 'dict.fantastic', 'dict.star', 'dict.well_done'];

  // State
  let mode = $state<Mode>('categories');
  let activeCategory = $state<string | null>(null);
  let stars = $state(0);
  let wordsLearned = $state<string[]>([]);

  // Flashcard state
  let flashCards = $state<Word[]>([]);
  let flashIdx = $state(0);
  let flashRevealed = $state(false);

  // Quiz state
  let quizWord = $state<Word | null>(null);
  let quizChoices = $state<Word[]>([]);
  let quizAnswered = $state(false);
  let quizFeedback = $state('');
  let quizScore = $state(0);
  let quizTotal = $state(0);

  $effect(() => { loadProgress(); });

  async function loadProgress() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'picture-dictionary');
      if (data) {
        stars = (data.stars as number) || 0;
        wordsLearned = (data.wordsLearned as string[]) || [];
      }
    }
  }

  async function saveProgress() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'picture-dictionary', { stars, wordsLearned });
  }

  function wordText(w: Word): string {
    const lang = get(locale);
    return lang === 'sv' ? w.sv : w.en;
  }

  function speakWord(w: Word) {
    speak(wordText(w));
  }

  function categoryWords(cat: string): Word[] {
    return WORDS.filter(w => w.category === cat);
  }

  function learnWord(w: Word) {
    const id = `${w.category}:${w.sv}`;
    if (!wordsLearned.includes(id)) {
      wordsLearned = [...wordsLearned, id];
      stars++;
      saveProgress();
    }
  }

  // Browse
  function openCategory(cat: string) {
    activeCategory = cat;
    mode = 'browse';
  }

  function tapWord(w: Word) {
    speakWord(w);
    learnWord(w);
  }

  // Flashcard
  function startFlashcards(cat?: string) {
    const pool = cat ? categoryWords(cat) : [...WORDS];
    flashCards = pool.sort(() => Math.random() - 0.5);
    flashIdx = 0;
    flashRevealed = false;
    mode = 'flashcard';
  }

  function revealFlash() {
    flashRevealed = true;
    speakWord(flashCards[flashIdx]);
    learnWord(flashCards[flashIdx]);
  }

  function nextFlash() {
    flashIdx++;
    flashRevealed = false;
    if (flashIdx >= flashCards.length) {
      flashIdx = 0;
      flashCards = flashCards.sort(() => Math.random() - 0.5);
    }
  }

  // Quiz
  function startQuiz(cat?: string) {
    quizScore = 0;
    quizTotal = 0;
    mode = 'quiz';
    nextQuiz(cat);
  }

  function nextQuiz(cat?: string) {
    quizAnswered = false;
    quizFeedback = '';
    const pool = cat ? categoryWords(cat) : [...WORDS];
    const target = pool[Math.floor(Math.random() * pool.length)];
    quizWord = target;
    // 3 wrong + 1 correct
    const others = pool.filter(w => w.sv !== target.sv).sort(() => Math.random() - 0.5).slice(0, 3);
    quizChoices = [...others, target].sort(() => Math.random() - 0.5);
    // Speak the word
    setTimeout(() => speakWord(target), 400);
  }

  function answerQuiz(w: Word) {
    if (quizAnswered || !quizWord) return;
    quizAnswered = true;
    quizTotal++;
    if (w.sv === quizWord.sv) {
      quizScore++;
      quizFeedback = $t(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
      learnWord(w);
    } else {
      quizFeedback = `${$t('dict.correct_was')} ${quizWord.emoji} ${wordText(quizWord)}`;
      setTimeout(() => speakWord(quizWord!), 600);
    }
  }

  function goBack() {
    if (mode === 'categories') goto('/');
    else { mode = 'categories'; activeCategory = null; }
  }
</script>

<WelcomeDialog appId="picture-dictionary" titleKey="app.picture_dictionary" purposeKey="welcome.pictureDictionary.purpose" howKey="welcome.pictureDictionary.how" goalKey="welcome.pictureDictionary.goal" icon="📖" />

<div class="dict-page">
  <header class="app-header">
    <button class="back-btn" onclick={goBack} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('dict.title')}</h1>
    <div class="stats-bar">
      <span class="stat">⭐ {stars}</span>
      <span class="stat">{wordsLearned.length}/{WORDS.length}</span>
    </div>
  </header>

  {#if mode === 'categories'}
    <div class="cat-page" transition:fade>
      <p class="instruction">{$t('dict.pick_category')}</p>
      <div class="cat-grid">
        {#each Object.entries(CATEGORIES) as [key, cat]}
          <button class="cat-card" onclick={() => openCategory(key)}>
            <span class="cat-icon">{cat.icon}</span>
            <h3>{$t(cat.name)}</h3>
            <span class="cat-count">{categoryWords(key).length} {$t('dict.words')}</span>
          </button>
        {/each}
      </div>

      <div class="action-row">
        <button class="mode-btn" onclick={() => startFlashcards()}>🃏 {$t('dict.flashcards_all')}</button>
        <button class="mode-btn quiz" onclick={() => startQuiz()}>🧠 {$t('dict.quiz_all')}</button>
      </div>
    </div>

  {:else if mode === 'browse'}
    <div class="browse-page" transition:fade>
      {#if activeCategory}
        <div class="browse-header">
          <span class="cat-badge">{CATEGORIES[activeCategory].icon} {$t(CATEGORIES[activeCategory].name)}</span>
          <div class="browse-actions">
            <button class="sm-btn" onclick={() => startFlashcards(activeCategory!)}>🃏</button>
            <button class="sm-btn" onclick={() => startQuiz(activeCategory!)}>🧠</button>
          </div>
        </div>
      {/if}

      <div class="word-grid">
        {#each categoryWords(activeCategory || '') as w}
          {@const learned = wordsLearned.includes(`${w.category}:${w.sv}`)}
          {@const hasTakk = hasTakkSign(w.sv)}
          <div class="word-card-wrap">
            <button class="word-card" class:learned class:has-takk={hasTakk} onclick={() => tapWord(w)}>
              <span class="word-emoji">{w.emoji}</span>
              <span class="word-text">{wordText(w)}</span>
              {#if learned}<span class="learned-check">✓</span>{/if}
            </button>
            {#if hasTakk}
              <button class="takk-btn" onclick={() => openSignVideo(w.sv)} title="TAKK">
                🤟
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>

  {:else if mode === 'flashcard'}
    <div class="flash-page" transition:fade>
      {#if flashCards.length > 0}
        <p class="flash-counter">{flashIdx + 1} / {flashCards.length}</p>

        <button class="flash-card" class:revealed={flashRevealed} onclick={() => !flashRevealed ? revealFlash() : nextFlash()}>
          <span class="flash-emoji">{flashCards[flashIdx].emoji}</span>
          {#if flashRevealed}
            <span class="flash-word">{wordText(flashCards[flashIdx])}</span>
          {:else}
            <span class="flash-hint">{$t('dict.tap_to_reveal')}</span>
          {/if}
        </button>

        {#if flashRevealed}
          <div class="flash-actions">
            <button class="replay-btn" onclick={() => speakWord(flashCards[flashIdx])}>🔊</button>
            <button class="next-btn" onclick={nextFlash}>{$t('dict.next')} ➡️</button>
          </div>
        {/if}
      {/if}
    </div>

  {:else if mode === 'quiz'}
    <div class="quiz-page" transition:fade>
      <p class="quiz-score">{$t('dict.score')}: {quizScore}/{quizTotal}</p>

      {#if quizWord}
        <p class="quiz-prompt">{$t('dict.which_is')} <strong>{wordText(quizWord)}</strong>?</p>
        <button class="replay-btn" onclick={() => { if (quizWord) speakWord(quizWord); }}>🔊 {$t('dict.hear_again')}</button>

        {#if quizFeedback}<p class="feedback">{quizFeedback}</p>{/if}

        <div class="quiz-grid">
          {#each quizChoices as w}
            <button class="quiz-choice"
              class:correct={quizAnswered && w.sv === quizWord?.sv}
              class:wrong={quizAnswered && w.sv !== quizWord?.sv}
              onclick={() => answerQuiz(w)}
              disabled={quizAnswered}>
              <span class="choice-emoji">{w.emoji}</span>
            </button>
          {/each}
        </div>

        {#if quizAnswered}
          <button class="next-btn" onclick={() => nextQuiz(activeCategory || undefined)}>{$t('dict.next')} ➡️</button>
        {/if}
      {/if}
    </div>
  {/if}

  <footer class="credit">{$t('dict.credit')}</footer>
</div>

<style>
  .dict-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .stats-bar { display: flex; gap: 10px; }
  .stat { font-weight: 600; font-size: 0.9em; color: var(--text-muted); }

  .instruction { text-align: center; padding: 16px; font-weight: 600; color: var(--text-muted); }
  .feedback { text-align: center; font-size: 1.1em; font-weight: 700; color: #27AE60; padding: 8px; }

  /* Categories */
  .cat-page { flex: 1; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; width: 100%; max-width: 600px; }
  .cat-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 20px 12px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); transition: all 0.2s; text-align: center;
  }
  .cat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: #3498DB; }
  .cat-icon { font-size: 2.5em; }
  .cat-card h3 { font-size: 1em; font-weight: 700; }
  .cat-count { font-size: 0.75em; color: var(--text-muted); }

  .action-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .mode-btn {
    padding: 14px 28px; border-radius: 100px; font-weight: 700;
    border: 2px solid var(--border); background: var(--bg-card); font-size: 1em; min-height: 48px;
  }
  .mode-btn.quiz { border-color: #9B59B6; color: #9B59B6; }

  /* Browse */
  .browse-page { flex: 1; padding: 12px; }
  .browse-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; }
  .cat-badge { font-weight: 700; font-size: 1.1em; }
  .browse-actions { display: flex; gap: 8px; }
  .sm-btn { width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border); font-size: 1.2em; background: var(--bg-card); }

  .word-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; padding: 8px 0; }
  .word-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 16px 8px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); transition: all 0.15s; position: relative; min-height: 48px;
  }
  .word-card:hover { transform: scale(1.05); box-shadow: var(--shadow); }
  .word-card:active { transform: scale(0.97); }
  .word-card.learned { border-color: #27AE60; }
  .word-card.has-takk { border-left: 4px solid #9B59B6; }
  .word-emoji { font-size: 2.5em; }
  .word-text { font-weight: 700; font-size: 1em; }
  .learned-check { position: absolute; top: 4px; right: 6px; color: #27AE60; font-size: 0.8em; }

  /* Flashcard */
  .flash-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .flash-counter { font-weight: 600; color: var(--text-muted); }
  .flash-card {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
    width: 280px; height: 320px; border: 3px solid var(--border); border-radius: 24px;
    background: var(--bg-card); box-shadow: var(--shadow-lg); transition: all 0.3s;
  }
  .flash-card:hover { transform: scale(1.02); }
  .flash-card.revealed { border-color: #27AE60; }
  .flash-emoji { font-size: 5em; }
  .flash-word { font-size: 2em; font-weight: 800; }
  .flash-hint { font-size: 0.9em; color: var(--text-muted); }
  .flash-actions { display: flex; gap: 12px; }

  .replay-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 10px 20px; background: var(--bg-card);
    border: 1px solid var(--border); border-radius: 100px; font-weight: 600; min-height: 48px;
  }
  .next-btn {
    padding: 14px 32px; background: #3498DB;
    color: white; border-radius: 100px; font-weight: 700; font-size: 1.05em; border: none; min-height: 48px;
  }

  /* Quiz */
  .quiz-page { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .quiz-score { font-weight: 700; color: var(--text-muted); }
  .quiz-prompt { font-size: 1.3em; font-weight: 700; text-align: center; }
  .quiz-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 320px; }
  .quiz-choice {
    display: flex; align-items: center; justify-content: center;
    width: 140px; height: 140px; border: 3px solid var(--border); border-radius: 20px;
    background: var(--bg-card); transition: all 0.15s;
  }
  .quiz-choice:hover { transform: scale(1.05); }
  .quiz-choice.correct { border-color: #27AE60; background: rgba(39,174,96,0.15); }
  .quiz-choice.wrong { opacity: 0.4; }
  .choice-emoji { font-size: 3.5em; }

  .word-card-wrap { position: relative; }
  .takk-btn {
    position: absolute; bottom: 4px; right: 4px; width: 28px; height: 28px;
    border-radius: 50%; border: 1px solid #9B59B6; background: rgba(155,89,182,0.1);
    font-size: 0.9em; display: flex; align-items: center; justify-content: center;
  }
  .takk-btn:hover { background: rgba(155,89,182,0.25); }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }

  @media (prefers-reduced-motion: reduce) {
    .word-card, .flash-card, .quiz-choice { transition: none; }
  }
</style>
