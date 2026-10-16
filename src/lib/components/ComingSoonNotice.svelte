<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import type { AppDef } from '$lib/apps';

  let { app }: { app: AppDef } = $props();
  let heading: HTMLHeadingElement | undefined = $state();

  onMount(() => heading?.focus());
</script>

<section class="coming-soon-notice">
  <img src={`${base}${app.icon}`} alt="" width="96" height="96" />
  <h1 tabindex="-1" bind:this={heading}>{$t(app.name)}</h1>
  <p role="status">{$t('app.coming_soon_locale')}</p>
  <button class="home-btn" onclick={() => goto(base + '/')} onfocus={() => speak($t('app.go_home'))}>
    {$t('app.go_home')}
  </button>
</section>

<style>
  .coming-soon-notice {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; padding: 48px 20px; text-align: center; min-height: 60dvh;
  }
  .coming-soon-notice img { border-radius: 24px; opacity: 0.85; }
  .coming-soon-notice h1 { margin: 0; font-size: 1.6em; outline: none; }
  .coming-soon-notice p { margin: 0; max-width: 420px; color: var(--text-muted); line-height: 1.5; }
  .home-btn {
    min-height: 48px; padding: 12px 28px; border-radius: 100px; border: 1px solid var(--border);
    background: var(--bg-card); font-weight: 700; font-size: 1em;
  }
</style>
