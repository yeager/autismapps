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
    const CATEGORIES = {
      animals: { name: "dict.cat.animals", icon: "🐾" },
      food: { name: "dict.cat.food", icon: "🍎" },
      clothes: { name: "dict.cat.clothes", icon: "👕" },
      body: { name: "dict.cat.body", icon: "🫀" },
      home: { name: "dict.cat.home", icon: "🏠" },
      school: { name: "dict.cat.school", icon: "📚" }
    };
    const WORDS = [
      // Animals
      { category: "animals", sv: "hund", en: "dog", emoji: "🐕" },
      { category: "animals", sv: "katt", en: "cat", emoji: "🐈" },
      { category: "animals", sv: "häst", en: "horse", emoji: "🐴" },
      { category: "animals", sv: "ko", en: "cow", emoji: "🐄" },
      { category: "animals", sv: "fågel", en: "bird", emoji: "🐦" },
      { category: "animals", sv: "fisk", en: "fish", emoji: "🐟" },
      { category: "animals", sv: "kanin", en: "rabbit", emoji: "🐇" },
      { category: "animals", sv: "gris", en: "pig", emoji: "🐷" },
      { category: "animals", sv: "anka", en: "duck", emoji: "🦆" },
      {
        category: "animals",
        sv: "fjäril",
        en: "butterfly",
        emoji: "🦋"
      },
      { category: "animals", sv: "björn", en: "bear", emoji: "🐻" },
      { category: "animals", sv: "lejon", en: "lion", emoji: "🦁" },
      {
        category: "animals",
        sv: "elefant",
        en: "elephant",
        emoji: "🐘"
      },
      { category: "animals", sv: "orm", en: "snake", emoji: "🐍" },
      { category: "animals", sv: "groda", en: "frog", emoji: "🐸" },
      // Food
      { category: "food", sv: "äpple", en: "apple", emoji: "🍎" },
      { category: "food", sv: "banan", en: "banana", emoji: "🍌" },
      { category: "food", sv: "bröd", en: "bread", emoji: "🍞" },
      { category: "food", sv: "mjölk", en: "milk", emoji: "🥛" },
      { category: "food", sv: "ost", en: "cheese", emoji: "🧀" },
      { category: "food", sv: "ägg", en: "egg", emoji: "🥚" },
      { category: "food", sv: "kött", en: "meat", emoji: "🥩" },
      { category: "food", sv: "ris", en: "rice", emoji: "🍚" },
      { category: "food", sv: "soppa", en: "soup", emoji: "🍲" },
      { category: "food", sv: "glass", en: "ice cream", emoji: "🍦" },
      { category: "food", sv: "morot", en: "carrot", emoji: "🥕" },
      { category: "food", sv: "tomat", en: "tomato", emoji: "🍅" },
      { category: "food", sv: "vatten", en: "water", emoji: "💧" },
      { category: "food", sv: "juice", en: "juice", emoji: "🧃" },
      // Clothes
      { category: "clothes", sv: "tröja", en: "sweater", emoji: "🧥" },
      { category: "clothes", sv: "byxor", en: "pants", emoji: "👖" },
      { category: "clothes", sv: "skor", en: "shoes", emoji: "👟" },
      { category: "clothes", sv: "mössa", en: "hat", emoji: "🧢" },
      {
        category: "clothes",
        sv: "vantar",
        en: "mittens",
        emoji: "🧤"
      },
      { category: "clothes", sv: "jacka", en: "jacket", emoji: "🧥" },
      {
        category: "clothes",
        sv: "strumpor",
        en: "socks",
        emoji: "🧦"
      },
      {
        category: "clothes",
        sv: "klänning",
        en: "dress",
        emoji: "👗"
      },
      {
        category: "clothes",
        sv: "t-shirt",
        en: "t-shirt",
        emoji: "👕"
      },
      { category: "clothes", sv: "stövlar", en: "boots", emoji: "👢" },
      // Body
      { category: "body", sv: "huvud", en: "head", emoji: "🗣️" },
      { category: "body", sv: "öga", en: "eye", emoji: "👁️" },
      { category: "body", sv: "öra", en: "ear", emoji: "👂" },
      { category: "body", sv: "näsa", en: "nose", emoji: "👃" },
      { category: "body", sv: "mun", en: "mouth", emoji: "👄" },
      { category: "body", sv: "hand", en: "hand", emoji: "✋" },
      { category: "body", sv: "fot", en: "foot", emoji: "🦶" },
      { category: "body", sv: "arm", en: "arm", emoji: "💪" },
      { category: "body", sv: "ben", en: "leg", emoji: "🦵" },
      { category: "body", sv: "mage", en: "stomach", emoji: "🫃" },
      { category: "body", sv: "hjärta", en: "heart", emoji: "❤️" },
      { category: "body", sv: "tand", en: "tooth", emoji: "🦷" },
      // Home
      { category: "home", sv: "hus", en: "house", emoji: "🏠" },
      { category: "home", sv: "dörr", en: "door", emoji: "🚪" },
      { category: "home", sv: "fönster", en: "window", emoji: "🪟" },
      { category: "home", sv: "stol", en: "chair", emoji: "🪑" },
      { category: "home", sv: "bord", en: "table", emoji: "🍽️" },
      { category: "home", sv: "säng", en: "bed", emoji: "🛏️" },
      { category: "home", sv: "lampa", en: "lamp", emoji: "💡" },
      { category: "home", sv: "tv", en: "tv", emoji: "📺" },
      { category: "home", sv: "kök", en: "kitchen", emoji: "🍳" },
      { category: "home", sv: "badrum", en: "bathroom", emoji: "🛁" },
      { category: "home", sv: "soffa", en: "sofa", emoji: "🛋️" },
      { category: "home", sv: "nyckel", en: "key", emoji: "🔑" },
      // School
      { category: "school", sv: "bok", en: "book", emoji: "📕" },
      { category: "school", sv: "penna", en: "pen", emoji: "✏️" },
      {
        category: "school",
        sv: "lärare",
        en: "teacher",
        emoji: "👩‍🏫"
      },
      { category: "school", sv: "skola", en: "school", emoji: "🏫" },
      { category: "school", sv: "väska", en: "bag", emoji: "🎒" },
      { category: "school", sv: "papper", en: "paper", emoji: "📄" },
      { category: "school", sv: "sax", en: "scissors", emoji: "✂️" },
      { category: "school", sv: "linjal", en: "ruler", emoji: "📏" },
      { category: "school", sv: "dator", en: "computer", emoji: "💻" },
      { category: "school", sv: "klocka", en: "clock", emoji: "🕐" }
    ];
    let stars = 0;
    let wordsLearned = [];
    function categoryWords(cat) {
      return WORDS.filter((w) => w.category === cat);
    }
    $$renderer2.push(`<div class="dict-page svelte-3cjxfv"><header class="app-header svelte-3cjxfv"><button class="back-btn svelte-3cjxfv"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-3cjxfv">${escape_html(store_get($$store_subs ??= {}, "$t", t)("dict.title"))}</h1> <div class="stats-bar svelte-3cjxfv"><span class="stat svelte-3cjxfv">⭐ ${escape_html(stars)}</span> <span class="stat svelte-3cjxfv">${escape_html(wordsLearned.length)}/${escape_html(WORDS.length)}</span></div></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="cat-page svelte-3cjxfv"><p class="instruction svelte-3cjxfv">${escape_html(store_get($$store_subs ??= {}, "$t", t)("dict.pick_category"))}</p> <div class="cat-grid svelte-3cjxfv"><!--[-->`);
      const each_array = ensure_array_like(Object.entries(CATEGORIES));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [key, cat] = each_array[$$index];
        $$renderer2.push(`<button class="cat-card svelte-3cjxfv"><span class="cat-icon svelte-3cjxfv">${escape_html(cat.icon)}</span> <h3 class="svelte-3cjxfv">${escape_html(store_get($$store_subs ??= {}, "$t", t)(cat.name))}</h3> <span class="cat-count svelte-3cjxfv">${escape_html(categoryWords(key).length)} ${escape_html(store_get($$store_subs ??= {}, "$t", t)("dict.words"))}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="action-row svelte-3cjxfv"><button class="mode-btn svelte-3cjxfv">🃏 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("dict.flashcards_all"))}</button> <button class="mode-btn quiz svelte-3cjxfv">🧠 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("dict.quiz_all"))}</button></div></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-3cjxfv">${escape_html(store_get($$store_subs ??= {}, "$t", t)("dict.credit"))}</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
