/**
 * Logger utility for HelpButton.qs extension.
 * Controls logging based on build type.
 */

export const BUILD_TYPE = __BUILD_TYPE__;
export const PACKAGE_VERSION = __PACKAGE_VERSION__;
export const BUILD_DATE = __BUILD_DATE__;

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
            console.log('helpbutton-qs [DEBUG]:', ...args);
        }
    },

    /**
     * Info level logging — shown in all builds.
     *
     * @param {...unknown} args - Arguments to log.
     */
    info: (...args) => {
        if (!muteAll) {
            console.log('helpbutton-qs [INFO]:', ...args);
        }
    },

    /**
     * Warning level logging — always shown.
     *
     * @param {...unknown} args - Arguments to log.
     */
    warn: (...args) => {
        if (!muteAll) {
            console.warn('helpbutton-qs [WARN]:', ...args);
        }
    },

    /**
     * Error level logging — always shown.
     *
     * @param {...unknown} args - Arguments to log.
     */
    error: (...args) => {
        console.error('helpbutton-qs [ERROR]:', ...args);
    },
};

export default logger;
