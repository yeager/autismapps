<script lang="ts">
  import { onMount } from 'svelte';

  /** Beat pattern: true = strong beat, false = weak */
  export let beats: boolean[] = [];
  /** Pattern labels (da/DA) */
  export let pattern: string[] = [];
  /** BPM for the rhythm */
  export let bpm = 80;
  /** Whether the rhythm is playing */
  export let playing = false;
  /** Current active beat index (-1 = none) */
  export let activeBeat: number = -1;

  let intervalTimer: number | null = null;
  let audioCtx: AudioContext | null = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    return audioCtx;
  }

  function playClick(strong: boolean) {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = strong ? 1000 : 600;
      gain.gain.value = strong ? 0.3 : 0.15;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio not available
    }
  }

  export function start() {
    stop();
    playing = true;
    activeBeat = 0;
    playClick(beats[0]);
    const intervalMs = 60000 / bpm;
    intervalTimer = setInterval(() => {
      activeBeat = (activeBeat + 1) % beats.length;
      playClick(beats[activeBeat]);
      if (activeBeat === 0) {
        // Completed one loop
      }
    }, intervalMs) as unknown as number;
  }

  export function stop() {
    if (intervalTimer) {
      clearInterval(intervalTimer);
      intervalTimer = null;
    }
    playing = false;
    activeBeat = -1;
  }

  export function toggle() {
    if (playing) stop(); else start();
  }

  onMount(() => {
    return () => { stop(); };
  });
</script>

<div class="rhythm-beats">
  <div class="beats-row">
    {#each beats as strong, i}
      <div class="beat-container">
        <div
          class="beat-circle"
          class:strong
          class:weak={!strong}
          class:active={activeBeat === i}
        >
          {#if strong}
            <span class="note">🎵</span>
          {:else}
            <span class="note-small">♪</span>
          {/if}
        </div>
        <span class="beat-label" class:strong-label={strong}>{pattern[i] || ''}</span>
      </div>
    {/each}
  </div>

  <div class="tempo-row">
    <label class="tempo-label">
      Tempo: {bpm} BPM
    </label>
    <input type="range" min="40" max="140" step="10" bind:value={bpm} class="tempo-slider" />
  </div>

  <button class="play-btn" class:active={playing} onclick={toggle}>
    {playing ? '⏹️ Stopp' : '▶️ Spela'}
  </button>
</div>

<style>
  .rhythm-beats {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    background: var(--bg-card, #fff);
    border-radius: 16px;
    border: 2px solid var(--border, #e0e0e0);
  }

  .beats-row {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .beat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .beat-circle {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .beat-circle.strong {
    width: 64px;
    height: 64px;
    background: #E91E63;
    box-shadow: 0 2px 10px rgba(233, 30, 99, 0.3);
  }

  .beat-circle.weak {
    width: 44px;
    height: 44px;
    background: #3498DB;
    opacity: 0.7;
  }

  .beat-circle.active {
    transform: scale(1.25);
    box-shadow: 0 0 20px rgba(233, 30, 99, 0.6);
  }

  .beat-circle.active.weak {
    box-shadow: 0 0 15px rgba(52, 152, 219, 0.6);
    opacity: 1;
  }

  .note {
    font-size: 1.5rem;
  }

  .note-small {
    font-size: 1rem;
    color: #fff;
  }

  .beat-label {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-secondary, #666);
  }

  .beat-label.strong-label {
    font-size: 1.2rem;
    font-weight: 800;
    color: #E91E63;
  }

  .tempo-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    width: 100%;
  }

  .tempo-label {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
  }

  .tempo-slider {
    width: 60%;
    accent-color: #E67E22;
  }

  .play-btn {
    padding: 0.7rem 2rem;
    border-radius: 14px;
    border: 2px solid #2ECC71;
    background: #2ECC71;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 48px;
    transition: all 0.2s;
  }

  .play-btn.active {
    background: #E74C3C;
    border-color: #E74C3C;
  }

  .play-btn:hover {
    transform: translateY(-1px);
  }

  .play-btn:active {
    transform: scale(0.97);
  }
</style>
