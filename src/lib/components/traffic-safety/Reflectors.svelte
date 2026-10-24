<script lang="ts">
  import { speak } from '$lib/tts';

  type TranslationData = Record<string, any>;
  type Reflector = {
    id: string;
    nameKey: string;
    position: { x: number; y: number };
    placed: boolean;
    emoji: string;
  };
  let { i18n = {}, onback = () => {} } = $props<{ i18n?: TranslationData; onback?: () => void }>();

  let currentMode = $state('overview'); // 'overview', 'comparison', 'dress-up'
  let isDaytime = $state(true);
  let dressUpProgress = $state<Reflector[]>([]);
  let score = $state(0);

  const reflectorItems: Reflector[] = [
    {
      id: 'vest',
      nameKey: 'item-vest',
      position: { x: 45, y: 35 },
      placed: false,
      emoji: '🦺'
    },
    {
      id: 'hat',
      nameKey: 'item-hat',
      position: { x: 48, y: 15 },
      placed: false,
      emoji: '🧢'
    },
    {
      id: 'bag',
      nameKey: 'item-bag',
      position: { x: 35, y: 45 },
      placed: false,
      emoji: '🎒'
    },
    {
      id: 'shoes',
      nameKey: 'item-shoes',
      position: { x: 48, y: 80 },
      placed: false,
      emoji: '👟'
    },
    {
      id: 'band',
      nameKey: 'item-band',
      position: { x: 55, y: 45 },
      placed: false,
      emoji: '🟨'
    }
  ];

  let availableReflectors = $state([...reflectorItems]);

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

  function toggleDayNight() {
    isDaytime = !isDaytime;
    const timeText = isDaytime ? getI18nValue('reflectors.day') : getI18nValue('reflectors.night');
    speak(timeText);
  }

  function startComparison() {
    currentMode = 'comparison';
    isDaytime = true;
    speak(getI18nValue('reflectors.speech-compare'));
  }

  function startDressUp() {
    currentMode = 'dress-up';
    isDaytime = false;
    score = 0;
    // Reset all reflectors
    availableReflectors = reflectorItems.map(item => ({ ...item, placed: false }));
    dressUpProgress = [];
    speak(getI18nValue('reflectors.speech-dress'));
  }

  function placeReflector(reflector: Reflector) {
    if (!reflector.placed) {
      reflector.placed = true;
      score++;
      dressUpProgress = [...dressUpProgress, reflector];
      
      speak(formatMessage('reflectors.speech-placed', { item: getI18nValue(`reflectors.${reflector.nameKey}`) }));
      
      if (dressUpProgress.length === reflectorItems.length) {
        setTimeout(() => {
          speak(getI18nValue('reflectors.speech-complete'));
        }, 1000);
      }
    }
  }

  function handleReflectorDrop(event: DragEvent, reflector: Reflector) {
    event.preventDefault();
    placeReflector(reflector);
  }

  function handleDragStart(event: DragEvent, reflector: Reflector) {
    event.dataTransfer?.setData('text/plain', reflector.id);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const reflectorId = event.dataTransfer?.getData('text/plain');
    const reflector = availableReflectors.find(r => r.id === reflectorId);
    if (reflector) {
      handleReflectorDrop(event, reflector);
    }
  }

  function resetDressUp() {
    availableReflectors = reflectorItems.map(item => ({ ...item, placed: false }));
    dressUpProgress = [];
    score = 0;
  }

  function goBack() {
    currentMode = 'overview';
  }

  // Tips about reflectors
  const reflectorTips = [
    'tip-1', 'tip-2', 'tip-3', 'tip-4', 'tip-5'
  ];
</script>

