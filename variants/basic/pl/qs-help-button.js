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
 *   Set window.qsHelpButtonConfig BEFORE this script loads, or load
 *   qs-help-button.config.js first. See qs-help-button.config.js for options.
 *
 * Compatible with Qlik Sense Enterprise on Windows (client-managed).
 * Tested with versions
 *   - 8.527.8 (2025 November, IR)
 *
 * @version 1.3.0 // x-release-please-version
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
