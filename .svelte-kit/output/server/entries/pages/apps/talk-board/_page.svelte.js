import { a as attr_class, e as escape_html, s as store_get, f as ensure_array_like, h as attr_style, b as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import { b as t } from "../../../../chunks/index3.js";
import "clsx";
import "../../../../chunks/index4.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let boards = [];
    let isFullscreen = false;
    $$renderer2.push(`<div${attr_class("talk-board svelte-1sgn4ed", void 0, { "fullscreen": isFullscreen })}>`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="board-selector svelte-1sgn4ed"><h2 class="svelte-1sgn4ed">${escape_html(store_get($$store_subs ??= {}, "$t", t)("talk.load_board"))}</h2> <div class="board-list svelte-1sgn4ed">`);
      const each_array = ensure_array_like(boards);
      if (each_array.length !== 0) {
        $$renderer2.push("<!--[-->");
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let board = each_array[$$index];
          $$renderer2.push(`<button class="board-option svelte-1sgn4ed"><span class="board-dot svelte-1sgn4ed"${attr_style(`background: ${stringify(board.categoryColor)}`)}></span> <span class="board-name svelte-1sgn4ed">${escape_html(board.name)}</span> <span class="board-size svelte-1sgn4ed">${escape_html(board.gridSize)}×${escape_html(board.gridSize)}</span></button>`);
        }
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="empty-state svelte-1sgn4ed"><p>No boards yet. Create one in Board Builder!</p> <a href="/apps/board-builder" class="link-btn svelte-1sgn4ed">Open Board Builder →</a></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
