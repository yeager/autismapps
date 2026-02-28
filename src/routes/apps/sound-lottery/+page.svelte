<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // === LJUDLOTTERIET — Sound Lottery ===
  // Randomized phoneme practice with hierarchy:
  // isolation → syllable → word → sentence

  interface PhonemeData {
    sound: string;
    isolation: string;
    syllables: string[];
    words: { text: string; icon: string }[];
    sentences: string[];
  }

  const PHONEMES: PhonemeData[] = [
    { sound: 'B', isolation: 'b', syllables: ['ba', 'be', 'bi', 'bo', 'bu', 'bå'], words: [{ text: 'boll', icon: '⚽' }, { text: 'banan', icon: '🍌' }, { text: 'bil', icon: '🚗' }, { text: 'bok', icon: '📖' }], sentences: ['Bollen är blå.', 'Bilen kör fort.', 'Barnet badar.'] },
    { sound: 'D', isolation: 'd', syllables: ['da', 'de', 'di', 'do', 'du', 'då'], words: [{ text: 'dörr', icon: '🚪' }, { text: 'docka', icon: '🧸' }, { text: 'drake', icon: '🐉' }, { text: 'duva', icon: '🕊️' }], sentences: ['Dörren är öppen.', 'Dockan dansar.', 'Draken flyger.'] },
    { sound: 'F', isolation: 'fff', syllables: ['fa', 'fe', 'fi', 'fo', 'fu', 'få'], words: [{ text: 'fisk', icon: '🐟' }, { text: 'fjäril', icon: '🦋' }, { text: 'fågel', icon: '🐦' }, { text: 'flaska', icon: '🍶' }], sentences: ['Fisken simmar.', 'Fjärilen flyger.', 'Fågeln sjunger.'] },
    { sound: 'G', isolation: 'g', syllables: ['ga', 'ge', 'gi', 'go', 'gu', 'gå'], words: [{ text: 'glass', icon: '🍦' }, { text: 'gris', icon: '🐷' }, { text: 'groda', icon: '🐸' }, { text: 'gul', icon: '🟡' }], sentences: ['Glassen är god.', 'Grisen grymtar.', 'Grodan hoppar.'] },
    { sound: 'K', isolation: 'k', syllables: ['ka', 'ke', 'ki', 'ko', 'ku', 'kå'], words: [{ text: 'katt', icon: '🐱' }, { text: 'ko', icon: '🐄' }, { text: 'kaka', icon: '🍰' }, { text: 'kanin', icon: '🐰' }], sentences: ['Katten sover.', 'Kon äter gräs.', 'Kakan är god.'] },
    { sound: 'L', isolation: 'lll', syllables: ['la', 'le', 'li', 'lo', 'lu', 'lå'], words: [{ text: 'lejon', icon: '🦁' }, { text: 'lampa', icon: '💡' }, { text: 'lök', icon: '🧅' }, { text: 'låda', icon: '📦' }], sentences: ['Lejonet lever.', 'Lampan lyser.', 'Lådan är stor.'] },
    { sound: 'M', isolation: 'mmm', syllables: ['ma', 'me', 'mi', 'mo', 'mu', 'må'], words: [{ text: 'mus', icon: '🐭' }, { text: 'mamma', icon: '👩' }, { text: 'mat', icon: '🍕' }, { text: 'måne', icon: '🌙' }], sentences: ['Musen springer.', 'Mamma lagar mat.', 'Månen lyser.'] },
    { sound: 'N', isolation: 'nnn', syllables: ['na', 'ne', 'ni', 'no', 'nu', 'nå'], words: [{ text: 'näsa', icon: '👃' }, { text: 'nalle', icon: '🧸' }, { text: 'nycklar', icon: '🔑' }, { text: 'natt', icon: '🌙' }], sentences: ['Nallen är mjuk.', 'Natten är mörk.', 'Nyckeln passar.'] },
    { sound: 'P', isolation: 'p', syllables: ['pa', 'pe', 'pi', 'po', 'pu', 'på'], words: [{ text: 'pappa', icon: '👨' }, { text: 'pizza', icon: '🍕' }, { text: 'pil', icon: '➡️' }, { text: 'polis', icon: '👮' }], sentences: ['Pappa läser.', 'Pizzan är varm.', 'Polisen hjälper.'] },
    { sound: 'R', isolation: 'rrr', syllables: ['ra', 're', 'ri', 'ro', 'ru', 'rå'], words: [{ text: 'robot', icon: '🤖' }, { text: 'raket', icon: '🚀' }, { text: 'ris', icon: '🍚' }, { text: 'ring', icon: '💍' }], sentences: ['Roboten rör sig.', 'Raketen flyger.', 'Ringen är rund.'] },
    { sound: 'S', isolation: 'sss', syllables: ['sa', 'se', 'si', 'so', 'su', 'så'], words: [{ text: 'sol', icon: '☀️' }, { text: 'sko', icon: '👟' }, { text: 'svan', icon: '🦢' }, { text: 'säng', icon: '🛏️' }], sentences: ['Solen skiner.', 'Skon är ny.', 'Svanen simmar.'] },
    { sound: 'T', isolation: 't', syllables: ['ta', 'te', 'ti', 'to', 'tu', 'tå'], words: [{ text: 'tåg', icon: '🚂' }, { text: 'tiger', icon: '🐯' }, { text: 'tomat', icon: '🍅' }, { text: 'träd', icon: '🌳' }], sentences: ['Tåget kommer.', 'Tigern smyger.', 'Trädet är grönt.'] },
    { sound: 'V', isolation: 'vvv', syllables: ['va', 've', 'vi', 'vo', 'vu', 'vå'], words: [{ text: 'val', icon: '🐳' }, { text: 'vatten', icon: '💧' }, { text: 'varg', icon: '🐺' }, { text: 'vind', icon: '💨' }], sentences: ['Valen simmar.', 'Vattnet rinner.', 'Vinden blåser.'] },
  ];

  type Level = 'isolation' | 'syllable' | 'word' | 'sentence';
  const LEVELS: Level[] = ['isolation', 'syllable', 'word', 'sentence'];

  let spinning = $state(false);
  let selectedPhoneme = $state<PhonemeData | null>(null);
  let currentLevel = $state<Level>('isolation');
  let currentSyllableIdx = $state(0);
  let currentWordIdx = $state(0);
  let currentSentenceIdx = $state(0);
  let reps = $state(0);
  let isPlaying = $state(false);
  let wheelAngle = $state(0);
  let masteredSounds = $state<Set<string>>(new Set());
  let totalReps = $state(0);

  // Load progress


  async function spinWheel() {
    if (spinning) return;
    spinning = true;
    reps = 0;
    currentLevel = 'isolation';
    currentSyllableIdx = 0;
    currentWordIdx = 0;
    currentSentenceIdx = 0;

    // Animate wheel
    const extraSpins = 3 + Math.random() * 3;
    const targetIdx = Math.floor(Math.random() * PHONEMES.length);
    const targetAngle = extraSpins * 360 + (targetIdx / PHONEMES.length) * 360;
    wheelAngle = targetAngle;

    await new Promise(r => setTimeout(r, 2000));
    selectedPhoneme = PHONEMES[targetIdx];
    spinning = false;

    // Auto-play the sound
    await speak(selectedPhoneme.isolation, { rate: 0.6 });
  }

  async function playCurrentTarget() {
    if (!selectedPhoneme || isPlaying) return;
    isPlaying = true;
    let text = '';
    if (currentLevel === 'isolation') text = selectedPhoneme.isolation;
    else if (currentLevel === 'syllable') text = selectedPhoneme.syllables[currentSyllableIdx];
    else if (currentLevel === 'word') text = selectedPhoneme.words[currentWordIdx].text;
    else text = selectedPhoneme.sentences[currentSentenceIdx];

    await speak(text, { rate: currentLevel === 'isolation' ? 0.5 : 0.7 });
    reps++;
    totalReps++;
    isPlaying = false;
  }

  function nextInLevel() {
    if (!selectedPhoneme) return;
    if (currentLevel === 'syllable') currentSyllableIdx = (currentSyllableIdx + 1) % selectedPhoneme.syllables.length;
    else if (currentLevel === 'word') currentWordIdx = (currentWordIdx + 1) % selectedPhoneme.words.length;
    else if (currentLevel === 'sentence') currentSentenceIdx = (currentSentenceIdx + 1) % selectedPhoneme.sentences.length;
  }

  function advanceLevel() {
    const idx = LEVELS.indexOf(currentLevel);
    if (idx < LEVELS.length - 1) {
      currentLevel = LEVELS[idx + 1];
      reps = 0;
    } else if (selectedPhoneme) {
      // Mastered!
      masteredSounds = new Set([...masteredSounds, selectedPhoneme.sound]);
      
    }
  }

  function getLevelLabel(level: Level): string {
    return $t(`soundLottery.level.${level}`);
  }

  function getCurrentDisplay(): { text: string; icon: string } {
    if (!selectedPhoneme) return { text: '', icon: '' };
    if (currentLevel === 'isolation') return { text: selectedPhoneme.isolation, icon: '🔤' };
    if (currentLevel === 'syllable') return { text: selectedPhoneme.syllables[currentSyllableIdx], icon: '🔡' };
    if (currentLevel === 'word') {
      const w = selectedPhoneme.words[currentWordIdx];
      return { text: w.text, icon: w.icon };
    }
    return { text: selectedPhoneme.sentences[currentSentenceIdx], icon: '💬' };
  }
