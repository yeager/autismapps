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
    const WEATHER_TYPES = [
      { id: "sunny", icon: "☀️", temp: "25°" },
      { id: "rainy", icon: "🌧️", temp: "12°" },
      { id: "snowy", icon: "❄️", temp: "-5°" },
      { id: "windy", icon: "💨", temp: "8°" },
      { id: "warm", icon: "🌤️", temp: "20°" },
      { id: "cold", icon: "🥶", temp: "0°" }
    ];
    $$renderer2.push(`<div class="app-container svelte-dgpls0"><header class="sticky-header svelte-dgpls0"><button class="back-btn svelte-dgpls0"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("common.back"))}>←</button> <h1 class="svelte-dgpls0">👔 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("clothesChooser.title"))}</h1></header> <main class="content svelte-dgpls0">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<h2 class="svelte-dgpls0">${escape_html(store_get($$store_subs ??= {}, "$t", t)("clothesChooser.pickWeather"))}</h2> <div class="weather-grid svelte-dgpls0"><!--[-->`);
      const each_array = ensure_array_like(WEATHER_TYPES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let w = each_array[$$index];
        $$renderer2.push(`<button class="weather-card svelte-dgpls0"><span class="weather-icon svelte-dgpls0">${escape_html(w.icon)}</span> <span class="weather-name svelte-dgpls0">${escape_html(store_get($$store_subs ??= {}, "$t", t)(`clothesChooser.weather.${w.id}`))}</span> <span class="weather-temp svelte-dgpls0">${escape_html(w.temp)}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></main> <footer class="credit svelte-dgpls0"><p class="svelte-dgpls0">Autismappar · CC BY-NC-SA 4.0</p></footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
