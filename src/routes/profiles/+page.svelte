<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { getProfiles, createProfile, deleteProfile, verifyPin, type Profile } from '$lib/storage';
  import { activeProfileId, activeProfile } from '$lib/stores/profile';
  import { fade, fly } from 'svelte/transition';

  let profiles = $state<Profile[]>([]);
  let showCreate = $state(false);
  let newName = $state('');
  let newAvatar = $state('😊');
  let newPin = $state('');
  let newRole = $state<'child' | 'parent' | 'teacher' | 'therapist'>('child');
  let pinInput = $state('');
  let pinTarget = $state<Profile | null>(null);
  let pinError = $state(false);

  const AVATARS = ['😊', '🦊', '🐻', '🦁', '🐸', '🌟', '🦋', '🐢', '🐰', '🦉', '🐱', '🐶', '🌈', '🚀', '🎨', '🎵'];
  const ROLES = [
    { id: 'child' as const, label: 'profile.role.child', emoji: '👧' },
    { id: 'parent' as const, label: 'profile.role.parent', emoji: '👪' },
    { id: 'teacher' as const, label: 'profile.role.teacher', emoji: '👩‍🏫' },
    { id: 'therapist' as const, label: 'profile.role.therapist', emoji: '🗣️' }
  ];

  $effect(() => { loadProfiles(); });

  async function loadProfiles() {
    profiles = await getProfiles();
  }

  async function selectProfile(p: Profile) {
    if (p.pinHash) {
      pinTarget = p;
      pinInput = '';
      pinError = false;
    } else {
      activateProfile(p);
    }
  }

  function activateProfile(p: Profile) {
    activeProfileId.set(p.id!);
    activeProfile.set(p);
    speak($t('profile.welcome') + ' ' + p.name);
    goto('/');
  }

  async function checkPin() {
    if (!pinTarget) return;
    const ok = await verifyPin(pinTarget.id!, pinInput);
    if (ok) {
      activateProfile(pinTarget);
      pinTarget = null;
    } else {
      pinError = true;
      pinInput = '';
      speak($t('profile.wrong_pin'));
    }
  }

  function addPinDigit(d: string) {
    if (pinInput.length < 4) {
      pinInput += d;
      if (pinInput.length === 4) checkPin();
    }
  }

  async function doCreate() {
    if (!newName.trim()) return;
    await createProfile(newName.trim(), newAvatar, newPin || undefined);
    newName = '';
    newAvatar = '😊';
    newPin = '';
    newRole = 'child';
    showCreate = false;
    await loadProfiles();
  }

  async function doDelete(id: number) {
    await deleteProfile(id);
    if ($activeProfileId === id) {
      activeProfileId.set(null);
      activeProfile.set(null);
    }
    await loadProfiles();
  }
</script>

