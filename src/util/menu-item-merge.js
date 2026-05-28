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
 *   never dedupe; always keep them in registration order.
 *
 * If a hidden duplicate is encountered before a visible duplicate, the
 * visible one replaces it and keeps its own later position so visible
 * registration order remains stable.
 *
 * @param {object[][]} menuItemGroups - Menu-item arrays in registration order.
 * @param {string} mode - Merge mode.
 * @returns {object[]} Merged menu items.
 */
export function mergeMenuItems(menuItemGroups, mode = DEFAULT_MENU_ITEM_MERGE_MODE) {
  const normalizedMode = normalizeMenuItemMergeMode(mode);
  const flattened = menuItemGroups.flat();

  if (normalizedMode === "append") {
    return flattened;
  }

  const mergedItems = [];
  const keyToIndex = new Map();

  for (const item of flattened) {
    const key = getMenuItemMergeKey(item, normalizedMode);
    if (!key) {
      mergedItems.push(item);
      continue;
    }

    const existingIndex = keyToIndex.get(key);
    if (existingIndex === undefined) {
      keyToIndex.set(key, mergedItems.length);
      mergedItems.push(item);
      continue;
    }

    const existingItem = mergedItems[existingIndex];
    if (!isMenuItemVisible(existingItem) && isMenuItemVisible(item)) {
      // Keep visible registration order stable:
      // if a later visible duplicate replaces an earlier hidden one,
      // move it to its own position instead of inheriting the hidden index.
      mergedItems.splice(existingIndex, 1);
      for (const [trackedKey, trackedIndex] of keyToIndex.entries()) {
        if (trackedIndex > existingIndex) {
          keyToIndex.set(trackedKey, trackedIndex - 1);
        }
      }
      keyToIndex.set(key, mergedItems.length);
      mergedItems.push(item);
    }
  }

  return mergedItems;
}
