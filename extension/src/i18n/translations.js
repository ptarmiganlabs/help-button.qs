/**
 * Translation strings for all supported languages.
 *
 * Each key maps to an object of locale → translated string.
 * Supported locales: en, sv, no, da, fi, de, fr, pl, es
 */

const translations = {
    // Toolbar button
    buttonLabel: {
        en: 'Help',
        sv: 'Hjälp',
        no: 'Hjelp',
        da: 'Hjælp',
        fi: 'Ohje',
        de: 'Hilfe',
        fr: 'Aide',
        pl: 'Pomoc',
        es: 'Ayuda',
    },

    buttonTooltip: {
        en: 'Open help menu',
        sv: 'Öppna hjälpmenyn',
        no: 'Åpne hjelpemenyen',
        da: 'Åbn hjælpemenuen',
        fi: 'Avaa ohjevalikko',
        de: 'Hilfemenü öffnen',
        fr: "Ouvrir le menu d'aide",
        pl: 'Otwórz menu pomocy',
        es: 'Abrir menú de ayuda',
    },

    // Popup
    popupTitle: {
        en: 'Need assistance?',
        sv: 'Hur kan vi hjälpa dig?',
        no: 'Trenger du hjelp?',
        da: 'Brug for hjælp?',
        fi: 'Tarvitsetko apua?',
        de: 'Brauchen Sie Hilfe?',
        fr: "Besoin d'aide\u00a0?",
        pl: 'Potrzebujesz pomocy?',
        es: '¿Necesitas ayuda?',
    },

    // Bug-report dialog
    bugReportTitle: {
        en: 'Report a Bug',
        sv: 'Rapportera ett fel',
        no: 'Rapporter en feil',
        da: 'Rapportér en fejl',
        fi: 'Ilmoita virheestä',
        de: 'Fehler melden',
        fr: 'Signaler un bug',
        pl: 'Zgłoś błąd',
        es: 'Reportar un error',
    },

    bugReportDescriptionLabel: {
        en: 'Description',
        sv: 'Beskrivning',
        no: 'Beskrivelse',
        da: 'Beskrivelse',
        fi: 'Kuvaus',
        de: 'Beschreibung',
        fr: 'Description',
        pl: 'Opis',
        es: 'Descripción',
    },

    bugReportDescriptionPlaceholder: {
        en: 'Describe the issue you encountered…',
        sv: 'Beskriv problemet du stötte på…',
        no: 'Beskriv problemet du opplevde…',
        da: 'Beskriv det problem, du oplevede…',
        fi: 'Kuvaile kohtaamaasi ongelmaa…',
        de: 'Beschreiben Sie das aufgetretene Problem…',
        fr: 'Décrivez le problème rencontré…',
        pl: 'Opisz napotkany problem…',
        es: 'Describe el problema que encontraste…',
    },

    bugReportSubmit: {
        en: 'Submit',
        sv: 'Skicka',
        no: 'Send inn',
        da: 'Indsend',
        fi: 'Lähetä',
        de: 'Absenden',
        fr: 'Envoyer',
        pl: 'Wyślij',
        es: 'Enviar',
    },

    bugReportCancel: {
        en: 'Cancel',
        sv: 'Avbryt',
        no: 'Avbryt',
        da: 'Annuller',
        fi: 'Peruuta',
        de: 'Abbrechen',
        fr: 'Annuler',
        pl: 'Anuluj',
        es: 'Cancelar',
    },

    bugReportSuccessMessage: {
        en: 'Bug report submitted successfully!',
        sv: 'Felrapporten har skickats!',
        no: 'Feilrapporten ble sendt!',
        da: 'Fejlrapporten er indsendt!',
        fi: 'Virheraportti lähetetty onnistuneesti!',
        de: 'Fehlerbericht erfolgreich gesendet!',
        fr: 'Rapport de bug envoyé avec succès\u00a0!',
        pl: 'Zgłoszenie błędu wysłane pomyślnie!',
        es: '¡Informe de error enviado correctamente!',
    },

    bugReportErrorMessage: {
        en: 'Failed to submit bug report. Please try again.',
        sv: 'Det gick inte att skicka felrapporten. Försök igen.',
        no: 'Kunne ikke sende feilrapporten. Prøv igjen.',
        da: 'Fejlrapporten kunne ikke indsendes. Prøv igen.',
        fi: 'Virheraportin lähettäminen epäonnistui. Yritä uudelleen.',
        de: 'Fehlerbericht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
        fr: "Échec de l'envoi du rapport de bug. Veuillez réessayer.",
        pl: 'Nie udało się wysłać zgłoszenia błędu. Spróbuj ponownie.',
        es: 'No se pudo enviar el informe de error. Inténtalo de nuevo.',
    },

    bugReportContextHeader: {
        en: 'Context (auto-collected)',
        sv: 'Kontext (automatiskt insamlad)',
        no: 'Kontekst (automatisk innsamlet)',
        da: 'Kontekst (automatisk indsamlet)',
        fi: 'Konteksti (automaattisesti kerätty)',
        de: 'Kontext (automatisch erfasst)',
        fr: 'Contexte (collecté automatiquement)',
        pl: 'Kontekst (zebrany automatycznie)',
        es: 'Contexto (recopilado automáticamente)',
    },

    bugReportLoadingMessage: {
        en: 'Gathering environment info…',
        sv: 'Samlar in miljöinformation…',
        no: 'Samler inn miljøinformasjon…',
        da: 'Indsamler miljøoplysninger…',
        fi: 'Kerätään ympäristötietoja…',
        de: 'Umgebungsinformationen werden erfasst…',
        fr: "Collecte des informations d'environnement…",
        pl: 'Zbieranie informacji o środowisku…',
        es: 'Recopilando información del entorno…',
    },

    // Edit mode placeholder
    editPlaceholderTitle: {
        en: 'HelpButton.qs',
        sv: 'HelpButton.qs',
        no: 'HelpButton.qs',
        da: 'HelpButton.qs',
        fi: 'HelpButton.qs',
        de: 'HelpButton.qs',
        fr: 'HelpButton.qs',
        pl: 'HelpButton.qs',
        es: 'HelpButton.qs',
    },

    editPlaceholderDescription: {
        en: 'Injects a help button into the toolbar. Configure menu items in the property panel.',
        sv: 'Injicerar en hjälpknapp i verktygsfältet. Konfigurera menyalternativ i egenskapspanelen.',
        no: 'Injiserer en hjelpeknapp i verktøylinjen. Konfigurer menyvalg i egenskapspanelet.',
        da: 'Indsætter en hjælpeknap i værktøjslinjen. Konfigurer menupunkter i egenskabspanelet.',
        fi: 'Lisää ohjepainikkeen työkalupalkkiin. Määritä valikon kohdat ominaisuuspaneelissa.',
        de: 'Fügt eine Hilfe-Schaltfläche in die Symbolleiste ein. Menüeinträge im Eigenschaftspanel konfigurieren.',
        fr: "Injecte un bouton d'aide dans la barre d'outils. Configurez les éléments du menu dans le panneau de propriétés.",
        pl: 'Dodaje przycisk pomocy na pasku narzędzi. Skonfiguruj elementy menu w panelu właściwości.',
        es: 'Inyecta un botón de ayuda en la barra de herramientas. Configura los elementos del menú en el panel de propiedades.',
    },

    // Analysis mode placeholder
    analysisPlaceholder: {
        en: 'Help button active in toolbar',
        sv: 'Hjälpknapp aktiv i verktygsfältet',
        no: 'Hjelpeknapp aktiv i verktøylinjen',
        da: 'Hjælpeknap aktiv i værktøjslinjen',
        fi: 'Ohjepainike aktiivinen työkalupalkissa',
        de: 'Hilfe-Schaltfläche aktiv in der Symbolleiste',
        fr: "Bouton d'aide actif dans la barre d'outils",
        pl: 'Przycisk pomocy aktywny na pasku narzędzi',
        es: 'Botón de ayuda activo en la barra de herramientas',
    },
};

export default translations;
