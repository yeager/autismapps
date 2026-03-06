<script>
  import { getPictogram } from '$lib/data/arasaac-data.js';
  import { speak } from '$lib/tts';

  let { i18n = {} } = $props();
  
  
  const activities = [
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
  
  function handleActivityClick(activity) {
    const title = getNestedValue(i18n, activity.titleKey) || activity.id;
    speak(title);
    dispatch('activitySelected', { activity: activity.id });
  }
  
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
</script>

<div class="activity-grid">
  {#each activities as activity}
    <button 
      class="activity-card"
      onclick={() => handleActivityClick(activity)}
    >
      <div class="activity-icon">
        {#if getPictogram(activity.icon)}
          <img 
            src={getPictogram(activity.icon).url} 
            alt={getNestedValue(i18n, activity.titleKey) || activity.id}
            loading="lazy"
          />
        {:else}
          <div class="placeholder-icon">
            {activity.icon.slice(0, 2).toUpperCase()}
          </div>
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