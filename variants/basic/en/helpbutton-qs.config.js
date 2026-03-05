/**
 * Qlik Sense Help Button — Configuration
 * =======================================
 * Load this file BEFORE qs-help-button.js to customise the button behaviour.
 *
 * Usage in Qlik Sense client.html (add before </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * All properties are optional. Only set the ones you want to override.
 * Default colors use a professional blue & yellow palette.
 *
 * @see README.md for full documentation.
 */
window.qsHelpButtonConfig = {
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
  // The main button that sits in the Qlik Sense toolbar.
  // All colors below default to a professional blue style.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Primary blue
    backgroundColorHover: '#12487c',   // Darker on hover
    backgroundColorActive: '#0e3b65',  // Darkest on click
    textColor: '#ffffff',              // White text & icon
    borderColor: '#0e3b65',            // Subtle dark border
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Yellow focus ring
  },

  // --------------------------------------------------------------------------
  // Popup — header & chrome
  // --------------------------------------------------------------------------

  /** Heading displayed at the top of the dropdown popup */
  popupTitle: 'Need assistance?',

  /** Popup colors — dark-blue header with yellow text */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Dark navy border
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Dark navy header
    headerTextColor: '#ffcc33',        // Yellow header text
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Menu items
  // --------------------------------------------------------------------------
  // Each entry creates a link in the dropdown popup.
  //
  // Properties (all optional except label & url):
  //   label        (string)  — Display text
  //   url          (string)  — Link URL
  //   icon         (string)  — One of: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Link target, e.g. '_blank' (default) or '_self'
  //   iconColor    (string)  — Color of the icon (CSS color)
  //   bgColor      (string)  — Background color of item
  //   bgColorHover (string)  — Background color on hover
  //   textColor    (string)  — Text color
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
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
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
      url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Per-item colors (warm amber tint)
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
    {
      label:  'Ptarmigan Labs',
      url:    'https://ptarmiganlabs.com',
      icon:   'link',
      target: '_blank',
      // Per-item colors (green tint)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
    // -- Examples of additional items you can add: --
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
    //   label:  'Contact support',
    //   url:    'mailto:support@example.com',
    //   icon:   'mail',
    //   target: '_self',
    //   iconColor:    '#059669',
    //   bgColor:      '#ecfdf5',
    //   bgColorHover: '#d1fae5',
    //   textColor:    '#065f46',
    // },
    // {
    //   label:  'Release notes',
    //   url:    'https://wiki.example.com/release-notes',
    //   icon:   'info',
    //   target: '_blank',
    //   iconColor:    '#7c3aed',
    //   bgColor:      '#f5f3ff',
    //   bgColorHover: '#ede9fe',
    //   textColor:    '#5b21b6',
    // },
  ],

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
