<script>
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import CelebrationOverlay from './CelebrationOverlay.svelte';

  let { playSound, oncomplete } = $props();

  const PATHS = [
    { id: 'line-h', label: 'fineMotor.tracing.lineH', d: 'M 50,200 L 350,200', difficulty: 1 },
    { id: 'line-v', label: 'fineMotor.tracing.lineV', d: 'M 200,50 L 200,350', difficulty: 1 },
    { id: 'line-d', label: 'fineMotor.tracing.lineD', d: 'M 50,50 L 350,350', difficulty: 1 },
    { id: 'curve', label: 'fineMotor.tracing.curve', d: 'M 50,300 Q 200,50 350,300', difficulty: 2 },
    { id: 'wave', label: 'fineMotor.tracing.wave', d: 'M 50,200 C 100,100 150,300 200,200 C 250,100 300,300 350,200', difficulty: 2 },
    { id: 'circle', label: 'fineMotor.tracing.circle', d: 'M 200,80 A 120,120 0 1,1 199,80', difficulty: 3 },
    { id: 'square', label: 'fineMotor.tracing.square', d: 'M 80,80 L 320,80 L 320,320 L 80,320 Z', difficulty: 3 },
    { id: 'triangle', label: 'fineMotor.tracing.triangle', d: 'M 200,60 L 340,340 L 60,340 Z', difficulty: 3 },
    { id: 'star', label: 'fineMotor.tracing.star', d: 'M 200,50 L 230,150 L 340,150 L 250,210 L 280,320 L 200,250 L 120,320 L 150,210 L 60,150 L 170,150 Z', difficulty: 4 },
    { id: 'zigzag', label: 'fineMotor.tracing.zigzag', d: 'M 50,300 L 110,100 L 170,300 L 230,100 L 290,300 L 350,100', difficulty: 2 },
  ];

  let gameState = $state('idle'); // idle | tracing | done
  let currentPathIdx = $state(0);
  let tracePoints = $state([]);
  let isDrawing = $state(false);
  let accuracy = $state(0);
  let canvasEl;
  let svgEl;
  let ctx;

  let currentPath = $derived(PATHS[currentPathIdx]);

  function startTracing() {
    gameState = 'tracing';
    tracePoints = [];
    accuracy = 0;
    setupCanvas();
  }

  function setupCanvas() {
    requestAnimationFrame(() => {
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = rect.width;
      canvasEl.height = rect.height;
      ctx = canvasEl.getContext('2d');
    });
  }

  function getPos(e) {
    const rect = canvasEl.getBoundingClientRect();
    const touch = e.touches?.[0] || e;
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  function handleStart(e) {
    e.preventDefault();
    isDrawing = true;
    tracePoints = [];
    if (ctx) {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
    const pos = getPos(e);
    tracePoints.push(pos);
  }

  function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    tracePoints = [...tracePoints, pos];
    drawTrace();
  }

  function handleEnd(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
    calculateAccuracy();
  }

  function drawTrace() {
    if (!ctx || tracePoints.length < 2) return;
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = rect.width / 400;
    const scaleY = rect.height / 400;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.beginPath();
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(tracePoints[0].x / (400 / canvasEl.width), tracePoints[0].y / (400 / canvasEl.height));
    for (let i = 1; i < tracePoints.length; i++) {
      ctx.lineTo(tracePoints[i].x / (400 / canvasEl.width), tracePoints[i].y / (400 / canvasEl.height));
    }
    ctx.stroke();
  }

  function calculateAccuracy() {
    if (tracePoints.length < 5) {
      accuracy = 0;
      return;
    }
    // Sample points along the SVG path and measure average distance
    const pathEl = svgEl?.querySelector('.target-path');
    if (!pathEl) { accuracy = 50; finishPath(); return; }

    const pathLen = pathEl.getTotalLength();
    let totalDist = 0;
    let samples = 0;

    for (const pt of tracePoints) {
      let minDist = Infinity;
      // Sample path at intervals
      for (let i = 0; i <= 50; i++) {
        const p = pathEl.getPointAtLength((i / 50) * pathLen);
        const dx = pt.x - p.x;
        const dy = pt.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) minDist = dist;
      }
      totalDist += minDist;
      samples++;
    }

    const avgDist = totalDist / samples;
    // Convert to 0-100 accuracy (within 30px = 100%, 100px = 0%)
    accuracy = Math.round(Math.max(0, Math.min(100, (1 - avgDist / 80) * 100)));
    finishPath();
  }

  function finishPath() {
    if (accuracy >= 50) {
      playSound('success');
    } else {
      playSound('error');
    }
    gameState = 'done';
    const stars = accuracy >= 85 ? 3 : accuracy >= 65 ? 2 : accuracy >= 40 ? 1 : 0;
    oncomplete?.({ detail: { exerciseId: 'tracing', stars, score: accuracy } });
  }

  function nextPath() {
    currentPathIdx = (currentPathIdx + 1) % PATHS.length;
    gameState = 'idle';
    tracePoints = [];
  }

  function retry() {
    tracePoints = [];
    gameState = 'tracing';
    setupCanvas();
  }
