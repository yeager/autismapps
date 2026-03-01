<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';
</script>

<div class="about" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto(`${base}/`)}>←</button>
    <h1>🧩 {$t('about.title')}</h1>
  </header>

  <main class="cnt">
    <section class="hero-section">
      <p class="tagline">{$t('about.tagline')}</p>
    </section>

    <section class="stats">
      <div class="stat"><span class="stat-num">42</span><span class="stat-label">{$t('about.apps')}</span></div>
      <div class="stat"><span class="stat-num">2</span><span class="stat-label">{$t('about.languages')}</span></div>
      <div class="stat"><span class="stat-num">100%</span><span class="stat-label">{$t('about.free')}</span></div>
    </section>

    <section class="section">
      <h2>{$t('about.whatIs')}</h2>
      <p>{$t('about.description')}</p>
    </section>

    <section class="section">
      <h2>{$t('about.forWhom')}</h2>
      <ul>
        <li>{$t('about.audience.children')}</li>
        <li>{$t('about.audience.parents')}</li>
        <li>{$t('about.audience.teachers')}</li>
        <li>{$t('about.audience.therapists')}</li>
      </ul>
    </section>

    <section class="section">
      <h2>{$t('about.methods')}</h2>
      <div class="methods-grid">
        <div class="method"><strong>AAC</strong><p>{$t('about.method.aac')}</p></div>
        <div class="method"><strong>TEACCH</strong><p>{$t('about.method.teacch')}</p></div>
        <div class="method"><strong>PECS</strong><p>{$t('about.method.pecs')}</p></div>
        <div class="method"><strong>LAMP</strong><p>{$t('about.method.lamp')}</p></div>
      </div>
    </section>

    <section class="section">
      <h2>{$t('about.features')}</h2>
      <ul>
        <li>🔊 {$t('about.feat.tts')}</li>
        <li>📱 {$t('about.feat.pwa')}</li>
        <li>🌍 {$t('about.feat.i18n')}</li>
        <li>♿ {$t('about.feat.a11y')}</li>
        <li>🔒 {$t('about.feat.privacy')}</li>
        <li>🆓 {$t('about.feat.free')}</li>
      </ul>
    </section>

    <section class="section">
      <h2>{$t('about.credits')}</h2>
      <ul class="credits-list">
        <li><a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — {$t('about.credit.arasaac')}</li>
        <li><a href="https://teckensprakslexikon.su.se" target="_blank" rel="noopener">Svenskt teckenspråkslexikon</a> — {$t('about.credit.signs')}</li>
        <li><a href="https://github.com/rhasspy/piper" target="_blank" rel="noopener">Piper</a> — {$t('about.credit.piper')}</li>
      </ul>
    </section>

    <section class="section developer">
      <h2>{$t('about.developer')}</h2>
      <p><strong>Daniel Nylander</strong></p>
      <div class="links">
        <a href="mailto:daniel@danielnylander.se">✉️ daniel@danielnylander.se</a>
        <a href="https://github.com/yeager" target="_blank" rel="noopener">🐙 github.com/yeager</a>
        <a href="https://danielnylander.se" target="_blank" rel="noopener">🌐 danielnylander.se</a>
      </div>
    </section>

    <section class="section">
      <p class="made-in">🇸🇪 {$t('about.madeIn')}</p>
      <p class="license">CC BY-NC-SA 4.0</p>
    </section>
  </main>
</div>

<style>
  .about { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; }
  .cnt { flex:1; padding:1.5rem 1rem; max-width:640px; margin:0 auto; width:100%; }
  .tagline { font-size:1.2rem; text-align:center; color:var(--text-secondary); margin-bottom:1.5rem; font-style:italic; }
  .stats { display:flex; justify-content:center; gap:2rem; margin-bottom:2rem; }
  .stat { text-align:center; }
  .stat-num { display:block; font-size:2.5rem; font-weight:800; color:var(--accent, #2196f3); }
  .stat-label { font-size:.85rem; color:var(--text-secondary); }
  .section { margin-bottom:2rem; }
  h2 { font-size:1.2rem; margin-bottom:.75rem; }
  p { line-height:1.6; }
  ul { padding-left:1.25rem; line-height:1.8; }
  .methods-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
  .method { padding:1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); }
  .method strong { display:block; margin-bottom:.25rem; }
  .method p { font-size:.9rem; margin:0; color:var(--text-secondary); }
  .credits-list a { color:var(--accent, #2196f3); }
  .developer { text-align:center; }
  .links { display:flex; flex-direction:column; gap:.5rem; margin-top:.75rem; }
  .links a { color:var(--text-secondary); text-decoration:none; }
  .links a:hover { color:var(--text); }
  .made-in { text-align:center; font-size:1.1rem; font-weight:600; }
  .license { text-align:center; color:var(--text-secondary); font-size:.85rem; }
</style>
