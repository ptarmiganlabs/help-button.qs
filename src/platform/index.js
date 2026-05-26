/**
 * Platform detection and adapter routing.
 *
 * Both adapters are statically imported so the Rollup UMD bundle
 * remains a single file (no dynamic code-splitting).
 */

import logger from '../util/logger';
import * as clientManaged from './client-managed';
import * as cloud from './cloud';

/**
 * Detect the current platform type from the URL.
 * This is synchronous — it does NOT fetch the Sense version.
 *
 * @returns {'client-managed' | 'cloud'} Platform type.
 */
export function detectPlatformType() {
    const url = window.location.href;
    const isCloud = /qlikcloud\.com/i.test(url) || /\.qlik\.com\/sense/i.test(url);
    return isCloud ? 'cloud' : 'client-managed';
}

/**
 * Detect the current platform, including Sense version for client-managed.
 *
 * @returns {Promise<{ type: 'client-managed' | 'cloud', version: string | null, codePath: string }>}
 */
export async function detectPlatform() {
    const type = detectPlatformType();

    if (type === 'cloud') {
        logger.info('Platform detected: Qlik Cloud');
        return { type: 'cloud', version: null, codePath: 'default' };
    }

    // Client-managed — attempt version detection
    try {
        const versionInfo = await clientManaged.getSenseVersion();
        const version = versionInfo?.version ?? null;
        const codePath = clientManaged.resolveCodePath(version);

        logger.info(
            `Platform detected: Client-managed v${version ?? 'unknown'} → code path "${codePath}"`
        );

        return { type: 'client-managed', version, codePath };
    } catch (err) {
        logger.warn('Version detection failed, using default code path:', err);
        return { type: 'client-managed', version: null, codePath: 'default' };
    }
}

/**
 * Get the platform adapter module.
 *
 * @returns {object} The platform adapter with: getToolbarAnchor, getToolbarAnchorSelector,
 *   getUserContext, injectCSS
 */
export function getPlatformAdapter() {
    const type = detectPlatformType();
    return type === 'cloud' ? cloud : clientManaged;
}
