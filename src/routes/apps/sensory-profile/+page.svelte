<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade, fly } from 'svelte/transition';
  import RadarChart from '$lib/components/RadarChart.svelte';
  import SensoryDiet from '$lib/components/SensoryDiet.svelte';
  import ActivityCard from '$lib/components/ActivityCard.svelte';
  import { SENSES, RATINGS, STRATEGIES, ACTIVITIES, getRecommendedActivities } from '$lib/data/sensory-data.js';

  // ---- Tabs ----
  type Tab = 'assessment' | 'profile' | 'strategies' | 'diet' | 'export';
  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'assessment', label: 'sensory.tab.assessment', emoji: '📝' },
    { id: 'profile', label: 'sensory.tab.profile', emoji: '📊' },
    { id: 'strategies', label: 'sensory.tab.strategies', emoji: '💡' },
    { id: 'diet', label: 'sensory.tab.diet', emoji: '🍽️' },
    { id: 'export', label: 'sensory.tab.export', emoji: '📤' },
  ];

  let activeTab = $state<Tab>('assessment');
  let expandedSense = $state<string | null>(null);

  // ---- Profiles (localStorage) ----
  interface SensoryProfileData {
    id: string;
    name: string;
    ratings: Record<string, string>;      // senseId -> seeking/neutral/avoiding
    itemRatings: Record<string, string>;   // itemId -> seeking/neutral/avoiding
    diet: Record<string, any[]>;           // timeSlotId -> activities[]
    createdAt: string;
  }

  const STORAGE_KEY = 'sensory-profiles';

  let profiles = $state<SensoryProfileData[]>([]);
  let activeProfileIndex = $state<number>(-1);
  let newProfileName = $state('');
  let showProfileManager = $state(false);

  // Load profiles from localStorage
  function loadProfiles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) profiles = JSON.parse(raw);
      if (profiles.length > 0 && activeProfileIndex < 0) activeProfileIndex = 0;
    } catch { /* ignore */ }
  }

  function saveProfiles() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch { /* ignore */ }
  }

  function createProfile() {
    if (!newProfileName.trim()) return;
    const profile: SensoryProfileData = {
      id: crypto.randomUUID(),
      name: newProfileName.trim(),
      ratings: {},
      itemRatings: {},
      diet: {},
      createdAt: new Date().toISOString(),
    };
    profiles = [...profiles, profile];
    activeProfileIndex = profiles.length - 1;
    newProfileName = '';
    saveProfiles();
  }

  function deleteProfile(index: number) {
    profiles = profiles.filter((_, i) => i !== index);
    if (activeProfileIndex >= profiles.length) activeProfileIndex = profiles.length - 1;
    saveProfiles();
  }

  const currentProfile = $derived(profiles[activeProfileIndex] || null);

  // ---- Assessment ----
  function setItemRating(itemId: string, rating: string) {
    if (!currentProfile) return;
    currentProfile.itemRatings[itemId] = rating;
    // Recalculate overall sense rating from items
    for (const sense of SENSES) {
      const items = sense.items;
      const itemRatings = items.map(item => currentProfile.itemRatings[item.id]).filter(Boolean);
      if (itemRatings.length === 0) continue;
      // Most common rating wins
      const counts: Record<string, number> = { seeking: 0, neutral: 0, avoiding: 0 };
      for (const r of itemRatings) counts[r] = (counts[r] || 0) + 1;
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      currentProfile.ratings[sense.id] = dominant;
    }
    profiles = [...profiles]; // trigger reactivity
    saveProfiles();
  }

  function setOverallRating(senseId: string, rating: string) {
    if (!currentProfile) return;
    currentProfile.ratings[senseId] = rating;
    profiles = [...profiles];
    saveProfiles();
  }

  // ---- Diet ----
  function handleDietChange(newDiet: Record<string, any[]>) {
    if (!currentProfile) return;
    currentProfile.diet = newDiet;
    profiles = [...profiles];
    saveProfiles();
  }

  // ---- Export ----
  function printProfile() {
    window.print();
  }

  // ---- Init ----
  $effect(() => { loadProfiles(); });

  function toggleSense(senseId: string) {
    expandedSense = expandedSense === senseId ? null : senseId;
  }
