import { c as attr, s as store_get, e as escape_html, a as attr_class, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    let stars = 0;
    let streak = 0;
    let level = 1;
    let lettersLearned = [];
    let speechRate = 0.4;
    $$renderer2.push(`<div class="letter-page svelte-q68f7n"><header class="app-header svelte-q68f7n"><button class="back-btn svelte-q68f7n"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="svelte-q68f7n"><path d="M15 18l-6-6 6-6" class="svelte-q68f7n"></path></svg></button> <h1 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.title"))}</h1> <div class="stats-bar svelte-q68f7n"><span class="stat svelte-q68f7n">⭐ ${escape_html(stars)}</span> <span class="stat fire svelte-q68f7n">🔥 ${escape_html(streak)}</span></div></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="menu-page svelte-q68f7n"><div class="menu-hero svelte-q68f7n"><h2 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.title"))}</h2> <p class="menu-subtitle svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.choose_adventure"))}</p> <span class="level-badge svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.level"))} ${escape_html(level)} · ${escape_html(lettersLearned.length)}/29</span></div> <div class="mode-grid svelte-q68f7n"><button class="mode-card svelte-q68f7n"><span class="mode-emoji svelte-q68f7n">🔤</span> <h3 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.explore"))}</h3> <p class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.explore_desc"))}</p></button> <button class="mode-card svelte-q68f7n"><span class="mode-emoji svelte-q68f7n">🎯</span> <h3 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.find"))}</h3> <p class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.find_desc"))}</p></button> <button class="mode-card svelte-q68f7n"><span class="mode-emoji svelte-q68f7n">📖</span> <h3 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.soundout"))}</h3> <p class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.soundout_desc"))}</p></button> <button class="mode-card svelte-q68f7n"><span class="mode-emoji svelte-q68f7n">🥁</span> <h3 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.syllable"))}</h3> <p class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.syllable_desc"))}</p></button> <button class="mode-card coartic svelte-q68f7n"><span class="mode-emoji svelte-q68f7n">🗣️</span> <h3 class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.coarticulation"))}</h3> <p class="svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.mode.coarticulation_desc"))}</p></button></div> <div class="speed-control svelte-q68f7n"><span class="speed-label svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.speech_speed"))}</span> <div class="speed-options svelte-q68f7n"><button${attr_class("speed-btn svelte-q68f7n", void 0, { "active": speechRate === 0.4 })}>🐢</button> <button${attr_class("speed-btn svelte-q68f7n", void 0, { "active": speechRate === 0.6 })}>🚶</button> <button${attr_class("speed-btn svelte-q68f7n", void 0, { "active": speechRate === 0.8 })}>🏃</button> <button${attr_class("speed-btn svelte-q68f7n", void 0, { "active": speechRate === 1 })}>🚀</button></div> <p class="speed-hint svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.speed_hint"))}</p></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-q68f7n">${escape_html(store_get($$store_subs ??= {}, "$t", t)("letter.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
