<script lang="ts">
  import { speak } from '$lib/tts';
  import { playVehicleSound } from '$lib/audio.js';
  import { getPictogram } from '$lib/data/arasaac-data.js';

  type TranslationData = Record<string, any>;
  type VehicleId = 'car' | 'bus' | 'truck' | 'bicycle' | 'ambulance' | 'police' | 'firetruck';
  type Vehicle = { id: VehicleId; icon: string };
  let { i18n = {}, onback = () => {} } = $props<{ i18n?: TranslationData; onback?: () => void }>();


  let selectedVehicle = $state<Vehicle | null>(null);
  let showScenarios = $state(false);

  const vehicles: Vehicle[] = [
    { id: 'car', icon: 'car' },
    { id: 'bus', icon: 'bus' },
    { id: 'truck', icon: 'truck' },
    { id: 'bicycle', icon: 'bicycle' },
    { id: 'ambulance', icon: 'ambulance' },
    { id: 'police', icon: 'police' },
    { id: 'firetruck', icon: 'firetruck' }
  ];

  const vehicleScenarios: Record<VehicleId, string[]> = {
    car: ['stop', 'look', 'wait'],
    bus: ['wait', 'look', 'go'],
    truck: ['stop', 'wait', 'look'],
    bicycle: ['look', 'go', 'safe'],
    ambulance: ['stop', 'wait', 'look'],
    police: ['stop', 'wait', 'look'],
    firetruck: ['stop', 'wait', 'look']
  };

  function handleVehicleClick(vehicle: Vehicle) {
    selectedVehicle = vehicle;
    const vehicleName = getNestedValue(i18n, `vehicles.${vehicle.id}`) || vehicle.id;
    speak(vehicleName);
    playVehicleSound(vehicle.id);
  }

  function playSound(vehicle: Vehicle) {
    playVehicleSound(vehicle.id);
    speak(getNestedValue(i18n, 'vehicles.listen') || 'Listen to the sound');
  }

  function startScenarios() {
    showScenarios = true;
    speak(getNestedValue(i18n, 'vehicles.what-should-you-do') || 'What should you do?');
  }

  function handleScenarioAnswer(action: string) {
    if (!selectedVehicle) return;
    const vehicleName = getNestedValue(i18n, `vehicles.${selectedVehicle.id}`) || selectedVehicle.id;
    const actionText = getNestedValue(i18n, `actions.${action}`) || action;
    speak(`${vehicleName}: ${actionText}`);
  }

  function getNestedValue(obj: TranslationData, path: string): string | undefined {
    const value = path.split('.').reduce<any>((current, key) => current?.[key], obj);
    return typeof value === 'string' ? value : undefined;
  }
</script>

<div class="vehicles-container">
  <div class="header">
    <h2>{getNestedValue(i18n, 'vehicles.title') || 'Vehicles'}</h2>
    <button class="back-button" onclick={() => onback()}>
      ← {getNestedValue(i18n, 'common.back') || 'Back'}
    </button>
  </div>

  <div class="content">
    {#if selectedVehicle === null}
      <!-- Vehicle Selection Grid -->
      <div class="vehicle-grid">
        {#each vehicles as vehicle}
          {@const pictogram = getPictogram(vehicle.icon)}
          <button
            class="vehicle-card"
            onclick={() => handleVehicleClick(vehicle)}
          >
            <div class="vehicle-icon">
              {#if pictogram}
                <img
                  src={pictogram.url}
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
      {@const selectedPictogram = getPictogram(selectedVehicle.icon)}
      <div class="vehicle-detail">
        <div class="vehicle-info">
          <div class="large-vehicle-icon">
            {#if selectedPictogram}
              <img
                src={selectedPictogram.url}
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
            <button class="sound-button" onclick={() => { if (selectedVehicle) playSound(selectedVehicle); }}>
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
                {@const actionPictogram = getPictogram(action)}
                <button
                  class="action-button"
                  onclick={() => handleScenarioAnswer(action)}
                >
                  {#if action !== 'safe' && actionPictogram}
                    <img
                      src={actionPictogram.url}
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
    min-height: calc(100dvh - var(--header-h));
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
  @media (min-width: 769px) and (max-height: 800px) {
    .vehicles-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; padding: 8px 16px; }
    .header { flex: 0 0 48px; margin-bottom: 8px; }
    .header h2 { font-size: 24px; }
    .back-button, .nav-button { padding: 8px 16px; }
    .content { flex: 1; min-height: 0; }
    .vehicle-grid { height: 100%; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .vehicle-card { min-height: 0; padding: 8px; gap: 6px; }
    .vehicle-icon { width: 64px; height: 64px; }
    .vehicle-card h3 { font-size: 17px; }
    .vehicle-detail { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 12px; height: 100%; max-width: none; }
    .vehicle-info, .scenarios { margin: 0; padding: 12px; }
    .large-vehicle-icon { width: 96px; height: 96px; margin: 0 auto 8px; }
    .vehicle-info h2 { margin: 0 0 8px; font-size: 24px; }
    .action-buttons { gap: 8px; }
    .sound-button, .scenario-button { padding: 8px 12px; font-size: 16px; }
    .scenarios h3 { margin-bottom: 8px; font-size: 20px; }
    .scenario-actions { gap: 8px; }
    .action-button { margin: 0; padding: 8px; min-height: 76px; }
    .action-button img { width: 32px; height: 32px; }
    .navigation { margin-top: 8px; }
  }

  @media (max-width: 768px) {
    .vehicles-container { height: calc(100dvh - var(--header-h)); min-height: 0; display: flex; flex-direction: column; overflow: hidden; padding: 8px; }
    .header { flex: 0 0 48px; gap: 8px; margin: 0; }
    .header h2 { font-size: 21px; }
    .back-button, .nav-button { padding: 8px 10px; font-size: 14px; }
    .content { flex: 1; min-height: 0; }
    .vehicle-grid { height: 100%; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .vehicle-card { min-height: 0; min-width: 0; justify-content: center; gap: 4px; padding: 6px 3px; }
    .vehicle-icon { width: min(100%, 56px); height: 56px; flex: 0 0 56px; }
    .vehicle-card h3 { font-size: 13px; line-height: 1.1; }
    .vehicle-detail { height: 100%; max-width: none; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 6px; }
    .vehicle-info { margin: 0; padding: 8px; }
    .large-vehicle-icon { width: 64px; height: 64px; margin: 0 auto 4px; }
    .vehicle-info h2 { margin: 0 0 6px; font-size: 21px; }
    .action-buttons {
      flex-direction: row;
      gap: 6px;
    }

    .sound-button, .scenario-button {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
      min-height: 48px;
      padding: 6px;
      font-size: 13px;
      line-height: 1.15;
    }

    .scenarios { min-height: 0; margin: 0; padding: 8px; }
    .scenarios h3 { margin: 0 0 6px; font-size: 17px; }
    .scenario-actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 5px;
    }
    .action-button { min-height: 44px; gap: 2px; padding: 4px; font-size: 13px; }
    .action-button img { width: 26px; height: 26px; }
    .action-button span { font-size: 12px; line-height: 1.1; }
    .navigation { margin: 0; }
  }
</style>
