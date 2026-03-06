<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t, locale } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { get } from 'svelte/store';

  // ── State ──
  let activeTab = $state<'duration' | 'estimation' | 'sequence' | 'vocabulary' | 'comparison' | 'daytimeline'>('duration');
  let stars = $state(0);

  // ── Tab 1: How Long Is...? ──
  interface DurationActivity {
    key: string;
    labelEn: string;
    labelSv: string;
    minutes: number;
    pictoId: number;
  }

  const DURATION_ACTIVITIES: DurationActivity[] = [
    { key: 'brush_teeth', labelEn: 'Brush teeth', labelSv: 'Borsta tänderna', minutes: 2, pictoId: 2326 },
    { key: 'wash_hands', labelEn: 'Wash hands', labelSv: 'Tvätta händerna', minutes: 1, pictoId: 9006 },
    { key: 'eat_breakfast', labelEn: 'Eat breakfast', labelSv: 'Äta frukost', minutes: 15, pictoId: 4626 },
    { key: 'eat_lunch', labelEn: 'Eat lunch', labelSv: 'Äta lunch', minutes: 30, pictoId: 4611 },
    { key: 'shower', labelEn: 'Take a shower', labelSv: 'Duscha', minutes: 10, pictoId: 26803 },
    { key: 'homework', labelEn: 'Do homework', labelSv: 'Göra läxor', minutes: 20, pictoId: 11228 },
    { key: 'walk', labelEn: 'Take a walk', labelSv: 'Gå en promenad', minutes: 15, pictoId: 29951 },
    { key: 'read_book', labelEn: 'Read a book', labelSv: 'Läsa en bok', minutes: 20, pictoId: 7141 },
    { key: 'get_dressed', labelEn: 'Get dressed', labelSv: 'Klä på sig', minutes: 5, pictoId: 6627 },
    { key: 'brush_hair', labelEn: 'Brush hair', labelSv: 'Borsta håret', minutes: 2, pictoId: 21529 },
  ];

  let durationSelected = $state<DurationActivity | null>(null);
  let durationRunning = $state(false);
  let durationRemaining = $state(0);
  let durationTotal = $state(0);
  let durationInterval: ReturnType<typeof setInterval> | null = null;
  let durationFinished = $state(false);

  const durationProgress = $derived(durationTotal > 0 ? 1 - durationRemaining / durationTotal : 0);
  const durationMins = $derived(Math.floor(durationRemaining / 60));
  const durationSecs = $derived(durationRemaining % 60);

  function pictoUrl(id: number): string {
    return `https://api.arasaac.org/v1/pictograms/${id}`;
  }

  function activityLabel(a: DurationActivity): string {
    return get(locale) === 'sv' ? a.labelSv : a.labelEn;
  }

  function startDuration(activity: DurationActivity) {
    durationSelected = activity;
    durationTotal = activity.minutes * 60;
    durationRemaining = durationTotal;
    durationRunning = true;
    durationFinished = false;
    const label = activityLabel(activity);
    const minText = get(locale) === 'sv'
      ? `${activity.minutes} minuter = lika lång tid som att ${label.toLowerCase()}`
      : `${activity.minutes} minutes = the same time as ${label.toLowerCase()}`;
    speak(minText);
    durationInterval = setInterval(() => {
      durationRemaining--;
      if (durationRemaining <= 0) {
        durationRemaining = 0;
        durationRunning = false;
        durationFinished = true;
        clearInterval(durationInterval!);
        playChime();
        stars++;
        speak(get(locale) === 'sv' ? 'Tiden är slut! Bra jobbat!' : "Time's up! Great job!");
      }
    }, 1000);
  }

  function resetDuration() {
    durationRunning = false;
    durationFinished = false;
    durationSelected = null;
    durationRemaining = 0;
    durationTotal = 0;
    if (durationInterval) clearInterval(durationInterval);
  }

  // ── Tab 2: Time Estimation Game ──
  const ESTIMATION_TARGETS = [5, 10, 15, 20, 30];
  let estimationTarget = $state(10);
  let estimationRunning = $state(false);
  let estimationStartTime = $state(0);
  let estimationResult = $state<{ target: number; actual: number; diff: number } | null>(null);
  let estimationInterval: ReturnType<typeof setInterval> | null = null;
  let estimationElapsed = $state(0);

  function startEstimation() {
    estimationResult = null;
    estimationRunning = true;
    estimationStartTime = Date.now();
    estimationElapsed = 0;
    speak(get(locale) === 'sv'
      ? `Tryck stopp när du tror det har gått ${estimationTarget} sekunder`
      : `Press stop when you think ${estimationTarget} seconds have passed`);
    estimationInterval = setInterval(() => {
      estimationElapsed = Math.floor((Date.now() - estimationStartTime) / 1000);
    }, 100);
  }

  function stopEstimation() {
    if (!estimationRunning) return;
    estimationRunning = false;
    if (estimationInterval) clearInterval(estimationInterval);
    const actual = Math.round((Date.now() - estimationStartTime) / 1000);
    const diff = Math.abs(actual - estimationTarget);
    estimationResult = { target: estimationTarget, actual, diff };

    if (diff <= 2) {
      stars++;
      speak(get(locale) === 'sv' ? `Fantastiskt! Du gissade ${actual} sekunder. Nästan perfekt!` : `Amazing! You guessed ${actual} seconds. Almost perfect!`);
    } else if (diff <= 5) {
      speak(get(locale) === 'sv' ? `Bra försök! Du gissade ${actual} sekunder. Bara ${diff} sekunder fel.` : `Good try! You guessed ${actual} seconds. Only ${diff} seconds off.`);
    } else {
      speak(get(locale) === 'sv' ? `Du gissade ${actual} sekunder. Det var ${diff} sekunder fel. Försök igen!` : `You guessed ${actual} seconds. That was ${diff} seconds off. Try again!`);
    }
  }

  // ── Tab 3: Before/After/Now ──
  interface SequenceItem {
    labelEn: string;
    labelSv: string;
    pictoId: number;
    order: number;
  }

  type SequenceSet = { titleEn: string; titleSv: string; items: SequenceItem[] };

  const SEQUENCE_SETS: SequenceSet[] = [
    {
      titleEn: 'Yesterday, Today, Tomorrow',
      titleSv: 'Igår, Idag, Imorgon',
      items: [
        { labelEn: 'Yesterday', labelSv: 'Igår', pictoId: 38279, order: 1 },
        { labelEn: 'Today', labelSv: 'Idag', pictoId: 7131, order: 2 },
        { labelEn: 'Tomorrow', labelSv: 'Imorgon', pictoId: 38278, order: 3 },
      ]
    },
    {
      titleEn: 'Morning, Afternoon, Evening',
      titleSv: 'Morgon, Eftermiddag, Kväll',
      items: [
        { labelEn: 'Morning', labelSv: 'Morgon', pictoId: 25704, order: 1 },
        { labelEn: 'Afternoon', labelSv: 'Eftermiddag', pictoId: 7268, order: 2 },
        { labelEn: 'Evening', labelSv: 'Kväll', pictoId: 38567, order: 3 },
      ]
    },
    {
      titleEn: 'Before, Now, After',
      titleSv: 'Före, Nu, Efter',
      items: [
        { labelEn: 'Before', labelSv: 'Före', pictoId: 32745, order: 1 },
        { labelEn: 'Now', labelSv: 'Nu', pictoId: 32747, order: 2 },
        { labelEn: 'After', labelSv: 'Efter', pictoId: 32749, order: 3 },
      ]
    },
    {
      titleEn: 'Wake up → Get dressed → Eat breakfast',
      titleSv: 'Vakna → Klä på sig → Äta frukost',
      items: [
        { labelEn: 'Wake up', labelSv: 'Vakna', pictoId: 8989, order: 1 },
        { labelEn: 'Get dressed', labelSv: 'Klä på sig', pictoId: 6627, order: 2 },
        { labelEn: 'Eat breakfast', labelSv: 'Äta frukost', pictoId: 4626, order: 3 },
      ]
    },
  ];

  let seqSetIndex = $state(0);
  let seqShuffled = $state<SequenceItem[]>([]);
  let seqPlaced = $state<(SequenceItem | null)[]>([]);
  let seqDragItem = $state<SequenceItem | null>(null);
  let seqCompleted = $state(false);

  const currentSeqSet = $derived(SEQUENCE_SETS[seqSetIndex]);

  function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initSequence() {
    seqShuffled = shuffleArray(currentSeqSet.items);
    seqPlaced = currentSeqSet.items.map(() => null);
    seqCompleted = false;
    const title = get(locale) === 'sv' ? currentSeqSet.titleSv : currentSeqSet.titleEn;
    speak(get(locale) === 'sv' ? `Sortera i rätt ordning: ${title}` : `Sort in the right order: ${title}`);
  }

  function handleSeqDragStart(item: SequenceItem) {
    seqDragItem = item;
  }

  function handleSeqDrop(slotIndex: number) {
    if (!seqDragItem) return;
    // Remove from shuffled
    seqShuffled = seqShuffled.filter(i => i !== seqDragItem);
    // If slot was occupied, put old one back
    const old = seqPlaced[slotIndex];
    if (old) seqShuffled = [...seqShuffled, old];
    // Place item
    seqPlaced[slotIndex] = seqDragItem;
    seqPlaced = [...seqPlaced]; // trigger reactivity
    seqDragItem = null;

    // Check completion
    if (seqPlaced.every((item, i) => item && item.order === i + 1)) {
      seqCompleted = true;
      stars++;
      playChime();
      speak(get(locale) === 'sv' ? 'Rätt ordning! Bra jobbat!' : 'Correct order! Great job!');
    }
  }

  function handleSeqClick(item: SequenceItem) {
    // For touch: tap to select, tap slot to place
    if (seqDragItem === item) {
      seqDragItem = null;
    } else {
      seqDragItem = item;
      speak(get(locale) === 'sv' ? item.labelSv : item.labelEn);
    }
  }

  function handleSlotClick(slotIndex: number) {
    if (seqDragItem) {
      handleSeqDrop(slotIndex);
    } else if (seqPlaced[slotIndex]) {
      // Return to pool
      const item = seqPlaced[slotIndex]!;
      seqShuffled = [...seqShuffled, item];
      seqPlaced[slotIndex] = null;
      seqPlaced = [...seqPlaced];
    }
  }

  // ── Tab 4: Time Vocabulary ──
  interface VocabCard {
    wordEn: string;
    wordSv: string;
    descEn: string;
    descSv: string;
    pictoId: number;
  }

  const VOCAB_CARDS: VocabCard[] = [
    { wordEn: 'Soon', wordSv: 'Snart', descEn: 'Something will happen in a little while', descSv: 'Något händer om en liten stund', pictoId: 33044 },
    { wordEn: 'Later', wordSv: 'Sedan', descEn: 'Something will happen after this', descSv: 'Något händer efter det här', pictoId: 32749 },
    { wordEn: 'In a moment', wordSv: 'Strax', descEn: 'Very soon, almost now', descSv: 'Mycket snart, nästan nu', pictoId: 33044 },
    { wordEn: 'In a while', wordSv: 'Om en stund', descEn: 'After some time has passed', descSv: 'Efter att en tid har gått', pictoId: 39109 },
    { wordEn: 'Yesterday', wordSv: 'Igår', descEn: 'The day before today', descSv: 'Dagen före idag', pictoId: 38279 },
    { wordEn: 'Tomorrow', wordSv: 'Imorgon', descEn: 'The day after today', descSv: 'Dagen efter idag', pictoId: 38278 },
    { wordEn: 'Before', wordSv: 'Före', descEn: 'Something that happened first', descSv: 'Något som hände först', pictoId: 32745 },
    { wordEn: 'After', wordSv: 'Efter', descEn: 'Something that happens next', descSv: 'Något som händer sedan', pictoId: 32749 },
    { wordEn: 'Now', wordSv: 'Nu', descEn: 'Happening right at this moment', descSv: 'Händer just i detta ögonblick', pictoId: 32747 },
    { wordEn: 'Fast', wordSv: 'Snabbt', descEn: 'When something takes a short time', descSv: 'När något tar kort tid', pictoId: 5306 },
    { wordEn: 'Slow', wordSv: 'Långsamt', descEn: 'When something takes a long time', descSv: 'När något tar lång tid', pictoId: 4676 },
    { wordEn: 'Wait', wordSv: 'Vänta', descEn: 'Stay here until it is time', descSv: 'Stanna här tills det är dags', pictoId: 36914 },
    { wordEn: 'Long time', wordSv: 'Lång tid', descEn: 'Many minutes or hours', descSv: 'Många minuter eller timmar', pictoId: 37678 },
    { wordEn: 'Short time', wordSv: 'Kort tid', descEn: 'Only a few minutes', descSv: 'Bara några minuter', pictoId: 37661 },
  ];

  let vocabIndex = $state(0);
  let vocabFlipped = $state(false);
  const currentVocab = $derived(VOCAB_CARDS[vocabIndex]);

  function nextVocab() {
    vocabFlipped = false;
    vocabIndex = (vocabIndex + 1) % VOCAB_CARDS.length;
    const card = VOCAB_CARDS[vocabIndex];
    speak(get(locale) === 'sv' ? card.wordSv : card.wordEn);
  }

  function prevVocab() {
    vocabFlipped = false;
    vocabIndex = (vocabIndex - 1 + VOCAB_CARDS.length) % VOCAB_CARDS.length;
    const card = VOCAB_CARDS[vocabIndex];
    speak(get(locale) === 'sv' ? card.wordSv : card.wordEn);
  }

  function flipVocab() {
    vocabFlipped = !vocabFlipped;
    if (vocabFlipped) {
      speak(get(locale) === 'sv' ? currentVocab.descSv : currentVocab.descEn);
    }
  }

  // ── Tab 5: Duration Comparison ──
  interface ComparisonPair {
    a: { labelEn: string; labelSv: string; minutes: number; pictoId: number };
    b: { labelEn: string; labelSv: string; minutes: number; pictoId: number };
  }

  const COMPARISON_PAIRS: ComparisonPair[] = [
    {
      a: { labelEn: 'Brush teeth', labelSv: 'Borsta tänderna', minutes: 2, pictoId: 2326 },
      b: { labelEn: 'Eat dinner', labelSv: 'Äta middag', minutes: 30, pictoId: 4611 },
    },
    {
      a: { labelEn: 'Wash hands', labelSv: 'Tvätta händerna', minutes: 1, pictoId: 9006 },
      b: { labelEn: 'Take a shower', labelSv: 'Duscha', minutes: 10, pictoId: 26803 },
    },
    {
      a: { labelEn: 'Get dressed', labelSv: 'Klä på sig', minutes: 5, pictoId: 6627 },
      b: { labelEn: 'Do homework', labelSv: 'Göra läxor', minutes: 20, pictoId: 11228 },
    },
    {
      a: { labelEn: 'Eat a snack', labelSv: 'Äta mellanmål', minutes: 5, pictoId: 4694 },
      b: { labelEn: 'Go for a walk', labelSv: 'Gå en promenad', minutes: 15, pictoId: 29951 },
    },
    {
      a: { labelEn: 'Brush hair', labelSv: 'Borsta håret', minutes: 2, pictoId: 21529 },
      b: { labelEn: 'Read a book', labelSv: 'Läsa en bok', minutes: 20, pictoId: 7141 },
    },
    {
      a: { labelEn: 'Sing a song', labelSv: 'Sjunga en sång', minutes: 3, pictoId: 6960 },
      b: { labelEn: 'Cook food', labelSv: 'Laga mat', minutes: 30, pictoId: 30526 },
    },
  ];

  let compIndex = $state(0);
  let compAnswer = $state<'a' | 'b' | null>(null);
  let compCorrect = $state<boolean | null>(null);
  const currentComp = $derived(COMPARISON_PAIRS[compIndex]);
  const compLonger = $derived<'a' | 'b'>(currentComp.a.minutes > currentComp.b.minutes ? 'a' : 'b');

  function answerComparison(choice: 'a' | 'b') {
    compAnswer = choice;
    compCorrect = choice === compLonger;
    if (compCorrect) {
      stars++;
      playChime();
      speak(get(locale) === 'sv' ? 'Rätt! Bra jobbat!' : 'Correct! Great job!');
    } else {
      speak(get(locale) === 'sv' ? 'Inte riktigt. Försök igen!' : 'Not quite. Try again!');
    }
  }

  function nextComparison() {
    compAnswer = null;
    compCorrect = null;
    compIndex = (compIndex + 1) % COMPARISON_PAIRS.length;
    const pair = COMPARISON_PAIRS[compIndex];
    const aLabel = get(locale) === 'sv' ? pair.a.labelSv : pair.a.labelEn;
    const bLabel = get(locale) === 'sv' ? pair.b.labelSv : pair.b.labelEn;
    speak(get(locale) === 'sv' ? `Vad tar längst tid? ${aLabel} eller ${bLabel}?` : `What takes longer? ${aLabel} or ${bLabel}?`);
  }

  // ── Tab 6: Progress Over Day ──
  interface DayEvent {
    hour: number;
    labelEn: string;
    labelSv: string;
    pictoId: number;
    color: string;
  }

  const DAY_EVENTS: DayEvent[] = [
    { hour: 7, labelEn: 'Wake up', labelSv: 'Vakna', pictoId: 8989, color: '#F1C40F' },
    { hour: 8, labelEn: 'Breakfast', labelSv: 'Frukost', pictoId: 4626, color: '#E67E22' },
    { hour: 9, labelEn: 'School', labelSv: 'Skola', pictoId: 32446, color: '#3498DB' },
    { hour: 12, labelEn: 'Lunch', labelSv: 'Lunch', pictoId: 4611, color: '#27AE60' },
    { hour: 13, labelEn: 'Play', labelSv: 'Leka', pictoId: 23392, color: '#E74C3C' },
    { hour: 15, labelEn: 'Snack', labelSv: 'Mellanmål', pictoId: 4694, color: '#E67E22' },
    { hour: 16, labelEn: 'Homework', labelSv: 'Läxor', pictoId: 11228, color: '#9B59B6' },
    { hour: 17, labelEn: 'Dinner', labelSv: 'Middag', pictoId: 4611, color: '#27AE60' },
    { hour: 18, labelEn: 'TV / Play', labelSv: 'TV / Leka', pictoId: 25498, color: '#E74C3C' },
    { hour: 19, labelEn: 'Bath', labelSv: 'Bad', pictoId: 2272, color: '#3498DB' },
    { hour: 20, labelEn: 'Go to bed', labelSv: 'Lägga sig', pictoId: 6027, color: '#8E44AD' },
  ];

  let dayHighlight = $state<number | null>(null);

  function speakDayEvent(event: DayEvent) {
    dayHighlight = event.hour;
    const label = get(locale) === 'sv' ? event.labelSv : event.labelEn;
    const timeStr = `${event.hour}:00`;
    speak(get(locale) === 'sv' ? `Klockan ${timeStr}: ${label}` : `At ${timeStr}: ${label}`);
  }

  // ── Shared ──
  function playChime() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 523;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 659;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc2.start();
        osc2.stop(ctx.currentTime + 1.5);
      }, 300);
    } catch {}
  }

  const TABS = [
    { id: 'duration' as const, emoji: '⏱️', key: 'tp.tab.duration' },
    { id: 'estimation' as const, emoji: '🎯', key: 'tp.tab.estimation' },
    { id: 'sequence' as const, emoji: '📅', key: 'tp.tab.sequence' },
    { id: 'vocabulary' as const, emoji: '📝', key: 'tp.tab.vocabulary' },
    { id: 'comparison' as const, emoji: '⚖️', key: 'tp.tab.comparison' },
    { id: 'daytimeline' as const, emoji: '🌅', key: 'tp.tab.daytimeline' },
  ];

  // Init sequence on first mount
  $effect(() => {
    if (activeTab === 'sequence') {
      initSequence();
    }
  });
