/**
 * Qlik Sense Help Button
 * ======================
 * A self-contained script that injects a configurable "Help" button into the
 * Qlik Sense Enterprise (client-managed) toolbar, positioned to the left of
 * the "Ask Insight Advisor" search box.
 *
 * Deployment:
 *   1. Place this file in C:\Program Files\Qlik\Sense\Client\custom\.
 *   2. Add a <script> tag to the Sense client's client.html.
 *   See README.md for full instructions.
 *
 * Configuration:
 *   Set window.helpButtonQsConfig BEFORE this script loads, or load
 *   helpbutton-qs.config.js first. See helpbutton-qs.config.js for options.
 *
 * Compatible with Qlik Sense Enterprise on Windows (client-managed).
 * Tested with versions
 *   - 8.527.8 (2025 November, IR)
 *
 * @version 2.7.0 // x-release-please-version
 * @license MIT
 * @see https://github.com/ptarmiganlabs/help-button.qs
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration (merged with window.helpButtonQsConfig if present)
  // ---------------------------------------------------------------------------
  var DEFAULT_CONFIG = {
    // -- Button appearance --
    buttonLabel: 'Help',
    buttonTooltip: 'Open help menu',
    buttonIcon: 'help',

    // -- Toolbar button colors --
    buttonStyle: {
      backgroundColor: '#165a9b',       // Primary blue
      backgroundColorHover: '#12487c',  // Darker blue on hover
      backgroundColorActive: '#0e3b65', // Darkest blue on press
      textColor: '#ffffff',             // White text
      borderColor: '#0e3b65',           // Dark blue border
      borderRadius: '4px',
      focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Yellow glow
    },

    // -- Popup appearance --
    popupTitle: 'Need assistance?',
    popupStyle: {
      backgroundColor: '#ffffff',
      borderColor: '#0c3256',           // Dark blue border
      borderRadius: '8px',
      headerBackgroundColor: '#0c3256', // Dark navy header
      headerTextColor: '#ffcc33',       // Yellow header text
      separatorColor: '#e0e0e0',
      shadowColor: 'rgba(12, 50, 86, 0.25)',
    },

    // -- Menu items --
    // Each item: { label, url, icon, target, iconColor, bgColor, bgColorHover, textColor }
    // All color properties are optional — sensible defaults are applied.
    menuItems: [
      {
        label: 'Help documentation',
        url: 'https://help.example.com',
        icon: 'help',
        target: '_blank',
        iconColor: '#165a9b',
        bgColor: '#f0f6fc',
        bgColorHover: '#dbeafe',
        textColor: '#0c3256',
      },
      {
        label: 'Report a bug',
        url: 'https://bugs.example.com/report',
        icon: 'bug',
        target: '_blank',
        iconColor: '#b45309',
        bgColor: '#fffbeb',
        bgColorHover: '#fef3c7',
        textColor: '#78350f',
      },
    ],

    // -- Injection --
    anchorSelector: '#top-bar-right-side',
    pollInterval: 500,
    timeout: 30000,
    debug: false,
  };

  // Merge user config (deep merge for nested style objects)
  var cfg = deepMerge(DEFAULT_CONFIG, window.helpButtonQsConfig || {});

  // ---------------------------------------------------------------------------
  // SVG icon library (16×16 viewBox)
  // ---------------------------------------------------------------------------
var ICONS = {
    help:
      '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z' +
      'm-.5-3h1v1h-1V11zm.5-7a2.5 2.5 0 0 0-2.5 2.5h1A1.5 1.5 0 0 1 8 5a1.5 1.5 0 0 1 1.5 1.5' +
      'c0 .827-.673 1.5-1.5 1.5-.276 0-.5.224-.5.5V10h1v-.645A2.5 2.5 0 0 0 8 4z"/>',
    bug:
      '<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6' +
      's2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-.5-9h1v5h-1V5zm0 6h1v1h-1v-1z"/>',
    info:
      '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z' +
      'M7.5 5h1v1h-1V5zm0 2h1v4h-1V7z"/>',
    mail:
      '<path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z' +
      'm-.2 1L8 8.5 2.2 4zM2 12V4.9l6 4.6 6-4.6V12z"/>',
    link:
      '<path d="M6.9 11.1a.5.5 0 0 1-.7 0l-1.3-1.3a3 3 0 0 1 0-4.2L6.2 4.3a3 3 0 0 1 4.2 0' +
      'l1.3 1.3a.5.5 0 0 1-.7.7L9.7 5a2 2 0 0 0-2.8 0L5.6 6.3a2 2 0 0 0 0 2.8l1.3 1.3' +
      'a.5.5 0 0 1 0 .7zm2.2-6.2a.5.5 0 0 1 .7 0l1.3 1.3a3 3 0 0 1 0 4.2l-1.3 1.3' +
      'a3 3 0 0 1-4.2 0L4.3 10.4a.5.5 0 0 1 .7-.7l1.3 1.3a2 2 0 0 0 2.8 0l1.3-1.3' +
      'a2 2 0 0 0 0-2.8L9.1 5.6a.5.5 0 0 1 0-.7z"/>',
    star:
      '<path d="M8 1.25l1.75 3.55 3.92.57-2.84 2.77.67 3.91L8 10.27l-3.5 1.78.67-3.91' +
      'L2.33 5.37l3.92-.57L8 1.25z"/>',
    heart:
      '<path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385' +
      '.92 1.815 2.834 3.989 6.286 6.562 3.452-2.573 5.365-4.747 6.286-6.562.955-1.886' +
      '.837-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>',
    lightbulb:
      '<path d="M8 1a4.5 4.5 0 0 0-1.5 8.74V11.5a1.5 1.5 0 0 0 3 0V9.74A4.5 4.5 0 0 0 8 1z' +
      'm0 1a3.5 3.5 0 0 1 1.07 6.835.5.5 0 0 0-.32.235.5.5 0 0 0-.25.43v2a.5.5 0 0 1-1 0v-2' +
      'a.5.5 0 0 0-.57-.665A3.5 3.5 0 0 1 8 2zM6.5 13a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>',
    bookmark:
      '<path d="M3 1.5A1.5 1.5 0 0 1 4.5 0h7A1.5 1.5 0 0 1 13 1.5v13a.5.5 0 0 1-.74.44L8 12.47' +
      'l-4.26 2.47A.5.5 0 0 1 3 14.5zM4.5 1a.5.5 0 0 0-.5.5v12.04l3.76-2.18a.5.5 0 0 1 .48 0' +
      'L12 13.54V1.5a.5.5 0 0 0-.5-.5z"/>',
    eye:
      '<path d="M8 3.5C4.36 3.5 1.26 6.1.05 7.72a.5.5 0 0 0 0 .56C1.26 9.9 4.36 12.5 8 12.5' +
      's6.74-2.6 7.95-4.22a.5.5 0 0 0 0-.56C14.74 6.1 11.64 3.5 8 3.5zM1.11 8C2.26 6.52 5.02' +
      ' 4.5 8 4.5s5.74 2.02 6.89 3.5C13.74 9.48 10.98 11.5 8 11.5S2.26 9.48 1.11 8zM8 5.5' +
      'a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>',
    pin:
      '<path d="M9.828 2.172a2 2 0 0 1 2.828 0l1.172 1.172a2 2 0 0 1 0 2.828L11.5 8.5l.354.354' +
      'a.5.5 0 0 1-.354.853H8.707L6.854 11.56a.5.5 0 0 1-.708 0L2.44 7.854a.5.5 0 0 1 0-.708' +
      'L4.293 5.293V2.5a.5.5 0 0 1 .853-.354L5.5 2.5zM5.293 3.707v1.879a.5.5 0 0 1-.147.354' +
      'L3.56 7.5 6.5 10.44l1.56-1.586a.5.5 0 0 1 .354-.147h1.879l1.879-1.879a1 1 0 0 0 0-1.414' +
      'l-1.172-1.172a1 1 0 0 0-1.414 0z"/>',
    'chart-bar':
      '<path d="M1 14h14v1H1zM3 4h2v9H3zm4-3h2v12H7zm4 5h2v7h-2z"/>',
    toggle:
      '<path d="M5.5 4A3.5 3.5 0 0 0 2 7.5v1A3.5 3.5 0 0 0 5.5 12h5a3.5 3.5 0 0 0 3.5-3.5v-1 ' +
      'A3.5 3.5 0 0 0 10.5 4h-5zM3 7.5A2.5 2.5 0 0 1 5.5 5h5A2.5 2.5 0 0 1 13 7.5v1 ' +
      'a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 8.5v-1z"/>' +
      '<circle cx="10.5" cy="8" r="2"/>',
    user:
      '<path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0z' +
      'm-1.5 7A2.5 2.5 0 0 1 7 8.5h2A2.5 2.5 0 0 1 11.5 11v1.5a.5.5 0 0 1-1 0V11' +
      'A1.5 1.5 0 0 0 9 9.5H7A1.5 1.5 0 0 0 5.5 11v1.5a.5.5 0 0 1-1 0V11z"/>',
    flash:
      '<path d="M9.5 1a.5.5 0 0 1 .443.27l.014.03L10 1.5v.01l-.003.04-.013.09-.055.27' +
      '-.082.31L9.5 3.5H13a.5.5 0 0 1 .39.812l-.05.05L7.5 11V8.5H4a.5.5 0 0 1-.4-.8' +
      'l4-5.5A.5.5 0 0 1 8 2h.003L8.5 2l.028.002L9.5 1zM8.75 3L5.5 7.5h2.75a.5.5 0 0 1 .5.5' +
      'v1.25L12 5.5H9a.5.5 0 0 1-.47-.67L8.75 3z"/>',
    home:
      '<path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 2 8h1v5.5a.5.5 0 0 0 .5.5h3' +
      'a.5.5 0 0 0 .5-.5V10h2v3.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V8h1a.5.5 0 0 0' +
      ' .354-.854l-6-6zM13 7l-5-5-5 5h.5v6h2v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5' +
      'V13h2V7z"/>',
    settings:
      '<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8' +
      'a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>' +
      '<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52' +
      'l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094' +
      'c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64' +
      '.902 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79' +
      ' 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.892 3.434-.902 2.54-2.541' +
      'l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094' +
      'a.873.873 0 0 1-.52-1.255l.16-.292c.892-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873' +
      ' 0 0 1-1.255-.52l-.094-.319z"/>',
    search:
      '<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414' +
      'l-3.85-3.85zm-5.242.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>',
    bell:
      '<path d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742' +
      '-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197' +
      ' 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78' +
      ' 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901' +
      'a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>' +
      '<path d="M6 13a2 2 0 0 0 4 0z"/>',
    check:
      '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z' +
      'm3.354-8.354a.5.5 0 0 0-.708 0L7 9.293 5.354 7.646a.5.5 0 1 0-.708.708l2 2' +
      'a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708z"/>',
    download:
      '<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1' +
      ' 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>' +
      '<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5' +
      'a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>',
    calendar:
      '<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2' +
      ' 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12' +
      'a1 1 0 0 0 1-1V4z"/>',
    lock:
      '<path d="M8 1a3 3 0 0 0-3 3v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7' +
      'a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3zm2 5V4a2 2 0 1 0-4 0v2zm-6 1h8v6H4z"/>',
    globe:
      '<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855' +
      'A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.27 9.27 0 0 1 .64-1.539A6.98 6.98 0 0 0' +
      ' 1.532 4zm-2.36 1a6.96 6.96 0 0 0-.64 2.5H3.97A17 17 0 0 1 4.09 5zM1.09 8.5' +
      'a6.96 6.96 0 0 0 .64 2.5h1.776a17 17 0 0 1-.116-2.5zm.782 3.5a6.98 6.98 0 0 0' +
      ' 3.197 1.539A9.27 9.27 0 0 1 4.435 12zm2.07 1.923c.552 1.035 1.218 1.65 1.887 1.855' +
      'V12H5.145a7.97 7.97 0 0 0 .468 1.068zM8.5 12v3.778c.67-.204 1.335-.82 1.887-1.855' +
      'A7.97 7.97 0 0 0 10.855 12zm2.415 0a9.27 9.27 0 0 1-.64 1.539A6.98 6.98 0 0 0' +
      ' 14.468 12zm2.865-1a6.96 6.96 0 0 0 .64-2.5H12.03a17 17 0 0 1 .116 2.5zM14.91 7.5' +
      'a6.96 6.96 0 0 0-.64-2.5h-1.776a17 17 0 0 1 .116 2.5zm-.782-3.5a6.98 6.98 0 0 0' +
      '-3.197-1.539c.263.46.5.98.64 1.539zm-2.07-1.923C11.506 1.297 10.84.682 10.17.477' +
      'V4h2.355a7.97 7.97 0 0 0-.468-1.068zM7.5 8.5V12H4.09a16 16 0 0 1-.09-2.5H7.5z' +
      'M7.5 4V7.5H4a16 16 0 0 1 .09-2.5H7.5zM8.5 7.5V4h3.41a16 16 0 0 1 .09 2.5H8.5z' +
      'M8.5 8.5H12a16 16 0 0 1-.09 2.5H8.5z"/>',
    phone:
      '<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77' +
      'a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45' +
      'l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547' +
      'a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.459-1.657l.548-2.19' +
      'a.678.678 0 0 0-.122-.58z"/>',
  };

  // ---------------------------------------------------------------------------
  // Utility helpers
  // ---------------------------------------------------------------------------

  /** Deep merge that handles nested objects (one level) and arrays (replace). */
  function deepMerge(defaults, overrides) {
    var result = {};
    for (var key in defaults) {
      if (!defaults.hasOwnProperty(key)) continue;

      var dVal = defaults[key];
      var oVal = overrides.hasOwnProperty(key) ? overrides[key] : undefined;

      if (oVal === undefined || oVal === null) {
        result[key] = dVal;
      } else if (
        typeof dVal === 'object' && !Array.isArray(dVal) &&
        typeof oVal === 'object' && !Array.isArray(oVal)
      ) {
        // One-level deep merge for style sub-objects
        result[key] = {};
        for (var sk in dVal) {
          if (dVal.hasOwnProperty(sk)) {
            result[key][sk] = (oVal.hasOwnProperty(sk) && oVal[sk] != null)
              ? oVal[sk]
              : dVal[sk];
          }
        }
        // Also copy any extra keys the user added
        for (var ek in oVal) {
          if (oVal.hasOwnProperty(ek) && !dVal.hasOwnProperty(ek)) {
            result[key][ek] = oVal[ek];
          }
        }
      } else {
        result[key] = oVal;
      }
    }
    return result;
  }

  function log() {
    if (cfg.debug) {
      var args = ['[helpbutton-qs]'].concat(Array.prototype.slice.call(arguments));
      console.log.apply(console, args);
    }
  }

  function makeSvg(iconKey, size, color) {
    var paths = ICONS[iconKey] || ICONS.help;
    var fill = color ? color : 'currentColor';
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" ' +
      'width="' + (size || 16) + '" height="' + (size || 16) + '" ' +
      'fill="' + fill + '" aria-hidden="true" role="img">' +
      paths +
      '</svg>'
    );
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Template field support — dynamic URL placeholders
  // ---------------------------------------------------------------------------

  /**
   * Cached template context. User directory and user ID are fetched once at
   * init time from the Qlik Sense proxy API. App ID and sheet ID are parsed
   * from the current URL at resolution time (they change on SPA navigation).
   */
  var _templateContext = { userDirectory: '', userId: '' };

  /**
   * Fetch user info from the Qlik Sense proxy API and cache it for template
   * resolution. Called once at startup — fire-and-forget. If the fetch fails,
   * user-related template fields will resolve to empty strings.
   */
  function fetchTemplateContext() {
    fetch('/qps/user?targetUri=' + encodeURIComponent(window.location.href))
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        _templateContext.userDirectory = data.userDirectory || '';
        _templateContext.userId = data.userId || '';
        log('Template context loaded:', JSON.stringify(_templateContext));
      })
      .catch(function (err) {
        log('Failed to fetch template context (user info):', err);
      });
  }

  /**
   * Replace {{…}} template placeholders in a URL with live Qlik Sense context.
   *
   * Supported fields:
   *   {{userDirectory}} — User directory (e.g. "CORP")
   *   {{userId}}        — User ID (e.g. "jsmith")
   *   {{appId}}         — Current app GUID (from URL)
   *   {{sheetId}}       — Current sheet ID (from URL)
   *
   * Unresolvable placeholders are replaced with an empty string and any
   * resulting double-slashes in the URL path are collapsed to a single slash.
   *
   * @param {string} url — URL string, possibly containing {{…}} placeholders.
   * @returns {string} Resolved URL.
   */
  function resolveTemplateFields(url) {
    if (!url || url.indexOf('{{') < 0) return url;

    // Parse app/sheet IDs fresh from the current URL (changes on SPA navigation)
    var path = location.pathname;
    var appMatch = path.match(/\/app\/([0-9a-f-]{36})/i);
    var sheetMatch = path.match(/\/sheet\/([^\/]+)/);

    var resolved = url
      .replace(/\{\{userDirectory\}\}/g, _templateContext.userDirectory || '')
      .replace(/\{\{userId\}\}/g, _templateContext.userId || '')
      .replace(/\{\{appId\}\}/g, appMatch ? appMatch[1] : '')
      .replace(/\{\{sheetId\}\}/g, sheetMatch ? sheetMatch[1] : '');

    // Clean up double-slashes in the path portion (preserve the :// in protocol)
    var protocolEnd = resolved.indexOf('://');
    if (protocolEnd >= 0) {
      var protocol = resolved.substring(0, protocolEnd + 3);
      var rest = resolved.substring(protocolEnd + 3);
      rest = rest.replace(/\/{2,}/g, '/');
      resolved = protocol + rest;
    } else {
      resolved = resolved.replace(/\/{2,}/g, '/');
    }

    log('Template URL resolved:', url, '→', resolved);
    return resolved;
  }

  // ---------------------------------------------------------------------------
  // Dynamic style builder — uses config colors
  // ---------------------------------------------------------------------------
  function buildStyles() {
    var bs = cfg.buttonStyle;
    var ps = cfg.popupStyle;

    return {
      container:
        'display:flex;align-items:center;margin-right:8px;position:relative;',

      button: [
        'display:flex',
        'align-items:center',
        'gap:6px',
        'padding:5px 14px',
        'border:1px solid ' + bs.borderColor,
        'border-radius:' + bs.borderRadius,
        'background:' + bs.backgroundColor,
        'color:' + bs.textColor,
        'cursor:pointer',
        'font-size:13px',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
        'font-weight:600',
        'height:32px',
        'white-space:nowrap',
        'transition:background-color 0.15s,border-color 0.15s,box-shadow 0.15s,transform 0.1s',
        'outline:none',
        'box-sizing:border-box',
        'letter-spacing:0.02em',
        'text-shadow:0 1px 1px rgba(0,0,0,0.15)',
        'box-shadow:0 1px 3px rgba(0,0,0,0.12)',
      ].join(';'),

      buttonHover: [
        'background:' + bs.backgroundColorHover,
        'border-color:' + bs.backgroundColorHover,
        'box-shadow:0 2px 6px rgba(0,0,0,0.18)',
      ].join(';'),

      buttonActive: [
        'background:' + bs.backgroundColorActive,
        'border-color:' + bs.backgroundColorActive,
        'transform:scale(0.98)',
        'box-shadow:0 1px 2px rgba(0,0,0,0.15)',
      ].join(';'),

      buttonFocus: 'box-shadow:0 0 0 3px ' + bs.focusOutlineColor + ';',

      popup: [
        'display:none',
        'position:absolute',
        'top:calc(100% + 8px)',
        'right:0',
        'background:' + ps.backgroundColor,
        'border:2px solid ' + ps.borderColor,
        'border-radius:' + ps.borderRadius,
        'box-shadow:0 10px 30px ' + ps.shadowColor + ',0 4px 12px rgba(0,0,0,0.06)',
        'padding:0',
        'z-index:10000',
        'min-width:220px',
        'box-sizing:border-box',
        'overflow:hidden',
      ].join(';'),

      popupHeader: [
        'padding:10px 16px',
        'font-weight:700',
        'font-size:13px',
        'color:' + ps.headerTextColor,
        'background:' + ps.headerBackgroundColor,
        'letter-spacing:0.04em',
        'text-transform:uppercase',
        'box-sizing:border-box',
        'margin:0',
      ].join(';'),

      separator:
        'height:0;margin:0;border:none;border-top:1px solid ' + ps.separatorColor + ';',

      menuItemBase: [
        'display:flex',
        'align-items:center',
        'gap:10px',
        'padding:10px 16px',
        'text-decoration:none',
        'font-size:14px',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
        'font-weight:500',
        'transition:background 0.12s,transform 0.1s',
        'cursor:pointer',
        'box-sizing:border-box',
        'border-left:3px solid transparent',
      ].join(';'),
    };
  }

  /** Build the inline style string for a specific menu item. */
  function menuItemStyle(item) {
    return (
      buildStyles().menuItemBase + ';' +
      'color:' + (item.textColor || '#333333') + ';' +
      'background:' + (item.bgColor || '#ffffff') + ';'
    );
  }

  /** Build the hover style for a specific menu item. */
  function menuItemHoverStyle(item) {
    return (
      'background:' + (item.bgColorHover || '#f4f4f4') + ';' +
      'border-left-color:' + (item.iconColor || '#165a9b') + ';'
    );
  }

  // ---------------------------------------------------------------------------
  // DOM construction
  // ---------------------------------------------------------------------------
  function createHelpButton() {
    // Guard against double-injection
    if (document.getElementById('helpbutton-qs')) {
      log('Button already exists, skipping injection.');
      return;
    }

    var anchor = document.querySelector(cfg.anchorSelector);
    if (!anchor) {
      log('Anchor element not found:', cfg.anchorSelector);
      return;
    }

    log('Anchor found. Injecting help button…');

    var S = buildStyles();

    // -- Container --
    var container = document.createElement('div');
    container.id = 'helpbutton-qs-container';
    container.setAttribute('style', S.container);

    // -- Toolbar button --
    var btn = document.createElement('button');
    btn.id = 'helpbutton-qs';
    btn.setAttribute('type', 'button');
    btn.setAttribute('title', cfg.buttonTooltip);
    btn.setAttribute('aria-label', cfg.buttonTooltip);
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('style', S.button);
    btn.innerHTML =
      makeSvg(cfg.buttonIcon || 'help', 16, cfg.buttonStyle.textColor) +
      '<span>' + escapeHtml(cfg.buttonLabel) + '</span>';

    // Hover / Active / Focus states
    btn.addEventListener('mouseenter', function () {
      btn.style.cssText = S.button + ';' + S.buttonHover;
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.cssText = S.button;
    });
    btn.addEventListener('mousedown', function () {
      btn.style.cssText = S.button + ';' + S.buttonActive;
    });
    btn.addEventListener('mouseup', function () {
      btn.style.cssText = S.button + ';' + S.buttonHover;
    });
    btn.addEventListener('focus', function () {
      btn.style.cssText = S.button + ';' + S.buttonFocus;
    });
    btn.addEventListener('blur', function () {
      btn.style.cssText = S.button;
    });

    // -- Popup --
    var popup = document.createElement('div');
    popup.id = 'helpbutton-qs-popup';
    popup.setAttribute('role', 'menu');
    popup.setAttribute('aria-label', cfg.popupTitle);
    popup.setAttribute('style', S.popup);

    // Popup header (dark blue with yellow text)
    var header = document.createElement('div');
    header.setAttribute('style', S.popupHeader);
    header.textContent = cfg.popupTitle;
    popup.appendChild(header);

    // Menu items
    cfg.menuItems.forEach(function (item, idx) {
      // Separator between items
      if (idx > 0) {
        var sep = document.createElement('hr');
        sep.setAttribute('style', S.separator);
        popup.appendChild(sep);
      }

      var baseStyle = menuItemStyle(item);
      var hoverAddition = menuItemHoverStyle(item);

      var a = document.createElement('a');
      var itemUrl = item.url || '#';
      var itemTarget = item.target || '_blank';

      // If URL contains {{…}} template fields, resolve them at click time
      if (itemUrl.indexOf('{{') >= 0) {
        a.setAttribute('href', '#');
        (function (tplUrl, tplTarget) {
          a.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var resolved = resolveTemplateFields(tplUrl);
            window.open(resolved, tplTarget, 'noopener,noreferrer');
          });
        })(itemUrl, itemTarget);
      } else {
        a.setAttribute('href', itemUrl);
        a.setAttribute('target', itemTarget);
        a.setAttribute('rel', 'noopener noreferrer');
      }
      a.setAttribute('role', 'menuitem');
      a.setAttribute('style', baseStyle);
      a.innerHTML =
        makeSvg(item.icon || 'help', 16, item.iconColor || '#165a9b') +
        '<span>' + escapeHtml(item.label) + '</span>';

      a.addEventListener('mouseenter', function () {
        a.style.cssText = baseStyle + hoverAddition;
      });
      a.addEventListener('mouseleave', function () {
        a.style.cssText = baseStyle;
      });

      popup.appendChild(a);
    });

    // -- Assemble --
    container.appendChild(btn);
    container.appendChild(popup);

    // -- Insert into DOM --
    anchor.insertBefore(container, anchor.firstChild);
    anchor.style.width = 'auto';
    anchor.style.minWidth = '300px';

    log('Button injected successfully.');

    // -- Toggle popup --
    function openPopup() {
      popup.style.display = 'block';
      btn.setAttribute('aria-expanded', 'true');
      log('Popup opened.');
    }

    function closePopup() {
      popup.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
      log('Popup closed.');
    }

    function togglePopup(e) {
      e.stopPropagation();
      if (popup.style.display === 'none' || popup.style.display === '') {
        openPopup();
      } else {
        closePopup();
      }
    }

    btn.addEventListener('click', togglePopup);

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!container.contains(e.target)) {
        closePopup();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePopup();
        btn.focus();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Initialization — wait for the anchor element to appear in the DOM
  // ---------------------------------------------------------------------------
  function init() {
    log('Initializing. Config:', JSON.stringify(cfg, null, 2));

    // If the anchor already exists, inject immediately
    if (document.querySelector(cfg.anchorSelector)) {
      createHelpButton();
      return;
    }

    log('Anchor not yet in DOM. Setting up observer…');

    var startTime = Date.now();
    var observer = null;
    var pollTimer = null;

    // Polling fallback
    function poll() {
      if (document.querySelector(cfg.anchorSelector)) {
        cleanup();
        createHelpButton();
        return;
      }
      if (Date.now() - startTime > cfg.timeout) {
        log('Timeout: anchor element did not appear within', cfg.timeout, 'ms.');
        cleanup();
        return;
      }
    }

    // MutationObserver
    function onMutation() {
      if (document.querySelector(cfg.anchorSelector)) {
        cleanup();
        createHelpButton();
      }
    }

    function cleanup() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }

    // Start MutationObserver
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(onMutation);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    // Start polling as a fallback
    if (cfg.pollInterval > 0) {
      pollTimer = setInterval(poll, cfg.pollInterval);
    }
  }

  // ---------------------------------------------------------------------------
  // Re-injection support
  // ---------------------------------------------------------------------------
  // Qlik Sense is a SPA — navigating between apps/sheets may destroy and
  // recreate the toolbar. We watch for removal of our button and re-inject.
  function watchForRemoval() {
    if (typeof MutationObserver === 'undefined') return;

    var removalObserver = new MutationObserver(function () {
      if (!document.getElementById('helpbutton-qs')) {
        log('Button removed from DOM (SPA navigation?). Re-injecting…');
        // Small delay to let the new toolbar render
        setTimeout(function () {
          init();
        }, 300);
      }
    });

    removalObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // ---------------------------------------------------------------------------
  // Entry point
  // ---------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      fetchTemplateContext();
      init();
      watchForRemoval();
    });
  } else {
    fetchTemplateContext();
    init();
    watchForRemoval();
  }
})();
