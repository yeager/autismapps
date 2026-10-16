<script lang="ts">
  import { t } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { speak } from '$lib/tts';
  
  interface Props {
    open: boolean;
    onComplete: (name: string, avatar: string) => void;
  }
  
  let { open, onComplete }: Props = $props();
  
  let name = $state('');
  let selectedAvatar = $state('👋');
  
  const AVATARS = ['👋', '😊', '🌟', '🎈', '🎨', '📚', '🎮', '🎵', '🦋', '🌈', '🦄', '🐾'];
  
  function handleSubmit() {
    const trimmedName = name.trim();
    if (trimmedName) {
      if (browser) {
        localStorage.setItem('userName', trimmedName);
        localStorage.setItem('userAvatar', selectedAvatar);
      }
      speak($t('welcome.hello_name', { name: trimmedName }));
      onComplete(trimmedName, selectedAvatar);
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
  
  let nameInput: HTMLInputElement | undefined = $state();
  
  // Focus name input when modal opens
  $effect(() => {
    if (open && nameInput && browser) {
      setTimeout(() => nameInput?.focus(), 100);
    }
  });
</script>

{#if open}
  <div class="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
    <div class="welcome-modal">
      <div class="welcome-icon">{selectedAvatar}</div>
      
      <h1 id="welcome-title">{$t('welcome.whats_your_name')}</h1>
      
      <div class="name-section">
        <input
          bind:this={nameInput}
          bind:value={name}
          type="text"
          class="name-input"
          placeholder="..."
          autocomplete="given-name"
          onkeydown={handleKeydown}
        />
        
        <div class="avatar-picker">
          {#each AVATARS as avatar}
            <button
              class="avatar-option"
              class:selected={selectedAvatar === avatar}
              onclick={() => selectedAvatar = avatar}
              aria-label={$t('welcome.modal.choose_avatar', { avatar })}
            >
              {avatar}
            </button>
          {/each}
        </div>
      </div>
      
      <button
        class="continue-btn"
        onclick={handleSubmit}
        disabled={!name.trim()}
      >
        {$t('welcome.continue')}
      </button>
      
      <p class="storage-info">{$t('welcome.storage_info')}</p>
    </div>
  </div>
{/if}

<style>
  .welcome-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .welcome-modal {
    background: var(--bg-card, white);
    color: var(--text, #333);
    border-radius: 1.5rem;
    padding: 2.5rem 2rem;
    max-width: 440px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.4s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .welcome-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  }

  h1 {
    margin: 0 0 2rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text, #333);
  }

  .name-section {
    margin-bottom: 2rem;
  }

  .name-input {
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1.1rem;
    font-weight: 500;
    border: 3px solid var(--border, #e0e0e0);
    border-radius: 0.75rem;
    background: var(--bg, white);
    color: var(--text, #333);
    text-align: center;
    margin-bottom: 1.5rem;
    transition: border-color 0.2s ease;
  }

  .name-input:focus {
    outline: none;
    border-color: var(--accent, #2196f3);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent, #2196f3) 20%, transparent);
  }

  .avatar-picker {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
  }

  .avatar-option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
    border: 2px solid var(--border, #e0e0e0);
    border-radius: 0.75rem;
    background: var(--bg-card, white);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .avatar-option:hover {
    border-color: var(--accent, #2196f3);
    transform: scale(1.05);
  }

  .avatar-option.selected {
    border-color: var(--accent, #2196f3);
    background: var(--accent, #2196f3);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--accent, #2196f3) 30%, transparent);
  }

  .continue-btn {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 700;
    background: var(--accent, #2196f3);
    color: white;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1.5rem;
    min-height: 3rem;
  }

  .continue-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--accent, #2196f3) 90%, black);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--accent, #2196f3) 30%, transparent);
  }

  .continue-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .storage-info {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-muted, #999);
    line-height: 1.4;
  }

  @media (max-width: 500px) {
    .welcome-modal {
      padding: 2rem 1.5rem;
      margin: 1rem;
    }

    .avatar-picker {
      grid-template-columns: repeat(4, 1fr);
    }

    .avatar-option {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.2rem;
    }
  }
</style>