<script>
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { fade } from 'svelte/transition';
  import { get } from 'svelte/store';

  const REWARD_ICONS = ['⭐','🌟','💎','🏆','🎯','🎖️','👑','🦄'];
  const GOAL_PRESETS = [
    { icon: '🧹', key: 'rewardChart.goal.tidy' },
    { icon: '🪥', key: 'rewardChart.goal.brush' },
    { icon: '📚', key: 'rewardChart.goal.homework' },
    { icon: '🥗', key: 'rewardChart.goal.eat' },
    { icon: '👕', key: 'rewardChart.goal.dress' },
    { icon: '😊', key: 'rewardChart.goal.kind' },
  ];

  let stars = $state(0);
  let goal = $state(10);
  let history = $state([]);
  let showCelebration = $state(false);

  $effect(() => {
    const pid = get(activeProfileId);
    if (pid) {
      getAppProgress(pid, 'reward-chart').then(data => {
        if (data) {
          stars = data.stars || 0;
          goal = data.goal || 10;
          history = data.history || [];
        }
      });
    }
  });

  function save() {
    const pid = get(activeProfileId);
    if (pid) saveAppProgress(pid, 'reward-chart', { stars, goal, history });
  }

  function addStar(reason) {
    stars++;
    history = [...history, { reason: $t(reason.key), time: new Date().toLocaleString(), icon: reason.icon }];
    speak(`${reason.icon} ${$t(reason.key)}! ⭐`);
    if (stars >= goal) {
      showCelebration = true;
      speak($t('rewardChart.goalReached'));
      setTimeout(() => { showCelebration = false; }, 4000);
    }
    save();
  }

  function reset() {
    stars = 0;
    history = [];
    save();
  }

  let progress = $derived(Math.min(100, (stars / goal) * 100));
</script>

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto('/')}>←</button>
    <h1>⭐ {$t('rewardChart.title')}</h1>
    <span class="star-count">{stars}/{goal}</span>
  </header>

  <main class="cnt">
    <div class="progress-bar">
      <div class="fill" style="width: {progress}%"></div>
      <span class="progress-text">{Math.round(progress)}%</span>
    </div>

    <div class="star-display">
      {#each Array(goal) as _, i}
        <span class="star" class:earned={i < stars}>{i < stars ? '⭐' : '☆'}</span>
      {/each}
    </div>

    <h2>{$t('rewardChart.earnStar')}</h2>
    <div class="goals">
      {#each GOAL_PRESETS as g}
        <button class="goal-btn" onclick={() => addStar(g)}>
          <span class="goal-icon">{g.icon}</span>
          <span class="goal-text">{$t(g.key)}</span>
        </button>
      {/each}
    </div>

    {#if stars >= goal}
      <button class="reset-btn" onclick={reset}>🔄 {$t('rewardChart.newChart')}</button>
    {/if}

    {#if showCelebration}
      <div class="celebration" in:fade>
        <span class="big">🎉🏆🎉</span>
        <p>{$t('rewardChart.goalReached')}</p>
      </div>
    {/if}
  </main>

  <footer class="cr"><p>Autismappar · CC BY-NC-SA 4.0</p></footer>
</div>

<style>
  .app { min-height:100dvh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); }
  .hdr { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--bg-card); border-bottom:1px solid var(--border); }
  .back { font-size:1.5rem; background:none; border:none; cursor:pointer; color:var(--text); min-width:48px; min-height:48px; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:1.4rem; margin:0; flex:1; }
  h2 { text-align:center; margin:1.5rem 0 1rem; }
  .star-count { font-weight:700; font-size:1.1rem; background:#fff8e1; color:#f57f17; padding:.25rem .75rem; border-radius:20px; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .progress-bar { height:24px; background:var(--border); border-radius:12px; position:relative; overflow:hidden; margin-bottom:1rem; }
  .fill { height:100%; background:linear-gradient(90deg,#ffd54f,#ffb300); border-radius:12px; transition:width .5s; }
  .progress-text { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-weight:700; font-size:.85rem; }
  .star-display { display:flex; flex-wrap:wrap; justify-content:center; gap:.5rem; margin:1rem 0; }
  .star { font-size:1.8rem; transition:transform .3s; }
  .star.earned { animation:pop .3s ease; }
  @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
  .goals { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
  .goal-btn { display:flex; align-items:center; gap:.75rem; padding:1rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); cursor:pointer; min-height:48px; }
  .goal-btn:hover { border-color:#ffb300; }
  .goal-icon { font-size:1.8rem; }
  .goal-text { font-weight:500; text-align:left; }
  .reset-btn { display:block; margin:1.5rem auto; padding:.75rem 1.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); font-size:1.1rem; cursor:pointer; min-height:48px; }
  .celebration { text-align:center; margin-top:2rem; }
  .big { font-size:3rem; display:block; }
  .celebration p { font-size:1.5rem; font-weight:700; color:#f57f17; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
  @media(prefers-reduced-motion:reduce) { .star { transition:none; animation:none; } .fill { transition:none; } }
</style>
