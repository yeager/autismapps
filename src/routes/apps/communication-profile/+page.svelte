<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';

  type View = 'profile' | 'quick' | 'visit' | 'guide';
  type PersonalProfile = {
    name: string;
    communication: string;
    helps: string;
    sensory: string;
    pause: string;
    contact: string;
    customPhrase: string;
  };
  type VisitPlan = { kind: string; place: string; helps: string; message: string };

  const emptyProfile = (): PersonalProfile => ({ name: '', communication: '', helps: '', sensory: '', pause: '', contact: '', customPhrase: '' });
  const QUICK_PHRASES = [
    { icon: '⏸️', key: 'communicationProfile.quick.pause' },
    { icon: '⌛', key: 'communicationProfile.quick.time' },
    { icon: '💬', key: 'communicationProfile.quick.one_question' },
    { icon: '🔇', key: 'communicationProfile.quick.quiet' },
    { icon: '✍️', key: 'communicationProfile.quick.write' },
    { icon: '🆘', key: 'communicationProfile.quick.help' }
  ];
  const GUIDE = [
    { title: 'communicationProfile.guide.1.title', body: 'communicationProfile.guide.1.body', example: 'communicationProfile.guide.1.example' },
    { title: 'communicationProfile.guide.2.title', body: 'communicationProfile.guide.2.body', example: 'communicationProfile.guide.2.example' },
    { title: 'communicationProfile.guide.3.title', body: 'communicationProfile.guide.3.body', example: 'communicationProfile.guide.3.example' },
    { title: 'communicationProfile.guide.4.title', body: 'communicationProfile.guide.4.body', example: 'communicationProfile.guide.4.example' },
    { title: 'communicationProfile.guide.5.title', body: 'communicationProfile.guide.5.body', example: 'communicationProfile.guide.5.example' }
  ];
  const VISIT_KINDS = ['doctor', 'dentist', 'hairdresser', 'school', 'newplace'];

  let profile = $state<PersonalProfile>(emptyProfile());
  let visit = $state<VisitPlan>({ kind: 'doctor', place: '', helps: '', message: '' });
  let activeView = $state<View>('profile');
  let guideStep = $state(0);
  let ready = $state(false);
  let notice = $state('');
  let isClearingSavedData = false;

  onMount(() => {
    try {
      const savedProfile = localStorage.getItem('communication-profile-v1');
      if (savedProfile) profile = { ...emptyProfile(), ...JSON.parse(savedProfile) };
      const savedVisit = localStorage.getItem('communication-visit-v1');
      if (savedVisit) visit = { ...visit, ...JSON.parse(savedVisit) };
    } catch {
      notice = $t('communicationProfile.storage_error');
    }
    ready = true;
  });

  $effect(() => {
    if (!browser || !ready) return;
    if (isClearingSavedData) {
      isClearingSavedData = false;
      return;
    }
    try {
      localStorage.setItem('communication-profile-v1', JSON.stringify(profile));
      localStorage.setItem('communication-visit-v1', JSON.stringify(visit));
    } catch {
      notice = $t('communicationProfile.storage_error');
    }
  });

  function announce(text: string) {
    if (!text.trim()) return;
    void speak(text);
  }

  function profileSummary() {
    const rows = [
      [ $t('communicationProfile.field.communication'), profile.communication ],
      [ $t('communicationProfile.field.helps'), profile.helps ],
      [ $t('communicationProfile.field.sensory'), profile.sensory ],
      [ $t('communicationProfile.field.pause'), profile.pause ],
      [ $t('communicationProfile.field.contact'), profile.contact ],
      [ $t('communicationProfile.quick.custom_label'), profile.customPhrase ]
    ] as [string, string][];
    const filledRows = rows.filter((row) => row[1].trim());
    return [profile.name.trim() ? `${$t('communicationProfile.field.name')}: ${profile.name.trim()}` : '', ...filledRows.map(([label, value]) => `${label}: ${value}`)]
      .filter(Boolean)
      .join('\n');
  }

  async function shareProfile() {
    const text = profileSummary();
    if (!text) {
      notice = $t('communicationProfile.empty_notice');
      return;
    }
    try {
      if (navigator.share) await navigator.share({ title: $t('communicationProfile.title'), text });
      else {
        await navigator.clipboard.writeText(text);
        notice = $t('communicationProfile.copied');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      notice = $t('communicationProfile.share_error');
    }
  }

  function clearSavedData() {
    if (!browser) return;
    isClearingSavedData = true;
    localStorage.removeItem('communication-profile-v1');
    localStorage.removeItem('communication-visit-v1');
    profile = emptyProfile();
    visit = { kind: 'doctor', place: '', helps: '', message: '' };
    notice = $t('communicationProfile.cleared');
  }

  const visitSteps = $derived([
    $t(`communicationProfile.visit.${visit.kind}.1`),
    $t(`communicationProfile.visit.${visit.kind}.2`),
    $t(`communicationProfile.visit.${visit.kind}.3`),
    $t(`communicationProfile.visit.${visit.kind}.4`)
  ]);
</script>

<svelte:head>
  <title>{$t('app.communication_profile')} — {$t('app.title.brand')}</title>
  <meta name="description" content={$t('app.communication_profile.desc')} />
</svelte:head>

<main class="profile-tool" data-view={activeView}>
  <header class="tool-heading">
    <div>
      <p class="eyebrow">{$t('communicationProfile.eyebrow')}</p>
      <h1>🗣️ {$t('communicationProfile.title')}</h1>
      <p class="intro">{$t('communicationProfile.intro')}</p>
    </div>
    <div class="heading-actions">
      <button class="secondary" onclick={() => window.print()}>🖨️ {$t('communicationProfile.print')}</button>
      <button class="secondary" onclick={shareProfile}>↗ {$t('communicationProfile.share')}</button>
    </div>
  </header>

  <nav class="views" aria-label={$t('communicationProfile.tabs.label')}>
    <button class:active={activeView === 'profile'} onclick={() => activeView = 'profile'}>👤 {$t('communicationProfile.tabs.profile')}</button>
    <button class:active={activeView === 'quick'} onclick={() => activeView = 'quick'}>🆘 {$t('communicationProfile.tabs.quick')}</button>
    <button class:active={activeView === 'visit'} onclick={() => activeView = 'visit'}>🧭 {$t('communicationProfile.tabs.visit')}</button>
    <button class:active={activeView === 'guide'} onclick={() => activeView = 'guide'}>🤝 {$t('communicationProfile.tabs.guide')}</button>
  </nav>

  {#if activeView === 'profile'}
    <section class="panel profile-panel" aria-labelledby="profile-section-title">
      <div class="section-heading">
        <div><h2 id="profile-section-title">{$t('communicationProfile.profile_heading')}</h2><p>{$t('communicationProfile.profile_help')}</p></div>
        <span class="local-badge">🔒 {$t('communicationProfile.local_badge')}</span>
      </div>
      <div class="fields">
        <label class="field">{$t('communicationProfile.field.name')}<input bind:value={profile.name} autocomplete="name" /></label>
        <label class="field">{$t('communicationProfile.field.communication')}<textarea bind:value={profile.communication} rows="2" placeholder={$t('communicationProfile.field.communication_hint')}></textarea></label>
        <label class="field">{$t('communicationProfile.field.helps')}<textarea bind:value={profile.helps} rows="3" placeholder={$t('communicationProfile.field.helps_hint')}></textarea></label>
        <label class="field">{$t('communicationProfile.field.sensory')}<textarea bind:value={profile.sensory} rows="2" placeholder={$t('communicationProfile.field.sensory_hint')}></textarea></label>
        <label class="field">{$t('communicationProfile.field.pause')}<textarea bind:value={profile.pause} rows="2" placeholder={$t('communicationProfile.field.pause_hint')}></textarea></label>
        <label class="field">{$t('communicationProfile.field.contact')}<input bind:value={profile.contact} placeholder={$t('communicationProfile.field.contact_hint')} /></label>
      </div>
      <div class="save-note" role="status">💾 {$t('communicationProfile.saved_locally')}</div>
      <button class="danger-link" onclick={clearSavedData}>{$t('communicationProfile.clear_data')}</button>
    </section>
  {:else if activeView === 'quick'}
    <section class="panel quick-panel" aria-labelledby="quick-heading">
      <h2 id="quick-heading">{$t('communicationProfile.quick.heading')}</h2>
      <p>{$t('communicationProfile.quick.intro')}</p>
      <div class="phrase-grid">
        {#each QUICK_PHRASES as phrase}
          <button class="phrase" onclick={() => announce($t(phrase.key))}>
            <span class="phrase-icon" aria-hidden="true">{phrase.icon}</span><span>{$t(phrase.key)}</span><span class="speak-icon" aria-hidden="true">🔊</span>
          </button>
        {/each}
        {#if profile.customPhrase.trim()}
          <button class="phrase custom-phrase" onclick={() => announce(profile.customPhrase)}><span class="phrase-icon" aria-hidden="true">💬</span><span>{profile.customPhrase}</span><span class="speak-icon" aria-hidden="true">🔊</span></button>
        {/if}
      </div>
      <label class="field custom-field">{$t('communicationProfile.quick.custom_label')}<input bind:value={profile.customPhrase} placeholder={$t('communicationProfile.quick.custom_placeholder')} /></label>
      <p class="privacy-note">{$t('communicationProfile.quick.privacy')}</p>
    </section>
  {:else if activeView === 'visit'}
    <section class="panel visit-panel" aria-labelledby="visit-heading">
      <h2 id="visit-heading">{$t('communicationProfile.visit.heading')}</h2>
      <p>{$t('communicationProfile.visit.intro')}</p>
      <div class="visit-form">
        <label class="field">{$t('communicationProfile.visit.kind_label')}<select bind:value={visit.kind}>{#each VISIT_KINDS as kind}<option value={kind}>{$t(`communicationProfile.visit.kind.${kind}`)}</option>{/each}</select></label>
        <label class="field">{$t('communicationProfile.visit.place_label')}<input bind:value={visit.place} placeholder={$t('communicationProfile.visit.place_hint')} /></label>
        <label class="field">{$t('communicationProfile.visit.helps_label')}<textarea bind:value={visit.helps} rows="2" placeholder={profile.helps || $t('communicationProfile.visit.helps_hint')}></textarea></label>
        <label class="field">{$t('communicationProfile.visit.message_label')}<textarea bind:value={visit.message} rows="2" placeholder={$t('communicationProfile.visit.message_hint')}></textarea></label>
      </div>
      <h3>{$t('communicationProfile.visit.steps_heading')}</h3>
      <ol class="visit-steps">{#each visitSteps as step, i}<li><span>{['🚶', '👀', '💬', '🏁'][i]}</span><p>{step}</p></li>{/each}</ol>
      {#if visit.place || visit.helps || visit.message}
        <div class="visit-notes"><h3>{$t('communicationProfile.visit.my_notes')}</h3>{#if visit.place}<p><strong>{$t('communicationProfile.visit.place_label')}:</strong> {visit.place}</p>{/if}{#if visit.helps}<p><strong>{$t('communicationProfile.visit.helps_label')}:</strong> {visit.helps}</p>{/if}{#if visit.message}<p><strong>{$t('communicationProfile.visit.message_label')}:</strong> {visit.message}</p>{/if}</div>
      {/if}
      <p class="privacy-note">{$t('communicationProfile.visit.privacy')}</p>
    </section>
  {:else}
    <section class="panel guide-panel" aria-labelledby="guide-heading">
      <h2 id="guide-heading">{$t('communicationProfile.guide.heading')}</h2>
      <p>{$t('communicationProfile.guide.intro')}</p>
      <div class="lesson-count">{$t('communicationProfile.guide.lesson')} {guideStep + 1} / {GUIDE.length}</div>
      <article class="lesson-card" aria-live="polite">
        <span class="lesson-icon" aria-hidden="true">{['⏳', '🗣️', '👂', '🧩', '🫶'][guideStep]}</span>
        <h3>{$t(GUIDE[guideStep].title)}</h3>
        <p>{$t(GUIDE[guideStep].body)}</p>
        <blockquote>{$t(GUIDE[guideStep].example)}</blockquote>
      </article>
      <div class="lesson-nav">
        <button class="secondary" onclick={() => guideStep = Math.max(0, guideStep - 1)} disabled={guideStep === 0}>← {$t('communicationProfile.guide.previous')}</button>
        {#if guideStep < GUIDE.length - 1}
          <button class="primary" onclick={() => guideStep++}>{$t('communicationProfile.guide.next')} →</button>
        {:else}
          <button class="primary" onclick={() => guideStep = 0}>✓ {$t('communicationProfile.guide.restart')}</button>
        {/if}
      </div>
      <p class="privacy-note">{$t('communicationProfile.guide.reminder')}</p>
    </section>
  {/if}

  {#if notice}<p class="notice" role="status">{notice}</p>{/if}
</main>

<style>
  .profile-tool { max-width: 1040px; margin: 0 auto; padding: clamp(16px, 3vw, 32px); color: var(--text); }
  .tool-heading { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; margin-bottom:24px; }
  h1 { margin:0; font-size:clamp(1.8rem, 3vw, 2.5rem); }
  h2 { margin:0 0 8px; font-size:1.4rem; }
  h3 { margin:20px 0 10px; font-size:1.05rem; }
  p { line-height:1.55; }
  .eyebrow { margin:0 0 8px; color:var(--text-secondary); font-size:.78rem; font-weight:750; letter-spacing:.08em; text-transform:uppercase; }
  .intro { max-width:650px; margin:8px 0 0; color:var(--text-secondary); }
  .heading-actions { display:flex; gap:8px; flex-wrap:wrap; }
  button, input, textarea, select { font:inherit; }
  button { min-height:48px; border:1px solid var(--border); border-radius:12px; padding:10px 14px; color:var(--text); background:var(--bg-card); cursor:pointer; }
  button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline:3px solid #4b8f74; outline-offset:2px; }
  button:disabled { opacity:.45; cursor:not-allowed; }
  .secondary { font-weight:650; }
  .primary { background:#315a49; border-color:#315a49; color:#fff; font-weight:700; }
  .views { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; margin-bottom:16px; }
  .views button { font-weight:700; }
  .views button.active { color:#fff; background:#315a49; border-color:#315a49; }
  .panel { padding:clamp(16px,2.5vw,26px); border:1px solid var(--border); border-radius:20px; background:var(--bg-card); box-shadow:0 8px 30px #20382a0a; }
  .panel > p { color:var(--text-secondary); margin:0 0 18px; }
  .section-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:20px; }
  .section-heading p { margin:0; color:var(--text-secondary); }
  .local-badge { padding:7px 10px; border-radius:999px; background:#edf4ef; color:#315a49; font-size:.84rem; font-weight:700; white-space:nowrap; }
  .fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
  .field { display:flex; flex-direction:column; gap:7px; font-weight:700; }
  .field input, .field textarea, .field select { width:100%; min-height:48px; border:1px solid var(--border); border-radius:11px; padding:10px 12px; color:var(--text); background:var(--bg); font-weight:400; }
  .field textarea { resize:vertical; min-height:76px; }
  .field input::placeholder, .field textarea::placeholder { color:var(--text-secondary); opacity:.85; }
  .save-note, .privacy-note { margin:16px 0 0; color:var(--text-secondary); font-size:.9rem; }
  .danger-link { margin-top:14px; padding:6px 0; min-height:40px; border:0; color:#8a3434; background:transparent; text-decoration:underline; }
  .phrase-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .phrase { min-height:100px; display:grid; grid-template-columns:44px 1fr 25px; align-items:center; gap:10px; text-align:left; border:2px solid #dbe5df; font-size:clamp(1rem,2vw,1.2rem); font-weight:750; }
  .phrase:hover { border-color:#315a49; }
  .phrase-icon { font-size:1.8rem; }
  .speak-icon { font-size:1rem; }
  .custom-phrase { background:#f4f0fa; }
  .custom-field { margin-top:18px; }
  .visit-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
  .visit-steps { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; padding:0; list-style:none; counter-reset:steps; }
  .visit-steps li { display:flex; align-items:flex-start; gap:12px; padding:14px; border-radius:14px; background:var(--bg); }
  .visit-steps li span { font-size:1.5rem; }
  .visit-steps p { margin:2px 0; }
  .visit-notes { padding:14px 16px; border-left:4px solid #315a49; background:var(--bg); }
  .visit-notes h3 { margin-top:0; }
  .visit-notes p { margin:7px 0; }
  .lesson-count { margin:18px 0 10px; color:var(--text-secondary); font-weight:700; }
  .lesson-card { min-height:260px; padding:clamp(20px,4vw,38px); border-radius:18px; background:var(--bg); text-align:center; }
  .lesson-icon { font-size:2.8rem; }
  .lesson-card h3 { margin:12px 0; font-size:1.45rem; }
  .lesson-card p { max-width:650px; margin:0 auto 14px; }
  blockquote { max-width:650px; margin:0 auto; padding:12px 16px; border-left:4px solid #91a99a; background:var(--bg-card); text-align:left; }
  .lesson-nav { display:flex; justify-content:space-between; gap:10px; margin-top:14px; }
  .notice { position:sticky; bottom:12px; width:fit-content; margin:14px auto 0; padding:10px 14px; border-radius:12px; background:#315a49; color:white; }
  @media(max-width:680px) {
    .tool-heading { align-items:flex-start; flex-direction:column; }
    .views { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .fields, .visit-form, .visit-steps, .phrase-grid { grid-template-columns:1fr; }
    .section-heading { flex-direction:column; }
    .heading-actions { width:100%; }
    .heading-actions button { flex:1; }
  }
  @media print {
    :global(.app-header), .views, .heading-actions, .danger-link, .save-note, .privacy-note, .lesson-nav, .notice { display:none !important; }
    .profile-tool { max-width:none; padding:0; }
    .panel { border:0; box-shadow:none; padding:0; }
    input, textarea, select { border:0 !important; padding:0 !important; background:transparent !important; }
  }
</style>
