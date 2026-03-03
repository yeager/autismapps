<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  interface Recipe {
    name: string;
    icon: string;
    steps: { emoji: string; text: string }[];
  }

  const RECIPES: Recipe[] = [
    { name: 'cook.sandwich', icon: '🥪', steps: [
      { emoji: '🍞', text: 'cook.step.bread' },
      { emoji: '🧈', text: 'cook.step.butter' },
      { emoji: '🧀', text: 'cook.step.cheese' },
      { emoji: '🥒', text: 'cook.step.veggies' },
      { emoji: '🍞', text: 'cook.step.top_bread' },
      { emoji: '🔪', text: 'cook.step.cut_half' },
    ]},
    { name: 'cook.smoothie', icon: '🥤', steps: [
      { emoji: '🍌', text: 'cook.step.banana' },
      { emoji: '🍓', text: 'cook.step.berries' },
      { emoji: '🥛', text: 'cook.step.milk' },
      { emoji: '🔌', text: 'cook.step.blend' },
      { emoji: '🥤', text: 'cook.step.pour_glass' },
    ]},
    { name: 'cook.pasta', icon: '🍝', steps: [
      { emoji: '🫗', text: 'cook.step.boil_water' },
      { emoji: '🍝', text: 'cook.step.add_pasta' },
      { emoji: '⏱️', text: 'cook.step.wait_10' },
      { emoji: '🥄', text: 'cook.step.drain' },
      { emoji: '🧈', text: 'cook.step.add_sauce' },
      { emoji: '🧀', text: 'cook.step.sprinkle_cheese' },
    ]},
    { name: 'cook.oatmeal', icon: '🥣', steps: [
      { emoji: '🥣', text: 'cook.step.oats_bowl' },
      { emoji: '🥛', text: 'cook.step.add_milk_oats' },
      { emoji: '📺', text: 'cook.step.microwave_2' },
      { emoji: '🍯', text: 'cook.step.add_honey' },
      { emoji: '🍎', text: 'cook.step.add_fruit' },
    ]},
  ];

  let activeRecipe = $state<Recipe | null>(null);
  let stepIdx = $state(0);

  function openRecipe(r: Recipe) {
    activeRecipe = r;
    stepIdx = 0;
    speak($t(r.steps[0].text));
  }

  function nextStep() {
    if (!activeRecipe || stepIdx >= activeRecipe.steps.length - 1) return;
    stepIdx++;
    speak($t(activeRecipe.steps[stepIdx].text));
  }

  function prevStep() {
    if (stepIdx > 0) {
      stepIdx--;
      if (activeRecipe) speak($t(activeRecipe.steps[stepIdx].text));
    }
  }
</script>

<WelcomeDialog appId="cooking-helper" titleKey="app.cooking_helper" purposeKey="welcome.cookingHelper.purpose" howKey="welcome.cookingHelper.how" goalKey="welcome.cookingHelper.goal" icon="👨‍🍳" />

<div class="cook-page">
  <div class="page-title">
    {#if activeRecipe}<button class="sub-back" onclick={() => { activeRecipe = null }} aria-label="Tillbaka">←</button>{/if}
    <h1>{activeRecipe ? $t(activeRecipe.name) : $t('cook.title')}</h1>

  </div>

  {#if !activeRecipe}
    <div class="recipe-list" transition:fade>
      <p class="instruction">{$t('cook.pick')}</p>
      <div class="recipe-grid">
        {#each RECIPES as r}
          <button class="recipe-card" onclick={() => openRecipe(r)}>
            <span class="recipe-icon">{r.icon}</span>
            <h3>{$t(r.name)}</h3>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="step-view" transition:fade>
      <div class="progress-dots">
        {#each activeRecipe.steps as _, i}
          <span class="dot" class:done={i < stepIdx} class:current={i === stepIdx}></span>
        {/each}
      </div>

      <div class="step-card">
        <span class="step-num">{stepIdx + 1}/{activeRecipe.steps.length}</span>
        <span class="step-emoji">{activeRecipe.steps[stepIdx].emoji}</span>
        <p class="step-text">{$t(activeRecipe.steps[stepIdx].text)}</p>
      </div>

      <div class="step-nav">
        <button class="nav-btn" onclick={prevStep} disabled={stepIdx === 0}>⬅️</button>
        <button class="speak-btn" onclick={() => speak($t(activeRecipe.steps[stepIdx].text))}>🔊</button>
        <button class="nav-btn" onclick={nextStep} disabled={stepIdx >= activeRecipe.steps.length - 1}>➡️</button>
      </div>

      {#if stepIdx >= activeRecipe.steps.length - 1}
        <div class="done-msg">🎉 {$t('cook.done')}</div>
      {/if}
    </div>
  {/if}

  <footer class="credit">{$t('cook.credit')}</footer>
</div>

<style>
  .cook-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .instruction { text-align: center; padding: 16px; color: var(--text-muted); font-weight: 600; }
  .recipe-list { flex: 1; padding: 16px; }
  .recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
  .recipe-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; border: 2px solid var(--border); border-radius: var(--radius); background: var(--bg-card); min-height: 48px; }
  .recipe-card:hover { border-color: #E67E22; transform: translateY(-2px); }
  .recipe-icon { font-size: 3em; }
  .recipe-card h3 { font-size: 0.95em; font-weight: 700; }

  .step-view { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .progress-dots { display: flex; gap: 8px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; background: var(--border); }
  .dot.done { background: #27AE60; }
  .dot.current { background: #E67E22; transform: scale(1.3); }
  .step-card { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 32px; background: var(--bg-card); border-radius: 24px; box-shadow: var(--shadow-lg); max-width: 350px; width: 100%; position: relative; }
  .step-num { position: absolute; top: 12px; right: 16px; font-size: 0.8em; color: var(--text-muted); }
  .step-emoji { font-size: 4em; }
  .step-text { font-size: 1.4em; font-weight: 700; text-align: center; }
  .step-nav { display: flex; gap: 16px; }
  .nav-btn { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--border); font-size: 1.5em; background: var(--bg-card); }
  .nav-btn:disabled { opacity: 0.3; }
  .speak-btn { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #E67E22; font-size: 1.3em; background: rgba(230,126,34,0.1); }
  .done-msg { font-size: 1.3em; font-weight: 700; color: #27AE60; }
  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
</style>
