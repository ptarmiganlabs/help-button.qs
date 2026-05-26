/**
 * Qlik Sense Hilfe-Schaltfläche — Konfiguration (Deutsch)
 * ========================================================
 * Laden Sie diese Datei VOR helpbutton-qs.js, um das Verhalten
 * der Schaltfläche anzupassen.
 *
 * Verwendung in Qlik Sense client.html (vor </body> einfügen):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Alle Eigenschaften sind optional. Legen Sie nur die fest, die Sie
 * überschreiben möchten. Standardfarben verwenden eine professionelle
 * blaue und gelbe Palette.
 *
 * @see README.md für die vollständige Dokumentation.
 */
window.helpButtonQsConfig = {
  // --------------------------------------------------------------------------
  // Symbolleisten-Schaltfläche — Text und Tooltip
  // --------------------------------------------------------------------------

  /** Text auf der Symbolleisten-Schaltfläche */
  buttonLabel: 'Hilfe',

  /** Browser-Tooltip beim Überfahren */
  buttonTooltip: 'Hilfemenü öffnen',

  /** Symbolleisten-Symbol: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Symbolleisten-Schaltfläche — Farben / Stil
  // --------------------------------------------------------------------------
  // Hauptschaltfläche in der Qlik Sense-Symbolleiste.
  // Alle nachfolgenden Farben sind standardmäßig professionelles Blau.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Primärblau
    backgroundColorHover: '#12487c',   // Dunkler beim Überfahren
    backgroundColorActive: '#0e3b65',  // Am dunkelsten beim Klicken
    textColor: '#ffffff',              // Weißer Text und Symbol
    borderColor: '#0e3b65',            // Dezenter dunkler Rand
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Gelber Fokusring
  },

  // --------------------------------------------------------------------------
  // Popup — Titel und Erscheinung
  // --------------------------------------------------------------------------

  /** Titel oben im Popup-Menü */
  popupTitle: 'Brauchen Sie Hilfe?',

  /** Popup-Farben — dunkelblauer Header mit gelbem Text */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Dunkle Marineblau-Umrandung
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Dunkler Marineblau-Header
    headerTextColor: '#ffcc33',        // Gelber Header-Text
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Menüeinträge
  // --------------------------------------------------------------------------
  // Jeder Eintrag erstellt einen Link im Popup-Menü.
  //
  // Eigenschaften (alle optional außer label und url):
  //   label        (string)  — Anzeigetext
  //   url          (string)  — Link-URL
  //   icon         (string)  — Eines von: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Link-Ziel, z.B. '_blank' (Standard) oder '_self'
  //   iconColor    (string)  — Symbolfarbe (CSS-Farbe)
  //   bgColor      (string)  — Hintergrundfarbe des Eintrags
  //   bgColorHover (string)  — Hintergrundfarbe beim Überfahren
  //   textColor    (string)  — Textfarbe
  //
  // Vorlagenfelder: URLs können {{…}}-Platzhalter enthalten, die beim Klicken
  // dynamisch mit dem Qlik-Sense-Kontext ersetzt werden:
  //   {{userDirectory}} — Benutzerverzeichnis (z.B. "CORP")
  //   {{userId}}        — Benutzername (z.B. "jsmith")
  //   {{appId}}         — GUID der aktuellen App
  //   {{sheetId}}       — ID des aktuellen Blatts
  // Siehe docs/template-fields.md für die vollständige Dokumentation.
  //
  menuItems: [
    {
      label: 'Hilfe & Dokumentation',
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      // Farben pro Eintrag (blaue Töne)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Fehler melden',
      url: 'https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Farben pro Eintrag (warme Bernsteintöne)
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
      // Farben pro Eintrag (grüne Töne)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

  // --------------------------------------------------------------------------
  // Erweiterte / Injektionseinstellungen (selten zu ändern)
  // --------------------------------------------------------------------------

  /** CSS-Selektor für den Symbolleisten-Container */
  // anchorSelector: '#top-bar-right-side',

  /** Abfrageintervall in Millisekunden während des Symbolleisten-Renderings */
  // pollInterval: 500,

  /** Maximale Wartezeit in Millisekunden vor Abbruch */
  // timeout: 30000,

  /** Auf true setzen, um Konsolen-Debug-Protokollierung zu aktivieren */
  debug: false,
};
