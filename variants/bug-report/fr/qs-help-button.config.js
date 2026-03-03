/**
 * Qlik Sense Bouton d'aide (Variante rapport de bug) — Configuration (Français)
 * ===============================================================================
 * Chargez ce fichier AVANT qs-help-button.js pour personnaliser le comportement
 * du bouton.
 *
 * Utilisation dans client.html de Qlik Sense (ajouter avant </body>) :
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Toutes les propriétés sont facultatives. Définissez uniquement celles que
 * vous souhaitez remplacer. Les couleurs par défaut utilisent une palette
 * professionnelle bleue et jaune.
 *
 * @see README.md pour la documentation complète.
 */
window.qsHelpButtonConfig = {
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
  // Popup — titre et apparence
  // --------------------------------------------------------------------------

  /** Titre en haut du menu popup */
  popupTitle: 'Besoin d\'aide ?',

  /** Couleurs du popup — en-tête bleu marine foncé avec texte jaune */
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
  // Éléments du menu
  // --------------------------------------------------------------------------
  // Chaque entrée crée un lien dans le menu popup.
  //
  // Éléments de lien standard :
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Élément d'action rapport de bug :
  //   Définissez action: 'bugReport' au lieu de url. Un clic sur cet élément
  //   ouvre la boîte de dialogue de rapport de bug au lieu de naviguer vers une URL.
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
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Signaler un bug',
      action: 'bugReport',       // <-- Ouvre la boîte de dialogue de rapport de bug
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Paramètres du rapport de bug
  // --------------------------------------------------------------------------
  bugReport: {
    /** Titre en haut de la boîte de dialogue de rapport de bug */
    dialogTitle: 'Signaler un bug',

    /**
     * OBLIGATOIRE — L'URL vers laquelle envoyer les données JSON du rapport de bug.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** Méthode HTTP pour l'appel webhook (par défaut : POST) */
    webhookMethod: 'POST',

    /**
     * Stratégie d'authentification pour l'appel webhook.
     *
     * type: 'none'           — Pas d'authentification (se fier à la sécurité réseau)
     * type: 'header'         — Envoyer un en-tête personnalisé (ex. Authorization: Bearer …)
     * type: 'sense-session'  — Transmettre le cookie de session Qlik Sense + clé XRF
     * type: 'custom'         — Envoyer des en-têtes arbitraires depuis customHeaders
     */
    auth: {
      type: 'none',
    },

    /**
     * Quels champs de contexte collecter et afficher dans la boîte de dialogue.
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

    /** Texte indicatif pour le champ de description */
    descriptionPlaceholder: 'Décrivez le problème rencontré…',

    /** Messages de notification après envoi */
    successMessage: 'Rapport de bug envoyé avec succès !',
    errorMessage: 'Échec de l\'envoi du rapport de bug.',

    /** Libellé au-dessus du champ de description */
    descriptionLabel: 'Description *',

    /** Texte du bouton Annuler */
    cancelButtonText: 'Annuler',

    /** Texte du bouton Envoyer */
    submitButtonText: 'Envoyer',

    /** Texte du bouton Envoyer pendant l'envoi */
    submittingButtonText: 'Envoi en cours…',

    /** Texte affiché pendant le chargement des informations d'environnement */
    loadingMessage: 'Collecte des informations d\'environnement…',

    /** Libellé aria pour le bouton de fermeture (×) */
    closeDialogAriaLabel: 'Fermer la boîte de dialogue',

    /** Libellés pour chaque champ de contexte dans la boîte de dialogue. */
    fieldLabels: {
      userId: 'Identifiant',
      userName: 'Nom d\'utilisateur',
      userDirectory: 'Répertoire utilisateur',
      senseVersion: 'Version Qlik Sense',
      appId: 'ID de l\'application',
      sheetId: 'ID de la feuille',
      urlPath: 'Chemin URL',
    },
  },

  // --------------------------------------------------------------------------
  // Paramètres avancés / d'injection (rarement à modifier)
  // --------------------------------------------------------------------------

  /** Sélecteur CSS du conteneur de la barre d'outils */
  // anchorSelector: '#top-bar-right-side',

  /** Intervalle de polling en millisecondes */
  // pollInterval: 500,

  /** Temps d'attente maximum en millisecondes */
  // timeout: 30000,

  /** Mettre à true pour activer la journalisation de débogage */
  debug: false,
};
