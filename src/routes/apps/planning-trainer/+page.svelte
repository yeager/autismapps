<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly, slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  // --- ARASAAC pictogram URL helper ---
  function pictoUrl(id: number): string {
    return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
  }

  // --- Validated ARASAAC IDs ---
  const PICTO = {
    plan: 11706,
    clean: 26172,
    homework: 11228,
    pack: 10245,
    cook: 2342,
    time: 22631,
    clock: 5561,
    important: 11471,
    urgent: 36675,
    list: 7144,
    star: 2752,
    think: 8661,
    morning: 25704,
    school: 32446,
    suitcase: 2931,
    food: 4610,
    finish: 32814,
    trophy: 3162,
    broom: 2693,
    book: 2450,
    backpack: 2475,
    brushTeeth: 2326,
    getDressed: 6627,
    bed: 25900,
    organize: 35653,
    step: 35811,
    sort: 37361,
    improve: 11705,
    congratulations: 38566,
  } as const;

  // --- Types ---
  interface PlanStep {
    id: string;
    text: string;
    pictoId: number;
    estimatedMin: number;
    suggestedMin: number;
    done: boolean;
  }

  interface Plan {
    id: string;
    title: string;
    pictoId: number;
    steps: PlanStep[];
    priority?: 'urgent-important' | 'important' | 'not-important';
    review?: { rating: number; reflection: string };
    createdAt: number;
  }

  type View = 'home' | 'breakdown' | 'time-estimate' | 'priority' | 'checklist' | 'review' | 'templates';

  // --- State ---
  let currentView = $state<View>('home');
  let currentPlan = $state<Plan | null>(null);
  let savedPlans = $state<Plan[]>([]);
  let customTaskInput = $state('');
  let editingStepIdx = $state<number | null>(null);
  let newStepText = $state('');
  let dragIdx = $state<number | null>(null);
  let reviewRating = $state(3);
  let reviewText = $state('');

  // --- localStorage ---
  const STORAGE_KEY = 'planning-trainer-plans';

  function loadPlans() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) savedPlans = JSON.parse(raw);
    } catch { /* ignore */ }
  }

  function savePlans() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
    } catch { /* ignore */ }
  }

  // Load on mount
  if (typeof localStorage !== 'undefined') loadPlans();

  // --- Templates with validated ARASAAC IDs ---
  interface Template {
    titleKey: string;
    pictoId: number;
    steps: { textKey: string; pictoId: number; suggestedMin: number }[];
  }

  const TEMPLATES: Template[] = [
    {
      titleKey: 'plan.tpl.cleanRoom',
      pictoId: PICTO.clean,
      steps: [
        { textKey: 'plan.tpl.cleanRoom.s1', pictoId: PICTO.bed, suggestedMin: 5 },
        { textKey: 'plan.tpl.cleanRoom.s2', pictoId: PICTO.organize, suggestedMin: 10 },
        { textKey: 'plan.tpl.cleanRoom.s3', pictoId: PICTO.broom, suggestedMin: 5 },
        { textKey: 'plan.tpl.cleanRoom.s4', pictoId: PICTO.clean, suggestedMin: 5 },
      ],
    },
    {
      titleKey: 'plan.tpl.homework',
      pictoId: PICTO.homework,
      steps: [
        { textKey: 'plan.tpl.homework.s1', pictoId: PICTO.book, suggestedMin: 2 },
        { textKey: 'plan.tpl.homework.s2', pictoId: PICTO.think, suggestedMin: 5 },
        { textKey: 'plan.tpl.homework.s3', pictoId: PICTO.homework, suggestedMin: 20 },
        { textKey: 'plan.tpl.homework.s4', pictoId: PICTO.finish, suggestedMin: 5 },
      ],
    },
    {
      titleKey: 'plan.tpl.packBag',
      pictoId: PICTO.backpack,
      steps: [
        { textKey: 'plan.tpl.packBag.s1', pictoId: PICTO.list, suggestedMin: 3 },
        { textKey: 'plan.tpl.packBag.s2', pictoId: PICTO.book, suggestedMin: 5 },
        { textKey: 'plan.tpl.packBag.s3', pictoId: PICTO.food, suggestedMin: 3 },
        { textKey: 'plan.tpl.packBag.s4', pictoId: PICTO.backpack, suggestedMin: 2 },
      ],
    },
    {
      titleKey: 'plan.tpl.cooking',
      pictoId: PICTO.cook,
      steps: [
        { textKey: 'plan.tpl.cooking.s1', pictoId: PICTO.list, suggestedMin: 5 },
        { textKey: 'plan.tpl.cooking.s2', pictoId: PICTO.organize, suggestedMin: 5 },
        { textKey: 'plan.tpl.cooking.s3', pictoId: PICTO.cook, suggestedMin: 20 },
        { textKey: 'plan.tpl.cooking.s4', pictoId: PICTO.clean, suggestedMin: 10 },
      ],
    },
    {
      titleKey: 'plan.tpl.morning',
      pictoId: PICTO.morning,
      steps: [
        { textKey: 'plan.tpl.morning.s1', pictoId: PICTO.brushTeeth, suggestedMin: 3 },
        { textKey: 'plan.tpl.morning.s2', pictoId: PICTO.getDressed, suggestedMin: 5 },
        { textKey: 'plan.tpl.morning.s3', pictoId: PICTO.food, suggestedMin: 15 },
        { textKey: 'plan.tpl.morning.s4', pictoId: PICTO.backpack, suggestedMin: 5 },
      ],
    },
  ];

  // --- Eisenhower priority zones ---
  const PRIORITY_ZONES = [
    { key: 'urgent-important' as const, labelKey: 'plan.priority.urgentImportant', color: '#E74C3C', pictoId: PICTO.urgent },
    { key: 'important' as const, labelKey: 'plan.priority.important', color: '#F39C12', pictoId: PICTO.important },
    { key: 'not-important' as const, labelKey: 'plan.priority.notImportant', color: '#95A5A6', pictoId: PICTO.think },
  ] as const;

  // --- Helpers ---
  function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function createPlanFromTemplate(tpl: Template): Plan {
    return {
      id: uid(),
      title: $t(tpl.titleKey),
      pictoId: tpl.pictoId,
      steps: tpl.steps.map((s) => ({
        id: uid(),
        text: $t(s.textKey),
        pictoId: s.pictoId,
        estimatedMin: 0,
        suggestedMin: s.suggestedMin,
        done: false,
      })),
      createdAt: Date.now(),
    };
  }

  function startTemplate(tpl: Template) {
    currentPlan = createPlanFromTemplate(tpl);
    currentView = 'breakdown';
    speak($t('plan.breakdownIntro'));
  }

  function startCustom() {
    if (!customTaskInput.trim()) return;
    currentPlan = {
      id: uid(),
      title: customTaskInput.trim(),
      pictoId: PICTO.plan,
      steps: [],
      createdAt: Date.now(),
    };
    customTaskInput = '';
    currentView = 'breakdown';
    speak($t('plan.breakdownIntro'));
  }

  function addStep() {
    if (!currentPlan || !newStepText.trim()) return;
    if (currentPlan.steps.length >= 6) return;
    currentPlan.steps = [
      ...currentPlan.steps,
      {
        id: uid(),
        text: newStepText.trim(),
        pictoId: PICTO.step,
        estimatedMin: 0,
        suggestedMin: 5,
        done: false,
      },
    ];
    newStepText = '';
  }

  function removeStep(idx: number) {
    if (!currentPlan) return;
    currentPlan.steps = currentPlan.steps.filter((_, i) => i !== idx);
  }

  function goToTimeEstimate() {
    if (!currentPlan || currentPlan.steps.length < 1) return;
    currentView = 'time-estimate';
    speak($t('plan.timeIntro'));
  }

  function goToPriority() {
    currentView = 'priority';
    speak($t('plan.priorityIntro'));
  }

  function goToChecklist() {
    currentView = 'checklist';
    speak($t('plan.checklistIntro'));
  }

  function toggleStep(idx: number) {
    if (!currentPlan) return;
    currentPlan.steps = currentPlan.steps.map((s, i) =>
      i === idx ? { ...s, done: !s.done } : s
    );
  }

  function completedCount(): number {
    return currentPlan?.steps.filter((s) => s.done).length ?? 0;
  }

  function totalSteps(): number {
    return currentPlan?.steps.length ?? 0;
  }

  function progressPercent(): number {
    const total = totalSteps();
    if (total === 0) return 0;
    return Math.round((completedCount() / total) * 100);
  }

  function goToReview() {
    currentView = 'review';
    reviewRating = 3;
    reviewText = '';
    speak($t('plan.reviewIntro'));
  }

  function finishReview() {
    if (!currentPlan) return;
    currentPlan.review = { rating: reviewRating, reflection: reviewText };
    // Save plan
    const existing = savedPlans.findIndex((p) => p.id === currentPlan!.id);
    if (existing >= 0) {
      savedPlans[existing] = { ...currentPlan };
    } else {
      savedPlans = [...savedPlans, { ...currentPlan }];
    }
    savePlans();
    speak($t('plan.reviewDone'));
    // Reset after a moment
    setTimeout(() => {
      currentPlan = null;
      currentView = 'home';
    }, 2000);
  }

  function goHome() {
    currentPlan = null;
    currentView = 'home';
  }

  function loadSavedPlan(plan: Plan) {
    currentPlan = { ...plan, steps: plan.steps.map((s) => ({ ...s })) };
    currentView = 'checklist';
  }

  function deleteSavedPlan(id: string) {
    savedPlans = savedPlans.filter((p) => p.id !== id);
    savePlans();
  }

  // --- Drag and drop for priority sorting ---
  let dragOverZone = $state<string | null>(null);

  function handleDragStart(e: DragEvent, idx: number) {
    dragIdx = idx;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(idx));
    }
  }

  function handleDragOver(e: DragEvent, zone: string) {
    e.preventDefault();
    dragOverZone = zone;
  }

  function handleDrop(e: DragEvent, zone: typeof PRIORITY_ZONES[number]['key']) {
    e.preventDefault();
    dragOverZone = null;
    if (!currentPlan) return;
    currentPlan.priority = zone;
  }

  // Touch drag support for priority
  let touchDragging = $state(false);

  function selectPriority(zone: typeof PRIORITY_ZONES[number]['key']) {
    if (!currentPlan) return;
    currentPlan.priority = zone;
    speak($t(PRIORITY_ZONES.find((z) => z.key === zone)!.labelKey));
  }
