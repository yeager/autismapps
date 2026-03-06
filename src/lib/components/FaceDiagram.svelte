<script lang="ts">
  /**
   * FaceDiagram — Interactive SVG face with PROMPT touch zones
   *
   * Shows a friendly, gender-neutral child's face (front view) with:
   * - Highlighted pulsing touch zones (red/orange circles)
   * - Directional arrows showing pressure direction
   * - Hand silhouette for finger placement
   * - Numbered step indicators
   */
  import { TOUCH_ZONES, DIRECTION_ANGLES, PRESSURE_LEVELS } from '$lib/data/prompt-data.js';

  /** Currently selected sound data */
  let {
    touchZone = '',
    touchZoneSecondary = '',
    direction = 'none',
    pressure = 'medium',
    activeStep = 0,
  }: {
    touchZone?: string;
    touchZoneSecondary?: string;
    direction?: string;
    pressure?: string;
    activeStep?: number;
  } = $props();

  const zone = $derived(touchZone ? TOUCH_ZONES[touchZone as keyof typeof TOUCH_ZONES] : null);
  const zone2 = $derived(touchZoneSecondary ? TOUCH_ZONES[touchZoneSecondary as keyof typeof TOUCH_ZONES] : null);
  const arrowAngle = $derived(DIRECTION_ANGLES[direction as keyof typeof DIRECTION_ANGLES] ?? 0);
  const pressureInfo = $derived(PRESSURE_LEVELS[pressure as keyof typeof PRESSURE_LEVELS]);
</script>

