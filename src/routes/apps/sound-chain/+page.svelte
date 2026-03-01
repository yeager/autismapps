<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly } from 'svelte/transition';

  // === LJUDKEDJAN — Sound Chaining ===
  // CAS/dyspraxia therapy: chain single sounds → syllables → words
  // Visual chain links connect as child succeeds

  type ChainLevel = {
    id: string;
    labelKey: string;
    chains: { sounds: string[]; word: string; wordKey: string; icon: string }[];
  };

  const LEVELS: ChainLevel[] = [
    {
      id: 'vowels', labelKey: 'soundChain.level.vowels',
      chains: [
        { sounds: ['a'], word: 'a', wordKey: 'soundChain.word.a', icon: '🅰️' },
        { sounds: ['o'], word: 'o', wordKey: 'soundChain.word.o', icon: '⭕' },
        { sounds: ['a', 'o'], word: 'ao', wordKey: 'soundChain.word.ao', icon: '🔗' },
        { sounds: ['i', 'a'], word: 'ia', wordKey: 'soundChain.word.ia', icon: '🔗' },
        { sounds: ['u', 'e'], word: 'ue', wordKey: 'soundChain.word.ue', icon: '🔗' },
      ]
    },
    {
      id: 'cv', labelKey: 'soundChain.level.cv',
      chains: [
        { sounds: ['m', 'a'], word: 'ma', wordKey: 'soundChain.word.ma', icon: '👩' },
        { sounds: ['p', 'a'], word: 'pa', wordKey: 'soundChain.word.pa', icon: '👨' },
        { sounds: ['b', 'a'], word: 'ba', wordKey: 'soundChain.word.ba', icon: '👶' },
        { sounds: ['m', 'o'], word: 'mo', wordKey: 'soundChain.word.mo', icon: '🌙' },
        { sounds: ['s', 'o'], word: 'so', wordKey: 'soundChain.word.so', icon: '☀️' },
      ]
    },
    {
      id: 'cvc', labelKey: 'soundChain.level.cvc',
      chains: [
        { sounds: ['m', 'a', 't'], word: 'mat', wordKey: 'soundChain.word.mat', icon: '🍕' },
        { sounds: ['b', 'i', 'l'], word: 'bil', wordKey: 'soundChain.word.bil', icon: '🚗' },
        { sounds: ['s', 'o', 'l'], word: 'sol', wordKey: 'soundChain.word.sol', icon: '☀️' },
        { sounds: ['h', 'u', 's'], word: 'hus', wordKey: 'soundChain.word.hus', icon: '🏠' },
        { sounds: ['k', 'a', 't', 't'], word: 'katt', wordKey: 'soundChain.word.katt', icon: '🐱' },
      ]
    },
    {
      id: 'words', labelKey: 'soundChain.level.words',
      chains: [
        { sounds: ['m', 'a', 'm', 'a'], word: 'mama', wordKey: 'soundChain.word.mama', icon: '👩' },
        { sounds: ['p', 'a', 'p', 'a'], word: 'papa', wordKey: 'soundChain.word.papa', icon: '👨' },
        { sounds: ['b', 'a', 'n', 'a', 'n'], word: 'banan', wordKey: 'soundChain.word.banan', icon: '🍌' },
        { sounds: ['l', 'a', 'm', 'p', 'a'], word: 'lampa', wordKey: 'soundChain.word.lampa', icon: '💡' },
        { sounds: ['b', 'o', 'l', 'l'], word: 'boll', wordKey: 'soundChain.word.boll', icon: '⚽' },
      ]
    },
  ];

  let selectedLevel = $state<ChainLevel | null>(null);
  let currentChainIdx = $state(0);
  let linkedCount = $state(0);
  let isPlaying = $state(false);
  let speechRate = $state(0.5);
  let showSuccess = $state(false);

  const currentChain = $derived(
    selectedLevel ? selectedLevel.chains[currentChainIdx] : null
  );

  function selectLevel(level: ChainLevel) {
    selectedLevel = level;
    currentChainIdx = 0;
    linkedCount = 0;
    speak($t(level.labelKey), { rate: speechRate });
  }

  async function playSound(idx: number) {
    if (!currentChain || isPlaying) return;
    isPlaying = true;
    await speak(currentChain.sounds[idx], { rate: speechRate });
    if (idx >= linkedCount) {
      linkedCount = idx + 1;
    }
    isPlaying = false;
  }

  async function playChain() {
    if (!currentChain || isPlaying) return;
    isPlaying = true;
    for (let i = 0; i < currentChain.sounds.length; i++) {
      linkedCount = i + 1;
      await speak(currentChain.sounds[i], { rate: speechRate });
      await new Promise(r => setTimeout(r, 600));
    }
    // Now say the whole word
    await new Promise(r => setTimeout(r, 400));
    await speak(currentChain.word, { rate: speechRate });
    isPlaying = false;
  }

  async function sayWord() {
    if (!currentChain || isPlaying) return;
    isPlaying = true;
    linkedCount = currentChain.sounds.length;
    await speak(currentChain.word, { rate: speechRate });
    isPlaying = false;
  }

  function nextChain() {
    if (!selectedLevel) return;
    if (currentChainIdx < selectedLevel.chains.length - 1) {
      currentChainIdx++;
      linkedCount = 0;
      showSuccess = false;
    } else {
      showSuccess = true;
    }
  }

  function prevChain() {
    if (currentChainIdx > 0) {
      currentChainIdx--;
      linkedCount = 0;
    }
  }
</script>

