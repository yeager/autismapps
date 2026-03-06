<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import MouthMotor from '$lib/components/MouthMotor.svelte';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
</script>

<WelcomeDialog
  appId="mouth-motor"
  titleKey="app.mouth_motor"
  purposeKey="welcome.mouthMotor.purpose"
  howKey="welcome.mouthMotor.how"
  goalKey="welcome.mouthMotor.goal"
  icon="👅"
/>

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(base + '/')}>←</button>
    <h1>👅 {$t('mouthMotor.title')}</h1>
  </header>

  <main class="cnt">
    <p class="intro">{$t('mouthMotor.intro')}</p>
    <MouthMotor />
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height: 100dvh; display: flex; flex-direction: column; background: var(--bg); color: var(--text); }
  .hdr { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--bg-card); border-bottom: 1px solid var(--border); }
  .back { font-size: 1.5rem; background: none; border: none; cursor: pointer; color: var(--text); min-width: 48px; min-height: 48px; display: flex; align-items: center; justify-content: center; }
  h1 { font-size: 1.4rem; margin: 0; flex: 1; }
  .cnt { flex: 1; padding: 1rem; max-width: 640px; margin: 0 auto; width: 100%; }
  .intro { text-align: center; color: var(--text-secondary); margin-bottom: 1rem; font-size: 1.05rem; line-height: 1.5; }
  .cr { text-align: center; padding: 0.5rem; font-size: 0.75rem; color: var(--text-secondary); }
</style>
