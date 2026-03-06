<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { awardStar, GoldStarBurst } from '$lib/rewards';
  import { CATEGORY_SETS, getSetsForLevel, getAllItems, arasaacUrl } from '$lib/data/category-data.js';

  // === State ===
  let screen = $state('levels'); // 'levels' | 'sets' | 'playing' | 'odd' | 'done'
  let selectedLevel = $state(null);
  let selectedSet = $state(null);
  let items = $state([]);
  let currentItemIndex = $state(0);
  let correctCount = $state(0);
  let totalAttempts = $state(0);
  let showStar = $state(false);
  let feedback = $state(null); // { type: 'correct' | 'wrong', bucketId: null }
  let feedbackTimer = $state(null);
  let draggedItem = $state(null);
  let hintShown = $state(false);

  // Odd one out state
  let oddRoundIndex = $state(0);
  let oddItems = $state([]);
  let oddFeedback = $state(null);
  let oddCorrectCount = $state(0);

  // Sorted items per bucket (for visual stacking)
  let sortedItems = $state({});

  // Touch drag state
  let touchDragPos = $state(null);
  let touchDragItem = $state(null);
  let touchStartPos = $state(null);

  // Custom categories
  let showCustom = $state(false);
  let customSets = $state(loadCustomSets());

  const LEVELS = [
    { level: 1, icon: '⭐', descKey: 'categorySort.level1desc' },
    { level: 2, icon: '⭐⭐', descKey: 'categorySort.level2desc' },
    { level: 3, icon: '⭐⭐⭐', descKey: 'categorySort.level3desc' },
    { level: 4, icon: '🤔', descKey: 'categorySort.level4desc' },
  ];

  function loadCustomSets() {
    try {
      return JSON.parse(localStorage.getItem('category-sort-custom') || '[]');
    } catch { return []; }
  }
  function saveCustomSets() {
    localStorage.setItem('category-sort-custom', JSON.stringify(customSets));
  }

  function selectLevel(level) {
    selectedLevel = level;
    screen = 'sets';
  }

  function selectSet(set) {
    selectedSet = set;
    if (set.isOddOneOut) {
      startOddOneOut(set);
    } else {
      startSorting(set);
    }
  }

  function startSorting(set) {
    items = getAllItems(set);
    currentItemIndex = 0;
    correctCount = 0;
    totalAttempts = 0;
    feedback = null;
    hintShown = false;
    sortedItems = {};
    for (const cat of set.categories) {
      sortedItems[cat.id] = [];
    }
    screen = 'playing';
  }

  function startOddOneOut(set) {
    oddRoundIndex = 0;
    oddCorrectCount = 0;
    oddFeedback = null;
    loadOddRound(set, 0);
    screen = 'odd';
  }

  function loadOddRound(set, index) {
    const round = set.rounds[index];
    // Shuffle items
    const shuffled = [...round.items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    oddItems = shuffled;
    oddFeedback = null;
    hintShown = false;
  }

  function handleOddPick(item) {
    if (oddFeedback) return;
    if (item.isOdd) {
      oddFeedback = 'correct';
      oddCorrectCount++;
      speak($t('categorySort.oddCorrect'));
      setTimeout(() => {
        if (oddRoundIndex < selectedSet.rounds.length - 1) {
          oddRoundIndex++;
          loadOddRound(selectedSet, oddRoundIndex);
        } else {
          finishGame();
        }
      }, 1500);
    } else {
      oddFeedback = 'wrong';
      speak($t('categorySort.oddWrong'));
      setTimeout(() => {
        oddFeedback = null;
        hintShown = true;
      }, 1200);
    }
  }

  // Current item being sorted
  let currentItem = $derived(items[currentItemIndex]);

  function speakItem(item) {
    speak($t(item.nameKey));
  }

  // === Drag and Drop ===
  function handleDragStart(e, item) {
    draggedItem = item;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, categoryId) {
    e.preventDefault();
    if (!draggedItem) return;
    checkAnswer(draggedItem, categoryId);
    draggedItem = null;
  }

  // === Touch Drag ===
  function handleTouchStart(e, item) {
    const touch = e.touches[0];
    touchStartPos = { x: touch.clientX, y: touch.clientY };
    touchDragItem = item;
    touchDragPos = { x: touch.clientX, y: touch.clientY };
    // Speak on tap (will be cancelled if dragging)
    e.preventDefault();
  }

  function handleTouchMove(e) {
    if (!touchDragItem) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchDragPos = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchDragItem) return;
    
    // Check if it was a tap (minimal movement)
    if (touchStartPos && touchDragPos) {
      const dx = Math.abs(touchDragPos.x - touchStartPos.x);
      const dy = Math.abs(touchDragPos.y - touchStartPos.y);
      if (dx < 10 && dy < 10) {
        speakItem(touchDragItem);
        touchDragItem = null;
        touchDragPos = null;
        touchStartPos = null;
        return;
      }
    }

    // Find which bucket we're over
    const buckets = document.querySelectorAll('.sort-bucket');
    let found = false;
    for (const bucket of buckets) {
      const rect = bucket.getBoundingClientRect();
      if (
        touchDragPos.x >= rect.left && touchDragPos.x <= rect.right &&
        touchDragPos.y >= rect.top && touchDragPos.y <= rect.bottom
      ) {
        const catId = bucket.dataset.categoryId;
        checkAnswer(touchDragItem, catId);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // Dropped outside — bounce back
      feedback = { type: 'miss' };
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => feedback = null, 600);
    }

    touchDragItem = null;
    touchDragPos = null;
    touchStartPos = null;
  }

  function checkAnswer(item, categoryId) {
    totalAttempts++;
    if (item.categoryId === categoryId) {
      // Correct!
      feedback = { type: 'correct', bucketId: categoryId };
      correctCount++;
      sortedItems[categoryId] = [...sortedItems[categoryId], item];
      
      // Play correct sound (simple beep via AudioContext)
      playSound('correct');
      speak($t('categorySort.correct'));
      
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        feedback = null;
        if (currentItemIndex < items.length - 1) {
          currentItemIndex++;
          hintShown = false;
        } else {
          finishGame();
        }
      }, 1000);
    } else {
      // Wrong — bounce back + hint
      feedback = { type: 'wrong', bucketId: categoryId };
      playSound('wrong');
      
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        feedback = null;
        hintShown = true;
      }, 800);
    }
  }

  async function finishGame() {
    const total = selectedSet.isOddOneOut ? selectedSet.rounds.length : items.length;
    const correct = selectedSet.isOddOneOut ? oddCorrectCount : correctCount;
    const stars = correct === total ? 3 : correct >= total * 0.7 ? 2 : correct > 0 ? 1 : 0;
    
    screen = 'done';
    speak($t('categorySort.roundComplete'));
    
    if (stars > 0) {
      await awardStar('category-sort', 'rewards.star.completed');
      showStar = true;
      setTimeout(() => showStar = false, 2500);
    }
  }

  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'correct') {
        osc.frequency.value = 523;
        gain.gain.value = 0.3;
        osc.start();
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.value = 200;
        gain.gain.value = 0.2;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  }

  function goBack() {
    if (screen === 'playing' || screen === 'odd') {
      screen = 'sets';
    } else if (screen === 'sets') {
      screen = 'levels';
    } else if (screen === 'done') {
      screen = 'sets';
    }
  }

  // Stars calculation for done screen
  let finalStars = $derived.by(() => {
    if (screen !== 'done') return 0;
    const total = selectedSet?.isOddOneOut ? selectedSet.rounds.length : items.length;
    const correct = selectedSet?.isOddOneOut ? oddCorrectCount : correctCount;
    return correct === total ? 3 : correct >= total * 0.7 ? 2 : correct > 0 ? 1 : 0;
  });

  let finalTotal = $derived(selectedSet?.isOddOneOut ? selectedSet?.rounds?.length : items.length);
  let finalCorrect = $derived(selectedSet?.isOddOneOut ? oddCorrectCount : correctCount);