<div class="reflectors-container">
  <header class="activity-header">
    <button class="back-button" onclick={onback}>
      ← {getI18nValue('common.back')}
    </button>
    <h1>✨ {getI18nValue('reflectors.title')}</h1>
  </header>

  <div class="reflectors-content">
    {#if currentMode === 'overview'}
      <!-- Overview and menu -->
      <div class="overview-section">
        <div class="intro">
          <h2>{getI18nValue('reflectors.intro-title')}</h2>
          <p>{getI18nValue('reflectors.intro-copy')}</p>
        </div>

        <div class="activity-buttons">
          <button class="activity-btn" onclick={startComparison}>
            <div class="btn-icon">🌞🌙</div>
            <h3>{getI18nValue('reflectors.day-vs-night')}</h3>
            <p>{getI18nValue('reflectors.day-vs-night-desc')}</p>
          </button>

          <button class="activity-btn" onclick={startDressUp}>
            <div class="btn-icon">👕✨</div>
            <h3>{getI18nValue('reflectors.dress-title')}</h3>
            <p>{getI18nValue('reflectors.dress-desc')}</p>
          </button>
        </div>

        <div class="tips-section">
          <h3>{getI18nValue('reflectors.tips-title')}</h3>
          <ul class="tips-list">
            {#each reflectorTips as tip}
              <li>{getI18nValue(`reflectors.${tip}`)}</li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}

    {#if currentMode === 'comparison'}
      <!-- Day/Night comparison -->
      <div class="comparison-section">
        <div class="comparison-header">
          <h2>{getI18nValue('reflectors.comparison-title')}</h2>
          <button class="toggle-button" onclick={toggleDayNight}>
            {isDaytime ? `🌙 ${getI18nValue('reflectors.switch-to-night')}` : `🌞 ${getI18nValue('reflectors.switch-to-day')}`}
          </button>
        </div>
        
        <div class="visibility-demo" class:night={!isDaytime} class:day={isDaytime}>
          <div class="environment">
            <div class="road">
              <div class="person" class:with-reflectors={!isDaytime}>
                <div class="person-body">🚶‍♂️</div>
                {#if !isDaytime}
                  <div class="reflector-glow r1"></div>
                  <div class="reflector-glow r2"></div>
                  <div class="reflector-glow r3"></div>
                {/if}
              </div>
              
              <div class="car">
                <div class="car-body">🚗</div>
                {#if !isDaytime}
                  <div class="headlight left"></div>
                  <div class="headlight right"></div>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="visibility-info">
            <div class="time-indicator">
              {isDaytime ? `☀️ ${getI18nValue('reflectors.day-label')}` : `🌙 ${getI18nValue('reflectors.night-label')}`}
            </div>

            <div class="visibility-stats">
              {#if isDaytime}
                <div class="stat good">
                  <strong>{getI18nValue('reflectors.visibility')}: {getI18nValue('reflectors.good-in-daylight')}</strong><br>
                  {getI18nValue('reflectors.seen-in-daylight')}
                </div>
              {:else}
                <div class="stat {dressUpProgress.length > 0 ? 'excellent' : 'poor'}">
                  <strong>{getI18nValue('reflectors.visibility')}: {getI18nValue(dressUpProgress.length > 0 ? 'reflectors.excellent-with-reflectors' : 'reflectors.poor-without-reflectors')}</strong><br>
                  {getI18nValue(dressUpProgress.length > 0 ? 'reflectors.distance-with-reflectors' : 'reflectors.distance-without-reflectors')}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <button class="back-demo-button" onclick={goBack}>
          {getI18nValue('reflectors.back-to-menu')}
        </button>
      </div>
    {/if}

    {#if currentMode === 'dress-up'}
      <!-- Dress-up activity -->
      <div class="dress-up-section">
        <div class="dress-up-header">
          <h2>{getI18nValue('reflectors.dress-person')}</h2>
          <div class="progress-info">
            <span class="progress">{formatMessage('reflectors.progress', { score, total: reflectorItems.length })}</span>
            <button class="reset-button" onclick={resetDressUp}>{getI18nValue('reflectors.restart')}</button>
          </div>
        </div>
        
        <div class="dress-up-game">
          <div
               class="character-area"
               role="group"
               aria-label={getI18nValue('reflectors.place-on-person')}
               ondragover={handleDragOver}
               ondrop={handleDrop}>
            <div class="character">
              <div class="character-body">🧍‍♀️</div>
              
              <!-- Show placed reflectors -->
              {#each dressUpProgress as reflector}
                <div 
                  class="placed-reflector"
                  style="left: {reflector.position.x}%; top: {reflector.position.y}%"
                >
                  ✨
                </div>
              {/each}
            </div>
            
            <div class="drop-instruction">
              {getI18nValue('reflectors.drop-reflectors-here')}
            </div>
          </div>

          <div class="reflector-items">
            <h3>{getI18nValue('reflectors.available')}</h3>
            <div class="items-grid">
              {#each availableReflectors as reflector}
                {#if !reflector.placed}
                  <button
                    type="button"
                    class="reflector-item"
                    draggable="true"
                    ondragstart={(e) => handleDragStart(e, reflector)}
                    onclick={() => placeReflector(reflector)}
                    aria-label={formatMessage('reflectors.add-reflector', { item: getI18nValue(`reflectors.${reflector.nameKey}`) })}
                  >
                    <div class="item-icon">{reflector.emoji}</div>
                    <div class="item-name">{getI18nValue(`reflectors.${reflector.nameKey}`)}</div>
                  </button>
                {/if}
              {/each}
            </div>
            
            {#if score === reflectorItems.length}
              <div class="completion-message">
                🎉 {getI18nValue('reflectors.completion')}
              </div>
            {/if}
          </div>
        </div>

        <button class="back-game-button" onclick={goBack}>
          {getI18nValue('common.back')}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .reflectors-container {
    min-height: calc(100dvh - var(--header-h));
    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: white;
  }

  .activity-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #333;
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

  .reflectors-content {
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .overview-section {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .intro h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .intro p {
    font-size: 18px;
    line-height: 1.6;
    margin: 0 0 2rem 0;
    text-align: center;
  }

  .activity-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }

  .activity-btn {
    background: white;
    border: 3px solid #ddd;
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    min-height: 44px;
    min-width: 44px;
  }

  .activity-btn:hover {
    border-color: #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .btn-icon {
    font-size: 48px;
    margin-bottom: 1rem;
  }

  .activity-btn h3 {
    font-size: 24px;
    color: #2E7D32;
    margin: 0 0 0.5rem 0;
  }

  .activity-btn p {
    font-size: 16px;
    color: #666;
    margin: 0;
  }

  .tips-section {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
  }

  .tips-section h3 {
    font-size: 20px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
  }

  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tips-list li {
    padding: 0.5rem 0;
    font-size: 16px;
    border-bottom: 1px solid #ddd;
    position: relative;
    padding-left: 1.5rem;
  }

  .tips-list li::before {
    content: '💡';
    position: absolute;
    left: 0;
    top: 0.5rem;
  }

  .tips-list li:last-child {
    border-bottom: none;
  }

  .comparison-section {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .comparison-header h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0;
  }

  .toggle-button {
    background: #FF9800;
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

  .toggle-button:hover {
    background: #F57C00;
  }

  .visibility-demo {
    border-radius: 16px;
    padding: 2rem;
    margin: 2rem 0;
    transition: all 0.5s ease;
  }

  .visibility-demo.day {
    background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
  }

  .visibility-demo.night {
    background: linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 100%);
  }

  .environment {
    position: relative;
    min-height: 200px;
  }

  .road {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .person {
    position: relative;
    transition: all 0.3s ease;
  }

  .person-body {
    font-size: 40px;
  }

  .person.with-reflectors {
    filter: drop-shadow(0 0 10px #fff);
  }

  .reflector-glow {
    position: absolute;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .reflector-glow.r1 {
    width: 20px;
    height: 20px;
    top: 5px;
    left: 10px;
  }

  .reflector-glow.r2 {
    width: 15px;
    height: 15px;
    top: 15px;
    right: 5px;
  }

  .reflector-glow.r3 {
    width: 18px;
    height: 18px;
    bottom: 5px;
    left: 15px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  .car {
    position: relative;
  }

  .car-body {
    font-size: 32px;
  }

  .headlight {
    position: absolute;
    top: 10px;
    width: 100px;
    height: 20px;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.8) 0%, transparent 100%);
    border-radius: 10px;
  }

  .headlight.left {
    left: -100px;
  }

  .headlight.right {
    left: -80px;
    top: 20px;
  }

  .visibility-info {
    text-align: center;
    margin-top: 2rem;
  }

  .time-indicator {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .visibility-stats {
    background: rgba(0, 0, 0, 0.1);
    padding: 1rem;
    border-radius: 8px;
  }

  .stat {
    font-size: 16px;
    line-height: 1.5;
  }

  .stat.good {
    color: #4CAF50;
  }

  .stat.poor {
    color: #F44336;
  }

  .stat.excellent {
    color: #2E7D32;
  }

  .back-demo-button, .back-game-button {
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
    display: block;
    margin: 2rem auto 0 auto;
  }

  .back-demo-button:hover, .back-game-button:hover {
    background: #757575;
  }

  .dress-up-section {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .dress-up-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .dress-up-header h2 {
    font-size: 28px;
    color: #2E7D32;
    margin: 0;
  }

  .progress-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress {
    font-size: 16px;
    font-weight: bold;
    color: #4CAF50;
  }

  .reset-button {
    background: #FF9800;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    transition: all 0.2s ease;
  }

  .reset-button:hover {
    background: #F57C00;
  }

  .dress-up-game {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
  }

  .character-area {
    background: linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 100%);
    border-radius: 16px;
    padding: 2rem;
    min-height: 400px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 3px dashed #ccc;
  }

  .character {
    position: relative;
    font-size: 80px;
  }

  .character-body {
    position: relative;
    z-index: 1;
  }

  .placed-reflector {
    position: absolute;
    font-size: 20px;
    z-index: 2;
    animation: sparkle 1s ease-in-out infinite;
  }

  @keyframes sparkle {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 1; }
  }

  .drop-instruction {
    position: absolute;
    bottom: 1rem;
    color: #ccc;
    font-size: 16px;
    text-align: center;
  }

  .reflector-items {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 2rem;
  }

  .reflector-items h3 {
    font-size: 20px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .reflector-item {
    font: inherit;
    color: inherit;
    text-align: center;
    background: white;
    border: 2px solid #ddd;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    cursor: grab;
    transition: all 0.2s ease;
    min-height: 44px;
    min-width: 44px;
  }

  .reflector-item:hover {
    border-color: #4CAF50;
    transform: translateY(-2px);
  }

  .reflector-item:active {
    cursor: grabbing;
  }

  .item-icon {
    font-size: 32px;
    margin-bottom: 0.5rem;
  }

  .item-name {
    font-size: 12px;
    color: #666;
    line-height: 1.2;
  }

  .completion-message {
    background: #E8F5E8;
    color: #4CAF50;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    margin-top: 1rem;
  }

  @media (min-width: 769px) and (max-height: 800px) {
    .reflectors-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 56px; padding: 6px 16px; }
    .activity-header h1 { font-size: 24px; }
    .back-button { padding: 8px 16px; }
    .reflectors-content { flex: 1; min-height: 0; width: 100%; max-width: none; padding: 8px 16px; }
    .overview-section, .comparison-section, .dress-up-section { height: 100%; padding: 12px; }
    .overview-section { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr); grid-template-rows: auto 1fr; gap: 8px 16px; }
    .intro { grid-column: 1 / -1; }
    .intro h2 { margin-bottom: 4px; font-size: 22px; }
    .intro p { margin-bottom: 4px; font-size: 16px; line-height: 1.35; }
    .activity-buttons { align-content: start; gap: 8px; margin: 0; }
    .activity-btn { padding: 10px; }
    .btn-icon { margin-bottom: 4px; font-size: 32px; }
    .activity-btn h3 { margin-bottom: 4px; font-size: 18px; }
    .activity-btn p { font-size: 16px; }
    .tips-section { align-self: start; margin: 0; padding: 10px; }
    .tips-section h3 { margin-bottom: 4px; font-size: 17px; }
    .tips-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 12px; }
    .tips-list li { padding: 4px 0 4px 22px; font-size: 16px; }
    .tips-list li::before { top: 4px; }
    .comparison-section { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto minmax(0, 1fr); gap: 8px 12px; }
    .comparison-header { grid-column: 1 / -1; margin: 0; gap: 8px; }
    .comparison-header h2 { font-size: 22px; }
    .toggle-button { padding: 8px 16px; }
    .visibility-demo { grid-column: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding: 12px; margin: 0; }
    .environment { flex: 1; min-height: 140px; }
    .visibility-info { margin-top: 8px; }
    .time-indicator { margin-bottom: 4px; font-size: 20px; }
    .visibility-stats { padding: 8px; }
    .back-demo-button { grid-column: 2; align-self: end; margin: 0; padding: 8px 16px; }
    .character-area { min-height: 220px; padding: 12px; }
    .reflector-items { padding: 12px; }
    .items-grid { gap: 8px; }
    .reflector-item { padding: 8px; }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .reflectors-content {
      padding: 1rem;
    }
    
    .activity-header {
      padding: 1rem;
    }
    
    .activity-header h1 {
      font-size: 24px;
    }
    
    .activity-buttons {
      grid-template-columns: 1fr;
    }
    
    .comparison-header {
      flex-direction: column;
      text-align: center;
    }
    
    .dress-up-game {
      grid-template-columns: 1fr;
    }
    
    .character {
      font-size: 60px;
    }
    
    .dress-up-header {
      flex-direction: column;
      text-align: center;
    }
    
    .progress-info {
      flex-direction: column;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .overview-section, .comparison-section, .dress-up-section {
      border: 2px solid #000;
      background: #fff;
    }
    
    .activity-btn {
      border-color: #000;
    }
    
    .reflector-item {
      border-color: #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .reflector-glow, .placed-reflector {
      animation: none;
    }
    
    .activity-btn:hover, .reflector-item:hover {
      transform: none;
    }
  }

  /* Ensure minimum font sizes for accessibility */
  * {
    font-size: max(16px, 1em);
  }

  @media (max-width: 768px) {
    .reflectors-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .activity-header { flex: 0 0 52px; gap: 8px; padding: 6px 10px; }
    .activity-header h1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 19px; }
    .back-button { padding: 8px 10px; font-size: 15px; }
    .reflectors-content { flex: 1; min-height: 0; width: 100%; padding: 8px; }
    .overview-section, .comparison-section, .dress-up-section { height: 100%; min-height: 0; padding: 10px; }
    .overview-section { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto auto minmax(0, 1fr); gap: 6px; }
    .intro, .activity-buttons, .tips-section { grid-column: 1 / -1; }
    .intro h2 { margin: 0 0 3px; font-size: 19px; }
    .intro p { margin: 0; font-size: 14px; line-height: 1.3; }
    .activity-buttons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin: 0; }
    .activity-btn { min-width: 0; padding: 8px 5px; }
    .btn-icon { margin: 0 0 3px; font-size: 26px; }
    .activity-btn h3 { margin: 0 0 3px; font-size: 14px; line-height: 1.15; }
    .activity-btn p { font-size: 12px; line-height: 1.2; }
    .tips-section { align-self: stretch; min-width: 0; margin: 0; padding: 7px; }
    .tips-section h3 { margin: 0 0 3px; font-size: 15px; }
    .tips-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 8px; }
    .tips-list li { padding: 4px 0 4px 18px; font-size: 12px; line-height: 1.2; }
    .tips-list li::before { top: 4px; }
    .comparison-section { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 6px; }
    .comparison-header { flex-direction: row; justify-content: space-between; gap: 6px; margin: 0; text-align: left; }
    .comparison-header h2 { font-size: 18px; }
    .toggle-button { padding: 7px 10px; font-size: 14px; }
    .visibility-demo { display: grid; grid-template-rows: minmax(110px, 1fr) auto; gap: 6px; min-height: 0; margin: 0; padding: 8px; }
    .environment { min-height: 110px; }
    .road { height: 64px; padding: 0 12px; }
    .visibility-info { margin: 0; }
    .time-indicator { margin: 0 0 3px; font-size: 16px; }
    .visibility-stats { padding: 6px; font-size: 13px; }
    .back-demo-button, .back-game-button { min-height: 44px; margin: 0; padding: 7px 12px; font-size: 14px; }
    .dress-up-section { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 6px; }
    .dress-up-header { flex-direction: row; justify-content: space-between; gap: 6px; text-align: left; }
    .dress-up-header h2 { margin: 0; font-size: 17px; }
    .progress-info { flex-direction: row; gap: 6px; font-size: 13px; }
    .reset-button { min-height: 40px; padding: 5px 8px; font-size: 12px; }
    .dress-up-game { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; min-height: 0; }
    .character-area { min-height: 0; padding: 8px; }
    .character { font-size: 48px; }
    .drop-instruction { padding: 5px; font-size: 12px; }
    .reflector-items { min-width: 0; padding: 7px; }
    .reflector-items h3 { margin: 0 0 4px; font-size: 14px; }
    .items-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px; }
    .reflector-item { min-width: 0; min-height: 44px; padding: 4px; }
    .item-icon { font-size: 20px; }
    .item-name { font-size: 11px; line-height: 1.1; }
  }
</style>
