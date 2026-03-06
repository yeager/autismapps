<script>
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import CelebrationOverlay from './CelebrationOverlay.svelte';

  let { playSound, oncomplete } = $props();
  const dispatch = createEventDispatcher();

  const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#e91e63'];

  let gameState = $state('idle'); // idle | playing | done
  let circles = $state([]);
  let currentIndex = $state(0);
  let score = $state(0);
  let misses = $state(0);
  let level = $state(1);
  let timeLeft = $state(0);
  let totalTime = $state(30);
  let timer = null;
  let containerEl;

  function startGame() {
    gameState = 'playing';
    score = 0;
    misses = 0;
    currentIndex = 0;
    timeLeft = totalTime;
    spawnCircle();
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function spawnCircle() {
    if (gameState !== 'playing') return;
    const count = Math.min(1 + Math.floor(level / 3), 3);
    const newCircles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.max(48, 80 - level * 3);
      newCircles.push({
        id: Date.now() + i,
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 15,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        active: true,
        order: i,
      });
    }
    circles = newCircles;
    currentIndex = 0;
  }

  function tapCircle(circle, idx) {
    if (gameState !== 'playing') return;
    if (idx === currentIndex) {
      playSound('tap');
      score++;
      currentIndex++;
      circles = circles.map((c, i) => i === idx ? { ...c, active: false } : c);
      if (currentIndex >= circles.length) {
        level = 1 + Math.floor(score / 5);
        setTimeout(spawnCircle, 300);
      }
    } else {
      playSound('error');
      misses++;
    }
  }

  function endGame() {
    clearInterval(timer);
    gameState = 'done';
    playSound('success');
    const stars = score >= 30 ? 3 : score >= 15 ? 2 : score >= 5 ? 1 : 0;
    oncomplete?.({ detail: { exerciseId: 'tapping', stars, score } });
  }

  function reset() {
    clearInterval(timer);
    gameState = 'idle';
    circles = [];
  }

  onDestroy(() => clearInterval(timer));
</script>

<div class="tapping-game" in:fade bind:this={containerEl}>
  {#if gameState === 'idle'}
    <div class="intro">
      <p class="desc">{$t('fineMotor.tapping.desc')}</p>
      <button class="start-btn" onclick={startGame}>{$t('fineMotor.start')}</button>
    </div>
  {:else if gameState === 'playing'}
    <div class="hud">
      <span class="hud-item">🎯 {score}</span>
      <span class="hud-item">⏱️ {timeLeft}s</span>
      <span class="hud-item">📊 Lv.{level}</span>
    </div>
    <div class="play-area" role="application" aria-label="Tapping area">
      {#each circles as circle, idx (circle.id)}
        {#if circle.active}
          <button
            class="tap-circle"
            style="left:{circle.x}%;top:{circle.y}%;width:{circle.size}px;height:{circle.size}px;background:{circle.color}"
            onclick={() => tapCircle(circle, idx)}
            in:fade={{ duration: 200 }}
            aria-label="Tap circle {idx + 1}"
          >
            {circles.length > 1 ? idx + 1 : ''}
          </button>
        {/if}
      {/each}
    </div>
  {:else}
    <CelebrationOverlay>
      <div class="results">
        <h2>{$t('fineMotor.done')}!</h2>
        <p class="big-score">{score}</p>
        <p>{$t('fineMotor.tapping.taps')} • {misses} {$t('fineMotor.misses')}</p>
        <div class="result-stars">
          {#each [1,2,3] as s}
            <span class="rstar" class:earned={score >= (s === 1 ? 5 : s === 2 ? 15 : 30)}>⭐</span>
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
  .tapping-game { display: flex; flex-direction: column; height: 100%; min-height: 400px; }
  .intro { text-align: center; padding: 2rem; }
  .desc { font-size: 1.1rem; color: #555; margin-bottom: 1.5rem; }
  .start-btn {
    font-size: 1.3rem; padding: 1rem 2.5rem;
    background: #4caf50; color: white; border: none;
    border-radius: 16px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(76,175,80,0.3);
    transition: transform 0.15s;
  }
  .start-btn:hover { transform: scale(1.05); }
  .start-btn:active { transform: scale(0.97); }
  .hud {
    display: flex; justify-content: space-around;
    padding: 0.5rem; background: rgba(255,255,255,0.8);
    border-radius: 12px; margin-bottom: 0.5rem;
  }
  .hud-item { font-size: 1.1rem; font-weight: 600; }
  .play-area {
    flex: 1; position: relative;
    background: rgba(255,255,255,0.5);
    border-radius: 16px; overflow: hidden;
    min-height: 300px;
    touch-action: manipulation;
  }
  .tap-circle {
    position: absolute; border: none; border-radius: 50%;
    cursor: pointer; transform: translate(-50%, -50%);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: bold; color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: transform 0.1s;
    touch-action: manipulation;
  }
  .tap-circle:active { transform: translate(-50%, -50%) scale(0.85); }
  .results { text-align: center; }
  .big-score { font-size: 3rem; font-weight: bold; color: #4caf50; margin: 0.5rem 0; }
  .result-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; }
  .rstar { font-size: 2rem; opacity: 0.2; transition: opacity 0.5s; }
  .rstar.earned { opacity: 1; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .btn {
    padding: 0.75rem 1.5rem; font-size: 1rem;
    border: none; border-radius: 12px; cursor: pointer;
    background: #4caf50; color: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .btn.secondary { background: #78909c; }
  .btn:hover { transform: scale(1.03); }
</style>
