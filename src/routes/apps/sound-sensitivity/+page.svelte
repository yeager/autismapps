<script lang="ts">
  import { locale, t, getLocaleDef } from '$lib/i18n';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  let currentView = $state<'menu' | 'diary' | 'strategies' | 'exposure'>('menu');
  
  // Sound diary entries
  let diaryEntries = $state<{sound: string, level: number, date: string}[]>([]);
  let newSound = $state('');
  let newLevel = $state(3);
  
  const STRATEGIES = [
    { emoji: '🎧', title: 'soundSensitivity.strategy.hearingProtection.title', desc: 'soundSensitivity.strategy.hearingProtection.description' },
    { emoji: '🫁', title: 'soundSensitivity.strategy.breathing.title', desc: 'soundSensitivity.strategy.breathing.description' },
    { emoji: '🚪', title: 'soundSensitivity.strategy.stepAway.title', desc: 'soundSensitivity.strategy.stepAway.description' },
    { emoji: '⏰', title: 'soundSensitivity.strategy.prepare.title', desc: 'soundSensitivity.strategy.prepare.description' },
    { emoji: '🎵', title: 'soundSensitivity.strategy.calmingSounds.title', desc: 'soundSensitivity.strategy.calmingSounds.description' },
    { emoji: '🤲', title: 'soundSensitivity.strategy.deepPressure.title', desc: 'soundSensitivity.strategy.deepPressure.description' },
  ];

  const SOUNDS = [
    { name: 'soundSensitivity.sound.rain', emoji: '🌧️', level: 1 },
    { name: 'soundSensitivity.sound.birds', emoji: '🐦', level: 1 },
    { name: 'soundSensitivity.sound.traffic', emoji: '🚗', level: 2 },
    { name: 'soundSensitivity.sound.dishwasher', emoji: '🍽️', level: 2 },
    { name: 'soundSensitivity.sound.vacuum', emoji: '🧹', level: 3 },
    { name: 'soundSensitivity.sound.dog', emoji: '🐕', level: 3 },
    { name: 'soundSensitivity.sound.alarm', emoji: '🔔', level: 4 },
    { name: 'soundSensitivity.sound.fireworks', emoji: '🎆', level: 4 },
  ];

  function addDiaryEntry() {
    if (!newSound.trim()) return;
    diaryEntries = [...diaryEntries, { sound: newSound.trim(), level: newLevel, date: new Date().toLocaleDateString(getLocaleDef($locale).bcp47) }];
    newSound = '';
    newLevel = 3;
  }

  function goBack() {
    if (currentView === 'menu') goto(base + '/');
    else currentView = 'menu';
  }
</script>