</script>

<WelcomeDialog appId="category-sort" titleKey="app.category_sort" purposeKey="welcome.categorySort.purpose" howKey="welcome.categorySort.how" goalKey="welcome.categorySort.goal" icon="📦" />

<GoldStarBurst show={showStar} />

<div class="app" in:fade>
  <main class="cnt">
    <div class="page-title">
      {#if screen !== 'levels'}
        <button class="sub-back" onclick={goBack} aria-label="Tillbaka">←</button>
      {/if}
      <h1>📦 {$t('categorySort.title')}</h1>
    </div>

    <!-- LEVEL SELECT -->
    {#if screen === 'levels'}
      <h2>{$t('categorySort.pickLevel')}</h2>
      <div class="level-grid">
        {#each LEVELS as lv}
          <button class="level-card" onclick={() => selectLevel(lv.level)} in:scale={{ delay: lv.level * 50 }}>
            <span class="level-icon">{lv.icon}</span>
            <span class="level-num">{$t('categorySort.level', { level: String(lv.level) })}</span>
            <span class="level-desc">{$t(lv.descKey)}</span>
          </button>
        {/each}
      </div>
      
      <!-- Custom categories button -->
      <button class="custom-btn" onclick={() => showCustom = !showCustom}>
        🎨 {$t('categorySort.custom')}
      </button>

    <!-- SET SELECT -->
    {:else if screen === 'sets'}
      <h2>{$t('categorySort.pickSet')}</h2>
      <div class="set-grid">
        {#each getSetsForLevel(selectedLevel) as set}
          <button class="set-card" onclick={() => selectSet(set)} in:fly={{ y: 20, delay: 50 }}>
            <span class="set-icons">
              {#if set.isOddOneOut}
                🤔
              {:else}
                {#each set.categories as cat}
                  <span>{cat.icon}</span>
                {/each}
              {/if}
            </span>
            <span class="set-name">{$t(set.nameKey)}</span>
          </button>
        {/each}
      </div>

    <!-- SORTING GAME -->
    {:else if screen === 'playing' && currentItem}
      <div class="game-area">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {((currentItemIndex) / items.length) * 100}%"></div>
        </div>
        <p class="items-left">{$t('categorySort.itemsLeft', { count: String(items.length - currentItemIndex) })}</p>

        <!-- Current item to sort -->
        <div class="item-area"
          ontouchstart={(e) => handleTouchStart(e, currentItem)}
          ontouchmove={handleTouchMove}
          ontouchend={handleTouchEnd}
        >
          <div
            class="item-card"
            class:bounce={feedback?.type === 'wrong' || feedback?.type === 'miss'}
            class:correct-flash={feedback?.type === 'correct'}
            draggable="true"
            ondragstart={(e) => handleDragStart(e, currentItem)}
            onclick={() => speakItem(currentItem)}
            role="img"
            aria-label={$t(currentItem.nameKey)}
          >
            <img src={arasaacUrl(currentItem.arasaacId)} alt={$t(currentItem.nameKey)} loading="lazy" />
            <span class="item-label">{$t(currentItem.nameKey)}</span>
          </div>
          <p class="drag-hint">{$t(hintShown ? `categorySort.cat.${currentItem.categoryId}` : 'categorySort.dragHint')}</p>
        </div>

        <!-- Category buckets -->
        <div class="buckets" class:three-col={selectedSet.categories.length >= 3}>
          {#each selectedSet.categories as cat}
            <div
              class="sort-bucket"
              class:bucket-correct={feedback?.type === 'correct' && feedback?.bucketId === cat.id}
              class:bucket-wrong={feedback?.type === 'wrong' && feedback?.bucketId === cat.id}
              data-category-id={cat.id}
              ondragover={handleDragOver}
              ondrop={(e) => handleDrop(e, cat.id)}
              role="button"
              aria-label={$t(cat.labelKey)}
            >
              <div class="bucket-header">
                <span class="bucket-icon">{cat.icon}</span>
                <span class="bucket-label">{$t(cat.labelKey)}</span>
              </div>
              <div class="bucket-items">
                {#each (sortedItems[cat.id] || []) as sorted}
                  <img
                    class="sorted-thumb"
                    src={arasaacUrl(sorted.arasaacId)}
                    alt={$t(sorted.nameKey)}
                    in:scale={{ duration: 300 }}
                  />
                {/each}
              </div>
              <span class="bucket-count">{(sortedItems[cat.id] || []).length}</span>
            </div>
          {/each}
        </div>
      </div>

    <!-- ODD ONE OUT -->
    {:else if screen === 'odd'}
      <div class="game-area">
        <p class="round-info">{$t('categorySort.round', { current: String(oddRoundIndex + 1), total: String(selectedSet.rounds.length) })}</p>
        <h2 class="odd-title">{$t('categorySort.oddOneOut')}</h2>
        
        <div class="odd-grid">
          {#each oddItems as item}
            <button
              class="odd-card"
              class:odd-correct={oddFeedback === 'correct' && item.isOdd}
              class:odd-wrong={oddFeedback === 'wrong' && !item.isOdd}
              onclick={() => { speakItem(item); handleOddPick(item); }}
              disabled={oddFeedback === 'correct'}
            >
              <img src={arasaacUrl(item.arasaacId)} alt={$t(item.nameKey)} loading="lazy" />
              <span class="odd-label">{$t(item.nameKey)}</span>
            </button>
          {/each}
        </div>

        {#if hintShown && selectedSet.rounds[oddRoundIndex]}
          <p class="hint" in:fly={{ y: 10 }}>
            💡 {$t('categorySort.oddHint', { hint: $t(selectedSet.rounds[oddRoundIndex].hintKey) })}
          </p>
        {/if}
      </div>

    <!-- DONE SCREEN -->
    {:else if screen === 'done'}
      <div class="done" in:scale>
        <span class="done-icon">🎉</span>
        <h2>{$t('categorySort.roundComplete')}</h2>
        <p class="score">{$t('categorySort.score', { correct: String(finalCorrect), total: String(finalTotal) })}</p>
        <div class="stars-display">
          {#each Array(3) as _, i}
            <span class="star" class:earned={i < finalStars} in:scale={{ delay: i * 200 }}>⭐</span>
          {/each}
        </div>
        <div class="done-actions">
          <button class="action-btn" onclick={() => selectSet(selectedSet)}>🔄 {$t('categorySort.playAgain')}</button>
          <button class="action-btn" onclick={() => { screen = 'sets'; }}>📋 {$t('categorySort.newSet')}</button>
          <button class="action-btn" onclick={() => { screen = 'levels'; }}>🏠 {$t('categorySort.backToLevels')}</button>
        </div>
      </div>
    {/if}
  </main>

  <!-- Touch drag ghost -->
  {#if touchDragItem && touchDragPos}
    <div
      class="drag-ghost"
      style="left: {touchDragPos.x - 40}px; top: {touchDragPos.y - 40}px;"
    >
      <img src={arasaacUrl(touchDragItem.arasaacId)} alt="" />
    </div>
  {/if}

  <footer class="cr"><p>Pictogram: ARASAAC · Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .cnt { flex:1; padding:1rem; max-width:700px; margin:0 auto; width:100%; }
  .page-title { display:flex; align-items:center; gap:.5rem; margin-bottom:1rem; }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  h2 { text-align:center; margin-bottom:1rem; font-size:1.2rem; }
  .sub-back { font-size:1.5rem; background:none; border:none; cursor:pointer; padding:.25rem; min-height:44px; min-width:44px; color:var(--text); }

  /* Level select */
  .level-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; margin-bottom:1.5rem; }
  .level-card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.25rem; border:3px solid var(--border); border-radius:20px; background:var(--bg-card); cursor:pointer; min-height:48px; transition: transform .15s, box-shadow .15s; }
  .level-card:hover, .level-card:active { transform:scale(1.03); box-shadow:0 4px 16px rgba(0,0,0,.1); }
  .level-icon { font-size:1.8rem; }
  .level-num { font-weight:700; font-size:1.1rem; }
  .level-desc { font-size:.85rem; color:var(--text-secondary); text-align:center; }

  /* Set select */
  .set-grid { display:grid; grid-template-columns:1fr; gap:.75rem; }
  .set-card { display:flex; align-items:center; gap:1rem; padding:1rem 1.25rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; transition: transform .15s; }
  .set-card:hover, .set-card:active { transform:scale(1.02); }
  .set-icons { font-size:1.5rem; display:flex; gap:.25rem; }
  .set-name { font-weight:600; font-size:1.05rem; }

  /* Game area */
  .game-area { display:flex; flex-direction:column; gap:.75rem; }
  .progress-bar { height:8px; background:var(--border); border-radius:4px; overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,#4caf50,#81c784); border-radius:4px; transition:width .4s ease; }
  .items-left { text-align:center; font-size:.9rem; color:var(--text-secondary); margin:0; }

  /* Item card to drag */
  .item-area { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:.5rem 0; }
  .item-card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1rem; background:var(--bg-card); border:3px solid var(--border); border-radius:20px; cursor:grab; user-select:none; -webkit-user-select:none; touch-action:none; transition: transform .2s, border-color .2s, background .2s; max-width:160px; }
  .item-card:active { cursor:grabbing; transform:scale(1.05); }
  .item-card img { width:100px; height:100px; object-fit:contain; pointer-events:none; }
  .item-label { font-weight:700; font-size:1.1rem; }
  .drag-hint { text-align:center; font-size:.85rem; color:var(--text-secondary); margin:0; font-style:italic; }

  /* Bounce animation for wrong answer */
  .bounce { animation: bounceBack .4s ease; }
  @keyframes bounceBack {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-12px); }
    50% { transform: translateX(12px); }
    75% { transform: translateX(-6px); }
  }

  .correct-flash { border-color:#4caf50 !important; background:#e8f5e9 !important; }

  /* Buckets */
  .buckets { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
  .buckets.three-col { grid-template-columns:repeat(3,1fr); }
  .sort-bucket { border:3px dashed var(--border); border-radius:20px; padding:.75rem; min-height:120px; display:flex; flex-direction:column; align-items:center; gap:.5rem; transition: border-color .2s, background .2s, transform .15s; background:var(--bg-card); }
  .sort-bucket:hover { border-color: #2196f3; }
  .bucket-correct { border-color:#4caf50 !important; background:#e8f5e9 !important; border-style:solid !important; transform:scale(1.02); }
  .bucket-wrong { border-color:#f44336 !important; background:#ffebee !important; animation: shake .3s ease; }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    33% { transform:translateX(-4px); }
    66% { transform:translateX(4px); }
  }
  .bucket-header { display:flex; flex-direction:column; align-items:center; gap:.25rem; }
  .bucket-icon { font-size:1.8rem; }
  .bucket-label { font-weight:700; font-size:.9rem; text-align:center; }
  .bucket-items { display:flex; flex-wrap:wrap; gap:.25rem; justify-content:center; }
  .sorted-thumb { width:36px; height:36px; object-fit:contain; border-radius:6px; background:#fff; border:1px solid var(--border); }
  .bucket-count { font-size:.8rem; color:var(--text-secondary); }

  /* Odd one out */
  .odd-title { font-size:1.3rem; }
  .round-info { text-align:center; font-size:.9rem; color:var(--text-secondary); margin:0; }
  .odd-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
  .odd-card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1rem; border:3px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; transition: transform .15s, border-color .2s, background .2s; }
  .odd-card:hover { transform:scale(1.03); }
  .odd-card img { width:80px; height:80px; object-fit:contain; }
  .odd-label { font-weight:600; font-size:.95rem; }
  .odd-correct { border-color:#4caf50 !important; background:#e8f5e9 !important; transform:scale(1.05); }
  .odd-wrong { border-color:#f44336 !important; background:#ffebee !important; animation:shake .3s ease; }
  .hint { text-align:center; font-size:.95rem; color:#e65100; background:#fff3e0; padding:.75rem; border-radius:12px; }

  /* Done screen */
  .done { text-align:center; padding:2rem 1rem; }
  .done-icon { font-size:4rem; display:block; margin-bottom:.5rem; }
  .score { font-size:1.2rem; margin:.5rem 0 1rem; }
  .stars-display { display:flex; justify-content:center; gap:.5rem; margin-bottom:1.5rem; }
  .star { font-size:2.5rem; opacity:.2; transition: opacity .3s, transform .3s; }
  .star.earned { opacity:1; transform:scale(1.1); }
  .done-actions { display:flex; flex-direction:column; gap:.75rem; align-items:center; }
  .action-btn { padding:.75rem 1.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.1rem; cursor:pointer; min-height:48px; width:100%; max-width:300px; }
  .action-btn:hover { background:#e3f2fd; }

  /* Touch drag ghost */
  .drag-ghost { position:fixed; pointer-events:none; z-index:1000; opacity:.8; }
  .drag-ghost img { width:80px; height:80px; object-fit:contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,.3)); }

  /* Custom button */
  .custom-btn { display:block; margin:0 auto; padding:.75rem 1.5rem; border:2px dashed var(--border); border-radius:12px; background:var(--bg-card); font-size:1rem; cursor:pointer; min-height:48px; color:var(--text-secondary); }
  .custom-btn:hover { border-color:var(--accent,#2196f3); }

  /* Footer */
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }

  @media(max-width:480px) {
    .level-grid { grid-template-columns:1fr; }
    .buckets.three-col { grid-template-columns:repeat(2,1fr); }
    .item-card img { width:80px; height:80px; }
    .odd-card img { width:60px; height:60px; }
    .odd-grid { gap:.75rem; }
  }

  @media(prefers-reduced-motion:reduce) {
    .bounce, .bucket-wrong, .odd-wrong { animation:none; }
    .item-card, .level-card, .set-card, .odd-card { transition:none; }
  }
</style>