</script>

<WelcomeDialog
  appId="planning-trainer"
  titleKey="app.planning_trainer"
  purposeKey="welcome.planningTrainer.purpose"
  howKey="welcome.planningTrainer.how"
  goalKey="welcome.planningTrainer.goal"
  icon="📋"
/>

<div class="plan-page">
  <header class="app-header">
    <button
      class="back-btn"
      onclick={() => (currentView === 'home' ? goto(base + '/') : goHome())}
      aria-label={$t('app.back')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>
      {#if currentView === 'home'}
        {$t('plan.title')}
      {:else if currentPlan}
        {currentPlan.title}
      {/if}
    </h1>
    {#if currentView !== 'home'}
      <button class="speak-header-btn" onclick={() => speak($t('plan.title'))} aria-label="TTS">
        🔊
      </button>
    {/if}
  </header>

  <!-- ==================== HOME VIEW ==================== -->
  {#if currentView === 'home'}
    <div class="home-view" transition:fade>
      <!-- Custom task input -->
      <section class="section">
        <h2 class="section-title">
          <img src={pictoUrl(PICTO.plan)} alt="" class="section-picto" />
          {$t('plan.createNew')}
        </h2>
        <div class="custom-input-row">
          <input
            type="text"
            bind:value={customTaskInput}
            placeholder={$t('plan.customPlaceholder')}
            class="custom-input"
            onkeydown={(e) => e.key === 'Enter' && startCustom()}
          />
          <button class="btn-primary" onclick={startCustom} disabled={!customTaskInput.trim()}>
            ➕
          </button>
        </div>
      </section>

      <!-- Templates -->
      <section class="section">
        <h2 class="section-title">
          <img src={pictoUrl(PICTO.list)} alt="" class="section-picto" />
          {$t('plan.templates')}
        </h2>
        <div class="template-grid">
          {#each TEMPLATES as tpl}
            <button class="template-card" onclick={() => startTemplate(tpl)}>
              <img src={pictoUrl(tpl.pictoId)} alt="" class="template-icon" />
              <span class="template-name">{$t(tpl.titleKey)}</span>
            </button>
          {/each}
        </div>
      </section>

      <!-- Saved plans -->
      {#if savedPlans.length > 0}
        <section class="section">
          <h2 class="section-title">
            <img src={pictoUrl(PICTO.star)} alt="" class="section-picto" />
            {$t('plan.savedPlans')}
          </h2>
          <div class="saved-list">
            {#each savedPlans as plan}
              <div class="saved-card">
                <button class="saved-btn" onclick={() => loadSavedPlan(plan)}>
                  <img src={pictoUrl(plan.pictoId)} alt="" class="saved-icon" />
                  <div class="saved-info">
                    <span class="saved-title">{plan.title}</span>
                    <span class="saved-meta">
                      {plan.steps.length} {$t('plan.steps')} · {plan.steps.filter((s) => s.done).length}/{plan.steps.length} ✓
                    </span>
                  </div>
                </button>
                <button class="delete-btn" onclick={() => deleteSavedPlan(plan.id)} aria-label={$t('plan.delete')}>
                  🗑️
                </button>
              </div>
            {/each}
          </div>
        </section>
      {/if}
    </div>

  <!-- ==================== BREAKDOWN VIEW ==================== -->
  {:else if currentView === 'breakdown' && currentPlan}
    <div class="breakdown-view" transition:fade>
      <p class="view-instruction" onclick={() => speak($t('plan.breakdownInstruction'))}>
        <img src={pictoUrl(PICTO.organize)} alt="" class="inline-picto" />
        {$t('plan.breakdownInstruction')}
      </p>

      <div class="steps-list">
        {#each currentPlan.steps as step, idx (step.id)}
          <div class="step-row" animate:flip={{ duration: 200 }} transition:slide>
            <img src={pictoUrl(step.pictoId)} alt="" class="step-picto" />
            <span class="step-text">{step.text}</span>
            <button class="remove-step" onclick={() => removeStep(idx)} aria-label={$t('plan.removeStep')}>✕</button>
          </div>
        {/each}
      </div>

      {#if currentPlan.steps.length < 6}
        <div class="add-step-row">
          <input
            type="text"
            bind:value={newStepText}
            placeholder={$t('plan.addStepPlaceholder')}
            class="custom-input"
            onkeydown={(e) => e.key === 'Enter' && addStep()}
          />
          <button class="btn-primary" onclick={addStep} disabled={!newStepText.trim()}>
            ➕
          </button>
        </div>
      {:else}
        <p class="max-steps-msg">{$t('plan.maxSteps')}</p>
      {/if}

      <div class="nav-buttons">
        <button class="btn-secondary" onclick={goHome}>
          {$t('plan.cancel')}
        </button>
        <button
          class="btn-primary btn-lg"
          onclick={goToTimeEstimate}
          disabled={currentPlan.steps.length < 1}
        >
          <img src={pictoUrl(PICTO.clock)} alt="" class="btn-picto" />
          {$t('plan.nextTimeEstimate')}
        </button>
      </div>
    </div>

  <!-- ==================== TIME ESTIMATE VIEW ==================== -->
  {:else if currentView === 'time-estimate' && currentPlan}
    <div class="time-view" transition:fade>
      <p class="view-instruction" onclick={() => speak($t('plan.timeInstruction'))}>
        <img src={pictoUrl(PICTO.clock)} alt="" class="inline-picto" />
        {$t('plan.timeInstruction')}
      </p>

      <div class="time-steps">
        {#each currentPlan.steps as step, idx}
          <div class="time-step-card">
            <div class="time-step-header">
              <img src={pictoUrl(step.pictoId)} alt="" class="step-picto" />
              <span class="step-text">{step.text}</span>
            </div>

            <div class="time-controls">
              <label class="time-label">{$t('plan.yourGuess')}</label>
              <div class="time-input-row">
                <button
                  class="time-btn"
                  onclick={() => {
                    if (step.estimatedMin > 0) {
                      currentPlan!.steps = currentPlan!.steps.map((s, i) =>
                        i === idx ? { ...s, estimatedMin: s.estimatedMin - 1 } : s
                      );
                    }
                  }}
                >−</button>
                <span class="time-value">{step.estimatedMin} min</span>
                <button
                  class="time-btn"
                  onclick={() => {
                    currentPlan!.steps = currentPlan!.steps.map((s, i) =>
                      i === idx ? { ...s, estimatedMin: s.estimatedMin + 1 } : s
                    );
                  }}
                >+</button>
              </div>
            </div>

            <!-- Visual bar comparison -->
            <div class="bar-comparison">
              <div class="bar-row">
                <span class="bar-label">{$t('plan.yourGuess')}</span>
                <div class="bar-track">
                  <div
                    class="bar-fill bar-guess"
                    style="width: {Math.min((step.estimatedMin / Math.max(step.suggestedMin * 2, 1)) * 100, 100)}%"
                  ></div>
                </div>
                <span class="bar-val">{step.estimatedMin}m</span>
              </div>
              <div class="bar-row">
                <span class="bar-label">{$t('plan.suggested')}</span>
                <div class="bar-track">
                  <div
                    class="bar-fill bar-suggested"
                    style="width: {Math.min((step.suggestedMin / Math.max(step.suggestedMin * 2, 1)) * 100, 100)}%"
                  ></div>
                </div>
                <span class="bar-val">{step.suggestedMin}m</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="total-time">
        <img src={pictoUrl(PICTO.time)} alt="" class="inline-picto" />
        {$t('plan.totalTime')}: {currentPlan.steps.reduce((a, s) => a + s.estimatedMin, 0)} min
        ({$t('plan.suggested')}: {currentPlan.steps.reduce((a, s) => a + s.suggestedMin, 0)} min)
      </div>

      <div class="nav-buttons">
        <button class="btn-secondary" onclick={() => (currentView = 'breakdown')}>
          ⬅️ {$t('plan.back')}
        </button>
        <button class="btn-primary btn-lg" onclick={goToPriority}>
          <img src={pictoUrl(PICTO.important)} alt="" class="btn-picto" />
          {$t('plan.nextPriority')}
        </button>
      </div>
    </div>

  <!-- ==================== PRIORITY VIEW ==================== -->
  {:else if currentView === 'priority' && currentPlan}
    <div class="priority-view" transition:fade>
      <p class="view-instruction" onclick={() => speak($t('plan.priorityInstruction'))}>
        <img src={pictoUrl(PICTO.sort)} alt="" class="inline-picto" />
        {$t('plan.priorityInstruction')}
      </p>

      <div class="priority-zones">
        {#each PRIORITY_ZONES as zone}
          <button
            class="priority-zone"
            class:selected={currentPlan.priority === zone.key}
            style="--zone-color: {zone.color}"
            onclick={() => selectPriority(zone.key)}
            ondragover={(e) => handleDragOver(e, zone.key)}
            ondrop={(e) => handleDrop(e, zone.key)}
            class:drag-over={dragOverZone === zone.key}
          >
            <img src={pictoUrl(zone.pictoId)} alt="" class="zone-picto" />
            <span class="zone-label">{$t(zone.labelKey)}</span>
            {#if currentPlan.priority === zone.key}
              <span class="zone-check">✓</span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="nav-buttons">
        <button class="btn-secondary" onclick={() => (currentView = 'time-estimate')}>
          ⬅️ {$t('plan.back')}
        </button>
        <button class="btn-primary btn-lg" onclick={goToChecklist}>
          <img src={pictoUrl(PICTO.list)} alt="" class="btn-picto" />
          {$t('plan.nextChecklist')}
        </button>
      </div>
    </div>

  <!-- ==================== CHECKLIST VIEW ==================== -->
  {:else if currentView === 'checklist' && currentPlan}
    <div class="checklist-view" transition:fade>
      <!-- Progress bar -->
      <div class="progress-section">
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            style="width: {progressPercent()}%"
          ></div>
        </div>
        <span class="progress-label">{completedCount()}/{totalSteps()} ({progressPercent()}%)</span>
      </div>

      <div class="checklist-items">
        {#each currentPlan.steps as step, idx (step.id)}
          <button
            class="checklist-item"
            class:done={step.done}
            onclick={() => toggleStep(idx)}
            animate:flip={{ duration: 200 }}
          >
            <div class="check-circle" class:checked={step.done}>
              {#if step.done}✓{/if}
            </div>
            <img src={pictoUrl(step.pictoId)} alt="" class="step-picto" />
            <span class="check-text" class:strikethrough={step.done}>{step.text}</span>
            {#if step.estimatedMin > 0}
              <span class="check-time">{step.estimatedMin}m</span>
            {/if}
          </button>
        {/each}
      </div>

      {#if progressPercent() === 100}
        <div class="all-done" transition:fly={{ y: 20 }}>
          <img src={pictoUrl(PICTO.congratulations)} alt="" class="done-picto" />
          <p class="done-text">{$t('plan.allDone')}</p>
        </div>
      {/if}

      <div class="nav-buttons">
        <button class="btn-secondary" onclick={() => (currentView = 'priority')}>
          ⬅️ {$t('plan.back')}
        </button>
        <button
          class="btn-primary btn-lg"
          onclick={goToReview}
          disabled={progressPercent() < 100}
        >
          <img src={pictoUrl(PICTO.star)} alt="" class="btn-picto" />
          {$t('plan.nextReview')}
        </button>
      </div>
    </div>

  <!-- ==================== REVIEW VIEW ==================== -->
  {:else if currentView === 'review' && currentPlan}
    <div class="review-view" transition:fade>
      <p class="view-instruction" onclick={() => speak($t('plan.reviewInstruction'))}>
        <img src={pictoUrl(PICTO.think)} alt="" class="inline-picto" />
        {$t('plan.reviewInstruction')}
      </p>

      <!-- Star rating -->
      <div class="rating-section">
        <p class="rating-label">{$t('plan.howDidItGo')}</p>
        <div class="star-row">
          {#each [1, 2, 3, 4, 5] as s}
            <button
              class="star-btn"
              class:active={s <= reviewRating}
              onclick={() => { reviewRating = s; speak(String(s)); }}
              aria-label="{s} {$t('plan.stars')}"
            >
              ⭐
            </button>
          {/each}
        </div>
      </div>

      <!-- Reflection -->
      <div class="reflection-section">
        <p class="reflection-label">{$t('plan.whatCanImprove')}</p>
        <textarea
          bind:value={reviewText}
          class="reflection-input"
          rows="3"
          placeholder={$t('plan.reflectionPlaceholder')}
        ></textarea>
      </div>

      <div class="nav-buttons">
        <button class="btn-secondary" onclick={() => (currentView = 'checklist')}>
          ⬅️ {$t('plan.back')}
        </button>
        <button class="btn-primary btn-lg" onclick={finishReview}>
          <img src={pictoUrl(PICTO.trophy)} alt="" class="btn-picto" />
          {$t('plan.finish')}
        </button>
      </div>
    </div>
  {/if}

  <footer class="credit">{$t('plan.credit')}</footer>
</div>

<style>
  /* ===== Layout ===== */
  .plan-page {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    max-width: 600px;
    margin: 0 auto;
  }

  .app-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 10;
  }

  .back-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
  }

  .app-header h1 {
    font-size: 1.2em;
    font-weight: 700;
    flex: 1;
  }

  .speak-header-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #E67E22;
    background: rgba(230, 126, 34, 0.1);
    font-size: 1.1em;
  }

  /* ===== Shared ===== */
  .section { padding: 16px 20px; }
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1em;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .section-picto, .inline-picto, .btn-picto {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .btn-picto { width: 24px; height: 24px; }

  .view-instruction {
    padding: 16px 20px;
    font-size: 1.05em;
    font-weight: 600;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .nav-buttons {
    display: flex;
    gap: 12px;
    padding: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #3498DB;
    color: white;
    border: none;
    border-radius: var(--radius);
    font-weight: 700;
    font-size: 1em;
    cursor: pointer;
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-primary.btn-lg {
    padding: 14px 28px;
    font-size: 1.1em;
  }

  .btn-secondary {
    padding: 12px 24px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 1em;
    cursor: pointer;
  }

  .credit {
    text-align: center;
    padding: 12px;
    font-size: 0.7em;
    color: var(--text-muted);
  }

  /* ===== Home ===== */
  .custom-input-row {
    display: flex;
    gap: 8px;
  }

  .custom-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    font-size: 1em;
    background: var(--bg-card);
    color: var(--text);
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .template-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s, border-color 0.15s;
  }

  .template-card:hover {
    border-color: #3498DB;
    transform: translateY(-2px);
  }

  .template-icon {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  .template-name {
    font-size: 0.9em;
    font-weight: 700;
    text-align: center;
  }

  /* Saved plans */
  .saved-list { display: flex; flex-direction: column; gap: 8px; }

  .saved-card {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
  }

  .saved-btn {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    cursor: pointer;
    background: none;
    border: none;
    text-align: left;
  }

  .saved-icon { width: 40px; height: 40px; object-fit: contain; }
  .saved-info { display: flex; flex-direction: column; }
  .saved-title { font-weight: 700; font-size: 0.95em; }
  .saved-meta { font-size: 0.8em; color: var(--text-muted); }

  .delete-btn {
    width: 44px;
    height: 44px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.2em;
  }

  /* ===== Breakdown ===== */
  .steps-list { padding: 0 20px; display: flex; flex-direction: column; gap: 8px; }

  .step-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
  }

  .step-picto { width: 40px; height: 40px; object-fit: contain; }
  .step-text { flex: 1; font-weight: 600; }

  .remove-step {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: #E74C3C;
    font-size: 1.2em;
    cursor: pointer;
  }

  .add-step-row {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
  }

  .max-steps-msg {
    text-align: center;
    padding: 8px;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 0.9em;
  }

  /* ===== Time estimate ===== */
  .time-steps { padding: 0 20px; display: flex; flex-direction: column; gap: 16px; }

  .time-step-card {
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    padding: 16px;
  }

  .time-step-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .time-controls { margin-bottom: 12px; }
  .time-label { font-size: 0.85em; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; display: block; }

  .time-input-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .time-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--bg-card);
    font-size: 1.4em;
    font-weight: 700;
    cursor: pointer;
  }

  .time-btn:hover { border-color: #3498DB; }

  .time-value {
    font-size: 1.3em;
    font-weight: 700;
    min-width: 60px;
    text-align: center;
  }

  /* Bar comparison */
  .bar-comparison { display: flex; flex-direction: column; gap: 6px; }
  .bar-row { display: flex; align-items: center; gap: 8px; }
  .bar-label { font-size: 0.75em; color: var(--text-muted); min-width: 55px; }
  .bar-track { flex: 1; height: 16px; background: var(--border); border-radius: 8px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 8px; transition: width 0.3s ease; }
  .bar-guess { background: #3498DB; }
  .bar-suggested { background: #27AE60; }
  .bar-val { font-size: 0.8em; font-weight: 700; min-width: 30px; }

  .total-time {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    font-weight: 700;
    font-size: 1.05em;
    text-align: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* ===== Priority ===== */
  .priority-zones {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .priority-zone {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border: 3px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    cursor: pointer;
    transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .priority-zone:hover { transform: translateY(-2px); }
  .priority-zone.selected { border-color: var(--zone-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--zone-color) 20%, transparent); }
  .priority-zone.drag-over { border-color: var(--zone-color); background: color-mix(in srgb, var(--zone-color) 10%, var(--bg-card)); }

  .zone-picto { width: 48px; height: 48px; object-fit: contain; }
  .zone-label { flex: 1; font-weight: 700; font-size: 1.1em; }
  .zone-check { font-size: 1.4em; color: var(--zone-color); }

  /* ===== Checklist ===== */
  .progress-section { padding: 16px 20px; }

  .progress-bar-track {
    height: 20px;
    background: var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #27AE60, #2ECC71);
    border-radius: 10px;
    transition: width 0.4s ease;
  }

  .progress-label {
    display: block;
    text-align: center;
    font-weight: 700;
    font-size: 0.95em;
    color: var(--text-muted);
  }

  .checklist-items { padding: 0 20px; display: flex; flex-direction: column; gap: 8px; }

  .checklist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    cursor: pointer;
    transition: opacity 0.2s, border-color 0.2s;
    width: 100%;
    text-align: left;
  }

  .checklist-item.done { opacity: 0.7; border-color: #27AE60; }

  .check-circle {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-weight: 700;
    flex-shrink: 0;
  }

  .check-circle.checked { background: #27AE60; border-color: #27AE60; color: white; }

  .check-text { flex: 1; font-weight: 600; }
  .check-text.strikethrough { text-decoration: line-through; color: var(--text-muted); }
  .check-time { font-size: 0.85em; color: var(--text-muted); font-weight: 600; }

  .all-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
  }

  .done-picto { width: 80px; height: 80px; object-fit: contain; }
  .done-text { font-size: 1.3em; font-weight: 700; color: #27AE60; }

  /* ===== Review ===== */
  .rating-section, .reflection-section { padding: 16px 20px; }
  .rating-label, .reflection-label { font-weight: 700; margin-bottom: 12px; font-size: 1.05em; }

  .star-row { display: flex; gap: 8px; justify-content: center; }

  .star-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--bg-card);
    font-size: 1.5em;
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 0.15s, transform 0.15s;
  }

  .star-btn.active { opacity: 1; transform: scale(1.1); }

  .reflection-input {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    font-size: 1em;
    background: var(--bg-card);
    color: var(--text);
    resize: vertical;
    font-family: inherit;
  }
</style>
