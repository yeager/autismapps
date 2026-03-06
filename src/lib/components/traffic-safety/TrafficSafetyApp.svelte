<script>
  // TTS uses app locale automatically
  import WelcomeDialog from './WelcomeDialog.svelte';
  import ActivityGrid from './ActivityGrid.svelte';
  import TrafficLights from './TrafficLights.svelte';
  import Vehicles from './Vehicles.svelte';
  
  let { lang = 'sv' } = $props(); // Default to Swedish
  
  let showWelcome = $state(true);
  let currentView = $state('grid'); // 'grid', 'traffic-lights', 'crosswalk', etc.
  let i18nData = $state({});
  
  // Load i18n data based on language
  $effect(async () => {
    try {
      const module = await import(`../../data/i18n-${lang}.json`);
      i18nData = module.default['traffic-safety'] || {};
    } catch (error) {
      console.warn(`Failed to load i18n for ${lang}, falling back to English`);
      try {
        const module = await import('../../data/i18n-en.json');
        i18nData = module.default['traffic-safety'] || {};
      } catch (fallbackError) {
        console.error('Failed to load any i18n data:', fallbackError);
        i18nData = {};
      }
    }
  });
  
  function handleWelcomeStart() {
    showWelcome = false;
  }
  
  function handleWelcomeClose() {
    showWelcome = false;
  }
  
  function handleActivitySelected(event) {
    currentView = event.detail.activity;
  }
  
  function handleBack() {
    currentView = 'grid';
  }
</script>

<div class="traffic-safety-app">
  <!-- Welcome Dialog -->
  <WelcomeDialog 
    i18n={i18nData}
    visible={showWelcome}
    onstart={handleWelcomeStart}
    onclose={handleWelcomeClose}
  />
  
  <!-- Main Content -->
  <div class="main-content">
    {#if currentView === 'grid'}
      <div class="app-header">
        <h1>{i18nData.title || 'Traffic Safety'}</h1>
        <div class="language-selector">
          <button 
            class="lang-btn {lang === 'sv' ? 'active' : ''}"
            onclick={() => lang = 'sv'}
          >
            🇸🇪 SV
          </button>
          <button 
            class="lang-btn {lang === 'en' ? 'active' : ''}"
            onclick={() => lang = 'en'}
          >
            🇺🇸 EN
          </button>
        </div>
      </div>
      
      <ActivityGrid 
        i18n={i18nData}
        on:activitySelected={handleActivitySelected}
      />
    {:else if currentView === 'traffic-lights'}
      <TrafficLights 
        i18n={i18nData}
        on:back={handleBack}
      />
    {:else if currentView === 'vehicles'}
      <Vehicles 
        i18n={i18nData}
        on:back={handleBack}
      />
    {:else if currentView === 'crosswalk'}
      <!-- Placeholder for crosswalk component -->
      <div class="placeholder-view">
        <h2>🚶 {i18nData.activities?.crosswalk || 'Crosswalk'}</h2>
        <p>Coming soon! Practice crossing streets safely.</p>
        <button class="back-button" onclick={handleBack}>
          ← {i18nData.common?.back || 'Back'}
        </button>
      </div>
    {:else if currentView === 'road-signs'}
      <!-- Placeholder for road signs component -->
      <div class="placeholder-view">
        <h2>🚧 {i18nData.activities?.['road-signs'] || 'Road Signs'}</h2>
        <p>Coming soon! Learn important traffic signs.</p>
        <button class="back-button" onclick={handleBack}>
          ← {i18nData.common?.back || 'Back'}
        </button>
      </div>
    {:else if currentView === 'safe-places'}
      <!-- Placeholder for safe places component -->
      <div class="placeholder-view">
        <h2>🏠 {i18nData.activities?.['safe-places'] || 'Safe Places'}</h2>
        <p>Coming soon! Identify safe and dangerous places.</p>
        <button class="back-button" onclick={handleBack}>
          ← {i18nData.common?.back || 'Back'}
        </button>
      </div>
    {:else if currentView === 'reflectors'}
      <!-- Placeholder for reflectors component -->
      <div class="placeholder-view">
        <h2>✨ {i18nData.activities?.reflectors || 'Reflectors'}</h2>
        <p>Coming soon! Learn about being visible at night.</p>
        <button class="back-button" onclick={handleBack}>
          ← {i18nData.common?.back || 'Back'}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .traffic-safety-app {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 50%, #e3f2fd 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  .main-content {
    width: 100%;
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 0;
  }

  .app-header h1 {
    font-size: 32px;
    color: #2E7D32;
    margin: 0;
    font-weight: bold;
  }

  .language-selector {
    display: flex;
    gap: 0.5rem;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #ddd;
  }

  .lang-btn {
    background: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease;
    min-height: 44px;
    min-width: 44px;
  }

  .lang-btn:hover {
    background: #f5f5f5;
  }

  .lang-btn.active {
    background: #4CAF50;
    color: white;
  }

  .placeholder-view {
    padding: 2rem;
    text-align: center;
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .placeholder-view h2 {
    font-size: 36px;
    color: #2E7D32;
    margin: 0 0 1rem 0;
  }

  .placeholder-view p {
    font-size: 18px;
    color: #666;
    margin: 0 0 2rem 0;
    line-height: 1.5;
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
    transform: translateY(-2px);
  }

  .back-button:active {
    transform: translateY(0);
  }

  /* Ensure minimum font sizes for accessibility */
  * {
    font-size: max(16px, 1em);
  }

  h1, h2, h3 {
    font-size: max(24px, 1.5em);
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .traffic-safety-app {
      background: white;
    }
    
    .app-header {
      border-bottom: 2px solid #000;
    }
    
    .placeholder-view {
      border: 2px solid #000;
    }
    
    .language-selector {
      border-color: #000;
    }
    
    .lang-btn {
      border: 1px solid #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .lang-btn, .back-button {
      transition: none;
    }
    
    .back-button:hover {
      transform: none;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .app-header {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
    }
    
    .app-header h1 {
      font-size: 28px;
    }
    
    .placeholder-view {
      margin: 1rem;
      padding: 1.5rem;
    }
    
    .placeholder-view h2 {
      font-size: 28px;
    }
  }
</style>