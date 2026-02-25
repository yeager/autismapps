<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { searchPictograms, getPictogramUrl, type PictogramSearchResult } from '$lib/arasaac';
  import { saveBoard, getBoards, deleteBoard, type Board, type BoardCell } from '$lib/storage';
  import { locale } from '$lib/i18n';
  import { arasaacBW } from '$lib/a11y';
  import { get } from 'svelte/store';

  // State
  let gridSize = $state(4);
  let boardName = $state('');
  let centerTitle = $state('');
  let categoryColor = $state('#E67E22');
  let cells = $state<BoardCell[]>(createEmptyCells(4));
  let searchQuery = $state('');
  let searchResults = $state<PictogramSearchResult[]>([]);
  let searching = $state(false);
  let selectedCellIndex = $state<number | null>(null);
  let savedBoards = $state<Board[]>([]);
  let showMyBoards = $state(false);
  let showTemplates = $state(false);
  let editingLabel = $state<number | null>(null);
  let editLabelText = $state('');

  const GRID_OPTIONS = [3, 4, 5, 6];
  const COLORS = ['#E67E22', '#3498DB', '#27AE60', '#9B59B6', '#F1C40F', '#E74C3C', '#1ABC9C', '#E91E63'];

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

  async function doSearch() {
    if (!searchQuery.trim()) return;
    searching = true;
    const lang = get(locale);
    searchResults = await searchPictograms(searchQuery, lang);
    searching = false;
  }

  function selectCell(index: number) {
    selectedCellIndex = index;
    if (!cells[index].isEmpty) {
      speak(cells[index].label);
    }
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
      isEmpty: false
    };
    speak(picto.keyword);
    // Move to next empty cell
    const nextEmpty = cells.findIndex((c, i) => i > selectedCellIndex! && c.isEmpty);
    selectedCellIndex = nextEmpty >= 0 ? nextEmpty : null;
  }

  function clearCell(index: number) {
    cells[index] = { index, label: '', isEmpty: true };
  }

  function startEditLabel(index: number) {
    editingLabel = index;
    editLabelText = cells[index].label;
  }

  function finishEditLabel() {
    if (editingLabel !== null) {
      cells[editingLabel].label = editLabelText;
      editingLabel = null;
    }
  }

  async function save() {
    const board: Board = {
      name: boardName || 'Untitled',
      category: 'custom',
      gridSize,
      cells: [...cells],
      centerTitle,
      categoryColor,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveBoard(board);
    speak($t('board.save'));
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

  // Templates
  const TEMPLATES = [
    { name: 'Home', titleKey: 'Home', color: '#E67E22', keywords: ['cook', 'wash', 'clean', 'sleep', 'eat', 'drink', 'sit', 'play', 'read', 'shower', 'dress', 'toilet', 'brush teeth', 'watch tv', 'rest', 'help'] },
    { name: 'School', titleKey: 'School', color: '#3498DB', keywords: ['read', 'write', 'draw', 'sing', 'count', 'play', 'eat', 'drink', 'listen', 'speak', 'work', 'rest', 'gym', 'computer', 'friend', 'teacher'] },
    { name: 'Food', titleKey: 'Food', color: '#27AE60', keywords: ['water', 'milk', 'juice', 'bread', 'apple', 'banana', 'rice', 'pasta', 'chicken', 'fish', 'egg', 'cheese', 'yogurt', 'cookie', 'ice cream', 'soup'] },
    { name: 'Emotions', titleKey: 'Emotions', color: '#9B59B6', keywords: ['happy', 'sad', 'angry', 'scared', 'tired', 'hungry', 'thirsty', 'pain', 'love', 'surprise', 'calm', 'excited', 'worried', 'proud', 'shy', 'bored'] },
    { name: 'Hygiene', titleKey: 'Hygiene', color: '#1ABC9C', keywords: ['shower', 'bath', 'brush teeth', 'wash hands', 'soap', 'towel', 'toilet', 'comb', 'deodorant', 'toothbrush', 'toothpaste', 'shampoo', 'mirror', 'nail', 'tissue', 'clean'] },
  ];

  async function loadTemplate(template: typeof TEMPLATES[0]) {
    gridSize = 4;
    boardName = template.name;
    centerTitle = template.titleKey;
    categoryColor = template.color;
    cells = createEmptyCells(4);
    
    // Search and fill each cell
    const lang = get(locale);
    for (let i = 0; i < Math.min(template.keywords.length, 16); i++) {
      const results = await searchPictograms(template.keywords[i], lang);
      if (results.length > 0) {
        const bw = get(arasaacBW);
        cells[i] = {
          index: i,
          pictogramId: results[0].id,
          pictogramUrl: bw ? results[0].urlBW : results[0].url,
          label: results[0].keyword,
          isEmpty: false
        };
      }
    }
    showTemplates = false;
  }

  // Load boards on mount
  $effect(() => { loadSavedBoards(); });
</script>

<div class="board-builder">
  <div class="builder-sidebar">
    <!-- Toolbar -->
    <div class="toolbar">
      <h2>{$t('board.title')}</h2>
      
      <div class="field">
        <label for="board-name">{$t('board.board_name')}</label>
        <input id="board-name" type="text" bind:value={boardName} placeholder="My Board" />
      </div>

      <div class="field">
        <label for="center-title">{$t('board.center_title')}</label>
        <input id="center-title" type="text" bind:value={centerTitle} />
      </div>

      <div class="field">
        <label>{$t('board.grid_size')}</label>
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

      <div class="field">
        <label>{$t('board.category_color')}</label>
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
      <div class="field">
        <label for="picto-search">{$t('board.search_pictograms')}</label>
        <div class="search-input">
          <input
            id="picto-search"
            type="search"
            bind:value={searchQuery}
            placeholder={$t('board.search_pictograms')}
            onkeydown={(e) => { if (e.key === 'Enter') doSearch(); }}
          />
          <button class="search-go" onclick={doSearch} disabled={searching}>
            {searching ? '...' : '🔍'}
          </button>
        </div>
      </div>

      <!-- Search results -->
      {#if searchResults.length > 0}
        <div class="picto-results">
          {#each searchResults as picto}
            <button
              class="picto-item"
              onclick={() => addPictogramToCell(picto)}
              title={picto.keyword}
            >
              <img src={picto.url} alt={picto.keyword} width="60" height="60" loading="lazy" />
              <span>{picto.keyword}</span>
            </button>
          {/each}
        </div>
      {:else if searchQuery && !searching}
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
              {tmpl.name}
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
            <p class="no-results">No saved boards yet</p>
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
          ondblclick={() => !cell.isEmpty && startEditLabel(i)}
          aria-label={cell.isEmpty ? $t('board.tap_to_add') : cell.label}
        >
          {#if !cell.isEmpty && cell.pictogramUrl}
            <img src={cell.pictogramUrl} alt={cell.label} loading="lazy" />
          {/if}
          {#if editingLabel === i}
            <input
              class="label-edit"
              type="text"
              bind:value={editLabelText}
              onblur={finishEditLabel}
              onkeydown={(e) => { if (e.key === 'Enter') finishEditLabel(); }}
            />
          {:else if !cell.isEmpty}
            <span class="cell-label">{cell.label}</span>
          {:else}
            <span class="cell-placeholder">+</span>
          {/if}
          {#if !cell.isEmpty}
            <button
              class="cell-clear"
              onclick={(e) => { e.stopPropagation(); clearCell(i); }}
              aria-label={$t('board.clear_cell')}
            >✕</button>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .board-builder {
    display: flex;
    gap: 20px;
    padding: 20px;
    min-height: calc(100dvh - 60px);
  }

  @media (max-width: 768px) {
    .board-builder {
      flex-direction: column;
    }
  }

  /* Sidebar */
  .builder-sidebar {
    width: 320px;
    flex-shrink: 0;
    overflow-y: auto;
    max-height: calc(100dvh - 100px);
  }

  @media (max-width: 768px) {
    .builder-sidebar {
      width: 100%;
      max-height: none;
    }
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
  .board-cell:hover .cell-clear {
    display: flex;
  }

  .label-edit {
    width: 90%;
    padding: 2px 4px;
    border: 1px solid var(--accent);
    border-radius: 4px;
    text-align: center;
    font-size: 0.75em;
    background: var(--bg);
    color: var(--text);
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
</style>
