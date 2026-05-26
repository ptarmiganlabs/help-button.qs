/**
 * Internationalization (i18n) module for HelpButton.qs.
 *
 * Detects the Qlik UI language and provides translated default strings.
 * Property-panel values always override these defaults (empty string = use default).
 *
 * Supports a forced locale via setForceLocale() — when set to a value
 * other than 'auto', it overrides the auto-detected locale for all
 * calls to resolveText / getTranslation.
 */

import translations from './translations';
import logger from '../util/logger';

/**
 * Supported locale codes.
 *
 * @type {string[]}
 */
const SUPPORTED_LOCALES = ['en', 'sv', 'no', 'da', 'fi', 'de', 'fr', 'pl', 'es'];

/**
 * Detected locale — cached after first call to detectLocale().
 *
 * @type {string|null}
 */
let detectedLocale = null;

/**
 * Forced locale override.
 * When set to a supported code (not 'auto'), overrides auto-detection.
 *
 * @type {string}
 */
let forceLocale = 'auto';

/**
 * Set the forced locale.
 * Pass 'auto' to revert to auto-detection.
 *
 * @param {string} locale - 'auto' or a supported two-letter locale code.
 */
export function setForceLocale(locale) {
    forceLocale = locale || 'auto';
    logger.debug('Force locale set to:', forceLocale);
}

/**
 * Get the effective locale.
 *
 * Priority:
 *   1. Forced locale (if not 'auto')
 *   2. Auto-detected locale
 *
 * @returns {string} Two-letter locale code.
 */
export function getEffectiveLocale() {
    if (forceLocale && forceLocale !== 'auto' && SUPPORTED_LOCALES.includes(forceLocale)) {
        return forceLocale;
    }
    return detectLocale();
}

/**
 * Detect the current Qlik UI language.
 *
 * Detection priority:
 *   1. document.documentElement.lang attribute
 *   2. navigator.language / navigator.userLanguage
 *
 * Falls back to 'en' if detection fails or locale is unsupported.
 *
 * @returns {string} Two-letter locale code (e.g. 'en', 'sv', 'de').
 */
export function detectLocale() {
    if (detectedLocale) return detectedLocale;

    let locale = 'en';

    // Try document lang attribute (Qlik sets this in some deployments)
    const docLang = document.documentElement.lang;
    if (docLang) {
        const code = normalizeLocale(docLang);
        if (SUPPORTED_LOCALES.includes(code)) {
            locale = code;
        }
    }

    // Fallback to browser language
    if (locale === 'en' && !docLang) {
        const browserLang = navigator.language || navigator.userLanguage || '';
        const code = normalizeLocale(browserLang);
        if (SUPPORTED_LOCALES.includes(code)) {
            locale = code;
        }
    }

    detectedLocale = locale;
    logger.debug('Detected locale:', locale);
    return locale;
}

/**
 * Normalize a locale string to a two-letter code.
 * Handles formats like 'en-US', 'sv-SE', 'nb-NO', etc.
 *
 * Norwegian mapping: 'nb' and 'nn' both map to 'no'.
 *
 * @param {string} localeStr - Raw locale string.
 * @returns {string} Normalized two-letter code.
 */
function normalizeLocale(localeStr) {
    const code = (localeStr || '').split('-')[0].toLowerCase();

    // Norwegian Bokmål / Nynorsk → 'no'
    if (code === 'nb' || code === 'nn') return 'no';

    return code;
}

/**
 * Get a translated string for the given key and optional locale override.
 *
 * @param {string} key - Translation key (e.g. 'buttonLabel', 'popupTitle').
 * @param {string} [locale] - Optional locale override. Defaults to effective locale.
 * @returns {string} Translated string, or the English fallback.
 */
export function getTranslation(key, locale) {
    const loc = locale || getEffectiveLocale();
    const entry = translations[key];

    if (!entry) {
        logger.warn('Unknown translation key:', key);
        return '';
    }

    return entry[loc] || entry.en || '';
}

/**
 * Get a property value, falling back to the translated default if the
 * property is empty or undefined.
 *
 * This is the main function used by the extension: property-panel values
 * always win, but if the user leaves a field empty, we use the translated
 * default.
 *
 * @param {string} propertyValue - Value from the property panel.
 * @param {string} translationKey - Key in the translations table.
 * @param {string} [locale] - Optional locale override.
 * @returns {string} The resolved string.
 */
export function resolveText(propertyValue, translationKey, locale) {
    if (propertyValue !== undefined && propertyValue !== null && propertyValue !== '') {
        return propertyValue;
    }
    return getTranslation(translationKey, locale);
}