<WelcomeDialog appId="sound-chain" titleKey="app.sound_chain" purposeKey="welcome.soundChain.purpose" howKey="welcome.soundChain.how" goalKey="welcome.soundChain.goal" icon="🔗" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedLevel ? (selectedLevel = null, showSuccess = false) : goto(`${base}/`)}>←</button>
    <h1>🔗 {$t('soundChain.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedLevel}
      <p class="intro">{$t('soundChain.intro')}</p>
      <div class="levels">
        {#each LEVELS as level, i}
          <button class="level-card" onclick={() => selectLevel(level)}>
            <span class="level-num">{i + 1}</span>
            <span class="level-name">{$t(level.labelKey)}</span>
            <span class="level-count">{level.chains.length} {$t('soundChain.chains')}</span>
          </button>
        {/each}
      </div>
    {:else if showSuccess}
      <div class="celebration" transition:fade>
        <span class="trophy">🏆</span>
        <p>{$t('soundChain.levelDone')}</p>
        <button class="btn" onclick={() => { selectedLevel = null; showSuccess = false; }}>
          {$t('soundChain.backToLevels')}
        </button>
      </div>
    {:else if currentChain}
      <div class="chain-view">
        <div class="speed-control">
          <label>{$t('soundChain.speed')}: {speechRate.toFixed(1)}x</label>
          <input type="range" min="0.4" max="1.0" step="0.1" bind:value={speechRate} />
        </div>

        <div class="progress-bar">
          <span>{currentChainIdx + 1} / {selectedLevel.chains.length}</span>
        </div>

        <div class="word-icon">{currentChain.icon}</div>

        <!-- Chain links visualization -->
        <div class="chain-links">
          {#each currentChain.sounds as sound, i}
            <button
              class="link"
              class:linked={i < linkedCount}
              class:playing={isPlaying && i === linkedCount - 1}
              onclick={() => playSound(i)}
              disabled={isPlaying}
              transition:fly={{ x: -20, delay: i * 100 }}
            >
              <span class="link-sound">{sound.toUpperCase()}</span>
            </button>
            {#if i < currentChain.sounds.length - 1}
              <span class="connector" class:connected={i < linkedCount - 1}>🔗</span>
            {/if}
          {/each}
        </div>

        <div class="actions">
          <button class="btn chain-btn" onclick={playChain} disabled={isPlaying}>
            ⛓️ {$t('soundChain.playChain')}
          </button>
          <button class="btn word-btn" onclick={sayWord} disabled={isPlaying}>
            💬 {$t('soundChain.sayWord')}
          </button>
        </div>

        <div class="nav-btns">
          <button class="nav" onclick={prevChain} disabled={currentChainIdx === 0}>⬅️</button>
          <button class="nav next" onclick={nextChain}>➡️</button>
        </div>
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
  .intro { text-align:center; color:var(--text-secondary); margin-bottom:1rem; }

  .levels { display:flex; flex-direction:column; gap:.75rem; }
  .level-card { display:flex; align-items:center; gap:1rem; padding:1.2rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:56px; transition:transform .15s; }
  .level-card:active { transform:scale(0.97); }
  .level-num { background:#9B59B6; color:#fff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem; flex-shrink:0; }
  .level-name { flex:1; font-weight:600; font-size:1.1rem; }
  .level-count { font-size:.85rem; color:var(--text-secondary); }

  .chain-view { display:flex; flex-direction:column; align-items:center; gap:1.2rem; }
  .speed-control { display:flex; flex-direction:column; align-items:center; gap:.3rem; width:100%; }
  .speed-control label { font-weight:600; font-size:.9rem; }
  .speed-control input[type="range"] { width:70%; accent-color:#9B59B6; }
  .progress-bar { font-size:.9rem; color:var(--text-secondary); font-weight:600; }
  .word-icon { font-size:4rem; }

  .chain-links { display:flex; align-items:center; justify-content:center; gap:.3rem; flex-wrap:wrap; padding:1rem; }
  .link { width:56px; height:56px; border-radius:50%; border:3px solid var(--border); background:var(--bg-card); font-size:1.3rem; font-weight:700; cursor:pointer; transition:all .3s; display:flex; align-items:center; justify-content:center; }
  .link.linked { border-color:#9B59B6; background:rgba(155,89,182,.15); transform:scale(1.1); }
  .link.playing { background:rgba(155,89,182,.3); animation:pulse .6s infinite; }
  .link:disabled { cursor:not-allowed; }
  .connector { font-size:1rem; opacity:.3; transition:opacity .3s; }
  .connector.connected { opacity:1; }
  .link-sound { pointer-events:none; }

  @keyframes pulse { 0%,100% { transform:scale(1.1); } 50% { transform:scale(1.2); } }

  .actions { display:flex; gap:1rem; }
  .btn { padding:.8rem 1.2rem; border-radius:12px; border:2px solid var(--border); background:var(--bg-card); font-size:1rem; cursor:pointer; font-weight:600; min-height:48px; }
  .btn:disabled { opacity:.5; }
  .chain-btn { background:#9B59B6; color:#fff; border-color:#9B59B6; }
  .word-btn { background:#27AE60; color:#fff; border-color:#27AE60; }

  .nav-btns { display:flex; gap:1.5rem; }
  .nav { width:56px; height:56px; border-radius:50%; border:2px solid var(--border); background:var(--bg-card); font-size:1.3rem; cursor:pointer; }
  .nav:disabled { opacity:.3; }
  .nav.next { background:#3498DB; color:#fff; border-color:#3498DB; }

  .celebration { text-align:center; padding:2rem; }
  .trophy { font-size:4rem; display:block; margin-bottom:1rem; }
  .celebration p { font-weight:700; font-size:1.3rem; margin-bottom:1rem; }

  .cr { text-align:center; padding:.5rem; font-size:.75rem; color:var(--text-secondary); }
</style>
