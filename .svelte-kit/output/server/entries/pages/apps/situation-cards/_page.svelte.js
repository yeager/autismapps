import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, h as attr_style, b as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
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
    const THEMES = [
      {
        id: "school",
        label: "situation.school",
        emoji: "🏫",
        color: "#3498DB",
        words: [
          "teacher",
          "book",
          "pencil",
          "desk",
          "friend",
          "play",
          "read",
          "write",
          "listen",
          "draw",
          "count",
          "sing"
        ]
      },
      {
        id: "home",
        label: "situation.home",
        emoji: "🏠",
        color: "#27AE60",
        words: [
          "bed",
          "table",
          "chair",
          "door",
          "window",
          "television",
          "kitchen",
          "bathroom",
          "sleep",
          "eat",
          "clean",
          "cook"
        ]
      },
      {
        id: "food",
        label: "situation.food",
        emoji: "🍎",
        color: "#E67E22",
        words: [
          "water",
          "milk",
          "bread",
          "apple",
          "banana",
          "rice",
          "chicken",
          "soup",
          "hungry",
          "thirsty",
          "plate",
          "spoon"
        ]
      },
      {
        id: "hygiene",
        label: "situation.hygiene",
        emoji: "🚿",
        color: "#9B59B6",
        words: [
          "soap",
          "toothbrush",
          "towel",
          "shower",
          "toilet",
          "wash hands",
          "comb",
          "mirror",
          "clean",
          "dry",
          "shampoo",
          "tissue"
        ]
      },
      {
        id: "doctor",
        label: "situation.doctor",
        emoji: "🏥",
        color: "#E74C3C",
        words: [
          "doctor",
          "medicine",
          "pain",
          "stomach",
          "head",
          "arm",
          "leg",
          "thermometer",
          "bandage",
          "wait",
          "sick",
          "better"
        ]
      },
      {
        id: "playground",
        label: "situation.playground",
        emoji: "🛝",
        color: "#F1C40F",
        words: [
          "swing",
          "slide",
          "ball",
          "run",
          "jump",
          "climb",
          "sand",
          "friend",
          "turn",
          "share",
          "push",
          "catch"
        ]
      },
      {
        id: "transport",
        label: "situation.transport",
        emoji: "🚌",
        color: "#1ABC9C",
        words: [
          "car",
          "bus",
          "bicycle",
          "train",
          "walk",
          "road",
          "stop",
          "go",
          "seat belt",
          "ticket",
          "fast",
          "slow"
        ]
      },
      {
        id: "feelings",
        label: "situation.feelings",
        emoji: "😊",
        color: "#E91E63",
        words: [
          "happy",
          "sad",
          "angry",
          "scared",
          "tired",
          "excited",
          "calm",
          "worried",
          "surprised",
          "proud",
          "bored",
          "shy"
        ]
      }
    ];
    $$renderer2.push(`<div class="situation-page svelte-1wsva5y"><header class="app-header svelte-1wsva5y"><button class="back-btn svelte-1wsva5y"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-1wsva5y">${escape_html(store_get($$store_subs ??= {}, "$t", t)("situation.title"))}</h1></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="themes-grid svelte-1wsva5y"><!--[-->`);
      const each_array = ensure_array_like(THEMES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let theme = each_array[$$index];
        $$renderer2.push(`<button class="theme-card svelte-1wsva5y"${attr_style(`--tc: ${stringify(theme.color)}`)}><span class="theme-emoji svelte-1wsva5y">${escape_html(theme.emoji)}</span> <span class="theme-name svelte-1wsva5y">${escape_html(store_get($$store_subs ??= {}, "$t", t)(theme.label))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-1wsva5y">Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-1wsva5y">ARASAAC</a> — CC BY-NC-SA 3.0</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