<div class="face-diagram-wrapper">
  <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Face diagram showing touch points">
    <defs>
      <!-- Pulsing animation for touch zones -->
      <style>
        @keyframes pulse {
          0%, 100% { r: var(--base-r); opacity: 0.7; }
          50% { r: calc(var(--base-r) + 5px); opacity: 0.4; }
        }
        .touch-zone-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(var(--dx, 0), var(--dy, 0)); }
        }
      </style>
      <!-- Gradient for face -->
      <radialGradient id="faceGrad" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stop-color="#FFE0BD" />
        <stop offset="100%" stop-color="#F5C7A1" />
      </radialGradient>
      <!-- Glow for touch zones -->
      <filter id="touchGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <!-- Arrow marker -->
      <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#E74C3C" />
      </marker>
    </defs>

    <!-- ═══ FACE SHAPE ═══ -->
    <!-- Head outline -->
    <ellipse cx="100" cy="120" rx="72" ry="88" fill="url(#faceGrad)" stroke="#D4A574" stroke-width="2" />

    <!-- Hair (simple, gender-neutral) -->
    <path d="M 28 105 Q 30 40 100 30 Q 170 40 172 105" fill="#8B6914" stroke="#6B4E11" stroke-width="1.5" />
    <path d="M 35 95 Q 38 55 100 45 Q 162 55 165 95" fill="#A07818" stroke="none" />

    <!-- ═══ EARS ═══ -->
    <ellipse cx="28" cy="130" rx="10" ry="18" fill="#F5C7A1" stroke="#D4A574" stroke-width="1.5" />
    <ellipse cx="172" cy="130" rx="10" ry="18" fill="#F5C7A1" stroke="#D4A574" stroke-width="1.5" />

    <!-- ═══ EYES ═══ -->
    <!-- Left eye -->
    <ellipse cx="72" cy="115" rx="14" ry="10" fill="white" stroke="#A08060" stroke-width="1.5" />
    <circle cx="72" cy="115" r="6" fill="#5B3A1A" />
    <circle cx="74" cy="113" r="2" fill="white" />
    <!-- Right eye -->
    <ellipse cx="128" cy="115" rx="14" ry="10" fill="white" stroke="#A08060" stroke-width="1.5" />
    <circle cx="128" cy="115" r="6" fill="#5B3A1A" />
    <circle cx="130" cy="113" r="2" fill="white" />

    <!-- Eyebrows -->
    <path d="M 56 102 Q 72 96 88 102" fill="none" stroke="#6B4E11" stroke-width="2" stroke-linecap="round" />
    <path d="M 112 102 Q 128 96 144 102" fill="none" stroke="#6B4E11" stroke-width="2" stroke-linecap="round" />

    <!-- ═══ NOSE ═══ -->
    <path d="M 100 120 L 94 142 Q 100 146 106 142 Z" fill="#EDBD93" stroke="#D4A574" stroke-width="1" />

    <!-- ═══ MOUTH ═══ -->
    <path d="M 78 168 Q 88 158 100 158 Q 112 158 122 168" fill="none" stroke="#C4766D" stroke-width="2.5" stroke-linecap="round" />
    <!-- Upper lip -->
    <path d="M 78 168 Q 90 164 100 162 Q 110 164 122 168" fill="#D4877E" stroke="none" />
    <!-- Lower lip -->
    <path d="M 78 168 Q 90 180 100 182 Q 110 180 122 168" fill="#D4877E" stroke="none" opacity="0.6" />

    <!-- ═══ CHIN ═══ -->
    <ellipse cx="100" cy="205" rx="25" ry="8" fill="none" stroke="#D4A574" stroke-width="0.5" opacity="0.3" />

    <!-- ═══ TOUCH ZONES ═══ -->
    {#if zone}
      <!-- Primary touch zone - pulsing -->
      <circle
        cx={zone.cx}
        cy={zone.cy}
        r={zone.r + 4}
        fill="none"
        stroke={pressureInfo?.color ?? '#E74C3C'}
        stroke-width="2"
        opacity="0.3"
        class="touch-zone-pulse"
        style="--base-r: {zone.r + 4}px"
      />
      <circle
        cx={zone.cx}
        cy={zone.cy}
        r={zone.r}
        fill={pressureInfo?.color ?? '#E74C3C'}
        opacity="0.35"
        filter="url(#touchGlow)"
      />
      <circle
        cx={zone.cx}
        cy={zone.cy}
        r={zone.r}
        fill="none"
        stroke={pressureInfo?.color ?? '#E74C3C'}
        stroke-width="2.5"
        stroke-dasharray="4 3"
      />

      <!-- Direction arrow -->
      {#if direction !== 'none'}
        <g transform="translate({zone.cx}, {zone.cy}) rotate({arrowAngle})">
          <line
            x1={-zone.r - 2}
            y1="0"
            x2={-zone.r - 18}
            y2="0"
            stroke="#E74C3C"
            stroke-width="2.5"
            marker-end="url(#arrowHead)"
            transform="rotate(180)"
          />
        </g>
      {/if}

      <!-- Step number indicator -->
      {#if activeStep > 0}
        <circle
          cx={zone.cx + zone.r + 8}
          cy={zone.cy - zone.r - 4}
          r="10"
          fill="#2C3E50"
        />
        <text
          x={zone.cx + zone.r + 8}
          y={zone.cy - zone.r - 1}
          text-anchor="middle"
          fill="white"
          font-size="12"
          font-weight="bold"
        >{activeStep}</text>
      {/if}

      <!-- Finger silhouette hint -->
      <g transform="translate({zone.cx}, {zone.cy + zone.r + 16})" opacity="0.4">
        <ellipse cx="0" cy="0" rx="5" ry="10" fill="#8B7355" />
        <ellipse cx="0" cy="-8" rx="4" ry="4" fill="#9B8365" />
      </g>
    {/if}

    {#if zone2}
      <!-- Secondary touch zone -->
      <circle
        cx={zone2.cx}
        cy={zone2.cy}
        r={zone2.r + 4}
        fill="none"
        stroke={pressureInfo?.color ?? '#E74C3C'}
        stroke-width="2"
        opacity="0.3"
        class="touch-zone-pulse"
        style="--base-r: {zone2.r + 4}px"
      />
      <circle
        cx={zone2.cx}
        cy={zone2.cy}
        r={zone2.r}
        fill={pressureInfo?.color ?? '#E74C3C'}
        opacity="0.25"
        filter="url(#touchGlow)"
      />
      <circle
        cx={zone2.cx}
        cy={zone2.cy}
        r={zone2.r}
        fill="none"
        stroke={pressureInfo?.color ?? '#E74C3C'}
        stroke-width="2.5"
        stroke-dasharray="4 3"
      />
    {/if}

    <!-- ═══ NO SELECTION MESSAGE ═══ -->
    {#if !zone}
      <text x="100" y="250" text-anchor="middle" fill="#95A5A6" font-size="11" font-style="italic">
        ← Välj ett ljud
      </text>
    {/if}
  </svg>
</div>

<style>
  .face-diagram-wrapper {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }

  svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
  }

  @media (min-width: 768px) {
    .face-diagram-wrapper {
      max-width: 380px;
    }
  }
</style>
