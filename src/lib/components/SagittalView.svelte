<script>
  import { onMount } from 'svelte';

  /** @type {import('$lib/data/tongue-positions').TonguePosition | null} */
  export let position = null;
  /** @type {import('$lib/data/tongue-positions').TonguePosition | null} */
  export let targetPosition = null;
  /** Show airflow animation */
  export let showAirflow = false;
  /** Dark background mode */
  export let darkMode = false;
  /** Animation duration in ms */
  export let animDuration = 300;

  // Default neutral rest position
  const REST = {
    tip: [0.35, 0.55], body: [0.48, 0.42], root: [0.68, 0.48],
    velum: 'closed', lips: 'neutral', voiced: false,
  };

  $: pos = position || REST;
  $: target = targetPosition;

  // SVG viewBox: 0 0 400 400
  const W = 400;
  const H = 400;

  // Map normalized coords [0..1, 0..1] to SVG space
  // The oral cavity occupies roughly the center of the SVG
  // X: 60-340 (front=lips to back=pharynx)
  // Y: 60-340 (top=palate to bottom=floor)
  function toSVG(nx, ny) {
    return [60 + nx * 280, 60 + ny * 280];
  }

  // ─── ANATOMICAL PATHS (static) ───

  // Hard palate — curved arch from front teeth area to velum junction
  const palatePath = 'M 95,120 C 110,70 200,50 260,80';

  // Soft palate (velum) — from palate end, curves down toward pharynx
  function velumPath(state) {
    if (state === 'open') {
      // Open = lowered, allowing nasal airflow
      return 'M 260,80 C 280,90 300,120 310,160';
    }
    // Closed = raised, sealing off nasal passage
    return 'M 260,80 C 280,85 305,95 310,120';
  }

  // Pharynx wall — back wall of the throat
  const pharynxPath = 'M 310,120 L 315,200 C 318,260 315,310 310,340';

  // Upper teeth
  const upperTeethPath = 'M 85,115 L 80,140 L 95,138 Z';

  // Lower teeth
  const lowerTeethPath = 'M 85,250 L 80,230 L 95,232 Z';

  // Nasal cavity outline
  const nasalPath = 'M 95,120 C 100,100 110,65 130,55 L 260,50 C 280,55 300,70 310,120';

  // Larynx area
  const larynxX = 290;
  const larynxY = 340;

  // ─── LIP SHAPES ───
  function upperLipPath(lipShape) {
    switch (lipShape) {
      case 'open-wide': return 'M 60,160 C 55,145 50,130 55,115 C 58,108 65,105 72,110 L 82,120';
      case 'open': return 'M 60,155 C 55,145 52,132 58,120 C 62,114 68,112 74,116 L 82,122';
      case 'rounded': return 'M 55,155 C 48,142 44,125 50,112 C 55,105 62,103 68,110 L 78,120';
      case 'spread': return 'M 65,150 C 62,142 60,130 62,118 C 65,112 70,110 76,114 L 84,120';
      case 'closed': return 'M 60,168 C 58,162 56,155 58,148 C 62,142 68,140 74,145 L 82,152';
      default: return 'M 60,155 C 57,145 55,133 58,122 C 62,115 68,113 74,118 L 82,124';
    }
  }

  function lowerLipPath(lipShape) {
    switch (lipShape) {
      case 'open-wide': return 'M 60,160 C 55,185 52,210 58,230 C 62,238 68,240 74,235 L 82,250';
      case 'open': return 'M 60,155 C 57,175 55,200 58,220 C 62,228 68,228 74,222 L 82,240';
      case 'rounded': return 'M 55,155 C 48,170 44,190 50,210 C 55,218 62,220 68,214 L 78,235';
      case 'spread': return 'M 65,150 C 62,165 60,185 64,210 C 67,218 72,220 78,215 L 84,240';
      case 'closed': return 'M 60,168 C 58,175 56,182 58,190 C 62,196 68,198 74,193 L 82,200';
      default: return 'M 60,155 C 57,172 55,195 58,218 C 62,225 68,225 74,220 L 82,238';
    }
  }

  // ─── TONGUE CURVE ───
  // Build a smooth bezier path through tip, body, and root
  function tonguePath(tp) {
    const [tipX, tipY] = toSVG(tp.tip[0], tp.tip[1]);
    const [bodyX, bodyY] = toSVG(tp.body[0], tp.body[1]);
    const [rootX, rootY] = toSVG(tp.root[0], tp.root[1]);

    // Tongue underside (floor of mouth)
    const floorY = 300;

    // Build path: start from tongue root base, curve up through body to tip,
    // then curve down to floor of mouth and back
    return `M ${rootX},${floorY}
            C ${rootX},${rootY + 20} ${rootX},${rootY} ${rootX},${rootY}
            C ${(rootX + bodyX) / 2},${Math.min(rootY, bodyY) - 10} ${bodyX + 15},${bodyY} ${bodyX},${bodyY}
            C ${bodyX - 15},${bodyY} ${(bodyX + tipX) / 2},${(bodyY + tipY) / 2} ${tipX},${tipY}
            C ${tipX - 15},${tipY + 20} ${tipX - 10},${tipY + 50} ${tipX + 5},${floorY}
            Z`;
  }

  // Tongue surface line (the visible top edge) for cleaner rendering
  function tongueSurfacePath(tp) {
    const [tipX, tipY] = toSVG(tp.tip[0], tp.tip[1]);
    const [bodyX, bodyY] = toSVG(tp.body[0], tp.body[1]);
    const [rootX, rootY] = toSVG(tp.root[0], tp.root[1]);

    return `M ${tipX},${tipY}
            C ${(tipX + bodyX) / 2},${(tipY + bodyY) / 2} ${bodyX - 15},${bodyY} ${bodyX},${bodyY}
            C ${bodyX + 15},${bodyY} ${(rootX + bodyX) / 2},${Math.min(rootY, bodyY) - 10} ${rootX},${rootY}`;
  }

  // ─── CONTACT POINT INDICATOR ───
  function contactPoint(tp) {
    if (!tp.contact) return null;
    switch (tp.contact) {
      case 'alveolar': return { cx: 105, cy: 115, label: 'Alveolär' };
      case 'velar': return { cx: 255, cy: 78, label: 'Velar' };
      case 'bilabial': return { cx: 68, cy: 155, label: 'Bilabial' };
      case 'labiodental': return { cx: 78, cy: 140, label: 'Labiodental' };
      case 'palatal': return { cx: 180, cy: 62, label: 'Palatal' };
      case 'retroflex': return { cx: 130, cy: 95, label: 'Retroflex' };
      case 'postalveolar': return { cx: 145, cy: 80, label: 'Postalveolär' };
      default: return null;
    }
  }

  // ─── AIRFLOW ARROWS ───
  function airflowParticles(tp) {
    if (!tp.airflow && !showAirflow) return [];
    const [tipX, tipY] = toSVG(tp.tip[0], tp.tip[1]);
    // Particles flowing from throat toward lips
    const particles = [];
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      particles.push({
        x: tipX - 20 - t * 30 + Math.random() * 10,
        y: tipY - 15 + Math.sin(t * Math.PI) * 10 + Math.random() * 8,
        delay: i * 0.15,
      });
    }
    return particles;
  }

  $: currentContact = pos ? contactPoint(pos) : null;
  $: targetContact = target ? contactPoint(target) : null;

  let airflowDots = [];
  let airflowInterval;

  onMount(() => {
    return () => {
      if (airflowInterval) clearInterval(airflowInterval);
    };
  });
