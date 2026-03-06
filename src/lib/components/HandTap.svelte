<script lang="ts">
  /**
   * HandTap — Visual left-hand tapping animation
   * MIT protocol uses left-hand tapping to activate right hemisphere.
   * The hand taps in rhythm with the melody.
   */

  export let isPlaying: boolean = false;
  export let tempo: number = 70; // BPM
  export let noteCount: number = 1;

  // Derive animation duration from tempo
  $: beatDuration = 60 / tempo; // seconds per beat
  $: totalDuration = beatDuration * noteCount;
</script>

<div class="hand-tap" class:playing={isPlaying} aria-label="Handtappning" role="img">
  <div
    class="hand"
    class:tapping={isPlaying}
    style="--beat-duration: {beatDuration}s; --total-duration: {totalDuration}s"
  >
    <span class="hand-emoji">🤚</span>
    <span class="hand-label">{isPlaying ? '♪' : ''}</span>
  </div>
  {#if isPlaying}
    <div class="tap-ripple" style="--beat-duration: {beatDuration}s"></div>
  {/if}
  <div class="tap-surface"></div>
</div>

<style>
  .hand-tap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }

  .hand {
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: scaleX(-1); /* Mirror for LEFT hand */
    transition: transform 0.1s;
    z-index: 2;
  }

  .hand-emoji {
    font-size: 2.5rem;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }

  .hand-label {
    font-size: 0.8rem;
    color: var(--text-secondary, #777);
    margin-top: -4px;
  }

  .hand.tapping {
    animation: handTap var(--beat-duration) ease-in-out infinite;
  }

  .tap-surface {
    position: absolute;
    bottom: 4px;
    width: 50px;
    height: 6px;
    background: var(--border, #ddd);
    border-radius: 3px;
    z-index: 1;
  }

  .tap-ripple {
    position: absolute;
    bottom: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #3498DB;
    animation: ripple var(--beat-duration) ease-out infinite;
    opacity: 0;
    z-index: 0;
  }

  @keyframes handTap {
    0%, 100% {
      transform: scaleX(-1) translateY(0);
    }
    50% {
      transform: scaleX(-1) translateY(8px);
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0.5);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .playing .tap-surface {
    background: #3498DB;
  }
</style>
