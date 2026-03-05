/**
 * Qlik Sense Przycisk Pomocy — Konfiguracja (Polski)
 * ====================================================
 * Załaduj ten plik PRZED qs-help-button.js, aby dostosować
 * zachowanie przycisku.
 *
 * Użycie w pliku client.html Qlik Sense (dodaj przed </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Wszystkie właściwości są opcjonalne. Ustaw tylko te, które chcesz
 * nadpisać. Domyślne kolory używają profesjonalnej niebiesko-żółtej palety.
 *
 * @see README.md pełna dokumentacja.
 */
window.qsHelpButtonConfig = {
  // --------------------------------------------------------------------------
  // Przycisk paska narzędzi — tekst i podpowiedź
  // --------------------------------------------------------------------------

  /** Tekst wyświetlany na przycisku paska narzędzi */
  buttonLabel: 'Pomoc',

  /** Podpowiedź przeglądarki po najechaniu */
  buttonTooltip: 'Otwórz menu pomocy',

  /** Ikona przycisku: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Przycisk paska narzędzi — kolory / styl
  // --------------------------------------------------------------------------
  // Główny przycisk na pasku narzędzi Qlik Sense.
  // Wszystkie poniższe kolory domyślnie w profesjonalnym niebieskim.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Niebieski podstawowy
    backgroundColorHover: '#12487c',   // Ciemniejszy po najechaniu
    backgroundColorActive: '#0e3b65',  // Najciemniejszy po kliknięciu
    textColor: '#ffffff',              // Biały tekst i ikona
    borderColor: '#0e3b65',            // Subtelna ciemna ramka
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Żółty pierścień fokusa
  },

  // --------------------------------------------------------------------------
  // Popup — tytuł i wygląd
  // --------------------------------------------------------------------------

  /** Tytuł na górze menu popup */
  popupTitle: 'Potrzebujesz pomocy?',

  /** Kolory popup — ciemnogranatowy nagłówek z żółtym tekstem */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Ciemnogranatowa ramka
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Ciemnogranatowy nagłówek
    headerTextColor: '#ffcc33',        // Żółty tekst nagłówka
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Pozycje menu
  // --------------------------------------------------------------------------
  // Każdy wpis tworzy link w menu popup.
  //
  // Właściwości (wszystkie opcjonalne oprócz label i url):
  //   label        (string)  — Tekst wyświetlany
  //   url          (string)  — URL linku
  //   icon         (string)  — Jedno z: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Cel linku, np. '_blank' (domyślnie) lub '_self'
  //   iconColor    (string)  — Kolor ikony (kolor CSS)
  //   bgColor      (string)  — Kolor tła pozycji
  //   bgColorHover (string)  — Kolor tła po najechaniu
  //   textColor    (string)  — Kolor tekstu
  //
  // Pola szablonów: adresy URL mogą zawierać znaczniki {{…}}, które
  // zostaną dynamicznie zastąpione kontekstem Qlik Sense w momencie kliknięcia:
  //   {{userDirectory}} — Katalog użytkownika (np. "CORP")
  //   {{userId}}        — Identyfikator użytkownika (np. "jsmith")
  //   {{appId}}         — GUID bieżącej aplikacji
  //   {{sheetId}}       — ID bieżącego arkusza
  // Zobacz docs/template-fields.md po pełną dokumentację.
  //
  menuItems: [
    {
      label: 'Pomoc i dokumentacja',
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      // Kolory per pozycja (odcienie niebieskiego)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Zgłoś błąd',
      url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Kolory per pozycja (ciepłe odcienie bursztynowe)
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
      // Kolory per pozycja (odcienie zielonego)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

  // --------------------------------------------------------------------------
  // Zaawansowane / ustawienia wstrzykiwania (rzadko wymagają zmian)
  // --------------------------------------------------------------------------

  /** Selektor CSS kontenera paska narzędzi do wstrzyknięcia */
  // anchorSelector: '#top-bar-right-side',

  /** Interwał pollingu w milisekundach podczas renderowania paska narzędzi */
  // pollInterval: 500,

  /** Maksymalny czas oczekiwania w milisekundach przed rezygnacją */
  // timeout: 30000,

  /** Ustaw na true, aby włączyć logowanie debugowania w konsoli */
  debug: false,
};
