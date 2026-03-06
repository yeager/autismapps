<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import TongueViewer from '$lib/components/TongueViewer.svelte';
  import { t } from '$lib/i18n';
</script>

<svelte:head>
  <title>{$t('tongueViewer.title')}</title>
  <meta name="description" content={$t('tongueViewer.purpose')} />
</svelte:head>

<WelcomeDialog
  appId="tongue-viewer"
  titleKey="tongueViewer.title"
  purposeKey="tongueViewer.purpose"
  howKey="tongueViewer.how"
  goalKey="tongueViewer.goal"
  icon="👅"
/>

<TongueViewer />