</script>

<svg
  viewBox="0 0 {W} {H}"
  xmlns="http://www.w3.org/2000/svg"
  class="sagittal-svg"
  class:dark={darkMode}
  role="img"
  aria-label="Sagittal cross-section of the mouth showing tongue position"
>
  <defs>
    <!-- Tongue gradient -->
    <linearGradient id="tongueGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e8506a" />
      <stop offset="50%" stop-color="#d4405a" />
      <stop offset="100%" stop-color="#c0354d" />
    </linearGradient>
    <!-- Target tongue (ghost) -->
    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e8506a" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#c0354d" stop-opacity="0.15" />
    </linearGradient>
    <!-- Palate gradient -->
    <linearGradient id="palateGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ddd" />
      <stop offset="100%" stop-color="#bbb" />
    </linearGradient>
    <!-- Contact glow -->
    <filter id="contactGlow">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <!-- Vibration filter for voicing -->
    <filter id="vibrate">
      <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="1">
        <animate attributeName="seed" values="1;5;1" dur="0.15s" repeatCount="indefinite" />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale="2" />
    </filter>
    <!-- Airflow particle -->
    <radialGradient id="airDot">
      <stop offset="0%" stop-color="#60b0ff" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#60b0ff" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width={W} height={H} fill={darkMode ? '#1a1a2e' : '#faf8f5'} rx="12" />

  <!-- Head outline (simplified) -->
  <path
    d="M 65,50 C 40,50 30,80 30,120 C 30,200 40,280 55,340 L 320,340 C 330,280 335,200 335,120 C 335,60 300,40 260,40 L 130,40 C 100,40 80,42 65,50 Z"
    fill={darkMode ? '#252545' : '#f5ece3'}
    stroke={darkMode ? '#444' : '#d0c0b0'}
    stroke-width="1.5"
  />

  <!-- Nasal cavity -->
  <path
    d={nasalPath}
    fill={darkMode ? '#1e1e38' : '#f0e8e0'}
    stroke={darkMode ? '#555' : '#c8b8a8'}
    stroke-width="1"
    opacity="0.6"
  />
  <!-- Nasal cavity label -->
  <text x="185" y="45" text-anchor="middle" font-size="10" fill={darkMode ? '#888' : '#999'} font-style="italic">
    Näshåla
  </text>

  <!-- Pharynx wall -->
  <path
    d={pharynxPath}
    fill="none"
    stroke={darkMode ? '#665566' : '#c8a0a0'}
    stroke-width="3"
    stroke-linecap="round"
  />

  <!-- Hard palate -->
  <path
    d={palatePath}
    fill="none"
    stroke="url(#palateGrad)"
    stroke-width="6"
    stroke-linecap="round"
  />
  <text x="175" y="58" text-anchor="middle" font-size="9" fill={darkMode ? '#aaa' : '#888'}>
    Hårda gommen
  </text>

  <!-- Soft palate (velum) — animated -->
  <path
    d={velumPath(pos.velum)}
    fill="none"
    stroke={pos.velum === 'open' ? '#e8a060' : '#bbbbbb'}
    stroke-width="5"
    stroke-linecap="round"
    style="transition: d {animDuration}ms ease-in-out, stroke {animDuration}ms ease"
  />
  <text x="295" y="108" text-anchor="end" font-size="9" fill={darkMode ? '#aaa' : '#888'}>
    {pos.velum === 'open' ? 'Gomsegel (öppet)' : 'Gomsegel'}
  </text>

  <!-- Upper teeth -->
  <path d={upperTeethPath} fill={darkMode ? '#e0e0e0' : '#f8f4f0'} stroke={darkMode ? '#aaa' : '#bbb'} stroke-width="1" />

  <!-- Lower teeth -->
  <path d={lowerTeethPath} fill={darkMode ? '#e0e0e0' : '#f8f4f0'} stroke={darkMode ? '#aaa' : '#bbb'} stroke-width="1" />

  <!-- TARGET tongue (ghost overlay) -->
  {#if target}
    <path
      d={tonguePath(target)}
      fill="url(#targetGrad)"
      stroke="#e8506a"
      stroke-width="2"
      stroke-dasharray="6,4"
      opacity="0.5"
      style="transition: d {animDuration}ms ease-in-out"
    />
    <!-- Target contact point -->
    {#if targetContact}
      <circle
        cx={targetContact.cx}
        cy={targetContact.cy}
        r="8"
        fill="#ffa500"
        opacity="0.3"
        stroke="#ffa500"
        stroke-width="1"
        stroke-dasharray="3,3"
      />
    {/if}
  {/if}

  <!-- TONGUE (main) -->
  <path
    d={tonguePath(pos)}
    fill="url(#tongueGrad)"
    stroke="#b8304a"
    stroke-width="1.5"
    style="transition: d {animDuration}ms ease-in-out"
  />
  <!-- Tongue surface highlight -->
  <path
    d={tongueSurfacePath(pos)}
    fill="none"
    stroke="#f0708a"
    stroke-width="2"
    stroke-linecap="round"
    opacity="0.6"
    style="transition: d {animDuration}ms ease-in-out"
  />

  <!-- Contact point indicator -->
  {#if currentContact}
    <circle
      cx={currentContact.cx}
      cy={currentContact.cy}
      r="10"
      fill="#ffa500"
      opacity="0.7"
      filter="url(#contactGlow)"
      style="transition: cx {animDuration}ms, cy {animDuration}ms"
    />
    <text
      x={currentContact.cx}
      y={currentContact.cy - 16}
      text-anchor="middle"
      font-size="8"
      fill="#ffa500"
      font-weight="bold"
    >
      {currentContact.label}
    </text>
  {/if}

  <!-- Lips (animated) -->
  <path
    d={upperLipPath(pos.lips)}
    fill={darkMode ? '#cc7080' : '#e8a0a8'}
    stroke={darkMode ? '#aa5060' : '#d08088'}
    stroke-width="2"
    stroke-linecap="round"
    style="transition: d {animDuration}ms ease-in-out"
  />
  <path
    d={lowerLipPath(pos.lips)}
    fill={darkMode ? '#cc7080' : '#e8a0a8'}
    stroke={darkMode ? '#aa5060' : '#d08088'}
    stroke-width="2"
    stroke-linecap="round"
    style="transition: d {animDuration}ms ease-in-out"
  />

  <!-- Airflow particles -->
  {#if pos.airflow}
    {#each airflowParticles(pos) as particle, i}
      <circle
        cx={particle.x}
        cy={particle.y}
        r="3"
        fill="url(#airDot)"
      >
        <animate
          attributeName="cx"
          values="{particle.x};{particle.x - 40}"
          dur="1s"
          begin="{particle.delay}s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0"
          dur="1s"
          begin="{particle.delay}s"
          repeatCount="indefinite"
        />
      </circle>
    {/each}
    <!-- Airflow arrow -->
    <line
      x1={toSVG(pos.tip[0], pos.tip[1])[0] - 5}
      y1={toSVG(pos.tip[0], pos.tip[1])[1] - 10}
      x2={toSVG(pos.tip[0], pos.tip[1])[0] - 45}
      y2={toSVG(pos.tip[0], pos.tip[1])[1] - 15}
      stroke="#60b0ff"
      stroke-width="1.5"
      opacity="0.5"
      marker-end="url(#arrowhead)"
    />
  {/if}

  <!-- Vibration indicator (for trills) -->
  {#if pos.vibrate === 'tip'}
    <g style="transition: transform {animDuration}ms">
      <line
        x1={toSVG(pos.tip[0], pos.tip[1])[0] - 8}
        y1={toSVG(pos.tip[0], pos.tip[1])[1] - 5}
        x2={toSVG(pos.tip[0], pos.tip[1])[0] - 3}
        y2={toSVG(pos.tip[0], pos.tip[1])[1] - 10}
        stroke="#ff6060"
        stroke-width="1.5"
        opacity="0.7"
      >
        <animate attributeName="y1" values="{toSVG(pos.tip[0], pos.tip[1])[1] - 5};{toSVG(pos.tip[0], pos.tip[1])[1] - 8};{toSVG(pos.tip[0], pos.tip[1])[1] - 5}" dur="0.1s" repeatCount="indefinite" />
      </line>
      <line
        x1={toSVG(pos.tip[0], pos.tip[1])[0] + 3}
        y1={toSVG(pos.tip[0], pos.tip[1])[1] - 3}
        x2={toSVG(pos.tip[0], pos.tip[1])[0] + 8}
        y2={toSVG(pos.tip[0], pos.tip[1])[1] - 8}
        stroke="#ff6060"
        stroke-width="1.5"
        opacity="0.7"
      >
        <animate attributeName="y2" values="{toSVG(pos.tip[0], pos.tip[1])[1] - 8};{toSVG(pos.tip[0], pos.tip[1])[1] - 12};{toSVG(pos.tip[0], pos.tip[1])[1] - 8}" dur="0.1s" repeatCount="indefinite" />
      </line>
    </g>
  {/if}

  <!-- Voicing indicator at larynx -->
  {#if pos.voiced}
    <g>
      <circle cx={larynxX} cy={larynxY} r="8" fill="none" stroke="#ff8060" stroke-width="2" opacity="0.6">
        <animate attributeName="r" values="6;10;6" dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx={larynxX} cy={larynxY} r="4" fill="#ff8060" opacity="0.8">
        <animate attributeName="r" values="3;5;3" dur="0.3s" repeatCount="indefinite" />
      </circle>
      <text x={larynxX} y={larynxY + 20} text-anchor="middle" font-size="8" fill={darkMode ? '#cc8060' : '#cc6040'}>
        Stämband vibrerar
      </text>
    </g>
  {:else}
    <circle cx={larynxX} cy={larynxY} r="4" fill={darkMode ? '#555' : '#ccc'} />
    <text x={larynxX} y={larynxY + 20} text-anchor="middle" font-size="8" fill={darkMode ? '#666' : '#aaa'}>
      Stämband
    </text>
  {/if}

  <!-- Labels overlay -->
  <text x="70" y="170" font-size="9" fill={darkMode ? '#aaa' : '#888'}>Läppar</text>
  <text x="85" y="125" font-size="8" fill={darkMode ? '#aaa' : '#999'}>Tänder</text>
  <text x="315" y="240" font-size="9" fill={darkMode ? '#aaa' : '#888'} text-anchor="end">Svalg</text>

  <!-- Floor of mouth -->
  <line x1="80" y1="300" x2="310" y2="300" stroke={darkMode ? '#444' : '#ddd'} stroke-width="1" opacity="0.5" />
</svg>

<style>
  .sagittal-svg {
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .sagittal-svg.dark {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  /* Smooth transitions on all animated elements */
  .sagittal-svg path,
  .sagittal-svg circle {
    transition-property: d, cx, cy, fill, stroke, opacity;
    transition-timing-function: ease-in-out;
  }
</style>
