<script lang="ts">
  import { goto } from '$app/navigation';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  // Swedish coins and bills
  const COINS = [
    { value: 1, label: '1 kr', emoji: '🪙', color: '#C0C0C0' },
    { value: 2, label: '2 kr', emoji: '🪙', color: '#C0C0C0' },
    { value: 5, label: '5 kr', emoji: '🪙', color: '#C0C0C0' },
    { value: 10, label: '10 kr', emoji: '🪙', color: '#FFD700' },
  ];

  const BILLS = [
    { value: 20, label: '20 kr', emoji: '💵', color: '#9B59B6' },
    { value: 50, label: '50 kr', emoji: '💵', color: '#E67E22' },
    { value: 100, label: '100 kr', emoji: '💵', color: '#3498DB' },
    { value: 200, label: '200 kr', emoji: '💵', color: '#27AE60' },
    { value: 500, label: '500 kr', emoji: '💵', color: '#E74C3C' },
  ];

  let wallet = $state<{ value: number; label: string }[]>([]);
  let total = $derived(wallet.reduce((sum, c) => sum + c.value, 0));

  function addMoney(item: { value: number; label: string }) {
    wallet = [...wallet, item];
    speak(`${item.label}. ${$t('money.total')} ${total + item.value} ${$t('money.kr')}`);
  }

  function removeLast() {
    if (wallet.length > 0) {
      wallet = wallet.slice(0, -1);
      speak(`${$t('money.total')} ${total} ${$t('money.kr')}`);
    }
  }

  function reset() {
    wallet = [];
  }

  function speakTotal() {
    speak(`${total} ${$t('money.kr')}`);
  }
</script>

<WelcomeDialog appId="money-check" titleKey="app.money_check" purposeKey="welcome.moneyCheck.purpose" howKey="welcome.moneyCheck.how" goalKey="welcome.moneyCheck.goal" icon="💰" />

<div class="money-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto('/')} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('money.title')}</h1>
  </header>

  <div class="content" transition:fade>
    <div class="total-display">
      <button class="total-btn" onclick={speakTotal}>
        <span class="total-num">{total}</span>
        <span class="total-unit">{$t('money.kr')}</span>
      </button>
    </div>

    <div class="wallet">
      {#each wallet as item, i}
        <span class="wallet-item">{item.label}</span>
      {/each}
      {#if wallet.length === 0}
        <span class="wallet-empty">{$t('money.tap_to_add')}</span>
      {/if}
    </div>

    <div class="wallet-actions">
      <button class="action-btn" onclick={removeLast} disabled={wallet.length === 0}>⬅️ {$t('money.undo')}</button>
      <button class="action-btn" onclick={reset}>🔄 {$t('money.clear')}</button>
    </div>

    <h3>{$t('money.coins')}</h3>
    <div class="money-grid">
      {#each COINS as coin}
        <button class="money-btn coin" style="border-color: {coin.color}" onclick={() => addMoney(coin)}>
          {coin.emoji} {coin.label}
        </button>
      {/each}
    </div>

    <h3>{$t('money.bills')}</h3>
    <div class="money-grid">
      {#each BILLS as bill}
        <button class="money-btn bill" style="border-color: {bill.color}; color: {bill.color}" onclick={() => addMoney(bill)}>
          {bill.emoji} {bill.label}
        </button>
      {/each}
    </div>
  </div>

  <footer class="credit">{$t('money.credit')}</footer>
</div>

<style>
  .money-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .content { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }

  .total-display { margin: 8px 0; }
  .total-btn { display: flex; align-items: baseline; gap: 8px; background: none; border: none; }
  .total-num { font-size: 4em; font-weight: 900; color: #27AE60; font-variant-numeric: tabular-nums; }
  .total-unit { font-size: 1.5em; font-weight: 700; color: var(--text-muted); }

  .wallet { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; min-height: 40px; padding: 12px; background: var(--bg-card); border-radius: var(--radius); border: 1px solid var(--border); width: 100%; max-width: 400px; }
  .wallet-item { padding: 4px 10px; background: rgba(52,152,219,0.1); border-radius: 100px; font-weight: 600; font-size: 0.85em; }
  .wallet-empty { color: var(--text-muted); font-size: 0.9em; }
  .wallet-actions { display: flex; gap: 8px; }
  .action-btn { padding: 8px 16px; border: 1px solid var(--border); border-radius: 100px; font-weight: 600; background: var(--bg-card); font-size: 0.85em; min-height: 40px; }
  .action-btn:disabled { opacity: 0.3; }

  h3 { font-size: 0.9em; color: var(--text-muted); margin: 4px 0 0; align-self: flex-start; max-width: 400px; width: 100%; }
  .money-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .money-btn { padding: 14px 20px; border: 3px solid; border-radius: 16px; font-weight: 800; font-size: 1.1em; background: var(--bg-card); min-height: 48px; }
  .money-btn:hover { transform: scale(1.05); }
  .money-btn:active { transform: scale(0.95); }
  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
</style>
