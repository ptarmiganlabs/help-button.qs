/**
 * Tooltips (icon-on-object with hover + click dialog) — property panel section.
 *
 * @param {Function} getObjectList - Async function for populating the object dropdown.
 * @returns {object} Tooltips section definition.
 *
 * @module property-panel/tooltips-section
 */

import { toPickerObj } from "../util/color";
import { ICON_NAMES } from "../ui/icons";

export default function tooltipsSection(getObjectList) {
  return {
    type: "items",
    label: "Tooltips",
    items: {
      tooltipsInfo: {
        component: "text",
        label:
          "Attach tooltip icons to chart objects or CSS selectors. Hover shows content; click opens a detail dialog.",
      },
      tooltips: {
        ref: "tooltips",
        label: "Tooltip Items",
        type: "array",
        allowAdd: true,
        allowRemove: true,
        allowMove: true,
        addTranslation: "Add Tooltip",
        itemTitleRef: "tooltipLabel",
        items: {
          tooltipLabel: {
            ref: "tooltipLabel",
            label: "Label (display name)",
            type: "string",
            expression: "optional",
            defaultValue: "New tooltip",
            maxlength: 128,
          },
          targetType: {
            ref: "targetType",
            label: "Target type",
            type: "string",
            component: "dropdown",
            defaultValue: "object",
            options: [
              { value: "object", label: "Qlik Sense object" },
              { value: "css", label: "CSS selector" },
            ],
          },
          targetObjectId: {
            ref: "targetObjectId",
            label: "Target object",
            type: "string",
            component: "dropdown",
            defaultValue: "",
            options: getObjectList,
            show: (item) => item.targetType !== "css",
          },
          targetCssSelector: {
            ref: "targetCssSelector",
            label: "CSS selector",
            type: "string",
            expression: "optional",
            defaultValue: "",
            maxlength: 512,
            show: (item) => item.targetType === "css",
          },
          showCondition: {
            ref: "showCondition",
            label: "Show condition",
            type: "string",
            expression: "optional",
            defaultValue: "",
          },

          // -- Icon appearance --
          iconAppearance: {
            component: "expandable-items",
            label: "Icon Appearance",
            items: {
              iconMain: {
                type: "items",
                label: "Icon",
                items: {
                  iconName: {
                    ref: "iconName",
                    label: "Icon",
                    type: "string",
                    component: "dropdown",
                    defaultValue: "info",
                    options: ICON_NAMES.filter(
                      (n) => n !== "close" && n !== "send",
                    ).map((n) => ({
                      value: n,
                      label:
                        n.charAt(0).toUpperCase() +
                        n.slice(1).replace("-", " "),
                    })),
                  },
                  iconSize: {
                    ref: "iconSize",
                    label: "Icon size (px)",
                    type: "number",
                    expression: "optional",
                    defaultValue: 20,
                    min: 1,
                    max: 80,
                  },
                  iconPosition: {
                    ref: "iconPosition",
                    label: "Position on target",
                    type: "string",
                    component: "dropdown",
                    defaultValue: "top-right",
                    options: [
                      { value: "top-left", label: "Top left" },
                      { value: "top-center", label: "Top center" },
                      { value: "top-right", label: "Top right" },
                      { value: "center-left", label: "Center left" },
                      { value: "center-right", label: "Center right" },
                      { value: "bottom-left", label: "Bottom left" },
                      { value: "bottom-center", label: "Bottom center" },
                      { value: "bottom-right", label: "Bottom right" },
                      { value: "percentage", label: "Percentage" },
                    ],
                  },
                  iconPositionX: {
                    ref: "iconPositionX",
                    label: "Horizontal position (%)",
                    type: "number",
                    expression: "optional",
                    defaultValue: 80,
                    min: 0,
                    max: 100,
                    show: (item) => item.iconPosition === "percentage",
                  },
                  iconPositionY: {
                    ref: "iconPositionY",
                    label: "Vertical position (%)",
                    type: "number",
                    expression: "optional",
                    defaultValue: 10,
                    min: 0,
                    max: 100,
                    show: (item) => item.iconPosition === "percentage",
                  },
                  iconFloating: {
                    ref: "iconFloating",
                    label: "Floating (drag to move)",
                    type: "boolean",
                    component: "switch",
                    defaultValue: false,
                    options: [
                      { value: true, label: "On" },
                      { value: false, label: "Off" },
                    ],
                  },
                  iconColor: {
                    ref: "iconColor",
                    label: "Icon color",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#ffffff"),
                  },
                  iconBackgroundColor: {
                    ref: "iconBackgroundColor",
                    label: "Background color",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#165a9b"),
                  },
                },
              },
            },
          },

          // -- Tooltip colors (hover + dialog) --
          tooltipColors: {
            component: "expandable-items",
            label: "Tooltip Colors",
            items: {
              tooltipColorsMain: {
                type: "items",
                label: "Colors",
                items: {
                  hoverBackgroundColor: {
                    ref: "hoverBackgroundColor",
                    label: "Hover background",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#ffffff"),
                  },
                  hoverTextColor: {
                    ref: "hoverTextColor",
                    label: "Hover text",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#1f2937"),
                  },
                  hoverBorderColor: {
                    ref: "hoverBorderColor",
                    label: "Hover border",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#d1d5db"),
                  },
                  dialogHeaderBackgroundColor: {
                    ref: "dialogHeaderBackgroundColor",
                    label: "Dialog header background",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#f9fafb"),
                  },
                  dialogHeaderTextColor: {
                    ref: "dialogHeaderTextColor",
                    label: "Dialog header text",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#111827"),
                  },
                  dialogBodyBackgroundColor: {
                    ref: "dialogBodyBackgroundColor",
                    label: "Dialog body background",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#ffffff"),
                  },
                  dialogBodyTextColor: {
                    ref: "dialogBodyTextColor",
                    label: "Dialog body text",
                    type: "object",
                    component: "color-picker",
                    defaultValue: toPickerObj("#374151"),
                  },
                },
              },
            },
          },

          // -- Hover content --
          hoverSettings: {
            component: "expandable-items",
            label: "Hover Content",
            items: {
              hoverMain: {
                type: "items",
                label: "Content",
                items: {
                  hoverContent: {
                    ref: "hoverContent",
                    label: "Tooltip text (Markdown supported)",
                    type: "string",
                    component: "textarea",
                    rows: 4,
                    defaultValue: "",
                    maxlength: 256,
                  },
                },
              },
            },
          },

          // -- Click dialog --
          dialogSettings: {
            component: "expandable-items",
            label: "Click Dialog",
            items: {
              dialogMain: {
                type: "items",
                label: "Dialog",
                items: {
                  dialogEnabled: {
                    ref: "dialogEnabled",
                    label: "Open dialog on click",
                    type: "boolean",
                    component: "switch",
                    defaultValue: true,
                    options: [
                      { value: true, label: "On" },
                      { value: false, label: "Off" },
                    ],
                  },
                  dialogTitle: {
                    ref: "dialogTitle",
                    label: "Dialog title",
                    type: "string",
                    expression: "optional",
                    defaultValue: "",
                    maxlength: 128,
                    show: (item) => item.dialogEnabled !== false,
                  },
                  dialogContent: {
                    ref: "dialogContent",
                    label: "Dialog content (Markdown supported)",
                    type: "string",
                    component: "textarea",
                    rows: 6,
                    defaultValue: "",
                    maxlength: 16384,
                    show: (item) => item.dialogEnabled !== false,
                  },
                  dialogSize: {
                    ref: "dialogSize",
                    label: "Dialog size",
                    type: "string",
                    component: "dropdown",
                    defaultValue: "medium",
                    show: (item) => item.dialogEnabled !== false,
                    options: [
                      { value: "small", label: "Small (320×280)" },
                      { value: "medium", label: "Medium (480×400)" },
                      { value: "large", label: "Large (640×500)" },
                      { value: "x-large", label: "X-Large (800×600)" },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}
