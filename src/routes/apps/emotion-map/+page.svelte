<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { get } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  interface Emotion {
    id: string; emoji: string; label: string; zone: 'green' | 'yellow' | 'orange' | 'red';
    body: string[]; // body areas
    strategies: string[];
  }

  const EMOTIONS: Emotion[] = [
    { id: 'happy', emoji: '😊', label: 'emotion.happy', zone: 'green', body: ['chest', 'face'], strategies: ['emotion.strat.share', 'emotion.strat.smile'] },
    { id: 'calm', emoji: '😌', label: 'emotion.calm', zone: 'green', body: ['chest'], strategies: ['emotion.strat.breathe', 'emotion.strat.enjoy'] },
    { id: 'focused', emoji: '🎯', label: 'emotion.focused', zone: 'green', body: ['head'], strategies: ['emotion.strat.keep_going'] },
    { id: 'proud', emoji: '💪', label: 'emotion.proud', zone: 'green', body: ['chest', 'arms'], strategies: ['emotion.strat.share', 'emotion.strat.celebrate'] },
    { id: 'frustrated', emoji: '😤', label: 'emotion.frustrated', zone: 'yellow', body: ['head', 'hands'], strategies: ['emotion.strat.break', 'emotion.strat.ask_help'] },
    { id: 'worried', emoji: '😰', label: 'emotion.worried', zone: 'yellow', body: ['stomach', 'chest'], strategies: ['emotion.strat.breathe', 'emotion.strat.talk'] },
    { id: 'excited', emoji: '🤩', label: 'emotion.excited', zone: 'yellow', body: ['whole'], strategies: ['emotion.strat.breathe', 'emotion.strat.move'] },
    { id: 'silly', emoji: '🤪', label: 'emotion.silly', zone: 'yellow', body: ['whole'], strategies: ['emotion.strat.calm_body', 'emotion.strat.breathe'] },
    { id: 'angry', emoji: '😠', label: 'emotion.angry', zone: 'orange', body: ['head', 'hands', 'chest'], strategies: ['emotion.strat.count', 'emotion.strat.walk_away', 'emotion.strat.squeeze'] },
    { id: 'scared', emoji: '😨', label: 'emotion.scared', zone: 'orange', body: ['stomach', 'chest', 'legs'], strategies: ['emotion.strat.safe_person', 'emotion.strat.breathe', 'emotion.strat.grounding'] },
    { id: 'anxious', emoji: '😥', label: 'emotion.anxious', zone: 'orange', body: ['stomach', 'chest'], strategies: ['emotion.strat.breathe', 'emotion.strat.grounding', 'emotion.strat.talk'] },
    { id: 'overwhelmed', emoji: '🤯', label: 'emotion.overwhelmed', zone: 'orange', body: ['head', 'whole'], strategies: ['emotion.strat.quiet_place', 'emotion.strat.break', 'emotion.strat.headphones'] },
    { id: 'meltdown', emoji: '🌋', label: 'emotion.meltdown', zone: 'red', body: ['whole'], strategies: ['emotion.strat.safe_space', 'emotion.strat.wait', 'emotion.strat.heavy_blanket'] },
    { id: 'rage', emoji: '🔥', label: 'emotion.rage', zone: 'red', body: ['whole'], strategies: ['emotion.strat.safe_space', 'emotion.strat.cool_down'] },
    { id: 'terror', emoji: '😱', label: 'emotion.terror', zone: 'red', body: ['whole'], strategies: ['emotion.strat.safe_person', 'emotion.strat.safe_space'] },
    { id: 'shutdown', emoji: '🧊', label: 'emotion.shutdown', zone: 'red', body: ['whole'], strategies: ['emotion.strat.wait', 'emotion.strat.comfort_item', 'emotion.strat.no_demands'] }
  ];

  const ZONE_COLORS = { green: '#27AE60', yellow: '#F1C40F', orange: '#E67E22', red: '#E74C3C' };
  const ZONE_LABELS = { green: 'emotion.zone.green', yellow: 'emotion.zone.yellow', orange: 'emotion.zone.orange', red: 'emotion.zone.red' };
  const BODY_PARTS = ['head', 'face', 'chest', 'stomach', 'arms', 'hands', 'legs', 'whole'];

  let selectedEmotion = $state<Emotion | null>(null);
  let showBodyMap = $state(false);
  let highlightedParts = $state<string[]>([]);
  let diaryEntries = $state<{ emotion: string; time: string; note: string }[]>([]);
  let showDiary = $state(false);
  let diaryNote = $state('');

  $effect(() => { loadDiary(); });

  async function loadDiary() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'emotion-map');
      if (data?.diary) diaryEntries = data.diary as typeof diaryEntries;
    }
  }

  async function saveDiary() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'emotion-map', { diary: diaryEntries });
  }

  function selectEmotion(e: Emotion) {
    selectedEmotion = e;
    highlightedParts = e.body;
    speak($t(e.label));
  }

  function logEmotion() {
    if (!selectedEmotion) return;
    diaryEntries = [{ emotion: selectedEmotion.id, time: new Date().toISOString(), note: diaryNote }, ...diaryEntries].slice(0, 50);
    diaryNote = '';
    saveDiary();
    speak($t('emotion.logged'));
  }

  function getZoneEmotions(zone: string) {
    return EMOTIONS.filter(e => e.zone === zone);
  }
