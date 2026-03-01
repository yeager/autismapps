<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms } from '$lib/arasaac';
  import { translateKeywords } from '$lib/arasaac/sv-lookup';
  import { locale } from '$lib/i18n';
  import { get } from 'svelte/store';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';

  type Phase = 1 | 2 | 3 | 4 | 5 | 6;

  interface PictoItem { id: number; url: string; word: string; }

  let phase = $state<Phase>(1);
  let items = $state<PictoItem[]>([]);
  let loading = $state(true);
  let selectedItem = $state<PictoItem | null>(null);
  let sentenceStrip = $state<PictoItem[]>([]);
  let showCelebration = $state(false);
  let trialCount = $state(0);
  let successCount = $state(0);
  let targetItem = $state<PictoItem | null>(null);
  let partnerArea = $state(false);
  let iWantPicto = $state<PictoItem | null>(null);
  let iSeePicto = $state<PictoItem | null>(null);
  let iHearPicto = $state<PictoItem | null>(null);
  let phaseProgress = $state<Record<number, { trials: number; successes: number }>>({});

  const PHASE_INFO: Record<Phase, { label: string; desc: string }> = {
    1: { label: 'pecs.phase1', desc: 'pecs.phase1_desc' },
    2: { label: 'pecs.phase2', desc: 'pecs.phase2_desc' },
    3: { label: 'pecs.phase3', desc: 'pecs.phase3_desc' },
    4: { label: 'pecs.phase4', desc: 'pecs.phase4_desc' },
    5: { label: 'pecs.phase5', desc: 'pecs.phase5_desc' },
    6: { label: 'pecs.phase6', desc: 'pecs.phase6_desc' }
  };

  const ITEM_WORDS = ['cookie', 'ball', 'juice', 'car', 'book', 'banana', 'puzzle', 'swing', 'bubbles', 'music', 'water', 'apple'];
  const COMMENT_WORDS = ['dog', 'cat', 'bird', 'flower', 'rain', 'sun', 'tree', 'fish'];

  $effect(() => { loadItems(); loadProgress(); });

  async function loadProgress() {
    const pid = get(activeProfileId);
    if (pid) {
      const data = await getAppProgress(pid, 'pecs-trainer');
      if (data?.phaseProgress) phaseProgress = data.phaseProgress as Record<number, { trials: number; successes: number }>;
    }
  }

  async function saveProgress() {
    const pid = get(activeProfileId);
    if (pid) await saveAppProgress(pid, 'pecs-trainer', { phaseProgress });
  }

  async function loadItems() {
    loading = true;
    const lang = get(locale);
    const words = phase === 6 ? COMMENT_WORDS : ITEM_WORDS;
    const sliced = words.slice(0, phase <= 2 ? 4 : phase <= 4 ? 8 : 12);
    const translated = lang === 'sv' ? await translateKeywords(sliced) : null;
    const results = await Promise.all(
      sliced.map(async (w, i) => {
        const res = await searchPictograms(w, 'en');
        const displayWord = translated ? translated[i].sv : w;
        return res[0] ? { id: res[0].id, url: res[0].url, word: displayWord } : null;
      })
    );
    items = results.filter(Boolean) as PictoItem[];
    // Load "I want" etc.
    if (phase >= 4) {
      const iw = await searchPictograms('I want', lang);
      if (iw[0]) iWantPicto = { id: iw[0].id, url: iw[0].url, word: 'I want' };
    }
    if (phase === 6) {
      const is = await searchPictograms('I see', lang);
      const ih = await searchPictograms('I hear', lang);
      if (is[0]) iSeePicto = { id: is[0].id, url: is[0].url, word: 'I see' };
      if (ih[0]) iHearPicto = { id: ih[0].id, url: ih[0].url, word: 'I hear' };
    }
    if (phase >= 2) {
      targetItem = items[Math.floor(Math.random() * items.length)] || null;
    }
    sentenceStrip = [];
    loading = false;
  }

  function selectPicto(item: PictoItem) {
    trialCount++;
    if (phase === 1) {
      // Phase 1: tap = exchange
      celebrate(item);
    } else if (phase === 2) {
      // Phase 2: must reach partner area first
      selectedItem = item;
      partnerArea = true;
    } else if (phase === 3) {
      // Phase 3: discrimination — must pick target
      if (targetItem && item.word === targetItem.word) {
        celebrate(item);
      } else {
        speak($t('pecs.try_again'));
        // New target
        targetItem = items[Math.floor(Math.random() * items.length)] || null;
      }
    } else if (phase === 4) {
      // Phase 4: add to sentence strip
      sentenceStrip = [...sentenceStrip, item];
    } else if (phase === 5) {
      // Phase 5: respond to "what do you want?"
      sentenceStrip = iWantPicto ? [iWantPicto, item] : [item];
      speakSentence();
      celebrate(item);
    } else if (phase === 6) {
      // Phase 6: commenting
      sentenceStrip = [...sentenceStrip, item];
    }
  }

  function addStarter(starter: PictoItem) {
    sentenceStrip = [starter, ...sentenceStrip.filter(i => i.word !== starter.word)];
  }

  function speakSentence() {
    const text = sentenceStrip.map(i => i.word).join(' ');
    speak(text);
  }

  function submitSentence() {
    if (sentenceStrip.length > 0) {
      speakSentence();
      celebrate(sentenceStrip[sentenceStrip.length - 1]!);
      sentenceStrip = [];
    }
  }

  function deliverToPartner() {
    if (selectedItem) {
      celebrate(selectedItem);
      selectedItem = null;
      partnerArea = false;
    }
  }

  function celebrate(item: PictoItem) {
    successCount++;
    phaseProgress[phase] = { trials: trialCount, successes: successCount };
    saveProgress();
    speak(item.word + '! ' + $t('pecs.great'));
    showCelebration = true;
    setTimeout(() => { showCelebration = false; }, 1500);
  }

  function changePhase(p: Phase) {
    phase = p;
    trialCount = 0;
    successCount = 0;
    loadItems();
  }
