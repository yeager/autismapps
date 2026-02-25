<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak, stop } from '$lib/tts';
  import { getBoards, type Board, type BoardCell } from '$lib/storage';
  import { getTakkSign, openSignVideo } from '$lib/takk';

  let boards = $state<Board[]>([]);
  let currentBoard = $state<Board | null>(null);
  let sentenceStrip = $state<BoardCell[]>([]);
  let showBoardList = $state(true);
  let isFullscreen = $state(false);

  // Core vocabulary quick buttons — LAMP principle: NEVER change positions
  // Fitzgerald Key colors: yellow=people, green=verbs, orange=objects, blue=descriptions
  const QUICK_BUTTONS = [
    { key: 'yes', emoji: '✅', color: '#27AE60' },
    { key: 'no', emoji: '❌', color: '#E74C3C' },
    { key: 'help', emoji: '🆘', color: '#3498DB' },
    { key: 'more', emoji: '➕', color: '#F1C40F' },
    { key: 'stop', emoji: '🛑', color: '#E74C3C' },
    { key: 'toilet', emoji: '🚻', color: '#9B59B6' },
    { key: 'i_want', emoji: '🙋', color: '#F39C12' },
    { key: 'finished', emoji: '✋', color: '#27AE60' },
  ];

  // Built-in core vocabulary board (always available, LAMP: fixed positions)
  const CORE_VOCAB: BoardCell[] = [
    { index: 0, label: 'I', isEmpty: false, color: '#F1C40F', pictogramId: undefined },
    { index: 1, label: 'you', isEmpty: false, color: '#F1C40F', pictogramId: undefined },
    { index: 2, label: 'want', isEmpty: false, color: '#27AE60', pictogramId: undefined },
    { index: 3, label: 'not', isEmpty: false, color: '#E74C3C', pictogramId: undefined },
    { index: 4, label: 'go', isEmpty: false, color: '#27AE60', pictogramId: undefined },
    { index: 5, label: 'eat', isEmpty: false, color: '#27AE60', pictogramId: undefined },
    { index: 6, label: 'drink', isEmpty: false, color: '#27AE60', pictogramId: undefined },
    { index: 7, label: 'play', isEmpty: false, color: '#27AE60', pictogramId: undefined },
    { index: 8, label: 'like', isEmpty: false, color: '#27AE60', pictogramId: undefined },
    { index: 9, label: 'big', isEmpty: false, color: '#3498DB', pictogramId: undefined },
    { index: 10, label: 'little', isEmpty: false, color: '#3498DB', pictogramId: undefined },
    { index: 11, label: 'happy', isEmpty: false, color: '#3498DB', pictogramId: undefined },
    { index: 12, label: 'sad', isEmpty: false, color: '#3498DB', pictogramId: undefined },
    { index: 13, label: 'good', isEmpty: false, color: '#3498DB', pictogramId: undefined },
    { index: 14, label: 'bad', isEmpty: false, color: '#3498DB', pictogramId: undefined },
    { index: 15, label: 'here', isEmpty: false, color: '#E67E22', pictogramId: undefined },
    { index: 16, label: 'there', isEmpty: false, color: '#E67E22', pictogramId: undefined },
    { index: 17, label: 'what', isEmpty: false, color: '#9B59B6', pictogramId: undefined },
    { index: 18, label: 'where', isEmpty: false, color: '#9B59B6', pictogramId: undefined },
    { index: 19, label: 'who', isEmpty: false, color: '#9B59B6', pictogramId: undefined },
  ];

  async function loadBoards() {
    boards = await getBoards();
    if (boards.length > 0 && !currentBoard) {
      selectBoard(boards[0]);
    }
  }

  function selectBoard(board: Board) {
    currentBoard = board;
    showBoardList = false;
  }

  function tapCell(cell: BoardCell) {
    if (cell.isEmpty) return;
    speak(cell.label);
    sentenceStrip = [...sentenceStrip, cell];
  }

  function tapQuick(key: string) {
    const word = $t(`talk.${key}`);
    speak(word);
    sentenceStrip = [...sentenceStrip, {
      index: -1,
      label: word,
      isEmpty: false
    }];
  }

  function speakAll() {
    const text = sentenceStrip.map(c => c.label).join(' ');
    if (text) speak(text);
  }

  function clearSentence() {
    sentenceStrip = [];
    stop();
  }

  function removeLast() {
    sentenceStrip = sentenceStrip.slice(0, -1);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      isFullscreen = true;
    } else {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

  $effect(() => { loadBoards(); });
</script>

<div class="talk-board" class:fullscreen={isFullscreen}>
  {#if showBoardList}
    <!-- Board selector -->
    <div class="board-selector">
      <h2>{$t('talk.load_board')}</h2>
      <div class="board-list">
        {#each boards as board}
          <button class="board-option" onclick={() => selectBoard(board)}>
            <span class="board-dot" style="background: {board.categoryColor}"></span>
            <span class="board-name">{board.name}</span>
            <span class="board-size">{board.gridSize}×{board.gridSize}</span>
          </button>
        {:else}
          <div class="empty-state">
            <p>No boards yet. Create one in Board Builder!</p>
            <a href="/apps/board-builder" class="link-btn">Open Board Builder →</a>
          </div>
        {/each}
      </div>
    </div>
  {:else if currentBoard}
    <!-- Sentence strip -->
    <div class="sentence-area">
      <div class="sentence-strip" role="log" aria-label={$t('talk.sentence_strip')}>
        {#if sentenceStrip.length === 0}
          <span class="strip-hint">{$t('talk.sentence_strip')}</span>
        {:else}
          {#each sentenceStrip as cell, i}
            <button class="strip-word" onclick={() => speak(cell.label)}>
              {#if cell.pictogramUrl}
                <img src={cell.pictogramUrl} alt={cell.label} width="40" height="40" />
              {/if}
              {cell.label}
            </button>
          {/each}
        {/if}
      </div>
      <div class="sentence-actions">
        <button class="action-btn speak" onclick={speakAll} disabled={sentenceStrip.length === 0}>
          🔊 {$t('talk.speak_all')}
        </button>
        <button class="action-btn" onclick={removeLast} disabled={sentenceStrip.length === 0}>⌫</button>
        <button class="action-btn" onclick={clearSentence} disabled={sentenceStrip.length === 0}>
          {$t('talk.clear')}
        </button>
      </div>
    </div>

    <!-- Quick access bar -->
    <div class="quick-bar">
      {#each QUICK_BUTTONS as btn}
        <button
          class="quick-btn"
          style="--q-color: {btn.color}"
          onclick={() => tapQuick(btn.key)}
        >
          <span class="quick-emoji">{btn.emoji}</span>
          <span>{$t(`talk.${btn.key}`)}</span>
        </button>
      {/each}
    </div>

    <!-- Board grid -->
    <div
      class="talk-grid"
      style="--grid-size: {currentBoard.gridSize}; --board-color: {currentBoard.categoryColor}"
    >
      {#each currentBoard.cells as cell}
        <button
          class="talk-cell"
          class:empty={cell.isEmpty}
          onclick={() => tapCell(cell)}
          aria-label={cell.isEmpty ? '' : cell.label}
          disabled={cell.isEmpty}
        >
          {#if !cell.isEmpty && cell.pictogramUrl}
            <img src={cell.pictogramUrl} alt={cell.label} loading="lazy" />
          {/if}
          {#if !cell.isEmpty}
            <span class="talk-label">{cell.label}</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Bottom toolbar -->
    <div class="talk-toolbar">
      <button class="tool-btn" onclick={() => { showBoardList = true; }}>
        📂 {$t('talk.load_board')}
      </button>
      <button class="tool-btn" onclick={toggleFullscreen}>
        {isFullscreen ? '🔲' : '⛶'} {$t('talk.fullscreen')}
      </button>
    </div>
  {/if}
</div>

<style>
  .talk-board {
    display: flex;
    flex-direction: column;
    min-height: calc(100dvh - 60px);
    padding: 12px;
    gap: 12px;
  }
  .talk-board.fullscreen {
    min-height: 100dvh;
    padding: 16px;
  }

  /* Board selector */
  .board-selector {
    max-width: 500px;
    margin: 40px auto;
    width: 100%;
  }
  .board-selector h2 {
    font-size: 1.3em;
    margin-bottom: 16px;
  }
  .board-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .board-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    transition: all var(--transition);
    min-height: 56px;
  }
  .board-option:hover {
    border-color: var(--accent);
    background: var(--bg-hover);
  }
  .board-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .board-name {
    flex: 1;
    font-weight: 600;
    text-align: left;
  }
  .board-size {
    color: var(--text-muted);
    font-size: 0.85em;
  }
  .empty-state {
    text-align: center;
    padding: 32px;
    color: var(--text-muted);
  }
  .link-btn {
    display: inline-block;
    margin-top: 12px;
    padding: 10px 20px;
    background: var(--accent);
    color: white;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-weight: 600;
  }

  /* Sentence strip */
  .sentence-area {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }
  .sentence-strip {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    min-height: 60px;
    overflow-x: auto;
  }
  .strip-hint {
    color: var(--text-muted);
    font-size: 0.9em;
  }
  .strip-word {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: var(--bg-hover);
    border-radius: var(--radius-sm);
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
  }
  .strip-word img {
    border-radius: 4px;
  }
  .sentence-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .action-btn {
    padding: 8px 14px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 44px;
  }
  .action-btn:hover:not(:disabled) {
    background: var(--bg-hover);
  }
  .action-btn:disabled {
    opacity: 0.4;
  }
  .action-btn.speak {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  /* Quick bar */
  .quick-bar {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }
  .quick-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 8px;
    background: var(--bg-card);
    border: 2px solid var(--q-color);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 56px;
    min-width: 70px;
  }
  .quick-btn:hover {
    background: var(--q-color);
    color: white;
  }
  .quick-emoji {
    font-size: 1.4em;
  }

  /* Talk grid */
  .talk-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(var(--grid-size), 1fr);
    gap: 8px;
    padding: 12px;
    background: var(--bg-card);
    border: 3px solid var(--board-color);
    border-radius: var(--radius);
  }
  .talk-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 6px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    transition: all var(--transition);
    min-height: 90px;
  }
  .talk-cell:hover:not(:disabled) {
    border-color: var(--board-color);
    transform: scale(1.02);
    box-shadow: var(--shadow);
  }
  .talk-cell:active:not(:disabled) {
    transform: scale(0.97);
    background: var(--bg-hover);
  }
  .talk-cell.empty {
    opacity: 0.2;
    border-style: dashed;
  }
  .talk-cell img {
    width: 70%;
    max-width: 100px;
    height: auto;
    border-radius: 4px;
  }
  .talk-label {
    font-size: 0.85em;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
  }

  /* Toolbar */
  .talk-toolbar {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .tool-btn {
    padding: 10px 18px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85em;
    transition: all var(--transition);
    min-height: 44px;
  }
  .tool-btn:hover {
    background: var(--bg-hover);
  }
</style>
