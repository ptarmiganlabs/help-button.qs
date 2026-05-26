/**
 * Qlik Sense Help Button (Bug Report Variant) — Configuration
 * =============================================================
 * Load this file BEFORE helpbutton-qs.js to customise the button behaviour.
 *
 * Usage in Qlik Sense client.html (add before </body>):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * All properties are optional. Only set the ones you want to override.
 * Default colors use a professional blue & yellow palette.
 *
 * @see README.md for full documentation.
 */
window.helpButtonQsConfig = {
  // --------------------------------------------------------------------------
  // Toolbar button — text & tooltip
  // --------------------------------------------------------------------------

  /** Text shown on the toolbar button */
  buttonLabel: 'Help',

  /** Native browser tooltip on hover */
  buttonTooltip: 'Open help menu',

  /** Icon for the toolbar button: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Toolbar button — colors / style
  // --------------------------------------------------------------------------
  buttonStyle: {
    backgroundColor: '#165a9b',
    backgroundColorHover: '#12487c',
    backgroundColorActive: '#0e3b65',
    textColor: '#ffffff',
    borderColor: '#0e3b65',
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)',
  },

  // --------------------------------------------------------------------------
  // Popup — header & chrome
  // --------------------------------------------------------------------------

  /** Heading displayed at the top of the dropdown popup */
  popupTitle: 'Need assistance?',

  /** Popup colors — dark-blue header with yellow text */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',
    headerTextColor: '#ffcc33',
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Menu items
  // --------------------------------------------------------------------------
  // Each entry creates a link in the dropdown popup.
  //
  // Standard link items:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Bug-report action items:
  //   Set action: 'bugReport' instead of a url. Clicking this item opens
  //   the bug-report dialog instead of navigating to a URL.
  //
  // Template fields: URLs can contain {{…}} placeholders that are resolved
  // dynamically at click time using Qlik Sense context:
  //   {{userDirectory}} — User directory (e.g. "CORP")
  //   {{userId}}        — User ID (e.g. "jsmith")
  //   {{appId}}         — Current app GUID
  //   {{sheetId}}       — Current sheet ID
  // See docs/template-fields.md for full documentation.
  //
  menuItems: [
    {
      label: 'Help & documentation',
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      // Per-item colors (blue tint)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Report a bug',
      action: 'bugReport',       // <-- Opens the bug-report dialog
      icon: 'bug',
      // Per-item colors (warm amber tint)
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
    // -- Example: additional standard link items --
    // {                                    // ← Template field example
    //   label:  'App-specific help',
    //   url:    'https://help.example.com/apps/{{appId}}/sheets/{{sheetId}}',
    //   icon:   'info',
    //   target: '_blank',
    //   iconColor:    '#7c3aed',
    //   bgColor:      '#f5f3ff',
    //   bgColorHover: '#ede9fe',
    //   textColor:    '#5b21b6',
    // },
    // {
    //   label:  'Ptarmigan Labs',
    //   url:    'https://ptarmiganlabs.com',
    //   icon:   'link',
    //   target: '_blank',
    //   iconColor:    '#059669',
    //   bgColor:      '#ecfdf5',
    //   bgColorHover: '#d1fae5',
    //   textColor:    '#065f46',
    // },
  ],

  // --------------------------------------------------------------------------
  // Bug Report settings
  // --------------------------------------------------------------------------
  bugReport: {
    /** Title shown at the top of the bug-report dialog */
    dialogTitle: 'Report a Bug',

    /**
     * REQUIRED — The URL to POST the bug report JSON payload to.
     * Examples:
     *   'http://localhost:3000/api/bug-reports'               (demo server)
     *   'https://localhost:3443/api/bug-reports'              (demo server)
     *   'https://hooks.example.com/services/T00/B00/xxx'      (Slack/Teams)
     *   'https://jira.example.com/rest/api/2/issue'           (Jira)
     *   'https://your-server.com/api/bug-reports'             (custom REST)
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** HTTP method for the webhook call (default: POST) */
    webhookMethod: 'POST',

    /**
     * Authentication strategy for the webhook call.
     *
     * type: 'none'           — No authentication (rely on network-level security)
     * type: 'header'         — Send a single custom header (e.g., Authorization: Bearer …)
     * type: 'sense-session'  — Forward the Qlik Sense session cookie + add XRF key header
     * type: 'custom'         — Send arbitrary headers from the customHeaders object
     */
    auth: {
      type: 'none',

      // -- For type: 'header' --
      // headerName:  'Authorization',
      // headerValue: 'Bearer YOUR_TOKEN_HERE',

      // -- For type: 'custom' --
      // customHeaders: {
      //   'Authorization': 'Bearer YOUR_TOKEN_HERE',
      //   'X-Custom-Header': 'some-value',
      // },
    },

    /**
     * Which context fields to collect and show in the dialog.
     * Available: 'userId', 'userName', 'userDirectory', 'senseVersion',
     *            'appId', 'sheetId', 'urlPath'
     * Remove entries you don't need, or reorder as desired.
     */
    collectFields: [
      'userName',
      'userDirectory',
      'userId',
      'senseVersion',
      'appId',
      'sheetId',
      'urlPath',
    ],

    /** Placeholder text for the description textarea */
    descriptionPlaceholder: 'Describe the issue you encountered…',

    /** Toast messages shown after submit */
    successMessage: 'Bug report submitted successfully!',
    errorMessage: 'Failed to submit bug report.',

    // -- Dialog text overrides (for localisation / custom wording) --
    // All text strings shown in the bug-report dialog are configurable.
    // Uncomment any line below to override the default English text.

    /** Label shown above the description textarea */
    // descriptionLabel: 'Description *',

    /** Text on the Cancel button */
    // cancelButtonText: 'Cancel',

    /** Text on the Submit button */
    // submitButtonText: 'Submit',

    /** Text shown on the Submit button while the report is being sent */
    // submittingButtonText: 'Submitting…',

    /** Text shown while loading environment context */
    // loadingMessage: 'Gathering environment info…',

    /** Aria-label for the close (×) button in the dialog header */
    // closeDialogAriaLabel: 'Close dialog',

    /** Labels for each context field shown in the dialog.
     *  Keys must match the entries in collectFields above. */
    // fieldLabels: {
    //   userId: 'User ID',
    //   userName: 'User Name',
    //   userDirectory: 'User Directory',
    //   senseVersion: 'Qlik Sense Version',
    //   appId: 'App ID',
    //   sheetId: 'Sheet ID',
    //   urlPath: 'URL Path',
    // },

    // -- Dialog style overrides (rarely need changing) --
    // dialogStyle: {
    //   overlayColor: 'rgba(0, 0, 0, 0.5)',
    //   backgroundColor: '#ffffff',
    //   borderColor: '#0c3256',
    //   borderRadius: '10px',
    //   headerBackgroundColor: '#0c3256',
    //   headerTextColor: '#ffcc33',
    //   primaryButtonBg: '#165a9b',
    //   primaryButtonText: '#ffffff',
    //   primaryButtonHoverBg: '#12487c',
    //   cancelButtonBg: '#e5e7eb',
    //   cancelButtonText: '#374151',
    //   cancelButtonHoverBg: '#d1d5db',
    //   inputBorderColor: '#d1d5db',
    //   inputBorderFocusColor: '#165a9b',
    //   labelColor: '#374151',
    //   shadowColor: 'rgba(12, 50, 86, 0.3)',
    // },
  },

  // --------------------------------------------------------------------------
  // Advanced / injection settings (rarely need changing)
  // --------------------------------------------------------------------------

  /** CSS selector for the toolbar container to inject into */
  // anchorSelector: '#top-bar-right-side',

  /** Polling interval in ms while waiting for the toolbar to render */
  // pollInterval: 500,

  /** Max time in ms to wait for the toolbar before giving up */
  // timeout: 30000,

  /** Set to true to enable console debug logging */
  debug: false,
};
