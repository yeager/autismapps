<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
  import RestTrainer from '$lib/components/RestTrainer.svelte';

  // === ReST-TRÄNAREN — Rapid Syllable Transition Training ===
  // Helps children with verbal dyspraxia (CAS) practice smooth
  // transitions between syllables. Focus on prosody: stress, rhythm, timing.
</script>

<WelcomeDialog
  appId="rest-trainer"
  titleKey="app.rest_trainer"
  purposeKey="welcome.restTrainer.purpose"
  howKey="welcome.restTrainer.how"
  goalKey="welcome.restTrainer.goal"
  icon="🗣️"
/>

<div class="app" in:fade>
  <main class="cnt">
    <div class="page-title">
      <button class="sub-back" onclick={() => goto(base + '/')} aria-label="Tillbaka">←</button>
      <h1>🗣️ {$t('restTrainer.title')}</h1>
    </div>

    <RestTrainer />
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height: 100dvh; display: flex; flex-direction: column; background: var(--bg); color: var(--text); }
  h1 { font-size: 1.4rem; margin: 0; flex: 1; }
  .cnt { flex: 1; padding: 1rem; max-width: 600px; margin: 0 auto; width: 100%; }
  .cr { text-align: center; padding: 0.5rem; font-size: 0.75rem; color: var(--text-secondary); }
</style>
