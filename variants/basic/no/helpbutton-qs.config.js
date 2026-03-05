/**
 * Qlik Sense Help Button — Konfigurasjon (Norsk)
 * ================================================
 * Last denne filen FØR qs-help-button.js for å tilpasse knappens oppførsel.
 *
 * Bruk i Qlik Sense client.html (legg til før </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Alle egenskaper er valgfrie. Angi bare de du vil overstyre.
 * Standardfargene bruker en profesjonell blå og gul palett.
 *
 * @see README.md for fullstendig dokumentasjon.
 */
window.qsHelpButtonConfig = {
  // --------------------------------------------------------------------------
  // Verktøylinjeknapp — tekst og verktøytips
  // --------------------------------------------------------------------------

  /** Tekst som vises på verktøylinjeknappen */
  buttonLabel: 'Hjelp',

  /** Nettleserens verktøytips ved pekerfølging */
  buttonTooltip: 'Åpne hjelpemenyen',

  /** Ikon for verktøylinjeknappen: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Verktøylinjeknapp — farger / stil
  // --------------------------------------------------------------------------
  // Hovedknappen i Qlik Sense verktøylinjen.
  // Alle farger nedenfor har en profesjonell blå stil som standard.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Primær blå
    backgroundColorHover: '#12487c',   // Mørkere ved peking
    backgroundColorActive: '#0e3b65',  // Mørkest ved klikk
    textColor: '#ffffff',              // Hvit tekst og ikon
    borderColor: '#0e3b65',            // Subtil mørk kantlinje
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Gul fokusring
  },

  // --------------------------------------------------------------------------
  // Popup — overskrift og utseende
  // --------------------------------------------------------------------------

  /** Overskrift som vises øverst i popup-menyen */
  popupTitle: 'Trenger du hjelp?',

  /** Popup-farger — mørkeblå overskrift med gul tekst */
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
  // Menyelementer
  // --------------------------------------------------------------------------
  // Hvert element oppretter en lenke i popup-menyen.
  //
  // Egenskaper (alle valgfrie unntatt label og url):
  //   label        (string)  — Visningstekst
  //   url          (string)  — Lenke-URL
  //   icon         (string)  — En av: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Lenkemål, f.eks. '_blank' (standard) eller '_self'
  //   iconColor    (string)  — Farge på ikonet (CSS-farge)
  //   bgColor      (string)  — Bakgrunnsfarge for elementet
  //   bgColorHover (string)  — Bakgrunnsfarge ved peking
  //   textColor    (string)  — Tekstfarge
  //
  // Malfelt: URL-er kan inneholde {{…}}-plassholdere som erstattes
  // dynamisk ved klikk med Qlik Sense-kontekst:
  //   {{userDirectory}} — Brukerkatalog (f.eks. "CORP")
  //   {{userId}}        — Bruker-ID (f.eks. "jsmith")
  //   {{appId}}         — Gjeldende app-GUID
  //   {{sheetId}}       — Gjeldende ark-ID
  // Se docs/template-fields.md for fullstendig dokumentasjon.
  //
  menuItems: [
    {
      label: 'Hjelp og dokumentasjon',
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      // Farger per element (blå tone)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Rapporter en feil',
      url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Farger per element (varm ravtone)
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
      // Farger per element (grønn tone)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

  // --------------------------------------------------------------------------
  // Avansert / injeksjonsinnstillinger (trenger sjelden endring)
  // --------------------------------------------------------------------------

  /** CSS-selektor for verktøylinjens beholder å injisere i */
  // anchorSelector: '#top-bar-right-side',

  /** Pollingsintervall i ms mens verktøylinjen rendres */
  // pollInterval: 500,

  /** Maks ventetid i ms før det gis opp */
  // timeout: 30000,

  /** Sett til true for å aktivere konsoll-feilsøkingslogging */
  debug: false,
};
