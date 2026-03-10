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
      const styleKey = item.action === 'bugReport' ? 'bugReport' : 'url';
      const style = (typeStyles && typeStyles[styleKey]) || preset.menuItemDefaults;
      const updates = {
        ...item,
        iconColor: style.iconColor,
        bgColor: style.bgColor,
        bgColorHover: style.bgColorHover,
        textColor: style.textColor,
      };
      // Set icon for bug-report items; preserve user-chosen icon for URL items
      if (item.action === 'bugReport' && style.icon) {
        updates.icon = style.icon;
      }
      return updates;
    });
  }
}
