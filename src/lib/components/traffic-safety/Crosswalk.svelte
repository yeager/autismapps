<script lang="ts">
  import { speak } from '$lib/tts';
  import { piktaliTrafficPictogramUrl } from '$lib/piktali/pictograms';

  type TranslationData = Record<string, any>;
  let { i18n = {}, onback = () => {} } = $props<{ i18n?: TranslationData; onback?: () => void }>();

  let currentStep = $state(0);
  let isPracticeMode = $state(false);
  let carVisible = $state(false);
  let score = $state(0);
  let quizMode = $state(false);

  const steps = [
    { key: 'step1', action: 'stop' },
    { key: 'step2', action: 'lookLeft' },
    { key: 'step3', action: 'lookRight' },
    { key: 'step4', action: 'lookLeft' },
    { key: 'step5', action: 'walk' }
  ];
  const pedestrianPictogram = piktaliTrafficPictogramUrl('walk');
  const carPictogram = piktaliTrafficPictogramUrl('car');

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

  function startPractice() {
    isPracticeMode = true;
    currentStep = 0;
    carVisible = Math.random() > 0.5; // Random car presence
    speak(getI18nValue('crosswalk.practice'));
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      const stepText = getI18nValue(`crosswalk.${steps[currentStep].key}`);
      speak(stepText);
    } else {
      // Practice complete
      isPracticeMode = false;
      quizMode = true;
      carVisible = Math.random() > 0.5;
      speak(getI18nValue('crosswalk.safe-to-cross'));
    }
  }

  function handleQuizAnswer(isSafe: boolean) {
    const correctAnswer = !carVisible; // Safe when no car
    if (isSafe === correctAnswer) {
      score++;
      speak(getI18nValue('common.excellent'));
    } else {
      speak(getI18nValue('traffic-lights.try-again'));
    }
    
    // Reset for next round
    setTimeout(() => {
      carVisible = Math.random() > 0.5;
    }, 2000);
  }

  function reset() {
    isPracticeMode = false;
    quizMode = false;
    currentStep = 0;
    carVisible = false;
    score = 0;
  }
</script>

