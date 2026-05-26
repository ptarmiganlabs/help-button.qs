/**
 * Popup appearance — property panel section.
 *
 * @module property-panel/popup-section
 */

import { toPickerObj } from "../util/color";

const popupSection = {
  type: "items",
  label: "Popup Appearance",
  items: {
    popupColorsHeader: {
      component: "text",
      label: "Popup colors",
    },
    popupBorderColor: {
      ref: "popupStyle.borderColor",
      label: "Border",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#0c3256"),
    },
    popupBorderRadius: {
      ref: "popupStyle.borderRadius",
      label: "Border radius",
      type: "string",
      expression: "optional",
      defaultValue: "8px",
    },
    popupHeaderBgColor: {
      ref: "popupStyle.headerBackgroundColor",
      label: "Header background",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#0c3256"),
    },
    popupHeaderTextColor: {
      ref: "popupStyle.headerTextColor",
      label: "Header text",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#ffcc33"),
    },
    popupSeparatorColor: {
      ref: "popupStyle.separatorColor",
      label: "Separator line",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#e0e0e0"),
    },
  },
};

export default popupSection;
