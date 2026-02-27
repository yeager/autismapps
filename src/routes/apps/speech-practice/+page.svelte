<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // === PRATPRAKTIKEN — Speech Practice ===
  // Structured repetition for CAS/dyspraxia therapy
  // DTTC-inspired: model → simultaneous → slightly delayed → independent

  type PracticeItem = {
    text: string;
    icon: string;
    labelKey: string;
    difficulty: number; // 1-3
  };

  const PRACTICE_SETS: { id: string; labelKey: string; items: PracticeItem[] }[] = [
    {
      id: 'simple', labelKey: 'speechPractice.set.simple',
      items: [
        { text: 'ma', icon: '👩', labelKey: 'speechPractice.item.ma', difficulty: 1 },
        { text: 'pa', icon: '👨', labelKey: 'speechPractice.item.pa', difficulty: 1 },
        { text: 'ba', icon: '👶', labelKey: 'speechPractice.item.ba', difficulty: 1 },
        { text: 'da', icon: '👋', labelKey: 'speechPractice.item.da', difficulty: 1 },
        { text: 'na', icon: '🙂', labelKey: 'speechPractice.item.na', difficulty: 1 },
        { text: 'la', icon: '🎵', labelKey: 'speechPractice.item.la', difficulty: 1 },
      ]
    },
    {
      id: 'words', labelKey: 'speechPractice.set.words',
      items: [
        { text: 'hej', icon: '👋', labelKey: 'speechPractice.item.hej', difficulty: 1 },
        { text: 'ja', icon: '✅', labelKey: 'speechPractice.item.ja', difficulty: 1 },
        { text: 'nej', icon: '❌', labelKey: 'speechPractice.item.nej', difficulty: 1 },
        { text: 'tack', icon: '🙏', labelKey: 'speechPractice.item.tack', difficulty: 1 },
        { text: 'mat', icon: '🍕', labelKey: 'speechPractice.item.mat', difficulty: 2 },
        { text: 'vatten', icon: '💧', labelKey: 'speechPractice.item.vatten', difficulty: 2 },
        { text: 'hjälp', icon: '🆘', labelKey: 'speechPractice.item.hjalp', difficulty: 2 },
        { text: 'titta', icon: '👀', labelKey: 'speechPractice.item.titta', difficulty: 2 },
      ]
    },
    {
      id: 'phrases', labelKey: 'speechPractice.set.phrases',
      items: [
        { text: 'jag vill', icon: '🙋', labelKey: 'speechPractice.item.jagVill', difficulty: 2 },
        { text: 'jag vill ha', icon: '🤲', labelKey: 'speechPractice.item.jagVillHa', difficulty: 2 },
        { text: 'vad är det', icon: '❓', labelKey: 'speechPractice.item.vadArDet', difficulty: 3 },
        { text: 'kan jag få', icon: '🙏', labelKey: 'speechPractice.item.kanJagFa', difficulty: 3 },
        { text: 'jag heter', icon: '📛', labelKey: 'speechPractice.item.jagHeter', difficulty: 2 },
        { text: 'kom och titta', icon: '👀', labelKey: 'speechPractice.item.komOchTitta', difficulty: 3 },
      ]
    },
  ];

  // DTTC stages
  const STAGES = ['model', 'simultaneous', 'delayed', 'independent'] as const;
  type Stage = typeof STAGES[number];

  let selectedSet = $state<typeof PRACTICE_SETS[0] | null>(null);
  let currentItemIdx = $state(0);
  let currentStage = $state<Stage>('model');
  let speechRate = $state(0.5);
  let repetitions = $state(0);
  let isPlaying = $state(false);
  let stageCompleted = $state<Set<string>>(new Set());

  const currentItem = $derived(selectedSet ? selectedSet.items[currentItemIdx] : null);
  const stageIdx = $derived(STAGES.indexOf(currentStage));

  function selectSet(set: typeof PRACTICE_SETS[0]) {
    selectedSet = set;
    currentItemIdx = 0;
    currentStage = 'model';
    repetitions = 0;
    stageCompleted = new Set();
    speak($t(set.labelKey), { rate: speechRate });
  }

  async function playModel() {
    if (!currentItem || isPlaying) return;
    isPlaying = true;
    await speak(currentItem.text, { rate: speechRate });
    repetitions++;
    stageCompleted = new Set([...stageCompleted, `${currentItemIdx}-${currentStage}`]);
    isPlaying = false;
  }

  async function playWithPause() {
    if (!currentItem || isPlaying) return;
    isPlaying = true;
    // Say it, pause, say again (DTTC repetition)
    await speak(currentItem.text, { rate: speechRate });
    await new Promise(r => setTimeout(r, 2000));
    await speak(currentItem.text, { rate: speechRate });
    repetitions += 2;
    stageCompleted = new Set([...stageCompleted, `${currentItemIdx}-${currentStage}`]);
    isPlaying = false;
  }

  async function playSlow() {
    if (!currentItem || isPlaying) return;
    isPlaying = true;
    await speak(currentItem.text, { rate: 0.4 });
    repetitions++;
    isPlaying = false;
  }

  function nextStage() {
    const idx = STAGES.indexOf(currentStage);
    if (idx < STAGES.length - 1) {
      currentStage = STAGES[idx + 1];
    }
  }

  function prevStage() {
    const idx = STAGES.indexOf(currentStage);
    if (idx > 0) {
      currentStage = STAGES[idx - 1];
    }
  }

  function nextItem() {
    if (!selectedSet) return;
    if (currentItemIdx < selectedSet.items.length - 1) {
      currentItemIdx++;
      currentStage = 'model';
      repetitions = 0;
    }
  }

  function prevItem() {
    if (currentItemIdx > 0) {
      currentItemIdx--;
      currentStage = 'model';
      repetitions = 0;
    }
  }

  function getStageLabel(stage: Stage): string {
    return $t(`speechPractice.stage.${stage}`);
  }

  function getStageDesc(stage: Stage): string {
    return $t(`speechPractice.stageDesc.${stage}`);
  }
