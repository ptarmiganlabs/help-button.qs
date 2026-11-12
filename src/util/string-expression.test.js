import { describe, expect, it, vi } from 'vitest';

import {
    evaluateStringExpression,
    readStringProperty,
    writeStringProperty,
} from './string-expression.js';

const EXPR = "='Hello ' & Only(Name)";

describe('readStringProperty', () => {
    it('reads plain text as is', () => {
        expect(readStringProperty('**Hi**')).toEqual({
            text: '**Hi**',
            isExpression: false,
            supported: true,
        });
    });

    it('reads a missing value as empty text', () => {
        expect(readStringProperty(undefined)).toEqual({
            text: '',
            isExpression: false,
            supported: true,
        });
        expect(readStringProperty(null)).toEqual({
            text: '',
            isExpression: false,
            supported: true,
        });
    });

    it('unwraps a string expression to its source', () => {
        expect(readStringProperty({ qStringExpression: { qExpr: EXPR } })).toEqual({
            text: EXPR,
            isExpression: true,
            supported: true,
        });
    });

    it('adds the = to an expression stored without it, as the panel does', () => {
        expect(readStringProperty({ qStringExpression: { qExpr: EXPR.slice(1) } })).toEqual({
            text: EXPR,
            isExpression: true,
            supported: true,
        });
    });

    it('flags any other shape as unsupported', () => {
        for (const value of [
            42,
            {},
            { qStringExpression: {} },
            { qValueExpression: { qExpr: '=1' } },
        ]) {
            expect(readStringProperty(value)).toEqual({
                text: '',
                isExpression: false,
                supported: false,
            });
        }
    });
});

describe('writeStringProperty', () => {
    it('stores text starting with = as an expression, without the =', () => {
        expect(writeStringProperty(EXPR + " & '!'")).toEqual({
            qStringExpression: { qExpr: EXPR.slice(1) + " & '!'" },
        });
    });

    it('stores any other text as plain text', () => {
        expect(writeStringProperty('Just text')).toBe('Just text');
        expect(writeStringProperty('')).toBe('');
    });

    it('round-trips an expression the panel stored', () => {
        const stored = { qStringExpression: { qExpr: EXPR.slice(1) } };
        expect(writeStringProperty(readStringProperty(stored).text)).toEqual(stored);
    });
});

describe('evaluateStringExpression', () => {
    /**
     * Build a fake enigma app whose session object returns the given layout.
     *
     * @param {Function} getLayout - The session object's getLayout implementation.
     * @returns {object} Fake app with spied methods.
     */
    function fakeApp(getLayout) {
        const obj = { id: 'tmp-1', getLayout: vi.fn(getLayout) };
        return {
            obj,
            createSessionObject: vi.fn(async () => obj),
            destroySessionObject: vi.fn(async () => {}),
        };
    }

    it('returns the evaluated value and destroys the session object', async () => {
        const app = fakeApp(async () => ({ value: 'Hello World' }));

        await expect(evaluateStringExpression(app, EXPR)).resolves.toBe('Hello World');

        expect(app.createSessionObject).toHaveBeenCalledWith({
            qInfo: { qType: 'hbqs-md-preview' },
            value: { qStringExpression: { qExpr: EXPR } },
        });
        expect(app.destroySessionObject).toHaveBeenCalledWith('tmp-1');
    });

    it('returns empty text when the layout has no value', async () => {
        const app = fakeApp(async () => ({}));
        await expect(evaluateStringExpression(app, EXPR)).resolves.toBe('');
    });

    it('destroys the session object when evaluation fails', async () => {
        const app = fakeApp(async () => {
            throw new Error('engine said no');
        });

        await expect(evaluateStringExpression(app, EXPR)).rejects.toThrow('engine said no');
        expect(app.destroySessionObject).toHaveBeenCalledWith('tmp-1');
    });

    it('rejects when there is no app', async () => {
        await expect(evaluateStringExpression(null, EXPR)).rejects.toThrow(
            'Qlik app not available'
        );
    });
});
