<script lang="ts">
  import { onMount } from 'svelte';

  /** Array of pitch values (0-100 scale) */
  export let contour: number[] = [];
  /** Type label for color coding */
  export let type: 'statement' | 'question' | 'exclamation' | 'emotion' = 'statement';
  /** Whether to animate the drawing */
  export let animate = true;
  /** Height of SVG */
  export let height = 140;

  let svgWidth = 300;
  let drawn = false;
  let progress = 0;
  let animFrame: number;
  let containerEl: HTMLDivElement;

  const typeColors: Record<string, { stroke: string; fill: string; arrow: string }> = {
    statement: { stroke: '#3498DB', fill: 'rgba(52,152,219,0.15)', arrow: '↘' },
    question: { stroke: '#E67E22', fill: 'rgba(230,126,34,0.15)', arrow: '↗' },
    exclamation: { stroke: '#E91E63', fill: 'rgba(233,30,99,0.15)', arrow: '↗↘' },
    emotion: { stroke: '#9B59B6', fill: 'rgba(155,89,182,0.15)', arrow: '〰' },
  };

  $: colors = typeColors[type] || typeColors.statement;

  $: points = contour.map((v, i) => {
    const x = contour.length > 1 ? (i / (contour.length - 1)) * (svgWidth - 40) + 20 : svgWidth / 2;
    const y = height - 20 - ((v / 100) * (height - 40));
    return { x, y };
  });

  $: pathD = points.length > 1 ? buildSmoothPath(points) : '';
  $: fillD = pathD ? `${pathD} L ${points[points.length - 1].x},${height - 10} L ${points[0].x},${height - 10} Z` : '';

  function buildSmoothPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  }

  onMount(() => {
    if (containerEl) {
      svgWidth = containerEl.clientWidth || 300;
    }
    if (animate) {
      progress = 0;
      const start = performance.now();
      const duration = 1200;
      function tick(now: number) {
        const elapsed = now - start;
        progress = Math.min(elapsed / duration, 1);
        if (progress < 1) {
          animFrame = requestAnimationFrame(tick);
        } else {
          drawn = true;
        }
      }
      animFrame = requestAnimationFrame(tick);
    } else {
      progress = 1;
      drawn = true;
    }
    return () => { if (animFrame) cancelAnimationFrame(animFrame); };
  });

  export function replay() {
    drawn = false;
    progress = 0;
    const start = performance.now();
    const duration = 1200;
    function tick(now: number) {
      const elapsed = now - start;
      progress = Math.min(elapsed / duration, 1);
      if (progress < 1) {
        animFrame = requestAnimationFrame(tick);
      } else {
        drawn = true;
      }
    }
    animFrame = requestAnimationFrame(tick);
  }
</script>

<div class="pitch-contour" bind:this={containerEl}>
  <svg width="100%" {height} viewBox="0 0 {svgWidth} {height}" preserveAspectRatio="xMidYMid meet">
    <!-- Grid lines -->
    {#each [0.25, 0.5, 0.75] as frac}
      <line
        x1="20" y1={height - 20 - frac * (height - 40)}
        x2={svgWidth - 20} y2={height - 20 - frac * (height - 40)}
        stroke="var(--border, #ddd)" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.5"
      />
    {/each}

    <!-- Fill area -->
    {#if fillD}
      <path d={fillD} fill={colors.fill} opacity={progress} />
    {/if}

    <!-- Main curve -->
    {#if pathD}
      <path
        d={pathD}
        fill="none"
        stroke={colors.stroke}
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray={animate ? `${progress * 1000} 1000` : 'none'}
      />
    {/if}

    <!-- Dots at data points -->
    {#each points as pt, i}
      {#if progress >= (i / Math.max(points.length - 1, 1))}
        <circle
          cx={pt.x} cy={pt.y} r="5"
          fill={colors.stroke}
          opacity={Math.min(1, (progress - i / Math.max(points.length - 1, 1)) * points.length)}
        />
      {/if}
    {/each}

    <!-- Arrow indicator -->
    <text
      x={svgWidth - 30} y="22"
      font-size="18" text-anchor="end"
      fill={colors.stroke} font-weight="700"
    >{colors.arrow}</text>
  </svg>
</div>

<style>
  .pitch-contour {
    width: 100%;
    background: var(--bg-card, #fff);
    border-radius: 16px;
    border: 2px solid var(--border, #e0e0e0);
    padding: 0.5rem;
    overflow: hidden;
  }
  svg {
    display: block;
  }
</style>
