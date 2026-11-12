/**
 * Helpers for string properties that may hold a Qlik string expression.
 *
 * Qlik stores a string property either as plain text or, when it is an
 * expression, as an object:
 *   { qStringExpression: { qExpr: "='Hello ' & Name" } }
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
 * @property {string} text - The editable text: the plain string, or the expression source.
 * @property {boolean} isExpression - True when the property is stored as a string expression.
 * @property {boolean} supported - False when the value has a shape these helpers do not know;
 *   callers must not overwrite such a value.
 */

/**
 * Read a string property value as editable text.
 *
 * @param {*} value - Raw property value from `model.getProperties()`.
 * @returns {StringPropertyText} The editable text and how the value was stored.
 */
export function readStringProperty(value) {
    if (value === undefined || value === null) {
        return { text: '', isExpression: false, supported: true };
    }
    if (typeof value === 'string') {
        return { text: value, isExpression: false, supported: true };
    }
    const qExpr = value?.qStringExpression?.qExpr;
    if (typeof qExpr === 'string') {
        return { text: qExpr, isExpression: true, supported: true };
    }
    return { text: '', isExpression: false, supported: false };
}

/**
 * Turn edited text back into a property value, keeping the form the value had.
 *
 * An expression stays an expression as long as the text still starts with
 * `=`; removing the `=` turns it into plain text. Plain text always stays
 * plain text, even when it starts with `=`.
 *
 * @param {string} text - The edited text.
 * @param {boolean} wasExpression - Whether the value was stored as a string expression.
 * @returns {string|{ qStringExpression: { qExpr: string } }} The value to store.
 */
export function writeStringProperty(text, wasExpression) {
    if (wasExpression && text.startsWith('=')) {
        return { qStringExpression: { qExpr: text } };
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
