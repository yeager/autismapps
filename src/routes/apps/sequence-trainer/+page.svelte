<script lang="ts">
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import SequenceTrainer from '$lib/components/SequenceTrainer.svelte';
</script>

<WelcomeDialog
  appId="sequence-trainer"
  titleKey="app.sequence_trainer"
  purposeKey="welcome.sequenceTrainer.purpose"
  howKey="welcome.sequenceTrainer.how"
  goalKey="welcome.sequenceTrainer.goal"
  icon="🔢"
/>

<SequenceTrainer />
