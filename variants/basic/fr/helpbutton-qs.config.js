/**
 * Qlik Sense Bouton d'aide — Configuration (Français)
 * ====================================================
 * Chargez ce fichier AVANT helpbutton-qs.js pour personnaliser
 * le comportement du bouton.
 *
 * Utilisation dans client.html de Qlik Sense (ajouter avant </body>) :
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Toutes les propriétés sont facultatives. Définissez uniquement celles que
 * vous souhaitez remplacer. Les couleurs par défaut utilisent une palette
 * professionnelle bleue et jaune.
 *
 * @see README.md pour la documentation complète.
 */
window.helpButtonQsConfig = {
  // --------------------------------------------------------------------------
  // Bouton de la barre d'outils — texte et infobulle
  // --------------------------------------------------------------------------

  /** Texte affiché sur le bouton de la barre d'outils */
  buttonLabel: 'Aide',

  /** Infobulle du navigateur au survol */
  buttonTooltip: 'Ouvrir le menu d\'aide',

  /** Icône du bouton : 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Bouton de la barre d'outils — couleurs / style
  // --------------------------------------------------------------------------
  // Bouton principal dans la barre d'outils de Qlik Sense.
  // Toutes les couleurs ci-dessous sont par défaut en bleu professionnel.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Bleu primaire
    backgroundColorHover: '#12487c',   // Plus foncé au survol
    backgroundColorActive: '#0e3b65',  // Le plus foncé au clic
    textColor: '#ffffff',              // Texte et icône blancs
    borderColor: '#0e3b65',            // Bordure sombre subtile
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Anneau de focus jaune
  },

  // --------------------------------------------------------------------------
  // Popup — titre et apparence
  // --------------------------------------------------------------------------

  /** Titre en haut du menu popup */
  popupTitle: 'Besoin d\'aide ?',

  /** Couleurs du popup — en-tête bleu foncé avec texte jaune */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Bordure bleu marine foncé
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // En-tête bleu marine foncé
    headerTextColor: '#ffcc33',        // Texte d'en-tête jaune
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Éléments du menu
  // --------------------------------------------------------------------------
  // Chaque entrée crée un lien dans le menu popup.
  //
  // Propriétés (toutes facultatives sauf label et url) :
  //   label        (string)  — Texte affiché
  //   url          (string)  — URL du lien
  //   icon         (string)  — Un parmi : 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Cible du lien, ex. '_blank' (défaut) ou '_self'
  //   iconColor    (string)  — Couleur de l'icône (couleur CSS)
  //   bgColor      (string)  — Couleur d'arrière-plan de l'élément
  //   bgColorHover (string)  — Couleur d'arrière-plan au survol
  //   textColor    (string)  — Couleur du texte
  //
  // Champs de modèle : les URLs peuvent contenir des marqueurs {{…}} qui
  // seront remplacés dynamiquement au clic par le contexte Qlik Sense :
  //   {{userDirectory}} — Répertoire utilisateur (ex. "CORP")
  //   {{userId}}        — Identifiant utilisateur (ex. "jsmith")
  //   {{appId}}         — GUID de l'application en cours
  //   {{sheetId}}       — ID de la feuille en cours
  // Voir docs/template-fields.md pour la documentation complète.
  //
  menuItems: [
    {
      label: 'Aide et documentation',
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      // Couleurs par élément (tons bleus)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Signaler un bug',
      url: 'https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Couleurs par élément (tons ambrés)
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
      // Couleurs par élément (tons verts)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

  // --------------------------------------------------------------------------
  // Paramètres avancés / d'injection (rarement à modifier)
  // --------------------------------------------------------------------------

  /** Sélecteur CSS pour le conteneur de la barre d'outils à cibler */
  // anchorSelector: '#top-bar-right-side',

  /** Intervalle de polling en millisecondes lors du rendu de la barre d'outils */
  // pollInterval: 500,

  /** Temps d'attente maximum en millisecondes avant abandon */
  // timeout: 30000,

  /** Mettre à true pour activer la journalisation de débogage en console */
  debug: false,
};
