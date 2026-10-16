<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t, locale, pick } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  type BodyPart = 'head' | 'top' | 'bottom' | 'feet' | 'accessories';
  type WeatherId = 'sunny' | 'rainy' | 'snowy' | 'windy' | 'warm' | 'cold' | 'cloudy';
  type Weather = { id: WeatherId; icon: string; temp: string };
  type Clothing = { id: string; icon: string; name: Partial<Record<string, string>>; weather: WeatherId[] };

  // Nordic set (sv, en) — unchanged items; English names added (English UI used to show Swedish)
  const NORDIC_WEATHER: Weather[] = [
    { id: 'sunny', icon: '☀️', temp: '25°' },
    { id: 'rainy', icon: '🌧️', temp: '12°' },
    { id: 'snowy', icon: '❄️', temp: '-5°' },
    { id: 'windy', icon: '💨', temp: '8°' },
    { id: 'warm', icon: '🌤️', temp: '20°' },
    { id: 'cold', icon: '🥶', temp: '0°' },
  ];

  const NORDIC_CLOTHES: Record<BodyPart, Clothing[]> = {
    head: [
      { id: 'cap', icon: '🧢', name: { sv: 'keps', en: 'cap' }, weather: ['sunny', 'warm'] },
      { id: 'beanie', icon: '🧶', name: { sv: 'mössa', en: 'beanie' }, weather: ['snowy', 'cold', 'windy'] },
      { id: 'hood', icon: '🪖', name: { sv: 'huva', en: 'hood' }, weather: ['rainy', 'windy'] },
    ],
    top: [
      { id: 'tshirt', icon: '👕', name: { sv: 't-shirt', en: 't-shirt' }, weather: ['sunny', 'warm'] },
      { id: 'sweater', icon: '🧥', name: { sv: 'tröja', en: 'sweater' }, weather: ['windy', 'cold', 'rainy'] },
      { id: 'jacket', icon: '🧥', name: { sv: 'jacka', en: 'jacket' }, weather: ['rainy', 'windy', 'cold'] },
      { id: 'winter-coat', icon: '🧥', name: { sv: 'vinterjacka', en: 'winter coat' }, weather: ['snowy', 'cold'] },
    ],
    bottom: [
      { id: 'shorts', icon: '🩳', name: { sv: 'shorts', en: 'shorts' }, weather: ['sunny', 'warm'] },
      { id: 'pants', icon: '👖', name: { sv: 'byxor', en: 'trousers' }, weather: ['rainy', 'windy', 'cold'] },
      { id: 'snow-pants', icon: '👖', name: { sv: 'snöbyxor', en: 'snow pants' }, weather: ['snowy', 'cold'] },
    ],
    feet: [
      { id: 'sandals', icon: '🩴', name: { sv: 'sandaler', en: 'sandals' }, weather: ['sunny', 'warm'] },
      { id: 'sneakers', icon: '👟', name: { sv: 'sneakers', en: 'sneakers' }, weather: ['warm', 'windy'] },
      { id: 'rain-boots', icon: '🥾', name: { sv: 'gummistövlar', en: 'rain boots' }, weather: ['rainy'] },
      { id: 'winter-boots', icon: '🥾', name: { sv: 'vinterstövlar', en: 'winter boots' }, weather: ['snowy', 'cold'] },
    ],
    accessories: [
      { id: 'sunglasses', icon: '🕶️', name: { sv: 'solglasögon', en: 'sunglasses' }, weather: ['sunny'] },
      { id: 'umbrella', icon: '☂️', name: { sv: 'paraply', en: 'umbrella' }, weather: ['rainy'] },
      { id: 'gloves', icon: '🧤', name: { sv: 'vantar', en: 'mittens' }, weather: ['snowy', 'cold'] },
      { id: 'scarf', icon: '🧣', name: { sv: 'halsduk', en: 'scarf' }, weather: ['snowy', 'cold', 'windy'] },
      { id: 'sunscreen', icon: '🧴', name: { sv: 'solkräm', en: 'sunscreen' }, weather: ['sunny', 'warm'] },
    ],
  };

  // Brazilian set (pt_BR) — no snow; heat, rain and mild cold
  const BRAZIL_WEATHER: Weather[] = [
    { id: 'sunny', icon: '☀️', temp: '30°' },
    { id: 'warm', icon: '🌤️', temp: '26°' },
    { id: 'rainy', icon: '🌧️', temp: '22°' },
    { id: 'cloudy', icon: '☁️', temp: '24°' },
    { id: 'windy', icon: '💨', temp: '20°' },
    { id: 'cold', icon: '🥶', temp: '12°' },
  ];

  const BRAZIL_CLOTHES: Record<BodyPart, Clothing[]> = {
    head: [
      { id: 'cap', icon: '🧢', name: { pt_BR: 'boné' }, weather: ['sunny', 'warm', 'cloudy'] },
      { id: 'beanie', icon: '🧶', name: { pt_BR: 'gorro' }, weather: ['cold'] },
      { id: 'hood', icon: '🪖', name: { pt_BR: 'capuz' }, weather: ['rainy', 'windy'] },
    ],
    top: [
      { id: 'tshirt', icon: '👕', name: { pt_BR: 'camiseta' }, weather: ['sunny', 'warm', 'cloudy'] },
      { id: 'sweater', icon: '🧥', name: { pt_BR: 'moletom' }, weather: ['cold', 'windy', 'cloudy'] },
      { id: 'jacket', icon: '🧥', name: { pt_BR: 'casaco' }, weather: ['cold', 'windy'] },
      { id: 'raincoat', icon: '🧥', name: { pt_BR: 'capa de chuva' }, weather: ['rainy'] },
    ],
    bottom: [
      { id: 'shorts', icon: '🩳', name: { pt_BR: 'bermuda' }, weather: ['sunny', 'warm', 'cloudy'] },
      { id: 'pants', icon: '👖', name: { pt_BR: 'calça' }, weather: ['rainy', 'windy', 'cold', 'cloudy'] },
    ],
    feet: [
      { id: 'sandals', icon: '🩴', name: { pt_BR: 'chinelo' }, weather: ['sunny', 'warm'] },
      { id: 'sneakers', icon: '👟', name: { pt_BR: 'tênis' }, weather: ['warm', 'cloudy', 'windy', 'cold'] },
      { id: 'rain-boots', icon: '🥾', name: { pt_BR: 'galocha' }, weather: ['rainy'] },
    ],
    accessories: [
      { id: 'sunglasses', icon: '🕶️', name: { pt_BR: 'óculos de sol' }, weather: ['sunny'] },
      { id: 'umbrella', icon: '☂️', name: { pt_BR: 'guarda-chuva' }, weather: ['rainy'] },
      { id: 'sunscreen', icon: '🧴', name: { pt_BR: 'protetor solar' }, weather: ['sunny', 'warm'] },
      { id: 'scarf', icon: '🧣', name: { pt_BR: 'cachecol' }, weather: ['cold', 'windy'] },
      { id: 'water-bottle', icon: '🥤', name: { pt_BR: 'garrafinha de água' }, weather: ['sunny', 'warm', 'cloudy'] },
    ],
  };

  const WEATHER_TYPES = $derived(pick({ sv: NORDIC_WEATHER, en: NORDIC_WEATHER, pt_BR: BRAZIL_WEATHER }, $locale));
  const CLOTHES = $derived(pick({ sv: NORDIC_CLOTHES, en: NORDIC_CLOTHES, pt_BR: BRAZIL_CLOTHES }, $locale));
  const itemName = (item: Clothing) => pick(item.name, $locale);

  const BODY_PARTS: BodyPart[] = ['head', 'top', 'bottom', 'feet', 'accessories'];

  let selectedWeather = $state<Weather | null>(null);
  let chosen = $state<Partial<Record<BodyPart, Clothing>>>({});
  let step = $state(0); // 0=weather, 1..5=body parts, 6=summary
  let showFeedback = $state(false);
  let feedbackCorrect = $state(false);

  let currentPart = $derived(step >= 1 && step <= 5 ? BODY_PARTS[step - 1] ?? null : null);
  let availableClothes = $derived(currentPart ? CLOTHES[currentPart] : []);
  let recommendedIds = $derived(
    currentPart && selectedWeather
      ? CLOTHES[currentPart].filter(c => c.weather.includes(selectedWeather!.id)).map(c => c.id)
      : []
  );

  function selectWeather(w: Weather) {
    selectedWeather = w;
    chosen = {};
    speak($t(`clothesChooser.weather.${w.id}`));
    step = 1;
  }

  function selectClothing(item: Clothing) {
    const part = currentPart;
    const weather = selectedWeather;
    if (!part || !weather) return;
    chosen = { ...chosen, [part]: item };
    const correct = item.weather.includes(weather.id);
    feedbackCorrect = correct;
    showFeedback = true;
    speak(correct ? `${itemName(item)}! ${$t('clothesChooser.goodChoice')}` : `${itemName(item)}. ${$t('clothesChooser.thinkAgain')}`);
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

  // Restart the flow when the language changes (not on first run)
  let lastLocale = $locale;
  $effect(() => {
    if ($locale !== lastLocale) { lastLocale = $locale; restart(); }
  });

  function speakSummary() {
    const parts = Object.values(chosen).filter((item): item is Clothing => Boolean(item)).map(item => itemName(item)).join(', ');
    speak(`${$t('clothesChooser.youChose')}: ${parts}`);
  }
</script>

<WelcomeDialog appId="clothes-chooser" titleKey="app.clothes_chooser" purposeKey="welcome.clothesChooser.purpose" howKey="welcome.clothesChooser.how" goalKey="welcome.clothesChooser.goal" icon="👕" />

<div class="app-container" in:fade>

  <main class="content">

  <div class="page-title">
    {#if step > 0}<button class="sub-back" onclick={() => { step--; showFeedback = false }} aria-label={$t('app.back')}>←</button>{/if}
    <h1>👔 {$t('clothesChooser.title')}</h1>

  </div>

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

    {:else if step >= 1 && step <= 5 && selectedWeather && currentPart}
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
            <span class="clothes-name">{itemName(item)}</span>
          </button>
        {/each}
      </div>

    {:else}
      <div class="summary">
        <h2>🎉 {$t('clothesChooser.allDone')}</h2>
        <div class="outfit">
          {#each BODY_PARTS as part}
            {@const item = chosen[part]}
            {#if item}
              <div class="outfit-item">
                <span class="outfit-icon">{item.icon}</span>
                <span class="outfit-label">{itemName(item)}</span>
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
    <p>{$t('app.title.brand')} · CC BY-NC-SA 4.0</p>
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
