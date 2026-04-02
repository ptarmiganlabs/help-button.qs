/**
 * Security section for the HelpButton.qs property panel.
 *
 * Lets app authors restrict which URL prefixes are permitted in embedded
 * videos and iframes within tooltip content.  An empty value (the default)
 * means all sources are allowed.  Specify comma-separated prefixes to
 * whitelist specific origins, e.g.:
 *   https://www.youtube.com/embed/, https://player.vimeo.com/video/
 *
 * @module property-panel/security-section
 */

const securitySection = {
    type: 'items',
    label: 'Security',
    items: {
        allowedUriPatternsHeader: {
            component: 'text',
            label: 'Restrict which URLs are permitted in embedded videos and iframes in tooltip content. Leave empty to allow all sources.',
        },
        allowedUriPatterns: {
            ref: 'security.allowedUriPatterns',
            type: 'string',
            label: 'Allowed URI prefixes',
            defaultValue: '',
            component: 'textarea',
            rows: 3,
            placeholder: 'https://www.youtube.com/embed/, https://player.vimeo.com/video/, /content/Default/',
        },
    },
};

export default securitySection;
