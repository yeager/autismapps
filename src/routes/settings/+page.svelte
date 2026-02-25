<script lang="ts">
  import { get } from 'svelte/store';
  import { t, locale, setLocale } from '$lib/i18n';
  import { speak, preloadVoice, getStoredVoices, getEngine, selectedVoiceSv, selectedVoiceEn } from '$lib/tts';
  import { voicesForLang, type VoiceOption } from '$lib/tts/voices';
  import {
    theme, textSize, ttsSpeed, phoneticEmphasis,
    screenReaderEnabled, reducedMotion, simpleMode, arasaacBW,
    type Theme, type TextSize
  } from '$lib/a11y';
  import { db } from '$lib/storage';
  import { browser } from '$app/environment';

  let advanced = $state(false);

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'sv', label: 'Svenska' }
  ];

  const TEXT_SIZES: { value: TextSize; key: string }[] = [
    { value: 'normal', key: 'settings.text_size.normal' },
    { value: 'large', key: 'settings.text_size.large' },
    { value: 'extra-large', key: 'settings.text_size.extra_large' }
  ];

  const THEMES: { value: Theme; key: string }[] = [
    { value: 'light', key: 'settings.theme.light' },
    { value: 'dark', key: 'settings.theme.dark' },
    { value: 'high-contrast', key: 'settings.theme.high_contrast' }
  ];

  function changeLang(code: string) {
    setLocale(code);
    if (browser) localStorage.setItem('locale', code);
    speak($t(`settings.language`));
  }

  let storedVoices = $state<string[]>([]);
  let ttsEngine = $state('');
  let downloadingVoice = $state('');

  $effect(() => {
    if (browser) {
      getStoredVoices().then(v => storedVoices = v);
      ttsEngine = getEngine();
    }
  });

  function testVoice() {
    speak($t('app.title') + '. ' + $t('app.subtitle'));
  }

  function currentVoices(): VoiceOption[] {
    return voicesForLang($locale);
  }

  function selectedVoiceForLang(): string {
    return $locale === 'sv' ? $selectedVoiceSv : $selectedVoiceEn;
  }

  async function selectVoice(v: VoiceOption) {
    if (v.lang === 'sv') $selectedVoiceSv = v.id;
    else $selectedVoiceEn = v.id;

    // Download if not cached
    if (!storedVoices.includes(v.id)) {
      downloadingVoice = v.id;
      await preloadVoice(v.lang);
      storedVoices = await getStoredVoices();
      downloadingVoice = '';
    }

    // Test the voice
    speak(v.lang === 'sv' ? 'Hej, jag heter ' + v.name : 'Hello, my name is ' + v.name);
  }

  function handleSpeedChange(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value);
    $ttsSpeed = val;
  }

  function getSpeedLabel(val: number): string {
    if (val <= 0.5) return $t('settings.tts_speed.slow');
    if (val >= 1.0) return $t('settings.tts_speed.fast');
    return $t('settings.tts_speed.normal');
  }

  async function clearData() {
    if (browser && confirm('Clear all data? This cannot be undone.')) {
      await db.boards.clear();
      await db.schedules.clear();
      await db.settings.clear();
      speak($t('settings.clear_data'));
    }
  }

  async function exportData() {
    const boards = await db.boards.toArray();
    const schedules = await db.schedules.toArray();
    const data = JSON.stringify({ boards, schedules }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autismapps-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        if (data.boards) {
          for (const b of data.boards) {
            delete b.id;
            await db.boards.add(b);
          }
        }
        if (data.schedules) {
          for (const s of data.schedules) {
            delete s.id;
            await db.schedules.add(s);
          }
        }
        speak($t('settings.import_data'));
      } catch {
        alert('Invalid file');
      }
    };
    input.click();
  }
</script>

