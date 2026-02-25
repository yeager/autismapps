import { h as attr_style, c as attr, s as store_get, e as escape_html, f as ensure_array_like, b as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    const ACTIVITIES = [
      {
        id: "breathing",
        emoji: "🌬️",
        label: "calm.breathing",
        color: "#87CEEB"
      },
      {
        id: "pressure",
        emoji: "🫂",
        label: "calm.pressure",
        color: "#DDA0DD"
      },
      {
        id: "sounds",
        emoji: "🎵",
        label: "calm.sounds",
        color: "#98D8C8"
      },
      {
        id: "colors",
        emoji: "🌈",
        label: "calm.colors",
        color: "#FFD1DC"
      },
      {
        id: "grounding",
        emoji: "🌍",
        label: "calm.grounding_title",
        color: "#C3B1E1"
      },
      {
        id: "relaxation",
        emoji: "🧘",
        label: "calm.relaxation",
        color: "#FFDAB9"
      },
      {
        id: "stress",
        emoji: "📊",
        label: "calm.stress_check",
        color: "#B0C4DE"
      }
    ];
    $$renderer2.push(`<div class="calm-page svelte-lr4yb3"${attr_style("")}><header class="app-header svelte-lr4yb3"><button class="back-btn svelte-lr4yb3"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="svelte-lr4yb3"><path d="M15 18l-6-6 6-6" class="svelte-lr4yb3"></path></svg></button> <h1 class="svelte-lr4yb3">${escape_html(store_get($$store_subs ??= {}, "$t", t)("calm.title"))}</h1></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="activities-grid svelte-lr4yb3"><!--[-->`);
      const each_array = ensure_array_like(ACTIVITIES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let act = each_array[$$index];
        $$renderer2.push(`<button class="activity-card svelte-lr4yb3"${attr_style(`background: ${stringify(act.color)}20; border-color: ${stringify(act.color)}`)}><span class="act-emoji svelte-lr4yb3">${escape_html(act.emoji)}</span> <span class="act-label svelte-lr4yb3">${escape_html(store_get($$store_subs ??= {}, "$t", t)(act.label))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-lr4yb3">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-lr4yb3">ARASAAC</a> — CC BY-NC-SA 3.0</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
