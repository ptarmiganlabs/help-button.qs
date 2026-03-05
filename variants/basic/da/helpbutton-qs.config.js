/**
 * Qlik Sense Help Button — Konfiguration (Dansk)
 * ================================================
 * Indlæs denne fil FØR qs-help-button.js for at tilpasse knappens adfærd.
 *
 * Brug i Qlik Sense client.html (tilføj før </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Alle egenskaber er valgfrie. Angiv kun dem, du ønsker at tilsidesætte.
 * Standardfarverne bruger en professionel blå og gul palet.
 *
 * @see README.md for fuld dokumentation.
 */
window.qsHelpButtonConfig = {
  // --------------------------------------------------------------------------
  // Værktøjslinjeknap — tekst og tooltip
  // --------------------------------------------------------------------------

  /** Tekst vist på værktøjslinjeknappen */
  buttonLabel: 'Hjælp',

  /** Browserens tooltip ved pegehændelse */
  buttonTooltip: 'Åbn hjælpemenuen',

  /** Ikon for værktøjslinjeknappen: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Værktøjslinjeknap — farver / stil
  // --------------------------------------------------------------------------
  // Hovedknappen i Qlik Sense værktøjslinjen.
  // Alle farver nedenfor har en professionel blå stil som standard.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Primær blå
    backgroundColorHover: '#12487c',   // Mørkere ved peg
    backgroundColorActive: '#0e3b65',  // Mørkest ved klik
    textColor: '#ffffff',              // Hvid tekst og ikon
    borderColor: '#0e3b65',            // Subtil mørk kantlinje
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Gul fokusring
  },

  // --------------------------------------------------------------------------
  // Popup — overskrift og udseende
  // --------------------------------------------------------------------------

  /** Overskrift vist øverst i popup-menuen */
  popupTitle: 'Brug for hjælp?',

  /** Popup-farver — mørkeblå overskrift med gul tekst */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Mørk marineblå kantlinje
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Mørk marineblå overskrift
    headerTextColor: '#ffcc33',        // Gul overskriftstekst
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Menupunkter
  // --------------------------------------------------------------------------
  // Hvert punkt opretter et link i popup-menuen.
  //
  // Egenskaber (alle valgfrie undtagen label og url):
  //   label        (string)  — Visningstekst
  //   url          (string)  — Link-URL
  //   icon         (string)  — En af: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Linkmål, f.eks. '_blank' (standard) eller '_self'
  //   iconColor    (string)  — Farve på ikonet (CSS-farve)
  //   bgColor      (string)  — Baggrundsfarve for punktet
  //   bgColorHover (string)  — Baggrundsfarve ved peg
  //   textColor    (string)  — Tekstfarve
  //
  // Skabelonfelter: URL'er kan indeholde {{…}}-pladsholdere, der erstattes
  // dynamisk ved klik med Qlik Sense-kontekst:
  //   {{userDirectory}} — Brugerkatalog (f.eks. "CORP")
  //   {{userId}}        — Bruger-ID (f.eks. "jsmith")
  //   {{appId}}         — Aktuel app-GUID
  //   {{sheetId}}       — Aktuelt ark-ID
  // Se docs/template-fields.md for fuld dokumentation.
  //
  menuItems: [
    {
      label: 'Hjælp og dokumentation',
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      // Farver per punkt (blå tone)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Rapportér en fejl',
      url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Farver per punkt (varm ravtone)
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
      // Farver per punkt (grøn tone)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

  // --------------------------------------------------------------------------
  // Avanceret / injektionsindstillinger (behøver sjældent ændring)
  // --------------------------------------------------------------------------

  /** CSS-selektor for værktøjslinjens container at injicere i */
  // anchorSelector: '#top-bar-right-side',

  /** Pollinginterval i ms mens værktøjslinjen renderes */
  // pollInterval: 500,

  /** Maks ventetid i ms før der gives op */
  // timeout: 30000,

  /** Sæt til true for at aktivere konsol-fejlsøgningslogning */
  debug: false,
};
