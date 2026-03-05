/**
 * Qlik Sense Help Button (Felrapportvariant) — Konfiguration (Svenska)
 * =====================================================================
 * Ladda denna fil FÖRE qs-help-button.js för att anpassa knappens beteende.
 *
 * Användning i Qlik Sense client.html (lägg till före </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Alla egenskaper är valfria. Ange bara de du vill ändra.
 * Standardfärgerna använder en professionell blå & gul palett.
 *
 * @see README.md för fullständig dokumentation.
 */
window.qsHelpButtonConfig = {
  // --------------------------------------------------------------------------
  // Verktygsfältsknapp — text & tooltip
  // --------------------------------------------------------------------------

  /** Text som visas på verktygsfältsknappen */
  buttonLabel: 'Hjälp',

  /** Webbläsarens tooltip vid hovring */
  buttonTooltip: 'Öppna hjälpmenyn',

  /** Ikon för verktygsfältsknappen: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Verktygsfältsknapp — färger / stil
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
  // Popup — rubrik & utseende
  // --------------------------------------------------------------------------

  /** Rubrik som visas högst upp i popup-menyn */
  popupTitle: 'Hur kan vi hjälpa dig?',

  /** Popup-färger — mörkblå rubrik med gul text */
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
  // Menyalternativ
  // --------------------------------------------------------------------------
  // Varje post skapar en länk i popup-menyn.
  //
  // Standard länkalternativ:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Felrapport-åtgärdsalternativ:
  //   Ange action: 'bugReport' istället för url. Klick på detta alternativ
  //   öppnar felrapportdialogen istället för att navigera till en URL.
  //
  // Mallfält: URL:er kan innehålla {{…}}-platshållare som ersätts
  // dynamiskt vid klicktillfället med Qlik Sense-kontext:
  //   {{userDirectory}} — Användarkatalog (t.ex. "CORP")
  //   {{userId}}        — Användar-ID (t.ex. "jsmith")
  //   {{appId}}         — Aktuellt app-GUID
  //   {{sheetId}}       — Aktuellt ark-ID
  // Se docs/template-fields.md för fullständig dokumentation.
  //
  menuItems: [
    {
      label: 'Hjälp & dokumentation',
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      // Färger per alternativ (blå ton)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Rapportera ett fel',
      action: 'bugReport',       // <-- Öppnar felrapportdialogen
      icon: 'bug',
      // Färger per alternativ (varm bärnstenston)
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
    // -- Exempel: ytterligare standard länkalternativ --
    // {                                    // ← Mallfältsexempel
    //   label:  'Appspecifik hjälp',
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
  // Felrapportinställningar
  // --------------------------------------------------------------------------
  bugReport: {
    /** Titel som visas högst upp i felrapportdialogen */
    dialogTitle: 'Rapportera ett fel',

    /**
     * OBLIGATORISKT — URL:en att POSTa felrapportens JSON-data till.
     * Exempel:
     *   'http://localhost:3000/api/bug-reports'               (demoserver)
     *   'https://localhost:3443/api/bug-reports'              (demoserver)
     *   'https://hooks.example.com/services/T00/B00/xxx'      (Slack/Teams)
     *   'https://jira.example.com/rest/api/2/issue'           (Jira)
     *   'https://your-server.com/api/bug-reports'             (egen REST)
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** HTTP-metod för webhook-anropet (standard: POST) */
    webhookMethod: 'POST',

    /**
     * Autentiseringsstrategi för webhook-anropet.
     *
     * type: 'none'           — Ingen autentisering (förlita sig på nätverkssäkerhet)
     * type: 'header'         — Skicka en anpassad header (t.ex. Authorization: Bearer …)
     * type: 'sense-session'  — Vidarebefordra Qlik Sense-sessionscookien + XRF-nyckel
     * type: 'custom'         — Skicka godtyckliga headers från customHeaders-objektet
     */
    auth: {
      type: 'none',

      // -- För type: 'header' --
      // headerName:  'Authorization',
      // headerValue: 'Bearer DIN_TOKEN_HÄR',

      // -- För type: 'custom' --
      // customHeaders: {
      //   'Authorization': 'Bearer DIN_TOKEN_HÄR',
      //   'X-Custom-Header': 'ett-värde',
      // },
    },

    /**
     * Vilka kontextfält som ska samlas in och visas i dialogen.
     * Tillgängliga: 'userId', 'userName', 'userDirectory', 'senseVersion',
     *               'appId', 'sheetId', 'urlPath'
     * Ta bort poster du inte behöver, eller ändra ordningen.
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

    /** Platshållartext för beskrivningstextfältet */
    descriptionPlaceholder: 'Beskriv problemet du stötte på…',

    /** Aviseringsmeddelanden som visas efter inskickning */
    successMessage: 'Felrapporten har skickats!',
    errorMessage: 'Det gick inte att skicka felrapporten.',

    // -- Textanpassningar för dialogen (lokalisering) --
    // Alla textsträngar i felrapportdialogen är konfigurerbara.

    /** Etikett ovanför beskrivningstextfältet */
    descriptionLabel: 'Beskrivning *',

    /** Text på Avbryt-knappen */
    cancelButtonText: 'Avbryt',

    /** Text på Skicka-knappen */
    submitButtonText: 'Skicka',

    /** Text som visas på Skicka-knappen medan rapporten skickas */
    submittingButtonText: 'Skickar…',

    /** Text som visas medan miljökontext laddas */
    loadingMessage: 'Samlar in miljöinformation…',

    /** Aria-etikett för stäng-knappen (×) i dialogens rubrik */
    closeDialogAriaLabel: 'Stäng dialogrutan',

    /** Etiketter för varje kontextfält i dialogen.
     *  Nycklarna måste matcha posterna i collectFields ovan. */
    fieldLabels: {
      userId: 'Användar-ID',
      userName: 'Användarnamn',
      userDirectory: 'Användarkatalog',
      senseVersion: 'Qlik Sense-version',
      appId: 'App-ID',
      sheetId: 'Ark-ID',
      urlPath: 'URL-sökväg',
    },

    // -- Stilanpassningar för dialogen (behöver sällan ändras) --
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
  // Avancerat / injektionsinställningar (behöver sällan ändras)
  // --------------------------------------------------------------------------

  /** CSS-selektor för verktygsfältets behållare att injicera i */
  // anchorSelector: '#top-bar-right-side',

  /** Pollningsintervall i ms medan verktygsfältet renderas */
  // pollInterval: 500,

  /** Max väntetid i ms innan det ges upp */
  // timeout: 30000,

  /** Sätt till true för att aktivera konsol-debugloggning */
  debug: false,
};
