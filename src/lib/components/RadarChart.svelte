<script lang="ts">
  import { t } from '$lib/i18n';
  import { SENSES, RATING_VALUES } from '$lib/data/sensory-data.js';

  interface Props {
    ratings: Record<string, string>; // senseId -> 'seeking' | 'neutral' | 'avoiding'
    size?: number;
  }

  let { ratings, size = 300 }: Props = $props();

  const cx = $derived(size / 2);
  const cy = $derived(size / 2);
  const maxRadius = $derived(size / 2 - 40);
  const levels = 3; // 0, 1, 2

  function getPoint(index: number, value: number, total: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (value / (levels - 1)) * maxRadius;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  }

  function getLabelPoint(index: number, total: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = maxRadius + 28;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  }

  const senseIds = SENSES.map(s => s.id);

  const dataPoints = $derived(() => {
    return senseIds.map((id, i) => {
      const rating = ratings[id] || 'neutral';
      const value = RATING_VALUES[rating] ?? 1;
      return getPoint(i, value, senseIds.length);
    });
  });

  const polygonPoints = $derived(() => {
    return dataPoints().map(p => `${p.x},${p.y}`).join(' ');
  });

  const gridLines = $derived(() => {
    const lines = [];
    for (let level = 0; level < levels; level++) {
      const pts = senseIds.map((_, i) => {
        const p = getPoint(i, level, senseIds.length);
        return `${p.x},${p.y}`;
      });
      lines.push(pts.join(' '));
    }
    return lines;
  });

  function getRatingColor(rating: string): string {
    switch (rating) {
      case 'seeking': return '#27AE60';
      case 'avoiding': return '#E74C3C';
      default: return '#F1C40F';
    }
  }
</script>

<div class="radar-chart">
  <svg viewBox="0 0 {size} {size}" width={size} height={size}>
    <!-- Grid levels -->
    {#each gridLines() as points, level}
      <polygon
        points={points}
        fill="none"
        stroke="#ddd"
        stroke-width="1"
        stroke-dasharray={level === 0 ? "none" : "4,4"}
      />
    {/each}

    <!-- Axis lines -->
    {#each senseIds as _, i}
      {@const end = getPoint(i, levels - 1, senseIds.length)}
      <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#ddd" stroke-width="1" />
    {/each}

    <!-- Data polygon -->
    {#if Object.keys(ratings).length > 0}
      <polygon
        points={polygonPoints()}
        fill="rgba(52, 152, 219, 0.25)"
        stroke="#3498DB"
        stroke-width="2.5"
      />

      <!-- Data points -->
      {#each dataPoints() as point, i}
        {@const senseId = senseIds[i]}
        {@const rating = ratings[senseId] || 'neutral'}
        <circle
          cx={point.x}
          cy={point.y}
          r="6"
          fill={getRatingColor(rating)}
          stroke="white"
          stroke-width="2"
        />
      {/each}
    {/if}

    <!-- Labels -->
    {#each SENSES as sense, i}
      {@const labelPt = getLabelPoint(i, senseIds.length)}
      <text
        x={labelPt.x}
        y={labelPt.y}
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="11"
        font-weight="500"
        fill="var(--text-color, #2c3e50)"
      >
        <tspan>{sense.emoji}</tspan>
        <tspan x={labelPt.x} dy="14" font-size="9">{$t(sense.label)}</tspan>
      </text>
    {/each}
  </svg>

  <!-- Legend -->
  <div class="legend">
    <span class="legend-item">
      <span class="dot" style="background: #27AE60"></span>
      {$t('sensory.chart.seeking')}
    </span>
    <span class="legend-item">
      <span class="dot" style="background: #F1C40F"></span>
      {$t('sensory.rating.neutral')}
    </span>
    <span class="legend-item">
      <span class="dot" style="background: #E74C3C"></span>
      {$t('sensory.chart.avoiding')}
    </span>
  </div>
</div>

<style>
  .radar-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  svg {
    max-width: 100%;
    height: auto;
  }

  .legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    color: var(--text-color, #2c3e50);
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
</style>
