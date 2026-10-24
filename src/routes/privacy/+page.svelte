<script lang="ts">
  import { base } from '$app/paths';
  import { locale, t } from '$lib/i18n';
  import { PRIVACY_POLICIES } from '$lib/data/privacy-policy';

  const policy = $derived(PRIVACY_POLICIES[$locale] ?? PRIVACY_POLICIES.en);
</script>

<svelte:head>
  <title>{policy.title} · {$t('app.title.brand')}</title>
  <meta name="description" content={$t('about.privacy.summary')} />
</svelte:head>

<main class="privacy-page">
  <article>
    <header class="page-heading">
      <span class="icon" aria-hidden="true">🔒</span>
      <div>
        <h1>{policy.title}</h1>
        <p class="intro">{policy.intro}</p>
      </div>
    </header>

    {#each policy.sections as section}
      <section>
        <h2>{section.title}</h2>
        {#if section.items}
          <ul class="service-list">
            {#each section.items as item}
              <li>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {#if item.detail}<p>{item.detail}</p>{/if}
                {#if item.link && item.url}
                  <a href={item.url} target="_blank" rel="noopener noreferrer">{item.link}</a>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
        {#if section.bullets}
          <ul>
            {#each section.bullets as bullet}<li>{bullet}</li>{/each}
          </ul>
        {/if}
        {#if section.showContactLink}
          <p>{policy.contact.prefix}: <a href={`mailto:${policy.contact.email}`}>{policy.contact.email}</a>{policy.contact.suffix}</p>
        {/if}
        {#if section.paragraphs}
          {#each section.paragraphs as paragraph}<p>{paragraph}</p>{/each}
        {/if}
      </section>
    {/each}

    <nav class="page-links" aria-label={$t('about.title')}>
      <a href={base + '/'}>{$t('app.title.brand')}</a>
      <a href={base + '/about/'}>{$t('about.title')}</a>
    </nav>
  </article>
</main>

<style>
  .privacy-page { min-height: 100dvh; padding: clamp(1rem, 4vw, 3rem) 1rem 4rem; background: var(--bg); color: var(--text); }
  article { width: min(100%, 760px); margin: 0 auto; }
  .page-heading { display: flex; align-items: flex-start; gap: 1rem; margin: .5rem 0 2.5rem; }
  .icon { display: grid; width: 3.25rem; height: 3.25rem; flex: 0 0 auto; place-items: center; border-radius: 1rem; background: var(--bg-card); font-size: 1.65rem; }
  h1 { margin: 0; font-size: clamp(1.7rem, 5vw, 2.4rem); line-height: 1.15; }
  .intro { margin: .5rem 0 0; color: var(--text-secondary); font-size: 1.05rem; }
  section { margin: 0 0 2rem; }
  h2 { margin: 0 0 .75rem; font-size: 1.25rem; line-height: 1.3; }
  h3 { margin: 0 0 .35rem; font-size: 1.05rem; }
  p, li { line-height: 1.65; }
  p { margin: .5rem 0; }
  ul { padding-left: 1.35rem; }
  .service-list { display: grid; gap: 1rem; padding: 0; list-style: none; }
  .service-list li { padding: 1rem 1.1rem; border: 1px solid var(--border); border-radius: 1rem; background: var(--bg-card); }
  a { color: var(--accent, #287a63); font-weight: 650; text-underline-offset: .15em; }
  .page-links { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 3rem; padding-top: 1.25rem; border-top: 1px solid var(--border); }
</style>
