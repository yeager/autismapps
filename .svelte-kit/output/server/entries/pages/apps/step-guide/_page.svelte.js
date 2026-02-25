import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    const GUIDES = [
      {
        name: "guide.wash_hands",
        key: "wash",
        steps: [
          { emoji: "🚰", text: "guide.step.turn_on_water" },
          { emoji: "🧴", text: "guide.step.soap" },
          { emoji: "🤲", text: "guide.step.rub_20" },
          { emoji: "💦", text: "guide.step.rinse" },
          { emoji: "🧻", text: "guide.step.dry" }
        ]
      },
      {
        name: "guide.brush_teeth",
        key: "teeth",
        steps: [
          { emoji: "🪥", text: "guide.step.wet_brush" },
          { emoji: "🦷", text: "guide.step.paste" },
          { emoji: "😁", text: "guide.step.front_teeth" },
          { emoji: "🦷", text: "guide.step.back_teeth" },
          { emoji: "👅", text: "guide.step.tongue" },
          { emoji: "💦", text: "guide.step.rinse_mouth" }
        ]
      },
      {
        name: "guide.get_dressed",
        key: "dressed",
        steps: [
          { emoji: "🩲", text: "guide.step.underwear" },
          { emoji: "🧦", text: "guide.step.socks" },
          { emoji: "👖", text: "guide.step.pants" },
          { emoji: "👕", text: "guide.step.shirt" },
          { emoji: "🧥", text: "guide.step.sweater" },
          { emoji: "👟", text: "guide.step.shoes" }
        ]
      },
      {
        name: "guide.pack_bag",
        key: "bag",
        steps: [
          { emoji: "📚", text: "guide.step.books" },
          { emoji: "✏️", text: "guide.step.pencil_case" },
          { emoji: "🍎", text: "guide.step.snack" },
          { emoji: "💧", text: "guide.step.water_bottle" },
          { emoji: "🎒", text: "guide.step.close_bag" }
        ]
      }
    ];
    $$renderer2.push(`<div class="guide-page svelte-1cy61bt"><header class="app-header svelte-1cy61bt"><button class="back-btn svelte-1cy61bt"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1cy61bt">${escape_html(store_get($$store_subs ??= {}, "$t", t)("guide.title"))}</h1></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="guide-list svelte-1cy61bt"><p class="instruction svelte-1cy61bt">${escape_html(store_get($$store_subs ??= {}, "$t", t)("guide.pick"))}</p> <div class="guide-grid svelte-1cy61bt"><!--[-->`);
      const each_array = ensure_array_like(GUIDES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let g = each_array[$$index];
        $$renderer2.push(`<button class="guide-card svelte-1cy61bt"><span class="guide-emoji svelte-1cy61bt">${escape_html(g.steps[0].emoji)}</span> <h3 class="svelte-1cy61bt">${escape_html(store_get($$store_subs ??= {}, "$t", t)(g.name))}</h3> <span class="step-count svelte-1cy61bt">${escape_html(g.steps.length)} ${escape_html(store_get($$store_subs ??= {}, "$t", t)("guide.steps"))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1cy61bt">${escape_html(store_get($$store_subs ??= {}, "$t", t)("guide.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
