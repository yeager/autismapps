<script>
  import { base } from '$app/paths';
  import { speak } from '$lib/tts';
  import { pick } from '$lib/i18n';
  import { TRAFFIC_SAFETY_PICTOGRAM_REVISION } from '$lib/data/pictogram-cache.js';

  /** @typedef {{ id: string, nameKey?: string, descriptionKey?: string, name?: Partial<Record<string, string>>, description?: Partial<Record<string, string>>, image?: string, svg?: string, color: string }} RoadSign */

  let { i18n = {}, lang = 'en', onback } = $props();

  let currentMode = $state('overview'); // 'overview', 'flashcard', 'quiz'
  let currentSignIndex = $state(0);
  let score = $state(0);
  /** @type {RoadSign[]} */
  let quizAnswers = $state([]);

  // Swedish signs (also used for English)
  /** @type {RoadSign[]} */
  const SIGNS_SE = [
    {
      id: 'stop',
      nameKey: 'road-signs.stop',
      descriptionKey: 'road-signs.stop-description',
      image: '/pictograms/traffic-safety/signs/stop-7169a31e6a62.png',
      color: '#FF0000'
    },
    {
      id: 'crosswalk',
      nameKey: 'road-signs.crosswalk',
      descriptionKey: 'road-signs.crosswalk-description',
      image: '/pictograms/traffic-safety/signs/crosswalk-524d4aa3821f.png',
      color: '#0066CC'
    },
    {
      id: 'warning',
      nameKey: 'road-signs.warning',
      descriptionKey: 'road-signs.warning-description',
      image: '/pictograms/traffic-safety/signs/warning-cd892013e3e6.png',
      color: '#FFCC00'
    },
    {
      id: 'bicycle-path',
      nameKey: 'road-signs.bicycle-path',
      descriptionKey: 'road-signs.bicycle-path-description',
      image: '/pictograms/traffic-safety/signs/bicycle-path-8bca5059f214.png',
      color: '#0066CC'
    },
    {
      id: 'children-warning',
      nameKey: 'road-signs.children-warning',
      descriptionKey: 'road-signs.children-warning-description',
      image: '/pictograms/traffic-safety/signs/children-warning-23b257e8e23b.png',
      color: '#E5323B'
    },
    {
      id: 'speed-limit',
      nameKey: 'road-signs.speed-limit',
      descriptionKey: 'road-signs.speed-limit-description',
      image: '/pictograms/traffic-safety/signs/speed-limit-30-56cff9b2500f.png',
      color: '#FF0000'
    }
  ];

  // Brazilian signs (Código de Trânsito Brasileiro / CONTRAN).
  // Texts are inline (pt_BR only): the dictionaries mirror en.json, which has no keys for these signs.
  /** @type {RoadSign[]} */
  const SIGNS_BR = [
    {
      id: 'pare',
      name: { pt_BR: 'Parada obrigatória (PARE)' },
      description: { pt_BR: 'O carro precisa parar totalmente antes de seguir' },
      svg: `<svg width="120" height="120" viewBox="0 0 120 120">
        <polygon points="35,10 85,10 110,35 110,85 85,110 35,110 10,85 10,35" fill="#C8102E" stroke="#FFFFFF" stroke-width="4"/>
        <text x="60" y="70" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="white" text-anchor="middle">PARE</text>
      </svg>`,
      color: '#C8102E'
    },
    {
      id: 'pedestrian-crossing',
      name: { pt_BR: 'Passagem de pedestres' },
      description: { pt_BR: 'Aqui tem faixa: é o lugar certo para atravessar a rua' },
      svg: `<svg width="120" height="120" viewBox="0 0 120 120">
        <polygon points="60,6 114,60 60,114 6,60" fill="#FFCC00" stroke="#000000" stroke-width="4"/>
        <circle cx="60" cy="34" r="7" fill="#000"/>
        <path d="M60 42 L56 66 M58 50 L46 58 M58 50 L72 56 M56 66 L46 86 M56 66 L68 86" stroke="#000" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M34 92 H86" stroke="#000" stroke-width="3" stroke-dasharray="6 4"/>
      </svg>`,
      color: '#FFCC00'
    },
    {
      id: 'school-zone',
      name: { pt_BR: 'Área escolar' },
      description: { pt_BR: 'Tem escola perto. Os carros devem ir devagar' },
      svg: `<svg width="120" height="120" viewBox="0 0 120 120">
        <polygon points="60,6 114,60 60,114 6,60" fill="#FFCC00" stroke="#000000" stroke-width="4"/>
        <circle cx="48" cy="38" r="6" fill="#000"/><circle cx="72" cy="44" r="5" fill="#000"/>
        <path d="M48 45 L46 66 M46 66 L40 82 M46 66 L52 82 M48 52 L38 60 M48 52 L60 58" stroke="#000" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M72 50 L72 68 M72 68 L66 82 M72 68 L78 82 M72 56 L62 60 M72 56 L82 62" stroke="#000" stroke-width="4" stroke-linecap="round" fill="none"/>
      </svg>`,
      color: '#FFCC00'
    },
    {
      id: 'traffic-light-ahead',
      name: { pt_BR: 'Semáforo à frente' },
      description: { pt_BR: 'Logo à frente tem um semáforo. Preste atenção na luz' },
      svg: `<svg width="120" height="120" viewBox="0 0 120 120">
        <polygon points="60,6 114,60 60,114 6,60" fill="#FFCC00" stroke="#000000" stroke-width="4"/>
        <rect x="48" y="28" width="24" height="62" rx="6" fill="#000"/>
        <circle cx="60" cy="40" r="7" fill="#E74C3C"/><circle cx="60" cy="59" r="7" fill="#F1C40F"/><circle cx="60" cy="78" r="7" fill="#27AE60"/>
      </svg>`,
      color: '#FFCC00'
    },
    {
      id: 'bike-only',
      name: { pt_BR: 'Ciclovia' },
      description: { pt_BR: 'Caminho só para bicicletas' },
      svg: `<svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="#FFFFFF" stroke="#C8102E" stroke-width="9"/>
        <circle cx="40" cy="72" r="12" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="80" cy="72" r="12" fill="none" stroke="#000" stroke-width="3"/>
        <path d="M40 72 L54 50 L70 50 L80 72 M54 50 L62 72 L70 50 M50 44 H60" stroke="#000" stroke-width="3" fill="none" stroke-linejoin="round"/>
      </svg>`,
      color: '#C8102E'
    },
    {
      id: 'speed-limit',
      name: { pt_BR: 'Velocidade máxima 30' },
      description: { pt_BR: 'Os carros não podem passar de 30 km/h' },
      svg: `<svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="#FFFFFF" stroke="#C8102E" stroke-width="9"/>
        <text x="60" y="68" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="black" text-anchor="middle">30</text>
        <text x="60" y="88" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="black" text-anchor="middle">km/h</text>
      </svg>`,
      color: '#C8102E'
    }
  ];

  // Sign set per culture; unknown locales fall back to the en (Swedish-sign) set.
  /** @type {RoadSign[]} */
  const signs = $derived(pick({ sv: SIGNS_SE, en: SIGNS_SE, pt_BR: SIGNS_BR }, lang));

  /** @param {string} key */
  function getI18nValue(key) {
    /** @type {any} */
    let value = i18n;
    for (const segment of key.split('.')) value = value?.[segment];
    return typeof value === 'string' ? value : key;
  }

  /** @param {RoadSign} sign */
  function signName(sign) {
    return sign.nameKey ? getI18nValue(sign.nameKey) : pick(sign.name ?? {}, lang);
  }

  /** @param {RoadSign} sign */
  function signDescription(sign) {
    return sign.descriptionKey ? getI18nValue(sign.descriptionKey) : pick(sign.description ?? {}, lang);
  }

  /** @param {RoadSign} sign */
  function signImage(sign) {
    return sign.image ? `${base}${sign.image}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}` : '';
  }

  /** @param {number} index */
  function showSign(index) {
    currentSignIndex = index;
    currentMode = 'flashcard';
    const sign = signs[index];
    speak(`${signName(sign)}. ${signDescription(sign)}`);
  }

  function startQuiz() {
    currentMode = 'quiz';
    score = 0;
    quizAnswers = [];
    generateQuizQuestion();
  }

  function generateQuizQuestion() {
    // Randomize signs and create multiple choice
    const correctSign = signs[Math.floor(Math.random() * signs.length)];
    const wrongSigns = signs.filter(s => s.id !== correctSign.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    quizAnswers = [correctSign, ...wrongSigns].sort(() => Math.random() - 0.5);
    currentSignIndex = signs.findIndex(s => s.id === correctSign.id);
  }

  /** @param {RoadSign} selectedSign */
  function handleQuizAnswer(selectedSign) {
    const correctSign = signs[currentSignIndex];
    if (selectedSign.id === correctSign.id) {
      score++;
      speak(getI18nValue('common.excellent'));
    } else {
      speak(`${getI18nValue('traffic-lights.try-again')}. ${signName(correctSign)}`);
    }
    
    setTimeout(() => {
      generateQuizQuestion();
    }, 2000);
  }

  function goBack() {
    currentMode = 'overview';
  }
</script>

<div class="road-signs-container">
  <header class="activity-header">
    <button class="back-button" onclick={onback}>
      ← {getI18nValue('common.back')}
    </button>
    <h1>🚧 {getI18nValue('road-signs.title')}</h1>
  </header>

  <div class="road-signs-content">
    {#if currentMode === 'overview'}
      <!-- Signs overview -->
      <div class="overview-section">
        <div class="mode-buttons">
          <button class="mode-button" onclick={startQuiz}>
            {getI18nValue('road-signs.match')}
          </button>
        </div>

        <div class="signs-grid">
          {#each signs as sign, index}
            <button 
              class="sign-card"
              onclick={() => showSign(index)}
            >
              <div class="sign-icon">
                {#if sign.image}
                  <img src={signImage(sign)} alt="" aria-hidden="true" />
                {:else}
                  {@html sign.svg ?? ''}
                {/if}
              </div>
              <div class="sign-name">{signName(sign)}</div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    {#if currentMode === 'flashcard'}
      <!-- Individual sign display -->
      <div class="flashcard-section">
        <div class="flashcard">
          <div class="sign-display">
            {#if signs[currentSignIndex].image}
              <img src={signImage(signs[currentSignIndex])} alt="" aria-hidden="true" />
            {:else}
              {@html signs[currentSignIndex].svg ?? ''}
            {/if}
          </div>
          
          <div class="sign-info">
            <h2>{signName(signs[currentSignIndex])}</h2>
            <p>{signDescription(signs[currentSignIndex])}</p>
          </div>
          
          <div class="navigation">
            <button 
              class="nav-button" 
              onclick={() => showSign(currentSignIndex === 0 ? signs.length - 1 : currentSignIndex - 1)}
              disabled={signs.length <= 1}
            >
              ← {getI18nValue('road-signs.previous')}
            </button>
            <button class="nav-button back" onclick={goBack}>
              {getI18nValue('road-signs.back-to-overview')}
            </button>
            <button 
              class="nav-button" 
              onclick={() => showSign(currentSignIndex === signs.length - 1 ? 0 : currentSignIndex + 1)}
              disabled={signs.length <= 1}
            >
              {getI18nValue('road-signs.next')} →
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if currentMode === 'quiz'}
      <!-- Quiz mode -->
      <div class="quiz-section">
        <div class="quiz-header">
          <h2>{getI18nValue('road-signs.what-does-this-mean')}</h2>
          <div class="score">{getI18nValue('road-signs.score')}: {score}</div>
        </div>
        
        <div class="quiz-sign">
          {#if signs[currentSignIndex].image}
            <img src={signImage(signs[currentSignIndex])} alt="" aria-hidden="true" />
          {:else}
            {@html signs[currentSignIndex].svg ?? ''}
          {/if}
        </div>
        
        <div class="quiz-options">
          {#each quizAnswers as option}
            <button 
              class="quiz-option"
              onclick={() => handleQuizAnswer(option)}
            >
              {signName(option)}
            </button>
          {/each}
        </div>
        
        <button class="back-quiz-button" onclick={goBack}>
          {getI18nValue('road-signs.end-quiz')}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .road-signs-container {
    min-height: calc(100dvh - var(--header-h));
    background: linear-gradient(135deg, #FFF3E0 0%, #E8F5E8 50%, #F3E5F5 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .activity-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .back-button {
    background: #2196F3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .back-button:hover {
    background: #1976D2;
  }

  .activity-header h1 {
    font-size: 32px;
    color: #2E7D32;
    margin: 0;
    font-weight: bold;
  }

  .road-signs-content {
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .overview-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .mode-buttons {
    text-align: center;
    margin-bottom: 2rem;
  }

  .mode-button {
    background: #FF9800;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
    margin: 0 0.5rem;
  }

  .mode-button:hover {
    background: #F57C00;
    transform: translateY(-2px);
  }

  .signs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .sign-card {
    background: white;
    border: 3px solid #ddd;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-width: 44px;
  }

  .sign-card:hover {
    border-color: #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .sign-icon {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .sign-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-top: 1rem;
  }

  .flashcard-section {
    display: flex;
    justify-content: center;
  }

  .flashcard {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 600px;
    width: 100%;
  }

  .sign-display {
    width: 200px;
    height: 200px;
    margin: 0 auto 2rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 16px;
  }

  .sign-display img,
  .quiz-sign img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .sign-info h2 {
    font-size: 32px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
  }

  .sign-info p {
    font-size: 20px;
    color: #666;
    line-height: 1.5;
    margin: 0 0 2rem 0;
  }

  .navigation {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .nav-button:hover {
    background: #45A049;
  }

  .nav-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .nav-button.back {
    background: #9E9E9E;
  }

  .nav-button.back:hover {
    background: #757575;
  }

  .quiz-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .quiz-header h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0;
  }

  .score {
    font-size: 24px;
    font-weight: bold;
    color: #FF9800;
    background: #FFF3E0;
    padding: 8px 16px;
    border-radius: 20px;
  }

  .quiz-sign {
    width: 150px;
    height: 150px;
    margin: 0 auto 2rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 16px;
  }

  .quiz-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .quiz-option {
    background: #E3F2FD;
    color: #1565C0;
    border: 2px solid #2196F3;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .quiz-option:hover {
    background: #2196F3;
    color: white;
    transform: translateY(-2px);
  }

  .back-quiz-button {
    background: #9E9E9E;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .back-quiz-button:hover {
    background: #757575;
  }

  @media (min-width: 769px) and (max-height: 800px) {
    .road-signs-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 56px; padding: 6px 16px; }
    .activity-header h1 { font-size: 24px; }
    .back-button { padding: 8px 16px; }
    .road-signs-content { flex: 1; min-height: 0; width: 100%; max-width: none; padding: 8px 16px; }
    .overview-section, .flashcard, .quiz-section { height: 100%; padding: 12px; }
    .mode-buttons { margin-bottom: 8px; }
    .mode-button { padding: 8px 18px; font-size: 16px; }
    .signs-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .sign-card { min-height: 0; height: 150px; padding: 8px; gap: 4px; }
    .sign-icon { width: 72px; height: 72px; }
    .quiz-header { margin-bottom: 8px; }
    .quiz-sign { width: 100px; height: 100px; }
    .quiz-options { gap: 8px; }
    .quiz-option { min-height: 48px; padding: 8px; }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .road-signs-content {
      padding: 1rem;
    }
    
    .activity-header {
      padding: 1rem;
    }
    
    .activity-header h1 {
      font-size: 24px;
    }
    
    .signs-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
    
    .sign-card {
      min-height: 180px;
      padding: 1rem;
    }
    
    .sign-icon {
      width: 80px;
      height: 80px;
    }
    
    .sign-display {
      width: 120px;
      height: 120px;
    }
    
    .quiz-sign {
      width: 100px;
      height: 100px;
    }
    
    .navigation {
      flex-direction: column;
      align-items: center;
    }
    
    .quiz-options {
      grid-template-columns: 1fr;
    }
    
    .quiz-header {
      flex-direction: column;
      gap: 1rem;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .overview-section, .flashcard, .quiz-section {
      border: 2px solid #000;
    }
    
    .sign-card {
      border-color: #000;
    }
    
    .sign-card:hover {
      border-color: #000;
      background: #f0f0f0;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .mode-button:hover, .sign-card:hover, .quiz-option:hover {
      transform: none;
    }
  }

  /* Ensure minimum font sizes for accessibility */
  * {
    font-size: max(16px, 1em);
  }

  @media (max-width: 768px) {
    .road-signs-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 52px; gap: 8px; padding: 6px 10px; }
    .activity-header h1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 19px; }
    .back-button { padding: 8px 10px; font-size: 15px; }
    .road-signs-content { flex: 1; min-height: 0; width: 100%; padding: 6px 8px; }
    .overview-section, .flashcard, .quiz-section { height: 100%; min-height: 0; padding: 8px; }
    .mode-buttons { margin: 0 0 6px; }
    .mode-button { padding: 7px 12px; font-size: 15px; }
    .signs-grid { height: calc(100% - 48px); grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .sign-card { height: auto; min-height: 0; justify-content: center; padding: 5px; gap: 8px; }
    .sign-icon { width: min(100%, 72px); height: 72px; flex: 0 0 72px; }
    .sign-icon :global(svg) { max-width: 100%; max-height: 100%; }
    .sign-name { margin: 0; overflow-wrap: normal; word-break: normal; hyphens: auto; font-size: 13px; line-height: 1.15; }
    .flashcard-section { height: 100%; align-items: stretch; }
    .flashcard { display: flex; flex-direction: column; justify-content: center; gap: 8px; }
    .sign-display { width: 100px; height: 100px; }
    .sign-info h2 { margin: 4px 0; font-size: 22px; }
    .sign-info p { margin: 0; font-size: 15px; }
    .navigation { display: flex; flex-direction: row; justify-content: center; gap: 6px; margin-top: 6px; }
    .nav-button, .back-quiz-button { min-height: 44px; padding: 7px 9px; font-size: 14px; }
    .quiz-header { flex-direction: row; gap: 6px; margin: 0 0 6px; }
    .quiz-header h2 { font-size: 18px; }
    .quiz-sign { width: 78px; height: 78px; }
    .quiz-options { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .quiz-option { min-height: 44px; padding: 6px; font-size: 14px; }
    .back-quiz-button { margin-top: 6px; }
  }
</style>
