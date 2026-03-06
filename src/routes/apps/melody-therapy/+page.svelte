<script lang="ts">
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import MelodyTherapy from '$lib/components/MelodyTherapy.svelte';
</script>

<WelcomeDialog
  appId="melody-therapy"
  titleKey="app.melody_therapy"
  purposeKey="welcome.melodyTherapy.purpose"
  howKey="welcome.melodyTherapy.how"
  goalKey="welcome.melodyTherapy.goal"
  icon="🎵"
/>

<MelodyTherapy />
