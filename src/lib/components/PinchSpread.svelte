<script>
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher, onMount } from 'svelte';
  import CelebrationOverlay from './CelebrationOverlay.svelte';

  let { playSound, oncomplete } = $props();

  const IMAGES = [
    { emoji: '🌻', targetScale: 2.0, label: 'fineMotor.pinch.zoomIn' },
    { emoji: '🦋', targetScale: 0.5, label: 'fineMotor.pinch.zoomOut' },
    { emoji: '🌈', targetScale: 1.8, label: 'fineMotor.pinch.zoomIn' },
    { emoji: '🐶', targetScale: 0.6, label: 'fineMotor.pinch.zoomOut' },
    { emoji: '🏠', targetScale: 2.5, label: 'fineMotor.pinch.zoomIn' },
    { emoji: '⭐', targetScale: 0.4, label: 'fineMotor.pinch.zoomOut' },
  ];

  let gameState = $state('idle');
  let currentIdx = $state(0);
  let currentScale = $state(1);
  let completed = $state(0);
  let touches = $state([]);
  let initialDistance = $state(0);
  let initialScale = $state(1);
  let containerEl;

  let current = $derived(IMAGES[currentIdx]);
  let progress = $derived(Math.abs(currentScale - 1) / Math.abs(current.targetScale - 1) * 100);
  let isCorrectDirection = $derived(
    (current.targetScale > 1 && currentScale > 1) ||
    (current.targetScale < 1 && currentScale < 1) ||
    currentScale === 1
  );

  function startGame() {
    gameState = 'playing';
    currentIdx = 0;
    currentScale = 1;
    completed = 0;
  }

  function handleTouchStart(e) {
    if (gameState !== 'playing') return;
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistance = Math.sqrt(dx * dx + dy * dy);
      initialScale = currentScale;
    }
  }

  function handleTouchMove(e) {
    if (gameState !== 'playing') return;
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scaleFactor = dist / initialDistance;
      currentScale = Math.max(0.2, Math.min(4, initialScale * scaleFactor));
      checkCompletion();
    }
  }

  function handleWheel(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    currentScale = Math.max(0.2, Math.min(4, currentScale * delta));
    checkCompletion();
  }

  function checkCompletion() {
    const tolerance = 0.15;
    if (Math.abs(currentScale - current.targetScale) < tolerance) {
      playSound('success');
      completed++;
      if (currentIdx < IMAGES.length - 1) {
        setTimeout(() => {
          currentIdx++;
          currentScale = 1;
        }, 500);
      } else {
        gameState = 'done';
        const stars = 3;
        oncomplete?.({ detail: { exerciseId: 'pinch', stars, score: completed + 1 } });
      }
    }
  }

  function reset() {
    gameState = 'idle';
    currentScale = 1;
  }
</script>

<div class="pinch-game" in:fade>
  {#if gameState === 'idle'}
    <div class="intro">
      <p class="desc">{$t('fineMotor.pinch.desc')}</p>
      <p class="hint">{$t('fineMotor.pinch.hint')}</p>
      <button class="start-btn" onclick={startGame}>{$t('fineMotor.start')}</button>
    </div>
  {:else if gameState === 'playing'}
    <div class="hud">
      <span>{completed + 1}/{IMAGES.length}</span>
      <span>{$t(current.label)}</span>
      <span class="scale-indicator">{Math.round(currentScale * 100)}%</span>
    </div>
    <div class="target-hint">
      {$t('fineMotor.pinch.target')}: {Math.round(current.targetScale * 100)}%
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        class:wrong={!isCorrectDirection && currentScale !== 1}
        style="width: {Math.min(100, Math.max(0, progress))}%"
      ></div>
    </div>
    <div
      class="pinch-area"
      bind:this={containerEl}
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      onwheel={handleWheel}
      role="application"
      aria-label="Pinch and spread area"
    >
      <div class="emoji-target" style="transform: scale({currentScale}); font-size: 6rem;">
        {current.emoji}
      </div>
    </div>
  {:else}
    <CelebrationOverlay>
      <div class="results">
        <h2>{$t('fineMotor.greatJob')}!</h2>
        <p class="big-score">{completed + 1}/{IMAGES.length}</p>
        <div class="result-stars">
          {#each [1,2,3] as s}
            <span class="rstar earned">⭐</span>
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
  .pinch-game { display: flex; flex-direction: column; height: 100%; }
  .intro { text-align: center; padding: 2rem; }
  .desc { font-size: 1.1rem; color: #555; margin-bottom: 0.5rem; }
  .hint { font-size: 0.9rem; color: #888; margin-bottom: 1.5rem; }
  .start-btn {
    font-size: 1.3rem; padding: 1rem 2.5rem;
    background: #e67e22; color: white; border: none;
    border-radius: 16px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(230,126,34,0.3);
  }
  .start-btn:hover { transform: scale(1.05); }
  .hud {
    display: flex; justify-content: space-between;
    padding: 0.75rem 1rem; background: rgba(255,255,255,0.8);
    border-radius: 12px; font-weight: 600;
  }
  .target-hint {
    text-align: center; color: #666; margin: 0.5rem 0;
    font-size: 0.9rem;
  }
  .scale-indicator { font-family: monospace; }
  .progress-bar {
    height: 8px; background: #e0e0e0; border-radius: 4px;
    margin: 0.5rem 0; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: #4caf50; border-radius: 4px;
    transition: width 0.1s;
  }
  .progress-fill.wrong { background: #e74c3c; }
  .pinch-area {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: white; border-radius: 16px;
    min-height: 300px; touch-action: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    user-select: none;
  }
  .emoji-target {
    transition: transform 0.05s ease-out;
    will-change: transform;
  }
  .results { text-align: center; }
  .big-score { font-size: 2rem; font-weight: bold; color: #e67e22; }
  .result-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; }
  .rstar { font-size: 2rem; opacity: 0.2; }
  .rstar.earned { opacity: 1; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .btn {
    padding: 0.75rem 1.5rem; font-size: 1rem;
    border: none; border-radius: 12px; cursor: pointer;
    background: #e67e22; color: white;
  }
  .btn.secondary { background: #78909c; }
  .btn:hover { transform: scale(1.03); }
</style>