<div class="settings-page">
  <h1>{$t('settings.title')}</h1>

  <!-- Mode toggle -->
  <div class="mode-toggle">
    <button
      class="mode-btn"
      class:active={!advanced}
      onclick={() => advanced = false}
    >{$t('settings.simple')}</button>
    <button
      class="mode-btn"
      class:active={advanced}
      onclick={() => advanced = true}
    >{$t('settings.advanced')}</button>
  </div>

  <div class="settings-list">
    <!-- SIMPLE MODE -->

    <!-- Language -->
    <div class="setting">
      <label class="setting-label">{$t('settings.language')}</label>
      <div class="setting-options">
        {#each LANGUAGES as lang}
          <button
            class="option-btn"
            class:active={$locale === lang.code}
            onclick={() => changeLang(lang.code)}
          >{lang.label}</button>
        {/each}
      </div>
    </div>

    <!-- Voice selection -->
    <div class="setting setting-column">
      <label class="setting-label">{$t('settings.voice')}</label>
      <p class="setting-hint">
        {$t('settings.tts_engine')}: <strong>{ttsEngine === 'piper' ? 'Piper WASM' : ttsEngine === 'webspeech' ? 'Web Speech API' : '—'}</strong>
      </p>
      <div class="voice-grid">
        {#each currentVoices() as v}
          {@const isSelected = selectedVoiceForLang() === v.id}
          {@const isCached = storedVoices.includes(v.id)}
          {@const isDownloading = downloadingVoice === v.id}
          <button
            class="voice-card"
            class:active={isSelected}
            class:downloading={isDownloading}
            onclick={() => selectVoice(v)}
          >
            <span class="voice-name">{v.name}</span>
            <span class="voice-meta">
              {v.gender === 'female' ? '♀' : v.gender === 'male' ? '♂' : '⚬'}
              {v.quality}
              {#if !isCached}· ⬇️ {v.sizeMb}MB{/if}
            </span>
            {#if isSelected}<span class="voice-check">✓</span>{/if}
            {#if isDownloading}<span class="voice-dl">⏳</span>{/if}
          </button>
        {/each}
      </div>
      <button class="option-btn" onclick={testVoice} style="margin-top: 8px">🔊 {$t('settings.test_voice')}</button>
    </div>

    <!-- Text Size -->
    <div class="setting">
      <label class="setting-label">{$t('settings.text_size')}</label>
      <div class="setting-options">
        {#each TEXT_SIZES as size}
          <button
            class="option-btn"
            class:active={$textSize === size.value}
            onclick={() => $textSize = size.value}
          >{$t(size.key)}</button>
        {/each}
      </div>
    </div>

    <!-- Theme -->
    <div class="setting">
      <label class="setting-label">{$t('settings.theme')}</label>
      <div class="setting-options">
        {#each THEMES as th}
          <button
            class="option-btn"
            class:active={$theme === th.value}
            onclick={() => $theme = th.value}
          >{$t(th.key)}</button>
        {/each}
      </div>
    </div>

    <!-- ADVANCED MODE -->
    {#if advanced}
      <!-- TTS Speed Slider -->
      <div class="setting setting-column">
        <label class="setting-label">{$t('settings.tts_speed')}</label>
        <div class="slider-row">
          <span class="slider-label">{$t('settings.tts_speed.slow')}</span>
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.1"
            value={$ttsSpeed}
            oninput={handleSpeedChange}
            class="speed-slider"
            aria-label={$t('settings.tts_speed')}
          />
          <span class="slider-label">{$t('settings.tts_speed.fast')}</span>
        </div>
        <span class="slider-value">{$ttsSpeed.toFixed(1)}x — {getSpeedLabel($ttsSpeed)}</span>
      </div>

      <!-- Phonetic emphasis -->
      <div class="setting">
        <label class="setting-label">{$t('settings.phonetic')}</label>
        <div class="setting-options">
          <button
            class="toggle-btn"
            class:on={$phoneticEmphasis}
            onclick={() => $phoneticEmphasis = !$phoneticEmphasis}
          >{$phoneticEmphasis ? $t('settings.on') : $t('settings.off')}</button>
        </div>
      </div>

      <!-- Screen reader -->
      <div class="setting">
        <label class="setting-label">{$t('settings.screen_reader')}</label>
        <div class="setting-options">
          <button
            class="toggle-btn"
            class:on={$screenReaderEnabled}
            onclick={() => $screenReaderEnabled = !$screenReaderEnabled}
          >{$screenReaderEnabled ? $t('settings.on') : $t('settings.off')}</button>
        </div>
      </div>

      <!-- Animations -->
      <div class="setting">
        <label class="setting-label">{$t('settings.animations')}</label>
        <div class="setting-options">
          <button
            class="toggle-btn"
            class:on={!$reducedMotion}
            onclick={() => $reducedMotion = !$reducedMotion}
          >{!$reducedMotion ? $t('settings.on') : $t('settings.off')}</button>
        </div>
      </div>

      <!-- ARASAAC B/W -->
      <div class="setting">
        <label class="setting-label">{$t('settings.arasaac_bw')}</label>
        <div class="setting-options">
          <button
            class="toggle-btn"
            class:on={$arasaacBW}
            onclick={() => $arasaacBW = !$arasaacBW}
          >{$arasaacBW ? $t('settings.on') : $t('settings.off')}</button>
        </div>
      </div>

      <!-- Data management -->
      <div class="setting">
        <label class="setting-label">{$t('settings.export_data')}</label>
        <div class="setting-options">
          <button class="option-btn" onclick={exportData}>📦 {$t('settings.export_data')}</button>
          <button class="option-btn" onclick={importData}>📥 {$t('settings.import_data')}</button>
        </div>
      </div>

      <div class="setting">
        <label class="setting-label">{$t('settings.clear_data')}</label>
        <div class="setting-options">
          <button class="option-btn danger" onclick={clearData}>🗑️ {$t('settings.clear_data')}</button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .settings-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  h1 {
    font-size: 1.6em;
    font-weight: 700;
  }

  .mode-toggle {
    display: flex;
    gap: 0;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  .mode-btn {
    flex: 1;
    padding: 12px 20px;
    font-weight: 600;
    font-size: 0.95em;
    transition: all var(--transition);
    min-height: 48px;
  }
  .mode-btn:hover { background: var(--bg-hover); }
  .mode-btn.active {
    background: var(--accent);
    color: white;
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }

  .setting-column {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .setting-label {
    font-weight: 600;
    font-size: 0.95em;
    flex-shrink: 0;
  }

  .setting-options {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .option-btn {
    padding: 8px 16px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 500;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 40px;
    white-space: nowrap;
  }
  .option-btn:hover { background: var(--bg-hover); border-color: var(--accent); }
  .option-btn.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  .option-btn.danger {
    color: var(--danger);
    border-color: var(--danger);
  }
  .option-btn.danger:hover {
    background: var(--danger);
    color: white;
  }

  .toggle-btn {
    padding: 8px 20px;
    border: 2px solid var(--border);
    border-radius: 100px;
    font-weight: 600;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 40px;
    min-width: 60px;
  }
  .toggle-btn:hover { background: var(--bg-hover); }
  .toggle-btn.on {
    background: var(--success);
    color: white;
    border-color: var(--success);
  }

  /* TTS Speed slider */
  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .slider-label {
    font-size: 0.8em;
    color: var(--text-muted);
    white-space: nowrap;
    min-width: 44px;
  }
  .slider-value {
    font-size: 0.85em;
    font-weight: 500;
    color: var(--text-muted);
    text-align: center;
  }
  .speed-slider {
    flex: 1;
    height: 8px;
    appearance: none;
    -webkit-appearance: none;
    background: var(--border);
    border-radius: 4px;
    outline: none;
  }
  .speed-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: 3px solid var(--bg-card);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .speed-slider::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: 3px solid var(--bg-card);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }

  @media (max-width: 500px) {
    .setting {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    .setting-options {
      width: 100%;
      justify-content: flex-start;
    }
  }

  /* Voice selection */
  .voice-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
    width: 100%;
  }
  .voice-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 14px 10px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    position: relative;
    min-height: 48px;
    transition: all 0.15s;
  }
  .voice-card:hover { border-color: #3498DB; }
  .voice-card.active { border-color: #27AE60; background: rgba(39,174,96,0.08); }
  .voice-card.downloading { opacity: 0.7; }
  .voice-name { font-weight: 700; font-size: 1em; }
  .voice-meta { font-size: 0.75em; color: var(--text-muted); }
  .voice-check { position: absolute; top: 4px; right: 6px; color: #27AE60; font-size: 0.85em; }
  .voice-dl { position: absolute; top: 4px; left: 6px; }
  .setting-hint { font-size: 0.8em; color: var(--text-muted); margin: 0; }
</style>
