import { a as attr_class, c as attr, s as store_get, e as escape_html, f as ensure_array_like, h as attr_style, b as stringify, u as unsubscribe_stores } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { b as t } from "../../chunks/index3.js";
const CATEGORY_META = {
  communication: { color: "#E67E22", label: "app.category.communication", emoji: "💬" },
  daily: { color: "#3498DB", label: "app.category.daily", emoji: "🏠" },
  time: { color: "#27AE60", label: "app.category.time", emoji: "⏰" },
  emotions: { color: "#9B59B6", label: "app.category.emotions", emoji: "💜" },
  learning: { color: "#F1C40F", label: "app.category.learning", emoji: "📚" },
  play: { color: "#E74C3C", label: "app.category.play", emoji: "🎮" }
};
const ALL_APPS = [
  // Communication (AAC)
  { id: "board-builder", name: "app.board_builder", description: "app.board_builder.desc", category: "communication", icon: "/icons/board-builder.svg", route: "/apps/board-builder", ready: true },
  { id: "talk-board", name: "app.talk_board", description: "app.talk_board.desc", category: "communication", icon: "/icons/talk-board.svg", route: "/apps/talk-board", ready: true },
  { id: "situation-cards", name: "app.situation_cards", description: "app.situation_cards.desc", category: "communication", icon: "/icons/situation-cards.svg", route: "/apps/situation-cards", ready: true },
  { id: "sign-dictionary", name: "app.sign_dictionary", description: "app.sign_dictionary.desc", category: "communication", icon: "/icons/sign-dictionary.svg", route: "/apps/sign-dictionary", ready: false },
  { id: "talking-mat", name: "app.talking_mat", description: "app.talking_mat.desc", category: "communication", icon: "/icons/talking-mat.svg", route: "/apps/talking-mat", ready: true },
  { id: "pecs-trainer", name: "app.pecs_trainer", description: "app.pecs_trainer.desc", category: "communication", icon: "/icons/pecs-trainer.svg", route: "/apps/pecs-trainer", ready: true },
  { id: "point-talk", name: "app.point_talk", description: "app.point_talk.desc", category: "communication", icon: "/icons/point-talk.svg", route: "/apps/point-talk", ready: true },
  { id: "phrase-builder", name: "app.phrase_builder", description: "app.phrase_builder.desc", category: "communication", icon: "/icons/phrase-builder.svg", route: "/apps/phrase-builder", ready: true },
  { id: "pecs-board", name: "app.pecs_board", description: "app.pecs_board.desc", category: "communication", icon: "/icons/pecs-board.svg", route: "/apps/pecs-board", ready: false },
  { id: "conversation-aid", name: "app.conversation_aid", description: "app.conversation_aid.desc", category: "communication", icon: "/icons/conversation-aid.svg", route: "/apps/conversation-aid", ready: false },
  { id: "social-stories", name: "app.social_stories", description: "app.social_stories.desc", category: "communication", icon: "/icons/social-stories.svg", route: "/apps/social-stories", ready: false },
  // Daily Routines
  { id: "day-planner", name: "app.day_planner", description: "app.day_planner.desc", category: "daily", icon: "/icons/day-planner.svg", route: "/apps/day-planner", ready: false },
  { id: "picture-schedule", name: "app.picture_schedule", description: "app.picture_schedule.desc", category: "daily", icon: "/icons/picture-schedule.svg", route: "/apps/picture-schedule", ready: true },
  { id: "my-schedule", name: "app.my_schedule", description: "app.my_schedule.desc", category: "daily", icon: "/icons/my-schedule.svg", route: "/apps/my-schedule", ready: false },
  { id: "routine-buddy", name: "app.routine_buddy", description: "app.routine_buddy.desc", category: "daily", icon: "/icons/routine-buddy.svg", route: "/apps/routine-buddy", ready: false },
  { id: "step-guide", name: "app.step_guide", description: "app.step_guide.desc", category: "daily", icon: "/icons/step-guide.svg", route: "/apps/step-guide", ready: true },
  { id: "visual-support", name: "app.visual_support", description: "app.visual_support.desc", category: "daily", icon: "/icons/visual-support.svg", route: "/apps/visual-support", ready: true },
  { id: "clothes-chooser", name: "app.clothes_chooser", description: "app.clothes_chooser.desc", category: "daily", icon: "/icons/clothes-chooser.svg", route: "/apps/clothes-chooser", ready: true },
  { id: "cooking-helper", name: "app.cooking_helper", description: "app.cooking_helper.desc", category: "daily", icon: "/icons/cooking-helper.svg", route: "/apps/cooking-helper", ready: true },
  // Time & Planning
  { id: "visual-timer", name: "app.visual_timer", description: "app.visual_timer.desc", category: "time", icon: "/icons/visual-timer.svg", route: "/apps/visual-timer", ready: true },
  { id: "time-tracker", name: "app.time_tracker", description: "app.time_tracker.desc", category: "time", icon: "/icons/time-tracker.svg", route: "/apps/time-tracker", ready: false },
  { id: "clock-teacher", name: "app.clock_teacher", description: "app.clock_teacher.desc", category: "time", icon: "/icons/clock-teacher.svg", route: "/apps/clock-teacher", ready: true },
  { id: "break-check", name: "app.break_check", description: "app.break_check.desc", category: "time", icon: "/icons/break-check.svg", route: "/apps/break-check", ready: true },
  { id: "practice-board", name: "app.practice_board", description: "app.practice_board.desc", category: "time", icon: "/icons/practice-board.svg", route: "/apps/practice-board", ready: true },
  { id: "sign-dictionary", name: "app.sign_dictionary", description: "app.sign_dictionary.desc", category: "communication", icon: "/icons/sign-dictionary.svg", route: "/apps/sign-dictionary", ready: true },
  { id: "school-day", name: "app.school_day", description: "app.school_day.desc", category: "time", icon: "/icons/school-day.svg", route: "/apps/school-day", ready: false },
  // Emotions & Calm
  { id: "emotion-map", name: "app.emotion_map", description: "app.emotion_map.desc", category: "emotions", icon: "/icons/emotion-map.svg", route: "/apps/emotion-map", ready: true },
  { id: "calm-room", name: "app.calm_room", description: "app.calm_room.desc", category: "emotions", icon: "/icons/calm-room.svg", route: "/apps/calm-room", ready: true },
  { id: "focus-buddy", name: "app.focus_buddy", description: "app.focus_buddy.desc", category: "emotions", icon: "/icons/focus-buddy.svg", route: "/apps/focus-buddy", ready: false },
  { id: "energy-meter", name: "app.energy_meter", description: "app.energy_meter.desc", category: "emotions", icon: "/icons/energy-meter.svg", route: "/apps/energy-meter", ready: true },
  { id: "anger-manager", name: "app.anger_manager", description: "app.anger_manager.desc", category: "emotions", icon: "/icons/anger-manager.svg", route: "/apps/anger-manager", ready: false },
  { id: "reward-chart", name: "app.reward_chart", description: "app.reward_chart.desc", category: "emotions", icon: "/icons/reward-chart.svg", route: "/apps/reward-chart", ready: false },
  // Learning
  { id: "word-builder", name: "app.word_builder", description: "app.word_builder.desc", category: "learning", icon: "/icons/word-builder.svg", route: "/apps/word-builder", ready: false },
  { id: "sentence-builder", name: "app.sentence_builder", description: "app.sentence_builder.desc", category: "learning", icon: "/icons/sentence-builder.svg", route: "/apps/sentence-builder", ready: false },
  { id: "letter-journey", name: "app.letter_journey", description: "app.letter_journey.desc", category: "learning", icon: "/icons/letter-journey.svg", route: "/apps/letter-journey", ready: true },
  { id: "picture-dictionary", name: "app.picture_dictionary", description: "app.picture_dictionary.desc", category: "learning", icon: "/icons/picture-dictionary.svg", route: "/apps/picture-dictionary", ready: true },
  { id: "focus-buddy", name: "app.focus_buddy", description: "app.focus_buddy.desc", category: "time", icon: "/icons/focus-buddy.svg", route: "/apps/focus-buddy", ready: true },
  { id: "math-aid", name: "app.math_aid", description: "app.math_aid.desc", category: "learning", icon: "/icons/math-aid.svg", route: "/apps/math-aid", ready: false },
  { id: "counting", name: "app.counting", description: "app.counting.desc", category: "learning", icon: "/icons/counting.svg", route: "/apps/counting", ready: true },
  { id: "money-check", name: "app.money_check", description: "app.money_check.desc", category: "learning", icon: "/icons/money-check.svg", route: "/apps/money-check", ready: true },
  // Memory & Play
  { id: "memory-game", name: "app.memory_game", description: "app.memory_game.desc", category: "play", icon: "/icons/memory-game.svg", route: "/apps/memory-game", ready: false },
  { id: "sound-library", name: "app.sound_library", description: "app.sound_library.desc", category: "play", icon: "/icons/sound-library.svg", route: "/apps/sound-library", ready: false },
  { id: "diary", name: "app.diary", description: "app.diary.desc", category: "emotions", icon: "/icons/diary.svg", route: "/apps/diary", ready: true },
  { id: "chooser", name: "app.chooser", description: "app.chooser.desc", category: "play", icon: "/icons/chooser.svg", route: "/apps/chooser", ready: true }
];
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let activeCategory = null;
    const categories = Object.entries(CATEGORY_META);
    $$renderer2.push(`<div${attr_class("launcher svelte-1uha8ag", void 0, { "has-category": activeCategory !== null })}><div${attr_class("hero-wrapper svelte-1uha8ag", void 0, { "faded": activeCategory !== null })}><img src="/icons/hero.svg"${attr("alt", store_get($$store_subs ??= {}, "$t", t)("app.title") + " — " + store_get($$store_subs ??= {}, "$t", t)("app.subtitle"))} class="hero-image svelte-1uha8ag" draggable="false"/> <div class="hero-brand svelte-1uha8ag" aria-hidden="true">${escape_html(store_get($$store_subs ??= {}, "$t", t)("app.title.brand"))}</div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="hero-overlay svelte-1uha8ag"><div class="hero-cta svelte-1uha8ag"><p class="hero-tagline svelte-1uha8ag">${escape_html(store_get($$store_subs ??= {}, "$t", t)("app.choose_category"))}</p> <svg class="hero-arrow svelte-1uha8ag" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7" class="svelte-1uha8ag"></path></svg></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <header class="launcher-header svelte-1uha8ag"><div class="brand svelte-1uha8ag"><h1 class="svelte-1uha8ag">${escape_html(store_get($$store_subs ??= {}, "$t", t)("app.title"))}</h1></div> <button class="settings-icon svelte-1uha8ag"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.settings"))}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1uha8ag"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" class="svelte-1uha8ag"></path><circle cx="12" cy="12" r="3" class="svelte-1uha8ag"></circle></svg></button></header> <nav class="categories svelte-1uha8ag"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("app.choose_category"))}><!--[-->`);
    const each_array = ensure_array_like(categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [key, meta] = each_array[$$index];
      $$renderer2.push(`<button${attr_class("cat-btn svelte-1uha8ag", void 0, { "active": activeCategory === key })}${attr("aria-pressed", activeCategory === key)}${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)(meta.label))}${attr_style(`--cat-color: ${stringify(meta.color)}`)}><span class="cat-emoji svelte-1uha8ag" aria-hidden="true">${escape_html(meta.emoji)}</span> <span class="cat-label svelte-1uha8ag">${escape_html(store_get($$store_subs ??= {}, "$t", t)(meta.label))}</span> <span class="cat-count svelte-1uha8ag">${escape_html(ALL_APPS.filter((a) => a.category === key).length)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></nav> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
