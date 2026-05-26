/**
 * Theme & Styling — property panel section.
 *
 * @module property-panel/theme-section
 */

import { PRESET_LABELS, applyPreset } from "../theme/presets";

const themeSection = {
  type: "items",
  label: "Theme & Styling",
  items: {
    themeInfo: {
      component: "text",
      label:
        "Select a theme preset to apply a complete color palette. You can still tweak individual colors in the sections below.",
    },
    themePreset: {
      ref: "themePreset",
      label: "Theme preset",
      type: "string",
      component: "dropdown",
      defaultValue: "default",
      options: [
        ...Object.entries(PRESET_LABELS).map(([key, label]) => ({
          value: key,
          label,
        })),
      ],
      change: (data) => {
        applyPreset(data, data.themePreset);
      },
    },
  },
};

export default themeSection;
