/**
 * Qlik Sense Hjælpeknap (Fejlrapportvariant) — Konfiguration (Dansk)
 * =====================================================================
 * Indlæs denne fil FØR helpbutton-qs.js for at tilpasse knappens opførsel.
 *
 * Brug i Qlik Sense client.html (tilføj før </body>):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Alle egenskaber er valgfrie. Angiv kun dem, du vil tilsidesætte.
 * Standardfarverne bruger en professionel blå og gul palette.
 *
 * @see README.md for komplet dokumentation.
 */
window.helpButtonQsConfig = {
  // --------------------------------------------------------------------------
  // Værktøjslinjeknap — tekst og tooltip
  // --------------------------------------------------------------------------

  /** Tekst vist på værktøjslinjeknappen */
  buttonLabel: 'Hjælp',

  /** Browserens tooltip ved musover */
  buttonTooltip: 'Åbn hjælpemenuen',

  /** Ikon for værktøjslinjeknappen: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Værktøjslinjeknap — farver / stil
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
  // Popup — overskrift og udseende
  // --------------------------------------------------------------------------

  /** Overskrift øverst i popup-menuen */
  popupTitle: 'Brug for hjælp?',

  /** Popup-farver — mørk marineblå overskrift med gul tekst */
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
  // Menupunkter
  // --------------------------------------------------------------------------
  // Hvert punkt opretter et link i popup-menuen.
  //
  // Standard linkpunkter:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Fejlrapport-handlingspunkt:
  //   Angiv action: 'bugReport' i stedet for url. Klik på dette punkt
  //   åbner fejlrapportdialogen i stedet for at navigere til en URL.
  //
  // Skabelonfelter: URL'er kan indeholde {{…}}-pladsholdere, der erstattes
  // dynamisk på klikttidspunktet med Qlik Sense-kontekst:
  //   {{userDirectory}} — Brugermappe (f.eks. "CORP")
  //   {{userId}}        — Bruger-ID (f.eks. "jsmith")
  //   {{appId}}         — Aktuel app-GUID
  //   {{sheetId}}       — Aktuelt ark-ID
  // Se docs/template-fields.md for komplet dokumentation.
  //
  menuItems: [
    {
      label: 'Hjælp og dokumentation',
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Rapportér en fejl',
      action: 'bugReport',       // <-- Åbner fejlrapportdialogen
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Fejlrapportindstillinger
  // --------------------------------------------------------------------------
  bugReport: {
    /** Titel øverst i fejlrapportdialogen */
    dialogTitle: 'Rapportér en fejl',

    /**
     * OBLIGATORISK — URL'en at POSTe fejlrapportens JSON-data til.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** HTTP-metode for webhook-kaldet (standard: POST) */
    webhookMethod: 'POST',

    /**
     * Autentificeringsstrategi for webhook-kaldet.
     *
     * type: 'none'           — Ingen autentificering (stol på netværkssikkerhed)
     * type: 'header'         — Send en tilpasset header (f.eks. Authorization: Bearer …)
     * type: 'sense-session'  — Videresend Qlik Sense-sessionscookien + XRF-nøgle
     * type: 'custom'         — Send vilkårlige headers fra customHeaders-objektet
     */
    auth: {
      type: 'none',
    },

    /**
     * Hvilke kontekstfelter der skal indsamles og vises i dialogen.
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

    /** Pladsholdertekst for beskrivelsestekstfeltet */
    descriptionPlaceholder: 'Beskriv det problem, du stødte på…',

    /** Beskednotifikationer efter indsendelse */
    successMessage: 'Fejlrapporten blev sendt!',
    errorMessage: 'Kunne ikke sende fejlrapporten.',

    /** Etiket over beskrivelsestekstfeltet */
    descriptionLabel: 'Beskrivelse *',

    /** Tekst på Annuller-knappen */
    cancelButtonText: 'Annuller',

    /** Tekst på Send-knappen */
    submitButtonText: 'Send',

    /** Tekst på Send-knappen mens rapporten sendes */
    submittingButtonText: 'Sender…',

    /** Tekst der vises mens miljøkontekst indlæses */
    loadingMessage: 'Indsamler miljøoplysninger…',

    /** Aria-etiket for luk-knappen (×) i dialogens overskrift */
    closeDialogAriaLabel: 'Luk dialogboksen',

    /** Etiketter for hvert kontekstfelt i dialogen. */
    fieldLabels: {
      userId: 'Bruger-ID',
      userName: 'Brugernavn',
      userDirectory: 'Brugermappe',
      senseVersion: 'Qlik Sense-version',
      appId: 'App-ID',
      sheetId: 'Ark-ID',
      urlPath: 'URL-sti',
    },
  },

  // --------------------------------------------------------------------------
  // Avanceret / injektionsindstillinger (sjældent nødvendigt at ændre)
  // --------------------------------------------------------------------------

  /** CSS-selektor for værktøjslinjens beholder */
  // anchorSelector: '#top-bar-right-side',

  /** Pollinginterval i ms mens værktøjslinjen renderes */
  // pollInterval: 500,

  /** Maksimal ventetid i ms før der gives op */
  // timeout: 30000,

  /** Sæt til true for at aktivere konsol-debuglogning */
  debug: false,
};
