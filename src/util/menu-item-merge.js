/**
 * Helpers for multi-instance HelpButton.qs menu merging.
 */

// Canonical default for both persisted object properties and property-panel UI.
export const DEFAULT_MENU_ITEM_MERGE_MODE = "append";

const VALID_MENU_ITEM_MERGE_MODES = new Set([
  "append",
  "dedupeLabel",
  "dedupeLabelAction",
]);
// Ordinary URL items default to action="link" in the property schema.
// Mirror that here so unlabeled action values merge the same way at runtime.
const DEFAULT_MENU_ITEM_ACTION = "link";

/**
 * Normalize menu-item merge mode to a supported value.
 *
 * @param {string} mode - Requested merge mode.
 * @returns {string} Supported merge mode.
 */
export function normalizeMenuItemMergeMode(mode) {
  return VALID_MENU_ITEM_MERGE_MODES.has(mode)
    ? mode
    : DEFAULT_MENU_ITEM_MERGE_MODE;
}

/**
 * Decide whether a menu item should be shown.
 *
 * @param {object} item - Menu item config.
 * @returns {boolean} True when the item is visible.
 */
export function isMenuItemVisible(item = {}) {
  if (
    item.showCondition === undefined ||
    item.showCondition === null ||
    item.showCondition === ""
  ) {
    return true;
  }

  const condition = String(item.showCondition).trim();
  return condition !== "0" && condition.toLowerCase() !== "false";
}

/**
 * Build a de-duplication key for a menu item.
 *
 * @param {object} item - Menu item config.
 * @param {string} mode - Merge mode.
 * @returns {string|null} Merge key, or null when item should never dedupe.
 */
function getMenuItemMergeKey(item, mode) {
  const normalizedLabel = String(item?.label || "").trim().toLowerCase();
  if (!normalizedLabel) {
    // Items without a non-empty label never participate in de-duplication.
    // Keep them in registration order so unlabeled separators/dividers remain
    // explicit, instance-local additions to the merged menu.
    return null;
  }

  if (mode === "dedupeLabel") {
    return normalizedLabel;
  }

  if (mode === "dedupeLabelAction") {
    const action = String(item?.action || DEFAULT_MENU_ITEM_ACTION)
      .trim()
      .toLowerCase();
    return `${action}::${normalizedLabel}`;
  }

  return null;
}

/**
 * Merge menu items from multiple registered HelpButton.qs configs.
 *
 * append:
 *   keep every item in registration order.
 * dedupeLabel:
 *   keep the first item for each label (case-insensitive, trimmed).
 * dedupeLabelAction:
 *   keep the first item for each action+label combination.
 * items without a non-empty label:
 *   never dedupe; always keep them in registration order (see note below).
 *
 * De-duplication contract – "first visible wins":
 *   For any given key, the first item that is visible (showCondition truthy)
 *   wins its slot.  If the first occurrence is hidden but a later occurrence
 *   is visible, the visible one wins instead.  A visible winner is never
 *   displaced by any subsequent item with the same key.
 *
 * Output order:
 *   Items appear in their original flattened (registration) order.
 *   Because the winner is identified in a separate first pass and then
 *   selected during a second filtering pass, output positions are never
 *   shifted by splice arithmetic — each item lands exactly where it sat
 *   in the flattened sequence.
 *
 * Note on unlabeled items:
 *   Items without a non-empty label (separators, dividers, …) have no
 *   de-duplication key and are therefore always kept as-is.  If two
 *   instances each contribute an unlabeled separator, both separators will
 *   appear in the merged result.  This is intentional: there is no reliable
 *   identity for structural elements that carry no label.
 *
 * @param {object[][]} menuItemGroups - Menu-item arrays in registration order.
 * @param {string} [mode] - Merge mode (will be normalized internally).
 * @returns {object[]} Merged menu items.
 */
export function mergeMenuItems(menuItemGroups, mode = DEFAULT_MENU_ITEM_MERGE_MODE) {
  // Normalization is intentionally kept inside this function so that the
  // caller does not need to call normalizeMenuItemMergeMode() separately.
  const normalizedMode = normalizeMenuItemMergeMode(mode);
  const flattened = menuItemGroups.flat();

  if (normalizedMode === "append") {
    return flattened;
  }

  // ── Pass 1: determine the winning item for each de-duplication key ────────
  //
  // Rule: the first visible item wins its key slot.  If the first occurrence
  // is hidden, it tentatively holds the slot; if a later visible item with the
  // same key is found, the visible one takes over.  Once a slot is held by a
  // visible item it is never updated again.
  //
  // Unlabeled items have no key (getMenuItemMergeKey returns null) and are
  // skipped here; they are always included in pass 2.
  const winners = new Map(); // key → winning item object reference

  for (const item of flattened) {
    const key = getMenuItemMergeKey(item, normalizedMode);
    if (!key) continue; // unlabeled — skip winner selection; Pass 2 always includes these

    if (!winners.has(key)) {
      // First encounter: tentatively claim the slot regardless of visibility.
      winners.set(key, item);
    } else if (!isMenuItemVisible(winners.get(key)) && isMenuItemVisible(item)) {
      // Upgrade: promote the first visible occurrence over a hidden predecessor.
      winners.set(key, item);
      // A visible winner is never displaced further (no else-branch needed).
    }
  }

  // ── Pass 2: collect output in original flattened order ───────────────────
  //
  // An item is kept when:
  //   • it has no de-duplication key (unlabeled — always include), OR
  //   • it is the exact object reference stored as the winner for its key.
  //
  // Using object-reference equality (===) means each item occupies exactly
  // the position it held in `flattened` — no index arithmetic, no splicing,
  // no order surprises.  This is O(n) overall (two linear passes, no nesting).
  return flattened.filter((item) => {
    const key = getMenuItemMergeKey(item, normalizedMode);
    if (!key) return true; // no label → always include
    return winners.get(key) === item; // keep only the designated winner
  });
}
