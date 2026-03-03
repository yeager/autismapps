<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
</script>

<div class="offline" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)}>←</button>
    <h1>📲 {$t('offline.title')}</h1>
  </header>

  <main class="cnt">
    <section class="hero">
      <p class="intro">{$t('offline.intro')}</p>
    </section>

    <section class="section">
      <h2>✅ {$t('offline.how_it_works')}</h2>
      <p>{$t('offline.how_it_works_desc')}</p>
    </section>

    <section class="section">
      <h2>📱 {$t('offline.install_title')}</h2>
      <p>{$t('offline.install_desc')}</p>

      <div class="device-card">
        <h3>🍎 iPhone / iPad</h3>
        <ol>
          <li>{$t('offline.ios_step1')}</li>
          <li>{$t('offline.ios_step2')}</li>
          <li>{$t('offline.ios_step3')}</li>
          <li>{$t('offline.ios_step4')}</li>
        </ol>
      </div>

      <div class="device-card">
        <h3>🤖 Android</h3>
        <ol>
          <li>{$t('offline.android_step1')}</li>
          <li>{$t('offline.android_step2')}</li>
          <li>{$t('offline.android_step3')}</li>
        </ol>
      </div>

      <div class="device-card">
        <h3>💻 {$t('offline.desktop_title')}</h3>
        <ol>
          <li>{$t('offline.desktop_step1')}</li>
          <li>{$t('offline.desktop_step2')}</li>
          <li>{$t('offline.desktop_step3')}</li>
        </ol>
      </div>
    </section>

    <section class="section">
      <h2>🔄 {$t('offline.update_title')}</h2>
      <p>{$t('offline.update_desc')}</p>
    </section>

    <section class="section">
      <h2>🛠️ {$t('offline.troubleshoot_title')}</h2>
      <p>{$t('offline.troubleshoot_desc')}</p>
      <ul>
        <li>{$t('offline.troubleshoot_tip1')}</li>
        <li>{$t('offline.troubleshoot_tip2')}</li>
        <li>{$t('offline.troubleshoot_tip3')}</li>
      </ul>
    </section>
  </main>
</div>

<style>
  .offline { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; }
  .cnt { flex:1; padding:1.5rem 1rem; max-width:640px; margin:0 auto; width:100%; }
  .intro { font-size:1.2rem; text-align:center; color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.6; }
  .section { margin-bottom:2rem; }
  h2 { font-size:1.3rem; margin-bottom:.75rem; }
  h3 { font-size:1.15rem; margin:0 0 .5rem; }
  p { line-height:1.7; font-size:1.05rem; }
  ul { padding-left:1.25rem; line-height:2; font-size:1.05rem; }
  ol { padding-left:1.25rem; line-height:2; font-size:1.05rem; }
  .device-card { padding:1.25rem; margin-bottom:1rem; border:2px solid var(--border); border-radius:14px; background:var(--bg-card); }
</style>
