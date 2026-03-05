/**
 * Logger utility for qs-help-button extension.
 * Controls logging based on build type.
 */

export const BUILD_TYPE = __BUILD_TYPE__;
export const PACKAGE_VERSION = __PACKAGE_VERSION__;

const IS_PRODUCTION = BUILD_TYPE === 'production';

let muteAll = false;

const logger = {
    /**
     * Sets whether all logging should be suppressed.
     *
     * @param {boolean} value - True to suppress all logs.
     */
    setMuteAll: (value) => {
        muteAll = !!value;
    },

    /**
     * Debug level logging — only shown in development builds.
     *
     * @param {...unknown} args - Arguments to log.
     */
    debug: (...args) => {
        if (!muteAll && !IS_PRODUCTION) {
            console.log('qs-help-button [DEBUG]:', ...args);
        }
    },

    /**
     * Info level logging — shown in all builds.
     *
     * @param {...unknown} args - Arguments to log.
     */
    info: (...args) => {
        if (!muteAll) {
            console.log('qs-help-button [INFO]:', ...args);
        }
    },

    /**
     * Warning level logging — always shown.
     *
     * @param {...unknown} args - Arguments to log.
     */
    warn: (...args) => {
        if (!muteAll) {
            console.warn('qs-help-button [WARN]:', ...args);
        }
    },

    /**
     * Error level logging — always shown.
     *
     * @param {...unknown} args - Arguments to log.
     */
    error: (...args) => {
        console.error('qs-help-button [ERROR]:', ...args);
    },
};

export default logger;
