/**
 * Qlik Sense Hilfe-Schaltfläche (Fehlerbericht-Variante) — Konfiguration (Deutsch)
 * ===================================================================================
 * Laden Sie diese Datei VOR helpbutton-qs.js, um das Verhalten der Schaltfläche
 * anzupassen.
 *
 * Verwendung in Qlik Sense client.html (vor </body> einfügen):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Alle Eigenschaften sind optional. Legen Sie nur die fest, die Sie überschreiben
 * möchten. Standardfarben verwenden eine professionelle blaue und gelbe Palette.
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
  // Popup — Titel und Erscheinung
  // --------------------------------------------------------------------------

  /** Titel oben im Popup-Menü */
  popupTitle: 'Brauchen Sie Hilfe?',

  /** Popup-Farben — dunkelblauer Header mit gelbem Text */
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
  // Menüeinträge
  // --------------------------------------------------------------------------
  // Jeder Eintrag erstellt einen Link im Popup-Menü.
  //
  // Standard-Linkeinträge:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Fehlerbericht-Aktionseintrag:
  //   Verwenden Sie action: 'bugReport' anstelle von url. Ein Klick auf diesen
  //   Eintrag öffnet den Fehlerbericht-Dialog statt eine URL aufzurufen.
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
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Fehler melden',
      action: 'bugReport',       // <-- Öffnet den Fehlerbericht-Dialog
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Fehlerbericht-Einstellungen
  // --------------------------------------------------------------------------
  bugReport: {
    /** Titel oben im Fehlerbericht-Dialog */
    dialogTitle: 'Fehler melden',

    /**
     * ERFORDERLICH — Die URL, an die die JSON-Daten des Fehlerberichts gesendet werden.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** HTTP-Methode für den Webhook-Aufruf (Standard: POST) */
    webhookMethod: 'POST',

    /**
     * Authentifizierungsstrategie für den Webhook-Aufruf.
     *
     * type: 'none'           — Keine Authentifizierung (Netzwerksicherheit nutzen)
     * type: 'header'         — Benutzerdefinierten Header senden (z.B. Authorization: Bearer …)
     * type: 'sense-session'  — Qlik-Sense-Sitzungscookie + XRF-Schlüssel weiterleiten
     * type: 'custom'         — Beliebige Headers aus customHeaders-Objekt senden
     */
    auth: {
      type: 'none',
    },

    /**
     * Welche Kontextfelder gesammelt und im Dialog angezeigt werden.
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

    /** Platzhaltertext für das Beschreibungstextfeld */
    descriptionPlaceholder: 'Beschreiben Sie das aufgetretene Problem…',

    /** Benachrichtigungen nach dem Absenden */
    successMessage: 'Fehlerbericht erfolgreich gesendet!',
    errorMessage: 'Fehlerbericht konnte nicht gesendet werden.',

    /** Beschriftung über dem Beschreibungstextfeld */
    descriptionLabel: 'Beschreibung *',

    /** Text auf der Abbrechen-Schaltfläche */
    cancelButtonText: 'Abbrechen',

    /** Text auf der Absenden-Schaltfläche */
    submitButtonText: 'Absenden',

    /** Text auf der Absenden-Schaltfläche während des Sendens */
    submittingButtonText: 'Wird gesendet…',

    /** Text während des Ladens der Umgebungsinformationen */
    loadingMessage: 'Umgebungsinformationen werden gesammelt…',

    /** Aria-Beschriftung für die Schließen-Schaltfläche (×) */
    closeDialogAriaLabel: 'Dialog schließen',

    /** Beschriftungen für jedes Kontextfeld im Dialog. */
    fieldLabels: {
      userId: 'Benutzer-ID',
      userName: 'Benutzername',
      userDirectory: 'Benutzerverzeichnis',
      senseVersion: 'Qlik Sense-Version',
      appId: 'App-ID',
      sheetId: 'Blatt-ID',
      urlPath: 'URL-Pfad',
    },
  },

  // --------------------------------------------------------------------------
  // Erweiterte / Injektionseinstellungen (selten zu ändern)
  // --------------------------------------------------------------------------

  /** CSS-Selektor für den Symbolleisten-Container */
  // anchorSelector: '#top-bar-right-side',

  /** Abfrageintervall in Millisekunden */
  // pollInterval: 500,

  /** Maximale Wartezeit in Millisekunden */
  // timeout: 30000,

  /** Auf true setzen für Konsolen-Debug-Protokollierung */
  debug: false,
};
