/**
 * Shared extension state.
 *
 * Holds a reference to the Nebula model so that property-panel button
 * actions can persist changes via the engine API.
 *
 * Set by the supernova component; read by property-panel sections.
 *
 * @module util/extension-state
 */

export const extensionState = { model: null };
