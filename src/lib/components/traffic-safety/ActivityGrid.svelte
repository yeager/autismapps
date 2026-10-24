<script lang="ts">
  import { TRAFFIC_SAFETY_PICTOGRAM_REVISION } from '$lib/data/pictogram-cache.js';
  import { piktaliTrafficPictogramUrl } from '$lib/piktali/pictograms';
  import { speak } from '$lib/tts';

  type Activity = {
    id: string;
    icon: string;
    titleKey: string;
    descKey: string;
  };

  type TranslationData = Record<string, any>;

  let {
    i18n = {},
    onactivitySelected = () => {}
  } = $props<{ i18n?: TranslationData; onactivitySelected?: (event: CustomEvent<{ activity: string }>) => void }>();
  
  
  const activities: Activity[] = [
    {
      id: 'traffic-lights',
      icon: 'trafficLight',
      titleKey: 'activities.traffic-lights',
      descKey: 'activities.traffic-lights-desc'
    },
    {
      id: 'crosswalk', 
      icon: 'crosswalk',
      titleKey: 'activities.crosswalk',
      descKey: 'activities.crosswalk-desc'
    },
    {
      id: 'road-signs',
      icon: 'warning',
      titleKey: 'activities.road-signs',
      descKey: 'activities.road-signs-desc'
    },
    {
      id: 'safe-places',
      icon: 'safe',
      titleKey: 'activities.safe-places', 
      descKey: 'activities.safe-places-desc'
    },
    {
      id: 'reflectors',
      icon: 'reflector',
      titleKey: 'activities.reflectors',
      descKey: 'activities.reflectors-desc'
    },
    {
      id: 'vehicles',
      icon: 'car',
      titleKey: 'activities.vehicles',
      descKey: 'activities.vehicles-desc'
    }
  ];

  // Use the original Piktali pictograms for every activity card.
  const piktaliSymbols: Record<string, string> = {
    'traffic-lights': 'trafficlight',
    crosswalk: 'crosswalk',
    'road-signs': 'danger',
    'safe-places': 'safeplace',
    reflectors: 'reflector',
    vehicles: 'car'
  };

  function pictogramFor(activity: Activity) {
    const symbol = piktaliSymbols[activity.id];
    const url = symbol ? piktaliTrafficPictogramUrl(symbol) : null;
    return url ? {
      key: `piktali-${symbol}`,
      url: `${url}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`
    } : undefined;
  }
  
  function handleActivityClick(activity: Activity) {
    const title = getNestedValue(i18n, activity.titleKey) || activity.id;
    speak(title);
    onactivitySelected({ detail: { activity: activity.id } });
  }
  
  function getNestedValue(obj: TranslationData, path: string): string | undefined {
    const value = path.split('.').reduce<any>((current, key) => current?.[key], obj);
    return typeof value === 'string' ? value : undefined;
  }
</script>

<div class="activity-grid">
  {#each activities as activity}
    {@const pictogram = pictogramFor(activity)}
    <button 
      class="activity-card"
      onclick={() => handleActivityClick(activity)}
    >
      <div class="activity-icon">
        {#if pictogram}
          <img 
            src={pictogram.url}
            alt={getNestedValue(i18n, activity.titleKey) || activity.id}
            loading="lazy"
          />
        {:else}
          <div class="placeholder-icon" aria-hidden="true">{activity.id === 'safe-places' ? '✓' : activity.id === 'reflectors' ? '◉' : activity.icon.slice(0, 2).toUpperCase()}</div>
        {/if}
      </div>
      
      <div class="activity-text">
        <h3>{getNestedValue(i18n, activity.titleKey) || activity.id}</h3>
        <p>{getNestedValue(i18n, activity.descKey) || ''}</p>
      </div>
    </button>
  {/each}
</div>

<style>
  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .activity-card {
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
    gap: 1rem;
    
    /* Ensure minimum touch target size */
    min-width: 44px;
    min-height: 44px;
  }

  .activity-card:hover {
    border-color: #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .activity-card:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .activity-icon {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #f5f5f5;
  }

  .activity-icon img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .placeholder-icon {
    font-size: 32px;
    font-weight: bold;
    color: #666;
  }

  @media (min-width: 769px) and (max-height: 850px) {
    .activity-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
      padding: 0.75rem 1rem;
    }

    .activity-card {
      min-height: 0;
      padding: 0.75rem;
      gap: 0.5rem;
    }

    .activity-icon {
      width: 76px;
      height: 76px;
    }

    .activity-text {
      gap: 0.25rem;
    }

    .activity-text h3 {
      font-size: 20px;
    }

    .activity-text p {
      font-size: 16px;
      line-height: 1.25;
    }
  }

  @media (max-width: 768px) and (min-height: 700px) {
    .activity-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .activity-card {
      min-height: 0;
      padding: 0.5rem;
      gap: 0.375rem;
    }

    .activity-icon {
      width: 60px;
      height: 60px;
    }

    .activity-text {
      gap: 0.25rem;
    }

    .activity-text h3 {
      font-size: 18px;
    }

    .activity-text p {
      font-size: 14px;
      line-height: 1.25;
    }
  }

  .activity-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .activity-text h3 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #333;
    line-height: 1.2;
  }

  .activity-text p {
    font-size: 16px;
    margin: 0;
    color: #666;
    line-height: 1.4;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .activity-card {
      border-color: #000;
      background: #fff;
    }
    
    .activity-card:hover {
      border-color: #000;
      background: #f0f0f0;
    }
    
    .activity-text h3 {
      color: #000;
    }
    
    .activity-text p {
      color: #333;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .activity-card {
      transition: none;
    }
    
    .activity-card:hover {
      transform: none;
    }
  }
</style>
