<script>
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  const CATEGORIES = [
    { id: 'animals', icon: '🐾', sounds: [
      { icon: '🐶', label: 'soundLibrary.dog', text: 'Vov vov!' },
      { icon: '🐱', label: 'soundLibrary.cat', text: 'Mjau!' },
      { icon: '🐮', label: 'soundLibrary.cow', text: 'Muuu!' },
      { icon: '🐷', label: 'soundLibrary.pig', text: 'Nöff nöff!' },
      { icon: '🐸', label: 'soundLibrary.frog', text: 'Kvack kvack!' },
      { icon: '🐓', label: 'soundLibrary.rooster', text: 'Kuckeliku!' },
      { icon: '🐝', label: 'soundLibrary.bee', text: 'Bzzzzz!' },
      { icon: '🦁', label: 'soundLibrary.lion', text: 'Raaarr!' },
    ]},
    { id: 'vehicles', icon: '🚗', sounds: [
      { icon: '🚗', label: 'soundLibrary.car', text: 'Bruum bruum!' },
      { icon: '🚂', label: 'soundLibrary.train', text: 'Tuut tuut!' },
      { icon: '🚒', label: 'soundLibrary.firetruck', text: 'Tatü tata!' },
      { icon: '✈️', label: 'soundLibrary.airplane', text: 'Vrooosh!' },
      { icon: '🚌', label: 'soundLibrary.bus', text: 'Piiip!' },
    ]},
    { id: 'nature', icon: '🌳', sounds: [
      { icon: '🌧️', label: 'soundLibrary.rain', text: 'Pitter patter pitter patter' },
      { icon: '⚡', label: 'soundLibrary.thunder', text: 'Krasch boom!' },
      { icon: '💨', label: 'soundLibrary.wind', text: 'Vuuush!' },
      { icon: '🌊', label: 'soundLibrary.waves', text: 'Skvaalp skvaalp' },
    ]},
    { id: 'music', icon: '🎵', sounds: [
      { icon: '🥁', label: 'soundLibrary.drum', text: 'Bam bam bam!' },
      { icon: '🎸', label: 'soundLibrary.guitar', text: 'Pling pling!' },
      { icon: '🎹', label: 'soundLibrary.piano', text: 'Do re mi!' },
      { icon: '🔔', label: 'soundLibrary.bell', text: 'Ding dong!' },
    ]},
  ];

  let selectedCat = $state(null);
  let playing = $state(null);

  function playSound(sound) {
    playing = sound.label;
    speak(sound.text);
    setTimeout(() => { playing = null; }, 1500);
  }

  function selectCat(cat) {
    selectedCat = cat;
    speak($t(`soundLibrary.cat.${cat.id}`));
  }
</script>

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedCat ? (selectedCat = null) : goto('/')}>←</button>
    <h1>🔊 {$t('soundLibrary.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedCat}
      <div class="grid">
        {#each CATEGORIES as cat}
          <button class="card" onclick={() => selectCat(cat)}>
            <span class="ico">{cat.icon}</span>
            <span class="nm">{$t(`soundLibrary.cat.${cat.id}`)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <h2>{selectedCat.icon} {$t(`soundLibrary.cat.${selectedCat.id}`)}</h2>
      <div class="sounds">
        {#each selectedCat.sounds as sound}
          <button class="sound-btn" class:playing={playing === sound.label} onclick={() => playSound(sound)}>
            <span class="sound-icon">{sound.icon}</span>
            <span class="sound-label">{$t(sound.label)}</span>
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
  .sounds { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
  .sound-btn { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.25rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:48px; transition:transform .15s; }
  .sound-btn:hover { transform:scale(1.05); }
  .sound-btn.playing { border-color:var(--accent,#2196f3); background:#e3f2fd; animation:pulse .5s; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
  .sound-icon { font-size:2.5rem; }
  .sound-label { font-weight:600; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
  @media(prefers-reduced-motion:reduce) { .sound-btn { transition:none; animation:none; } }
</style>