<div class="crosswalk-container">
  <header class="activity-header">
    <button class="back-button" onclick={onback}>
      ← {getI18nValue('common.back')}
    </button>
    <h1>🚶 {getI18nValue('crosswalk.title')}</h1>
  </header>

  <div class="crosswalk-content">
    {#if !isPracticeMode && !quizMode}
      <!-- Main menu -->
      <div class="menu-section">
        <div class="steps-overview">
          <h2>{getI18nValue('crosswalk.directions-title')}</h2>
          <ol class="steps-list">
            {#each steps as step, index}
              <li class="step-item">
                <span class="step-number">{index + 1}</span>
                <span class="step-text">{getI18nValue(`crosswalk.${step.key}`)}</span>
              </li>
            {/each}
          </ol>
        </div>
        
        <div class="action-buttons">
          <button class="practice-button" onclick={startPractice}>
            {getI18nValue('crosswalk.practice')}
          </button>
        </div>
      </div>
    {/if}

    {#if isPracticeMode}
      <!-- Practice mode -->
      <div class="practice-section">
        <div class="street-view">
          <div class="sidewalk left">
            <div class="character {currentStep >= 4 ? 'walking' : 'waiting'}">
              {#if pedestrianPictogram}<img class="character-image" src={pedestrianPictogram} alt="" aria-hidden="true" />{/if}
            </div>
          </div>
          
          <div class="road">
            <div class="crosswalk-lines"></div>
            {#if carVisible && currentStep < 4}
              <div class="car">{#if carPictogram}<img class="car-image" src={carPictogram} alt="" aria-hidden="true" />{/if}</div>
            {/if}
          </div>
          
          <div class="sidewalk right"></div>
        </div>

        <div class="step-display">
          <div class="current-step">
            <h3>{getI18nValue(`crosswalk.${steps[currentStep].key}`)}</h3>
              <div class="step-indicator">
                {formatMessage('crosswalk.step-progress', { current: currentStep + 1, total: steps.length })}
              </div>
          </div>

          <button class="next-button" onclick={nextStep}>
            {currentStep < steps.length - 1 ? getI18nValue('crosswalk.next-step') : getI18nValue('crosswalk.finish')}
          </button>
        </div>
      </div>
    {/if}

    {#if quizMode}
      <!-- Quiz mode -->
      <div class="quiz-section">
        <div class="street-view">
          <div class="sidewalk left">
            <div class="character waiting">
              {#if pedestrianPictogram}<img class="character-image" src={pedestrianPictogram} alt="" aria-hidden="true" />{/if}
            </div>
          </div>
          
          <div class="road">
            <div class="crosswalk-lines"></div>
            {#if carVisible}
              <div class="car">{#if carPictogram}<img class="car-image" src={carPictogram} alt="" aria-hidden="true" />{/if}</div>
            {/if}
          </div>
          
          <div class="sidewalk right"></div>
        </div>

        <div class="quiz-display">
          <h3>{getI18nValue('crosswalk.safe-to-cross')}</h3>
          <div class="quiz-buttons">
            <button 
              class="quiz-button safe" 
              onclick={() => handleQuizAnswer(true)}
            >
              ✅ {getI18nValue('crosswalk.yes')}
            </button>
            <button 
              class="quiz-button dangerous" 
              onclick={() => handleQuizAnswer(false)}
            >
              ❌ {getI18nValue('crosswalk.no')}
            </button>
          </div>
          
          <div class="score">{getI18nValue('crosswalk.score')}: {score}</div>
          
          <button class="reset-button" onclick={reset}>
            {getI18nValue('crosswalk.restart')}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .crosswalk-container {
    min-height: calc(100dvh - var(--header-h));
    background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
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

  .crosswalk-content {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .menu-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .steps-overview h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0 0 2rem 0;
  }

  .steps-list {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
    text-align: left;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin: 0.5rem 0;
    background: #f8f9fa;
    border-radius: 12px;
    font-size: 18px;
  }

  .step-number {
    background: #4CAF50;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }

  .step-text {
    flex: 1;
    line-height: 1.4;
  }

  .practice-button {
    background: #4CAF50;
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
  }

  .practice-button:hover {
    background: #45A049;
    transform: translateY(-2px);
  }

  .practice-section, .quiz-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .street-view {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .sidewalk {
    background: #D3D3D3;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .road {
    background: #2F2F2F;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .crosswalk-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 10px,
      white 10px,
      white 20px
    );
  }

  .character {
    transition: all 0.3s ease;
    z-index: 10;
    position: relative;
  }

  .character-image {
    display: block;
    width: 56px;
    height: 56px;
    object-fit: contain;
    border-radius: 8px;
  }

  .character.walking {
    animation: walk 2s ease-in-out infinite;
  }

  .character.waiting {
    animation: bob 1s ease-in-out infinite;
  }

  @keyframes walk {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(10px) scale(1.1); }
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .car {
    animation: drive 3s linear infinite;
    position: absolute;
    z-index: 5;
  }

  .car-image {
    display: block;
    width: 64px;
    height: 44px;
    object-fit: contain;
    border-radius: 8px;
  }

  @keyframes drive {
    0% { transform: translateX(-100px); }
    100% { transform: translateX(100px); }
  }

  .step-display, .quiz-display {
    text-align: center;
  }

  .current-step h3 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
  }

  .step-indicator {
    font-size: 16px;
    color: #666;
    margin-bottom: 2rem;
  }

  .next-button {
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
  }

  .next-button:hover {
    background: #F57C00;
    transform: translateY(-2px);
  }

  .quiz-display h3 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0 0 2rem 0;
  }

  .quiz-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .quiz-button {
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
    min-width: 120px;
    transition: all 0.2s ease;
  }

  .quiz-button.safe {
    background: #4CAF50;
    color: white;
  }

  .quiz-button.safe:hover {
    background: #45A049;
  }

  .quiz-button.dangerous {
    background: #F44336;
    color: white;
  }

  .quiz-button.dangerous:hover {
    background: #D32F2F;
  }

  .score {
    font-size: 24px;
    font-weight: bold;
    color: #2E7D32;
    margin: 1rem 0;
  }

  .reset-button {
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

  .reset-button:hover {
    background: #757575;
  }

  /* Mobile responsiveness */
  @media (min-width: 769px) and (max-height: 800px) {
    .crosswalk-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 56px; padding: 6px 16px; }
    .activity-header h1 { font-size: 24px; }
    .back-button { padding: 8px 16px; }
    .crosswalk-content { flex: 1; min-height: 0; width: 100%; padding: 8px 16px; }
    .menu-section, .practice-section, .quiz-section { height: 100%; padding: 12px; }
    .steps-overview h2 { margin-bottom: 8px; font-size: 22px; }
    .steps-list { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-bottom: 8px; }
    .step-item { min-height: 112px; flex-direction: column; justify-content: center; gap: 6px; padding: 8px; margin: 0; font-size: 16px; }
    .step-number { width: 28px; height: 28px; }
    .step-text { line-height: 1.25; }
    .practice-button, .next-button, .quiz-button { padding: 8px 18px; font-size: 18px; }
    .street-view { height: 150px; margin-bottom: 8px; }
    .current-step h3, .quiz-display h3 { margin: 0 0 8px; font-size: 22px; }
    .step-display { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .quiz-buttons { gap: 8px; }
    .quiz-button { min-height: 48px; }
  }

  @media (max-width: 768px) {
    .crosswalk-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 52px; gap: 8px; padding: 6px 10px; }
    .activity-header h1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 19px; }
    .back-button { padding: 8px 10px; font-size: 15px; }
    .crosswalk-content { flex: 1; min-height: 0; width: 100%; padding: 8px; }
    .menu-section, .practice-section, .quiz-section { height: 100%; min-height: 0; padding: 10px; }
    .menu-section { display: flex; flex-direction: column; justify-content: space-between; }
    .steps-overview h2 { margin: 0 0 6px; font-size: 19px; }
    .steps-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin: 0; }
    .step-item { min-width: 0; min-height: 52px; gap: 6px; padding: 6px; margin: 0; font-size: 14px; line-height: 1.2; }
    .step-number { width: 26px; height: 26px; }
    .step-text { line-height: 1.2; }
    .action-buttons { margin-top: 8px; }
    .practice-button, .next-button, .quiz-button { min-height: 44px; padding: 8px 12px; font-size: 15px; }
    .practice-section, .quiz-section { display: flex; flex-direction: column; }
    .street-view { height: auto; min-height: 130px; max-height: 260px; flex: 1 1 auto; margin: 0 0 8px; }
    .character { font-size: 30px; }
    .car { font-size: 24px; }
    .step-display { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 8px; }
    .current-step { min-width: 0; }
    .current-step h3, .quiz-display h3 { margin: 0 0 4px; font-size: 18px; }
    .step-indicator { margin: 0; font-size: 12px; }
    .quiz-display { flex: 0 0 auto; }
    .quiz-buttons { flex-direction: row; align-items: stretch; gap: 6px; margin: 6px 0; }
    .quiz-button { min-width: 0; width: 50%; }
    .score { margin: 6px 0; font-size: 18px; }
    .reset-button { min-height: 44px; padding: 8px 12px; }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .menu-section, .practice-section, .quiz-section {
      border: 2px solid #000;
    }
    
    .step-item {
      border: 1px solid #000;
    }
    
    .sidewalk {
      background: #fff;
    }
    
    .road {
      background: #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .character.walking, .character.waiting, .car {
      animation: none;
    }
    
    .practice-button:hover, .next-button:hover, .quiz-button:hover {
      transform: none;
    }
  }

  /* Ensure minimum font sizes for accessibility */
  * {
    font-size: max(16px, 1em);
  }
</style>
