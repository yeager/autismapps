<script lang="ts">
  type TrafficSafetyCopy = {
    title?: string;
    welcome?: { purpose?: string; how?: string; goal?: string; more?: string; less?: string };
    common?: { start?: string };
  };

  let { i18n = {}, visible = true, onstart = () => {} } = $props<{
    i18n?: TrafficSafetyCopy;
    visible?: boolean;
    onstart?: () => void;
  }>();

  let showDetails = $state(false);
</script>

{#if visible}
<div class="overlay">
  <div class="dialog" role="dialog" aria-modal="true" aria-label={i18n.title || 'Traffic Safety'}>
    <h2>🚦 {i18n.title || 'Traffic Safety'}</h2>
    <p class="purpose">{i18n.welcome?.purpose || ''}</p>
    <button
      class="details-toggle"
      type="button"
      aria-expanded={showDetails}
      aria-controls="traffic-safety-welcome-details"
      onclick={() => (showDetails = !showDetails)}
    >
      {showDetails ? i18n.welcome?.less || 'Less information' : i18n.welcome?.more || 'More information'}
    </button>
    {#if showDetails}
      <div class="details" id="traffic-safety-welcome-details">
        <p>{i18n.welcome?.how || ''}</p>
        <p>{i18n.welcome?.goal || ''}</p>
      </div>
    {/if}
    <button class="start" type="button" onclick={onstart}>{i18n.common?.start || 'Start'}</button>
  </div>
</div>
{/if}

<style>
  .overlay {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    overflow-y: auto;
    padding: max(0.5rem, env(safe-area-inset-top)) 0.5rem max(0.5rem, env(safe-area-inset-bottom));
    background: rgba(0, 0, 0, 0.5);
    overscroll-behavior: contain;
  }

  .dialog {
    box-sizing: border-box;
    width: min(440px, calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right) - 1rem));
    min-width: 0;
    max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 1rem);
    overflow-y: auto;
    padding: clamp(1rem, 4vw, 2rem);
    border-radius: 16px;
    background: white;
    text-align: center;
  }

  .dialog h2 { margin: 0 0 0.75rem; font-size: clamp(1.25rem, 6vw, 1.75rem); }
  .dialog p { margin: 0 0 0.75rem; color: #555; font-size: clamp(0.95rem, 3.8vw, 1.1rem); line-height: 1.45; }

  .details-toggle {
    display: block;
    min-height: 44px;
    margin: 0 auto 0.5rem;
    padding: 0.35rem 0.6rem;
    border: 0;
    background: transparent;
    color: #315a49;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 650;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    cursor: pointer;
  }

  .start {
    width: 100%;
    min-height: 48px;
    padding: 0.7rem 1.25rem;
    border: 0;
    border-radius: 12px;
    background: #4caf50;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
  }

  .start:hover { background: #388e3c; }

  @media (max-height: 480px) {
    .dialog { padding: 0.75rem 1rem; }
    .dialog h2 { margin-bottom: 0.4rem; font-size: 1.2rem; }
    .dialog p { margin-bottom: 0.4rem; font-size: 0.9rem; }
    .details-toggle { min-height: 38px; margin-bottom: 0.25rem; }
    .start { min-height: 44px; }
  }
</style>