</script>

<div class="emotion-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => selectedEmotion ? (selectedEmotion = null) : goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('emotion.title')}</h1>
    <button class="icon-btn" onclick={() => { showDiary = !showDiary; }}>📓</button>
  </header>

  {#if showDiary}
    <div class="diary-panel" transition:fly={{ x: 300 }}>
      <h2>📓 {$t('emotion.diary')}</h2>
      {#each diaryEntries as entry}
        {@const em = EMOTIONS.find(e => e.id === entry.emotion)}
        <div class="diary-entry">
          <span class="diary-emoji">{em?.emoji || '❓'}</span>
          <div>
            <strong>{em ? $t(em.label) : entry.emotion}</strong>
            <span class="diary-time">{new Date(entry.time).toLocaleString()}</span>
            {#if entry.note}<p class="diary-note">{entry.note}</p>{/if}
          </div>
        </div>
      {/each}
      {#if diaryEntries.length === 0}
        <p class="empty">{$t('emotion.no_entries')}</p>
      {/if}
    </div>
  {:else if selectedEmotion}
    <div class="emotion-detail" transition:fade>
      <div class="detail-header" style="background: {ZONE_COLORS[selectedEmotion.zone]}20">
        <span class="detail-emoji">{selectedEmotion.emoji}</span>
        <h2>{$t(selectedEmotion.label)}</h2>
        <span class="zone-badge" style="background: {ZONE_COLORS[selectedEmotion.zone]}; color: white">
          {$t(ZONE_LABELS[selectedEmotion.zone])}
        </span>
      </div>

      <!-- Body map -->
      <div class="body-map">
        <h3>{$t('emotion.where_feel')}</h3>
        <div class="body-parts">
          {#each BODY_PARTS as part}
            <div class="body-part" class:highlighted={highlightedParts.includes(part)}
              style="--zc: {ZONE_COLORS[selectedEmotion.zone]}">
              <span class="bp-emoji">{part === 'head' ? '🧠' : part === 'face' ? '😶' : part === 'chest' ? '💗' : part === 'stomach' ? '🫃' : part === 'arms' ? '💪' : part === 'hands' ? '✋' : part === 'legs' ? '🦵' : '🧍'}</span>
              <span class="bp-label">{$t('emotion.body.' + part)}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Coping strategies -->
      <div class="strategies">
        <h3>💡 {$t('emotion.strategies')}</h3>
        {#each selectedEmotion.strategies as strat}
          <button class="strategy-card" onclick={() => speak($t(strat))}>
            <span>{$t(strat)}</span>
          </button>
        {/each}
      </div>

      <!-- Log it -->
      <div class="log-section">
        <h3>{$t('emotion.log_feeling')}</h3>
        <input type="text" bind:value={diaryNote} placeholder={$t('emotion.note_placeholder')} class="note-input" />
        <button class="log-btn" onclick={logEmotion}>{$t('emotion.log_btn')}</button>
      </div>
    </div>
  {:else}
    <!-- Emotion zones -->
    <div class="zones">
      {#each ['green', 'yellow', 'orange', 'red'] as zone}
        <div class="zone" style="--zc: {ZONE_COLORS[zone as keyof typeof ZONE_COLORS]}">
          <h3 class="zone-header">{$t(ZONE_LABELS[zone as keyof typeof ZONE_LABELS])}</h3>
          <div class="zone-emotions">
            {#each getZoneEmotions(zone) as em}
              <button class="emotion-btn" onclick={() => selectEmotion(em)} onfocus={() => speak($t(em.label))}>
                <span class="em-emoji">{em.emoji}</span>
                <span class="em-label">{$t(em.label)}</span>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <footer class="credit">
    Emotion zone concept inspired by evidence-based self-regulation frameworks.
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
  </footer>
</div>

<style>
  .emotion-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .icon-btn { width: 40px; height: 40px; font-size: 1.2em; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; }

  .zones { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; padding: 16px; flex: 1; }
  .zone {
    border: 2px solid var(--zc); border-radius: var(--radius); padding: 12px;
    background: color-mix(in srgb, var(--zc) 5%, transparent);
  }
  .zone-header { color: var(--zc); font-size: 0.9em; text-align: center; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .zone-emotions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
  .emotion-btn {
    display: flex; align-items: center; gap: 8px; padding: 10px 12px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm);
    transition: all 0.15s; font-weight: 500;
  }
  .emotion-btn:hover { border-color: var(--zc); transform: translateX(2px); }
  .em-emoji { font-size: 1.5em; }
  .em-label { font-size: 0.85em; }

  .emotion-detail { flex: 1; padding: 16px; }
  .detail-header { text-align: center; padding: 20px; border-radius: var(--radius); margin-bottom: 16px; }
  .detail-emoji { font-size: 4em; }
  .detail-header h2 { font-size: 1.5em; margin: 8px 0; }
  .zone-badge { padding: 4px 14px; border-radius: 100px; font-size: 0.8em; font-weight: 600; }

  .body-map { margin-bottom: 16px; }
  .body-map h3 { font-size: 1em; margin-bottom: 10px; }
  .body-parts { display: flex; flex-wrap: wrap; gap: 8px; }
  .body-part {
    display: flex; align-items: center; gap: 6px; padding: 8px 14px;
    border: 2px solid var(--border); border-radius: 100px; transition: all 0.2s;
  }
  .body-part.highlighted { border-color: var(--zc); background: color-mix(in srgb, var(--zc) 15%, transparent); font-weight: 600; }
  .bp-emoji { font-size: 1.2em; }
  .bp-label { font-size: 0.85em; }

  .strategies { margin-bottom: 16px; }
  .strategies h3 { font-size: 1em; margin-bottom: 10px; }
  .strategy-card {
    display: block; width: 100%; text-align: left; padding: 12px 16px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm);
    margin-bottom: 6px; font-size: 0.9em; transition: background 0.15s;
  }
  .strategy-card:hover { background: var(--bg-hover); }

  .log-section { margin-bottom: 16px; }
  .log-section h3 { font-size: 1em; margin-bottom: 10px; }
  .note-input {
    width: 100%; padding: 10px 14px; border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 0.9em; margin-bottom: 8px;
  }
  .log-btn {
    padding: 10px 24px; background: #3498DB; color: white; border-radius: var(--radius-sm);
    font-weight: 600; border: none;
  }

  .diary-panel { flex: 1; padding: 16px; }
  .diary-panel h2 { margin-bottom: 16px; }
  .diary-entry { display: flex; gap: 10px; padding: 10px; border-bottom: 1px solid var(--border); }
  .diary-emoji { font-size: 1.5em; }
  .diary-time { display: block; font-size: 0.75em; color: var(--text-muted); }
  .diary-note { font-size: 0.85em; margin-top: 4px; }
  .empty { color: var(--text-muted); text-align: center; padding: 40px; }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); line-height: 1.4; }
  .credit a { color: inherit; text-decoration: underline; }
</style>
