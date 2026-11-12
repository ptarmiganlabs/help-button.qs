/**
 * Shared extension state.
 *
 * Holds references to the Nebula model and the app so that property-panel
 * button actions can persist changes and evaluate expressions via the
 * engine API.
 *
 * Set by the supernova component; read by property-panel sections.
 *
 * @module util/extension-state
 */

export const extensionState = { model: null, app: null };
