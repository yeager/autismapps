<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const PHRASES = [
    { cat: 'greetings', icon: '👋', phrases: [
      { icon: '👋', key: 'conversationAid.hi' },
      { icon: '😊', key: 'conversationAid.howAreYou' },
      { icon: '👍', key: 'conversationAid.fine' },
      { icon: '👋', key: 'conversationAid.bye' },
    ]},
    { cat: 'needs', icon: '🙋', phrases: [
      { icon: '❓', key: 'conversationAid.canIHave' },
      { icon: '🙏', key: 'conversationAid.please' },
      { icon: '🙏', key: 'conversationAid.thanks' },
      { icon: '🔄', key: 'conversationAid.again' },
      { icon: '⏸️', key: 'conversationAid.wait' },
      { icon: '🛑', key: 'conversationAid.stop' },
    ]},
    { cat: 'feelings', icon: '💭', phrases: [
      { icon: '😊', key: 'conversationAid.iAmHappy' },
      { icon: '😢', key: 'conversationAid.iAmSad' },
      { icon: '😰', key: 'conversationAid.iAmScared' },
      { icon: '😤', key: 'conversationAid.iAmAngry' },
      { icon: '😴', key: 'conversationAid.iAmTired' },
      { icon: '🤒', key: 'conversationAid.iDontFeelWell' },
    ]},
    { cat: 'questions', icon: '❓', phrases: [
      { icon: '❓', key: 'conversationAid.whatIsThis' },
      { icon: '📍', key: 'conversationAid.whereIs' },
      { icon: '⏰', key: 'conversationAid.when' },
      { icon: '🤷', key: 'conversationAid.iDontUnderstand' },
      { icon: '🔁', key: 'conversationAid.sayAgain' },
    ]},
  ];

  let selectedCat = $state(null);

  function sayPhrase(p) {
    speak($t(p.key));
  }
</script>

<WelcomeDialog appId="conversation-aid" titleKey="app.conversation_aid" purposeKey="welcome.conversationAid.purpose" howKey="welcome.conversationAid.how" goalKey="welcome.conversationAid.goal" icon="💬" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedCat ? (selectedCat = null) : goto(base + '/')}>←</button>
    <h1>💬 {$t('conversationAid.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedCat}
      <div class="grid">
        {#each PHRASES as cat}
          <button class="card" onclick={() => { selectedCat = cat; speak($t(`conversationAid.cat.${cat.cat}`)); }}>
            <span class="ico">{cat.icon}</span>
            <span class="nm">{$t(`conversationAid.cat.${cat.cat}`)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <h2>{selectedCat.icon} {$t(`conversationAid.cat.${selectedCat.cat}`)}</h2>
      <div class="phrases">
        {#each selectedCat.phrases as p}
          <button class="phrase-btn" onclick={() => sayPhrase(p)}>
            <span class="p-icon">{p.icon}</span>
            <span class="p-text">{$t(p.key)}</span>
            <span class="p-speak">🔊</span>
          </button>
        {/each}
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
  h2 { text-align:center; margin:.5rem 0 1rem; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
  .card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .ico { font-size:2.5rem; }
  .nm { font-weight:600; }
  .phrases { display:flex; flex-direction:column; gap:.75rem; }
  .phrase-btn { display:flex; align-items:center; gap:1rem; padding:1rem 1.25rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:48px; text-align:left; }
  .phrase-btn:hover { border-color:var(--accent,#2196f3); }
  .p-icon { font-size:1.8rem; }
  .p-text { flex:1; font-size:1.15rem; font-weight:500; }
  .p-speak { font-size:1.2rem; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
