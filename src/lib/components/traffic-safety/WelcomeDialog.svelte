<script>
  let { i18n = {}, visible = true, onstart = () => {} } = $props();
</script>

{#if visible}
<div class="overlay">
  <div class="dialog">
    <h2>🚦 Trafiksäkerhet</h2>
    <p>Lär dig om trafiksäkerhet med interaktiva övningar.</p>
    <button onclick={onstart}>Börja!</button>
  </div>
</div>
{/if}

<style>
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:100; }
  .dialog { background:white; border-radius:16px; padding:32px; max-width:400px; text-align:center; }
  .dialog h2 { font-size:28px; margin-bottom:12px; }
  .dialog p { font-size:18px; color:#555; margin-bottom:24px; }
  button { background:#4CAF50; color:white; border:none; border-radius:12px; padding:16px 48px; font-size:20px; cursor:pointer; min-height:48px; }
  button:hover { background:#388E3C; }
</style>
