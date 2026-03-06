<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import ProsodyTrainer from '$lib/components/ProsodyTrainer.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
</script>

<svelte:head>
  <title>{$t('prosody.title')} — Autismappar</title>
</svelte:head>

<WelcomeDialog
  appId="prosody-trainer"
  titleKey="app.prosody_trainer"
  purposeKey="welcome.prosodyTrainer.purpose"
  howKey="welcome.prosodyTrainer.how"
  goalKey="welcome.prosodyTrainer.goal"
  icon="🎶"
/>

<ProsodyTrainer
  t={$t}
  {speak}
  on:back={() => goto(base + '/')}
/>
