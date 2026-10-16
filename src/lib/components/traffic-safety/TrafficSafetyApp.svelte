<script lang="ts">
  // TTS uses app locale automatically
  import WelcomeDialog from './WelcomeDialog.svelte';
  import { setLocale, pick } from '$lib/i18n';
  import en from '$lib/i18n/messages/en.json';
  import sv from '$lib/i18n/messages/sv.json';
  import ptBR from '$lib/i18n/messages/pt_BR.json';
  import ActivityGrid from './ActivityGrid.svelte';
  import TrafficLights from './TrafficLights.svelte';
  import Vehicles from './Vehicles.svelte';
  import Crosswalk from './Crosswalk.svelte';
  import RoadSigns from './RoadSigns.svelte';
  import SafePlaces from './SafePlaces.svelte';
  import Reflectors from './Reflectors.svelte';
  
  let { lang = $bindable('en') } = $props<{ lang?: string }>();

  const trafficSafetyTranslations: Record<string, Record<string, any>> = {
    sv: sv['traffic-safety'],
    en: en['traffic-safety'],
    pt_BR: ptBR['traffic-safety']
  };

  let showWelcome = $state(true);
  let currentView = $state('grid'); // 'grid', 'traffic-lights', 'crosswalk', etc.
  // Unknown locales fall back to English (pick: code → en → sv)
  let i18nData: Record<string, any> = $derived(pick(trafficSafetyTranslations, lang));

  function chooseLanguage(language: string) {
    lang = language;
    setLocale(language);
    if (typeof localStorage !== 'undefined') localStorage.setItem('locale', language);
  }
  
  function handleWelcomeStart() {
    showWelcome = false;
  }
  
  function handleActivitySelected(event: CustomEvent<{ activity: string }>) {
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
  />
  
  <!-- Main Content -->
  <div class="main-content">
    {#if currentView === 'grid'}
      <div class="app-header">
        <h1>{i18nData.title || 'Traffic Safety'}</h1>
        <div class="language-selector">
          <button 
            class="lang-btn {lang === 'sv' ? 'active' : ''}"
            onclick={() => chooseLanguage('sv')}
          >
            🇸🇪 SV
          </button>
          <button 
            class="lang-btn {lang === 'en' ? 'active' : ''}"
            onclick={() => chooseLanguage('en')}
          >
            🇺🇸 EN
          </button>
          <button
            class="lang-btn {lang === 'pt_BR' ? 'active' : ''}"
            onclick={() => chooseLanguage('pt_BR')}
          >
            🇧🇷 PT
          </button>
        </div>
      </div>
      
      <ActivityGrid 
        i18n={i18nData}
        onactivitySelected={handleActivitySelected}
      />
    {:else if currentView === 'traffic-lights'}
      <TrafficLights 
        i18n={i18nData}
        onback={handleBack}
      />
    {:else if currentView === 'vehicles'}
      <Vehicles 
        i18n={i18nData}
        onback={handleBack}
      />
    {:else if currentView === 'crosswalk'}
      <Crosswalk 
        i18n={i18nData}
        onback={handleBack}
      />
    {:else if currentView === 'road-signs'}
      <RoadSigns
        i18n={i18nData}
        {lang}
        onback={handleBack}
      />
    {:else if currentView === 'safe-places'}
      <SafePlaces 
        i18n={i18nData}
        onback={handleBack}
      />
    {:else if currentView === 'reflectors'}
      <Reflectors 
        i18n={i18nData}
        onback={handleBack}
      />
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



  /* Ensure minimum font sizes for accessibility */
  * {
    font-size: max(16px, 1em);
  }

  h1 {
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
    
    .language-selector {
      border-color: #000;
    }
    
    .lang-btn {
      border: 1px solid #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .lang-btn {
      transition: none;
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
  }
</style>
