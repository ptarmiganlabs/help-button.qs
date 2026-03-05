/**
 * Qlik Sense Botón de Ayuda (Variante informe de errores) — Configuración (Español)
 * ====================================================================================
 * Cargue este archivo ANTES de qs-help-button.js para personalizar el comportamiento
 * del botón.
 *
 * Uso en el archivo client.html de Qlik Sense (agregar antes de </body>):
 *   <script src="../resources/custom/qs-help-button.config.js"></script>
 *   <script src="../resources/custom/qs-help-button.js" defer></script>
 *
 * Todas las propiedades son opcionales. Establezca solo las que desee sobrescribir.
 * Los colores predeterminados utilizan una paleta profesional azul y amarilla.
 *
 * @see README.md para la documentación completa.
 */
window.qsHelpButtonConfig = {
  // --------------------------------------------------------------------------
  // Botón de la barra de herramientas — texto e información emergente
  // --------------------------------------------------------------------------

  /** Texto mostrado en el botón de la barra de herramientas */
  buttonLabel: 'Ayuda',

  /** Información emergente del navegador al pasar el cursor */
  buttonTooltip: 'Abrir menú de ayuda',

  /** Icono del botón: 'help' | 'bug' | 'info' | 'mail' | 'link' */
  buttonIcon: 'help',

  // --------------------------------------------------------------------------
  // Botón de la barra de herramientas — colores / estilo
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
  // Popup — título y apariencia
  // --------------------------------------------------------------------------

  /** Título en la parte superior del menú emergente */
  popupTitle: '¿Necesita ayuda?',

  /** Colores del popup — encabezado azul marino oscuro con texto amarillo */
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
  // Elementos del menú
  // --------------------------------------------------------------------------
  // Cada entrada crea un enlace en el menú emergente.
  //
  // Elementos de enlace estándar:
  //   label, url, icon, target, iconColor, bgColor, bgColorHover, textColor
  //
  // Elemento de acción de informe de errores:
  //   Use action: 'bugReport' en lugar de url. Al hacer clic en este elemento
  //   se abre el diálogo de informe de errores en lugar de navegar a una URL.
  //
  // Campos de plantilla: las URLs pueden contener marcadores {{…}} que
  // se reemplazarán dinámicamente al hacer clic con el contexto de Qlik Sense:
  //   {{userDirectory}} — Directorio de usuario (ej. "CORP")
  //   {{userId}}        — ID de usuario (ej. "jsmith")
  //   {{appId}}         — GUID de la aplicación actual
  //   {{sheetId}}       — ID de la hoja actual
  // Consulte docs/template-fields.md para la documentación completa.
  //
  menuItems: [
    {
      label: 'Ayuda y documentación',
      url: 'https://github.com/ptarmiganlabs/qs-help-button',
      icon: 'help',
      target: '_blank',
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Reportar un error',
      action: 'bugReport',       // <-- Abre el diálogo de informe de errores
      icon: 'bug',
      iconColor: '#b45309',
      bgColor: '#fffbeb',
      bgColorHover: '#fef3c7',
      textColor: '#78350f',
    },
  ],

  // --------------------------------------------------------------------------
  // Configuración del informe de errores
  // --------------------------------------------------------------------------
  bugReport: {
    /** Título en la parte superior del diálogo de informe de errores */
    dialogTitle: 'Reportar un error',

    /**
     * OBLIGATORIO — La URL a la que enviar los datos JSON del informe de errores.
     */
    webhookUrl: 'https://localhost:3443/api/bug-reports',

    /** Método HTTP para la llamada webhook (predeterminado: POST) */
    webhookMethod: 'POST',

    /**
     * Estrategia de autenticación para la llamada webhook.
     *
     * type: 'none'           — Sin autenticación (confiar en la seguridad de red)
     * type: 'header'         — Enviar un encabezado personalizado (ej. Authorization: Bearer …)
     * type: 'sense-session'  — Reenviar la cookie de sesión de Qlik Sense + clave XRF
     * type: 'custom'         — Enviar encabezados arbitrarios desde customHeaders
     */
    auth: {
      type: 'none',
    },

    /**
     * Qué campos de contexto recopilar y mostrar en el diálogo.
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

    /** Texto indicativo para el campo de descripción */
    descriptionPlaceholder: 'Describa el problema encontrado…',

    /** Mensajes de notificación después del envío */
    successMessage: '¡Informe de error enviado con éxito!',
    errorMessage: 'No se pudo enviar el informe de error.',

    /** Etiqueta sobre el campo de descripción */
    descriptionLabel: 'Descripción *',

    /** Texto del botón Cancelar */
    cancelButtonText: 'Cancelar',

    /** Texto del botón Enviar */
    submitButtonText: 'Enviar',

    /** Texto del botón Enviar durante el envío */
    submittingButtonText: 'Enviando…',

    /** Texto mostrado mientras se cargan las informaciones del entorno */
    loadingMessage: 'Recopilando información del entorno…',

    /** Etiqueta aria para el botón de cierre (×) */
    closeDialogAriaLabel: 'Cerrar diálogo',

    /** Etiquetas para cada campo de contexto en el diálogo. */
    fieldLabels: {
      userId: 'ID de usuario',
      userName: 'Nombre de usuario',
      userDirectory: 'Directorio de usuario',
      senseVersion: 'Versión de Qlik Sense',
      appId: 'ID de aplicación',
      sheetId: 'ID de hoja',
      urlPath: 'Ruta URL',
    },
  },

  // --------------------------------------------------------------------------
  // Configuración avanzada / de inyección (rara vez necesita cambios)
  // --------------------------------------------------------------------------

  /** Selector CSS del contenedor de la barra de herramientas */
  // anchorSelector: '#top-bar-right-side',

  /** Intervalo de sondeo en milisegundos */
  // pollInterval: 500,

  /** Tiempo máximo de espera en milisegundos */
  // timeout: 30000,

  /** Establecer a true para activar el registro de depuración */
  debug: false,
};
