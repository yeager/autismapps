<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t, locale, pick } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  type Sound = { icon: string; label: string; text: Partial<Record<string, string>> };
  type SoundCategory = { id: string; icon: string; sounds: Sound[] };
  const CATEGORIES: SoundCategory[] = [
    { id: 'animals', icon: '🐾', sounds: [
      { icon: '🐶', label: 'soundLibrary.dog', text: { sv: 'Vov vov!', pt_BR: 'Au au!' } },
      { icon: '🐱', label: 'soundLibrary.cat', text: { sv: 'Mjau!', pt_BR: 'Miau!' } },
      { icon: '🐮', label: 'soundLibrary.cow', text: { sv: 'Muuu!', pt_BR: 'Muuu!' } },
      { icon: '🐷', label: 'soundLibrary.pig', text: { sv: 'Nöff nöff!', pt_BR: 'Oinc oinc!' } },
      { icon: '🐸', label: 'soundLibrary.frog', text: { sv: 'Kvack kvack!', pt_BR: 'Croac croac!' } },
      { icon: '🐓', label: 'soundLibrary.rooster', text: { sv: 'Kuckeliku!', pt_BR: 'Cocoricó!' } },
      { icon: '🐝', label: 'soundLibrary.bee', text: { sv: 'Bzzzzz!', pt_BR: 'Zzzzzz!' } },
      { icon: '🦁', label: 'soundLibrary.lion', text: { sv: 'Raaarr!', pt_BR: 'Roooar!' } },
    ]},
    { id: 'vehicles', icon: '🚗', sounds: [
      { icon: '🚗', label: 'soundLibrary.car', text: { sv: 'Bruum bruum!', pt_BR: 'Vrum vrum!' } },
      { icon: '🚂', label: 'soundLibrary.train', text: { sv: 'Tuut tuut!', pt_BR: 'Piuí piuí!' } },
      { icon: '🚒', label: 'soundLibrary.firetruck', text: { sv: 'Tatü tata!', pt_BR: 'Uiu uiu uiu!' } },
      { icon: '✈️', label: 'soundLibrary.airplane', text: { sv: 'Vrooosh!', pt_BR: 'Vuuuuum!' } },
      { icon: '🚌', label: 'soundLibrary.bus', text: { sv: 'Piiip!', pt_BR: 'Fom fom!' } },
    ]},
    { id: 'nature', icon: '🌳', sounds: [
      { icon: '🌧️', label: 'soundLibrary.rain', text: { sv: 'Pitter patter pitter patter', pt_BR: 'Plic ploc plic ploc' } },
      { icon: '⚡', label: 'soundLibrary.thunder', text: { sv: 'Krasch boom!', pt_BR: 'Cabrum!' } },
      { icon: '💨', label: 'soundLibrary.wind', text: { sv: 'Vuuush!', pt_BR: 'Fuuuuu!' } },
      { icon: '🌊', label: 'soundLibrary.waves', text: { sv: 'Skvaalp skvaalp', pt_BR: 'Chuá chuá' } },
    ]},
    { id: 'music', icon: '🎵', sounds: [
      { icon: '🥁', label: 'soundLibrary.drum', text: { sv: 'Bam bam bam!', pt_BR: 'Tum tum tum!' } },
      { icon: '🎸', label: 'soundLibrary.guitar', text: { sv: 'Pling pling!', pt_BR: 'Plim plim!' } },
      { icon: '🎹', label: 'soundLibrary.piano', text: { sv: 'Do re mi!', pt_BR: 'Dó ré mi!' } },
      { icon: '🔔', label: 'soundLibrary.bell', text: { sv: 'Ding dong!', pt_BR: 'Dim dom!' } },
    ]},
  ];

  let selectedCat = $state<SoundCategory | null>(null);
  let playing = $state<string | null>(null);

  function playSound(sound: Sound) {
    playing = sound.label;
    speak(pick(sound.text, $locale));
    setTimeout(() => { playing = null; }, 1500);
  }

  function selectCat(cat: SoundCategory) {
    selectedCat = cat;
    speak($t(`soundLibrary.cat.${cat.id}`));
  }
</script>

<WelcomeDialog appId="sound-library" titleKey="app.sound_library" purposeKey="welcome.soundLibrary.purpose" howKey="welcome.soundLibrary.how" goalKey="welcome.soundLibrary.goal" icon="🔊" />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">
    {#if selectedCat}<button class="sub-back" onclick={() => { selectedCat = null }} aria-label={$t('app.back')}>←</button>{/if}
    <h1>🔊 {$t('soundLibrary.title')}</h1>

  </div>

    {#if !selectedCat}
      <div class="grid">
        {#each CATEGORIES as cat}
          <button class="card" onclick={() => selectCat(cat)}>
            <span class="ico">{cat.icon}</span>
            <span class="nm">{$t(`soundLibrary.cat.${cat.id}`)}</span>
          </button>
        {/each}
      </div>
    {:else if selectedCat}
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

  <footer class="cr"><p>{$t('app.title.brand')} · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
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
