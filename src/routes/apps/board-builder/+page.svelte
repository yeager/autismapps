<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { speak } from '$lib/tts';
  import { searchPictograms, getPictogramUrl, type PictogramSearchResult } from '$lib/arasaac';
  import { searchPiktaliPictograms } from '$lib/piktali/search';
  import { saveBoard, getBoards, deleteBoard, type Board, type BoardCell } from '$lib/storage';
  import { locale } from '$lib/i18n';
  import { arasaacBW } from '$lib/a11y';
  import { get } from 'svelte/store';

  // State
  let toast = $state('');
  let gridSize = $state(4);
  let boardName = $state('');
  let centerTitle = $state('');
  let categoryColor = $state('#E67E22');
  let cells = $state<BoardCell[]>(createEmptyCells(4));
  let searchQuery = $state('');
  let searchFocused = $state(false);
  let searchResults = $state<PictogramSearchResult[]>([]);
  let searching = $state(false);
  let hasSearched = $state(false);
  let searchTimeout: ReturnType<typeof setTimeout> | undefined;
  let searchRequestId = 0;
  let selectedCellIndex = $state<number | null>(null);
  let savedBoards = $state<Board[]>([]);
  let showMyBoards = $state(false);
  let showTemplates = $state(false);
  let photoLabel = $state('');
  let photoError = $state('');
  let photoInput: HTMLInputElement;
  let cellEditorDialog: HTMLDialogElement;
  let cellAudioError = $state('');
  let recordingCellIndex = $state<number | null>(null);
  let recordingLocale = $state('');
  let audioSaving = $state(false);
  let activeRecorder: MediaRecorder | null = null;
  let activeStream: MediaStream | null = null;
  let audioChunks: BlobPart[] = [];
  let recordingTimeout: ReturnType<typeof setTimeout> | undefined;
  let playingRecording: HTMLAudioElement | null = null;
  let activeRecordingDone: Promise<void> = Promise.resolve();
  let resolveActiveRecording: () => void = () => {};

  const GRID_OPTIONS = [3, 4, 5, 6];
  const COLORS = ['#E67E22', '#3498DB', '#27AE60', '#9B59B6', '#F1C40F', '#E74C3C', '#1ABC9C', '#E91E63'];
  const BOARD_LANGUAGES = [
    { code: 'sv' as const, label: 'Svenska' },
    { code: 'en' as const, label: 'English' },
    { code: 'pt_BR' as const, label: 'Português (BR)' }
  ];

  function cellLabel(cell: BoardCell, language = get(locale)): string {
    return cell.labels?.[language as 'sv' | 'en' | 'pt_BR']?.trim() || cell.label;
  }

  function cellEditLabel(cell: BoardCell, language: 'sv' | 'en' | 'pt_BR'): string {
    return cell.labels?.[language]?.trim() || (language === get(locale) ? cell.label : '');
  }

  function setCellLabel(index: number, language: 'sv' | 'en' | 'pt_BR', value: string) {
    const cell = cells[index];
    cell.labels = { ...cell.labels, [language]: value };
    if (language === get(locale) || (!cell.label && value.trim())) cell.label = value;
  }

  async function playCellAudio(index: number, language = get(locale)) {
    const cell = cells[index];
    const recording = cell.audioByLocale?.[language as 'sv' | 'en' | 'pt_BR'];
    if (!recording) {
      await speak(cellLabel(cell, language));
      return;
    }
    playingRecording?.pause();
    playingRecording = new Audio(recording);
    try {
      await playingRecording.play();
    } catch {
      await speak(cellLabel(cell, language));
    }
  }

  async function startCellRecording(index: number, language: 'sv' | 'en' | 'pt_BR') {
    cellAudioError = '';
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      cellAudioError = $t('board.audio_unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStream = stream;
      const recorder = new MediaRecorder(stream);
      activeRecorder = recorder;
      audioChunks = [];
      recordingCellIndex = index;
      recordingLocale = language;
      activeRecordingDone = new Promise((resolve) => { resolveActiveRecording = resolve; });
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size > 1_000_000) {
          cellAudioError = $t('board.audio_too_large');
          resolveActiveRecording();
        } else if (blob.size > 0) {
          audioSaving = true;
          const reader = new FileReader();
          reader.onload = () => {
            const cell = cells[index];
            cell.audioByLocale = { ...cell.audioByLocale, [language]: String(reader.result) };
            audioSaving = false;
            resolveActiveRecording();
          };
          reader.onerror = () => {
            cellAudioError = $t('board.audio_record_error');
            audioSaving = false;
            resolveActiveRecording();
          };
          reader.readAsDataURL(blob);
        } else resolveActiveRecording();
        stream.getTracks().forEach((track) => track.stop());
        if (activeRecorder === recorder) activeRecorder = null;
        if (activeStream === stream) activeStream = null;
        recordingCellIndex = null;
        recordingLocale = '';
        if (recordingTimeout) clearTimeout(recordingTimeout);
        recordingTimeout = undefined;
      };
      recorder.start();
      recordingTimeout = setTimeout(() => stopCellRecording(), 15_000);
    } catch (error) {
      cellAudioError = error instanceof Error && error.name === 'NotAllowedError'
        ? $t('board.audio_permission_error')
        : $t('board.audio_record_error');
      activeStream?.getTracks().forEach((track) => track.stop());
      activeStream = null;
      activeRecorder = null;
      recordingCellIndex = null;
      recordingLocale = '';
      resolveActiveRecording();
    }
  }

  async function stopCellRecording() {
    if (recordingTimeout) clearTimeout(recordingTimeout);
    recordingTimeout = undefined;
    if (activeRecorder?.state === 'recording') activeRecorder.stop();
    await activeRecordingDone;
  }

  function removeCellRecording(index: number, language: 'sv' | 'en' | 'pt_BR') {
    const cell = cells[index];
    const audioByLocale = { ...cell.audioByLocale };
    delete audioByLocale[language];
    cell.audioByLocale = audioByLocale;
  }

  function createEmptyCells(size: number): BoardCell[] {
    return Array.from({ length: size * size }, (_, i) => ({
      index: i,
      label: '',
      isEmpty: true
    }));
  }

  function changeGridSize(size: number) {
    gridSize = size;
    cells = createEmptyCells(size);
  }

  function handleSearchInput(event: Event) {
    searchQuery = (event.currentTarget as HTMLInputElement).value;
    if (searchTimeout) clearTimeout(searchTimeout);

    const query = searchQuery.trim();
    const requestId = ++searchRequestId;
    searchResults = [];
    hasSearched = false;
    searching = false;
    if (!query) return;

    searchTimeout = setTimeout(() => {
      void doSearch(requestId);
    }, 350);
  }

  function combineSearchResults(...groups: PictogramSearchResult[][]): PictogramSearchResult[] {
    const seen = new Set<number>();
    return groups.flat()
      .filter((picto) => {
        if (seen.has(picto.id)) return false;
        seen.add(picto.id);
        return true;
      })
      .slice(0, 50);
  }

  async function doSearch(requestId = ++searchRequestId) {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = undefined;
    }
    const query = searchQuery.trim();
    if (!query) {
      searchResults = [];
      hasSearched = false;
      return;
    }
    searching = true;
    searchResults = [];
    const lang = get(locale);
    const resultsBySource: PictogramSearchResult[][] = [[], []];
    const publishResults = (source: number, results: PictogramSearchResult[]) => {
      if (requestId !== searchRequestId) return;
      resultsBySource[source] = results;
      searchResults = combineSearchResults(...resultsBySource);
      hasSearched = true;
      if (searchResults.length > 0) searching = false;
    };

    const piktaliSearch = searchPiktaliPictograms(query, lang)
      .then((results) => publishResults(0, results))
      .catch((error) => {
        console.error('Piktali pictogram search failed', error);
        publishResults(0, []);
      });
    const arasaacSearch = searchPictograms(query, lang)
      .then((results) => publishResults(1, results))
      .catch((error) => {
        console.error('ARASAAC pictogram search failed', error);
        publishResults(1, []);
      });

    try {
      await Promise.all([piktaliSearch, arasaacSearch]);
    } finally {
      if (requestId === searchRequestId) searching = false;
    }
  }

  function selectCell(index: number) {
    selectedCellIndex = index;
    if (!cells[index].isEmpty) {
      void playCellAudio(index);
    }
  }

  function openCellEditor(index: number) {
    selectedCellIndex = index;
    cellAudioError = '';
    cellEditorDialog?.showModal();
  }

  function addPictogramToCell(picto: PictogramSearchResult) {
    if (selectedCellIndex === null) {
      // Find first empty cell
      const emptyIdx = cells.findIndex(c => c.isEmpty);
      if (emptyIdx === -1) return;
      selectedCellIndex = emptyIdx;
    }
    const bw = get(arasaacBW);
    cells[selectedCellIndex] = {
      index: selectedCellIndex,
      pictogramId: picto.id,
      pictogramUrl: bw ? picto.urlBW : picto.url,
      label: picto.keyword,
      labels: { [get(locale) as 'sv' | 'en' | 'pt_BR']: picto.keyword },
      isEmpty: false
    };
    speak(picto.keyword);
    // Move to next empty cell
    const nextEmpty = cells.findIndex((c, i) => i > selectedCellIndex! && c.isEmpty);
    selectedCellIndex = nextEmpty >= 0 ? nextEmpty : null;
    searchFocused = false;
    document.getElementById('picto-search')?.blur();
  }

  function clearCell(index: number) {
    cells[index] = { index, label: '', isEmpty: true };
  }

  async function addPersonalPhoto(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    photoError = '';
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      photoError = $t('board.photo_too_large');
      return;
    }

    try {
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read image'));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error('Could not decode image'));
          image.onload = () => {
            const scale = Math.min(1, 640 / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext('2d');
            if (!context) return reject(new Error('Canvas is unavailable'));
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          };
          image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      });

      const index = selectedCellIndex ?? cells.findIndex((cell) => cell.isEmpty);
      if (index < 0) {
        photoError = $t('board.no_empty_cells');
        return;
      }
      const fallbackLabel = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
      cells[index] = {
        index,
        pictogramUrl: imageUrl,
        label: photoLabel.trim() || fallbackLabel || $t('board.personal_photo'),
        labels: { [get(locale) as 'sv' | 'en' | 'pt_BR']: photoLabel.trim() || fallbackLabel || $t('board.personal_photo') },
        isEmpty: false
      };
      selectedCellIndex = cells.findIndex((cell, cellIndex) => cellIndex > index && cell.isEmpty);
      photoLabel = '';
      document.getElementById('picto-search')?.blur();
    } catch {
      photoError = $t('board.photo_read_error');
    }
  }

  async function save() {
    await stopCellRecording();
    const board: Board = {
      name: boardName || $t('board.untitled'),
      category: 'custom',
      gridSize,
      cells: [...cells],
      centerTitle,
      categoryColor,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveBoard(board);
    speak($t('board.saved'));
    toast = $t('board.saved');
    setTimeout(() => toast = '', 2500);
    await loadSavedBoards();
  }

  async function loadSavedBoards() {
    savedBoards = await getBoards();
  }

  function loadBoard(board: Board) {
    boardName = board.name;
    gridSize = board.gridSize;
    cells = board.cells;
    centerTitle = board.centerTitle || '';
    categoryColor = board.categoryColor;
    showMyBoards = false;
    toast = $t('board.loaded');
    setTimeout(() => toast = '', 2500);
  }

  async function removeSavedBoard(id: number) {
    await deleteBoard(id);
    await loadSavedBoards();
  }

  function printBoard() {
    window.print();
  }

  function exportPNG() {
    // Fallback to print since html2canvas is not available
    printBoard();
  }

  // Templates — en: for ARASAAC search, key: for i18n display
  interface TemplateWord { key: string; en: string; }
  const TEMPLATES = [
    { titleKey: 'home', color: '#E67E22', keywords: [
      { key: 'cook', en: 'cook' }, { key: 'wash', en: 'wash' }, { key: 'clean', en: 'clean' }, { key: 'sleep', en: 'sleep' },
      { key: 'eat', en: 'eat' }, { key: 'drink', en: 'drink' }, { key: 'sit', en: 'sit' }, { key: 'play', en: 'play' },
      { key: 'read', en: 'read' }, { key: 'shower', en: 'shower' }, { key: 'dress', en: 'dress' }, { key: 'toilet', en: 'toilet' },
      { key: 'brush_teeth', en: 'brush teeth' }, { key: 'watch_tv', en: 'watch tv' }, { key: 'rest', en: 'rest' }, { key: 'help', en: 'help' },
    ] },
    { titleKey: 'school', color: '#3498DB', keywords: [
      { key: 'read', en: 'read' }, { key: 'write', en: 'write' }, { key: 'draw', en: 'draw' }, { key: 'sing', en: 'sing' },
      { key: 'count', en: 'count' }, { key: 'play', en: 'play' }, { key: 'eat', en: 'eat' }, { key: 'drink', en: 'drink' },
      { key: 'listen', en: 'listen' }, { key: 'speak', en: 'speak' }, { key: 'work', en: 'work' }, { key: 'rest', en: 'rest' },
      { key: 'gym', en: 'gym' }, { key: 'computer', en: 'computer' }, { key: 'friend', en: 'friend' }, { key: 'teacher', en: 'teacher' },
    ] },
    { titleKey: 'food', color: '#27AE60', keywords: [
      { key: 'water', en: 'water' }, { key: 'milk', en: 'milk' }, { key: 'juice', en: 'juice' }, { key: 'bread', en: 'bread' },
      { key: 'apple', en: 'apple' }, { key: 'banana', en: 'banana' }, { key: 'rice', en: 'rice' }, { key: 'pasta', en: 'pasta' },
      { key: 'chicken', en: 'chicken' }, { key: 'fish', en: 'fish' }, { key: 'egg', en: 'egg' }, { key: 'cheese', en: 'cheese' },
      { key: 'yogurt', en: 'yogurt' }, { key: 'cookie', en: 'cookie' }, { key: 'ice_cream', en: 'ice cream' }, { key: 'soup', en: 'soup' },
    ] },
    { titleKey: 'emotions', color: '#9B59B6', keywords: [
      { key: 'happy', en: 'happy' }, { key: 'sad', en: 'sad' }, { key: 'angry', en: 'angry' }, { key: 'scared', en: 'scared' },
      { key: 'tired', en: 'tired' }, { key: 'hungry', en: 'hungry' }, { key: 'thirsty', en: 'thirsty' }, { key: 'pain', en: 'pain' },
      { key: 'love', en: 'love' }, { key: 'surprise', en: 'surprise' }, { key: 'calm', en: 'calm' }, { key: 'excited', en: 'excited' },
      { key: 'worried', en: 'worried' }, { key: 'proud', en: 'proud' }, { key: 'shy', en: 'shy' }, { key: 'bored', en: 'bored' },
    ] },
    { titleKey: 'hygiene', color: '#1ABC9C', keywords: [
      { key: 'shower', en: 'shower' }, { key: 'bath', en: 'bath' }, { key: 'brush_teeth', en: 'brush teeth' }, { key: 'wash_hands', en: 'wash hands' },
      { key: 'soap', en: 'soap' }, { key: 'towel', en: 'towel' }, { key: 'toilet', en: 'toilet' }, { key: 'comb', en: 'comb' },
      { key: 'deodorant', en: 'deodorant' }, { key: 'toothbrush', en: 'toothbrush' }, { key: 'toothpaste', en: 'toothpaste' }, { key: 'shampoo', en: 'shampoo' },
      { key: 'mirror', en: 'mirror' }, { key: 'nail', en: 'nail' }, { key: 'tissue', en: 'tissue' }, { key: 'clean', en: 'clean' },
    ] },
  ];

  async function loadTemplate(template: typeof TEMPLATES[0]) {
    gridSize = 4;
    boardName = $t('board.template.' + template.titleKey);
    centerTitle = $t('board.template.' + template.titleKey);
    categoryColor = template.color;
    cells = createEmptyCells(4);
    
    // Search in English for reliable ARASAAC results, display in current locale
    for (let i = 0; i < Math.min(template.keywords.length, 16); i++) {
      const item = template.keywords[i];
      const results = await searchPictograms(item.en, 'en');
      if (results.length > 0) {
        const bw = get(arasaacBW);
        cells[i] = {
          index: i,
          pictogramId: results[0].id,
          pictogramUrl: bw ? results[0].urlBW : results[0].url,
          label: $t(`bb.${item.key}`),
          labels: { [get(locale) as 'sv' | 'en' | 'pt_BR']: $t(`bb.${item.key}`) },
          isEmpty: false
        };
      }
    }
    showTemplates = false;
  }

  // Load boards on mount
  $effect(() => { loadSavedBoards(); });

  onMount(() => {
    const style = document.documentElement.style;
    const previousHeight = style.getPropertyValue('--board-visible-height');
    const viewport = window.visualViewport;
    const updateHeight = () => {
      style.setProperty('--board-visible-height', `${viewport?.height ?? window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    viewport?.addEventListener('resize', updateHeight);
    viewport?.addEventListener('scroll', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      viewport?.removeEventListener('resize', updateHeight);
      viewport?.removeEventListener('scroll', updateHeight);
      if (previousHeight) style.setProperty('--board-visible-height', previousHeight);
      else style.removeProperty('--board-visible-height');
      if (activeRecorder?.state === 'recording') activeRecorder.stop();
      activeStream?.getTracks().forEach((track) => track.stop());
      playingRecording?.pause();
    };
  });
</script>

<svelte:head>
  <title>{$t('app.board_builder')} — {$t('app.title.brand')}</title>
</svelte:head>

<WelcomeDialog appId="board-builder" titleKey="app.board_builder" purposeKey="welcome.boardBuilder.purpose" howKey="welcome.boardBuilder.how" goalKey="welcome.boardBuilder.goal" icon="🧩" />

<h1 class="sr-only">{$t('app.board_builder')}</h1>

<div class="board-builder" class:search-focused={searchFocused}>
  <div class="builder-sidebar">
    <!-- Toolbar -->
    <div class="toolbar">
      <h2>{$t('board.title')}</h2>
      
      <div class="field board-name-field">
        <label for="board-name">{$t('board.board_name')}</label>
        <input id="board-name" type="text" bind:value={boardName} placeholder={$t("board.my_board")} />
      </div>

      <div class="field center-title-field">
        <label for="center-title">{$t('board.center_title')}</label>
        <input id="center-title" type="text" bind:value={centerTitle} />
      </div>

      <div class="field grid-size-field">
        <span id="grid-size-label">{$t('board.grid_size')}</span>
        <div class="grid-options">
          {#each GRID_OPTIONS as size}
            <button
              class="grid-option"
              class:active={gridSize === size}
              onclick={() => changeGridSize(size)}
            >{size}×{size}</button>
          {/each}
        </div>
      </div>

      <div class="field category-color-field">
        <span id="cat-color-label">{$t('board.category_color')}</span>
        <div class="color-options">
          {#each COLORS as color}
            <button
              class="color-dot"
              class:active={categoryColor === color}
              style="background: {color}"
              onclick={() => categoryColor = color}
              aria-label={color}
            ></button>
          {/each}
        </div>
      </div>

      <!-- Search -->
      <div class="field search-field">
        <label for="picto-search">{$t('board.search_pictograms')}</label>
        <div class="search-input">
          <input
            id="picto-search"
            type="search"
            bind:value={searchQuery}
            placeholder={$t('board.search_pictograms')}
            oninput={handleSearchInput}
            onfocus={() => searchFocused = true}
            onblur={() => searchFocused = false}
            onkeydown={(e) => { if (e.key === 'Enter') doSearch(); }}
          />
          <button class="search-go" onclick={() => doSearch()} disabled={searching}>
            {searching ? '...' : '🔍'}
          </button>
        </div>
      </div>

      <div class="field personal-photo-field">
        <label for="personal-photo-label">{$t('board.photo_label')}</label>
        <div class="photo-add-row">
          <input id="personal-photo-label" bind:value={photoLabel} placeholder={$t('board.photo_label_placeholder')} />
          <button class="btn photo-add" onclick={() => photoInput?.click()}>📷 {$t('board.add_photo')}</button>
        </div>
        <input
          bind:this={photoInput}
          class="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={$t('board.add_photo')}
          onchange={addPersonalPhoto}
        />
        <p class="photo-privacy">{$t('board.photo_privacy')}</p>
        {#if photoError}<p class="photo-error" role="alert">{photoError}</p>{/if}
      </div>

      <!-- Search results -->
      {#if searchResults.length > 0}
        <div class="picto-results">
          {#each searchResults as picto}
            <button
              class="picto-item"
              onpointerdown={(event) => event.preventDefault()}
              onclick={() => addPictogramToCell(picto)}
              title={picto.keyword}
            >
              <img src={picto.url} alt={picto.keyword} width="60" height="60" loading="lazy" />
              <span>{picto.keyword}</span>
            </button>
          {/each}
        </div>
      {:else if searchQuery && hasSearched && !searching}
        <p class="no-results">{$t('board.no_results')}</p>
      {/if}

      <!-- Action buttons -->
      <div class="actions">
        <button class="btn primary" onclick={save}>💾 {$t('board.save')}</button>
        <button class="btn" onclick={printBoard}>🖨️ {$t('board.print')}</button>
        <button class="btn" onclick={exportPNG}>📷 {$t('board.export_png')}</button>
        <button class="btn" onclick={() => { showTemplates = !showTemplates; showMyBoards = false; }}>📋 {$t('board.templates')}</button>
        <button class="btn" onclick={() => { showMyBoards = !showMyBoards; showTemplates = false; loadSavedBoards(); }}>📂 {$t('board.my_boards')}</button>
      </div>

      <!-- Templates -->
      {#if showTemplates}
        <div class="panel">
          <h3>{$t('board.templates')}</h3>
          {#each TEMPLATES as tmpl}
            <button class="template-item" onclick={() => loadTemplate(tmpl)}>
              <span class="template-dot" style="background: {tmpl.color}"></span>
              {$t('board.template.' + tmpl.titleKey.toLowerCase())}
            </button>
          {/each}
        </div>
      {/if}

      <!-- My boards -->
      {#if showMyBoards}
        <div class="panel">
          <h3>{$t('board.my_boards')}</h3>
          {#each savedBoards as board}
            <div class="saved-board-item">
              <button class="saved-board-btn" onclick={() => loadBoard(board)}>
                <span class="template-dot" style="background: {board.categoryColor}"></span>
                {board.name}
              </button>
              <button class="delete-btn" onclick={() => board.id && removeSavedBoard(board.id)}>✕</button>
            </div>
          {:else}
            <p class="no-results">{$t("board.no_saved")}</p>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Board preview -->
  <div class="builder-main">
    <div class="board-grid" style="--grid-size: {gridSize}; --board-color: {categoryColor}">
      {#if centerTitle}
        <div class="board-center" style="grid-column: span {gridSize};">
          <span class="center-label">{centerTitle}</span>
        </div>
      {/if}
      {#each cells as cell, i}
        <button
          class="board-cell"
          class:selected={selectedCellIndex === i}
          class:empty={cell.isEmpty}
          onclick={() => selectCell(i)}
          aria-label={cell.isEmpty ? $t('board.tap_to_add') : cellLabel(cell)}
        >
          {#if !cell.isEmpty && cell.pictogramUrl}
            <img src={cell.pictogramUrl} alt={cellLabel(cell)} loading="lazy" />
          {/if}
          {#if !cell.isEmpty}
            <span class="cell-label">{cellLabel(cell)}</span>
          {:else}
            <span class="cell-placeholder">+</span>
          {/if}
          {#if selectedCellIndex === i && !cell.isEmpty}
            <span class="cell-edit" role="button" tabindex="0" onclick={(event) => { event.stopPropagation(); openCellEditor(i); }} onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); openCellEditor(i); } }} aria-label={$t('board.cell_editor')}>✎</span>
          {/if}
          {#if !cell.isEmpty}
            <span
              class="cell-clear"
              role="button"
              tabindex="0"
              onclick={(e) => { e.stopPropagation(); clearCell(i); }}
              onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); clearCell(i); }}}
              aria-label={$t('board.clear_cell')}
            >✕</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>

<dialog class="cell-editor-dialog" bind:this={cellEditorDialog} aria-labelledby="cell-editor-heading" onclose={() => { if (recordingCellIndex !== null) void stopCellRecording(); }}>
  {#if selectedCellIndex !== null && !cells[selectedCellIndex].isEmpty}
    <div class="cell-editor-header">
      <div><h2 id="cell-editor-heading">{$t('board.cell_editor')}</h2><p>{cellLabel(cells[selectedCellIndex])}</p></div>
      <button class="audio-control" onclick={() => cellEditorDialog.close()} aria-label={$t('board.close_editor')}>✕</button>
    </div>
    <p class="photo-privacy">{$t('board.cell_editor_help')}</p>
    {#each BOARD_LANGUAGES as language (language.code)}
      <div class="language-edit-row">
        <label class="field language-label">
          <span>{language.label}</span>
          <input
            value={cellEditLabel(cells[selectedCellIndex], language.code)}
            oninput={(event) => setCellLabel(selectedCellIndex!, language.code, (event.currentTarget as HTMLInputElement).value)}
          />
        </label>
        <div class="audio-actions" aria-label={`${language.label} — ${$t('board.audio_group')}`}>
          {#if recordingCellIndex === selectedCellIndex && recordingLocale === language.code}
            <button class="audio-control recording" onclick={stopCellRecording}>■ {$t('board.audio_stop')}</button>
          {:else}
            <button class="audio-control" onclick={() => startCellRecording(selectedCellIndex!, language.code)} disabled={recordingCellIndex !== null}>
              ⏺ {$t(cells[selectedCellIndex].audioByLocale?.[language.code] ? 'board.audio_record_again' : 'board.audio_record')}
            </button>
          {/if}
          {#if cells[selectedCellIndex].audioByLocale?.[language.code]}
            <button class="audio-control" onclick={() => playCellAudio(selectedCellIndex!, language.code)}>▶ {$t('board.audio_play')}</button>
            <button class="audio-control audio-delete" onclick={() => removeCellRecording(selectedCellIndex!, language.code)} aria-label={`${$t('board.audio_delete')} — ${language.label}`}>✕</button>
          {/if}
        </div>
      </div>
    {/each}
    <p class="photo-privacy">🎙️ {$t('board.audio_privacy')}</p>
    {#if recordingCellIndex === selectedCellIndex || audioSaving}<p class="photo-privacy recording-status" role="status">{$t(audioSaving ? 'board.audio_saving' : 'board.audio_recording')}</p>{/if}
    {#if cellAudioError}<p class="photo-error" role="alert">{cellAudioError}</p>{/if}
  {/if}
</dialog>

{#if toast}
  <div class="toast" role="status" aria-live="polite">✅ {toast}</div>
{/if}

<style>
  .board-builder {
    display: flex;
    gap: 20px;
    padding: 20px;
    min-height: calc(100dvh - var(--header-h));
  }

  /* Sidebar */
  .builder-sidebar {
    width: 320px;
    flex-shrink: 0;
    overflow-y: auto;
    max-height: calc(100dvh - 100px);
  }

  .toolbar {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .toolbar h2 {
    font-size: 1.4em;
    font-weight: 700;
  }

  .photo-add-row { display: flex; gap: 8px; align-items: stretch; }
  .photo-add-row input { min-width: 0; flex: 1; }
  .photo-add { white-space: nowrap; }
  .photo-privacy, .photo-error { margin: 0; color: var(--text-secondary); font-size: .82rem; }
  .photo-error { color: #a23535; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

  .cell-editor-dialog {
    width: min(560px, calc(100vw - 24px));
    max-height: min(86dvh, 760px);
    overflow: auto;
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: 18px;
    color: var(--text);
    background: var(--bg-card);
    box-shadow: 0 20px 70px #0004;
  }
  .cell-editor-dialog::backdrop { background: #13231dcc; }
  .cell-editor-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
  .cell-editor-header h2 { margin: 0; font-size: 1.25rem; }
  .cell-editor-header p { margin: 4px 0 0; color: var(--text-secondary); }
  .cell-editor-dialog > .photo-privacy { margin: 8px 0 14px; }
  .language-edit-row { display: grid; gap: 6px; padding: 12px 0; border-top: 1px solid var(--border); }
  .language-label { gap: 4px; font-weight: 700; }
  .language-label input { min-width: 0; min-height: 44px; }
  .audio-actions { display: flex; flex-wrap: wrap; gap: 6px; }
  .audio-control { min-height: 42px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; color: var(--text); background: var(--bg); font: inherit; cursor: pointer; }
  .audio-control:disabled { opacity: .55; cursor: wait; }
  .audio-control.recording { color: white; background: #a23535; border-color: #a23535; }
  .audio-control.audio-delete { color: #8a3434; }
  .recording-status { color: #a23535; font-weight: 700; }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field label {
    font-size: 0.85em;
    font-weight: 600;
    color: var(--text-muted);
  }

  .field input {
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text);
    font: inherit;
    font-size: 0.95em;
  }
  .field input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .grid-options, .color-options {
    display: flex;
    gap: 8px;
  }

  .grid-option {
    padding: 8px 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 44px;
  }
  .grid-option.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .color-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid transparent;
    transition: border-color var(--transition);
  }
  .color-dot.active {
    border-color: var(--text);
  }

  /* Search */
  .search-input {
    display: flex;
    gap: 4px;
  }
  .search-input input {
    flex: 1;
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text);
    font: inherit;
  }
  .search-go {
    padding: 10px 14px;
    background: var(--accent);
    color: white;
    border-radius: var(--radius-sm);
    font-size: 1.1em;
    min-width: 44px;
  }

  .picto-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    max-height: 300px;
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
  .picto-item:hover {
    border-color: var(--accent);
    background: var(--bg-hover);
  }
  .picto-item img {
    border-radius: 4px;
  }
  .picto-item span {
    font-size: 0.7em;
    text-align: center;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .no-results {
    color: var(--text-muted);
    font-size: 0.9em;
    text-align: center;
    padding: 12px;
  }

  /* Actions */
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
  .btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
  }
  .btn.primary {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  .btn.primary:hover {
    background: var(--accent-hover);
  }

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
  .panel h3 {
    font-size: 0.95em;
    font-weight: 600;
  }

  .template-item, .saved-board-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 500;
    transition: background var(--transition);
    min-height: 44px;
  }
  .template-item:hover, .saved-board-btn:hover {
    background: var(--bg-hover);
  }

  .template-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .saved-board-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .saved-board-btn { flex: 1; }
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

  /* Board */
  .builder-main {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px;
  }

  .board-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-size), 1fr);
    gap: 8px;
    padding: 16px;
    background: var(--bg-card);
    border: 3px solid var(--board-color);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 600px;
    aspect-ratio: 1;
  }

  .board-center {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: var(--board-color);
    border-radius: var(--radius-sm);
    margin-bottom: 4px;
  }
  .center-label {
    color: white;
    font-weight: 700;
    font-size: 1.1em;
  }

  .board-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 4px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    transition: all var(--transition);
    min-height: 80px;
    overflow: hidden;
  }
  .board-cell:hover {
    border-color: var(--board-color);
  }
  .board-cell.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent);
  }
  .board-cell.empty {
    border-style: dashed;
  }

  .board-cell img {
    width: 80%;
    max-width: 80px;
    height: auto;
    border-radius: 4px;
  }

  .cell-label {
    font-size: 0.75em;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cell-placeholder {
    font-size: 1.5em;
    color: var(--text-muted);
    opacity: 0.4;
  }

  .cell-clear {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--danger);
    color: white;
    font-size: 0.7em;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .cell-edit {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: var(--accent);
    font-size: .85em;
    z-index: 1;
  }
  .board-cell:hover .cell-clear {
    display: flex;
  }

  @media (max-width: 640px) {
    .board-builder {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      height: calc(var(--board-visible-height, 100dvh) - 68px);
      min-height: 0;
      gap: 6px;
      padding: 6px;
      overflow: hidden;
    }

    .builder-sidebar {
      width: 100%;
      min-height: 0;
      max-height: none;
      overflow: hidden;
    }

    .toolbar {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: max-content;
      align-content: start;
      height: 100%;
      min-height: 0;
      gap: 4px;
      overflow: hidden;
    }

    .toolbar h2 {
      grid-column: 1 / -1;
      margin: 0;
      font-size: 1.1em;
      line-height: 1.1;
    }

    .field {
      min-width: 0;
      gap: 2px;
    }

    .field label { font-size: .72em; }
    .field input { min-height: 36px; padding: 5px 8px; font-size: .88em; }

    .grid-size-field .grid-options { gap: 3px; }
    .grid-option { flex: 1; min-width: 0; min-height: 32px; padding: 2px 4px; font-size: .78em; }

    .color-options { justify-content: space-between; gap: 2px; }
    .color-dot { width: clamp(20px, 6vw, 25px); height: clamp(20px, 6vw, 25px); }

    .search-field { grid-column: 1 / -1; }
    .search-input input { min-width: 0; min-height: 38px; padding: 5px 8px; }
    .search-go { min-width: 40px; padding: 5px 9px; }

    .picto-results {
      grid-column: 1 / -1;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 3px;
      max-height: clamp(120px, 24vh, 176px);
      overflow: hidden;
      padding: 2px;
    }

    .picto-item:nth-child(n + 13) { display: none; }

    .picto-item { min-width: 0; gap: 2px; padding: 2px; }
    .picto-item img { width: 34px; height: 34px; }
    .picto-item span { font-size: .58em; }

    .no-results { grid-column: 1 / -1; margin: 0; padding: 6px; font-size: .78em; }

    .actions {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 4px;
    }

    .btn {
      min-width: 0;
      min-height: 34px;
      padding: 4px 3px;
      font-size: .68em;
      line-height: 1.1;
      white-space: normal;
    }

    .panel { grid-column: 1 / -1; max-height: 72px; min-height: 0; overflow-y: auto; padding: 5px; gap: 3px; }

    .builder-main {
      min-width: 0;
      min-height: 0;
      align-items: center;
      padding: 0;
    }

    .board-grid {
      width: auto;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      padding: clamp(3px, 1vw, 6px);
      gap: clamp(2px, .8vw, 4px);
    }

    .board-cell { min-height: 0; gap: 2px; padding: 2px; }
    .board-cell img { width: min(72%, 56px); }
    .cell-label { font-size: .62em; }

    .board-builder.search-focused {
      grid-template-rows: minmax(0, 1fr);
    }

    .search-focused .builder-sidebar { height: 100%; }
    .search-focused .toolbar {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr) auto;
      align-content: stretch;
    }

    .search-focused .toolbar > :not(.search-field):not(.picto-results):not(.no-results) {
      display: none;
    }

    .search-focused .search-field { grid-column: 1; }
    .search-focused .picto-results {
      grid-column: 1;
      max-height: none;
      min-height: 0;
      grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
      align-content: start;
      overflow-y: auto;
    }

    .search-focused .picto-item:nth-child(n + 13) { display: flex; }

    .search-focused .builder-main { display: none; }
  }

  @media (max-width: 560px) {
    .board-builder { height: calc(var(--board-visible-height, 100dvh) - 61px); }

    .grid-option { font-size: .72em; }
    .picto-results { grid-template-columns: repeat(5, minmax(0, 1fr)); }

    .search-focused .picto-results {
      grid-template-columns: repeat(auto-fill, minmax(58px, 1fr));
    }
  }

  /* Keep the complete editor visible on tablet-sized screens. */
  @media (min-width: 641px) and (max-height: 820px) {
    .board-builder {
      height: calc(100dvh - var(--header-h));
      min-height: 0;
      gap: 12px;
      padding: 8px;
      overflow: hidden;
    }

    .builder-sidebar {
      width: clamp(300px, 32vw, 380px);
      max-height: none;
      overflow: hidden;
    }

    .toolbar {
      height: 100%;
      min-height: 0;
      gap: 8px;
    }

    .toolbar h2 { margin: 0; font-size: 1.1em; line-height: 1.15; }
    .field { gap: 3px; }
    .field label { font-size: .78em; }
    .field input { min-height: 36px; padding: 6px 8px; font-size: .9em; }
    .grid-options, .color-options { gap: 6px; }
    .grid-option { min-height: 36px; padding: 4px 10px; }
    .color-dot { width: 24px; height: 24px; }
    .search-input input { min-height: 36px; padding: 6px 8px; }
    .search-go { min-width: 40px; padding: 6px 10px; }

    .picto-results {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 4px;
      max-height: 150px;
      overflow-y: auto;
      padding: 2px;
    }

    .picto-item { gap: 2px; padding: 3px; }
    .picto-item img { width: 40px; height: 40px; }
    .picto-item span { font-size: .65em; }

    .actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px;
    }

    .btn {
      min-height: 34px;
      padding: 4px 6px;
      font-size: .72em;
      line-height: 1.1;
      white-space: normal;
    }

    .panel { max-height: 100px; overflow-y: auto; padding: 6px; gap: 4px; }
    .builder-main { min-width: 0; min-height: 0; align-items: center; padding: 4px; }
    .board-grid {
      width: min(100%, calc(100dvh - var(--header-h) - 24px), calc(100vw - 420px));
      max-width: min(600px, calc(100dvh - var(--header-h) - 24px), calc(100vw - 420px));
    }
  }

  /* Print styles */
  @media print {
    .builder-sidebar { display: none; }
    .board-builder { padding: 0; }
    .builder-main { padding: 0; }
    .board-grid {
      max-width: 100%;
      box-shadow: none;
    }
    .cell-clear { display: none !important; }
  }
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #27AE60;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    z-index: 1000;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    animation: toast-in 0.3s ease;
  }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>
