<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const STORIES = [
    {
      id: 'school',
      icon: '🏫',
      pages: [
        { icon: '🌅', text: 'socialStories.school.1' },
        { icon: '🎒', text: 'socialStories.school.2' },
        { icon: '👋', text: 'socialStories.school.3' },
        { icon: '📚', text: 'socialStories.school.4' },
        { icon: '🍽️', text: 'socialStories.school.5' },
        { icon: '🏠', text: 'socialStories.school.6' },
      ]
    },
    {
      id: 'doctor',
      icon: '🏥',
      pages: [
        { icon: '🚗', text: 'socialStories.doctor.1' },
        { icon: '🏥', text: 'socialStories.doctor.2' },
        { icon: '⏰', text: 'socialStories.doctor.3' },
        { icon: '👨‍⚕️', text: 'socialStories.doctor.4' },
        { icon: '✅', text: 'socialStories.doctor.5' },
      ]
    },
    {
      id: 'store',
      icon: '🛒',
      pages: [
        { icon: '📝', text: 'socialStories.store.1' },
        { icon: '🚗', text: 'socialStories.store.2' },
        { icon: '🛒', text: 'socialStories.store.3' },
        { icon: '💰', text: 'socialStories.store.4' },
        { icon: '🏠', text: 'socialStories.store.5' },
      ]
    },
    {
      id: 'friend',
      icon: '👫',
      pages: [
        { icon: '📞', text: 'socialStories.friend.1' },
        { icon: '🚪', text: 'socialStories.friend.2' },
        { icon: '👋', text: 'socialStories.friend.3' },
        { icon: '🎮', text: 'socialStories.friend.4' },
        { icon: '🤝', text: 'socialStories.friend.5' },
      ]
    },
    {
      id: 'haircut',
      icon: '💇',
      pages: [
        { icon: '🚗', text: 'socialStories.haircut.1' },
        { icon: '💺', text: 'socialStories.haircut.2' },
        { icon: '✂️', text: 'socialStories.haircut.3' },
        { icon: '😊', text: 'socialStories.haircut.4' },
      ]
    },
  ];

  let view = $state('list');
  let story = $state(null);
  let page = $state(0);

  function openStory(s) {
    story = s;
    page = 0;
    view = 'read';
    speak($t(s.pages[0].text));
  }

  function nextPage() {
    if (page < story.pages.length - 1) {
      page++;
      speak($t(story.pages[page].text));
    }
  }

  function prevPage() {
    if (page > 0) {
      page--;
      speak($t(story.pages[page].text));
    }
  }
</script>

<WelcomeDialog appId="social-stories" titleKey="app.social_stories" purposeKey="welcome.socialStories.purpose" howKey="welcome.socialStories.how" goalKey="welcome.socialStories.goal" icon="📚" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => view === 'read' ? (view = 'list') : goto(`${base}/`)}>←</button>
    <h1>📖 {$t('socialStories.title')}</h1>
  </header>

  <main class="cnt">
    {#if view === 'list'}
      <div class="grid">
        {#each STORIES as s}
          <button class="card" onclick={() => openStory(s)}>
            <span class="ico">{s.icon}</span>
            <span class="nm">{$t(`socialStories.name.${s.id}`)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="dots">
        {#each story.pages as _, i}
          <span class="dot" class:active={i === page} class:done={i < page}></span>
        {/each}
      </div>
      <div class="story-page">
        <span class="big-icon">{story.pages[page].icon}</span>
        <p class="story-text">{$t(story.pages[page].text)}</p>
      </div>
      <div class="nav-btns">
        <button class="nav-btn" onclick={prevPage} disabled={page === 0}>◀</button>
        <button class="nav-btn speak" onclick={() => speak($t(story.pages[page].text))}>🔊</button>
        <button class="nav-btn" onclick={nextPage} disabled={page === story.pages.length - 1}>▶</button>
      </div>
    {/if}
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:1rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.25rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .card:hover { transform:translateY(-2px); }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; }
  .dots { display:flex; justify-content:center; gap:.5rem; margin-bottom:1.5rem; }
  .dot { width:12px; height:12px; border-radius:50%; background:var(--border); }
  .dot.active { background:var(--accent,#2196f3); transform:scale(1.3); }
  .dot.done { background:#4caf50; }
  .story-page { text-align:center; padding:2rem 1rem; }
  .big-icon { font-size:5rem; display:block; margin-bottom:1.5rem; }
  .story-text { font-size:1.4rem; line-height:1.6; font-weight:500; }
  .nav-btns { display:flex; justify-content:center; gap:1rem; margin-top:1rem; }
  .nav-btn { padding:.75rem 1.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.3rem; cursor:pointer; min-width:48px; min-height:48px; }
  .nav-btn:disabled { opacity:.3; }
  .speak { background:#e3f2fd; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
  @media(prefers-reduced-motion:reduce) { .card { transition:none; } }
</style>
