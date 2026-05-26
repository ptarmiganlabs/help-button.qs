const replace = require('@rollup/plugin-replace');
const pkg = require('./package.json');
const { buildDateString } = require('./scripts/build-date.cjs');

const BUILD_DATE = buildDateString();

module.exports = {
    build: {
        replacement: {
            __BUILD_TYPE__: JSON.stringify(process.env.BUILD_TYPE || 'development'),
            __PACKAGE_VERSION__: JSON.stringify(pkg.version),
            __BUILD_DATE__: JSON.stringify(BUILD_DATE),
        },
        rollup(config) {
            config.plugins.push(
                replace({
                    preventAssignment: true,
                    values: {
                        __BUILD_TYPE__: JSON.stringify(process.env.BUILD_TYPE || 'development'),
                        __PACKAGE_VERSION__: JSON.stringify(pkg.version),
                        __BUILD_DATE__: JSON.stringify(BUILD_DATE),
                    },
                })
            );
            return config;
        },
    },
};
