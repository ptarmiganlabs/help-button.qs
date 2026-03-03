/**
 * Qlik Sense Ohje-painike (Virheraporttiversio) — Asetukset (Suomi)
 * =====================================================================
 * Lataa tämä tiedosto ENNEN qs-help-button.js-tiedostoa mukauttaaksesi
 * painikkeen toimintaa.
 *
 * Käyttö Qlik Sensen client.html-tiedostossa (lisää ennen </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Kaikki ominaisuudet ovat valinnaisia. Aseta vain ne, jotka haluat ohittaa.
 * Oletusvärit käyttävät ammattimaista sinistä ja keltaista palettia.
 *
 * @see README.md täydellinen dokumentaatio.
 */
window.qsHelpButtonConfig = {
  // --------------------------------------------------------------------------
  // Työkalupalkin painike — teksti ja vihje
  // --------------------------------------------------------------------------

  /** Työkalupalkin painikkeessa näytettävä teksti */
  buttonLabel: 'Ohje',

  /** Selaimen vihje osoitettaessa */
  buttonTooltip: 'Avaa ohjevalikko',

  /** Työkalupalkin painikkeen kuvake: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Työkalupalkin painike — värit / tyyli
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
  // Ponnahdusikkuna — otsikko ja ulkoasu
  // --------------------------------------------------------------------------

  /** Ponnahdusvalikon yläosassa näytettävä otsikko */
  popupTitle: 'Tarvitsetko apua?',

  /** Ponnahdusikkunan värit — tummansininen otsikko keltaisella tekstillä */
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
  // Valikon kohteet
  // --------------------------------------------------------------------------
  // Jokainen merkintä luo linkin ponnahdusvalikkoon.
  //
  // Vakio linkkikohteet:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Viheraportti-toimintokohde:
  //   Aseta action: 'bugReport' url:n sijaan. Tämän kohteen napsautus
  //   avaa virheraporttidialogin navigoinnin sijaan.
  //
  // Mallikentät: URL-osoitteet voivat sisältää {{…}}-paikkamerkkejä,
  // jotka korvataan dynaamisesti napsautushetkellä Qlik Sense -kontekstilla:
  //   {{userDirectory}} — Käyttäjähakemisto (esim. "CORP")
  //   {{userId}}        — Käyttäjätunnus (esim. "jsmith")
  //   {{appId}}         — Nykyisen sovelluksen GUID
  //   {{sheetId}}       — Nykyisen taulukon tunnus
  // Katso docs/template-fields.md täydellinen dokumentaatio.
  //
  menuItems: [
    {
      label: 'Ohje ja dokumentaatio',
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Ilmoita virheestä',
      action: 'bugReport',       // <-- Avaa virheraporttidialogin
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Virheraporttiasetukset
  // --------------------------------------------------------------------------
  bugReport: {
    /** Virheraporttidialogin yläosan otsikko */
    dialogTitle: 'Ilmoita virheestä',

    /**
     * PAKOLLINEN — URL, johon virheraportin JSON-data lähetetään POST-pyynnöllä.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** HTTP-metodi webhook-kutsulle (oletus: POST) */
    webhookMethod: 'POST',

    /**
     * Todennusstrategia webhook-kutsulle.
     *
     * type: 'none'           — Ei todennusta (luota verkon turvallisuuteen)
     * type: 'header'         — Lähetä mukautettu otsikko (esim. Authorization: Bearer …)
     * type: 'sense-session'  — Välitä Qlik Sense -istuntoeväste + XRF-avain
     * type: 'custom'         — Lähetä mielivaltaisia otsikoita customHeaders-objektista
     */
    auth: {
      type: 'none',
    },

    /**
     * Mitä kontekstikenttiä kerätään ja näytetään dialogissa.
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

    /** Kuvaustekstikentän paikkamerkkiteksti */
    descriptionPlaceholder: 'Kuvaile kohtaamaasi ongelmaa…',

    /** Ilmoitusviestit lähetyksen jälkeen */
    successMessage: 'Virheraportti lähetetty onnistuneesti!',
    errorMessage: 'Virheraportin lähettäminen epäonnistui.',

    /** Kuvaustekstikentän yläpuolella oleva otsikko */
    descriptionLabel: 'Kuvaus *',

    /** Peruuta-painikkeen teksti */
    cancelButtonText: 'Peruuta',

    /** Lähetä-painikkeen teksti */
    submitButtonText: 'Lähetä',

    /** Lähetä-painikkeen teksti raportin lähetyksen aikana */
    submittingButtonText: 'Lähetetään…',

    /** Teksti joka näytetään ympäristökontekstin latautuessa */
    loadingMessage: 'Kerätään ympäristötietoja…',

    /** Sulje-painikkeen (×) aria-otsikko dialogin otsikossa */
    closeDialogAriaLabel: 'Sulje valintaikkuna',

    /** Dialogin kontekstikenttien otsikot. */
    fieldLabels: {
      userId: 'Käyttäjätunnus',
      userName: 'Käyttäjänimi',
      userDirectory: 'Käyttäjähakemisto',
      senseVersion: 'Qlik Sense -versio',
      appId: 'Sovellustunnus',
      sheetId: 'Taulukon tunnus',
      urlPath: 'URL-polku',
    },
  },

  // --------------------------------------------------------------------------
  // Lisäasetukset / injektioasetukset (harvoin tarvitsee muuttaa)
  // --------------------------------------------------------------------------

  /** CSS-valitsin työkalupalkin säilölle, johon injektoidaan */
  // anchorSelector: '#top-bar-right-side',

  /** Kyselyväli millisekunteina työkalupalkin renderöinnin aikana */
  // pollInterval: 500,

  /** Enimmäisodotusaika millisekunteina ennen luovuttamista */
  // timeout: 30000,

  /** Aseta true:ksi ottaaksesi konsolin virheenkorjauslokin käyttöön */
  debug: false,
};