</script>

<WelcomeDialog appId="sound-lottery" titleKey="app.sound_lottery" purposeKey="welcome.soundLottery.purpose" howKey="welcome.soundLottery.how" goalKey="welcome.soundLottery.goal" icon="🎰" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedPhoneme ? (selectedPhoneme = null) : goto('/')}>←</button>
    <h1>🎰 {$t('soundLottery.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedPhoneme}
      <p class="intro">{$t('soundLottery.intro')}</p>

      <!-- Wheel -->
      <div class="wheel-container">
        <div class="wheel" style="transform: rotate({wheelAngle}deg)">
          {#each PHONEMES as p, i}
            <div class="wheel-segment" style="transform: rotate({i * (360/PHONEMES.length)}deg)">
              <span class="segment-letter" class:mastered={masteredSounds.has(p.sound)}>{p.sound}</span>
            </div>
          {/each}
        </div>
        <div class="wheel-pointer">▼</div>
      </div>

      <button class="btn spin-btn" onclick={spinWheel} disabled={spinning}>
        {spinning ? '🎡 ...' : `🎰 ${$t('soundLottery.spin')}`}
      </button>

      <!-- Progress -->
      <div class="progress-bar">
        <span>{$t('soundLottery.mastered')}: {masteredSounds.size}/{PHONEMES.length}</span>
        <div class="bar"><div class="bar-fill" style="width: {(masteredSounds.size/PHONEMES.length)*100}%"></div></div>
        <span class="total-reps">{$t('soundLottery.reps')}: {totalReps}</span>
      </div>

    {:else}
      <!-- Practice view -->
      <div class="practice">
        <div class="phoneme-header">
          <span class="big-sound">{selectedPhoneme.sound}</span>
        </div>

        <!-- Level tabs -->
        <div class="level-tabs">
          {#each LEVELS as level, i}
            <button class="level-tab" class:active={currentLevel === level} class:completed={LEVELS.indexOf(currentLevel) > i} onclick={() => { currentLevel = level; reps = 0; }}>
              {getLevelLabel(level)}
            </button>
          {/each}
        </div>

        <!-- Current target -->
        
        <div class="target-display">
          <span class="target-icon">{getCurrentDisplay().icon}</span>
          <span class="target-text" class:sentence={currentLevel === 'sentence'}>{getCurrentDisplay().text}</span>
          <span class="rep-count">{$t('soundLottery.reps')}: {reps}</span>
        </div>

        <div class="actions">
          <button class="btn listen-btn" onclick={playCurrentTarget} disabled={isPlaying}>🔊 {$t('soundLottery.listen')}</button>
          {#if currentLevel !== 'isolation'}
            <button class="btn next-in-level" onclick={nextInLevel}>🔀 {$t('speechRhythm.next')}</button>
          {/if}
        </div>

        {#if reps >= 3}
          <button class="btn advance-btn" onclick={advanceLevel}>
            {LEVELS.indexOf(currentLevel) < LEVELS.length - 1 ? `⬆️ ${$t('soundLottery.next')}` : '⭐ Bemästrad!'}
          </button>
        {/if}
      </div>
    {/if}
  </main>
  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app{min-height:100dvh;display:flex;flex-direction:column;background:var(--bg);color:var(--text)}
  .hdr{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:.75rem;padding:1rem;background:var(--bg-card);border-bottom:1px solid var(--border)}
  .back{font-size:1.5rem;background:none;border:none;cursor:pointer;color:var(--text);min-width:48px;min-height:48px;display:flex;align-items:center;justify-content:center}
  h1{font-size:1.4rem;margin:0;flex:1}
  .cnt{flex:1;padding:1rem;max-width:600px;margin:0 auto;width:100%}
  .intro{text-align:center;color:var(--text-secondary);margin-bottom:1.5rem;font-size:1.1rem}

  .wheel-container{position:relative;width:250px;height:250px;margin:0 auto 1rem}
  .wheel{width:100%;height:100%;border-radius:50%;border:4px solid var(--border);background:var(--bg-card);position:relative;transition:transform 2s cubic-bezier(.17,.67,.12,.99)}
  .wheel-segment{position:absolute;top:50%;left:50%;transform-origin:0 0}
  .segment-letter{position:absolute;transform:translate(-50%,-50%) translateY(-90px);font-weight:800;font-size:1.1rem;color:var(--text)}
  .segment-letter.mastered{color:#2ECC71}
  .wheel-pointer{position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:1.5rem;color:#E91E63;z-index:2}

  .btn{padding:.7rem 1.2rem;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);font-size:1rem;cursor:pointer;font-weight:600;min-height:48px}
  .btn:disabled{opacity:.5}
  .spin-btn{background:linear-gradient(135deg,#E91E63,#9C27B0);color:#fff;border:none;font-size:1.3rem;padding:1rem 2rem;display:block;margin:0 auto}
  .spin-btn:active{transform:scale(.95)}
  .listen-btn{background:#2ECC71;color:#fff;border-color:#2ECC71}
  .next-in-level{background:#F39C12;color:#fff;border-color:#F39C12}
  .advance-btn{background:#9B59B6;color:#fff;border-color:#9B59B6;width:100%;font-size:1.1rem}

  .progress-bar{display:flex;flex-direction:column;align-items:center;gap:.3rem;margin-top:1rem;padding:1rem;background:var(--bg-card);border-radius:16px;border:2px solid var(--border)}
  .bar{width:100%;height:12px;background:var(--bg);border-radius:6px;overflow:hidden}
  .bar-fill{height:100%;background:linear-gradient(90deg,#2ECC71,#27AE60);border-radius:6px;transition:width .5s}
  .total-reps{font-size:.85rem;color:var(--text-secondary)}

  .practice{display:flex;flex-direction:column;align-items:center;gap:1rem}
  .phoneme-header{display:flex;justify-content:center}
  .big-sound{font-size:4rem;font-weight:900;color:#E91E63}

  .level-tabs{display:flex;gap:.3rem;width:100%;overflow-x:auto}
  .level-tab{flex:1;padding:.6rem;border-radius:10px;border:2px solid var(--border);background:var(--bg-card);font-size:.85rem;font-weight:600;cursor:pointer;text-align:center;min-height:44px}
  .level-tab.active{background:#E91E63;color:#fff;border-color:#E91E63}
  .level-tab.completed{background:#2ECC71;color:#fff;border-color:#2ECC71}

  .target-display{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;background:var(--bg-card);border-radius:20px;border:2px solid var(--border);width:100%}
  .target-icon{font-size:3rem}
  .target-text{font-size:2rem;font-weight:800;letter-spacing:2px}
  .target-text.sentence{font-size:1.3rem;letter-spacing:0}
  .rep-count{font-size:.85rem;color:var(--text-secondary)}

  .actions{display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center}

  .cr{text-align:center;padding:.5rem;font-size:.75rem;color:var(--text-secondary)}
</style>
