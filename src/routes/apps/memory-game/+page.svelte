<script>
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const THEMES = [
    { id: 'animals', icon: '🐾', emojis: ['🐶','🐱','🐰','🐸','🐻','🦊','🐨','🐼'] },
    { id: 'food', icon: '🍎', emojis: ['🍎','🍌','🍕','🍦','🧁','🥕','🍓','🥑'] },
    { id: 'transport', icon: '🚗', emojis: ['🚗','🚌','✈️','🚂','🚲','🛴','🚀','⛵'] },
    { id: 'nature', icon: '🌳', emojis: ['🌻','🌈','⭐','🌙','❄️','🔥','💧','🍄'] },
  ];

  let theme = $state(null);
  let pairs = $state(4); // 4, 6, or 8
  let cards = $state([]);
  let flipped = $state([]);
  let matched = $state(new Set());
  let moves = $state(0);
  let gameWon = $state(false);
  let lockBoard = $state(false);

  function startGame(thm) {
    theme = t;
    const selected = thm.emojis.slice(0, pairs);
    const deck = [...selected, ...selected].map((emoji, i) => ({ id: i, emoji }));
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    cards = deck;
    flipped = [];
    matched = new Set();
    moves = 0;
    gameWon = false;
  }

  function flipCard(idx) {
    if (lockBoard || flipped.includes(idx) || matched.has(cards[idx].emoji)) return;
    flipped = [...flipped, idx];
    speak(cards[idx].emoji);

    if (flipped.length === 2) {
      moves++;
      lockBoard = true;
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        matched = new Set([...matched, cards[a].emoji]);
        flipped = [];
        lockBoard = false;
        if (matched.size === pairs) {
          gameWon = true;
          speak($t('memoryGame.youWon'));
        }
      } else {
        setTimeout(() => { flipped = []; lockBoard = false; }, 1000);
      }
    }
  }

  let gridCols = $derived(pairs <= 4 ? 4 : pairs <= 6 ? 4 : 4);
</script>

<WelcomeDialog appId="memory-game" titleKey="app.memory_game" purposeKey="welcome.memoryGame.purpose" howKey="welcome.memoryGame.how" goalKey="welcome.memoryGame.goal" icon="🃏" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => theme ? (theme = null) : goto('/')}>←</button>
    <h1>🧩 {$t('memoryGame.title')}</h1>
    {#if theme}<span class="moves">{moves} {$t('memoryGame.moves')}</span>{/if}
  </header>

  <main class="cnt">
    {#if !theme}
      <h2>{$t('memoryGame.pickTheme')}</h2>
      <div class="size-picker">
        {#each [4, 6, 8] as p}
          <button class="size-btn" class:active={pairs === p} onclick={() => pairs = p}>{p} {$t('memoryGame.pairs')}</button>
        {/each}
      </div>
      <div class="grid">
        {#each THEMES as thm}
          <button class="card theme-card" onclick={() => startGame(thm)}>
            <span class="ico">{thm.icon}</span>
            <span class="nm">{$t(`memoryGame.theme.${thm.id}`)}</span>
          </button>
        {/each}
      </div>
    {:else if gameWon}
      <div class="win">
        <span class="big">🎉</span>
        <h2>{$t('memoryGame.youWon')}</h2>
        <p>{moves} {$t('memoryGame.moves')}</p>
        <button class="action-btn" onclick={() => startGame(theme)}>🔄 {$t('memoryGame.playAgain')}</button>
        <button class="action-btn" onclick={() => theme = null}>📋 {$t('memoryGame.newTheme')}</button>
      </div>
    {:else}
      <div class="board" style="grid-template-columns: repeat({gridCols}, 1fr)">
        {#each cards as card, idx}
          <button
            class="mem-card"
            class:face-up={flipped.includes(idx) || matched.has(card.emoji)}
            class:matched={matched.has(card.emoji)}
            onclick={() => flipCard(idx)}
          >
            {#if flipped.includes(idx) || matched.has(card.emoji)}
              <span class="emoji">{card.emoji}</span>
            {:else}
              <span class="q">?</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  .moves { font-size:.9rem; font-weight:600; background:#fff3e0; color:#e65100; padding:.25rem .75rem; border-radius:20px; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  h2 { text-align:center; margin-bottom:1rem; }
  .size-picker { display:flex; justify-content:center; gap:.5rem; margin-bottom:1.5rem; }
  .size-btn { padding:.5rem 1rem; border:2px solid var(--border); border-radius:8px; background:var(--bg-card); cursor:pointer; min-height:44px; }
  .size-btn.active { border-color:var(--accent,#2196f3); background:#e3f2fd; }
  .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
  .theme-card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.25rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; }
  .board { display:grid; gap:.5rem; }
  .mem-card { aspect-ratio:1; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:2rem; min-height:48px; transition:transform .3s; }
  .face-up { background:#e3f2fd; border-color:var(--accent,#2196f3); }
  .matched { background:#e8f5e9; border-color:#4caf50; opacity:.7; }
  .emoji { font-size:2rem; }
  .q { font-size:2rem; color:var(--text-secondary); font-weight:700; }
  .win { text-align:center; padding:2rem; }
  .big { font-size:4rem; display:block; }
  .action-btn { padding:.75rem 1.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.1rem; cursor:pointer; min-height:48px; margin:.5rem; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
  @media(prefers-reduced-motion:reduce) { .mem-card { transition:none; } }
</style>
