<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  interface Guide {
    name: string;
    key: string;
    steps: { emoji: string; text: string }[];
  }

  const GUIDES: Guide[] = [
    { name: 'guide.wash_hands', key: 'wash', steps: [
      { emoji: '🚰', text: 'guide.step.turn_on_water' },
      { emoji: '🧴', text: 'guide.step.soap' },
      { emoji: '🤲', text: 'guide.step.rub_20' },
      { emoji: '💦', text: 'guide.step.rinse' },
      { emoji: '🧻', text: 'guide.step.dry' },
    ]},
    { name: 'guide.brush_teeth', key: 'teeth', steps: [
      { emoji: '🪥', text: 'guide.step.wet_brush' },
      { emoji: '🦷', text: 'guide.step.paste' },
      { emoji: '😁', text: 'guide.step.front_teeth' },
      { emoji: '🦷', text: 'guide.step.back_teeth' },
      { emoji: '👅', text: 'guide.step.tongue' },
      { emoji: '💦', text: 'guide.step.rinse_mouth' },
    ]},
    { name: 'guide.get_dressed', key: 'dressed', steps: [
      { emoji: '🩲', text: 'guide.step.underwear' },
      { emoji: '🧦', text: 'guide.step.socks' },
      { emoji: '👖', text: 'guide.step.pants' },
      { emoji: '👕', text: 'guide.step.shirt' },
      { emoji: '🧥', text: 'guide.step.sweater' },
      { emoji: '👟', text: 'guide.step.shoes' },
    ]},
    { name: 'guide.pack_bag', key: 'bag', steps: [
      { emoji: '📚', text: 'guide.step.books' },
      { emoji: '✏️', text: 'guide.step.pencil_case' },
      { emoji: '🍎', text: 'guide.step.snack' },
      { emoji: '💧', text: 'guide.step.water_bottle' },
      { emoji: '🎒', text: 'guide.step.close_bag' },
    ]},
  ];

  let activeGuide = $state<Guide | null>(null);
  let stepIdx = $state(0);

  function openGuide(g: Guide) {
    activeGuide = g;
    stepIdx = 0;
    speak($t(g.steps[0].text));
  }

  function nextStep() {
    if (!activeGuide) return;
    if (stepIdx < activeGuide.steps.length - 1) {
      stepIdx++;
      speak($t(activeGuide.steps[stepIdx].text));
    }
  }

  function prevStep() {
    if (stepIdx > 0) {
      stepIdx--;
      if (activeGuide) speak($t(activeGuide.steps[stepIdx].text));
    }
  }

  function goBack() {
    if (activeGuide) { activeGuide = null; }
    else goto('/');
  }
</script>

<div class="guide-page">
  <header class="app-header">
    <button class="back-btn" onclick={goBack} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{activeGuide ? $t(activeGuide.name) : $t('guide.title')}</h1>
  </header>

  {#if !activeGuide}
    <div class="guide-list" transition:fade>
      <p class="instruction">{$t('guide.pick')}</p>
      <div class="guide-grid">
        {#each GUIDES as g}
          <button class="guide-card" onclick={() => openGuide(g)}>
            <span class="guide-emoji">{g.steps[0].emoji}</span>
            <h3>{$t(g.name)}</h3>
            <span class="step-count">{g.steps.length} {$t('guide.steps')}</span>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="step-view" transition:fade>
      <div class="progress-dots">
        {#each activeGuide.steps as _, i}
          <span class="dot" class:done={i < stepIdx} class:current={i === stepIdx}></span>
        {/each}
      </div>

      
      <div class="step-card">
        <span class="step-num">{stepIdx + 1}/{activeGuide.steps.length}</span>
        <span class="step-emoji-big">{activeGuide.steps[stepIdx].emoji}</span>
        <p class="step-text">{$t(activeGuide.steps[stepIdx].text)}</p>
      </div>

      <div class="step-nav">
        <button class="nav-btn" onclick={prevStep} disabled={stepIdx === 0}>⬅️</button>
        <button class="speak-btn" onclick={() => speak($t(activeGuide.steps[stepIdx].text))}>🔊</button>
        <button class="nav-btn" onclick={nextStep} disabled={stepIdx >= activeGuide.steps.length - 1}>➡️</button>
      </div>

      {#if stepIdx >= activeGuide.steps.length - 1}
        <div class="done-msg">🎉 {$t('guide.all_done')}</div>
      {/if}
    </div>
  {/if}

  <footer class="credit">{$t('guide.credit')}</footer>
</div>

<style>
  .guide-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .instruction { text-align: center; padding: 16px; color: var(--text-muted); font-weight: 600; }
  .guide-list { flex: 1; padding: 16px; }
  .guide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
  .guide-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; border: 2px solid var(--border); border-radius: var(--radius); background: var(--bg-card); min-height: 48px; }
  .guide-card:hover { border-color: #3498DB; transform: translateY(-2px); }
  .guide-emoji { font-size: 2.5em; }
  .guide-card h3 { font-size: 0.95em; font-weight: 700; text-align: center; }
  .step-count { font-size: 0.75em; color: var(--text-muted); }

  .step-view { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .progress-dots { display: flex; gap: 8px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; background: var(--border); }
  .dot.done { background: #27AE60; }
  .dot.current { background: #3498DB; transform: scale(1.3); }

  .step-card { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 32px; background: var(--bg-card); border-radius: 24px; box-shadow: var(--shadow-lg); max-width: 350px; width: 100%; position: relative; }
  .step-num { position: absolute; top: 12px; right: 16px; font-size: 0.8em; color: var(--text-muted); font-weight: 600; }
  .step-emoji-big { font-size: 4em; }
  .step-text { font-size: 1.4em; font-weight: 700; text-align: center; }

  .step-nav { display: flex; gap: 16px; align-items: center; }
  .nav-btn { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--border); font-size: 1.5em; background: var(--bg-card); min-height: 48px; }
  .nav-btn:disabled { opacity: 0.3; }
  .speak-btn { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #3498DB; font-size: 1.3em; background: rgba(52,152,219,0.1); }

  .done-msg { font-size: 1.3em; font-weight: 700; color: #27AE60; }
  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
</style>
