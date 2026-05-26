/**
 * Documentation — property panel section.
 *
 * @module property-panel/documentation-section
 */

const documentationSection = {
  component: "expandable-items",
  label: "Documentation",
  items: {
    templateFieldsSection: {
      type: "items",
      label: "URL Template Fields",
      items: {
        templateIntro: {
          component: "text",
          label:
            "Use these placeholders in menu-item URLs and webhook URLs. They are replaced at runtime with actual values.",
        },
        generalFields: {
          type: "items",
          label: "General (all platforms)",
          items: {
            templateAppId: {
              component: "text",
              label: "{{appId}} — Current app GUID",
            },
            templateSheetId: {
              component: "text",
              label: "{{sheetId}} — Current sheet ID",
            },
          },
        },
        clientManagedFields: {
          type: "items",
          label: "Client Managed",
          items: {
            templateCmUserId: {
              component: "text",
              label: "{{userId}} — Logged-in user ID",
            },
            templateCmUserDir: {
              component: "text",
              label: "{{userDirectory}} — User directory (e.g. INTERNAL)",
            },
          },
        },
        cloudFields: {
          type: "items",
          label: "Cloud",
          items: {
            templateCloudUserId: {
              component: "text",
              label: "{{userId}} — User email address",
            },
            templateCloudUserDir: {
              component: "text",
              label: "{{userDirectory}} — Not applicable (empty string)",
            },
          },
        },
        exampleFields: {
          type: "items",
          label: "Example",
          items: {
            templateExample: {
              component: "text",
              label:
                "https://jira.example.com/create?app={{appId}}&user={{userId}}",
            },
          },
        },
      },
    },
  },
};

export default documentationSection;
