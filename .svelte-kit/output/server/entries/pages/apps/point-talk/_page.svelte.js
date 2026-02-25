import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, h as attr_style, b as stringify, a as attr_class, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    const CATEGORY_COLORS = {
      people: "#F1C40F",
      actions: "#27AE60",
      descriptions: "#3498DB",
      things: "#E67E22",
      places: "#9B59B6",
      feelings: "#E91E63",
      questions: "#1ABC9C",
      social: "#E74C3C"
    };
    const CATEGORIES = [
      "people",
      "actions",
      "descriptions",
      "things",
      "places",
      "feelings",
      "questions",
      "social"
    ];
    let sentence = [];
    let activeCategory = null;
    $$renderer2.push(`<div class="point-page svelte-1fi6i9t"><header class="app-header svelte-1fi6i9t"><button class="back-btn svelte-1fi6i9t"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1fi6i9t">${escape_html(store_get($$store_subs ??= {}, "$t", t)("point.title"))}</h1></header> <div class="sentence-strip svelte-1fi6i9t"><div class="strip-words svelte-1fi6i9t"><!--[-->`);
    const each_array = ensure_array_like(sentence);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let w = each_array[i];
      $$renderer2.push(`<div class="strip-word svelte-1fi6i9t"${attr_style(`border-color: ${stringify(w.color)}`)}>`);
      if (w.url) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", w.url)}${attr("alt", w.word)} width="36" height="36" class="svelte-1fi6i9t"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <span>${escape_html(w.word)}</span></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (sentence.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="strip-placeholder svelte-1fi6i9t">${escape_html(store_get($$store_subs ??= {}, "$t", t)("point.tap_words"))}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="strip-actions svelte-1fi6i9t"><button class="strip-btn svelte-1fi6i9t"${attr("disabled", sentence.length === 0, true)}>⌫</button> <button class="strip-btn speak svelte-1fi6i9t"${attr("disabled", sentence.length === 0, true)}>🔊</button> <button class="strip-btn svelte-1fi6i9t"${attr("disabled", sentence.length === 0, true)}>🗑️</button></div></div> <div class="cat-tabs svelte-1fi6i9t"><button${attr_class("cat-tab svelte-1fi6i9t", void 0, { "active": !activeCategory })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("app.all"))}</button> <!--[-->`);
    const each_array_1 = ensure_array_like(CATEGORIES);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class("cat-tab svelte-1fi6i9t", void 0, { "active": activeCategory === cat })}${attr_style(`--cc: ${stringify(CATEGORY_COLORS[cat])}`)}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("point.cat." + cat))}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1fi6i9t"><div class="spinner svelte-1fi6i9t"></div></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1fi6i9t">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-1fi6i9t">ARASAAC</a> — CC BY-NC-SA 3.0
    · Inspired by core vocabulary research (Cross et al., 2006; Banajee et al., 2003)</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
