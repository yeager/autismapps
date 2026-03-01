<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const WEATHER_TYPES = [
    { id: 'sunny', icon: '☀️', temp: '25°' },
    { id: 'rainy', icon: '🌧️', temp: '12°' },
    { id: 'snowy', icon: '❄️', temp: '-5°' },
    { id: 'windy', icon: '💨', temp: '8°' },
    { id: 'warm', icon: '🌤️', temp: '20°' },
    { id: 'cold', icon: '🥶', temp: '0°' },
  ];

  const CLOTHES = {
    head: [
      { id: 'cap', icon: '🧢', sv: 'keps', weather: ['sunny', 'warm'] },
      { id: 'beanie', icon: '🧶', sv: 'mössa', weather: ['snowy', 'cold', 'windy'] },
      { id: 'hood', icon: '🪖', sv: 'huva', weather: ['rainy', 'windy'] },
    ],
    top: [
      { id: 'tshirt', icon: '👕', sv: 't-shirt', weather: ['sunny', 'warm'] },
      { id: 'sweater', icon: '🧥', sv: 'tröja', weather: ['windy', 'cold', 'rainy'] },
      { id: 'jacket', icon: '🧥', sv: 'jacka', weather: ['rainy', 'windy', 'cold'] },
      { id: 'winter-coat', icon: '🧥', sv: 'vinterjacka', weather: ['snowy', 'cold'] },
    ],
    bottom: [
      { id: 'shorts', icon: '🩳', sv: 'shorts', weather: ['sunny', 'warm'] },
      { id: 'pants', icon: '👖', sv: 'byxor', weather: ['rainy', 'windy', 'cold'] },
      { id: 'snow-pants', icon: '👖', sv: 'snöbyxor', weather: ['snowy', 'cold'] },
    ],
    feet: [
      { id: 'sandals', icon: '🩴', sv: 'sandaler', weather: ['sunny', 'warm'] },
      { id: 'sneakers', icon: '👟', sv: 'sneakers', weather: ['warm', 'windy'] },
      { id: 'rain-boots', icon: '🥾', sv: 'gummistövlar', weather: ['rainy'] },
      { id: 'winter-boots', icon: '🥾', sv: 'vinterstövlar', weather: ['snowy', 'cold'] },
    ],
    accessories: [
      { id: 'sunglasses', icon: '🕶️', sv: 'solglasögon', weather: ['sunny'] },
      { id: 'umbrella', icon: '☂️', sv: 'paraply', weather: ['rainy'] },
      { id: 'gloves', icon: '🧤', sv: 'vantar', weather: ['snowy', 'cold'] },
      { id: 'scarf', icon: '🧣', sv: 'halsduk', weather: ['snowy', 'cold', 'windy'] },
      { id: 'sunscreen', icon: '🧴', sv: 'solkräm', weather: ['sunny', 'warm'] },
    ],
  };

  const BODY_PARTS = ['head', 'top', 'bottom', 'feet', 'accessories'];

  let selectedWeather = $state(null);
  let chosen = $state({});
  let step = $state(0); // 0=weather, 1..5=body parts, 6=summary
  let showFeedback = $state(false);
  let feedbackCorrect = $state(false);

  let currentPart = $derived(step >= 1 && step <= 5 ? BODY_PARTS[step - 1] : null);
  let availableClothes = $derived(currentPart ? CLOTHES[currentPart] : []);
  let recommendedIds = $derived(
    currentPart
      ? CLOTHES[currentPart].filter(c => c.weather.includes(selectedWeather?.id)).map(c => c.id)
      : []
  );

  function selectWeather(w) {
    selectedWeather = w;
    chosen = {};
    speak($t(`clothesChooser.weather.${w.id}`));
    step = 1;
  }

  function selectClothing(item) {
    chosen = { ...chosen, [currentPart]: item };
    const correct = item.weather.includes(selectedWeather.id);
    feedbackCorrect = correct;
    showFeedback = true;
    speak(correct ? `${item.sv}! ${$t('clothesChooser.goodChoice')}` : `${item.sv}. ${$t('clothesChooser.thinkAgain')}`);
    if (correct) {
      setTimeout(() => {
        showFeedback = false;
        step++;
      }, 1200);
    } else {
      setTimeout(() => { showFeedback = false; }, 1500);
    }
  }

  function restart() {
    selectedWeather = null;
    chosen = {};
    step = 0;
    showFeedback = false;
  }

  function speakSummary() {
    const parts = Object.values(chosen).map(c => c.sv).join(', ');
    speak(`${$t('clothesChooser.youChose')}: ${parts}`);
  }
</script>

<WelcomeDialog appId="clothes-chooser" titleKey="app.clothes_chooser" purposeKey="welcome.clothesChooser.purpose" howKey="welcome.clothesChooser.how" goalKey="welcome.clothesChooser.goal" icon="👕" />

