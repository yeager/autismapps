<script>
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher, onMount } from 'svelte';
  import CelebrationOverlay from './CelebrationOverlay.svelte';

  let { playSound, oncomplete } = $props();

  const CHALLENGES = [
    { id: 'circle', key: 'fineMotor.drawing.circle', hint: '⭕' },
    { id: 'triangle', key: 'fineMotor.drawing.triangle', hint: '🔺' },
    { id: 'square', key: 'fineMotor.drawing.square', hint: '🟦' },
    { id: 'line-h', key: 'fineMotor.drawing.lineH', hint: '➡️' },
    { id: 'line-v', key: 'fineMotor.drawing.lineV', hint: '⬇️' },
    { id: 'heart', key: 'fineMotor.drawing.heart', hint: '❤️' },
    { id: 'spiral', key: 'fineMotor.drawing.spiral', hint: '🌀' },
    { id: 'free', key: 'fineMotor.drawing.free', hint: '🎨' },
  ];

  const BRUSH_COLORS = ['#333', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e91e63'];
  const BRUSH_SIZES = [3, 6, 10, 16];

  let gameState = $state('idle');
  let currentChallengeIdx = $state(0);
  let brushColor = $state('#333');
  let brushSize = $state(6);
  let isDrawing = $state(false);
  let hasDrawn = $state(false);
  let canvasEl;
  let ctx;

  let currentChallenge = $derived(CHALLENGES[currentChallengeIdx]);

  function startDrawing() {
    gameState = 'drawing';
    hasDrawn = false;
    requestAnimationFrame(setupCanvas);
  }

  function setupCanvas() {
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    canvasEl.width = rect.width * window.devicePixelRatio;
    canvasEl.height = rect.height * window.devicePixelRatio;
    ctx = canvasEl.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function getPos(e) {
    const rect = canvasEl.getBoundingClientRect();
    const touch = e.touches?.[0] || e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function handleStart(e) {
    e.preventDefault();
    isDrawing = true;
    hasDrawn = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
  }

  function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function handleEnd(e) {
    e.preventDefault();
    isDrawing = false;
  }

  function clearCanvas() {
    if (ctx) {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
    hasDrawn = false;
  }

  function finishDrawing() {
    playSound('success');
    gameState = 'done';
    // Drawing is always rewarded for effort
    const stars = 3;
    oncomplete?.({ detail: { exerciseId: 'drawing', stars, score: currentChallengeIdx + 1 } });
  }

  function nextChallenge() {
    currentChallengeIdx = (currentChallengeIdx + 1) % CHALLENGES.length;
    gameState = 'idle';
  }

  function reset() {
    gameState = 'idle';
  }
</script>

<div class="drawing-game" in:fade>
  {#if gameState === 'idle'}
    <div class="intro">
      <p class="desc">{$t('fineMotor.drawing.desc')}</p>
      <div class="challenge-picker">
        {#each CHALLENGES as ch, idx}
          <button
            class="challenge-btn"
            class:selected={idx === currentChallengeIdx}
            onclick={() => currentChallengeIdx = idx}
          >
            <span class="ch-hint">{ch.hint}</span>
            <span class="ch-label">{$t(ch.key)}</span>
          </button>
        {/each}
      </div>
      <button class="start-btn" onclick={startDrawing}>{$t('fineMotor.start')}</button>
    </div>
  {:else if gameState === 'drawing'}
    <div class="draw-header">
      <span class="prompt">{currentChallenge.hint} {$t(currentChallenge.key)}</span>
    </div>
    <div class="toolbar">
      <div class="colors">
        {#each BRUSH_COLORS as color}
          <button
            class="color-btn"
            class:selected={brushColor === color}
            style="background: {color}"
            onclick={() => brushColor = color}
            aria-label="Color {color}"
          ></button>
        {/each}
      </div>
      <div class="sizes">
        {#each BRUSH_SIZES as size}
          <button
            class="size-btn"
            class:selected={brushSize === size}
            onclick={() => brushSize = size}
          >
            <span class="size-dot" style="width:{size}px;height:{size}px;background:{brushColor}"></span>
          </button>
        {/each}
      </div>
    </div>
    <div class="canvas-wrapper">
      <canvas
        bind:this={canvasEl}
        class="draw-canvas"
        ontouchstart={handleStart}
        ontouchmove={handleMove}
        ontouchend={handleEnd}
        onmousedown={handleStart}
        onmousemove={handleMove}
        onmouseup={handleEnd}
        onmouseleave={handleEnd}
      ></canvas>
    </div>
    <div class="draw-actions">
      <button class="btn secondary" onclick={clearCanvas}>🗑️ {$t('fineMotor.drawing.clear')}</button>
      <button class="btn" onclick={finishDrawing} disabled={!hasDrawn}>✅ {$t('fineMotor.drawing.done')}</button>
    </div>
  {:else}
    <CelebrationOverlay>
      <div class="results">
        <h2>{$t('fineMotor.greatJob')}! {currentChallenge.hint}</h2>
        <div class="result-stars">
          {#each [1,2,3] as s}
            <span class="rstar earned">⭐</span>
          {/each}
        </div>
        <div class="result-actions">
          <button class="btn" onclick={nextChallenge}>{$t('fineMotor.next')}</button>
          <button class="btn secondary" onclick={reset}>{$t('fineMotor.back')}</button>
        </div>
      </div>
    </CelebrationOverlay>
  {/if}
</div>

<style>
  .drawing-game { display: flex; flex-direction: column; height: 100%; }
  .intro { text-align: center; padding: 1rem; }
  .desc { font-size: 1.1rem; color: #555; margin-bottom: 1rem; }
  .challenge-picker {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    justify-content: center; margin-bottom: 1.5rem;
  }
  .challenge-btn {
    display: flex; flex-direction: column; align-items: center;
    padding: 0.5rem 0.75rem; background: white; border: 2px solid #e0e0e0;
    border-radius: 10px; cursor: pointer; min-width: 70px;
  }
  .challenge-btn.selected { border-color: #e91e63; background: #fce4ec; }
  .ch-hint { font-size: 1.5rem; }
  .ch-label { font-size: 0.7rem; color: #666; }
  .start-btn {
    font-size: 1.3rem; padding: 1rem 2.5rem;
    background: #e91e63; color: white; border: none;
    border-radius: 16px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(233,30,99,0.3);
  }
  .start-btn:hover { transform: scale(1.05); }
  .draw-header {
    text-align: center; padding: 0.5rem;
    font-size: 1.2rem; font-weight: 600;
  }
  .toolbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.5rem; background: rgba(255,255,255,0.8);
    border-radius: 12px; margin-bottom: 0.5rem;
  }
  .colors { display: flex; gap: 4px; }
  .color-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid transparent; cursor: pointer;
    transition: border-color 0.2s;
  }
  .color-btn.selected { border-color: #333; }
  .sizes { display: flex; gap: 4px; align-items: center; }
  .size-btn {
    width: 36px; height: 36px; border-radius: 8px;
    border: 2px solid transparent; background: #f5f5f5;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .size-btn.selected { border-color: #e91e63; }
  .size-dot { border-radius: 50%; }
  .canvas-wrapper {
    flex: 1; background: white; border-radius: 16px;
    overflow: hidden; min-height: 250px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    touch-action: none;
  }
  .draw-canvas {
    width: 100%; height: 100%;
    cursor: crosshair;
  }
  .draw-actions {
    display: flex; gap: 1rem; justify-content: center;
    padding: 0.75rem 0;
  }
  .results { text-align: center; }
  .result-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; }
  .rstar { font-size: 2rem; opacity: 0.2; }
  .rstar.earned { opacity: 1; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .btn {
    padding: 0.75rem 1.5rem; font-size: 1rem;
    border: none; border-radius: 12px; cursor: pointer;
    background: #e91e63; color: white;
  }
  .btn.secondary { background: #78909c; color: white; }
  .btn:hover { transform: scale(1.03); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
