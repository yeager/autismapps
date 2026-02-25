import { g as getContext, a as attr_class, s as store_get, b as stringify, c as attr, e as escape_html, u as unsubscribe_stores, d as derived } from "../../chunks/index2.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { r as reducedMotion, t as themeClass, a as textSizeClass, b as t } from "../../chunks/index3.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    const isHome = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname === "/");
    $$renderer2.push(`<div${attr_class(`app-shell ${stringify(store_get($$store_subs ??= {}, "$themeClass", themeClass))} ${stringify(store_get($$store_subs ??= {}, "$textSizeClass", textSizeClass))}`, "svelte-12qhfyh", {
      "reduced-motion": store_get($$store_subs ??= {}, "$reducedMotion", reducedMotion)
    })}>`);
    if (!isHome()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header class="app-header svelte-12qhfyh"><button class="back-btn svelte-12qhfyh"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg> <span>${escape_html(store_get($$store_subs ??= {}, "$t", t)("app.back"))}</span></button> <div class="header-spacer svelte-12qhfyh"></div> <button class="settings-btn svelte-12qhfyh"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.settings"))}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg></button></header>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <main${attr_class("app-main svelte-12qhfyh", void 0, { "has-header": !isHome() })}>`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
