import { e as escape_html, s as store_get, c as attr, f as ensure_array_like, h as attr_style, b as stringify, a as attr_class, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import { b as t } from "../../../../chunks/index3.js";
import "../../../../chunks/index4.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let scheduleName = "";
    let items = [];
    let nowIndex = -1;
    let dragOverItem = null;
    let justCompleted = /* @__PURE__ */ new Set();
    let timerMinutes = 5;
    let timerSeconds = 0;
    const SECTIONS = [
      { key: "morning", emoji: "🌅" },
      { key: "afternoon", emoji: "☀️" },
      { key: "evening", emoji: "🌙" }
    ];
    function getSectionItems(section) {
      return items.filter((it) => it.section === section);
    }
    $$renderer2.push(`<div class="schedule-app svelte-1j0fvg2"><div class="schedule-toolbar no-print svelte-1j0fvg2"><h2 class="svelte-1j0fvg2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("schedule.title"))}</h2> <div class="toolbar-row svelte-1j0fvg2"><input type="text"${attr("value", scheduleName)}${attr("placeholder", store_get($$store_subs ??= {}, "$t", t)("schedule.today"))} class="name-input svelte-1j0fvg2"/> <button class="btn primary svelte-1j0fvg2">💾 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.save"))}</button> <button class="btn svelte-1j0fvg2">🖨️ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("schedule.print"))}</button> <button class="btn svelte-1j0fvg2">📂 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("schedule.my_schedules"))}</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="timer-section svelte-1j0fvg2"><span class="timer-label svelte-1j0fvg2">⏱️</span> <span class="timer-display svelte-1j0fvg2">${escape_html(String(timerMinutes).padStart(2, "0"))}:${escape_html(String(timerSeconds).padStart(2, "0"))}</span> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="btn timer-btn svelte-1j0fvg2">−</button> <button class="btn timer-btn svelte-1j0fvg2">+</button> <button class="btn primary svelte-1j0fvg2">▶</button>`);
    }
    $$renderer2.push(`<!--]--> <button class="btn svelte-1j0fvg2">↻</button></div></div> <div class="schedule-sections svelte-1j0fvg2"><!--[-->`);
    const each_array_2 = ensure_array_like(SECTIONS);
    for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
      let sec = each_array_2[$$index_3];
      const sectionItems = getSectionItems(sec.key);
      $$renderer2.push(`<div class="section svelte-1j0fvg2"${attr_style(`--section-color: ${stringify(sec.key === "morning" ? "#F59E0B" : sec.key === "afternoon" ? "#3B82F6" : "#8B5CF6")}`)}><div class="section-header svelte-1j0fvg2"><span class="section-emoji svelte-1j0fvg2">${escape_html(sec.emoji)}</span> <h3 class="svelte-1j0fvg2">${escape_html(store_get($$store_subs ??= {}, "$t", t)(`schedule.${sec.key}`))}</h3> <button class="add-btn no-print svelte-1j0fvg2">+ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("schedule.add_activity"))}</button></div> <div class="items-list svelte-1j0fvg2">`);
      const each_array_3 = ensure_array_like(sectionItems);
      if (each_array_3.length !== 0) {
        $$renderer2.push("<!--[-->");
        for (let i = 0, $$length2 = each_array_3.length; i < $$length2; i++) {
          let item = each_array_3[i];
          const globalIdx = items.indexOf(item);
          $$renderer2.push(`<div${attr_class("schedule-item svelte-1j0fvg2", void 0, {
            "completed": item.completed,
            "is-now": globalIdx === nowIndex,
            "drag-over": dragOverItem === item,
            "just-completed": justCompleted.has(globalIdx)
          })} draggable="true" role="listitem">`);
          if (globalIdx === nowIndex) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="now-badge svelte-1j0fvg2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("schedule.now"))}</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <span class="drag-handle no-print svelte-1j0fvg2" aria-hidden="true">⠿</span> <button class="check-btn svelte-1j0fvg2"${attr("aria-label", item.completed ? store_get($$store_subs ??= {}, "$t", t)("schedule.done") : "Mark done")}>`);
          if (item.completed) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="svelte-1j0fvg2"><path d="M20 6L9 17l-5-5" class="svelte-1j0fvg2"></path></svg>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--border)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1j0fvg2"><circle cx="12" cy="12" r="10" class="svelte-1j0fvg2"></circle></svg>`);
          }
          $$renderer2.push(`<!--]--></button> `);
          if (item.pictogramUrl) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr("src", item.pictogramUrl)}${attr("alt", item.label)} width="56" height="56" class="item-picto svelte-1j0fvg2"/>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <span class="item-label svelte-1j0fvg2" role="button" tabindex="0">${escape_html(item.label)}</span> `);
          if (item.time) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="item-time svelte-1j0fvg2">${escape_html(item.time)}</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="item-actions no-print svelte-1j0fvg2"><button class="icon-btn svelte-1j0fvg2" aria-label="Speak">🔊</button> <button class="icon-btn svelte-1j0fvg2" aria-label="Set as now">📍</button> <button class="icon-btn danger svelte-1j0fvg2" aria-label="Remove">✕</button></div></div>`);
        }
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p class="empty-section svelte-1j0fvg2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("schedule.add_activity"))}</p>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
