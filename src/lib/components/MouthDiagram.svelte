<!--
  MouthDiagram.svelte — Sagittal cross-section SVG of the vocal tract.
  Shows: upper/lower lip, upper/lower teeth, hard palate, soft palate (velum),
  tongue (body + tip), uvula, pharynx.
  Active articulators highlighted in color.
-->
<script>
  /** @type {import('$lib/data/mouth-sounds').sounds[0] | null} */
  export let sound = null;

  // Derive positions from sound data with smooth defaults
  $: tongueBodyX = sound ? 40 + sound.tongueX * 120 : 95;
  $: tongueBodyY = sound ? 60 + sound.tongueY * 100 : 120;
  $: tongueTipX = sound ? 30 + sound.tongueTipX * 120 : 70;
  $: tongueTipY = sound ? 50 + sound.tongueTipY * 100 : 110;

  // Jaw opening affects lower jaw Y offset
  $: jawOffset = sound ? (
    sound.jaw === 'wide' ? 18 :
    sound.jaw === 'medium' ? 10 :
    sound.jaw === 'narrow' ? 4 : 0
  ) : 8;

  // Velum position: closed = raised, open = lowered (nasal sounds)
  $: velumY = sound?.velum === 'open' ? 62 : 48;

  // Lip closure
  $: lipsClosed = sound?.lips === 'closed';
  $: lipsRounded = sound?.lips === 'rounded';

  // Color for active parts
  $: activeColor = '#E74C3C';
  $: passiveColor = '#F5CBA7';
  $: boneColor = '#FDEBD0';

  // Voicing indicator
  $: voiced = sound?.voiced ?? false;

  // Airflow
  $: airflow = sound?.airflow ?? 'none';
  $: velumOpen = sound?.velum === 'open';

  // Special articulations
  $: isLabiodental = sound?.special === 'labiodental';
</script>

