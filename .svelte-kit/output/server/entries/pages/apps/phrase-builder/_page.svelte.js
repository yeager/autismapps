import { c as attr, s as store_get, e as escape_html, h as attr_style, f as ensure_array_like, u as unsubscribe_stores, d as derived, b as stringify } from "../../../../chunks/index2.js";
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
    const COLORS = {
      subject: "#F1C40F",
      verb: "#27AE60",
      object: "#E67E22"
    };
    let selectedSubject = null;
    let selectedVerb = null;
    let selectedObject = null;
    let favorites = [];
    const sentence = derived(() => [
      selectedSubject?.word,
      selectedVerb?.word,
      selectedObject?.word
    ].filter(Boolean).join(" "));
    $$renderer2.push(`<div class="phrase-page svelte-1ibp91p"><header class="app-header svelte-1ibp91p"><button class="back-btn svelte-1ibp91p"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1ibp91p">${escape_html(store_get($$store_subs ??= {}, "$t", t)("phrase.title"))}</h1></header> <div class="sentence-preview svelte-1ibp91p"><div class="preview-slots svelte-1ibp91p"><div class="slot svelte-1ibp91p"${attr_style(`border-color: ${stringify(COLORS.subject)}`)}>`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="slot-hint svelte-1ibp91p">${escape_html(store_get($$store_subs ??= {}, "$t", t)("phrase.who"))}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="slot svelte-1ibp91p"${attr_style(`border-color: ${stringify(COLORS.verb)}`)}>`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="slot-hint svelte-1ibp91p">${escape_html(store_get($$store_subs ??= {}, "$t", t)("phrase.does"))}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="slot svelte-1ibp91p"${attr_style(`border-color: ${stringify(COLORS.object)}`)}>`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="slot-hint svelte-1ibp91p">${escape_html(store_get($$store_subs ??= {}, "$t", t)("phrase.what"))}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="preview-actions svelte-1ibp91p"><button class="act-btn speak svelte-1ibp91p"${attr("disabled", !sentence(), true)}>🔊</button> <button class="act-btn svelte-1ibp91p"${attr("disabled", !sentence(), true)}>⭐</button> <button class="act-btn svelte-1ibp91p">🗑️</button></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1ibp91p"><div class="spinner svelte-1ibp91p"></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (favorites.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="favorites svelte-1ibp91p"><h3 class="svelte-1ibp91p">⭐ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("phrase.favorites"))}</h3> <div class="fav-list svelte-1ibp91p"><!--[-->`);
      const each_array_3 = ensure_array_like(favorites);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let fav = each_array_3[$$index_3];
        $$renderer2.push(`<button class="fav-chip svelte-1ibp91p">${escape_html(fav)}</button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1ibp91p">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-1ibp91p">ARASAAC</a> — CC BY-NC-SA 3.0
    · Uses <a href="https://en.wikipedia.org/wiki/Fitzgerald_Key" target="_blank" rel="noopener" class="svelte-1ibp91p">Fitzgerald Key</a> color coding</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
