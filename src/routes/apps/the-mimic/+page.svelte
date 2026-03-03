<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // === EFTERHÄRMAREN — The Mimic ===
  // Listen and repeat with increasing complexity
  // Core DTTC technique: model → simultaneous → delayed → independent
  // Hierarchy: sounds → words → phrases → sentences

  type Level = 'sounds' | 'words' | 'phrases' | 'sentences';

  interface MimicItem {
    text: string;
    icon: string;
  }

  const LEVEL_DATA: Record<Level, MimicItem[]> = {
    sounds: [
      { text: 'aaa', icon: '😮' }, { text: 'ooo', icon: '😯' }, { text: 'eee', icon: '😊' },
      { text: 'iii', icon: '😁' }, { text: 'uuu', icon: '😗' }, { text: 'mmm', icon: '😶' },
      { text: 'sss', icon: '🐍' }, { text: 'fff', icon: '💨' }, { text: 'lll', icon: '👅' },
      { text: 'ba', icon: '👶' }, { text: 'ma', icon: '👩' }, { text: 'pa', icon: '👨' },
      { text: 'da', icon: '👋' }, { text: 'na', icon: '😊' }, { text: 'ka', icon: '🦶' },
    ],
    words: [
      { text: 'mamma', icon: '👩' }, { text: 'pappa', icon: '👨' }, { text: 'hej', icon: '👋' },
      { text: 'ja', icon: '✅' }, { text: 'nej', icon: '❌' }, { text: 'tack', icon: '🙏' },
      { text: 'hund', icon: '🐕' }, { text: 'katt', icon: '🐱' }, { text: 'boll', icon: '⚽' },
      { text: 'mat', icon: '🍕' }, { text: 'vatten', icon: '💧' }, { text: 'glass', icon: '🍦' },
      { text: 'bil', icon: '🚗' }, { text: 'bok', icon: '📖' }, { text: 'sol', icon: '☀️' },
    ],
    phrases: [
      { text: 'jag vill', icon: '🙋' }, { text: 'jag vill ha', icon: '🤲' },
      { text: 'kom hit', icon: '👋' }, { text: 'titta där', icon: '👀' },
      { text: 'vad är det', icon: '❓' }, { text: 'kan jag få', icon: '🙏' },
      { text: 'hjälp mig', icon: '🆘' }, { text: 'jag heter', icon: '📛' },
      { text: 'var är', icon: '🔍' }, { text: 'ge mig', icon: '🤲' },
      { text: 'tack så mycket', icon: '🙏' }, { text: 'jag tycker om', icon: '❤️' },
    ],
    sentences: [
      { text: 'Jag vill ha mat.', icon: '🍕' },
      { text: 'Kan jag få vatten?', icon: '💧' },
      { text: 'Titta, en stor hund!', icon: '🐕' },
      { text: 'Jag vill leka ute.', icon: '🏞️' },
      { text: 'Var är min bok?', icon: '📖' },
      { text: 'Vi åker till parken.', icon: '🏞️' },
      { text: 'Jag tycker om glass.', icon: '🍦' },
      { text: 'Mamma, kom och titta!', icon: '👩' },
      { text: 'Katten sover i sängen.', icon: '🐱' },
      { text: 'Kan du hjälpa mig?', icon: '🆘' },
    ],
  };

  const LEVELS: Level[] = ['sounds', 'words', 'phrases', 'sentences'];

  let currentLevel = $state<Level>('sounds');
  let currentIdx = $state(0);
  let speechRate = $state(0.7);
  let isPlaying = $state(false);
  let reps = $state(0);
  let totalReps = $state(0);
  let streak = $state(0);
  let showYourTurn = $state(false);

  const currentItems = $derived(LEVEL_DATA[currentLevel]);
  const currentItem = $derived(currentItems[currentIdx]);

  async function playModel() {
    if (isPlaying) return;
    isPlaying = true;
    showYourTurn = false;
    await speak(currentItem.text, { rate: speechRate });
    reps++;
    totalReps++;

    // After playing, show "your turn"
    await new Promise(r => setTimeout(r, 500));
    showYourTurn = true;
    isPlaying = false;
  }

  async function playSlower() {
    if (isPlaying) return;
    isPlaying = true;
    showYourTurn = false;
    await speak(currentItem.text, { rate: Math.max(0.3, speechRate - 0.2) });
    reps++;
    totalReps++;
    showYourTurn = true;
    isPlaying = false;
  }

  async function playRepeat() {
    if (isPlaying) return;
    isPlaying = true;
    showYourTurn = false;
    await speak(currentItem.text, { rate: speechRate });
    await new Promise(r => setTimeout(r, 1500));
    await speak(currentItem.text, { rate: speechRate });
    reps += 2;
    totalReps += 2;
    showYourTurn = true;
    isPlaying = false;
  }

  function nextItem() {
    if (currentIdx < currentItems.length - 1) {
      currentIdx++;
    } else {
      currentIdx = 0;
    }
    reps = 0;
    showYourTurn = false;
    streak++;
  }

  function setLevel(level: Level) {
    currentLevel = level;
    currentIdx = 0;
    reps = 0;
    showYourTurn = false;
  }
</script>

<WelcomeDialog appId="the-mimic" titleKey="app.the_mimic" purposeKey="welcome.theMimic.purpose" howKey="welcome.theMimic.how" goalKey="welcome.theMimic.goal" icon="🦜" />

