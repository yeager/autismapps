<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  interface Choice {
    id: string;
    text: string;
    emoji: string;
  }

  const EMOJI_OPTIONS = ['🟢', '🔵', '🟡', '🟠', '🔴', '🟣', '⭐', '🎯', '🌈', '🎪'];

  let choices = $state<Choice[]>([
    { id: '1', text: '', emoji: '🟢' },
    { id: '2', text: '', emoji: '🔵' },
  ]);
  let result = $state<Choice | null>(null);
  let spinning = $state(false);

  function addChoice() {
    const idx = choices.length;
    choices = [...choices, { id: crypto.randomUUID(), text: '', emoji: EMOJI_OPTIONS[idx % EMOJI_OPTIONS.length] }];
  }

  function removeChoice(id: string) {
    if (choices.length <= 2) return;
    choices = choices.filter(c => c.id !== id);
  }

  function updateText(id: string, text: string) {
    choices = choices.map(c => c.id === id ? { ...c, text } : c);
  }

  function randomize() {
    const filled = choices.filter(c => c.text.trim());
    if (filled.length < 2) return;

    spinning = true;
    result = null;

    // Visual spin effect
    let count = 0;
    const interval = setInterval(() => {
      result = filled[count % filled.length];
      count++;
      if (count > 10 + Math.random() * 5) {
        clearInterval(interval);
        spinning = false;
        const winner = filled[Math.floor(Math.random() * filled.length)];
        result = winner;
        speak(winner.text);
      }
    }, 120);
  }

  function reset() {
    result = null;
    choices = [
      { id: '1', text: '', emoji: '🟢' },
      { id: '2', text: '', emoji: '🔵' },
    ];
  }
</script>

<WelcomeDialog appId="chooser" titleKey="app.chooser" purposeKey="welcome.chooser.purpose" howKey="welcome.chooser.how" goalKey="welcome.chooser.goal" icon="🎯" />

<div class="chooser-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('chooser.title')}</h1>
  </header>

  <div class="content" transition:fade>
    <p class="instruction">{$t('chooser.instruction')}</p>

    <div class="choices-list">
      {#each choices as choice, i}
        <div class="choice-row">
          <span class="choice-emoji">{choice.emoji}</span>
          <input type="text" class="choice-input"
            placeholder="{$t('chooser.option')} {i + 1}"
            value={choice.text}
            oninput={(e: Event) => updateText(choice.id, (e.target as HTMLInputElement).value)}>
          {#if choices.length > 2}
            <button class="del-btn" onclick={() => removeChoice(choice.id)}>✕</button>
          {/if}
        </div>
      {/each}
    </div>

    <button class="add-choice" onclick={addChoice}>+ {$t('chooser.add_option')}</button>

    <div class="action-area">
      <button class="choose-btn" onclick={randomize} disabled={spinning || choices.filter(c => c.text.trim()).length < 2}>
        🎲 {$t('chooser.choose')}
      </button>
    </div>

    {#if result && !spinning}
      <div class="result" transition:fade>
        <span class="result-emoji">{result.emoji}</span>
        <h2 class="result-text">{result.text}</h2>
        <button class="replay-btn" onclick={() => { if (result) speak(result.text); }}>🔊</button>
      </div>
      <button class="reset-btn" onclick={reset}>🔄 {$t('chooser.new_choice')}</button>
    {:else if spinning && result}
      <div class="spinning-display">
        <span class="spin-emoji">{result.emoji}</span>
        <span class="spin-text">{result.text}</span>
      </div>
    {/if}
  </div>

  <footer class="credit">{$t('chooser.credit')}</footer>
</div>

<style>
  .chooser-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }

  .content { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .instruction { text-align: center; color: var(--text-muted); font-weight: 600; }

  .choices-list { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 400px; }
  .choice-row { display: flex; align-items: center; gap: 10px; }
  .choice-emoji { font-size: 1.5em; width: 40px; text-align: center; }
  .choice-input {
    flex: 1; padding: 14px 16px; border: 2px solid var(--border); border-radius: 14px;
    font-size: 1.1em; font-weight: 600; background: var(--bg-card);
  }
  .choice-input:focus { border-color: #3498DB; }
  .del-btn { width: 36px; height: 36px; border-radius: 10px; border: none; color: var(--text-muted); background: none; font-size: 1.1em; }
  .del-btn:hover { color: #E74C3C; background: rgba(231,76,60,0.1); }

  .add-choice {
    padding: 10px 20px; border: 2px dashed var(--border); border-radius: 100px;
    color: var(--text-muted); font-weight: 600; background: none; min-height: 48px;
  }
  .add-choice:hover { border-color: #3498DB; color: #3498DB; }

  .action-area { margin: 8px 0; }
  .choose-btn {
    padding: 18px 48px; background: #9B59B6; color: white; border: none;
    border-radius: 100px; font-weight: 800; font-size: 1.2em; min-height: 48px;
    transition: transform 0.15s;
  }
  .choose-btn:hover:not(:disabled) { transform: scale(1.05); }
  .choose-btn:disabled { opacity: 0.5; }

  .result {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 32px; background: var(--bg-card); border: 3px solid #27AE60;
    border-radius: 24px; box-shadow: var(--shadow-lg); width: 100%; max-width: 360px;
  }
  .result-emoji { font-size: 3em; }
  .result-text { font-size: 1.8em; font-weight: 800; text-align: center; }
  .replay-btn { background: none; border: none; font-size: 1.5em; min-width: 48px; min-height: 48px; }

  .spinning-display {
    display: flex; align-items: center; gap: 12px; padding: 20px;
    font-size: 1.3em; font-weight: 700; opacity: 0.6;
  }
  .spin-emoji { font-size: 1.5em; }

  .reset-btn {
    padding: 10px 24px; border: 1px solid var(--border); border-radius: 100px;
    font-weight: 600; background: var(--bg-card); min-height: 48px;
  }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }

  @media (prefers-reduced-motion: reduce) {
    .choose-btn { transition: none; }
  }
</style>
