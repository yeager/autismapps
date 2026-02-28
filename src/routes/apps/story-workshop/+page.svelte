<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // === BERÄTTARVERKSTAN — Story Workshop ===
  // Narrative speech practice for DTTC's "connected speech" phase
  // Build stories with picture sequences, then practice telling them

  interface StoryScene {
    icon: string;
    text: string;
    pictogramHint: string;
  }

  interface Story {
    id: string;
    title: string;
    icon: string;
    scenes: StoryScene[];
  }

  const STORIES: Story[] = [
    {
      id: 'morning', title: 'God morgon!', icon: '🌅',
      scenes: [
        { icon: '😴', text: 'Barnet sover i sängen.', pictogramHint: 'sleep' },
        { icon: '⏰', text: 'Klockan ringer. Dags att vakna!', pictogramHint: 'alarm' },
        { icon: '🪥', text: 'Barnet borstar tänderna.', pictogramHint: 'brush teeth' },
        { icon: '🥣', text: 'Nu äter barnet frukost.', pictogramHint: 'eat breakfast' },
        { icon: '😊', text: 'Barnet är redo för dagen!', pictogramHint: 'happy' },
      ]
    },
    {
      id: 'park', title: 'I parken', icon: '🏞️',
      scenes: [
        { icon: '🚶', text: 'Barnet går till parken.', pictogramHint: 'walk' },
        { icon: '🐕', text: 'En hund springer förbi.', pictogramHint: 'dog' },
        { icon: '🎈', text: 'Barnet ser en ballong.', pictogramHint: 'balloon' },
        { icon: '🍦', text: 'Mamma köper glass.', pictogramHint: 'ice cream' },
        { icon: '🏠', text: 'De går hem igen.', pictogramHint: 'home' },
      ]
    },
    {
      id: 'rain', title: 'Det regnar!', icon: '🌧️',
      scenes: [
        { icon: '☀️', text: 'Det är soligt ute.', pictogramHint: 'sun' },
        { icon: '☁️', text: 'Moln kommer på himlen.', pictogramHint: 'clouds' },
        { icon: '🌧️', text: 'Det börjar regna!', pictogramHint: 'rain' },
        { icon: '☂️', text: 'Barnet tar paraplyet.', pictogramHint: 'umbrella' },
        { icon: '🌈', text: 'Titta! En regnbåge!', pictogramHint: 'rainbow' },
      ]
    },
    {
      id: 'birthday', title: 'Kalas!', icon: '🎂',
      scenes: [
        { icon: '🎈', text: 'Idag är det kalas!', pictogramHint: 'party' },
        { icon: '🎁', text: 'Barnet får presenter.', pictogramHint: 'gifts' },
        { icon: '🎂', text: 'Tårtan har ljus.', pictogramHint: 'cake' },
        { icon: '🕯️', text: 'Barnet blåser ut ljusen.', pictogramHint: 'candles' },
        { icon: '🥳', text: 'Alla sjunger. Grattis!', pictogramHint: 'celebrate' },
      ]
    },
    {
      id: 'pet', title: 'Katten', icon: '🐱',
      scenes: [
        { icon: '🐱', text: 'Katten sitter i fönstret.', pictogramHint: 'cat' },
        { icon: '🐦', text: 'Den ser en fågel ute.', pictogramHint: 'bird' },
        { icon: '😺', text: 'Katten vill jaga!', pictogramHint: 'chase' },
        { icon: '🚪', text: 'Men dörren är stängd.', pictogramHint: 'door' },
        { icon: '😸', text: 'Katten får mat istället.', pictogramHint: 'food' },
      ]
    },
  ];

  type Phase = 'choose' | 'order' | 'practice' | 'tell';
  const PHASES: Phase[] = ['choose', 'order', 'practice', 'tell'];

  let selectedStory = $state<Story | null>(null);
  let currentPhase = $state<Phase>('choose');
  let currentSceneIdx = $state(0);
  let isPlaying = $state(false);

  async function playScene(scene: StoryScene) {
    if (isPlaying) return;
    isPlaying = true;
    await speak(scene.text, { rate: 0.7 });
    isPlaying = false;
  }

  async function playFullStory() {
    if (!selectedStory || isPlaying) return;
    isPlaying = true;
    for (const scene of selectedStory.scenes) {
      await speak(scene.text, { rate: 0.7 });
      await new Promise(r => setTimeout(r, 800));
    }
    isPlaying = false;
  }

  function nextScene() {
    if (!selectedStory) return;
    if (currentSceneIdx < selectedStory.scenes.length - 1) {
      currentSceneIdx++;
    }
  }

  function prevScene() {
    if (currentSceneIdx > 0) currentSceneIdx--;
  }

  function nextPhase() {
    const idx = PHASES.indexOf(currentPhase);
    if (idx < PHASES.length - 1) {
      currentPhase = PHASES[idx + 1];
      currentSceneIdx = 0;
    }
  }

  function goBack() {
    if (currentPhase !== 'choose' && selectedStory) {
      const idx = PHASES.indexOf(currentPhase);
      if (idx > 0) currentPhase = PHASES[idx - 1];
      else { selectedStory = null; currentPhase = 'choose'; }
    } else if (selectedStory) {
      selectedStory = null; currentPhase = 'choose';
    } else {
      goto('/');
    }
  }

  function selectStory(story: Story) {
    selectedStory = story;
    currentPhase = 'practice';
    currentSceneIdx = 0;
  }