<div class="profiles-page">
  <h1>{$t('profile.choose')}</h1>
  <p class="subtitle">{$t('profile.choose_desc')}</p>

  <div class="profile-grid">
    {#each profiles as p (p.id)}
      <button class="profile-card" onclick={() => selectProfile(p)} transition:fly={{ y: 20 }}>
        <span class="profile-avatar">{p.avatar}</span>
        <span class="profile-name">{p.name}</span>
        {#if p.pinHash}<span class="pin-icon">🔒</span>{/if}
      </button>
    {/each}

    <button class="profile-card new-card" onclick={() => { showCreate = true; speak($t('profile.new')); }}>
      <span class="profile-avatar">➕</span>
      <span class="profile-name">{$t('profile.new')}</span>
    </button>
  </div>

  <!-- PIN Dialog -->
  {#if pinTarget}
    <div class="overlay" transition:fade onclick={() => { pinTarget = null; }}>
      <div class="pin-dialog" onclick={(e) => e.stopPropagation()} transition:fly={{ y: 30 }}>
        <h2>{$t('profile.enter_pin')}</h2>
        <div class="pin-dots">
          {#each Array(4) as _, i}
            <div class="dot" class:filled={i < pinInput.length}></div>
          {/each}
        </div>
        {#if pinError}<p class="pin-error">{$t('profile.wrong_pin')}</p>{/if}
        <div class="numpad">
          {#each ['1','2','3','4','5','6','7','8','9','','0','⌫'] as key}
            {#if key === ''}
              <div></div>
            {:else if key === '⌫'}
              <button class="numpad-btn" onclick={() => { pinInput = pinInput.slice(0, -1); }}>⌫</button>
            {:else}
              <button class="numpad-btn" onclick={() => addPinDigit(key)}>{key}</button>
            {/if}
          {/each}
        </div>
        <button class="cancel-btn" onclick={() => { pinTarget = null; }}>{$t('app.back')}</button>
      </div>
    </div>
  {/if}

  <!-- Create Dialog -->
  {#if showCreate}
    <div class="overlay" transition:fade onclick={() => { showCreate = false; }}>
      <div class="create-dialog" onclick={(e) => e.stopPropagation()} transition:fly={{ y: 30 }}>
        <h2>{$t('profile.new')}</h2>

        <label class="field-label">{$t('profile.name')}</label>
        <input type="text" bind:value={newName} placeholder={$t('profile.name_placeholder')} class="text-input" />

        <label class="field-label">{$t('profile.avatar')}</label>
        <div class="avatar-grid">
          {#each AVATARS as emoji}
            <button class="avatar-pick" class:selected={newAvatar === emoji} onclick={() => { newAvatar = emoji; }}>{emoji}</button>
          {/each}
        </div>

        <label class="field-label">{$t('profile.role')}</label>
        <div class="role-grid">
          {#each ROLES as role}
            <button class="role-pick" class:selected={newRole === role.id} onclick={() => { newRole = role.id; }}>
              <span>{role.emoji}</span> {$t(role.label)}
            </button>
          {/each}
        </div>

        <label class="field-label">{$t('profile.pin_optional')}</label>
        <input type="password" bind:value={newPin} maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••" class="text-input pin-field" />

        <div class="dialog-actions">
          <button class="cancel-btn" onclick={() => { showCreate = false; }}>{$t('app.back')}</button>
          <button class="create-btn" onclick={doCreate} disabled={!newName.trim()}>{$t('profile.create')}</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .profiles-page {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    text-align: center;
  }
  h1 { font-size: 2em; font-weight: 800; margin-bottom: 8px; }
  .subtitle { color: var(--text-muted); margin-bottom: 32px; font-size: 1.1em; }

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    max-width: 700px;
    width: 100%;
  }
  .profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 16px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: all 0.2s;
    position: relative;
    min-height: 140px;
  }
  .profile-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: #3498DB; }
  .profile-avatar { font-size: 3em; }
  .profile-name { font-weight: 600; font-size: 1.1em; }
  .pin-icon { position: absolute; top: 8px; right: 8px; font-size: 0.8em; }
  .new-card { border-style: dashed; opacity: 0.7; }
  .new-card:hover { opacity: 1; }

  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .pin-dialog, .create-dialog {
    background: var(--bg); border-radius: 16px; padding: 32px; max-width: 400px; width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .pin-dialog h2, .create-dialog h2 { margin-bottom: 24px; }

  .pin-dots { display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; }
  .dot {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border); transition: all 0.2s;
  }
  .dot.filled { background: #3498DB; border-color: #3498DB; }
  .pin-error { color: #E74C3C; font-size: 0.9em; margin-bottom: 8px; }

  .numpad {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    max-width: 240px; margin: 0 auto 16px;
  }
  .numpad-btn {
    width: 64px; height: 64px; font-size: 1.5em; font-weight: 600;
    border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; margin: 0 auto;
    transition: background 0.15s;
  }
  .numpad-btn:active { background: var(--bg-hover); }

  .field-label { display: block; text-align: left; font-weight: 600; margin: 16px 0 6px; font-size: 0.9em; }
  .text-input {
    width: 100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border);
    font-size: 1em; background: var(--bg-card);
  }
  .pin-field { max-width: 120px; text-align: center; letter-spacing: 8px; font-size: 1.3em; }

  .avatar-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .avatar-pick {
    width: 44px; height: 44px; font-size: 1.5em; border-radius: 10px;
    border: 2px solid transparent; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .avatar-pick.selected { border-color: #3498DB; background: rgba(52,152,219,0.1); }

  .role-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
  .role-pick {
    padding: 10px; border-radius: var(--radius-sm); border: 2px solid var(--border);
    font-size: 0.85em; font-weight: 500; transition: all 0.15s; text-align: left;
  }
  .role-pick.selected { border-color: #3498DB; background: rgba(52,152,219,0.1); }

  .dialog-actions { display: flex; gap: 10px; margin-top: 20px; }
  .cancel-btn {
    flex: 1; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border);
    font-weight: 600; background: var(--bg-card);
  }
  .create-btn {
    flex: 1; padding: 12px; border-radius: var(--radius-sm); border: none;
    font-weight: 600; background: #3498DB; color: white;
  }
  .create-btn:disabled { opacity: 0.4; }
</style>
