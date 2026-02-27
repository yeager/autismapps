<script lang="ts">
  import { t, locale } from '$lib/i18n';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { speak, stop } from '$lib/tts';
  import { searchPictograms, type PictogramSearchResult } from '$lib/arasaac';
  import { saveSchedule, getSchedules, deleteSchedule, type Schedule, type ScheduleItem } from '$lib/storage';
  import { arasaacBW } from '$lib/a11y';
  import { get } from 'svelte/store';

  type Section = 'morning' | 'afternoon' | 'evening';

  let scheduleName = $state('');
  let items = $state<ScheduleItem[]>([]);
  let searchQuery = $state('');
  let searchResults = $state<PictogramSearchResult[]>([]);
  let searching = $state(false);
  let addingSection = $state<Section | null>(null);
  let savedSchedules = $state<Schedule[]>([]);
  let showSchedules = $state(false);
  let nowIndex = $state<number>(-1);

  // Drag state
  let dragItem = $state<ScheduleItem | null>(null);
  let dragOverItem = $state<ScheduleItem | null>(null);

  // Animation state for completed items
  let justCompleted = $state<Set<number>>(new Set());

  // Timer state
  let timerMinutes = $state(5);
  let timerSeconds = $state(0);
  let timerRunning = $state(false);
  let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);

  const SECTIONS: { key: Section; emoji: string }[] = [
    { key: 'morning', emoji: '🌅' },
    { key: 'afternoon', emoji: '☀️' },
    { key: 'evening', emoji: '🌙' }
  ];

  function getSectionItems(section: Section): ScheduleItem[] {
    return items.filter(it => it.section === section);
  }

  async function doSearch() {
    if (!searchQuery.trim()) return;
    searching = true;
    const lang = get(locale);
    searchResults = await searchPictograms(searchQuery, lang);
    searching = false;
  }

  function addItem(picto: PictogramSearchResult) {
    if (!addingSection) return;
    const bw = get(arasaacBW);
    const newItem: ScheduleItem = {
      index: items.length,
      pictogramId: picto.id,
      pictogramUrl: bw ? picto.urlBW : picto.url,
      label: picto.keyword,
      completed: false,
      section: addingSection
    };
    items = [...items, newItem];
    speak(picto.keyword);
    addingSection = null;
    searchQuery = '';
    searchResults = [];
  }

  function addCustomItem(section: Section, label: string) {
    if (!label.trim()) return;
    const newItem: ScheduleItem = {
      index: items.length,
      label: label.trim(),
      completed: false,
      section
    };
    items = [...items, newItem];
    speak(label);
  }

  function toggleDone(item: ScheduleItem) {
    item.completed = !item.completed;
    items = [...items];
    if (item.completed) {
      const idx = items.indexOf(item);
      justCompleted = new Set([...justCompleted, idx]);
      setTimeout(() => {
        justCompleted = new Set([...justCompleted].filter(i => i !== idx));
      }, 600);
      speak($t('schedule.done'));
    }
  }

  function removeItem(item: ScheduleItem) {
    items = items.filter(i => i !== item);
  }

  function speakItem(item: ScheduleItem) {
    speak(item.label);
  }

  function setNow(idx: number) {
    nowIndex = idx;
    const item = items[idx];
    if (item) speak($t('schedule.now') + ': ' + item.label);
  }

  function autoSetNow() {
    const hour = new Date().getHours();
    let section: Section = 'morning';
    if (hour >= 12 && hour < 17) section = 'afternoon';
    else if (hour >= 17) section = 'evening';

    const sectionItems = getSectionItems(section);
    const firstUndone = sectionItems.find(i => !i.completed);
    if (firstUndone) {
      nowIndex = items.indexOf(firstUndone);
    }
  }

  // Drag and drop
  function handleDragStart(item: ScheduleItem) {
    dragItem = item;
  }

  function handleDragOver(e: DragEvent, item: ScheduleItem) {
    e.preventDefault();
    dragOverItem = item;
  }

  function handleDrop(e: DragEvent, targetItem: ScheduleItem) {
    e.preventDefault();
    if (!dragItem || dragItem === targetItem) {
      dragItem = null;
      dragOverItem = null;
      return;
    }

    // Only allow reorder within the same section
    if (dragItem.section !== targetItem.section) {
      dragItem = null;
      dragOverItem = null;
      return;
    }

    const sectionKey = dragItem.section;
    const sectionItems = items.filter(i => i.section === sectionKey);
    const otherItems = items.filter(i => i.section !== sectionKey);

    const fromIdx = sectionItems.indexOf(dragItem);
    const toIdx = sectionItems.indexOf(targetItem);

    if (fromIdx !== -1 && toIdx !== -1) {
      sectionItems.splice(fromIdx, 1);
      sectionItems.splice(toIdx, 0, dragItem);
    }

    // Rebuild items preserving section order
    const rebuilt: ScheduleItem[] = [];
    for (const sec of SECTIONS) {
      if (sec.key === sectionKey) {
        rebuilt.push(...sectionItems);
      } else {
        rebuilt.push(...items.filter(i => i.section === sec.key));
      }
    }
    items = rebuilt;
    dragItem = null;
    dragOverItem = null;
  }

  function handleDragEnd() {
    dragItem = null;
    dragOverItem = null;
  }

  // Timer
  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
      } else if (timerMinutes > 0) {
        timerMinutes--;
        timerSeconds = 59;
      } else {
        stopTimer();
        speak($t('schedule.done'));
      }
    }, 1000);
  }

  function stopTimer() {
    timerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimer() {
    stopTimer();
    timerMinutes = 5;
    timerSeconds = 0;
  }

  // Save/load
  async function save() {
    const schedule: Schedule = {
      name: scheduleName || $t('schedule.today'),
      date: new Date().toISOString().split('T')[0],
      items: [...items],
      createdAt: new Date()
    };
    await saveSchedule(schedule);
    speak($t('board.save'));
    await loadSchedules();
  }

  async function loadSchedules() {
    savedSchedules = await getSchedules();
  }

  function loadSchedule(schedule: Schedule) {
    scheduleName = schedule.name;
    items = [...schedule.items];
    showSchedules = false;
    autoSetNow();
  }

  async function removeSchedule(id: number) {
    await deleteSchedule(id);
    await loadSchedules();
  }

  function printSchedule() {
    window.print();
  }

  // Custom text input for adding without search
  let customLabel = $state('');

  $effect(() => { loadSchedules(); });
</script>

<WelcomeDialog appId="picture-schedule" titleKey="app.picture_schedule" purposeKey="welcome.pictureSchedule.purpose" howKey="welcome.pictureSchedule.how" goalKey="welcome.pictureSchedule.goal" icon="🖼️" />

<div class="schedule-app">
  <!-- Toolbar -->
  <div class="schedule-toolbar no-print">
    <h2>{$t('schedule.title')}</h2>
    <div class="toolbar-row">
      <input
        type="text"
        bind:value={scheduleName}
        placeholder={$t('schedule.today')}
        class="name-input"
      />
      <button class="btn primary" onclick={save}>💾 {$t('board.save')}</button>
      <button class="btn" onclick={printSchedule}>🖨️ {$t('schedule.print')}</button>
      <button class="btn" onclick={() => { showSchedules = !showSchedules; loadSchedules(); }}>
        📂 {$t('schedule.my_schedules')}
      </button>
    </div>

    <!-- Saved schedules -->
    {#if showSchedules}
      <div class="panel">
        <h3>{$t('schedule.my_schedules')}</h3>
        {#each savedSchedules as sched}
          <div class="saved-item">
            <button class="saved-btn" onclick={() => loadSchedule(sched)}>
              {sched.name} — {sched.date}
            </button>
            <button class="delete-btn" onclick={() => sched.id && removeSchedule(sched.id)}>✕</button>
          </div>
        {:else}
          <p class="muted">No schedules yet</p>
        {/each}
      </div>
    {/if}

    <!-- Pictogram search -->
    {#if addingSection}
      <div class="search-area">
        <p class="search-label">{$t('schedule.add_activity')} — {$t(`schedule.${addingSection}`)}</p>
        <div class="search-row">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder={$t('board.search_pictograms')}
            onkeydown={(e) => { if (e.key === 'Enter') doSearch(); }}
          />
          <button class="btn primary" onclick={doSearch} disabled={searching}>
            {searching ? '...' : '🔍'}
          </button>
          <button class="btn" onclick={() => { addingSection = null; searchResults = []; searchQuery = ''; }}>✕</button>
        </div>
        {#if searchResults.length > 0}
          <div class="picto-results">
            {#each searchResults as picto}
              <button class="picto-item" onclick={() => addItem(picto)} title={picto.keyword}>
                <img src={picto.url} alt={picto.keyword} width="60" height="60" loading="lazy" />
                <span>{picto.keyword}</span>
              </button>
            {/each}
          </div>
        {/if}
        <!-- Quick text add -->
        <div class="search-row">
          <input
            type="text"
            bind:value={customLabel}
            placeholder="Or type activity name..."
            onkeydown={(e) => { if (e.key === 'Enter' && customLabel.trim() && addingSection) { addCustomItem(addingSection, customLabel); customLabel = ''; addingSection = null; } }}
          />
          <button class="btn" onclick={() => { if (customLabel.trim() && addingSection) { addCustomItem(addingSection, customLabel); customLabel = ''; addingSection = null; } }}>
            ➕
          </button>
        </div>
      </div>
    {/if}

    <!-- Timer -->
    <div class="timer-section">
      <span class="timer-label">⏱️</span>
      <span class="timer-display">{String(timerMinutes).padStart(2,'0')}:{String(timerSeconds).padStart(2,'0')}</span>
      {#if !timerRunning}
        <button class="btn timer-btn" onclick={() => { timerMinutes = Math.max(1, timerMinutes - 1); }}>−</button>
        <button class="btn timer-btn" onclick={() => { timerMinutes = Math.min(60, timerMinutes + 1); }}>+</button>
        <button class="btn primary" onclick={startTimer}>▶</button>
      {:else}
        <button class="btn danger" onclick={stopTimer}>⏸</button>
      {/if}
      <button class="btn" onclick={resetTimer}>↻</button>
    </div>
  </div>

  <!-- Schedule sections -->
  <div class="schedule-sections">
    {#each SECTIONS as sec}
      {@const sectionItems = getSectionItems(sec.key)}
      <div class="section" style="--section-color: {sec.key === 'morning' ? '#F59E0B' : sec.key === 'afternoon' ? '#3B82F6' : '#8B5CF6'}">
        <div class="section-header">
          <span class="section-emoji">{sec.emoji}</span>
          <h3>{$t(`schedule.${sec.key}`)}</h3>
          <button class="add-btn no-print" onclick={() => { addingSection = sec.key; searchResults = []; searchQuery = ''; }}>
            + {$t('schedule.add_activity')}
          </button>
        </div>

        <div class="items-list">
          {#each sectionItems as item, i}
            {@const globalIdx = items.indexOf(item)}
            <div
              class="schedule-item"
              class:completed={item.completed}
              class:is-now={globalIdx === nowIndex}
              class:drag-over={dragOverItem === item}
              class:just-completed={justCompleted.has(globalIdx)}
              draggable="true"
              ondragstart={() => handleDragStart(item)}
              ondragover={(e) => handleDragOver(e, item)}
              ondrop={(e) => handleDrop(e, item)}
              ondragend={handleDragEnd}
              role="listitem"
            >
              {#if globalIdx === nowIndex}
                <span class="now-badge">{$t('schedule.now')}</span>
              {/if}
              <span class="drag-handle no-print" aria-hidden="true">⠿</span>
              <button class="check-btn" onclick={() => toggleDone(item)} aria-label={item.completed ? $t('schedule.done') : 'Mark done'}>
                {#if item.completed}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                {:else}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--border)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                {/if}
              </button>
              {#if item.pictogramUrl}
                <img src={item.pictogramUrl} alt={item.label} width="56" height="56" class="item-picto" />
              {/if}
              <span class="item-label" onclick={() => speakItem(item)} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter') speakItem(item); }}>{item.label}</span>
              {#if item.time}
                <span class="item-time">{item.time}</span>
              {/if}
              <div class="item-actions no-print">
                <button class="icon-btn" onclick={() => speakItem(item)} aria-label="Speak">🔊</button>
                <button class="icon-btn" onclick={() => setNow(globalIdx)} aria-label="Set as now">📍</button>
                <button class="icon-btn danger" onclick={() => removeItem(item)} aria-label="Remove">✕</button>
              </div>
            </div>
          {:else}
            <p class="empty-section">{$t('schedule.add_activity')}</p>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .schedule-app {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .schedule-toolbar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .schedule-toolbar h2 {
    font-size: 1.4em;
    font-weight: 700;
  }

  .toolbar-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .name-input {
    flex: 1;
    min-width: 150px;
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text);
    font: inherit;
    font-size: 0.95em;
  }
  .name-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .btn {
    padding: 10px 16px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 44px;
    white-space: nowrap;
  }
  .btn:hover { background: var(--bg-hover); border-color: var(--accent); }
  .btn.primary { background: var(--accent); color: white; border-color: var(--accent); }
  .btn.primary:hover { background: var(--accent-hover); }
  .btn.danger { background: var(--danger); color: white; border-color: var(--danger); }

  /* Panel */
  .panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .panel h3 { font-size: 0.95em; font-weight: 600; }

  .saved-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .saved-btn {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 500;
    min-height: 44px;
    transition: background var(--transition);
  }
  .saved-btn:hover { background: var(--bg-hover); }
  .delete-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    color: var(--danger);
    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .delete-btn:hover { background: var(--bg-hover); }
  .muted { color: var(--text-muted); font-size: 0.9em; text-align: center; padding: 12px; }

  /* Search area */
  .search-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    background: var(--bg-card);
    border: 2px solid var(--accent);
    border-radius: var(--radius-sm);
  }
  .search-label {
    font-weight: 600;
    font-size: 0.9em;
  }
  .search-row {
    display: flex;
    gap: 6px;
  }
  .search-row input {
    flex: 1;
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text);
    font: inherit;
    font-size: 0.95em;
  }
  .search-row input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .picto-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    max-height: 250px;
    overflow-y: auto;
    padding: 4px;
  }

  .picto-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    gap: 4px;
    transition: all var(--transition);
    min-height: 44px;
  }
  .picto-item:hover { border-color: var(--accent); background: var(--bg-hover); }
  .picto-item img { border-radius: 4px; }
  .picto-item span { font-size: 0.7em; text-align: center; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

  /* Timer */
  .timer-section {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .timer-label { font-size: 1.2em; }
  .timer-display {
    font-size: 1.6em;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 80px;
    text-align: center;
  }
  .timer-btn { min-width: 44px; padding: 8px; text-align: center; font-size: 1.2em; }

  /* Schedule sections */
  .schedule-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .section {
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: color-mix(in srgb, var(--section-color) 10%, transparent);
    border-bottom: 2px solid var(--border);
  }
  .section-emoji { font-size: 1.4em; }
  .section-header h3 {
    flex: 1;
    font-size: 1.1em;
    font-weight: 700;
    color: var(--section-color);
  }

  .add-btn {
    padding: 8px 14px;
    border: 2px dashed var(--section-color);
    border-radius: var(--radius-sm);
    color: var(--section-color);
    font-weight: 600;
    font-size: 0.8em;
    transition: all var(--transition);
    min-height: 40px;
  }
  .add-btn:hover {
    background: color-mix(in srgb, var(--section-color) 15%, transparent);
  }

  .items-list {
    display: flex;
    flex-direction: column;
  }

  .drag-handle {
    cursor: grab;
    font-size: 1.2em;
    color: var(--text-muted);
    user-select: none;
    padding: 0 4px;
    letter-spacing: 2px;
    flex-shrink: 0;
  }
  .drag-handle:active { cursor: grabbing; }

  .schedule-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-bottom: 1px solid var(--border);
    transition: all var(--transition);
    position: relative;
  }
  .schedule-item:last-child { border-bottom: none; }
  .schedule-item:hover { background: var(--bg-hover); }

  .schedule-item.completed {
    opacity: 0.5;
  }
  .schedule-item.completed .item-label {
    text-decoration: line-through;
  }

  .schedule-item.is-now {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
    border-left: 4px solid var(--accent);
  }

  .schedule-item.drag-over {
    border-top: 3px solid var(--accent);
  }

  @keyframes checkPop {
    0% { transform: scale(1); }
    40% { transform: scale(1.15); }
    70% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }

  @keyframes checkFade {
    0% { background: color-mix(in srgb, var(--success) 25%, transparent); }
    100% { background: transparent; }
  }

  .schedule-item.just-completed {
    animation: checkFade 600ms ease-out;
  }
  .schedule-item.just-completed .check-btn {
    animation: checkPop 400ms ease-out;
  }

  .now-badge {
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 0.65em;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100px;
    background: var(--accent);
    color: white;
  }

  .check-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    transition: background var(--transition);
  }
  .check-btn:hover { background: var(--bg-hover); }

  .item-picto {
    border-radius: 8px;
    flex-shrink: 0;
  }

  .item-label {
    flex: 1;
    font-weight: 600;
    font-size: 1em;
    cursor: pointer;
  }
  .item-label:hover { color: var(--accent); }

  .item-time {
    font-size: 0.85em;
    color: var(--text-muted);
    font-weight: 500;
  }

  .item-actions {
    display: flex;
    gap: 4px;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    font-size: 0.9em;
    transition: background var(--transition);
  }
  .icon-btn:hover { background: var(--bg-hover); }
  .icon-btn.danger:hover { background: color-mix(in srgb, var(--danger) 15%, transparent); }

  .empty-section {
    padding: 20px;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9em;
  }

  /* Print */
  @media print {
    .no-print { display: none !important; }
    .schedule-app { padding: 0; }
    .schedule-item { break-inside: avoid; }
    .item-actions { display: none !important; }
    .now-badge { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }

  @media (max-width: 600px) {
    .schedule-app { padding: 12px; }
    .toolbar-row { flex-direction: column; }
    .name-input { min-width: unset; }
    .item-actions { flex-wrap: wrap; }
  }
</style>
