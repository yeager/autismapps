<script lang="ts">
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import PromptGuide from '$lib/components/PromptGuide.svelte';
</script>

<WelcomeDialog
  appId="prompt-guide"
  titleKey="app.prompt_guide"
  purposeKey="welcome.promptGuide.purpose"
  howKey="welcome.promptGuide.how"
  goalKey="welcome.promptGuide.goal"
  icon="🤲"
/>

<PromptGuide />
