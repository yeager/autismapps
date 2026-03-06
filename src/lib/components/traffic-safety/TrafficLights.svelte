<script>
  import { speak } from '$lib/tts';
  import { playSuccessSound, playErrorSound } from '$lib/audio.js';
  import { getPictogram } from '$lib/data/arasaac-data.js';

  let { i18n = {} } = $props();
  
  
  let currentLight = $state('red'); // 'red', 'yellow', 'green'
  let quizMode = $state(false);
  let showFeedback = $state(false);
  let feedbackMessage = $state('');
  
  const lights = ['red', 'yellow', 'green'];
  const lightActions = {
    red: 'stop',
    yellow: 'wait', 
    green: 'go'
  };
  
  let pedestrianVisible = $derived(currentLight === 'green');
  
  function cycleLight() {
    const currentIndex = lights.indexOf(currentLight);
    const nextIndex = (currentIndex + 1) % lights.length;
    currentLight = lights[nextIndex];
    
    // Speak the current light meaning
    const meaning = getNestedValue(i18n, `traffic-lights.${currentLight}`) || currentLight;
    speak(meaning);
  }
  
  function startQuiz() {
    quizMode = true;
    const question = getNestedValue(i18n, 'traffic-lights.what-do-you-do') || 'What do you do now?';
    speak(question);
  }
  
  function handleAnswerClick(action) {
    const correctAction = lightActions[currentLight];
    const isCorrect = action === correctAction;
    
    showFeedback = true;
    
    if (isCorrect) {
      feedbackMessage = getNestedValue(i18n, 'traffic-lights.correct') || 'Correct!';
      playSuccessSound();
      speak(feedbackMessage);
    } else {
      feedbackMessage = getNestedValue(i18n, 'traffic-lights.try-again') || 'Try again';
      playErrorSound();
      speak(feedbackMessage);
    }
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      showFeedback = false;
      if (isCorrect) {
        // Cycle to next light for next question
        setTimeout(cycleLight, 500);
      }
    }, 2000);
  }
  
  function exitQuiz() {
    quizMode = false;
    showFeedback = false;
  }
  
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
</script>

