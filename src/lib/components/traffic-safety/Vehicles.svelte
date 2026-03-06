<script>
  import { speak } from '$lib/tts';
  import { playVehicleSound } from '$lib/audio.js';
  import { getPictogram } from '$lib/data/arasaac-data.js';

  let { i18n = {} } = $props();
  
  
  let selectedVehicle = $state(null);
  let showScenarios = $state(false);
  
  const vehicles = [
    { id: 'car', icon: 'car' },
    { id: 'bus', icon: 'bus' },
    { id: 'truck', icon: 'truck' },
    { id: 'bicycle', icon: 'bicycle' },
    { id: 'ambulance', icon: 'ambulance' },
    { id: 'police', icon: 'police' },
    { id: 'firetruck', icon: 'firetruck' }
  ];
  
  const vehicleScenarios = {
    car: ['stop', 'look', 'wait'],
    bus: ['wait', 'look', 'go'],
    truck: ['stop', 'wait', 'look'],
    bicycle: ['look', 'go', 'safe'],
    ambulance: ['stop', 'wait', 'look'],
    police: ['stop', 'wait', 'look'], 
    firetruck: ['stop', 'wait', 'look']
  };
  
  function handleVehicleClick(vehicle) {
    selectedVehicle = vehicle;
    const vehicleName = getNestedValue(i18n, `vehicles.${vehicle.id}`) || vehicle.id;
    speak(vehicleName);
    playVehicleSound(vehicle.id);
  }
  
  function playSound(vehicle) {
    playVehicleSound(vehicle.id);
    speak(getNestedValue(i18n, 'vehicles.listen') || 'Listen to the sound');
  }
  
  function startScenarios() {
    showScenarios = true;
    speak(getNestedValue(i18n, 'vehicles.what-should-you-do') || 'What should you do?');
  }
  
  function handleScenarioAnswer(action) {
    const vehicleName = getNestedValue(i18n, `vehicles.${selectedVehicle.id}`) || selectedVehicle.id;
    const actionText = getNestedValue(i18n, `actions.${action}`) || action;
    speak(`${vehicleName}: ${actionText}`);
  }
  
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
</script>

<div class="vehicles-container">
  <div class="header">
    <h2>{getNestedValue(i18n, 'vehicles.title') || 'Vehicles'}</h2>
    <button class="back-button" onclick={() => dispatch('back')}>
      ← {getNestedValue(i18n, 'common.back') || 'Back'}
    </button>
  </div>
  
  <div class="content">
    {#if !selectedVehicle}
      <!-- Vehicle Selection Grid -->
      <div class="vehicle-grid">
        {#each vehicles as vehicle}
          <button 
            class="vehicle-card"
            onclick={() => handleVehicleClick(vehicle)}
          >
            <div class="vehicle-icon">
              {#if getPictogram(vehicle.icon)}
                <img 
                  src={getPictogram(vehicle.icon).url} 
                  alt={getNestedValue(i18n, `vehicles.${vehicle.id}`) || vehicle.id}
                  loading="lazy"
                />
              {:else}
                <div class="placeholder-icon">
                  {vehicle.id.slice(0, 2).toUpperCase()}
                </div>
              {/if}
            </div>
            
            <h3>{getNestedValue(i18n, `vehicles.${vehicle.id}`) || vehicle.id}</h3>
          </button>
        {/each}
      </div>
    {:else}
      <!-- Vehicle Detail View -->
      <div class="vehicle-detail">
        <div class="vehicle-info">
          <div class="large-vehicle-icon">
            {#if getPictogram(selectedVehicle.icon)}
              <img 
                src={getPictogram(selectedVehicle.icon).url} 
                alt={getNestedValue(i18n, `vehicles.${selectedVehicle.id}`) || selectedVehicle.id}
              />
            {:else}
              <div class="placeholder-icon">
                {selectedVehicle.id.slice(0, 2).toUpperCase()}
              </div>
            {/if}
          </div>
          
          <h2>{getNestedValue(i18n, `vehicles.${selectedVehicle.id}`) || selectedVehicle.id}</h2>
          
          <div class="action-buttons">
            <button class="sound-button" onclick={() => playSound(selectedVehicle)}>
              🔊 {getNestedValue(i18n, 'vehicles.listen') || 'Listen to the sound'}
            </button>
            
            <button class="scenario-button" onclick={startScenarios}>
              {getNestedValue(i18n, 'vehicles.what-should-you-do') || 'What should you do?'}
            </button>
          </div>
        </div>
        
        {#if showScenarios}
          <div class="scenarios">
            <h3>{getNestedValue(i18n, 'vehicles.what-should-you-do') || 'What should you do?'}</h3>
            
            <div class="scenario-actions">
              {#each vehicleScenarios[selectedVehicle.id] as action}
                <button 
                  class="action-button"
                  onclick={() => handleScenarioAnswer(action)}
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
          </div>
        {/if}
        
        <div class="navigation">
          <button class="nav-button" onclick={() => { selectedVehicle = null; showScenarios = false; }}>
            ← {getNestedValue(i18n, 'common.back') || 'Back'}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .vehicles-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
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
    color: #6A1B9A;
  }

  .back-button, .nav-button {
    background: #9C27B0;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
  }

  .back-button:hover, .nav-button:hover {
    background: #7B1FA2;
  }

  .vehicle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .vehicle-card {
    background: white;
    border: 3px solid #ddd;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .vehicle-card:hover {
    border-color: #9C27B0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .vehicle-icon, .large-vehicle-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #f5f5f5;
  }

  .large-vehicle-icon {
    width: 160px;
    height: 160px;
    margin: 0 auto 1rem auto;
  }

  .vehicle-icon img, .large-vehicle-icon img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .placeholder-icon {
    font-size: 24px;
    font-weight: bold;
    color: #666;
  }

  .vehicle-card h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }

  .vehicle-detail {
    max-width: 600px;
    margin: 0 auto;
  }

  .vehicle-info {
    text-align: center;
    background: white;
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .vehicle-info h2 {
    font-size: 36px;
    color: #6A1B9A;
    margin: 0 0 2rem 0;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .sound-button, .scenario-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 18px;
    cursor: pointer;
    min-height: 44px;
    transition: all 0.2s ease;
  }

  .sound-button:hover, .scenario-button:hover {
    background: #45a049;
    transform: translateY(-2px);
  }

  .scenarios {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .scenarios h3 {
    font-size: 24px;
    color: #6A1B9A;
    text-align: center;
    margin: 0 0 2rem 0;
  }

  .scenario-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #f5f5f5;
    border: 3px solid #ddd;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 100px;
  }

  .action-button:hover {
    border-color: #9C27B0;
    transform: translateY(-2px);
    background: #fafafa;
  }

  .action-button img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .action-button span {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  .navigation {
    text-align: center;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .vehicles-container {
      background: white;
    }
    
    .vehicle-card, .vehicle-info, .scenarios {
      border: 2px solid #000;
    }
    
    .action-button {
      border-color: #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .vehicle-card, .sound-button, .scenario-button, .action-button {
      transition: none;
    }
    
    .vehicle-card:hover, .sound-button:hover, .scenario-button:hover, .action-button:hover {
      transform: none;
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .action-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .sound-button, .scenario-button {
      width: 100%;
      max-width: 300px;
    }
    
    .scenario-actions {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
  }
</style>