</script>

<svelte:head>
  <title>{$t('sensory.title')}</title>
</svelte:head>

<WelcomeDialog
  appId="sensory-profile"
  titleKey="sensory.title"
  purposeKey="sensory.welcome.purpose"
  howKey="sensory.welcome.how"
  goalKey="sensory.welcome.goal"
  icon="🧠"
/>

<div class="sensory-app">
  <!-- Header -->
  <header class="app-header">
    <button class="back-btn" onclick={() => goto(`${base}/`)}>← {$t('sensory.back')}</button>
    <h1>🧠 {$t('sensory.title')}</h1>
    <button class="profile-btn" onclick={() => showProfileManager = !showProfileManager}>
      👤 {currentProfile?.name || $t('sensory.profiles')}
    </button>
  </header>

  <!-- Profile Manager -->
  {#if showProfileManager}
    <div class="profile-manager" transition:fly={{ y: -10, duration: 200 }}>
      <div class="profile-list">
        {#if profiles.length === 0}
          <p class="no-profiles">{$t('sensory.profiles.noProfiles')}</p>
        {:else}
          {#each profiles as profile, i (profile.id)}
            <div class="profile-item" class:active={i === activeProfileIndex}>
              <button class="profile-select" onclick={() => { activeProfileIndex = i; showProfileManager = false; }}>
                👤 {profile.name}
              </button>
              <button class="profile-delete" onclick={() => deleteProfile(i)}>🗑️</button>
            </div>
          {/each}
        {/if}
      </div>
      <div class="profile-create">
        <input
          type="text"
          bind:value={newProfileName}
          placeholder={$t('sensory.profiles.name')}
          onkeydown={(e) => e.key === 'Enter' && createProfile()}
        />
        <button onclick={createProfile} disabled={!newProfileName.trim()}>
          ➕ {$t('sensory.profiles.new')}
        </button>
      </div>
    </div>
  {/if}

  {#if !currentProfile}
    <div class="no-profile-message" transition:fade>
      <div class="empty-state">
        <span class="empty-icon">🧠</span>
        <p>{$t('sensory.profiles.noProfiles')}</p>
        <div class="inline-create">
          <input
            type="text"
            bind:value={newProfileName}
            placeholder={$t('sensory.profiles.name')}
            onkeydown={(e) => e.key === 'Enter' && createProfile()}
          />
          <button onclick={createProfile} disabled={!newProfileName.trim()}>
            ➕ {$t('sensory.profiles.new')}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Tabs -->
    <nav class="tabs">
      {#each TABS as tab (tab.id)}
        <button
          class="tab"
          class:active={activeTab === tab.id}
          onclick={() => activeTab = tab.id}
        >
          <span class="tab-emoji">{tab.emoji}</span>
          <span class="tab-label">{$t(tab.label)}</span>
        </button>
      {/each}
    </nav>

    <!-- Tab Content -->
    <main class="tab-content">
      {#if activeTab === 'assessment'}
        <div class="assessment" transition:fade={{ duration: 150 }}>
          <p class="instructions">{$t('sensory.assessment.instructions')}</p>
          {#each SENSES as sense (sense.id)}
            <div class="sense-section">
              <button
                class="sense-header"
                onclick={() => toggleSense(sense.id)}
                style="--sense-color: {sense.color}"
              >
                <span class="sense-emoji">{sense.emoji}</span>
                <span class="sense-name">{$t(sense.label)}</span>
                {#if currentProfile.ratings[sense.id]}
                  <span class="sense-badge" class:seeking={currentProfile.ratings[sense.id] === 'seeking'} class:avoiding={currentProfile.ratings[sense.id] === 'avoiding'} class:neutral={currentProfile.ratings[sense.id] === 'neutral'}>
                    {$t(`sensory.rating.${currentProfile.ratings[sense.id]}`)}
                  </span>
                {/if}
                <span class="expand-arrow" class:expanded={expandedSense === sense.id}>▶</span>
              </button>

              {#if expandedSense === sense.id}
                <div class="sense-items" transition:fly={{ y: -10, duration: 150 }}>
                  <!-- Individual items -->
                  {#each sense.items as item (item.id)}
                    <div class="item-row">
                      <span class="item-label">{$t(item.label)}</span>
                      <div class="rating-buttons">
                        {#each ['seeking', 'neutral', 'avoiding'] as rating}
                          <button
                            class="rating-btn"
                            class:selected={currentProfile.itemRatings[item.id] === rating}
                            class:seeking={rating === 'seeking'}
                            class:neutral={rating === 'neutral'}
                            class:avoiding={rating === 'avoiding'}
                            onclick={() => setItemRating(item.id, rating)}
                          >
                            {$t(`sensory.rating.${rating}`)}
                          </button>
                        {/each}
                      </div>
                    </div>
                  {/each}

                  <!-- Overall override -->
                  <div class="overall-row">
                    <span class="overall-label">{$t('sensory.assessment.overall', { sense: $t(sense.label) })}</span>
                    <div class="rating-buttons">
                      {#each ['seeking', 'neutral', 'avoiding'] as rating}
                        <button
                          class="rating-btn large"
                          class:selected={currentProfile.ratings[sense.id] === rating}
                          class:seeking={rating === 'seeking'}
                          class:neutral={rating === 'neutral'}
                          class:avoiding={rating === 'avoiding'}
                          onclick={() => setOverallRating(sense.id, rating)}
                        >
                          {$t(`sensory.rating.${rating}`)}
                        </button>
                      {/each}
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

      {:else if activeTab === 'profile'}
        <div class="profile-view" transition:fade={{ duration: 150 }}>
          <h2>{$t('sensory.chart.title')}</h2>
          {#if Object.keys(currentProfile.ratings).length === 0}
            <p class="no-data">{$t('sensory.chart.noData')}</p>
          {:else}
            <RadarChart ratings={currentProfile.ratings} size={340} />
          {/if}
        </div>

      {:else if activeTab === 'strategies'}
        <div class="strategies-view" transition:fade={{ duration: 150 }}>
          <h2>{$t('sensory.strategies.title')}</h2>
          {#if Object.keys(currentProfile.ratings).length === 0}
            <p class="no-data">{$t('sensory.strategies.noData')}</p>
          {:else}
            {#each SENSES as sense (sense.id)}
              {@const rating = currentProfile.ratings[sense.id]}
              {#if rating && rating !== 'neutral'}
                {@const strategies = STRATEGIES[sense.id]?.[rating] || []}
                <div class="strategy-section" style="--sense-color: {sense.color}">
                  <h3>
                    {sense.emoji} {$t('sensory.strategies.forSense', { sense: $t(sense.label) })}
                    <span class="strategy-badge" class:seeking={rating === 'seeking'} class:avoiding={rating === 'avoiding'}>
                      {$t(`sensory.rating.${rating}`)}
                    </span>
                  </h3>
                  <ul>
                    {#each strategies as stratKey}
                      <li>{$t(stratKey)}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            {/each}

            <!-- Recommended activities -->
            {@const recommended = getRecommendedActivities(currentProfile.ratings)}
            {#if recommended.length > 0}
              <h3 style="margin-top: 20px">⭐ {$t('sensory.diet.recommended')}</h3>
              <div class="activity-grid">
                {#each recommended.slice(0, 12) as activity (activity.id)}
                  <ActivityCard {activity} draggable={false} />
                {/each}
              </div>
            {/if}
          {/if}
        </div>

      {:else if activeTab === 'diet'}
        <div class="diet-view" transition:fade={{ duration: 150 }}>
          <SensoryDiet
            ratings={currentProfile.ratings}
            diet={currentProfile.diet}
            ondietchange={handleDietChange}
          />
        </div>

      {:else if activeTab === 'export'}
        <div class="export-view" transition:fade={{ duration: 150 }}>
          <h2>{$t('sensory.export.title')}</h2>
          <button class="print-btn" onclick={printProfile}>
            🖨️ {$t('sensory.export.print')}
          </button>

          <!-- Printable summary -->
          <div class="print-content" id="print-content">
            <h1>{$t('sensory.export.summary')}</h1>
            <p>{$t('sensory.export.generatedFor', { name: currentProfile.name })}</p>
            <p>{$t('sensory.export.date', { date: new Date().toLocaleDateString() })}</p>

            <h2>{$t('sensory.chart.title')}</h2>
            <RadarChart ratings={currentProfile.ratings} size={280} />

            <h2>{$t('sensory.strategies.title')}</h2>
            {#each SENSES as sense (sense.id)}
              {@const rating = currentProfile.ratings[sense.id]}
              {#if rating && rating !== 'neutral'}
                {@const strategies = STRATEGIES[sense.id]?.[rating] || []}
                <div class="print-strategy">
                  <h3>{sense.emoji} {$t(sense.label)}: {$t(`sensory.rating.${rating}`)}</h3>
                  <ul>
                    {#each strategies as stratKey}
                      <li>{$t(stratKey)}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            {/each}

            {#if Object.keys(currentProfile.diet).some(k => currentProfile.diet[k]?.length > 0)}
              <h2>{$t('sensory.export.sensoryDiet')}</h2>
              {#each Object.entries(currentProfile.diet) as [slotId, activities]}
                {#if activities?.length > 0}
                  <div class="print-slot">
                    <h4>{slotId}</h4>
                    <ul>
                      {#each activities as activity}
                        <li>{$t(activity.label)}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
        </div>
      {/if}
    </main>
  {/if}
</div>

<style>
  .sensory-app {
    max-width: 900px;
    margin: 0 auto;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--text-color, #2c3e50);
  }

  /* Header */
  .app-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .app-header h1 {
    flex: 1;
    font-size: 1.5rem;
    margin: 0;
  }

  .back-btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .profile-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 2px solid #3498DB;
    background: white;
    color: #3498DB;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
  }

  /* Profile Manager */
  .profile-manager {
    background: white;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }

  .profile-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .no-profiles {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 12px;
  }

  .profile-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .profile-item.active {
    background: #EBF5FB;
  }

  .profile-select {
    flex: 1;
    text-align: left;
    padding: 6px 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 6px;
  }

  .profile-select:hover {
    background: #f0f0f0;
  }

  .profile-delete {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 4px;
    opacity: 0.5;
  }

  .profile-delete:hover {
    opacity: 1;
  }

  .profile-create {
    display: flex;
    gap: 8px;
  }

  .profile-create input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.85rem;
  }

  .profile-create button {
    padding: 8px 14px;
    border: none;
    background: #3498DB;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .profile-create button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Empty state */
  .no-profile-message {
    text-align: center;
    padding: 40px 20px;
  }

  .empty-state {
    max-width: 350px;
    margin: 0 auto;
  }

  .empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
  }

  .inline-create {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .inline-create input {
    flex: 1;
    padding: 10px 14px;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;
  }

  .inline-create button {
    padding: 10px 18px;
    border: none;
    background: #3498DB;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 16px;
    -webkit-overflow-scrolling: touch;
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 14px;
    border: 2px solid transparent;
    border-radius: 12px;
    background: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tab.active {
    border-color: #3498DB;
    background: #EBF5FB;
    color: #3498DB;
  }

  .tab-emoji {
    font-size: 1.2rem;
  }

  .tab-label {
    font-size: 0.7rem;
    font-weight: 500;
  }

  /* Assessment */
  .assessment {
    width: 100%;
  }

  .instructions {
    color: #666;
    font-size: 0.85rem;
    margin: 0 0 16px;
  }

  .sense-section {
    margin-bottom: 8px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
  }

  .sense-header {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 14px 16px;
    border: none;
    background: white;
    cursor: pointer;
    font-size: 1rem;
    text-align: left;
    transition: background 0.2s;
  }

  .sense-header:hover {
    background: #f8f9fa;
  }

  .sense-emoji {
    font-size: 1.4rem;
  }

  .sense-name {
    flex: 1;
    font-weight: 600;
    color: var(--sense-color);
  }

  .sense-badge, .strategy-badge {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .sense-badge.seeking, .strategy-badge.seeking { background: #D5F5E3; color: #27AE60; }
  .sense-badge.neutral { background: #FEF9E7; color: #F39C12; }
  .sense-badge.avoiding, .strategy-badge.avoiding { background: #FADBD8; color: #E74C3C; }

  .expand-arrow {
    font-size: 0.7rem;
    color: #aaa;
    transition: transform 0.2s;
  }

  .expand-arrow.expanded {
    transform: rotate(90deg);
  }

  .sense-items {
    padding: 0 16px 16px;
    background: #fafafa;
  }

  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    gap: 8px;
    flex-wrap: wrap;
  }

  .item-label {
    font-size: 0.85rem;
    color: #555;
    flex: 1;
    min-width: 120px;
  }

  .rating-buttons {
    display: flex;
    gap: 4px;
  }

  .rating-btn {
    padding: 4px 10px;
    border: 2px solid #ddd;
    border-radius: 16px;
    background: white;
    cursor: pointer;
    font-size: 0.7rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .rating-btn.large {
    padding: 6px 14px;
    font-size: 0.8rem;
  }

  .rating-btn.seeking.selected { background: #D5F5E3; border-color: #27AE60; color: #27AE60; }
  .rating-btn.neutral.selected { background: #FEF9E7; border-color: #F39C12; color: #F39C12; }
  .rating-btn.avoiding.selected { background: #FADBD8; border-color: #E74C3C; color: #E74C3C; }

  .rating-btn:hover {
    transform: scale(1.05);
  }

  .overall-row {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 2px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }

  .overall-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: #333;
  }

  /* Profile / Chart View */
  .profile-view, .strategies-view, .diet-view, .export-view {
    width: 100%;
  }

  .profile-view h2, .strategies-view h2, .export-view h2 {
    font-size: 1.2rem;
    margin: 0 0 16px;
  }

  .no-data {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 30px;
  }

  /* Strategies */
  .strategy-section {
    background: white;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 10px;
    border-left: 4px solid var(--sense-color);
  }

  .strategy-section h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .strategy-section ul {
    margin: 0;
    padding-left: 20px;
  }

  .strategy-section li {
    padding: 3px 0;
    font-size: 0.9rem;
    color: #555;
  }

  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    gap: 8px;
    margin-top: 8px;
  }

  /* Export */
  .print-btn {
    padding: 12px 24px;
    border: none;
    background: #3498DB;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .print-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #eee;
  }

  .print-content h1 {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  .print-content h2 {
    font-size: 1.1rem;
    margin: 20px 0 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 6px;
  }

  .print-strategy h3 {
    font-size: 0.95rem;
    margin: 10px 0 4px;
  }

  .print-strategy ul {
    margin: 0 0 6px;
    padding-left: 20px;
  }

  .print-strategy li {
    font-size: 0.85rem;
    color: #555;
  }

  .print-slot h4 {
    text-transform: capitalize;
    margin: 8px 0 4px;
    font-size: 0.9rem;
  }

  .print-slot ul {
    margin: 0;
    padding-left: 20px;
  }

  .print-slot li {
    font-size: 0.85rem;
  }

  /* Print styles */
  @media print {
    .app-header, .tabs, .profile-manager, .back-btn, .profile-btn, .print-btn {
      display: none !important;
    }

    .sensory-app {
      padding: 0;
    }

    .print-content {
      border: none;
      padding: 0;
    }

    .export-view > h2 {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .app-header h1 {
      font-size: 1.2rem;
    }

    .tabs {
      gap: 2px;
    }

    .tab {
      padding: 6px 10px;
    }

    .tab-label {
      font-size: 0.6rem;
    }

    .item-row {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
