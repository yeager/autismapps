<script lang="ts">
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
</script>

<div class="material-page">
  <h1>📄 {$t('material.title')}</h1>
  <p class="intro">{$t('material.intro')}</p>

  <div class="cards">
    <a href="{base}/material/autismappar-handout-sv.pdf" class="card" download>
      <span class="flag">🇸🇪</span>
      <div>
        <h2>{$t('material.handout_sv')}</h2>
        <p>{$t('material.handout_sv_desc')}</p>
      </div>
      <span class="dl">⬇️</span>
    </a>

    <a href="{base}/material/autismappar-handout-en.pdf" class="card" download>
      <span class="flag">🇬🇧</span>
      <div>
        <h2>{$t('material.handout_en')}</h2>
        <p>{$t('material.handout_en_desc')}</p>
      </div>
      <span class="dl">⬇️</span>
    </a>
  </div>

  <p class="license">{$t('material.license')}</p>
</div>

<style>
  .material-page {
    max-width: 700px; margin: 0 auto; padding: 24px 16px;
  }
  h1 { font-size: 1.8em; margin-bottom: 8px; }
  .intro { font-size: 1.1em; color: var(--text-muted, #555); margin-bottom: 24px; line-height: 1.6; }
  .cards { display: flex; flex-direction: column; gap: 16px; }
  .card {
    display: flex; align-items: center; gap: 16px;
    padding: 20px; border-radius: 16px;
    border: 2px solid var(--border, #ddd);
    background: var(--bg-card, #fff);
    text-decoration: none; color: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-height: 80px;
  }
  .card:hover { border-color: #3498db; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .flag { font-size: 2.5em; flex-shrink: 0; }
  .card h2 { font-size: 1.2em; margin: 0 0 4px; }
  .card p { margin: 0; font-size: 0.95em; color: var(--text-muted, #666); }
  .dl { font-size: 1.5em; margin-left: auto; flex-shrink: 0; }
  .license { margin-top: 24px; font-size: 0.85em; color: var(--text-muted, #888); }
</style>