<div class="app-container" in:fade>
  <header class="sticky-header">
    <button class="back-btn" onclick={() => step > 0 ? (step === 0 ? goto(`${base}/`) : (step--, showFeedback = false)) : goto(`${base}/`)} aria-label={$t('common.back')}>←</button>
    <h1>👔 {$t('clothesChooser.title')}</h1>
  </header>

  <main class="content">
    {#if step === 0}
      <h2>{$t('clothesChooser.pickWeather')}</h2>
      <div class="weather-grid">
        {#each WEATHER_TYPES as w}
          <button class="weather-card" onclick={() => selectWeather(w)}>
            <span class="weather-icon">{w.icon}</span>
            <span class="weather-name">{$t(`clothesChooser.weather.${w.id}`)}</span>
            <span class="weather-temp">{w.temp}</span>
          </button>
        {/each}
      </div>

    {:else if step >= 1 && step <= 5}
      <div class="progress-dots">
        {#each BODY_PARTS as _, i}
          <span class="dot" class:active={i === step - 1} class:done={i < step - 1}></span>
        {/each}
      </div>

      <div class="context-bar">
        <span>{selectedWeather.icon} {$t(`clothesChooser.weather.${selectedWeather.id}`)}</span>
      </div>

      <h2>{$t(`clothesChooser.part.${currentPart}`)}</h2>

      <div class="clothes-grid">
        {#each availableClothes as item}
          <button
            class="clothes-card"
            class:feedback-correct={showFeedback && chosen[currentPart]?.id === item.id && feedbackCorrect}
            class:feedback-wrong={showFeedback && chosen[currentPart]?.id === item.id && !feedbackCorrect}
            onclick={() => !showFeedback && selectClothing(item)}
            disabled={showFeedback}
          >
            <span class="clothes-icon">{item.icon}</span>
            <span class="clothes-name">{item.sv}</span>
          </button>
        {/each}
      </div>

    {:else}
      <div class="summary">
        <h2>🎉 {$t('clothesChooser.allDone')}</h2>
        <div class="outfit">
          {#each BODY_PARTS as part}
            {#if chosen[part]}
              <div class="outfit-item">
                <span class="outfit-icon">{chosen[part].icon}</span>
                <span class="outfit-label">{chosen[part].sv}</span>
              </div>
            {/if}
          {/each}
        </div>
        <p class="summary-text">{$t('clothesChooser.readyToGo')}</p>
        <div class="summary-actions">
          <button class="action-btn" onclick={speakSummary}>🔊 {$t('clothesChooser.listen')}</button>
          <button class="action-btn restart" onclick={restart}>🔄 {$t('clothesChooser.tryAgain')}</button>
        </div>
      </div>
    {/if}
  </main>

  <footer class="credit">
    <p>Autismappar · CC BY-NC-SA 4.0</p>
  </footer>
</div>

<style>
  .app-container {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
  }

  .back-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    padding: 0.25rem 0.5rem;
    min-width: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 { font-size: 1.4rem; margin: 0; }
  h2 { text-align: center; margin: 0.5rem 0 1rem; }

  .content {
    flex: 1;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .progress-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--border);
  }
  .dot.active { background: var(--accent, #2196f3); transform: scale(1.3); }
  .dot.done { background: #4caf50; }

  .context-bar {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .weather-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  .weather-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 1.25rem;
    border: 2px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s;
    min-height: 48px;
  }
  .weather-card:hover { transform: translateY(-2px); }
  .weather-icon { font-size: 2.5rem; }
  .weather-name { font-weight: 600; font-size: 1.05rem; }
  .weather-temp { color: var(--text-secondary); font-size: 0.9rem; }

  .clothes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 1rem;
  }

  .clothes-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border: 2px solid var(--border);
    border-radius: 16px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s, border-color 0.2s;
    min-height: 48px;
  }
  .clothes-card:hover:not(:disabled) { transform: translateY(-2px); }
  .clothes-icon { font-size: 2.5rem; }
  .clothes-name { font-weight: 600; font-size: 1.05rem; }

  .feedback-correct {
    border-color: #4caf50 !important;
    background: #e8f5e9 !important;
  }
  .feedback-wrong {
    border-color: #f44336 !important;
    background: #ffebee !important;
    animation: shake 0.4s;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .summary { text-align: center; }

  .outfit {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .outfit-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 1rem;
    border: 2px solid #4caf50;
    border-radius: 16px;
    background: var(--bg-card);
    min-width: 90px;
  }

  .outfit-icon { font-size: 2rem; }
  .outfit-label { font-weight: 600; }

  .summary-text {
    font-size: 1.2rem;
    margin: 1rem 0;
  }

  .summary-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    font-size: 1.1rem;
    cursor: pointer;
    min-height: 48px;
  }

  .restart { border-color: var(--accent, #2196f3); }

  .credit {
    padding: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
  }

  @media (prefers-reduced-motion: reduce) {
    .weather-card, .clothes-card { transition: none; }
    .feedback-wrong { animation: none; }
  }
</style>
