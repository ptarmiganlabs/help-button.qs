const replace = require('@rollup/plugin-replace');
const pkg = require('./package.json');

module.exports = {
    build: {
        replacement: {
            __BUILD_TYPE__: JSON.stringify(process.env.BUILD_TYPE || 'development'),
            __PACKAGE_VERSION__: JSON.stringify(pkg.version),
        },
        rollup(config) {
            config.plugins.push(
                replace({
                    preventAssignment: true,
                    values: {
                        __BUILD_TYPE__: JSON.stringify(process.env.BUILD_TYPE || 'development'),
                        __PACKAGE_VERSION__: JSON.stringify(pkg.version),
                    },
                })
            );
            return config;
        },
    },
};
