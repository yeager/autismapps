<script lang="ts">
  type TrafficSafetyCopy = {
    title?: string;
    welcome?: { purpose?: string; how?: string; goal?: string };
    common?: { start?: string };
  };

  let { i18n = {}, visible = true, onstart = () => {} } = $props<{
    i18n?: TrafficSafetyCopy;
    visible?: boolean;
    onstart?: () => void;
  }>();
</script>

{#if visible}
<div class="overlay">
  <div class="dialog">
    <h2>🚦 {i18n.title || 'Traffic Safety'}</h2>
    <p>{i18n.welcome?.purpose || ''}</p>
    <p>{i18n.welcome?.how || ''}</p>
    <p>{i18n.welcome?.goal || ''}</p>
    <button onclick={onstart}>{i18n.common?.start || 'Start'}</button>
  </div>
</div>
{/if}

<style>
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:100; }
  .dialog { background:white; border-radius:16px; padding:32px; max-width:440px; text-align:center; }
  .dialog h2 { font-size:28px; margin-bottom:12px; }
  .dialog p { font-size:18px; color:#555; margin-bottom:24px; }
  button { background:#4CAF50; color:white; border:none; border-radius:12px; padding:16px 48px; font-size:20px; cursor:pointer; min-height:48px; }
  button:hover { background:#388E3C; }
</style>
