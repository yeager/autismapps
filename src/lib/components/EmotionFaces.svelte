<script>
  /**
   * EmotionFaces — Simple SVG faces for emotion recognition.
   * Each face is a clean, accessible SVG with distinct expressions.
   */

  /** @type {'happy'|'sad'|'angry'|'scared'|'surprised'|'confused'|'embarrassed'|'proud'|'jealous'|'worried'|'disappointed'|'excited'} */
  export let emotion = 'happy';
  /** @type {number} */
  export let size = 80;

  /** Face color based on emotion */
  const FACE_COLORS = {
    happy: '#FFD93D',
    sad: '#74B9FF',
    angry: '#FF6B6B',
    scared: '#DDA0DD',
    surprised: '#FFB347',
    confused: '#87CEEB',
    embarrassed: '#FFB6C1',
    proud: '#FFD700',
    jealous: '#98FB98',
    worried: '#B0C4DE',
    disappointed: '#C0C0C0',
    excited: '#FF69B4',
  };

  $: color = FACE_COLORS[emotion] || '#FFD93D';
</script>

<svg
  viewBox="0 0 100 100"
  width={size}
  height={size}
  role="img"
  aria-label={emotion}
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Face circle -->
  <circle cx="50" cy="50" r="45" fill={color} stroke="#333" stroke-width="2" />

  {#if emotion === 'happy'}
    <!-- Happy: big smile, sparkly eyes -->
    <circle cx="35" cy="40" r="5" fill="#333" />
    <circle cx="65" cy="40" r="5" fill="#333" />
    <path d="M 30 58 Q 50 78 70 58" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />

  {:else if emotion === 'sad'}
    <!-- Sad: droopy eyes, frown, tear -->
    <circle cx="35" cy="42" r="4" fill="#333" />
    <circle cx="65" cy="42" r="4" fill="#333" />
    <path d="M 30 68 Q 50 52 70 68" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
    <!-- Tear -->
    <path d="M 28 46 Q 26 54 28 56" fill="#4FC3F7" stroke="none" />
    <ellipse cx="27" cy="56" rx="3" ry="2" fill="#4FC3F7" />

  {:else if emotion === 'angry'}
    <!-- Angry: angled brows, clenched mouth -->
    <line x1="25" y1="32" x2="40" y2="38" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <line x1="75" y1="32" x2="60" y2="38" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <circle cx="35" cy="43" r="4" fill="#333" />
    <circle cx="65" cy="43" r="4" fill="#333" />
    <path d="M 33 66 L 67 66" stroke="#333" stroke-width="3" stroke-linecap="round" />

  {:else if emotion === 'scared'}
    <!-- Scared: wide eyes, O mouth -->
    <ellipse cx="35" cy="40" rx="6" ry="8" fill="white" stroke="#333" stroke-width="2" />
    <circle cx="35" cy="42" r="3" fill="#333" />
    <ellipse cx="65" cy="40" rx="6" ry="8" fill="white" stroke="#333" stroke-width="2" />
    <circle cx="65" cy="42" r="3" fill="#333" />
    <ellipse cx="50" cy="65" rx="6" ry="8" fill="#333" />

  {:else if emotion === 'surprised'}
    <!-- Surprised: raised brows, wide eyes, O mouth -->
    <line x1="28" y1="28" x2="42" y2="28" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <line x1="58" y1="28" x2="72" y2="28" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <ellipse cx="35" cy="40" rx="6" ry="7" fill="white" stroke="#333" stroke-width="2" />
    <circle cx="35" cy="40" r="3" fill="#333" />
    <ellipse cx="65" cy="40" rx="6" ry="7" fill="white" stroke="#333" stroke-width="2" />
    <circle cx="65" cy="40" r="3" fill="#333" />
    <ellipse cx="50" cy="66" rx="7" ry="6" fill="#333" />

  {:else if emotion === 'confused'}
    <!-- Confused: uneven brows, squiggle mouth -->
    <line x1="26" y1="34" x2="40" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <line x1="60" y1="30" x2="74" y2="34" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <circle cx="35" cy="42" r="4" fill="#333" />
    <circle cx="65" cy="42" r="4" fill="#333" />
    <path d="M 32 64 Q 40 58 48 66 Q 56 72 66 62" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />

  {:else if emotion === 'embarrassed'}
    <!-- Embarrassed: blushing cheeks, small smile, looking down -->
    <circle cx="35" cy="42" r="4" fill="#333" />
    <circle cx="65" cy="42" r="4" fill="#333" />
    <!-- Blush circles -->
    <circle cx="25" cy="55" r="8" fill="#FF9999" opacity="0.5" />
    <circle cx="75" cy="55" r="8" fill="#FF9999" opacity="0.5" />
    <path d="M 40 63 Q 50 70 60 63" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round" />

  {:else if emotion === 'proud'}
    <!-- Proud: big smile, chest out, sparkles -->
    <circle cx="35" cy="40" r="5" fill="#333" />
    <circle cx="65" cy="40" r="5" fill="#333" />
    <path d="M 28 56 Q 50 76 72 56" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
    <!-- Star/sparkle -->
    <text x="78" y="25" font-size="14" fill="#FFA500">✨</text>

  {:else if emotion === 'jealous'}
    <!-- Jealous: sideways glance, tight mouth -->
    <circle cx="38" cy="42" r="4" fill="#333" />
    <circle cx="68" cy="42" r="4" fill="#333" />
    <line x1="25" y1="34" x2="42" y2="36" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <line x1="75" y1="34" x2="58" y2="36" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <path d="M 38 65 L 62 63" stroke="#333" stroke-width="3" stroke-linecap="round" />

  {:else if emotion === 'worried'}
    <!-- Worried: curved brows, wavy mouth -->
    <path d="M 28 32 Q 35 28 42 34" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M 58 34 Q 65 28 72 32" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
    <circle cx="35" cy="42" r="4" fill="#333" />
    <circle cx="65" cy="42" r="4" fill="#333" />
    <path d="M 35 66 Q 42 60 50 66 Q 58 72 65 66" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round" />

  {:else if emotion === 'disappointed'}
    <!-- Disappointed: droopy everything -->
    <circle cx="35" cy="42" r="4" fill="#333" />
    <circle cx="65" cy="42" r="4" fill="#333" />
    <path d="M 35 67 Q 50 58 65 67" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
    <line x1="28" y1="34" x2="42" y2="36" stroke="#333" stroke-width="2.5" stroke-linecap="round" />
    <line x1="72" y1="34" x2="58" y2="36" stroke="#333" stroke-width="2.5" stroke-linecap="round" />

  {:else if emotion === 'excited'}
    <!-- Excited: huge grin, starry eyes -->
    <text x="28" y="46" font-size="16">⭐</text>
    <text x="58" y="46" font-size="16">⭐</text>
    <path d="M 25 55 Q 50 80 75 55" stroke="#333" stroke-width="3" fill="white" stroke-linecap="round" />
  {/if}
</svg>
