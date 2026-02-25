import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    const TEMPLATES = [
      {
        name: "vs.template.morning",
        key: "morning",
        steps: [
          { emoji: "🌅", text: "vs.step.wake_up" },
          { emoji: "🚿", text: "vs.step.shower" },
          { emoji: "👕", text: "vs.step.get_dressed" },
          { emoji: "🍳", text: "vs.step.breakfast" },
          { emoji: "🦷", text: "vs.step.brush_teeth" },
          { emoji: "🎒", text: "vs.step.pack_bag" },
          { emoji: "👋", text: "vs.step.go" }
        ]
      },
      {
        name: "vs.template.evening",
        key: "evening",
        steps: [
          { emoji: "🏠", text: "vs.step.come_home" },
          { emoji: "🍽️", text: "vs.step.dinner" },
          { emoji: "🛁", text: "vs.step.bath" },
          { emoji: "🦷", text: "vs.step.brush_teeth" },
          { emoji: "📖", text: "vs.step.read" },
          { emoji: "🛏️", text: "vs.step.bed" }
        ]
      },
      {
        name: "vs.template.school",
        key: "school",
        steps: [
          { emoji: "🏫", text: "vs.step.arrive" },
          { emoji: "📚", text: "vs.step.lesson" },
          { emoji: "☕", text: "vs.step.break_time" },
          { emoji: "📚", text: "vs.step.lesson" },
          { emoji: "🍽️", text: "vs.step.lunch" },
          { emoji: "📚", text: "vs.step.lesson" },
          { emoji: "🏠", text: "vs.step.go_home" }
        ]
      }
    ];
    let schedules = [];
    $$renderer2.push(`<div class="vs-page svelte-1qrd85o"><header class="app-header svelte-1qrd85o"><button class="back-btn svelte-1qrd85o"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1qrd85o">${escape_html(store_get($$store_subs ??= {}, "$t", t)("vs.title"))}</h1> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="home-page svelte-1qrd85o">`);
      if (schedules.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2 class="section-title svelte-1qrd85o">${escape_html(store_get($$store_subs ??= {}, "$t", t)("vs.my_schedules"))}</h2> <div class="schedule-list svelte-1qrd85o"><!--[-->`);
        const each_array = ensure_array_like(schedules);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let s = each_array[$$index];
          $$renderer2.push(`<div class="schedule-card svelte-1qrd85o"><button class="schedule-btn svelte-1qrd85o"><span class="sched-name">${escape_html(s.name)}</span> <span class="sched-count svelte-1qrd85o">${escape_html(s.steps.length)} ${escape_html(store_get($$store_subs ??= {}, "$t", t)("vs.steps"))}</span></button> <button class="del-btn svelte-1qrd85o">✕</button></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <h2 class="section-title svelte-1qrd85o">${escape_html(store_get($$store_subs ??= {}, "$t", t)("vs.templates"))}</h2> <div class="template-grid svelte-1qrd85o"><!--[-->`);
      const each_array_1 = ensure_array_like(TEMPLATES);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let tpl = each_array_1[$$index_1];
        $$renderer2.push(`<button class="tpl-card svelte-1qrd85o"><span class="tpl-emoji svelte-1qrd85o">${escape_html(tpl.steps[0].emoji)}</span> <span class="tpl-name svelte-1qrd85o">${escape_html(store_get($$store_subs ??= {}, "$t", t)(tpl.name))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1qrd85o">${escape_html(store_get($$store_subs ??= {}, "$t", t)("vs.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