</script>

<WelcomeDialog appId="story-workshop" titleKey="app.story_workshop" purposeKey="welcome.storyWorkshop.purpose" howKey="welcome.storyWorkshop.how" goalKey="welcome.storyWorkshop.goal" icon="📖" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={goBack}>←</button>
    <h1>📖 {$t('storyWorkshop.title')}</h1>
  </header>

  <main class="cnt">
    {#if !selectedStory}
      <p class="intro">{$t('storyWorkshop.intro')}</p>
      <div class="story-list">
        {#each STORIES as story}
          <button class="story-card" onclick={() => selectStory(story)}>
            <span class="story-icon">{story.icon}</span>
            <span class="story-title">{story.title}</span>
            <span class="story-scenes">{story.scenes.length} {$t('storyWorkshop.scene')}</span>
          </button>
        {/each}
      </div>

    {:else}
      <!-- Phase tabs -->
      <div class="phase-tabs">
        {#each PHASES as phase, i}
          {#if phase !== 'choose'}
            <button class="phase-tab" class:active={currentPhase === phase} onclick={() => { currentPhase = phase; currentSceneIdx = 0; }}>
              {$t(`storyWorkshop.step.${phase}`)}
            </button>
          {/if}
        {/each}
      </div>

      {#if currentPhase === 'practice'}
        <!-- Scene by scene with TTS -->
        <div class="scene-view">
          <div class="scene-card">
            <span class="scene-icon">{selectedStory.scenes[currentSceneIdx].icon}</span>
            <p class="scene-text">{selectedStory.scenes[currentSceneIdx].text}</p>
            <span class="scene-num">{$t('storyWorkshop.scene')} {currentSceneIdx + 1}/{selectedStory.scenes.length}</span>
          </div>

          <div class="scene-actions">
            <button class="btn listen-btn" onclick={() => playScene(selectedStory!.scenes[currentSceneIdx])} disabled={isPlaying}>🔊 {$t('storyWorkshop.listen')}</button>
          </div>

          <div class="scene-nav">
            <button class="btn" onclick={prevScene} disabled={currentSceneIdx === 0}>← </button>
            <button class="btn" onclick={nextScene} disabled={currentSceneIdx >= selectedStory.scenes.length - 1}>→</button>
          </div>

          <button class="btn full-story-btn" onclick={playFullStory} disabled={isPlaying}>📖 {$t('storyWorkshop.listen')}</button>
          <button class="btn next-phase-btn" onclick={nextPhase}>{$t('storyWorkshop.step.tell')} →</button>
        </div>

      {:else if currentPhase === 'tell'}
        <!-- Your turn mode — show pictures only, no text -->
        <div class="tell-view">
          <h2 class="your-turn">{$t('storyWorkshop.yourTurn')}</h2>
          <div class="picture-strip">
            {#each selectedStory.scenes as scene, i}
              <div class="picture-frame" class:current={i === currentSceneIdx} onclick={() => currentSceneIdx = i}>
                <span class="pf-icon">{scene.icon}</span>
                <span class="pf-num">{i + 1}</span>
              </div>
            {/each}
          </div>

          <div class="current-picture">
            <span class="big-icon">{selectedStory.scenes[currentSceneIdx].icon}</span>
          </div>

          <div class="scene-nav">
            <button class="btn" onclick={prevScene} disabled={currentSceneIdx === 0}>←</button>
            <button class="btn" onclick={nextScene} disabled={currentSceneIdx >= selectedStory.scenes.length - 1}>→</button>
          </div>

          <button class="btn new-story-btn" onclick={() => { selectedStory = null; currentPhase = 'choose'; }}>
            🔄 {$t('storyWorkshop.newStory')}
          </button>
        </div>

      {:else if currentPhase === 'order'}
        <!-- Show all scenes as a timeline -->
        <div class="order-view">
          {#each selectedStory.scenes as scene, i}
            <div class="timeline-item">
              <div class="timeline-num">{i + 1}</div>
              <span class="timeline-icon">{scene.icon}</span>
              <p class="timeline-text">{scene.text}</p>
              <button class="timeline-play" onclick={() => playScene(scene)} disabled={isPlaying}>🔊</button>
            </div>
          {/each}
          <button class="btn next-phase-btn" onclick={nextPhase}>{$t('storyWorkshop.next')} →</button>
        </div>
      {/if}
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

  .story-list{display:flex;flex-direction:column;gap:.75rem}
  .story-card{display:flex;align-items:center;gap:1rem;padding:1.2rem;border:2px solid var(--border);border-radius:16px;background:var(--bg-card);cursor:pointer;min-height:56px}
  .story-card:active{transform:scale(.97)}
  .story-icon{font-size:2.5rem} .story-title{flex:1;font-weight:700;font-size:1.1rem} .story-scenes{font-size:.85rem;color:var(--text-secondary)}

  .phase-tabs{display:flex;gap:.3rem;margin-bottom:1rem}
  .phase-tab{flex:1;padding:.6rem;border-radius:10px;border:2px solid var(--border);background:var(--bg-card);font-size:.85rem;font-weight:600;cursor:pointer;text-align:center;min-height:44px}
  .phase-tab.active{background:#E91E63;color:#fff;border-color:#E91E63}

  .scene-view,.tell-view,.order-view{display:flex;flex-direction:column;align-items:center;gap:1rem}
  .scene-card{display:flex;flex-direction:column;align-items:center;gap:.8rem;padding:2rem;background:var(--bg-card);border-radius:24px;border:2px solid var(--border);width:100%}
  .scene-icon{font-size:4rem} .scene-text{font-size:1.3rem;font-weight:600;text-align:center;line-height:1.5}
  .scene-num{font-size:.85rem;color:var(--text-secondary)}
  .scene-actions{display:flex;gap:.5rem}
  .scene-nav{display:flex;gap:1rem}

  .btn{padding:.7rem 1.2rem;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);font-size:1rem;cursor:pointer;font-weight:600;min-height:48px}
  .btn:disabled{opacity:.5}
  .listen-btn{background:#2ECC71;color:#fff;border-color:#2ECC71}
  .full-story-btn{background:#3498DB;color:#fff;border-color:#3498DB;width:100%}
  .next-phase-btn{background:#9B59B6;color:#fff;border-color:#9B59B6;width:100%}
  .new-story-btn{background:#E67E22;color:#fff;border-color:#E67E22}

  .your-turn{text-align:center;font-size:1.5rem;color:#E91E63}
  .picture-strip{display:flex;gap:.5rem;overflow-x:auto;width:100%;padding:.5rem}
  .picture-frame{width:60px;height:60px;border-radius:14px;border:2px solid var(--border);background:var(--bg-card);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
  .picture-frame.current{border-color:#E91E63;border-width:3px}
  .pf-icon{font-size:1.5rem} .pf-num{font-size:.7rem;color:var(--text-secondary)}
  .current-picture{padding:2rem;background:var(--bg-card);border-radius:24px;border:2px solid var(--border);width:100%;text-align:center}
  .big-icon{font-size:6rem}

  .timeline-item{display:flex;align-items:center;gap:.75rem;padding:.8rem;background:var(--bg-card);border-radius:12px;border:1px solid var(--border);width:100%}
  .timeline-num{width:30px;height:30px;border-radius:50%;background:#E91E63;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0}
  .timeline-icon{font-size:1.5rem;flex-shrink:0} .timeline-text{flex:1;font-size:.95rem}
  .timeline-play{background:none;border:none;font-size:1.2rem;cursor:pointer;min-width:40px;min-height:40px}

  .cr{text-align:center;padding:.5rem;font-size:.75rem;color:var(--text-secondary)}
</style>
