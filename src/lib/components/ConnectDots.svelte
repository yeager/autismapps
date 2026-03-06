<script>
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import CelebrationOverlay from './CelebrationOverlay.svelte';

  let { playSound, oncomplete } = $props();

  const PICTURES = [
    {
      id: 'house',
      label: 'fineMotor.connect.house',
      dots: [
        { x: 200, y: 60 },   // 1 - roof top
        { x: 340, y: 180 },  // 2 - roof right
        { x: 340, y: 340 },  // 3 - bottom right
        { x: 60, y: 340 },   // 4 - bottom left
        { x: 60, y: 180 },   // 5 - roof left
      ],
    },
    {
      id: 'star',
      label: 'fineMotor.connect.star',
      dots: [
        { x: 200, y: 40 },
        { x: 240, y: 150 },
        { x: 360, y: 150 },
        { x: 270, y: 220 },
        { x: 300, y: 340 },
        { x: 200, y: 270 },
        { x: 100, y: 340 },
        { x: 130, y: 220 },
        { x: 40, y: 150 },
        { x: 160, y: 150 },
      ],
    },
    {
      id: 'boat',
      label: 'fineMotor.connect.boat',
      dots: [
        { x: 200, y: 60 },   // mast top
        { x: 200, y: 200 },  // mast bottom
        { x: 340, y: 200 },  // sail right
        { x: 200, y: 200 },  // back to mast
        { x: 60, y: 200 },   // sail left
        { x: 40, y: 300 },   // hull left
        { x: 360, y: 300 },  // hull right
      ],
    },
    {
      id: 'fish',
      label: 'fineMotor.connect.fish',
      dots: [
        { x: 300, y: 200 },  // nose
        { x: 240, y: 120 },  // top front
        { x: 160, y: 100 },  // top mid
        { x: 80, y: 140 },   // top back
        { x: 40, y: 100 },   // tail top
        { x: 60, y: 200 },   // tail mid
        { x: 40, y: 300 },   // tail bottom
        { x: 80, y: 260 },   // bottom back
        { x: 160, y: 300 },  // bottom mid
        { x: 240, y: 280 },  // bottom front
      ],
    },
  ];

  let gameState = $state('idle');
  let currentPicIdx = $state(0);
  let connectedCount = $state(0);
  let lines = $state([]);
  let svgEl;

  let currentPic = $derived(PICTURES[currentPicIdx]);

  function startGame() {
    connectedCount = 0;
    lines = [];
    gameState = 'playing';
  }

  function tapDot(idx) {
    if (gameState !== 'playing') return;
    if (idx !== connectedCount) {
      playSound('error');
      return;
    }

    playSound('tap');
    connectedCount++;

    if (connectedCount > 1) {
      const prev = currentPic.dots[connectedCount - 2];
      const curr = currentPic.dots[connectedCount - 1];
      lines = [...lines, { x1: prev.x, y1: prev.y, x2: curr.x, y2: curr.y }];
    }

    if (connectedCount >= currentPic.dots.length) {
      // Close the shape
      const last = currentPic.dots[currentPic.dots.length - 1];
      const first = currentPic.dots[0];
      lines = [...lines, { x1: last.x, y1: last.y, x2: first.x, y2: first.y }];

      playSound('success');
      gameState = 'done';
      const stars = 3; // Completing = 3 stars
      oncomplete?.({ detail: { exerciseId: 'connect', stars, score: currentPic.dots.length } });
    }
  }

  function nextPicture() {
    currentPicIdx = (currentPicIdx + 1) % PICTURES.length;
    connectedCount = 0;
    lines = [];
    gameState = 'idle';
  }

  function reset() {
    connectedCount = 0;
    lines = [];
    gameState = 'idle';
  }
</script>

