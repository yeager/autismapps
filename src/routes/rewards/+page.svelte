<script lang="ts">
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  
  import { activeProfileId, activeProfile } from '$lib/stores/profile';
  import { getProfile } from '$lib/storage';
  import {
    stars, achievements, goals, diplomas, totalStars,
    rewardsSettings, saveSettings, loadRewardsData,
    createGoal, deleteGoal, createDiploma,
  } from '$lib/rewards/store';
  import { ACHIEVEMENT_DEFS } from '$lib/rewards/types';
  import type { RewardGoal, Diploma } from '$lib/rewards/types';
  import DiplomaCard from '$lib/components/rewards/DiplomaCard.svelte';
  import { fly, fade } from 'svelte/transition';
  import { browser } from '$app/environment';

  let tab = $state<'stars' | 'achievements' | 'goals' | 'diplomas'>('stars');
  let profileName = $state('');
  let showNewGoal = $state(false);
  let newGoalType = $state<'stars' | 'time'>('stars');
  let newGoalTarget = $state(5);
  let newGoalReward = $state('');

  $effect(() => {
    if (browser && !$activeProfileId ) {
      goto(`${base}/profiles`);
    }
  });

  $effect(() => {
    if ($activeProfileId) {
      loadRewardsData();
      getProfile($activeProfileId).then(p => {
        if (p) profileName = p.name;
      });
    }
  });

  const unlockedKeys = $derived(new Set($achievements.map(a => a.achievementKey)));

  function toggleMaster() {
    const s = { ...$rewardsSettings, enabled: !$rewardsSettings.enabled };
    saveSettings(s);
  }

  function togglePraise() {
    const s = { ...$rewardsSettings, praiseEnabled: !$rewardsSettings.praiseEnabled };
    saveSettings(s);
  }

  function toggleDiplomas() {
    const s = { ...$rewardsSettings, diplomasEnabled: !$rewardsSettings.diplomasEnabled };
    saveSettings(s);
  }

  async function addGoal() {
    if (!newGoalReward.trim()) return;
    await createGoal(newGoalType, newGoalTarget, newGoalReward.trim());
    showNewGoal = false;
    newGoalReward = '';
    speak($t('rewards.goal_created'));
  }

  async function removeGoal(id: number) {
    await deleteGoal(id);
  }

  async function earnDiploma(achKey: string) {
    if (!profileName) return;
    await createDiploma(profileName, achKey);
    speak($t('rewards.diploma.created'));
  }

  function progressPercent(goal: RewardGoal): number {
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  }
</script>

