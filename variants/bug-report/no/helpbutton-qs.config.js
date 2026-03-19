/**
 * Qlik Sense Hjelpeknapp (Feilrapportvariant) — Konfigurasjon (Norsk)
 * =====================================================================
 * Last inn denne filen FØR helpbutton-qs.js for å tilpasse knappens oppførsel.
 *
 * Bruk i Qlik Sense client.html (legg til før </body>):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Alle egenskaper er valgfrie. Angi kun de du vil overstyre.
 * Standardfargene bruker en profesjonell blå og gul palett.
 *
 * @see README.md for fullstendig dokumentasjon.
 */
window.helpButtonQsConfig = {
  // --------------------------------------------------------------------------
  // Verktøylinjeknapp — tekst og verktøytips
  // --------------------------------------------------------------------------

  /** Tekst som vises på verktøylinjeknappen */
  buttonLabel: 'Hjelp',

  /** Nettleserens verktøytips ved peker */
  buttonTooltip: 'Åpne hjelpemenyen',

  /** Ikon for verktøylinjeknappen: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Verktøylinjeknapp — farger / stil
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
  // Popup — overskrift og utseende
  // --------------------------------------------------------------------------

  /** Overskrift som vises øverst i popup-menyen */
  popupTitle: 'Trenger du hjelp?',

  /** Popup-farger — mørk marineblå overskrift med gul tekst */
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
  // Menyalternativer
  // --------------------------------------------------------------------------
  // Hver oppføring oppretter en lenke i popup-menyen.
  //
  // Standard lenkealternativer:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Feilrapport-handlingsalternativ:
  //   Angi action: 'bugReport' i stedet for url. Klikk på dette alternativet
  //   åpner feilrapportdialogen i stedet for å navigere til en URL.
  //
  // Malfelt: URL-er kan inneholde {{…}}-plassholdere som erstattes
  // dynamisk ved klikktidspunktet med Qlik Sense-kontekst:
  //   {{userDirectory}} — Brukerkatalog (f.eks. "CORP")
  //   {{userId}}        — Bruker-ID (f.eks. "jsmith")
  //   {{appId}}         — Gjeldende app-GUID
  //   {{sheetId}}       — Gjeldende ark-ID
  // Se docs/template-fields.md for fullstendig dokumentasjon.
  //
  menuItems: [
    {
      label: 'Hjelp og dokumentasjon',
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Rapporter en feil',
      action: 'bugReport',       // <-- Åpner feilrapportdialogen
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Feilrapportinnstillinger
  // --------------------------------------------------------------------------
  bugReport: {
    /** Tittel som vises øverst i feilrapportdialogen */
    dialogTitle: 'Rapporter en feil',

    /**
     * OBLIGATORISK — URL-en å POSTe feilrapportens JSON-data til.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** HTTP-metode for webhook-kallet (standard: POST) */
    webhookMethod: 'POST',

    /**
     * Autentiseringsstrategi for webhook-kallet.
     *
     * type: 'none'           — Ingen autentisering (stol på nettverkssikkerhet)
     * type: 'header'         — Send en tilpasset header (f.eks. Authorization: Bearer …)
     * type: 'sense-session'  — Videresend Qlik Sense-sessjonscookien + XRF-nøkkel
     * type: 'custom'         — Send vilkårlige headers fra customHeaders-objektet
     */
    auth: {
      type: 'none',
    },

    /**
     * Hvilke kontekstfelter som skal samles inn og vises i dialogen.
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

    /** Plassholdertekst for beskrivelses-tekstfeltet */
    descriptionPlaceholder: 'Beskriv problemet du opplevde…',

    /** Varslingsmeldinger som vises etter innsending */
    successMessage: 'Feilrapporten ble sendt!',
    errorMessage: 'Kunne ikke sende feilrapporten.',

    /** Etikett over beskrivelses-tekstfeltet */
    descriptionLabel: 'Beskrivelse *',

    /** Tekst på Avbryt-knappen */
    cancelButtonText: 'Avbryt',

    /** Tekst på Send-knappen */
    submitButtonText: 'Send',

    /** Tekst som vises på Send-knappen mens rapporten sendes */
    submittingButtonText: 'Sender…',

    /** Tekst som vises mens miljøkontekst lastes */
    loadingMessage: 'Samler inn miljøinformasjon…',

    /** Aria-etikett for lukk-knappen (×) i dialogens overskrift */
    closeDialogAriaLabel: 'Lukk dialogboksen',

    /** Etiketter for hvert kontekstfelt i dialogen. */
    fieldLabels: {
      userId: 'Bruker-ID',
      userName: 'Brukernavn',
      userDirectory: 'Brukerkatalog',
      senseVersion: 'Qlik Sense-versjon',
      appId: 'App-ID',
      sheetId: 'Ark-ID',
      urlPath: 'URL-sti',
    },
  },

  // --------------------------------------------------------------------------
  // Avansert / injeksjonsinnstillinger (trenger sjelden endring)
  // --------------------------------------------------------------------------

  /** CSS-selektor for verktøylinjens beholder å injisere i */
  // anchorSelector: '#top-bar-right-side',

  /** Pollingsintervall i ms mens verktøylinjen renderes */
  // pollInterval: 500,

  /** Maksimal ventetid i ms før det gis opp */
  // timeout: 30000,

  /** Sett til true for å aktivere konsoll-debuglogging */
  debug: false,
};
