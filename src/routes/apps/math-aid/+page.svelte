<script>
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  let mode = $state('menu'); // menu, addition, subtraction
  let a = $state(0), b = $state(0), answer = $state(null), op = $state('+');
  let userAnswer = $state('');
  let correct = $state(null);
  let score = $state(0);
  let total = $state(0);
  let maxNum = $state(10);

  function startMode(m) {
    mode = m;
    op = m === 'addition' ? '+' : '-';
    score = 0; total = 0;
    newProblem();
  }

  function newProblem() {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * (op === '-' ? a : maxNum)) + 1;
    if (op === '-' && b > a) [a, b] = [b, a];
    answer = op === '+' ? a + b : a - b;
    userAnswer = '';
    correct = null;
    speak(`${a} ${op === '+' ? 'plus' : 'minus'} ${b}`);
  }

  function check() {
    total++;
    if (parseInt(userAnswer) === answer) {
      correct = true;
      score++;
      speak($t('mathAid.correct'));
      setTimeout(newProblem, 1500);
    } else {
      correct = false;
      speak(`${$t('mathAid.wrong')}. ${a} ${op} ${b} = ${answer}`);
      setTimeout(() => { correct = null; }, 2000);
    }
  }

  function tapNum(n) {
    if (correct === true) return;
    userAnswer += String(n);
  }

  function clearAnswer() { userAnswer = ''; correct = null; }
</script>

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => mode === 'menu' ? goto('/') : (mode = 'menu')}>←</button>
    <h1>🔢 {$t('mathAid.title')}</h1>
    {#if mode !== 'menu'}<span class="score">{score}/{total}</span>{/if}
  </header>

  <main class="cnt">
    {#if mode === 'menu'}
      <div class="grid">
        <button class="card" onclick={() => startMode('addition')}>
          <span class="ico">➕</span><span class="nm">{$t('mathAid.addition')}</span>
        </button>
        <button class="card" onclick={() => startMode('subtraction')}>
          <span class="ico">➖</span><span class="nm">{$t('mathAid.subtraction')}</span>
        </button>
      </div>
      <div class="difficulty">
        <span>{$t('mathAid.maxNumber')}:</span>
        {#each [5, 10, 20, 50] as n}
          <button class="diff-btn" class:active={maxNum === n} onclick={() => maxNum = n}>{n}</button>
        {/each}
      </div>
    {:else}
      <div class="problem">
        <div class="visual">
          {#each Array(a) as _, i}<span class="dot a">🔵</span>{/each}
          <span class="op-sign">{op}</span>
          {#each Array(b) as _, i}<span class="dot b">{op === '+' ? '🟢' : '🔴'}</span>{/each}
        </div>
        <div class="equation">
          <span class="num">{a}</span>
          <span class="op">{op}</span>
          <span class="num">{b}</span>
          <span class="eq">=</span>
          <span class="answer-box" class:correct={correct === true} class:wrong={correct === false}>
            {userAnswer || '?'}
          </span>
        </div>
      </div>

      <div class="numpad">
        {#each [1,2,3,4,5,6,7,8,9,0] as n}
          <button class="num-btn" onclick={() => tapNum(n)}>{n}</button>
        {/each}
        <button class="num-btn clear" onclick={clearAnswer}>⌫</button>
        <button class="num-btn check" onclick={check}>✓</button>
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
  .score { font-weight:700; background:#e8f5e9; color:#2e7d32; padding:.25rem .75rem; border-radius:20px; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; margin-bottom:2rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; font-size:1.1rem; }
  .difficulty { display:flex; align-items:center; gap:.5rem; justify-content:center; }
  .diff-btn { padding:.5rem 1rem; border:2px solid var(--border); border-radius:8px; background:var(--bg-card); cursor:pointer; min-height:44px; }
  .diff-btn.active { border-color:var(--accent,#2196f3); background:#e3f2fd; }
  .problem { text-align:center; margin:1rem 0; }
  .visual { display:flex; flex-wrap:wrap; justify-content:center; gap:.2rem; margin-bottom:1rem; }
  .dot { font-size:1.2rem; }
  .op-sign { font-size:1.5rem; font-weight:700; margin:0 .5rem; }
  .equation { display:flex; align-items:center; justify-content:center; gap:.75rem; font-size:2.5rem; font-weight:700; }
  .answer-box { min-width:60px; padding:.25rem .75rem; border:3px dashed var(--border); border-radius:12px; }
  .answer-box.correct { border-color:#4caf50; background:#e8f5e9; border-style:solid; }
  .answer-box.wrong { border-color:#f44336; background:#ffebee; border-style:solid; }
  .numpad { display:grid; grid-template-columns:repeat(4,1fr); gap:.5rem; margin-top:1.5rem; }
  .num-btn { padding:1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.5rem; font-weight:700; cursor:pointer; min-height:56px; }
  .num-btn:hover { background:#e3f2fd; }
  .clear { background:#fff3e0; }
  .check { background:#e8f5e9; grid-column:span 1; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
