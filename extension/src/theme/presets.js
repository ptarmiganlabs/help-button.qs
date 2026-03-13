/**
 * Theme presets for HelpButton.qs.
 *
 * Each preset defines a complete set of color values for the toolbar button,
 * popup panel, and default menu-item colors. Values use the Qlik color-picker
 * object format so they can be stored directly in the layout.
 *
 * The user selects a preset from a dropdown in the property panel. On change,
 * the preset colors are written into the layout, updating every color-picker.
 * Individual color-picker overrides still work after selecting a preset.
 *
 * Preset names match Onboard.qs for consistency across the Ptarmigan Labs
 * extension ecosystem.
 */

import { toPickerObj } from "../util/color";

/**
 * Default — neutral, minimal grey palette.
 */
export const defaultPreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#595959"),
    backgroundColorHover: toPickerObj("#404040"),
    textColor: toPickerObj("#ffffff"),
    borderColor: toPickerObj("#595959"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#595959"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#595959"),
    headerTextColor: toPickerObj("#ffffff"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  tooltipDefaults: {
    iconColor: toPickerObj("#ffffff"),
    iconBackgroundColor: toPickerObj("#595959"),
    hoverBackgroundColor: toPickerObj("#f5f5f5"),
    hoverTextColor: toPickerObj("#333333"),
    hoverBorderColor: toPickerObj("#d1d5db"),
    dialogHeaderBackgroundColor: toPickerObj("#595959"),
    dialogHeaderTextColor: toPickerObj("#ffffff"),
    dialogBodyBackgroundColor: toPickerObj("#ffffff"),
    dialogBodyTextColor: toPickerObj("#333333"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#595959"),
    bgColor: toPickerObj("#f5f5f5"),
    bgColorHover: toPickerObj("#e8e8e8"),
    textColor: toPickerObj("#333333"),
  },
  menuItemTypeStyles: {
    url: {
      iconColor: toPickerObj("#595959"),
      bgColor: toPickerObj("#f5f5f5"),
      bgColorHover: toPickerObj("#e8e8e8"),
      textColor: toPickerObj("#333333"),
      icon: "link",
    },
    bugReport: {
      iconColor: toPickerObj("#b45309"),
      bgColor: toPickerObj("#fffbeb"),
      bgColorHover: toPickerObj("#fef3c7"),
      textColor: toPickerObj("#78350f"),
      icon: "bug",
    },
    feedback: {
      iconColor: toPickerObj("#7c3aed"),
      bgColor: toPickerObj("#f5f3ff"),
      bgColorHover: toPickerObj("#ede9fe"),
      textColor: toPickerObj("#4c1d95"),
      icon: "star",
    },
  },
};

/**
 * The Lean Green Machine — full-spectrum Qlik green.
 */
export const leanGreenPreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#009845"),
    backgroundColorHover: toPickerObj("#007a38"),
    textColor: toPickerObj("#ffffff"),
    borderColor: toPickerObj("#009845"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#006b30"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#006b30"),
    headerTextColor: toPickerObj("#ffffff"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  tooltipDefaults: {
    iconColor: toPickerObj("#ffffff"),
    iconBackgroundColor: toPickerObj("#009845"),
    hoverBackgroundColor: toPickerObj("#e8f5ee"),
    hoverTextColor: toPickerObj("#004d25"),
    hoverBorderColor: toPickerObj("#a7d7b8"),
    dialogHeaderBackgroundColor: toPickerObj("#006b30"),
    dialogHeaderTextColor: toPickerObj("#ffffff"),
    dialogBodyBackgroundColor: toPickerObj("#ffffff"),
    dialogBodyTextColor: toPickerObj("#004d25"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#009845"),
    bgColor: toPickerObj("#e8f5ee"),
    bgColorHover: toPickerObj("#c8ebd5"),
    textColor: toPickerObj("#004d25"),
  },
  menuItemTypeStyles: {
    url: {
      iconColor: toPickerObj("#009845"),
      bgColor: toPickerObj("#e8f5ee"),
      bgColorHover: toPickerObj("#c8ebd5"),
      textColor: toPickerObj("#004d25"),
      icon: "link",
    },
    bugReport: {
      iconColor: toPickerObj("#b45309"),
      bgColor: toPickerObj("#fffbeb"),
      bgColorHover: toPickerObj("#fef3c7"),
      textColor: toPickerObj("#78350f"),
      icon: "bug",
    },
    feedback: {
      iconColor: toPickerObj("#0891b2"),
      bgColor: toPickerObj("#ecfeff"),
      bgColorHover: toPickerObj("#cffafe"),
      textColor: toPickerObj("#164e63"),
      icon: "star",
    },
  },
};

/**
 * Corporate Blue — authoritative blue palette with gold accents.
 */
export const corporateBluePreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#165a9b"),
    backgroundColorHover: toPickerObj("#12487c"),
    textColor: toPickerObj("#ffffff"),
    borderColor: toPickerObj("#0e3b65"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#0c3256"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#0c3256"),
    headerTextColor: toPickerObj("#ffcc33"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  tooltipDefaults: {
    iconColor: toPickerObj("#ffffff"),
    iconBackgroundColor: toPickerObj("#165a9b"),
    hoverBackgroundColor: toPickerObj("#f0f6fc"),
    hoverTextColor: toPickerObj("#0c3256"),
    hoverBorderColor: toPickerObj("#93c5fd"),
    dialogHeaderBackgroundColor: toPickerObj("#0c3256"),
    dialogHeaderTextColor: toPickerObj("#ffcc33"),
    dialogBodyBackgroundColor: toPickerObj("#ffffff"),
    dialogBodyTextColor: toPickerObj("#0c3256"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#165a9b"),
    bgColor: toPickerObj("#f0f6fc"),
    bgColorHover: toPickerObj("#dbeafe"),
    textColor: toPickerObj("#0c3256"),
  },
  menuItemTypeStyles: {
    url: {
      iconColor: toPickerObj("#165a9b"),
      bgColor: toPickerObj("#f0f6fc"),
      bgColorHover: toPickerObj("#dbeafe"),
      textColor: toPickerObj("#0c3256"),
      icon: "link",
    },
    bugReport: {
      iconColor: toPickerObj("#dc2626"),
      bgColor: toPickerObj("#fef2f2"),
      bgColorHover: toPickerObj("#fee2e2"),
      textColor: toPickerObj("#7f1d1d"),
      icon: "bug",
    },
    feedback: {
      iconColor: toPickerObj("#7c3aed"),
      bgColor: toPickerObj("#f5f3ff"),
      bgColorHover: toPickerObj("#ede9fe"),
      textColor: toPickerObj("#4c1d95"),
      icon: "star",
    },
  },
};

/**
 * Corporate Gold — warm gold palette with blue accents.
 */
export const corporateGoldPreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#ffcc33"),
    backgroundColorHover: toPickerObj("#ffe494"),
    textColor: toPickerObj("#222222"),
    borderColor: toPickerObj("#222222"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#0c3256"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#0c3256"),
    headerTextColor: toPickerObj("#ffcc33"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  tooltipDefaults: {
    iconColor: toPickerObj("#222222"),
    iconBackgroundColor: toPickerObj("#ffcc33"),
    hoverBackgroundColor: toPickerObj("#fffae6"),
    hoverTextColor: toPickerObj("#222222"),
    hoverBorderColor: toPickerObj("#fbbf24"),
    dialogHeaderBackgroundColor: toPickerObj("#0c3256"),
    dialogHeaderTextColor: toPickerObj("#ffcc33"),
    dialogBodyBackgroundColor: toPickerObj("#ffffff"),
    dialogBodyTextColor: toPickerObj("#222222"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#165a9b"),
    bgColor: toPickerObj("#fffae6"),
    bgColorHover: toPickerObj("#fff3c4"),
    textColor: toPickerObj("#222222"),
  },
  menuItemTypeStyles: {
    url: {
      iconColor: toPickerObj("#165a9b"),
      bgColor: toPickerObj("#fffae6"),
      bgColorHover: toPickerObj("#fff3c4"),
      textColor: toPickerObj("#222222"),
      icon: "link",
    },
    bugReport: {
      iconColor: toPickerObj("#165a9b"),
      bgColor: toPickerObj("#eff6ff"),
      bgColorHover: toPickerObj("#dbeafe"),
      textColor: toPickerObj("#1e3a5f"),
      icon: "bug",
    },
    feedback: {
      iconColor: toPickerObj("#7c3aed"),
      bgColor: toPickerObj("#faf5ff"),
      bgColorHover: toPickerObj("#f3e8ff"),
      textColor: toPickerObj("#581c87"),
      icon: "star",
    },
  },
};

/**
 * Map of preset key → preset object.
 */
export const PRESETS = {
  default: defaultPreset,
  leanGreen: leanGreenPreset,
  corporateBlue: corporateBluePreset,
  corporateGold: corporateGoldPreset,
};

/**
 * Human-readable labels for each preset (property panel dropdown).
 */
export const PRESET_LABELS = {
  default: "Default",
  leanGreen: "The Lean Green Machine",
  corporateBlue: "Corporate Blue",
  corporateGold: "Corporate Gold",
};

/**
 * Apply a theme preset to a layout data object.
 *
 * Copies all color values from the preset into the layout's
 * buttonStyle, popupStyle, and each menu item's colors.
 *
 * @param {object} data - Extension layout data (mutated in place).
 * @param {string} presetKey - Key from PRESETS.
 */
export function applyPreset(data, presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  // Button style
  data.buttonStyle = { ...(data.buttonStyle || {}), ...preset.buttonStyle };

  // Popup style
  data.popupStyle = { ...(data.popupStyle || {}), ...preset.popupStyle };

  // Menu item colors — apply type-specific styles when available
  if (data.menuItems && Array.isArray(data.menuItems)) {
    const typeStyles = preset.menuItemTypeStyles;
    data.menuItems = data.menuItems.map(item => {
      let styleKey = 'url';
      if (item.action === 'bugReport') styleKey = 'bugReport';
      else if (item.action === 'feedback') styleKey = 'feedback';
      const style = (typeStyles && typeStyles[styleKey]) || preset.menuItemDefaults;
      const updates = {
        ...item,
        iconColor: style.iconColor,
        bgColor: style.bgColor,
        bgColorHover: style.bgColorHover,
        textColor: style.textColor,
      };
      // Set icon for bug-report and feedback items; preserve user-chosen icon for URL items
      if ((item.action === 'bugReport' || item.action === 'feedback') && style.icon) {
        updates.icon = style.icon;
      }
      return updates;
    });
  }

  // Tooltip colors — apply preset tooltip defaults to all existing tooltip items
  if (data.tooltips && Array.isArray(data.tooltips) && preset.tooltipDefaults) {
    const td = preset.tooltipDefaults;
    data.tooltips = data.tooltips.map(item => ({
      ...item,
      iconColor: td.iconColor,
      iconBackgroundColor: td.iconBackgroundColor,
      hoverBackgroundColor: td.hoverBackgroundColor,
      hoverTextColor: td.hoverTextColor,
      hoverBorderColor: td.hoverBorderColor,
      dialogHeaderBackgroundColor: td.dialogHeaderBackgroundColor,
      dialogHeaderTextColor: td.dialogHeaderTextColor,
      dialogBodyBackgroundColor: td.dialogBodyBackgroundColor,
      dialogBodyTextColor: td.dialogBodyTextColor,
      _themedPreset: presetKey,
    }));
  }
}

/**
 * Apply the active preset's tooltip colors to any newly added tooltip items.
 *
 * Newly added array items get hardcoded `defaultValue` colors from the property
 * panel definition. This function detects items that haven't been themed yet
 * (missing `_themedPreset` matching the current preset) and stamps them.
 *
 * Call this from a `change` handler on the tooltips array.
 *
 * @param {object} data - Extension layout data (mutated in place).
 */
export function applyPresetToNewTooltips(data) {
  const presetKey = data.themePreset;
  const preset = PRESETS[presetKey];
  if (!preset || !preset.tooltipDefaults) return;
  if (!data.tooltips || !Array.isArray(data.tooltips)) return;

  let changed = false;
  const td = preset.tooltipDefaults;
  data.tooltips.forEach(item => {
    if (item._themedPreset === presetKey) return; // already themed
    item.iconColor = td.iconColor;
    item.iconBackgroundColor = td.iconBackgroundColor;
    item.hoverBackgroundColor = td.hoverBackgroundColor;
    item.hoverTextColor = td.hoverTextColor;
    item.hoverBorderColor = td.hoverBorderColor;
    item.dialogHeaderBackgroundColor = td.dialogHeaderBackgroundColor;
    item.dialogHeaderTextColor = td.dialogHeaderTextColor;
    item.dialogBodyBackgroundColor = td.dialogBodyBackgroundColor;
    item.dialogBodyTextColor = td.dialogBodyTextColor;
    item._themedPreset = presetKey;
    changed = true;
  });
  return changed;
}
