<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const BOARDS = [
    { id: 'needs', icon: '🙋', cards: [
      { icon: '🍽️', key: 'pecsBoard.eat' }, { icon: '💧', key: 'pecsBoard.drink' },
      { icon: '🚽', key: 'pecsBoard.toilet' }, { icon: '😴', key: 'pecsBoard.sleep' },
      { icon: '🤗', key: 'pecsBoard.hug' }, { icon: '🆘', key: 'pecsBoard.help' },
    ]},
    { id: 'feelings', icon: '😊', cards: [
      { icon: '😊', key: 'pecsBoard.happy' }, { icon: '😢', key: 'pecsBoard.sad' },
      { icon: '😡', key: 'pecsBoard.angry' }, { icon: '😰', key: 'pecsBoard.worried' },
      { icon: '😴', key: 'pecsBoard.tired' }, { icon: '🤒', key: 'pecsBoard.sick' },
    ]},
    { id: 'activities', icon: '🎮', cards: [
      { icon: '🎮', key: 'pecsBoard.play' }, { icon: '📖', key: 'pecsBoard.read' },
      { icon: '🎨', key: 'pecsBoard.draw' }, { icon: '🎵', key: 'pecsBoard.music' },
      { icon: '🚶', key: 'pecsBoard.walk' }, { icon: '📺', key: 'pecsBoard.watch' },
    ]},
  ];

  let board = $state(null);
  let strip = $state([]);

  function addToStrip(card) {
    strip = [...strip, card];
    speak($t(card.key));
  }

  function speakStrip() {
    speak(strip.map(c => $t(c.key)).join(', '));
  }

  function clearStrip() { strip = []; }
</script>

<WelcomeDialog appId="pecs-board" titleKey="app.pecs_board" purposeKey="welcome.pecsBoard.purpose" howKey="welcome.pecsBoard.how" goalKey="welcome.pecsBoard.goal" icon="🖼️" />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">
    {#if board}<button class="sub-back" onclick={() => { board = null }} aria-label="Tillbaka">←</button>{/if}
    <h1>🖼️ {$t('pecsBoard.title')}</h1>

  </div>

    {#if strip.length > 0}
      <div class="strip">
        {#each strip as c}<span class="strip-item">{c.icon}</span>{/each}
        <button class="strip-speak" onclick={speakStrip}>🔊</button>
        <button class="strip-clear" onclick={clearStrip}>✕</button>
      </div>
    {/if}

    {#if !board}
      <div class="grid">
        {#each BOARDS as b}
          <button class="card" onclick={() => { board = b; speak($t(`pecsBoard.board.${b.id}`)); }}>
            <span class="ico">{b.icon}</span>
            <span class="nm">{$t(`pecsBoard.board.${b.id}`)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <h2>{board.icon} {$t(`pecsBoard.board.${board.id}`)}</h2>
      <div class="cards">
        {#each board.cards as card}
          <button class="pecs-card" onclick={() => addToStrip(card)}>
            <span class="pecs-icon">{card.icon}</span>
            <span class="pecs-label">{$t(card.key)}</span>
          </button>
        {/each}
      </div>
    {/if}
  </main>
  <footer class="cr"><p>PECS® (Frost & Bondy) · Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  h1 { font-size:1.4rem; margin:0; }
  h2 { text-align:center; margin:.5rem 0 1rem; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .strip { display:flex; align-items:center; gap:.5rem; padding:.75rem; background:var(--bg-card); border:2px solid var(--accent,#2196f3); border-radius:12px; margin-bottom:1rem; flex-wrap:wrap; }
  .strip-item { font-size:2rem; }
  .strip-speak,.strip-clear { background:none; border:none; font-size:1.3rem; cursor:pointer; min-width:44px; min-height:44px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:1rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.25rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; }
  .cards { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
  .pecs-card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1rem; border:3px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .pecs-card:hover { border-color:var(--accent,#2196f3); }
  .pecs-icon { font-size:2.5rem; }
  .pecs-label { font-weight:600; font-size:.95rem; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