<div class="connect-game" in:fade>
  {#if gameState === 'idle'}
    <div class="intro">
      <p class="desc">{$t('fineMotor.connect.desc')}</p>
      <div class="pic-picker">
        {#each PICTURES as pic, idx}
          <button
            class="pic-btn"
            class:selected={idx === currentPicIdx}
            onclick={() => currentPicIdx = idx}
          >
            {$t(pic.label)} ({pic.dots.length})
          </button>
        {/each}
      </div>
      <button class="start-btn" onclick={startGame}>{$t('fineMotor.start')}</button>
    </div>
  {:else if gameState === 'playing'}
    <div class="hud">
      <span>{$t(currentPic.label)}</span>
      <span>{connectedCount}/{currentPic.dots.length}</span>
    </div>
    <div class="svg-wrapper">
      <svg bind:this={svgEl} viewBox="0 0 400 400" class="dot-svg">
        <!-- Connected lines -->
        {#each lines as line}
          <line
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#4caf50" stroke-width="3" stroke-linecap="round"
          />
        {/each}
        <!-- Dots -->
        {#each currentPic.dots as dot, idx}
          <g
            class="dot-group"
            class:active={idx === connectedCount}
            class:done={idx < connectedCount}
            onclick={() => tapDot(idx)}
            role="button"
            tabindex="0"
            style="cursor: pointer"
          >
            <circle
              cx={dot.x} cy={dot.y}
              r={idx === connectedCount ? 22 : 16}
              fill={idx < connectedCount ? '#4caf50' : idx === connectedCount ? '#ff9800' : '#e0e0e0'}
              stroke={idx === connectedCount ? '#e65100' : 'white'}
              stroke-width="3"
            />
            <text
              x={dot.x} y={dot.y}
              text-anchor="middle" dominant-baseline="central"
              fill={idx < connectedCount ? 'white' : '#333'}
              font-size="14" font-weight="bold"
            >{idx + 1}</text>
          </g>
        {/each}
      </svg>
    </div>
  {:else}
    <CelebrationOverlay>
      <div class="results">
        <h2>{$t('fineMotor.greatJob')}!</h2>
        <p>{$t(currentPic.label)}</p>
        <div class="completed-preview">
          <svg viewBox="0 0 400 400" width="200" height="200">
            {#each lines as line}
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#4caf50" stroke-width="3" />
            {/each}
            {#each currentPic.dots as dot}
              <circle cx={dot.x} cy={dot.y} r="6" fill="#4caf50" />
            {/each}
          </svg>
        </div>
        <div class="result-stars">
          {#each [1,2,3] as s}
            <span class="rstar earned">⭐</span>
          {/each}
        </div>
        <div class="result-actions">
          <button class="btn" onclick={nextPicture}>{$t('fineMotor.next')}</button>
          <button class="btn secondary" onclick={reset}>{$t('fineMotor.back')}</button>
        </div>
      </div>
    </CelebrationOverlay>
  {/if}
</div>

<style>
  .connect-game { display: flex; flex-direction: column; height: 100%; }
  .intro { text-align: center; padding: 1rem; }
  .desc { font-size: 1.1rem; color: #555; margin-bottom: 1rem; }
  .pic-picker {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    justify-content: center; margin-bottom: 1.5rem;
  }
  .pic-btn {
    padding: 0.5rem 1rem; background: white; border: 2px solid #e0e0e0;
    border-radius: 10px; cursor: pointer; font-size: 0.9rem;
  }
  .pic-btn.selected { border-color: #3498db; background: #e3f2fd; }
  .start-btn {
    font-size: 1.3rem; padding: 1rem 2.5rem;
    background: #3498db; color: white; border: none;
    border-radius: 16px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(52,152,219,0.3);
  }
  .start-btn:hover { transform: scale(1.05); }
  .hud {
    display: flex; justify-content: space-between;
    padding: 0.75rem 1rem; background: rgba(255,255,255,0.8);
    border-radius: 12px; margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .svg-wrapper {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: white; border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    touch-action: manipulation;
  }
  .dot-svg { max-width: 100%; max-height: 100%; }
  .dot-group { transition: transform 0.2s; }
  .dot-group.active circle { animation: pulse-dot 1s infinite; }
  @keyframes pulse-dot {
    0%, 100% { r: 22; }
    50% { r: 26; }
  }
  .completed-preview { margin: 1rem 0; }
  .results { text-align: center; }
  .result-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; }
  .rstar { font-size: 2rem; opacity: 0.2; }
  .rstar.earned { opacity: 1; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .btn {
    padding: 0.75rem 1.5rem; font-size: 1rem;
    border: none; border-radius: 12px; cursor: pointer;
    background: #3498db; color: white;
  }
  .btn.secondary { background: #78909c; }
  .btn:hover { transform: scale(1.03); }
</style>
