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
    const RECIPES = [
      {
        name: "cook.sandwich",
        icon: "🥪",
        steps: [
          { emoji: "🍞", text: "cook.step.bread" },
          { emoji: "🧈", text: "cook.step.butter" },
          { emoji: "🧀", text: "cook.step.cheese" },
          { emoji: "🥒", text: "cook.step.veggies" },
          { emoji: "🍞", text: "cook.step.top_bread" },
          { emoji: "🔪", text: "cook.step.cut_half" }
        ]
      },
      {
        name: "cook.smoothie",
        icon: "🥤",
        steps: [
          { emoji: "🍌", text: "cook.step.banana" },
          { emoji: "🍓", text: "cook.step.berries" },
          { emoji: "🥛", text: "cook.step.milk" },
          { emoji: "🔌", text: "cook.step.blend" },
          { emoji: "🥤", text: "cook.step.pour_glass" }
        ]
      },
      {
        name: "cook.pasta",
        icon: "🍝",
        steps: [
          { emoji: "🫗", text: "cook.step.boil_water" },
          { emoji: "🍝", text: "cook.step.add_pasta" },
          { emoji: "⏱️", text: "cook.step.wait_10" },
          { emoji: "🥄", text: "cook.step.drain" },
          { emoji: "🧈", text: "cook.step.add_sauce" },
          { emoji: "🧀", text: "cook.step.sprinkle_cheese" }
        ]
      },
      {
        name: "cook.oatmeal",
        icon: "🥣",
        steps: [
          { emoji: "🥣", text: "cook.step.oats_bowl" },
          { emoji: "🥛", text: "cook.step.add_milk_oats" },
          { emoji: "📺", text: "cook.step.microwave_2" },
          { emoji: "🍯", text: "cook.step.add_honey" },
          { emoji: "🍎", text: "cook.step.add_fruit" }
        ]
      }
    ];
    $$renderer2.push(`<div class="cook-page svelte-1ruwn59"><header class="app-header svelte-1ruwn59"><button class="back-btn svelte-1ruwn59"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1ruwn59">${escape_html(store_get($$store_subs ??= {}, "$t", t)("cook.title"))}</h1></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="recipe-list svelte-1ruwn59"><p class="instruction svelte-1ruwn59">${escape_html(store_get($$store_subs ??= {}, "$t", t)("cook.pick"))}</p> <div class="recipe-grid svelte-1ruwn59"><!--[-->`);
      const each_array = ensure_array_like(RECIPES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let r = each_array[$$index];
        $$renderer2.push(`<button class="recipe-card svelte-1ruwn59"><span class="recipe-icon svelte-1ruwn59">${escape_html(r.icon)}</span> <h3 class="svelte-1ruwn59">${escape_html(store_get($$store_subs ??= {}, "$t", t)(r.name))}</h3></button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1ruwn59">${escape_html(store_get($$store_subs ??= {}, "$t", t)("cook.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
