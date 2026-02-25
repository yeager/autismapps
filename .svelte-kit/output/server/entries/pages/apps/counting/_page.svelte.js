import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, a as attr_class, h as attr_style, u as unsubscribe_stores, b as stringify } from "../../../../chunks/index2.js";
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
    let count = 0;
    let maxCount = 10;
    let items = [];
    $$renderer2.push(`<div class="counting-page svelte-19t44eb"><header class="app-header svelte-19t44eb"><button class="back-btn svelte-19t44eb"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-19t44eb">${escape_html(store_get($$store_subs ??= {}, "$t", t)("counting.title"))}</h1></header> <div class="content svelte-19t44eb"><div class="max-selector svelte-19t44eb"><!--[-->`);
    const each_array = ensure_array_like([5, 10, 20, 50]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let n = each_array[$$index];
      $$renderer2.push(`<button${attr_class("max-btn svelte-19t44eb", void 0, { "active": maxCount === n })}>${escape_html(n)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="count-display svelte-19t44eb"><button class="big-num svelte-19t44eb">${escape_html(count)}</button> <span class="count-of svelte-19t44eb">/ ${escape_html(maxCount)}</span></div> <div class="item-grid svelte-19t44eb"><!--[-->`);
    const each_array_1 = ensure_array_like(items);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let emoji = each_array_1[i];
      $$renderer2.push(`<span class="item svelte-19t44eb"${attr_style(`animation-delay: ${stringify(i * 50)}ms`)}>${escape_html(emoji)}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="controls svelte-19t44eb"><button class="ctrl minus svelte-19t44eb"${attr("disabled", count <= 0, true)}>−</button> <button class="ctrl reset svelte-19t44eb">🔄</button> <button class="ctrl plus svelte-19t44eb"${attr("disabled", count >= maxCount, true)}>+</button></div> <div class="progress-bar svelte-19t44eb"><div class="bar-fill svelte-19t44eb"${attr_style(`width: ${stringify(count / maxCount * 100)}%`)}></div></div></div> <footer class="credit svelte-19t44eb">${escape_html(store_get($$store_subs ??= {}, "$t", t)("counting.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
