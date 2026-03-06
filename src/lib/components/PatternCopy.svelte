<script>
  import { t } from '$lib/i18n';
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import CelebrationOverlay from './CelebrationOverlay.svelte';

  let { playSound, oncomplete } = $props();

  const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e91e63'];

  let gameState = $state('idle'); // idle | showing | input | done
  let gridSize = $state(3);
  let pattern = $state([]);
  let userPattern = $state([]);
  let level = $state(1);
  let score = $state(0);
  let showTimer = $state(0);
  let showInterval = null;

  function generatePattern() {
    const count = Math.min(gridSize + level, gridSize * gridSize);
    const cells = [];
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let pos;
      do {
        pos = Math.floor(Math.random() * gridSize * gridSize);
      } while (used.has(pos));
      used.add(pos);
      cells.push({
        pos,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    return cells;
  }

  function startGame() {
    score = 0;
    level = 1;
    gridSize = 3;
    nextRound();
  }

  function nextRound() {
    pattern = generatePattern();
    userPattern = [];
    gameState = 'showing';
    showTimer = 3;
    showInterval = setInterval(() => {
      showTimer--;
      if (showTimer <= 0) {
        clearInterval(showInterval);
        gameState = 'input';
      }
    }, 1000);
  }

  function tapCell(pos) {
    if (gameState !== 'input') return;

    // Check if this cell is already tapped
    if (userPattern.find(p => p.pos === pos)) return;

    // Find if this cell is in the pattern
    const patternCell = pattern.find(p => p.pos === pos);
    if (patternCell) {
      playSound('tap');
      userPattern = [...userPattern, patternCell];

      // Check if all pattern cells matched
      if (userPattern.length >= pattern.length) {
        score += pattern.length;
        level++;
        // Increase grid size every 3 levels
        if (level % 3 === 0 && gridSize < 5) gridSize++;
        playSound('success');
        setTimeout(nextRound, 800);
      }
    } else {
      playSound('error');
      endGame();
    }
  }

  function endGame() {
    clearInterval(showInterval);
    gameState = 'done';
    const stars = score >= 20 ? 3 : score >= 10 ? 2 : score >= 3 ? 1 : 0;
    oncomplete?.({ detail: { exerciseId: 'pattern', stars, score } });
  }

  function reset() {
    clearInterval(showInterval);
    gameState = 'idle';
  }

  function getCellColor(pos) {
    if (gameState === 'showing') {
      const p = pattern.find(c => c.pos === pos);
      return p ? p.color : 'transparent';
    }
    if (gameState === 'input') {
      const u = userPattern.find(c => c.pos === pos);
      return u ? u.color : 'transparent';
    }
    return 'transparent';
  }

  function isCellFilled(pos) {
    if (gameState === 'showing') return pattern.some(c => c.pos === pos);
    if (gameState === 'input') return userPattern.some(c => c.pos === pos);
    return false;
  }
</script>

<div class="pattern-game" in:fade>
  {#if gameState === 'idle'}
    <div class="intro">
      <p class="desc">{$t('fineMotor.pattern.desc')}</p>
      <button class="start-btn" onclick={startGame}>{$t('fineMotor.start')}</button>
    </div>
  {:else if gameState === 'showing' || gameState === 'input'}
    <div class="hud">
      <span class="hud-item">🎯 {score}</span>
      <span class="hud-item">📊 Lv.{level}</span>
      <span class="hud-item">{gridSize}×{gridSize}</span>
      {#if gameState === 'showing'}
        <span class="hud-item show-timer">👀 {showTimer}</span>
      {:else}
        <span class="hud-item">{$t('fineMotor.pattern.yourTurn')}</span>
      {/if}
    </div>
    <div class="grid-wrapper">
      <div class="grid" style="grid-template-columns: repeat({gridSize}, 1fr);">
        {#each Array(gridSize * gridSize) as _, pos}
          <button
            class="cell"
            class:filled={isCellFilled(pos)}
            style="background-color: {getCellColor(pos) || '#f5f5f5'}"
            onclick={() => tapCell(pos)}
            disabled={gameState === 'showing'}
            in:scale={{ duration: 200, delay: pos * 20 }}
          ></button>
        {/each}
      </div>
    </div>
  {:else}
    <CelebrationOverlay>
      <div class="results">
        <h2>{$t('fineMotor.done')}!</h2>
        <p class="big-score">{score}</p>
        <p>{$t('fineMotor.pattern.matched')}</p>
        <div class="result-stars">
          {#each [1,2,3] as s}
            <span class="rstar" class:earned={score >= (s === 1 ? 3 : s === 2 ? 10 : 20)}>⭐</span>
          {/each}
        </div>
        <div class="result-actions">
          <button class="btn" onclick={startGame}>{$t('fineMotor.playAgain')}</button>
          <button class="btn secondary" onclick={reset}>{$t('fineMotor.back')}</button>
        </div>
      </div>
    </CelebrationOverlay>
  {/if}
</div>

<style>
  .pattern-game { display: flex; flex-direction: column; height: 100%; }
  .intro { text-align: center; padding: 2rem; }
  .desc { font-size: 1.1rem; color: #555; margin-bottom: 1.5rem; }
  .start-btn {
    font-size: 1.3rem; padding: 1rem 2.5rem;
    background: #9b59b6; color: white; border: none;
    border-radius: 16px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(155,89,182,0.3);
  }
  .start-btn:hover { transform: scale(1.05); }
  .hud {
    display: flex; justify-content: space-around;
    padding: 0.5rem; background: rgba(255,255,255,0.8);
    border-radius: 12px; margin-bottom: 1rem;
  }
  .hud-item { font-size: 1.1rem; font-weight: 600; }
  .show-timer { color: #e74c3c; animation: pulse 1s infinite; }
  @keyframes pulse { 50% { transform: scale(1.1); } }
  .grid-wrapper {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .grid {
    display: grid; gap: 8px;
    max-width: 400px; width: 100%;
    aspect-ratio: 1;
  }
  .cell {
    aspect-ratio: 1; border: 3px solid #e0e0e0;
    border-radius: 12px; cursor: pointer;
    transition: all 0.2s; min-width: 48px; min-height: 48px;
    touch-action: manipulation;
  }
  .cell:hover:not(:disabled) { border-color: #9b59b6; transform: scale(1.05); }
  .cell:active:not(:disabled) { transform: scale(0.95); }
  .cell.filled { border-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .results { text-align: center; }
  .big-score { font-size: 3rem; font-weight: bold; color: #9b59b6; margin: 0.5rem 0; }
  .result-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; }
  .rstar { font-size: 2rem; opacity: 0.2; }
  .rstar.earned { opacity: 1; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .btn {
    padding: 0.75rem 1.5rem; font-size: 1rem;
    border: none; border-radius: 12px; cursor: pointer;
    background: #9b59b6; color: white;
  }
  .btn.secondary { background: #78909c; }
  .btn:hover { transform: scale(1.03); }
</style>
