import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    const TOPICS = [
      {
        id: "food",
        label: "mat.topic.food",
        emoji: "🍎",
        words: [
          "pizza",
          "vegetables",
          "fruit",
          "candy",
          "milk",
          "water",
          "bread",
          "soup",
          "rice",
          "chicken"
        ]
      },
      {
        id: "school",
        label: "mat.topic.school",
        emoji: "🏫",
        words: [
          "reading",
          "math",
          "drawing",
          "music",
          "gym",
          "recess",
          "writing",
          "computer",
          "homework",
          "group work"
        ]
      },
      {
        id: "activities",
        label: "mat.topic.activities",
        emoji: "⚽",
        words: [
          "swimming",
          "football",
          "drawing",
          "music",
          "dancing",
          "cooking",
          "reading",
          "gaming",
          "walking",
          "cycling"
        ]
      },
      {
        id: "feelings",
        label: "mat.topic.feelings",
        emoji: "💭",
        words: [
          "school",
          "home",
          "friends",
          "family",
          "bedtime",
          "morning",
          "eating",
          "homework",
          "playing",
          "shopping"
        ]
      }
    ];
    $$renderer2.push(`<div class="mat-page svelte-18uxd1z"><header class="app-header svelte-18uxd1z"><button class="back-btn svelte-18uxd1z"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-18uxd1z">${escape_html(store_get($$store_subs ??= {}, "$t", t)("mat.title"))}</h1> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="intro svelte-18uxd1z">${escape_html(store_get($$store_subs ??= {}, "$t", t)("mat.choose_topic"))}</p> <div class="topics-grid svelte-18uxd1z"><!--[-->`);
      const each_array = ensure_array_like(TOPICS);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let topic = each_array[$$index];
        $$renderer2.push(`<button class="topic-card svelte-18uxd1z"><span class="topic-emoji svelte-18uxd1z">${escape_html(topic.emoji)}</span> <span>${escape_html(store_get($$store_subs ??= {}, "$t", t)(topic.label))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="method-credit svelte-18uxd1z"><p>${escape_html(store_get($$store_subs ??= {}, "$t", t)("mat.credit"))}</p></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-18uxd1z">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-18uxd1z">ARASAAC</a> — CC BY-NC-SA 3.0
    · Inspired by <a href="https://www.talkingmats.com" target="_blank" rel="noopener" class="svelte-18uxd1z">Talking Mats™</a> framework</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
