/**
 * Widget (grid cell) appearance — property panel section.
 *
 * @module property-panel/widget-section
 */

const widgetSection = {
  type: "items",
  label: "Widget Appearance",
  items: {
    hideHoverMenu: {
      ref: "widget.hideHoverMenu",
      label: "Hide hover menu",
      type: "boolean",
      defaultValue: false,
      component: "switch",
      options: [
        { value: true, label: "Hidden" },
        { value: false, label: "Visible" },
      ],
    },
    hideContextMenu: {
      ref: "widget.hideContextMenu",
      label: "Hide context menu",
      type: "boolean",
      defaultValue: false,
      component: "switch",
      options: [
        { value: true, label: "Hidden" },
        { value: false, label: "Visible" },
      ],
    },
    hideWidget: {
      ref: "widget.hideWidget",
      label: "Hide widget on sheet in analysis mode",
      type: "boolean",
      defaultValue: false,
      component: "switch",
      options: [
        { value: true, label: "Hidden" },
        { value: false, label: "Visible" },
      ],
    },
    showAnalysisPlaceholder: {
      ref: "widget.showAnalysisPlaceholder",
      label: "Show placeholder text in analysis mode",
      type: "boolean",
      defaultValue: true,
      component: "switch",
      options: [
        { value: true, label: "Show" },
        { value: false, label: "Hide" },
      ],
    },
  },
};

export default widgetSection;
