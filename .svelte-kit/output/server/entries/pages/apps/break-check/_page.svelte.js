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
    const EXERCISES = [
      {
        id: "breathing",
        name: "break.ex.breathing",
        icon: "🌬️",
        steps: [
          { text: "break.step.breathe_in", duration: 4 },
          { text: "break.step.hold", duration: 4 },
          { text: "break.step.breathe_out", duration: 6 },
          { text: "break.step.breathe_in", duration: 4 },
          { text: "break.step.hold", duration: 4 },
          { text: "break.step.breathe_out", duration: 6 },
          { text: "break.step.breathe_in", duration: 4 },
          { text: "break.step.hold", duration: 4 },
          { text: "break.step.breathe_out", duration: 6 }
        ]
      },
      {
        id: "body-scan",
        name: "break.ex.body_scan",
        icon: "🧘",
        steps: [
          { text: "break.step.close_eyes", duration: 3 },
          { text: "break.step.feel_feet", duration: 5 },
          { text: "break.step.feel_legs", duration: 5 },
          { text: "break.step.feel_stomach", duration: 5 },
          { text: "break.step.feel_hands", duration: 5 },
          { text: "break.step.feel_shoulders", duration: 5 },
          { text: "break.step.feel_head", duration: 5 },
          { text: "break.step.open_eyes", duration: 3 }
        ]
      },
      {
        id: "counting",
        name: "break.ex.counting",
        icon: "🔢",
        steps: [
          { text: "break.step.look_5_see", duration: 10 },
          { text: "break.step.touch_4", duration: 8 },
          { text: "break.step.hear_3", duration: 8 },
          { text: "break.step.smell_2", duration: 6 },
          { text: "break.step.taste_1", duration: 5 }
        ]
      },
      {
        id: "stretching",
        name: "break.ex.stretching",
        icon: "🤸",
        steps: [
          { text: "break.step.reach_up", duration: 5 },
          { text: "break.step.touch_toes", duration: 5 },
          { text: "break.step.twist_left", duration: 5 },
          { text: "break.step.twist_right", duration: 5 },
          { text: "break.step.shoulder_rolls", duration: 5 },
          { text: "break.step.neck_circles", duration: 5 },
          { text: "break.step.shake_out", duration: 4 }
        ]
      },
      {
        id: "grounding",
        name: "break.ex.grounding",
        icon: "🌳",
        steps: [
          { text: "break.step.feet_on_floor", duration: 5 },
          { text: "break.step.press_hands", duration: 5 },
          { text: "break.step.name_room", duration: 8 },
          { text: "break.step.deep_breath", duration: 6 },
          { text: "break.step.say_safe", duration: 4 }
        ]
      }
    ];
    $$renderer2.push(`<div class="break-page svelte-1jbgrqy"><header class="app-header svelte-1jbgrqy"><button class="back-btn svelte-1jbgrqy"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1jbgrqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)("break.title"))}</h1></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="menu-page svelte-1jbgrqy"><p class="instruction svelte-1jbgrqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)("break.pick"))}</p> <div class="ex-grid svelte-1jbgrqy"><!--[-->`);
      const each_array = ensure_array_like(EXERCISES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let ex = each_array[$$index];
        $$renderer2.push(`<button class="ex-card svelte-1jbgrqy"><span class="ex-icon svelte-1jbgrqy">${escape_html(ex.icon)}</span> <h3 class="svelte-1jbgrqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)(ex.name))}</h3></button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1jbgrqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)("break.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
