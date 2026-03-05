/**
 * Qlik Sense Botón de Ayuda — Configuración (Español)
 * ====================================================
 * Cargue este archivo ANTES de helpbutton-qs.js para personalizar
 * el comportamiento del botón.
 *
 * Uso en el archivo client.html de Qlik Sense (agregar antes de </body>):
 *   <script src="../resources/custom/helpbutton-qs.config.js"></script>
 *   <script src="../resources/custom/helpbutton-qs.js" defer></script>
 *
 * Todas las propiedades son opcionales. Establezca solo las que desee
 * sobrescribir. Los colores predeterminados utilizan una paleta profesional
 * azul y amarilla.
 *
 * @see README.md para la documentación completa.
 */
window.helpButtonQsConfig = {
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
  // Botón principal en la barra de herramientas de Qlik Sense.
  // Todos los colores siguientes son azul profesional por defecto.
  buttonStyle: {
    backgroundColor: '#165a9b',        // Azul primario
    backgroundColorHover: '#12487c',   // Más oscuro al pasar el cursor
    backgroundColorActive: '#0e3b65',  // El más oscuro al hacer clic
    textColor: '#ffffff',              // Texto e icono blancos
    borderColor: '#0e3b65',            // Borde oscuro sutil
    borderRadius: '4px',
    focusOutlineColor: 'rgba(255, 204, 51, 0.6)', // Anillo de enfoque amarillo
  },

  // --------------------------------------------------------------------------
  // Popup — título y apariencia
  // --------------------------------------------------------------------------

  /** Título en la parte superior del menú emergente */
  popupTitle: '¿Necesita ayuda?',

  /** Colores del popup — encabezado azul marino oscuro con texto amarillo */
  popupStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#0c3256',            // Borde azul marino oscuro
    borderRadius: '8px',
    headerBackgroundColor: '#0c3256',  // Encabezado azul marino oscuro
    headerTextColor: '#ffcc33',        // Texto de encabezado amarillo
    separatorColor: '#e0e0e0',
    shadowColor: 'rgba(12, 50, 86, 0.25)',
  },

  // --------------------------------------------------------------------------
  // Elementos del menú
  // --------------------------------------------------------------------------
  // Cada entrada crea un enlace en el menú emergente.
  //
  // Propiedades (todas opcionales excepto label y url):
  //   label        (string)  — Texto a mostrar
  //   url          (string)  — URL del enlace
  //   icon         (string)  — Uno de: 'help', 'bug', 'info', 'mail', 'link'
  //   target       (string)  — Destino del enlace, ej. '_blank' (predeterminado) o '_self'
  //   iconColor    (string)  — Color del icono (color CSS)
  //   bgColor      (string)  — Color de fondo del elemento
  //   bgColorHover (string)  — Color de fondo al pasar el cursor
  //   textColor    (string)  — Color del texto
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
      url: 'https://github.com/ptarmiganlabs/help-button.qs',
      icon: 'help',
      target: '_blank',
      // Colores por elemento (tonos azules)
      iconColor: '#165a9b',
      bgColor: '#f0f6fc',
      bgColorHover: '#dbeafe',
      textColor: '#0c3256',
    },
    {
      label: 'Reportar un error',
      url: 'https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose',
      icon: 'bug',
      target: '_blank',
      // Colores por elemento (tonos ámbar cálidos)
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
      // Colores por elemento (tonos verdes)
      iconColor:    '#059669',
      bgColor:      '#ecfdf5',
      bgColorHover: '#d1fae5',
      textColor:    '#065f46',
    },
  ],

  // --------------------------------------------------------------------------
  // Configuración avanzada / de inyección (rara vez necesita cambios)
  // --------------------------------------------------------------------------

  /** Selector CSS del contenedor de la barra de herramientas a inyectar */
  // anchorSelector: '#top-bar-right-side',

  /** Intervalo de sondeo en milisegundos durante el renderizado de la barra */
  // pollInterval: 500,

  /** Tiempo máximo de espera en milisegundos antes de desistir */
  // timeout: 30000,

  /** Establecer a true para activar el registro de depuración en consola */
  debug: false,
};
