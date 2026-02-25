import { c as attr, s as store_get, e as escape_html, a as attr_class, h as attr_style, u as unsubscribe_stores, b as stringify } from "../../../../chunks/index2.js";
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
    let tab = "timer";
    let secondsLeft = 0;
    let pomodoroCount = 0;
    let tasks = [];
    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }
    function progressPct() {
      return 0;
    }
    function currentTask() {
      const active = tasks.filter((t2) => !t2.done);
      return active.length > 0 ? active[0].text : store_get($$store_subs ??= {}, "$t", t)("focus.no_tasks");
    }
    function stateColor() {
      return "#3498DB";
    }
    $$renderer2.push(`<div class="focus-page svelte-h83m8v"><header class="app-header svelte-h83m8v"><button class="back-btn svelte-h83m8v"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-h83m8v">${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.title"))}</h1> <span class="pomo-badge svelte-h83m8v">🍅 ${escape_html(pomodoroCount)}</span></header> <nav class="tab-bar svelte-h83m8v"><button${attr_class("tab svelte-h83m8v", void 0, { "active": tab === "timer" })}>⏱️ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.timer"))}</button> <button${attr_class("tab svelte-h83m8v", void 0, { "active": tab === "tasks" })}>📋 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.tasks"))}</button> <button${attr_class("tab svelte-h83m8v", void 0, { "active": tab === "parked" })}>💭 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.parked"))}</button></nav> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="timer-page svelte-h83m8v"><div class="current-task svelte-h83m8v"><span class="task-label svelte-h83m8v">${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.working_on"))}:</span> <span class="task-name svelte-h83m8v">${escape_html(currentTask())}</span></div> <div class="timer-ring svelte-h83m8v"${attr_style(`--progress: ${stringify(progressPct())}; --color: ${stringify(stateColor())}`)}><div class="timer-inner svelte-h83m8v"><span class="timer-time svelte-h83m8v">${escape_html(formatTime(secondsLeft))}</span> <span class="timer-state svelte-h83m8v">`);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.ready"))}`);
      }
      $$renderer2.push(`<!--]--></span></div></div> <div class="timer-controls svelte-h83m8v">`);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="ctrl-btn work svelte-h83m8v">▶️ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.start_work"))}</button> <button class="ctrl-btn break-btn svelte-h83m8v">☕ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.start_break"))}</button>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-h83m8v">${escape_html(store_get($$store_subs ??= {}, "$t", t)("focus.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
