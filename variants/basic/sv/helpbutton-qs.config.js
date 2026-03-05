/**
 * Qlik Sense Help Button — Konfiguration (Svenska)
 * ==================================================
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
  // Huvudknappen i Qlik Sense verktygsfältet.
  // Alla färger nedan har en professionell blå stil som standard.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Primär blå
    backgroundColorHover: '#12487c',   // Mörkare vid hovring
    backgroundColorActive: '#0e3b65',  // Mörkast vid klick
    textColor: '#ffffff',              // Vit text & ikon
    borderColor: '#0e3b65',            // Subtil mörk kantlinje
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Gul fokusring
  },

  // --------------------------------------------------------------------------
  // Popup — rubrik & utseende
  // --------------------------------------------------------------------------

  /** Rubrik som visas högst upp i popup-menyn */
  popupTitle: 'Hur kan vi hjälpa dig?',

  /** Popup-färger — mörkblå rubrik med gul text */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Mörk marinblå kantlinje
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Mörk marinblå rubrik
    headerTextColor: '#ffcc33',        // Gul rubriktext
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Menyalternativ
  // --------------------------------------------------------------------------
  // Varje post skapar en länk i popup-menyn.
  //
  // Egenskaper (alla valfria förutom label & url):
  //   label        (string)  — Visningstext
  //   url          (string)  — Länk-URL
  //   icon         (string)  — En av: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Länkmål, t.ex. '_blank' (standard) eller '_self'
  //   iconColor    (string)  — Färg på ikonen (CSS-färg)
  //   bgColor      (string)  — Bakgrundsfärg för alternativet
  //   bgColorHover (string)  — Bakgrundsfärg vid hovring
  //   textColor    (string)  — Textfärg
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
      url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Färger per alternativ (varm bärnstenston)
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
      // Färger per alternativ (grön ton)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
    // -- Exempel på ytterligare alternativ: --
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
    //   label:  'Kontakta support',
    //   url:    'mailto:support@example.com',
    //   icon:   'mail',
    //   target: '_self',
    //   iconColor:    '#059669',
    //   bgColor:      '#ecfdf5',
    //   bgColorHover: '#d1fae5',
    //   textColor:    '#065f46',
    // },
    // {
    //   label:  'Versionshistorik',
    //   url:    'https://wiki.example.com/release-notes',
    //   icon:   'info',
    //   target: '_blank',
    //   iconColor:    '#7c3aed',
    //   bgColor:      '#f5f3ff',
    //   bgColorHover: '#ede9fe',
    //   textColor:    '#5b21b6',
    // },
  ],

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
