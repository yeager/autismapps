import { c as attr, s as store_get, e as escape_html, a as attr_class, f as ensure_array_like, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    let mode = "learn";
    let hours = 12;
    let minutes = 0;
    function timeText(h, m) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      return `${hh}:${mm}`;
    }
    function hourAngle(h, m) {
      return (h % 12 + m / 60) * 30;
    }
    function minuteAngle(m) {
      return m * 6;
    }
    $$renderer2.push(`<div class="clock-page svelte-t8qc5b"><header class="app-header svelte-t8qc5b"><button class="back-btn svelte-t8qc5b"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-t8qc5b">${escape_html(store_get($$store_subs ??= {}, "$t", t)("clock.title"))}</h1> <div class="mode-toggle svelte-t8qc5b"><button${attr_class("tab svelte-t8qc5b", void 0, { "active": mode === "learn" })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("clock.learn"))}</button> <button${attr_class("tab svelte-t8qc5b", void 0, { "active": mode === "quiz" })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("clock.quiz"))}</button></div></header> <div class="content svelte-t8qc5b"><svg class="clock-face svelte-t8qc5b" viewBox="0 0 200 200" width="240" height="240"><circle cx="100" cy="100" r="95" fill="var(--bg-card)" stroke="var(--border)" stroke-width="3"></circle><!--[-->`);
    const each_array = ensure_array_like(Array(12));
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      const angle = (i + 1) * 30 * Math.PI / 180;
      $$renderer2.push(`<text${attr("x", 100 + 78 * Math.sin(angle))}${attr("y", 100 - 78 * Math.cos(angle) + 6)} text-anchor="middle" font-size="16" font-weight="700" fill="currentColor">${escape_html(i + 1)}</text>`);
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array_1 = ensure_array_like(Array(60));
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      each_array_1[i];
      const angle = i * 6 * Math.PI / 180;
      const len = i % 5 === 0 ? 8 : 4;
      $$renderer2.push(`<line${attr("x1", 100 + (90 - len) * Math.sin(angle))}${attr("y1", 100 - (90 - len) * Math.cos(angle))}${attr("x2", 100 + 90 * Math.sin(angle))}${attr("y2", 100 - 90 * Math.cos(angle))} stroke="var(--text-muted)"${attr("stroke-width", i % 5 === 0 ? 2 : 1)}></line>`);
    }
    $$renderer2.push(`<!--]--><line x1="100" y1="100"${attr("x2", 100 + 50 * Math.sin(hourAngle(hours, minutes) * Math.PI / 180))}${attr("y2", 100 - 50 * Math.cos(hourAngle(hours, minutes) * Math.PI / 180))} stroke="#E74C3C" stroke-width="5" stroke-linecap="round"></line><line x1="100" y1="100"${attr("x2", 100 + 70 * Math.sin(minuteAngle(minutes) * Math.PI / 180))}${attr("y2", 100 - 70 * Math.cos(minuteAngle(minutes) * Math.PI / 180))} stroke="#3498DB" stroke-width="3" stroke-linecap="round"></line><circle cx="100" cy="100" r="5" fill="#333"></circle></svg> <div class="time-display svelte-t8qc5b"><span class="time-text svelte-t8qc5b">${escape_html(timeText(hours, minutes))}</span> <button class="speak-btn svelte-t8qc5b">🔊</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="controls svelte-t8qc5b"><div class="ctrl-group svelte-t8qc5b"><span class="ctrl-label svelte-t8qc5b" style="color: #E74C3C">${escape_html(store_get($$store_subs ??= {}, "$t", t)("clock.hours"))}</span> <button class="adj-btn svelte-t8qc5b">−</button> <button class="adj-btn svelte-t8qc5b">+</button></div> <div class="ctrl-group svelte-t8qc5b"><span class="ctrl-label svelte-t8qc5b" style="color: #3498DB">${escape_html(store_get($$store_subs ??= {}, "$t", t)("clock.minutes"))}</span> <button class="adj-btn svelte-t8qc5b">−5</button> <button class="adj-btn svelte-t8qc5b">+5</button></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <footer class="credit svelte-t8qc5b">${escape_html(store_get($$store_subs ??= {}, "$t", t)("clock.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
