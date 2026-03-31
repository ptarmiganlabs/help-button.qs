/**
 * Menu Items — property panel section.
 *
 * Includes inline bug-report and feedback configuration per item.
 *
 * @module property-panel/menu-items-section
 */

import { toPickerObj } from "../util/color";
import {
  TIMESTAMP_FORMAT_OPTIONS,
  DEFAULT_DIALOG_FORMAT,
  DEFAULT_PAYLOAD_FORMAT,
} from "../util/timestamp-formats";

const menuItemsSection = {
  type: "items",
  label: "Menu Items",
  items: {
    menuItems: {
      ref: "menuItems",
      label: "Menu Items",
      type: "array",
      allowAdd: true,
      allowRemove: true,
      allowMove: true,
      allowDuplicate: true,
      addTranslation: "Add Menu Item",
      itemTitleRef: "label",
      items: {
        label: {
          ref: "label",
          label: "Label",
          type: "string",
          expression: "optional",
          defaultValue: "New item",
          maxlength: 128,
        },
        action: {
          ref: "action",
          label: "Action",
          type: "string",
          component: "dropdown",
          defaultValue: "link",
          options: [
            { value: "link", label: "Open URL" },
            { value: "bugReport", label: "Open Bug Report dialog" },
            { value: "feedback", label: "Open Feedback dialog" },
            { value: "setVariable", label: "Set/Toggle variable" },
          ],
        },
        url: {
          ref: "url",
          label: "URL (supports {{template}} fields)",
          type: "string",
          expression: "optional",
          defaultValue: "https://example.com",
          maxlength: 2048,
          show: (item) => !["bugReport", "feedback", "setVariable"].includes(item.action),
        },
        target: {
          ref: "target",
          label: "Link target",
          type: "string",
          component: "dropdown",
          defaultValue: "_blank",
          options: [
            { value: "_blank", label: "New tab" },
            { value: "_self", label: "Same tab" },
          ],
          show: (item) => !["bugReport", "feedback", "setVariable"].includes(item.action),
        },
        showCondition: {
          ref: "showCondition",
          label: "Show condition",
          type: "string",
          expression: "optional",
          defaultValue: "",
        },
        icon: {
          ref: "icon",
          label: "Icon",
          type: "string",
          component: "dropdown",
          defaultValue: "help",
          options: [
            { value: "help", label: "Help" },
            { value: "info", label: "Info" },
            { value: "bug", label: "Bug" },
            { value: "mail", label: "Mail" },
            { value: "link", label: "Link" },
            { value: "star", label: "Star" },
            { value: "heart", label: "Heart" },
            { value: "toggle", label: "Toggle" },
          ],
        },

        // -- Bug Report Settings (expandable) --
        bugReportSettings: {
          component: "expandable-items",
          label: "Bug Report Settings",
          show: (item) => item.action === "bugReport",
          items: {
            bugReportMain: {
              type: "items",
              label: "Webhook & Auth",
              items: {
                webhookUrl: {
                  ref: "bugReport.webhookUrl",
                  label: "Webhook URL (POST endpoint)",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 2048,
                },
                authStrategy: {
                  ref: "bugReport.authStrategy",
                  label: "Authentication",
                  type: "string",
                  component: "dropdown",
                  defaultValue: "none",
                  options: [
                    { value: "none", label: "None" },
                    { value: "header", label: "Authorization header" },
                    {
                      value: "sense-session",
                      label: "Sense session (XRF key)",
                    },
                    { value: "custom", label: "Custom headers" },
                  ],
                },
                authToken: {
                  ref: "bugReport.authToken",
                  label: "Bearer token",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 8192,
                  show: (item) => item.bugReport?.authStrategy === "header",
                },
                bugReportCustomHeaders: {
                  type: "array",
                  ref: "bugReport.customHeaders",
                  label: "Custom headers",
                  itemTitleRef: "name",
                  allowAdd: true,
                  allowRemove: true,
                  allowMove: true,
                  addTranslation: "Add Header",
                  show: (item) => item.bugReport?.authStrategy === "custom",
                  items: {
                    name: {
                      ref: "name",
                      label: "Header name",
                      type: "string",
                      expression: "optional",
                      defaultValue: "",
                      maxlength: 256,
                    },
                    value: {
                      ref: "value",
                      label: "Header value",
                      type: "string",
                      expression: "optional",
                      defaultValue: "",
                      maxlength: 8192,
                    },
                  },
                },
              },
            },
            bugReportDialog: {
              type: "items",
              label: "Dialog Options",
              items: {
                brEnableSeverity: {
                  ref: "bugReport.enableSeverity",
                  label: "Show severity picker (Low / Medium / High)",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDescriptionMaxLength: {
                  ref: "bugReport.descriptionMaxLength",
                  label: "Max description length (characters)",
                  type: "number",
                  expression: "optional",
                  defaultValue: 1000,
                  min: 1,
                  max: 16384,
                },
                brDialogTitle: {
                  ref: "bugReport.dialogStrings.title",
                  label: "Dialog title override (overrides global)",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 128,
                },
                brDialogTimestampFormat: {
                  ref: "bugReport.dialogTimestampFormat",
                  label: "Dialog timestamp format",
                  type: "string",
                  component: "dropdown",
                  defaultValue: DEFAULT_DIALOG_FORMAT,
                  options: TIMESTAMP_FORMAT_OPTIONS,
                },
                brPayloadTimestampFormat: {
                  ref: "bugReport.payloadTimestampFormat",
                  label: "Payload timestamp format",
                  type: "string",
                  component: "dropdown",
                  defaultValue: DEFAULT_PAYLOAD_FORMAT,
                  options: TIMESTAMP_FORMAT_OPTIONS,
                },
              },
            },
            brDialogFieldsSection: {
              type: "items",
              label: "Show in Dialog",
              items: {
                brDfInfo: {
                  component: "text",
                  label: "Fields visible to the user in the bug report dialog.",
                },
                brDfUserName: {
                  ref: "bugReport.dialogFields.userName",
                  label: "User Name",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfPlatform: {
                  ref: "bugReport.dialogFields.platform",
                  label: "Platform",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfAppId: {
                  ref: "bugReport.dialogFields.appId",
                  label: "App ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfSheetId: {
                  ref: "bugReport.dialogFields.sheetId",
                  label: "Sheet ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfUrlPath: {
                  ref: "bugReport.dialogFields.urlPath",
                  label: "URL Path",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfTimestamp: {
                  ref: "bugReport.dialogFields.timestamp",
                  label: "Timestamp",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfUserId: {
                  ref: "bugReport.dialogFields.userId",
                  label: "User ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfUserDir: {
                  ref: "bugReport.dialogFields.userDirectory",
                  label: "User Directory",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfSenseVer: {
                  ref: "bugReport.dialogFields.senseVersion",
                  label: "Qlik Sense Version",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfBrowser: {
                  ref: "bugReport.dialogFields.browser",
                  label: "Browser",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfTenantId: {
                  ref: "bugReport.dialogFields.tenantId",
                  label: "Tenant ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfStatus: {
                  ref: "bugReport.dialogFields.status",
                  label: "Status",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfPicture: {
                  ref: "bugReport.dialogFields.picture",
                  label: "Picture",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfZoneinfo: {
                  ref: "bugReport.dialogFields.preferredZoneinfo",
                  label: "Preferred Zone Info",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brDfRoles: {
                  ref: "bugReport.dialogFields.roles",
                  label: "Roles",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
              },
            },
            brPayloadFieldsSection: {
              type: "items",
              label: "Include in Payload",
              items: {
                brPfInfo: {
                  component: "text",
                  label:
                    "Fields included in the webhook POST payload (may differ from dialog).",
                },
                brPfUserName: {
                  ref: "bugReport.payloadFields.userName",
                  label: "User Name",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfUserNameKey: {
                  ref: "bugReport.payloadKeyNames.userName",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "userName",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return !pf || pf.userName !== false;
                  },
                },
                brPfPlatform: {
                  ref: "bugReport.payloadFields.platform",
                  label: "Platform",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfPlatformKey: {
                  ref: "bugReport.payloadKeyNames.platform",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "platform",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return !pf || pf.platform !== false;
                  },
                },
                brPfAppId: {
                  ref: "bugReport.payloadFields.appId",
                  label: "App ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfAppIdKey: {
                  ref: "bugReport.payloadKeyNames.appId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "appId",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return !pf || pf.appId !== false;
                  },
                },
                brPfSheetId: {
                  ref: "bugReport.payloadFields.sheetId",
                  label: "Sheet ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfSheetIdKey: {
                  ref: "bugReport.payloadKeyNames.sheetId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "sheetId",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return !pf || pf.sheetId !== false;
                  },
                },
                brPfUrlPath: {
                  ref: "bugReport.payloadFields.urlPath",
                  label: "URL Path",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfUrlPathKey: {
                  ref: "bugReport.payloadKeyNames.urlPath",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "urlPath",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return !pf || pf.urlPath !== false;
                  },
                },
                brPfTimestamp: {
                  ref: "bugReport.payloadFields.timestamp",
                  label: "Timestamp",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfTimestampKey: {
                  ref: "bugReport.payloadKeyNames.timestamp",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "timestamp",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return !pf || pf.timestamp !== false;
                  },
                },
                brPfUserId: {
                  ref: "bugReport.payloadFields.userId",
                  label: "User ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfUserIdKey: {
                  ref: "bugReport.payloadKeyNames.userId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "userId",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.userId === true;
                  },
                },
                brPfUserDir: {
                  ref: "bugReport.payloadFields.userDirectory",
                  label: "User Directory",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfUserDirKey: {
                  ref: "bugReport.payloadKeyNames.userDirectory",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "userDirectory",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.userDirectory === true;
                  },
                },
                brPfSenseVer: {
                  ref: "bugReport.payloadFields.senseVersion",
                  label: "Qlik Sense Version",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfSenseVerKey: {
                  ref: "bugReport.payloadKeyNames.senseVersion",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "senseVersion",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.senseVersion === true;
                  },
                },
                brPfBrowser: {
                  ref: "bugReport.payloadFields.browser",
                  label: "Browser",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfBrowserKey: {
                  ref: "bugReport.payloadKeyNames.browser",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "browser",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.browser === true;
                  },
                },
                brPfTenantId: {
                  ref: "bugReport.payloadFields.tenantId",
                  label: "Tenant ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfTenantIdKey: {
                  ref: "bugReport.payloadKeyNames.tenantId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "tenantId",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.tenantId === true;
                  },
                },
                brPfStatus: {
                  ref: "bugReport.payloadFields.status",
                  label: "Status",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfStatusKey: {
                  ref: "bugReport.payloadKeyNames.status",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "status",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.status === true;
                  },
                },
                brPfPicture: {
                  ref: "bugReport.payloadFields.picture",
                  label: "Picture",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfPictureKey: {
                  ref: "bugReport.payloadKeyNames.picture",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "picture",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.picture === true;
                  },
                },
                brPfZoneinfo: {
                  ref: "bugReport.payloadFields.preferredZoneinfo",
                  label: "Preferred Zone Info",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfZoneinfoKey: {
                  ref: "bugReport.payloadKeyNames.preferredZoneinfo",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "preferredZoneinfo",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.preferredZoneinfo === true;
                  },
                },
                brPfRoles: {
                  ref: "bugReport.payloadFields.roles",
                  label: "Roles",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                brPfRolesKey: {
                  ref: "bugReport.payloadKeyNames.roles",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "roles",
                  show: (item) => {
                    const pf = item.bugReport && item.bugReport.payloadFields;
                    return pf && pf.roles === true;
                  },
                },
              },
            },
          },
        },

        // -- Feedback Settings (expandable) --
        feedbackSettings: {
          component: "expandable-items",
          label: "Feedback Settings",
          show: (item) => item.action === "feedback",
          items: {
            feedbackMain: {
              type: "items",
              label: "Webhook & Auth",
              items: {
                feedbackWebhookUrl: {
                  ref: "feedback.webhookUrl",
                  label: "Webhook URL (POST endpoint)",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 2048,
                },
                feedbackAuthStrategy: {
                  ref: "feedback.authStrategy",
                  label: "Authentication",
                  type: "string",
                  component: "dropdown",
                  defaultValue: "none",
                  options: [
                    { value: "none", label: "None" },
                    { value: "header", label: "Authorization header" },
                    {
                      value: "sense-session",
                      label: "Sense session (XRF key)",
                    },
                    { value: "custom", label: "Custom headers" },
                  ],
                },
                feedbackAuthToken: {
                  ref: "feedback.authToken",
                  label: "Bearer token",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 8192,
                  show: (item) => item.feedback?.authStrategy === "header",
                },
                feedbackCustomHeaders: {
                  type: "array",
                  ref: "feedback.customHeaders",
                  label: "Custom headers",
                  itemTitleRef: "name",
                  allowAdd: true,
                  allowRemove: true,
                  allowMove: true,
                  addTranslation: "Add Header",
                  show: (item) => item.feedback?.authStrategy === "custom",
                  items: {
                    name: {
                      ref: "name",
                      label: "Header name",
                      type: "string",
                      expression: "optional",
                      defaultValue: "",
                    },
                    value: {
                      ref: "value",
                      label: "Header value",
                      type: "string",
                      expression: "optional",
                      defaultValue: "",
                    },
                  },
                },
              },
            },
            feedbackDialog: {
              type: "items",
              label: "Dialog Options",
              items: {
                feedbackEnableRating: {
                  ref: "feedback.enableRating",
                  label: "Show star rating (1-5)",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                feedbackEnableComment: {
                  ref: "feedback.enableComment",
                  label: "Show free-text comment field",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                feedbackCommentMaxLength: {
                  ref: "feedback.commentMaxLength",
                  label: "Max comment length (characters)",
                  type: "number",
                  defaultValue: 500,
                  min: 1,
                  max: 16384,
                  show: (item) => item.feedback?.enableComment !== false,
                },
                feedbackDialogTitle: {
                  ref: "feedback.dialogStrings.title",
                  label: "Dialog title override (overrides global)",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 128,
                },
                feedbackDialogTimestampFormat: {
                  ref: "feedback.dialogTimestampFormat",
                  label: "Dialog timestamp format",
                  type: "string",
                  component: "dropdown",
                  defaultValue: DEFAULT_DIALOG_FORMAT,
                  options: TIMESTAMP_FORMAT_OPTIONS,
                },
                feedbackPayloadTimestampFormat: {
                  ref: "feedback.payloadTimestampFormat",
                  label: "Payload timestamp format",
                  type: "string",
                  component: "dropdown",
                  defaultValue: DEFAULT_PAYLOAD_FORMAT,
                  options: TIMESTAMP_FORMAT_OPTIONS,
                },
              },
            },
            dialogFieldsSection: {
              type: "items",
              label: "Show in Dialog",
              items: {
                dfInfo: {
                  component: "text",
                  label: "Fields visible to the user in the feedback dialog.",
                },
                dfUserName: {
                  ref: "feedback.dialogFields.userName",
                  label: "User Name",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfPlatform: {
                  ref: "feedback.dialogFields.platform",
                  label: "Platform",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfAppId: {
                  ref: "feedback.dialogFields.appId",
                  label: "App ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfSheetId: {
                  ref: "feedback.dialogFields.sheetId",
                  label: "Sheet ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfUrlPath: {
                  ref: "feedback.dialogFields.urlPath",
                  label: "URL Path",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfTimestamp: {
                  ref: "feedback.dialogFields.timestamp",
                  label: "Timestamp",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfUserId: {
                  ref: "feedback.dialogFields.userId",
                  label: "User ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfUserDir: {
                  ref: "feedback.dialogFields.userDirectory",
                  label: "User Directory",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfSenseVer: {
                  ref: "feedback.dialogFields.senseVersion",
                  label: "Qlik Sense Version",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfBrowser: {
                  ref: "feedback.dialogFields.browser",
                  label: "Browser",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfTenantId: {
                  ref: "feedback.dialogFields.tenantId",
                  label: "Tenant ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfStatus: {
                  ref: "feedback.dialogFields.status",
                  label: "Status",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfPicture: {
                  ref: "feedback.dialogFields.picture",
                  label: "Picture",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfZoneinfo: {
                  ref: "feedback.dialogFields.preferredZoneinfo",
                  label: "Preferred Zone Info",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                dfRoles: {
                  ref: "feedback.dialogFields.roles",
                  label: "Roles",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
              },
            },
            payloadFieldsSection: {
              type: "items",
              label: "Include in Payload",
              items: {
                pfInfo: {
                  component: "text",
                  label:
                    "Fields included in the webhook POST payload (may differ from dialog).",
                },
                pfUserName: {
                  ref: "feedback.payloadFields.userName",
                  label: "User Name",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfUserNameKey: {
                  ref: "feedback.payloadKeyNames.userName",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "userName",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return !pf || pf.userName !== false;
                  },
                },
                pfPlatform: {
                  ref: "feedback.payloadFields.platform",
                  label: "Platform",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfPlatformKey: {
                  ref: "feedback.payloadKeyNames.platform",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "platform",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return !pf || pf.platform !== false;
                  },
                },
                pfAppId: {
                  ref: "feedback.payloadFields.appId",
                  label: "App ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfAppIdKey: {
                  ref: "feedback.payloadKeyNames.appId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "appId",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return !pf || pf.appId !== false;
                  },
                },
                pfSheetId: {
                  ref: "feedback.payloadFields.sheetId",
                  label: "Sheet ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfSheetIdKey: {
                  ref: "feedback.payloadKeyNames.sheetId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "sheetId",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return !pf || pf.sheetId !== false;
                  },
                },
                pfUrlPath: {
                  ref: "feedback.payloadFields.urlPath",
                  label: "URL Path",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfUrlPathKey: {
                  ref: "feedback.payloadKeyNames.urlPath",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "urlPath",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return !pf || pf.urlPath !== false;
                  },
                },
                pfTimestamp: {
                  ref: "feedback.payloadFields.timestamp",
                  label: "Timestamp",
                  type: "boolean",
                  component: "switch",
                  defaultValue: true,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfTimestampKey: {
                  ref: "feedback.payloadKeyNames.timestamp",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "timestamp",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return !pf || pf.timestamp !== false;
                  },
                },
                pfUserId: {
                  ref: "feedback.payloadFields.userId",
                  label: "User ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfUserIdKey: {
                  ref: "feedback.payloadKeyNames.userId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "userId",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.userId === true;
                  },
                },
                pfUserDir: {
                  ref: "feedback.payloadFields.userDirectory",
                  label: "User Directory",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfUserDirKey: {
                  ref: "feedback.payloadKeyNames.userDirectory",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "userDirectory",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.userDirectory === true;
                  },
                },
                pfSenseVer: {
                  ref: "feedback.payloadFields.senseVersion",
                  label: "Qlik Sense Version",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfSenseVerKey: {
                  ref: "feedback.payloadKeyNames.senseVersion",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "senseVersion",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.senseVersion === true;
                  },
                },
                pfBrowser: {
                  ref: "feedback.payloadFields.browser",
                  label: "Browser",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfBrowserKey: {
                  ref: "feedback.payloadKeyNames.browser",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "browser",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.browser === true;
                  },
                },
                pfTenantId: {
                  ref: "feedback.payloadFields.tenantId",
                  label: "Tenant ID",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfTenantIdKey: {
                  ref: "feedback.payloadKeyNames.tenantId",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "tenantId",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.tenantId === true;
                  },
                },
                pfStatus: {
                  ref: "feedback.payloadFields.status",
                  label: "Status",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfStatusKey: {
                  ref: "feedback.payloadKeyNames.status",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "status",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.status === true;
                  },
                },
                pfPicture: {
                  ref: "feedback.payloadFields.picture",
                  label: "Picture",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfPictureKey: {
                  ref: "feedback.payloadKeyNames.picture",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "picture",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.picture === true;
                  },
                },
                pfZoneinfo: {
                  ref: "feedback.payloadFields.preferredZoneinfo",
                  label: "Preferred Zone Info",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfZoneinfoKey: {
                  ref: "feedback.payloadKeyNames.preferredZoneinfo",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "preferredZoneinfo",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.preferredZoneinfo === true;
                  },
                },
                pfRoles: {
                  ref: "feedback.payloadFields.roles",
                  label: "Roles",
                  type: "boolean",
                  component: "switch",
                  defaultValue: false,
                  options: [
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ],
                },
                pfRolesKey: {
                  ref: "feedback.payloadKeyNames.roles",
                  label: "Payload key name",
                  type: "string",
                  defaultValue: "roles",
                  show: (item) => {
                    const pf = item.feedback && item.feedback.payloadFields;
                    return pf && pf.roles === true;
                  },
                },
              },
            },
          },
        },

        // -- Variable Settings (expandable) --
        variableSettings: {
          component: "expandable-items",
          label: "Variable Settings",
          show: (item) => item.action === "setVariable",
          items: {
            variableMain: {
              type: "items",
              label: "Mode & Variables",
              items: {
                variableMode: {
                  ref: "variableAction.mode",
                  label: "Mode",
                  type: "string",
                  component: "dropdown",
                  defaultValue: "set",
                  options: [
                    { value: "set", label: "Set variable(s)" },
                    { value: "toggle", label: "Toggle variable" },
                  ],
                },
                // -- Set mode: array of variable assignments --
                variableAssignments: {
                  ref: "variableAction.variableAssignments",
                  label: "Variable Assignments",
                  type: "array",
                  allowAdd: true,
                  allowRemove: true,
                  allowMove: true,
                  addTranslation: "Add Assignment",
                  itemTitleRef: "variableName",
                  show: (item) =>
                    !item.variableAction ||
                    !item.variableAction.mode ||
                    item.variableAction.mode === "set",
                  items: {
                    variableName: {
                      ref: "variableName",
                      label: "Variable name",
                      type: "string",
                      defaultValue: "",
                      maxlength: 256,
                    },
                    variableValue: {
                      ref: "variableValue",
                      label: "Value",
                      type: "string",
                      expression: "optional",
                      defaultValue: "",
                      maxlength: 4096,
                    },
                  },
                },
                // -- Toggle mode: single variable with two values --
                toggleVariableName: {
                  ref: "variableAction.variableName",
                  label: "Variable name",
                  type: "string",
                  defaultValue: "",
                  maxlength: 256,
                  show: (item) =>
                    item.variableAction &&
                    item.variableAction.mode === "toggle",
                },
                toggleValue1: {
                  ref: "variableAction.toggleValue1",
                  label: "Value A",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 4096,
                  show: (item) =>
                    item.variableAction &&
                    item.variableAction.mode === "toggle",
                },
                toggleValue2: {
                  ref: "variableAction.toggleValue2",
                  label: "Value B",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 4096,
                  show: (item) =>
                    item.variableAction &&
                    item.variableAction.mode === "toggle",
                },
                toggleDefault: {
                  ref: "variableAction.toggleDefault",
                  label: "Default value (safety net)",
                  type: "string",
                  expression: "optional",
                  defaultValue: "",
                  maxlength: 4096,
                  show: (item) =>
                    item.variableAction &&
                    item.variableAction.mode === "toggle",
                },
              },
            },
          },
        },

        // -- Per-item colors (expandable) --
        itemColors: {
          component: "expandable-items",
          label: "Item Colors",
          items: {
            itemColorsMain: {
              type: "items",
              label: "Colors",
              items: {
                iconColor: {
                  ref: "iconColor",
                  label: "Icon",
                  type: "object",
                  component: "color-picker",
                  defaultValue: toPickerObj("#165a9b"),
                },
                bgColor: {
                  ref: "bgColor",
                  label: "Background",
                  type: "object",
                  component: "color-picker",
                  defaultValue: toPickerObj("#f0f6fc"),
                },
                bgColorHover: {
                  ref: "bgColorHover",
                  label: "Hover background",
                  type: "object",
                  component: "color-picker",
                  defaultValue: toPickerObj("#dbeafe"),
                },
                textColor: {
                  ref: "textColor",
                  label: "Text",
                  type: "object",
                  component: "color-picker",
                  defaultValue: toPickerObj("#0c3256"),
                },
              },
            },
          },
        },
      },
    },
  },
};

export default menuItemsSection;
