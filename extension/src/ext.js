/**
 * Property panel definition for HelpButton.qs extension.
 *
 * Section order: Widget → Theme & Styling → Language & Translations → Button → Popup → Menu Items → Tooltips → Template Fields → About
 *
 * Each section is defined in its own module under ./property-panel/.
 *
 * @param {object} galaxy - Nebula galaxy object.
 * @returns {object} Extension property panel configuration.
 */

import getObjectList from "./property-panel/object-list";
import widgetSection from "./property-panel/widget-section";
import themeSection from "./property-panel/theme-section";
import languageSection from "./property-panel/language-section";
import buttonSection from "./property-panel/button-section";
import popupSection from "./property-panel/popup-section";
import menuItemsSection from "./property-panel/menu-items-section";
import tooltipsSection from "./property-panel/tooltips-section";
import documentationSection from "./property-panel/documentation-section";
import securitySection from "./property-panel/security-section";
import aboutSection from "./property-panel/about-section";

export default function ext(_galaxy) {
  return {
    definition: {
      type: "items",
      component: "accordion",
      items: {
        widgetSection,
        themeSection,
        languageSection,
        buttonSection,
        popupSection,
        menuItemsSection,
        tooltipsSection: tooltipsSection(getObjectList),
        documentationSection,
        securitySection,
        aboutSection,
      },
    },
  };
}