<div class="app">
  <header class="top-bar">
    <button class="back-btn" onclick={goBack}>← {$t('common.back')}</button>
    <h1>🔊 {$t('soundSensitivity.title')}</h1>
  </header>

  {#if currentView === 'menu'}
    <div class="menu" transition:fade>
      <p class="intro">{$t('soundSensitivity.intro')}</p>
      <div class="cards">
        <button class="card" onclick={() => currentView = 'diary'}>
          <span class="card-emoji">📓</span>
          <span class="card-title">{$t('soundSensitivity.diary.title')}</span>
          <span class="card-desc">{$t('soundSensitivity.diary.cardDescription')}</span>
        </button>
        <button class="card" onclick={() => currentView = 'strategies'}>
          <span class="card-emoji">💡</span>
          <span class="card-title">{$t('soundSensitivity.strategies.title')}</span>
          <span class="card-desc">{$t('soundSensitivity.strategies.cardDescription')}</span>
        </button>
        <button class="card" onclick={() => currentView = 'exposure'}>
          <span class="card-emoji">🎚️</span>
          <span class="card-title">{$t('soundSensitivity.soundGuide.title')}</span>
          <span class="card-desc">{$t('soundSensitivity.soundGuide.cardDescription')}</span>
        </button>
      </div>
    </div>
  {:else if currentView === 'diary'}
    <div class="diary" transition:fade>
      <h2>📓 {$t('soundSensitivity.diary.title')}</h2>
      <div class="diary-form">
        <input type="text" bind:value={newSound} placeholder={$t('soundSensitivity.diary.placeholder')} aria-label={$t('soundSensitivity.diary.placeholder')} class="input" />
        <div class="level-picker">
          <span>{$t('soundSensitivity.diary.discomfort')}</span>
          {#each [1,2,3,4,5] as lvl}
            <button class="level-btn" class:active={newLevel === lvl} aria-label={$t('soundSensitivity.diary.level', { level: String(lvl) })} aria-pressed={newLevel === lvl} onclick={() => newLevel = lvl}>
              {lvl === 1 ? '😊' : lvl === 2 ? '😐' : lvl === 3 ? '😟' : lvl === 4 ? '😣' : '😱'}
            </button>
          {/each}
        </div>
        <button class="primary-btn" onclick={addDiaryEntry} disabled={!newSound.trim()}>{$t('soundSensitivity.diary.add')}</button>
      </div>
      {#if diaryEntries.length > 0}
        <div class="entries">
          {#each diaryEntries.toReversed() as entry}
            <div class="entry">
              <span class="entry-sound">{entry.sound}</span>
              <span class="entry-level">{'😊😐😟😣😱'[entry.level - 1]}</span>
              <span class="entry-date">{entry.date}</span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="empty">{$t('soundSensitivity.diary.empty')}</p>
      {/if}
    </div>
  {:else if currentView === 'strategies'}
    <div class="strategies" transition:fade>
      <h2>💡 {$t('soundSensitivity.strategies.title')}</h2>
      <div class="strategy-list">
        {#each STRATEGIES as s}
          <button class="strategy-card" onclick={() => speak($t(s.title) + '. ' + $t(s.desc))}>
            <span class="strategy-emoji">{s.emoji}</span>
            <div>
                <strong>{$t(s.title)}</strong>
                <p>{$t(s.desc)}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {:else if currentView === 'exposure'}
    <div class="exposure" transition:fade>
      <h2>🎚️ {$t('soundSensitivity.soundGuide.title')}</h2>
      <p>{$t('soundSensitivity.soundGuide.description')}</p>
      <div class="sound-grid">
        {#each SOUNDS as sound}
          <button class="sound-card" onclick={() => speak($t(sound.name))}>
            <span class="sound-emoji">{sound.emoji}</span>
            <span class="sound-name">{$t(sound.name)}</span>
            <span class="sound-level">{$t('soundSensitivity.soundGuide.level', { level: String(sound.level) })}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .app { min-height: 100dvh; display: flex; flex-direction: column; background: var(--bg, #f8f9fa); }
  .top-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
  .top-bar h1 { font-size: 1.3rem; margin: 0; flex: 1; }
  .back-btn { background: none; border: none; font-size: 1rem; cursor: pointer; padding: 8px 12px; border-radius: 8px; min-height: 44px; }
  .intro { text-align: center; color: #666; padding: 0 20px; }
  .cards { display: flex; flex-direction: column; gap: 12px; padding: 20px; max-width: 500px; margin: 0 auto; width: 100%; }
  .card { display: flex; align-items: center; gap: 16px; padding: 20px; background: white; border: 2px solid #e0e0e0; border-radius: 16px; cursor: pointer; text-align: left; min-height: 80px; }
  .card:hover { border-color: #4CAF50; background: #f8fff8; }
  .card-emoji { font-size: 2rem; }
  .card-title { font-weight: 700; font-size: 1.1rem; display: block; }
  .card-desc { font-size: 0.9rem; color: #666; }
  .diary, .strategies, .exposure { padding: 20px; max-width: 500px; margin: 0 auto; width: 100%; }
  h2 { margin: 0 0 16px; }
  .diary-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
  .input { padding: 12px; border: 2px solid #ddd; border-radius: 10px; font-size: 1rem; min-height: 44px; }
  .level-picker { display: flex; align-items: center; gap: 8px; }
  .level-btn { font-size: 1.5rem; background: none; border: 2px solid transparent; border-radius: 50%; width: 48px; height: 48px; cursor: pointer; }
  .level-btn.active { border-color: #FF9800; background: #FFF3E0; }
  .primary-btn { background: #4CAF50; color: white; border: none; padding: 14px; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; min-height: 48px; }
  .primary-btn:disabled { opacity: 0.5; }
  .entries { display: flex; flex-direction: column; gap: 8px; }
  .entry { display: flex; align-items: center; gap: 12px; padding: 12px; background: white; border-radius: 10px; }
  .entry-sound { flex: 1; font-weight: 600; }
  .entry-level { font-size: 1.3rem; }
  .entry-date { font-size: 0.8rem; color: #999; }
  .empty { text-align: center; color: #999; padding: 20px; }
  .strategy-list { display: flex; flex-direction: column; gap: 12px; }
  .strategy-card { display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: white; border: 2px solid #e0e0e0; border-radius: 14px; text-align: left; cursor: pointer; }
  .strategy-card:hover { border-color: #2196F3; }
  .strategy-emoji { font-size: 2rem; }
  .strategy-card p { margin: 4px 0 0; font-size: 0.9rem; color: #555; }
  .sound-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .sound-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px; background: white; border: 2px solid #e0e0e0; border-radius: 14px; cursor: pointer; min-height: 100px; }
  .sound-card:hover { border-color: #9C27B0; }
  .sound-emoji { font-size: 2.5rem; }
  .sound-name { font-weight: 600; }
  .sound-level { font-size: 0.8rem; color: #999; }
</style>