<svg viewBox="0 0 200 200" class="mouth-svg" xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label={sound ? `Sagittal view of mouth for sound ${sound.symbol}` : 'Sagittal view of mouth'}>

  <!-- Background: head outline (simplified sagittal) -->
  <defs>
    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDEBD0"/>
      <stop offset="100%" stop-color="#F5CBA7"/>
    </linearGradient>
    <linearGradient id="tongueGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E88B8B"/>
      <stop offset="100%" stop-color="#D35656"/>
    </linearGradient>
    <!-- Airflow arrow marker -->
    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
      <polygon points="0 0, 6 2, 0 4" fill="#3498DB" opacity="0.7"/>
    </marker>
  </defs>

  <!-- Head outline (sagittal silhouette) -->
  <path d="M 25,20 Q 20,40 20,60 Q 18,100 20,140 Q 22,165 40,175
           L 80,178 Q 100,180 130,175 Q 160,165 170,140
           Q 180,100 175,60 Q 172,40 160,25 Q 140,10 100,8 Q 60,10 25,20 Z"
    fill="url(#skinGrad)" stroke="#D5A677" stroke-width="1.5" opacity="0.3"/>

  <!-- Nasal cavity -->
  <path d="M 30,38 Q 35,30 60,28 Q 80,27 95,30 L 95,48 Q 75,45 55,46 Q 40,47 30,48 Z"
    fill="#FFE6E6" stroke="#E8B4B4" stroke-width="0.8" opacity="0.6"/>

  <!-- Hard palate -->
  <path d="M 55,50 Q 75,42 100,44 Q 120,46 135,52"
    fill="none" stroke={boneColor} stroke-width="5" stroke-linecap="round"/>
  <path d="M 55,50 Q 75,42 100,44 Q 120,46 135,52"
    fill="none" stroke="#D5A677" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Soft palate / Velum (moves for nasal sounds) -->
  <path d="M 135,52 Q 145,{velumY} 148,{velumY + 8} Q 150,{velumY + 14} 146,{velumY + 18}"
    fill={passiveColor} stroke={velumOpen ? activeColor : '#D5A677'}
    stroke-width={velumOpen ? 2.5 : 1.5}
    class="velum" class:active={velumOpen}/>

  <!-- Uvula -->
  <ellipse cx="146" cy={velumY + 22} rx="4" ry="5"
    fill={passiveColor} stroke={velumOpen ? activeColor : '#D5A677'}
    stroke-width={velumOpen ? 2 : 1}/>

  <!-- Pharynx (back wall) -->
  <line x1="155" y1="55" x2="158" y2="160" stroke="#D5A677" stroke-width="1.5" opacity="0.5"/>

  <!-- Upper teeth -->
  <rect x="38" y="54" width="18" height="12" rx="2" fill="white" stroke="#ccc" stroke-width="0.8"/>

  <!-- Lower teeth (moves with jaw) -->
  <rect x="38" y={85 + jawOffset} width="18" height="11" rx="2" fill="white" stroke="#ccc" stroke-width="0.8"/>

  <!-- Upper lip -->
  <ellipse cx="30" cy="56" rx="12" ry={lipsClosed ? 5 : lipsRounded ? 6 : 7}
    fill={passiveColor}
    stroke={(lipsClosed || lipsRounded || isLabiodental) ? activeColor : '#D5A677'}
    stroke-width={(lipsClosed || lipsRounded || isLabiodental) ? 2.5 : 1.5}
    class:active={lipsClosed || lipsRounded || isLabiodental}/>

  <!-- Lower lip (moves with jaw) -->
  <ellipse cx="30" cy={94 + jawOffset} rx="12" ry={lipsClosed ? 5 : lipsRounded ? 6 : 7}
    fill={passiveColor}
    stroke={(lipsClosed || lipsRounded || isLabiodental) ? activeColor : '#D5A677'}
    stroke-width={(lipsClosed || lipsRounded || isLabiodental) ? 2.5 : 1.5}
    class:active={lipsClosed || lipsRounded || isLabiodental}/>

  <!-- Lower jaw outline -->
  <path d="M 25,{95 + jawOffset} Q 30,{110 + jawOffset} 50,{115 + jawOffset}
           Q 80,{118 + jawOffset} 110,{115 + jawOffset} Q 140,{110 + jawOffset} 150,{100 + jawOffset}"
    fill="none" stroke="#D5A677" stroke-width="1" opacity="0.4"/>

  <!-- TONGUE (the star of the show) -->
  <!-- Tongue body - bezier curve from back to tip -->
  <path d="M 145,{tongueBodyY + 15}
           Q {tongueBodyX + 30},{tongueBodyY} {tongueBodyX},{tongueBodyY - 5}
           Q {(tongueBodyX + tongueTipX) / 2},{(tongueBodyY + tongueTipY) / 2 - 10} {tongueTipX},{tongueTipY}
           Q {tongueTipX - 5},{tongueTipY + 8} {tongueTipX + 5},{tongueTipY + 15}
           Q {tongueBodyX},{tongueBodyY + 25} 145,{tongueBodyY + 30} Z"
    fill="url(#tongueGrad)" stroke={activeColor} stroke-width="2"
    class="tongue"/>

  <!-- Tongue tip highlight -->
  <circle cx={tongueTipX} cy={tongueTipY} r="4"
    fill="#C0392B" opacity="0.6" class="tongue-tip"/>

  <!-- Alveolar ridge marker (reference point) -->
  <circle cx="52" cy="52" r="2.5" fill="#D5A677" opacity="0.6"/>

  <!-- AIRFLOW INDICATORS -->
  {#if airflow === 'continuous' && !velumOpen}
    <!-- Oral airflow -->
    <path d="M {tongueTipX - 5},{tongueTipY - 8} Q 25,{tongueTipY - 15} 10,{tongueTipY - 10}"
      fill="none" stroke="#3498DB" stroke-width="1.5" stroke-dasharray="3,3"
      marker-end="url(#arrowhead)" opacity="0.6" class="airflow"/>
  {/if}
  {#if airflow === 'burst'}
    <!-- Burst airflow -->
    <line x1="25" y1="75" x2="5" y2="72"
      stroke="#3498DB" stroke-width="2" stroke-dasharray="2,2"
      marker-end="url(#arrowhead)" opacity="0.7" class="airflow burst"/>
    <line x1="25" y1="78" x2="5" y2="80"
      stroke="#3498DB" stroke-width="2" stroke-dasharray="2,2"
      marker-end="url(#arrowhead)" opacity="0.5" class="airflow burst"/>
  {/if}
  {#if velumOpen}
    <!-- Nasal airflow -->
    <path d="M 140,{velumY - 5} Q 120,32 90,25 Q 60,20 35,25"
      fill="none" stroke="#9B59B6" stroke-width="1.5" stroke-dasharray="3,3"
      marker-end="url(#arrowhead)" opacity="0.6" class="airflow nasal"/>
  {/if}
  {#if airflow === 'lateral'}
    <!-- Lateral airflow (sides of tongue) -->
    <path d="M {tongueBodyX},{tongueBodyY + 15} Q {tongueBodyX - 20},{tongueBodyY + 5} {tongueTipX},{tongueTipY - 5}"
      fill="none" stroke="#E67E22" stroke-width="1.5" stroke-dasharray="2,3"
      marker-end="url(#arrowhead)" opacity="0.6" class="airflow"/>
  {/if}

  <!-- VOICING INDICATOR -->
  {#if voiced}
    <g class="voicing-indicator">
      <!-- Larynx area with vibration lines -->
      <line x1="150" y1="158" x2="158" y2="158" stroke="#E74C3C" stroke-width="1.5"/>
      <line x1="148" y1="162" x2="160" y2="162" stroke="#E74C3C" stroke-width="1.5"/>
      <line x1="150" y1="166" x2="158" y2="166" stroke="#E74C3C" stroke-width="1.5"/>
      <text x="154" y="178" text-anchor="middle" font-size="7" fill="#E74C3C" font-weight="bold">~</text>
    </g>
  {/if}

  <!-- IPA symbol overlay -->
  {#if sound}
    <text x="170" y="25" text-anchor="middle" font-size="18" font-weight="bold"
      fill="#2C3E50" font-family="serif">/{sound.ipa}/</text>
  {/if}
</svg>

<style>
  .mouth-svg {
    width: 100%;
    max-width: 320px;
    height: auto;
    border-radius: 16px;
    background: #FFF9F0;
    border: 2px solid #E8D5C4;
  }

  .tongue {
    transition: d 0.4s ease-in-out;
  }

  .tongue-tip {
    transition: cx 0.4s ease-in-out, cy 0.4s ease-in-out;
  }

  .velum {
    transition: d 0.3s ease-in-out;
  }

  .active {
    filter: drop-shadow(0 0 3px rgba(231, 76, 60, 0.5));
  }

  .airflow {
    animation: flow 1.5s ease-in-out infinite;
  }

  .airflow.burst {
    animation: burst 0.8s ease-out infinite;
  }

  .voicing-indicator {
    animation: vibrate 0.15s ease-in-out infinite alternate;
  }

  @keyframes flow {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -12; }
  }

  @keyframes burst {
    0% { opacity: 0.8; }
    50% { opacity: 0.3; }
    100% { opacity: 0.8; }
  }

  @keyframes vibrate {
    0% { transform: translateX(-0.5px); }
    100% { transform: translateX(0.5px); }
  }

  @media (prefers-color-scheme: dark) {
    .mouth-svg {
      background: #2C2416;
      border-color: #5C4A38;
    }
  }
</style>
