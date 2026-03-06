<!--
  LipView.svelte — Front view of face showing lip shape.
  Simplified child-friendly face with animated lip positions.
-->
<script>
  /** @type {import('$lib/data/mouth-sounds').sounds[0] | null} */
  export let sound = null;

  // Lip shape parameters
  $: lipOpen = sound ? sound.lipOpen : 0.3;
  $: lipRound = sound ? sound.lipRound : 0;

  // Mouth opening height (0 = closed, 1 = wide open)
  $: mouthHeight = lipOpen * 30;

  // Mouth width (rounded = narrow, spread = wide)
  $: mouthWidth = lipRound > 0.5 ? 12 + (1 - lipRound) * 15 : 18 + (1 - lipRound) * 10;

  // Lip thickness
  $: lipThickness = lipRound > 0.5 ? 5 : 3;

  // Whether lips are closed/touching
  $: lipsClosed = sound?.lips === 'closed';

  // Special: labiodental (lower lip touches upper teeth)
  $: isLabiodental = sound?.special === 'labiodental';

  // Active color
  $: activeColor = '#E74C3C';
</script>

<svg viewBox="0 0 120 140" class="lip-svg" xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label={sound ? `Front view of lips for sound ${sound.symbol}` : 'Front view of lips'}>

  <!-- Face outline -->
  <ellipse cx="60" cy="68" rx="48" ry="58" fill="#FDEBD0" stroke="#D5A677" stroke-width="1.5"/>

  <!-- Eyes -->
  <ellipse cx="42" cy="45" rx="7" ry="5" fill="white" stroke="#888" stroke-width="0.8"/>
  <circle cx="42" cy="45" r="3" fill="#5D4E37"/>
  <circle cx="42" cy="44" r="1" fill="white"/>

  <ellipse cx="78" cy="45" rx="7" ry="5" fill="white" stroke="#888" stroke-width="0.8"/>
  <circle cx="78" cy="45" r="3" fill="#5D4E37"/>
  <circle cx="78" cy="44" r="1" fill="white"/>

  <!-- Nose -->
  <ellipse cx="60" cy="67" rx="5" ry="4" fill="#F0D0A0" stroke="#D5A677" stroke-width="0.8"/>

  <!-- Mouth area -->
  <g class="mouth-area">
    {#if lipsClosed}
      <!-- Closed lips (b, p, m) -->
      <line x1={60 - mouthWidth} y1="88" x2={60 + mouthWidth} y2="88"
        stroke={activeColor} stroke-width="3.5" stroke-linecap="round"/>
      <!-- Slight lip outline -->
      <path d="M {60 - mouthWidth},88 Q 60,85 {60 + mouthWidth},88"
        fill="none" stroke="#D5A677" stroke-width="1" opacity="0.5"/>
      <path d="M {60 - mouthWidth},88 Q 60,91 {60 + mouthWidth},88"
        fill="none" stroke="#D5A677" stroke-width="1" opacity="0.5"/>

    {:else if isLabiodental}
      <!-- Labiodental (f, v): lower lip touches upper teeth -->
      <!-- Upper teeth visible -->
      <rect x={60 - mouthWidth + 2} y="84" width={(mouthWidth - 2) * 2} height="5" rx="1"
        fill="white" stroke="#ccc" stroke-width="0.5"/>
      <!-- Lower lip tucked under teeth -->
      <path d="M {60 - mouthWidth},89 Q 60,{89 + mouthHeight * 0.5} {60 + mouthWidth},89"
        fill="#E88B8B" stroke={activeColor} stroke-width="2"/>
      <!-- Mouth opening -->
      <ellipse cx="60" cy="88" rx={mouthWidth} ry={Math.max(mouthHeight * 0.5, 2)}
        fill="#8B2020" opacity="0.5"/>

    {:else}
      <!-- Open mouth with variable shape -->
      <!-- Dark mouth interior -->
      <ellipse cx="60" cy={88 + mouthHeight * 0.3} rx={mouthWidth} ry={Math.max(mouthHeight, 2)}
        fill="#5C1A1A"/>

      <!-- Upper lip -->
      <path d="M {60 - mouthWidth - 2},{88 - mouthHeight * 0.2}
               Q {60 - mouthWidth * 0.5},{88 - mouthHeight * 0.5 - lipThickness}
               60,{88 - mouthHeight * 0.6 - lipThickness}
               Q {60 + mouthWidth * 0.5},{88 - mouthHeight * 0.5 - lipThickness}
               {60 + mouthWidth + 2},{88 - mouthHeight * 0.2}
               Q {60 + mouthWidth * 0.5},{88 - mouthHeight * 0.3}
               60,{88 - mouthHeight * 0.4}
               Q {60 - mouthWidth * 0.5},{88 - mouthHeight * 0.3}
               {60 - mouthWidth - 2},{88 - mouthHeight * 0.2} Z"
        fill="#E88B8B" stroke={(lipRound > 0.3) ? activeColor : '#C47070'}
        stroke-width={(lipRound > 0.3) ? 2 : 1}/>

      <!-- Lower lip -->
      <path d="M {60 - mouthWidth - 2},{88 + mouthHeight * 0.4}
               Q {60 - mouthWidth * 0.5},{88 + mouthHeight * 0.6}
               60,{88 + mouthHeight * 0.8 + lipThickness}
               Q {60 + mouthWidth * 0.5},{88 + mouthHeight * 0.6}
               {60 + mouthWidth + 2},{88 + mouthHeight * 0.4}
               Q {60 + mouthWidth * 0.5},{88 + mouthHeight * 0.5}
               60,{88 + mouthHeight * 0.5}
               Q {60 - mouthWidth * 0.5},{88 + mouthHeight * 0.5}
               {60 - mouthWidth - 2},{88 + mouthHeight * 0.4} Z"
        fill="#E88B8B" stroke={(lipRound > 0.3) ? activeColor : '#C47070'}
        stroke-width={(lipRound > 0.3) ? 2 : 1}/>

      <!-- Teeth hint for open mouth -->
      {#if mouthHeight > 8}
        <rect x={60 - mouthWidth + 4} y={88 - mouthHeight * 0.3} width={(mouthWidth - 4) * 2} height="4" rx="1"
          fill="white" stroke="#ddd" stroke-width="0.3" opacity="0.8"/>
      {/if}

      <!-- Tongue hint for wide open -->
      {#if mouthHeight > 15}
        <ellipse cx="60" cy={88 + mouthHeight * 0.5} rx={mouthWidth * 0.6} ry={mouthHeight * 0.25}
          fill="#D35656" opacity="0.6"/>
      {/if}
    {/if}
  </g>

  <!-- Cheeks (blush) -->
  <circle cx="28" cy="78" r="8" fill="#F5B7B1" opacity="0.3"/>
  <circle cx="92" cy="78" r="8" fill="#F5B7B1" opacity="0.3"/>

  <!-- Sound symbol -->
  {#if sound}
    <text x="60" y="132" text-anchor="middle" font-size="14" font-weight="bold"
      fill="#2C3E50">{sound.symbol}</text>
  {/if}
</svg>

<style>
  .lip-svg {
    width: 100%;
    max-width: 160px;
    height: auto;
    border-radius: 16px;
    background: #FFF9F0;
    border: 2px solid #E8D5C4;
  }

  .mouth-area {
    transition: all 0.4s ease-in-out;
  }

  @media (prefers-color-scheme: dark) {
    .lip-svg {
      background: #2C2416;
      border-color: #5C4A38;
    }
  }
</style>
