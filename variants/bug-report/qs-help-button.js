/**
 * Qlik Sense Help Button — Bug Report Variant
 * =============================================
 * A self-contained script that injects a configurable "Help" button into the
 * Qlik Sense Enterprise (client-managed) toolbar, positioned to the left of
 * the "Ask Insight Advisor" search box.
 *
 * This variant extends the basic help button with a "Bug Report" feature:
 *   - A "Help" link opens a configurable help page (same as the basic variant).
 *   - A "Bug Report" button opens a modal dialog pre-populated with context
 *     (user ID, user name, Sense version, app ID, sheet ID, URL path).
 *   - The user adds a free-text description and submits.
 *   - The report is POSTed as JSON to a configurable webhook endpoint.
 *
 * Deployment:
 *   1. Place this file in C:\Program Files\Qlik\Sense\Client\custom\.
 *   2. Add a <script> tag to the Sense client's client.html.
 *   See README.md for full instructions.
 *
 * Configuration:
 *   Set window.qsHelpButtonConfig BEFORE this script loads, or load
 *   qs-help-button.config.js first. See qs-help-button.config.js for options.
 *
 * Compatible with Qlik Sense Enterprise on Windows (client-managed).
 *
 * @version 1.2.1 // x-release-please-version
 * @license MIT
 * @see https://github.com/ptarmiganlabs/qs-help-button
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration (merged with window.qsHelpButtonConfig if present)
  // ---------------------------------------------------------------------------
  var DEFAULT_CONFIG = {
    // -- Button appearance --
    buttonLabel: 'Help',
    buttonTooltip: 'Open help menu',
    buttonIcon: 'help',

    // -- Toolbar button colors --
    buttonStyle: {
      backgroundColor: '#165a9b',
      backgroundColorHover: '#12487c',
      backgroundColorActive: '#0e3b65',
      textColor: '#ffffff',
      borderColor: '#0e3b65',
      borderRadius: '4px',
      focusOutlineColor: 'rgba(255, 204, 51, 0.6)',
    },

    // -- Popup appearance --
    popupTitle: 'Need assistance?',
    popupStyle: {
      backgroundColor: '#ffffff',
      borderColor: '#0c3256',
      borderRadius: '8px',
      headerBackgroundColor: '#0c3256',
      headerTextColor: '#ffcc33',
      separatorColor: '#e0e0e0',
      shadowColor: 'rgba(12, 50, 86, 0.25)',
    },

    // -- Menu items --
    // Each item: { label, url, icon, target, iconColor, bgColor, bgColorHover, textColor }
    // Items with action: 'bugReport' open the bug-report dialog instead of a URL.
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
        action: 'bugReport',
        icon: 'bug',
        iconColor: '#b45309',
        bgColor: '#fffbeb',
        bgColorHover: '#fef3c7',
        textColor: '#78350f',
      },
    ],

    // -- Bug Report settings --
    bugReport: {
      dialogTitle: 'Report a Bug',
      webhookUrl: '',  // REQUIRED — the URL to POST the bug report to
      webhookMethod: 'POST',

      // Authentication strategy: 'none' | 'header' | 'sense-session' | 'custom'
      auth: {
        type: 'none',
        // For type: 'header' — a single custom header
        headerName: '',
        headerValue: '',
        // For type: 'custom' — arbitrary headers object
        customHeaders: {},
      },

      // Which context fields to collect and display.
      // Options: 'userId', 'userName', 'userDirectory', 'senseVersion',
      //          'appId', 'sheetId', 'urlPath'
      collectFields: [
        'userName', 'userDirectory', 'userId',
        'senseVersion', 'appId', 'sheetId', 'urlPath',
      ],

      // Dialog style overrides
      dialogStyle: {
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: '#ffffff',
        borderColor: '#0c3256',
        borderRadius: '10px',
        headerBackgroundColor: '#0c3256',
        headerTextColor: '#ffcc33',
        primaryButtonBg: '#165a9b',
        primaryButtonText: '#ffffff',
        primaryButtonHoverBg: '#12487c',
        cancelButtonBg: '#e5e7eb',
        cancelButtonText: '#374151',
        cancelButtonHoverBg: '#d1d5db',
        inputBorderColor: '#d1d5db',
        inputBorderFocusColor: '#165a9b',
        labelColor: '#374151',
        shadowColor: 'rgba(12, 50, 86, 0.3)',
      },

      // Toast messages
      successMessage: 'Bug report submitted successfully!',
      errorMessage: 'Failed to submit bug report.',

      // Placeholder text for the description field
      descriptionPlaceholder: 'Describe the issue you encountered…',

      // UI text overrides — every visible string in the dialog
      descriptionLabel: 'Description *',
      cancelButtonText: 'Cancel',
      submitButtonText: 'Submit',
      submittingButtonText: 'Submitting…',
      loadingMessage: 'Gathering environment info…',
      closeDialogAriaLabel: 'Close dialog',

      // Labels shown next to each context field in the dialog.
      // Keys correspond to the entries in collectFields.
      fieldLabels: {
        userId: 'User ID',
        userName: 'User Name',
        userDirectory: 'User Directory',
        senseVersion: 'Qlik Sense Version',
        appId: 'App ID',
        sheetId: 'Sheet ID',
        urlPath: 'URL Path',
      },
    },

    // -- Injection --
    anchorSelector: '#top-bar-right-side',
    pollInterval: 500,
    timeout: 30000,
    debug: false,
  };

  // Merge user config (deep merge for nested style objects)
  var cfg = deepMerge(DEFAULT_CONFIG, window.qsHelpButtonConfig || {});

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
    close:
      '<path d="M12.3 4.4a.5.5 0 0 0-.7-.7L8 7.3 4.4 3.7a.5.5 0 0 0-.7.7L7.3 8 3.7 11.6' +
      'a.5.5 0 0 0 .7.7L8 8.7l3.6 3.6a.5.5 0 0 0 .7-.7L8.7 8z"/>',
    send:
      '<path d="M1.5 1.3c-.2-.1-.5-.1-.7.1-.1.1-.2.3-.1.5l2.1 5.6L1 13.1c-.1.2 0 .4.1.5' +
      '.1.1.3.2.4.2.1 0 .2 0 .3-.1l13-6.5c.2-.1.3-.3.3-.5s-.1-.4-.3-.5L1.5 1.3zM2.2 12.1' +
      'l1.9-4.6h5.4L2.2 12.1zM9.5 6.5H4.1L2.2 1.9l7.3 4.6z"/>',
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
      var args = ['[qs-help-button]'].concat(Array.prototype.slice.call(arguments));
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
  // Context gathering — async helpers for Qlik Sense environment info
  // ---------------------------------------------------------------------------

  /** Parse app ID and sheet ID from the current URL path. */
  function getAppAndSheetId() {
    var path = location.pathname;
    var appMatch = path.match(/\/app\/([0-9a-f-]{36})/i);
    // Sheet IDs can be short engine-generated IDs (e.g. "tAyTET") or GUIDs
    var sheetMatch = path.match(/\/sheet\/([^\/]+)/);
    return {
      appId: appMatch ? appMatch[1] : '(not in an app)',
      sheetId: sheetMatch ? sheetMatch[1] : '(no sheet selected)',
    };
  }

  /** Get the current URL path. */
  function getUrlPath() {
    return location.pathname + location.search;
  }

  /**
   * Fetch current user info from the Qlik Sense proxy API.
   * GET /qps/user?targetUri=<current URL> — no CSRF header needed.
   */
  function getUserInfo() {
    return fetch('/qps/user?targetUri=' + encodeURIComponent(window.location.href))
      .then(function (resp) {
        if (!resp.ok) throw new Error('User info request failed: ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        return {
          userId: data.userId || '(unknown)',
          userDirectory: data.userDirectory || '(unknown)',
          userName: data.userName || '(unknown)',
        };
      })
      .catch(function (err) {
        log('Failed to fetch user info:', err);
        return {
          userId: '(unavailable)',
          userDirectory: '(unavailable)',
          userName: '(unavailable)',
        };
      });
  }

  /**
   * Fetch Qlik Sense version from product-info.js.
   * GET /resources/autogenerated/product-info.js — parse the AMD module.
   */
  function getSenseVersion() {
    return fetch('/resources/autogenerated/product-info.js')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Product info request failed: ' + resp.status);
        return resp.text();
      })
      .then(function (text) {
        // AMD module: define([], /** ... */ { ... });
        // Strip the define wrapper to get the JSON object
        var json = text
          .replace(/^define\(\[],\s*\/\*\*.*?\*\/\s*/s, '')
          .replace(/\s*\);?\s*$/, '');
        var info = JSON.parse(json);
        var comp = info.composition || {};
        return (comp.releaseLabel || 'Unknown') + ' (v' + (comp.version || '?') + ')';
      })
      .catch(function (err) {
        log('Failed to fetch Sense version:', err);
        return '(unavailable)';
      });
  }

  /**
   * Gather all context data. Returns a Promise that resolves to an object.
   * Called each time the bug-report dialog opens so sheet ID is always current.
   */
  function gatherContext() {
    var ids = getAppAndSheetId();
    var fields = cfg.bugReport.collectFields || [];

    // Start async calls in parallel
    var userPromise = (
      fields.indexOf('userId') >= 0 ||
      fields.indexOf('userName') >= 0 ||
      fields.indexOf('userDirectory') >= 0
    ) ? getUserInfo() : Promise.resolve({});

    var versionPromise = (
      fields.indexOf('senseVersion') >= 0
    ) ? getSenseVersion() : Promise.resolve('');

    return Promise.all([userPromise, versionPromise]).then(function (results) {
      var user = results[0];
      var version = results[1];

      var context = {};
      fields.forEach(function (field) {
        switch (field) {
          case 'userId':        context.userId = user.userId || '(unavailable)'; break;
          case 'userName':      context.userName = user.userName || '(unavailable)'; break;
          case 'userDirectory': context.userDirectory = user.userDirectory || '(unavailable)'; break;
          case 'senseVersion':  context.senseVersion = version || '(unavailable)'; break;
          case 'appId':         context.appId = ids.appId; break;
          case 'sheetId':       context.sheetId = ids.sheetId; break;
          case 'urlPath':       context.urlPath = getUrlPath(); break;
          default:              log('Unknown collect field:', field); break;
        }
      });

      return context;
    });
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
  // Bug Report Dialog
  // ---------------------------------------------------------------------------

  /** Field label mapping for display (from merged config). */
  var FIELD_LABELS = cfg.bugReport.fieldLabels;

  /**
   * Build inline styles for the bug-report dialog from config.
   */
  function buildDialogStyles() {
    var ds = cfg.bugReport.dialogStyle;
    return {
      overlay: [
        'position:fixed',
        'top:0',
        'left:0',
        'width:100%',
        'height:100%',
        'background:' + ds.overlayColor,
        'z-index:10001',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
      ].join(';'),

      modal: [
        'background:' + ds.backgroundColor,
        'border:2px solid ' + ds.borderColor,
        'border-radius:' + ds.borderRadius,
        'box-shadow:0 20px 60px ' + ds.shadowColor + ',0 8px 24px rgba(0,0,0,0.1)',
        'width:700px',
        'max-width:90vw',
        'max-height:90vh',
        'overflow-y:auto',
        'box-sizing:border-box',
        'position:relative',
      ].join(';'),

      header: [
        'display:flex',
        'align-items:center',
        'justify-content:space-between',
        'padding:14px 20px',
        'background:' + ds.headerBackgroundColor,
        'color:' + ds.headerTextColor,
        'font-weight:700',
        'font-size:15px',
        'letter-spacing:0.04em',
        'text-transform:uppercase',
        'border-radius:' + ds.borderRadius + ' ' + ds.borderRadius + ' 0 0',
        'margin:0',
      ].join(';'),

      closeBtn: [
        'background:none',
        'border:none',
        'cursor:pointer',
        'padding:4px',
        'display:flex',
        'align-items:center',
        'color:' + ds.headerTextColor,
        'opacity:0.8',
        'transition:opacity 0.15s',
      ].join(';'),

      body: [
        'padding:20px',
      ].join(';'),

      fieldGroup: [
        'margin-bottom:10px',
      ].join(';'),

      fieldRow: [
        'display:flex',
        'gap:12px',
        'margin-bottom:10px',
      ].join(';'),

      fieldRowItem: [
        'flex:1',
        'min-width:0',
      ].join(';'),

      label: [
        'display:block',
        'font-size:12px',
        'font-weight:600',
        'color:' + ds.labelColor,
        'margin-bottom:4px',
        'text-transform:uppercase',
        'letter-spacing:0.03em',
      ].join(';'),

      readonlyInput: [
        'width:100%',
        'padding:8px 10px',
        'border:1px solid ' + ds.inputBorderColor,
        'border-radius:4px',
        'font-size:13px',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
        'background:#f9fafb',
        'color:#6b7280',
        'box-sizing:border-box',
        'cursor:default',
      ].join(';'),

      textarea: [
        'width:100%',
        'padding:10px 12px',
        'border:1px solid ' + ds.inputBorderColor,
        'border-radius:4px',
        'font-size:13px',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
        'resize:vertical',
        'min-height:100px',
        'box-sizing:border-box',
        'outline:none',
        'transition:border-color 0.15s',
        'line-height:1.5',
      ].join(';'),

      textareaFocus: 'border-color:' + ds.inputBorderFocusColor + ';box-shadow:0 0 0 2px ' +
        ds.inputBorderFocusColor.replace(')', ',0.15)').replace('rgb(', 'rgba(') + ';',

      footer: [
        'display:flex',
        'justify-content:flex-end',
        'gap:10px',
        'padding:16px 20px',
        'border-top:1px solid #e5e7eb',
      ].join(';'),

      primaryBtn: [
        'display:flex',
        'align-items:center',
        'gap:6px',
        'padding:8px 20px',
        'background:' + ds.primaryButtonBg,
        'color:' + ds.primaryButtonText,
        'border:none',
        'border-radius:6px',
        'font-size:13px',
        'font-weight:600',
        'cursor:pointer',
        'transition:background 0.15s,transform 0.1s',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
      ].join(';'),

      primaryBtnHover: 'background:' + ds.primaryButtonHoverBg + ';',

      primaryBtnDisabled: [
        'display:flex',
        'align-items:center',
        'gap:6px',
        'padding:8px 20px',
        'background:#9ca3af',
        'color:#ffffff',
        'border:none',
        'border-radius:6px',
        'font-size:13px',
        'font-weight:600',
        'cursor:not-allowed',
        'opacity:0.6',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
      ].join(';'),

      cancelBtn: [
        'padding:8px 20px',
        'background:' + ds.cancelButtonBg,
        'color:' + ds.cancelButtonText,
        'border:none',
        'border-radius:6px',
        'font-size:13px',
        'font-weight:600',
        'cursor:pointer',
        'transition:background 0.15s',
        'font-family:"Source Sans Pro","Segoe UI",sans-serif',
      ].join(';'),

      cancelBtnHover: 'background:' + ds.cancelButtonHoverBg + ';',

      toast: [
        'padding:10px 16px',
        'border-radius:6px',
        'font-size:13px',
        'font-weight:600',
        'margin:0 20px 12px 20px',
        'transition:opacity 0.5s',
        'display:flex',
        'align-items:center',
        'gap:8px',
      ].join(';'),

      toastSuccess: 'background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;',
      toastError: 'background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;',

      spinner: [
        'display:inline-block',
        'width:14px',
        'height:14px',
        'border:2px solid rgba(255,255,255,0.3)',
        'border-top-color:#ffffff',
        'border-radius:50%',
        'animation:qs-help-spin 0.6s linear infinite',
      ].join(';'),
    };
  }

  /**
   * Inject the @keyframes for the spinner animation. Done once.
   */
  var spinnerStyleInjected = false;
  function injectSpinnerStyle() {
    if (spinnerStyleInjected) return;
    var style = document.createElement('style');
    style.textContent = '@keyframes qs-help-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    spinnerStyleInjected = true;
  }

  /**
   * Submit the bug report to the configured webhook.
   * Returns a Promise.
   */
  function submitBugReport(contextData, description) {
    var br = cfg.bugReport;

    if (!br.webhookUrl) {
      return Promise.reject(new Error('No webhook URL configured.'));
    }

    var payload = {
      timestamp: new Date().toISOString(),
      context: contextData,
      description: description,
    };

    // Build headers
    var headers = {
      'Content-Type': 'application/json',
    };

    var authType = (br.auth && br.auth.type) || 'none';

    switch (authType) {
      case 'header':
        if (br.auth.headerName && br.auth.headerValue) {
          headers[br.auth.headerName] = br.auth.headerValue;
        }
        break;

      case 'sense-session':
        // Generate a 16-character XRF key
        var xrfKey = 'abcdefghij123456';
        headers['X-Qlik-Xrfkey'] = xrfKey;
        // Append xrfkey to URL if not already present
        var separator = br.webhookUrl.indexOf('?') >= 0 ? '&' : '?';
        br._resolvedUrl = br.webhookUrl + separator + 'xrfkey=' + xrfKey;
        break;

      case 'custom':
        if (br.auth.customHeaders && typeof br.auth.customHeaders === 'object') {
          for (var hk in br.auth.customHeaders) {
            if (br.auth.customHeaders.hasOwnProperty(hk)) {
              headers[hk] = br.auth.customHeaders[hk];
            }
          }
        }
        break;

      case 'none':
      default:
        // No additional headers
        break;
    }

    var url = resolveTemplateFields(br._resolvedUrl || br.webhookUrl);
    // Clean up temp property
    delete br._resolvedUrl;

    log('Submitting bug report to:', url);
    log('Payload:', JSON.stringify(payload, null, 2));

    return fetch(url, {
      method: br.webhookMethod || 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      credentials: authType === 'sense-session' ? 'include' : 'same-origin',
    }).then(function (resp) {
      if (!resp.ok) {
        throw new Error('HTTP ' + resp.status + ' ' + resp.statusText);
      }
      return resp;
    });
  }

  /**
   * Create and show the bug-report dialog.
   * @param {function} closePopupFn — callback to close the help popup behind the dialog
   */
  function showBugReportDialog(closePopupFn) {
    // Prevent multiple dialogs
    if (document.getElementById('qs-help-bug-dialog-overlay')) return;

    injectSpinnerStyle();

    if (closePopupFn) closePopupFn();

    var DS = buildDialogStyles();
    var br = cfg.bugReport;

    // -- Overlay --
    var overlay = document.createElement('div');
    overlay.id = 'qs-help-bug-dialog-overlay';
    overlay.setAttribute('style', DS.overlay);

    // -- Modal --
    var modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', br.dialogTitle);
    modal.setAttribute('style', DS.modal);

    // -- Header --
    var header = document.createElement('div');
    header.setAttribute('style', DS.header);

    var titleSpan = document.createElement('span');
    titleSpan.textContent = br.dialogTitle;
    header.appendChild(titleSpan);

    var closeBtn = document.createElement('button');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', br.closeDialogAriaLabel);
    closeBtn.setAttribute('style', DS.closeBtn);
    closeBtn.innerHTML = makeSvg('close', 16, br.dialogStyle.headerTextColor);
    closeBtn.addEventListener('mouseenter', function () {
      closeBtn.style.opacity = '1';
    });
    closeBtn.addEventListener('mouseleave', function () {
      closeBtn.style.opacity = '0.8';
    });
    header.appendChild(closeBtn);

    modal.appendChild(header);

    // -- Toast area (hidden initially) --
    var toastArea = document.createElement('div');
    toastArea.id = 'qs-help-bug-toast';
    toastArea.setAttribute('style', 'display:none;');
    modal.appendChild(toastArea);

    // -- Body --
    var body = document.createElement('div');
    body.setAttribute('style', DS.body);

    // Loading indicator while context is being gathered
    var loadingMsg = document.createElement('div');
    loadingMsg.setAttribute('style',
      'text-align:center;padding:20px;color:#6b7280;font-size:14px;');
    loadingMsg.innerHTML =
      '<div style="' + DS.spinner.replace('border-top-color:#ffffff', 'border-top-color:#165a9b')
        .replace('border:2px solid rgba(255,255,255,0.3)', 'border:2px solid rgba(22,90,155,0.2)') +
      ';width:24px;height:24px;margin:0 auto 10px auto;"></div>' +
      escapeHtml(br.loadingMessage);
    body.appendChild(loadingMsg);

    modal.appendChild(body);

    // -- Footer (will be shown after loading) --
    var footer = document.createElement('div');
    footer.setAttribute('style', DS.footer + ';display:none;');
    modal.appendChild(footer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus trap — focus the modal
    modal.setAttribute('tabindex', '-1');
    modal.focus();

    // -- Close handlers --
    function closeDialog() {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }

    closeBtn.addEventListener('click', closeDialog);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeDialog();
    });

    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape' && document.getElementById('qs-help-bug-dialog-overlay')) {
        closeDialog();
        document.removeEventListener('keydown', onEsc);
      }
    });

    // -- Gather context, then build form --
    gatherContext().then(function (context) {
      log('Context gathered:', JSON.stringify(context, null, 2));

      // Remove loading indicator
      body.removeChild(loadingMsg);

      // Context fields (read-only)
      // Helper to create a single labelled read-only field
      function makeField(field) {
        var group = document.createElement('div');
        group.setAttribute('style', DS.fieldGroup);

        var label = document.createElement('label');
        label.setAttribute('style', DS.label);
        label.textContent = FIELD_LABELS[field] || field;

        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', context[field]);
        input.setAttribute('style', DS.readonlyInput);
        input.setAttribute('tabindex', '-1');

        group.appendChild(label);
        group.appendChild(input);
        return group;
      }

      // Paired fields that should render side-by-side
      var pairedFields = { userDirectory: 'userId' };
      var skipFields = {}; // track second items in pairs to skip in main loop
      for (var pf in pairedFields) {
        if (pairedFields.hasOwnProperty(pf)) skipFields[pairedFields[pf]] = true;
      }

      var fields = br.collectFields || [];
      fields.forEach(function (field) {
        if (context[field] === undefined) return;
        if (skipFields[field]) return; // rendered as part of a pair

        // Check if this field starts a side-by-side pair
        if (pairedFields[field]) {
          var pairField = pairedFields[field];
          var row = document.createElement('div');
          row.setAttribute('style', DS.fieldRow);

          var left = document.createElement('div');
          left.setAttribute('style', DS.fieldRowItem);
          left.appendChild(makeField(field));
          row.appendChild(left);

          if (context[pairField] !== undefined) {
            var right = document.createElement('div');
            right.setAttribute('style', DS.fieldRowItem);
            right.appendChild(makeField(pairField));
            row.appendChild(right);
          }

          body.appendChild(row);
        } else {
          body.appendChild(makeField(field));
        }
      });

      // Description textarea
      var descGroup = document.createElement('div');
      descGroup.setAttribute('style', DS.fieldGroup);

      var descLabel = document.createElement('label');
      descLabel.setAttribute('style', DS.label);
      descLabel.textContent = br.descriptionLabel;

      var textarea = document.createElement('textarea');
      textarea.setAttribute('placeholder', br.descriptionPlaceholder || 'Describe the issue…');
      textarea.setAttribute('style', DS.textarea);
      textarea.setAttribute('rows', '4');

      textarea.addEventListener('focus', function () {
        textarea.style.cssText = DS.textarea + ';' + DS.textareaFocus;
      });
      textarea.addEventListener('blur', function () {
        textarea.style.cssText = DS.textarea;
      });

      descGroup.appendChild(descLabel);
      descGroup.appendChild(textarea);
      body.appendChild(descGroup);

      // -- Footer buttons --
      footer.style.display = 'flex';

      var cancelBtn = document.createElement('button');
      cancelBtn.setAttribute('type', 'button');
      cancelBtn.textContent = br.cancelButtonText;
      cancelBtn.setAttribute('style', DS.cancelBtn);
      cancelBtn.addEventListener('mouseenter', function () {
        cancelBtn.style.cssText = DS.cancelBtn + ';' + DS.cancelBtnHover;
      });
      cancelBtn.addEventListener('mouseleave', function () {
        cancelBtn.style.cssText = DS.cancelBtn;
      });
      cancelBtn.addEventListener('click', closeDialog);

      var submitBtn = document.createElement('button');
      submitBtn.setAttribute('type', 'button');
      submitBtn.setAttribute('style', DS.primaryBtnDisabled);
      submitBtn.setAttribute('disabled', 'disabled');
      submitBtn.innerHTML =
        makeSvg('send', 14, '#ffffff') +
        '<span>' + escapeHtml(br.submitButtonText) + '</span>';

      // Enable/disable submit based on textarea content
      function updateSubmitState() {
        if (textarea.value.trim().length > 0) {
          submitBtn.removeAttribute('disabled');
          submitBtn.setAttribute('style', DS.primaryBtn);
          submitBtn.innerHTML =
            makeSvg('send', 14, br.dialogStyle.primaryButtonText) +
            '<span>' + escapeHtml(br.submitButtonText) + '</span>';
        } else {
          submitBtn.setAttribute('disabled', 'disabled');
          submitBtn.setAttribute('style', DS.primaryBtnDisabled);
          submitBtn.innerHTML =
            makeSvg('send', 14, '#ffffff') +
            '<span>' + escapeHtml(br.submitButtonText) + '</span>';
        }
      }

      textarea.addEventListener('input', updateSubmitState);

      // Hover effects for submit button (only when enabled)
      submitBtn.addEventListener('mouseenter', function () {
        if (!submitBtn.hasAttribute('disabled')) {
          submitBtn.style.cssText = DS.primaryBtn + ';' + DS.primaryBtnHover;
        }
      });
      submitBtn.addEventListener('mouseleave', function () {
        if (!submitBtn.hasAttribute('disabled')) {
          submitBtn.style.cssText = DS.primaryBtn;
        }
      });

      // -- Submit handler --
      submitBtn.addEventListener('click', function () {
        if (submitBtn.hasAttribute('disabled')) return;

        var description = textarea.value.trim();
        if (!description) return;

        // Show loading state
        submitBtn.setAttribute('disabled', 'disabled');
        submitBtn.innerHTML =
          '<span style="' + DS.spinner + '"></span>' +
          '<span>' + escapeHtml(br.submittingButtonText) + '</span>';
        submitBtn.setAttribute('style', DS.primaryBtnDisabled);

        submitBugReport(context, description)
          .then(function () {
            log('Bug report submitted successfully.');
            showToast(toastArea, DS, 'success', br.successMessage);
            // Auto-close after 2 seconds
            setTimeout(closeDialog, 2000);
          })
          .catch(function (err) {
            log('Bug report submission failed:', err);
            showToast(toastArea, DS, 'error',
              br.errorMessage + (err.message ? ' (' + err.message + ')' : ''));
            // Re-enable submit
            submitBtn.removeAttribute('disabled');
            submitBtn.setAttribute('style', DS.primaryBtn);
            submitBtn.innerHTML =
              makeSvg('send', 14, br.dialogStyle.primaryButtonText) +
              '<span>' + escapeHtml(br.submitButtonText) + '</span>';
          });
      });

      footer.appendChild(cancelBtn);
      footer.appendChild(submitBtn);

      // Focus the textarea
      textarea.focus();
    });
  }

  /**
   * Show a toast notification in the dialog.
   */
  function showToast(toastArea, DS, type, message) {
    var style = DS.toast + ';' + (type === 'success' ? DS.toastSuccess : DS.toastError);
    toastArea.setAttribute('style', style);
    toastArea.innerHTML =
      makeSvg(type === 'success' ? 'info' : 'bug', 16,
        type === 'success' ? '#065f46' : '#991b1b') +
      '<span>' + escapeHtml(message) + '</span>';

    // Fade out after 4 seconds
    setTimeout(function () {
      toastArea.style.opacity = '0';
      setTimeout(function () {
        toastArea.style.display = 'none';
        toastArea.style.opacity = '1';
      }, 500);
    }, 4000);
  }

  // ---------------------------------------------------------------------------
  // DOM construction
  // ---------------------------------------------------------------------------
  function createHelpButton() {
    // Guard against double-injection
    if (document.getElementById('qs-help-button')) {
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
    container.id = 'qs-help-button-container';
    container.setAttribute('style', S.container);

    // -- Toolbar button --
    var btn = document.createElement('button');
    btn.id = 'qs-help-button';
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
    popup.id = 'qs-help-popup';
    popup.setAttribute('role', 'menu');
    popup.setAttribute('aria-label', cfg.popupTitle);
    popup.setAttribute('style', S.popup);

    // Popup header (dark blue with yellow text)
    var header = document.createElement('div');
    header.setAttribute('style', S.popupHeader);
    header.textContent = cfg.popupTitle;
    popup.appendChild(header);

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

      // Check if this is a bug-report action item
      if (item.action === 'bugReport') {
        var bugBtn = document.createElement('a');
        bugBtn.setAttribute('href', '#');
        bugBtn.setAttribute('role', 'menuitem');
        bugBtn.setAttribute('style', baseStyle);
        bugBtn.innerHTML =
          makeSvg(item.icon || 'bug', 16, item.iconColor || '#b45309') +
          '<span>' + escapeHtml(item.label) + '</span>';

        bugBtn.addEventListener('mouseenter', function () {
          bugBtn.style.cssText = baseStyle + hoverAddition;
        });
        bugBtn.addEventListener('mouseleave', function () {
          bugBtn.style.cssText = baseStyle;
        });
        bugBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          showBugReportDialog(closePopup);
        });

        popup.appendChild(bugBtn);
      } else {
        // Standard link item
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
      }
    });

    // -- Assemble --
    container.appendChild(btn);
    container.appendChild(popup);

    // -- Insert into DOM --
    anchor.insertBefore(container, anchor.firstChild);
    anchor.style.width = 'auto';
    anchor.style.minWidth = '300px';

    log('Button injected successfully.');

    btn.addEventListener('click', togglePopup);

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!container.contains(e.target)) {
        closePopup();
      }
    });

    // Close on Escape key (only for popup, not the dialog which has its own handler)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !document.getElementById('qs-help-bug-dialog-overlay')) {
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
      if (!document.getElementById('qs-help-button')) {
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
