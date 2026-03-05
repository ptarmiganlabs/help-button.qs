/**
 * Qlik Sense Przycisk Pomocy (Wariant raportu błędu) — Konfiguracja (Polski)
 * ============================================================================
 * Załaduj ten plik PRZED helpbutton-qs.js, aby dostosować zachowanie przycisku.
 *
 * Użycie w pliku client.html Qlik Sense (dodaj przed </body>):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Wszystkie właściwości są opcjonalne. Ustaw tylko te, które chcesz nadpisać.
 * Domyślne kolory używają profesjonalnej niebiesko-żółtej palety.
 *
 * @see README.md pełna dokumentacja.
 */
window.helpButtonQsConfig = {
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
  // Popup — tytuł i wygląd
  // --------------------------------------------------------------------------

  /** Tytuł na górze menu popup */
  popupTitle: 'Potrzebujesz pomocy?',

  /** Kolory popup — ciemnogranatowy nagłówek z żółtym tekstem */
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
  // Pozycje menu
  // --------------------------------------------------------------------------
  // Każdy wpis tworzy link w menu popup.
  //
  // Standardowe pozycje linkowe:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Pozycja akcji raportu błędu:
  //   Ustaw action: 'bugReport' zamiast url. Kliknięcie tego elementu
  //   otwiera dialog raportu błędu zamiast nawigowania do URL.
  //
  // Pola szablonów: adresy URL mogą zawierać znaczniki {{…}}, które
  // zostaną dynamicznie zastąpione kontekstem Qlik Sense:
  //   {{userDirectory}} — Katalog użytkownika (np. "CORP")
  //   {{userId}}        — ID użytkownika (np. "jsmith")
  //   {{appId}}         — GUID bieżącej aplikacji
  //   {{sheetId}}       — ID bieżącego arkusza
  // Zobacz docs/template-fields.md po pełną dokumentację.
  //
  menuItems: [
    {
      label: 'Pomoc i dokumentacja',
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Zgłoś błąd',
      action: 'bugReport',       // <-- Otwiera dialog raportu błędu
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Ustawienia raportu błędu
  // --------------------------------------------------------------------------
  bugReport: {
    /** Tytuł na górze dialogu raportu błędu */
    dialogTitle: 'Zgłoś błąd',

    /**
     * WYMAGANE — URL, na który wysyłane są dane JSON raportu błędu.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** Metoda HTTP dla wywołania webhook (domyślnie: POST) */
    webhookMethod: 'POST',

    /**
     * Strategia uwierzytelniania dla wywołania webhook.
     *
     * type: 'none'           — Brak uwierzytelniania (polegaj na bezpieczeństwie sieci)
     * type: 'header'         — Wyślij niestandardowy nagłówek (np. Authorization: Bearer …)
     * type: 'sense-session'  — Przekaż ciasteczko sesji Qlik Sense + klucz XRF
     * type: 'custom'         — Wyślij dowolne nagłówki z obiektu customHeaders
     */
    auth: {
      type: 'none',
    },

    /**
     * Jakie pola kontekstowe zbierać i wyświetlać w dialogu.
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

    /** Tekst zastępczy dla pola opisu */
    descriptionPlaceholder: 'Opisz napotkany problem…',

    /** Komunikaty powiadomień po wysłaniu */
    successMessage: 'Raport błędu wysłany pomyślnie!',
    errorMessage: 'Nie udało się wysłać raportu błędu.',

    /** Etykieta nad polem opisu */
    descriptionLabel: 'Opis *',

    /** Tekst przycisku Anuluj */
    cancelButtonText: 'Anuluj',

    /** Tekst przycisku Wyślij */
    submitButtonText: 'Wyślij',

    /** Tekst przycisku Wyślij podczas wysyłania */
    submittingButtonText: 'Wysyłanie…',

    /** Tekst wyświetlany podczas ładowania informacji o środowisku */
    loadingMessage: 'Zbieranie informacji o środowisku…',

    /** Etykieta aria dla przycisku zamknięcia (×) */
    closeDialogAriaLabel: 'Zamknij okno dialogowe',

    /** Etykiety dla każdego pola kontekstowego w dialogu. */
    fieldLabels: {
      userId: 'ID użytkownika',
      userName: 'Nazwa użytkownika',
      userDirectory: 'Katalog użytkownika',
      senseVersion: 'Wersja Qlik Sense',
      appId: 'ID aplikacji',
      sheetId: 'ID arkusza',
      urlPath: 'Ścieżka URL',
    },
  },

  // --------------------------------------------------------------------------
  // Zaawansowane / ustawienia wstrzykiwania (rzadko wymagają zmian)
  // --------------------------------------------------------------------------

  /** Selektor CSS kontenera paska narzędzi */
  // anchorSelector: '#top-bar-right-side',

  /** Interwał pollingu w milisekundach */
  // pollInterval: 500,

  /** Maksymalny czas oczekiwania w milisekundach */
  // timeout: 30000,

  /** Ustaw na true, aby włączyć logowanie debugowania */
  debug: false,
};
