<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const WORDS = [
    { word: 'SOL', hint: '☀️' },
    { word: 'BIL', hint: '🚗' },
    { word: 'HUS', hint: '🏠' },
    { word: 'KATT', hint: '🐱' },
    { word: 'HUND', hint: '🐶' },
    { word: 'BOLL', hint: '⚽' },
    { word: 'MAT', hint: '🍽️' },
    { word: 'BOK', hint: '📖' },
    { word: 'FISK', hint: '🐟' },
    { word: 'MJÖLK', hint: '🥛' },
    { word: 'ÄPPLE', hint: '🍎' },
    { word: 'VATTEN', hint: '💧' },
  ];

  let wordIdx = $state(0);
  let letters = $state([]);
  let placed = $state([]);
  let correct = $state(false);
  let score = $state(0);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadWord() {
    const w = WORDS[wordIdx];
    letters = shuffle(w.word.split('').map((ch, i) => ({ ch, id: i, used: false })));
    placed = Array(w.word.length).fill(null);
    correct = false;
  }

  loadWord();

  function placeLetter(letter) {
    if (letter.used) return;
    const idx = placed.findIndex(p => p === null);
    if (idx === -1) return;
    placed = placed.map((p, i) => i === idx ? letter : p);
    letters = letters.map(l => l.id === letter.id ? { ...l, used: true } : l);
    speak(letter.ch);

    // Check if complete
    if (placed.every(p => p !== null)) {
      const built = placed.map(p => p.ch).join('');
      if (built === WORDS[wordIdx].word) {
        correct = true;
        score++;
        speak(`${WORDS[wordIdx].word}! ${$t('wordBuilder.correct')}`);
      } else {
        speak($t('wordBuilder.tryAgain'));
        setTimeout(() => {
          letters = letters.map(l => ({ ...l, used: false }));
          placed = Array(WORDS[wordIdx].word.length).fill(null);
        }, 1000);
      }
    }
  }

  function removeLetter(idx) {
    if (!placed[idx]) return;
    const letter = placed[idx];
    placed = placed.map((p, i) => i === idx ? null : p);
    letters = letters.map(l => l.id === letter.id ? { ...l, used: false } : l);
  }

  function nextWord() {
    wordIdx = (wordIdx + 1) % WORDS.length;
    loadWord();
  }
</script>

<WelcomeDialog appId="word-builder" titleKey="app.word_builder" purposeKey="welcome.wordBuilder.purpose" howKey="welcome.wordBuilder.how" goalKey="welcome.wordBuilder.goal" icon="🔤" />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">

    <h1>🔤 {$t('wordBuilder.title')}</h1>

    <span class="score">⭐ {score}</span>

  </div>

    <div class="hint">{WORDS[wordIdx].hint}</div>

    <div class="slots">
      {#each placed as p, i}
        <button class="slot" class:filled={p} class:correct onclick={() => removeLetter(i)}>
          {p ? p.ch : ''}
        </button>
      {/each}
    </div>

    {#if correct}
      <div class="success" in:fade>
        <p>🎉 {$t('wordBuilder.correct')}!</p>
        <button class="next-btn" onclick={nextWord}>▶ {$t('wordBuilder.next')}</button>
      </div>
    {:else}
      <div class="available">
        {#each letters as letter}
          <button
            class="letter-btn"
            class:used={letter.used}
            onclick={() => placeLetter(letter)}
            disabled={letter.used}
          >
            {letter.ch}
          </button>
        {/each}
      </div>
    {/if}

    <button class="speak-btn" onclick={() => speak(WORDS[wordIdx].word)}>🔊 {$t('wordBuilder.hear')}</button>
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  .score { font-weight:700; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; text-align:center; }
  .hint { font-size:4rem; margin:1rem 0; }
  .slots { display:flex; justify-content:center; gap:.5rem; margin:1.5rem 0; }
  .slot { width:52px; height:60px; border:3px dashed var(--border); border-radius:12px; background:var(--bg-card); font-size:1.8rem; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .slot.filled { border-style:solid; border-color:var(--accent,#2196f3); }
  .slot.correct { border-color:#4caf50; background:#e8f5e9; }
  .available { display:flex; justify-content:center; gap:.5rem; flex-wrap:wrap; margin:1rem 0; }
  .letter-btn { width:56px; height:60px; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.8rem; font-weight:700; cursor:pointer; min-height:48px; }
  .letter-btn:hover:not(:disabled) { border-color:var(--accent,#2196f3); background:#e3f2fd; }
  .letter-btn.used { opacity:.2; }
  .success p { font-size:1.5rem; font-weight:700; color:#4caf50; }
  .next-btn { padding:.75rem 2rem; border:2px solid #4caf50; border-radius:12px; background:#e8f5e9; font-size:1.2rem; cursor:pointer; min-height:48px; margin-top:.5rem; }
  .speak-btn { margin-top:1.5rem; padding:.75rem 1.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.1rem; cursor:pointer; min-height:48px; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
