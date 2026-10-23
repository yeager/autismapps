<script lang="ts">
  import { speak } from '$lib/tts';

  type TranslationData = Record<string, any>;
  type SafetyScenario = {
    id: string;
    nameKey: string;
    isSafe: boolean;
    descriptionKey: string;
    explanationKey: string;
    image: string;
    background: string;
  };
  let { i18n = {}, onback = () => {} } = $props<{ i18n?: TranslationData; onback?: () => void }>();

  let currentMode = $state('overview'); // 'overview', 'game'
  let score = $state(0);
  let lives = $state(3);
  let currentScenario = $state(0);
  let gameFinished = $state(false);

  const scenarios: SafetyScenario[] = [
    {
      id: 'sidewalk',
      nameKey: 'sidewalk',
      isSafe: true,
      descriptionKey: 'sidewalk-desc',
      explanationKey: 'sidewalk-explanation',
      image: '🚶‍➡️',
      background: '#E8F5E8'
    },
    {
      id: 'road',
      nameKey: 'road',
      isSafe: false,
      descriptionKey: 'road-desc',
      explanationKey: 'road-explanation',
      image: '🚗',
      background: '#FFEBEE'
    },
    {
      id: 'parking',
      nameKey: 'parking',
      isSafe: false,
      descriptionKey: 'parking-desc',
      explanationKey: 'parking-explanation',
      image: '🅿️',
      background: '#FFEBEE'
    },
    {
      id: 'playground',
      nameKey: 'playground',
      isSafe: true,
      descriptionKey: 'playground-desc',
      explanationKey: 'playground-explanation',
      image: '🛝',
      background: '#E8F5E8'
    },
    {
      id: 'crosswalk',
      nameKey: 'crosswalk',
      isSafe: true,
      descriptionKey: 'crosswalk-desc',
      explanationKey: 'crosswalk-explanation',
      image: '🚸',
      background: '#E8F5E8'
    },
    {
      id: 'highway',
      nameKey: 'highway',
      isSafe: false,
      descriptionKey: 'highway-desc',
      explanationKey: 'highway-explanation',
      image: '🚘',
      background: '#FFEBEE'
    },
    {
      id: 'school-zone',
      nameKey: 'school-zone',
      isSafe: true,
      descriptionKey: 'school-zone-desc',
      explanationKey: 'school-zone-explanation',
      image: '🏫',
      background: '#E8F5E8'
    },
    {
      id: 'construction',
      nameKey: 'construction',
      isSafe: false,
      descriptionKey: 'construction-desc',
      explanationKey: 'construction-explanation',
      image: '🚧',
      background: '#FFEBEE'
    }
  ];

  function getI18nValue(key: string): string {
    const value = key.split('.').reduce<any>((obj, segment) => obj?.[segment], i18n);
    return typeof value === 'string' ? value : key;
  }

  function formatMessage(key: string, values: Record<string, string | number>): string {
    return Object.entries(values).reduce(
      (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
      getI18nValue(key)
    );
  }

  function scenarioText(scenario: SafetyScenario, key: 'nameKey' | 'descriptionKey' | 'explanationKey') {
    return getI18nValue(`safe-places.${scenario[key]}`);
  }

  function startGame() {
    currentMode = 'game';
    score = 0;
    lives = 3;
    currentScenario = 0;
    gameFinished = false;
    
    // Shuffle scenarios for variety
    scenarios.sort(() => Math.random() - 0.5);
    
    speak(getI18nValue('safe-places.prompt-speech'));
  }

  function handleAnswer(userSaidSafe: boolean) {
    const scenario = scenarios[currentScenario];
    const isCorrect = userSaidSafe === scenario.isSafe;
    
    if (isCorrect) {
      score++;
      speak(`${getI18nValue('common.excellent')} ${scenarioText(scenario, 'explanationKey')}`);
    } else {
      lives--;
      speak(`${getI18nValue('traffic-lights.try-again')} ${scenarioText(scenario, 'explanationKey')}`);
    }
    
    setTimeout(() => {
      if (lives <= 0) {
        gameFinished = true;
        speak(formatMessage('safe-places.game-over-speech', { score, total: currentScenario + 1 }));
      } else if (currentScenario >= scenarios.length - 1) {
        gameFinished = true;
        speak(formatMessage('safe-places.win-speech', { score, total: scenarios.length }));
      } else {
        currentScenario++;
      }
    }, 3000);
  }

  function resetGame() {
    currentMode = 'overview';
    score = 0;
    lives = 3;
    currentScenario = 0;
    gameFinished = false;
  }

  function getStars(score: number, total: number) {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '⭐⭐⭐';
    if (percentage >= 70) return '⭐⭐';
    if (percentage >= 50) return '⭐';
    return '';
  }
</script>

<div class="safe-places-container">
  <header class="activity-header">
    <button class="back-button" onclick={onback}>
      ← {getI18nValue('common.back')}
    </button>
    <h1>🏠 {getI18nValue('safe-places.title')}</h1>
  </header>

  <div class="safe-places-content">
    {#if currentMode === 'overview'}
      <!-- Overview and instructions -->
      <div class="overview-section">
        <div class="instructions">
      <h2>{getI18nValue('safe-places.intro-title')}</h2>
          <p>
            {getI18nValue('safe-places.intro-copy')}
          </p>
          
          <div class="examples">
            <div class="example-card safe">
              <div class="example-icon" aria-hidden="true">✓</div>
              <h3>{getI18nValue('safe-places.safe')}</h3>
              <ul>{#each ['sidewalk', 'playground', 'school-zone', 'park'] as item}<li>{getI18nValue(`safe-places.${item}`)}</li>{/each}</ul>
            </div>
            
            <div class="example-card dangerous">
              <div class="example-icon" aria-hidden="true">!</div>
              <h3>{getI18nValue('safe-places.dangerous')}</h3>
              <ul>{#each ['road', 'parking', 'highway', 'construction'] as item}<li>{getI18nValue(`safe-places.${item}`)}</li>{/each}</ul>
            </div>
          </div>
        </div>
        
        <button class="start-game-button" onclick={startGame}>
          {getI18nValue('safe-places.start')}
        </button>
      </div>
    {/if}

    {#if currentMode === 'game' && !gameFinished}
      <!-- Game mode -->
      <div class="game-section">
        <div class="game-header">
          <div class="score-display">
            <span class="score">{getI18nValue('safe-places.score-label')}: {score}/{currentScenario + 1}</span>
            <span class="lives">{getI18nValue('safe-places.lives-label')}: {'❤️'.repeat(lives)}</span>
          </div>
          <div class="progress">
            {formatMessage('safe-places.question-label', { current: currentScenario + 1, total: scenarios.length })}
          </div>
        </div>
        
        <div class="scenario-card" style="background: {scenarios[currentScenario].background}">
          <div class="scenario-image">
            <div class="scenario-icon">{scenarios[currentScenario].image}</div>
          </div>
          
          <div class="scenario-info">
            <h2>{scenarioText(scenarios[currentScenario], 'nameKey')}</h2>
            <p>{getI18nValue(`safe-places.${scenarios[currentScenario].descriptionKey}`)}</p>
          </div>
        </div>
        
        <div class="question">
          <h3>{getI18nValue('safe-places.question')}</h3>
        </div>
        
        <div class="answer-buttons">
          <button 
            class="answer-button safe"
            onclick={() => handleAnswer(true)}
          >
            ✅ {getI18nValue('safe-places.safe')}
          </button>
          
          <button 
            class="answer-button dangerous"
            onclick={() => handleAnswer(false)}
          >
            ❌ {getI18nValue('safe-places.dangerous')}
          </button>
        </div>
      </div>
    {/if}

    {#if gameFinished}
      <!-- Game finished -->
      <div class="results-section">
        <div class="results-card">
          <div class="results-header">
            <h2>{getI18nValue(lives > 0 ? 'safe-places.results-success' : 'safe-places.results-over')}</h2>
            <div class="stars">{getStars(score, currentScenario + 1)}</div>
          </div>
          
          <div class="final-score">
            <div class="score-circle">
              <span class="score-number">{score}</span>
              <span class="score-total">/{currentScenario + 1}</span>
            </div>
            <p>{formatMessage('safe-places.results-score', { score, total: currentScenario + 1 })}</p>
          </div>
          
          <div class="results-message">
            {#if score === currentScenario + 1}
              <p class="perfect">{getI18nValue('safe-places.results-perfect')} 🎉</p>
            {:else if (score / (currentScenario + 1)) >= 0.8}
              <p class="excellent">{getI18nValue('safe-places.results-excellent')} 👏</p>
            {:else if (score / (currentScenario + 1)) >= 0.6}
              <p class="good">{getI18nValue('safe-places.results-good')} 👍</p>
            {:else}
              <p class="needs-practice">{getI18nValue('safe-places.results-practice')} 💪</p>
            {/if}
          </div>
          
          <div class="action-buttons">
            <button class="play-again-button" onclick={startGame}>
              {getI18nValue('safe-places.play-again')}
            </button>
            <button class="back-button-results" onclick={resetGame}>
              {getI18nValue('safe-places.back-to-start')}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .safe-places-container {
    min-height: calc(100dvh - var(--header-h));
    background: linear-gradient(135deg, #E8F5E8 0%, #FFF3E0 50%, #E3F2FD 100%);
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

  .safe-places-content {
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .overview-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .instructions h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
  }

  .instructions p {
    font-size: 18px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 2rem 0;
  }

  .examples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }

  .example-card {
    padding: 1.5rem;
    border-radius: 16px;
    text-align: left;
  }

  .example-card.safe {
    background: #E8F5E8;
    border: 2px solid #4CAF50;
  }

  .example-card.dangerous {
    background: #FFEBEE;
    border: 2px solid #F44336;
  }

  .example-icon {
    font-size: 48px;
    text-align: center;
    margin-bottom: 1rem;
  }

  .example-card h3 {
    font-size: 20px;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .example-card.safe h3 {
    color: #4CAF50;
  }

  .example-card.dangerous h3 {
    color: #F44336;
  }

  .example-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .example-card li {
    padding: 0.5rem 0;
    font-size: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .start-game-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 20px 40px;
    border-radius: 16px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
    margin-top: 2rem;
  }

  .start-game-button:hover {
    background: #45A049;
    transform: translateY(-2px);
  }

  .game-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .score-display {
    display: flex;
    gap: 1rem;
    font-size: 18px;
    font-weight: bold;
  }

  .score {
    color: #4CAF50;
  }

  .lives {
    color: #F44336;
  }

  .progress {
    font-size: 16px;
    color: #666;
  }

  .scenario-card {
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .scenario-image {
    margin-bottom: 1rem;
  }

  .scenario-icon {
    font-size: 80px;
    margin-bottom: 1rem;
  }

  .scenario-info h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0 0 0.5rem 0;
  }

  .scenario-info p {
    font-size: 18px;
    color: #666;
    margin: 0;
  }

  .question h3 {
    font-size: 24px;
    color: #2E7D32;
    text-align: center;
    margin: 0 0 2rem 0;
  }

  .answer-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .answer-button {
    border: none;
    padding: 20px 30px;
    border-radius: 16px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .answer-button.safe {
    background: #E8F5E8;
    color: #4CAF50;
    border: 3px solid #4CAF50;
  }

  .answer-button.safe:hover {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
  }

  .answer-button.dangerous {
    background: #FFEBEE;
    color: #F44336;
    border: 3px solid #F44336;
  }

  .answer-button.dangerous:hover {
    background: #F44336;
    color: white;
    transform: translateY(-2px);
  }

  .results-section {
    display: flex;
    justify-content: center;
  }

  .results-card {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
  }

  .results-header h2 {
    font-size: 32px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
  }

  .stars {
    font-size: 48px;
    margin-bottom: 2rem;
  }

  .final-score {
    margin: 2rem 0;
  }

  .score-circle {
    background: #4CAF50;
    color: white;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .score-number {
    font-size: 48px;
    font-weight: bold;
    line-height: 1;
  }

  .score-total {
    font-size: 20px;
    line-height: 1;
  }

  .results-message {
    margin: 2rem 0;
  }

  .results-message p {
    font-size: 18px;
    font-weight: bold;
    line-height: 1.5;
    padding: 1rem;
    border-radius: 12px;
    margin: 0;
  }

  .perfect {
    background: #E8F5E8;
    color: #4CAF50;
  }

  .excellent {
    background: #E3F2FD;
    color: #1976D2;
  }

  .good {
    background: #FFF3E0;
    color: #F57C00;
  }

  .needs-practice {
    background: #FFEBEE;
    color: #D32F2F;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .play-again-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .play-again-button:hover {
    background: #45A049;
    transform: translateY(-2px);
  }

  .back-button-results {
    background: #9E9E9E;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .back-button-results:hover {
    background: #757575;
    transform: translateY(-2px);
  }

  @media (min-width: 769px) and (max-height: 800px) {
    .safe-places-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 56px; padding: 6px 16px; }
    .activity-header h1 { font-size: 24px; }
    .back-button { padding: 8px 16px; }
    .safe-places-content { flex: 1; min-height: 0; width: 100%; max-width: none; padding: 8px 16px; }
    .overview-section, .game-section, .results-section { height: 100%; padding: 12px; }
    .instructions h2 { margin-bottom: 6px; font-size: 22px; }
    .instructions p { margin-bottom: 8px; font-size: 16px; line-height: 1.35; }
    .examples { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 8px 0; }
    .example-card { padding: 8px 12px; }
    .example-icon { margin-bottom: 4px; font-size: 28px; }
    .example-card h3 { margin-bottom: 4px; font-size: 17px; }
    .example-card li { padding: 3px 0; font-size: 16px; }
    .start-game-button { margin-top: 6px; padding: 8px 22px; font-size: 18px; }
    .game-header { margin-bottom: 8px; }
    .scenario-card { display: flex; align-items: center; gap: 16px; padding: 12px; }
    .scenario-icon { font-size: 72px; }
    .answer-buttons { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 8px; }
    .answer-button { min-height: 52px; padding: 8px; }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .safe-places-content {
      padding: 1rem;
    }
    
    .activity-header {
      padding: 1rem;
    }
    
    .activity-header h1 {
      font-size: 24px;
    }
    
    .examples {
      grid-template-columns: 1fr;
    }
    
    .answer-buttons {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .game-header {
      flex-direction: column;
      text-align: center;
    }
    
    .scenario-icon {
      font-size: 60px;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .overview-section, .game-section, .results-card {
      border: 2px solid #000;
    }
    
    .example-card.safe {
      border-color: #000;
      background: #fff;
    }
    
    .example-card.dangerous {
      border-color: #000;
      background: #fff;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .start-game-button:hover, .answer-button:hover, .play-again-button:hover, .back-button-results:hover {
      transform: none;
    }
  }

  /* Ensure minimum font sizes for accessibility */
  * {
    font-size: max(16px, 1em);
  }
</style>
