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
    const CATEGORIES = [
      {
        id: "people",
        icon: "👤",
        color: "#f5c542",
        // yellow
        words: [
          { sv: "mamma", en: "mom", id: "00188" },
          { sv: "pappa", en: "dad", id: "06906" },
          { sv: "kompis", en: "friend", id: "04714" },
          { sv: "jag", en: "I/me", id: "02553" },
          { sv: "du", en: "you", id: "04804" }
        ]
      },
      {
        id: "actions",
        icon: "🏃",
        color: "#4caf50",
        // green
        words: [
          { sv: "äta", en: "eat", id: "16263" },
          { sv: "dricka", en: "drink", id: "01377" },
          { sv: "sova", en: "sleep", id: "00049" },
          { sv: "leka", en: "play", id: "01092" },
          { sv: "hjälp", en: "help", id: "19924" },
          { sv: "stopp", en: "stop", id: "11109" }
        ]
      },
      {
        id: "feelings",
        icon: "😊",
        color: "#2196f3",
        // blue
        words: [
          { sv: "glad", en: "happy", id: "00165" },
          { sv: "ledsen", en: "sad", id: "00185" },
          { sv: "arg", en: "angry", id: "01670" },
          { sv: "rädd", en: "scared", id: "08500" },
          { sv: "trött", en: "tired", id: "00110" }
        ]
      },
      {
        id: "things",
        icon: "📦",
        color: "#ff9800",
        // orange
        words: [
          { sv: "vatten", en: "water", id: "00132" },
          { sv: "mjölk", en: "milk", id: "08962" },
          { sv: "bröd", en: "bread", id: "00434" },
          { sv: "bil", en: "car", id: "02158" },
          { sv: "hus", en: "house", id: "00696" },
          { sv: "katt", en: "cat", id: "00344" },
          { sv: "sko", en: "shoe", id: "02224" },
          { sv: "jacka", en: "jacket", id: "00544" }
        ]
      },
      {
        id: "social",
        icon: "💬",
        color: "#9c27b0",
        // purple
        words: [
          { sv: "ja", en: "yes", id: "09027" },
          { sv: "nej", en: "no", id: "00274" },
          { sv: "tack", en: "thanks", id: "03442" },
          { sv: "hej", en: "hello", id: "00032" },
          { sv: "toalett", en: "toilet", id: "02800" }
        ]
      },
      {
        id: "places",
        icon: "🏠",
        color: "#795548",
        // brown
        words: [
          { sv: "skola", en: "school", id: "00617" },
          { sv: "hem", en: "home", id: "10533" }
        ]
      }
    ];
    let searchQuery = "";
    let searching = false;
    $$renderer2.push(`<div class="app-container svelte-1i39l0g"><header class="sticky-header svelte-1i39l0g"><button class="back-btn svelte-1i39l0g"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("common.back"))}>←</button> <h1 class="svelte-1i39l0g">🤟 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("signDictionary.title"))}</h1></header> <main class="content svelte-1i39l0g">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="intro svelte-1i39l0g">${escape_html(store_get($$store_subs ??= {}, "$t", t)("signDictionary.intro"))}</p> <div class="search-bar svelte-1i39l0g"><input type="text"${attr("value", searchQuery)}${attr("placeholder", store_get($$store_subs ??= {}, "$t", t)("signDictionary.searchPlaceholder"))} class="svelte-1i39l0g"/> <button class="search-btn svelte-1i39l0g"${attr("disabled", searching, true)}>${escape_html("🔍")}</button></div> <div class="categories svelte-1i39l0g"><!--[-->`);
      const each_array = ensure_array_like(CATEGORIES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer2.push(`<button class="category-card svelte-1i39l0g"${attr_style(`--cat-color: ${stringify(cat.color)}`)}><span class="cat-icon svelte-1i39l0g">${escape_html(cat.icon)}</span> <span class="cat-name svelte-1i39l0g">${escape_html(store_get($$store_subs ??= {}, "$t", t)(`signDictionary.cat.${cat.id}`))}</span> <span class="cat-count svelte-1i39l0g">${escape_html(cat.words.length)} ${escape_html(store_get($$store_subs ??= {}, "$t", t)("signDictionary.signs"))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></main> <footer class="credit svelte-1i39l0g"><p><a href="https://teckensprakslexikon.su.se" target="_blank" rel="noopener" class="svelte-1i39l0g">Svenskt teckenspråkslexikon</a> © Stockholms universitet · CC BY-NC-SA 4.0</p></footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
