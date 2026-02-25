import { e as escape_html, s as store_get, a as attr_class, f as ensure_array_like, u as unsubscribe_stores } from "../../../chunks/index2.js";
import "clsx";
import { l as locale, b as t, c as textSize, d as theme } from "../../../chunks/index3.js";
import { w as writable } from "../../../chunks/index.js";
import "../../../chunks/index4.js";
const VOICES_SV = [
  { id: "sv_SE-nst-medium", name: "NST", lang: "sv", gender: "female", quality: "medium", sizeMb: 18 },
  { id: "sv_SE-lisa-medium", name: "Lisa", lang: "sv", gender: "female", quality: "medium", sizeMb: 18 }
];
const VOICES_EN = [
  { id: "en_US-hfc_female-medium", name: "HFC Female", lang: "en", gender: "female", quality: "medium", sizeMb: 18 },
  { id: "en_US-hfc_male-medium", name: "HFC Male", lang: "en", gender: "male", quality: "medium", sizeMb: 18 },
  { id: "en_US-amy-medium", name: "Amy", lang: "en", gender: "female", quality: "medium", sizeMb: 18 },
  { id: "en_US-joe-medium", name: "Joe", lang: "en", gender: "male", quality: "medium", sizeMb: 18 },
  { id: "en_US-lessac-medium", name: "Lessac", lang: "en", gender: "female", quality: "medium", sizeMb: 18 },
  { id: "en_US-kristin-medium", name: "Kristin", lang: "en", gender: "female", quality: "medium", sizeMb: 18 },
  { id: "en_US-danny-low", name: "Danny (light)", lang: "en", gender: "male", quality: "low", sizeMb: 6 },
  { id: "en_US-lessac-high", name: "Lessac (HD)", lang: "en", gender: "female", quality: "high", sizeMb: 30 }
];
function voicesForLang(lang) {
  if (lang === "sv") return VOICES_SV;
  return VOICES_EN;
}
const selectedVoiceSv = writable(
  "sv_SE-nst-medium"
);
const selectedVoiceEn = writable(
  "en_US-hfc_female-medium"
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let advanced = false;
    const LANGUAGES = [
      { code: "en", label: "English" },
      { code: "sv", label: "Svenska" }
    ];
    const TEXT_SIZES = [
      { value: "normal", key: "settings.text_size.normal" },
      { value: "large", key: "settings.text_size.large" },
      { value: "extra-large", key: "settings.text_size.extra_large" }
    ];
    const THEMES = [
      { value: "light", key: "settings.theme.light" },
      { value: "dark", key: "settings.theme.dark" },
      { value: "high-contrast", key: "settings.theme.high_contrast" }
    ];
    let storedVoices = [];
    let downloadingVoice = "";
    function currentVoices() {
      return voicesForLang(store_get($$store_subs ??= {}, "$locale", locale));
    }
    function selectedVoiceForLang() {
      return store_get($$store_subs ??= {}, "$locale", locale) === "sv" ? store_get($$store_subs ??= {}, "$selectedVoiceSv", selectedVoiceSv) : store_get($$store_subs ??= {}, "$selectedVoiceEn", selectedVoiceEn);
    }
    $$renderer2.push(`<div class="settings-page svelte-1i19ct2"><h1 class="svelte-1i19ct2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.title"))}</h1> <div class="mode-toggle svelte-1i19ct2"><button${attr_class("mode-btn svelte-1i19ct2", void 0, { "active": !advanced })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.simple"))}</button> <button${attr_class("mode-btn svelte-1i19ct2", void 0, { "active": advanced })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.advanced"))}</button></div> <div class="settings-list svelte-1i19ct2"><div class="setting svelte-1i19ct2"><span class="setting-label svelte-1i19ct2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.language"))}</span> <div class="setting-options svelte-1i19ct2"><!--[-->`);
    const each_array = ensure_array_like(LANGUAGES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let lang = each_array[$$index];
      $$renderer2.push(`<button${attr_class("option-btn svelte-1i19ct2", void 0, {
        "active": store_get($$store_subs ??= {}, "$locale", locale) === lang.code
      })}>${escape_html(lang.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="setting setting-column svelte-1i19ct2"><span class="setting-label svelte-1i19ct2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.voice"))}</span> <p class="setting-hint svelte-1i19ct2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.tts_engine"))}: <strong>${escape_html("—")}</strong></p> <div class="voice-grid svelte-1i19ct2"><!--[-->`);
    const each_array_1 = ensure_array_like(currentVoices());
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let v = each_array_1[$$index_1];
      const isSelected = selectedVoiceForLang() === v.id;
      const isCached = storedVoices.includes(v.id);
      const isDownloading = downloadingVoice === v.id;
      $$renderer2.push(`<button${attr_class("voice-card svelte-1i19ct2", void 0, { "active": isSelected, "downloading": isDownloading })}><span class="voice-name svelte-1i19ct2">${escape_html(v.name)}</span> <span class="voice-meta svelte-1i19ct2">${escape_html(v.gender === "female" ? "♀" : v.gender === "male" ? "♂" : "⚬")}
              ${escape_html(v.quality)} `);
      if (!isCached) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`· ⬇️ ${escape_html(v.sizeMb)}MB`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></span> `);
      if (isSelected) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="voice-check svelte-1i19ct2">✓</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (isDownloading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="voice-dl svelte-1i19ct2">⏳</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div> <button class="option-btn svelte-1i19ct2" style="margin-top: 8px">🔊 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.test_voice"))}</button></div> <div class="setting svelte-1i19ct2"><span class="setting-label svelte-1i19ct2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.text_size"))}</span> <div class="setting-options svelte-1i19ct2"><!--[-->`);
    const each_array_2 = ensure_array_like(TEXT_SIZES);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let size = each_array_2[$$index_2];
      $$renderer2.push(`<button${attr_class("option-btn svelte-1i19ct2", void 0, {
        "active": store_get($$store_subs ??= {}, "$textSize", textSize) === size.value
      })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)(size.key))}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="setting svelte-1i19ct2"><span class="setting-label svelte-1i19ct2">${escape_html(store_get($$store_subs ??= {}, "$t", t)("settings.theme"))}</span> <div class="setting-options svelte-1i19ct2"><!--[-->`);
    const each_array_3 = ensure_array_like(THEMES);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let th = each_array_3[$$index_3];
      $$renderer2.push(`<button${attr_class("option-btn svelte-1i19ct2", void 0, {
        "active": store_get($$store_subs ??= {}, "$theme", theme) === th.value
      })}>${escape_html(store_get($$store_subs ??= {}, "$t", t)(th.key))}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