<div class="app" in:fade>

  <main class="cnt">

  <div class="page-title">

    <h1>🦜 {$t('theMimic.title')}</h1>

  </div>

    <p class="intro">{$t('theMimic.intro')}</p>

    <!-- Level tabs -->
    <div class="level-tabs">
      {#each LEVELS as level}
        <button class="level-tab" class:active={currentLevel === level} onclick={() => setLevel(level)}>
          {$t(`theMimic.level.${level}`)}
        </button>
      {/each}
    </div>

    <!-- Speed control -->
    <div class="speed-control">
      <label>{$t('theMimic.speed')}: {speechRate.toFixed(1)}x</label>
      <input type="range" min="0.3" max="1.0" step="0.1" bind:value={speechRate} />
      <div class="speed-labels">
        <span>{$t('theMimic.slower')}</span>
        <span>{$t('theMimic.faster')}</span>
      </div>
    </div>

    <!-- Current item -->
    <div class="item-display">
      <span class="item-icon">{currentItem.icon}</span>
      <span class="item-text" class:sentence={currentLevel === 'sentences' || currentLevel === 'phrases'}>{currentItem.text}</span>
      <span class="item-progress">{currentIdx + 1}/{currentItems.length}</span>
      <span class="rep-count">{$t('theMimic.reps')}: {reps}</span>
    </div>

    {#if showYourTurn}
      <div class="your-turn" in:fade>
        <span class="yt-icon">🎤</span>
        <span class="yt-text">{$t('theMimic.yourTurn')}</span>
      </div>
    {/if}

    <!-- Action buttons -->
    <div class="actions">
      <button class="btn listen-btn" onclick={playModel} disabled={isPlaying}>
        🔊 {$t('theMimic.listen')}
      </button>
      <button class="btn slower-btn" onclick={playSlower} disabled={isPlaying}>
        🐢 {$t('theMimic.slower')}
      </button>
      <button class="btn repeat-btn" onclick={playRepeat} disabled={isPlaying}>
        🔁 {$t('theMimic.repeat')}
      </button>
    </div>

    <button class="btn next-btn" onclick={nextItem}>
      {$t('theMimic.next')} →
    </button>

    <!-- Stats -->
    <div class="stats">
      <div class="stat">
        <span class="stat-label">{$t('theMimic.streak')}</span>
        <span class="stat-val">{streak} 🔥</span>
      </div>
      <div class="stat">
        <span class="stat-label">{$t('theMimic.progress')}</span>
        <span class="stat-val">{totalReps} {$t('theMimic.reps').toLowerCase()}</span>
      </div>
    </div>
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app{min-height:100dvh;display:flex;flex-direction:column;background:var(--bg);color:var(--text)}
  h1{font-size:1.4rem;margin:0;flex:1}
  .cnt{flex:1;padding:1rem;max-width:600px;margin:0 auto;width:100%;display:flex;flex-direction:column;gap:1rem}
  .intro{text-align:center;color:var(--text-secondary);font-size:1.1rem}

  .level-tabs{display:flex;gap:.3rem}
  .level-tab{flex:1;padding:.6rem;border-radius:10px;border:2px solid var(--border);background:var(--bg-card);font-size:.85rem;font-weight:600;cursor:pointer;text-align:center;min-height:44px}
  .level-tab.active{background:#E91E63;color:#fff;border-color:#E91E63}

  .speed-control{display:flex;flex-direction:column;align-items:center;gap:.3rem;padding:.8rem;background:var(--bg-card);border-radius:14px;border:2px solid var(--border)}
  .speed-control label{font-weight:600;font-size:.9rem}
  .speed-control input[type="range"]{width:80%;accent-color:#E91E63}
  .speed-labels{display:flex;justify-content:space-between;width:80%;font-size:.75rem;color:var(--text-secondary)}

  .item-display{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:2rem;background:var(--bg-card);border-radius:24px;border:2px solid var(--border)}
  .item-icon{font-size:3.5rem}
  .item-text{font-size:2.2rem;font-weight:800;letter-spacing:2px;text-align:center}
  .item-text.sentence{font-size:1.4rem;letter-spacing:0}
  .item-progress{font-size:.85rem;color:var(--text-secondary)}
  .rep-count{font-size:.85rem;color:var(--text-secondary)}

  .your-turn{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:1rem;background:linear-gradient(135deg,#E91E63,#9C27B0);border-radius:16px;color:#fff}
  .yt-icon{font-size:1.5rem} .yt-text{font-size:1.2rem;font-weight:700}

  .actions{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center}
  .btn{padding:.7rem 1.2rem;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);font-size:1rem;cursor:pointer;font-weight:600;min-height:48px}
  .btn:disabled{opacity:.5}
  .listen-btn{background:#2ECC71;color:#fff;border-color:#2ECC71;font-size:1.1rem}
  .slower-btn{background:#F39C12;color:#fff;border-color:#F39C12}
  .repeat-btn{background:#3498DB;color:#fff;border-color:#3498DB}
  .next-btn{background:#9B59B6;color:#fff;border-color:#9B59B6;width:100%;font-size:1.1rem}

  .stats{display:flex;gap:1rem;justify-content:center}
  .stat{display:flex;flex-direction:column;align-items:center;padding:.8rem 1.2rem;background:var(--bg-card);border-radius:14px;border:2px solid var(--border)}
  .stat-label{font-size:.75rem;color:var(--text-secondary);font-weight:600} .stat-val{font-size:1.1rem;font-weight:700}

  .cr{text-align:center;padding:.5rem;font-size:.75rem;color:var(--text-secondary)}
</style>
