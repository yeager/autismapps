import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, b as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    let choices = [
      { id: "1", text: "", emoji: "🟢" },
      { id: "2", text: "", emoji: "🔵" }
    ];
    $$renderer2.push(`<div class="chooser-page svelte-4gj4j"><header class="app-header svelte-4gj4j"><button class="back-btn svelte-4gj4j"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-4gj4j">${escape_html(store_get($$store_subs ??= {}, "$t", t)("chooser.title"))}</h1></header> <div class="content svelte-4gj4j"><p class="instruction svelte-4gj4j">${escape_html(store_get($$store_subs ??= {}, "$t", t)("chooser.instruction"))}</p> <div class="choices-list svelte-4gj4j"><!--[-->`);
    const each_array = ensure_array_like(choices);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let choice = each_array[i];
      $$renderer2.push(`<div class="choice-row svelte-4gj4j"><span class="choice-emoji svelte-4gj4j">${escape_html(choice.emoji)}</span> <input type="text" class="choice-input svelte-4gj4j"${attr("placeholder", `${stringify(store_get($$store_subs ??= {}, "$t", t)("chooser.option"))} ${stringify(i + 1)}`)}${attr("value", choice.text)}/> `);
      if (choices.length > 2) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="del-btn svelte-4gj4j">✕</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <button class="add-choice svelte-4gj4j">+ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("chooser.add_option"))}</button> <div class="action-area svelte-4gj4j"><button class="choose-btn svelte-4gj4j"${attr("disabled", choices.filter((c) => c.text.trim()).length < 2, true)}>🎲 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("chooser.choose"))}</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <footer class="credit svelte-4gj4j">${escape_html(store_get($$store_subs ??= {}, "$t", t)("chooser.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
