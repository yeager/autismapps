import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, a as attr_class, h as attr_style, b as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { b as t } from "../../../../chunks/index3.js";
import "../../../../chunks/index4.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const LEVELS = [
      {
        level: 1,
        emoji: "😴",
        color: "#3498DB",
        label: "energy.level.1",
        strategies: "energy.strat.1"
      },
      {
        level: 2,
        emoji: "😊",
        color: "#2ECC71",
        label: "energy.level.2",
        strategies: "energy.strat.2"
      },
      {
        level: 3,
        emoji: "😄",
        color: "#F1C40F",
        label: "energy.level.3",
        strategies: "energy.strat.3"
      },
      {
        level: 4,
        emoji: "😤",
        color: "#E67E22",
        label: "energy.level.4",
        strategies: "energy.strat.4"
      },
      {
        level: 5,
        emoji: "🤯",
        color: "#E74C3C",
        label: "energy.level.5",
        strategies: "energy.strat.5"
      }
    ];
    let currentLevel = null;
    let history = [];
    function getLevelInfo(lvl) {
      return LEVELS[lvl - 1] || LEVELS[2];
    }
    $$renderer2.push(`<div class="energy-page svelte-v8t122"><header class="app-header svelte-v8t122"><button class="back-btn svelte-v8t122"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-v8t122">${escape_html(store_get($$store_subs ??= {}, "$t", t)("energy.title"))}</h1></header> <div class="content svelte-v8t122"><p class="instruction svelte-v8t122">${escape_html(store_get($$store_subs ??= {}, "$t", t)("energy.how_feeling"))}</p> <div class="meter-area svelte-v8t122"><div class="thermometer svelte-v8t122"><div class="thermo-track svelte-v8t122"><!--[-->`);
    const each_array = ensure_array_like(LEVELS.slice().reverse());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let info = each_array[$$index];
      $$renderer2.push(`<button${attr_class("thermo-level svelte-v8t122", void 0, { "active": currentLevel === info.level })}${attr_style(`--lvl-color: ${stringify(info.color)}`)}><span class="lvl-emoji svelte-v8t122">${escape_html(info.emoji)}</span> <span class="lvl-num svelte-v8t122">${escape_html(info.level)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (history.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="history svelte-v8t122"><h3 class="svelte-v8t122">${escape_html(store_get($$store_subs ??= {}, "$t", t)("energy.today"))}</h3> <div class="history-row svelte-v8t122"><!--[-->`);
      const each_array_1 = ensure_array_like(history);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let entry = each_array_1[$$index_1];
        const info = getLevelInfo(entry.level);
        $$renderer2.push(`<div class="history-dot svelte-v8t122"${attr_style(`background: ${stringify(info.color)}`)}${attr("title", `${stringify(entry.time)}: ${stringify(entry.level)}`)}><span class="dot-emoji svelte-v8t122">${escape_html(info.emoji)}</span> <span class="dot-time svelte-v8t122">${escape_html(entry.time)}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <footer class="credit svelte-v8t122">${escape_html(store_get($$store_subs ??= {}, "$t", t)("energy.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
