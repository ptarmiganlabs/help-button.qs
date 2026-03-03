/**
 * Qlik Sense Help Button — Asetukset (Suomi)
 * ============================================
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
  // Pääpainike Qlik Sensen työkalupalkissa.
  // Kaikki alla olevat värit ovat oletuksena ammattimaisen sinisiä.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Ensisijainen sininen
    backgroundColorHover: '#12487c',   // Tummempi osoitettaessa
    backgroundColorActive: '#0e3b65',  // Tummin napsautettaessa
    textColor: '#ffffff',              // Valkoinen teksti ja kuvake
    borderColor: '#0e3b65',            // Hienovarainen tumma reunaviiva
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Keltainen kohdistusrengas
  },

  // --------------------------------------------------------------------------
  // Ponnahdusikkuna — otsikko ja ulkoasu
  // --------------------------------------------------------------------------

  /** Ponnahdusvalikon yläosassa näytettävä otsikko */
  popupTitle: 'Tarvitsetko apua?',

  /** Ponnahdusikkunan värit — tummansininen otsikko keltaisella tekstillä */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Tumma laivastonsininen reunaviiva
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Tumma laivastonsininen otsikko
    headerTextColor: '#ffcc33',        // Keltainen otsikkoteksti
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Valikon kohteet
  // --------------------------------------------------------------------------
  // Jokainen merkintä luo linkin ponnahdusvalikkoon.
  //
  // Ominaisuudet (kaikki valinnaisia paitsi label ja url):
  //   label        (string)  — Näyttöteksti
  //   url          (string)  — Linkin URL
  //   icon         (string)  — Yksi seuraavista: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Linkin kohde, esim. '_blank' (oletus) tai '_self'
  //   iconColor    (string)  — Kuvakkeen väri (CSS-väri)
  //   bgColor      (string)  — Kohteen taustaväri
  //   bgColorHover (string)  — Taustaväri osoitettaessa
  //   textColor    (string)  — Tekstin väri
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
      // Värit per kohde (sininen sävy)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Ilmoita virheestä',
      url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Värit per kohde (lämmin meripihkasävy)
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
      // Värit per kohde (vihreä sävy)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

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
