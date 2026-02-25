import { c as attr, s as store_get, e as escape_html, f as ensure_array_like, h as attr_style, u as unsubscribe_stores, b as stringify } from "../../../../chunks/index2.js";
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
    const EMOTIONS = [
      {
        id: "happy",
        emoji: "😊",
        label: "emotion.happy",
        zone: "green",
        body: ["chest", "face"],
        strategies: ["emotion.strat.share", "emotion.strat.smile"]
      },
      {
        id: "calm",
        emoji: "😌",
        label: "emotion.calm",
        zone: "green",
        body: ["chest"],
        strategies: ["emotion.strat.breathe", "emotion.strat.enjoy"]
      },
      {
        id: "focused",
        emoji: "🎯",
        label: "emotion.focused",
        zone: "green",
        body: ["head"],
        strategies: ["emotion.strat.keep_going"]
      },
      {
        id: "proud",
        emoji: "💪",
        label: "emotion.proud",
        zone: "green",
        body: ["chest", "arms"],
        strategies: ["emotion.strat.share", "emotion.strat.celebrate"]
      },
      {
        id: "frustrated",
        emoji: "😤",
        label: "emotion.frustrated",
        zone: "yellow",
        body: ["head", "hands"],
        strategies: ["emotion.strat.break", "emotion.strat.ask_help"]
      },
      {
        id: "worried",
        emoji: "😰",
        label: "emotion.worried",
        zone: "yellow",
        body: ["stomach", "chest"],
        strategies: ["emotion.strat.breathe", "emotion.strat.talk"]
      },
      {
        id: "excited",
        emoji: "🤩",
        label: "emotion.excited",
        zone: "yellow",
        body: ["whole"],
        strategies: ["emotion.strat.breathe", "emotion.strat.move"]
      },
      {
        id: "silly",
        emoji: "🤪",
        label: "emotion.silly",
        zone: "yellow",
        body: ["whole"],
        strategies: ["emotion.strat.calm_body", "emotion.strat.breathe"]
      },
      {
        id: "angry",
        emoji: "😠",
        label: "emotion.angry",
        zone: "orange",
        body: ["head", "hands", "chest"],
        strategies: [
          "emotion.strat.count",
          "emotion.strat.walk_away",
          "emotion.strat.squeeze"
        ]
      },
      {
        id: "scared",
        emoji: "😨",
        label: "emotion.scared",
        zone: "orange",
        body: ["stomach", "chest", "legs"],
        strategies: [
          "emotion.strat.safe_person",
          "emotion.strat.breathe",
          "emotion.strat.grounding"
        ]
      },
      {
        id: "anxious",
        emoji: "😥",
        label: "emotion.anxious",
        zone: "orange",
        body: ["stomach", "chest"],
        strategies: [
          "emotion.strat.breathe",
          "emotion.strat.grounding",
          "emotion.strat.talk"
        ]
      },
      {
        id: "overwhelmed",
        emoji: "🤯",
        label: "emotion.overwhelmed",
        zone: "orange",
        body: ["head", "whole"],
        strategies: [
          "emotion.strat.quiet_place",
          "emotion.strat.break",
          "emotion.strat.headphones"
        ]
      },
      {
        id: "meltdown",
        emoji: "🌋",
        label: "emotion.meltdown",
        zone: "red",
        body: ["whole"],
        strategies: [
          "emotion.strat.safe_space",
          "emotion.strat.wait",
          "emotion.strat.heavy_blanket"
        ]
      },
      {
        id: "rage",
        emoji: "🔥",
        label: "emotion.rage",
        zone: "red",
        body: ["whole"],
        strategies: ["emotion.strat.safe_space", "emotion.strat.cool_down"]
      },
      {
        id: "terror",
        emoji: "😱",
        label: "emotion.terror",
        zone: "red",
        body: ["whole"],
        strategies: ["emotion.strat.safe_person", "emotion.strat.safe_space"]
      },
      {
        id: "shutdown",
        emoji: "🧊",
        label: "emotion.shutdown",
        zone: "red",
        body: ["whole"],
        strategies: [
          "emotion.strat.wait",
          "emotion.strat.comfort_item",
          "emotion.strat.no_demands"
        ]
      }
    ];
    const ZONE_COLORS = {
      green: "#27AE60",
      yellow: "#F1C40F",
      orange: "#E67E22",
      red: "#E74C3C"
    };
    const ZONE_LABELS = {
      green: "emotion.zone.green",
      yellow: "emotion.zone.yellow",
      orange: "emotion.zone.orange",
      red: "emotion.zone.red"
    };
    function getZoneEmotions(zone) {
      return EMOTIONS.filter((e) => e.zone === zone);
    }
    $$renderer2.push(`<div class="emotion-page svelte-z58b2e"><header class="app-header svelte-z58b2e"><button class="back-btn svelte-z58b2e"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.back"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"></path></svg></button> <h1 class="svelte-z58b2e">${escape_html(store_get($$store_subs ??= {}, "$t", t)("emotion.title"))}</h1> <button class="icon-btn svelte-z58b2e" aria-label="Quiz">${escape_html("🎯")}</button> <button class="icon-btn svelte-z58b2e">📓</button></header> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="zones svelte-z58b2e"><!--[-->`);
      const each_array_4 = ensure_array_like(["green", "yellow", "orange", "red"]);
      for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
        let zone = each_array_4[$$index_5];
        $$renderer2.push(`<div class="zone svelte-z58b2e"${attr_style(`--zc: ${stringify(ZONE_COLORS[zone])}`)}><h3 class="zone-header svelte-z58b2e">${escape_html(store_get($$store_subs ??= {}, "$t", t)(ZONE_LABELS[zone]))}</h3> <div class="zone-emotions svelte-z58b2e"><!--[-->`);
        const each_array_5 = ensure_array_like(getZoneEmotions(zone));
        for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
          let em = each_array_5[$$index_4];
          $$renderer2.push(`<button class="emotion-btn svelte-z58b2e"><span class="em-emoji svelte-z58b2e">${escape_html(em.emoji)}</span> <span class="em-label svelte-z58b2e">${escape_html(store_get($$store_subs ??= {}, "$t", t)(em.label))}</span></button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <footer class="credit svelte-z58b2e">Emotion zone concept inspired by evidence-based self-regulation frameworks.
    Pictograms: <a href="https://arasaac.org" target="_blank" rel="noopener" class="svelte-z58b2e">ARASAAC</a> — CC BY-NC-SA 3.0</footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