</script>

<WelcomeDialog
  appId="time-perception"
  titleKey="app.time_perception"
  purposeKey="welcome.timePerception.purpose"
  howKey="welcome.timePerception.how"
  goalKey="welcome.timePerception.goal"
  icon="⏳"
/>

<div class="tp-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto(base + '/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('tp.title')}</h1>
    <span class="star-count" aria-label="{stars} stars">⭐ {stars}</span>
  </header>

  <!-- Tabs -->
  <nav class="tabs" role="tablist">
    {#each TABS as tab}
      <button
        class="tab-btn"
        class:active={activeTab === tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        onclick={() => { activeTab = tab.id; speak($t(tab.key)); }}
      >
        <span class="tab-emoji">{tab.emoji}</span>
        <span class="tab-label">{$t(tab.key)}</span>
      </button>
    {/each}
  </nav>

  <main class="tp-body">
    <!-- ══════ Tab 1: How Long Is...? ══════ -->
    {#if activeTab === 'duration'}
      <div class="section">
        {#if !durationSelected}
          <h2 class="section-title">{$t('tp.duration.title')}</h2>
          <p class="section-desc">{$t('tp.duration.desc')}</p>
          <div class="activity-grid">
            {#each DURATION_ACTIVITIES as activity}
              <button class="activity-card" onclick={() => startDuration(activity)}>
                <img src={pictoUrl(activity.pictoId)} alt={activityLabel(activity)} width="80" height="80" loading="lazy" />
                <span class="activity-label">{activityLabel(activity)}</span>
                <span class="activity-time">{activity.minutes} {$t('tp.min')}</span>
              </button>
            {/each}
          </div>
        {:else}
          <div class="duration-running">
            <img src={pictoUrl(durationSelected.pictoId)} alt={activityLabel(durationSelected)} width="120" height="120" class="duration-img" />
            <h3>{activityLabel(durationSelected)}</h3>
            <p class="duration-equiv">
              {durationSelected.minutes} {$t('tp.minutes')} = {activityLabel(durationSelected)}
            </p>

            <!-- Progress circle -->
            <div class="timer-circle">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" stroke-width="10" opacity="0.3" />
                <circle cx="100" cy="100" r="90" fill="none"
                  stroke={durationProgress < 0.5 ? '#27AE60' : durationProgress < 0.8 ? '#F1C40F' : '#E74C3C'}
                  stroke-width="10" stroke-linecap="round"
                  stroke-dasharray={2 * Math.PI * 90}
                  stroke-dashoffset={2 * Math.PI * 90 * (1 - durationProgress)}
                  transform="rotate(-90 100 100)" class="progress-ring" />
              </svg>
              <div class="timer-display">
                {#if durationFinished}
                  <span class="done-emoji">🎉</span>
                {:else}
                  <span class="time-text">{String(durationMins).padStart(2, '0')}:{String(durationSecs).padStart(2, '0')}</span>
                {/if}
              </div>
            </div>

            {#if durationFinished}
              <p class="done-text">{$t('tp.duration.done')}</p>
            {/if}

            <button class="action-btn" onclick={resetDuration}>
              {durationFinished ? $t('tp.try_another') : $t('tp.cancel')}
            </button>
          </div>
        {/if}
      </div>

    <!-- ══════ Tab 2: Time Estimation ══════ -->
    {:else if activeTab === 'estimation'}
      <div class="section">
        <h2 class="section-title">{$t('tp.estimation.title')}</h2>
        <p class="section-desc">{$t('tp.estimation.desc')}</p>

        {#if !estimationRunning && !estimationResult}
          <div class="estimation-targets">
            {#each ESTIMATION_TARGETS as target}
              <button class="preset-btn" class:active={estimationTarget === target} onclick={() => estimationTarget = target}>
                {target} {$t('tp.sec')}
              </button>
            {/each}
          </div>
          <button class="action-btn primary" onclick={startEstimation}>{$t('tp.estimation.start')}</button>
        {:else if estimationRunning}
          <div class="estimation-running">
            <div class="hourglass-anim">⏳</div>
            <p class="estimation-hint">{$t('tp.estimation.hint', { seconds: String(estimationTarget) })}</p>
            <button class="action-btn stop-btn" onclick={stopEstimation}>{$t('tp.estimation.stop')}</button>
          </div>
        {:else if estimationResult}
          <div class="estimation-result">
            <div class="result-card">
              <div class="result-row">
                <span class="result-label">{$t('tp.estimation.target')}</span>
                <span class="result-value">{estimationResult.target} {$t('tp.sec')}</span>
              </div>
              <div class="result-row">
                <span class="result-label">{$t('tp.estimation.your_guess')}</span>
                <span class="result-value">{estimationResult.actual} {$t('tp.sec')}</span>
              </div>
              <div class="result-row">
                <span class="result-label">{$t('tp.estimation.difference')}</span>
                <span class="result-value diff" class:good={estimationResult.diff <= 2} class:ok={estimationResult.diff > 2 && estimationResult.diff <= 5} class:far={estimationResult.diff > 5}>
                  {estimationResult.diff} {$t('tp.sec')}
                </span>
              </div>
              {#if estimationResult.diff <= 2}
                <div class="result-feedback">🌟 {$t('tp.estimation.perfect')}</div>
              {:else if estimationResult.diff <= 5}
                <div class="result-feedback">👍 {$t('tp.estimation.good')}</div>
              {:else}
                <div class="result-feedback">💪 {$t('tp.estimation.try_again')}</div>
              {/if}
            </div>
            <button class="action-btn primary" onclick={() => { estimationResult = null; }}>{$t('tp.again')}</button>
          </div>
        {/if}
      </div>

    <!-- ══════ Tab 3: Before/After/Now ══════ -->
    {:else if activeTab === 'sequence'}
      <div class="section">
        <h2 class="section-title">{$t('tp.sequence.title')}</h2>
        <p class="section-desc">{$t('tp.sequence.desc')}</p>

        <div class="seq-picker">
          {#each SEQUENCE_SETS as set, i}
            <button class="preset-btn" class:active={seqSetIndex === i} onclick={() => { seqSetIndex = i; initSequence(); }}>
              {get(locale) === 'sv' ? set.titleSv : set.titleEn}
            </button>
          {/each}
        </div>

        <!-- Drop slots -->
        <div class="seq-slots">
          {#each seqPlaced as item, i}
            <button
              class="seq-slot"
              class:filled={item !== null}
              class:correct={seqCompleted}
              onclick={() => handleSlotClick(i)}
              ondragover={(e) => e.preventDefault()}
              ondrop={() => handleSeqDrop(i)}
            >
              {#if item}
                <img src={pictoUrl(item.pictoId)} alt={get(locale) === 'sv' ? item.labelSv : item.labelEn} width="64" height="64" />
                <span>{get(locale) === 'sv' ? item.labelSv : item.labelEn}</span>
              {:else}
                <span class="slot-number">{i + 1}</span>
              {/if}
            </button>
          {/each}
        </div>

        <!-- Drag items -->
        {#if seqShuffled.length > 0}
          <div class="seq-pool">
            {#each seqShuffled as item}
              <button
                class="seq-item"
                class:selected={seqDragItem === item}
                draggable="true"
                ondragstart={() => handleSeqDragStart(item)}
                onclick={() => handleSeqClick(item)}
              >
                <img src={pictoUrl(item.pictoId)} alt={get(locale) === 'sv' ? item.labelSv : item.labelEn} width="56" height="56" />
                <span>{get(locale) === 'sv' ? item.labelSv : item.labelEn}</span>
              </button>
            {/each}
          </div>
        {/if}

        {#if seqCompleted}
          <div class="seq-done">
            <span class="done-emoji">🎉</span>
            <p>{$t('tp.sequence.correct')}</p>
            <button class="action-btn primary" onclick={() => { seqSetIndex = (seqSetIndex + 1) % SEQUENCE_SETS.length; initSequence(); }}>
              {$t('tp.next')}
            </button>
          </div>
        {/if}
      </div>

    <!-- ══════ Tab 4: Time Vocabulary ══════ -->
    {:else if activeTab === 'vocabulary'}
      <div class="section">
        <h2 class="section-title">{$t('tp.vocab.title')}</h2>
        <p class="section-desc">{$t('tp.vocab.desc')}</p>

        <div class="vocab-nav">
          <button class="nav-btn" onclick={prevVocab}>◀</button>
          <span class="vocab-counter">{vocabIndex + 1} / {VOCAB_CARDS.length}</span>
          <button class="nav-btn" onclick={nextVocab}>▶</button>
        </div>

        <button class="vocab-card" class:flipped={vocabFlipped} onclick={flipVocab}>
          <div class="vocab-front">
            <img src={pictoUrl(currentVocab.pictoId)} alt={get(locale) === 'sv' ? currentVocab.wordSv : currentVocab.wordEn} width="120" height="120" loading="lazy" />
            <h3 class="vocab-word">{get(locale) === 'sv' ? currentVocab.wordSv : currentVocab.wordEn}</h3>
            <p class="vocab-flip-hint">{$t('tp.vocab.tap_to_flip')}</p>
          </div>
          {#if vocabFlipped}
            <div class="vocab-back">
              <p class="vocab-desc">{get(locale) === 'sv' ? currentVocab.descSv : currentVocab.descEn}</p>
            </div>
          {/if}
        </button>

        <button class="action-btn tts-btn" onclick={() => speak(get(locale) === 'sv' ? `${currentVocab.wordSv}. ${currentVocab.descSv}` : `${currentVocab.wordEn}. ${currentVocab.descEn}`)}>
          🔊 {$t('tp.listen')}
        </button>
      </div>

    <!-- ══════ Tab 5: Duration Comparison ══════ -->
    {:else if activeTab === 'comparison'}
      <div class="section">
        <h2 class="section-title">{$t('tp.comparison.title')}</h2>
        <p class="section-desc">{$t('tp.comparison.desc')}</p>

        <p class="comparison-question">{$t('tp.comparison.question')}</p>

        <div class="comparison-cards">
          <button
            class="comp-card"
            class:selected={compAnswer === 'a'}
            class:correct={compAnswer === 'a' && compCorrect}
            class:wrong={compAnswer === 'a' && compCorrect === false}
            onclick={() => answerComparison('a')}
            disabled={compAnswer !== null}
          >
            <img src={pictoUrl(currentComp.a.pictoId)} alt={get(locale) === 'sv' ? currentComp.a.labelSv : currentComp.a.labelEn} width="80" height="80" loading="lazy" />
            <span class="comp-label">{get(locale) === 'sv' ? currentComp.a.labelSv : currentComp.a.labelEn}</span>
            {#if compAnswer !== null}
              <span class="comp-time">{currentComp.a.minutes} {$t('tp.min')}</span>
            {/if}
          </button>

          <span class="vs">{$t('tp.comparison.or')}</span>

          <button
            class="comp-card"
            class:selected={compAnswer === 'b'}
            class:correct={compAnswer === 'b' && compCorrect}
            class:wrong={compAnswer === 'b' && compCorrect === false}
            onclick={() => answerComparison('b')}
            disabled={compAnswer !== null}
          >
            <img src={pictoUrl(currentComp.b.pictoId)} alt={get(locale) === 'sv' ? currentComp.b.labelSv : currentComp.b.labelEn} width="80" height="80" loading="lazy" />
            <span class="comp-label">{get(locale) === 'sv' ? currentComp.b.labelSv : currentComp.b.labelEn}</span>
            {#if compAnswer !== null}
              <span class="comp-time">{currentComp.b.minutes} {$t('tp.min')}</span>
            {/if}
          </button>
        </div>

        {#if compAnswer !== null}
          <button class="action-btn primary" onclick={nextComparison}>{$t('tp.next')}</button>
        {/if}
      </div>

    <!-- ══════ Tab 6: Day Timeline ══════ -->
    {:else if activeTab === 'daytimeline'}
      <div class="section">
        <h2 class="section-title">{$t('tp.day.title')}</h2>
        <p class="section-desc">{$t('tp.day.desc')}</p>

        <div class="day-timeline">
          {#each DAY_EVENTS as event}
            <button
              class="day-event"
              class:highlighted={dayHighlight === event.hour}
              onclick={() => speakDayEvent(event)}
              style="--event-color: {event.color}"
            >
              <span class="day-hour">{event.hour}:00</span>
              <div class="day-dot"></div>
              <div class="day-content">
                <img src={pictoUrl(event.pictoId)} alt={get(locale) === 'sv' ? event.labelSv : event.labelEn} width="48" height="48" loading="lazy" />
                <span class="day-label">{get(locale) === 'sv' ? event.labelSv : event.labelEn}</span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </main>

  <footer class="credit">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> — CC BY-NC-SA 3.0</footer>
</div>

<style>
  /* ── Layout ── */
  .tp-page { display: flex; flex-direction: column; min-height: 100dvh; }

  .app-header {
    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .back-btn:hover { background: var(--bg-hover); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .star-count { font-size: 1em; font-weight: 600; }

  /* ── Tabs ── */
  .tabs {
    display: flex; gap: 4px; padding: 8px 12px; overflow-x: auto;
    border-bottom: 1px solid var(--border); background: var(--bg);
    -webkit-overflow-scrolling: touch;
  }
  .tab-btn {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 8px 12px; border-radius: var(--radius-sm); border: 2px solid transparent;
    background: none; font-size: 0.75em; font-weight: 600; white-space: nowrap;
    min-width: 70px; transition: all 0.15s;
  }
  .tab-btn.active { border-color: #3498DB; background: rgba(52, 152, 219, 0.1); color: #3498DB; }
  .tab-emoji { font-size: 1.5em; }
  .tab-label { font-size: 0.85em; }

  /* ── Main ── */
  .tp-body { flex: 1; padding: 20px; max-width: 800px; margin: 0 auto; width: 100%; }

  .section { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .section-title { font-size: 1.3em; font-weight: 700; text-align: center; }
  .section-desc { color: var(--text-muted); text-align: center; max-width: 480px; }

  /* ── Shared buttons ── */
  .action-btn {
    padding: 12px 32px; border-radius: 100px; font-weight: 600; font-size: 1em;
    border: 2px solid var(--border); background: var(--bg-card); transition: transform 0.15s;
  }
  .action-btn:active { transform: scale(0.95); }
  .action-btn.primary { background: #3498DB; color: white; border-color: #3498DB; }
  .action-btn.stop-btn { background: #E74C3C; color: white; border-color: #E74C3C; font-size: 1.3em; padding: 16px 48px; }

  .preset-btn {
    padding: 10px 20px; border-radius: 100px; border: 2px solid var(--border);
    font-weight: 600; font-size: 0.9em; background: var(--bg-card); transition: all 0.15s;
  }
  .preset-btn.active { background: #3498DB; color: white; border-color: #3498DB; }

  /* ── Tab 1: Duration ── */
  .activity-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px;
    width: 100%; max-width: 600px;
  }
  .activity-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 12px; border-radius: var(--radius); border: 2px solid var(--border);
    background: var(--bg-card); transition: all 0.15s;
  }
  .activity-card:hover { border-color: #3498DB; transform: translateY(-2px); }
  .activity-card img { border-radius: 8px; }
  .activity-label { font-weight: 600; font-size: 0.85em; text-align: center; }
  .activity-time { font-size: 0.75em; color: var(--text-muted); }

  .duration-running { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .duration-img { border-radius: 12px; }
  .duration-equiv { font-size: 1.1em; font-weight: 600; color: #3498DB; text-align: center; }
  .done-text { font-size: 1.2em; font-weight: 700; color: #27AE60; }

  .timer-circle { position: relative; width: 200px; height: 200px; }
  .timer-circle svg { width: 100%; height: 100%; }
  .progress-ring { transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease; }
  .timer-display {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  }
  .time-text { font-size: 2.5em; font-weight: 800; font-variant-numeric: tabular-nums; }
  .done-emoji { font-size: 3em; }

  /* ── Tab 2: Estimation ── */
  .estimation-targets { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .estimation-running { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; }
  .hourglass-anim { font-size: 4em; animation: spin 2s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .estimation-hint { font-size: 1.1em; font-weight: 600; text-align: center; }

  .estimation-result { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .result-card {
    background: var(--bg-card); border: 2px solid var(--border); border-radius: var(--radius);
    padding: 20px; min-width: 280px;
  }
  .result-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .result-row:last-of-type { border-bottom: none; }
  .result-label { font-weight: 500; color: var(--text-muted); }
  .result-value { font-weight: 700; }
  .result-value.good { color: #27AE60; }
  .result-value.ok { color: #F1C40F; }
  .result-value.far { color: #E74C3C; }
  .result-feedback { text-align: center; font-size: 1.2em; font-weight: 700; padding-top: 12px; }

  /* ── Tab 3: Sequence ── */
  .seq-picker { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }

  .seq-slots { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .seq-slot {
    width: 100px; height: 120px; border: 3px dashed var(--border); border-radius: var(--radius);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
    background: var(--bg-card); transition: all 0.15s;
  }
  .seq-slot.filled { border-style: solid; border-color: #3498DB; }
  .seq-slot.correct { border-color: #27AE60; background: rgba(39, 174, 96, 0.1); }
  .seq-slot img { border-radius: 6px; }
  .slot-number { font-size: 1.5em; font-weight: 700; color: var(--text-muted); }

  .seq-pool { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .seq-item {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); cursor: grab; transition: all 0.15s;
  }
  .seq-item.selected { border-color: #E67E22; background: rgba(230, 126, 34, 0.1); }
  .seq-item img { border-radius: 6px; pointer-events: none; }

  .seq-done { display: flex; flex-direction: column; align-items: center; gap: 10px; }

  /* ── Tab 4: Vocabulary ── */
  .vocab-nav { display: flex; align-items: center; gap: 16px; }
  .nav-btn { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border); font-size: 1.2em; background: var(--bg-card); }
  .vocab-counter { font-weight: 600; }

  .vocab-card {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 24px; border: 2px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); min-width: 260px; max-width: 320px; cursor: pointer;
    transition: all 0.2s;
  }
  .vocab-card:hover { border-color: #3498DB; }
  .vocab-front { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .vocab-front img { border-radius: 12px; }
  .vocab-word { font-size: 1.5em; font-weight: 700; }
  .vocab-flip-hint { font-size: 0.8em; color: var(--text-muted); }
  .vocab-back { text-align: center; padding-top: 8px; border-top: 1px solid var(--border); }
  .vocab-desc { font-size: 1.05em; line-height: 1.5; }

  .tts-btn { font-size: 1em; }

  /* ── Tab 5: Comparison ── */
  .comparison-question { font-size: 1.2em; font-weight: 700; text-align: center; }
  .comparison-cards { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
  .comp-card {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 16px 24px; border: 3px solid var(--border); border-radius: var(--radius);
    background: var(--bg-card); min-width: 140px; transition: all 0.15s;
  }
  .comp-card:hover:not(:disabled) { border-color: #3498DB; }
  .comp-card.correct { border-color: #27AE60; background: rgba(39, 174, 96, 0.1); }
  .comp-card.wrong { border-color: #E74C3C; background: rgba(231, 76, 60, 0.1); }
  .comp-card img { border-radius: 8px; }
  .comp-label { font-weight: 600; }
  .comp-time { font-size: 0.85em; color: var(--text-muted); font-weight: 500; }
  .vs { font-size: 1.3em; font-weight: 700; color: var(--text-muted); }

  /* ── Tab 6: Day Timeline ── */
  .day-timeline {
    display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 60px;
    width: 100%; max-width: 500px;
  }
  .day-timeline::before {
    content: ''; position: absolute; left: 52px; top: 0; bottom: 0; width: 3px;
    background: var(--border); border-radius: 2px;
  }
  .day-event {
    display: flex; align-items: center; gap: 12px; padding: 10px 0; position: relative;
    background: none; border: none; text-align: left; cursor: pointer; transition: all 0.15s;
  }
  .day-event:hover, .day-event.highlighted { transform: scale(1.02); }
  .day-event.highlighted .day-content { border-color: var(--event-color); background: color-mix(in srgb, var(--event-color) 10%, transparent); }
  .day-hour {
    position: absolute; left: -60px; font-size: 0.85em; font-weight: 600; color: var(--text-muted);
    width: 45px; text-align: right;
  }
  .day-dot {
    width: 14px; height: 14px; border-radius: 50%; background: var(--event-color);
    border: 3px solid var(--bg); position: relative; z-index: 1; flex-shrink: 0;
  }
  .day-content {
    display: flex; align-items: center; gap: 10px; padding: 8px 14px;
    border: 2px solid var(--border); border-radius: var(--radius); background: var(--bg-card);
    flex: 1; transition: all 0.15s;
  }
  .day-content img { border-radius: 6px; }
  .day-label { font-weight: 600; font-size: 0.95em; }

  /* ── Footer ── */
  .credit { text-align: center; padding: 12px; font-size: 0.75em; color: var(--text-muted); }
  .credit a { color: inherit; text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 500px) {
    .tabs { gap: 2px; padding: 6px 8px; }
    .tab-btn { padding: 6px 8px; min-width: 56px; }
    .tab-label { font-size: 0.7em; }
    .activity-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
    .comparison-cards { flex-direction: column; }
    .seq-slots { gap: 8px; }
    .seq-slot { width: 85px; height: 105px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-ring { transition: none; }
    .hourglass-anim { animation: none; }
  }
</style>