<div class="rewards-page">
  <h1 class="page-title">
    ⭐ {$t('rewards.title')}
  </h1>

  {#if profileName}
    <p class="profile-greeting">{$t('rewards.greeting', { name: profileName })}</p>
  {/if}

  <!-- Settings toggles -->
  <section class="settings-section">
    <label class="toggle-row">
      <input type="checkbox" checked={$rewardsSettings.enabled} onchange={toggleMaster} />
      <span>{$t('rewards.settings.enabled')}</span>
    </label>
    <label class="toggle-row">
      <input type="checkbox" checked={$rewardsSettings.praiseEnabled} onchange={togglePraise} disabled={!$rewardsSettings.enabled} />
      <span>🔊 {$t('rewards.settings.praise')}</span>
    </label>
    <label class="toggle-row">
      <input type="checkbox" checked={$rewardsSettings.diplomasEnabled} onchange={toggleDiplomas} disabled={!$rewardsSettings.enabled} />
      <span>📜 {$t('rewards.settings.diplomas')}</span>
    </label>
  </section>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab" class:active={tab === 'stars'} onclick={() => tab = 'stars'}>
      ⭐ {$t('rewards.tab.stars')} ({$totalStars})
    </button>
    <button class="tab" class:active={tab === 'achievements'} onclick={() => tab = 'achievements'}>
      🏆 {$t('rewards.tab.achievements')}
    </button>
    <button class="tab" class:active={tab === 'goals'} onclick={() => tab = 'goals'}>
      🎯 {$t('rewards.tab.goals')}
    </button>
    <button class="tab" class:active={tab === 'diplomas'} onclick={() => tab = 'diplomas'}>
      📜 {$t('rewards.tab.diplomas')}
    </button>
  </div>

  <!-- Tab content -->
  <div class="tab-content">
    {#if tab === 'stars'}
      <div class="star-total">
        <span class="big-star-count">{$totalStars}</span>
        <span class="star-label">{$t('rewards.gold_stars')}</span>
      </div>
      {#if $stars.length === 0}
        <p class="empty-state">{$t('rewards.no_stars_yet')}</p>
      {:else}
        <ul class="star-list">
          {#each $stars.slice().reverse().slice(0, 50) as star (star.id)}
            <li class="star-item" transition:fly={{ x: -20, duration: 300 }}>
              <span class="star-emoji">⭐</span>
              <div class="star-info">
                <span class="star-app">{star.appId}</span>
                <span class="star-date">{new Date(star.earnedAt).toLocaleDateString('sv-SE')}</span>
              </div>
            </li>
          {/each}
        </ul>
      {/if}

    {:else if tab === 'achievements'}
      <div class="achievements-grid">
        {#each ACHIEVEMENT_DEFS as def}
          {@const unlocked = unlockedKeys.has(def.key)}
          <div class="achievement-card" class:locked={!unlocked}>
            <span class="ach-icon">{unlocked ? def.icon : '🔒'}</span>
            <p class="ach-name">{$t(def.labelKey)}</p>
            <p class="ach-desc">{$t(def.descKey)}</p>
            {#if unlocked && $rewardsSettings.diplomasEnabled && !$diplomas.some(d => d.achievementKey === def.key)}
              <button class="diploma-btn" onclick={() => earnDiploma(def.key)}>
                📜 {$t('rewards.earn_diploma')}
              </button>
            {/if}
          </div>
        {/each}
      </div>

    {:else if tab === 'goals'}
      <div class="goals-section">
        {#each $goals as goal (goal.id)}
          <div class="goal-card" class:completed={goal.completed} transition:fly={{ y: 20, duration: 300 }}>
            <div class="goal-header">
              <span class="goal-type">{goal.type === 'stars' ? '⭐' : '⏰'}</span>
              <span class="goal-text">{goal.rewardText}</span>
              <button class="goal-delete" onclick={() => removeGoal(goal.id!)}>✕</button>
            </div>
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: {progressPercent(goal)}%"></div>
              </div>
              <span class="progress-text">{goal.current} / {goal.target}</span>
            </div>
            {#if goal.completed}
              <p class="goal-done">🎉 {$t('rewards.goal_completed')}</p>
            {/if}
          </div>
        {/each}

        {#if showNewGoal}
          <div class="new-goal-form" transition:fly={{ y: 20, duration: 300 }}>
            <select bind:value={newGoalType}>
              <option value="stars">{$t('rewards.goal_type.stars')}</option>
              <option value="time">{$t('rewards.goal_type.time')}</option>
            </select>
            <input type="number" min="1" max="100" bind:value={newGoalTarget} />
            <input type="text" bind:value={newGoalReward} placeholder={$t('rewards.goal_reward_placeholder')} />
            <button class="btn-add" onclick={addGoal}>{$t('rewards.add_goal')}</button>
            <button class="btn-cancel" onclick={() => showNewGoal = false}>{$t('rewards.cancel')}</button>
          </div>
        {:else}
          <button class="btn-new-goal" onclick={() => showNewGoal = true}>
            ➕ {$t('rewards.new_goal')}
          </button>
        {/if}
      </div>

    {:else if tab === 'diplomas'}
      {#if $diplomas.length === 0}
        <p class="empty-state">{$t('rewards.no_diplomas_yet')}</p>
      {:else}
        <div class="diplomas-list">
          {#each $diplomas as diploma (diploma.id)}
            <DiplomaCard {diploma} />
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .rewards-page {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 4px;
  }

  .profile-greeting {
    text-align: center;
    color: var(--text-muted, #666);
    margin-bottom: 20px;
  }

  .settings-section {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
    background: var(--bg-card, #fff);
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid var(--border, #eee);
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.95rem;
  }

  .toggle-row input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #ffd700;
  }

  .tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 16px;
  }

  .tab {
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    background: var(--bg-card, #fff);
    border: 1px solid var(--border, #eee);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab.active {
    background: #ffd700;
    color: #333;
    border-color: #daa520;
  }

  .tab-content {
    min-height: 200px;
  }

  .star-total {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    gap: 4px;
  }

  .big-star-count {
    font-size: 3.5rem;
    font-weight: 900;
    color: #daa520;
  }

  .star-label {
    font-size: 1.1rem;
    color: var(--text-muted, #666);
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted, #999);
    font-style: italic;
  }

  .star-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .star-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: var(--bg-card, #fff);
    border-radius: 10px;
    border: 1px solid var(--border, #eee);
  }

  .star-emoji { font-size: 1.3rem; }

  .star-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .star-app {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .star-date {
    font-size: 0.8rem;
    color: var(--text-muted, #999);
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }

  .achievement-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 12px;
    background: var(--bg-card, #fff);
    border-radius: 14px;
    border: 2px solid #ffd700;
    gap: 6px;
    transition: transform 0.2s;
  }

  .achievement-card.locked {
    border-color: var(--border, #ddd);
    opacity: 0.5;
  }

  .ach-icon { font-size: 2rem; }
  .ach-name { font-weight: 700; font-size: 0.95rem; margin: 0; }
  .ach-desc { font-size: 0.8rem; color: var(--text-muted, #777); margin: 0; }

  .diploma-btn {
    margin-top: 8px;
    padding: 6px 14px;
    border-radius: 8px;
    background: #fff8dc;
    border: 1px solid #daa520;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .goals-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .goal-card {
    padding: 16px;
    background: var(--bg-card, #fff);
    border-radius: 12px;
    border: 1px solid var(--border, #eee);
  }

  .goal-card.completed {
    border-color: #27ae60;
    background: rgba(39, 174, 96, 0.05);
  }

  .goal-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .goal-type { font-size: 1.2rem; }
  .goal-text { flex: 1; font-weight: 600; }
  .goal-delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--text-muted, #999);
    padding: 4px 8px;
  }

  .goal-progress {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar {
    flex: 1;
    height: 10px;
    background: var(--border, #eee);
    border-radius: 5px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ffd700, #ffaa00);
    border-radius: 5px;
    transition: width 0.4s ease;
  }

  .progress-text {
    font-size: 0.85rem;
    font-weight: 600;
    min-width: 60px;
    text-align: right;
  }

  .goal-done {
    margin: 8px 0 0;
    font-weight: 600;
    color: #27ae60;
  }

  .new-goal-form {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
    background: var(--bg-card, #fff);
    border-radius: 12px;
    border: 1px solid var(--border, #eee);
  }

  .new-goal-form select,
  .new-goal-form input {
    padding: 8px 12px;
    border: 1px solid var(--border, #ddd);
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .new-goal-form input[type="text"] { flex: 1; min-width: 150px; }
  .new-goal-form input[type="number"] { width: 70px; }

  .btn-add, .btn-cancel, .btn-new-goal {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    border: none;
  }

  .btn-add { background: #ffd700; color: #333; }
  .btn-cancel { background: var(--bg-card, #eee); }
  .btn-new-goal {
    background: var(--bg-card, #fff);
    border: 2px dashed var(--border, #ddd);
    padding: 14px;
  }

  .diplomas-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>
