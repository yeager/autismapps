import { e as escape_html, s as store_get, c as attr, f as ensure_array_like, a as attr_class, h as attr_style, u as unsubscribe_stores, b as stringify } from "../../../../chunks/index2.js";
import { b as t } from "../../../../chunks/index3.js";
import "../../../../chunks/index4.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let gridSize = 4;
    let boardName = "";
    let centerTitle = "";
    let categoryColor = "#E67E22";
    let cells = createEmptyCells(4);
    let searchQuery = "";
    let searchResults = [];
    let searching = false;
    let selectedCellIndex = null;
    let editingLabel = null;
    let editLabelText = "";
    const GRID_OPTIONS = [3, 4, 5, 6];
    const COLORS = [
      "#E67E22",
      "#3498DB",
      "#27AE60",
      "#9B59B6",
      "#F1C40F",
      "#E74C3C",
      "#1ABC9C",
      "#E91E63"
    ];
    function createEmptyCells(size) {
      return Array.from({ length: size * size }, (_, i) => ({ index: i, label: "", isEmpty: true }));
    }
    $$renderer2.push(`<div class="board-builder svelte-16y2cqy"><div class="builder-sidebar svelte-16y2cqy"><div class="toolbar svelte-16y2cqy"><h2 class="svelte-16y2cqy">${escape_html(
      // Load boards on mount
      store_get($$store_subs ??= {}, "$t", t)("board.title")
    )}</h2> <div class="field svelte-16y2cqy"><label for="board-name" class="svelte-16y2cqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.board_name"))}</label> <input id="board-name" type="text"${attr("value", boardName)} placeholder="My Board" class="svelte-16y2cqy"/></div> <div class="field svelte-16y2cqy"><label for="center-title" class="svelte-16y2cqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.center_title"))}</label> <input id="center-title" type="text"${attr("value", centerTitle)} class="svelte-16y2cqy"/></div> <div class="field svelte-16y2cqy"><span id="grid-size-label">${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.grid_size"))}</span> <div class="grid-options svelte-16y2cqy"><!--[-->`);
    const each_array = ensure_array_like(GRID_OPTIONS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let size = each_array[$$index];
      $$renderer2.push(`<button${attr_class("grid-option svelte-16y2cqy", void 0, { "active": gridSize === size })}>${escape_html(size)}×${escape_html(size)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="field svelte-16y2cqy"><span id="cat-color-label">${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.category_color"))}</span> <div class="color-options svelte-16y2cqy"><!--[-->`);
    const each_array_1 = ensure_array_like(COLORS);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let color = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class("color-dot svelte-16y2cqy", void 0, { "active": categoryColor === color })}${attr_style(`background: ${stringify(color)}`)}${attr("aria-label", color)}></button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="field svelte-16y2cqy"><label for="picto-search" class="svelte-16y2cqy">${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.search_pictograms"))}</label> <div class="search-input svelte-16y2cqy"><input id="picto-search" type="search"${attr("value", searchQuery)}${attr("placeholder", store_get($$store_subs ??= {}, "$t", t)("board.search_pictograms"))} class="svelte-16y2cqy"/> <button class="search-go svelte-16y2cqy"${attr("disabled", searching, true)}>${escape_html("🔍")}</button></div></div> `);
    if (searchResults.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="picto-results svelte-16y2cqy"><!--[-->`);
      const each_array_2 = ensure_array_like(searchResults);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let picto = each_array_2[$$index_2];
        $$renderer2.push(`<button class="picto-item svelte-16y2cqy"${attr("title", picto.keyword)}><img${attr("src", picto.url)}${attr("alt", picto.keyword)} width="60" height="60" loading="lazy" class="svelte-16y2cqy"/> <span class="svelte-16y2cqy">${escape_html(picto.keyword)}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="actions svelte-16y2cqy"><button class="btn primary svelte-16y2cqy">💾 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.save"))}</button> <button class="btn svelte-16y2cqy">🖨️ ${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.print"))}</button> <button class="btn svelte-16y2cqy">📷 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.export_png"))}</button> <button class="btn svelte-16y2cqy">📋 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.templates"))}</button> <button class="btn svelte-16y2cqy">📂 ${escape_html(store_get($$store_subs ??= {}, "$t", t)("board.my_boards"))}</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="builder-main svelte-16y2cqy"><div class="board-grid svelte-16y2cqy"${attr_style(`--grid-size: ${stringify(gridSize)}; --board-color: ${stringify(categoryColor)}`)}>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_5 = ensure_array_like(cells);
    for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
      let cell = each_array_5[i];
      $$renderer2.push(`<button${attr_class("board-cell svelte-16y2cqy", void 0, { "selected": selectedCellIndex === i, "empty": cell.isEmpty })}${attr("aria-label", cell.isEmpty ? store_get($$store_subs ??= {}, "$t", t)("board.tap_to_add") : cell.label)}>`);
      if (!cell.isEmpty && cell.pictogramUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", cell.pictogramUrl)}${attr("alt", cell.label)} loading="lazy" class="svelte-16y2cqy"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (editingLabel === i) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<input class="label-edit svelte-16y2cqy" type="text"${attr("value", editLabelText)}/>`);
      } else if (!cell.isEmpty) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<span class="cell-label svelte-16y2cqy">${escape_html(cell.label)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="cell-placeholder svelte-16y2cqy">+</span>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (!cell.isEmpty) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="cell-clear svelte-16y2cqy" role="button" tabindex="0"${attr("aria-label", store_get($$store_subs ??= {}, "$t", t)("board.clear_cell"))}>✕</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
