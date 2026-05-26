/**
 * Variable action handler for HelpButton.qs.
 *
 * Executes set-variable and toggle-variable actions via the Enigma.js
 * app API.  Supports two modes:
 *
 *  - **set**    – assign one or more variables to fixed values.
 *  - **toggle** – flip a variable between two values (with a safety-net default).
 */

import logger from "../util/logger";

/**
 * Execute a variable action (set or toggle).
 *
 * @param {object} app    - Enigma.js Doc/App object (from `useApp()`).
 * @param {object} config - Variable action configuration from layout.
 * @param {string} config.mode               - 'set' or 'toggle'.
 * @param {Array}  [config.variableAssignments] - Array of {variableName, variableValue} (set mode).
 * @param {string} [config.variableName]     - Variable name (toggle mode).
 * @param {string} [config.toggleValue1]     - First toggle value.
 * @param {string} [config.toggleValue2]     - Second toggle value.
 * @param {string} [config.toggleDefault]    - Fallback when current value matches neither.
 * @returns {Promise<void>}
 */
export async function executeVariableAction(app, config) {
  if (!app) {
    logger.warn("Variable action: no app object available");
    return;
  }
  if (!config) {
    logger.warn("Variable action: no config provided");
    return;
  }

  const mode = config.mode || "set";

  try {
    if (mode === "toggle") {
      await toggleVariable(app, config);
    } else {
      await setVariables(app, config);
    }
  } catch (err) {
    logger.error("Variable action failed:", err);
  }
}

// ── Set mode ────────────────────────────────────────────────────────
/**
 * Set one or more variables to specified values.
 *
 * @param {object} app    - Enigma.js Doc object.
 * @param {object} config - Variable action configuration.
 */
async function setVariables(app, config) {
  const assignments = config.variableAssignments || [];
  if (assignments.length === 0) {
    logger.debug("Variable action (set): no assignments defined");
    return;
  }

  for (const assignment of assignments) {
    const name = (assignment.variableName || "").trim();
    const value =
      assignment.variableValue != null ? String(assignment.variableValue) : "";
    if (!name) {
      continue;
    }

    await setVariableValue(app, name, value);
  }
}

// ── Toggle mode ─────────────────────────────────────────────────────
/**
 * Toggle a variable between two values, with a safety-net default.
 *
 * Logic:
 *  1. Read the current value.
 *  2. If it equals toggleValue1 → set to toggleValue2.
 *  3. If it equals toggleValue2 → set to toggleValue1.
 *  4. Otherwise → set to toggleDefault (falls back to toggleValue1).
 *
 * @param {object} app    - Enigma.js Doc object.
 * @param {object} config - Variable action configuration.
 */
async function toggleVariable(app, config) {
  const name = (config.variableName || "").trim();
  if (!name) {
    logger.debug("Variable action (toggle): no variable name defined");
    return;
  }

  const val1 = config.toggleValue1 != null ? String(config.toggleValue1) : "";
  const val2 = config.toggleValue2 != null ? String(config.toggleValue2) : "";
  const fallback =
    config.toggleDefault != null ? String(config.toggleDefault).trim() : "";
  const defaultValue = fallback || val1;

  const variable = await getVariableHandle(app, name);
  if (!variable) return;

  const layout = await variable.getLayout();
  const current = layout.qText != null ? String(layout.qText).trim() : "";

  let newValue;
  if (current === val1) {
    newValue = val2;
  } else if (current === val2) {
    newValue = val1;
  } else {
    newValue = defaultValue;
  }

  logger.debug(`Variable toggle: ${name} "${current}" → "${newValue}"`);
  await variable.setStringValue(newValue);
}

// ── Helpers ─────────────────────────────────────────────────────────
/**
 * Get a variable handle by name.  Returns null and logs a warning
 * when the variable does not exist.
 *
 * @param {object} app  - Enigma.js Doc object.
 * @param {string} name - Variable name.
 * @returns {Promise<object|null>} Enigma.js variable proxy, or null.
 */
async function getVariableHandle(app, name) {
  try {
    return await app.getVariableByName(name);
  } catch (err) {
    logger.warn(`Variable "${name}" not found:`, err);
    return null;
  }
}

/**
 * Set a single variable to a string value.
 *
 * @param {object} app   - Enigma.js Doc object.
 * @param {string} name  - Variable name.
 * @param {string} value - Value to set.
 */
async function setVariableValue(app, name, value) {
  const variable = await getVariableHandle(app, name);
  if (!variable) return;
  logger.debug(`Variable set: ${name} = "${value}"`);
  await variable.setStringValue(value);
}
