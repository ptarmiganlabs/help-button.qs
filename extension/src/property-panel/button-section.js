/**
 * Toolbar button appearance — property panel section.
 *
 * @module property-panel/button-section
 */

import { toPickerObj } from "../util/color";

const buttonSection = {
  type: "items",
  label: "Button Appearance",
  items: {
    buttonIcon: {
      ref: "buttonIcon",
      label: "Button icon",
      type: "string",
      component: "dropdown",
      defaultValue: "help",
      options: [
        { value: "bell", label: "Bell" },
        { value: "bookmark", label: "Bookmark" },
        { value: "bug", label: "Bug (exclamation)" },
        { value: "calendar", label: "Calendar" },
        { value: "chart-bar", label: "Chart bar" },
        { value: "check", label: "Check" },
        { value: "download", label: "Download" },
        { value: "eye", label: "Eye" },
        { value: "flash", label: "Flash" },
        { value: "globe", label: "Globe" },
        { value: "heart", label: "Heart" },
        { value: "help", label: "Help (question mark)" },
        { value: "home", label: "Home" },
        { value: "info", label: "Info (i)" },
        { value: "lightbulb", label: "Lightbulb" },
        { value: "link", label: "Link (chain)" },
        { value: "lock", label: "Lock" },
        { value: "mail", label: "Mail (envelope)" },
        { value: "phone", label: "Phone" },
        { value: "pin", label: "Pin" },
        { value: "search", label: "Search" },
        { value: "settings", label: "Settings" },
        { value: "star", label: "Star" },
        { value: "toggle", label: "Toggle" },
        { value: "user", label: "User" },
      ],
    },
    buttonColorsHeader: {
      component: "text",
      label: "Button colors",
    },
    buttonBgColor: {
      ref: "buttonStyle.backgroundColor",
      label: "Background",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#165a9b"),
    },
    buttonHoverBgColor: {
      ref: "buttonStyle.backgroundColorHover",
      label: "Hover background",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#12487c"),
    },
    buttonTextColor: {
      ref: "buttonStyle.textColor",
      label: "Text / icon",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#ffffff"),
    },
    buttonBorderColor: {
      ref: "buttonStyle.borderColor",
      label: "Border",
      type: "object",
      component: "color-picker",
      defaultValue: toPickerObj("#0e3b65"),
    },
    buttonBorderRadius: {
      ref: "buttonStyle.borderRadius",
      label: "Border radius",
      type: "string",
      expression: "optional",
      defaultValue: "4px",
    },
  },
};

export default buttonSection;
