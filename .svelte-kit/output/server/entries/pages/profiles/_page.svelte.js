import { e as escape_html, s as store_get, f as ensure_array_like, u as unsubscribe_stores } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { b as t } from "../../../chunks/index3.js";
import "../../../chunks/index4.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let profiles = [];
    $$renderer2.push(`<div class="profiles-page svelte-hmkf6r"><h1 class="svelte-hmkf6r">${escape_html(store_get($$store_subs ??= {}, "$t", t)("profile.choose"))}</h1> <p class="subtitle svelte-hmkf6r">${escape_html(store_get($$store_subs ??= {}, "$t", t)("profile.choose_desc"))}</p> <div class="profile-grid svelte-hmkf6r"><!--[-->`);
    const each_array = ensure_array_like(profiles);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      $$renderer2.push(`<button class="profile-card svelte-hmkf6r"><span class="profile-avatar svelte-hmkf6r">${escape_html(p.avatar)}</span> <span class="profile-name svelte-hmkf6r">${escape_html(p.name)}</span> `);
      if (p.pinHash) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="pin-icon svelte-hmkf6r">🔒</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--> <button class="profile-card new-card svelte-hmkf6r"><span class="profile-avatar svelte-hmkf6r">➕</span> <span class="profile-name svelte-hmkf6r">${escape_html(store_get($$store_subs ??= {}, "$t", t)("profile.new"))}</span></button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
