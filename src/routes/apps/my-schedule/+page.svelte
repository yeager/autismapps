<script>
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { saveAppProgress, getAppProgress } from '$lib/storage';
  import { activeProfileId } from '$lib/stores/profile';
  import { fade } from 'svelte/transition';
  import { get } from 'svelte/store';

  const ICONS = ['📚','🎨','🎮','⚽','🎵','🧩','🍽️','🛁','🚶','🧹','📺','🍳','✏️','🧘','🛏️','🏊','🚴','🎭','🧸','📖'];

  let items = $state([]);
  let adding = $state(false);
  let newIcon = $state('📚');
  let newText = $state('');

  $effect(() => {
    const pid = get(activeProfileId);
    if (pid) {
      getAppProgress(pid, 'my-schedule').then(data => {
        if (data?.items) items = data.items;
      });
    }
  });

  function save() {
    const pid = get(activeProfileId);
    if (pid) saveAppProgress(pid, 'my-schedule', { items });
  }

  function addItem() {
    if (!newText.trim()) return;
    items = [...items, { icon: newIcon, text: newText.trim(), done: false, id: Date.now() }];
    newText = '';
    adding = false;
    save();
  }

  function toggle(id) {
    items = items.map(i => i.id === id ? { ...i, done: !i.done } : i);
    const item = items.find(i => i.id === id);
    if (item?.done) speak(`${item.text} ✅`);
    save();
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    save();
  }
</script>

<WelcomeDialog appId="my-schedule" titleKey="app.my_schedule" purposeKey="welcome.mySchedule.purpose" howKey="welcome.mySchedule.how" goalKey="welcome.mySchedule.goal" icon="📋" />

<div class="app" in:fade>
  <header class="hdr">
    <button class="back" onclick={() => goto('/')}>←</button>
    <h1>📋 {$t('mySchedule.title')}</h1>
    <button class="add-btn" onclick={() => adding = !adding}>➕</button>
  </header>

  <main class="cnt">
    {#if adding}
      <div class="add-form" in:fade>
        <div class="icon-row">
          {#each ICONS as icon}
            <button class="icon-pick" class:active={newIcon === icon} onclick={() => newIcon = icon}>{icon}</button>
          {/each}
        </div>
        <input type="text" bind:value={newText} placeholder={$t('mySchedule.whatToDo')} class="text-input" />
        <button class="save-btn" onclick={addItem}>{$t('mySchedule.add')}</button>
      </div>
    {/if}

    {#if items.length === 0}
      <p class="empty">{$t('mySchedule.empty')}</p>
    {:else}
      <div class="list">
        {#each items as item, idx}
          <div class="item" class:done={item.done}>
            <span class="num">{idx + 1}</span>
            <button class="item-main" onclick={() => toggle(item.id)}>
              <span class="item-icon">{item.icon}</span>
              <span class="item-text">{item.text}</span>
            </button>
            {#if item.done}<span class="check">✅</span>{/if}
            <button class="del" onclick={() => remove(item.id)}>✕</button>
          </div>
        {/each}
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
  .add-btn { font-size:1.5rem; background:none; border:none; cursor:pointer; min-width:48px; min-height:48px; }
  .cnt { flex:1; padding:1rem; max-width:600px; margin:0 auto; width:100%; }
  .add-form { padding:1rem; background:var(--bg-card); border:2px solid var(--border); border-radius:16px; margin-bottom:1rem; }
  .icon-row { display:flex; flex-wrap:wrap; gap:.25rem; margin-bottom:.75rem; }
  .icon-pick { font-size:1.3rem; background:none; border:2px solid transparent; border-radius:8px; cursor:pointer; min-width:40px; min-height:40px; }
  .icon-pick.active { border-color:var(--accent,#2196f3); background:#e3f2fd; }
  .text-input { width:100%; padding:.75rem; border:2px solid var(--border); border-radius:8px; font-size:1.1rem; margin-bottom:.75rem; background:var(--bg); color:var(--text); box-sizing:border-box; }
  .save-btn { width:100%; padding:.75rem; border:2px solid #4caf50; border-radius:8px; background:#e8f5e9; font-size:1.1rem; cursor:pointer; min-height:48px; font-weight:600; }
  .empty { text-align:center; color:var(--text-secondary); padding:3rem; }
  .list { display:flex; flex-direction:column; gap:.5rem; }
  .item { display:flex; align-items:center; gap:.5rem; padding:.5rem; border:2px solid var(--border); border-radius:12px; background:var(--bg-card); }
  .item.done { opacity:.6; border-color:#4caf50; }
  .num { width:28px; height:28px; border-radius:50%; background:var(--border); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.85rem; flex-shrink:0; }
  .item.done .num { background:#4caf50; color:#fff; }
  .item-main { flex:1; display:flex; align-items:center; gap:.5rem; background:none; border:none; cursor:pointer; text-align:left; min-height:48px; color:var(--text); }
  .item-icon { font-size:1.5rem; }
  .item-text { font-size:1.1rem; font-weight:500; }
  .check { font-size:1rem; }
  .del { background:none; border:none; cursor:pointer; font-size:1rem; color:var(--text-secondary); min-width:36px; min-height:36px; }
  .cr { padding:1rem; text-align:center; font-size:.75rem; color:var(--text-secondary); border-top:1px solid var(--border); }
</style>
