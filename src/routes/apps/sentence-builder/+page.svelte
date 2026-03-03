<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';
  import { awardStar, GoldStarBurst } from '$lib/rewards';

  // Fitzgerald Key: yellow=person, green=verb, orange=object
  const SENTENCES = [
    { parts: [
      { wordKey: 'sentence.jag', cat: 'person' },
      { wordKey: 'sentence.vill', cat: 'verb' },
      { wordKey: 'sentence.ata', cat: 'verb' },
      { wordKey: 'sentence.mat', cat: 'object' },
    ]},
    { parts: [
      { wordKey: 'sentence.jag', cat: 'person' },
      { wordKey: 'sentence.vill', cat: 'verb' },
      { wordKey: 'sentence.dricka', cat: 'verb' },
      { wordKey: 'sentence.vatten', cat: 'object' },
    ]},
    { parts: [
      { wordKey: 'sentence.mamma', cat: 'person' },
      { wordKey: 'sentence.laser', cat: 'verb' },
      { wordKey: 'sentence.en', cat: 'other' },
      { wordKey: 'sentence.bok', cat: 'object' },
    ]},
    { parts: [
      { wordKey: 'sentence.katten', cat: 'person' },
      { wordKey: 'sentence.sover', cat: 'verb' },
      { wordKey: 'sentence.pa', cat: 'other' },
      { wordKey: 'sentence.soffan', cat: 'object' },
    ]},
    { parts: [
      { wordKey: 'sentence.jag', cat: 'person' },
      { wordKey: 'sentence.ar', cat: 'verb' },
      { wordKey: 'sentence.glad', cat: 'feeling' },
    ]},
    { parts: [
      { wordKey: 'sentence.vi', cat: 'person' },
      { wordKey: 'sentence.gar', cat: 'verb' },
      { wordKey: 'sentence.till', cat: 'other' },
      { wordKey: 'sentence.skolan', cat: 'object' },
    ]},
  ];

  const CAT_COLORS = { person: '#f5c542', verb: '#4caf50', object: '#ff9800', feeling: '#2196f3', other: '#9e9e9e' };

  let sentIdx = $state(0);
  let available = $state([]);
  let placed = $state([]);
  let correct = $state(false);
  let score = $state(0);
  let showStar = $state(false);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function load() {
    available = shuffle(SENTENCES[sentIdx].parts.map((p, i) => ({ ...p, id: i, used: false })));
    placed = [];
    correct = false;
  }
  load();

  function placeWord(w) {
    if (w.used) return;
    placed = [...placed, w];
    available = available.map(a => a.id === w.id ? { ...a, used: true } : a);
    speak($t(w.wordKey));

    if (placed.length === SENTENCES[sentIdx].parts.length) {
      const built = placed.map(p => $t(p.wordKey)).join(' ');
      const target = SENTENCES[sentIdx].parts.map(p => $t(p.wordKey)).join(' ');
      if (built === target) {
        correct = true;
        score++;
        speak(built);
        awardStarAsync();
      } else {
        speak($t('sentenceBuilder.tryAgain'));
        setTimeout(() => load(), 1200);
      }
    }
  }

  function removeWord(idx) {
    const w = placed[idx];
    placed = placed.filter((_, i) => i !== idx);
    available = available.map(a => a.id === w.id ? { ...a, used: false } : a);
  }

  function next() {
    sentIdx = (sentIdx + 1) % SENTENCES.length;
    load();
  }

  async function awardStarAsync() {
    await awardStar('sentence-builder', 'rewards.star.completed');
    showStar = true;
    setTimeout(() => showStar = false, 2000);
  }
</script>

<WelcomeDialog appId="sentence-builder" titleKey="app.sentence_builder" purposeKey="welcome.sentenceBuilder.purpose" howKey="welcome.sentenceBuilder.how" goalKey="welcome.sentenceBuilder.goal" icon="✏️" />

<GoldStarBurst show={showStar} />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">

    <h1>📝 {$t('sentenceBuilder.title')}</h1>

    <span class="score">⭐ {score}</span>

  </div>

    <div class="strip">
      {#each placed as w, i}
        <button class="strip-word" style="--wc:{CAT_COLORS[w.cat]}" onclick={() => removeWord(i)}>{$t(w.wordKey)}</button>
      {/each}
      {#if placed.length === 0}
        <span class="placeholder">{$t('sentenceBuilder.buildHere')}</span>
      {/if}
    </div>

    {#if correct}
      <div class="success" in:fade>
        <p>🎉 {$t('sentenceBuilder.correct')}!</p>
        <button class="next-btn" onclick={next}>▶ {$t('sentenceBuilder.next')}</button>
      </div>
    {:else}
      <div class="words">
        {#each available as w}
          <button
            class="word-btn"
            class:used={w.used}
            style="--wc:{CAT_COLORS[w.cat]}"
            onclick={() => placeWord(w)}
            disabled={w.used}
          >
            {$t(w.wordKey)}
          </button>
        {/each}
      </div>
    {/if}

    <div class="legend">
      {#each Object.entries(CAT_COLORS) as [cat, color]}
        <span class="legend-item"><span class="legend-dot" style="background:{color}"></span> {$t(`sentenceBuilder.cat.${cat}`)}</span>
      {/each}
    </div>
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0 · Fitzgerald Key</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  .score { font-weight:700; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .strip { display:flex; flex-wrap:wrap; gap:.5rem; min-height:60px; padding:1rem; border:3px dashed var(--border); border-radius:16px; margin-bottom:1.5rem; align-items:center; }
  .strip-word { padding:.5rem 1rem; border:2px solid var(--wc); border-radius:8px; background:var(--bg-card); font-size:1.2rem; font-weight:600; cursor:pointer; min-height:44px; }
  .placeholder { color:var(--text-secondary); font-style:italic; }
  .words { display:flex; flex-wrap:wrap; gap:.75rem; justify-content:center; }
  .word-btn { padding:.75rem 1.25rem; border:3px solid var(--wc); border-radius:12px; background:var(--bg-card); font-size:1.3rem; font-weight:600; cursor:pointer; min-height:48px; }
  .word-btn:hover:not(:disabled) { background:color-mix(in srgb, var(--wc) 15%, var(--bg-card)); }
  .word-btn.used { opacity:.2; }
  .success { text-align:center; margin:1rem 0; }
  .success p { font-size:1.5rem; font-weight:700; color:#4caf50; }
  .next-btn { padding:.75rem 2rem; border:2px solid #4caf50; border-radius:12px; background:#e8f5e9; font-size:1.2rem; cursor:pointer; min-height:48px; }
  .legend { display:flex; flex-wrap:wrap; gap:.75rem; justify-content:center; margin-top:2rem; }
  .legend-item { display:flex; align-items:center; gap:.3rem; font-size:.85rem; color:var(--text-secondary); }
  .legend-dot { width:12px; height:12px; border-radius:50%; display:inline-block; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
