<script lang="ts">
  /**
   * MelodyDisplay — Visual melody notation
   * Shows notes on a simplified staff with color-coded syllables.
   * Notes go up/down matching pitch. Active note highlights during playback.
   */

  type NoteEvent = { note: string; duration: number };

  export let melody: NoteEvent[] = [];
  export let syllables: string[] = [];
  export let activeNoteIndex: number = -1;
  export let stepId: string = 'humming'; // current MIT step

  // Map notes to vertical positions (higher note = higher position)
  const NOTE_POSITIONS: Record<string, number> = {
    C4: 5,
    D4: 4,
    E4: 3,
    F4: 2,
    G4: 1,
    A4: 0,
  };

  // Colors for syllables (rotating palette)
  const SYLLABLE_COLORS = [
    '#E74C3C', // red
    '#3498DB', // blue
    '#27AE60', // green
    '#F39C12', // orange
    '#9B59B6', // purple
    '#1ABC9C', // teal
  ];

  function getNoteY(note: string): number {
    return (NOTE_POSITIONS[note] ?? 3) * 20 + 10;
  }

  function getNoteColor(index: number): string {
    return SYLLABLE_COLORS[index % SYLLABLE_COLORS.length];
  }

  // Scale note size based on duration
  function getNoteSize(duration: number): number {
    return Math.max(14, Math.min(24, duration * 30));
  }
</script>

<div class="melody-display" role="img" aria-label="Melodivisning">
  <!-- Simplified staff lines -->
  <svg viewBox="0 0 {melody.length * 80 + 40} 160" class="staff">
    <!-- Staff lines -->
    {#each [30, 50, 70, 90, 110] as y}
      <line x1="10" y1={y} x2={melody.length * 80 + 30} y2={y} stroke="var(--staff-line, #ddd)" stroke-width="1" />
    {/each}

    <!-- Notes -->
    {#each melody as noteEvt, i}
      {@const cx = i * 80 + 50}
      {@const cy = getNoteY(noteEvt.note)}
      {@const r = getNoteSize(noteEvt.duration)}
      {@const isActive = i === activeNoteIndex}

      <!-- Note circle -->
      <circle
        {cx}
        cy={cy + 20}
        r={isActive ? r + 4 : r}
        fill={isActive ? getNoteColor(i) : getNoteColor(i) + '99'}
        stroke={isActive ? '#fff' : 'none'}
        stroke-width={isActive ? 3 : 0}
        class="note"
        class:active={isActive}
        class:pulse={isActive}
      />

      <!-- Note name (for humming step, show note; otherwise show syllable) -->
      <text
        x={cx}
        y={cy + 25}
        text-anchor="middle"
        fill="#fff"
        font-size={isActive ? '13' : '11'}
        font-weight="700"
      >
        {stepId === 'humming' ? '♪' : (syllables[i] || '♪')}
      </text>

      <!-- Syllable label below -->
      {#if stepId !== 'humming' && syllables[i]}
        <text
          x={cx}
          y="145"
          text-anchor="middle"
          fill={getNoteColor(i)}
          font-size="16"
          font-weight="700"
        >
          {syllables[i]}
        </text>
      {/if}
    {/each}
  </svg>
</div>

<style>
  .melody-display {
    width: 100%;
    padding: 0.5rem;
    background: var(--bg-card, #fff);
    border-radius: 16px;
    border: 2px solid var(--border, #e0e0e0);
    overflow-x: auto;
  }

  .staff {
    width: 100%;
    min-width: 200px;
    height: auto;
    display: block;
  }

  .note {
    transition: all 0.2s ease;
  }

  .note.pulse {
    animation: notePulse 0.6s ease-in-out infinite alternate;
  }

  @keyframes notePulse {
    from { transform-origin: center; opacity: 0.9; }
    to { transform-origin: center; opacity: 1; }
  }

  @media (prefers-color-scheme: dark) {
    .melody-display {
      --staff-line: #444;
    }
  }
</style>
