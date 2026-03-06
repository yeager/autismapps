<script>
  import { onMount } from 'svelte';
  import TrafficSafetyApp from '$lib/components/traffic-safety/TrafficSafetyApp.svelte';
  import { browser } from '$app/environment';
  
  let preferredLanguage = $state('sv');
  
  onMount(() => {
    if (browser) {
      const browserLang = navigator.language.slice(0, 2);
      preferredLanguage = browserLang === 'sv' ? 'sv' : 'en';
      const savedLang = localStorage.getItem('traffic-safety-language');
      if (savedLang && ['sv', 'en'].includes(savedLang)) {
        preferredLanguage = savedLang;
      }
    }
  });
  
  $effect(() => {
    if (browser && preferredLanguage) {
      localStorage.setItem('traffic-safety-language', preferredLanguage);
    }
  });
</script>

<svelte:head>
  <title>Trafiksäkerhet</title>
  <meta name="description" content="Lär dig trafiksäkerhet för barn med autism." />
</svelte:head>

<TrafficSafetyApp bind:lang={preferredLanguage} />
