import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, a as attr_class, u as unsubscribe_stores, d as derived } from "../../../../chunks/index2.js";
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
    const TASKS = [
      {
        id: "brush-teeth",
        icon: "🪥",
        steps: ["💧", "🪥", "⏱️", "🚰"],
        times: ["morning", "evening"]
      },
      {
        id: "get-dressed",
        icon: "👕",
        steps: ["👖", "👕", "🧦", "👟"],
        times: ["morning"]
      },
      {
        id: "wash-hands",
        icon: "🧼",
        steps: ["💧", "🧼", "👐", "🧻"],
        times: ["morning", "afternoon", "evening"]
      },
      {
        id: "pack-bag",
        icon: "🎒",
        steps: ["📚", "✏️", "🥪", "🎒"],
        times: ["morning"]
      },
      {
        id: "set-table",
        icon: "🍽️",
        steps: ["🍽️", "🥄", "🥛", "🧻"],
        times: ["morning", "afternoon", "evening"]
      },
      {
        id: "tidy-up",
        icon: "🧹",
        steps: ["📦", "🧹", "🧽", "✅"],
        times: ["afternoon", "evening"]
      },
      {
        id: "bedtime",
        icon: "🛏️",
        steps: ["🪥", "👕", "📖", "💤"],
        times: ["evening"]
      },
      {
        id: "homework",
        icon: "📝",
        steps: ["📚", "✏️", "⏱️", "✅"],
        times: ["afternoon"]
      }
    ];
    let completedToday = {};
    let completedCount = derived(() => Object.values(completedToday).filter(Boolean).length);
    let totalTasks = derived(() => TASKS.length);
    function getTimeIcon(t2) {
      if (t2 === "morning") return "🌅";
      if (t2 === "afternoon") return "☀️";
      return "🌙";
    }
    $$renderer2.push(`<div class="app-container svelte-1hg8j8m"><header class="sticky-header svelte-1hg8j8m"><button class="back-btn svelte-1hg8j8m"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("common.back"))}>←</button> <h1 class="svelte-1hg8j8m">📋 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("practiceBoard.title"))}</h1> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="counter svelte-1hg8j8m">${escape_html(completedCount())}/${escape_html(totalTasks())}</span>`);
    }
    $$renderer2.push(`<!--]--></header> <main class="content svelte-1hg8j8m">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="intro svelte-1hg8j8m">${escape_html(store_get($$store_subs ??= {}, "$t", t)("practiceBoard.intro"))}</p> <div class="task-grid svelte-1hg8j8m"><!--[-->`);
      const each_array = ensure_array_like(TASKS);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let task = each_array[$$index_1];
        $$renderer2.push(`<button${attr_class("task-card svelte-1hg8j8m", void 0, { "completed": completedToday[task.id] })}><span class="task-icon svelte-1hg8j8m">${escape_html(task.icon)}</span> <span class="task-name svelte-1hg8j8m">${escape_html(store_get($$store_subs ??= {}, "$t", t)(`practiceBoard.task.${task.id}`))}</span> <div class="task-times svelte-1hg8j8m"><!--[-->`);
        const each_array_1 = ensure_array_like(task.times);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let time = each_array_1[$$index];
          $$renderer2.push(`<span class="time-badge svelte-1hg8j8m"${attr("title", store_get($$store_subs ??= {}, "$t", t)(`practiceBoard.time.${time}`))}>${escape_html(getTimeIcon(time))}</span>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (completedToday[task.id]) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="done-badge svelte-1hg8j8m">✅</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></main> <footer class="credit svelte-1hg8j8m"><p class="svelte-1hg8j8m">Autismappar · CC BY-NC-SA 4.0</p></footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
