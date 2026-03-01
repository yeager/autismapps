<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // Fitzgerald Key: yellow=person, green=verb, orange=object
  const SENTENCES = [
    { parts: [
      { word: 'Jag', cat: 'person' },
      { word: 'vill', cat: 'verb' },
      { word: 'äta', cat: 'verb' },
      { word: 'mat', cat: 'object' },
    ]},
    { parts: [
      { word: 'Jag', cat: 'person' },
      { word: 'vill', cat: 'verb' },
      { word: 'dricka', cat: 'verb' },
      { word: 'vatten', cat: 'object' },
    ]},
    { parts: [
      { word: 'Mamma', cat: 'person' },
      { word: 'läser', cat: 'verb' },
      { word: 'en', cat: 'other' },
      { word: 'bok', cat: 'object' },
    ]},
    { parts: [
      { word: 'Katten', cat: 'person' },
      { word: 'sover', cat: 'verb' },
      { word: 'på', cat: 'other' },
      { word: 'soffan', cat: 'object' },
    ]},
    { parts: [
      { word: 'Jag', cat: 'person' },
      { word: 'är', cat: 'verb' },
      { word: 'glad', cat: 'feeling' },
    ]},
    { parts: [
      { word: 'Vi', cat: 'person' },
      { word: 'går', cat: 'verb' },
      { word: 'till', cat: 'other' },
      { word: 'skolan', cat: 'object' },
    ]},
  ];

  const CAT_COLORS = { person: '#f5c542', verb: '#4caf50', object: '#ff9800', feeling: '#2196f3', other: '#9e9e9e' };

  let sentIdx = $state(0);
  let available = $state([]);
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
    speak(w.word);

    if (placed.length === SENTENCES[sentIdx].parts.length) {
      const built = placed.map(p => p.word).join(' ');
      const target = SENTENCES[sentIdx].parts.map(p => p.word).join(' ');
      if (built === target) {
        correct = true;
        score++;
        speak(built);
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
</script>

<WelcomeDialog appId="sentence-builder" titleKey="app.sentence_builder" purposeKey="welcome.sentenceBuilder.purpose" howKey="welcome.sentenceBuilder.how" goalKey="welcome.sentenceBuilder.goal" icon="✏️" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)}>←</button>
    <h1>📝 {$t('sentenceBuilder.title')}</h1>
    <span class="score">⭐ {score}</span>
  </header>

  <main class="cnt">
    <div class="strip">
      {#each placed as w, i}
        <button class="strip-word" style="--wc:{CAT_COLORS[w.cat]}" onclick={() => removeWord(i)}>{w.word}</button>
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
            {w.word}
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
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
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
