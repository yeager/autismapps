<script lang="ts">
  import TrafficSafetyApp from '$lib/components/traffic-safety/TrafficSafetyApp.svelte';
  import { locale, t } from '$lib/i18n';
  
  // Follows the app locale (sv, en, pt_BR…); the app falls back to en for unknown locales
  let preferredLanguage = $state<string>($locale);
  
  $effect(() => {
    preferredLanguage = $locale;
  });
</script>

<svelte:head>
  <title>{$t('app.traffic_safety')} — {$t('app.title.brand')}</title>
  <meta name="description" content={$t('app.traffic_safety.desc')} />
</svelte:head>

<TrafficSafetyApp bind:lang={preferredLanguage} />