</script>

<WelcomeDialog appId="pecs-trainer" titleKey="app.pecs_trainer" purposeKey="welcome.pecsTrainer.purpose" howKey="welcome.pecsTrainer.how" goalKey="welcome.pecsTrainer.goal" icon="🔄" />

<div class="pecs-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto(`${base}/`)} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('pecs.title')} — {$t(PHASE_INFO[phase].label)}</h1>
  </header>

  <!-- Phase selector -->
  <div class="phase-bar">
    {#each [1,2,3,4,5,6] as p}
      <button class="phase-btn" class:active={phase === p} class:completed={phaseProgress[p]?.successes >= 5}
        onclick={() => changePhase(p as Phase)}>
        <span class="phase-num">{p}</span>
        {#if phaseProgress[p]?.successes >= 5}<span class="phase-check">✓</span>{/if}
      </button>
    {/each}
  </div>

  <p class="phase-desc">{$t(PHASE_INFO[phase].desc)}</p>

  {#if loading}
    <div class="loading"><div class="spinner"></div></div>
  {:else}
    <!-- Phase 5: prompt -->
    {#if phase === 5}
      <div class="prompt-bubble">
        <span class="prompt-text">❓ {$t('pecs.what_want')}</span>
      </div>
    {/if}

    <!-- Sentence strip (phase 4-6) -->
    {#if phase >= 4}
      <div class="sentence-strip">
        {#if phase === 4 && iWantPicto}
          <button class="strip-starter" onclick={() => addStarter(iWantPicto!)}>
            <img src={iWantPicto.url} alt="I want" width="40" height="40" />
            <span>I want</span>
          </button>
        {/if}
        {#if phase === 6}
          {#if iSeePicto}
            <button class="strip-starter" onclick={() => addStarter(iSeePicto!)}>
              <img src={iSeePicto.url} alt="I see" width="40" height="40" /><span>I see</span>
            </button>
          {/if}
          {#if iHearPicto}
            <button class="strip-starter" onclick={() => addStarter(iHearPicto!)}>
              <img src={iHearPicto.url} alt="I hear" width="40" height="40" /><span>I hear</span>
            </button>
          {/if}
        {/if}
        <div class="strip-items">
          {#each sentenceStrip as item}
            <div class="strip-item">
              <img src={item.url} alt={item.word} width="48" height="48" />
              <span>{item.word}</span>
            </div>
          {/each}
        </div>
        <button class="strip-speak" onclick={submitSentence} disabled={sentenceStrip.length === 0}>
          🔊 {$t('talk.speak_all')}
        </button>
      </div>
    {/if}

    <!-- Phase 2: partner area -->
    {#if phase === 2 && partnerArea && selectedItem}
      <div class="partner-area">
        <p>{$t('pecs.bring_to_partner')}</p>
        <div class="partner-hand" onclick={deliverToPartner} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') deliverToPartner(); }} role="button" tabindex="0" aria-label="Partner">
          <span>🤲</span>
          <p>{$t('pecs.tap_to_give')}</p>
        </div>
      </div>
    {/if}

    <!-- Phase 3: target hint -->
    {#if phase === 3 && targetItem}
      <div class="target-hint">
        <span>{$t('pecs.find')}:</span>
        <strong>{targetItem.word}</strong>
      </div>
    {/if}

    <!-- Item grid -->
    <div class="items-grid">
      {#each items as item}
        <button class="item-card" onclick={() => selectPicto(item)} onfocus={() => speak(item.word)}>
          <img src={item.url} alt={item.word} width="72" height="72" />
          <span>{item.word}</span>
        </button>
      {/each}
    </div>

    <!-- Score -->
    <div class="score-bar">
      <span>{$t('pecs.trials')}: {trialCount}</span>
      <span>{$t('pecs.correct')}: {successCount}</span>
    </div>
  {/if}

  <!-- Celebration overlay -->
  {#if showCelebration}
    <div class="celebration">
      <span class="celebration-emoji">🎉</span>
      <span class="celebration-text">{$t('pecs.great')}</span>
    </div>
  {/if}

  <footer class="credit">
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0
    · Based on PECS® methodology by Frost &amp; Bondy (1994). PECS® is a trademark of Pyramid Educational Consultants.
  </footer>
</div>

<style>
  .pecs-page { display: flex; flex-direction: column; min-height: 100dvh; position: relative; }
  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.1em; font-weight: 700; flex: 1; }

  .phase-bar { display: flex; gap: 6px; padding: 12px 20px; justify-content: center; }
  .phase-btn {
    width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--border); font-weight: 700; font-size: 1.1em; position: relative; transition: all 0.2s;
    background: var(--bg-card);
  }
  .phase-btn.active { background: #3498DB; color: white; border-color: #3498DB; }
  .phase-btn.completed { border-color: #27AE60; }
  .phase-check { position: absolute; top: -4px; right: -4px; font-size: 0.6em; background: #27AE60; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
  .phase-num { font-size: 0.9em; }

  .phase-desc { text-align: center; padding: 0 20px 12px; color: var(--text-muted); font-size: 0.9em; }

  .prompt-bubble { text-align: center; padding: 12px; }
  .prompt-text { font-size: 1.3em; font-weight: 600; background: rgba(52,152,219,0.1); padding: 10px 24px; border-radius: 100px; }

  .sentence-strip {
    display: flex; align-items: center; gap: 8px; padding: 10px 16px;
    background: rgba(52,152,219,0.05); border: 2px dashed #3498DB; border-radius: var(--radius); margin: 0 16px;
    overflow-x: auto;
  }
  .strip-starter {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 6px 10px; background: #F1C40F; border-radius: 8px; font-size: 0.7em; font-weight: 700; flex-shrink: 0;
  }
  .strip-starter img { border-radius: 4px; }
  .strip-items { display: flex; gap: 6px; flex: 1; min-height: 60px; align-items: center; }
  .strip-item {
    display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 0.7em; font-weight: 500;
  }
  .strip-item img { border-radius: 4px; }
  .strip-speak {
    padding: 8px 16px; background: #27AE60; color: white; border-radius: 100px; font-weight: 600; font-size: 0.85em; flex-shrink: 0;
  }
  .strip-speak:disabled { opacity: 0.4; }

  .partner-area {
    display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px;
    background: rgba(39,174,96,0.05); margin: 0 16px; border-radius: var(--radius);
  }
  .partner-hand {
    font-size: 4em; cursor: pointer; transition: transform 0.2s; text-align: center;
  }
  .partner-hand:hover { transform: scale(1.1); }
  .partner-hand p { font-size: 0.25em; color: var(--text-muted); }

  .target-hint { text-align: center; padding: 8px; font-size: 1.1em; }
  .target-hint strong { color: #E67E22; }

  .items-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px; padding: 16px; flex: 1;
  }
  .item-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 12px 8px; background: var(--bg-card); border: 2px solid var(--border);
    border-radius: var(--radius); transition: all 0.15s;
  }
  .item-card:hover { border-color: #E67E22; transform: scale(1.05); }
  .item-card:active { transform: scale(0.9); }
  .item-card img { border-radius: 8px; }
  .item-card span { font-size: 0.8em; font-weight: 600; }

  .score-bar { display: flex; gap: 20px; justify-content: center; padding: 12px; font-size: 0.85em; font-weight: 600; color: var(--text-muted); }

  .celebration {
    position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.3); z-index: 100; animation: celebIn 0.3s ease;
  }
  .celebration-emoji { font-size: 5em; animation: celebBounce 0.5s ease; }
  .celebration-text { font-size: 2em; font-weight: 800; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
  @keyframes celebIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes celebBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }

  .loading { flex: 1; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: #3498DB; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); line-height: 1.4; }
  .credit a { color: inherit; text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) { .celebration-emoji { animation: none; } .spinner { animation: none; } }
</style>