</script>

<div class="tracing-game" in:fade>
  {#if gameState === 'idle'}
    <div class="intro">
      <p class="desc">{$t('fineMotor.tracing.desc')}</p>
      <div class="path-picker">
        {#each PATHS as path, idx}
          <button
            class="path-btn"
            class:selected={idx === currentPathIdx}
            onclick={() => { currentPathIdx = idx; }}
          >
            <svg viewBox="0 0 400 400" width="60" height="60">
              <path d={path.d} fill="none" stroke={idx === currentPathIdx ? '#4caf50' : '#ccc'} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{'⭐'.repeat(path.difficulty)}</span>
          </button>
        {/each}
      </div>
      <button class="start-btn" onclick={startTracing}>{$t('fineMotor.start')}</button>
    </div>
  {:else if gameState === 'tracing'}
    <p class="instruction">{$t('fineMotor.tracing.instruction')}</p>
    <div class="trace-area">
      <svg bind:this={svgEl} viewBox="0 0 400 400" class="trace-svg">
        <path class="target-path" d={currentPath.d} fill="none" stroke="#e0e0e0" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" />
        <path d={currentPath.d} fill="none" stroke="#90caf9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8,8" />
      </svg>
      <canvas
        bind:this={canvasEl}
        class="trace-canvas"
        ontouchstart={handleStart}
        ontouchmove={handleMove}
        ontouchend={handleEnd}
        onmousedown={handleStart}
        onmousemove={handleMove}
        onmouseup={handleEnd}
        onmouseleave={handleEnd}
      ></canvas>
    </div>
  {:else}
    <CelebrationOverlay>
      <div class="results">
        <h2>{accuracy >= 50 ? $t('fineMotor.greatJob') : $t('fineMotor.tryAgain')}!</h2>
        <p class="big-score">{accuracy}%</p>
        <p>{$t('fineMotor.tracing.accuracy')}</p>
        <div class="result-stars">
          {#each [1,2,3] as s}
            <span class="rstar" class:earned={accuracy >= (s === 1 ? 40 : s === 2 ? 65 : 85)}>⭐</span>
          {/each}
        </div>
        <div class="result-actions">
          <button class="btn" onclick={retry}>{$t('fineMotor.tryAgain')}</button>
          <button class="btn secondary" onclick={nextPath}>{$t('fineMotor.next')}</button>
        </div>
      </div>
    </CelebrationOverlay>
  {/if}
</div>

<style>
  .tracing-game { display: flex; flex-direction: column; height: 100%; }
  .intro { text-align: center; padding: 1rem; }
  .desc { font-size: 1.1rem; color: #555; margin-bottom: 1rem; }
  .path-picker {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    justify-content: center; margin-bottom: 1.5rem;
  }
  .path-btn {
    display: flex; flex-direction: column; align-items: center;
    padding: 0.5rem; background: white; border: 2px solid #e0e0e0;
    border-radius: 12px; cursor: pointer; transition: all 0.2s;
  }
  .path-btn.selected { border-color: #4caf50; background: #e8f5e9; }
  .path-btn span { font-size: 0.6rem; }
  .instruction { text-align: center; color: #666; margin-bottom: 0.5rem; }
  .start-btn {
    font-size: 1.3rem; padding: 1rem 2.5rem;
    background: #4caf50; color: white; border: none;
    border-radius: 16px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(76,175,80,0.3);
  }
  .start-btn:hover { transform: scale(1.05); }
  .trace-area {
    flex: 1; position: relative; background: white;
    border-radius: 16px; overflow: hidden;
    min-height: 300px; touch-action: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .trace-svg {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none;
  }
  .trace-canvas {
    position: absolute; inset: 0; width: 100%; height: 100%;
    cursor: crosshair;
  }
  .results { text-align: center; }
  .big-score { font-size: 3rem; font-weight: bold; color: #4caf50; margin: 0.5rem 0; }
  .result-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; }
  .rstar { font-size: 2rem; opacity: 0.2; }
  .rstar.earned { opacity: 1; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .btn {
    padding: 0.75rem 1.5rem; font-size: 1rem;
    border: none; border-radius: 12px; cursor: pointer;
    background: #4caf50; color: white;
  }
  .btn.secondary { background: #78909c; }
  .btn:hover { transform: scale(1.03); }
</style>
