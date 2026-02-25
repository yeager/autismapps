import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, h as attr_style, b as stringify, u as unsubscribe_stores, d as derived } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { b as t } from "../../../../chunks/index3.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const COINS = [
      { value: 1, label: "1 kr", emoji: "🪙", color: "#C0C0C0" },
      { value: 2, label: "2 kr", emoji: "🪙", color: "#C0C0C0" },
      { value: 5, label: "5 kr", emoji: "🪙", color: "#C0C0C0" },
      { value: 10, label: "10 kr", emoji: "🪙", color: "#FFD700" }
    ];
    const BILLS = [
      { value: 20, label: "20 kr", emoji: "💵", color: "#9B59B6" },
      { value: 50, label: "50 kr", emoji: "💵", color: "#E67E22" },
      { value: 100, label: "100 kr", emoji: "💵", color: "#3498DB" },
      { value: 200, label: "200 kr", emoji: "💵", color: "#27AE60" },
      { value: 500, label: "500 kr", emoji: "💵", color: "#E74C3C" }
    ];
    let wallet = [];
    let total = derived(() => wallet.reduce((sum, c) => sum + c.value, 0));
    $$renderer2.push(`<div class="money-page svelte-ob7adz"><header class="app-header svelte-ob7adz"><button class="back-btn svelte-ob7adz"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-ob7adz">${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.title"))}</h1></header> <div class="content svelte-ob7adz"><div class="total-display svelte-ob7adz"><button class="total-btn svelte-ob7adz"><span class="total-num svelte-ob7adz">${escape_html(total())}</span> <span class="total-unit svelte-ob7adz">${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.kr"))}</span></button></div> <div class="wallet svelte-ob7adz"><!--[-->`);
    const each_array = ensure_array_like(wallet);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let item = each_array[i];
      $$renderer2.push(`<span class="wallet-item svelte-ob7adz">${escape_html(item.label)}</span>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (wallet.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="wallet-empty svelte-ob7adz">${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.tap_to_add"))}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="wallet-actions svelte-ob7adz"><button class="action-btn svelte-ob7adz"${attr("disabled", wallet.length === 0, true)}>⬅️ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.undo"))}</button> <button class="action-btn svelte-ob7adz">🔄 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.clear"))}</button></div> <h3 class="svelte-ob7adz">${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.coins"))}</h3> <div class="money-grid svelte-ob7adz"><!--[-->`);
    const each_array_1 = ensure_array_like(COINS);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let coin = each_array_1[$$index_1];
      $$renderer2.push(`<button class="money-btn coin svelte-ob7adz"${attr_style(`border-color: ${stringify(coin.color)}`)}>${escape_html(coin.emoji)} ${escape_html(coin.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <h3 class="svelte-ob7adz">${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.bills"))}</h3> <div class="money-grid svelte-ob7adz"><!--[-->`);
    const each_array_2 = ensure_array_like(BILLS);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let bill = each_array_2[$$index_2];
      $$renderer2.push(`<button class="money-btn bill svelte-ob7adz"${attr_style(`border-color: ${stringify(bill.color)}; color: ${stringify(bill.color)}`)}>${escape_html(bill.emoji)} ${escape_html(bill.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <footer class="credit svelte-ob7adz">${escape_html(store_get($$store_subs ??= {}, "$t", t)("money.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