</script>

<WelcomeDialog appId="speech-practice" titleKey="app.speech_practice" purposeKey="welcome.speechPractice.purpose" howKey="welcome.speechPractice.how" goalKey="welcome.speechPractice.goal" icon="🗣️" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => selectedSet ? (selectedSet = null) : goto('/')}>←</button>
    <h1>🗣️ {$t('speechPractice.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedSet}
      <p class="intro">{$t('speechPractice.intro')}</p>
      <div class="sets">
        {#each PRACTICE_SETS as set}
          <button class="set-card" onclick={() => selectSet(set)}>
            <span class="set-icon">{set.items[0].icon}</span>
            <span class="set-name">{$t(set.labelKey)}</span>
            <span class="set-count">{set.items.length} {$t('speechPractice.items')}</span>
          </button>
        {/each}
      </div>
    {:else if currentItem}
      <div class="practice-view">
        <div class="speed-control">
          <label>{$t('speechPractice.speed')}: {speechRate.toFixed(1)}x</label>
          <input type="range" min="0.4" max="1.0" step="0.1" bind:value={speechRate} />
        </div>

        <!-- Item navigation -->
        <div class="item-nav">
          <button class="nav-btn" onclick={prevItem} disabled={currentItemIdx === 0}>⬅️</button>
          <span class="item-progress">{currentItemIdx + 1} / {selectedSet.items.length}</span>
          <button class="nav-btn" onclick={nextItem} disabled={currentItemIdx >= selectedSet.items.length - 1}>➡️</button>
        </div>

        <!-- Current word display -->
        <div class="word-display">
          <span class="word-icon">{currentItem.icon}</span>
          <span class="word-text">{currentItem.text}</span>
          <span class="reps">{$t('speechPractice.reps')}: {repetitions}</span>
        </div>

        <!-- DTTC Stage indicator -->
        <div class="stages">
          {#each STAGES as stage, i}
            <button
              class="stage-pill"
              class:active={currentStage === stage}
              class:done={stageCompleted.has(`${currentItemIdx}-${stage}`)}
              onclick={() => currentStage = stage}
            >
              <span class="stage-num">{i + 1}</span>
              <span class="stage-label">{getStageLabel(stage)}</span>
            </button>
          {/each}
        </div>

        <p class="stage-desc">{getStageDesc(currentStage)}</p>

        <!-- Action buttons -->
        <div class="actions">
          <button class="btn model-btn" onclick={playModel} disabled={isPlaying}>
            🔊 {$t('speechPractice.listen')}
          </button>
          <button class="btn slow-btn" onclick={playSlow} disabled={isPlaying}>
            🐢 {$t('speechPractice.slow')}
          </button>
          <button class="btn repeat-btn" onclick={playWithPause} disabled={isPlaying}>
            🔁 {$t('speechPractice.repeatPause')}
          </button>
        </div>

        <!-- Stage navigation -->
        <div class="stage-nav">
          <button class="btn" onclick={prevStage} disabled={stageIdx === 0}>
            ← {$t('speechPractice.prevStage')}
          </button>
          <button class="btn next-stage" onclick={nextStage} disabled={stageIdx >= STAGES.length - 1}>
            {$t('speechPractice.nextStage')} →
          </button>
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

  .sets { display:flex; flex-direction:column; gap:.75rem; }
  .set-card { display:flex; align-items:center; gap:1rem; padding:1.2rem; border:2px solid var(--border); border-radius:16px; background:var(--bg-card); cursor:pointer; min-height:56px; }
  .set-card:active { transform:scale(0.97); }
  .set-icon { font-size:2rem; }
  .set-name { flex:1; font-weight:600; font-size:1.1rem; }
  .set-count { font-size:.85rem; color:var(--text-secondary); }

  .practice-view { display:flex; flex-direction:column; align-items:center; gap:1rem; }
  .speed-control { display:flex; flex-direction:column; align-items:center; gap:.3rem; width:100%; }
  .speed-control label { font-weight:600; font-size:.9rem; }
  .speed-control input[type="range"] { width:70%; accent-color:#2ECC71; }

  .item-nav { display:flex; align-items:center; gap:1rem; }
  .nav-btn { width:44px; height:44px; border-radius:50%; border:2px solid var(--border); background:var(--bg-card); font-size:1.2rem; cursor:pointer; }
  .nav-btn:disabled { opacity:.3; }
  .item-progress { font-weight:600; }

  .word-display { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem; background:var(--bg-card); border-radius:20px; border:2px solid var(--border); width:100%; }
  .word-icon { font-size:3.5rem; }
  .word-text { font-size:2.2rem; font-weight:800; letter-spacing:3px; }
  .reps { font-size:.85rem; color:var(--text-secondary); }

  .stages { display:flex; gap:.5rem; flex-wrap:wrap; justify-content:center; }
  .stage-pill { display:flex; align-items:center; gap:.4rem; padding:.5rem .8rem; border-radius:20px; border:2px solid var(--border); background:var(--bg-card); cursor:pointer; font-size:.85rem; transition:all .2s; }
  .stage-pill.active { background:#2ECC71; color:#fff; border-color:#2ECC71; }
  .stage-pill.done { border-color:#27AE60; }
  .stage-num { background:rgba(0,0,0,.15); border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.75rem; }
  .stage-label { font-weight:600; }
  .stage-desc { text-align:center; font-size:.9rem; color:var(--text-secondary); font-style:italic; }

  .actions { display:flex; gap:.75rem; flex-wrap:wrap; justify-content:center; }
  .btn { padding:.7rem 1rem; border-radius:12px; border:2px solid var(--border); background:var(--bg-card); font-size:.95rem; cursor:pointer; font-weight:600; min-height:48px; }
  .btn:disabled { opacity:.5; }
  .model-btn { background:#2ECC71; color:#fff; border-color:#2ECC71; }
  .slow-btn { background:#F39C12; color:#fff; border-color:#F39C12; }
  .repeat-btn { background:#3498DB; color:#fff; border-color:#3498DB; }
  .next-stage { background:#9B59B6; color:#fff; border-color:#9B59B6; }

  .stage-nav { display:flex; gap:1rem; }

  .cr { text-align:center; padding:.5rem; font-size:.75rem; color:var(--text-secondary); }
</style>
