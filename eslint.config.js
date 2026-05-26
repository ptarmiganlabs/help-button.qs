import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                __BUILD_TYPE__: 'readonly',
                __PACKAGE_VERSION__: 'readonly',
                __BUILD_DATE__: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
        },
    },
    {
        ignores: ['dist/**', 'helpbutton-qs-ext/**', 'node_modules/**'],
    },
];
