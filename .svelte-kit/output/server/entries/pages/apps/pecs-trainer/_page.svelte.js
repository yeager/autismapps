import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, a as attr_class, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    let phase = 1;
    let phaseProgress = {};
    const PHASE_INFO = {
      1: { label: "pecs.phase1", desc: "pecs.phase1_desc" },
      2: { label: "pecs.phase2", desc: "pecs.phase2_desc" },
      3: { label: "pecs.phase3", desc: "pecs.phase3_desc" },
      4: { label: "pecs.phase4", desc: "pecs.phase4_desc" },
      5: { label: "pecs.phase5", desc: "pecs.phase5_desc" },
      6: { label: "pecs.phase6", desc: "pecs.phase6_desc" }
    };
    $$renderer2.push(`<div class="pecs-page svelte-1xe9j7b"><header class="app-header svelte-1xe9j7b"><button class="back-btn svelte-1xe9j7b"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="svelte-1xe9j7b"><path d="M15 18l-6-6 6-6" class="svelte-1xe9j7b"></path></svg></button> <h1 class="svelte-1xe9j7b">${escape_html(store_get($$store_subs ??= {}, "$t", t)("pecs.title"))} — ${escape_html(store_get($$store_subs ??= {}, "$t", t)(PHASE_INFO[phase].label))}</h1></header> <div class="phase-bar svelte-1xe9j7b"><!--[-->`);
    const each_array = ensure_array_like([1, 2, 3, 4, 5, 6]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      $$renderer2.push(`<button${attr_class("phase-btn svelte-1xe9j7b", void 0, {
        "active": phase === p,
        "completed": phaseProgress[p]?.successes >= 5
      })}><span class="phase-num svelte-1xe9j7b">${escape_html(p)}</span> `);
      if (phaseProgress[p]?.successes >= 5) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="phase-check svelte-1xe9j7b">✓</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div> <p class="phase-desc svelte-1xe9j7b">${escape_html(store_get($$store_subs ??= {}, "$t", t)(PHASE_INFO[phase].desc))}</p> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1xe9j7b"><div class="spinner svelte-1xe9j7b"></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1xe9j7b">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-1xe9j7b">ARASAAC</a> — CC BY-NC-SA 3.0
    · Based on PECS® methodology by Frost &amp; Bondy (1994). PECS® is a trademark of Pyramid Educational Consultants.</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