<div class="traffic-lights-container">
  <div class="header">
    <h2>{getNestedValue(i18n, 'traffic-lights.title') || 'Traffic Lights'}</h2>
    <button class="back-button" onclick={() => dispatch('back')}>
      ← {getNestedValue(i18n, 'common.back') || 'Back'}
    </button>
  </div>
  
  <div class="content">
    <div class="traffic-light-section">
      <!-- Traffic Light -->
      <div class="traffic-light" onclick={cycleLight}>
        <div class="light-housing">
          <div class="light red {currentLight === 'red' ? 'active' : ''}"></div>
          <div class="light yellow {currentLight === 'yellow' ? 'active' : ''}"></div>
          <div class="light green {currentLight === 'green' ? 'active' : ''}"></div>
        </div>
        <div class="light-pole"></div>
      </div>
      
      <!-- Instructions -->
      <div class="instructions">
        {#if !quizMode}
          <p class="tap-instruction">
            {getNestedValue(i18n, 'traffic-lights.tap-light') || 'Tap the light to change it'}
          </p>
          
          <div class="light-meanings">
            <div class="meaning red-meaning">
              <div class="color-circle red"></div>
              <span>{getNestedValue(i18n, 'traffic-lights.red') || 'Red means STOP'}</span>
            </div>
            <div class="meaning yellow-meaning">
              <div class="color-circle yellow"></div>
              <span>{getNestedValue(i18n, 'traffic-lights.yellow') || 'Yellow means WAIT'}</span>
            </div>
            <div class="meaning green-meaning">
              <div class="color-circle green"></div>
              <span>{getNestedValue(i18n, 'traffic-lights.green') || 'Green means GO'}</span>
            </div>
          </div>
          
          <button class="quiz-button" onclick={startQuiz}>
            {getNestedValue(i18n, 'traffic-lights.what-do-you-do') || 'What do you do now?'}
          </button>
        {:else}
          <div class="quiz-section">
            <p class="quiz-question">
              {getNestedValue(i18n, 'traffic-lights.what-do-you-do') || 'What do you do now?'}
            </p>
            <p class="quiz-context">
              {getNestedValue(i18n, `traffic-lights.quiz-${currentLight}`) || `The light is ${currentLight}`}
            </p>
            
            <div class="answer-buttons">
              {#each ['stop', 'wait', 'go'] as action}
                <button 
                  class="answer-button"
                  onclick={() => handleAnswerClick(action)}
                >
                  {#if getPictogram(action)}
                    <img 
                      src={getPictogram(action).url} 
                      alt={getNestedValue(i18n, `actions.${action}`) || action}
                    />
                  {/if}
                  <span>{getNestedValue(i18n, `actions.${action}`) || action}</span>
                </button>
              {/each}
            </div>
            
            <button class="exit-quiz-button" onclick={exitQuiz}>
              {getNestedValue(i18n, 'common.back') || 'Back'}
            </button>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Pedestrian Animation -->
    <div class="pedestrian-section">
      <div class="pedestrian {pedestrianVisible ? 'walking' : 'stopped'}">
        <div class="pedestrian-figure">🚶</div>
      </div>
    </div>
  </div>
  
  <!-- Feedback Modal -->
  {#if showFeedback}
    <div class="feedback-modal">
      <div class="feedback-content">
        <p>{feedbackMessage}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .traffic-lights-container {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
    min-height: 100vh;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .header h2 {
    font-size: 32px;
    margin: 0;
    color: #1565C0;
  }

  .back-button, .quiz-button, .exit-quiz-button {
    background: #2196F3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
  }

  .back-button:hover, .quiz-button:hover, .exit-quiz-button:hover {
    background: #1976D2;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .content {
      grid-template-columns: 1fr 1fr;
    }
  }

  .traffic-light {
    cursor: pointer;
    user-select: none;
  }

  .light-housing {
    background: #333;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 120px;
    margin: 0 auto;
  }

  .light {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }

  .light.active {
    opacity: 1;
  }

  .light.red {
    background: #f44336;
  }

  .light.yellow {
    background: #ffeb3b;
  }

  .light.green {
    background: #4caf50;
  }

  .light-pole {
    width: 20px;
    height: 100px;
    background: #666;
    margin: 0 auto;
    border-radius: 10px;
  }

  .instructions {
    text-align: center;
    padding: 1rem;
  }

  .tap-instruction {
    font-size: 18px;
    margin-bottom: 2rem;
    color: #1565C0;
  }

  .light-meanings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .meaning {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .color-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .meaning span {
    font-size: 18px;
    font-weight: 600;
  }

  .quiz-section {
    text-align: center;
  }

  .quiz-question {
    font-size: 24px;
    font-weight: bold;
    color: #1565C0;
    margin-bottom: 1rem;
  }

  .quiz-context {
    font-size: 20px;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #2196F3;
  }

  .answer-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .answer-button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 3px solid #ddd;
    border-radius: 12px;
    cursor: pointer;
    font-size: 18px;
    min-height: 60px;
    transition: all 0.2s ease;
  }

  .answer-button:hover {
    border-color: #4CAF50;
    transform: translateY(-2px);
  }

  .answer-button img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .pedestrian-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .pedestrian {
    transition: all 0.5s ease;
  }

  .pedestrian.walking {
    animation: walk 2s linear infinite;
  }

  .pedestrian.stopped {
    opacity: 0.5;
  }

  .pedestrian-figure {
    font-size: 80px;
  }

  @keyframes walk {
    0% { transform: translateX(-50px); }
    100% { transform: translateX(50px); }
  }

  .feedback-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .feedback-content {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .feedback-content p {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .traffic-lights-container {
      background: white;
    }
    
    .meaning, .quiz-context, .answer-button {
      border: 2px solid #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .light, .answer-button, .pedestrian {
      transition: none;
    }
    
    .pedestrian.walking {
      animation: none;
    }
    
    .answer-button:hover {
      transform: none;
    }
  }
</style>