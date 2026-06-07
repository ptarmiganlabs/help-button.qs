import logger from './logger';

const SUPPORTED_AUTH_STRATEGIES = new Set(['none', 'header', 'custom']);
const warnedObsoleteStrategies = new Set();

/**
 * Normalize persisted auth-strategy values to the currently supported set.
 *
 * Older layouts may still contain removed values such as `sense-session`.
 * Those should degrade explicitly to `none` and emit a warning once per
 * context/value pair instead of relying on switch fallthrough.
 *
 * @param {unknown} strategy - Raw persisted auth strategy.
 * @param {string} contextLabel - Human-readable config path for warnings.
 * @returns {'none' | 'header' | 'custom'} Normalized auth strategy.
 */
export function normalizeAuthStrategy(strategy, contextLabel) {
    const value = typeof strategy === 'string' ? strategy : 'none';

    if (SUPPORTED_AUTH_STRATEGIES.has(value)) {
        return value;
    }

    const warningKey = `${contextLabel}:${value}`;
    if (!warnedObsoleteStrategies.has(warningKey)) {
        warnedObsoleteStrategies.add(warningKey);
        logger.warn(
            `Unsupported auth strategy "${value}" encountered in ${contextLabel}; falling back to "none".`
        );
    }

    return 'none';
}
