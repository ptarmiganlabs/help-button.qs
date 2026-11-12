/**
 * Helpers for string properties that may hold a Qlik string expression.
 *
 * Qlik stores a string property either as plain text or, when it is an
 * expression, as an object:
 *   { qStringExpression: { qExpr: "'Hello ' & Name" } }
 *
 * For a property with `expression: 'optional'`, the property panel follows
 * one rule: text that starts with `=` is an expression. It stores the
 * expression without that `=` and shows it with the `=` again. Expressions
 * written through the engine API may keep the `=` in `qExpr`; the engine
 * evaluates both forms the same way.
 *
 * The layout always carries the evaluated string, but the properties carry
 * the raw value. Code that edits properties — such as the property-panel
 * "Edit in Markdown editor" buttons — must unwrap the expression for editing
 * and wrap it again on save, or it ends up treating the object as text.
 *
 * @module util/string-expression
 */

/**
 * @typedef {object} StringPropertyText
 * @property {string} text - The editable text: the plain string, or the expression source
 *   starting with `=` (empty for an empty expression).
 * @property {boolean} supported - False when the value has a shape these helpers do not know;
 *   callers must not overwrite such a value.
 */

/**
 * Whether edited text is an expression, by the property panel's rule: it
 * starts with `=`.
 *
 * @param {string} text - The edited text.
 * @returns {boolean} True when the text is an expression.
 */
export function isExpressionText(text) {
    return text.startsWith('=');
}

/**
 * Read a string property value as editable text, the way the property panel shows it.
 *
 * @param {*} value - Raw property value from `model.getProperties()`.
 * @returns {StringPropertyText} The editable text and whether the value can be edited.
 */
export function readStringProperty(value) {
    if (value === undefined || value === null) {
        return { text: '', supported: true };
    }
    if (typeof value === 'string') {
        return { text: value, supported: true };
    }
    const qExpr = value?.qStringExpression?.qExpr;
    if (typeof qExpr === 'string') {
        // Show one leading `=`, whether or not qExpr kept it. An empty
        // expression reads as empty text, so saving it stores plain text.
        const source = qExpr.replace(/^\s*=/, '');
        return { text: source.trim() === '' ? '' : '=' + source, supported: true };
    }
    return { text: '', supported: false };
}

/**
 * Turn edited text back into a property value, by the property panel's rule:
 * text that starts with `=` is stored as an expression, without the `=`;
 * anything else is stored as plain text.
 *
 * @param {string} text - The edited text.
 * @returns {string|{ qStringExpression: { qExpr: string } }} The value to store.
 */
export function writeStringProperty(text) {
    if (isExpressionText(text)) {
        return { qStringExpression: { qExpr: text.slice(1) } };
    }
    return text;
}

/**
 * Evaluate a string expression the way Qlik evaluates it for a layout.
 *
 * Creates a temporary session object holding the expression as a string
 * property and reads the evaluated value from its layout. This follows the
 * same path as the extension's own properties, so dollar-sign expansion and
 * the current selections behave exactly as they do at runtime.
 *
 * @param {object} app - Enigma.js Doc/App object (from `useApp()`).
 * @param {string} expr - Expression source, including the leading `=`.
 * @returns {Promise<string>} The evaluated string.
 */
export async function evaluateStringExpression(app, expr) {
    if (!app || typeof app.createSessionObject !== 'function') {
        throw new Error('Qlik app not available');
    }
    const obj = await app.createSessionObject({
        qInfo: { qType: 'hbqs-md-preview' },
        value: { qStringExpression: { qExpr: expr } },
    });
    try {
        const layout = await obj.getLayout();
        const value = layout?.value;
        return value === undefined || value === null ? '' : String(value);
    } finally {
        try {
            await app.destroySessionObject(obj.id);
        } catch {
            /* the session object goes away with the session anyway */
        }
    }
}
