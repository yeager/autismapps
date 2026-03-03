<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';

  interface DiaryEntry {
    id: string;
    date: string;
    mood: string;
    text: string;
    emoji: string;
  }

  const MOODS = [
    { emoji: '😊', key: 'diary.mood.happy' },
    { emoji: '😐', key: 'diary.mood.okay' },
    { emoji: '😢', key: 'diary.mood.sad' },
    { emoji: '😡', key: 'diary.mood.angry' },
    { emoji: '😰', key: 'diary.mood.worried' },
    { emoji: '😴', key: 'diary.mood.tired' },
    { emoji: '🤩', key: 'diary.mood.excited' },
    { emoji: '🤒', key: 'diary.mood.sick' },
  ];

  let entries = $state<DiaryEntry[]>([]);
  let view = $state<'list' | 'new'>('list');
  let newMood = $state('');
  let newEmoji = $state('');
  let newText = $state('');

  $effect(() => { loadData(); });

  async function loadData() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'diary');
      if (data?.entries) entries = data.entries as DiaryEntry[];
    }
  }

  async function save() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'diary', { entries });
  }

  function selectMood(mood: typeof MOODS[0]) {
    newMood = $t(mood.key);
    newEmoji = mood.emoji;
    speak(newMood);
  }

  function saveEntry() {
    if (!newMood) return;
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString(),
      mood: newMood,
      text: newText,
      emoji: newEmoji,
    };
    entries = [entry, ...entries];
    if (entries.length > 100) entries = entries.slice(0, 100);
    save();
    speak($t('diary.saved'));
    newMood = '';
    newEmoji = '';
    newText = '';
    view = 'list';
  }

  function deleteEntry(id: string) {
    entries = entries.filter(e => e.id !== id);
    save();
  }
</script>

<WelcomeDialog appId="diary" titleKey="app.diary" purposeKey="welcome.diary.purpose" howKey="welcome.diary.how" goalKey="welcome.diary.goal" icon="📔" />

<div class="diary-page">
  <div class="page-title">
    {#if view !== 'list'}<button class="sub-back" onclick={() => { view = 'list' }} aria-label="Tillbaka">←</button>{/if}
    <h1>{$t('diary.title')}</h1>

    <button class="add-btn" onclick={() => (view = 'new')}>+ {$t('diary.new')}</button>

  </div>

  {#if view === 'new'}
    <div class="new-entry" transition:fade>
      <h2>{$t('diary.how_today')}</h2>
      <div class="mood-grid">
        {#each MOODS as mood}
          <button class="mood-btn" class:active={newEmoji === mood.emoji} onclick={() => selectMood(mood)}>
            <span class="mood-emoji">{mood.emoji}</span>
            <span class="mood-label">{$t(mood.key)}</span>
          </button>
        {/each}
      </div>

      {#if newMood}
        <textarea bind:value={newText} placeholder={$t('diary.what_happened')} rows="4"></textarea>
        <button class="save-btn" onclick={saveEntry}>💾 {$t('diary.save')}</button>
      {/if}
    </div>

  {:else}
    <div class="entry-list" transition:fade>
      {#each entries as entry}
        <div class="entry-card">
          <div class="entry-header">
            <span class="entry-emoji">{entry.emoji}</span>
            <span class="entry-mood">{entry.mood}</span>
            <span class="entry-date">{entry.date}</span>
            <button class="del-btn" onclick={() => deleteEntry(entry.id)}>✕</button>
          </div>
          {#if entry.text}
            <p class="entry-text">{entry.text}</p>
          {/if}
        </div>
      {/each}
      {#if entries.length === 0}
        <p class="empty">{$t('diary.empty')}</p>
      {/if}
    </div>
  {/if}

  <footer class="credit">{$t('diary.credit')}</footer>
</div>

<style>
  .diary-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .add-btn { padding: 8px 16px; border-radius: 100px; border: 2px solid #3498DB; color: #3498DB; font-weight: 700; background: none; min-height: 40px; }

  .new-entry { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .new-entry h2 { font-size: 1.3em; font-weight: 700; }
  .mood-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 400px; }
  .mood-btn {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 12px 8px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); min-height: 48px;
  }
  .mood-btn:hover { border-color: #3498DB; }
  .mood-btn.active { border-color: #27AE60; background: rgba(39,174,96,0.1); }
  .mood-emoji { font-size: 2em; }
  .mood-label { font-size: 0.7em; font-weight: 600; }

  textarea {
    width: 100%; max-width: 400px; padding: 12px; border: 2px solid var(--border);
    border-radius: var(--radius); font-size: 1em; resize: vertical; background: var(--bg-card);
  }
  .save-btn {
    padding: 14px 32px; background: #27AE60; color: white;
    border-radius: 100px; font-weight: 700; border: none; min-height: 48px;
  }

  .entry-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  .entry-card {
    padding: 14px; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .entry-header { display: flex; align-items: center; gap: 8px; }
  .entry-emoji { font-size: 1.5em; }
  .entry-mood { font-weight: 700; flex: 1; }
  .entry-date { font-size: 0.8em; color: var(--text-muted); }
  .entry-text { margin-top: 8px; color: var(--text-muted); font-size: 0.9em; }
  .del-btn { width: 28px; height: 28px; border-radius: 8px; border: none; color: var(--text-muted); background: none; }
  .del-btn:hover { color: #E74C3C; }
  .empty { text-align: center; padding: 40px; color: var(--text-muted); }
  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
</style>
