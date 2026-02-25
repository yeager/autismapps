import { a as attr_class, c as attr, s as store_get, e as escape_html, f as ensure_array_like, u as unsubscribe_stores, d as derived, b as stringify } from "../../../../chunks/index2.js";
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
    let duration = 5;
    let remaining = 0;
    let stars = 0;
    let fullscreen = false;
    let firstThenMode = false;
    const PRESETS = [1, 2, 5, 10, 15, 30];
    const progress = derived(() => 1 - remaining / (duration * 60));
    const progressColor = derived(() => progress() < 0.5 ? "#27AE60" : progress() < 0.8 ? "#F1C40F" : "#E74C3C");
    const circumference = 2 * Math.PI * 140;
    const dashOffset = derived(() => circumference * (1 - progress()));
    $$renderer2.push(`<div${attr_class("timer-page svelte-lj4nnm", void 0, { "fullscreen": fullscreen })}><header class="app-header svelte-lj4nnm"><button class="back-btn svelte-lj4nnm"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-lj4nnm">${escape_html(store_get($$store_subs ??= {}, "$t", t)("timer.title"))}</h1> <div class="header-actions svelte-lj4nnm"><span class="star-count svelte-lj4nnm"${attr("aria-label", `${stringify(stars)} stars`)}>⭐ ${escape_html(stars)}</span> <button class="icon-btn svelte-lj4nnm">⛶</button></div></header> <div class="timer-body svelte-lj4nnm">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="timer-circle svelte-lj4nnm"><svg viewBox="0 0 300 300" class="timer-svg svelte-lj4nnm"><circle cx="150" cy="150" r="140" fill="none" stroke="var(--border)" stroke-width="12" opacity="0.3"></circle><circle cx="150" cy="150" r="140" fill="none"${attr("stroke", progressColor())} stroke-width="12" stroke-linecap="round"${attr("stroke-dasharray", circumference)}${attr("stroke-dashoffset", dashOffset())} transform="rotate(-90 150 150)" class="progress-ring svelte-lj4nnm"></circle></svg> <div class="timer-display svelte-lj4nnm">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="time-text svelte-lj4nnm">${escape_html(duration)}:00</span>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="presets svelte-lj4nnm"><!--[-->`);
      const each_array = ensure_array_like(PRESETS);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let p = each_array[$$index];
        $$renderer2.push(`<button${attr_class("preset-btn svelte-lj4nnm", void 0, { "active": duration === p })}>${escape_html(p)} ${escape_html(store_get($$store_subs ??= {}, "$t", t)("timer.min"))}</button>`);
      }
      $$renderer2.push(`<!--]--></div> <label class="ft-toggle svelte-lj4nnm"><input type="checkbox"${attr("checked", firstThenMode, true)} class="svelte-lj4nnm"/> <span>${escape_html(store_get($$store_subs ??= {}, "$t", t)("timer.first_then"))}</span></label> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button class="start-btn svelte-lj4nnm">${escape_html(store_get($$store_subs ??= {}, "$t", t)("timer.start"))}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <footer class="credit svelte-lj4nnm">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-lj4nnm">ARASAAC</a> — CC BY-NC-SA 3.0</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
