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
    let entries = [];
    $$renderer2.push(`<div class="diary-page svelte-4vhtx9"><header class="app-header svelte-4vhtx9"><button class="back-btn svelte-4vhtx9"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-4vhtx9">${escape_html(store_get($$store_subs ??= {}, "$t", t)("diary.title"))}</h1> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="add-btn svelte-4vhtx9">+ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("diary.new"))}</button>`);
    }
    $$renderer2.push(`<!--]--></header> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="entry-list svelte-4vhtx9"><!--[-->`);
      const each_array_1 = ensure_array_like(entries);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let entry = each_array_1[$$index_1];
        $$renderer2.push(`<div class="entry-card svelte-4vhtx9"><div class="entry-header svelte-4vhtx9"><span class="entry-emoji svelte-4vhtx9">${escape_html(entry.emoji)}</span> <span class="entry-mood svelte-4vhtx9">${escape_html(entry.mood)}</span> <span class="entry-date svelte-4vhtx9">${escape_html(entry.date)}</span> <button class="del-btn svelte-4vhtx9">✕</button></div> `);
        if (entry.text) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="entry-text svelte-4vhtx9">${escape_html(entry.text)}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (entries.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="empty svelte-4vhtx9">${escape_html(store_get($$store_subs ??= {}, "$t", t)("diary.empty"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-4vhtx9">${escape_html(store_get($$store_subs ??= {}, "$t", t)("diary.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
