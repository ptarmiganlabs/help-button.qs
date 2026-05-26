/**
 * About — property panel section.
 *
 * @module property-panel/about-section
 */

import { PACKAGE_VERSION, BUILD_DATE } from "../util/logger";

const aboutSection = {
  type: "items",
  label: "About",
  items: {
    headerText: {
      component: "text",
      label: `HelpButton.qs v${PACKAGE_VERSION}`,
    },
    buildDate: {
      component: "text",
      label: `Built ${BUILD_DATE}`,
    },
    description: {
      component: "text",
      label: "Configurable help button for Qlik Sense apps. Brought to you by Ptarmigan Labs.",
    },
    linkGithub: {
      component: "link",
      label: "GitHub — docs & source",
      url: "https://github.com/ptarmiganlabs/help-button.qs",
    },
    linkIssues: {
      component: "link",
      label: "Report a bug / request a feature",
      url: "https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose",
    },
    linkPtarmigan: {
      component: "link",
      label: "Ptarmigan Labs",
      url: "https://ptarmiganlabs.com",
    },
  },
};

export default aboutSection;
